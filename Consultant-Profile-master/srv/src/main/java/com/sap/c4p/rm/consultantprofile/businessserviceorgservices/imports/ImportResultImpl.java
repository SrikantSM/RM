package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

public class ImportResultImpl implements ImportResult, ImportResultBuilder {
    /** records that have been created successfully */
    private int createdHeaders;
    private int createdItems;

    /** {@link ImportError}s that occurred */
    private final List<ImportError> errors;

    public ImportResultImpl() {
        this.errors = new LinkedList<>();
    }

    @Override
    public void addCreatedItems(final Integer row) {
        createdItems = row;
    }

    @Override
    public void addCreatedHeaders(final Integer row) {
        createdHeaders = row;
    }

    @Override
    public void addError(final ImportError error) {
        this.errors.add(error);
    }

    @Override
    public int getCreatedItems() {
        return createdItems;
    }

    @Override
    public int getCreatedHeaders() {
        return createdHeaders;
    }

    @Override
    public List<ImportError> getErrors() {
        return Collections.unmodifiableList(this.errors);
    }

    @Override
    public ImportResult build() {
        return this;
    }
}
