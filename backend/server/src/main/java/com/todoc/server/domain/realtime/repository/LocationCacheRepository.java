package com.todoc.server.domain.realtime.repository;

import java.time.Instant;
import java.util.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.realtime.repository.dto.LocationUpdateResult;
import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.web.dto.request.LocationUpdateRequest;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Repository;
import org.springframework.web.socket.WebSocketSession;

/**
 * 역할별 최신 위치를 Redis Hash에 저장/조회
 * 키: escort:location:{escortId}:{role}
 * 필드: lat, lon, ts(epoch ms), seq(long), ema(double), moving(0|1), acc(optional)
 */
@Repository
@RequiredArgsConstructor
public class LocationCacheRepository {

    private static final Logger log = LoggerFactory.getLogger(LocationCacheRepository.class);
    private final StringRedisTemplate stringRedisTemplate;
    private final DefaultRedisScript<String> updateLocationLua;
    private final ObjectMapper objectMapper;

    // 정책 파라미터
    private static final double ALPHA = 0.5;
    private static final double STOP_THRES = 0.5;  // m/s
    private static final double BASE_MIN_DIST = 5.0; // m
    private static final int TTL_SECONDS = 3600;
    private static final double ACCURACY_MAX = 80.0; // m (0 비활성)
    private static final double MAX_SPEED = 50.0;    // m/s (0 비활성)
    private static final double MIN_DT = 0.2;        // s
    private static final double MAX_DT = 60.0;       // s
    private static final double REFRESH_SEC = 30.0;    // s

    /** Lua 기반 원자적 upsert: 변화 있을 때만 갱신 + TTL + Pub/Sub */
    public LocationUpdateResult upsertLatestLocation(WebSocketSession session, LocationUpdateRequest request) {

        Role role = (Role) session.getAttributes().get("role");
        Long escortId = (Long) session.getAttributes().get("escortId");
        String sessionId = (String) session.getAttributes().get("sessionId");

        String key = key(escortId, role);

        // Lua 인자 정의
        Object[] argv = new Object[] {
                numOrEmpty(request.getLatitude()),
                numOrEmpty(request.getLongitude()),
                epochOrNow(request.getTimestamp()),
                numOrEmpty(request.getAccuracyMeters()),
                strOrEmpty(request.getSeq()),
                String.valueOf(ALPHA), String.valueOf(STOP_THRES), String.valueOf(BASE_MIN_DIST),
                String.valueOf(TTL_SECONDS),
                String.valueOf(escortId),
                role.getLabel(),
                sessionId,
                String.valueOf(ACCURACY_MAX), String.valueOf(MAX_SPEED),
                String.valueOf(MIN_DT), String.valueOf(MAX_DT), String.valueOf(REFRESH_SEC)
        };

        try {
            // Lua 실행
            String res = stringRedisTemplate.execute(
                    updateLocationLua,
                    Collections.singletonList(key),
                    argv
            );

            if (res == null) {
                return new LocationUpdateResult(false, "no-reply");
            }

            JsonNode node = objectMapper.readTree(res);
            int code = node.path("code").asInt(0);
            String reason = node.path("reason").asText("");
            return new LocationUpdateResult(code == 1, reason);

        } catch (Exception e) {
            return new LocationUpdateResult(false, "lua-error:" + e.getMessage());
        }
    }

    /** 단순 저장: Lua 없이 바로 PUT */
//    public void saveSimple(long escortId, Role role, LocationUpdateRequest request) {
//        String k = key(escortId, role);
//        Map<String, Object> map = new HashMap<>();
//        map.put("latitude", Double.toString(request.getLatitude()));
//        map.put("longitude", Double.toString(request.getLongitude()));
//        map.put("timestamp", Long.toString(request.getTimestamp().toEpochMilli()));
//
//        stringRedisTemplate.opsForHash().putAll(k, map);
//        stringRedisTemplate.expire(k, Duration.ofSeconds(TTL_SECONDS));
//    }

    /** 최신 위치 조회 */
    public Optional<LocationResponse> findLatestLocation(long escortId, Role role) {
        String k = key(escortId, role);
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(k);
        if (entries.isEmpty()) return Optional.empty();

//        double lat = parseDouble(entries.get("lat"));
//        double lon = parseDouble(entries.get("lon"));
//        long ts = parseLong(entries.get("ts"));

        Double lat = parseNullableDouble(entries.get("lat"));
        Double lon = parseNullableDouble(entries.get("lon"));
        Long ts = parseNullableLong(entries.get("ts"));

        // 하나라도 비정상이면 스냅샷 없음으로 간주
        if (lat == null || lon == null || ts == null) {
            log.warn("Bad cache data for {}: lat={}, lon={}, ts={}", k, entries.get("lat"), entries.get("lon"), entries.get("ts"));
            return Optional.empty();
        }

        return Optional.of(
                LocationResponse.builder()
                        .latitude(lat)
                        .longitude(lon)
                        .timestamp(Instant.ofEpochMilli(ts))
                        .build()
        );
    }

    /** 속도/상태 정보 포함한 최신 위치 조회 */
//    public Optional<LocationRichResponse> findLatestLocationRich(long escortId, Role role) {
//        String k = key(escortId, role);
//        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(k);
//        if (entries.isEmpty()) return Optional.empty();
//
//        return Optional.of(LocationRichResponse.builder()
//                        .escortId(escortId)
//                        .latitude(parseDouble(entries.get("lat")))
//                        .longitude(parseDouble(entries.get("lon")))
//                        .timestamp(Instant.ofEpochMilli(parseLong(entries.get("ts"))))
//                        .seq(optLong(entries.get("seq")))
//                        .speedEma(optDouble(entries.get("ema")))
//                        .moving(optInt(entries.get("moving")))
//                        .build()
//        );
//    }
  
    private static String key(long escortId, Role role) {
        return "escort:location:" + escortId + ":" + role.getLabel();
    }

    //private static double parseDouble(Object v) { return Double.parseDouble(String.valueOf(v)); }
    //private static long parseLong(Object v) { return Long.parseLong(String.valueOf(v)); }

    private static Double parseNullableDouble(Object v) {
        if (v == null) return null;
        String s = v.toString().trim();
        if (s.isEmpty() || s.equalsIgnoreCase("null")) return null;
        try { return Double.parseDouble(s); } catch (NumberFormatException e) { return null; }
    }


    private static Long parseNullableLong(Object v) {
        if (v == null) return null;
        String s = v.toString().trim();
        if (s.isEmpty() || s.equalsIgnoreCase("null")) return null;
        if (!s.chars().allMatch(Character::isDigit)) return null;
        try { return Long.parseLong(s); } catch (NumberFormatException e) { return null; }
    }

    private static String numOrEmpty(Double v) {
        return v == null ? "" : v.toString();
    }
    private static String longOrEmpty(Long v) {
        return v == null ? "" : v.toString();
    }
    private static String strOrEmpty(Object v) {
        return v == null ? "" : v.toString();
    }
    private static String epochOrNow(Instant ts) {
        return Long.toString(ts == null ? System.currentTimeMillis() : ts.toEpochMilli());
    }

    private static double parseDouble(Object v) { return Double.parseDouble(String.valueOf(v)); }
    private static long parseLong(Object v) { return Long.parseLong(String.valueOf(v)); }

}
