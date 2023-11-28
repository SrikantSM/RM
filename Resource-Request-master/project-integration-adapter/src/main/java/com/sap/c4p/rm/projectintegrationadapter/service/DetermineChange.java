package com.sap.c4p.rm.projectintegrationadapter.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import com.sap.cds.CdsData;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkItem;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.repository.DemandRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ResourceRequestRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.WorkPackageRepository;
import com.sap.c4p.rm.projectintegrationadapter.transformation.TransformDemandToResourceRequest;
import com.sap.c4p.rm.projectintegrationadapter.transformation.TransformS4ProjectToRM;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;

import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.project.Projects;
import com.sap.resourcemanagement.project.WorkPackages;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import io.vavr.control.Option;

@Component
@RequestScope
public class DetermineChange {

  private static final Logger logger = LoggerFactory.getLogger(DetermineChange.class);
  private static final Marker REP_CHANGE_DEMAND_MARKER = LoggingMarker.REPLICATION_CHANGE_DEMAND_MARKER.getMarker();
  private static final Marker REP_DELETE_DEMAND_MARKER = LoggingMarker.REPLICATION_DELETE_DEMAND_MARKER.getMarker();
  private static final Marker REP_CHANGE_PROJECT_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECT_MARKER.getMarker();
  private static final Marker REP_DELETE_PROJECT_MARKER = LoggingMarker.REPLICATION_DELETE_PROJECT_MARKER.getMarker();
  private static final Marker REP_CREATE_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_CREATE_WORKPACKAGE_MARKER
      .getMarker();
  private static final Marker REP_CHANGE_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_CHANGE_WORKPACKAGE_MARKER
      .getMarker();
  private static final Marker REP_DELETE_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_DELETE_WORKPACKAGE_MARKER
      .getMarker();
  private static final Marker REP_CREATE_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_CHANGE_RESOURCEREQUEST_MARKER
      .getMarker();
  private static final Marker REP_CHANGE_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_CHANGE_RESOURCEREQUEST_MARKER
      .getMarker();
  private static final Marker REP_DELETE_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_DELETE_RESOURCEREQUEST_MARKER
      .getMarker();

  private ResourceRequests adaptResourceRequest;
  private Map<String, WorkPackages> workPackageMap;
  private Map<String, Demands> demandMap;
  private Set<String> projectS4Set;
  private Set<String> workPackageS4Set;
  private Set<String> demandS4Set;
  private Set<String> projectRMSet;
  private Set<String> workPackageRMSet;
  private Set<String> demandRMSet;
  private TransformS4ProjectToRM transformS4ToRM;
  private TransformDemandToResourceRequest transformDemandToResourceRequest;
  private ProjectRepository projectRepository;
  private WorkPackageRepository wpRepository;
  private DemandRepository demandRepository;
  private ResourceRequestRepository resourceRequestRepository;
  private AssignmentService assignmentService;

  public DetermineChange(TransformS4ProjectToRM transformS4ToRM, ProjectRepository projectRepository,
      WorkPackageRepository wpRepository, DemandRepository demandRepository,
      TransformDemandToResourceRequest transformDemandToResourceRequest,
      ResourceRequestRepository resourceRequestRepository, AssignmentService assignmentService) {
    workPackageMap = new HashMap<>();
    demandMap = new HashMap<>();
    projectS4Set = new HashSet<>();
    workPackageS4Set = new HashSet<>();
    demandS4Set = new HashSet<>();
    projectRMSet = new HashSet<>();
    workPackageRMSet = new HashSet<>();
    demandRMSet = new HashSet<>();
    this.transformS4ToRM = transformS4ToRM;
    this.projectRepository = projectRepository;
    this.wpRepository = wpRepository;
    this.demandRepository = demandRepository;
    this.transformDemandToResourceRequest = transformDemandToResourceRequest;
    this.resourceRequestRepository = resourceRequestRepository;
    this.assignmentService = assignmentService;
  }

  public void setAdaptResourceRequest(ResourceRequests adaptResourceRequest) {
    this.adaptResourceRequest = adaptResourceRequest;
  }

  public Map<String, WorkPackages> getWorkPackageMap() {
    return this.workPackageMap;
  }

  public Set<String> getWorkPackageRMSet() {
    return this.workPackageRMSet;
  }

  public void setWorkPackageRMSet(Set<String> workPackageRMSet) {
    this.workPackageRMSet.addAll(workPackageRMSet);
  }

  public void setWorkPackageS4Set(Set<String> workPackageS4Set) {
    this.workPackageS4Set.addAll(workPackageS4Set);
  }

  public void setDemandRMSet(Set<String> demandRMSet) {
    this.demandRMSet.addAll(demandRMSet);
  }

  public void setDemandS4Set(Set<String> demandS4Set) {
    this.demandS4Set.addAll(demandS4Set);
  }

  public synchronized void setProjectS4Set(Set<String> projectS4Set) {
    this.projectS4Set.addAll(projectS4Set);
  }

  public void setDemandMap(Map<String, Demands> demandMap) {
    this.demandMap = demandMap;
  }

  public synchronized Set<String> getProjectS4Set() {
    return this.projectS4Set;
  }

  public synchronized Set<String> getProjectRMSet() {
    return this.projectRMSet;
  }

  public synchronized void setProjectRMSet(Set<String> projectRMSet) {
    this.projectRMSet.addAll(projectRMSet);
  }

  public Map<String, Demands> getDemandMap() {
    return this.demandMap;
  }

  public Set<String> getDemandRMSet() {
    return this.demandRMSet;
  }

  public synchronized void compareAndChange(Project projectFromS4, Projects projectFromRM, Boolean isAutoPublish) {
    try {

      // compare project attributes
      compareAndChangeProject(projectFromS4, projectFromRM);

      // compare workpackages
      traverseWorkPackagesToMapAndSet(projectFromRM.getWorkPackages());
      compareAndChangeWorkPackage(projectFromS4.getWorkPackageSetOrFetch(), projectFromS4.getProjectCategory(),
          isAutoPublish);

    } catch (ODataException oDataException) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Error getting Work Packages from S/4.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Error getting Work Packages from S/4 " + oDataException.getMessage(), oDataException);
    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Error occured while detemining change.");
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Error occured while detemining change.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while detemining change " + e.getMessage(),
          e);
    } finally {
      /**
       * The global variables are cleared just to make sure it does not carry the old
       * values in the next iteration as this method run in loop
       */
      workPackageMap.clear();
      workPackageRMSet.clear();
      workPackageS4Set.clear();
      demandMap.clear();
      demandRMSet.clear();
      demandS4Set.clear();
    }

  }

  public void compareAndChangeProject(Project projectFromS4, Projects projectFromRM) {
    try {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Entered method compareAndChangeProject, in DetermineChange class");
      Projects transformedProject = transformS4ToRM.transformProject(projectFromS4);

      if (!transformedProject.getName().equals(projectFromRM.getName())
          || ((transformedProject.getCustomerId() != null && !transformedProject.getCustomerId().isEmpty())
              && !transformedProject.getCustomerId().equals(projectFromRM.getCustomerId()))
          || !transformedProject.getStartDate().isEqual(projectFromRM.getStartDate())
          || !transformedProject.getEndDate().isEqual(projectFromRM.getEndDate())
          || !transformedProject.getServiceOrganizationCode().equals(projectFromRM.getServiceOrganizationCode())) {
        logger.info(REP_CHANGE_PROJECT_MARKER, "Project attributes changed");
        projectRepository.updateProject(transformedProject);
      }
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Error occured while comparing project attributes.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while comparing project attributes", e);
    }
  }

  public void traverseWorkPackagesToMapAndSet(List<WorkPackages> workPackages) {
    try {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER,
          "Entered method traverseWorkPackagesToMapAndSet, in DetermineChange class");
      for (WorkPackages workPackage : workPackages) {
        workPackageMap.put(workPackage.getId(), workPackage);
        workPackageRMSet.add(workPackage.getId());
      }
    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "Error occured while traversing work package to Map.");
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "Error occured while traversing work package to Map.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while traversing work package to Map", e);
    }
  }

  public void compareAndChangeWorkPackage(
      List<com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage> s4WorkPackages,
      String projectCategory, Boolean isAutoPublish) {

    try {

      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER,
          "Entered method compareAndChangeWorkPackage, in DetermineChange class");
      for (com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage s4WorkPackage : s4WorkPackages) {
        workPackageS4Set.add(s4WorkPackage.getWorkPackageID());
        WorkPackages rmWorkPackage = workPackageMap.get(s4WorkPackage.getWorkPackageID());
        if (rmWorkPackage == null) {

          logger.info(REP_CREATE_WORKPACKAGE_MARKER, "Creating WP {}", s4WorkPackage.getWorkPackageID());
          createWorkPackageTree(s4WorkPackage, projectCategory, isAutoPublish);

        } else {
          WorkPackages tranformedWp = transformS4ToRM.transformWorkPackage(s4WorkPackage);
          if (isWorkPackageAttributesChanged(tranformedWp, rmWorkPackage)) {
            logger.info(REP_CHANGE_WORKPACKAGE_MARKER, "WP {} attributes has changed",
                s4WorkPackage.getWorkPackageID());
            this.wpRepository.updateWorkPackage(tranformedWp);
          }

          List<WorkItem> s4workItems = new ArrayList<>();
          Option<List<WorkItem>> s4workItemsSet;
          s4workItemsSet = s4WorkPackage.getWorkItemSetIfPresent();

          if (s4workItemsSet != null && s4workItemsSet.isDefined()) {
            s4workItems = s4workItemsSet.get();
          }

          compareAndChangeDemand(s4WorkPackage.getWorkPackageID(), s4WorkPackage.getWPStartDate().toLocalDate(),
              s4WorkPackage.getWPEndDate().toLocalDate(), s4WorkPackage.getProjectID(),
              s4WorkPackage.getResourceDemandOrFetch(), projectCategory, isAutoPublish, s4workItems);
        }
      }

      // Find and delete Work Packages that are deleted from S/4
      deleteWorkPackages();

    } catch (ServiceException serviceException) {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, "Error occured while determining changes in work package.");
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, "Error occured while determining changes in work package.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while determining changes in work package",
          e);
    }
  }

  public void createWorkPackageTree(
      com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage workPackage,
      String projectCategory, Boolean isAutoPublish) {
    try {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, "Entered method createWorkPackageTree, in DetermineChange class");
      this.wpRepository.createWorkPackage(transformS4ToRM.transformWorkPackage(workPackage));
      List<CdsData> demands = new ArrayList<>();
      List<CdsData> resourceRequests = new ArrayList<>();
      Demands rmDemand;

      List<WorkItem> s4workItems = new ArrayList<>();
      Option<List<WorkItem>> s4workItemsSet;
      s4workItemsSet = workPackage.getWorkItemSetIfPresent();

      if (s4workItemsSet != null && s4workItemsSet.isDefined()) {
        s4workItems = s4workItemsSet.get();
      }

      /** Create corresponding demands requests */
      for (EngmntProjRsceDmnd resourceDemand : workPackage.getResourceDemandOrFetch()) {

        if (Constants.S4Constants.DEMAND_CURRENT_PLAN_VERSION_ID.equals(resourceDemand.getVersion())) {
        demands.add(this.transformS4ToRM.transformDemandAndDistribution(resourceDemand,
            workPackage.getWPStartDate().toLocalDate(), workPackage.getWPEndDate().toLocalDate(), projectCategory, s4workItems));
        }
      }
    

      /** Create corresponding resource requests */
      for (CdsData demand : demands) {

        rmDemand = Demands.create();
        rmDemand.putAll(demand);
        resourceRequests.add(this.transformDemandToResourceRequest.transformDemandToRequest(rmDemand,
            workPackage.getProjectID(), isAutoPublish));
      }



      this.demandRepository.upsertDemands(demands);
      this.resourceRequestRepository.upsertResourceRequests(resourceRequests);
    } catch (ODataException oDataException) {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, Constants.LoggerMessages.CREATE_WP_FAIL);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Error getting Demands from S/4 " + oDataException.getMessage(), oDataException);
    } catch (ServiceException serviceException) {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, Constants.LoggerMessages.CREATE_WP_FAIL);
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, Constants.LoggerMessages.CREATE_WP_FAIL);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while creating new workpackage", e);
    }
  }

  public void deleteWorkPackages() {
    ResourceRequests resourceRequest;
    try {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "Entered method deleteWorkPackages, in DetermineChange class");
      workPackageRMSet.removeAll(workPackageS4Set);
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "RM WorkPackages to be deleted : {} for the project",
          workPackageRMSet);
      for (String workPackage : workPackageRMSet) {

        /** Delete corresonding resource requests */
        List<Demands> demands = this.demandRepository.selectDemandForWorkPackage(workPackage);
        for (Demands demand : demands) {
          resourceRequest = this.resourceRequestRepository.selectResourceRequestForDemand(demand.getId());
          if (resourceRequest != null) {
            logger.info(REP_DELETE_WORKPACKAGE_MARKER, "Deleting Resource Request {}", resourceRequest.getId());
            deleteResourceRequestsAndCorrrespondingAssignments(resourceRequest.getId());
          }
        }
        demands.clear();
        logger.info(REP_DELETE_WORKPACKAGE_MARKER, "Deleting WP {}", workPackage);
        this.wpRepository.deleteWorkPackage(workPackage);
      }
    } catch (ServiceException serviceException) {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "Error occured while deleting work package.");
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "Error occured while deleting work package.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while deleting work package", e);
    }
  }

  public boolean isWorkPackageAttributesChanged(WorkPackages workPackages4, WorkPackages workPackageRM) {
    try {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER,
          "Entered method isWorkPackageAttributesChanged, in DetermineChange class");
      boolean isWorkPackageUpdated = false;
      if (!workPackages4.getName().equals(workPackageRM.getName())) {
        logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "WP {} name updated", workPackageRM.getId());
        isWorkPackageUpdated = true;
      }

      if (!workPackages4.getStartDate().isEqual(workPackageRM.getStartDate())) {
        logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "WP {} startdate updated", workPackageRM.getId());
        isWorkPackageUpdated = true;
      }

      if (!workPackages4.getEndDate().isEqual(workPackageRM.getEndDate())) {
        logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "WP {} enddate updated", workPackageRM.getId());
        isWorkPackageUpdated = true;
      }

      return isWorkPackageUpdated;

    } catch (Exception e) {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "Error occured while comparing work package attributes.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while comparing work package attributes",
          e);
    }
  }

  public void traverseDemandsToMapAndSet(List<Demands> demands) {
    try {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Entered method traverseDemandsToMapAndSet, in DetermineChange class");
      for (Demands demand : demands) {
        demandMap.put(demand.getExternalID(), demand);
        demandRMSet.add(demand.getExternalID());
      }
    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Error occured while traversing demands to map.");
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Error occured while traversing demands to map.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while traversing demands to map", e);
    }
  }

  public boolean isDemandAttributesChanged(Demands demandS4, Demands demandRM) {

    try {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Entered method isDemandAttributesChanged, in DetermineChange class");
      boolean isDemandUpdated = false;

      if (!demandRM.getBillingRoleId().equals(demandS4.getBillingRoleId())) {
        logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand {} {} Billing Role updated", demandRM.getExternalID(),
            demandRM.getWorkPackageId());
        isDemandUpdated = true;
      }

      if (!demandRM.getEndDate().equals(demandS4.getEndDate())) {
        logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand {} {} enddate updated", demandRM.getExternalID(),
            demandRM.getWorkPackageId());
        isDemandUpdated = true;
      }

      if (!demandRM.getStartDate().equals(demandS4.getStartDate())) {
        logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand {} {} start date updated", demandRM.getExternalID(),
            demandRM.getWorkPackageId());
        isDemandUpdated = true;
      }

      if (demandS4.getRequestedQuantity() != null && demandRM.getRequestedQuantity() != null
          && demandS4.getRequestedQuantity().compareTo(demandRM.getRequestedQuantity()) != 0) {
        logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand {} {} requested quantity updated", demandRM.getExternalID(),
            demandRM.getWorkPackageId());
        isDemandUpdated = true;
      }

      if (compareStringsAreDifferent(demandS4.getWorkItem(), demandRM.getWorkItem())) {
        logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand {} {} Work Item updated", demandRM.getExternalID(),
            demandRM.getWorkPackageId());
        isDemandUpdated = true;
      }

      if (compareStringsAreDifferent(demandS4.getWorkItemName(), demandRM.getWorkItemName())) {
        logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand {} {} Work Item Name updated", demandRM.getExternalID(),
            demandRM.getWorkPackageId());
        isDemandUpdated = true;
      }

      return isDemandUpdated;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Error occured while comparing demands attributes.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while comparing demands attributes", e);
    }
  }

  public static boolean compareStringsAreDifferent(String str1, String str2) {
    // In case of new fields (like Work Item) RM Demand can have null values and we
    // want
    // to avoid Demand Updates for all old demands just because Null != Empty value
    // from API
    if (str1 == null && str2 == null) {
      return false;
    } else if (str1 == null) {
      return !str2.isEmpty();
    } else if (str2 == null) {
      return !str1.isEmpty();
    } else {
      return !str1.equals(str2);
    }
  }

  public synchronized void compareAndChangeDemand(String workPackageID, LocalDate workPackageStartDate,
      LocalDate workPackageEndDate, String projectId, List<EngmntProjRsceDmnd> resourceDemands, String projectCategory,
      Boolean isAutoPublish, List<WorkItem> s4workItems) {

    try {

      logger.debug(REP_CHANGE_DEMAND_MARKER, "Entered method compareAndChangeDemand, in DetermineChange class");
      List<Demands> demandsFromRM = demandRepository.selectDemandForWorkPackage(workPackageID);
      traverseDemandsToMapAndSet(demandsFromRM);

      for (EngmntProjRsceDmnd resourceDemand : resourceDemands) {

        Demands transformedDemand;
        ResourceRequests resourceRequest = null;

        if (Constants.S4Constants.DEMAND_CURRENT_PLAN_VERSION_ID.equals(resourceDemand.getVersion())) {
          demandS4Set.add(resourceDemand.getResourceDemand());
          Demands rmDemand = demandMap.get(resourceDemand.getResourceDemand());
          if (rmDemand == null) {

            logger.info(REP_CHANGE_DEMAND_MARKER, "Creating Demand and ResourceRequest {} for work package {}",
                resourceDemand.getResourceDemand(), workPackageID);

            /** Create demands */
            transformedDemand = transformS4ToRM.transformDemandAndDistribution(resourceDemand, workPackageStartDate,
                workPackageEndDate, projectCategory, s4workItems);
            demandRepository.upsertDemands(transformedDemand);

            /** Create resource request */
            resourceRequest = transformDemandToResourceRequest.transformDemandToRequest(transformedDemand, projectId,
                isAutoPublish);
            resourceRequestRepository.upsertResourceRequest(resourceRequest);

          } else {
            if (isDemandAttributesChanged(transformS4ToRM.transformDemandAndDistribution(resourceDemand,
                workPackageStartDate, workPackageEndDate, projectCategory, s4workItems), rmDemand)) {

              logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand {} of Work package {} attributes has changed",
                  resourceDemand.getResourceDemand(), workPackageID);
              Demands updatedDemand = transformS4ToRM.transformDemandAndDistribution(resourceDemand,
                  workPackageStartDate, workPackageEndDate, projectCategory, s4workItems);
              logger.debug(REP_CHANGE_DEMAND_MARKER, "RM Demand {} ", rmDemand.getId());
              updatedDemand.setId(rmDemand.getId());
              logger.debug(REP_CHANGE_DEMAND_MARKER, "Updated Demand {} ", updatedDemand);

              resourceRequest = adaptDisruptiveChanges(updatedDemand, projectId, isAutoPublish);
              logger.info(REP_CHANGE_DEMAND_MARKER, "Updated Resource Request {} ", resourceRequest);

              demandRepository.upsertDemands(updatedDemand);
            }
            /**
             * In the scenario where the supply for demand is deleted in S4, the method
             * isDemandAttributesChanged cannot recognize this change and this the
             * assignment in RM does not get deleted. The logic to check if there is an
             * actual change between S4 supply and RM assignment is already a part of the
             * method compareAndUpdateAssignmentsAsPerSupply in assignmentService. So we
             * invoke this call in all scenarios
             */
            logger.info(REP_CHANGE_DEMAND_MARKER,
                "Comparing and Updating(if needed) Assignments for Demand {}, WorkPackage {} and resourceRequest {} ",
                resourceDemand.getResourceDemand(), resourceDemand.getWorkPackage(), resourceRequest);
            assignmentService.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, resourceRequest);
          }
        }
      }

      // Find and delete Demands that are deleted from S/4
      deleteDemands(workPackageID);

    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Error occured while comparing demands.", serviceException);
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Error occured while comparing demands.", e);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while comparing demands", e);
    }
    /**
     * The global variables are cleared just to make sure it does not carry the old
     * values in the next iteration as this method run in loop
     */
    finally {
      demandMap.clear();
      demandRMSet.clear();
      demandS4Set.clear();
    }
  }

  public void deleteDemands(String workPackageID) {
    try {
      logger.debug(REP_DELETE_DEMAND_MARKER, "Entered method deleteDemands, in DetermineChange class");
      ResourceRequests resourceRequest;
      demandRMSet.removeAll(demandS4Set);
      for (String demand : demandRMSet) {
        logger.info(REP_DELETE_DEMAND_MARKER, "Deleting Demand and Resource Request {} of Work Package {}", demand,
            workPackageID);
        Demands demandToDelete = demandMap.get(demand);
        this.demandRepository.deleteDemand(demandToDelete);

        resourceRequest = this.resourceRequestRepository.selectResourceRequestForDemand(demandToDelete.getId());
        if (resourceRequest != null) {
          deleteResourceRequestsAndCorrrespondingAssignments(resourceRequest.getId());
        }
      }
    } catch (ServiceException serviceException) {
      logger.debug(REP_DELETE_DEMAND_MARKER, "Error occured while deleting demands and resource request.");
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_DELETE_DEMAND_MARKER, "Error occured while deleting demands and resource request.");
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Error occured while deleting demands and resource request", e);
    }
  }

  public void deleteWorkPackagesOfProject(String projectID) {
    try {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER,
          "Entered method deleteWorkPackagesOfProject, in DetermineChange class");
      List<WorkPackages> workPackagesFromRM = wpRepository.selectWorkPackageForProject(projectID);
      // Delete workpackages and demands
      if (!workPackagesFromRM.isEmpty())
        for (WorkPackages workPackage : workPackagesFromRM) {
          logger.info(REP_DELETE_WORKPACKAGE_MARKER, "Deleting WP {}", workPackage);
          // method which deletes demands, resource requests and corresponding assignments
          deleteDemandsOfWorkPackage(workPackage.getId());
          wpRepository.deleteWorkPackage(workPackage.getId());
        }
    } catch (ServiceException serviceException) {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "Error occured while deleting workpackges of project with ID {}.",
          projectID);
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "Error occured while deleting workpackges of project with ID {}.",
          projectID);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while deleting workpackges", e);
    }
  }

  public void deleteDemandsOfWorkPackage(String workPackageID) {
    try {
      logger.debug(REP_DELETE_DEMAND_MARKER, "Entered method deleteDemandsOfWorkPackage, in DetermineChange class");
      ResourceRequests resourceRequest;
      List<Demands> demandsFromRM = demandRepository.selectDemandForWorkPackage(workPackageID);
      if (!demandsFromRM.isEmpty()) {
        for (Demands demandToDelete : demandsFromRM) {
          logger.debug(REP_DELETE_DEMAND_MARKER, "Deleting Demand and Resource Request {} of Work Package {}",
              demandToDelete, workPackageID);
          resourceRequest = resourceRequestRepository.selectResourceRequestForDemand(demandToDelete.getId());
          if (resourceRequest != null) {
            logger.info(REP_DELETE_RESOURCEREQUEST_MARKER, "Deleting Resource Request {}", resourceRequest.getId());
            deleteResourceRequestsAndCorrrespondingAssignments(resourceRequest.getId());
          }
          demandRepository.deleteDemand(demandToDelete);
        }
      }
    } catch (ServiceException serviceException) {
      logger.debug(REP_DELETE_RESOURCEREQUEST_MARKER,
          "Error occured while deleting resource request for workPackage ID {}.", workPackageID);
      // Error Logged in calling function
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_DELETE_RESOURCEREQUEST_MARKER,
          "Error occured while deleting resource request for workPackage ID {}.", workPackageID);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Error occured while deleting demands and resource request", e);
    }
  }

  public ResourceRequests adaptDisruptiveChanges(Demands demand, String projectId, Boolean isAutoPublish) {

    try {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Entered method adaptDisruptiveChanges, in DetermineChange class");
      adaptResourceRequest = resourceRequestRepository.selectResourceRequestForDemand(demand.getId());
      LocalDate demandStartDate = demand.getStartDate();
      LocalDate demandEndDate = demand.getEndDate();

      /**
       * 1. If no resource request exists for the demand then create new resource
       * request and return
       */
      if (adaptResourceRequest == null) {

        logger.debug(REP_CREATE_RESOURCEREQUEST_MARKER, "RR is created");
        adaptResourceRequest = transformDemandToResourceRequest.transformDemandToRequest(demand, projectId,
            isAutoPublish);

      } else {
        adjustResourceRequestDates(adaptResourceRequest, demandStartDate, demandEndDate);
      }
      resourceRequestRepository.upsertResourceRequest(adaptResourceRequest);
      return adaptResourceRequest;

    } catch (Exception e) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Error occured while adjusting the disuruptive changes of demands {}", demand);
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Error occured while adjusting the disuruptive changes of demands", e);
    }
  }

  public void adjustResourceRequestDates(ResourceRequests adaptResourceRequest, LocalDate demandStartDate,
      LocalDate demandEndDate) {

    try {

      LocalDate resReqStartDate = adaptResourceRequest.getStartDate();
      LocalDate resReqEndDate = adaptResourceRequest.getEndDate();
      Boolean isDateChanged = false;

      // ** 2. Adjust resource request dates and delete assignments*/
      if (((resReqStartDate.isBefore(demandStartDate)) && (resReqEndDate.isBefore((demandStartDate)))
          || (resReqStartDate.isAfter((demandEndDate)) && (resReqEndDate.isAfter(demandEndDate)))))

      {
        logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
            "RR {} startdate, enddate are updated and the corresponding assignments are deleted",
            adaptResourceRequest.getId());
        assignmentService.deleteAssignmentsForResourceRequests(adaptResourceRequest.getId());
        adaptResourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);
        resReqStartDate = demandStartDate;
        resReqEndDate = demandEndDate;
        isDateChanged = Boolean.TRUE;
      } else {

        /**
         * 3. If resource request start date is before new demand start date and end
         * date is after new demand end date then update resource request start date to
         * new start date and end date to new end date
         */
        if ((resReqStartDate.isBefore(demandStartDate)) && (adaptResourceRequest.getEndDate().isAfter(demandEndDate))) {
          logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "RR {} startdate and enddate updated",
              adaptResourceRequest.getId());
          resReqStartDate = demandStartDate;
          resReqEndDate = demandEndDate;
          isDateChanged = Boolean.TRUE;
        }
        /**
         * 4. If resource request start date is before new demand start date then update
         * resource request start date to new start date
         */
        else if (resReqStartDate.isBefore(demandStartDate)) {
          logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "RR {} startdate updated", adaptResourceRequest.getId());
          resReqStartDate = demandStartDate;
          isDateChanged = Boolean.TRUE;
        }

        /**
         * 5. If resource request end date is after new demand end date then update
         * resource request end date to new end date
         */
        if (adaptResourceRequest.getEndDate().isAfter(demandEndDate)) {
          logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "RR {} enddate updated", adaptResourceRequest.getId());
          resReqEndDate = demandEndDate;
          isDateChanged = Boolean.TRUE;
        }
      }
      if (isDateChanged.equals(Boolean.TRUE)) {
        changeResourceRequestDates(resReqStartDate, resReqEndDate);
      }

    } catch (Exception e) {

      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Error occured while adjusting resource request dates{}",
          adaptResourceRequest);
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while adjusting the resource request dates",
          e);

    }

  }

  public void deleteProjects(
      List<com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project> s4Projects,
      List<String> serviceOrganizationsWithInitialLoadDone) {
    try {
      logger.debug(REP_DELETE_PROJECT_MARKER, "Entered method deleteProjects, in DetermineChange class");
      List<String> rmProjects = projectRepository
          .getProjectsByServiceOrganization(serviceOrganizationsWithInitialLoadDone);
      String customerID;
      logger.debug(REP_DELETE_PROJECT_MARKER, "Projects in RM {}", rmProjects.size());
      if (s4Projects.size() < rmProjects.size()) {

        for (com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project s4Project : s4Projects) {
          projectS4Set.add(s4Project.getProjectID());
        }
        projectRMSet.addAll(rmProjects);
        // Find and delete Projects and corrsponding workpackages and demands that are
        // deleted from S/4
        projectRMSet.removeAll(projectS4Set);
        logger.debug(REP_DELETE_PROJECT_MARKER, "Projects to be deleted in RM {}", projectRMSet);
        for (String project : projectRMSet) {
          customerID = projectRepository.getCustomer(project);
          logger.info(REP_DELETE_PROJECT_MARKER, "Deleting project {}", project);
          // delete workpackages
          deleteWorkPackagesOfProject(project);
          // Delete Project
          projectRepository.deleteProject(project);
          // Delete customer data if there no projects for that customer in RM
          if (customerID != null && (projectRepository.getCustomerProject(customerID) == 0)) {
            projectRepository.deleteCustomer(customerID);

          }
          // Delete project from project sync table
          projectRepository.deleteProjectSync(project);
        }
      }

    } catch (ServiceException serviceException) {
      logger.debug(REP_DELETE_PROJECT_MARKER, "Error occured while deleting projects.");
      // Error logged in calling function.
      throw serviceException;
    } catch (Exception e) {
      logger.debug(REP_DELETE_PROJECT_MARKER, "Error occured while deleting projects.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while deleting projects", e);
    }
  }

  public void deleteResourceRequestsAndCorrrespondingAssignments(String resourceRequestId) {
    assignmentService.deleteAssignmentsForResourceRequests(resourceRequestId);
    resourceRequestRepository.deleteResourceRequest(resourceRequestId);
  }

  /**
   * This method sets the capacity requirements for resource request when effort
   * distribution type is Total Hours
   */
  public void setCapacityRequirementsForTotalEffort(LocalDate startDate, LocalDate endDate, Instant startTime,
      Instant endTime) {
    List<CapacityRequirements> capacityRequirements = adaptResourceRequest.getCapacityRequirements();
    capacityRequirements.get(0).setStartDate(startDate);
    capacityRequirements.get(0).setStartTime(startTime);
    capacityRequirements.get(0).setEndDate(endDate);
    capacityRequirements.get(0).setEndTime(endTime);
    capacityRequirements.get(0).setRequestedCapacity(adaptResourceRequest.getRequestedCapacity());
    capacityRequirements.get(0).setRequestedCapacityInMinutes(adaptResourceRequest.getRequestedCapacityInMinutes());

    adaptResourceRequest.setCapacityRequirements(capacityRequirements);
    resourceRequestRepository.upsertResourceRequest(adaptResourceRequest);

    if (capacityRequirements.size() > Constants.CAPACITYREQUIREMENTS_SIZE) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Capacity Requirements size {}", capacityRequirements.size());
      resourceRequestRepository.deleteCapacityRequirements(adaptResourceRequest.getId(), startDate, endDate);
      List<CapacityRequirements> updatedCapacityRequirements = resourceRequestRepository
          .selectCapacityRequirements(adaptResourceRequest.getId());
      adaptResourceRequest.setCapacityRequirements(updatedCapacityRequirements);
    }
  }

  /**
   * This method changes the dates of the resource request and their respective
   * capacity requirements
   */
  public void changeResourceRequestDates(LocalDate startDate, LocalDate endDate) {

    try {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Entered method changeResourceRequestDates, in DetermineChange class");
      Instant startTime = startDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      Instant endTime = endDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      adaptResourceRequest.setStartDate(startDate);
      adaptResourceRequest.setStartTime(startTime);
      adaptResourceRequest.setEndDate(endDate);
      adaptResourceRequest.setEndTime(endTime);

      List<CapacityRequirements> updatedCapacityRequirements = new ArrayList<>();

      /*
       * Check for the effort distribution type and calculate updated capacity
       * requirements
       */

      switch (adaptResourceRequest.getEffortDistributionTypeCode()) {

      case Constants.TOTAL_HOURS:

        logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Effort Distribution type is total hours");
        setCapacityRequirementsForTotalEffort(startDate, endDate, startTime, endTime);
        break;
      case Constants.DAILY_HOURS:

        logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Effort Distribution type is daily hours");
        resourceRequestRepository.deleteCapacityRequirements(adaptResourceRequest.getId(), startDate, endDate);
        updatedCapacityRequirements = resourceRequestRepository
            .selectCapacityRequirements(adaptResourceRequest.getId());
        break;

      case Constants.WEEKLY_HOURS:

        logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Effort Distribution type is weekly hours");
        updatedCapacityRequirements = resourceRequestRepository.getUpdatedCapacityForWeeklyDistribution(
            adaptResourceRequest.getCapacityRequirements(), startDate, endDate);
        break;

      default:
        throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Not a valid status code");
      }

      /*
       * Even if the distribution type is daily or weekly and due to date change if
       * capacity requirements is empty or no capacity requirements exists in that
       * date range we change distribution type to total and create default
       * distribution to avoid incosistent behaviour of not having capacity
       * requirements
       */

      if (updatedCapacityRequirements.isEmpty()
          && adaptResourceRequest.getEffortDistributionTypeCode() != Constants.TOTAL_HOURS) {
        logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "setting to total hours as there is no capacity requirements");
        adaptResourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);
        setCapacityRequirementsForTotalEffort(startDate, endDate, startTime, endTime);
      }

      /*
       * Once the capacity requirements is updated; we need to update the total
       * capacity in resource request too for weekly and daily distribution for total
       * it is always equal so we can ignore
       */

      if (adaptResourceRequest.getEffortDistributionTypeCode() != Constants.TOTAL_HOURS) {

        setRequestedCapacityInResourceRequest(updatedCapacityRequirements);
        adaptResourceRequest.setCapacityRequirements(updatedCapacityRequirements);
        resourceRequestRepository.upsertResourceRequest(adaptResourceRequest);

      }

    } catch (ServiceException serviceException) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Error occured while changing resource request dates.");
      // Error logged in calling function.
      throw serviceException;

    } catch (Exception e) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Error occured while changing resource request dates.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while changing resource request dates", e);
    }
  }

  /**
   * This method calculates the total capacity of capacity requirements
   */
  public void setRequestedCapacityInResourceRequest(List<CapacityRequirements> capacityRequirements) {

    try {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Entered method setRequestedCapacityInResourceRequest, in DetermineChange class");
      BigDecimal totalRequestedCapacity;
      totalRequestedCapacity = capacityRequirements.stream().map(p -> p.getRequestedCapacity()).reduce(BigDecimal.ZERO,
          (b1, b2) -> b1.add(b2));
      logger.info(REP_CHANGE_RESOURCEREQUEST_MARKER, "total requested capacity {}", totalRequestedCapacity);
      adaptResourceRequest.setRequestedCapacity(totalRequestedCapacity);
      adaptResourceRequest
          .setRequestedCapacityInMinutes(totalRequestedCapacity.multiply(BigDecimal.valueOf(60)).intValue());
    } catch (Exception e) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Error occured while calculating capacity requirements.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while calculating capacity requirements",
          e);
    }
  }

}
