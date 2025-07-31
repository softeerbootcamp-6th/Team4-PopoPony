package com.todoc.server.common.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@JsonPropertyOrder({"code", "status", "message", "timestamp"})
public class ErrorResponse {
    private final int code;
    private final int status;
    private final String message;
    private final LocalDateTime timestamp;

    private ErrorResponse(int code, int status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public static ErrorResponse from(ResponseStatus status) {
        return new ErrorResponse(status.getCode(), status.getStatus(), status.getMessage());
    }

    public static ErrorResponse from(ResponseStatus status, String message) {
        return new ErrorResponse(status.getCode(), status.getStatus(), message);
    }

    public static ErrorResponse from(ResponseStatus status, RuntimeException e) {
        return new ErrorResponse(status.getCode(), status.getStatus(), e.getMessage());
    }
}