package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.Role;
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

    public void register(Long escortId, Role role, LocationRequest request, Instant timestamp) {
        locationCacheRepository.save(escortId, role, request.getLatitude(), request.getLongitude(), timestamp);
    }

    public LocationResponse getLatestLocation(Long escortId, Role role) {
        return locationCacheRepository.findLocationByEscortId(escortId, role).orElse(null);
    }
}
