package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ApplicationInvalidSelectException extends CustomException {
    public ApplicationInvalidSelectException() {
        super(EscortErrorCode.APPLICATION_INVALID_SELECT);
    }
}
