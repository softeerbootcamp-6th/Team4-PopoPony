package com.todoc.server.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ResponseStatus {
    SUCCESS(1000, HttpStatus.OK.value(), "Request was successful."),
    BAD_REQUEST(2000, HttpStatus.BAD_REQUEST.value(), "Invalid request."),
    NOT_FOUND(3000, HttpStatus.NOT_FOUND.value(), "No results found."),
    INTERNAL_SERVER_ERROR(4000, HttpStatus.INTERNAL_SERVER_ERROR.value(), "An error occurred on the server.");

    private final int code;
    private final int status;
    private final String message;
}
