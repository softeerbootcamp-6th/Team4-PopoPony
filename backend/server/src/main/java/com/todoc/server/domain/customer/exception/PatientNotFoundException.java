package com.todoc.server.domain.customer.exception;

import com.todoc.server.common.exception.base.CustomException;

public class PatientNotFoundException extends CustomException {
    public PatientNotFoundException() {
        super(CustomerErrorCode.PATIENT_NOT_FOUND);
    }
}
