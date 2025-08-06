package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.CustomException;

public class PositiveFeedbackInternalServerException extends CustomException {
    public PositiveFeedbackInternalServerException() {
        super(PositiveFeedbackErrorCode.INTERNAL_SERVER_ERROR);
    }
}
