package com.todoc.server.domain.realtime.repository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.script.DefaultRedisScript;

/**
 * Redis에서 실행할 Lua 스크립트를 Bean으로 등록
 */
@Configuration
public class RedisLocationScriptsConfig {

    @Bean
    public DefaultRedisScript<String> updateLocationLua() {
        DefaultRedisScript<String> script = new DefaultRedisScript<>();
        script.setResultType(String.class);
        script.setScriptText("""
             -- ============================================================================
              -- Redis Lua Script: 실시간 위치 업데이트 (항상 저장 + 조건부 브로드캐스트)
              --   - 무효 샘플은 저장 이전에 즉시 드롭
              --   - 저장은 유효할 때만 수행(HSET + TTL)
              --   - Publish 트리거: first | resync | move | refresh
              --
              --   - 각 역할(HELPER/PATIENT)의 최신 위치를 별도 키에 저장
              --   - 키 형식: KEYS[1] = "escort:location:{escortId}:{role}"
              --   - Pub/Sub 채널: "escort:ch:{escortId}:{role}"
              --
              -- Hash 필드 정의(저장되는 값):
              --   lat, lon, ts, acc, seq, ema, moving
              --     - ema(m/s): 속도의 지수이동평균
              --     - moving : 1(이동), 0(정지)
              -- ============================================================================

              local cjson = cjson
              
              local function ok(reason, published)
                return cjson.encode({ code = 1, reason = reason, published = published or false })
              end
              local function err(reason)
                return cjson.encode({ code = 0, reason = reason })
              end
        
              -- ============ 유틸 ============
              local function is_blank(s)
                return s == nil or s == '' or s == 'null' or s == 'nil'
              end
              local function to_number_or_nil(s)
                if is_blank(s) then return nil end
                return tonumber(s)
              end
              local function hset_or_del(key, field, val)
                if val == nil or is_blank(val) then
                  redis.call('HDEL', key, field)
                  return nil
                else
                  redis.call('HSET', key, field, val)
                  return val
                end
              end
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
        
              -- ============ 키 ============
              local hashKey = KEYS[1]
        
              -- ============ 인자 파싱 ============
              local lat        = to_number_or_nil(ARGV[1])            -- 새 위도
              local lon        = to_number_or_nil(ARGV[2])            -- 새 경도
              local ts         = to_number_or_nil(ARGV[3])            -- 좌표가 찍힌 시각(클라이언트 기준 권장)
              local acc        = to_number_or_nil(ARGV[4]) or 0       -- 정확도(없으면 0)
              local seq        = to_number_or_nil(ARGV[5]) or 0       -- 시퀀스(0부터 1씩 증가)
        
              local alpha      = tonumber(ARGV[6])      or 0.5        -- EMA 가중치(예: 0.5)
              local stop       = tonumber(ARGV[7])      or 0.5        -- ema >= stopThres ⇒ moving=1
              local baseD      = tonumber(ARGV[8])      or 5          -- 기본 최소 이동 거리(예: 5)
              local ttl        = tonumber(ARGV[9])      or 0          -- TTL(초). 0 이하이면 미적용
              local idStr      = ARGV[10]               or ''         -- 채널명 구성용 escortId 문자열
              local roleStr    = ARGV[11]               or ''         -- 채널명 구성용 역할 문자열(HELPER/PATIENT)
              local sid        = ARGV[12]               or ''         -- sessionId 문자열
              local accMax     = tonumber(ARGV[13])     or 0          -- 허용 최대 정확도(0이면 비활성)
              local vMax       = tonumber(ARGV[14])     or 0          -- 허용 최대 속도(0이면 비활성)
              local minDt      = tonumber(ARGV[15])     or 0.2        -- 허용 최소 샘플 간격(너무 촘촘하면 드롭)
              local maxDt      = tonumber(ARGV[16])     or 60         -- 허용 최대 샘플 간격(너무 오래되면 드롭)
              local refreshSec = tonumber(ARGV[17])     or 30         -- 정지 상태 주기적 리프레시 간격
  
        
              -- 필수값 검증: lat/lon/ts/seq 있어야 함
              if not (lat and lon and ts and seq) then
                return err("bad-args")
              end
              
              -- 위경도 유효성 검증
              if (lat < -90) or (lat > 90) or (lon < -180) or (lon > 180) then
                return err("bad-coord")
              end
              
              -- 정확도 필터: 너무 나쁜 정확도는 드롭
              if accMax > 0 and acc > accMax then
                return err("bad-acc")
              end
        
              -- ============ 이전 상태 로드 ============
              local prevLat = tonumber(redis.call('HGET', hashKey, 'lat'))
              local prevLon = tonumber(redis.call('HGET', hashKey, 'lon'))
              local prevTs  = tonumber(redis.call('HGET', hashKey, 'ts')  or '0')
              local prevSid = tostring(redis.call('HGET', hashKey, 'sid') or "")
              local prevSeq = tonumber(redis.call('HGET', hashKey, 'seq') or '-1')
              local emaPrev = tonumber(redis.call('HGET', hashKey, 'ema') or '0')
        
              -- 첫 삽입 여부: 이전 값이 없거나 NaN이면 첫 삽입
              local firstInsert = (prevTs == 0) or (not prevSeq or prevSeq < 0) or (prevLat == nil) or (prevLon == nil)
        
              -- 세션 변경 시 시퀀스 가드 초기화
              if prevSid ~= "" and sid ~= "" and prevSid ~= sid then
                prevSeq = -1
              end
              
              -- 세션 변경 시 시퀀스 가드 초기화
              if seq <= prevSeq then
                return err("stale")
              end
        
              -- ============ 시간/거리/속도/발행 판단 ============
              local dt, d, v = 0, 0, 0
              local need_publish = false
              local reason = nil
        
              if firstInsert then
                need_publish = true
                reason = "first"
              else
                dt = (ts - prevTs) / 1000.0
                
                -- 시간 역행/비정상 (과거 시각이거나 동일 시각)
                if dt <= 0 then return err("bad-dt") end
                
                -- 너무 촘촘한 샘플(스팸/노이즈)
                if dt < minDt then return err("too-dense") end
        
                d = distM(prevLat, prevLon, lat, lon)
                v = (dt > 0) and (d / dt) or 0
        
                -- 비정상적으로 빠른 속도는 드롭 (저장 금지)
                if vMax > 0 and v > vMax then
                  return err("bad-speed")
                end
        
                -- resync: 재접속시 즉시 한 번 publish
                if dt > maxDt then
                  need_publish = true
                  reason = "resync"
                  emaPrev = 0
                else
                  -- effectiveMinD: 이동 중으로 인정하는 최소 이동거리
                  -- 정확도가 나쁠수록(값이 클수록) 더 큰 이동만 인정하도록 가중
                  local effectiveMinD = baseD
                  if acc and acc > 0 then
                    local dyn = acc * 0.5
                    if dyn > effectiveMinD then effectiveMinD = dyn end
                  end
        
                  -- move: 최소 이동 거리 이상 이동했으면 이동 중으로 인정하고 publish
                  if d >= effectiveMinD then
                    need_publish = true
                    reason = "move"
                    
                  -- refresh: 이동 없어도 최대 갱신 주기 경과 시 publish  
                  elseif dt >= refreshSec then
                    need_publish = true
                    reason = "refresh"
                  end
                end
              end
        
              -- ============ EMA/moving ============
              -- first: v≈0로 초기화, move: 실제 v 반영, resync/refresh: v≈0 근사
              local v_for_ema = (reason == "move") and v or 0
              local ema = emaPrev
              if ema == 0 then ema = v_for_ema
              else ema = alpha * v_for_ema + (1 - alpha) * ema
              end
              local moving = (ema >= stop) and 1 or 0
        
              -- ============ 저장 (숫자만 HSET, 없으면 HDEL) ============
              hset_or_del(hashKey, 'lat', (lat and string.format('%.7f', lat)) or nil)
              hset_or_del(hashKey, 'lon', (lon and string.format('%.7f', lon)) or nil)
              hset_or_del(hashKey, 'ts',  (ts  and tostring(ts)) or nil)
              hset_or_del(hashKey, 'acc', tostring(acc or 0))
              hset_or_del(hashKey, 'seq', tostring(seq))
              hset_or_del(hashKey, 'ema', tostring(ema))
              hset_or_del(hashKey, 'moving', tostring(moving))
              hset_or_del(hashKey, 'sid', sid)
        
              if ttl > 0 then
                redis.call('EXPIRE', hashKey, ttl)
              end
        
              -- ============ PUBLISH ============
              if need_publish then
                if idStr == "" then idStr = tostring(string.match(hashKey, ":(%w+):") or "") end
                if roleStr == "" then roleStr = tostring(string.match(hashKey, ":(%w+)$") or "") end
                local ch = "escort:ch:" .. idStr .. ":" .. roleStr
        
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
                return ok(reason, true)
              end
        
              return ok("stored", false)
        """);
        return script;
    }
}