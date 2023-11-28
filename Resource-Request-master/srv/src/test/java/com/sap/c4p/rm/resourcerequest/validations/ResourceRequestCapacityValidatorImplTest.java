package com.sap.c4p.rm.resourcerequest.validations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.ResourceRequestCapacities;
import manageresourcerequestservice.ResourceRequests;

public class ResourceRequestCapacityValidatorImplTest {

  /** code under test */
  private static ResourceRequestCapacityValidatorImpl capacityValidator;

  /** mocks */
  private Messages messages;

  @BeforeEach
  void beforeEach() {

    messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    capacityValidator = new ResourceRequestCapacityValidatorImpl(messages);

  }

  @Nested
  @DisplayName("Validate oData Checks for Resource Request Capacities Dates")
  class ValidateDatesODataChecks {
    @Test
    @DisplayName("Check if null start Date Values throws exceptions")
    public void validateNullStartDateValue() {

      // Mock Data
      final LocalDate startDate = null;
      final LocalDate endDate = LocalDate.of(2019, 5, 2);
      // Function under test
      capacityValidator.validateDatesODataChecks(startDate, endDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_DATES);
    }

    @Test
    @DisplayName("Check if null end Date Values throws exceptions")
    public void validateNullEndDateValue() {

      // Mock Data
      final LocalDate startDate = LocalDate.of(2019, 5, 2);
      final LocalDate endDate = null;
      // Function under test
      capacityValidator.validateDatesODataChecks(startDate, endDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_DATES);
    }

    @Test
    @DisplayName("Check if null date Values throws exceptions")
    public void validateNullDateValues() {

      // Mock Data
      final LocalDate startDate = null;
      final LocalDate endDate = null;
      // Function under test
      capacityValidator.validateDatesODataChecks(startDate, endDate);
      // Assertions
      verify(messages, times(2)).error(MessageKeys.INVALID_DATES);
    }

    @Test
    @DisplayName("Check if start date and end date are not null, then no exception is thrown")
    public void validateNonNullDateValues() {

      // Mock Data
      final LocalDate startDate = LocalDate.of(2019, 5, 2);
      final LocalDate endDate = LocalDate.of(2019, 5, 2);
      // Function under test
      capacityValidator.validateDatesODataChecks(startDate, endDate);
      // Assertions
      verifyNoInteractions(messages);
    }

  }

  @Nested
  @DisplayName("Validate Resource Request Capacities Dates are in valid ranges")
  class ValidateBasicBusinessLogic {
    @Test
    @DisplayName("Validate When Start Date Is Before Resource Request Start Date")
    public void validateWhenStartDateIsBeforeResourceRequestStartDate() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2019, 5, 1);
      final LocalDate endDate = LocalDate.of(2019, 5, 4);
      final LocalDate resourceRequestStartDate = LocalDate.of(2019, 5, 3);
      final LocalDate resourceRequestEndDate = LocalDate.of(2019, 5, 5);
      // Function under test
      capacityValidator.validateBasicBusinessLogic(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES_FOR_CAPACITY);

    }

    @Test
    @DisplayName("Validate When Start Date Is After Resource Request End Date")
    public void validateWhenStartDateIsAfterRresourceRequestEndDate() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2019, 6, 6);
      final LocalDate endDate = LocalDate.of(2019, 6, 5);
      final LocalDate resourceRequestStartDate = LocalDate.of(2019, 6, 3);
      final LocalDate resourceRequestEndDate = LocalDate.of(2019, 6, 5);
      // Function under test
      capacityValidator.validateBasicBusinessLogic(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES_FOR_CAPACITY);

    }

    @Test
    @DisplayName("Validate When End Date Is Before Resource Request Start Date")
    public void validateWhenEndDateIsBeforeResourceRequestStartDate() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2019, 5, 3);
      final LocalDate endDate = LocalDate.of(2019, 5, 1);
      final LocalDate resourceRequestStartDate = LocalDate.of(2019, 5, 3);
      final LocalDate resourceRequestEndDate = LocalDate.of(2019, 5, 5);
      // Function under test
      capacityValidator.validateBasicBusinessLogic(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES_FOR_CAPACITY);

    }

    @Test
    @DisplayName("Validate When End Date Is After Resource Request End Date")
    public void validateWhenEndDateIsAfterRresourceRequestEndDate() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2019, 6, 7);
      final LocalDate endDate = LocalDate.of(2019, 6, 9);
      final LocalDate resourceRequestStartDate = LocalDate.of(2019, 6, 6);
      final LocalDate resourceRequestEndDate = LocalDate.of(2019, 6, 8);
      // Function under test
      capacityValidator.validateBasicBusinessLogic(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES_FOR_CAPACITY);

    }

    @Test
    @DisplayName("Validate if start date and end date is in valid range")
    public void validateStartDateAndEndDateIsInValidRange() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2019, 6, 2);
      final LocalDate endDate = LocalDate.of(2019, 6, 3);
      final LocalDate resourceRequestStartDate = LocalDate.of(2019, 6, 1);
      final LocalDate resourceRequestEndDate = LocalDate.of(2019, 6, 4);
      // Function under test
      capacityValidator.validateBasicBusinessLogic(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verifyNoInteractions(messages);

    }

  }

  @Nested
  @DisplayName("Validate Resource Request Capacities Dates for daily distribution")
  class ValidateDailyCapacityData {
    @Test
    @DisplayName("Validate When Start Date and End Date are not same")
    public void validateWhenStartDateAndEndDateAreNotSame() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2019, 6, 7);
      final LocalDate endDate = LocalDate.of(2019, 6, 8);
      // Function Under test
      capacityValidator.validateDailyCapacityData(startDate, endDate);

      verify(messages, times(1)).error(MessageKeys.INVALID_DATES_DAILY_EFFORT);

    }

    @Test
    @DisplayName("Validate capacity dates successfully for daily effort distribution")
    public void validateCapacityDatesForDailySuccess() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2019, 6, 7);
      final LocalDate endDate = LocalDate.of(2019, 6, 7);

      // Function under test
      capacityValidator.validateDailyCapacityData(startDate, endDate);
      // Assertions
      verifyNoInteractions(messages);

    }

  }

  @Nested
  @DisplayName("Validate Resource Request Capacities Dates for weekly distribution")
  class ValidateWeeklyCapacityData {
    @Test
    @DisplayName("validate Start Date Is Neither Week Start Date Nor Resource Request Start Date")
    public void validateStartDateIsNeitherWeekStartDateNorResourceRequestStartDate() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2021, 7, 25);
      final LocalDate endDate = LocalDate.of(2021, 7, 30);
      final LocalDate resourceRequestStartDate = LocalDate.of(2021, 7, 7);
      final LocalDate resourceRequestEndDate = LocalDate.of(2021, 7, 30);
      // Function Under test
      capacityValidator.validateWeeklyCapacityData(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_START_DATE_WEEKLY_EFFORT);

    }

    @Test
    @DisplayName("validate End Date Is Neither Week Start Date Nor Resource Request Start Date")
    public void validateEndDateIsNeitherWeekStartDateNorResourceRequestStartDate() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2021, 7, 26);
      final LocalDate endDate = LocalDate.of(2021, 7, 30);
      final LocalDate resourceRequestStartDate = LocalDate.of(2021, 7, 26);
      final LocalDate resourceRequestEndDate = LocalDate.of(2021, 7, 31);
      // Function Under test
      capacityValidator.validateWeeklyCapacityData(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.INVALID_END_DATE_WEEKLY_EFFORT);

    }

    @Test
    @DisplayName("Validate capacity dates successfully for weekly effort distribution")
    public void validateCapacityDatesForWeeklySuccess() {
      // Mock data
      final LocalDate startDate = LocalDate.of(2021, 7, 26);
      final LocalDate endDate = LocalDate.of(2021, 7, 30);
      final LocalDate resourceRequestStartDate = LocalDate.of(2021, 7, 26);
      final LocalDate resourceRequestEndDate = LocalDate.of(2021, 7, 30);
      // Function Under test
      capacityValidator.validateWeeklyCapacityData(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      // Assertions
      verifyNoInteractions(messages);

    }

  }

  @Nested
  @DisplayName("Validate Resource Request Capacities Dates")
  class validateResourceRequestCapacityDates {
    @Test
    @DisplayName("Check if no furthur checks are done if oData error has occured")
    public void validateNullDateValuesSuccess() {

      // Mock data
      final ResourceRequestCapacityValidatorImpl spy = spy(capacityValidator);
      final LocalDate startDate = null;
      final LocalDate endDate = null;
      final LocalDate resourceRequestStartDate = LocalDate.of(2021, 7, 27);
      final LocalDate resourceRequestEndDate = LocalDate.of(2021, 7, 28);
      doReturn(true).when(spy).validateDatesODataChecks(startDate, endDate);
      // Function Under test

      spy.validateResourceRequestCapacityDates(startDate, endDate, resourceRequestStartDate, resourceRequestEndDate, 1);
      // Assertions
      verify(spy, times(0)).validateBasicBusinessLogic(any(), any(), any(), any());
      verify(spy, times(0)).validateDailyCapacityData(any(), any());
      verify(spy, times(0)).validateWeeklyCapacityData(any(), any(), any(), any());

    }

    @Test
    @DisplayName("Check if correct function is called when distribution type is daily")
    public void validateDateWhenDistributionTypeIsDaily() {

      // Mock data
      final ResourceRequestCapacityValidatorImpl spy = spy(capacityValidator);
      final LocalDate startDate = LocalDate.of(2021, 7, 25);
      final LocalDate endDate = LocalDate.of(2021, 7, 26);
      final LocalDate resourceRequestStartDate = LocalDate.of(2021, 7, 27);
      final LocalDate resourceRequestEndDate = LocalDate.of(2021, 7, 28);
      doReturn(false).when(spy).validateDatesODataChecks(startDate, endDate);
      // Function Under test

      spy.validateResourceRequestCapacityDates(startDate, endDate, resourceRequestStartDate, resourceRequestEndDate,
          Constants.DAILY_HOURS);
      // Assertions
      verify(spy, times(1)).validateBasicBusinessLogic(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      verify(spy, times(1)).validateDailyCapacityData(startDate, endDate);
      verify(spy, times(0)).validateWeeklyCapacityData(any(), any(), any(), any());

    }

    @Test
    @DisplayName("Check if correct function is called when distribution type is weekly")
    public void validateDateWhenDistributionTypeIsWeekly() {

      // Mock data
      final ResourceRequestCapacityValidatorImpl spy = spy(capacityValidator);
      final LocalDate startDate = LocalDate.of(2021, 7, 25);
      final LocalDate endDate = LocalDate.of(2021, 7, 26);
      final LocalDate resourceRequestStartDate = LocalDate.of(2021, 7, 27);
      final LocalDate resourceRequestEndDate = LocalDate.of(2021, 7, 28);
      doReturn(false).when(spy).validateDatesODataChecks(startDate, endDate);
      // Function Under test

      spy.validateResourceRequestCapacityDates(startDate, endDate, resourceRequestStartDate, resourceRequestEndDate,
          Constants.WEEKLY_HOURS);
      // Assertions
      verify(spy, times(1)).validateBasicBusinessLogic(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);
      verify(spy, times(0)).validateDailyCapacityData(any(), any());
      verify(spy, times(1)).validateWeeklyCapacityData(startDate, endDate, resourceRequestStartDate,
          resourceRequestEndDate);

    }

  }

  @Nested
  class validateEffortWithResourceRequest {

    @Test
    @DisplayName("Validate if distributed effort matches to requested effort, No error thrown")
    void validateDistributedEffortMatchesRequestedEffort() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.of(2020, 01, 01));
      resourceRequest.setEndDate(LocalDate.of(2020, 01, 03));
      resourceRequest.setId("1000001");
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(30));

      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      ResourceRequestCapacities capcity = Struct.create(ResourceRequestCapacities.class);
      capcity.setId("1000001");
      capcity.setResourceRequestId(resourceRequest.getId());
      capcity.setStartDate(LocalDate.of(2020, 01, 01));
      capcity.setEndDate(LocalDate.of(2020, 01, 01));
      capcity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity);

      capcity.setId("1000002");
      capcity.setResourceRequestId(resourceRequest.getId());
      capcity.setStartDate(LocalDate.of(2020, 01, 02));
      capcity.setEndDate(LocalDate.of(2020, 01, 02));
      capcity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity);

      capcity.setId("1000003");
      capcity.setResourceRequestId(resourceRequest.getId());
      capcity.setStartDate(LocalDate.of(2020, 01, 03));
      capcity.setEndDate(LocalDate.of(2020, 01, 03));
      capcity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity);

      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      capacityValidator.validateEffortWithResourceRequest(resourceRequest);
      verifyNoInteractions(messages);

    }

    @Test
    @DisplayName("Validate if distributed efforts do not matches to requested effort, then header is made consistent")
    void validateDistributedEffortsDoNotMatchesRequestedEffort() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.of(2020, 01, 01));
      resourceRequest.setEndDate(LocalDate.of(2020, 01, 03));
      resourceRequest.setId("1000001");
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10));

      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      ResourceRequestCapacities capacity = Struct.create(ResourceRequestCapacities.class);
      capacity.setId("1000001");
      capacity.setResourceRequestId(resourceRequest.getId());
      capacity.setStartDate(LocalDate.of(2020, 01, 01));
      capacity.setEndDate(LocalDate.of(2020, 01, 01));
      capacity.setRequestedCapacity(BigDecimal.valueOf(20));
      resourceRequestCapacities.add(capacity);
      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      capacityValidator.validateEffortWithResourceRequest(resourceRequest);
      assertEquals(BigDecimal.valueOf(20), resourceRequest.getRequestedCapacity());
      assertEquals(1200, resourceRequest.getRequestedCapacityInMinutes());
    }
  }

  @Nested
  class validateDuplicateDatesInCapacities {

    @Test
    @DisplayName("Validate if distributed effort does not have any duplicate dates, No error thrown")
    void validateDistributedWithNoDuplicateDates() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.of(2020, 01, 01));
      resourceRequest.setEndDate(LocalDate.of(2020, 01, 03));
      resourceRequest.setId("1000001");
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(30));

      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      ResourceRequestCapacities capcity = Struct.create(ResourceRequestCapacities.class);
      capcity.setId("1000001");
      capcity.setResourceRequestId(resourceRequest.getId());
      capcity.setStartDate(LocalDate.of(2020, 01, 01));
      capcity.setEndDate(LocalDate.of(2020, 01, 01));
      capcity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity);

      ResourceRequestCapacities capcity2 = Struct.create(ResourceRequestCapacities.class);
      capcity2.setId("1000002");
      capcity2.setResourceRequestId(resourceRequest.getId());
      capcity2.setStartDate(LocalDate.of(2020, 01, 02));
      capcity2.setEndDate(LocalDate.of(2020, 01, 02));
      capcity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity2);

      ResourceRequestCapacities capcity3 = Struct.create(ResourceRequestCapacities.class);
      capcity3.setId("1000003");
      capcity3.setResourceRequestId(resourceRequest.getId());
      capcity3.setStartDate(LocalDate.of(2020, 01, 03));
      capcity3.setEndDate(LocalDate.of(2020, 01, 03));
      capcity3.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity3);

      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      capacityValidator.validateDuplicateDatesInCapacities(resourceRequestCapacities);
      verifyNoInteractions(messages);

    }

    @Test
    @DisplayName("Validate if distributed effort  having any duplicate dates, throws error ")
    void validateDistributedWithDuplicateDates() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.of(2020, 01, 01));
      resourceRequest.setEndDate(LocalDate.of(2020, 01, 03));
      resourceRequest.setId("1000001");
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(30));

      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      ResourceRequestCapacities capcity = Struct.create(ResourceRequestCapacities.class);
      capcity.setId("1000001");
      capcity.setResourceRequestId(resourceRequest.getId());
      capcity.setStartDate(LocalDate.of(2020, 01, 01));
      capcity.setEndDate(LocalDate.of(2020, 01, 01));
      capcity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity);

      ResourceRequestCapacities capcity2 = Struct.create(ResourceRequestCapacities.class);
      capcity2.setId("1000002");
      capcity2.setResourceRequestId(resourceRequest.getId());
      capcity2.setStartDate(LocalDate.of(2020, 01, 02));
      capcity2.setEndDate(LocalDate.of(2020, 01, 02));
      capcity2.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity2);

      ResourceRequestCapacities capcity3 = Struct.create(ResourceRequestCapacities.class);
      capcity3.setId("1000003");
      capcity3.setResourceRequestId(resourceRequest.getId());
      capcity3.setStartDate(LocalDate.of(2020, 01, 01));
      capcity3.setEndDate(LocalDate.of(2020, 01, 01));
      capcity3.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(capcity3);

      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      capacityValidator.validateDuplicateDatesInCapacities(resourceRequestCapacities);
      verify(messages, times(1)).error(MessageKeys.DUPLICATE_DATES);

    }

    @Test
    @DisplayName("Validate if error is thrown for distributed effort having value 0")
    void validateDistributedWithValue0() {
      BigDecimal effort = new BigDecimal(0);
      capacityValidator.validateRequestedCapacityValue(effort);
      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_DAILY_EFFORT);
    }

    @Test
    @DisplayName("Validate if error is thrown for distributed effort having value null")
    void validateDistributedWithValueNull() {
      BigDecimal effort = null;
      capacityValidator.validateRequestedCapacityValue(effort);
      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_DAILY_EFFORT);
    }

    @Test
    @DisplayName("Validate if error is thrown for distributed effort having value less than 0")
    void validateDistributedWithNegativeValue() {
      BigDecimal effort = new BigDecimal(-1);
      capacityValidator.validateRequestedCapacityValue(effort);
      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_DAILY_EFFORT);
    }

    @Test
    @DisplayName("Validate if error is thrown for distributed effort having value greater than 999")
    void validateDistributedWithOutOfRangePositiveValue() {
      BigDecimal effort = new BigDecimal(1000);
      capacityValidator.validateRequestedCapacityValue(effort);
      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_DAILY_EFFORT);
    }

    @Test
    @DisplayName("Validate if error is not thrown for distributed effort having value less than 999")
    void validateDistributedWithPositiveValue() {
      BigDecimal effort = new BigDecimal(100);
      capacityValidator.validateRequestedCapacityValue(effort);
      verify(messages, times(0)).error(MessageKeys.INVALID_REQUIRED_DAILY_EFFORT);
    }
  }
};