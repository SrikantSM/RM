package com.sap.c4p.rm.assignment.validation;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Headers;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;
import capacityservice.AssignmentBucketsYearMonthAggregate;

@Component
public class AssignmentDraftsValidator implements Validator {

  private static final String PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR = "ProcessingResourceOrganization";

  private Messages messages;
  private AssignmentValidator validator;
  private DataProvider dataProvider;

  private CdsRuntime cdsRuntime;

  @Autowired
  public AssignmentDraftsValidator(Messages messages, AssignmentValidator validator, DataProvider dataProvider,
      CdsRuntime cdsRuntime) {
    this.messages = messages;
    this.validator = validator;
    this.dataProvider = dataProvider;
    this.cdsRuntime = cdsRuntime;
  }

  @Override
  public Messages validate(EventContext context) {

    String assignmentId;

    Map<String, Object> keys = validator.getKeys(context);

    assignmentId = (String) keys.get(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID);

    Assignments draftAssignment = dataProvider.getAssignmentHeaderDraft(assignmentId);
    List<AssignmentBuckets> draftBuckets = dataProvider.getAssignmentBucketsDraft(assignmentId);

    String resourceId = draftAssignment.getResourceId();
    String requestId = draftAssignment.getResourceRequestId();

    List<AssignmentBuckets> sortedDraftBuckets = getSortedBuckets(draftBuckets);

    if (sortedDraftBuckets.isEmpty()) {
      messages.error(MessageKeys.DELETION_NOT_ALLOWED);
      return messages;
    }

    Instant assignmentStart = sortedDraftBuckets.get(0).getStartTime();
    Instant assignmentEnd = sortedDraftBuckets.get(sortedDraftBuckets.size() - 1).getStartTime();

    List<String> resOrgsUserIsAuthFor = context.getUserInfo()
        .getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR);

    // Assignment still exists
    if (draftAssignment.getHasActiveEntity()) { // This check is only to be done in case of edit scenarios
      Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeader = dataProvider
          .getAssignmentHeader(assignmentId);
      if (!assignmentHeader.isPresent()) {
        messages.error(MessageKeys.ASSIGNMENT_NOT_FOUND, assignmentId);
      }
    } else {
      // Can happen that an assignment has been created parallely for the same
      // request, resource combination
      Optional<com.sap.resourcemanagement.assignment.Assignments> parallelAssignmentCreated = dataProvider
          .getAssignmentForResourceAndRequest(resourceId, requestId);
      if (parallelAssignmentCreated.isPresent())
        messages.error(MessageKeys.ASSIGNMENT_CREATED_IN_PARALLEL);
    }

    // Request still exists
    Optional<ResourceRequests> request = dataProvider.getRequestData(requestId);
    if (request.isPresent()) {
      validator.validateAssignedDatesAgainstRequestDates(assignmentStart, assignmentEnd, request.get());
    } else {
      messages.error(MessageKeys.REQUEST_NOT_FOUND, requestId);
    }
    validator.validateResourceRequestStatuses(requestId);
    validator.validateAuthorizationForRequest(requestId, resOrgsUserIsAuthFor);

    // Resource still exists
    Optional<Headers> resource = dataProvider.getResourceData(resourceId);
    if (!resource.isPresent()) {
      messages.error(MessageKeys.RESOURCE_NOT_FOUND, resourceId);
    }

    RequestContextRunner requestContextRunner = cdsRuntime.requestContext()
        .modifyParameters(p -> p.setValidFrom(assignmentStart)).modifyParameters(p -> p.setValidTo(assignmentEnd));
    requestContextRunner.run(req -> {
      validator.validateAuthorizationForResource(resourceId, resOrgsUserIsAuthFor);
      validator.validateMultiTimeSliceResource(resourceId);
    });
    validator.validateActiveResource(resourceId, assignmentStart.atZone(ZoneId.systemDefault()).toLocalDate(),
        assignmentEnd.atZone(ZoneId.systemDefault()).toLocalDate());

    validator.validateAssignmentStatus(draftAssignment.getAssignmentStatusCode());
    validator.validateAssignmentStatusChange(assignmentId, draftAssignment.getAssignmentStatusCode());

    validateResourceCapacityAgainstAssignedBuckets(resourceId, draftBuckets, assignmentStart, assignmentEnd);

    return messages;
  }

  private List<AssignmentBuckets> getSortedBuckets(List<AssignmentBuckets> unSortedBuckets) {

    return unSortedBuckets.stream().sorted((o1, o2) -> o1.getStartTime().compareTo(o2.getStartTime()))
        .collect(Collectors.toList());

  }

  public Messages validate(String assignmentId) {

    Assignments assignmentDraft = dataProvider.getAssignmentHeaderDraft(assignmentId);
    List<AssignmentBuckets> draftBuckets = dataProvider.getAssignmentBucketsDraft(assignmentId);

    List<AssignmentBuckets> sortedDraftBuckets = getSortedBuckets(draftBuckets);

    if (sortedDraftBuckets.isEmpty()) {
      messages.error(MessageKeys.DELETION_NOT_ALLOWED);
      return messages;
    }

    Instant assignmentStart = sortedDraftBuckets.get(0).getStartTime();

    Instant assignmentEnd = sortedDraftBuckets.get(sortedDraftBuckets.size() - 1).getStartTime();

    // Assignment still exists (only in case of non-create validations)
    if (assignmentDraft.getIsActiveEntity()) {
      Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeader = dataProvider
          .getAssignmentHeader(assignmentId);
      if (!assignmentHeader.isPresent()) {
        messages.error(MessageKeys.ASSIGNMENT_NOT_FOUND, assignmentId);
      }
    }

    // Request still exists
    Optional<ResourceRequests> request = dataProvider.getRequestData(assignmentDraft.getResourceRequestId());
    if (request.isPresent()) {
      validator.validateAssignedDatesAgainstRequestDates(assignmentStart, assignmentEnd, request.get());
    } else {
      messages.error(MessageKeys.REQUEST_NOT_FOUND, assignmentDraft.getResourceRequestId());
    }
    validator.validateResourceRequestStatuses(assignmentDraft.getResourceRequestId());

    // Resource still exists
    Optional<Headers> resource = dataProvider.getResourceData(assignmentDraft.getResourceId());
    if (!resource.isPresent()) {
      messages.error(MessageKeys.RESOURCE_NOT_FOUND, assignmentDraft.getResourceId());
    }

    // Validate that the resource is still active
    validator.validateActiveResource(assignmentDraft.getResourceId(),
        assignmentStart.atZone(ZoneId.systemDefault()).toLocalDate(),
        assignmentEnd.atZone(ZoneId.systemDefault()).toLocalDate());

    RequestContextRunner requestContextRunner = cdsRuntime.requestContext()
        .modifyParameters(p -> p.setValidFrom(assignmentStart)).modifyParameters(p -> p.setValidTo(assignmentEnd));
    requestContextRunner.run(req -> {
      validator.validateMultiTimeSliceResource(assignmentDraft.getResourceId());
      if (!assignmentDraft.getHasActiveEntity()) { // Check for resource org match in create cases
        validator.validateResourceOrgMatch(assignmentDraft.getResourceId(), request.get().getProcessingResourceOrgId());
      }
    });

    validator.validateAssignmentStatusChange(assignmentId, assignmentDraft.getAssignmentStatusCode());

    validateResourceCapacityAgainstAssignedBuckets(assignmentDraft.getResourceId(), draftBuckets, assignmentStart,
        assignmentEnd);
    return messages;
  }

  private void validateResourceCapacityAgainstAssignedBuckets(String resourceId, List<AssignmentBuckets> draftBuckets,
      Instant assignmentStart, Instant assignmentEnd) {

    Set<Instant> resourceAvailableDatesSet = dataProvider
        .getResourceCapacities(resourceId, assignmentStart, assignmentEnd).stream().map(Capacity::getStartTime)
        .collect(Collectors.toSet());

    Optional<AssignmentBuckets> noCapacityBucket = draftBuckets.stream()
        .filter(bucket -> !resourceAvailableDatesSet.contains(bucket.getStartTime())).findFirst();
    
    if (noCapacityBucket.isPresent()) {
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");    
      String formattedStartDate = noCapacityBucket.get().getStartTime().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter);
      String formattedEndDate = noCapacityBucket.get().getStartTime().plus(Duration.ofDays(1)).atZone(ZoneId.systemDefault()).toLocalDate().format(formatter);
      messages.error(MessageKeys.RESOURCE_HAS_NO_CAPACITY_DURING_THE_PERIOD, formattedStartDate, formattedEndDate);
    }

  }

  public Messages getMessages() {
    return messages;
  }

  public void setMessages(Messages messages) {
    this.messages = messages;
  }

}
