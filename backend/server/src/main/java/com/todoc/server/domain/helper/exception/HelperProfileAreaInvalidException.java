package com.todoc.server.domain.helper.exception;

import com.todoc.server.common.exception.base.CustomException;

public class HelperProfileAreaInvalidException extends CustomException {
    public HelperProfileAreaInvalidException() {
        super(HelperErrorCode.HELPER_PROFILE_AREA_INVALID);
    }
}
