package com.sap.c4p.rm.resourcerequest.helpers;

import org.springframework.stereotype.Component;

import manageresourcerequestservice.Staffing;

@Component
public interface StaffingHelper {

  int updateAssignment(int assignmentStatusCode, Staffing staffing);

}
