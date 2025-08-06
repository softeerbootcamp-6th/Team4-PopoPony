package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RecruitErrorCode implements ResponseCode {

    NOT_FOUND_RECRUIT(130101, HttpStatus.NOT_FOUND.value(), "해당 동행 신청 정보를 찾을 수 없습니다.")
    ;

    private final int code;
    private final int status;
    private final String message;
}
