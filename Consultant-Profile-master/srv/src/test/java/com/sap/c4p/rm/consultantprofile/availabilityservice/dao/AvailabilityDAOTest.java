package com.sap.c4p.rm.consultantprofile.availabilityservice.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError_;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary_;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Capacity_;

public class AvailabilityDAOTest extends InitMocks {

    @Mock
    private PersistenceService mockPersistenceService;

    @Mock
    private Result mockResult;

    @Autowired
    @InjectMocks
    private AvailabilityDAOImpl cut;

    @Test
    @DisplayName("Find all availabilities for costcenter")
    public void fetchAvailabilitySummary() {
        // expected list of availability summaries
        List<AvailabilityReplicationView> expectedAvailabilitySummaries = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setCostCenterId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setFirstName("Fname");
            mockAvailability.setLastName("Lname");
            mockAvailability.setAvailabilitySummaryStatusCode(0);
            mockAvailability.setResourceId("c22218a6-c594-4547-9853-ed2b14327bfc");
            mockAvailability.setS4CostCenterId("T001");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-01");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            mockAvailability.setIsBusinessPurposeCompleted(false);
            return mockAvailability;
        });

        // mock result class to return the expected availability summaries
        when(mockResult.listOf(AvailabilityReplicationView.class)).thenReturn(expectedAvailabilitySummaries);

        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        // run method
        List<AvailabilityReplicationView> actualAvailabilitySummaries = cut.fetchAvailabilitySummary("T001");

        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

        // verify that the mocked list of availability summary is returned
        assertEquals(expectedAvailabilitySummaries, actualAvailabilitySummaries);
    }

    @Test
    @DisplayName("Find all availabilities for workforcepersonId")
    public void fetchWorkAssignmentsForEmployee() {
        // expected list of availability summaries
        List<AvailabilityReplicationView> expectedAvailabilitySummaries = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setCostCenterId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setFirstName("Fname");
            mockAvailability.setLastName("Lname");
            mockAvailability.setAvailabilitySummaryStatusCode(0);
            mockAvailability.setResourceId("c22218a6-c594-4547-9853-ed2b14327bfc");
            mockAvailability.setS4CostCenterId("T001");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-01");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            mockAvailability.setIsBusinessPurposeCompleted(false);
            return mockAvailability;
        });

        // mock result class to return the expected availability summaries
        when(mockResult.listOf(AvailabilityReplicationView.class)).thenReturn(expectedAvailabilitySummaries);

        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        // run method
        List<AvailabilityReplicationView> actualAvailabilitySummaries = cut.fetchWorkAssignmentsForEmployee("EXTN1");

        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

        // verify that the mocked list of availability summary is returned
        assertEquals(expectedAvailabilitySummaries, actualAvailabilitySummaries);
    }

    @Test
    @DisplayName("Find all availabilities for costcenter")
    public void fetchAvailabilitySummaryDownload() {
        // expected list of availability summaries
        List<AvailabilityDownloadView> expectedAvailabilitySummaries = createTestEntities(1, i -> {
            final AvailabilityDownloadView mockAvailability = AvailabilityDownloadView.create();
            mockAvailability.setCostCenterId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setFirstName("Fname");
            mockAvailability.setLastName("Lname");
            mockAvailability.setResourceId("c22218a6-c594-4547-9853-ed2b14327bfc");
            mockAvailability.setS4CostCenterId("T001");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-01");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            mockAvailability.setIsBusinessPurposeCompleted(false);
            return mockAvailability;
        });

        // mock result class to return the expected availability summaries
        when(mockResult.listOf(AvailabilityDownloadView.class)).thenReturn(expectedAvailabilitySummaries);

        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        // run method
        List<AvailabilityDownloadView> actualAvailabilitySummaries = cut.fetchAvailabilitySummaryDownload("T001");

        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

        // verify that the mocked list of availability summary is returned
        assertEquals(expectedAvailabilitySummaries, actualAvailabilitySummaries);
    }

    @Test
    @DisplayName("Try to get all availabilities for costcenter not exist")
    public void fetchAvailabilitySummaryDownloadEmpty() {
        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        // run method
        List<AvailabilityDownloadView> actualAvailabilitySummaries = cut.fetchAvailabilitySummaryDownload("T002");
        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
        // verify that the mocked list of availability summary is returned
        assertEquals(0, actualAvailabilitySummaries.size());
    }

    @Test
    @DisplayName("Find all availabilities for workforcepersonId")
    public void fetchWorkAssignmentsForEmployeeDownload() {
        // expected list of availability summaries
        List<AvailabilityDownloadView> expectedAvailabilitySummaries = createTestEntities(1, i -> {
            final AvailabilityDownloadView mockAvailability = AvailabilityDownloadView.create();
            mockAvailability.setCostCenterId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setFirstName("Fname");
            mockAvailability.setLastName("Lname");
            mockAvailability.setResourceId("c22218a6-c594-4547-9853-ed2b14327bfc");
            mockAvailability.setS4CostCenterId("T001");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-01");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            mockAvailability.setIsBusinessPurposeCompleted(false);
            return mockAvailability;
        });

        // mock result class to return the expected availability summaries
        when(mockResult.listOf(AvailabilityDownloadView.class)).thenReturn(expectedAvailabilitySummaries);

        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        // run method
        List<AvailabilityDownloadView> actualAvailabilitySummaries = cut
                .fetchWorkAssignmentsForEmployeeDownload("EXTN1");

        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

        // verify that the mocked list of availability summary is returned
        assertEquals(expectedAvailabilitySummaries, actualAvailabilitySummaries);
    }

    @Test
    @DisplayName("Find all availabilities for workforcepersonId not exist")
    public void fetchWorkAssignmentsForEmployeeDownloadEmpty() {
        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        // run method
        List<AvailabilityDownloadView> actualAvailabilitySummaries = cut
                .fetchWorkAssignmentsForEmployeeDownload("EXTN2");
        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
        // verify that the mocked list of availability summary is returned
        assertEquals(0, actualAvailabilitySummaries.size());
    }

    @Test
    @DisplayName("Find availabilities replication errors for cost center")
    public void fetchAvailabilityErrors() {
        // expected list of availability replication error
        List<AvailabilityReplicationError> expectedAvailabilityErrors = createTestEntities(1, i -> {
            final AvailabilityReplicationError mockReplicationError = AvailabilityReplicationError.create();
            mockReplicationError.setCsvRecordIndex("1");
            mockReplicationError.setInvalidKeys("false");
            mockReplicationError.setResourceId("1db4beff-a00d-4cd3-a130-f9f0e901c595");
            mockReplicationError.setS4costCenterId("T002");
            mockReplicationError.setWorkAssignmentExternalId("WORKASSIGNMENT2");
            mockReplicationError.setStartDate("2020-02-01");
            return mockReplicationError;
        });

        // mock result class to return the expected replication errors
        when(mockResult.listOf(AvailabilityReplicationError.class)).thenReturn(expectedAvailabilityErrors);

        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        // run method
        List<AvailabilityReplicationError> actualAvailabilityErrors = cut.fetchAvailabilityErrors("T002");

        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

        // verify that the mocked list of availability summary is returned
        assertEquals(expectedAvailabilityErrors, actualAvailabilityErrors);
    }

    @Test
    @DisplayName("saveOrUpdate Capacities")
    public void saveOrUpdateCapacity() {

        final String dateTime = "2020-01-01T00:00:00Z";
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        final ZonedDateTime parsed = ZonedDateTime.parse(dateTime, formatter.withZone(ZoneId.of("UTC")));

        List<Capacity> capacties = createTestEntities(1, i -> {
            final Capacity capacity = Capacity.create();
            capacity.setResourceId("1db4beff-a00d-4cd3-a130-f9f0e901c595");
            capacity.setStartTime(parsed.toInstant());
            capacity.setWorkingTimeInMinutes(480);
            capacity.setPlannedNonWorkingTimeInMinutes(0);
            return capacity;
        });

        final CqnInsert expectedInsert = Insert.into(Capacity_.class).entries(capacties);
        final ArgumentCaptor<CqnInsert> argumentInsert = ArgumentCaptor.forClass(CqnInsert.class);

        when(mockPersistenceService.run(any(Insert.class))).thenReturn(mockResult);

        this.cut.saveOrUpdate(capacties);
        verify(mockPersistenceService, times(1)).run(argumentInsert.capture());
        List<CqnInsert> capturedInsert = argumentInsert.getAllValues();
        assertEquals(expectedInsert.toString(), capturedInsert.get(0).toString());
    }

    @Test
    @DisplayName("saveOrUpdate AvailabiltyReplicationErrors")
    public void saveOrUpdateAvailabilityReplicationErrors() {

        List<AvailabilityReplicationError> errors = createTestEntities(1, i -> {
            final AvailabilityReplicationError mockReplicationError = AvailabilityReplicationError.create();
            mockReplicationError.setCsvRecordIndex("12");
            mockReplicationError.setInvalidKeys("false");
            mockReplicationError.setResourceId("7rd4beff-a00d-4cd3-a130-f9f0e901c766");
            mockReplicationError.setS4costCenterId("T003");
            mockReplicationError.setWorkAssignmentExternalId("WORKASSIGNMENT3");
            mockReplicationError.setStartDate("2020-03-03");
            return mockReplicationError;
        });

        final CqnInsert expectedInsert = Insert.into(AvailabilityReplicationError_.class).entries(errors);
        final ArgumentCaptor<CqnInsert> argumentInsert = ArgumentCaptor.forClass(CqnInsert.class);

        when(mockPersistenceService.run(any(Insert.class))).thenReturn(mockResult);

        this.cut.saveOrUpdateAvailabilityReplicationErrors(errors);
        verify(mockPersistenceService, times(1)).run(argumentInsert.capture());
        List<CqnInsert> capturedInsert = argumentInsert.getAllValues();
        assertEquals(expectedInsert.toString(), capturedInsert.get(0).toString());
    }

    @Test
    @DisplayName("Update AvailabiltyReplicationSummary status")
    public void updateAvailabilityReplicationSummary() {

        List<AvailabilityReplicationSummary> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationSummary mockAvailability = AvailabilityReplicationSummary.create();
            mockAvailability.setCostCenterId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setAvailabilitySummaryStatusCode(0);
            mockAvailability.setResourceId("c22218a6-c594-4547-9853-ed2b14327bfc");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-01");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            mockAvailability.setNoOfRecordsFailed(0);
            mockAvailability.setNoOfRecordsPassed(100);
            mockAvailability.setNoOfRecordsPassed(100);
            mockAvailability.setAvailabilitySummaryStatusCode(0);
            return mockAvailability;
        });
        final CqnUpdate expectedUpdate = Update.entity(AvailabilityReplicationSummary_.class).entries(assignments);
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);

        when(mockPersistenceService.run(any(Upsert.class))).thenReturn(mockResult);

        this.cut.updateAvailabilityReplicationSummary(assignments);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        List<CqnUpdate> capturedUpdate = argumentUpdate.getAllValues();
        assertEquals(expectedUpdate.toString(), capturedUpdate.get(0).toString());
    }

    @Test
    @DisplayName("Delete AvailabiltyReplicationErrors for given resourceId and startdate")
    public void deleteByResourceIdAndStartDate() {

        String resourceId = "7rd4beff-a00d-4cd3-a130-f9f0e901c766";
        String startDate = "2020-03-03";

        final CqnDelete expectedDelete = Delete.from(AvailabilityReplicationError_.class)
                .where(err -> err.resourceId().eq(resourceId).and(err.startDate().eq(startDate)));
        final ArgumentCaptor<CqnDelete> argumentUpsert = ArgumentCaptor.forClass(CqnDelete.class);

        when(mockPersistenceService.run(any(Delete.class))).thenReturn(mockResult);

        this.cut.deleteByResourceIdAndStartDate(resourceId, startDate);
        verify(mockPersistenceService, times(1)).run(argumentUpsert.capture());
        List<CqnDelete> capturedDelete = argumentUpsert.getAllValues();
        assertEquals(expectedDelete.toString(), capturedDelete.get(0).toString());
    }

    @Test
    @DisplayName("Delete AvailabiltyReplicationErrors for given resourceId")
    public void deleteByResourceId() {

        String resourceId = "7rd4beff-a00d-4cd3-a130-f9f0e901c766";

        final CqnDelete expectedDelete = Delete.from(AvailabilityReplicationError_.class)
                .where(err -> err.resourceId().eq(resourceId));
        final ArgumentCaptor<CqnDelete> argumentUpsert = ArgumentCaptor.forClass(CqnDelete.class);

        when(mockPersistenceService.run(any(Delete.class))).thenReturn(mockResult);

        this.cut.deleteByResourceId(resourceId);
        verify(mockPersistenceService, times(1)).run(argumentUpsert.capture());
        List<CqnDelete> capturedDelete = argumentUpsert.getAllValues();
        assertEquals(expectedDelete.toString(), capturedDelete.get(0).toString());
    }

    @Test
    @DisplayName("DeleteAll Capacities for given resourceId and startTime")
    public void deleteAllCapactiesByResourceIdAndStartTime() {

        String resourceId = "1db4beff-a00d-4cd3-a130-f9f0e901c596";

        final String dateTime = "2020-01-01T00:00:00Z";
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

        this.cut.deleteAllCapacities(capacties);
        verify(mockPersistenceService, times(1)).run(any(CqnDelete.class), anyList());
    }

    @Test
    @DisplayName("deleteAllCapacities: Invoked with empty key list")
    public void deleteAllCapactiesByResourceIdAndStartTime2() {
        List<Capacity> capacties = new ArrayList<>();
        when(mockPersistenceService.run(any(CqnDelete.class))).thenReturn(mockResult);
        this.cut.deleteAllCapacities(capacties);
        verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Count of Capacity Data for a resource")
    public void fetchCapacityDataCount() {

        final String dateTime = "2022-01-01T00:00:00Z";
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        final ZonedDateTime parsed = ZonedDateTime.parse(dateTime, formatter.withZone(ZoneId.of("UTC")));
        List<Capacity> capacities = createTestEntities(1, i -> {
            final Capacity capacity = Capacity.create();
            capacity.setResourceId("2db4beff-a00d-4cd3-a130-f9f0e901c595");
            capacity.setStartTime(parsed.toInstant());
            capacity.setWorkingTimeInMinutes(480);
            capacity.setPlannedNonWorkingTimeInMinutes(0);
            return capacity;
        });

        final CqnSelect expectedSelect = Select.from(Capacity_.class).columns(CQL.count().as(AvailabilityDAOImpl.COUNT))
                .where(b -> b.resource_id().eq("2db4beff-a00d-4cd3-a130-f9f0e901c595")
                        .and(b.get(AvailabilityDAOImpl.STARTTIME).between("2021-01-01", "2023-12-31")));

        long expectedResult = 1L;
        Result mockResult = mock(Result.class, Mockito.RETURNS_DEEP_STUBS);
        when(mockResult.single().get(AvailabilityDAOImpl.COUNT)).thenReturn(expectedResult);
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        Integer countActualDays = cut.fetchCapacityDataCount("2db4beff-a00d-4cd3-a130-f9f0e901c595", "2021-01-01",
                "2023-12-31");

        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1))
                .run(argThat((CqnSelect cqn) -> cqn.toString().equals(expectedSelect.toString())));
        assertEquals(Math.toIntExact(expectedResult), countActualDays);
    }

    @Test
    @DisplayName("Try to get all AvailabilityDownloadView for resource not exist")
    public void fetchWorkAssignmentsDatesForResourceEmpty() {
        // make mockPersistenceService return the mocked result on run()
        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        // run method
        List<AvailabilityDownloadView> actualAvailabilityDownloadView = cut.fetchWorkAssignmentsDatesForResource("2db4beff");
        // verify that run() has been called one time on the mocked persistence service
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
        // verify that the mocked list of availability download summary is returned
        assertEquals(0, actualAvailabilityDownloadView.size());
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
