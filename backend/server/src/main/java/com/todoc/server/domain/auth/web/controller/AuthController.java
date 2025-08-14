package com.todoc.server.domain.auth.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.auth.exception.AuthUnAuthorizedException;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.auth.web.dto.request.LoginRequest;
import com.todoc.server.domain.auth.web.dto.response.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Response<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        // 1. 자격 검증
        SessionAuth auth = authService.authenticate(loginRequest.getLoginId(),
            loginRequest.getPassword());

        // 2. 이전 세션 폐기 후 새 세션 발급
        HttpSession old = request.getSession(false);
        if (old != null) {
            old.invalidate();
        }
        HttpSession session = request.getSession(true);

        session.setAttribute("AUTH_USER", auth);
        session.setMaxInactiveInterval(2 * 60 * 60); // 2시간(초 단위)

        return Response.from(LoginResponse.from(auth));
    }

    @GetMapping("/me")
    public Response<LoginResponse> me(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        SessionAuth auth = (session == null) ? null : (SessionAuth) session.getAttribute("AUTH_USER");

        if (auth == null){
            throw new AuthUnAuthorizedException();
        }

        return Response.from(LoginResponse.from(auth));
    }
}
