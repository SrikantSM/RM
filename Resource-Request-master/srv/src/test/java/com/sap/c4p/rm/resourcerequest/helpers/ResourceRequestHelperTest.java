package com.sap.c4p.rm.resourcerequest.helpers;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Month;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.ResourceRequestCapacities;
import manageresourcerequestservice.ResourceRequests;
import resourcerequestservice.ReferenceObjects;

@DisplayName("Unit test for ResourceRequest Helper class")
public class ResourceRequestHelperTest {
  /*
   * Mock Object
   */
  static DraftService mockDraftService;
  static PersistenceService mockPersistenceService;
  static Messages mockMessages;
  /*
   * Class under test
   *
   */
  private static ResourceRequestHelper cut;

  @BeforeAll
  public static void setUp() {
    mockDraftService = mock(DraftService.class);
    mockPersistenceService = mock(PersistenceService.class);
    mockMessages = mock(Messages.class);
    cut = new ResourceRequestHelper(mockDraftService, mockPersistenceService, mockMessages);
  }

  @BeforeEach
  void beforeEach() {
    Mockito.reset(mockPersistenceService);
  }

  @Nested
  @DisplayName("Unit Test for Resource Requirement Helper method")
  public class GetUpdatedCapacityForWeeklyDistribution {
    List<ResourceRequestCapacities> originalCapacityRequirements = new ArrayList<>();
    List<ResourceRequestCapacities> expectedCapacityRequirements;
    LocalDate resourceRequestStartDate;
    LocalDate resourceRequestEndDate;
    ResourceRequestCapacities expectedCapacityRequirement1;
    ResourceRequestCapacities expectedCapacityRequirement2;
    ResourceRequestCapacities expectedCapacityRequirement3;
    ResourceRequestCapacities expectedCapacityRequirement4;

    @BeforeEach
    public void setUpCapacityData() {
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 24), LocalDate.of(2021, 5, 30), 10));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 31), LocalDate.of(2021, 6, 6), 10));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 7), LocalDate.of(2021, 6, 13), 10));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 14), LocalDate.of(2021, 6, 20), 10));

      expectedCapacityRequirements = new ArrayList<>();

      expectedCapacityRequirement1 = getCapacityData(LocalDate.of(2021, 5, 24), LocalDate.of(2021, 5, 30), 10);
      expectedCapacityRequirement2 = getCapacityData(LocalDate.of(2021, 5, 31), LocalDate.of(2021, 6, 6), 10);
      expectedCapacityRequirement3 = getCapacityData(LocalDate.of(2021, 6, 7), LocalDate.of(2021, 6, 13), 10);
      expectedCapacityRequirement4 = getCapacityData(LocalDate.of(2021, 6, 14), LocalDate.of(2021, 6, 17), 10);
    }

    @Test
    @DisplayName("Testing date range completely outside original dates, before original.")
    public void otsideOriginalBeforeOriginal() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 10);
      resourceRequestEndDate = LocalDate.of(2021, 5, 18);
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, null, null);
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range completely outside original dates, after original.")
    public void otsideOriginalAfterOriginal() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 24);
      resourceRequestEndDate = LocalDate.of(2021, 7, 3);
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, null, null);
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range shrink: start date, new start date in same week as original start date.")
    public void shrinkDateRangeStartSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 28);
      resourceRequestEndDate = LocalDate.of(2021, 6, 17);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement1.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement1.setStartTime(startTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range shrink: start date, new start date in next week compared to original start date.")
    public void shrinkDateRangeStartPreviousWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 2);
      resourceRequestEndDate = LocalDate.of(2021, 6, 17);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement2.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement2.setStartTime(startTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range shrink: end date, new end date in same week as original end date.")
    public void shrinkDateRangeEndSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 6, 15);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement4.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement4.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range shrink: end date, new end date in previous week compared to original end date.")
    public void shrinkDateRangeEndPreviousWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 6, 10);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement3.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement3.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range shrink: both date, new dates in same weeks compared to the week of original dates.")
    public void shrinkDateRangeBothSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 28);
      resourceRequestEndDate = LocalDate.of(2021, 6, 15);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement1.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement1.setStartTime(startTime);
      expectedCapacityRequirement4.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement4.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range shrink: both date, new dates in different weeks compared to the week of original dates.")
    public void shrinkDateRangeBothDifferentWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 3);
      resourceRequestEndDate = LocalDate.of(2021, 6, 10);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement2.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement2.setStartTime(startTime);
      expectedCapacityRequirement3.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement3.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range exapnd: start date, new start date in same week as original start date.")
    public void expandDateRangeStartSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 6, 17);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement1.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement1.setStartTime(startTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range exapnd: start date, new start date in previous week compared to original start date.")
    public void expandDateRangeStartNextWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 19);
      resourceRequestEndDate = LocalDate.of(2021, 6, 17);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement1.setStartDate(LocalDate.of(2021, 5, 24));
      expectedCapacityRequirement1.setStartTime(
          LocalDate.of(2021, 5, 24).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range expand: end date, new end date in same week as original end date.")
    public void expandDateRangeEndSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 6, 18);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement4.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement4.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range exapnd: end date, new end date in next week compared to original end date.")
    public void expandDateRangeEndNextWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 6, 23);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement4.setEndDate(LocalDate.of(2021, 6, 20));
      expectedCapacityRequirement4.setEndTime(
          LocalDate.of(2021, 6, 20).plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range expand: both date, new dates in same weeks compared to the week of original dates.")
    public void expandDateRangeBothSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 6, 18);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement1.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement1.setStartTime(startTime);
      expectedCapacityRequirement4.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement4.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range expand: both date, new dates in different weeks compared to the week of original dates.")
    public void expandDateRangeBothDifferentWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 12);
      resourceRequestEndDate = LocalDate.of(2021, 6, 30);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement1.setStartDate(LocalDate.of(2021, 5, 24));
      expectedCapacityRequirement1.setStartTime(
          LocalDate.of(2021, 5, 24).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      expectedCapacityRequirement4.setEndDate(LocalDate.of(2021, 6, 20));
      expectedCapacityRequirement4.setEndTime(
          LocalDate.of(2021, 6, 20).plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      expectedCapacityRequirements.add(expectedCapacityRequirement2);
      expectedCapacityRequirements.add(expectedCapacityRequirement3);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range change: both dates moved to the week in which original start date was present.")
    public void dateRangeChangeSameWeekStart() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 5, 25);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement1.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement1.setStartTime(startTime);
      expectedCapacityRequirement1.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement1.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement1);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range change: both dates moved to the week in which original end date was present.")
    public void dateRangeChangeSameWeekEnd() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 18);
      resourceRequestEndDate = LocalDate.of(2021, 6, 19);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate, startTime, endTime);
      // Set expected Result
      expectedCapacityRequirement4.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement4.setStartTime(startTime);
      expectedCapacityRequirement4.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement4.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }
  }

  @Nested
  @DisplayName("Unit Test for calculateCapacityRequirements method")
  class calculateAndResetCapacityInResourceRequest {

    public ResourceRequests resourceRequest;
    public ResourceRequestCapacities capacityRequirement1;
    public ResourceRequestCapacities capacityRequirement2;
    public ResourceRequestCapacities capacityRequirement3;
    public String resourceRequestId;

    @Test
    @DisplayName("Check value of parent is updated correctly")
    void calculateAndResetCapacityInResourceRequestSuccessfulScenario() {

      resourceRequest = ResourceRequests.create();
      List<ResourceRequestCapacities> updatedCapacityRequirements = new ArrayList<>();
      resourceRequestId = "r1";
      resourceRequest.setId(resourceRequestId);

      capacityRequirement1 = ResourceRequestCapacities.create();
      capacityRequirement1.setRequestedCapacity(new BigDecimal(10));

      capacityRequirement2 = ResourceRequestCapacities.create();
      capacityRequirement2.setRequestedCapacity(new BigDecimal(20));

      capacityRequirement3 = ResourceRequestCapacities.create();
      capacityRequirement3.setRequestedCapacity(new BigDecimal(25));

      updatedCapacityRequirements.add(capacityRequirement1);
      updatedCapacityRequirements.add(capacityRequirement2);
      updatedCapacityRequirements.add(capacityRequirement3);
      resourceRequest.setCapacityRequirements(updatedCapacityRequirements);

      cut.calculateAndResetCapacityInResourceRequest(updatedCapacityRequirements, resourceRequest);

      BigDecimal actualRequestedCapacity = resourceRequest.getRequestedCapacity();
      BigDecimal expectedRequestedCapacity = new BigDecimal(55);

      int actualRequestedCapacityInMinutes = resourceRequest.getRequestedCapacityInMinutes();
      int expectedRequestedCapacityInMinutes = expectedRequestedCapacity.multiply(BigDecimal.valueOf(60)).intValue();

      assertEquals(expectedRequestedCapacity, actualRequestedCapacity);
      assertEquals(expectedRequestedCapacityInMinutes, actualRequestedCapacityInMinutes);

    }

    @Test
    @DisplayName("Check error scenario")
    void calculateAndResetCapacityInResourceRequestExceptionScenario() {

      ServiceException e = new ServiceException("Error occured while changing the end date when size<2");
      final ResourceRequestHelper spy = Mockito.spy(cut);
      doThrow(e).when(spy).calculateAndResetCapacityInResourceRequest(any(), any());
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.calculateAndResetCapacityInResourceRequest(any(), any()));
      assertEquals(e.getMessage(), exception.getMessage());

    }
  }

  @Nested
  @DisplayName("Unit Test for updateEffortDistributionOnTypeChange method")
  class UpdateEffortDistributionOnTypeChange {
    public ResourceRequests draftResourceRequest;
    public ResourceRequests resourceRequest;

    @Test
    @DisplayName("Check aggregation logic is triggered when effort distribution type change from daily to weekly.")
    void updateEffortDistributionOnTypeChangeDailyToWeekly() {
      draftResourceRequest = ResourceRequests.create();
      resourceRequest = ResourceRequests.create();
      draftResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      resourceRequest.setEffortDistributionTypeCode(Constants.WEEKLY_HOURS);
      final ResourceRequestHelper spy = Mockito.spy(cut);
      doReturn(draftResourceRequest).when(spy).selectDraftResourceRequest(any());
      doNothing().when(spy).aggregateEffortDistributionOnTypeChangeFromDailyToWeekly(any());
      spy.updateEffortDistributionOnTypeChange(resourceRequest);
      verify(spy, times(1)).aggregateEffortDistributionOnTypeChangeFromDailyToWeekly(resourceRequest);
      verify(spy, times(0)).deleteCapacityRecords(resourceRequest);
    }

    @Test
    @DisplayName("Check existing capacity is deleted when effort distribution type change to total.")
    void updateEffortDistributionOnTypeChangeToTotal() {
      draftResourceRequest = ResourceRequests.create();
      resourceRequest = ResourceRequests.create();
      draftResourceRequest.setEffortDistributionTypeCode(Constants.WEEKLY_HOURS);
      resourceRequest.setRequestedCapacity(BigDecimal.TEN);
      resourceRequest.setRequestedCapacityInMinutes(600);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);
      final ResourceRequestHelper spy = Mockito.spy(cut);
      doReturn(draftResourceRequest).when(spy).selectDraftResourceRequest(any());
      doNothing().when(spy).deleteCapacityRecords(any());
      spy.updateEffortDistributionOnTypeChange(resourceRequest);
      verify(spy, times(0)).aggregateEffortDistributionOnTypeChangeFromDailyToWeekly(resourceRequest);
      verify(spy, times(1)).deleteCapacityRecords(resourceRequest);
      assertNotEquals(BigDecimal.ZERO, resourceRequest.getRequestedCapacity());
      assertNotEquals(0, resourceRequest.getRequestedCapacityInMinutes());
    }

    @Test
    @DisplayName("Check existing capacity is deleted and parent updated when effort distribution type change from weekly to daily.")
    void updateEffortDistributionOnTypeChangeOtherCases() {
      draftResourceRequest = ResourceRequests.create();
      resourceRequest = ResourceRequests.create();
      draftResourceRequest.setEffortDistributionTypeCode(Constants.WEEKLY_HOURS);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      final ResourceRequestHelper spy = Mockito.spy(cut);
      doReturn(draftResourceRequest).when(spy).selectDraftResourceRequest(any());
      doNothing().when(spy).deleteCapacityRecords(any());
      spy.updateEffortDistributionOnTypeChange(resourceRequest);
      verify(spy, times(0)).aggregateEffortDistributionOnTypeChangeFromDailyToWeekly(resourceRequest);
      verify(spy, times(1)).deleteCapacityRecords(resourceRequest);
      assertEquals(BigDecimal.ZERO, resourceRequest.getRequestedCapacity());
      assertEquals(0, resourceRequest.getRequestedCapacityInMinutes());

    }
  }

  @Nested
  @DisplayName("Unit Test for deleteCapacityRecords method")
  class DeleteCapacityRecords {
    ResourceRequests resourceRequest = ResourceRequests.create();
    List<ResourceRequestCapacities> originalCapacityRequirements = new ArrayList<>();

    @Test
    void testDeleteCapacityRecords() {
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 26), LocalDate.of(2021, 5, 26), 1));
      resourceRequest.setCapacityRequirements(originalCapacityRequirements);
      final List<ResourceRequestCapacities> expectedResult = new ArrayList<>();
      cut.deleteCapacityRecords(resourceRequest);
      ArrayList<ResourceRequestCapacities> observedResult = new ArrayList<>();
      observedResult.addAll(resourceRequest.getCapacityRequirements());
      assertEquals(expectedResult, observedResult);
    }
  }

  @Nested
  @DisplayName("Unit Test for selectDraftResourceRequest method")
  class SelectDraftResourceRequest {
    public String resourceRequestID = "RRID";
    public ResourceRequests resourceRequest = ResourceRequests.create();

    @Test
    @DisplayName("Check select query is executed.")
    void selectDraftResourceRequests() {
      Result mockResult = mock(Result.class);
      when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);
      assertEquals(resourceRequest, cut.selectDraftResourceRequest(resourceRequestID));
    }
  }

  @Nested
  @DisplayName("Unit Test for selectAllDraftResourceRequestCapacities method")
  class SelectAllDraftResourceRequestCapacities {
    public String resourceRequestID = "RRID";
    public ResourceRequestCapacities capacityRequirement = ResourceRequestCapacities.create();
    public List<ResourceRequestCapacities> capacityRequirementsList = new ArrayList<>();

    @Test
    @DisplayName("Check select query is executed.")
    void selectDraftResourceRequestCapacities() {
      capacityRequirementsList.add(capacityRequirement);
      Result mockResult = mock(Result.class);
      when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(ResourceRequestCapacities.class)).thenReturn(capacityRequirementsList);
      assertEquals(capacityRequirementsList, cut.selectDraftResourceRequestCapacities(resourceRequestID));
    }
  }

  @Nested
  @DisplayName("Unit Test for aggregateEffortDistributionOnTypeChangeFromDailyToWeekly method")
  class AggregateEffortDistributionOnTypeChangeFromDailyToWeekly {
    final ResourceRequestHelper spy = Mockito.spy(cut);
    List<ResourceRequestCapacities> originalCapacityRequirements = new ArrayList<>();
    List<ResourceRequestCapacities> expectedCapacityRequirements = new ArrayList<>();

    @Test
    @DisplayName("Check aggregation logic is working as expected.")
    public void testDailyToWeeklyAggregation() {

      ResourceRequests resourceRequest = ResourceRequests.create();
      resourceRequest.setStartDate(LocalDate.of(2021, 5, 24));
      resourceRequest.setEndDate(LocalDate.of(2021, 6, 9));

      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 26), LocalDate.of(2021, 5, 26), 1));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 27), LocalDate.of(2021, 5, 27), 1));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 30), LocalDate.of(2021, 5, 30), 2));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 5), LocalDate.of(2021, 6, 5), 2));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 6), LocalDate.of(2021, 6, 6), 3));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 7), LocalDate.of(2021, 6, 7), 3));

      expectedCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 7), LocalDate.of(2021, 6, 9), 3));
      expectedCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 24), LocalDate.of(2021, 5, 30), 4));
      expectedCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 31), LocalDate.of(2021, 6, 6), 5));

      doReturn(originalCapacityRequirements).when(spy).selectDraftResourceRequestCapacities(any());

      Result mockResult = mock(Result.class);
      when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);
      resourceRequest.setCapacityRequirements(originalCapacityRequirements);
      spy.aggregateEffortDistributionOnTypeChangeFromDailyToWeekly(resourceRequest);
      ArrayList<ResourceRequestCapacities> observedCapacityRequirements = new ArrayList<>();
      observedCapacityRequirements.addAll(resourceRequest.getCapacityRequirements());
      assertEquals(expectedCapacityRequirements, observedCapacityRequirements);
    }
  }

  private ResourceRequestCapacities getCapacityData(LocalDate startDate, LocalDate endDate, int capacity) {
    ResourceRequestCapacities capacityRequirement = ResourceRequestCapacities.create();
    capacityRequirement.setStartDate(startDate);
    capacityRequirement.setStartTime(startDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
    capacityRequirement.setEndDate(endDate);
    capacityRequirement
        .setEndTime(endDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
    capacityRequirement.setRequestedCapacity(new BigDecimal(capacity));
    capacityRequirement.setRequestedCapacityInMinutes(capacity * 60);

    return capacityRequirement;
  }

  @Nested
  class modifyCapacitiesForTotalEffortDistributionType {

    @Test
    @DisplayName("Insert Capacity data for Total effort distribution, no existing capacity exists scenario.")
    public void IsCapacityRequirementsCreatedForTotalDistribution() {
      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      ResourceRequestCapacities capcity = Struct.create(ResourceRequestCapacities.class);

      resourceRequest.setCapacityRequirements(resourceRequestCapacities);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);
      final ResourceRequestHelper resourceRequestHandlerSpy = spy(cut);

      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnInsert.class))).thenReturn(mockResult);
      doReturn(capcity).when(resourceRequestHandlerSpy).prepareCapacityFromResourceRequest(resourceRequest);

      resourceRequestHandlerSpy.modifyCapacitiesForTotalEffortDistributionType(resourceRequest);

      verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));
      verify(resourceRequestHandlerSpy, times(1)).prepareCapacityFromResourceRequest(resourceRequest);

    }

    @Test
    @DisplayName("Insert Capacity data for Total effort distribution, existing capacity exists scenario.")
    public void IsCapacityRequirementsUpdatedForTotalDistribution() {
      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      ResourceRequestCapacities capcity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacities.add(capcity);

      resourceRequest.setCapacityRequirements(resourceRequestCapacities);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);

      final ResourceRequestHelper resourceRequestHandlerSpy = spy(cut);

      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnInsert.class))).thenReturn(mockResult);
      doReturn(capcity).when(resourceRequestHandlerSpy).prepareCapacityFromResourceRequest(resourceRequest);

      resourceRequestHandlerSpy.modifyCapacitiesForTotalEffortDistributionType(resourceRequest);

      verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));
      verify(resourceRequestHandlerSpy, times(1)).prepareCapacityFromResourceRequest(resourceRequest);

    }
  }

  @Nested
  @DisplayName("Prepare Resource Request Capacity for Single Resource Request")
  class WhenSingleResourceRequest {

    private ResourceRequests resourceRequest;

    @BeforeEach

    public void setResourceRequest() {

      resourceRequest = getResourceRequest();

    }

    @Test
    @DisplayName("Prepare a Capacity from Resource Request")
    public void createCapacityFromResourceRequest() {

      ResourceRequestCapacities actualCapacity = cut.prepareCapacityFromResourceRequest(resourceRequest);

      assertAll("Resource Request Capacity",
          () -> assertEquals(resourceRequest.getId(), actualCapacity.getResourceRequestId(),
              "Resource Request ID is incorrect"),
          () -> assertEquals(resourceRequest.getRequestedUnit(), actualCapacity.getRequestedUnit(), "UOM is incorrect"),
          () -> assertEquals(resourceRequest.getRequestedCapacity(), actualCapacity.getRequestedCapacity(),
              "Capacity is incorrect"),
          () -> assertEquals(
              resourceRequest.getStartDate().atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant(),
              actualCapacity.getStartTime(), "Start time of capacity is incorrect"),
          () -> assertEquals(resourceRequest.getEndDate().plusDays(1).atTime(LocalTime.MIDNIGHT)
              .atZone(ZoneId.systemDefault()).toInstant(), actualCapacity.getEndTime(),
              "End time of capacity is incorrect"),
          () -> assertEquals(resourceRequest.getRequestedCapacityInMinutes(),
              actualCapacity.getRequestedCapacityInMinutes(), "Capacity in minutes is incorrect"),
          () -> assertEquals(resourceRequest.getStartDate(), actualCapacity.getStartDate(),
              "Start Date of capacity is incorrect"),
          () -> assertEquals(resourceRequest.getEndDate(), actualCapacity.getEndDate(),
              "End Date of capacity is incorrect")

      );

    }

    private ResourceRequests getResourceRequest() {

      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(1000));
      resourceRequest.setDemandId("8f605bdc-e472-47b4-ab28-4590e33e798f");
      resourceRequest.setStartDate(LocalDate.of(2019, Month.JANUARY, 01));
      resourceRequest.setEndDate(LocalDate.of(2019, Month.DECEMBER, 30));
      resourceRequest.setRequestedUnit("duration-hour");
      resourceRequest.setId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
      resourceRequest.setRequestedCapacityInMinutes(6000);

      return resourceRequest;
    }

  }

  @Nested
  @DisplayName("Resource Request default values test")
  class ResourceRequestDefaultValuesTest {

    @Test
    @DisplayName("Verify if resource request default values are filled ")
    public void verifyResourceRequestDefaultValuesFilled() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

      cut.fillResourceRequestDefaultValues(resourceRequest);

      assertAll(() -> assertEquals(Constants.REQUEST_OPEN, resourceRequest.getRequestStatusCode()),
          () -> assertEquals(Constants.UOM, resourceRequest.getRequestedUnit()));
    }
  }

  @Nested
  @DisplayName("Resource Request derived values test")
  class ResourceRequestDerivedValuesTest {

    @Test
    @DisplayName("Verify if resource request derived values are filled ")
    public void verifyResourceRequestDerivedValuesFilled() {

      LocalDate startDate = LocalDate.of(2021, 11, 11);
      LocalDate endDate = LocalDate.of(2020, 11, 11);
      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequest.setStartDate(startDate);
      resourceRequest.setEndDate(endDate);
      resourceRequest.setRequestedResourceOrgId("Org_1");

      cut.fillResourceRequestDerivedValues(resourceRequest);

      assertAll(() -> assertEquals(600, resourceRequest.getRequestedCapacityInMinutes()),
          () -> assertEquals("Org_1", resourceRequest.getProcessingResourceOrgId()),
          () -> assertEquals(cut.getStartTimeFromStartDate(startDate), resourceRequest.getStartTime()),
          () -> assertEquals(cut.getEndTimeFromEndDate(endDate), resourceRequest.getEndTime()));
    }
  }

  @Nested
  @DisplayName("Unit Test for selectResourceRequest method")
  class SelectResourceRequest {

    @Test
    @DisplayName("Persisted resource request exists for the given resource request id")
    public void resourceRequestExist() {

      final ResourceRequests resourceRequestExpected = Struct.create(ResourceRequests.class);
      resourceRequestExpected.setId("450a2453-ec0a-4a85-8247-94c39b9bdd67");

      final Result mockResult = mock(Result.class);

      doReturn(mockResult).when(mockPersistenceService).run(any(CqnSelect.class));
      doReturn(resourceRequestExpected).when(mockResult).single(any());

      final ResourceRequests resourceRequest = cut.selectResourceRequest("450a2453-ec0a-4a85-8247-94c39b9bdd67");

      assertEquals(resourceRequestExpected, resourceRequest);

    }
  }

  @Nested
  @DisplayName("Unit Test for getStartTimeFromStartDate method")
  class GetStartTimeFromStartDate {

    @Test
    @DisplayName("Check correct start time is provided for start date.")
    public void getStartTimeFromStartDateTest() {

      LocalDate date = LocalDate.of(2020, 1, 1);
      assertEquals(date.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant(),
          cut.getStartTimeFromStartDate(date));

    }
  }

  @Nested
  @DisplayName("Unit Test for getEndTimeFromEndDate method")
  class GetEndTimeFromEndDate {

    @Test
    @DisplayName("Check correct end time is provided for end date.")
    public void getEndTimeFromEndDateTest() {

      LocalDate date = LocalDate.of(2020, 1, 1);
      assertEquals(date.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant(),
          cut.getEndTimeFromEndDate(date));

    }
  }

  @Nested
  @DisplayName("Unit Test for getRequestedCapacityInMinutesFromRequestedCapacity method")
  class GetRequestedCapacityInMinutesFromRequestedCapacity {

    @Test
    @DisplayName("Check correct requested capacity in minutes is provided for requested capacity.")
    public void getRequestedCapacityInMinutesFromRequestedCapacityTest() {

      assertEquals(600, cut.getRequestedCapacityInMinutesFromRequestedCapacity(BigDecimal.valueOf(10)));

    }
  }

  @Nested
  @DisplayName("Unit Test for getStructureWithDefaultValues method")
  class GetStructureWithDefaultValues {

    @Test
    @DisplayName("Check correct default values are filled.")
    public void getStructureWithDefaultValuesTest() {
      ResourceRequests expected = Struct.create(ResourceRequests.class);
      expected.setPriorityCode(Constants.REQUEST_PRIORITY_MEDIUM);
      ResourceRequestHelper spyOfCut = spy(cut);

      doNothing().when(spyOfCut).deleteCapacityRecords(expected);
      doNothing().when(spyOfCut).fillResourceRequestDefaultValues(expected);

      ResourceRequests actual = spyOfCut.getStructureWithDefaultValues();

      assertEquals(expected, actual);
      verify(spyOfCut, times(1)).deleteCapacityRecords(expected);
      verify(spyOfCut, times(1)).fillResourceRequestDefaultValues(expected);

    }
  }

  @Nested
  @DisplayName("Unit Test for fillResourceRequestDefaultValues method")
  class FillResourceRequestDefaultValues {

    @Test
    @DisplayName("Check correct values are filled.")
    public void fillResourceRequestDefaultValuesTest() {
      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

      cut.fillResourceRequestDefaultValues(resourceRequest);

      assertEquals(Constants.REQUEST_OPEN, resourceRequest.getRequestStatusCode());
      assertEquals(Constants.UOM, resourceRequest.getRequestedUnit());
      assertEquals(Constants.REQUEST_WITHDRAW, resourceRequest.getReleaseStatusCode());

    }
  }

    @Nested
    @DisplayName("Unit Test for fillResourceRequestDefaultValues method during Update Scenario")
    class FillResourceRequestDefaultValuesWhenUpdate {

        @Test
        @DisplayName("Check correct values are filled.")
        public void fillResourceRequestDefaultValuesWhenUpdateTest() {
            ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

            cut.fillResourceRequestDefaultValuesWhenUpdate(resourceRequest);

            assertEquals(Constants.REQUEST_OPEN, resourceRequest.getRequestStatusCode());
            assertEquals(Constants.UOM, resourceRequest.getRequestedUnit());
        }
    }

    @Nested
    @DisplayName("Unit Test for fillResourceRequestDerivedValues method")
    class FillResourceRequestDerivedValues {

      @Test
      @DisplayName("Check correct derived values are.")
      public void fillResourceRequestDerivedValuesTestWithResourceOrg() {
        ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
        LocalDate startDate = LocalDate.of(2020, 1, 1);
        LocalDate endDate = LocalDate.of(2020, 1, 1);
        BigDecimal requestedCapacity = BigDecimal.valueOf(10);
        String requestedResourceOrgId = "org1";
        resourceRequest.setStartDate(startDate);
        resourceRequest.setEndDate(endDate);
        resourceRequest.setRequestedCapacity(requestedCapacity);
        resourceRequest.setRequestedResourceOrgId(requestedResourceOrgId);

        ResourceRequestHelper spyOfCut = spy(cut);

        spyOfCut.fillResourceRequestDerivedValues(resourceRequest);

        verify(spyOfCut, times(1)).getStartTimeFromStartDate(startDate);
        verify(spyOfCut, times(1)).getEndTimeFromEndDate(endDate);
        verify(spyOfCut, times(1)).getRequestedCapacityInMinutesFromRequestedCapacity(requestedCapacity);

        assertEquals(spyOfCut.getStartTimeFromStartDate(startDate), resourceRequest.getStartTime());
        assertEquals(spyOfCut.getEndTimeFromEndDate(endDate), resourceRequest.getEndTime());
        assertEquals(spyOfCut.getRequestedCapacityInMinutesFromRequestedCapacity(requestedCapacity),
            resourceRequest.getRequestedCapacityInMinutes());
        assertEquals(requestedResourceOrgId, resourceRequest.getProcessingResourceOrgId());
      }
    }

    @Nested
    @DisplayName("Unit Test for updateDbData method")
    class UpdateDbData {

      @Test
      @DisplayName("Check DB update call is done.")
      public void updateDbDataTest() {
        ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

        doReturn(mock(Result.class)).when(mockPersistenceService).run(any(CqnUpdate.class));

        cut.updateDbData(resourceRequest);

        verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));
      }

    }

    @Nested
    @DisplayName("Test fillValuesPassedByUser method")
    class FillValuesPassedByUser {

      @Test
      @DisplayName("Check fillValuesPassedByUser works as expected.")
      public void fillValuesPassedByUserPositive() {

        final resourcerequestservice.ResourceRequests userPassedValues = Struct
            .create(resourcerequestservice.ResourceRequests.class);
        userPassedValues.setId("id");
        userPassedValues.setDisplayId("displayID");
        userPassedValues.setStartDate(LocalDate.of(2020, 1, 1));
        userPassedValues.setEndDate(LocalDate.of(2020, 1, 1));
        userPassedValues.setRequiredEffort(BigDecimal.valueOf(10));

        final ResourceRequests expectedValues = Struct.create(ResourceRequests.class);

        cut.fillValuesPassedByUser(expectedValues, userPassedValues);

        assertEquals(expectedValues.getId(), userPassedValues.getId());
        assertEquals(expectedValues.getDisplayId(), userPassedValues.getDisplayId());
        assertEquals(expectedValues.getStartDate(), userPassedValues.getStartDate());
        assertEquals(expectedValues.getEndDate(), userPassedValues.getEndDate());
        assertEquals(expectedValues.getRequestedCapacity(), userPassedValues.getRequiredEffort());
      }
    }

    @Nested
    @DisplayName("Check Resource organization for resource request")
    class CheckResourceRequestResourceOrganization {

      private String RESOURCE_REQUEST_ID = "450a2453-ec0a-4a85-8247-94c39b9bd100";
      private String RESOURCE_ORGANIZATION_ID = "org_1";

      @Test
      @DisplayName("check if resource org returned for resource request id passed")
      public void checkExistingRequestedResourceOrganizationReturned() {

        final ResourceRequests resourceRequestExpected = Struct.create(ResourceRequests.class);
        resourceRequestExpected.setId(RESOURCE_REQUEST_ID);
        resourceRequestExpected.setRequestedResourceOrgId(RESOURCE_ORGANIZATION_ID);

        /* Mock Result object */
        final Result mockResult = mock(Result.class);

        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn((long) 1);
        when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequestExpected);

        final String requestedResourceOrgId = cut.getRequestedResourceOrgForResourceRequestID(RESOURCE_REQUEST_ID);

        assertEquals(requestedResourceOrgId, resourceRequestExpected.getRequestedResourceOrgId(),
            "Expected to return resoureRequest but failed to return");

      }
    }

    @Nested
    @DisplayName("Test for Update Reference Object Method")
    class UpdateReferenceObjectTest {

      @Test
      public void validateIfResetCalledWhenConditionMet() {
        ResourceRequestHelper spyOfCut = spy(cut);

        ResourceRequests mockDraftResourceRequest = Struct.create(ResourceRequests.class);
        mockDraftResourceRequest.setReferenceObjectTypeCode(1);

        ResourceRequests mockUpdatedResourceRequest = Struct.create(ResourceRequests.class);
        mockUpdatedResourceRequest.setReferenceObjectTypeCode(0);

        doReturn(mockDraftResourceRequest).when(spyOfCut)
            .selectDraftResourceRequest(mockUpdatedResourceRequest.getId());

        doNothing().when(spyOfCut).resetReferenceObject(mockUpdatedResourceRequest);

        spyOfCut.updateReferenceObject(mockUpdatedResourceRequest);
        verify(spyOfCut, times(1)).resetReferenceObject(mockUpdatedResourceRequest);
      }

      @Test
      public void validateIfResetNotCalledWhenConditionNotMet() {
        ResourceRequestHelper spyOfCut = spy(cut);

        ResourceRequests mockDraftResourceRequest = Struct.create(ResourceRequests.class);
        mockDraftResourceRequest.setReferenceObjectTypeCode(0);

        ResourceRequests mockUpdatedResourceRequest = Struct.create(ResourceRequests.class);
        mockUpdatedResourceRequest.setReferenceObjectTypeCode(1);

        doReturn(mockDraftResourceRequest).when(spyOfCut)
            .selectDraftResourceRequest(mockUpdatedResourceRequest.getId());

        doNothing().when(spyOfCut).resetReferenceObject(mockUpdatedResourceRequest);

        spyOfCut.updateReferenceObject(mockUpdatedResourceRequest);
        verify(spyOfCut, times(0)).resetReferenceObject(mockUpdatedResourceRequest);
      }
    }

    @Nested
    class ResetReferenceObjectTest {

      @Test
      public void validateResetReferenceObject() {
        ResourceRequestHelper spyOfCut = spy(cut);
        ResourceRequests mockResourceRequest = mock(ResourceRequests.class);

        doNothing().when(mockResourceRequest).setReferenceObjectId(null);

        spyOfCut.resetReferenceObject(mockResourceRequest);

        verify(mockResourceRequest, times(1)).setReferenceObjectId(null);
      }
    }

  @Nested
  class FillReferenceObjectTypeCodeTest {
      @Test
      @DisplayName("Validate when Ref Obj ID is valid")
      public void validateWhenIdNotNull() {
        ResourceRequestHelper spyOfCut = spy(cut);
        resourcerequestservice.ResourceRequests mockResourceRequest = mock(
            resourcerequestservice.ResourceRequests.class);

        doReturn("f776eb80-5b3a-4af9-ac42-79dc1a792ef3").when(mockResourceRequest).getReferenceObjectId();
        doReturn(1).when(spyOfCut).getReferenceObjectTypeCode(mockResourceRequest);
        doNothing().when(spyOfCut).updateReferenceObjectTypeCode(mockResourceRequest, 1);

        spyOfCut.fillReferenceObjectTypeCode(mockResourceRequest);

        verify(spyOfCut, times(1)).updateReferenceObjectTypeCode(mockResourceRequest, 1);
        verify(spyOfCut, times(1)).getReferenceObjectTypeCode(mockResourceRequest);
      }

      @Test
      @DisplayName("Validate when Ref Obj ID is null")
      public void validateWhenIdIsNull() {
        ResourceRequestHelper spyOfCut = spy(cut);
        resourcerequestservice.ResourceRequests mockResourceRequest = mock(
            resourcerequestservice.ResourceRequests.class);

        doReturn(null).when(mockResourceRequest).getReferenceObjectId();
        doNothing().when(spyOfCut).updateReferenceObjectTypeCode(mockResourceRequest, 0);

        spyOfCut.fillReferenceObjectTypeCode(mockResourceRequest);

        verify(spyOfCut, times(1)).updateReferenceObjectTypeCode(mockResourceRequest, 0);
      }
    }


    @Nested
    class GetReferenceObjectTypeCodeTest {
      @Test
      public void ValidateGetReferenceObjectTypeCode() {
        ResourceRequestHelper spyOfCut = spy(cut);

        ReferenceObjects mockReferenceObject = Struct.create(ReferenceObjects.class);
        mockReferenceObject.setTypeCode(1);

        Result mockResult = mock(Result.class);

        resourcerequestservice.ResourceRequests mockResourceRequest = mock(
            resourcerequestservice.ResourceRequests.class);

        when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.single(ReferenceObjects.class)).thenReturn(mockReferenceObject);

        Integer code = spyOfCut.getReferenceObjectTypeCode(mockResourceRequest);

        assertEquals(1, code);
        verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
        verify(mockResult, times(1)).single(ReferenceObjects.class);

    }
  }
    @Nested
    class UpdateReferenceObjectTypeCodeTest {
      @Test
      public void ValidateUpdateReferenceObjectTypeCode() {
        ResourceRequestHelper spyOfCut = spy(cut);

        Result mockResult = mock(Result.class);

        resourcerequestservice.ResourceRequests mockResourceRequest = mock(
            resourcerequestservice.ResourceRequests.class);

        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);

        spyOfCut.updateReferenceObjectTypeCode(mockResourceRequest, 1);

        verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));

      }
    }



    @Nested
    class FillResourceRequestDerivedValueOnUpdate {

      @Test
      public void testFillResourceRequestDerivedValues(){
          ResourceRequestHelper spyOfCut = spy(cut);
          resourcerequestservice.ResourceRequests mockRR = mock(resourcerequestservice.ResourceRequests.class);
          ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
          when(mockRR.getId()).thenReturn("mockUUID");
          doReturn(mockResourceRequest).when(spyOfCut).selectResourceRequest("mockUUID");
          mockRR.setStartDate(LocalDate.of(2023,1,1));
          mockRR.setEndDate(LocalDate.of(2023,2,1));
          mockRR.setRequiredEffort(BigDecimal.valueOf(300));
          doNothing().when(spyOfCut).updateDbData(mockResourceRequest);

          spyOfCut.fillResourceRequestDerivedValueOnUpdate(mockRR);

          verify(spyOfCut,times(1)).updateDbData(mockResourceRequest);

      }

    }

  }

