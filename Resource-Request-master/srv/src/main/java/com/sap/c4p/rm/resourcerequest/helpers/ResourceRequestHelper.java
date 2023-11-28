package com.sap.c4p.rm.resourcerequest.helpers;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.*;
import resourcerequestservice.ReferenceObjects;
import resourcerequestservice.ReferenceObjects_;

@Component
public class ResourceRequestHelper {

  private DraftService draftService;
  private PersistenceService persistenceService;
  private Messages messages;

  private static final Integer REFERENCE_OBJECT_CODE = 0;

  @Autowired
  public ResourceRequestHelper(DraftService draftService, PersistenceService persistenceService, Messages messages) {

    this.draftService = draftService;
    this.persistenceService = persistenceService;
    this.messages = messages;

  }

  public void calculateAndResetCapacityInResourceRequest(List<ResourceRequestCapacities> capacityRequirements,
      ResourceRequests resourceRequest) {

    BigDecimal totalRequestedCapacity = capacityRequirements.stream().map(p -> p.getRequestedCapacity())
        .reduce(BigDecimal.ZERO, (b1, b2) -> b1.add(b2));
    resourceRequest.setRequestedCapacity(totalRequestedCapacity);
    resourceRequest.setRequestedCapacityInMinutes(totalRequestedCapacity.multiply(BigDecimal.valueOf(60)).intValue());

  }

  public List<ResourceRequestCapacities> getUpdatedCapacityForWeeklyDistribution(
      List<ResourceRequestCapacities> originalCapacityRequirements, LocalDate updatedRRStartDate,
      LocalDate updatedRREndDate, Instant updatedRRStartTime, Instant updatedRREndTime) {
    // Initialize Variables
    List<ResourceRequestCapacities> updatedCapacityRequirements = new ArrayList<>();
    WeekFields weekFieldDE = WeekFields.of(Locale.GERMANY);
    LocalDate firstWeekStartDate = updatedRRStartDate.with(weekFieldDE.dayOfWeek(), 1);
    LocalDate lastWeekEndDate = updatedRREndDate.with(weekFieldDE.dayOfWeek(), 7);

    for (ResourceRequestCapacities singleCapacity : originalCapacityRequirements) {
      if (singleCapacity.getStartDate().compareTo(firstWeekStartDate) >= 0
          && singleCapacity.getEndDate().compareTo(lastWeekEndDate) <= 0) {
        LocalDate weekStartDate = singleCapacity.getStartDate().with(weekFieldDE.dayOfWeek(), 1);
        LocalDate weekEndDate = singleCapacity.getStartDate().with(weekFieldDE.dayOfWeek(), 7);

        if (singleCapacity.getStartDate().compareTo(weekStartDate) >= 0) {
          // partial Week
          if (updatedRRStartDate.compareTo(weekStartDate) > 0) {
            // RR Start Date is after Week Start Date
            singleCapacity.setStartDate(updatedRRStartDate);
            singleCapacity.setStartTime(updatedRRStartTime);
          } else {
            singleCapacity.setStartDate(weekStartDate);
            singleCapacity
                .setStartTime(weekStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
          }
        }
        if (singleCapacity.getEndDate().compareTo(weekEndDate) <= 0) {
          // partial week
          if (updatedRREndDate.compareTo(weekEndDate) < 0) {
            // RR end date is before week end date
            singleCapacity.setEndDate(updatedRREndDate);
            singleCapacity.setEndTime(updatedRREndTime);
          } else {
            singleCapacity.setEndDate(weekEndDate);
            singleCapacity.setEndTime(
                weekEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
          }
        }
        updatedCapacityRequirements.add(singleCapacity);
      }
    }
    return updatedCapacityRequirements;
  }

  public void updateEffortDistributionOnTypeChange(ResourceRequests resourceRequest) {
    ResourceRequests draftResourceRequest = selectDraftResourceRequest(resourceRequest.getId());
    int originalEffortDistributionType = draftResourceRequest.getEffortDistributionTypeCode();
    int updatedEffortDistributionType = resourceRequest.getEffortDistributionTypeCode();
    /*
     * Total to Daily/Weekly -> No record in capacity Requirement Weekly to Daily ->
     * No record in capacity Requirement Weekly/Daily to Total -> Delete All
     * existing and have only one record in capacity requirement. Daily to Weekly ->
     * Aggregate records in capacity Requirement.
     */
    if (originalEffortDistributionType == Constants.DAILY_HOURS
        && updatedEffortDistributionType == Constants.WEEKLY_HOURS) {
      // aggregate daily to weekly
      aggregateEffortDistributionOnTypeChangeFromDailyToWeekly(resourceRequest);
    } else if (updatedEffortDistributionType == Constants.TOTAL_HOURS) {
      /*
       * In case we have moved from Weekly/Daily to Total the one record required in
       * capacity requirement is created at save
       */
      deleteCapacityRecords(resourceRequest);
    } else {
      deleteCapacityRecords(resourceRequest);
      resourceRequest.setRequestedCapacity(BigDecimal.ZERO);
      resourceRequest.setRequestedCapacityInMinutes(0);
    }
  }

  public void deleteCapacityRecords(ResourceRequests resourceRequest) {
    /*
     * Delete existing Capacity Requirements for the Resource Request
     */
    List<ResourceRequestCapacities> capacityRequirements = new ArrayList<>();
    resourceRequest.setCapacityRequirements(capacityRequirements);

  }

  public void aggregateEffortDistributionOnTypeChangeFromDailyToWeekly(ResourceRequests resourceRequest) {
    // Get All existing Day Wise distribution Data
    List<ResourceRequestCapacities> dayWiseDistributedCapacity = selectDraftResourceRequestCapacities(
        resourceRequest.getId());
    // Get Start and End Date of Resource Request
    CqnSelect select = Select.from(ResourceRequests_.class)
        .columns(draftResourceRequest -> draftResourceRequest.startDate(),
            draftResourceRequest -> draftResourceRequest.endDate())
        .where(draftResourceRequest -> draftResourceRequest.ID().eq(resourceRequest.getId())
            .and(draftResourceRequest.IsActiveEntity().eq(false)));
    ResourceRequests draftResourceRequest = draftService.run(select).single(ResourceRequests.class);
    LocalDate resourceRequestStartDate = draftResourceRequest.getStartDate();
    LocalDate resourceRequestEndDate = draftResourceRequest.getEndDate();
    /*
     * WeekFields instance to get Week data Since we Start Week Day from Sunday we
     * use US as Local
     */
    WeekFields weekFieldDE = WeekFields.of(Locale.GERMANY);

    Map<String, ResourceRequestCapacities> weekWiseMap = new HashMap<>();
    for (ResourceRequestCapacities dayCapacity : dayWiseDistributedCapacity) {
      String yearWeek = String.valueOf(dayCapacity.getStartDate().getYear())
          + String.valueOf(dayCapacity.getStartDate().get(weekFieldDE.weekOfWeekBasedYear()));
      if (weekWiseMap.containsKey(yearWeek)) {
        ResourceRequestCapacities capacity = weekWiseMap.get(yearWeek);
        capacity.setRequestedCapacity(capacity.getRequestedCapacity().add(dayCapacity.getRequestedCapacity()));
        capacity.setRequestedCapacityInMinutes(
            capacity.getRequestedCapacityInMinutes() + dayCapacity.getRequestedCapacityInMinutes());
      } else {
        LocalDate weekStartDate = dayCapacity.getStartDate().with(weekFieldDE.dayOfWeek(), 1);
        LocalDate weekEndDate = dayCapacity.getStartDate().with(weekFieldDE.dayOfWeek(), 7);
        if (weekStartDate.compareTo(resourceRequestStartDate) < 0) {
          weekStartDate = resourceRequestStartDate;
        }
        if (weekEndDate.compareTo(resourceRequestEndDate) > 0) {
          weekEndDate = resourceRequestEndDate;
        }
        dayCapacity.setStartDate(weekStartDate);
        dayCapacity.setStartTime(weekStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
        dayCapacity.setEndDate(weekEndDate);
        dayCapacity
            .setEndTime(weekEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
        weekWiseMap.put(yearWeek, dayCapacity);
      }
    }
    List<ResourceRequestCapacities> weekWiseCapacityRequirements = new ArrayList<>();
    weekWiseMap.forEach((key, weekCapacity) -> weekWiseCapacityRequirements.add(weekCapacity));
    resourceRequest.setCapacityRequirements(weekWiseCapacityRequirements);
  }

  public void modifyCapacitiesForTotalEffortDistributionType(ResourceRequests resourceRequest) {
    /*
     * In case of effort distribution type is TOTAL_HOURS for the resource request,
     * update the capacity requirements if exists, or create capacity requirement if
     * does not exists
     */

    ResourceRequestCapacities capacity = prepareCapacityFromResourceRequest(resourceRequest);

    if (!resourceRequest.getCapacityRequirements().isEmpty()) {
      CqnUpdate update = Update.entity(ResourceRequestCapacities_.class).data(capacity)
          .where(c -> c.resourceRequest_ID().eq(resourceRequest.getId()));
      persistenceService.run(update);

    } else {
      CqnInsert insert = Insert.into(ResourceRequestCapacities_.class).entry(capacity);
      persistenceService.run(insert);
    }
  }

  /*
   * Prepare capacity for a resource request
   *
   */
  public ResourceRequestCapacities prepareCapacityFromResourceRequest(ResourceRequests resourceRequest) {

    ResourceRequestCapacities capacity = Struct.create(ResourceRequestCapacities.class);

    if (!resourceRequest.isEmpty()) {

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

    }

    return capacity;

  }

  public ResourceRequests selectDraftResourceRequest(String resourceRequestId) {
    CqnSelect select = Select.from(ResourceRequests_.class).where(
        resourceRequest -> resourceRequest.ID().eq(resourceRequestId).and(resourceRequest.IsActiveEntity().eq(false)));
    final Result result = draftService.run(select);
    return result.single(ResourceRequests.class);
  }

  /**
   * Method to fetch the persisted resource request for the given resource request
   * id
   */
  public ResourceRequests selectResourceRequest(String resourceRequestId) {
    CqnSelect select = Select.from(ResourceRequests_.class)
        .where(resourceRequest -> resourceRequest.ID().eq(resourceRequestId));
    final Result result = persistenceService.run(select);
    return result.single(ResourceRequests.class);
  }

  public List<ResourceRequestCapacities> selectDraftResourceRequestCapacities(String resourceRequestId) {
    CqnSelect select = Select.from(ResourceRequestCapacities_.class)
        .where(resourceRequestCapacity -> resourceRequestCapacity.resourceRequest_ID().eq(resourceRequestId)
            .and(resourceRequestCapacity.IsActiveEntity().eq(false)));
    final Result result = draftService.run(select);
    return result.listOf(ResourceRequestCapacities.class);
  }

  public Instant getStartTimeFromStartDate(LocalDate startDate) {
    return startDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
  }

  public Instant getEndTimeFromEndDate(LocalDate endDate) {
    return endDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
  }

  public Integer getRequestedCapacityInMinutesFromRequestedCapacity(BigDecimal requestedCapacity) {
    return requestedCapacity.multiply(BigDecimal.valueOf(60)).intValue();
  }

  public ResourceRequests getStructureWithDefaultValues() {
    ResourceRequests resourceRequests = Struct.create(ResourceRequests.class);
    resourceRequests.setPriorityCode(Constants.REQUEST_PRIORITY_MEDIUM);
    deleteCapacityRecords(resourceRequests);
    fillResourceRequestDefaultValues(resourceRequests);
    return resourceRequests;
  }

  public void fillValuesPassedByUser(ResourceRequests resourceRequests,
      resourcerequestservice.ResourceRequests userPassedValues) {

    resourceRequests.setId(userPassedValues.getId());
    resourceRequests.setDisplayId(userPassedValues.getDisplayId());
    /*
     * User passed mandatory feilds. These are filled to the structure as they are
     * needed to fill the derived values.
     */
    resourceRequests.setStartDate(userPassedValues.getStartDate());
    resourceRequests.setEndDate(userPassedValues.getEndDate());
    resourceRequests.setRequestedCapacity(userPassedValues.getRequiredEffort());
  }

  public void fillResourceRequestDefaultValues(ResourceRequests resourceRequest) {

    /*
     * As it is read only field CAP clears when sent from draft to active hence
     * validation fails. Need to adapt accordingly when UOM is implemented via
     * framework.
     */

    resourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
    resourceRequest.setRequestedUnit(Constants.UOM);
    resourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);


  }

    public void fillResourceRequestDefaultValuesWhenUpdate(ResourceRequests resourceRequest) {

        /*
         * Not Setting Release Status Code to Withdraw incase of Update, as Editing of published Resource Request is now allowed.
         */

        resourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
        resourceRequest.setRequestedUnit(Constants.UOM);

    }

  public void fillResourceRequestDerivedValues(ResourceRequests resourceRequests) {
    resourceRequests.setStartTime(getStartTimeFromStartDate(resourceRequests.getStartDate()));
    resourceRequests.setEndTime(getEndTimeFromEndDate(resourceRequests.getEndDate()));
    resourceRequests.setRequestedCapacityInMinutes(
        getRequestedCapacityInMinutesFromRequestedCapacity(resourceRequests.getRequestedCapacity()));
    resourceRequests.setProcessingResourceOrgId(resourceRequests.getRequestedResourceOrgId());
  }

  public void fillResourceRequestDerivedValueOnUpdate(resourcerequestservice.ResourceRequests resourceRequest) {
    ResourceRequests persistedResourceRequest = selectResourceRequest(resourceRequest.getId());
    if (resourceRequest.containsKey(resourcerequestservice.ResourceRequests.START_DATE)) {
        persistedResourceRequest.setStartTime(getStartTimeFromStartDate(resourceRequest.getStartDate()));
    }
    if (resourceRequest.containsKey(resourcerequestservice.ResourceRequests.END_DATE)) {
        persistedResourceRequest.setEndTime(getEndTimeFromEndDate(resourceRequest.getEndDate()));
    }
    if (resourceRequest.containsKey(resourcerequestservice.ResourceRequests.REQUIRED_EFFORT)) {
        persistedResourceRequest.setRequestedCapacityInMinutes(
            getRequestedCapacityInMinutesFromRequestedCapacity(resourceRequest.getRequiredEffort()));
    }
    updateDbData(persistedResourceRequest);
    }

  public void updateDbData(ResourceRequests resourceRequest) {
    CqnUpdate update = Update.entity(ResourceRequests_.class).data(resourceRequest)
        .where(c -> c.ID().eq(resourceRequest.getId()));
    persistenceService.run(update);
  }

  public String getRequestedResourceOrgForResourceRequestID(final String ID) {
    CqnSelect select = Select.from(ResourceRequests_.class).columns(b -> b.requestedResourceOrg_ID())
        .where(b -> b.ID().eq(ID));
    Result resourceRequestResult = persistenceService.run(select);

    if (resourceRequestResult.rowCount() > 0) {
      return resourceRequestResult.single(ResourceRequests.class).getRequestedResourceOrgId();
    } else {
      return null;
    }

  }

  public void fillReferenceObjectTypeCode(resourcerequestservice.ResourceRequests resourceRequest) {

    if (resourceRequest.getReferenceObjectId() != null) {
      updateReferenceObjectTypeCode(resourceRequest, getReferenceObjectTypeCode(resourceRequest));
    } else {
      updateReferenceObjectTypeCode(resourceRequest, REFERENCE_OBJECT_CODE);
    }

  }

  public Integer getReferenceObjectTypeCode(resourcerequestservice.ResourceRequests resourceRequest) {

    CqnSelect select = Select.from(ReferenceObjects_.class)
        .where(referenceObject -> referenceObject.ID().eq(resourceRequest.getReferenceObjectId()))
        .columns(ReferenceObjects_::typeCode);

    ReferenceObjects referenceObject = persistenceService.run(select).single(ReferenceObjects.class);

    return referenceObject.getTypeCode();

  }

  public void updateReferenceObjectTypeCode(resourcerequestservice.ResourceRequests resourceRequest,
      Integer referenceObjectTypeCode) {

    CqnUpdate cqnUpdate = Update.entity(ResourceRequests_.class)
        .data(ResourceRequests.REFERENCE_OBJECT_TYPE_CODE, referenceObjectTypeCode)
        .where(rr -> rr.ID().eq(resourceRequest.getId()));
    persistenceService.run(cqnUpdate);

  }

  public void updateReferenceObject(ResourceRequests resourceRequest) {
    ResourceRequests draftResourceRequest = selectDraftResourceRequest(resourceRequest.getId());
    int originalReferenceObjectType = draftResourceRequest.getReferenceObjectTypeCode();
    int updatedReferenceObjectType = resourceRequest.getReferenceObjectTypeCode();

    if (originalReferenceObjectType == 1 && updatedReferenceObjectType == 0) {

      resetReferenceObject(resourceRequest);

    }
  }

  public void resetReferenceObject(ResourceRequests resourceRequest) {

    resourceRequest.setReferenceObjectId(null);
  }

}
