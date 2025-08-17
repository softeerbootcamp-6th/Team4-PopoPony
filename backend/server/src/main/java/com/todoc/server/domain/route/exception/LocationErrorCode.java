package com.todoc.server.domain.route.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum LocationErrorCode implements ResponseCode {
    LOCATION_NOT_FOUND(170201, HttpStatus.NOT_FOUND.value(), "해당 위치 정보를 찾을 수 없습니다.")
    ;

    private final int code;
    private final int status;
    private final String message;
}
