package com.sap.c4p.rm.projectintegrationadapter.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.datamodel.odata.helper.Order;
import com.sap.cloud.sdk.s4hana.connectivity.ErpHttpDestination;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.activitytype.CostCenterActivityTypeText;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.businesspartner.Customer;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmndDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkItem;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultActivityTypeService;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultBusinessPartnerService;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultCommercialProjectService;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.model.ProjectReplicationTask;

@Component
public class ProjectManagementS4Client {

  private static final Logger logger = LoggerFactory.getLogger(ProjectManagementS4Client.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_PROJECT_MANAGEMENT_S4_CLIENT_MARKER.getMarker();
  private static final String PLANVERSIONID = "1";
  private DefaultCommercialProjectService service;
  private DefaultBusinessPartnerService bpService;
  private DefaultActivityTypeService activityTypeService;
  private DestinationAccess destinationAccess;

  @Autowired
  CdsRuntime cdsRuntime;

  @Autowired
  public ProjectManagementS4Client(DestinationAccess destinationAccess) {

    this.service = new DefaultCommercialProjectService();
    this.bpService = new DefaultBusinessPartnerService();
    this.activityTypeService = new DefaultActivityTypeService();
    this.destinationAccess = destinationAccess;
  }

  public ProjectManagementS4Client() {

  }

  public synchronized DefaultCommercialProjectService getService() {
    return this.service;
  }

  public synchronized DefaultBusinessPartnerService getBpService() {
    return this.bpService;
  }

  public synchronized DefaultActivityTypeService getActivityTypeService() {
    return this.activityTypeService;
  }

  /*
   * Function used to fetch all projects.
   */
  public List<Project> getProjectIds(int pageSize, ZonedDateTime startTime) {
    try {
      logger.debug(MARKER, "Entered getProjectIds of ProjectManagementS4Client.");
      List<Project> allProjects;
      ErpHttpDestination destination = getDestination();
      if (startTime == null) {
        allProjects = this.getService().getAllProject().orderBy(Project.CHANGED_ON, Order.ASC).top(pageSize)
            .select(Project.PROJECT_ID, Project.CHANGED_ON, Project.ORG_ID, Project.END_DATE)
            .executeRequest(destination);

      } else {
        allProjects = this.getService().getAllProject().orderBy(Project.CHANGED_ON, Order.ASC).top(pageSize)
            .filter(Project.CHANGED_ON.gt(startTime))
            .select(Project.PROJECT_ID, Project.CHANGED_ON, Project.ORG_ID, Project.END_DATE)
            .executeRequest(destination);
      }

      return allProjects;
    } catch (ODataException oDataException) {
      logger.debug(MARKER, "Failed while fetching project ID's.");
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "ODataException occured while getting Project list",
          oDataException);
    } catch (Exception e) {
      logger.debug(MARKER, "Failed while fetching project ID's.");
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Failed to get Project list", e);
    }
  }

  /*
   * Function used to fetch projects for single service organization.
   */

  public List<Project> getProjectIdsForReplicationTask(int pageSize, ProjectReplicationTask projectReplicationTask) {

    try {
      logger.debug(MARKER, "Entered getProjectIdsForReplicationTask of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();
      LocalDateTime referenceDateTime = LocalDate.parse(projectReplicationTask.getReferenceDate()).atTime(0, 00, 0);
      return this.getService().getAllProject().orderBy(Project.CHANGED_ON, Order.ASC).top(pageSize)
          .filter(Project.END_DATE.ge(referenceDateTime)
              .and((Project.ORG_ID).eq(projectReplicationTask.getServiceOrganizationCode())))
          .select(Project.PROJECT_ID, Project.CHANGED_ON, Project.ORG_ID).executeRequest(destination);
    } catch (ODataException oDataException) {
      logger.debug(MARKER, "Failed to get Project list.");
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "ODataException occured while getting Project list",
          oDataException);
    } catch (Exception e) {
      logger.debug(MARKER, "Failed to get Project list.");
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Failed to get Project list", e);
    }

  }

  public Project getProjectTree(String projectId) {
    try {
      logger.debug(MARKER, "Entered getProjectTree of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();

      List<Project> projects = this
          .getService().getAllProject().filter(
              Project.PROJECT_ID.eq(projectId))
          .select(Project.PROJECT_ID, Project.PROJECT_NAME, Project.CUSTOMER, Project.START_DATE, Project.END_DATE,
              Project.ORG_ID, Project.PROJECT_CATEGORY,
              Project.TO_WORK_PACKAGE_SET.select(WorkPackage.WORK_PACKAGE_ID, WorkPackage.WORK_PACKAGE_NAME,
                  WorkPackage.WP_START_DATE, WorkPackage.WP_END_DATE, WorkPackage.PROJECT_ID, WorkPackage.CHANGED_ON,
                  WorkPackage.TO_WORK_ITEM_SET.select(WorkItem.WORKITEM, WorkItem.WORKITEMNAME),
                  WorkPackage.TO_RESOURCE_DEMAND.select(EngmntProjRsceDmnd.RESOURCE_DEMAND,
                      EngmntProjRsceDmnd.WORK_PACKAGE, EngmntProjRsceDmnd.WORK_ITEM,
                      EngmntProjRsceDmnd.DELIVERY_ORGANIZATION, EngmntProjRsceDmnd.ENGAGEMENT_PROJECT,
                      EngmntProjRsceDmnd.VERSION, EngmntProjRsceDmnd.BILLING_CONTROL_CATEGORY,
                      EngmntProjRsceDmnd.QUANTITY, EngmntProjRsceDmnd.UNIT_OF_MEASURE,
                      EngmntProjRsceDmnd.ENGAGEMENT_PROJECT_RESOURCE,
                      EngmntProjRsceDmnd.TO_RESOURCE_DEMAND_DISTRIBUTION.select(EngmntProjRsceDmndDistr.QUANTITY,
                          EngmntProjRsceDmndDistr.UNIT_OF_MEASURE, EngmntProjRsceDmndDistr.CALENDAR_MONTH,
                          EngmntProjRsceDmndDistr.CALENDAR_YEAR),
                      EngmntProjRsceDmnd.TO_RESOURCE_SUPPLY.select(EngmntProjRsceSup.RESOURCE_DEMAND,
                          EngmntProjRsceSup.RESOURCE_SUPPLY, EngmntProjRsceSup.WORK_PACKAGE,
                          EngmntProjRsceSup.PERSON_WORK_AGREEMENT, EngmntProjRsceSup.WORKFORCE_PERSON_USER_ID,
                          EngmntProjRsceSup.QUANTITY, EngmntProjRsceSup.VERSION,
                          EngmntProjRsceSup.TO_RESOURCE_SUPPLY_DISTRIBUTION
                              .select(EngmntProjRsceSupDistr.ALL_FIELDS)))))
          .executeRequest(destination);

      if (projects.isEmpty()) {
        logger.debug(MARKER, "The project : {} does not exist in the S/4 system", projectId);
        throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "The project does not exist in the S/4 system");
        // Error logged in the calling function.
      } else {
        return projects.get(0);
      }
    } catch (ODataException oDataException) {
      logger.debug(MARKER, "Failed to get Project tree.");
      // Error logged in the calling function.
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "ODataException occured while getting Project tree",
          oDataException);
    } catch (Exception e) {
      logger.debug(MARKER, "Failed to get Project tree.");
      // Error logged in the calling function.
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Failed to get Project tree", e);
    }
  }

  public Customer getCustomerDetails(String customerId) {
    try {
      logger.debug(MARKER, "Entered getCustomerDetails of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();

      List<Customer> customer = this.getBpService().getAllCustomer().filter(Customer.CUSTOMER.eq(customerId))
          .select(Customer.CUSTOMER, Customer.CUSTOMER_FULL_NAME).executeRequest(destination);

      if (customer.isEmpty()) {
        return null;
      } else {
        return customer.get(0);
      }

    } catch (ODataException oDataException) {
      logger.debug(MARKER, "Failed to get customer details for customer with ID {}.", customerId);
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "ODataException occured while getting customer details",
          oDataException);
    } catch (Exception e) {
      logger.debug(MARKER, "Failed to get customer details for customer with ID {}.", customerId);
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Failed to get customer details", e);
    }
  }

  public CostCenterActivityTypeText getCostCenterActivityTypeText(String activityTypeId) {
    try {
      logger.debug(MARKER, "Entered getCostCenterActivityTypeText of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();

      List<CostCenterActivityTypeText> activityType = this.getActivityTypeService().getAllCostCenterActivityTypeText()
          .filter(CostCenterActivityTypeText.CONTROLLING_AREA.eq("A000")
              .and(CostCenterActivityTypeText.COST_CTR_ACTIVITY_TYPE.eq(activityTypeId)
                  .and(CostCenterActivityTypeText.LANGUAGE.eq("E"))))
          .select(CostCenterActivityTypeText.COST_CTR_ACTIVITY_TYPE_NAME,
              CostCenterActivityTypeText.COST_CTR_ACTIVITY_TYPE, CostCenterActivityTypeText.LANGUAGE)
          .executeRequest(destination);

      if (activityType.isEmpty()) {
        return null;
      } else {
        return activityType.get(0);
      }
    } catch (ODataException oDataException) {
      logger.debug(MARKER, "Failed to get activity type details.");
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY,
          "ODataException occured while getting activity type details", oDataException);
    } catch (Exception e) {
      logger.debug(MARKER, "Failed to get activity type details.");
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Failed to get activity type details", e);
    }
  }

  public ErpHttpDestination getDestination() {

    try {
      logger.debug(MARKER, "Entered getDestination of ProjectManagementS4Client.");
      return destinationAccess.getDestination();
    } catch (ServiceException serviceException) {
      logger.debug(MARKER, "Failed to fetch destination.");
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Failed to fetch destination", serviceException);
    }

  }

  public List<EngmntProjRsceSup> getResourceSuppliesForDemand(String resourceDemand, String workPackage) {
    try {
      logger.debug(MARKER, "Entered getResourceSuppliesForDemand of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();

      return this.getService().getAllEngmntProjRsceSup()
          .filter(EngmntProjRsceSup.WORK_PACKAGE.eq(workPackage).and(
              EngmntProjRsceSup.RESOURCE_DEMAND.eq(resourceDemand).and(EngmntProjRsceSup.VERSION.eq(PLANVERSIONID))))
          .select(EngmntProjRsceSup.ALL_FIELDS,
              EngmntProjRsceSup.TO_RESOURCE_SUPPLY_DISTRIBUTION.select(EngmntProjRsceSupDistr.ALL_FIELDS))
          .executeRequest(destination);

    } catch (ODataException oDataException) {
      logger.debug(MARKER, "Failed to get resource supplies for demand.");
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY,
          "ODataException occured while getting resource supplies for demand", oDataException);
    }
  }

  // Method to check whether the user maintained in destination is authorised to
  // fetch Activity Types
  public Boolean isAuthorisedForActivityType() {
    try {
      logger.debug(MARKER, "Entered isAuthorisedForActivityType of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();

      this.getActivityTypeService().getAllCostCenterActivityTypeText()
          .filter(
              CostCenterActivityTypeText.CONTROLLING_AREA.eq("A000").and(CostCenterActivityTypeText.LANGUAGE.eq("E")))
          .select(CostCenterActivityTypeText.COST_CTR_ACTIVITY_TYPE).top(1).executeRequest(destination);

      return Boolean.TRUE;
    } catch (ODataException oDataException) {
      logger.error(MARKER, "Not authorised to fetch Activity types {}. Exception: {}",
          oDataException.getLocalizedMessage(), oDataException.toString());
      return Boolean.FALSE;
    }
  }

  // Method to check whether the user maintained in destination is authorised to
  // fetch Commercial Projects

  public Boolean isAuthorisedForCommercialProject() {
    try {
      logger.debug(MARKER, "Entered isAuthorisedForCommercialProject of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();
      this.getService().getAllProject().select(Project.PROJECT_ID).top(1).executeRequest(destination);
      return Boolean.TRUE;
    } catch (ODataException oDataException) {
      logger.error(MARKER, "Not authorised to fetch Commercial Projects {}. Exception: {}",
          oDataException.getLocalizedMessage(), oDataException.toString());
      return Boolean.FALSE;
    }
  }

  // Method to check whether the user maintained in destination is authorised to
  // fetch Customer data

  public Boolean isAuthorisedForCustomerMaster() {
    try {
      logger.debug(MARKER, "Entered isAuthorisedForCustomerMaster of ProjectManagementS4Client.");
      ErpHttpDestination destination = getDestination();
      this.getBpService().getAllCustomer().select(Customer.CUSTOMER).top(1).executeRequest(destination);
      return Boolean.TRUE;
    } catch (ODataException oDataException) {
      logger.error(MARKER, "Not authorised to fetch Customer Master {}. Exception: {}",
          oDataException.getLocalizedMessage(), oDataException.toString());
      return Boolean.FALSE;
    }
  }

}
