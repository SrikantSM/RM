package com.sap.c4p.rm.projectintegrationadapter.transformation;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.repository.IntegrationStatusRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ResourceOrganizationRespository;
import com.sap.c4p.rm.projectintegrationadapter.repository.WorkPackageRepository;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;
import com.sap.c4p.rm.projectintegrationadapter.util.DisplayIDGenerator;

import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

@Component
public class TransformDemandToResourceRequest {

  private static final Logger logger = LoggerFactory.getLogger(TransformDemandToResourceRequest.class);

  private static final Marker REP_CHANGE_DEMAND_MARKER = LoggingMarker.REPLICATION_CHANGE_DEMAND_MARKER.getMarker();
  private static final Marker REP_CHANGE_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_CHANGE_RESOURCEREQUEST_MARKER
      .getMarker();
  private DisplayIDGenerator displayIDGenerator;
  private WorkPackageRepository workPackageRepository;
  private IntegrationStatusRepository integrationStatusRepository;

  private ResourceOrganizationRespository resourceOrganizationRespository;

  @Autowired
  public TransformDemandToResourceRequest(DisplayIDGenerator displayIDGenerator,
      WorkPackageRepository workPackageRepository, IntegrationStatusRepository integrationStatusRepository,
      ResourceOrganizationRespository resourceOrganizationRespository) {
    this.displayIDGenerator = displayIDGenerator;
    this.workPackageRepository = workPackageRepository;
    this.integrationStatusRepository = integrationStatusRepository;
    this.resourceOrganizationRespository = resourceOrganizationRespository;
  }

  /**
   * During initial load this method will be triggered, at that point since the
   * projects are not persisted in DB they are passed as parameter
   */
  public ResourceRequests transformDemandToRequest(Demands rmDemand, String projectId, String workPackageName,
      Boolean isAutoPublish) {

    return prepareResourceRequest(rmDemand, projectId, workPackageName, isAutoPublish);

  }

  /**
   * During delta load this method will be triggered.
   */
  public ResourceRequests transformDemandToRequest(Demands rmDemand, String projectId, Boolean isAutoPublish) {

    return prepareResourceRequest(rmDemand, projectId, null, isAutoPublish);
  }

  public ResourceRequests prepareResourceRequest(Demands rmDemand, String projectId, String workPackageName,
      Boolean isAutoPublish) {

    try {
      logger.debug(REP_CHANGE_DEMAND_MARKER,
          "Entered method prepareResourceRequest, in TransformDemandToResourceRequest class");
      List<CapacityRequirements> capacityRequirements = new ArrayList<>();
      /**
       * Map RM demand hierarchy fields to RM Resource Request field
       */
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Started Mapping RM Demand to Resource Request :{}", rmDemand.getId());

      ResourceRequests resourceRequest = ResourceRequests.create();

      resourceRequest.setId(UUID.randomUUID().toString());
      resourceRequest.setDisplayId(displayIDGenerator.getDisplayId());
      resourceRequest.setIsS4Cloud(true);
      if (workPackageName == null)
        resourceRequest.setName(workPackageRepository.getWorkPackageNameById(rmDemand.getWorkPackageId()));
      else
        resourceRequest.setName(workPackageName);

      // If the delivery organization is empty set it to NULL and based on the
      // isAutopublish , set the release status
      resourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
      if (rmDemand.getDeliveryOrganizationCode().isEmpty()) {
        resourceRequest.setRequestedResourceOrgId(null);
        resourceRequest.setProcessingResourceOrgId(null);
      } else {
        resourceRequest.setRequestedResourceOrgId(resourceOrganizationRespository
            .getResourceOrganizationForDeliveryOrganization(rmDemand.getDeliveryOrganizationCode()));
        resourceRequest.setProcessingResourceOrgId(resourceOrganizationRespository
            .getResourceOrganizationForDeliveryOrganization(rmDemand.getDeliveryOrganizationCode()));
        if (Boolean.TRUE.equals(isAutoPublish)) {
          if (!(resourceRequest.getRequestedResourceOrgId() == null
              || resourceRequest.getRequestedResourceOrgId().isEmpty())) {
            resourceRequest.setReleaseStatusCode(Constants.REQUEST_PUBLISH);
            integrationStatusRepository.insertDemandInSupplySync(rmDemand.getId());
          } else
            resourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
        }
      }

      resourceRequest.setStartDate(rmDemand.getStartDate());
      resourceRequest.setEndDate(rmDemand.getEndDate());
      resourceRequest.setRequestedCapacity(rmDemand.getRequestedQuantity());
      resourceRequest.setRequestedCapacityInMinutes(
          resourceRequest.getRequestedCapacity().multiply(BigDecimal.valueOf(60)).intValue());
      resourceRequest.setStartTime(
          resourceRequest.getStartDate().atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      resourceRequest.setEndTime(resourceRequest.getEndDate().plusDays(1).atTime(LocalTime.MIDNIGHT)
          .atZone(ZoneId.systemDefault()).toInstant());
      resourceRequest.setRequestedUnit(Constants.UOM);
      resourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
      resourceRequest.setDemandId(rmDemand.getId());
      resourceRequest.setWorkpackageId(rmDemand.getWorkPackageId());
      resourceRequest.setProjectId(projectId);
      resourceRequest.setPriorityCode(Constants.REQUEST_PRIORITY_MEDIUM);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);

      CapacityRequirements capacityRequirement = prepareCapacityFromResourceRequest(resourceRequest);
      capacityRequirements.add(capacityRequirement);
      resourceRequest.setCapacityRequirements(capacityRequirements);
      return resourceRequest;

    } catch (Exception e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Transform demand to resource request failed for demand ID {}.",
          rmDemand.getId());
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Transform demand to resource request failed {} ",
          rmDemand.getId(), e);
    }

  }

  public CapacityRequirements prepareCapacityFromResourceRequest(ResourceRequests resourceRequest) {

    try {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Entered method prepareCapacityFromResourceRequest, in TransformDemandToResourceRequest class");
      CapacityRequirements capacity = CapacityRequirements.create();

      capacity.setId(UUID.randomUUID().toString());
      capacity.setRequestedCapacity(resourceRequest.getRequestedCapacity());
      capacity.setStartDate(resourceRequest.getStartDate());
      capacity.setEndDate(resourceRequest.getEndDate());
      capacity.setStartTime(
          resourceRequest.getStartDate().atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      capacity.setEndTime(resourceRequest.getEndDate().plusDays(1).atTime(LocalTime.MIDNIGHT)
          .atZone(ZoneId.systemDefault()).toInstant());
      capacity.setResourceRequestId(resourceRequest.getId());
      capacity.setRequestedUnit(resourceRequest.getRequestedUnit());
      capacity.setRequestedCapacityInMinutes(resourceRequest.getRequestedCapacityInMinutes());

      return capacity;

    } catch (Exception e) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Creation of capcity requirement failed for request id {}.",
          resourceRequest.getId());
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Create capcity requirement failed for request id {} ",
          resourceRequest.getId(), e);
    }

  }

}
