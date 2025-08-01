package com.todoc.server.common.exception.global;

import com.todoc.server.common.exception.base.CustomException;
import com.todoc.server.common.exception.base.ResponseCode;
import com.todoc.server.common.response.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(CustomException.class)
    public ErrorResponse handleAuthException(CustomException e) {

        ResponseCode ResponseCode = e.getResponseStatus();
        logger.warn("[{}] {} - {}", e.getClass().getSimpleName(), ResponseCode.getMessage(), ResponseCode.getCode());

        return ErrorResponse.from(ResponseCode);

    }

    @ExceptionHandler(RuntimeException.class)
    public ErrorResponse handleException(RuntimeException e) {

        logger.error("[Unexpected Error]", e);

        return ErrorResponse.from(CommonResponseCode.INTERNAL_SERVER_ERROR);
    }

}
