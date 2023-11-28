package com.sap.c4p.rm.consultantprofile.exceptions;

import com.sap.cds.services.ErrorStatus;
import com.sap.cds.services.ServiceException;

/**
 * Exception raised when invalid csv date format is uploaded.
 */
public class TrackException extends ServiceException {

    private static final long serialVersionUID = 1L;

    public TrackException(ErrorStatus errorStatus, String message) {
        super(errorStatus, message);
    }
}
