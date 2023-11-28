package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.dao.ServiceOrgDAOImpl;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultBuilder;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultImpl;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.ProcessResourceOrganization;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.dao.ResourceOrganizationDAO;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.validations.CostCenterValidationImpl;

import com.sap.resourcemanagement.organization.*;
import com.sap.resourcemanagement.organization.Details;

public class ServiceOrgCsvImporterImplTest {

    public static final String CSV_FILE_PATH = "src/test/resources/valid_serviceorg.csv";
    public static final String CSV_MISMATCH_DESC = "src/test/resources/serviceorg_description.csv";
    public static final String CSV_MISSING_HEADER = "src/test/resources/missing_org_header.csv";

    /**
     * object under test
     */
    private ServiceOrgCsvImporter cut;
    private CsvConsistencyCheck mockConsistencyCheck;
    private CostCenterValidationImpl mockCostCenterValidation;
    private ServiceOrgDAOImpl mockDAO;

    private ProcessResourceOrganization mockProcessResourceOrganization;

    ImportResultBuilder mockResult = new ImportResultImpl();

    /** {@link CSVParser} to be used by object under test */
    @Mock
    private CSVParser mockCsvParser;
    private PersistenceService mockPersistenceService;
    private ResourceOrganizationDAO mockResourceOrganizationDAO;

    @BeforeEach
    public void beforeEach() {

        this.mockConsistencyCheck = mock(CsvConsistencyCheckImpl.class);
        this.mockCostCenterValidation = mock(CostCenterValidationImpl.class);
        this.mockDAO = mock(ServiceOrgDAOImpl.class);
        this.mockResult = mock(ImportResultImpl.class);
        this.mockProcessResourceOrganization = mock(ProcessResourceOrganization.class);
        this.mockResourceOrganizationDAO = mock(ResourceOrganizationDAO.class);
        this.mockPersistenceService = mock(PersistenceService.class, Mockito.RETURNS_DEEP_STUBS);

        this.cut = new ServiceOrgCsvImporterImpl(this.mockConsistencyCheck, this.mockDAO, this.mockCostCenterValidation,
                this.mockProcessResourceOrganization, this.mockResourceOrganizationDAO);
    }

    @Test
    @DisplayName("check if importStream() executes successfully if paramaters allow it to")
    public void importStreamOK() throws IOException {
        final InputStream csvStream = new FileInputStream(ServiceOrgCsvImporterImplTest.CSV_FILE_PATH);

        Result mockResult1 = mock(Result.class);
        Mockito.doNothing().when(mockCostCenterValidation).validateAllCostCenter(any(CSVRecord.class));
        List<Details> mockDetails = new ArrayList<>();
        List<Details> mockDetails1 = new ArrayList<>();
        mockDetails = mockCostCenterValidation.validateCostCenterData(mockDetails1, null);
        Mockito.doNothing().when(mockDAO).upsertNewServiceOrgHead(anySet());
        Mockito.doNothing().when(mockDAO).upsertNewServiceOrgDetails(anySet());
        Mockito.doNothing().when(mockConsistencyCheck).checkHeaders(anySet());
        Mockito.doNothing().when(mockConsistencyCheck).checkContent(any(CSVRecord.class));
        Mockito.doNothing().when(mockProcessResourceOrganization)
                .processServiceOrganizationToResourceOrganization(anySet(), anySet());

        ImportResult actual = this.cut.importStream(csvStream);

        final long actualErrors = actual.getErrors().size();
        final long actualCreatedItems = actual.getCreatedItems();
        assertEquals(0, actualErrors);
        assertEquals(2, actualCreatedItems);

        verify(this.mockCostCenterValidation, times(1)).validateCostCenterData(mockDetails1, null);
        verify(this.mockCostCenterValidation, times(2)).validateAllCostCenter(any(CSVRecord.class));

        verify(this.mockDAO, times(1)).upsertNewServiceOrgDetails(anySet());
        verify(this.mockDAO, times(1)).upsertNewServiceOrgHead(anySet());

        verify(this.mockConsistencyCheck, times(1)).checkHeaders(anySet());
        verify(this.mockConsistencyCheck, times(2)).checkContent(any(CSVRecord.class));
        verify(this.mockProcessResourceOrganization, times(1))
                .processServiceOrganizationToResourceOrganization(anySet(), anySet());

    }

    @Test
    @DisplayName("check if importStream() executes successfully if description differs for same service org code")
    public void importStreamMismatchDescOK() throws IOException {
        final InputStream csvStream = new FileInputStream(ServiceOrgCsvImporterImplTest.CSV_MISMATCH_DESC);

        Result mockResult1 = mock(Result.class);

        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult1);

        Mockito.doNothing().when(mockCostCenterValidation).validateAllCostCenter(any(CSVRecord.class));
        List<Details> mockDetails = new ArrayList<>();
        List<Details> mockDetails1 = new ArrayList<>();
        mockDetails = mockCostCenterValidation.validateCostCenterData(mockDetails1, null);

        Mockito.doNothing().when(mockDAO).upsertNewServiceOrgHead(anySet());
        Mockito.doNothing().when(mockDAO).upsertNewServiceOrgDetails(anySet());
        Mockito.doNothing().when(mockConsistencyCheck).checkHeaders(anySet());
        Mockito.doNothing().when(mockConsistencyCheck).checkContent(any(CSVRecord.class));
        Mockito.doNothing().when(mockProcessResourceOrganization)
                .processServiceOrganizationToResourceOrganization(anySet(), anySet());

        ImportResult actual = this.cut.importStream(csvStream);

        final long actualErrors = actual.getErrors().size();
        final long actualCreatedItems = actual.getCreatedItems();
        assertEquals(0, actualErrors);
        assertEquals(2, actualCreatedItems);

        verify(this.mockCostCenterValidation, times(1)).validateCostCenterData(mockDetails1, null);
        verify(this.mockCostCenterValidation, times(2)).validateAllCostCenter(any(CSVRecord.class));

        verify(this.mockDAO, times(1)).upsertNewServiceOrgDetails(anySet());
        verify(this.mockDAO, times(1)).upsertNewServiceOrgHead(anySet());

        verify(this.mockConsistencyCheck, times(1)).checkHeaders(anySet());
        verify(this.mockConsistencyCheck, times(2)).checkContent(any(CSVRecord.class));
        verify(this.mockProcessResourceOrganization, times(1))
                .processServiceOrganizationToResourceOrganization(anySet(), anySet());

    }

    @Test
    @DisplayName("check if importStream() propagates IOExceptions thrown by provided InputStream")
    public void importStreamIOException() throws IOException {
        final IOException e = new IOException("unit-test-io-exception");
        final InputStream csvStream = mock(InputStream.class);
        when(csvStream.available()).thenThrow(e);
        assertThrows(IOException.class, () -> {
            this.cut.importStream(csvStream);
        });
    }

    @Test
    @DisplayName("check if importStream() propagates IOExceptions thrown by provided InputStream")
    public void importStreamIOExceptionMissingHeader() throws IOException {

        final InputStream csvStream = new FileInputStream(ServiceOrgCsvImporterImplTest.CSV_MISSING_HEADER);

        Mockito.doThrow(ServiceException.class).when(mockConsistencyCheck).checkHeaders(anySet());
        ImportResult actual = this.cut.importStream(csvStream);

        final long actualErrors = actual.getErrors().size();
        final long actualCreatedItems = actual.getCreatedItems();
        assertEquals(1, actualErrors);
        assertEquals(0, actualCreatedItems);

        verify(this.mockDAO, times(0)).upsertNewServiceOrgDetails(anySet());
        verify(this.mockDAO, times(0)).upsertNewServiceOrgHead(anySet());
    }

}
