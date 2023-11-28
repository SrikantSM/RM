package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.csvcolumns.BsoCsvColumn;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;

public class CsvConsistencyCheckImplTest {

    /**
     * object under test
     */
    private CsvConsistencyCheckImpl cut;

    /** {@link CSVParser} to be used by object under test */
    private CSVParser csvParser;

    @BeforeEach
    public void beforeEach() {

        this.cut = new CsvConsistencyCheckImpl();

    }

    @Test
    @DisplayName("see if check fails if csv file containing invalid header is provided")
    public void checkHeaderFails() throws FileNotFoundException, IOException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getInvalidHeaderFile(), StandardCharsets.UTF_8,
                CSVFormat.RFC4180.withFirstRecordAsHeader());

        assertThrows(ServiceException.class, () -> {
            this.cut.checkHeaders(this.csvParser.getHeaderMap().keySet());
        });
    }

    @Test
    @DisplayName("see if check succeeds if csv valid file is provided")
    public void checkHeaderSucceeds() throws FileNotFoundException, IOException, ServiceException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getValidFile(), StandardCharsets.UTF_8,
                CSVFormat.RFC4180.withFirstRecordAsHeader());

        this.cut.checkHeaders(this.csvParser.getHeaderMap().keySet());
    }

    @Test
    @DisplayName("see if check fails if csv file containing an empty column is provided")
    public void checkRecordEmptyFails() throws FileNotFoundException, IOException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getInvalidContentEmptyFile(),
                StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

        assertThrows(ServiceException.class, () -> {
            this.cut.checkContent(this.csvParser.getRecords().get(0));
        });
    }

    @Test
    @DisplayName("see if check fails if csv file containing a column that is not set is provided")
    public void checkContentNotSetFails() throws FileNotFoundException, IOException {
        this.csvParser = CSVParser.parse(CsvConsistencyCheckImplTest.getInvalidContentNotSetFile(),
                StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

        assertThrows(ServiceException.class, () -> {
            this.cut.checkContent(this.csvParser.getRecords().get(0));
        });
    }

    @Test
    @DisplayName("checkContent: No Exception is raised if the record content is good")
    void checkContentOk() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String code = "Org1";
        String descrption = "Service Org 1";
        String costCenter = "CC001";
        String companyCode = "CC01";
        String isDelivery = "X";
        when(mockCsvRecord.get(BsoCsvColumn.CODE.getName())).thenReturn(code);
        when(mockCsvRecord.get(BsoCsvColumn.DESCRIPTION.getName())).thenReturn(descrption);
        when(mockCsvRecord.get(BsoCsvColumn.COST_CENTER.getName())).thenReturn(costCenter);
        when(mockCsvRecord.get(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(companyCode);
        when(mockCsvRecord.get(BsoCsvColumn.IS_DELIVERY.getName())).thenReturn(isDelivery);
        when(mockCsvRecord.isSet(BsoCsvColumn.CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COST_CENTER.getName())).thenReturn(true);

        assertDoesNotThrow(() -> this.cut.checkContent(mockCsvRecord));
    }

    @Test
    @DisplayName("checkContent: Throws Exception if the record has invalid costcenter")
    void checkContentInvalidCostCenter() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String code = "Org1";
        String costCenter = "CC001ABCDEF";
        String companyCode = "CC01";
        when(mockCsvRecord.get(BsoCsvColumn.CODE.getName())).thenReturn(code);
        when(mockCsvRecord.get(BsoCsvColumn.COST_CENTER.getName())).thenReturn(costCenter);
        when(mockCsvRecord.get(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(companyCode);
        when(mockCsvRecord.isSet(BsoCsvColumn.CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COST_CENTER.getName())).thenReturn(true);

        ServiceException exception = assertThrows(ServiceException.class, () -> {
            this.cut.checkContent(mockCsvRecord);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(MessageKeys.INVALID_COSTCENTER_FORMAT, exception.getMessage());
    }

    @Test
    @DisplayName("checkContent: Throws Exception if the record has invalid company code")
    void checkContentInvalidCompanyCode() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String code = "Org1";
        String costCenter = "CC001";
        String companyCode = "CC01ABCDEF12";
        when(mockCsvRecord.get(BsoCsvColumn.CODE.getName())).thenReturn(code);
        when(mockCsvRecord.get(BsoCsvColumn.COST_CENTER.getName())).thenReturn(costCenter);
        when(mockCsvRecord.get(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(companyCode);
        when(mockCsvRecord.isSet(BsoCsvColumn.CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COST_CENTER.getName())).thenReturn(true);

        ServiceException exception = assertThrows(ServiceException.class, () -> {
            this.cut.checkContent(mockCsvRecord);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(MessageKeys.INVALID_COMPANYCODE_FORMAT, exception.getMessage());
    }

    @Test
    @DisplayName("checkContent: Throws Exception if the record has invalid service org code")
    void checkContentInvalidCode() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String code = "Org123";
        String costCenter = "CC001";
        String companyCode = "CC01";
        when(mockCsvRecord.get(BsoCsvColumn.CODE.getName())).thenReturn(code);
        when(mockCsvRecord.get(BsoCsvColumn.COST_CENTER.getName())).thenReturn(costCenter);
        when(mockCsvRecord.get(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(companyCode);
        when(mockCsvRecord.isSet(BsoCsvColumn.CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COST_CENTER.getName())).thenReturn(true);

        ServiceException exception = assertThrows(ServiceException.class, () -> {
            this.cut.checkContent(mockCsvRecord);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(MessageKeys.INVALID_SERVICEORG_CODE_FORMAT, exception.getMessage());
    }

    @Test
    @DisplayName("checkContent: Throws Exception if the record has invalid isDelivery input")
    void checkContentInvalidIsDelivery() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String code = "Org1";
        String costCenter = "CC001";
        String companyCode = "CC01";
        String isDelivery = "A";
        when(mockCsvRecord.get(BsoCsvColumn.CODE.getName())).thenReturn(code);
        when(mockCsvRecord.get(BsoCsvColumn.COST_CENTER.getName())).thenReturn(costCenter);
        when(mockCsvRecord.get(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(companyCode);
        when(mockCsvRecord.get(BsoCsvColumn.IS_DELIVERY.getName())).thenReturn(isDelivery);
        when(mockCsvRecord.isSet(BsoCsvColumn.CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COST_CENTER.getName())).thenReturn(true);

        ServiceException exception = assertThrows(ServiceException.class, () -> {
            this.cut.checkContent(mockCsvRecord);
        });
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(MessageKeys.INVALID_ISBOOLEAN_VALUE, exception.getMessage());
    }

    @Test
    @DisplayName("checkContent: No Exception is raised if record has blank isDelivery input")
    void checkContentBlankIsDeliveryValue() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String code = "Org1";
        String costCenter = "CC001";
        String companyCode = "CC01";
        String isDelivery = "";
        when(mockCsvRecord.get(BsoCsvColumn.CODE.getName())).thenReturn(code);
        when(mockCsvRecord.get(BsoCsvColumn.COST_CENTER.getName())).thenReturn(costCenter);
        when(mockCsvRecord.get(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(companyCode);
        when(mockCsvRecord.get(BsoCsvColumn.IS_DELIVERY.getName())).thenReturn(isDelivery);
        when(mockCsvRecord.isSet(BsoCsvColumn.CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COST_CENTER.getName())).thenReturn(true);

        assertDoesNotThrow(() -> this.cut.checkContent(mockCsvRecord));
    }

    @Test
    @DisplayName("checkContent: No Exception is raised if record has valid isDelivery input in lowercase")
    void checkContentLowerCaseValue() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String code = "Org1";
        String costCenter = "CC001";
        String companyCode = "CC01";
        String isDelivery = "n";
        when(mockCsvRecord.get(BsoCsvColumn.CODE.getName())).thenReturn(code);
        when(mockCsvRecord.get(BsoCsvColumn.COST_CENTER.getName())).thenReturn(costCenter);
        when(mockCsvRecord.get(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(companyCode);
        when(mockCsvRecord.get(BsoCsvColumn.IS_DELIVERY.getName())).thenReturn(isDelivery);
        when(mockCsvRecord.isSet(BsoCsvColumn.CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COMPANY_CODE.getName())).thenReturn(true);
        when(mockCsvRecord.isSet(BsoCsvColumn.COST_CENTER.getName())).thenReturn(true);

        assertDoesNotThrow(() -> this.cut.checkContent(mockCsvRecord));
    }

    @Test
    @DisplayName("validateUnitKeyLength: Assertion false with valid string")
    void isvalidateUnitKeyLength() {
        assertFalse(this.cut.validateUnitKeyLength("ABCD"));
    }

    @Test
    @DisplayName("validateUnitKeyLength: Assertion false with valid string")
    void validateUnitKeyLengthTrue() {
        assertTrue(this.cut.validateUnitKeyLength("ABCD1234567"));
    }

    @Test
    @DisplayName("validateServiceOrgLength: Assertion false with valid code")
    void isvalidateServiceOrgLength() {
        assertFalse(this.cut.validateServiceOrgLength("ABCD"));
    }

    @Test
    @DisplayName("validateServiceOrgLength: Assertion true with invalid code")
    void validateServiceOrgLengthTrue() {
        assertTrue(this.cut.validateServiceOrgLength("ABCD12"));
    }

    @Test
    @DisplayName("validateBooleanInput: Assertion false with valid boolean value")
    void isvalidateBooleanInput() {
        assertFalse(this.cut.validateBooleanInput("X"));
    }

    @Test
    @DisplayName("validateBooleanInput: Assertion true with invalid boolean value in length")
    void validateBooleanInputTrue() {
        assertTrue(this.cut.validateBooleanInput("AB"));
    }

    @Test
    @DisplayName("validateBooleanInput: Assertion true with invalid boolean value")
    void validateBooleanInputInvalid() {
        assertTrue(this.cut.validateBooleanInput("B"));
    }

    /**
     * return {@link InputStream} pointing to valid file
     * {@code src/test/resources/valid_skills.csv}
     *
     * @return valid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getValidFile() throws FileNotFoundException {
        return new FileInputStream(new File("src/test/resources/valid_serviceorg.csv"));
    }

    /**
     * return {@link InputStream} pointing to file
     * {@code src/test/resources/invalid_skills_header.csv} containing an invalid
     * header
     *
     * @return invalid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getInvalidHeaderFile() throws FileNotFoundException {
        return new FileInputStream(new File("src/test/resources/invalid_sorg_header.csv"));
    }

    /**
     * return {@link InputStream} pointing to file
     * {@code src/test/resources/invalid_sorg_content_empty.csv} containing an empty
     * column
     *
     * @return invalid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getInvalidContentEmptyFile() throws FileNotFoundException {
        return new FileInputStream(new File("src/test/resources/invalid_sorg_content_empty.csv"));
    }

    /**
     * return {@link InputStream} pointing to file
     * {@code src/test/resources/invalid_sorg_header.csv} containing a column that
     * is not set
     *
     * @return invalid csv file
     * @throws FileNotFoundException
     */
    private static InputStream getInvalidContentNotSetFile() throws FileNotFoundException {
        return new FileInputStream(new File("src/test/resources/invalid_sorg_content_notset.csv"));
    }

}
