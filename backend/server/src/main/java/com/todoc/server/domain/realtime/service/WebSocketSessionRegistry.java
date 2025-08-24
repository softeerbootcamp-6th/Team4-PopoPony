package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.EnumMap;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class WebSocketSessionRegistry {

    private final ConcurrentMap<Long, EnumMap<Role, AtomicReference<WebSocketSession>>> map = new ConcurrentHashMap<>();

    /** 새 연결 등록: 같은 역할의 기존 세션이 있으면 닫고 교체 */
    public void register(Long escortId, Role role, WebSocketSession session) {
        AtomicReference<WebSocketSession> ref = getRoleMap(escortId).get(role);
        WebSocketSession prev = ref.getAndSet(session);
        if (prev != null && prev.isOpen()) {
            try {
                prev.close(CloseStatus.NORMAL);
            } catch (Exception ignore) {}
        }
    }

    /** 기존 연결 제거 */
    public void remove(Long escortId, Role role) {
        AtomicReference<WebSocketSession> ref = getRoleMap(escortId).get(role);
        WebSocketSession prev = ref.getAndSet(null);      // 현재 무엇이든 제거
        if (prev != null) {
            try { prev.close(CloseStatus.NORMAL); } catch (Exception ignore) {}
        }
    }

    /** 특정 동행 ID에 대한 Role별 session 목록 반환 */
    private EnumMap<Role, AtomicReference<WebSocketSession>> getRoleMap(Long escortId) {
        return map.computeIfAbsent(escortId, k -> {
            EnumMap<Role, AtomicReference<WebSocketSession>> roleMap = new EnumMap<>(Role.class);
            for (Role role : Role.values()) {
                roleMap.put(role, new AtomicReference<>());
            }
            return roleMap;
        });
    }

    /** 특정 동행 ID, Role에 대한 단일 session 반환 */
    public WebSocketSession getSession(Long escortId, Role role) {
        return getRoleMap(escortId).get(role).get();
    }

    /** 단일 Role에게 Envelope 전송 */
    public void sendToRole(Long escortId, Role role, Envelope envelope) {
        WebSocketSession session = getSession(escortId, role);
        if (session != null && session.isOpen()) {
            try {
                String json = JsonUtils.toJson(envelope);
                if (json != null) {
                    session.sendMessage(new TextMessage(json));
                }
            } catch (Exception ignore) {}
        }
    }

    /** 여러 Role에게 브로드캐스팅 */
    public void broadcastToRoles(Long escortId, Set<Role> roleSet, Envelope envelope) {

        for (Role role : roleSet) {
            sendToRole(escortId, role, envelope);
        }
    }

    /** 비동기 전송 */
    @Async("wsExecutor")
    public void sendToRoleAsync(Long escortId, Role role, Envelope envelope) {
        sendToRole(escortId, role, envelope);
    }

    /** 비동기 브로드캐스팅 */
    @Async("wsExecutor")
    public void broadcastToRolesAsync(Long escortId, Set<Role> roleSet, Envelope envelope) {
        for (Role role : roleSet) {
            sendToRole(escortId, role, envelope);
        }
    }

    /** 비동기 종료 */
    @Async("wsExecutor")
    public void removeAsync(Long escortId, Role role) {
        remove(escortId, role);
    }
}