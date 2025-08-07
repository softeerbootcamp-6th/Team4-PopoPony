package com.todoc.server.domain.helper.exception;

import com.todoc.server.common.exception.base.CustomException;

public class HelperNotFoundException extends CustomException {
    public HelperNotFoundException() {
        super(HelperErrorCode.HELPER_NOT_FOUND);
    }
}
