package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.escort.service.EscortService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class WebSocketAuthHandshakeInterceptor implements HandshakeInterceptor {

    private final EscortService escortService;

    /**
     * WebSocket 세션 연결 전에 요청 정보 파싱 및 인증 절차 수행
     */
    @Override
    public boolean beforeHandshake(ServerHttpRequest req,
                                   ServerHttpResponse res,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attrs) {

        if (!(req instanceof ServletServerHttpRequest httpReq)) {
            res.setStatusCode(HttpStatus.BAD_REQUEST);
            res.getHeaders().add("X-WS-Reason", "not-servlet");
            return false;
        }

        HttpServletRequest request = httpReq.getServletRequest();
        String roleStr = request.getParameter("role");
        String escortStr = request.getParameter("escortId");
        if (roleStr == null || escortStr == null) {
            res.setStatusCode(HttpStatus.BAD_REQUEST);
            res.getHeaders().add("X-WS-Reason", "missing-params");
            return false;
        }

        // role 파싱
        Optional<Role> roleOpt = Role.from(roleStr.toLowerCase());
        if (roleOpt.isEmpty()) {
            res.setStatusCode(HttpStatus.BAD_REQUEST);
            res.getHeaders().add("X-WS-Reason", "bad-role");
            return false;
        }
        Role role = roleOpt.get();

        // escortId 파싱
        final Long escortId;
        try {
            escortId = Long.parseLong(escortStr);
        } catch (NumberFormatException e) {
            res.setStatusCode(HttpStatus.BAD_REQUEST);
            res.getHeaders().add("X-WS-Reason", "bad-escortId");
            return false;
        }

        // 세션 인증 확인
        HttpSession httpSession = request.getSession(false);
        if (httpSession == null) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED);
            res.getHeaders().add("X-WS-Reason", "no-session");
            return false;
        }
        Object authObj = httpSession.getAttribute("AUTH_USER");
        if (!(authObj instanceof SessionAuth auth)) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED);
            res.getHeaders().add("X-WS-Reason", "no-auth");
            return false;
        }

        // MEETING 가드: 환자는 MEETING 상태에서만 업그레이드 허용
        EscortStatus status = escortService.getById(escortId).getStatus();
        if (role == Role.PATIENT && status != EscortStatus.MEETING) {
            res.setStatusCode(HttpStatus.FORBIDDEN); // 403 → 소켓 "아예 안 열림"
            res.getHeaders().add("X-WS-Reason", "patient-not-in-meeting");
            return false;
        }

        // 이후 핸들러에서 사용할 속성 세팅
        attrs.put("authId", auth.id());
        attrs.put("role", role);
        attrs.put("escortId", escortId);
        attrs.put("sessionId", UUID.randomUUID().toString());

        return true; // 업그레이드 진행
    }

    @Override public void afterHandshake(ServerHttpRequest req,
                                         ServerHttpResponse res,
                                         WebSocketHandler wsHandler,
                                         Exception ex) {}
}
