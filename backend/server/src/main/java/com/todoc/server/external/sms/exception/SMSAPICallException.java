package com.todoc.server.external.sms.exception;

import com.todoc.server.common.exception.base.CustomException;

public class SMSAPICallException extends CustomException {
    public SMSAPICallException() { super(SMSErrorCode.EXTERNAL_API_CALL_FAILED);}
}
