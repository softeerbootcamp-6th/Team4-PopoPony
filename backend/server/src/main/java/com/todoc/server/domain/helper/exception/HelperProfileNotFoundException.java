package com.todoc.server.domain.helper.exception;

import com.todoc.server.common.exception.base.CustomException;

public class HelperProfileNotFoundException extends CustomException {
    public HelperProfileNotFoundException() {
        super(HelperErrorCode.HELPER_PROFILE_NOT_FOUND);
    }
}
