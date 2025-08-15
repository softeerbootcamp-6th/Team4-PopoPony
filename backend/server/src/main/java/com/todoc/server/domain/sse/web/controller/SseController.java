package com.todoc.server.domain.sse.web.controller;

import com.todoc.server.domain.sse.service.SseEmitterManager;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@Tag(name = "recruits", description = "동행 신청 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/realtime")
public class SseController {

    private final SseEmitterManager emitterManager;

    // 고객이 도우미 위치 구독
    @GetMapping(value = "/escorts/{escortId}/helper-location", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long escortId) {
        SseEmitter emitter = emitterManager.addEmitter(escortId);

        // 연결 직후 스냅샷(예: "NO_DATA") 전송
        try {
            emitter.send(SseEmitter.event()
                    .name("snapshot")
                    .data("NO_DATA"));
        } catch (Exception e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }
}
