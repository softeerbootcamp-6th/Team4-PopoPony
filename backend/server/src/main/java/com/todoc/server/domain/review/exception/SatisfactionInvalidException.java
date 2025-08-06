package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.CustomException;

public class SatisfactionInvalidException extends CustomException {
    public SatisfactionInvalidException() {
        super(ReviewErrorCode.REVIEW_SATISFACTION_IN_VALID_);
    }
}

