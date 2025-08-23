package com.todoc.server.external.tmap.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TMapErrorCode implements ResponseCode {

    EXTERNAL_API_CALL_FAILED(171007, HttpStatus.INTERNAL_SERVER_ERROR.value(), "TMap API 호출 오류"),
    RESPONSE_PARSE_FAILED(171009, HttpStatus.INTERNAL_SERVER_ERROR.value(), "TMap 응답에 대한 파싱 오류");

    private final int code;
    private final int status;
    private final String message;
}
