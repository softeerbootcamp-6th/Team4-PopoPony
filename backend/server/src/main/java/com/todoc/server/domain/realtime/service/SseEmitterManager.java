package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.Role;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.EnumMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class SseEmitterManager {

    // escortId 별로 Role 3개의 Emitter를 보관
    private final ConcurrentHashMap<Long, EnumMap<Role, AtomicReference<SseEmitter>>> escortIdMap = new ConcurrentHashMap<>();

    /** 새 연결 등록(같은 role의 기존 연결이 있으면 끊고 교체) */
    public SseEmitter register(Long escortId, Role role) {

        SseEmitter newEmitter = new SseEmitter(0L);
        AtomicReference<SseEmitter> box = roleMap(escortId).get(role);

        // 참조를 새로운 Emitter로 교체
        SseEmitter prevEmitter = box.getAndSet(newEmitter);

        // 기존 연결이 있었으면 종료
        if (prevEmitter != null) {
            safeComplete(prevEmitter);
        }

        // 수명주기가 끝나면 콜백으로 자기 참조만 정리 (CAS로 경쟁 방지)
        Runnable cleanup = () -> box.compareAndSet(newEmitter, null);
        newEmitter.onCompletion(cleanup);
        newEmitter.onTimeout(cleanup);
        newEmitter.onError(t -> cleanup.run());

        return newEmitter;
    }

    /** escortId의 Role-Reference 맵을 가져오거나 생성 */
    private EnumMap<Role, AtomicReference<SseEmitter>> roleMap(Long escortId) {
        return escortIdMap.computeIfAbsent(escortId, k -> {
            EnumMap<Role, AtomicReference<SseEmitter>> roleMap = new EnumMap<>(Role.class);
            for (Role role : Role.values()) {
                roleMap.put(role, new AtomicReference<>());
            }
            return roleMap;
        });
    }

    /** 단일 Role에게 전송 */
    public void send(Long escortId, Role role, String eventName, Object data) {
        SseEmitter emitter = get(escortId, role);
        if (emitter == null) {
            return;
        }

        try {
            emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(data));
        } catch (IOException ex) {
            // 전송 실패 시 현재 등록된 연결이면 드랍
            AtomicReference<SseEmitter> ref = roleMap(escortId).get(role);
            if (ref.compareAndSet(emitter, null)) {
                safeComplete(emitter);
            }
        }
    }

    /** 여러 Role에게 전송 */
    public void send(Long escortId, Set<Role> roles, String eventName, Object data) {
        for (Role r : roles) {
            send(escortId, r, eventName, data);
        }
    }

    /** 현재 슬롯 연결 여부 */
    public boolean isConnected(Long escortId, Role role) {
        var roleMap = escortIdMap.get(escortId);

        return (roleMap != null) && (roleMap.get(role) != null);
    }

    /** 특정 escortId의 특정 Role Emitter 강제 종료 */
    public void close(Long escortId, Role role) {
        var roleMap = escortIdMap.get(escortId);
        if (roleMap == null) {
            return;
        }
        AtomicReference<SseEmitter> box = roleMap.get(role);
        SseEmitter emitter = box.getAndSet(null);
        if (emitter != null) {
            safeComplete(emitter);
        }
    }

    /** 특정 escortId의 모든 Role Emitter 종료 */
    public void closeAll(Long escortId) {
        var roleMap = escortIdMap.get(escortId);
        if (roleMap == null) {
            return;
        }
        for (Role role : Role.values()) {
            close(escortId, role);
        }
    }

    /** 특정 escortId의 특정 Role Emitter에 핑 */
    public void ping(Long escortId, Role role) {
        send(escortId, role, "ping", Map.of("ts", Instant.now().toString()));
    }

    /** 특정 escortId의 모든 Role Emitter에 핑 */
    public void pingAll(Long escortId) {
        for (Role role : Role.values()) {
            ping(escortId, role);
        }
    }

    /** 현재 슬롯 emitter 조회 */
    private SseEmitter get(Long escortId, Role role) {
        var roleMap = escortIdMap.get(escortId);
        if (roleMap == null) {
            return null;
        }
        return roleMap.get(role).get();
    }

    private void safeComplete(SseEmitter emitter) {
        try { emitter.complete(); } catch (Exception ignore) {}
    }
}
