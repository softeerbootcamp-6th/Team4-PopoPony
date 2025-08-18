package com.todoc.server.domain.realtime.service;

import com.todoc.server.domain.realtime.repository.LocationCacheRepository;
import com.todoc.server.domain.realtime.web.dto.request.LocationRequest;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
public class LocationService {

    private final LocationCacheRepository locationCacheRepository;

    public void register(Long escortId, LocationRequest request, Instant timestamp) {
        locationCacheRepository.save(escortId, request.getLatitude(), request.getLongitude(), timestamp);
    }

    public LocationResponse getLatestLocation(Long escortId) {
        return locationCacheRepository.findLocationByEscortId(escortId).orElse(null);
    }
}
