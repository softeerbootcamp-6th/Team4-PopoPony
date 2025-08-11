package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RecruitInvalidException extends CustomException {

    public RecruitInvalidException() {
        super(EscortErrorCode.RECRUIT_INVALID_CANCEL);
    }
}
