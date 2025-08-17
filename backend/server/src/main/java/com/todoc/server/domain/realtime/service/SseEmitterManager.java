package com.todoc.server.domain.realtime.service;

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

        // escortId에 기존 SseEmitter가 있었다면 연결 종료
        SseEmitter prevEmitter = box.getAndSet(newEmitter);
        if (prevEmitter != null) {
            safeComplete(prevEmitter);
        }

        // SseEmitter 수명주기에 따른 참조 해제
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
