package com.todoc.server.domain.auth.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ResponseCode {

    // 사용자(auth)
    NOT_FOUND(11001, HttpStatus.NOT_FOUND.value(), "유저가 존재하지 않습니다.")
    ;

    private final int code;
    private final int status;
    private final String message;
}
