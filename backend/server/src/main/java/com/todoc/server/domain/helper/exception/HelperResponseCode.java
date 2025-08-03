package com.todoc.server.domain.helper.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum HelperResponseCode implements ResponseCode {
    HELPER_NOT_FOUND(140101, 404, "해당 도우미를 찾을 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
