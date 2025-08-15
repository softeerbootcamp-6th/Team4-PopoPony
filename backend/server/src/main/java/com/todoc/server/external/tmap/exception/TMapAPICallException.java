package com.todoc.server.external.tmap.exception;

import com.todoc.server.common.exception.base.CustomException;

public class TMapAPICallException extends CustomException {
    public TMapAPICallException() {
        super(TMapErrorCode.EXTERNAL_API_CALL_FAILED);
    }
}
