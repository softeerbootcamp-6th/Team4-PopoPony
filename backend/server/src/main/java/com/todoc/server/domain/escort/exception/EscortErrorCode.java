package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum EscortErrorCode implements ResponseCode {
    RECRUIT_NOT_FOUND(130101, HttpStatus.NOT_FOUND.value(), "해당 동행 신청을 찾을 수 없습니다."),
    RECRUIT_INVALID_CANCEL(130103, HttpStatus.BAD_REQUEST.value(), "매칭이 완료된 동행 신청은 취소할 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
