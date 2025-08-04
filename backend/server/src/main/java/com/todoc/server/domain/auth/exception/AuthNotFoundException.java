package com.todoc.server.domain.auth.exception;

import com.todoc.server.common.exception.base.CustomException;

public class AuthNotFoundException extends CustomException {
    public AuthNotFoundException() {
        super(AuthErrorCode.NOT_FOUND);
    }
}
