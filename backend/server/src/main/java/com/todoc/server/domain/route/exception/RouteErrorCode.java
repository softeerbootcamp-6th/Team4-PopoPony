package com.todoc.server.domain.route.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RouteErrorCode implements ResponseCode {
    ROUTE_NOT_FOUND(170101, HttpStatus.NOT_FOUND.value(), "해당 경로 정보를 찾을 수 없습니다.");

    private final int code;
    private final int status;
    private final String message;
}
