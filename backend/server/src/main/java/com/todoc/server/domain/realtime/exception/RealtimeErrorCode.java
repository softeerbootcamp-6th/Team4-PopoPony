package com.todoc.server.domain.realtime.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RealtimeErrorCode implements ResponseCode {
    REALTIME_INVALID_ROLE(190102, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 롤입니다."),
    REALTIME_CUSTOMER_LOCATION(190202, HttpStatus.BAD_REQUEST.value(), "고객은 위치 정보를 공유할 수 없습니다."),
    REALTIME_ALREADY_MET_PATIENT(190103, HttpStatus.BAD_REQUEST.value(), "환자는 만남중 상태에서만 연결 가능합니다.");

    private final int code;
    private final int status;
    private final String message;
}
