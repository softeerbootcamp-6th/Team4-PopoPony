package com.todoc.server.domain.report.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ReportAlreadyWrittenException extends CustomException {
    public ReportAlreadyWrittenException() {
        super(ReportErrorCode.REPORT_ALREADY_WRITTEN);
    }
}
