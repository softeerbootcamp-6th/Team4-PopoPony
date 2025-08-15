package com.todoc.server.domain.sse.web.controller;

import com.todoc.server.domain.sse.service.SseEmitterManager;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/locations")
public class LocationController {

    private final SseEmitterManager emitterManager;

    // 도우미가 현재 위치 전송
    @PostMapping
    public void updateLocation(@RequestBody LocationDto location) {
        // 여기서 DB 저장이나 검증 로직 추가 가능
        emitterManager.sendToEscort(location.getEscortId(), "update", location);
    }

    @Data
    public static class LocationDto {
        private Long escortId;
        private double lat;
        private double lng;
        private double accuracy;
    }
}
