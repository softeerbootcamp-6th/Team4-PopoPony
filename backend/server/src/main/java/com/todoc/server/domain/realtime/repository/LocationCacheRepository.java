package com.todoc.server.domain.realtime.repository;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class LocationCacheRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void save(Long escortId, Role role, double lat, double lon, Instant timestamp) {
        String key = "escort:location:" + escortId + ":" + role.getLabel();
        Map<String, Object> location = new HashMap<>();
        location.put("lat", lat);
        location.put("lon", lon);
        location.put("timestamp", timestamp.toEpochMilli());
        redisTemplate.opsForHash().putAll(key,location);
        redisTemplate.expire(key, Duration.ofHours(12));
    }

    public Optional<LocationResponse> findLocationByEscortId(Long escortId, Role role) {
        String key = "escort:location:" + escortId + ":" + role.getLabel();
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
        if (entries == null || entries.isEmpty()) {
            return Optional.empty();
        }

        double lat = Double.parseDouble(entries.get("lat").toString());
        double lon = Double.parseDouble(entries.get("lon").toString());
        long ts = Long.parseLong(entries.get("timestamp").toString());
        Instant timestamp = Instant.ofEpochMilli(ts);

        return Optional.of(LocationResponse.builder()
                .escortId(escortId)
                .latitude(lat)
                .longitude(lon)
                .timestamp(timestamp)
                .build());
    }
}
