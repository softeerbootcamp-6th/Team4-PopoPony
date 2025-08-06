package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PositiveFeedbackErrorCode implements ResponseCode {

    // 피드백 02
    NOT_FOUND_POSITIVE_FEEDBACK(160201, HttpStatus.NOT_FOUND.value(), "해당 피드백을 찾을 수 없습니다."),
    IN_VALID_POSITIVE_FEEDBACK(160202, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 피드백입니다."),
    ;

    private final int code;
    private final int status;
    private final String message;
}
