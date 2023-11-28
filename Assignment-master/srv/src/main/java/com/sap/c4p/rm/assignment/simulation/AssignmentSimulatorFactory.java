package com.sap.c4p.rm.assignment.simulation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.HttpStatus;

import assignmentservice.SimulateAsgBasedOnTotalHoursContext;
import assignmentservice.SimulateAssignmentAsRequestedContext;

@Component
public class AssignmentSimulatorFactory {

  @Autowired
  AssignmentAsRequestedSimulator assignmentAsRequestedSimulator;
  @Autowired
  AssignmentTotalHoursSimulator assignmentTotalHoursSimulator;

  public AssignmentSimulatorFactory(AssignmentAsRequestedSimulator assignmentAsRequestedSimulator,
      AssignmentTotalHoursSimulator assignmentTotalHoursSimulator) {
    this.assignmentAsRequestedSimulator = assignmentAsRequestedSimulator;
    this.assignmentTotalHoursSimulator = assignmentTotalHoursSimulator;
  }

  public AssignmentSimulator getAssignmentSimulator(String actionEvent) {

    if (SimulateAsgBasedOnTotalHoursContext.CDS_NAME.equals(actionEvent)) {
      return assignmentTotalHoursSimulator;
    } else if (SimulateAssignmentAsRequestedContext.CDS_NAME.equals(actionEvent)) {
      return assignmentAsRequestedSimulator;
    } else {
      throw new ServiceException(HttpStatus.NOT_IMPLEMENTED, MessageKeys.ACTION_NOT_SUPPORTED, actionEvent);
    }
  }
}