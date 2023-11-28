package com.sap.c4p.rm.exceptions;

public class LanguageCodeFormatException extends ReplicationException {

	public LanguageCodeFormatException(String... parameters) {
		super(null, ReplicationErrorCodes.INVALID_LANGUAGE_CODE, parameters);
	}

}
