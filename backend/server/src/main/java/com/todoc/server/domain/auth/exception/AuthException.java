package com.todoc.server.domain.auth.exception;

import com.todoc.server.common.exception.CustomException;
import com.todoc.server.common.exception.ErrorCode;

public class AuthException extends CustomException {
    public AuthException(ErrorCode errorCode) {
        super(errorCode);
    }
}
