package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.CdsLockTimeoutException;
import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.auditlog.AuditChangeLog;
import com.sap.c4p.rm.projectintegrationadapter.enums.AssignmentEvents;

import com.sap.resourcemanagement.assignment.AssignmentBuckets;
import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.assignment.AssignmentsView;
import com.sap.resourcemanagement.integration.SupplySyncDetails;
import com.sap.resourcemanagement.resource.CapacityView;
import com.sap.resourcemanagement.resource.ResourceDetails;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;
import com.sap.resourcemanagement.supply.ResourceSupplyDetails;

public class AssignmentRepositoryTest {

  private PersistenceService mockPersistenceService;

  private AssignmentRepository cut;
  private AuditChangeLog mockAuditChangeLog;

  @BeforeEach
  public void setUp() {
    mockPersistenceService = mock(PersistenceService.class, Mockito.RETURNS_DEEP_STUBS);
    mockAuditChangeLog = mock(AuditChangeLog.class);
    cut = new AssignmentRepository(mockPersistenceService, mockAuditChangeLog);
  }

  @Nested
  @DisplayName("Unit tests for getResourceCapacities")
  public class GetResourceCapacitiesTest {

    @Test
    @DisplayName("Resource Capacity read by PersistenceService is correctly returned")
    public void getResourceCapacityReturnsRecordsReturnedByPersistenceService() {

      CapacityView mockCapacityViewResult1 = CapacityView.create();
      mockCapacityViewResult1.setResourceId("dummyResId1");

      CapacityView mockCapacityViewResult2 = CapacityView.create();
      mockCapacityViewResult2.setResourceId("dummyResId1");

      List<CapacityView> mockCapacityViewResultList = new ArrayList<>();
      mockCapacityViewResultList.add(mockCapacityViewResult1);
      mockCapacityViewResultList.add(mockCapacityViewResult2);

      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(CapacityView.class)).thenReturn(mockCapacityViewResultList);

      assertEquals(mockCapacityViewResultList, cut.getResourceCapacities("dummyResId1", Instant.now(), Instant.now()));
    }

    @Test
    @DisplayName("Resource Capacity read by PersistenceService is correctly returned")
    public void getResourceCapacityReturnsEmptyListIfNoCapacityFound() {

      List<CapacityView> mockCapacityViewResultList = Collections.emptyList();

      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(CapacityView.class)).thenReturn(mockCapacityViewResultList);

      assertEquals(mockCapacityViewResultList, cut.getResourceCapacities("dummyResId1", Instant.now(), Instant.now()));
    }

  }

  @Nested
  @DisplayName("Unit tests for insertAssignmentAndSupply")
  public class InsertAssignmentAndSupplyTest {

    @Test
    @DisplayName("Both Assignments and ResourceSupply always get inserted together")
    public void assignmentsAndSupplyAreInsertedTogether() {
      cut.insertAssignmentAndSupply(Assignments.create(), "dummyResourceSupply");
      verify(mockPersistenceService, times(2)).run(any(CqnInsert.class));
    }

    @Test
    @DisplayName("Audit logs with correct parameters always get written on insert of Assignments and ResourceSupply")
    public void auditLogsWrittenOnAssignmentAndSupplyInsert() {
      cut.insertAssignmentAndSupply(Assignments.create(), "dummyResourceSupply");
      verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(eq("Assignment"),
          eq("Job Scheduler Assignment"), any(), eq(AssignmentEvents.ASSIGNMENT_CREATION));
    }
  }

  @Nested
  @DisplayName("Unit tests for getExistingAssignmentsForS4Demand")
  public class GetExistingAssignmentsForS4DemandTest {

    @Test
    @DisplayName("Existing Assignments read by PersistenceService is correctly returned")
    public void getExistingAssignmentsForS4DemandReturnsRecordsReturnedByPersistenceService() {

      ResourceSupplyDetails mockAssignmentResult1 = ResourceSupplyDetails.create();
      mockAssignmentResult1.setAssignmentId("dummyAsgnId1");

      ResourceSupplyDetails mockAssignmentResult2 = ResourceSupplyDetails.create();
      mockAssignmentResult2.setAssignmentId("dummyAsgnId2");

      List<ResourceSupplyDetails> mockAssignmentResultList = new ArrayList<>();
      mockAssignmentResultList.add(mockAssignmentResult1);
      mockAssignmentResultList.add(mockAssignmentResult2);

      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(ResourceSupplyDetails.class)).thenReturn(mockAssignmentResultList);

      assertEquals(mockAssignmentResultList,
          cut.getExistingAssignmentsForS4Demand("demandExternalId", "workPackageId"));
    }

  }

  @Nested
  @DisplayName("Unit tests for deleteAssignment")
  public class DeleteAssignmentsForResourceSupplyTest {

    @Test
    @DisplayName("Deletion of assignment and supply successfully triggered for all assignments in list input")
    public void existingAssignmentsGetDeleted() {

      ResourceSupplyDetails mockAssignmentResult1 = ResourceSupplyDetails.create();
      mockAssignmentResult1.setAssignmentId("dummyAsgnId1");

      ResourceSupplyDetails mockAssignmentResult2 = ResourceSupplyDetails.create();
      mockAssignmentResult2.setAssignmentId("dummyAsgnId2");

      List<ResourceSupplyDetails> mockAssignmentResultList = new ArrayList<>();
      mockAssignmentResultList.add(mockAssignmentResult1);
      mockAssignmentResultList.add(mockAssignmentResult2);

      cut.deleteAssignmentsForResourceSupply(mockAssignmentResultList);
      verify(mockPersistenceService, times(4)).run(any(CqnDelete.class)); // 4 -> 2 for Assignment, 2 for Supply
    }

    @Test
    @DisplayName("Deletion is not invoked if input list is empty")
    public void deletionNotInvokedInCaseOfEmptyListInput() {

      List<ResourceSupplyDetails> mockAssignmentResultList = new ArrayList<>();

      cut.deleteAssignmentsForResourceSupply(mockAssignmentResultList);
      verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));
      verify(mockAuditChangeLog, times(0)).logDataModificationAuditMessage(eq("Assignment"),
          eq("Job Scheduler Assignment"), any(), eq(AssignmentEvents.ASSIGNMENT_DELETION));
    }

    @Test
    @DisplayName("Audit logs with correct parameters always get written for each deleted Assignment")
    public void auditLogsWrittenForEachDeletedAssignment() {
      ResourceSupplyDetails mockAssignmentResult1 = ResourceSupplyDetails.create();
      mockAssignmentResult1.setAssignmentId("dummyAsgnId1");

      ResourceSupplyDetails mockAssignmentResult2 = ResourceSupplyDetails.create();
      mockAssignmentResult2.setAssignmentId("dummyAsgnId2");

      List<ResourceSupplyDetails> mockAssignmentResultList = new ArrayList<>();
      mockAssignmentResultList.add(mockAssignmentResult1);
      mockAssignmentResultList.add(mockAssignmentResult2);

      cut.deleteAssignmentsForResourceSupply(mockAssignmentResultList);
      verify(mockAuditChangeLog, times(2)).logDataModificationAuditMessage(eq("Assignment"),
          eq("Job Scheduler Assignment"), any(), eq(AssignmentEvents.ASSIGNMENT_DELETION));
    }
  }

  @Nested
  @DisplayName("Unit tests for deleteAssignment")
  public class DeleteAssignmentsTest {

    @Test
    @DisplayName("Deletion of assignment and supply successfully triggered for all assignments in list input")
    public void existingAssignmentsGetDeleted() {

      Assignments mockAssignmentResult1 = Assignments.create();
      mockAssignmentResult1.setId("dummyAsgnId1");

      Assignments mockAssignmentResult2 = Assignments.create();
      mockAssignmentResult2.setId("dummyAsgnId2");

      List<Assignments> mockAssignmentResultList = new ArrayList<>();
      mockAssignmentResultList.add(mockAssignmentResult1);
      mockAssignmentResultList.add(mockAssignmentResult2);

      cut.deleteAssignments(mockAssignmentResultList);
      verify(mockPersistenceService, times(4)).run(any(CqnDelete.class)); // 4 -> 2 for Assignment, 2 for Supply
    }

    @Test
    @DisplayName("Deletion is not invoked if input list is empty")
    public void deletionNotInvokedInCaseOfEmptyListInput() {

      List<Assignments> mockAssignmentResultList = new ArrayList<>();

      cut.deleteAssignments(mockAssignmentResultList);
      verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));
      verify(mockAuditChangeLog, times(0)).logDataModificationAuditMessage(eq("Assignment"),
          eq("Job Scheduler Assignment"), any(), eq(AssignmentEvents.ASSIGNMENT_DELETION));
    }

    @Test
    @DisplayName("Audit logs with correct parameters always get written for each deleted Assignment")
    public void auditLogsWrittenForEachDeletedAssignment() {
      Assignments mockAssignmentResult1 = Assignments.create();
      mockAssignmentResult1.setId("dummyAsgnId1");

      Assignments mockAssignmentResult2 = Assignments.create();
      mockAssignmentResult2.setId("dummyAsgnId2");

      List<Assignments> mockAssignmentResultList = new ArrayList<>();
      mockAssignmentResultList.add(mockAssignmentResult1);
      mockAssignmentResultList.add(mockAssignmentResult2);

      cut.deleteAssignments(mockAssignmentResultList);
      verify(mockAuditChangeLog, times(2)).logDataModificationAuditMessage(eq("Assignment"),
          eq("Job Scheduler Assignment"), any(), eq(AssignmentEvents.ASSIGNMENT_DELETION));
    }
  }

  @Nested
  @DisplayName("Unit tests for deleteAssignment")
  public class DeleteAssignmentTest {

    @Test
    @DisplayName("Both supply and assignment always get deleted together")
    public void supplyAndAssignmentGetDeletedTogether() {
      cut.deleteAssignment("dummyAssignmentId");
      verify(mockPersistenceService, times(2)).run(any(CqnDelete.class));
    }

    @Test
    @DisplayName("Audit logs with correct parameters always get written on deletion of Assignments and ResourceSupply")
    public void auditLogsWrittenOnAssignmentAndSupplyDelete() {
      cut.deleteAssignment("dummyAssignmentId");
      verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(eq("Assignment"),
          eq("Job Scheduler Assignment"), any(), eq(AssignmentEvents.ASSIGNMENT_DELETION));
    }
  }

  @Nested
  @DisplayName("Unit tests for getResourceStaffedOnAssignment")
  public class GetResourceStaffedOnAssignmentTest {

    @Test
    @DisplayName("Existing staffed resource read by PersistenceService is correctly returned")
    public void existingStaffedResourceReadByPersistenceServiceIsReturned() {

      String resourceId = "resourceId";
      Assignments mockAssignment = Assignments.create();
      mockAssignment.setResourceId(resourceId);

      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(Assignments.class)).thenReturn(mockAssignment);

      assertEquals(resourceId, cut.getResourceStaffedOnAssignment("assignmentId"));

    }

  }

  @Nested
  @DisplayName("Unit tests for getResourceRequestDetails")
  public class GetResourceRequestDetailsTest {

    @Test
    @DisplayName("Request details read by PersistenceService is correctly returned")
    public void requestDetailsCorrectlyReturned() {
      Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      ResourceRequests expectedRequest = ResourceRequests.create();
      Optional<ResourceRequests> expectedResult = Optional.of(expectedRequest);
      when(mockResult.first(ResourceRequests.class)).thenReturn(expectedResult);

      assertEquals(expectedResult, cut.getResourceRequestDetails("dummyRequestId"));
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
    }

  }

  @Nested
  @DisplayName("Unit tests for getResourceRequestForDemand")
  public class GetResourceRequestForDemand {
    @Test
    @DisplayName("Resource Request Id for demand returned if present")
    public void resourceRequestIdReturnedIfPresent() {

      Row mockRequestId = mock(Row.class, RETURNS_DEEP_STUBS);
      mockRequestId.put("ID", "mockRequestId");
      Optional<Row> optionalMockRequestId = Optional.of(mockRequestId);
      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.first()).thenReturn(optionalMockRequestId);

      try {
        cut.getResourceRequestForDemand("demandExternalId", "workPackageId");
      } catch (NullPointerException e) {
        // unable to mock the chain of calls made to retrieve resource Id so testing if
        // the number of interactions with persistence service
      }
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Empty result returned if ResourceRequest for demand returned not present")
    public void emptyResultReturnedIfResourceRequestNotPresent() {

      ResourceRequests request = ResourceRequests.create();

      Optional<ResourceRequests> optionalEmptyMockRequestId = Optional.of(request);
      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.first(ResourceRequests.class)).thenReturn(optionalEmptyMockRequestId);

      assertEquals(optionalEmptyMockRequestId, cut.getResourceRequestForDemand("demandExternalId", "workPackageId"));
    }
  }

  @Nested
  @DisplayName("Unit tests for getExistingMonthlyAggregatedAssignments")
  public class GetExistingMonthlyAggregatedAssignmentsTest {

    public String demandExternalId = "demandExternalId";
    public String workPackageId = "workPackageId";
    public String resourceSupplyId = "resourceSupplyId";

    @Test
    @DisplayName("Empty list returned by getExistingMonthlyAggregatedAssignments if assignment does not exist")
    public void emptyListReturnedIfAssignmentDoesNotExist() {

      Optional<ResourceSupplyDetails> mockResult = Optional.empty();
      when(mockPersistenceService.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class)).thenReturn(mockResult);

      assertEquals(Collections.emptyList(),
          cut.getExistingMonthlyAggregatedAssignments(demandExternalId, workPackageId, resourceSupplyId));
    }

    @Test
    @DisplayName("Existing assignment monthly aggregated list correctly returned by getExistingMonthlyAggregatedAssignments")
    public void existingMonthlyAggregatedAssignmentCorrectlyReturned() {

      ResourceSupplyDetails mockResourceSupplyDetails = ResourceSupplyDetails.create();
      mockResourceSupplyDetails.setAssignmentId("123");
      Optional<ResourceSupplyDetails> mockResult = Optional.of(mockResourceSupplyDetails);

      Result mockResourceSupplyDetailsResult = mock(Result.class);
      when(mockResourceSupplyDetailsResult.first(ResourceSupplyDetails.class)).thenReturn(mockResult);

      List<AssignmentBucketsYearMonthAggregate> expectedList = new ArrayList<>();
      AssignmentBucketsYearMonthAggregate expectedAssignmentAggregatedRecord = AssignmentBucketsYearMonthAggregate
          .create();
      expectedAssignmentAggregatedRecord.setAssignmentId("123");
      expectedList.add(expectedAssignmentAggregatedRecord);
      Result mockAssignmentBucketsYearMonthAggregate = mock(Result.class);
      when(mockAssignmentBucketsYearMonthAggregate.listOf(AssignmentBucketsYearMonthAggregate.class))
          .thenReturn(expectedList);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResourceSupplyDetailsResult)
          .thenReturn(mockAssignmentBucketsYearMonthAggregate);

      assertEquals(expectedList,
          cut.getExistingMonthlyAggregatedAssignments(demandExternalId, workPackageId, resourceSupplyId));
    }

  }

  @Nested
  @DisplayName("Unit tests for getExistingAssignmentDetails")
  public class GetExistingAssignmentDetailsTest {

    public String demandExternalId = "demandExternalId";
    public String workPackageId = "workPackageId";
    public String resourceSupplyId = "resourceSupplyId";

    @Test
    @DisplayName("Empty optional returned by getExistingAssignmentDetails if assignment does not exist")
    public void emptyOptionalReturnedIfAssignmentDoesNotExist() {

      Optional<ResourceSupplyDetails> mockResult = Optional.empty();
      when(mockPersistenceService.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class)).thenReturn(mockResult);

      assertEquals(Optional.empty(),
          cut.getExistingAssignmentDetails(demandExternalId, workPackageId, resourceSupplyId));
    }

    @Test
    @DisplayName("Existing assignment correctly returned by getExistingAssignmentDetails")
    public void existingAssignmentCorrectlyReturned() {

      ResourceSupplyDetails mockResourceSupplyDetails = ResourceSupplyDetails.create();
      mockResourceSupplyDetails.setAssignmentId("123");
      Optional<Object> mockResult = Optional.of(mockResourceSupplyDetails);

      AssignmentsView expectedAssignmentsViewResult = AssignmentsView.create();
      expectedAssignmentsViewResult.setAssignmentId("123");
      Optional<Object> expectedDbResult = Optional.of(expectedAssignmentsViewResult);
      when(mockPersistenceService.run(any(CqnSelect.class)).first(any())).thenReturn(mockResult)
          .thenReturn(expectedDbResult);

      assertEquals(expectedDbResult,
          cut.getExistingAssignmentDetails(demandExternalId, workPackageId, resourceSupplyId));
    }

  }

  // getAssignmentBucketsForPeriod
  @Nested
  @DisplayName("Unit tests for getAssignmentBucketsForPeriod")
  public class GetAssignmentBucketsForPeriodTest {

    private String assignment_ID;

    private Instant startTime;

    private Instant endTime;

    private AssignmentBuckets assignmentBuckets;

    @Test
    @DisplayName("Test for GetAssignmentBucketsForPeriod success scenario")
    public void successfulGetAssignmentBucketsForPeriodTest() {

      assignmentBuckets = AssignmentBuckets.create();

      List<AssignmentBuckets> abList = new ArrayList<>();

      abList.add(assignmentBuckets);

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.listOf(AssignmentBuckets.class)).thenReturn(abList);

      List<AssignmentBuckets> abActualList = cut.getAssignmentBucketsForPeriod(assignment_ID, startTime, endTime);

      verify(mockPersistenceService).run(any(CqnSelect.class));

      assertEquals(abList, abActualList);

    }

  }

  // deleteAssignmentBuckets
  @Nested
  @DisplayName("Unit tests for deleteAssignmentBuckets")
  public class DeleteAssignmentBucketsTest {

    public List<AssignmentBuckets> bucketsToDelete;

    public List<String> bucketsToDeleteIdList;

    @Test
    @DisplayName("Test for deleteAssignmentBuckets success scenario")
    public void successfulDeleteAssignmentBucketsTest1() {

      List<AssignmentBuckets> bucketsToDelete = new ArrayList<>();
      AssignmentBuckets dummyBucket = AssignmentBuckets.create();
      dummyBucket.setId("1");
      dummyBucket.setStartTime(Instant.now());
      bucketsToDelete.add(dummyBucket);

      cut.deleteAssignmentBuckets(bucketsToDelete);

      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Test for deleteAssignmentBuckets with empty parameters")
    public void successfulDeleteAssignmentBucketsTest2() {

      List<AssignmentBuckets> bucketsToDelete = new ArrayList<>();

      cut.deleteAssignmentBuckets(bucketsToDelete);

      verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

    }

  }

  // insertAssignmentBuckets
  @Nested
  @DisplayName("Unit tests for insertAssignmentBuckets")
  public class InsertAssignmentBucketsTest {

    public List<AssignmentBuckets> bucketsToInsert;

    @Test
    @DisplayName("Test for insertAssignmentBuckets success scenario")
    public void successfulInsertAssignmentBucketsTest() {

      List<AssignmentBuckets> bucketsToInsert = new ArrayList<>();
      AssignmentBuckets bucket = AssignmentBuckets.create();
      bucket.setId("bucketId");
      bucket.setStartTime(Instant.now());
      bucketsToInsert.add(bucket);
      cut.insertAssignmentBuckets(bucketsToInsert);

      verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));
    }

    @Test
    @DisplayName("Test for insertAssignmentBuckets success scenario")
    public void exceptionRaisedOnLockFailure() {

      List<AssignmentBuckets> bucketsToInsert = new ArrayList<>();
      AssignmentBuckets bucket = AssignmentBuckets.create();
      bucket.setId("bucketId");
      bucket.setStartTime(Instant.now());
      bucketsToInsert.add(bucket);

      AssignmentsView dummyAsgnView = AssignmentsView.create();
      dummyAsgnView.setResourceId("resourceId");
      dummyAsgnView.setStartTime(Instant.now());
      dummyAsgnView.setEndTime(Instant.now());
      Optional<AssignmentsView> dummyAsgnViewOptional = Optional.of(dummyAsgnView);

      Result dummyResult = mock(Result.class, RETURNS_DEEP_STUBS);
      when(dummyResult.first(AssignmentsView.class)).thenReturn(dummyAsgnViewOptional);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(dummyResult)
          .thenThrow(CdsLockTimeoutException.class);

      assertThrows(ServiceException.class, () -> cut.insertAssignmentBuckets(bucketsToInsert));
    }

    @Test
    @DisplayName("Empty bucket list insertAssignmentBuckets leads to no side effects")
    public void emptyInsertAssignmentBucketsTest() {
      List<AssignmentBuckets> bucketsToInsert = new ArrayList<>();
      cut.insertAssignmentBuckets(bucketsToInsert);
      verifyNoInteractions(mockPersistenceService);
    }

  }

  // deleteDemandFromSupplySyncTable
  @Nested
  @DisplayName("Unit tests for deleteDemandFromSupplySyncTable")
  public class DeleteDemandFromSupplySyncTableTest {

    public SupplySyncDetails demand;

    @Test
    @DisplayName("Test for deleteDemandFromSupplySyncTable success scenario")
    public void successfulDeleteDemandFromSupplySyncTableTest() {

      demand = SupplySyncDetails.create();

      cut.deleteDemandFromSupplySyncTable(demand);

      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

  }

  // deleteAssignmentsForResourceRequests
  @Nested
  @DisplayName("Unit tests for deleteAssignmentsForResourceRequests")
  public class DeleteAssignmentsForResourceRequestsTest {

    public String resourceRequestId;

    @Test
    @DisplayName("Test for deleteAssignmentsForResourceRequests for request with no assignments")
    public void successfulDeleteDemandFromSupplySyncTableTest1() {

      resourceRequestId = null;

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      cut.deleteAssignmentsForResourceRequests(resourceRequestId);

      verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Test for deleteAssignmentsForResourceRequests for request with assignments")
    public void successfulDeleteDemandFromSupplySyncTableTest2() {

      List<Assignments> assignmentsToDeleteList = new ArrayList<>();
      Assignments dummyAssignment = Assignments.create();
      dummyAssignment.setId("assignmentId");
      dummyAssignment.setResourceRequestId("resourceRequestId");
      assignmentsToDeleteList.add(dummyAssignment);

      AssignmentsView dummyAsgnView = AssignmentsView.create();
      dummyAsgnView.setResourceId("resourceId");
      dummyAsgnView.setStartTime(Instant.now());
      dummyAsgnView.setEndTime(Instant.now());
      Optional<AssignmentsView> dummyAsgnViewOptional = Optional.of(dummyAsgnView);

      Result assignmentListResult = mock(Result.class, RETURNS_DEEP_STUBS);
      when(assignmentListResult.listOf(Assignments.class)).thenReturn(assignmentsToDeleteList);

      Result assignmentViewResult = mock(Result.class, RETURNS_DEEP_STUBS);
      when(assignmentViewResult.first(AssignmentsView.class)).thenReturn(dummyAsgnViewOptional);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(assignmentListResult)
          .thenReturn(assignmentViewResult);

      cut.deleteAssignmentsForResourceRequests("resourceRequestId");

      verify(mockPersistenceService, times(3)).run(any(CqnDelete.class));

    }

  }

  @Nested
  @DisplayName("getAssignmentForResourceAndRequest")
  public class GetAssignmentForResourceAndRequestTest {

    public String resourceId;

    public String requestId;

    @Test
    @DisplayName("Test for successful GetAssignmentForResourceAndRequest")
    public void successfulGetAssignmentForResourceAndRequestTest() {

      resourceId = null;

      requestId = null;

      Result expectedResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(expectedResult);

      Assignments assignment = Assignments.create();
      Optional<Assignments> assignmentResult = Optional.of(assignment);

      when(expectedResult.first(Assignments.class)).thenReturn(assignmentResult);

      final Optional<Assignments> ReturnedResult = cut.getAssignmentForResourceAndRequest(resourceId, requestId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(assignmentResult, ReturnedResult);

    }

  }

  @Nested
  @DisplayName("Test for getRMDemandIdsToQuerySupplyFor")
  public class GetRMDemandIdsToQuerySupplyForTest {

    public List<SupplySyncDetails> supplySync;

    @Test
    @DisplayName("Successful getRMDemandIdsToQuerySupplyFor Test ")
    public void successfulGetRMDemandIdsToQuerySupplyForTest() {

      List<SupplySyncDetails> supplySync = new ArrayList<>();

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.listOf(SupplySyncDetails.class)).thenReturn(supplySync);

      final List<SupplySyncDetails> supplySyncReturned = cut.getRMDemandIdsToQuerySupplyFor();

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(supplySync, supplySyncReturned);

    }

  }

  @Test
  void updateAssignmentBucketsLogsAuditMessage() {

    List<AssignmentBuckets> bucketsToInsert = new ArrayList<>();
    List<AssignmentBuckets> bucketsToDelete = new ArrayList<>();

    cut.updateAssignmentBuckets("assignmentId", bucketsToInsert, bucketsToDelete);

    verify(mockAuditChangeLog).logDataModificationAuditMessage(any(), any(), any(), any());

  }

  @Test
  void getResourceRequestIdForS4DemandReturnsCorrectId() {

    String mockRequestId = "mockRequestId";
    Optional<String> expectedResult = Optional.of(mockRequestId);

    ResourceRequests mockResourceRequest = ResourceRequests.create();
    mockResourceRequest.setId(mockRequestId);

    Optional<ResourceRequests> mockOptional = Optional.of(mockResourceRequest);

    Result mockResult = mock(Result.class);
    when(mockResult.first(ResourceRequests.class)).thenReturn(mockOptional);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    assertEquals(expectedResult, cut.getResourceRequestIdForS4Demand("demand", "wp"));
  }

  @Test
  void getResourceRequestIdForS4DemandReturnsEmptyOptionalIfRequestNotFound() {

    Optional<ResourceRequests> mockOptional = Optional.ofNullable(null);

    Result mockResult = mock(Result.class);
    when(mockResult.first(ResourceRequests.class)).thenReturn(mockOptional);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<String> expectedResult = Optional.empty();

    assertEquals(expectedResult, cut.getResourceRequestIdForS4Demand("demand", "wp"));
  }

  @Test
  void getAllAssignmentsForS4DemandReturnsCorrectResult() {

    String mockRequestId = "mockRequestId";

    ResourceRequests mockResourceRequest = ResourceRequests.create();
    mockResourceRequest.setId(mockRequestId);

    Optional<ResourceRequests> mockOptional = Optional.of(mockResourceRequest);

    List<Assignments> expectedList = new ArrayList<>();
    Result mockExpectedList = mock(Result.class);
    when(mockExpectedList.listOf(Assignments.class)).thenReturn(expectedList);

    Result mockResult = mock(Result.class);
    when(mockResult.first(ResourceRequests.class)).thenReturn(mockOptional);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockExpectedList);

    assertEquals(expectedList, cut.getAllAssignmentsForS4Demand("demand", "wp"));
  }

  @Test
  void getAllAssignmentsForS4DemandReturnsEmptyResultIfRequestNotFound() {

    Optional<ResourceRequests> mockOptional = Optional.ofNullable(null);

    List<Assignments> expectedList = Collections.emptyList();
    Result mockExpectedList = mock(Result.class);
    when(mockExpectedList.listOf(Assignments.class)).thenReturn(expectedList);

    Result mockResult = mock(Result.class);
    when(mockResult.first(ResourceRequests.class)).thenReturn(mockOptional);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockExpectedList);

    assertEquals(expectedList, cut.getAllAssignmentsForS4Demand("demand", "wp"));
  }

  @Test
  void getResourceForWorkforcePersonUserIDReturnsCorrectResult() {

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    Optional<ResourceDetails> expectedResourceDetails = Optional.of(mockResourceDetails);

    Result mockResult = mock(Result.class);
    when(mockResult.first(ResourceDetails.class)).thenReturn(expectedResourceDetails);

    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    assertEquals(expectedResourceDetails, cut.getResourceForWorkforcePersonUserID("workForcePersonUserId"));
  }

  @Test
  void getAssignmentAggregateDetailsReturnsCorrectResult() {

    AssignmentsView mockAssignmentsView = AssignmentsView.create();
    Optional<AssignmentsView> expectedResult = Optional.of(mockAssignmentsView);

    Result mockResult = mock(Result.class);
    when(mockResult.first(AssignmentsView.class)).thenReturn(expectedResult);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    assertEquals(expectedResult, cut.getAssignmentAggregateDetails("assignmentId"));
  }

  @Test
  void getExistingMonthlyAggregatedAssignmentsReturnsCorrectResult() {

    List<AssignmentBucketsYearMonthAggregate> expectedList = new ArrayList<>();

    Result mockResult = mock(Result.class);
    when(mockResult.listOf(AssignmentBucketsYearMonthAggregate.class)).thenReturn(expectedList);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    assertEquals(expectedList, cut.getExistingMonthlyAggregatedAssignments("assignmentId"));
  }

  @Test
  void getAssignmentBucketsReturnsCorrectResult() {

    List<AssignmentBuckets> expectedList = new ArrayList<>();

    Result mockResult = mock(Result.class);
    when(mockResult.listOf(AssignmentBuckets.class)).thenReturn(expectedList);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    assertEquals(expectedList, cut.getAssignmentBuckets("assignmentId"));
  }

}