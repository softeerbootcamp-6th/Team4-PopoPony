package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.realtime.exception.RealtimeInvalidRoleException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class WebSocketAuthHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest req,
                                   ServerHttpResponse res,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attrs) {

        if (!(req instanceof ServletServerHttpRequest httpReq)) {
            return false;
        }

        HttpServletRequest request = httpReq.getServletRequest();
        String roleStr = request.getParameter("role");
        String escortStr = request.getParameter("escortId");

        if (roleStr == null || escortStr == null) {
            return false;
        }

        Role role = Role.from(roleStr.toLowerCase())
                .orElseThrow(RealtimeInvalidRoleException::new);
        Long escortId = Long.valueOf(escortStr);

        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }

        // TODO: 인증 토큰으로 userId 등 추가
        SessionAuth auth = (SessionAuth) session.getAttribute("AUTH_USER");
        long authId = auth.id();

        attrs.put("authId", authId);
        attrs.put("role", role);
        attrs.put("escortId", escortId);

        return true;
    }

    @Override public void afterHandshake(ServerHttpRequest req,
                                         ServerHttpResponse res,
                                         WebSocketHandler wsHandler,
                                         Exception ex) {}
}
