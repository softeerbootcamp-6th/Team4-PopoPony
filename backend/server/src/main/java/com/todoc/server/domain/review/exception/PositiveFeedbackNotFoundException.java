package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.CustomException;

public class PositiveFeedbackNotFoundException extends CustomException {
    public PositiveFeedbackNotFoundException() { super(PositiveFeedbackErrorCode.NOT_FOUND_POSITIVE_FEEDBACK);}
}
