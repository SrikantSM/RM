package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.exceptions.AvailabilityUploadException;
import com.sap.c4p.rm.consultantprofile.exceptions.TrackException;

public class CsvConsistencyCheckImplTest {

    /** object under test */
    private AvailabilityCsvConsistencyCheck cut;

    /** {@link CSVParser} to be used by object under test */
    private CSVParser csvParser;

    /**
     * initialize object under test
     */
    @BeforeEach
    public void setUp() {
        this.cut = new AvailabilityCsvConsistencyCheckImpl();
    }

    @Test
    @DisplayName("see if check fails if csv file containing invalid header is provided")
    public void checkHeadersFails() throws IOException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getInvalidHeaderFile(), StandardCharsets.UTF_8,
                CSVFormat.RFC4180.withFirstRecordAsHeader());

        assertThrows(ServiceException.class, () -> this.cut.checkHeaders(this.csvParser.getHeaderMap().keySet()));
    }

    @Test
    @DisplayName("see if check succeeds if csv valid file is provided")
    public void checkSucceeds() throws IOException, ServiceException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getValidFile(), StandardCharsets.UTF_8,
                CSVFormat.RFC4180.withFirstRecordAsHeader());

        assertDoesNotThrow(() -> this.cut.checkHeaders(this.csvParser.getHeaderMap().keySet()));
        assertDoesNotThrow(() -> this.cut.checkContent(this.csvParser.getRecords().get(0)));
    }

    @Test
    @DisplayName("see if check fails if csv file containing an empty resourceId column is provided")
    public void checkContentResourceIdEmptyFails() throws IOException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getInvalidResourceIdEmptyFile(),
                StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

        assertThrows(TrackException.class, () -> this.cut.checkContent(this.csvParser.getRecords().get(0)));
    }

    @Test
    @DisplayName("see if check fails if csv file containing an empty column is provided")
    public void checkContentEmptyFails() throws IOException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getInvalidContentEmptyFile(),
                StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

        assertThrows(AvailabilityUploadException.class,
                () -> this.cut.checkContent(this.csvParser.getRecords().get(0)));
    }

    /**
     * return {@link InputStream} pointing to valid file
     * {@code src/test/resources/valid_availability.csv}
     *
     * @return valid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getValidFile() throws FileNotFoundException {
        return new FileInputStream("src/test/resources/valid_availability.csv");
    }

    /**
     * return {@link InputStream} pointing to file
     * {@code src/test/resources/invalid_availability_header.csv} containing an
     * invalid header
     *
     * @return invalid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getInvalidHeaderFile() throws FileNotFoundException {
        return new FileInputStream("src/test/resources/invalid_availability_header.csv");
    }

    /**
     * return {@link InputStream} pointing to file
     * {@code src/test/resources/invalid_availability_content_empty.csv} containing
     * an empty column
     *
     * @return invalid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getInvalidContentEmptyFile() throws FileNotFoundException {
        return new FileInputStream("src/test/resources/invalid_availability_content_empty.csv");
    }

    /**
     * return {@link InputStream} pointing to file
     * {@code src/test/resources/invalid_availability_resourceId.csv} containing an
     * empty resourceId column
     *
     * @return invalid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getInvalidResourceIdEmptyFile() throws FileNotFoundException {
        return new FileInputStream("src/test/resources/invalid_availability_resourceId.csv");
    }

}
