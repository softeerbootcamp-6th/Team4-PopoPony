package com.todoc.server.domain.report.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ReportNotFoundException extends CustomException {
    public ReportNotFoundException() {
        super(ReportErrorCode.REPORT_NOT_FOUND);
    }
}
