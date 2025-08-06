package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.CustomException;

public class PositiveFeedbackInvalidException extends CustomException {
    public PositiveFeedbackInvalidException() {
        super(PositiveFeedbackErrorCode.IN_VALID_POSITIVE_FEEDBACK);
    }
}
