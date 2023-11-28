package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports;

/**
 * Data representing an error occurring during an import
 */
public class ImportError {

    /** {@link String} to contain information about the error */
    private final String message;

    public ImportError(final String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }

}
