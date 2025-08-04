package com.todoc.server.domain.report.exception;

import com.todoc.server.common.exception.base.CustomException;

public class TaxiFeeNotFoundException extends CustomException {
    public TaxiFeeNotFoundException() {
        super(ReportErrorCode.TAXI_FEE_NOT_FOUND);
    }
}
