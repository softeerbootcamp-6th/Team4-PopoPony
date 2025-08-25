package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.realtime.repository.LocationCacheRepository;
import com.todoc.server.domain.realtime.repository.dto.LocationUpdateResult;
import com.todoc.server.domain.realtime.web.dto.request.LocationUpdateRequest;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;

@Service
@Transactional
@RequiredArgsConstructor
public class LocationService {

    private final LocationCacheRepository locationCacheRepository;

    /**
     * WebSocket을 통해 최신 위치 업데이트
     */
    public LocationUpdateResult updateLatestLocationByWebSocket(WebSocketSession session, LocationUpdateRequest request) {

        return locationCacheRepository.upsertLatestLocation(session, request);
    }

//    public void registerBySse(long escortId, Role role, LocationUpdateRequest request) {
//
//        locationCacheRepository.saveSimple(escortId, role, request);
//    }

    /**
     * 최신 위치 조회
     */
    public LocationResponse getLatestLocation(Long escortId, Role role) {
        return locationCacheRepository.findLatestLocation(escortId, role).orElse(null);
    }
}
