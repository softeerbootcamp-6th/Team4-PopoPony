package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.CustomException;

public class EscortNotFoundException extends CustomException {
    public EscortNotFoundException() {
        super(EscortErrorCode.ESCORT_NOT_FOUND);
    }
}
