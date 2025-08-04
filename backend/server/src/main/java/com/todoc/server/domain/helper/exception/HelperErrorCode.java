package com.todoc.server.domain.helper.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum HelperErrorCode implements ResponseCode {
    NOT_FOUND(140101, HttpStatus.NOT_FOUND.value(), "해당 도우미를 찾을 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
