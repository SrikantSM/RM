package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.validations;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.ResultBuilder;
import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.impl.RowImpl;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.dao.ServiceOrgDAO;

import com.sap.resourcemanagement.organization.CostCenters;
import com.sap.resourcemanagement.organization.Details;

public class CostCenterValidationImplTest extends InitMocks {

    PersistenceService mockPersistenceService;
    private List<CostCenters> mockCostCenters;
    private Result mockResult;
    private ServiceOrgDAO mockServiceOrgDAO;

    /** {@link CSVParser} to be used by object under test */
    private CSVParser csvParser;

    private CostCenterValidationImpl cut;

    private static final String DEFAULT_VALUE_X = "X";
    private static final String CODE_1 = "Org_1";
    private static final String UNIT_KEY_1 = "17101901";
    private static final String UNIT_TYPE_1 = "CS";
    private static final String CODE_2 = "Org_2";
    private static final String UNIT_KEY_2 = "17101902";
    private static final String UNIT_TYPE_2 = "CS";
    private static final String CODE_3 = "Org_3";
    private static final String UNIT_KEY_3 = "17101903";
    private static final String UNIT_TYPE_3 = "CS";
    private static final String UNIT_KEY_4 = "17101904";
    private static final String UNIT_TYPE_4 = "CS";

    @BeforeEach
    public void setUp() {
        this.mockPersistenceService = mock(PersistenceService.class, Mockito.RETURNS_DEEP_STUBS);
        this.mockServiceOrgDAO = mock(ServiceOrgDAO.class);
        this.cut = new CostCenterValidationImpl(this.mockPersistenceService, this.mockServiceOrgDAO);
    }

    @Test
    @DisplayName("try to validate valid costCenter in CSV record")
    public void validateAllOk() throws IOException {

        this.csvParser = CSVParser.parse(CostCenterValidationImplTest.getValidFile(), StandardCharsets.UTF_8,
                CSVFormat.RFC4180.withFirstRecordAsHeader());

        Map<String, Object> mockData1 = new HashMap<String, Object>();
        mockData1.put(CostCenters.ID, "6d3c2467-a45b-4a0a-b196-4422ab737a9e");
        mockData1.put(CostCenters.COST_CENTER_ID, "0010101301");
        mockData1.put(CostCenters.COMPANY_CODE, "1010");
        mockData1.put(CostCenters.CONTROLLING_AREA, "A000");
        Row mockRow1 = RowImpl.row(mockData1);

        Map<String, Object> mockData2 = new HashMap<String, Object>();
        mockData2.put(CostCenters.ID, "6d3c2467-a45b-4a0a-b196-5533ab737a9e");
        mockData2.put(CostCenters.COST_CENTER_ID, "0010101751");
        mockData2.put(CostCenters.COMPANY_CODE, "1010");
        mockData2.put(CostCenters.CONTROLLING_AREA, "A000");
        Row mockRow2 = RowImpl.row(mockData2);

        List<Row> rows = new ArrayList<>();
        rows.add(mockRow1);
        rows.add(mockRow2);
        mockResult = ResultBuilder.insertedRows(rows).result();
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        this.cut.init();

        this.cut.validateAllCostCenter(this.csvParser.getRecords().get(0));
        verify(mockPersistenceService, times(2)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("try to validate invalid costCenter in CSV record throws service exception")
    public void validateAllInvalid() throws IOException {

        this.csvParser = CSVParser.parse(CostCenterValidationImplTest.getValidFile(), StandardCharsets.UTF_8,
                CSVFormat.RFC4180.withFirstRecordAsHeader());

        Map<String, Object> mockData1 = new HashMap<String, Object>();
        mockData1.put(CostCenters.ID, "6d3c2467-a45b-4a0a-b196-4422ab737a9e");
        mockData1.put(CostCenters.COST_CENTER_ID, "10011901");
        mockData1.put(CostCenters.COMPANY_CODE, "1001");
        mockData1.put(CostCenters.CONTROLLING_AREA, "A000");
        Row mockRow1 = RowImpl.row(mockData1);
        List<Row> rows = new ArrayList<>();
        rows.add(mockRow1);
        mockResult = ResultBuilder.insertedRows(rows).result();
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        this.cut.init();

        assertThrows(ServiceException.class, () -> {
            this.cut.validateAllCostCenter(this.csvParser.getRecords().get(0));
        });
    }

    @Test
    @DisplayName("try to validate duplicate costCenter with empty organization details")
    public void validateDuplicateEmpty() throws IOException {

        List<Details> mockDetailsEmpty = new ArrayList<>();
        Result mockResult1 = mock(Result.class);
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult1);

        this.cut.validateCostCenterData((List<Details>) mockDetailsEmpty, null);
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Validate duplicate costCenter in organization DB details with single record")
    public void validateDuplicateDBOk() throws IOException {

        List<Details> mockDetails = new ArrayList<>();
        List<Details> mockResults = new ArrayList<>();

        mockDetails.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));

        Result mockResult1 = mock(Result.class);
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult1);
        mockResults = this.cut.validateCostCenterData((List<Details>) mockDetails, null);
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Validate duplicate costCenter in organization DB details with single record")
    public void validateDuplicateDBInvalid() throws IOException {

        Details mockDetails = CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1);

        List<Details> mockDetails1 = new ArrayList<>();
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_1, UNIT_TYPE_1));
        mockDetails = this.cut.validateDuplicateCostCenterForDBData(mockDetails, mockDetails1);
        assertEquals(mockDetails.getCode(), CODE_2);
        assertEquals(mockDetails.getUnitKey(), UNIT_KEY_1);
        assertEquals(mockDetails.getUnitType(), UNIT_TYPE_1);
    }

    @Test
    @DisplayName("Validate duplicate costCenter in organization DB details with single record")
    public void validateDuplicateCSVInvalid() throws IOException {

        Details mockDetails1 = CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1);
        Details mockDetails2 = CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_1, UNIT_TYPE_1);

        Result mockResult1 = mock(Result.class);
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult1);

        this.cut.validateDuplicateCostCenterForInputData(mockDetails1);

        assertThrows(ServiceException.class, () -> {
            this.cut.validateDuplicateCostCenterForInputData(mockDetails2);
        });
    }

    @Test
    @DisplayName("Validate resource request check is executed and doesnt throw an error")
    public void validateCostCenterForResourceRequestData() throws IOException {

        Details mockDetails1 = CostCenterValidationImplTest.createTestOrgDetail(CODE_3, UNIT_KEY_3, UNIT_TYPE_1);
        List<Details> dbCostCenterData = new ArrayList<>();

        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_3, UNIT_KEY_3, UNIT_TYPE_1));

        Result mockResult1 = mock(Result.class);
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult1);

        assertDoesNotThrow(() -> {
            this.cut.validateCostCenterForResourceRequestData(mockDetails1, dbCostCenterData);
        });
    }

    @Test
    @DisplayName("Validate resource request check is executed and doesnt throw an error")
    public void validateInitialCostCenterData() throws IOException {

        List<Details> mockDetails1 = new ArrayList<>();
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_2, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_3, UNIT_KEY_3, UNIT_TYPE_1));
        Result mockResult1 = mock(Result.class);
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult1);

        assertDoesNotThrow(() -> {
            this.cut.validateInitialCostCenterData(mockDetails1, any());
        });
    }

    @Test
    @DisplayName("Validate validateLastCostCenterForServiceOrganization check is executed and doesnt return erraneous record")
    public void validateLastCostCenterForServiceOrganizationWithoutErraneousRecord() {

        List<Details> mockDetails1 = new ArrayList<>();
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_2, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_3, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_4, UNIT_TYPE_1));

        List<Details> dbCostCenterData = new ArrayList<>();
        when(mockServiceOrgDAO.readAllServiceOrganizationDetails()).thenReturn(dbCostCenterData);

        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_1, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_2, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_3, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_4, UNIT_TYPE_1));

        List<Details> recordsToBeDeleted = this.cut.validateLastCostCenterForServiceOrganization(mockDetails1,
                dbCostCenterData);
        assertEquals(recordsToBeDeleted.size(), 0);

    }

    @Test
    @DisplayName("Validate validateLastCostCenterForServiceOrganization check is executed and returns erraneous record")
    public void validateLastCostCenterForServiceOrganizationWithErraneousRecord() throws IOException {

        List<Details> mockDetails1 = new ArrayList<>();
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_2, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_3, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_4, UNIT_TYPE_1));

        List<Details> dbCostCenterData = new ArrayList<>();
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_2, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_3, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_4, UNIT_TYPE_1));

        List<Details> recordsToBeDeleted = this.cut.validateLastCostCenterForServiceOrganization(mockDetails1,
                dbCostCenterData);
        assertEquals(recordsToBeDeleted.size(), 2);
        assertEquals(recordsToBeDeleted.get(0).getCode(), CODE_2);
        assertEquals(recordsToBeDeleted.get(0).getUnitKey(), UNIT_KEY_3);
        assertEquals(recordsToBeDeleted.get(0).getUnitType(), UNIT_TYPE_1);
        assertEquals(recordsToBeDeleted.get(1).getCode(), CODE_2);
        assertEquals(recordsToBeDeleted.get(1).getUnitKey(), UNIT_KEY_4);
        assertEquals(recordsToBeDeleted.get(1).getUnitType(), UNIT_TYPE_1);
    }

    @Test
    @DisplayName("Validate validateLastCostCenterForServiceOrganization check is executed and doesnt return erraneous record")
    public void removeRecordsFromTheList() {

        List<Details> mockDetails1 = new ArrayList<>();
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_2, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_3, UNIT_TYPE_1));
        mockDetails1.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_4, UNIT_TYPE_1));

        List<Details> dbCostCenterData = new ArrayList<>();
        when(mockServiceOrgDAO.readAllServiceOrganizationDetails()).thenReturn(dbCostCenterData);

        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_1, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_2, UNIT_KEY_2, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_3, UNIT_TYPE_1));
        dbCostCenterData.add(CostCenterValidationImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_4, UNIT_TYPE_1));

        List<Details> recordsToBeDeleted = this.cut.validateLastCostCenterForServiceOrganization(mockDetails1,
                dbCostCenterData);
        assertEquals(recordsToBeDeleted.size(), 0);

    }

    /**
     * create an active {@link Details} instance for Unit Testing
     *
     * @return {@link Details} instance for Unit Testing
     */
    private static Details createTestOrgDetail(String code, String unitKey, String unitType) {
        final Details detail = Struct.create(Details.class);
        detail.setCode(code);
        detail.setUnitKey(unitKey);
        detail.setUnitType(unitType);
        return detail;
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

}
