package com.sap.c4p.rm.resourcerequest.actions.handlers;

import java.util.Map;
import java.util.Optional;

import org.apache.http.HttpHeaders;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentApiClient;
import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.actions.utils.LoggingMarker;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import com.sap.resourcemanagement.resource.ResourceDetails_;

import jakarta.servlet.http.HttpServletRequest;
import processresourcerequestservice.DeleteAssignmentContext;
import processresourcerequestservice.ProcessResourceRequestService_;
import processresourcerequestservice.Staffing_;

@RequestScope
@Component
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class DeleteAssignmentActionHandler implements EventHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(DeleteAssignmentActionHandler.class);
  private static final Marker DELETE_ASSIGNMENT_MARKER = LoggingMarker.DELETE_ASSIGNMENT.getMarker();
  private static final String EXCEPTION_STRING = "Exception: {}";

  private HttpServletRequest httpServletRequest;
  private AssignmentApiClient assignmentApiClient;

  private PersistenceService persistenceService;

  CqnAnalyzerWrapper cqnAnalyzerWrapper;

  @Autowired
  public DeleteAssignmentActionHandler(CqnAnalyzerWrapper cqnAnalyzerWrapper, AssignmentApiClient assignmentApiClient,
      HttpServletRequest httpServletRequest, PersistenceService persistenceService) {
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.assignmentApiClient = assignmentApiClient;
    this.httpServletRequest = httpServletRequest;
    this.persistenceService = persistenceService;

  }

  @On(event = Constants.ACTION_DELETE_ASSIGNMENT, entity = Staffing_.CDS_NAME)
  public void onDeleteAssignment(final DeleteAssignmentContext context) {

    LOGGER.debug(DELETE_ASSIGNMENT_MARKER,
        "Entered method onDeleteAssignment, this is the action handler for delete assignment");

    String assignmentId = "";
    String deletedAssignmentId = "";
    JSONObject assignmentBeforeDeletion = null;
    String resourceId = "";

    // Take the assignment_ID from the oData Entity using the "cqnAnalyzer" of CAP

    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    CqnSelect query = context.getCqn();
    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, query).targetKeys();

    assignmentId = (String) keys.get("assignment_ID");

    // Verify that ID is present
    if (assignmentId.isEmpty()) {
      LOGGER.error(DELETE_ASSIGNMENT_MARKER, "Technical error: the system could not determine assignment_ID");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_ID_NOTFOUND);
    }

    // Get Authorization from HTTP Request Header (via HttpServletRequest)
    String authorization = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
    String locale = httpServletRequest.getHeader(HttpHeaders.ACCEPT_LANGUAGE);

    if (authorization.isEmpty()) {
      LOGGER.info(DELETE_ASSIGNMENT_MARKER,
          "Technical error: no authorization request header found for user. Cannot call assignment-srv authenticated");
    }

    assignmentBeforeDeletion = assignmentApiClient.getAssignment(assignmentId, authorization, locale);

    if (assignmentBeforeDeletion.isEmpty()) {
      LOGGER.error(DELETE_ASSIGNMENT_MARKER,
          "Technical error: assignment deletion failed, because assignment does not exist anymore");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_ID_NOTFOUND);
    }
    LOGGER.info(DELETE_ASSIGNMENT_MARKER,
        "Existing assignment is successful retrieved from db, now we will proceed to deletion");

    deletedAssignmentId = assignmentApiClient.deleteAssignment(assignmentId, authorization, locale);

    if (deletedAssignmentId.isEmpty()) {
      LOGGER.error(DELETE_ASSIGNMENT_MARKER,
          "Technical error: assignment deletion failed, the result (deletedAssignmentId) is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_ID_NOTFOUND);
    }
    LOGGER.info(DELETE_ASSIGNMENT_MARKER, "Assignment is successfully deleted from db");

    try {

      resourceId = assignmentBeforeDeletion.get("resource_ID").toString();

      final String resource_ID = resourceId;
      String resourceName = null;

      if (!resource_ID.isEmpty()) {

        Result result = this.persistenceService
            .run(Select.from(ResourceDetails_.class).where(b -> b.get("resource_ID").eq(resource_ID)));
        Optional<Row> row = result.first();

        if (row.isPresent()) {
          resourceName = row.get().get("fullName").toString();
        }

      }

      // Add success message to message container
      context.getMessages().success(MessageKeys.ASSIGNMENT_WAS_DELETED, resourceName);
      context.setCompleted();

    } catch (JSONException e) {
      LOGGER.error(DELETE_ASSIGNMENT_MARKER, EXCEPTION_STRING, e);
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);
    }

  }

}
