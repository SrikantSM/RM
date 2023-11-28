package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports;

import java.util.List;

/**
 * Data returned as a result from an import containing successful items, failed
 * items and corresponding error messages
 */
public interface ImportResult {

    int getCreatedItems();

    int getCreatedHeaders();

    List<ImportError> getErrors();
}
