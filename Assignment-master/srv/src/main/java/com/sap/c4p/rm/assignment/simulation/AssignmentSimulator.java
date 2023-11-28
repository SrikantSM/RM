package com.sap.c4p.rm.assignment.simulation;

import java.util.List;

import com.sap.cds.services.EventContext;

import assignmentservice.AssignmentBuckets;

public interface AssignmentSimulator {
  public List<AssignmentBuckets> getDistributedAssignmentRecords(final EventContext context);
}