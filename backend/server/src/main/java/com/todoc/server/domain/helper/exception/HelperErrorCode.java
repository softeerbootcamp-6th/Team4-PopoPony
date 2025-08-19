package com.todoc.server.domain.helper.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum HelperErrorCode implements ResponseCode {
    HELPER_PROFILE_NOT_FOUND(140101, HttpStatus.NOT_FOUND.value(), "해당 도우미를 찾을 수 없습니다."),
    HELPER_PROFILE_AREA_INVALID(140102, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 지역명입니다."),
    HELPER_PROFILE_ALREADY_CREATED(140103, HttpStatus.BAD_REQUEST.value(), "이미 도우미 프로필이 등록된 사용자입니다.");

    private final int code;
    private final int status;
    private final String message;
}
