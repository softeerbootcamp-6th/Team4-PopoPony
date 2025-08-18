package com.todoc.server.domain.realtime.exception;

import com.todoc.server.common.exception.base.CustomException;

public class RealtimeCustomerLocationException extends CustomException {
    public RealtimeCustomerLocationException() {
        super(RealtimeErrorCode.REALTIME_CUSTOMER_LOCATION);
    }
}
