package com.sap.c4p.rm.assignment.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Struct;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.Headers;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;
import capacityservice.AssignmentBucketsYearMonthAggregate;

public class AssignmentDraftsValidatorTest {

  private static final String PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR = "ProcessingResourceOrganization";

  AssignmentDraftsValidator classUnderTest;
  private DataProvider provider;
  private AssignmentValidator validator;
  private CdsUpdateEventContext context;
  private Messages messages;
  private CdsRuntime cdsRuntime;

  @BeforeEach
  public void createObject() {
    this.messages = mock(Messages.class);
    this.provider = mock(DataProvider.class);
    this.validator = mock(AssignmentValidator.class);
    this.cdsRuntime = mock(CdsRuntime.class, Mockito.RETURNS_DEEP_STUBS);
    this.classUnderTest = new AssignmentDraftsValidator(messages, validator, provider, cdsRuntime);
    this.context = mock(CdsUpdateEventContext.class);

    context.put(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID, "asg1");
    context.put(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR, "CC1");

    // Get the keys
    Map<String, Object> keys = new HashMap<>();
    keys.put(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID, "asg1");

    when(validator.getKeys(context)).thenReturn(keys);

    Assignments draftAssignment = Struct.create(Assignments.class);
    draftAssignment.setId("asg1");
    draftAssignment.setResourceId("res1");
    draftAssignment.setResourceRequestId("req1");
    draftAssignment.setHasActiveEntity(true);

    when(provider.getAssignmentHeaderDraft("asg1")).thenReturn(draftAssignment);
  }

  @Test
  @DisplayName("1. An error is to be expected if there are no buckets")
  public void validateDeletionNotAllowed() {

    classUnderTest.validate(context);
    verify(messages, times(1)).error("DELETION_NOT_ALLOWED");

  }

  @Test
  @DisplayName("2. Assignments should be not found")
  public void validateAssignmentNotFound() {

    // Get the draft buckets
    AssignmentBuckets draftBucket1 = Struct.create(AssignmentBuckets.class);
    draftBucket1.setAssignmentId("asg1");
    draftBucket1.setId("draft1");
    draftBucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    draftBucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets draftBucket2 = Struct.create(AssignmentBuckets.class);
    draftBucket2.setAssignmentId("asg1");
    draftBucket2.setId("draft2");
    draftBucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    draftBucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> draftBucketList = new ArrayList<>();
    draftBucketList.add(draftBucket1);
    draftBucketList.add(draftBucket2);

    when(provider.getAssignmentBucketsDraft("asg1")).thenReturn(draftBucketList);

    // Check for assignment not found
    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeaderList = Optional.empty();
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    String authorizedResOrg = "cc1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    Headers resource = Struct.create(Headers.class);
    resource.setId("res1");
    Optional<Headers> resources = Optional.of(resource);
    when(provider.getResourceData("res1")).thenReturn(resources);

    classUnderTest.validate(context);
    verify(messages, times(1)).error("ASSIGNMENT_NOT_FOUND", "asg1");

  }

  @Test
  @DisplayName("3. Assignments should be found now")
  public void validateAssignmentFound() {

    // Get the draft buckets
    AssignmentBuckets draftBucket1 = Struct.create(AssignmentBuckets.class);
    draftBucket1.setAssignmentId("asg1");
    draftBucket1.setId("draft1");
    draftBucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    draftBucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets draftBucket2 = Struct.create(AssignmentBuckets.class);
    draftBucket2.setAssignmentId("asg1");
    draftBucket2.setId("draft2");
    draftBucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    draftBucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> draftBucketList = new ArrayList<>();
    draftBucketList.add(draftBucket1);
    draftBucketList.add(draftBucket2);

    when(provider.getAssignmentBucketsDraft("asg1")).thenReturn(draftBucketList);

    // Check for assignment not found
    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeaderList = Optional.empty();
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    String authorizedResOrg = "cc1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    // Assignments should be found now
    com.sap.resourcemanagement.assignment.Assignments assignmentHeader = Struct
        .create(com.sap.resourcemanagement.assignment.Assignments.class);
    assignmentHeader.setId("asg1");
    assignmentHeaderList = Optional.of(assignmentHeader);
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    messages = mock(Messages.class);
    classUnderTest.validate(context);
    verify(messages, times(0)).error("ASSIGNMENT_NOT_FOUND", "asg1");
  }

  @Test
  @DisplayName("4. An error is to be expected if request is not found")
  public void validateRequestNotFound() {

    // Get the draft buckets
    AssignmentBuckets draftBucket1 = Struct.create(AssignmentBuckets.class);
    draftBucket1.setAssignmentId("asg1");
    draftBucket1.setId("draft1");
    draftBucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    draftBucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets draftBucket2 = Struct.create(AssignmentBuckets.class);
    draftBucket2.setAssignmentId("asg1");
    draftBucket2.setId("draft2");
    draftBucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    draftBucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> draftBucketList = new ArrayList<>();
    draftBucketList.add(draftBucket1);
    draftBucketList.add(draftBucket2);

    when(provider.getAssignmentBucketsDraft("asg1")).thenReturn(draftBucketList);

    // Check for assignment not found
    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeaderList = Optional.empty();
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    String authorizedResOrg = "cc1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    // Assignments should be found now
    com.sap.resourcemanagement.assignment.Assignments assignmentHeader = Struct
        .create(com.sap.resourcemanagement.assignment.Assignments.class);
    assignmentHeader.setId("asg1");
    assignmentHeaderList = Optional.of(assignmentHeader);
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    // Request not found
    Optional<ResourceRequests> requests = Optional.empty();
    when(provider.getRequestData("req1")).thenReturn(requests);

    classUnderTest.validate(context);
    verify(messages, times(1)).error("REQUEST_NOT_FOUND", "req1");
  }

  @Test
  @DisplayName("5. No errors on request found")
  public void validateRequestFound() {

    // Get the draft buckets
    AssignmentBuckets draftBucket1 = Struct.create(AssignmentBuckets.class);
    draftBucket1.setAssignmentId("asg1");
    draftBucket1.setId("draft1");
    draftBucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    draftBucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets draftBucket2 = Struct.create(AssignmentBuckets.class);
    draftBucket2.setAssignmentId("asg1");
    draftBucket2.setId("draft2");
    draftBucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    draftBucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> draftBucketList = new ArrayList<>();
    draftBucketList.add(draftBucket1);
    draftBucketList.add(draftBucket2);

    when(provider.getAssignmentBucketsDraft("asg1")).thenReturn(draftBucketList);

    // Check for assignment not found
    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeaderList = Optional.empty();
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    String authorizedResOrg = "cc1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    // Assignments should be found now
    com.sap.resourcemanagement.assignment.Assignments assignmentHeader = Struct
        .create(com.sap.resourcemanagement.assignment.Assignments.class);
    assignmentHeader.setId("asg1");
    assignmentHeaderList = Optional.of(assignmentHeader);
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    // Request should now be found
    ResourceRequests request = Struct.create(ResourceRequests.class);
    request.setId("req1");
    Optional<ResourceRequests> requests = Optional.of(request);
    when(provider.getRequestData("req1")).thenReturn(requests);
    classUnderTest.validate(context);
    verify(messages, times(0)).error("REQUEST_NOT_FOUND", "req1");

  }

  @Test
  @DisplayName("6. An error is to be expected if the the resource is not found")
  public void validateResourceNotFound() {

    // Get the draft buckets
    AssignmentBuckets draftBucket1 = Struct.create(AssignmentBuckets.class);
    draftBucket1.setAssignmentId("asg1");
    draftBucket1.setId("draft1");
    draftBucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    draftBucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets draftBucket2 = Struct.create(AssignmentBuckets.class);
    draftBucket2.setAssignmentId("asg1");
    draftBucket2.setId("draft2");
    draftBucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    draftBucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> draftBucketList = new ArrayList<>();
    draftBucketList.add(draftBucket1);
    draftBucketList.add(draftBucket2);

    when(provider.getAssignmentBucketsDraft("asg1")).thenReturn(draftBucketList);

    // Check for assignment not found
    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeaderList = Optional.empty();
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    String authorizedResOrg = "cc1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    // Assignments should be found now
    com.sap.resourcemanagement.assignment.Assignments assignmentHeader = Struct
        .create(com.sap.resourcemanagement.assignment.Assignments.class);
    assignmentHeader.setId("asg1");
    assignmentHeaderList = Optional.of(assignmentHeader);
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    // Request should now be found
    ResourceRequests request = Struct.create(ResourceRequests.class);
    request.setId("req1");
    Optional<ResourceRequests> requests = Optional.of(request);
    when(provider.getRequestData("req1")).thenReturn(requests);

    // Resource not found
    Optional<Headers> resources = Optional.empty();
    when(provider.getResourceData("res1")).thenReturn(resources);
    classUnderTest.validate(context);
    verify(messages, times(1)).error("RESOURCE_NOT_FOUND", "res1");

    // Check the set and get messages too.
    classUnderTest.setMessages(messages);
    Messages getMessages = classUnderTest.getMessages();

    assertEquals(messages, getMessages);

  }

  @Test
  @DisplayName("7. Validate resource found")
  public void validateResourceFound() {

    // Get the draft buckets
    AssignmentBuckets draftBucket1 = Struct.create(AssignmentBuckets.class);
    draftBucket1.setAssignmentId("asg1");
    draftBucket1.setId("draft1");
    draftBucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    draftBucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets draftBucket2 = Struct.create(AssignmentBuckets.class);
    draftBucket2.setAssignmentId("asg1");
    draftBucket2.setId("draft2");
    draftBucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    draftBucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> draftBucketList = new ArrayList<>();
    draftBucketList.add(draftBucket1);
    draftBucketList.add(draftBucket2);

    when(provider.getAssignmentBucketsDraft("asg1")).thenReturn(draftBucketList);

    // Check for assignment not found
    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeaderList = Optional.empty();
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    String authorizedResOrg = "cc1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    // Assignments should be found now
    com.sap.resourcemanagement.assignment.Assignments assignmentHeader = Struct
        .create(com.sap.resourcemanagement.assignment.Assignments.class);
    assignmentHeader.setId("asg1");
    assignmentHeaderList = Optional.of(assignmentHeader);
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    // Request should now be found
    ResourceRequests request = Struct.create(ResourceRequests.class);
    request.setId("req1");
    Optional<ResourceRequests> requests = Optional.of(request);
    when(provider.getRequestData("req1")).thenReturn(requests);

    // Now the resource should be found
    Headers resource = Struct.create(Headers.class);
    resource.setId("res1");
    Optional<Headers> resources = Optional.of(resource);
    when(provider.getResourceData("res1")).thenReturn(resources);
    classUnderTest.validate(context);
    verify(messages, times(0)).error("RESOURCE_NOT_FOUND", "res1");

  }

  @Test
  @DisplayName("8. Validate resource has no capacity")
  public void validateResourceHasNoCapacity() {

    // Get the draft buckets
    AssignmentBuckets draftBucket1 = Struct.create(AssignmentBuckets.class);
    draftBucket1.setAssignmentId("asg1");
    draftBucket1.setId("draft1");
    draftBucket1.setStartTime(Instant.parse("2020-10-10T00:00:00.00Z"));
    draftBucket1.setBookedCapacityInMinutes(120);

    AssignmentBuckets draftBucket2 = Struct.create(AssignmentBuckets.class);
    draftBucket2.setAssignmentId("asg1");
    draftBucket2.setId("draft2");
    draftBucket2.setStartTime(Instant.parse("2020-10-11T00:00:00.00Z"));
    draftBucket2.setBookedCapacityInMinutes(120);

    List<AssignmentBuckets> draftBucketList = new ArrayList<>();
    draftBucketList.add(draftBucket1);
    draftBucketList.add(draftBucket2);

    when(provider.getAssignmentBucketsDraft("asg1")).thenReturn(draftBucketList);

    // Check for assignment not found
    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeaderList = Optional.empty();
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    String authorizedResOrg = "cc1";
    List<String> authorizedResOrgList = new ArrayList<>();
    authorizedResOrgList.add(authorizedResOrg);

    UserInfo userInfo = mock(UserInfo.class);

    when(context.getUserInfo()).thenReturn(userInfo);

    when(context.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(authorizedResOrgList);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(cdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    // Assignments should be found now
    com.sap.resourcemanagement.assignment.Assignments assignmentHeader = Struct
        .create(com.sap.resourcemanagement.assignment.Assignments.class);
    assignmentHeader.setId("asg1");
    assignmentHeaderList = Optional.of(assignmentHeader);
    when(provider.getAssignmentHeader("asg1")).thenReturn(assignmentHeaderList);

    // Request should now be found
    ResourceRequests request = Struct.create(ResourceRequests.class);
    request.setId("req1");
    Optional<ResourceRequests> requests = Optional.of(request);
    when(provider.getRequestData("req1")).thenReturn(requests);

    // Now the resource should be found
    Headers resource = Struct.create(Headers.class);
    resource.setId("res1");
    Optional<Headers> resources = Optional.of(resource);
    when(provider.getResourceData("res1")).thenReturn(resources);
    classUnderTest.validate(context);
    verify(messages, times(0)).error("RESOURCE_HAS_NO_CAPACITY_DURING_THE_PERIOD", "2020-10-10T00:00:00.00Z");

  }

}
