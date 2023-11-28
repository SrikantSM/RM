package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg;

import java.util.Set;

import org.apache.commons.csv.CSVRecord;

/**
 * Consistency check for CSV files
 */
interface CsvConsistencyCheck {
    /**
     * Checks consistency of the CSV file. Raises an exception in case the CSV file
     * is <b>not</b> consistent.
     *
     * @param headers {@link Set} of {@link String}s that contains all actual CSV
     *                headers
     * @param records {@link List} of {@link CSVRecord}s that contains all CSV
     *                records of the file to check
     */
    void checkHeaders(final Set<String> headers);

    void checkContent(final CSVRecord csvRecord);
}
