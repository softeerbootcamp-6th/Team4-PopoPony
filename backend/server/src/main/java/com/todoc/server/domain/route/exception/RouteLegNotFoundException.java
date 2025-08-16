package com.todoc.server.domain.route.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RouteLegNotFoundException extends CustomException {
    public RouteLegNotFoundException() {
        super(RouteLegErrorCode.ROUTE_LEG_NOT_FOUND);
    }
}
