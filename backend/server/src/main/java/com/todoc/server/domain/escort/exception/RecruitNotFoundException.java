package com.todoc.server.domain.escort.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RecruitNotFoundException extends CustomException {
    public RecruitNotFoundException() {
        super(RecruitErrorCode.RECRUIT_NOT_FOUND);
    }
}
