package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ImportResultBuilderTest {

    @Test
    @DisplayName("check if create() returns an instance")
    public void create() {
        final ImportResultBuilder builder = new ImportResultImpl(1, 2, 3);

        assertNotNull(builder, "created builder instance should not be null");
    }
}
