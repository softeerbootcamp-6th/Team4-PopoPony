package com.todoc.server.domain.report.exception;

import com.todoc.server.common.exception.base.CustomException;

public class ReportNotReadyToWriteException extends CustomException {
    public ReportNotReadyToWriteException() {
        super(ReportErrorCode.REPORT_NOT_READY_TO_WRITE);
    }
}
