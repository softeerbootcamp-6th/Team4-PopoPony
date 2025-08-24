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

        attrs.put("role", role);
        attrs.put("escortId", escortId);
        attrs.put("sessionId", UUID.randomUUID().toString());

        // 환자는 세션/인증 정보 없어도 만남중 상태면 연결
        if (role == Role.PATIENT) {
            EscortStatus status = escortService.getById(escortId).getStatus();
            if (status != EscortStatus.MEETING) {
                res.setStatusCode(HttpStatus.FORBIDDEN); // 403 → 소켓 "아예 안 열림"
                res.getHeaders().add("X-WS-Reason", "patient-not-in-meeting");
                return false;
            }
            return true;
        }

        // 세션 인증 확인
        HttpSession session = request.getSession(false);
        if (session == null) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED);
            res.getHeaders().add("X-WS-Reason", "no-session");
            return false;
        }

        SessionAuth auth = (SessionAuth) session.getAttribute("AUTH_USER");
        long authId = auth.id();
        attrs.put("authId", authId);

        return true;
    }

    @Override public void afterHandshake(ServerHttpRequest req,
                                         ServerHttpResponse res,
                                         WebSocketHandler wsHandler,
                                         Exception ex) {}
}
