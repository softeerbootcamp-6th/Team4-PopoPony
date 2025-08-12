package com.todoc.server.domain.image.exception;

import com.todoc.server.common.exception.base.ResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ImageFileErrorCode implements ResponseCode {
    IMAGE_FILE_NOT_FOUND(200101, HttpStatus.NOT_FOUND.value(), "해당 이미지 파일을 찾을 수 없습니다."),
    IMAGE_FILE_INVALID(200102, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 이미지 파일입니다.");

    private final int code;
    private final int status;
    private final String message;
}
