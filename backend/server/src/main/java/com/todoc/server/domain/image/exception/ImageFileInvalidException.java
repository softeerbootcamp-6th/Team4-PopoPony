package com.todoc.server.domain.image.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ImageFileInvalidException extends CustomException {
    public ImageFileInvalidException() {
        super(ImageFileErrorCode.IMAGE_FILE_INVALID);
    }
}
