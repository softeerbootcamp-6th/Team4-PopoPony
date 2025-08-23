package com.todoc.server.external.sms.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SMSErrorCode implements ResponseCode {

    EXTERNAL_API_CALL_FAILED(131007, HttpStatus.INTERNAL_SERVER_ERROR.value(), "SMS API 호출 오류");

    private final int code;
    private final int status;
    private final String message;
}
