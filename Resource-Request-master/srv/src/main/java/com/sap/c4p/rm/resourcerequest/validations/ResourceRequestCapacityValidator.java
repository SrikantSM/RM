package com.sap.c4p.rm.resourcerequest.validations;

import java.math.BigDecimal;
import java.time.chrono.ChronoLocalDate;
import java.util.List;

import manageresourcerequestservice.ResourceRequestCapacities;
import manageresourcerequestservice.ResourceRequests;

public interface ResourceRequestCapacityValidator {

  /*
   * Validate requested effort for daily distribution
   */

  void validateEffortWithResourceRequest(ResourceRequests resourceRequest);

  /*
   * Validate distributed efforts do not have duplicate dates
   */

  void validateDuplicateDatesInCapacities(final List<ResourceRequestCapacities> resourceRequestCapacities);

  /*
   * Validate resource request capacitiies property
   */

  void validateEffortDistributionProperties(ResourceRequests resourceRequest);

  /**
   * Validates resource request capacities start date and end date
   *
   *
   */
  void validateResourceRequestCapacityDates(ChronoLocalDate startDate, ChronoLocalDate endDate,
      ChronoLocalDate startDateRange, ChronoLocalDate endDateRange, int effortDistributionType);

  /**
   * Validates the value of requestedCapacity is positive.
   *
   *
   */
  void validateRequestedCapacityValue(BigDecimal requestedCapacity);
}
