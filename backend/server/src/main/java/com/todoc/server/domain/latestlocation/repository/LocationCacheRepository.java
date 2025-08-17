package com.todoc.server.domain.latestlocation.repository;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class LocationCacheRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void save(Long escortId, double lat, double lon) {
        String key = "escort:location:" + escortId;
        Map<String, Object> location = new HashMap<>();
        location.put("lat", lat);
        location.put("lon", lon);
        location.put("timestamp", Instant.now().toEpochMilli());
        redisTemplate.opsForHash().putAll(key,location);
        redisTemplate.expire(key, Duration.ofHours(12));
    }

    public void findLocationByEscortId(Long escortId) {
        String key = "escort:location:" + escortId;
        redisTemplate.opsForHash().entries(key);
    }

}
