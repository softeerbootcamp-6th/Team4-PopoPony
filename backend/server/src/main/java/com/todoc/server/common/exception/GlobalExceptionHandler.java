package com.todoc.server.common.exception;

import com.todoc.server.domain.auth.exception.AuthException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException e) {

        logger.error("[AuthException] {}", e.getMessage(), e);

        ErrorCode errorCode = e.getErrorCode();

        // TODO:: Response 클래스 생성되면 응답하도록 처리
        return null;
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleException(RuntimeException e) {

        logger.error("[RuntimeException] {}", e.getMessage(), e);

        // TODO:: Response 클래스 생성되면 응답하도록 처리
        return null;
    }

}
