package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum EscortErrorCode implements ResponseCode {
    RECRUIT_NOT_FOUND(130101, HttpStatus.NOT_FOUND.value(), "해당 동행 신청을 찾을 수 없습니다."),
    RECRUIT_INVALID_CANCEL(130103, HttpStatus.BAD_REQUEST.value(), "매칭이 완료된 동행 신청은 취소할 수 없습니다."),
    RECRUIT_INVALID(130103, HttpStatus.BAD_REQUEST.value(), "동행 신청 상태가 유효하지 않습니다."),

    APPLICATION_NOT_FOUND(130201, HttpStatus.NOT_FOUND.value(), "해당 동행 지원을 찾을 수 없습니다."),
    APPLICATION_INVALID_SELECT(130203, HttpStatus.BAD_REQUEST.value(), "대기 중인 지원만 선택할 수 있습니다."),

    ESCORT_NOT_FOUND(130301, HttpStatus.NOT_FOUND.value(), "해당 동행을 찾을 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
