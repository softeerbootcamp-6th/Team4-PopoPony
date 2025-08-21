package com.todoc.server.common.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;

@Getter
@JsonPropertyOrder({"code", "status", "message", "timestamp"})
public class ErrorResponse {
    private final int code;
    private final int status;
    private final String message;
    private final String data;

    private ErrorResponse(int code, int status, String message, String data) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public static ErrorResponse from(ResponseCode responseCode) {
        return new ErrorResponse(responseCode.getCode(), responseCode.getStatus(), responseCode.getMessage(), responseCode.toString());
    }

    public static ErrorResponse from(ResponseCode responseCode, String message) {
        return new ErrorResponse(responseCode.getCode(), responseCode.getStatus(), responseCode.toString(), message);
    }

    public static ErrorResponse from(ResponseCode responseCode, RuntimeException e) {
        return new ErrorResponse(responseCode.getCode(), responseCode.getStatus(), responseCode.toString(), e.getMessage());
    }
}