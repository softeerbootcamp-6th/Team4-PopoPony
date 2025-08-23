package com.todoc.server.domain.realtime.repository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.script.DefaultRedisScript;

/**
 * Redis에서 실행할 Lua 스크립트 Bean 등록
 * 기능: 변화감지(최소이동/seq 가드) → 속도 계산 → EMA → moving 판정 → HSET+TTL → PUBLISH 까지 원자 실행
 */
@Configuration
public class RedisLocationScriptsConfig {

    @Bean
    public DefaultRedisScript<String> updateLocationLua() {
        DefaultRedisScript<String> script = new DefaultRedisScript<>();
        script.setResultType(String.class);
        script.setScriptText("""
             -- ============================================================================
              -- Redis Lua Script: 실시간 위치 업데이트 원자 실행 (역할별 저장/브로드캐스트)
              --   - 들어온 위치가 유의미한 변화인지 검증
              --   - 속도 계산/스무딩(EMA)과 이동 여부(moving) 판정
              --   - Redis Hash(HSET + TTL) 저장과 Pub/Sub 발행을 한 번에(원자적으로) 처리
              --
              --   - 각 역할(HELPER/PATIENT)의 최신 위치를 별도 키에 저장
              --   - 키 형식: KEYS[1] = "escort:loc:{escortId}:{role}"
              --   - Pub/Sub 채널: "escort:ch:{escortId}:{role}"
              --
              -- 인자 목록:
              --   KEYS[1] : 업데이트 대상 해시 키 (예: "escort:location:8:HELPER")
              --
              --   ARGV[1]  = lat           (number, degrees)          : 새 위도
              --   ARGV[2]  = lon           (number, degrees)          : 새 경도
              --   ARGV[3]  = ts            (number, epoch millis)     : 좌표가 찍힌 시각(클라 기준 권장)
              --   ARGV[4]  = acc           (number, meters)           : 정확도(없으면 0 또는 nil)
              --   ARGV[5]  = seq           (number, mono-increasing)  : 시퀀스(오래된 값 거르기)
              --   ARGV[6]  = alpha         (number, 0~1)              : EMA 가중치(예: 0.5)
              --   ARGV[7]  = stopThres     (number, m/s)              : ema >= stopThres ⇒ moving=1
              --   ARGV[8]  = baseMinDist   (number, meters)           : 기본 최소 이동 거리(예: 5)
              --   ARGV[9]  = ttlSeconds    (integer)                  : TTL(초). 0 이하이면 미적용
              --   ARGV[10] = escortIdStr   (string)                   : 채널명 구성용 escortId 문자열
              --   ARGV[11] = roleStr       (string)                   : 채널명 구성용 역할 문자열(HELPER/PATIENT)
              --   ARGV[12] = sessionId     (string)                   : sessionId 문자열
              --   ARGV[13] = accuracyMax   (number, meters)           : 허용 최대 정확도(0이면 비활성)
              --   ARGV[14] = maxSpeed      (number, m/s)              : 허용 최대 속도(0이면 비활성)
              --   ARGV[15] = minDt         (number, seconds)          : 허용 최소 샘플 간격(너무 촘촘하면 드롭)
              --   ARGV[16] = maxDt         (number, seconds)          : 허용 최대 샘플 간격(너무 오래되면 드롭)
              --
              -- Hash 필드 정의(저장되는 값):
              --   lat, lon, ts, acc, seq, ema, moving
              --     - ema(m/s): 속도의 지수이동평균
              --     - moving : 1(이동), 0(정지)
              -- ============================================================================

              local cjson = cjson
              local function ok(reason)   return cjson.encode({ code = 1, reason = reason }) end
              local function err(reason)  return cjson.encode({ code = 0, reason = reason }) end

              local hashKey = KEYS[1]

              -- ---------- 인자 파싱 ----------
              local lat     = tonumber(ARGV[1])
              local lon     = tonumber(ARGV[2])
              local ts      = tonumber(ARGV[3])
              local acc     = tonumber(ARGV[4])
              local seq     = tonumber(ARGV[5])
              local alpha   = tonumber(ARGV[6])
              local stop    = tonumber(ARGV[7])
              local baseD   = tonumber(ARGV[8])
              local ttl     = tonumber(ARGV[9])
              local idStr   = tostring(ARGV[10] or "")
              local roleStr = tostring(ARGV[11] or "")
              local sid     = tostring(ARGV[12] or "")
              local accMax  = tonumber(ARGV[13] or "0")
              local vMax    = tonumber(ARGV[14] or "0")
              local minDt   = tonumber(ARGV[15] or "0.2")
              local maxDt   = tonumber(ARGV[16] or "60")

              -- 필수 인자 점검 (lat/lon/ts/seq 없으면 실패)
              if not (lat and lon and ts and seq) then
                return err("bad-args")
              end

              -- 정확도 필터: 너무 나쁜 정확도는 드롭 (accMax>0 일 때만 적용)
              if accMax and accMax > 0 and acc and acc > accMax then
                return err("bad-acc")
              end

              -- ---------- 이전 상태 로드 ----------
              -- 이전 값이 없을 때를 구분하기 위해 NaN 처리 (tonumber(nil) 대신 nan 문자열 사용 후 비교)
              local prevLat = tonumber(redis.call('HGET', hashKey, 'lat'))
              local prevLon = tonumber(redis.call('HGET', hashKey, 'lon'))
              local prevTs  = tonumber(redis.call('HGET', hashKey, 'ts')  or '0')
              local prevSid = tostring(redis.call('HGET', hashKey, 'sid') or "")
              local prevSeq = tonumber(redis.call('HGET', hashKey, 'seq') or '-1')
              local ema     = tonumber(redis.call('HGET', hashKey, 'ema') or '0')

              -- 세션이 바뀌면 seq 가드 초기화
              if prevSid ~= "" and sid ~= "" and prevSid ~= sid then
                prevSeq = -1
              end

              -- 시퀀스 필터: 이전 seq보다 작거나 같으면 드롭
              if seq <= prevSeq then
                return err("stale")
              end

              -- ---------- 거리 계산 유틸 ----------
              local function rad(x) return x * 3.1415926535 / 180 end
              local function distM(lat1, lon1, lat2, lon2)
                local R = 6371000
                local dLat = rad(lat2 - lat1)
                local dLon = rad(lon2 - lon1)
                local a = math.sin(dLat/2)^2 +
                          math.cos(rad(lat1)) * math.cos(rad(lat2)) *
                          math.sin(dLon/2)^2
                return 2 * R * math.asin(math.sqrt(a))
              end

              -- ---------- 동적 최소 이동 거리(effectiveMinD) ----------
              -- 정확도가 나쁠수록(값이 클수록) 더 큰 이동만 인정하도록 가중
              local effectiveMinD = baseD or 0
              if acc and acc > 0 then
                local dyn = acc * 0.5
                if dyn > effectiveMinD then effectiveMinD = dyn end
              end

              -- 첫 삽입 여부: 이전 값이 없거나 NaN이면 첫 삽입
              local firstInsert = (prevTs == 0) or (not prevSeq or prevSeq < 0) or (prevLat == nil) or (prevLon == nil)
              -- 이번 샘플의 평균 속도(m/s). 첫 삽입이면 0에서 시작
              local v = 0

              -- ---------- 검증/필터링 ----------
              if not firstInsert then
                -- 거리/시간 계산
                local d  = distM(prevLat, prevLon, lat, lon)
                local dt = (ts - prevTs) / 1000.0

                -- 시간 역행/비정상
                if dt <= 0 then
                  return err("bad-dt")       -- 과거 시각이거나 동일 시각
                end

                -- 너무 촘촘한 샘플(스팸/노이즈)
                if dt < (minDt or 0) then
                  return err("too-fast")
                end

                -- 너무 오래된 갱신(연결 지연 등)
                if dt > (maxDt or 60) then
                  return err("too-slow")
                end

                -- 이동 거리가 너무 짧음 → GPS 오차로 판단하고 무시
                if d < (effectiveMinD or 0) then
                  return err("small-move")
                end

                -- 평균 속도 계산
                v = d / dt

                -- 비정상적으로 빠른 속도(차량/항공기 수준 이상) 차단 (vMax>0 일 때만 적용)
                if vMax and vMax > 0 and v > vMax then
                  return err("bad-speed")
                end
              end

              -- ---------- EMA 스무딩 및 이동 판정 ----------
              -- ema = alpha * v + (1 - alpha) * ema (첫 삽입이거나 ema=0이면 v로 초기화)
              if ema == 0 then
                ema = v
              else
                ema = (alpha or 0.5) * v + (1 - (alpha or 0.5)) * ema
              end

              -- 이동 여부 판정: ema >= stopThres이면 이동(1), 아니면 정지(0)
              local moving = (ema >= (stop or 0.5)) and 1 or 0

              -- ---------- 저장(HSET) + TTL ----------
              redis.call('HSET', hashKey,
                'lat', lat, 'lon', lon, 'ts', ts, 'acc', acc or 0, 'seq', seq,
                'ema', ema, 'moving', moving, 'sid', sid
              )

              -- TTL 적용(옵션): 0 이하면 미적용
              if ttl and ttl > 0 then
                redis.call('EXPIRE', hashKey, ttl)
              end

              -- ---------- Pub/Sub 브로드캐스트 ----------
              -- 채널명 구성: ARGV로 받은 값 우선, 없으면 키에서 추출 시도(후방호환)
              if idStr == "" then idStr = tostring(string.match(hashKey, ":(%w+):") or "") end
              if roleStr == "" then roleStr = tostring(string.match(hashKey, ":(%w+)$") or "") end
              local ch = "escort:ch:" .. idStr .. ":" .. roleStr

              -- 전송할 페이로드(최신 위치 정보)
              local payload = cjson.encode({
                latitude = lat,
                longitude = lon,
                timestamp = ts,
                acc = acc,
                seq = seq,
                ema = ema,
                moving = moving
              })
              redis.call('PUBLISH', ch, payload)

              -- ---------- 결과 반환 ----------
              -- 자바 List<Object> -> [1, "updated"]
              return ok("updated")
        """);
        return script;
    }
}