package com.todoc.server.domain.realtime.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum WebSocketErrorCode implements ResponseCode {
    WEB_SOCKET_INVALID_ENVELOPE(210102, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 메세지 형태입니다.");

    private final int code;
    private final int status;
    private final String message;
}
