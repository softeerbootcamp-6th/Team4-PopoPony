package com.todoc.server.common.exception.base;

public abstract class CustomException extends RuntimeException {

    private final ResponseCode responseCode;

    public CustomException(ResponseCode responseCode) {
        super(responseCode.getMessage());
        this.responseCode = responseCode;
    }

    public ResponseCode getResponseStatus() {
        return responseCode;
    }
}
