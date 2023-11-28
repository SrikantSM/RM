package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.availabilityservice.dao.AvailabilityDAOImpl;
import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationStatus;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary_;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Capacity_;

public class AvailabilityServiceTest extends InitMocks {

    private List<AvailabilityReplicationView> testSummary = new ArrayList<>();
    private List<AvailabilityReplicationError> testError = new ArrayList<>();
    public static final String CSV_LINE_SEPARATOR = "\r\n";

    public static final String RESOURCE_ID = "07822776-8132-4212-b402-ee51dc38a97c";
    public static final String WORKFORCEPERSON_ID = "";
    public static final String FIRSTNAME = "";
    public static final String LASTNAME = "";
    public static final String S4COSTCENTER_ID = "101";
    public static final String WORKASSIGNMENTEXTERNAL_ID = "HR01";
    public static final String STARTDATE = "2020-01-01";
    public static final String ENDDATE = "2020-01-01";
    public static final int PLANNEDWORKINGHOURS = 8;
    public static final int NONWORKINGHOURS = 0;

    @Mock
    private AvailabilityDAOImpl availabilityDao;

    @Mock
    private CacheManager cacheManager;

    @Mock
    private CSVRecord mockCsvRecord;

    @Mock
    private PersistenceService mockPersistenceService;

    @Autowired
    @InjectMocks
    private AvailabilityService cut;

    /**
     * initialize object under test
     *
     * @throws IOException
     */
    @BeforeEach
    public void setUp() throws IOException {
        initializeAvailabilitySummary();
        initializeAvailabilityReplicationError();
        prepareMockObjects();
    }

    private void prepareMockObjects() {
        when(availabilityDao.fetchAvailabilityErrors("T001")).thenReturn(testError);
        when(availabilityDao.fetchAvailabilitySummary(S4COSTCENTER_ID)).thenReturn(testSummary);
    }

    @Test
    @DisplayName("Update Assignment test")
    public void updateAssignmentTest() throws IOException {
        String status = "Success";
        String wrkprs = "WRKPRS1";

        List<AvailabilityReplicationStatus> expectedAvailabilityReplicationstatus = createTestEntities(1, i -> {
            final AvailabilityReplicationStatus mockAvailability = AvailabilityReplicationStatus.create();
            mockAvailability.setResourceId("c22218a6-c594-4547-9853-ed2b14327bfc");
            mockAvailability.setWorkForcePersonExternalId("WRKPRS1");
            mockAvailability.setStartDate("2020-01-01");
            mockAvailability.setStatus(status);
            return mockAvailability;
        });

        when(mockCsvRecord.get(CapacityCsvColumn.WORKFORCEPERSON_ID.getName())).thenReturn("WRKPRS1");
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName()))
                .thenReturn("c22218a6-c594-4547-9853-ed2b14327bfc");
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn("2020-01-01");

        AvailabilityReplicationStatus resultAssignment = this.cut.updateAssignment(mockCsvRecord, wrkprs, status);

        assertEquals(resultAssignment, expectedAvailabilityReplicationstatus.get(0));
    }

    @Test
    @DisplayName("saveOrUpdateAvailabilitiesTest")
    public void saveOrUpdateAvailabilitiesTest() throws IOException {

        final String dateTime = "2020-01-01T00:00:00Z";
        String status = "Success";
        String costcenter = "T001";
        String resourceId = "1db4beff-a00d-4cd3-a130-f9f0e901c595";
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        final ZonedDateTime parsed = ZonedDateTime.parse(dateTime, formatter.withZone(ZoneId.of("UTC")));

        List<Capacity> capacties = createTestEntities(1, i -> {
            final Capacity capacity = Capacity.create();
            capacity.setResourceId(resourceId);
            capacity.setStartTime(parsed.toInstant());
            capacity.setWorkingTimeInMinutes(480);
            capacity.setPlannedNonWorkingTimeInMinutes(0);
            return capacity;
        });

        List<AvailabilityReplicationStatus> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationStatus mockAvailability = AvailabilityReplicationStatus.create();
            mockAvailability.setResourceId(resourceId);
            mockAvailability.setWorkForcePersonExternalId("WRKPRS1");
            mockAvailability.setStartDate("2020-01-01");
            mockAvailability.setStatus(status);
            return mockAvailability;
        });

        this.cut.saveOrUpdateAvailabilities(costcenter, capacties, assignments, testError);

        final CqnDelete expectedCapacityDelete = Delete.from(Capacity_.class)
                .where(err -> err.resource_id().eq(resourceId));

        final CqnDelete expectedSummaryDelete = Delete.from(AvailabilityReplicationSummary_.class)
                .where(err -> err.resourceId().eq(resourceId));

        assertNotNull(expectedCapacityDelete.toString());
        assertNotNull(expectedSummaryDelete.toString());

    }

    @Test
    @DisplayName("Test get work assignments by resourceId and costcenterId")
    public void getWorkAssignmentByIdTest() throws IOException {

        String s4CostCenterId = "T001";
        String resourceId = "1db4beff-a00d-4cd3-a130-f9f0e901c595";

        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setCostCenterId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setFirstName("Fname");
            mockAvailability.setLastName("Lname");
            mockAvailability.setAvailabilitySummaryStatusCode(0);
            mockAvailability.setResourceId(resourceId);
            mockAvailability.setS4CostCenterId(s4CostCenterId);
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-01");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            return mockAvailability;
        });

        AvailabilityReplicationView expectedSummary = this.cut.getWorkAssignmentById(assignments, resourceId,
                s4CostCenterId);

        assertNotNull(expectedSummary);
        assertEquals(expectedSummary, assignments.get(0));
    }

    @Test
    @DisplayName("Test get Availability Resource details by resourceId ")
    public void getAvailabilityResourceIdTest() throws IOException {

        String resourceId = "1db4beff-a00d-4cd3-a130-f9f0e901c595";

        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setCostCenterId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setFirstName("Fname");
            mockAvailability.setLastName("Lname");
            mockAvailability.setAvailabilitySummaryStatusCode(0);
            mockAvailability.setResourceId(resourceId);
            mockAvailability.setS4CostCenterId("T001");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-01");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            return mockAvailability;
        });

        AvailabilityReplicationView expectedSummary = this.cut.getAvailabilityResourceId(assignments, resourceId);

        assertNotNull(expectedSummary);
        assertEquals(expectedSummary, assignments.get(0));
    }

    @Test
    @DisplayName("Test to fetch Availability Summary for given costcenter")
    public void fetchAvailabilitySummary() throws IOException {

        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId(RESOURCE_ID);
            mockAvailability.setS4CostCenterId(S4COSTCENTER_ID);
            mockAvailability.setWorkAssignmentExternalId(WORKASSIGNMENTEXTERNAL_ID);
            mockAvailability.setWorkAssignmentStartDate(STARTDATE);
            mockAvailability.setWorkAssignmentEndDate(ENDDATE);
            return mockAvailability;
        });

        List<AvailabilityReplicationView> expectedSummaries = this.cut.fetchAvailabilitySummary(S4COSTCENTER_ID);

        assertNotNull(expectedSummaries);
        assertEquals(expectedSummaries.get(0), assignments.get(0));
    }

    private void initializeAvailabilitySummary() {
        testSummary = createTestEntities(1, i -> {
            AvailabilityReplicationView newSummary = AvailabilityReplicationView.create();
            newSummary.setResourceId(RESOURCE_ID);
            newSummary.setS4CostCenterId(S4COSTCENTER_ID);
            newSummary.setWorkAssignmentExternalId(WORKASSIGNMENTEXTERNAL_ID);
            newSummary.setWorkAssignmentStartDate(STARTDATE);
            newSummary.setWorkAssignmentEndDate(ENDDATE);
            return newSummary;
        });
    }

    private void initializeAvailabilityReplicationError() {
        String resourceId = "1db4beff-a00d-4cd3-a130-f9f0e901c595";
        testError = createTestEntities(1, i -> {
            AvailabilityReplicationError error = AvailabilityReplicationError.create();
            error.setResourceId(resourceId);
            error.setStartDate("2020-01-01");
            error.setErrorDesc("Some Error message");
            return error;
        });
    }

    public static <T> List<T> createTestEntities(int numberOfTestEntities,
            Function<Integer, T> entityCreationFunction) {
        List<T> entities = new ArrayList<>();
        for (int i = 0; i < numberOfTestEntities; i++) {
            entities.add(entityCreationFunction.apply(i));
        }
        return entities;
    }

}
