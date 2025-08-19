package com.todoc.server.domain.realtime.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RealtimeAlreadyMetPatientException extends CustomException {
    public RealtimeAlreadyMetPatientException() {
        super(RealtimeErrorCode.REALTIME_ALREADY_MET_PATIENT);
    }
}
