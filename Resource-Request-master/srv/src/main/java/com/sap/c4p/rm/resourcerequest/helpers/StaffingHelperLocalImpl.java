package com.sap.c4p.rm.resourcerequest.helpers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.assignment.Assignments_;

import manageresourcerequestservice.ManageResourceRequestService_;
import manageresourcerequestservice.Staffing;

@Component
@ServiceName(ManageResourceRequestService_.CDS_NAME)
@Profile({ "default", "local-test" })
public class StaffingHelperLocalImpl implements StaffingHelper {

  private PersistenceService persistenceService;

  @Autowired
  StaffingHelperLocalImpl(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Override
  public int updateAssignment(int assignmentStatusCode, Staffing staffing) {
    Assignments assignment = Assignments.create();
    assignment.setAssignmentStatusCode(assignmentStatusCode);

    CqnUpdate update = Update.entity(Assignments_.class).data(assignment)
        .where(a -> a.ID().eq(staffing.getAssignmentId()));

    persistenceService.run(update);

    return 200;
  }
}
