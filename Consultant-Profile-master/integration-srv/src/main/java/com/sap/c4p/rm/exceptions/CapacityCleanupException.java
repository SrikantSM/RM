package com.sap.c4p.rm.exceptions;

public class CapacityCleanupException extends TransactionException{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CapacityCleanupException(Throwable throwable, String... parameters) {
        super(throwable, parameters);
    }

    public CapacityCleanupException(String... parameters) {
        super(null, parameters);
    }
}
