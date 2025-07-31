package com.todoc.server.domain.auth.exception;

import com.todoc.server.common.exception.base.CustomException;

public class AuthException extends CustomException {
    public AuthException(AuthErrorCode authErrorCode) {
        super(authErrorCode);
    }
}
