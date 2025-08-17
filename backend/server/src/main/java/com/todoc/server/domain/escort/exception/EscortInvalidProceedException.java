package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.CustomException;

public class EscortInvalidProceedException extends CustomException {
    public EscortInvalidProceedException() {
        super(EscortErrorCode.ESCORT_INVALID_PROCEED);
    }
}
