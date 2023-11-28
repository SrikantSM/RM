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
import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.actions.utils.LoggingMarker;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import com.sap.resourcemanagement.resource.ResourceDetails_;

import jakarta.servlet.http.HttpServletRequest;
import processresourcerequestservice.AssignForSpecificPeriodContext;
import processresourcerequestservice.MatchingCandidates_;
import processresourcerequestservice.ProcessResourceRequestService_;

@RequestScope
@Component
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class AssignResourceRequestActionHandler implements EventHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignResourceRequestActionHandler.class);
  private static final Marker MARKER = LoggingMarker.CREATE_ASSIGNMENT.getMarker();
  private static final String EXCEPTION_STRING = "Exception: {}";
  private static final String SIMULATE_ASG_BASED_ON_TOTAL_HOURS = "/SimulateAsgBasedOnTotalHours";

  private PersistenceService persistenceService;

  CqnAnalyzerWrapper cqnAnalyzerWrapper;
  private AssignmentApiClient assignmentApiClient;
  private HttpServletRequest httpServletRequest;

  @Autowired
  public AssignResourceRequestActionHandler(CqnAnalyzerWrapper cqnAnalyzerWrapper,
      AssignmentApiClient assignmentApiClient, HttpServletRequest httpServletRequest,
      PersistenceService persistenceService) {
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.assignmentApiClient = assignmentApiClient;
    this.httpServletRequest = httpServletRequest;
    this.persistenceService = persistenceService;

  }

  @On(event = AssignForSpecificPeriodContext.CDS_NAME, entity = MatchingCandidates_.CDS_NAME)
  public void onAssignForSpecificPeriod(final AssignForSpecificPeriodContext context) {

    LOGGER.debug(MARKER, "Entered method onAssignForSpecificPeriod, this is an action handler for create assignment");

    String resourceRequestId = "";
    String resourceId = "";

    // Take the resourceRequestID (parent ID) and the resourceID (child ID)
    // from the oData Entity using the "cqnAnalyzer" of CAP

    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    CqnSelect query = context.getCqn();
    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, query).targetKeys();

    resourceRequestId = (String) keys.get("resourceRequest_ID");
    resourceId = (String) keys.get("resource_ID");

    // Verify that both IDs are present
    if (resourceRequestId.isEmpty() || resourceId.isEmpty()) {
      LOGGER.error(MARKER, "Technical error: the system could not determine both the IDs");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.RESREQID_RESID_NOTFOUND);
    }

    // Get the provided parameters
    LocalDate start = context.getAssignedStart();
    LocalDate end = context.getAssignedEnd();
    Integer duration = context.getAssignedDuration();

    Integer assignmentStatus = context.getAssignmentStatus();

    // Verify start, end and duration
    if (start == null) {
      LOGGER.error(MARKER, "Error: User must enter start date");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_START_NULL);
    }

    if (end == null) {
      LOGGER.error(MARKER, "Error: User must enter end date");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_END_NULL);
    }

    if (duration == 0) {
      LOGGER.error(MARKER, "Error: User must enter duration");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DURATION_NULL);
    }

    // Verify end is greater than start
    if (end.isBefore(start)) {

      LOGGER.error(MARKER, "Error: Start date later than end date");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_START_LESS_THAN_END);

    }

    // Get Authorization from HTTP Request Header (via HttpServletRequest)
    String authorization = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
    String locale = httpServletRequest.getHeader(HttpHeaders.ACCEPT_LANGUAGE);

    if (authorization.isEmpty()) {
      LOGGER.info(MARKER,
          "Technical error: no authorization request header found for user. Cannot call assignment-srv authenticated");
    }

    String json = new JSONObject().put("resourceRequestId", resourceRequestId).put("resourceId", resourceId)
        .put("start", start).put("end", end).put("duration", Integer.toString(duration))
        .put("mode", Constants.INSERT_MODE).put("assignmentStatusCode", assignmentStatus).toString();

    // Define initial JSON object for assignment responses
    JSONObject assignmentSimulation = null;
    JSONObject assignmentDraft = null;
    JSONObject assignmentActive = null;

    assignmentSimulation = assignmentApiClient.simulateAssignment(json, authorization,
        SIMULATE_ASG_BASED_ON_TOTAL_HOURS, locale);

    if (assignmentSimulation.isEmpty()) {
      LOGGER.error(MARKER, "Technical error: assignment simulation failed, the simulation result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }
    LOGGER.info(MARKER, "Simulation was successful, now draft entities will be created");

    assignmentDraft = assignmentApiClient.createAssignmentDraft(assignmentSimulation, authorization, locale);

    if (assignmentDraft.isEmpty()) {
      LOGGER.error(MARKER, "Technical error: assignment draft creation failed, the draft result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }
    LOGGER.info(MARKER, "Draft creation was successful, now draft entities will be activated");

    assignmentActive = assignmentApiClient.activateAssignment(assignmentDraft, authorization, locale);

    if (assignmentActive.isEmpty()) {
      LOGGER.error(MARKER, "Technical error: assignment draft activation failed, the activation result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }
    LOGGER.info(MARKER, "Draft activation was successful, now FE side-effect will refresh the entire page");

    try {
      final String resource_ID = resourceId;

      Result result = this.persistenceService
          .run(Select.from(ResourceDetails_.class).where(b -> b.get("resource_ID").eq(resource_ID)));
      Optional<Row> row = result.first();

      String resourceName = null;

      if (row.isPresent()) {
        resourceName = row.get().get("fullName").toString();
      }

      // Add success message to message container
      context.getMessages().success(MessageKeys.ASSIGNMENT_WAS_CREATED, resourceName);
      context.setCompleted();

    } catch (JSONException e) {
      LOGGER.error(MARKER, EXCEPTION_STRING, e);
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }

  }

}
