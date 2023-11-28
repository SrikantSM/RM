package com.sap.c4p.rm.resourcerequest.actions.handlers;

import java.time.LocalDate;
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
import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentCompare;
import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.actions.utils.LoggingMarker;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import com.sap.resourcemanagement.resource.ResourceDetails_;

import jakarta.servlet.http.HttpServletRequest;
import processresourcerequestservice.ChangeAssignmentContext;
import processresourcerequestservice.ProcessResourceRequestService_;
import processresourcerequestservice.Staffing_;

@RequestScope
@Component
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class ChangeAssignmentActionHandler implements EventHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(ChangeAssignmentActionHandler.class);
  private static final Marker CHANGE_ASSIGNMENT_MARKER = LoggingMarker.CHANGE_ASSIGNMENT.getMarker();
  private static final String EXCEPTION_STRING = "Exception: {}";
  private static final String SIMULATE_ASG_BASED_ON_TOTAL_HOURS = "/SimulateAsgBasedOnTotalHours";
  private static final String RESOURCE_ID = "resource_ID";
  private static final String RESOURCEREQUEST_ID = "resourceRequest_ID";

  private HttpServletRequest httpServletRequest;
  private AssignmentApiClient assignmentApiClient;

  private PersistenceService persistenceService;

  CqnAnalyzerWrapper cqnAnalyzerWrapper;

  @Autowired
  public ChangeAssignmentActionHandler(CqnAnalyzerWrapper cqnAnalyzerWrapper, AssignmentApiClient assignmentApiClient,
      HttpServletRequest httpServletRequest, PersistenceService persistenceService) {
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.assignmentApiClient = assignmentApiClient;
    this.httpServletRequest = httpServletRequest;
    this.persistenceService = persistenceService;

  }

  @On(event = ChangeAssignmentContext.CDS_NAME, entity = Staffing_.CDS_NAME)
  public void onChangeAssignment(final ChangeAssignmentContext context) {

    LOGGER.debug(CHANGE_ASSIGNMENT_MARKER,
        "Enter method onChangeAssignment, this is an action handler for change assignment");

    String assignmentId = "";
    String resourceRequestId = "";
    String resourceId = "";
    JSONObject assignmentBeforeChange = null;
    JSONObject assignmentAfterSimulation = null;
    JSONObject assignmentAfterComparison = null;
    JSONObject assignmentAfterChange = null;
    AssignmentCompare assignmentCompare;

    // Take the assignment_ID from the oData Entity using the "cqnAnalyzer" of CAP
    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    CqnSelect query = context.getCqn();
    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, query).targetKeys();

    assignmentId = (String) keys.get("assignment_ID");

    // Verify that assignment ID is present
    if (assignmentId.isEmpty()) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER, "Technical error: the system could not determine assignment_ID");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_ID_NOTFOUND);
    }

    // Get the provided parameters
    LocalDate start = context.getAssignedStart();
    LocalDate end = context.getAssignedEnd();
    Integer duration = context.getAssignedDuration();
    Integer assignmentStatus = context.getAssignmentStatus();

    // Verify start, end and duration
    if (start == null) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER, "Error: User must enter start date");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_START_NULL);
    }

    if (end == null) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER, "Error: User must enter end date");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_END_NULL);
    }

    if (duration == 0) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER, "Error: User must enter duration");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DURATION_NULL);
    }

    // Verify end is greater than start
    if (end.isBefore(start)) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER, "Error: Start date later than end date");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_START_LESS_THAN_END);
    }

    // Get Authorization from HTTP Request Header (via HttpServletRequest)
    String authorization = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
    String locale = httpServletRequest.getHeader(HttpHeaders.ACCEPT_LANGUAGE);

    if (authorization.isEmpty()) {
      LOGGER.info(CHANGE_ASSIGNMENT_MARKER,
          "Technical error: no authorization request header found for user. Cannot call assignment-srv authenticated");
    }

    assignmentBeforeChange = assignmentApiClient.getAssignmentwithBuckets(assignmentId, authorization, locale);

    if (assignmentBeforeChange.isEmpty()) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER,
          "Technical error: assignment change failed, because assignment does not exist anymore");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_ID_NOTFOUND);
    }
    LOGGER.info(CHANGE_ASSIGNMENT_MARKER, "Existing assignment is successfully retrieved from db");

    resourceRequestId = (String) assignmentBeforeChange.get(RESOURCEREQUEST_ID);
    resourceId = (String) assignmentBeforeChange.get(RESOURCE_ID);

    // Verify that both IDs are present
    if (resourceRequestId.isEmpty() || resourceId.isEmpty()) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER, "Technical error: the system could not determine both the IDs");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.RESREQID_RESID_NOTFOUND);
    }

    // Get simulation results of changed assignment
    String json = new JSONObject().put("resourceRequestId", resourceRequestId).put("resourceId", resourceId)
        .put("start", start).put("end", end).put("duration", Integer.toString(duration))
        .put("mode", Constants.CHANGE_MODE).put("assignmentStatusCode", assignmentStatus).toString();

    assignmentAfterSimulation = assignmentApiClient.simulateAssignment(json, authorization,
        SIMULATE_ASG_BASED_ON_TOTAL_HOURS, locale);

    if (assignmentAfterSimulation.isEmpty()) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER,
          "Technical error: assignment simulation failed, the simulation result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_CHANGE_FAILURE);
    }
    LOGGER
        .info("Simulation with new user parameters was successful, now comparison of old and new values will be done");

    // Compare old assignment and new simulated assignment values to determing the
    // entries to be send for Upsert
    assignmentCompare = new AssignmentCompare();
    assignmentAfterComparison = assignmentCompare.compareForAssigmentChange(assignmentId, assignmentBeforeChange,
        assignmentAfterSimulation);

    // Add a check here for comparison
    if (assignmentAfterComparison.isEmpty()) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER,
          "Technical error: assignment change failed, the comparison result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_CHANGE_FAILURE);
    }
    LOGGER.info(CHANGE_ASSIGNMENT_MARKER,
        "Comparison of existing assignment and simulation result is completed, now assignments will be updated in db");

    assignmentAfterChange = assignmentApiClient.changeAssignment(assignmentId, authorization, assignmentAfterComparison,
        locale);

    // Add a check here for change of assignment
    if (assignmentAfterChange.isEmpty()) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER,
          "Technical error: assignment change failed, the comparison result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_CHANGE_FAILURE);
    }
    LOGGER.info(CHANGE_ASSIGNMENT_MARKER, "Assignment update on active entities was successful");

    try {

      final String resource_ID = resourceId;
      String resourceName = null;

      Result result = this.persistenceService
          .run(Select.from(ResourceDetails_.class).where(b -> b.get(RESOURCE_ID).eq(resource_ID)));
      Optional<Row> row = result.first();

      if (row.isPresent()) {
        resourceName = row.get().get("fullName").toString();
      }

      // Add success message to message container
      context.getMessages().success(MessageKeys.ASSIGNMENT_WAS_CHANGED, resourceName);

      // Set completed for this HTTP oData request
      context.setCompleted();

    } catch (JSONException e) {
      LOGGER.error(CHANGE_ASSIGNMENT_MARKER, EXCEPTION_STRING, e);
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_CHANGE_FAILURE);
    }

  }
}
