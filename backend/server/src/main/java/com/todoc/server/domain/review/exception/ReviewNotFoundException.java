package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ReviewNotFoundException extends CustomException {
    public ReviewNotFoundException() { super(ReviewErrorCode.REVIEW_NOT_FOUND);}
}
