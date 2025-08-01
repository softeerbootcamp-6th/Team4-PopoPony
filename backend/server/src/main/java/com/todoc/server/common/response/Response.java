package com.todoc.server.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;

import static com.todoc.server.common.exception.global.CommonResponseCode.SUCCESS;

@Getter
@JsonPropertyOrder({"code", "status", "message", "data"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response<T> {
    private final int code;
    private final int status;
    private final String message;
    private final T data;

    private Response(int code, int status, String message, T data) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public static <T> Response<T> from() {
        return new Response<>(SUCCESS.getCode(), SUCCESS.getStatus(), SUCCESS.getMessage(), null);
    }

    public static <T> Response<T> from(String message) {
        return new Response<>(SUCCESS.getCode(), SUCCESS.getStatus(), message, null);
    }

    public static <T> Response<T> from(T data) {
        return new Response<>(SUCCESS.getCode(), SUCCESS.getStatus(), SUCCESS.getMessage(), data);
    }

    public static <T> Response<T> from(String message, T data) {
        return new Response<>(SUCCESS.getCode(), SUCCESS.getStatus(), message, data);
    }
}