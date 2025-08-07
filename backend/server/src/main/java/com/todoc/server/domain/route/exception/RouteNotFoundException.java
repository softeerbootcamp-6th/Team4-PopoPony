package com.todoc.server.domain.route.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RouteNotFoundException extends CustomException {
    public RouteNotFoundException() {
        super(RouteErrorCode.ROUTE_NOT_FOUND);
    }
}
