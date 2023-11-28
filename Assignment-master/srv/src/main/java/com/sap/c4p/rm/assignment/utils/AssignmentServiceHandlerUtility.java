package com.sap.c4p.rm.assignment.utils;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.simulation.AssignmentSimulator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;
import assignmentservice.SimulateAsgBasedOnTotalHoursContext;

@Component
public class AssignmentServiceHandlerUtility {

  private AssignmentValidator assignmentValidator;

  public AssignmentServiceHandlerUtility(AssignmentValidator assignmentValidator) {
    this.assignmentValidator = assignmentValidator;
  }

  public Assignments buildActionResult(final EventContext context, final AssignmentSimulator assignmentSimulator) {

    List<AssignmentBuckets> assignmentBucketList = assignmentSimulator.getDistributedAssignmentRecords(context);

    Assignments assignment = Assignments.create();
    String assignmentHeaderUUID = UUID.randomUUID().toString();

    assignment.setId(assignmentHeaderUUID);
    assignment.setIsActiveEntity(Boolean.FALSE);
    assignment.setHasActiveEntity(Boolean.FALSE);
    assignment.setHasDraftEntity(Boolean.FALSE);
    assignment.setResourceId(context.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID).toString());
    assignment.setResourceRequestId(context.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID).toString());

    // hard-booked by default unless specified otherwise
    assignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    Optional.ofNullable(context.get(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE)).ifPresent(
        assignmentStatusCode -> assignment.setAssignmentStatusCode(Integer.valueOf(assignmentStatusCode.toString())));

    int totalBookedCapacityInMinutes = 0;

    for (AssignmentBuckets bucket : assignmentBucketList) {

      bucket.setId(UUID.randomUUID().toString());
      bucket.setAssignmentId(assignmentHeaderUUID);
      bucket.setIsActiveEntity(Boolean.FALSE);
      bucket.setHasActiveEntity(Boolean.FALSE);
      bucket.setHasDraftEntity(Boolean.FALSE);

      totalBookedCapacityInMinutes = totalBookedCapacityInMinutes + bucket.getBookedCapacityInMinutes();

    }

    assignment.setBookedCapacityInMinutes(totalBookedCapacityInMinutes);
    assignment.setAssignmentBuckets(assignmentBucketList);
    return assignment;

  }

  public Map<String, Object> getKeys(final CdsDeleteEventContext context) {
    CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(context.getModel());
    return cqnAnalyzer.analyze(context.getCqn()).targetKeys();
  }

  public Messages validateAuthorizationForRequestAndResource(EventContext context, Assignments assignment) {
    assignmentValidator.validateAuthorizationForRequestAndResource(context, assignment);
    return assignmentValidator.getMessages();
  }

  public Messages validateResourceRequestStatuses(String resourceRequestId) {
    assignmentValidator.validateResourceRequestStatuses(resourceRequestId);
    return assignmentValidator.getMessages();
  }

  public Messages validateAssignmentStatusChange(String assignmentId, Integer updatedAssignmentStatusCode) {
    assignmentValidator.validateAssignmentStatus(updatedAssignmentStatusCode);
    assignmentValidator.validateAssignmentStatusChange(assignmentId, updatedAssignmentStatusCode);
    return assignmentValidator.getMessages();
  }

}