package com.sap.c4p.rm.resourcerequest.handlers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.AssignmentStatus;
import manageresourcerequestservice.ManageResourceRequestService_;
import manageresourcerequestservice.Staffing;
import manageresourcerequestservice.Staffing_;

@Component
@ServiceName(ManageResourceRequestService_.CDS_NAME)
public class StaffingHandler implements EventHandler {

  /**
   * @After method - Event Read Context, used to set AssignmentProposalFlag for
   *        action button visiblity (accept/reject)
   * @param staffingList
   */
  @After(event = { CqnService.EVENT_READ }, entity = Staffing_.CDS_NAME)
  public void afterStaffingRead(List<Staffing> staffingList) {
    fillVirtualFields(staffingList);
  }

  public void fillVirtualFields(List<Staffing> staffingList) {

    for (Staffing staffing : staffingList) {
      AssignmentStatus assignmentStatus = staffing.getAssignmentStatus();
      if (assignmentStatus != null) {
        int assignmentStatusCode = assignmentStatus.getCode();
        if (assignmentStatusCode == Constants.AssignmentStatus.PROPOSAL_ASSIGNMENT_STATUS_CODE) {
          staffing.setAssignmentProposalFlag(Boolean.TRUE);
        } else {
          staffing.setAssignmentProposalFlag(Boolean.FALSE);
        }
      }
    }

  }

}
