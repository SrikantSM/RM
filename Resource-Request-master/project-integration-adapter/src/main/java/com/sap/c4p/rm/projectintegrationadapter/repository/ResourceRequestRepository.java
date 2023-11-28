package com.sap.c4p.rm.projectintegrationadapter.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.CdsData;
import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements_;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests_;

@Repository
public class ResourceRequestRepository {

  private final PersistenceService persistenceService;

  private static final Logger logger = LoggerFactory.getLogger(ResourceRequestRepository.class);
  private static final Marker REP_DELETE_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_DELETE_RESOURCEREQUEST_MARKER
      .getMarker();
  private static final Marker REP_CHANGE_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_CHANGE_RESOURCEREQUEST_MARKER
      .getMarker();
  private static final Marker REP_FETCH_RESOURCEREQUEST_MARKER = LoggingMarker.REPLICATION_FETCH_RESOURCEREQUEST_MARKER
      .getMarker();

  @Autowired
  public ResourceRequestRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public void upsertResourceRequests(List<CdsData> resourceRequests) {
    try {

      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Entered method upsertResourceRequests in class ResourceRequestRepository");
      CqnUpsert query = Upsert.into(ResourceRequests_.class).entries(resourceRequests);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "ResourceRequests were successfully upserted");
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Failed while performing upsert of ResourceRequests {}",
          resourceRequests);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsertResourceRequests {}", resourceRequests,
          e);
    }
  }

  public void upsertResourceRequest(ResourceRequests resourceRequest) {
    try {

      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Entered method upsertResourceRequest in class ResourceRequestRepository");
      CqnUpsert query = Upsert.into(ResourceRequests_.class).entry(resourceRequest);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "{} ResourceRequest was successfully upserted",
          resourceRequest.getId());

    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER, "Failed while performing upsert of ResourceRequest {}.",
          resourceRequest);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsertResourceRequest {}", resourceRequest, e);
    }
  }

  public void deleteCapacityRequirements(String resourceRequestId, LocalDate startDate, LocalDate endDate) {
    try {

      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Entered method deleteCapacityRequirements in class ResourceRequestRepository");
      CqnDelete query = Delete.from(CapacityRequirements_.class).where(b -> b.resourceRequest_ID().eq(resourceRequestId)
          .and(b.startDate().lt(startDate).or(b.endDate().gt(endDate))));
      persistenceService.run(query);
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "CapacityRequirements for ResourceRequest with ID {} were deleted based on start date {} and end date {}",
          resourceRequestId, startDate, endDate);

    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_RESOURCEREQUEST_MARKER,
          "Failed to delete capacity requirements for resource request with ID {}.", resourceRequestId);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in deleteCapacityRequirements {}",
          resourceRequestId, e);
    }
  }

  public List<CapacityRequirements> getUpdatedCapacityForWeeklyDistribution(
      List<CapacityRequirements> originalCapacityRequirements, LocalDate updatedRRStartDate,
      LocalDate updatedRREndDate) {
    // Initialize Variables
    List<CapacityRequirements> updatedCapacityRequirements = new ArrayList<>();
    WeekFields weekFieldDE = WeekFields.of(Locale.GERMANY);
    LocalDate firstWeekStartDate = updatedRRStartDate.with(weekFieldDE.dayOfWeek(), 1);
    LocalDate lastWeekEndDate = updatedRREndDate.with(weekFieldDE.dayOfWeek(), 7);

    for (CapacityRequirements singleCapacity : originalCapacityRequirements) {
      if (singleCapacity.getStartDate().compareTo(firstWeekStartDate) >= 0
          && singleCapacity.getEndDate().compareTo(lastWeekEndDate) <= 0) {
        LocalDate weekStartDate = singleCapacity.getStartDate().with(weekFieldDE.dayOfWeek(), 1);
        LocalDate weekEndDate = singleCapacity.getStartDate().with(weekFieldDE.dayOfWeek(), 7);

        if (singleCapacity.getStartDate().compareTo(weekStartDate) >= 0) {
          // partial Week
          if (updatedRRStartDate.compareTo(weekStartDate) > 0) {
            // RR Start Date is after Week Start Date
            singleCapacity.setStartDate(updatedRRStartDate);
          } else {
            singleCapacity.setStartDate(weekStartDate);
          }
          singleCapacity.setStartTime(
              singleCapacity.getStartDate().atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
        }
        if (singleCapacity.getEndDate().compareTo(weekEndDate) <= 0) {
          // partial week
          if (updatedRREndDate.compareTo(weekEndDate) < 0) {
            // RR end date is before week end date
            singleCapacity.setEndDate(updatedRREndDate);
          } else {
            singleCapacity.setEndDate(weekEndDate);
          }
          singleCapacity.setEndTime(singleCapacity.getEndDate().plusDays(1).atTime(LocalTime.MIDNIGHT)
              .atZone(ZoneId.systemDefault()).toInstant());
        }
        updatedCapacityRequirements.add(singleCapacity);
      }
    }
    return updatedCapacityRequirements;
  }

  public List<CapacityRequirements> selectCapacityRequirements(String resourceRequestId) {
    try {

      logger.debug(REP_FETCH_RESOURCEREQUEST_MARKER,
          "Entered method selectCapacityRequirements in class ResourceRequestRepository");
      CqnSelect query = Select.from(CapacityRequirements_.class)
          .where(b -> b.resourceRequest_ID().eq(resourceRequestId));
      return persistenceService.run(query).listOf(CapacityRequirements.class);

    } catch (ServiceException e) {
      logger.debug(REP_FETCH_RESOURCEREQUEST_MARKER,
          "Failed in select for capacityR requirements for resource request with ID {}.", resourceRequestId);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in selectCapacityRequirements {}",
          resourceRequestId, e);
    }
  }

  public void deleteResourceRequest(String resourceRequestId) {
    try {

      logger.debug(REP_DELETE_RESOURCEREQUEST_MARKER,
          "Entered method deleteResourceRequest in class ResourceRequestRepository");
      CqnDelete query = Delete.from(ResourceRequests_.class).where(b -> b.ID().eq(resourceRequestId));
      persistenceService.run(query);
      logger.debug(REP_DELETE_RESOURCEREQUEST_MARKER, "ResourceRequest with ID {} deleted", resourceRequestId);

    } catch (ServiceException e) {
      logger.debug(REP_DELETE_RESOURCEREQUEST_MARKER, "Failed to delete resource request with ID {}.",
          resourceRequestId);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in deleteResourceRequest {}", resourceRequestId,
          e);
    }
  }

  public ResourceRequests selectResourceRequestForDemand(String demandId) {
    try {

      logger.debug(REP_FETCH_RESOURCEREQUEST_MARKER,
          "Entered method selectResourceRequestForDemand in class ResourceRequestRepository");
      CqnSelect query = Select.from(ResourceRequests_.class).where(b -> b.demand_ID().eq(demandId))
          .columns(b -> b._all(), b -> b.capacityRequirements().expand(d -> d._all()));

      Result selectedData = persistenceService.run(query);
      logger.debug(REP_FETCH_RESOURCEREQUEST_MARKER, "ResourceRequest For Demand ID {} fetched", demandId);

      if (selectedData.rowCount() >= 1) {
        logger.debug(REP_FETCH_RESOURCEREQUEST_MARKER, "ResourceRequest for a {} demand has been selected", demandId);
        return selectedData.single(ResourceRequests.class);
      }

      return null;

    } catch (Exception e) {
      logger.debug(REP_FETCH_RESOURCEREQUEST_MARKER, "Failed to select resource request for demand ID {}.", demandId);
      // Error Logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in selectResourceRequestForDemand {}", demandId,
          e);
    }

  }

}
