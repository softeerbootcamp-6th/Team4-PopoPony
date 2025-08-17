package com.todoc.server.external.tmap.exception;

import com.todoc.server.common.exception.base.CustomException;

public class TMapParsingException extends CustomException {
    public TMapParsingException() {
        super(TMapErrorCode.RESPONSE_PARSE_FAILED);
    }
}
