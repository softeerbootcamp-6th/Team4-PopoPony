package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ApplicationNotFoundException extends CustomException {
    public ApplicationNotFoundException() {
        super(EscortErrorCode.APPLICATION_NOT_FOUND);
    }
}
