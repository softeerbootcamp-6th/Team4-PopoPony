package com.todoc.server.domain.customer.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CustomerErrorCode implements ResponseCode {
    // 환자 01
    PATIENT_NOT_FOUND(120101, HttpStatus.NOT_FOUND.value(), "해당 환자 정보를 찾을 수 없습니다."),
    PATIENT_GENDER_INVALID(120102, HttpStatus.BAD_REQUEST.value(), "환자 성별은 남자 또는 여자만 가능합니다.")
    ;

    private final int code;
    private final int status;
    private final String message;
}
