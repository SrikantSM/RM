package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg;

import java.io.IOException;
import java.io.InputStream;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResult;

/**
 * This class process the CSV records and prepare the Headers and Details
 * records
 */
public interface ServiceOrgCsvImporter {

    /**
     * Reads the given {@link InputStream} as a CSV file. After checking it's
     * consistency, the {@link ServiceOrgs} contained in the data will be extracted
     * and stored in the database. If the storing is unsuccessful, the respective
     * skill is stored as a draft
     *
     * <br>
     * A {@link ImportResult} is created to signal which {@link ServiceOrgs} were
     * created successfully, and which failed. If there are any error messages,
     * these are also contained in this result.
     *
     *
     * @param csvStream {@link InputStream} to be imported
     * @param language  {@link String} representing the language of the given data
     * @return {@link ImportResult}
     * @throws IOException
     */
    ImportResult importStream(final InputStream csvStream) throws IOException;

}
