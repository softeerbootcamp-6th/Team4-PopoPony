package com.todoc.server.domain.sse.service;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class SseEmitterManager {

    // escortId 별로 단 하나의 Emitter만 보관
    private final ConcurrentHashMap<Long, AtomicReference<SseEmitter>> emitterMap = new ConcurrentHashMap<>();

    /**
     * 새 연결 등록(기존 연결이 있으면 끊고 교체)
     * */
    public SseEmitter register(Long escortId) {
        SseEmitter newEmitter = new SseEmitter(0L); // 무제한 타임아웃
        AtomicReference<SseEmitter> box = emitterMap.computeIfAbsent(escortId, k -> new AtomicReference<>());

        SseEmitter prevEmitter = box.getAndSet(newEmitter);
        if (prevEmitter != null) {
            // 동일 동행에 중복 접속 시 이전 연결 종료(의도적으로 하나만 유지)
            safeComplete(prevEmitter);
        }

        // 연결 라이프사이클에 맞춰 자동 정리
        Runnable cleanup = () -> box.compareAndSet(newEmitter, null);
        newEmitter.onCompletion(cleanup);
        newEmitter.onTimeout(cleanup);
        newEmitter.onError(t -> cleanup.run());

        return newEmitter;
    }

    /** 단일 구독자에게 이벤트 전송 */
    public void sendEvent(Long escortId, String eventName, Object data) {
        AtomicReference<SseEmitter> box = emitterMap.get(escortId);
        if (box == null)
            return;
        SseEmitter emitter = box.get();
        if (emitter == null)
            return;
        try {
            emitter.send(SseEmitter.event().name(eventName).data(data));
        } catch (IOException ex) {
            // 전송 실패 시 현재 등록된 연결이면 정리
            box.compareAndSet(emitter, null);
            safeComplete(emitter);
        }
    }

    private void safeComplete(SseEmitter emitter) {
        try { emitter.complete(); } catch (Exception ignore) {}
    }
}
