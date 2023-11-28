package com.sap.c4p.rm.projectintegrationadapter.controller;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.model.ProjectReplicationTask;
import com.sap.c4p.rm.projectintegrationadapter.repository.IntegrationStatusRepository;
import com.sap.c4p.rm.projectintegrationadapter.service.AssignmentService;
import com.sap.c4p.rm.projectintegrationadapter.service.ReplicationService;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants.ReplicationType;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessages;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationResponseEntity;

import com.sap.resourcemanagement.config.ProjectReplicationTasks;
import com.sap.resourcemanagement.integration.ProjectReplicationStatus;
import com.sap.resourcemanagement.integration.ProjectSync;
import com.sap.resourcemanagement.integration.SupplySyncDetails;

@RestController
public class ProjectReplicationController {

  private static final Logger logger = LoggerFactory.getLogger(ProjectReplicationController.class);
  private static final Marker REP_CREATE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_CREATE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_DELETE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_DELETE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_CHANGE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_DELETE_PROJECT_MARKER = LoggingMarker.REPLICATION_DELETE_PROJECT_MARKER.getMarker();

  private ReplicationService replicationService;
  private IntegrationStatusRepository integrationStatusRepository;
  private AssignmentService assignmentService;
  private ReplicationMessages messages;

  @Autowired
  public ProjectReplicationController(ReplicationService replicationService,
      IntegrationStatusRepository integrationStatusRepository, AssignmentService assignmentService,
      ReplicationMessages messages) {
    this.replicationService = replicationService;
    this.integrationStatusRepository = integrationStatusRepository;
    this.assignmentService = assignmentService;
    this.messages = messages;
  }

  /**
   * Method to handle the delta load of projects
   */
  public void doDeltaLoad(List<ProjectReplicationTasks> projectReplicationTask) {

    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Starting the Delta Load");
    int replicationType = Constants.ReplicationType.DELTA;
    ZonedDateTime lastReplicationRunTime = null;
    Map<String, ProjectReplicationTasks> projectReplicationTaskMap = new HashMap<>();

    /**
     * Prepare Project Replication Task Items Map
     */

    for (ProjectReplicationTasks item : projectReplicationTask) {
      projectReplicationTaskMap.put(item.getServiceOrganizationCode(), item);
    }

    /**
     * Get last initial load and delta load run details
     */
    ProjectReplicationStatus initialProjectReplicationStatus = replicationService
        .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    ProjectReplicationStatus deltaProjectReplicationStatus = replicationService
        .getProjectReplicationStatus(Constants.ReplicationType.DELTA);

    /**
     * Initialize lastReplicationRunTime based on different conditions: 1. If
     * "deltaProjectReplicationStatus" is null then initialize
     * lastReplicationRunTime with start time of last initial load. 2. If initial
     * load status is "completed" then initialize lastReplicationRunTime with the
     * minimum of initial load and delta load run times. 3. In all other cases
     * initialize lastReplicationRunTime with start time of last delta load.
     */
    if (deltaProjectReplicationStatus == null) {
      lastReplicationRunTime = initialProjectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));
      replicationService.setReplicationStatustoClosed(Constants.ReplicationType.INITIAL);

    } else {
      if (initialProjectReplicationStatus.getStatusCode() == Constants.RunStatus.COMPLETED) {

        Instant initialRunTime = initialProjectReplicationStatus.getStartTime();
        Instant deltaRunTime = deltaProjectReplicationStatus.getStartTime();
        Instant minimumRunTime = initialRunTime.compareTo(deltaRunTime) > 0 ? deltaRunTime : initialRunTime;
        lastReplicationRunTime = minimumRunTime.atZone(ZoneId.of("UTC"));

        replicationService.setReplicationStatustoClosed(Constants.ReplicationType.INITIAL);

      } else {
        lastReplicationRunTime = deltaProjectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));
      }
    }

    try {
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Calling replicateProjectsForDeltaLoad");
      replicationService.replicateProjectsForDeltaLoad(deltaProjectReplicationStatus, replicationType,
          lastReplicationRunTime, projectReplicationTask);
    } catch (Exception e) {
      /**
       * If any error ocurrs, we need to rollback the complete transaction and bail
       * out.
       */
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Failed while replicating projects for delta load.");
      messages.error(e.getMessage());
      throw new ServiceException(e);
    }
    processAllProjectsFromProjectSync(replicationType, projectReplicationTaskMap);
  }

  /**
   * Method to handle the initial load of projects
   */

  public void doInitialLoad(ProjectReplicationTask projectReplicationTask) {
    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Entered doInitialLoad of ProjectReplicationController class.");
    int replicationType = Constants.ReplicationType.INITIAL;
    List<String> serviceOrganizationCodes = new ArrayList<>();
    serviceOrganizationCodes.add(projectReplicationTask.getServiceOrganizationCode());

    /**
     * Prepare Project Replication Task Items Map
     */
    Map<String, ProjectReplicationTasks> projectReplicationTaskMap = new HashMap<>();
    projectReplicationTaskMap.put(projectReplicationTask.getServiceOrganizationCode(),
        getDbEntityFromPayload(projectReplicationTask));

    String param = projectReplicationTask.getServiceOrganizationCode().replaceAll("[\n\\\r\\\t]", "_");
    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "The Initial load is started for service organization:{}",
        param);

    try {
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Calling replicateProjectsForInitialLoad");
      replicationService.replicateProjectsForInitialLoad(projectReplicationTask);
    } catch (Exception e) {
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Failed while replicating projects for initial load.");
      messages.error(e.getMessage());
      throw new ServiceException(e);
    }
    processAllProjectsFromProjectSync(replicationType, projectReplicationTaskMap);
  }

  /**
   * Method to handle retry of initial load
   */
  public void retryInitialLoad(ProjectReplicationStatus projectReplicationStatus,
      ProjectReplicationTask projectReplicationTask) {
    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER,
        "Entered retryInitialLoad of ProjectReplicationController class.");
    int replicationType = Constants.ReplicationType.INITIAL;
    List<String> serviceOrganizations = new ArrayList<>();
    serviceOrganizations.add(projectReplicationTask.getServiceOrganizationCode());

    /**
     * Prepare Project Replication Task Items Map
     */
    HashMap<String, ProjectReplicationTasks> projectReplicationTaskMap = new HashMap<>();
    projectReplicationTaskMap.put(projectReplicationTask.getServiceOrganizationCode(),
        getDbEntityFromPayload(projectReplicationTask));

    String param = projectReplicationTask.getServiceOrganizationCode().replaceAll("[\n\\\r\\\t]", "_");
    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "The Initial load Retry is started for service organization:{}",
        param);
    try {
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Calling replicateProjectsForRetryInitialLoad");
      replicationService.replicateProjectsForRetryInitialLoad(projectReplicationStatus, replicationType,
          serviceOrganizations);

    } catch (Exception e) {
      /**
       * If any error ocurrs, we need to rollback the complete transaction and bail
       * out.
       */
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER,
          "Failed while retrying replication of projects for initial load.");
      messages.error(e.getMessage());
      throw new ServiceException(e);
    }
    processAllProjectsFromProjectSync(replicationType, projectReplicationTaskMap);
  }

  /**
   * Method to handle deletion of projects
   */

  public void deleteProjects(int replicationType) {

    Set<ProjectSync> projectsSync = new HashSet<>();
    logger.debug(REP_DELETE_PROJECT_MARKER, "Starting the deletion of projects");
    /**
     * If system is not ready for deletion of projects, throw the exception
     */
    String eligibilityCheck = replicationService.isEligibileForReplication();
    if (eligibilityCheck != null) {
      throw new ServiceException(eligibilityCheck);
    }
    /**
     * Get initial load run details
     */
    ProjectReplicationStatus initialLoadReplicationStatus = integrationStatusRepository
        .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);

    if (initialLoadReplicationStatus != null) {
      /**
       * Proceed with delete only if there is atleast one service organization for
       * which initial load is completed
       */
      List<ProjectReplicationTasks> projectReplicationTasks = replicationService
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      if (!projectReplicationTasks.isEmpty()) {
        List<String> serviceOrganizationCodes = new ArrayList<>();
        for (ProjectReplicationTasks item : projectReplicationTasks) {
          serviceOrganizationCodes.add(item.getServiceOrganizationCode());
        }

        try {
          logger.debug(REP_DELETE_PROJECT_MARKER, "Calling projectsDeletion for project deletion.");
          replicationService.projectsDeletion(replicationType, projectReplicationTasks, projectsSync);
        } catch (Exception e) {

          /**
           * If any error ocurrs, we need to set the status accordingly, rollback the
           * complete transaction and bail out.
           */
          logger.debug(REP_DELETE_PROJECT_MARKER, "Failed while performing delete.");
          replicationService.setReplicationStatustoCompletedOrError(replicationType, serviceOrganizationCodes);

          messages.error(e.getMessage());

          throw new ServiceException(e);
        }

        /**
         * When processing of all projects is done successfully, we need to mark
         * replication status accordingly.
         */

        replicationService.setReplicationStatustoCompletedOrError(replicationType, serviceOrganizationCodes);
        logger.info(REP_DELETE_PROJECT_MARKER, "Project Deletion completed");

      }
    }
  }

  /**
   * Method to handle processing of individual projects
   */
  public void processAllProjectsFromProjectSync(int replicationType,
      Map<String, ProjectReplicationTasks> projectReplicationTaskMap) {

    ArrayList<String> serviceOrganizationCodes = projectReplicationTaskMap.keySet().stream()
        .collect(Collectors.toCollection(ArrayList::new));
    /**
     * This loop runs until all the projects are replicated. It breaks when there is
     * no further project to process.
     */
    logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Starting Processing of all projects from Project Sync");
    while (true) {

      // Initialize projectToProcess to null
      ProjectSync projectToProcess = null;

      try {

        projectToProcess = integrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING,
            replicationType, serviceOrganizationCodes);

        // If all projects are processed and no further project is remaining to be
        // processed, then bail out early.
        if (projectToProcess == null) {
          break;
        }
        boolean autoPublish = false;
        if (projectReplicationTaskMap.containsKey(projectToProcess.getServiceOrganizationCode())
            && projectReplicationTaskMap.get(projectToProcess.getServiceOrganizationCode())
                .getIsAutoPublishCode() != null)
          autoPublish = projectReplicationTaskMap.get(projectToProcess.getServiceOrganizationCode())
              .getIsAutoPublishCode().equals(Constants.AUTO_PUBLISH_ON);
        replicationService.replicateProjectTree(replicationType, projectToProcess, autoPublish);
      } catch (ServiceException e) {
        logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Error occured while processing project from Project Sync.");
        StringBuilder errorMessage = new StringBuilder("Error occured while processing the project ");

        /**
         * If there was a project to process but in between some error ocurred, we need
         * to set the project status to ERROR
         */
        if (projectToProcess != null) {
          errorMessage.append(projectToProcess.getProject());
          errorMessage.append(' ');

          // Set Project status to Error

          replicationService.setProjectSyncStatusToError(projectToProcess.getProject(), replicationType);

        }

        logger.error(REP_CHANGE_PROJECTREPLICATION_MARKER, errorMessage.toString());
        logger.error(REP_CHANGE_PROJECTREPLICATION_MARKER, "Reason for failure: {}", e.toString());
        messages.error(errorMessage.toString());
      }
    }

    /**
     * When all processing of all projects is done or there was some error, we need
     * to mark replication status accordingly.
     */

    replicationService.setReplicationStatustoCompletedOrError(replicationType, serviceOrganizationCodes);

    if (replicationType == Constants.ReplicationType.INITIAL) {
      replicationService.createDeltaAndDeleteJob();
    }

    logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Project execution completed");

    /**
     * Also replicate those supply line items that now have a corresponding
     * published request in separate transaction
     */
    replicateExistingSupplyLineItemsForNewlyPublishedRequests();

  }

  void replicateExistingSupplyLineItemsForNewlyPublishedRequests() {

    logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Starting supply replication for newly published requests");
    List<SupplySyncDetails> demandsToQuerySupplyFor = assignmentService.getDemandsToQuerySupplyFor();

    if (demandsToQuerySupplyFor.isEmpty()) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "No demands found to replicate supply for");
      return;
    }

    for (SupplySyncDetails currDemand : demandsToQuerySupplyFor) {

      try {
        // Each demand and all its supply is wrapped in a separate transaction
        replicationService.supplyDemand(currDemand);
      } catch (Exception e) {
        messages.error(e.getMessage());
        logger.warn(REP_CHANGE_PROJECTREPLICATION_MARKER, "Supply replication failed with Exception: {}", e.toString());
      }

    }

  }

  @PostMapping("/deleteProjects")
  public ResponseEntity<ReplicationResponseEntity> onDeleteProjects() {
    ReplicationResponseEntity response;
    logger.debug(REP_DELETE_PROJECTREPLICATION_MARKER, "Delete endpoint has been triggered");
    try {
      this.deleteProjects(ReplicationType.DELETE);

      if (!(messages.getErrorMessages().isEmpty()))
        throw new ServiceException("Delete Projects has few failues");

      String message = "Projects Deletion Trigger is completed";
      logger.info(REP_DELETE_PROJECTREPLICATION_MARKER, message);

      response = new ReplicationResponseEntity(message, null);
      return new ResponseEntity<>(response, HttpStatus.OK);

    } catch (ServiceException serviceException) {
      logger.error(REP_DELETE_PROJECTREPLICATION_MARKER,
          "Error occurred during project deletion trigger. Exception: {}", serviceException.toString());
      String message = "Projects Deletion Trigger failed";

      if (messages.getErrorMessages().isEmpty())
        messages.error(serviceException.getMessage());

      response = new ReplicationResponseEntity(message, messages.getErrorMessages());
      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/replicateS4ProjectsDelta")
  public ResponseEntity<ReplicationResponseEntity> onReplicateS4ProjectsDeltaLoad() {
    ReplicationResponseEntity response;
    String message;
    List<ProjectReplicationTasks> serviceOrganizationsWithInitialLoadDone = new ArrayList<>();
    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Delta Load endpoint has been triggered");
    try {

      /**
       * If system is not ready for replication, throw the exception
       */
      String eligibilityCheck = replicationService.isEligibileForReplication();
      if (eligibilityCheck != null) {
        throw new ServiceException(eligibilityCheck);
      }

      /**
       * Get the initial load replication status
       */
      ProjectReplicationStatus initialLoadReplicationStatus = replicationService
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);

      if (initialLoadReplicationStatus != null
          && ((initialLoadReplicationStatus.getStatusCode() == Constants.RunStatus.ERROR)
              || (initialLoadReplicationStatus.getStatusCode() == Constants.RunStatus.COMPLETED)
              || (initialLoadReplicationStatus.getStatusCode() == Constants.RunStatus.CLOSED))) {
        /**
         * Check if there is atleast one service organization with initial load
         * completed status. If yes, then do delta load
         */
        serviceOrganizationsWithInitialLoadDone = replicationService
            .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

        if (!serviceOrganizationsWithInitialLoadDone.isEmpty()) {
          doDeltaLoad(serviceOrganizationsWithInitialLoadDone);
          message = "Delta load is completed";
          logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, message);
        } else {
          message = "No Service Organizations found with Initial load completed. Delta load will not happen";
          logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, message);
        }
      } else {
        message = "Initial load is not yet done. Delta load will not happen";
        logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, message);
      }

      if (!(messages.getErrorMessages().isEmpty()))
        throw new ServiceException("Replication has few failues");

      response = new ReplicationResponseEntity(message, null);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (ServiceException serviceException) {

      message = "Error occurred during delta load";
      logger.error(REP_CREATE_PROJECTREPLICATION_MARKER, message, serviceException.toString());

      if (messages.getErrorMessages().isEmpty())
        messages.error(serviceException.getMessage());

      response = new ReplicationResponseEntity(message, messages.getErrorMessages());
      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @PostMapping("/replicateS4ProjectsInitial")
  public ResponseEntity<ReplicationResponseEntity> onReplicateS4ProjectsInitialLoad(
      @RequestBody ProjectReplicationTask projectReplicationTask) {
    ReplicationResponseEntity response;
    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Initial Load endpoint has been triggered");
    try {
      /**
       * Get last initial load run details
       */
      ProjectReplicationStatus initialLoadReplicationStatus = replicationService
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);

      List<String> serviceOrganizations = new ArrayList<>();
      serviceOrganizations.add(projectReplicationTask.getServiceOrganizationCode());

      /**
       * Set the replication status to PROCESSING on the start of inital load
       */
      replicationService.updateProjectReplicationTaskStatus(serviceOrganizations, Constants.RunStatus.PROCESSING);
      
      /**
       * If system is not ready for replication, throw the exception
       */
      String eligibilityCheck = replicationService.isEligibileForReplication();
      if (eligibilityCheck != null) {
        /*
         * Check if eligibility check not maintained, update status to error in project
         * replication task so the end user is notified that initial load didn't get
         * through
         */
        replicationService.updateProjectReplicationTaskStatus(serviceOrganizations, Constants.RunStatus.ERROR);
        logger.error(REP_CREATE_PROJECTREPLICATION_MARKER, eligibilityCheck);
        throw new ServiceException(eligibilityCheck);
      }
      /**
       * If the initial load replication Status of Service Organization is in ERROR
       * State then do retry of initial load
       */
      if (projectReplicationTask.getTaskStatusCode() == Constants.RunStatus.ERROR) {

        /*
         * check if error is caused while processing projects or due to eligbility check
         * not met If eligibility check not met then the project sync table will return
         * null result. if project sync has atleast one error data then it is error
         * scenario so retry. if project sync doesn't have data than initial load
         * previously didn't happen hence again do initial load
         */
        ProjectSync projectSync = integrationStatusRepository.getSingleProjectSync(Constants.RunStatus.ERROR,
            Constants.ReplicationType.INITIAL, serviceOrganizations);
        if (projectSync != null) {

          retryInitialLoad(initialLoadReplicationStatus, projectReplicationTask);

        } else {

          doInitialLoad(projectReplicationTask);

        }

      } else {
        doInitialLoad(projectReplicationTask);
      }

      if (!(messages.getErrorMessages().isEmpty()))
        throw new ServiceException("Replication has few failues");

      String message = "Initial Load Replication is completed";
      logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, message);

      response = new ReplicationResponseEntity(message, null);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (ServiceException serviceException) {

      String message = "Error occurred during initial load";
      logger.error(REP_CREATE_PROJECTREPLICATION_MARKER, message, serviceException.getMessage(),
          serviceException.toString());

      if (messages.getErrorMessages().isEmpty())

        messages.error(serviceException.getMessage());
      response = new ReplicationResponseEntity(message, messages.getErrorMessages());

      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  /*
   * The below function is required to convert the Project Replication Task
   * payload sent via API to the DB equivalent entity
   */
  public ProjectReplicationTasks getDbEntityFromPayload(ProjectReplicationTask projectReplicationTaskPayload) {
    ProjectReplicationTasks projectReplicationTasksDbEntity = ProjectReplicationTasks.create();
    projectReplicationTasksDbEntity.setTaskStatusCode(projectReplicationTaskPayload.getTaskStatusCode());
    projectReplicationTasksDbEntity
        .setReferenceDate(LocalDate.of(Integer.parseInt(projectReplicationTaskPayload.getReferenceDate().split("-")[0]),
            Integer.parseInt(projectReplicationTaskPayload.getReferenceDate().split("-")[1]),
            Integer.parseInt(projectReplicationTaskPayload.getReferenceDate().split("-")[2])));
    projectReplicationTasksDbEntity
        .setServiceOrganizationCode(projectReplicationTaskPayload.getServiceOrganizationCode());
    projectReplicationTasksDbEntity.setIsAutoPublishCode(
        projectReplicationTaskPayload.getIsAutoPublish() ? Constants.AUTO_PUBLISH_ON : Constants.AUTO_PUBLISH_OFF);
    return projectReplicationTasksDbEntity;
  }

}
