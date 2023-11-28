package com.sap.c4p.rm.consultantprofile.exceptions;

/**
 * Exception raised when the transaction is failed while saving entity to
 * database.
 */
public class TransactionalException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public TransactionalException(String message) {
        super(message);
    }
}
