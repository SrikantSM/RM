package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.availabilityservice.CsvInputValidator;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationStatus;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary_;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;
import com.sap.resourcemanagement.resource.Capacity_;

public class AvailabilityCsvImporterTest extends InitMocks {

    private static final String CSV_FILE_PATH = "src/test/resources/valid_availability.csv";
    private static final String CSV_FILE_USAGE_INVALID_HEADER = "src/test/resources/invalid_availability_header.csv";

    /**
     * object under test
     */
    private AvailabilityCsvImporterImpl cut;
    private AvailabilityCsvImporterImpl spyCut;
    private List<AvailabilityReplicationView> testSummary = new ArrayList<>();
    private List<AvailabilityReplicationStatus> testReplicationSuccessStatus = new ArrayList<>();
    private AvailabilityCsvConsistencyCheck mockConsistencyCheck;

    public static final String RESOURCE_ID = "07822776-8132-4212-b402-ee51dc38a97c";
    public static final String WORKFORCEPERSON_ID = "";
    public static final String FIRSTNAME = "";
    public static final String LASTNAME = "";
    public static final String S4COSTCENTER_ID = "1010";
    public static final String WORKASSIGNMENTEXTERNAL_ID = "HR01";
    public static final String STARTDATE = "2020-01-01";
    public static final String ENDDATE = "2020-03-31";
    public static final int PLANNEDWORKINGHOURS = 8;
    public static final int NONWORKINGHOURS = 0;

    @Mock
    private AvailabilityService mockAvailabilityService;

    @Mock
    private CommonValidator mockCommonValidator;

    private CsvInputValidator validator;

    @BeforeEach
    public void beforeEach() {
        this.mockConsistencyCheck = new AvailabilityCsvConsistencyCheckImpl();
        this.validator = new CsvInputValidator(this.mockCommonValidator);
        initializeAvailabilitySummary();
        initializeAvailabilityReplicationStatus();
        when(mockAvailabilityService.fetchAvailabilitySummary(S4COSTCENTER_ID)).thenReturn(testSummary);
        when(mockAvailabilityService.getWorkAssignmentById(testSummary, "07822776-8132-4212-b402-ee51dc38a97c",
                S4COSTCENTER_ID)).thenReturn(testSummary.get(0));
        when(mockAvailabilityService.getAvailabilityResourceId(testSummary, "07822776-8132-4212-b402-ee51dc38a97c"))
                .thenReturn(testSummary.get(0));
        this.cut = new AvailabilityCsvImporterImpl(this.mockConsistencyCheck, this.validator,
                this.mockAvailabilityService);
        this.spyCut = Mockito.spy(this.cut);
    }

    @Test

    @DisplayName("check if importStream() executes successfully if paramaters allow it to")
    public void importStreamOK() throws IOException {
        final InputStream csvStream = new FileInputStream(AvailabilityCsvImporterTest.CSV_FILE_PATH);
        when(mockAvailabilityService.updateAssignment(any(CSVRecord.class), anyString(), anyString()))
                .thenReturn(testReplicationSuccessStatus.get(0));

        this.spyCut.importStream(csvStream, S4COSTCENTER_ID);

        final CqnDelete expectedCapacityDelete = Delete.from(Capacity_.class)
                .where(err -> err.resource_id().eq(RESOURCE_ID));

        final CqnDelete expectedSummaryDelete = Delete.from(AvailabilityReplicationSummary_.class)
                .where(err -> err.resourceId().eq(RESOURCE_ID));

        assertNotNull(expectedCapacityDelete.toString());
        assertNotNull(expectedSummaryDelete.toString());
    }

    @Test
    @DisplayName("check if importStream() propagates IOExceptions thrown by provided InputStream")
    public void importStreamIOException() throws IOException {
        final IOException e = new IOException("unit-test-io-exception");
        final InputStream csvStream = mock(InputStream.class);

        when(csvStream.available()).thenThrow(e);

        assertThrows(IOException.class, () -> {
            this.cut.importStream(csvStream, S4COSTCENTER_ID);
        });
    }

    @Test
    @DisplayName("check if ImportStream() is correctly handling ServiceException when availability summary master data not available.")
    public void importStreamException() throws FileNotFoundException {

        final InputStream csvStream = new FileInputStream(AvailabilityCsvImporterTest.CSV_FILE_PATH);
        when(mockAvailabilityService.fetchAvailabilitySummary(S4COSTCENTER_ID)).thenReturn(null);
        assertThrows(ServiceException.class, () -> {
            this.cut.importStream(csvStream, S4COSTCENTER_ID);
        }, "importStream() did not throw ServiceException when availability summary master data not available.");
    }

    @Test
    @DisplayName("check if ImportStream() is correctly handling ServiceException for invalid header.")
    public void importStreamInvalidHeader() throws FileNotFoundException {

        final InputStream csvStream = new FileInputStream(AvailabilityCsvImporterTest.CSV_FILE_USAGE_INVALID_HEADER);
        assertThrows(ServiceException.class, () -> {
            this.cut.importStream(csvStream, S4COSTCENTER_ID);
        }, "importStream() did not throw ServiceException when CSV file had invalid header.");
    }

    @Test
    @DisplayName("check if ImportStream() is correctly handling ServiceException for cost center null.")
    public void importStreamCostcenterIsNull() throws FileNotFoundException {

        final InputStream csvStream = new FileInputStream(AvailabilityCsvImporterTest.CSV_FILE_PATH);
        assertThrows(ServiceException.class, () -> {
            this.cut.importStream(csvStream, null);
        }, "importStream() did not throw ServiceException when cost center was null.");
    }

    @Test
    @DisplayName("check if IOException for resourceId null is handled correctly.")
    public void importStreamResourceIdIsNull() throws IOException {
        final IOException e = new IOException("unit-test-io-exception");
        final InputStream csvStream = mock(InputStream.class);
        when(mockAvailabilityService.getAvailabilityResourceId(testSummary, "07822776-8132-4212-b402-ee51dc38a97c"))
                .thenReturn(null);
        when(csvStream.available()).thenThrow(e);

        assertThrows(IOException.class, () -> {
            this.cut.importStream(csvStream, S4COSTCENTER_ID);
        });
    }

    private void initializeAvailabilitySummary() {
        testSummary = createTestEntities(1, i -> {
            AvailabilityReplicationView newSummary = AvailabilityReplicationView.create();
            newSummary.setResourceId(RESOURCE_ID);
            newSummary.setS4CostCenterId(S4COSTCENTER_ID);
            newSummary.setWorkAssignmentEndDate(ENDDATE);
            newSummary.setWorkAssignmentStartDate(STARTDATE);
            newSummary.setWorkAssignmentExternalId(WORKASSIGNMENTEXTERNAL_ID);
            newSummary.setWorkForcePersonExternalId("WRKFORCE1");
            newSummary.setIsBusinessPurposeCompleted(false);
            return newSummary;
        });
    }

    private void initializeAvailabilityReplicationStatus() {
        testReplicationSuccessStatus = createTestEntities(1, i -> {
            AvailabilityReplicationStatus status = AvailabilityReplicationStatus.create();
            status.setResourceId(RESOURCE_ID);
            status.setStartDate("2020-03-18");
            status.setWorkForcePersonExternalId("EMPH2R21905");
            status.setStatus("Success");
            return status;
        });
    }

    private static <T> List<T> createTestEntities(int numberOfTestEntities,
            Function<Integer, T> entityCreationFunction) {
        List<T> entities = new ArrayList<>();
        for (int i = 0; i < numberOfTestEntities; i++) {
            entities.add(entityCreationFunction.apply(i));
        }
        return entities;
    }
}
