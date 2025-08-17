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
        // TODO :: 추후에 진짜 Controller와 연결
        emitterManager.sendEvent(location.getEscortId(), "location", location);
    }

    @Data
    public static class LocationDto {
        private Long escortId;
        private double lat;
        private double lng;
        private double accuracy;
    }
}
