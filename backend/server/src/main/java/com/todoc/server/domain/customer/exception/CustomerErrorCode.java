package com.todoc.server.domain.customer.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CustomerErrorCode implements ResponseCode {
    PATIENT_NOT_FOUND(120201, HttpStatus.NOT_FOUND.value(), "해당 환자 정보를 찾을 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
