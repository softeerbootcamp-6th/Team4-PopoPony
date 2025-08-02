package com.todoc.server.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import static com.todoc.server.common.exception.global.CommonResponseCode.SUCCESS;

@Getter
@JsonPropertyOrder({"code", "status", "message", "data"})
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "공통 응답 포맷")
public class Response<T> {

    @Schema(description = "직접 정의한 응답에 대한 code", example = "")
    private final int code;

    @Schema(description = "응답 상태에 대한 HTTP 상태 코드", example = "200")
    private final int status;

    @Schema(description = "응답 상태에 대한 HTTP 메시지", example = "SUCCESS")
    private final String message;

    @Schema(description = "응답 body 필드")
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