package com.todoc.server.domain.realtime.exception;

import com.todoc.server.common.exception.base.CustomException;

public class WebSocketInvalidEnvelopeException extends CustomException {
    public WebSocketInvalidEnvelopeException() {
        super(WebSocketErrorCode.WEB_SOCKET_INVALID_ENVELOPE);
    }
}
