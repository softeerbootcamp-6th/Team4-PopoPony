package com.todoc.server.domain.realtime.web.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ErrorResponse {
    private final String exception;
    private final String message;

    @Builder
    public ErrorResponse(String exception, String message) {
        this.exception = exception;
        this.message = message;
    }
}
