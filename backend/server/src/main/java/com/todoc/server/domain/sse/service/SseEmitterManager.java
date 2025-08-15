package com.todoc.server.domain.sse.service;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SseEmitterManager {

    // escortId별로 SSE 구독자 목록을 관리
    private final ConcurrentHashMap<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter addEmitter(Long escortId) {
        SseEmitter emitter = new SseEmitter(0L); // 타임아웃 없음
        emitters.computeIfAbsent(escortId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(escortId, emitter));
        emitter.onTimeout(() -> removeEmitter(escortId, emitter));
        emitter.onError(e -> removeEmitter(escortId, emitter));

        return emitter;
    }

    public void sendToEscort(Long escortId, String eventName, Object data) {
        List<SseEmitter> emitterList = emitters.get(escortId);
        if (emitterList == null) return;

        for (SseEmitter emitter : emitterList) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (IOException e) {
                removeEmitter(escortId, emitter);
            }
        }
    }

    private void removeEmitter(Long escortId, SseEmitter emitter) {
        List<SseEmitter> emitterList = emitters.get(escortId);
        if (emitterList != null) {
            emitterList.remove(emitter);
        }
    }
}
