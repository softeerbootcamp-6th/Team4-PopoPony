package com.todoc.server.domain.sse.service;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class SseEmitterManager {

//    // escortId별로 SSE 구독자 목록을 관리
//    private final ConcurrentHashMap<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();
//
//    public SseEmitter addEmitter(Long escortId) {
//        SseEmitter emitter = new SseEmitter(0L); // 타임아웃 없음
//        emitters.computeIfAbsent(escortId, k -> new CopyOnWriteArrayList<>()).add(emitter);
//
//        emitter.onCompletion(() -> removeEmitter(escortId, emitter));
//        emitter.onTimeout(() -> removeEmitter(escortId, emitter));
//        emitter.onError(e -> removeEmitter(escortId, emitter));
//
//        return emitter;
//    }
//
//    public void sendToEscort(Long escortId, String eventName, Object data) {
//        List<SseEmitter> emitterList = emitters.get(escortId);
//        if (emitterList == null) return;
//
//        for (SseEmitter emitter : emitterList) {
//            try {
//                emitter.send(SseEmitter.event()
//                        .name(eventName)
//                        .data(data));
//            } catch (IOException e) {
//                removeEmitter(escortId, emitter);
//            }
//        }
//    }
//
//    private void removeEmitter(Long escortId, SseEmitter emitter) {
//        List<SseEmitter> emitterList = emitters.get(escortId);
//        if (emitterList != null) {
//            emitterList.remove(emitter);
//        }
//    }


    // escortId -> 단 하나의 Emitter만 보관
    private final ConcurrentHashMap<Long, AtomicReference<SseEmitter>> emitters = new ConcurrentHashMap<>();

    /** 새 연결 등록(기존 연결이 있으면 끊고 교체) */
    public SseEmitter register(Long escortId) {
        SseEmitter newEmitter = new SseEmitter(0L); // 무제한 타임아웃
        AtomicReference<SseEmitter> ref =
                emitters.computeIfAbsent(escortId, k -> new AtomicReference<>());

        SseEmitter prev = ref.getAndSet(newEmitter);
        if (prev != null) {
            // 동일 동행에 중복 접속 시 이전 연결 종료(의도적으로 하나만 유지)
            safeComplete(prev);
        }

        // 연결 라이프사이클에 맞춰 자동 정리
        Runnable cleanup = () -> {
            // 내가 현재 등록된 emitter인 경우에만 제거(경쟁상황 대비)
            ref.compareAndSet(newEmitter, null);
        };
        newEmitter.onCompletion(cleanup);
        newEmitter.onTimeout(cleanup);
        newEmitter.onError(t -> cleanup.run());

        return newEmitter;
    }

    /** 단일 구독자에게 이벤트 전송(없으면 무시) */
    public void send(Long escortId, String eventName, Object data) {
        AtomicReference<SseEmitter> ref = emitters.get(escortId);
        if (ref == null) return;
        SseEmitter e = ref.get();
        if (e == null) return;

        try {
            e.send(SseEmitter.event().name(eventName).data(data));
        } catch (IOException ex) {
            // 전송 실패 시 현재 등록된 연결이면 정리
            ref.compareAndSet(e, null);
            safeComplete(e);
        }
    }

    private void safeComplete(SseEmitter e) {
        try { e.complete(); } catch (Exception ignore) {}
    }
}
