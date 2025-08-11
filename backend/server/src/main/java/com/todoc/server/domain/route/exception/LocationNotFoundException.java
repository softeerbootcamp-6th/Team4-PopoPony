package com.todoc.server.domain.route.exception;

import com.todoc.server.common.exception.base.CustomException;

public class LocationNotFoundException extends CustomException {

    public LocationNotFoundException() {
        super(LocationErrorCode.LOCATION_NOT_FOUND);
    }
}
