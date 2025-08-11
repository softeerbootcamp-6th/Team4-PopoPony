package com.todoc.server.domain.auth.web.dto.response;

import com.todoc.server.domain.auth.service.SessionAuth;

public record LoginResponse(Long userId, String username) {
    public static LoginResponse from(SessionAuth u) {
        return new LoginResponse(u.id(), u.loginId());
    }
}