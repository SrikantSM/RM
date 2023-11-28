package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports;

/**
 * Builder to create a {@link ImportResult}
 */
public interface ImportResultBuilder {

    void addCreatedItems(Integer row);

    void addCreatedHeaders(Integer row);

    void addError(ImportError error);

    ImportResult build();
}
