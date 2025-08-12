package com.todoc.server.domain.auth.exception;

import com.todoc.server.common.exception.base.CustomException;

public class AuthUnAuthorizedException extends CustomException {
    public AuthUnAuthorizedException() {
        super(AuthErrorCode.UNAUTHORIZED);
    }
}
