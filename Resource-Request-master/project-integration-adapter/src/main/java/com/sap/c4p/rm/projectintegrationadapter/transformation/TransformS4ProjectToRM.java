package com.sap.c4p.rm.projectintegrationadapter.transformation;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.stereotype.Component;

import com.sap.cds.CdsData;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmndDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkItem;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.repository.DeliveryOrganizationRepository;
import com.sap.c4p.rm.projectintegrationadapter.service.MasterDataReplication;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;

import com.sap.resourcemanagement.project.DemandCapacityRequirements;
import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.project.Projects;

import io.vavr.control.Option;

@Component
public class TransformS4ProjectToRM {

  private static final Logger logger = LoggerFactory.getLogger(TransformS4ProjectToRM.class);
  private MasterDataReplication masterDataReplication;
  private TransformDemandToResourceRequest transformDemandToResourceRequest;
  private DeliveryOrganizationRepository deliveryOrganizationRepository;

  private static final Marker REP_CHANGE_DEMAND_MARKER = LoggingMarker.REPLICATION_CHANGE_DEMAND_MARKER.getMarker();
  private static final Marker REP_CHANGE_PROJECT_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECT_MARKER.getMarker();
  private static final Marker REP_CHANGE_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_CHANGE_WORKPACKAGE_MARKER
      .getMarker();
  private static final Marker REP_CREATE_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_CHANGE_RESOURCEREQUEST_MARKER
      .getMarker();

  public TransformS4ProjectToRM(MasterDataReplication masterDataReplication,
      TransformDemandToResourceRequest transformDemandToResourceRequest,
      DeliveryOrganizationRepository deliveryOrganizationRepository) {
    this.masterDataReplication = masterDataReplication;
    this.transformDemandToResourceRequest = transformDemandToResourceRequest;
    this.deliveryOrganizationRepository = deliveryOrganizationRepository;
  }

  public Map<String, List<CdsData>> transformProjectHierarchy(Project s4Project, Boolean isAutoPublish) {

    try {

      logger.debug(REP_CHANGE_PROJECT_MARKER,
          "Entered method transformProjectHierarchy, in TransformS4ProjectToRM class");
      Map<String, List<CdsData>> transformedObjects = new HashMap<>();
      List<CdsData> rmProjects = new ArrayList<>();
      List<WorkPackage> s4workPackages = s4Project.getWorkPackageSetOrFetch();

      List<com.sap.resourcemanagement.project.WorkPackages> rmWorkPackages = new ArrayList<>(s4workPackages.size());
      List<CdsData> rmDemands = new ArrayList<>();

      List<CdsData> resourceRequests = new ArrayList<>();
      String projectCategory = s4Project.getProjectCategory();

      /** Map S4 Project hierarchy fields to RM Project field */
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Started Mapping S4Project to RM Projects :{}", s4Project.getProjectID());

      Projects rmProject = transformProject(s4Project);
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Project Transformed:{} ", s4Project.getProjectID());

      for (WorkPackage s4WorkPackage : s4workPackages) {

        /** Map S4 WorkPackage fieds to RM WorkPackage */
        com.sap.resourcemanagement.project.WorkPackages rmWorkPackage = transformWorkPackage(s4WorkPackage);
        logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "WorkPackage Transformed:{} ", s4WorkPackage.getWorkPackageID());

        List<WorkItem> s4workItems = new ArrayList<>();
        Option<List<WorkItem>> s4workItemsSet;
        s4workItemsSet = s4WorkPackage.getWorkItemSetIfPresent();

        if (s4workItemsSet != null && s4workItemsSet.isDefined()) {
          s4workItems = s4workItemsSet.get();
        }

        for (EngmntProjRsceDmnd s4Demand : s4WorkPackage.getResourceDemandOrFetch()) {
          com.sap.resourcemanagement.project.Demands rmDemand = transformDemandAndDistribution(s4Demand,
              s4WorkPackage.getWPStartDate().toLocalDate(), s4WorkPackage.getWPEndDate().toLocalDate(), projectCategory,
              s4workItems);

          if (rmDemand != null) {

            logger.debug(REP_CHANGE_DEMAND_MARKER, "Demand transformed {}", rmDemand.getExternalID());
            resourceRequests.add(transformDemandToResourceRequest.transformDemandToRequest(rmDemand,
                rmWorkPackage.getProjectId(), rmWorkPackage.getName(), isAutoPublish));
            logger.debug(REP_CREATE_RESOURCEREQUEST_MARKER, "Resource request object generated for demand id {}",
                rmDemand.getExternalID());
            rmDemands.add(rmDemand);

          }
        }

        rmWorkPackages.add(rmWorkPackage);

      }

      rmProject.setWorkPackages(rmWorkPackages);
      rmProjects.add(rmProject);

      transformedObjects.put("Project", rmProjects);
      transformedObjects.put("Demand", rmDemands);
      transformedObjects.put("ResourceRequest", resourceRequests);
      return transformedObjects;

    } catch (ODataException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.MAPPING_S4_PROJECT_TO_RM,
          s4Project.getProjectID());
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Transform failed due to ODataException for project {} ",
          s4Project.getProjectID(), e);
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.MAPPING_S4_PROJECT_TO_RM,
          s4Project.getProjectID());
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.MAPPING_S4_PROJECT_TO_RM,
          s4Project.getProjectID());
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Transform failed for project {} ",
          s4Project.getProjectID(), e);
    }

  }

  public Demands transformDemandAndDistribution(EngmntProjRsceDmnd s4Demand, LocalDate workPackageStartDate,
      LocalDate workPackageEndDate, String projectCategory, List<WorkItem> s4WorkItems) {

    try {

      logger.debug(REP_CHANGE_DEMAND_MARKER,
          "Entered method transformDemandAndDistribution, in TransformS4ProjectToRM class");
      if (!(Constants.S4Constants.DEMAND_CURRENT_PLAN_VERSION_ID.equals(s4Demand.getVersion()))) {
        return null;
      }

      com.sap.resourcemanagement.project.Demands rmDemand = transformDemand(s4Demand, workPackageStartDate,
          workPackageEndDate, projectCategory, s4WorkItems);
      List<com.sap.resourcemanagement.project.DemandCapacityRequirements> rmDemandCapacityRequirements = new ArrayList<>();
      for (EngmntProjRsceDmndDistr demandDist : s4Demand.getResourceDemandDistributionOrFetch()) {
        com.sap.resourcemanagement.project.DemandCapacityRequirements rmDemandCapacityRequirement = transformDemandDistribution(
            demandDist, rmDemand.getId());
        rmDemandCapacityRequirements.add(rmDemandCapacityRequirement);
      }
      rmDemand.setDemandCapacityRequirements(rmDemandCapacityRequirements);

      return rmDemand;

    } catch (ODataException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_DEMAND,
          s4Demand.getResourceDemand());
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Transform failed due to ODataException for demand {} ",
          s4Demand.getResourceDemand(), e);
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_DEMAND,
          s4Demand.getResourceDemand());
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_DEMAND,
          s4Demand.getResourceDemand());
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_DEMAND,
          s4Demand.getResourceDemand(), e);
    }

  }

  public LocalDate getFirstDateOfMonth(String period, String year) {

    try {
      String stringDate = "01/" + period + "/" + year;
      SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
      Date date = formatter.parse(stringDate);
      return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    } catch (ParseException e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Error in converting the S4 fiscal year and period to local date", e);
    }
    return null;

  }

  public LocalDate getLastDateOfMonth(String period, String year) {
    try {
      String stringDate = "01/" + period + "/" + year;
      SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
      Date date = formatter.parse(stringDate);

      Calendar cal = Calendar.getInstance();
      cal.setTime(date);
      cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
      return cal.getTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    } catch (ParseException e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Error in converting the S4 fiscal year and period to local date", e);
    }
    return null;
  }

  public Projects transformProject(Project s4Project) {

    try {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Entered method transformProject, in TransformS4ProjectToRM class");
      Projects rmProject = Projects.create();

      rmProject.setId(s4Project.getProjectID());
      rmProject.setName(s4Project.getProjectName());

      if (Constants.S4Constants.CUSTOMER_PROJECT_TYPE.equals(s4Project.getProjectCategory())) {

        rmProject.setCustomerId(s4Project.getCustomer());
        masterDataReplication.createCustomerIfNotPresent(s4Project.getCustomer());
      }
      rmProject.setStartDate(s4Project.getStartDate().toLocalDate());
      rmProject.setEndDate(s4Project.getEndDate().toLocalDate());
      rmProject.setServiceOrganizationCode(s4Project.getOrgID());

      return rmProject;
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_PROJECT, s4Project);
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_PROJECT, s4Project);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_PROJECT,
          s4Project, e);
    }
  }

  public com.sap.resourcemanagement.project.WorkPackages transformWorkPackage(WorkPackage s4WorkPackage) {

    try {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER,
          "Entered method transformWorkPackage, in TransformS4ProjectToRM class");
      com.sap.resourcemanagement.project.WorkPackages rmWorkPackage = com.sap.resourcemanagement.project.WorkPackages
          .create();

      rmWorkPackage.setId(s4WorkPackage.getWorkPackageID());
      rmWorkPackage.setName(s4WorkPackage.getWorkPackageName());
      rmWorkPackage.setProjectId(s4WorkPackage.getProjectID());
      rmWorkPackage.setStartDate(s4WorkPackage.getWPStartDate().toLocalDate());
      rmWorkPackage.setEndDate(s4WorkPackage.getWPEndDate().toLocalDate());

      return rmWorkPackage;
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_WP, s4WorkPackage);
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_WP, s4WorkPackage);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_WP,
          s4WorkPackage, e);
    }
  }

  public com.sap.resourcemanagement.project.Demands transformDemand(EngmntProjRsceDmnd s4Demand,
      LocalDate workPackageStartDate, LocalDate workPackageEndDate, String projectCategory,
      List<WorkItem> s4WorkItems) {

    try {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Entered method transformDemand, in TransformS4ProjectToRM class");
      com.sap.resourcemanagement.project.Demands rmDemand = Demands.create();
      final String demandId = UUID.randomUUID().toString();

      rmDemand.setId(demandId);
      rmDemand.setExternalID(s4Demand.getResourceDemand());
      rmDemand.setRequestedQuantity(s4Demand.getQuantity());
      rmDemand.setRequestedUoM(s4Demand.getUnitOfMeasure());

      rmDemand.setBillingRoleId(s4Demand.getEngagementProjectResource());

      // Get the billing role, if not present in the system
      masterDataReplication.createBillingIfNotPresent(s4Demand.getEngagementProjectResource());

      if (s4Demand.getBillingControlCategory().isEmpty() && projectCategory.equals(Constants.PROJECT_TYPE_CUSTOMER)) {

        rmDemand.setBillingCategoryId("BIL");

      } else {

        rmDemand.setBillingCategoryId("NBL");

      }

      rmDemand.setWorkPackageId(s4Demand.getWorkPackage());

      /*
       * Check delivery organization exists in RM. If it doesn't exist then we need to
       * set it to blank for that particular project
       */
      if (s4Demand.getDeliveryOrganization() != null && !s4Demand.getDeliveryOrganization().trim().isEmpty()) {

        String deliveryOrgCode = s4Demand.getDeliveryOrganization();
        final long rowCount = deliveryOrganizationRepository.checkIfDeliveryOrganizationExists(deliveryOrgCode);

        if (rowCount == 0) {
          logger.debug(REP_CHANGE_DEMAND_MARKER, "Delivery organization <{}> does not exist in RM", deliveryOrgCode);
          rmDemand.setDeliveryOrganizationCode("");
        } else {
          rmDemand.setDeliveryOrganizationCode(deliveryOrgCode);
        }

      } else {

        rmDemand.setDeliveryOrganizationCode(s4Demand.getDeliveryOrganization());

      }

      rmDemand.setWorkItem(s4Demand.getWorkItem());
      rmDemand.setWorkItemName("");
      for (WorkItem s4WorkItem : s4WorkItems) {
        if (s4WorkItem.getWorkitem().equals(rmDemand.getWorkItem())) {
          rmDemand.setWorkItemName(s4WorkItem.getWorkitemname());
          break;
        }
      }

      rmDemand.setStartDate(workPackageStartDate);
      rmDemand.setEndDate(workPackageEndDate);
      return rmDemand;
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_DEMAND, s4Demand);
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_DEMAND, s4Demand);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_DEMAND,
          s4Demand, e);
    }
  }

  public com.sap.resourcemanagement.project.DemandCapacityRequirements transformDemandDistribution(
      EngmntProjRsceDmndDistr s4DemandDistribution, String demandId) {

    try {
      logger.debug(REP_CHANGE_DEMAND_MARKER,
          "Entered method transformDemandDistribution, in TransformS4ProjectToRM class");
      com.sap.resourcemanagement.project.DemandCapacityRequirements rmDemandCapacityRequirement = DemandCapacityRequirements
          .create();

      rmDemandCapacityRequirement.setId(UUID.randomUUID().toString());
      rmDemandCapacityRequirement.setDemandId(demandId);
      rmDemandCapacityRequirement.setRequestedQuantity(s4DemandDistribution.getQuantity());
      rmDemandCapacityRequirement.setRequestedUoM(s4DemandDistribution.getUnitOfMeasure());
      rmDemandCapacityRequirement.setStartDate(
          getFirstDateOfMonth(s4DemandDistribution.getCalendarMonth(), s4DemandDistribution.getCalendarYear()));
      rmDemandCapacityRequirement.setEndDate(
          getLastDateOfMonth(s4DemandDistribution.getCalendarMonth(), s4DemandDistribution.getCalendarYear()));

      return rmDemandCapacityRequirement;
    }

    catch (ServiceException e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_DEMAND_DISTRIBUTION,
          s4DemandDistribution);
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_DEMAND_DISTRIBUTION,
          s4DemandDistribution);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          Constants.LoggerMessages.TRANSFORM_FAILED_FOR_S4_DEMAND_DISTRIBUTION, s4DemandDistribution, e);
    }

  }
}
