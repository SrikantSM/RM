package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ImportErrorTest {

    private String message;

    @BeforeEach
    public void setUp() {

        this.message = "message";
    }

    @Test
    @DisplayName("check if the getters return the injected values")
    public void checkGetters() {
        final ImportError error = new ImportError(this.message);

        assertEquals(error.getMessage(), this.message, "getter should return the injected message");

    }
}
