package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.resourcemanagement.organization.HeadersWithDetails;

public class ImportResultImplTest {
    /** object under test */
    private ImportResultImpl cut;

    private HeadersWithDetails serviceOrg;

    private ImportError error;

    @BeforeEach
    public void setUp() {
        this.cut = new ImportResultImpl();
        this.serviceOrg = HeadersWithDetails.create();
        this.error = new ImportError(null);
    }

    @Test
    @DisplayName("check if an empty result returns empty lists")
    public void emptyResult() {
        final ImportResult result = this.cut.build();

        assertEquals(0, result.getCreatedItems(), "created skill list should have been empty");
        assertTrue(result.getErrors().isEmpty(), "errors list should have been empty");
    }

    @Test
    @DisplayName("check if a non-empty result returns non-empty lists")
    public void nonEmptyResult() {
        this.cut.addCreatedItems(1);
        this.cut.addError(this.error);

        final ImportResult result = this.cut.build();

        assertEquals(1, result.getCreatedItems(), "created service ord details list should contain one element");
        assertEquals(1, result.getErrors().size(), "errors skill list should contain one element");
        assertEquals(result.getErrors().get(0), this.error, "error list should contain the added error element");
    }
}
