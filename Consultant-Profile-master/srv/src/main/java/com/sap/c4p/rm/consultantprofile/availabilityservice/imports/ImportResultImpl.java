package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import java.io.Serializable;

public class ImportResultImpl implements Serializable, ImportResult, ImportResultBuilder {

    private static final long serialVersionUID = 1L;

    /** items that have been created successfully */
    private final long createdItems;

    /** {@link ImportError}s that occurred */
    private final long errors;

    /** {@link ImportError}s that occurred for resource ID */
    private long resourceIDErrors;

    public ImportResultImpl(final long createdItems, final long errors, final long resourceIDErrors) {
        this.createdItems = createdItems;
        this.errors = errors;
        this.resourceIDErrors = resourceIDErrors;
    }

    @Override
    public ImportResult build() {
        return this;
    }

    public long getCreatedItems() {
        return createdItems;
    }

    public long getErrors() {
        return errors;
    }

    public long getResourceIDErrors() {
        return resourceIDErrors;
    }

    public void setResourceIDErrors(long resourceIDErrors) {
        this.resourceIDErrors = resourceIDErrors;
    }
}
