package com.todoc.server.domain.report.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ReportErrorCode implements ResponseCode {
    REPORT_NOT_FOUND(150101, HttpStatus.NOT_FOUND.value(), "해당 리포트를 찾을 수 없습니다."),

    TAXI_FEE_NOT_FOUND(150201, HttpStatus.NOT_FOUND.value(), "해당 택시 요금 정보를 찾을 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
