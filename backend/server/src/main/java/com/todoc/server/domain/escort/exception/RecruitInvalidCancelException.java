package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RecruitInvalidCancelException extends CustomException {
    public RecruitInvalidCancelException() {
        super(EscortErrorCode.RECRUIT_INVALID_CANCEL);
    }
}
