package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import java.util.List;
import java.util.Set;

import org.apache.commons.csv.CSVRecord;

/**
 * Consistency check for CSV files
 */
public interface AvailabilityCsvConsistencyCheck {
    /**
     * Checks consistency of the CSV file. Raises an exception in case the CSV file
     * is <b>not</b> consistent.
     *
     * @param headers {@link Set} of {@link String}s that contains all actual CSV
     *                headers
     */
    void checkHeaders(final Set<String> headers);

    /**
     * Checks consistency of the CSV file. Raises an exception in case the CSV file
     * is <b>not</b> consistent.
     *
     * @param records {@link List} of {@link CSVRecord} that contains CSV record of
     *                the file to check
     */
    void checkContent(final CSVRecord csvRecord);
}
