package com.todoc.server.domain.realtime.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RealtimeErrorCode implements ResponseCode {
    REALTIME_INVALID_ROLE(190102, HttpStatus.BAD_REQUEST.value(), "존재하지 않는 롤입니다.");

    private final int code;
    private final int status;
    private final String message;
}
