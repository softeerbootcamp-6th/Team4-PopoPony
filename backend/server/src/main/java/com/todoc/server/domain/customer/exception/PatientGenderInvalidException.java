package com.todoc.server.domain.customer.exception;

import com.todoc.server.common.exception.base.CustomException;

public class PatientGenderInvalidException extends CustomException {
    public PatientGenderInvalidException() {
        super(CustomerErrorCode.PATIENT_GENDER_INVALID);
    }
}
