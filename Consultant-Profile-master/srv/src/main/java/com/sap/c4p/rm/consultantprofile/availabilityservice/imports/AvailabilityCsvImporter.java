package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import java.io.IOException;
import java.io.InputStream;

import com.sap.resourcemanagement.resource.Capacity;

public interface AvailabilityCsvImporter {

    /**
     * Reads the given {@link InputStream} as a CSV file. After checking it's
     * consistency, the {@link ServiceOrgs} contained in the data will be extracted
     * and stored in the database.
     *
     * <br>
     * A {@link ImportResult} is created to signal which {@link Capacity} were
     * created successfully, and which failed. If there are any error messages,
     * these are also contained in this result.
     *
     *
     * @param csvStream {@link InputStream} to be imported
     * @return {@link ImportResult}
     * @throws IOException
     */
    ImportResult importStream(final InputStream csvStream, final String costCenter) throws IOException;

}
