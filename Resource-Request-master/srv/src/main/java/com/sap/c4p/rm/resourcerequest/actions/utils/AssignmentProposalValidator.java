package com.sap.c4p.rm.resourcerequest.actions.utils;

import java.util.Map;

import com.sap.c4p.rm.resourcerequest.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

import manageresourcerequestservice.Staffing_;
import manageresourcerequestservice.ResourceRequests_;
import manageresourcerequestservice.ResourceRequests;

@Component
public class AssignmentProposalValidator {

  private Messages messages;
  private CqnAnalyzerWrapper cqnAnalyzerWrapper;

  PersistenceService persistenceService;

  @Autowired
  public AssignmentProposalValidator(Messages messages, CqnAnalyzerWrapper cqnAnalyzerWrapper,
      PersistenceService persistenceService) {
    this.messages = messages;
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.persistenceService = persistenceService;
  }

  public void checkAssignmentExists(String assignmentId) {

    CqnSelect selectDb = Select.from(Staffing_.class).columns(Staffing_::assignment_ID)
        .where(s -> s.assignment_ID().eq(assignmentId));

    Result result = persistenceService.run(selectDb);

    if (result.rowCount() == 0) {
      messages.error(MessageKeys.PROPOSAL_CHANGED);
      messages.throwIfError();
    }

  }

  public void validateAssignment(CdsModel model, CqnSelect query) {

    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(model);
    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, query).targetKeys();

    String assignmentId = (String) keys.get("assignment_ID");

    checkAssignmentExists(assignmentId);

  }

    //Validation to restrict accept/reject proposals for a resolved Resource Request
    public void checkResourceRequestStatus(String resourceRequestId) {
        CqnSelect select = Select.from(ResourceRequests_.class).columns(b -> b.requestStatus_code())
                .where(resReq -> resReq.ID().eq(resourceRequestId));
        Result resReqResult = persistenceService.run(select);

        if(resReqResult.rowCount() > 0 &&
                (resReqResult.single(ResourceRequests.class).getRequestStatusCode().equals(Constants.REQUEST_RESOLVE))) {
         //Restrict accept/reject proposals when the resourcerequest is already resolved
          messages.error(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION,Constants.REQUEST_RESOLVE).target("in",
                  ResourceRequests_.class, resourceRequest -> resourceRequest.requestStatus_code());
          messages.throwIfError();
        }
      }

}
