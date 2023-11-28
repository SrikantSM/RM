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

import com.sap.resourcemanagement.resource.ResourceDetails;
import com.sap.resourcemanagement.resource.ResourceDetails_;

import jakarta.servlet.http.HttpServletRequest;
import processresourcerequestservice.AssignAsRequestedContext;
import processresourcerequestservice.MatchingCandidates;
import processresourcerequestservice.MatchingCandidates_;
import processresourcerequestservice.ProcessResourceRequestService_;

@RequestScope
@Component
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class AssignAsRequestedActionHandler implements EventHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignAsRequestedActionHandler.class);
  private static final Marker MARKER = LoggingMarker.CREATE_ASSIGNMENT.getMarker();
  private static final String EXCEPTION_STRING = "Exception: {}";
  private static final String SIMULATE_ASSIGN_AS_REQUESTED = "/SimulateAssignmentAsRequested";

  private PersistenceService persistenceService;

  CqnAnalyzerWrapper cqnAnalyzerWrapper;
  private AssignmentApiClient assignmentApiClient;
  private HttpServletRequest httpServletRequest;

  @Autowired
  public AssignAsRequestedActionHandler(CqnAnalyzerWrapper cqnAnalyzerWrapper, AssignmentApiClient assignmentApiClient,
      HttpServletRequest httpServletRequest, PersistenceService persistenceService) {
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.assignmentApiClient = assignmentApiClient;
    this.httpServletRequest = httpServletRequest;
    this.persistenceService = persistenceService;

  }

  @On(event = Constants.ACTION_ASSIGN_AS_REQUESTED, entity = MatchingCandidates_.CDS_NAME)
  public void onAssignAsRequested(final AssignAsRequestedContext context) {

    LOGGER.debug(MARKER, "Entered method onAssignForSpecificPeriod, this is an action handler for create assignment");

    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    CqnSelect query = context.getCqn();
    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, query).targetKeys();

    String resourceRequestId = (String) keys.get(MatchingCandidates.RESOURCE_REQUEST_ID);
    String resourceId = (String) keys.get(MatchingCandidates.RESOURCE_ID);

    if (resourceRequestId.isEmpty() || resourceId.isEmpty()) {
      LOGGER.error(MARKER, "Technical error: the system could not determine both the IDs");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.RESREQID_RESID_NOTFOUND);
    }

    String authorization = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
    String locale = httpServletRequest.getHeader(HttpHeaders.ACCEPT_LANGUAGE);

    if (authorization == null) {
      LOGGER.info(MARKER,
          "Technical error: no authorization request header found for user. Cannot call assignment-srv authenticated");
    }

    String json = new JSONObject().put(Constants.RESOURCE_REQUEST_ID, resourceRequestId)
        .put(Constants.RESOURCE_ID, resourceId).put(Constants.MODE, Constants.INSERT_MODE).toString();

    JSONObject assignmentSimulation = assignmentApiClient.simulateAssignment(json, authorization,
        SIMULATE_ASSIGN_AS_REQUESTED, locale);

    if (assignmentSimulation.isEmpty()) {
      LOGGER.error(MARKER, "Technical error : assignment simulation failed, the simulation result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }
    LOGGER.info(MARKER, "Simulation was successful,now the draft entities will be created");

    JSONObject assignmentDraft = assignmentApiClient.createAssignmentDraft(assignmentSimulation, authorization, locale);

    if (assignmentDraft.isEmpty()) {
      LOGGER.error(MARKER, "Technical error : Assignment draft creation has failed, the draft result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }
    LOGGER.info(MARKER, "Draft creation was successful, now the draft entities will be activated");

    JSONObject assignmentActive = assignmentApiClient.activateAssignment(assignmentDraft, authorization, locale);

    if (assignmentActive.isEmpty()) {
      LOGGER.error(MARKER, "Technical error : Assignment draft activation has failed, the activation result is empty");
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }
    LOGGER.info(MARKER, "Draft activation was successful, now Front-End side-effect will refresh the entire page");

    try {
      final String resource_ID = resourceId;

      Result result = this.persistenceService
          .run(Select.from(ResourceDetails_.class).where(b -> b.get(ResourceDetails.RESOURCE_ID).eq(resource_ID)));
      Optional<Row> row = result.first();

      String resourceName = null;

      if (row.isPresent()) {
        resourceName = row.get().get(ResourceDetails.FULL_NAME).toString();
      }

      context.getMessages().success(MessageKeys.ASSIGNMENT_WAS_CREATED, resourceName);
      context.setCompleted();

    } catch (JSONException e) {
      LOGGER.error(MARKER, EXCEPTION_STRING, e);
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_FAILURE);
    }

  }

}
