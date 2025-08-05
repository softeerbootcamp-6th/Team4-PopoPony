package com.todoc.server.common.exception.global;

import com.todoc.server.common.exception.base.ResponseCode;
import org.springframework.http.HttpStatus;

public enum CommonResponseCode implements ResponseCode {

    SUCCESS(10000, HttpStatus.OK.value(), "Success."),
    NOT_FOUND(10001, HttpStatus.NOT_FOUND.value(), "Not Found."),
    BAD_REQUEST(10002, HttpStatus.BAD_REQUEST.value(), "Invalid Request."),
    INTERNAL_SERVER_ERROR(10009, HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error.");

    private final int code;
    private final int status;
    private final String message;

    CommonResponseCode(int code, int status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public int getStatus() {
        return status;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
