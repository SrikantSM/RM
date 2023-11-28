package com.sap.c4p.rm.assignment.validation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

public class AssignmentValidatorTest {

  private static final String PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR = "ProcessingResourceOrganization";

  /*
   * Any status code that does not belong to the set of defined assignment
   * statuses in com.sap.c4p.rm.assignment.enums.AssignmentStatus.
   */
  private static final int INVALID_ASSIGNMENT_STATUS = 42;

  AssignmentValidator validator = null;
  DataProvider provider = null;
  Messages messages;
  CdsRuntime cdsRuntime;

  @Mock
  DraftService mockDraftService;

  @Mock
  Row mockRow;

  private EventContext context;

  @BeforeEach
  public void createObject() {
    this.provider = mock(DataProvider.class);
    this.messages = mock(Messages.class);
    this.cdsRuntime = mock(CdsRuntime.class, Mockito.RETURNS_DEEP_STUBS);

    this.validator = new AssignmentValidator(provider, messages, cdsRuntime);
    this.mockDraftService = mock(DraftService.class);
    this.context = mock(EventContext.class);

  }

  @Test
  @DisplayName("check if validateResourceAvailability() throws exception if there is not cpacity in the given period")
  public void validateResourceAvailability() {

    String resourceId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    Instant start = Instant.now();
    Instant end = start;

    validator.validateResourceAvailability(resourceId, start, end);

    verify(messages, times(1)).error("RESOURCE_HAS_NO_CAPACITY_DURING_THE_PERIOD", start, end);

  }

  @Test
  @DisplayName("check if validateResourceBookingGranularity() returns granularity for the given resource")
  public void validateResourceBookingGranularity() {

    String resourceId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";

    Types resourceMock = Types.create();
    resourceMock.setBookingGranularityInMinutes(60);
    Optional<Types> resourceBookingGranularityInMinutes = Optional.of(resourceMock);

    when(provider.getResourceBookingGranularityInMinutes(resourceId)).thenReturn(resourceBookingGranularityInMinutes);

    // The positive case
    validator.validateResourceBookingGranularity(resourceId, 60);
    verify(messages, times(0)).error("MISSING_RESOURCE_BOOKING_GRANULARITY");

    resourceMock.setBookingGranularityInMinutes(61);
    validator.validateResourceBookingGranularity(resourceId, 60);
    verify(messages, times(1)).error("DURATION_MUST_BE_MULTIPLE_OF_GRANULARITY", 60, 61);

    // The negative case
    resourceMock.setBookingGranularityInMinutes(0);
    resourceBookingGranularityInMinutes = Optional.of(resourceMock);

    validator.validateResourceBookingGranularity(resourceId, 60);
    verify(messages, times(1)).error("MISSING_RESOURCE_BOOKING_GRANULARITY");

  }

  @Test
  @DisplayName("check if validateResourceRequestStatus() throws exception in case of resolved Resource Request")
  public void validateRequestStatusCode() {

    ResourceRequests resourceRequests = ResourceRequests.create();

    // An error should be raised if the request is not open or not published.
    resourceRequests.setId("req1");
    resourceRequests.setRequestStatusCode(1);
    resourceRequests.setReleaseStatusCode(0);
    resourceRequests.setName("req1");

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    validator.validateResourceRequestStatuses("req1");
    verify(messages, times(1)).error("REQUEST_CANNOT_BE_CHANGED", "req1");
    verify(messages, times(1)).error("NO_ASSIGNMENT_ON_UNPUBLISHED_RESOURCE_REQUEST", 0);

  }

  @Test
  @DisplayName("Check if validateAuthorizationForResource() detects user's authorization ")
  public void validateAuthorizationForResource() {

    String resourceID = "aae04175-0914-4924-a19d-68fce8f27000";
    String resourceResOrg = "RESORG";

    List<String> userResOrg = new ArrayList<>();

    ResourceDetailsForTimeWindow resourceDetailsForTimeWindow = Struct.create(ResourceDetailsForTimeWindow.class);

    // Preparing resource request data
    resourceDetailsForTimeWindow.setResourceId(resourceID);
    resourceDetailsForTimeWindow.setResourceOrgCode(resourceResOrg);

    // adding res org to the list
    userResOrg.add("RESORG");

    Optional<ResourceDetailsForTimeWindow> resourceAssignmentPeriodDetails = Optional.of(resourceDetailsForTimeWindow);

    when(provider.getMatchingTimeSlice(resourceID)).thenReturn(resourceAssignmentPeriodDetails);

    validator.validateAuthorizationForResource(resourceID, userResOrg);
    verify(messages, times(0)).error("USER_UNAUTHORIZED_ERROR");

    userResOrg.clear();// Not authorized to CCDE anymore
    userResOrg.add("ABCD");

    validator.validateAuthorizationForResource(resourceID, userResOrg);
    verify(messages, times(1)).error("USER_UNAUTHORIZED_ERROR");

    validator.validateAuthorizationForResource("UnknownResource", userResOrg);
    verify(messages, times(1)).error("RESOURCE_ORGANIZATION_UNAUTHORIZED");

    when(provider.getMatchingTimeSlice(resourceID)).thenReturn(resourceAssignmentPeriodDetails);
  }

  @Test
  @DisplayName("Check if validateAuthorizationForResource() detects undetermined res org ")
  public void validateUndeterminedResOrg() {

    String resourceID = "aae04175-0914-4924-a19d-68fce8f27000";

    List<String> userResOrg = new ArrayList<>();

    // adding res orgs to the list
    userResOrg.add("RESORG");

    Optional<ResourceDetailsForTimeWindow> resourceAssignmentPeriodDetails = Optional.empty();

    when(provider.getMatchingTimeSlice(resourceID)).thenReturn(resourceAssignmentPeriodDetails);

    validator.validateAuthorizationForResource("UnknownResource", userResOrg);
    verify(messages, times(1)).error("RESOURCE_ORGANIZATION_UNAUTHORIZED");

  }

  @Test
  @DisplayName("Test for validateAuthorizationForRequest() ")
  public void validateAuthorizationForRequest() {

    String requestID = "aae04175-0914-4924-a19d-68fce8f27000";
    List<String> resOrgsUserIsAuthFor = new ArrayList<>();
    final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

    // Preparing resource request data
    resourceRequest.setId(requestID);
    resourceRequest.setProcessingResourceOrgId("ResOrg");
    resourceRequest.setRequestedResourceOrgId("");

    Optional<ResourceRequests> resourceRequests = Optional.of(resourceRequest);

    // adding cost centers to the list
    resOrgsUserIsAuthFor.add("ResOrg");

    when(provider.getRequestData(requestID)).thenReturn(resourceRequests);
    validator.validateAuthorizationForRequest(requestID, resOrgsUserIsAuthFor);

    verify(messages, times(0)).error("RESREQ_DELIVERYORG_NOTFOUND");
    verify(messages, times(0)).error("USER_UNAUTHORIZED_ERROR");

    // res org of the Request is not part of the user authorized res orgs.
    resOrgsUserIsAuthFor.clear();
    resOrgsUserIsAuthFor.add("NEWRESORG");

    validator.validateAuthorizationForRequest(requestID, resOrgsUserIsAuthFor);
    verify(messages, times(1)).error("USER_UNAUTHORIZED_ERROR");

  }

  @Test
  @DisplayName("Test for no request scenario() ")
  public void validateReturnRequestNotFound() {

    String requestID = "aae04175-0914-4924-a19d-68fce8f27000";
    List<String> userResOrg = new ArrayList<>();

    Optional<ResourceRequests> resourceRequests = Optional.empty();

    userResOrg.add("CCDE");

    when(provider.getRequestData(requestID)).thenReturn(resourceRequests);

    validator.validateAuthorizationForRequest(requestID, userResOrg);
    verify(messages, times(1)).error("REQUEST_NOT_FOUND");

  }

  @Test
  @DisplayName("Check if resource is active during the assignment period or not")
  public void validateActiveResource() {

    LocalDate validFrom = LocalDate.of(2020, 05, 01);
    LocalDate validTo = LocalDate.of(9999, 12, 31);
    LocalDate startDate = LocalDate.of(2020, 05, 14);
    LocalDate endDate = LocalDate.of(2020, 05, 20);
    String resourceId = "aae04175-0914-4924-a19d-68fce8f27000";

    WorkAssignments workAssignments = WorkAssignments.create();
    workAssignments.setId(resourceId);
    workAssignments.setEndDate(endDate);
    workAssignments.setStartDate(startDate);

    Optional<WorkAssignments> workAssignment = Optional.of(workAssignments);

    when(provider.getWorkAssignmentDetails(resourceId)).thenReturn(workAssignment);
    validator.validateActiveResource(resourceId, validTo, validFrom);
    verify(messages, times(0)).error("INACTIVE_RESOURCE_FOUND");

  }

  @Test
  @DisplayName("Check if validateMultiTimeSliceResource() ")
  public void validateMultiTimeSliceResource() {

    WorkAssignmentFirstJobDetails costCenter = Struct.create(WorkAssignmentFirstJobDetails.class);
    costCenter.setId("CC1");

    List<WorkAssignmentFirstJobDetails> listCostCenters = new ArrayList<>();

    WorkAssignmentFirstJobDetails costCenter2 = Struct.create(WorkAssignmentFirstJobDetails.class);
    costCenter2.setId("CC2");

    listCostCenters.add(costCenter);
    listCostCenters.add(costCenter2);

    String resourceId = "aae04175-0914-4924-a19d-68fce8f27000";

    when(provider.getCostCenterRecords(resourceId)).thenReturn(listCostCenters);

    validator.validateMultiTimeSliceResource(resourceId);
    verify(messages, times(1)).error("ASSIGNMENT_CANNOT_SPAN_MULTIPLE_COSTCENTERS");

  }

  @Test
  @DisplayName("check that an error is raised incase assignment start before request start and end date is after request end")
  public void validateAssignedDatesAgainstRequestDates() {

    Instant startTime = Instant.parse("2020-10-10T10:37:30.00Z");
    Instant endTime = Instant.parse("2020-11-10T10:37:30.00Z");

    ResourceRequests resourceRequest = ResourceRequests.create();

    resourceRequest.setStartDate(LocalDate.of(2020, 10, 11));
    resourceRequest.setEndDate(LocalDate.of(2020, 11, 9));

    validator.validateAssignedDatesAgainstRequestDates(startTime, endTime, resourceRequest);

    verify(messages, times(1)).error("ASSIGNED_START_BEFORE_REQUEST_START", startTime);
    verify(messages, times(1)).error("ASSIGNED_END_AFTER_REQUEST_END", endTime);

  }

  @Test
  @DisplayName("validate auth for request and resource")
  public void validateNoResourceRequestIdError() {

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("asg1");
    assignment.setResourceId("res1");
    // assignment.setResourceRequestId("req1"); //
    validator.validateAuthorizationForRequestAndResource(context, assignment);

    verify(messages, times(1)).error("RESREQID_RESID_NOTFOUND");
  }

  @Test
  @DisplayName("validate auth for request and resource")
  public void validateNoResourceIdError() {

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("asg1");
    assignment.setResourceRequestId("req1");
    validator.validateAuthorizationForRequestAndResource(context, assignment);

    verify(messages, times(1)).error("RESREQID_RESID_NOTFOUND");
  }

  @Test
  @DisplayName("validate auth for request and resource")
  public void validateNoResourceRequestIdEmpty() {

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("asg1");
    assignment.setResourceId("res1");
    assignment.setResourceRequestId(""); //
    validator.validateAuthorizationForRequestAndResource(context, assignment);

    verify(messages, times(1)).error("RESREQID_RESID_NOTFOUND");
  }

  @Test
  @DisplayName("validate auth for request and resource")
  public void validateNoResourceIdEmpty() {

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("asg1");
    assignment.setResourceId("");
    assignment.setResourceRequestId("req1");
    validator.validateAuthorizationForRequestAndResource(context, assignment);

    verify(messages, times(1)).error("RESREQID_RESID_NOTFOUND");
  }

  @Test
  @DisplayName("validate auth for request and resource")
  public void validateAuthorizationForRequestAndResource() {

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("asg1");
    assignment.setResourceId("res1");
    assignment.setResourceRequestId("req1");

    AssignmentBuckets bucket1 = Struct.create(AssignmentBuckets.class);
    bucket1.setAssignmentId("asg1");
    bucket1.setId("draft1");
    bucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    bucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets bucket2 = Struct.create(AssignmentBuckets.class);
    bucket2.setAssignmentId("asg1");
    bucket2.setId("draft2");
    bucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    bucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();
    assignmentBucketList.add(bucket1);
    assignmentBucketList.add(bucket2);

    assignment.setAssignmentBuckets(assignmentBucketList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    String authorizedResOrg = "RO1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    LocalDate.of(2020, 05, 01);
    LocalDate.of(9999, 12, 31);
    LocalDate startDate = LocalDate.of(2020, 05, 14);
    LocalDate endDate = LocalDate.of(2020, 05, 20);
    String resourceId = "res1";

    WorkAssignments workAssignments = WorkAssignments.create();
    workAssignments.setId(resourceId);
    workAssignments.setEndDate(endDate);
    workAssignments.setStartDate(startDate);

    Optional<WorkAssignments> workAssignment = Optional.of(workAssignments);

    when(provider.getWorkAssignmentDetails(resourceId)).thenReturn(workAssignment);
    validator.validateAuthorizationForRequestAndResource(context, assignment);
    verify(messages, times(0)).error("WORKASSIGNMENT_NOT_FOUND");

    workAssignment = Optional.empty();
    when(provider.getWorkAssignmentDetails(resourceId)).thenReturn(workAssignment);

    validator.validateAuthorizationForRequestAndResource(context, assignment);
    verify(messages, times(1)).error("WORKASSIGNMENT_NOT_FOUND");

  }

  @Test
  void errorMessageOnHardBookedToSoftBookStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.SOFTBOOKED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_HARDBOOKED_NOT_ALLOWED);
  }

  @Test
  void errorMessageOnHardBookedToProposedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.PROPOSED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_HARDBOOKED_NOT_ALLOWED);
  }

  @Test
  void errorMessageOnHardBookedToAcceptedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.ACCEPTED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_HARDBOOKED_NOT_ALLOWED);
  }

  @Test
  void errorMessageOnHardBookedToRejectedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.REJECTED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_HARDBOOKED_NOT_ALLOWED);
  }

  @Test
  void noErrorMessageOnHardBookedToHardBookStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.HARDBOOKED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void errorMessageOnSoftBookedToProposedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.PROPOSED.getCode());

    verify(messages, times(1)).error(MessageKeys.SOFTBOOKED_TO_HARDBOOKED_ONLY);
  }

  @Test
  void errorMessageOnSoftBookedToAcceptedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.ACCEPTED.getCode());

    verify(messages, times(1)).error(MessageKeys.SOFTBOOKED_TO_HARDBOOKED_ONLY);
  }

  @Test
  void errorMessageOnSoftBookedToRejectedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.REJECTED.getCode());

    verify(messages, times(1)).error(MessageKeys.SOFTBOOKED_TO_HARDBOOKED_ONLY);
  }

  @Test
  void noErrorMessageOnSoftBookedToHardBookStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.HARDBOOKED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void noErrorMessageOnSoftBookedToSoftBookStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.SOFTBOOKED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void errorMessageOnProposedToSoftBookedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.SOFTBOOKED.getCode());

    verify(messages, times(1)).error(MessageKeys.ONLY_ACCEPTED_REJECTED_ALLOWED_FOR_PROPOSED);
  }

  @Test
  void errorMessageOnProposedToHardBookedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.HARDBOOKED.getCode());

    verify(messages, times(1)).error(MessageKeys.ONLY_ACCEPTED_REJECTED_ALLOWED_FOR_PROPOSED);
  }

  @Test
  void noErrorMessageOnProposedToAcceptedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.ACCEPTED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void noErrorMessageOnProposedToRejectedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.REJECTED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void noErrorMessageOnProposedToProposedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.PROPOSED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void errorMessageOnAcceptedToRejectedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.REJECTED.getCode());

    verify(messages, times(1)).error(MessageKeys.ONLY_HARD_SOFT_BOOKED_ALLOWED_FOR_ACCEPTED);
  }

  @Test
  void errorMessageOnAcceptedToProposedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.PROPOSED.getCode());

    verify(messages, times(1)).error(MessageKeys.ONLY_HARD_SOFT_BOOKED_ALLOWED_FOR_ACCEPTED);
  }

  @Test
  void noErrorMessageOnAcceptedToHardBookedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.HARDBOOKED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void noErrorMessageOnAcceptedToSoftBookedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.SOFTBOOKED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void noErrorMessageOnAcceptedToAcceptedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.ACCEPTED.getCode());

    verify(messages, times(0)).error(any(), any());
  }

  @Test
  void errorMessageOnRejectedToSoftBookStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.SOFTBOOKED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_REJECTED_NOT_ALLOWED);
  }

  @Test
  void errorMessageOnRejectedToProposedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.PROPOSED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_REJECTED_NOT_ALLOWED);
  }

  @Test
  void errorMessageOnRejectedToAcceptedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.ACCEPTED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_REJECTED_NOT_ALLOWED);
  }

  @Test
  void errorMessageOnRejectedToHardbookedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.HARDBOOKED.getCode());

    verify(messages, times(1)).error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_REJECTED_NOT_ALLOWED);
  }

  @Test
  void errorMessageOnRejectedToRejectedStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", AssignmentStatus.REJECTED.getCode());

    verify(messages, times(1)).error("ASSIGNMENT_STATUS_CHANGE_FOR_REJECTED_NOT_ALLOWED");
  }

  @Test
  void errorMessageOnHardBookedToInvalidStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", INVALID_ASSIGNMENT_STATUS);

    verify(messages, times(1)).error(MessageKeys.INVALID_ASSIGNMENT_STATUS_CODE);
  }

  @Test
  void errorMessageOnSoftBookedToInvalidStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", INVALID_ASSIGNMENT_STATUS);

    verify(messages, times(1)).error(MessageKeys.INVALID_ASSIGNMENT_STATUS_CODE);
  }

  @Test
  void errorMessageOnProposedToInvalidStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", INVALID_ASSIGNMENT_STATUS);

    verify(messages, times(1)).error(MessageKeys.INVALID_ASSIGNMENT_STATUS_CODE);
  }

  @Test
  void errorMessageOnAcceptedToInvalidStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", INVALID_ASSIGNMENT_STATUS);

    verify(messages, times(1)).error(MessageKeys.INVALID_ASSIGNMENT_STATUS_CODE);
  }

  @Test
  void errorMessageOnRejectedToInvalidStatusChange() {

    com.sap.resourcemanagement.assignment.Assignments oldAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    oldAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.of(oldAssignment));

    validator.validateAssignmentStatusChange("ASSIGNMENT_ID", INVALID_ASSIGNMENT_STATUS);

    verify(messages, times(1)).error(MessageKeys.INVALID_ASSIGNMENT_STATUS_CODE);
  }

  @Test
  @DisplayName("Check if validateResourceOrgMatch() returns an error ")
  public void validateResourceOrgMatch() {

    String resourceID = "aae04175-0914-4924-a19d-68fce8f27000";

    ResourceDetailsForTimeWindow resourceDetailsForTimeWindow = Struct.create(ResourceDetailsForTimeWindow.class);

    // Preparing resource request data
    resourceDetailsForTimeWindow.setResourceId(resourceID);
    resourceDetailsForTimeWindow.setResourceOrgCode("RESORG");

    Optional<ResourceDetailsForTimeWindow> resourceAssignmentPeriodDetails = Optional.of(resourceDetailsForTimeWindow);

    when(provider.getMatchingTimeSlice(resourceID)).thenReturn(resourceAssignmentPeriodDetails);

    validator.validateResourceOrgMatch(resourceID, "RESORG1");

    verify(messages, times(1)).error("RESOURCEORG_MISMATCH");

  }

  @Test
  void requesterWithStarAuthPassesAuthValidation() {
    validator.validateAuthorizationForAcceptReject("requestId", Collections.emptyList());
    verify(messages, times(0)).error(any());
  }

  @Test
  void requesterAuthorizedForRequestResOrgPassesAuthValidation() {

    List<String> requestedResOrgsUserIsAuthFor = Collections.singletonList("R01");

    ResourceRequests resourceRequest = ResourceRequests.create();
    resourceRequest.setRequestedResourceOrgId("R01");

    when(provider.getRequestData("request_id")).thenReturn(Optional.of(resourceRequest));

    validator.validateAuthorizationForAcceptReject("request_id", requestedResOrgsUserIsAuthFor);
    verify(messages, times(0)).error(any());
  }

  @Test
  void requesterNotAuthorizedForRequestResOrgFailsAuthValidation() {

    List<String> requestedResOrgsUserIsAuthFor = Collections.singletonList("R01");

    ResourceRequests resourceRequest = ResourceRequests.create();
    resourceRequest.setRequestedResourceOrgId("R02");

    when(provider.getRequestData("request_id")).thenReturn(Optional.of(resourceRequest));

    validator.validateAuthorizationForAcceptReject("request_id", requestedResOrgsUserIsAuthFor);
    verify(messages, times(1)).error(any());
  }

  @Test
  void validateNoAssignmentExistsMethodInvocationLeadsToErrorIfAssignmentExists() {

    com.sap.resourcemanagement.assignment.Assignments existingAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    when(provider.getAssignmentForResourceAndRequest("resourceID", "requestID"))
        .thenReturn(Optional.of(existingAssignment));

    validator.validateNoAssignmentExists("resourceID", "requestID");
    verify(messages, times(1)).error(any());
  }

  @Test
  void validateNoAssignmentExistsMethodInvocationDoesNotLeadToErrorIfAssignmentDoesNotExist() {

    when(provider.getAssignmentForResourceAndRequest("resourceID", "requestID")).thenReturn(Optional.ofNullable(null));

    validator.validateNoAssignmentExists("resourceID", "requestID");
    verify(messages, times(0)).error(any());
  }

  @Test
  void validateAssignmentExistsMethodInvocationDoesNotLeadToErrorIfAssignmentExists() {

    com.sap.resourcemanagement.assignment.Assignments existingAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    when(provider.getAssignmentHeader("assignmentID")).thenReturn(Optional.of(existingAssignment));

    validator.validateAssignmentExists("assignmentID");
    verify(messages, times(0)).error(any());
  }

  @Test
  void validateAssignmentExistsMethodInvocationLeadsToErrorIfAssignmentDoesNotExist() {

    when(provider.getAssignmentHeader("assignmentID")).thenReturn(Optional.ofNullable(null));

    validator.validateAssignmentExists("assignmentID");
    verify(messages, times(1)).error(any());
  }

  @Test
  void errorIfConsultantNotStaffedOnAssignment() {

    when(provider.getEmailAddressOfStaffedResource("assignmentId"))
        .thenReturn(Optional.of("differentconsultant@sap.com"));
    UserInfo mockUserInfo = mock(UserInfo.class);
    when(mockUserInfo.getName()).thenReturn("consultant@sap.com");

    XsuaaUserInfo xsuaaInfo = mock(XsuaaUserInfo.class);
    when(mockUserInfo.as(XsuaaUserInfo.class)).thenReturn(xsuaaInfo);

    validator.validateConsultantStaffedOnAssignment("assignmentId", mockUserInfo);
    verify(messages, times(1)).error(any());
  }

  @Test
  void noErrorIfConsultantStaffedOnAssignment() {

    when(provider.getEmailAddressOfStaffedResource("assignmentId")).thenReturn(Optional.of("consultant@sap.com"));
    UserInfo mockUserInfo = mock(UserInfo.class);
    XsuaaUserInfo mockXsuaaUserInfo = mock(XsuaaUserInfo.class);
    when(mockUserInfo.as(XsuaaUserInfo.class)).thenReturn(mockXsuaaUserInfo);
    when(mockXsuaaUserInfo.getEmail()).thenReturn("consultant@sap.com");
    validator.validateConsultantStaffedOnAssignment("assignmentId", mockUserInfo);
    verify(messages, times(0)).error(any());
  }

  @Test
  @DisplayName("Validate existing assignment ")
  public void validateExistingAssignment() {

    Map<String, String> assignmentDetails = new HashMap<>();

    assignmentDetails.put("assignmentID", "ASSIGNMENT_ID");
    assignmentDetails.put("requestID", "REQUEST_ID");
    assignmentDetails.put("resourceID", "RESOURCE_ID");

    when(provider.getAssignmentHeader("ASSIGNMENT_ID")).thenReturn(Optional.empty());

    validator.validateExistingAssignment(CqnService.EVENT_UPDATE, assignmentDetails);
    verify(messages, times(1)).error("ASSIGNMENT_NOT_EXISTS_FOR_RES_AND_REQ");

  }

  @Test
  @DisplayName("Validate existing assignment for create scenario ")
  public void validateExistingAssignmentOnCreate() {

    Map<String, String> assignmentDetails = new HashMap<>();

    assignmentDetails.put("requestID", "REQUEST_ID");
    assignmentDetails.put("resourceID", "RESOURCE_ID");

    com.sap.resourcemanagement.assignment.Assignments existingAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    existingAssignment.setId("ASSIGNMENTID");
    when(provider.getAssignmentForResourceAndRequest("RESOURCE_ID", "REQUEST_ID"))
        .thenReturn(Optional.of(existingAssignment));

    validator.validateExistingAssignment(CqnService.EVENT_CREATE, assignmentDetails);
    verify(messages, times(1)).error("ASSIGNMENT_EXISTS_FOR_RES_AND_REQ");

  }
}
