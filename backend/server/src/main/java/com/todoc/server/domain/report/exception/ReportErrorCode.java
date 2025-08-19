package com.todoc.server.domain.report.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ReportErrorCode implements ResponseCode {
    REPORT_NOT_FOUND(150101, HttpStatus.NOT_FOUND.value(), "해당 리포트를 찾을 수 없습니다."),
    REPORT_ALREADY_WRITTEN(150103, HttpStatus.BAD_REQUEST.value(), "해당 동행에 대한 리포트가 이미 존재합니다."),
    REPORT_NOT_READY_TO_WRITE(150103, HttpStatus.BAD_REQUEST.value(), "아직 동행이 완료되지 않아 리포트를 작성할 수 없습니다."),

    TAXI_FEE_NOT_FOUND(150201, HttpStatus.NOT_FOUND.value(), "해당 택시 요금 정보를 찾을 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
