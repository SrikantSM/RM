package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

/**
 * Data returned as a result from an import containing successful items, failed
 * items and corresponding error messages
 */
public interface ImportResult {

    long getCreatedItems();

    long getErrors();

    long getResourceIDErrors();

    void setResourceIDErrors(long noOfResourceIDErrors);
}
