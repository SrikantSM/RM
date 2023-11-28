package com.sap.c4p.rm.consultantprofile.exceptions;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;

public class AvailabilityUploadException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final AvailabilityErrorCodes availabilityErrorCode;
    private final List<String> parameters;

    public AvailabilityUploadException(HttpStatus httpStatus, AvailabilityErrorCodes availabilityErrorCode,
            String... parameters) {
        this.httpStatus = httpStatus;
        this.availabilityErrorCode = availabilityErrorCode;
        this.parameters = new ArrayList<>(Arrays.asList(parameters));
        for (int i = parameters.length; i < 4; i++)
            this.parameters.add(null);
    }

    public AvailabilityErrorCodes getAvailabilityErrorCode() {
        return this.availabilityErrorCode;
    }

    public List<String> getParameters() {
        return this.parameters;
    }

    public HttpStatus httpStatus() {
        return this.httpStatus;
    }

}
