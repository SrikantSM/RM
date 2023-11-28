package com.sap.c4p.rm.projectintegrationadapter.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.CdsData;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service.JobSchedulerServiceInterface;
import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.model.ProjectReplicationTask;
import com.sap.c4p.rm.projectintegrationadapter.repository.DemandRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.IntegrationStatusRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectReplicationTasksRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ResourceRequestRepository;
import com.sap.c4p.rm.projectintegrationadapter.transformation.TransformS4ProjectToRM;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants.ReplicationType;
import com.sap.c4p.rm.projectintegrationadapter.util.ProjectManagementS4Client;

import com.sap.resourcemanagement.config.ProjectReplicationTasks;
import com.sap.resourcemanagement.integration.ProjectReplicationStatus;
import com.sap.resourcemanagement.integration.ProjectSync;
import com.sap.resourcemanagement.integration.SupplySyncDetails;
import com.sap.resourcemanagement.project.Projects;

@Component
public class ReplicationService {

  private static final Logger logger = LoggerFactory.getLogger(ReplicationService.class);

  private IntegrationStatusRepository integrationStatusRepository;
  private ProjectManagementS4Client s4Client;
  private DemandRepository demandRepository;
  private ProjectRepository projectRepository;
  private ResourceRequestRepository resourceRequestRepository;
  private ProjectReplicationTasksRepository projectReplicationTasksRepository;
  private TransformS4ProjectToRM transformS4ProjectToRM;
  private DetermineChange determineChange;
  private AssignmentService assignmentService;
  private JobSchedulerServiceInterface jobSchedulerService;
  private XsuaaUserInfo xsuaaUserInfo;

  private static final Marker REP_CREATE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_CREATE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_DELETE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_DELETE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_CHANGE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_FETCH_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker SUPPLY_REPLICATION_MARKER = LoggingMarker.SUPPLY_REPLICATION_MARKER.getMarker();

  @Autowired
  public ReplicationService(IntegrationStatusRepository integrationStatusRepository, ProjectManagementS4Client s4Client,
      DemandRepository demandRepository, ProjectRepository projectRepository,
      ResourceRequestRepository resourceRequestRepository,
      ProjectReplicationTasksRepository projectReplicationTasksRepository,
      TransformS4ProjectToRM transformS4ProjectToRM, DetermineChange determineChange,
      AssignmentService assignmentService, JobSchedulerServiceInterface jobSchedulerService,
      XsuaaUserInfo xsuaaUserInfo) {
    this.integrationStatusRepository = integrationStatusRepository;
    this.s4Client = s4Client;
    this.demandRepository = demandRepository;
    this.projectRepository = projectRepository;
    this.resourceRequestRepository = resourceRequestRepository;
    this.projectReplicationTasksRepository = projectReplicationTasksRepository;
    this.transformS4ProjectToRM = transformS4ProjectToRM;
    this.determineChange = determineChange;
    this.assignmentService = assignmentService;
    this.jobSchedulerService = jobSchedulerService;
    this.xsuaaUserInfo = xsuaaUserInfo;
  }

  public List<Project> getAllProjects(ZonedDateTime dateTime) {
    try {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Entered method getAllProjects, in ReplicationService class");
      List<Project> fetchedProjects = s4Client.getProjectIds(Constants.PAGE_SIZE, dateTime);
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Number of Projects fetched : {}", fetchedProjects.size());

      List<Project> allProjects = new ArrayList<>();
      allProjects.addAll(fetchedProjects);

      while (fetchedProjects.size() == Constants.PAGE_SIZE) {
        Project lastProject = fetchedProjects.get(Constants.PAGE_SIZE - 1);
        fetchedProjects = s4Client.getProjectIds(Constants.PAGE_SIZE, lastProject.getChangedOn());
        logger.info(REP_FETCH_PROJECTREPLICATION_MARKER, "Projects fetch : {}", fetchedProjects.size());
        allProjects.addAll(fetchedProjects);

      }

      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Getting  Projects finished:");
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Total Projects: {}", allProjects.size());
      return allProjects;
    } catch (ServiceException serviceException) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed while fetching project.");
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed while fetching project.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Error occured while getting projectlist from S/4", e);
    }
  }

  /*
   * Get Projects based on service organization code and reference date
   */

  public List<Project> getAllProjectsForReplicationTask(ProjectReplicationTask projectReplicationTask) {
    try {

      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
          "Entered method getAllProjectsForReplicationTask, in ReplicationService class");
      List<Project> fetchedProjects = s4Client.getProjectIdsForReplicationTask(Constants.PAGE_SIZE,
          projectReplicationTask);
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Total Projects: {}", fetchedProjects.size());
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Getting  Projects finished:");
      return fetchedProjects;

    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed while fetching project for replication task {}.",
          projectReplicationTask);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY,
          "Error occured while getting projectlist from S/4 during initial load", e);
    }
  }

  public List<Project> getFilteredProjects(List<ProjectReplicationTasks> projectReplicationTasks,
      List<Project> allProjects) {
    /**
     * This method filters the fetched projects based on two conditions: 1. The
     * projects OrgId should be equal to Current ProjectReplicationTask Service org
     * code and 2. The projects end date should be greater than or equal to that of
     * ProjectReplicationTask Reference date.
     */
    return allProjects.stream()
        .filter(project -> projectReplicationTasks.stream().anyMatch(
            projectReplicationTask -> projectReplicationTask.getServiceOrganizationCode().equals(project.getOrgID())
                && project.getEndDate().compareTo(projectReplicationTask.getReferenceDate().atTime(0, 00, 0)) >= 0))
        .collect(Collectors.toList());

  }

  public ZonedDateTime getMaxChangedOn(List<Project> projects) {
    try {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Entered method getMaxChangedOn, in ReplicationService.");

      ZonedDateTime maxChangedOn = projects.get(0).getChangedOn();
      for (Project project : projects) {
        if (maxChangedOn.compareTo(project.getChangedOn()) < 0) {
          maxChangedOn = project.getChangedOn();
        }
      }
      return maxChangedOn;
    } catch (ServiceException serviceException) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, Constants.LoggerMessages.MAX_CHANGEON);
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, Constants.LoggerMessages.MAX_CHANGEON);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, Constants.LoggerMessages.MAX_CHANGEON, e);
    }
  }

  public void setReplicationRunStatusToProcessing(int replicationType, ZonedDateTime time,
      Set<ProjectSync> projectsToSync) {
    try {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Entered method setReplicationRunStatusToProcessing, in ReplicationService.");
      List<ProjectSync> projectsSyncList = new ArrayList<>(projectsToSync);
      ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
      if (replicationType == ReplicationType.INITIAL) {
        logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
            "Setting replication status to inprocess for replication type Initial");
        projectReplicationStatus.setTypeCode(Constants.ReplicationType.INITIAL);
        projectReplicationStatus.setStartTime(time.toInstant());
      } else if (replicationType == ReplicationType.DELTA) {
        logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
            "Setting replication status to inprocess for replication type Delta");
        projectReplicationStatus.setTypeCode(Constants.ReplicationType.DELTA);
        projectReplicationStatus.setStartTime(time.toInstant());
      } else if (replicationType == ReplicationType.DELETE) {
        logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
            "Setting replication status to inprocess for replication type Delete");
        projectReplicationStatus.setTypeCode(Constants.ReplicationType.DELETE);
      }
      projectReplicationStatus.setStatusCode(Constants.RunStatus.PROCESSING);
      ProjectReplicationStatus existingProjectReplicationStatus = integrationStatusRepository
          .readProjectReplicationStatus(replicationType);
      if (existingProjectReplicationStatus == null) {
        integrationStatusRepository.insertProjectReplicationStatus(projectReplicationStatus);
      } else {
        integrationStatusRepository.updateProjectReplicationStatus(projectReplicationStatus);
      }

      /*
       * Update or create the projects in project sync
       *
       */
      if (replicationType == ReplicationType.INITIAL || replicationType == ReplicationType.DELTA) {
        integrationStatusRepository.upsertProjectSync(projectsSyncList);

      }
    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          Constants.LoggerMessages.UPDATE_REPLICATION_STATUS_TO_PROCESSING);
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          Constants.LoggerMessages.UPDATE_REPLICATION_STATUS_TO_PROCESSING);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          Constants.LoggerMessages.UPDATE_REPLICATION_STATUS_TO_PROCESSING, e);
    }
  }

  public void insertProjectInRm(Map<String, List<CdsData>> transformedData) {
    try {
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Entered method insertProjectInRm, in ReplicationService.");
      List<CdsData> projects = transformedData.get("Project");
      if (projects != null) {
        projectRepository.upsertProjects(projects);
      }

      List<CdsData> demands = transformedData.get("Demand");
      if (demands != null)
        demandRepository.upsertDemands(demands);

      List<CdsData> resourceRequests = transformedData.get("ResourceRequest");
      if (resourceRequests != null)
        resourceRequestRepository.upsertResourceRequests(resourceRequests);

    } catch (ServiceException serviceException) {
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Error occured while insering project in RM.");
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Error occured while insering project in RM.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while insering project in RM", e);
    }
  }

  public String isEligibileForReplication() {

    /**
     * Before initiating the replication: Check for- 1. Destination is set or not by
     * customer 2. Whether Authorised for Commercial Project 3. Whether Authorised
     * for Customer Master 4. Whether Authorised for Activity Type
     */
    String message = null;

    try {

      if (s4Client.getDestination() == null) {

        message = "Destination is not maintained";

      } else if (Boolean.FALSE.equals(s4Client.isAuthorisedForCommercialProject())) {
        message = "Authorization missing to Fetch Projects";
      } else if (Boolean.FALSE.equals(s4Client.isAuthorisedForCustomerMaster())) {
        message = "Authorization missing to Fetch Customers";
      } else if (Boolean.FALSE.equals(s4Client.isAuthorisedForActivityType())) {
        message = "Authorization missing to Fetch Activity Types";
      }
      return message;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Error occured while checking eligibility for replication.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Error occured while checking eligibility for replication",
          e);
    }
  }

  public Projects getProjectTreeFromRM(String projectId) {
    return this.projectRepository.selectProjectTree(projectId);
  }

  public void setReplicationStatustoCompletedOrError(int replicationType, List<String> serviceOrganizations) {
    try {

      int runStatus;
      ProjectSync inProcessProjects = integrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING,
          replicationType, serviceOrganizations);

      logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Setting the replication status to Completed or Error");
      if (inProcessProjects == null) {
        ProjectSync errorProjects = integrationStatusRepository.getSingleProjectSync(Constants.RunStatus.ERROR,
            replicationType, serviceOrganizations);
        if (errorProjects == null) {

          runStatus = Constants.RunStatus.COMPLETED;

        } else {
          runStatus = Constants.RunStatus.ERROR;
        }

        updateProjectReplicationStatus(runStatus, replicationType);

        /*
         *
         * Update Project Replication Filter Status too incase of initial load
         *
         */

        if (replicationType == Constants.ReplicationType.INITIAL) {

          updateProjectReplicationTaskStatus(serviceOrganizations, runStatus);

        }

      }

    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Error occured while setting replicaiton status.");
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Error occured while setting replicaiton status.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while setting replicaiton status", e);
    }
  }

  public void updateProjectReplicationStatus(int runStatus, int replicationType) {
    try {
      ProjectReplicationStatus projectReplicationStatus = integrationStatusRepository
          .readProjectReplicationStatus(replicationType);
      if (projectReplicationStatus != null) {
        projectReplicationStatus.setStatusCode(runStatus);
        logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Updating Project Replication Status");
        integrationStatusRepository.updateProjectReplicationStatus(projectReplicationStatus);
      }
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Error occured while updating replicaiton status.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while updating replicaiton status", e);
    }
  }

  public void updateProjectReplicationTaskStatus(List<String> serviceOrganizations, Integer status) {

    try {
      logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Updating Project Replication Task Status");
      String serviceOrganizationCode = serviceOrganizations.get(0);
      Map<String, Object> data = Collections.singletonMap(ProjectReplicationTasks.TASK_STATUS_CODE, status);
      Map<String, Object> keys = Collections.singletonMap(ProjectReplicationTasks.SERVICE_ORGANIZATION_CODE,
          serviceOrganizationCode);

      projectReplicationTasksRepository.updateProjectReplicationTaskStatus(data, keys);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed while updating project replication task status.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while Updating Project Replication Task Status",
          e);
    }
  }

  public void setProjectSyncStatusToError(String projectID, int replicationType) {
    logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Setting the Project Sync status to Error");
    ProjectSync projectSyncRecord = integrationStatusRepository.getProjectSyncByProject(projectID, replicationType);
    projectSyncRecord.setStatusCode(Constants.RunStatus.ERROR);
    integrationStatusRepository.updateProjectSyncStatus(projectSyncRecord);
  }

  public void setReplicationStatustoClosed(int replicationType) {
    try {
      logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Setting the replication status to Closed");
      updateProjectReplicationStatus(Constants.RunStatus.CLOSED, replicationType);
    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Error occured while setting replication status to Closed.");
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Error occured while setting replication status to Closed.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while setting replication status to Closed",
          e);
    }
  }

  public ProjectReplicationStatus getProjectReplicationStatus(int replicationType) {

    try {

      /**
       * This method return project replication object based on the replication type
       */

      if (replicationType == Constants.ReplicationType.INITIAL) {
        return integrationStatusRepository.readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      } else {
        return integrationStatusRepository.readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      }
    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, Constants.LoggerMessages.DETERMINE_REPLICATION_STATUS);
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, Constants.LoggerMessages.DETERMINE_REPLICATION_STATUS);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, Constants.LoggerMessages.DETERMINE_REPLICATION_STATUS, e);
    }
  }

  public Set<ProjectSync> transformProjectToProjectSync(List<Project> projects, int replicationType) {
    try {
      return projects.stream().map(project -> {

        ProjectSync single = ProjectSync.create();
        single.setProject(project.getProjectID());
        single.setStatusCode(Constants.RunStatus.PROCESSING);
        single.setTypeTypeCode(replicationType);
        single.setServiceOrganizationCode(project.getOrgID());

        return single;
      }).collect(Collectors.toSet());

    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed to transform project to project sync {}.", projects);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in transformProjectToProjectSync{}", projects, e);
    }

  }

  /**
   * Method to get the Projects for Retry Initial Load Replication.
   */
  @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = { Exception.class, ServiceException.class })
  public void replicateProjectsForRetryInitialLoad(ProjectReplicationStatus projectReplicationStatus,
      int replicationType, List<String> serviceOrganizations) {

    logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
        "Getting projects that are in error state for retry initial load");
    ZonedDateTime lastReplicationRunTime = projectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

    logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Retry projects that are in error state for initial load");
    Set<ProjectSync> projectsInError = integrationStatusRepository.getErrorProjectsInprocess(replicationType,
        serviceOrganizations);

    setReplicationRunStatusToProcessing(replicationType, lastReplicationRunTime, projectsInError);

  }

  /**
   * Method to get the Projects for Initial Load Replication.
   */
  @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = { Exception.class, ServiceException.class })
  public void replicateProjectsForInitialLoad(ProjectReplicationTask projectReplicationTask) {

    int replicationType = Constants.ReplicationType.INITIAL;
    logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, "Getting projects for initial load");

    List<Project> projects = getAllProjectsForReplicationTask(projectReplicationTask);
    /**
     * If the projects are not empty then transform the projects to project sync and
     * accordingly update its Run status to processing.
     */
    if (!projects.isEmpty()) {
      Set<ProjectSync> projectsToSync = transformProjectToProjectSync(projects, replicationType);
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Total Count of Projects to load : {}", projectsToSync.size());

      setReplicationRunStatusToProcessing(replicationType, getMaxChangedOn(projects), projectsToSync);
    }
  }

  /**
   * Method to get the Projects for Delta Load Replication.
   */
  @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = { Exception.class, ServiceException.class })
  public void replicateProjectsForDeltaLoad(ProjectReplicationStatus projectReplicationStatus, int replicationType,
      ZonedDateTime lastReplicationRunTime, List<ProjectReplicationTasks> projectReplicationTasks) {

    logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, "Getting projects for delta load");
    /**
     * Fetch all service organization codes from Project Replication Tasks Items
     */
    List<String> serviceOrganizationCodes = new ArrayList<>();
    for (ProjectReplicationTasks item : projectReplicationTasks) {
      serviceOrganizationCodes.add(item.getServiceOrganizationCode());
    }

    Set<ProjectSync> projectsInError = new HashSet<>();

    if (projectReplicationStatus != null && projectReplicationStatus.getStatusCode() == Constants.RunStatus.ERROR) {
      logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, "Getting projects that are in error state for delta load");
      projectsInError = integrationStatusRepository.getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
    }

    logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, "Getting other delta projects");
    List<Project> allProjects = getAllProjects(lastReplicationRunTime);
    List<Project> filteredProjects = getFilteredProjects(projectReplicationTasks, allProjects);
    logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Total number of projects after filtering are:{}",
        filteredProjects.size());

    /**
     * If the projects after filtering are not empty then transform the projects to
     * project sync and accordingly update its Run status to processing else
     * directly set the Run Status to Processing of the projects that are in error
     * state.
     */
    if (!filteredProjects.isEmpty()) {
      Set<ProjectSync> projectsToSync = transformProjectToProjectSync(filteredProjects, replicationType);
      logger.info(REP_CREATE_PROJECTREPLICATION_MARKER, "Adding Error projects to load (if any)");

      if (projectsInError != null)
        projectsToSync.addAll(projectsInError);

      setReplicationRunStatusToProcessing(replicationType, getMaxChangedOn(filteredProjects), projectsToSync);
      logger.debug(REP_CREATE_PROJECTREPLICATION_MARKER, "Total Count of Projects to load : {}", projectsToSync.size());
    } else {
      setReplicationRunStatusToProcessing(replicationType, lastReplicationRunTime, projectsInError);
    }

  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = ServiceException.class)
  public void replicateProjectTree(int replicationType, ProjectSync projectToProcess, Boolean isAutoPublish) {

    logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Processing project {}", projectToProcess.getProject());

    Project projectTreeFromS4 = s4Client.getProjectTree(projectToProcess.getProject());

    if (replicationType == ReplicationType.INITIAL) {
      // If the replication is the initial load, we need to insert projects in RM
      insertProjectInRm(transformS4ProjectToRM.transformProjectHierarchy(projectTreeFromS4, isAutoPublish));
    } else if (replicationType == ReplicationType.DELTA) {
      // If the replication is the delta load, we need to update project in RM with
      // the latest changes in S4
      Projects projectTreeFromRM = getProjectTreeFromRM(projectToProcess.getProject());

      // If the project is newly created in S4, insert the project in RM
      if (projectTreeFromRM == null) {
        insertProjectInRm(transformS4ProjectToRM.transformProjectHierarchy(projectTreeFromS4, isAutoPublish));
      } else {
        // Else we need to update the project with changed fields
        determineChange.compareAndChange(projectTreeFromS4, projectTreeFromRM, isAutoPublish);
      }
    }

    // Once we are done with the processing of a project, we update the project
    // status to COMPLETED.
    projectToProcess.setStatusCode(Constants.RunStatus.COMPLETED);
    integrationStatusRepository.updateProjectSyncStatus(projectToProcess);

  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = { ServiceException.class, Exception.class })
  public void supplyDemand(SupplySyncDetails currDemand) {

    if (currDemand.getResourceDemand() == null || currDemand.getWorkPackage() == null
        || currDemand.getResourceDemand().isEmpty() || currDemand.getWorkPackage().isEmpty()) {
      logger.warn(SUPPLY_REPLICATION_MARKER,
          "ExternalID or Workpackage information missing for demand {}. Replication would be skipped for this demand. SupplySync table contains inconsistent entries.",
          currDemand.getDemand());
      return;
    }

    logger.info(SUPPLY_REPLICATION_MARKER, "Querying Supply Line Items For Demand {}, workpackage {}",
        currDemand.getResourceDemand(), currDemand.getWorkPackage());

    List<EngmntProjRsceSup> resourceSuppliesFromS4 = s4Client
        .getResourceSuppliesForDemand(currDemand.getResourceDemand(), currDemand.getWorkPackage());

    if (resourceSuppliesFromS4 != null && !resourceSuppliesFromS4.isEmpty()) {
      assignmentService.createAssignment(resourceSuppliesFromS4);
    } else {
      logger.debug(SUPPLY_REPLICATION_MARKER, "No supply in S4 found for Demand {}, workpackage {}",
          currDemand.getResourceDemand(), currDemand.getWorkPackage());
    }

    logger.info(SUPPLY_REPLICATION_MARKER, "Deleting demand {} from Supply Sync Table", currDemand.getDemand());
    assignmentService.deleteDemandFromSupplySyncTable(currDemand);
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = { Exception.class, ServiceException.class })
  public void projectsDeletion(int replicationType, List<ProjectReplicationTasks> projectReplicationTasks,
      Set<ProjectSync> projectsSync) {

    logger.info(REP_DELETE_PROJECTREPLICATION_MARKER, "Deletion of Projects: Getting all S4 projects");

    List<Project> allProjects = getAllProjects(null);

    /**
     * Fetch all service organization codes from service Organization Replication
     * Items
     */
    List<String> serviceOrganizationCodes = new ArrayList<>();
    for (ProjectReplicationTasks item : projectReplicationTasks) {
      serviceOrganizationCodes.add(item.getServiceOrganizationCode());
    }

    /**
     * Filter projects on the basis of service organizations whose initial load is
     * completed
     */

    List<Project> filteredProjects = getFilteredProjects(projectReplicationTasks, allProjects);

    setReplicationRunStatusToProcessing(replicationType, null, projectsSync);
    determineChange.deleteProjects(filteredProjects, serviceOrganizationCodes);
    logger.info(REP_DELETE_PROJECTREPLICATION_MARKER, "Project deletion completed");
  }

  public List<ProjectReplicationTasks> getProjectReplicationTaskBasedonTaskStatusCode(Integer status) {
    try {
      return projectReplicationTasksRepository.getProjectReplicationTaskBasedonTaskStatusCode(status);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Failed in getting Service Organizations by initial load status.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Failed in getting Service Organizations by initial load status", e);
    }

  }

  public void createDeltaAndDeleteJob() {

    try {

      ProjectReplicationStatus projectReplicationDeltaStatus = integrationStatusRepository
          .readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      /**
       * Determine if delta job needs to be created by fetching the delta replication
       * status. If no delta record exists and current initial load is successfull,
       * create delta job.
       */
      if (projectReplicationDeltaStatus == null) {

        ProjectReplicationStatus projectReplicationInitialStatus = integrationStatusRepository
            .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);

        if (projectReplicationInitialStatus.getStatusCode() == Constants.RunStatus.COMPLETED) {
          String subdomain = xsuaaUserInfo.getSubDomain();
          String tenantId = xsuaaUserInfo.getTenant();
          jobSchedulerService.createDeltaAndDeleteJob(subdomain, tenantId);
        }
      }

    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed while creating delta and delete job.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in creating delta and delete job", e);
    }
  }

}
