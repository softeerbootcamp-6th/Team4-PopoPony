package com.todoc.server.domain.realtime.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RealtimeInvalidRoleException extends CustomException {
    public RealtimeInvalidRoleException() {
        super(RealtimeErrorCode.REALTIME_INVALID_ROLE);
    }
}
