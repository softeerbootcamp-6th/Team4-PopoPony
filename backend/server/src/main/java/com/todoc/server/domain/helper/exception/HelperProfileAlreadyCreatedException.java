package com.todoc.server.domain.helper.exception;

import com.todoc.server.common.exception.base.CustomException;

public class HelperProfileAlreadyCreatedException extends CustomException {
    public HelperProfileAlreadyCreatedException() {
        super(HelperErrorCode.HELPER_PROFILE_ALREADY_CREATED);
    }
}
