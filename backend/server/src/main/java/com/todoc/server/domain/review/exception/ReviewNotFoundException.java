package com.todoc.server.domain.review.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ReviewNotFoundException extends CustomException {
    public ReviewNotFoundException() { super(ReviewErrorCode.NOT_FOUND_REVIEW);}
}
