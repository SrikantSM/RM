package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ImportResultImplTest {
    /** object under test */
    private ImportResultImpl cut;

    @BeforeEach
    public void setUp() {
        this.cut = new ImportResultImpl(0, 0, 0);
    }

    @Test
    @DisplayName("check if an empty result returns zero count of created item and error availability")
    public void emptyResult() {
        final ImportResult result = this.cut.build();

        assertEquals(result.getCreatedItems(), 0);
        assertEquals(result.getErrors(), 0);
        assertEquals(result.getResourceIDErrors(), 0);
    }

    @Test
    @DisplayName("check if a non-empty result returns created items, errors and resourceIdErrors counts")
    public void nonEmptyResult() {

        this.cut = new ImportResultImpl(10, 5, 1);
        final ImportResult result = this.cut.build();

        assertEquals(result.getCreatedItems(), 10, "created capacity count should contain one element");
        assertEquals(result.getErrors(), 5, "error count should contain the added error element");
        assertEquals(result.getResourceIDErrors(), 1, "error count should contain the added resourceIdErrors element");
    }

    @Test
    @DisplayName("check if a setResourceIDErrors sets the value and returns created items, errors and resourceIdErrors counts")
    public void testSetResourceIDErrors() {

        this.cut = new ImportResultImpl(10, 5, 0);
        final ImportResult result = this.cut.build();
        result.setResourceIDErrors(2);

        assertEquals(result.getCreatedItems(), 10, "created capacity count should contain one element");
        assertEquals(result.getErrors(), 5, "error count should contain the added error element");
        assertEquals(result.getResourceIDErrors(), 2, "error count should contain the added resourceIdErrors element");
    }

}
