package com.sap.c4p.rm.resourcerequest.handlers;

import static com.sap.cds.ql.CQL.and;
import static com.sap.cds.ql.CQL.get;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.Predicate;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import processresourcerequestservice.ProcessResourceRequestService_;
import processresourcerequestservice.ProjectRoles_;

@Component
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class ProcessResourceRequestHandler implements EventHandler {

  /*
   * Handler for returning only unrestricted project roles on reading ProjectRoles
   * entity in ProcessResourceRequests Service
   */
  @Before(event = { CqnService.EVENT_READ }, entity = ProjectRoles_.CDS_NAME)
  public void beforeProjectRolesRead(CdsReadEventContext context) {
    CqnSelect query = context.getCqn();
    Predicate validRoleFilter = get("roleLifecycleStatus_code").eq(0);
    CqnPredicate addUnrestrictedRolesToFilters = query.where()
        .map(existingFilters -> and(existingFilters, validRoleFilter)).orElse(validRoleFilter);
    context.setCqn(Select.copy(query).where(addUnrestrictedRolesToFilters));
  }

}
