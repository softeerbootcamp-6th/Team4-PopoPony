package com.todoc.server.domain.auth.web;

import com.todoc.server.domain.auth.service.SessionAuth;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 프리플라이트는 인증 없이 통과
        String method = request.getMethod();
        String uri = request.getRequestURI();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        // 1) POST 요청 중 '/api/auth/login'만 인증 없이 허용
        if ("POST".equalsIgnoreCase(method) && uri.equals("/api/auth/login")) {
            return true;
        }

        // 2) Swagger, API 문서 등 화이트리스트
        if (uri.startsWith("/api/auth") || uri.startsWith("/v3/api-docs") || uri.startsWith("/swagger-ui")) {
            return true;
        }

        HttpSession session = request.getSession(false);
        SessionAuth auth = (session == null) ? null : (SessionAuth) session.getAttribute("AUTH_USER");
        if (auth == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인이 필요합니다.");
            return false;
        }

        return true;
    }
}
