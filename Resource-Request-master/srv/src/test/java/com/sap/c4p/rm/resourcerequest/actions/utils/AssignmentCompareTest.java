package com.sap.c4p.rm.resourcerequest.actions.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AssignmentCompareTest {

  private AssignmentCompare mockAssignmentCompare;

  @BeforeEach
  void beforeEach() {
    this.mockAssignmentCompare = new AssignmentCompare();
  }

  @Test
  @DisplayName("check if compareForAssigmentChange() returns assignmentAfterComparison object")
  public void validategetAssignmentCompareForReturnObject() throws JSONException {

    String mockAssignmentId = "cd436e33-75ba-4089-9429-672bcd0b6e72";
    String oldAssignmentJsonstring = "{\"HasActiveEntity\":false,\"bookedCapacityInMinutes\":600,\"modifiedAt\":null,\"HasDraftEntity\":false,\"resourceRequest_ID\":\"4cc7b653-67f2-449a-9852-7f37d64c5931\",\"@context\":\"$metadata#Assignments(assignmentBuckets())/$entity\",\"createdAt\":null,\"IsActiveEntity\":false,\"createdBy\":null,\"assignmentBuckets\":[{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-01T00:00:00Z\",\"ID\":\"e7733ecc-a387-4f07-86da-410e55defb54\",\"capacityRequirement_ID\":null},{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-02T00:00:00Z\",\"ID\":\"f060663f-5387-447e-a6ec-a472e2760775\",\"capacityRequirement_ID\":null}],\"resource_ID\":\"d771ad92-26e5-4aed-9173-49406112b5b2\",\"modifiedBy\":null,\"ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\"}";
    String simulatedAssignmentJsonstring = "{\"HasActiveEntity\":false,\"bookedCapacityInMinutes\":600,\"modifiedAt\":null,\"HasDraftEntity\":false,\"resourceRequest_ID\":\"4cc7b653-67f2-449a-9852-7f37d64c5931\",\"@context\":\"$metadata#Assignments(assignmentBuckets())/$entity\",\"createdAt\":null,\"IsActiveEntity\":false,\"createdBy\":null,\"assignmentBuckets\":[{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-02T00:00:00Z\",\"ID\":\"e7733ecc-a387-4f07-86da-410e55defb54\",\"capacityRequirement_ID\":null},{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-03T00:00:00Z\",\"ID\":\"e7733ecc-a387-4f07-86da-410e55defb53\",\"capacityRequirement_ID\":null}],\"resource_ID\":\"d771ad92-26e5-4aed-9173-49406112b5b2\",\"modifiedBy\":null,\"ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\"}";

    JSONObject mockOldAssignment = new JSONObject(oldAssignmentJsonstring);
    JSONObject mockSimulatedAssignment = new JSONObject(simulatedAssignmentJsonstring);

    JSONObject assignmentAfterComparison = mockAssignmentCompare.compareForAssigmentChange(mockAssignmentId,
        mockOldAssignment, mockSimulatedAssignment);

    String assignmentAfterComparisonString = "{\"bookedCapacityInMinutes\":600,\"modifiedAt\":null,\"resourceRequest_ID\":\"4cc7b653-67f2-449a-9852-7f37d64c5931\",\"@context\":\"$metadata#Assignments(assignmentBuckets())/$entity\",\"createdAt\":null,\"createdBy\":null,\"assignmentBuckets\":[{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"modifiedBy\":null,\"startTime\":\"2020-10-02T00:00:00Z\",\"ID\":\"f060663f-5387-447e-a6ec-a472e2760775\",\"capacityRequirement_ID\":null},{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"modifiedBy\":null,\"startTime\":\"2020-10-03T00:00:00Z\",\"ID\":\"e7733ecc-a387-4f07-86da-410e55defb53\",\"capacityRequirement_ID\":null}],\"resource_ID\":\"d771ad92-26e5-4aed-9173-49406112b5b2\",\"modifiedBy\":null,\"ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\"}";

    assertEquals(assignmentAfterComparison.toString(), assignmentAfterComparisonString);
  }
}
