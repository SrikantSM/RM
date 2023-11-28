package com.sap.c4p.rm.resourcerequest.validations;

import java.math.BigDecimal;
import java.time.chrono.ChronoLocalDate;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.ResourceRequestCapacities;
import manageresourcerequestservice.ResourceRequestCapacities_;
import manageresourcerequestservice.ResourceRequests;

@Component
public class ResourceRequestCapacityValidatorImpl implements ResourceRequestCapacityValidator {

  private Messages messages;

  @Autowired
  public ResourceRequestCapacityValidatorImpl(Messages messages) {
    this.messages = messages;
  }

  @Override
  public void validateEffortDistributionProperties(ResourceRequests resourceRequest) {

    /*
     * Validate each attributes of resource request capacities
     */
    for (ResourceRequestCapacities resRequestCapacity : resourceRequest.getCapacityRequirements()) {

      /**
       * Validate resource request capaciy dates capacity dates
       */
      validateResourceRequestCapacityDates(resRequestCapacity.getStartDate(), resRequestCapacity.getEndDate(),
          resourceRequest.getStartDate(), resourceRequest.getEndDate(),
          resourceRequest.getEffortDistributionTypeCode());

      /**
       * Validates the value of requestedCapacity is positive.
       *
       */
      validateRequestedCapacityValue(resRequestCapacity.getRequestedCapacity());

    }

    /**
     * Validates the no dupliate start and end date in resource request capacities.
     *
     */
    validateDuplicateDatesInCapacities(resourceRequest.getCapacityRequirements());

    /**
     * Validates distributed effort matches the resource request effort
     *
     */
    validateEffortWithResourceRequest(resourceRequest);

  }

  public boolean validateDatesODataChecks(ChronoLocalDate startDate, ChronoLocalDate endDate) {
    boolean bAtleastOneIsNull = false;
    /* Validate if start date is empty */
    if (startDate == null) {
      bAtleastOneIsNull = true;
      messages.error(MessageKeys.INVALID_DATES).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.startDate());
    }

    /* Validate if end date is empty */
    if (endDate == null) {
      bAtleastOneIsNull = true;
      messages.error(MessageKeys.INVALID_DATES).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.endDate());
    }
    return bAtleastOneIsNull;
  }

  public void validateBasicBusinessLogic(ChronoLocalDate startDate, ChronoLocalDate endDate,
      ChronoLocalDate requestStartDate, ChronoLocalDate requestEndDate) {
    /* Validate Start is before the End Dates of Resource Request */
    if (startDate.isAfter(endDate)) {
      messages.error(MessageKeys.INVALID_DATES).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.startDate());
    }

    /*
     * Validate Resource Request Capacity start date falls within Resource Request
     * Duration
     */
    if (startDate.isBefore(requestStartDate) || startDate.isAfter(requestEndDate)) {
      messages.error(MessageKeys.INVALID_DATE_RANGES_FOR_CAPACITY).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.startDate());
    }

    /* Validate Resource Request end date falls within Resource Request Duration */
    if (endDate.isBefore(requestStartDate) || endDate.isAfter(requestEndDate)) {
      messages.error(MessageKeys.INVALID_DATE_RANGES_FOR_CAPACITY).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.endDate());
    }
  }

  public void validateDailyCapacityData(ChronoLocalDate startDate, ChronoLocalDate endDate) {
    if (!startDate.isEqual(endDate)) {
      messages.error(MessageKeys.INVALID_DATES_DAILY_EFFORT).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.endDate());
    }
  }

  public void validateWeeklyCapacityData(ChronoLocalDate startDate, ChronoLocalDate endDate,
      ChronoLocalDate requestStartDate, ChronoLocalDate requestEndDate) {
    WeekFields weekFieldDE = WeekFields.of(Locale.GERMANY);
    if (!startDate.isEqual(requestStartDate) && !startDate.with(weekFieldDE.dayOfWeek(), 1).isEqual(startDate)) {
      // startDate should be day 1 of week
      messages.error(MessageKeys.INVALID_START_DATE_WEEKLY_EFFORT).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.endDate());
    }

    if (!endDate.isEqual(requestEndDate) && !endDate.with(weekFieldDE.dayOfWeek(), 7).isEqual(endDate)) {
      // endDate should be day 7 of week
      messages.error(MessageKeys.INVALID_END_DATE_WEEKLY_EFFORT).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.endDate());
    }
  }

  @Override
  public void validateResourceRequestCapacityDates(ChronoLocalDate startDate, ChronoLocalDate endDate,
      ChronoLocalDate requestStartDate, ChronoLocalDate requestEndDate, int effortDistributionType) {

    boolean oDataErrorExist = validateDatesODataChecks(startDate, endDate);
    if (!oDataErrorExist) {

      validateBasicBusinessLogic(startDate, endDate, requestStartDate, requestEndDate);

      /*
       * ValidateResource Request Capacity start date is same as end date if effort
       * distribution type is Daily Hours
       */
      if (effortDistributionType == Constants.DAILY_HOURS) {
        validateDailyCapacityData(startDate, endDate);
      }
      /*
       * ValidateResource Request Capacity start date is on day 1 of week and end date
       * is day 7 of week provided start date is not the resource request start date
       * or end date is not the resource request end date
       */
      if (effortDistributionType == Constants.WEEKLY_HOURS) {
        validateWeeklyCapacityData(startDate, endDate, requestStartDate, requestEndDate);
      }
    }
  }

  @Override
  public void validateDuplicateDatesInCapacities(final List<ResourceRequestCapacities> resourceRequestCapacities) {

    List<Object> distinctStartDates = resourceRequestCapacities.stream()
        .map(m -> m.get(ResourceRequestCapacities.START_DATE)).distinct().collect(Collectors.toList());

    List<Object> distinctEndDates = resourceRequestCapacities.stream()
        .map(m -> m.get(ResourceRequestCapacities.END_DATE)).distinct().collect(Collectors.toList());

    if (distinctStartDates != null && distinctEndDates != null
        && (distinctStartDates.size() < resourceRequestCapacities.size()
            || distinctEndDates.size() < resourceRequestCapacities.size())) {

      messages.error(MessageKeys.DUPLICATE_DATES).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.startDate());
    }

  }

  @Override
  public void validateEffortWithResourceRequest(final ResourceRequests resourceRequest) {

    BigDecimal totalEffort = BigDecimal.ZERO;
    for (ResourceRequestCapacities resourceRequestCapacity : resourceRequest.getCapacityRequirements()) {
      totalEffort = totalEffort.add(resourceRequestCapacity.getRequestedCapacity());
    }

    if (totalEffort.compareTo(resourceRequest.getRequestedCapacity()) != 0) {
      resourceRequest.setRequestedCapacity(totalEffort);
      resourceRequest.setRequestedCapacityInMinutes(totalEffort.multiply(BigDecimal.valueOf(60)).intValue());
    }

  }

  @Override
  public void validateRequestedCapacityValue(BigDecimal requestedCapacity) {

    if (requestedCapacity == null || requestedCapacity.signum() != 1
        || requestedCapacity.compareTo(BigDecimal.valueOf(999)) > 0) {
      messages.error(MessageKeys.INVALID_REQUIRED_DAILY_EFFORT).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.requestedCapacity());
    }
  }

}