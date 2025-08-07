package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ReviewErrorCode implements ResponseCode {

    // 리뷰 01
    REVIEW_NOT_FOUND(160101, HttpStatus.NOT_FOUND.value(), "해당 리뷰를 찾을 수 없습니다."),

    // 리뷰 만족도 02
    REVIEW_SATISFACTION_IN_VALID_(160202, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 만족도입니다."),
    ;

    private final int code;
    private final int status;
    private final String message;
}
