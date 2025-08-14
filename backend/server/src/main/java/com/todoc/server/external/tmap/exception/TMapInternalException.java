package com.todoc.server.external.tmap.exception;

import com.todoc.server.common.exception.base.CustomException;

public class TMapInternalException extends CustomException {
    public TMapInternalException() {
        super(TMapErrorCode.INTERNAL_SERVER_ERROR);
    }
}
