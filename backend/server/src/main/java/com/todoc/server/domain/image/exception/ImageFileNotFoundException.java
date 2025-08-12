package com.todoc.server.domain.image.exception;

import com.todoc.server.common.exception.base.CustomException;
import com.todoc.server.domain.image.entity.ImageFile;

public class ImageFileNotFoundException extends CustomException {
    public ImageFileNotFoundException() {
        super(ImageFileErrorCode.IMAGE_FILE_NOT_FOUND);
    }
}
