package com.todoc.server.domain.realtime.service;

import com.todoc.server.domain.realtime.web.dto.request.LocationRequest;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
public class RealtimeFacadeService {

    private final LocationService locationService;
    private final SseEmitterManager emitterManager;

    /**
     * Escort에 대해 새로운 SseEmitter를 등록
     */
    public SseEmitter registerEmitter(Long escortId) {

        SseEmitter emitter = emitterManager.register(escortId);

        // 연결 직후 스냅샷 전송
        try {
            LocationResponse latestLocation = locationService.getLatestLocation(escortId);
            emitter.send(SseEmitter.event().name("location").data(latestLocation));
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
        return emitter;
    }

    /**
     * Escort의 도우미의 최근 위치 정보를 갱신
     */
    public void updateLocation(Long escortId, LocationRequest request) {

        Instant timestamp = Instant.now();
        LocationResponse location = LocationResponse.builder()
                .escortId(escortId)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .timestamp(timestamp)
                .build();
        emitterManager.sendEvent(escortId, "location", location);

        locationService.register(escortId, request, timestamp);
    }
}
