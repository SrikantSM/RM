package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.CdsData;
import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

public class ResourceRequestRepositoryTest {

  /*
   * Mock TransformS4ProjectToRM object setup
   *
   */
  private PersistenceService mockPersistenceService;

  /*
   * Class under test
   *
   */
  private static ResourceRequestRepository cut;

  @BeforeEach
  public void setUp() {

    mockPersistenceService = Mockito.mock(PersistenceService.class);
    cut = new ResourceRequestRepository(mockPersistenceService);
  }

  @Nested
  @DisplayName("Upsert ResourceRequests")
  class UpsertResourceRequests {

    private List<CdsData> resourceRequests = new ArrayList();

    /** Transaction manager successfully triggered for action CQN Upsert */
    @Test
    @DisplayName("Transaction manager successfully triggered for action CQN Upsert ")
    public void upsertActionTriggeredSuccessfully() {

      cut.upsertResourceRequests(resourceRequests);
      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    /**
     * When transaction manager fails to execute, ServiceException is thrown
     */
    @Test
    @DisplayName("When transaction manager fails to execute, ServiceException is thrown")
    public void whenUpsertResourceRequestFailsExceptionRaised() {

      ServiceException e = new ServiceException("Failed in upsertResourceRequests {}", resourceRequests);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.upsertResourceRequests(resourceRequests));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Upsert ResourceRequest")
  class UpsertResourceRequest {

    private ResourceRequests resourceRequest;

    /** Transaction manager successfully triggered for action CQN Upsert */
    @Test
    @DisplayName("Transaction manager successfully triggered for action CQN Upsert ")
    public void upsertActionTriggeredSuccessfully() {

      resourceRequest = ResourceRequests.create();

      cut.upsertResourceRequest(resourceRequest);
      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    /**
     * When transaction manager fails to execute, ServiceException is thrown
     */
    @Test
    @DisplayName("When transaction manager fails to execute, ServiceException is thrown")
    public void whenUpsertResourceRequestFailsExceptionRaised() {

      resourceRequest = ResourceRequests.create();
      ServiceException e = new ServiceException("Failed in upsertResourceRequest {}", resourceRequest);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.upsertResourceRequest(resourceRequest));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Remove CapacityRequirements Out of Range")
  class DeleteCapacityRequirements {

    private String resourceRequestId = null;
    private LocalDate startDate = null;
    private LocalDate endDate = null;

    @Test
    @DisplayName("Transaction manager successfully triggered for action CQN Delete ")
    public void deleteActionTriggeredSuccessfully() {

      cut.deleteCapacityRequirements(resourceRequestId, startDate, endDate);
      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("When transaction manager fails to execute, ServiceException is thrown")
    public void whenDeleteCapacityRequirementsFailsExceptionRaised() {

      ServiceException e = new ServiceException("Failed in deleteCapacityRequirements {}", resourceRequestId);
      doThrow(e).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.deleteCapacityRequirements(resourceRequestId, startDate, endDate));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Junits for selectCapacityRequirements method")
  class SelectCapacityRequirements {

    private String resourceRequestId = null;
    private CapacityRequirements capacityRequirement;

    @Test
    @DisplayName("Test for successful scenario")
    public void successfulSelectCapacityRequirementsList() {

      capacityRequirement = CapacityRequirements.create();
      List<CapacityRequirements> list = new ArrayList<>();
      list.add(capacityRequirement);
      final Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(CapacityRequirements.class)).thenReturn(list);
      List<CapacityRequirements> actualList = cut.selectCapacityRequirements(resourceRequestId);
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      assertEquals(list, actualList);
    }

    @Test
    @DisplayName("Test for exception scenario")
    public void exceptionThrownCapacityRequirementsList() {

      ServiceException e = new ServiceException("Failed in selectCapacityRequirements {}", resourceRequestId);
      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.selectCapacityRequirements(resourceRequestId));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));
    }
  }

  @Nested
  @DisplayName("Delete ResourceRequest")
  class DeleteResourceRequest {

    private String resourceRequestId = null;

    /** Transaction manager successfully triggered for action CQN Delete */
    @Test
    @DisplayName("Transaction manager successfully triggered for action CQN Delete ")
    public void deleteActionTriggeredSuccessfully() {

      cut.deleteResourceRequest(resourceRequestId);
      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    /**
     * When transaction manager fails to execute, ServiceException is thrown
     */
    @Test
    @DisplayName("When transaction manager fails to execute, ServiceException is thrown")
    public void whenDeleteResourceRequestFailsExceptionRaised() {

      ServiceException e = new ServiceException("Failed in deleteResourceRequest {}", resourceRequestId);
      doThrow(e).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.deleteResourceRequest(resourceRequestId));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Get resource request for demand")
  class selectResourceRequestForDemand {

    private String demandId = null;

    /** Get existing resource request for the demand */
    @Test
    @DisplayName("Get existing resource request for the demand ")
    public void getResourceRequestForDemandSuccessfull() {

      Result mockResult = mock(Result.class);
      ResourceRequests resourceRequest = ResourceRequests.create();
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 1);

      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);

      ResourceRequests resourceRequestReturned = cut.selectResourceRequestForDemand(demandId);
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      assertEquals(resourceRequestReturned, resourceRequest);

    }

    /** Null returned in case no resource request for demand */
    @Test
    @DisplayName("Null returned in case no  resource request for demand ")
    public void nullReturnedIfNoResourceRequestForDemand() {

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 0);

      ResourceRequests resourceRequestReturned = cut.selectResourceRequestForDemand(demandId);
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      assertEquals(null, resourceRequestReturned);

    }

    /**
     * When transaction manager fails to execute, ServiceException is thrown
     */
    @Test
    @DisplayName("When transaction manager fails to execute, ServiceException is thrown")
    public void whenGetResourceRequestFailsExceptionRaised() {

      ServiceException e = new ServiceException("Failed in selectResourceRequestForDemand {}", demandId);
      doThrow(e).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.selectResourceRequestForDemand(demandId));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit test for weekly distribution method")
  class WeeklyUpdatedCapacity {

    List<CapacityRequirements> originalCapacityRequirements = new ArrayList<>();
    List<CapacityRequirements> expectedCapacityRequirements;
    LocalDate resourceRequestStartDate;
    LocalDate resourceRequestEndDate;
    CapacityRequirements expectedCapacityRequirement1;
    CapacityRequirements expectedCapacityRequirement2;
    CapacityRequirements expectedCapacityRequirement3;
    CapacityRequirements expectedCapacityRequirement4;

    @BeforeEach
    public void setUpCapacityData() {
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 26), LocalDate.of(2021, 5, 30), 10));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 5, 31), LocalDate.of(2021, 6, 6), 10));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 7), LocalDate.of(2021, 6, 13), 10));
      originalCapacityRequirements.add(getCapacityData(LocalDate.of(2021, 6, 14), LocalDate.of(2021, 6, 18), 10));

      expectedCapacityRequirements = new ArrayList<>();

      expectedCapacityRequirement1 = getCapacityData(LocalDate.of(2021, 5, 26), LocalDate.of(2021, 5, 30), 10);
      expectedCapacityRequirement2 = getCapacityData(LocalDate.of(2021, 5, 31), LocalDate.of(2021, 6, 6), 10);
      expectedCapacityRequirement3 = getCapacityData(LocalDate.of(2021, 6, 7), LocalDate.of(2021, 6, 13), 10);
      expectedCapacityRequirement4 = getCapacityData(LocalDate.of(2021, 6, 14), LocalDate.of(2021, 6, 18), 10);
    }

    @Test
    @DisplayName("Testing date range completely outside original dates, before original.")
    public void otsideOriginalBeforeOriginal() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 10);
      resourceRequestEndDate = LocalDate.of(2021, 5, 18);
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range completely outside original dates, after original.")
    public void otsideOriginalAfterOriginal() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 24);
      resourceRequestEndDate = LocalDate.of(2021, 7, 3);
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    @Test
    @DisplayName("Testing date range shrink start date, same week")
    public void shrinkDateRangeStartSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 28);
      resourceRequestEndDate = LocalDate.of(2021, 6, 18);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range shrink start date, next week")
    public void shrinkDateRangeStartPreviousWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 2);
      resourceRequestEndDate = LocalDate.of(2021, 6, 18);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range shrink end date, same week")
    public void shrinkDateRangeEndSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 26);
      resourceRequestEndDate = LocalDate.of(2021, 6, 15);
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range shrink end date, previous week")
    public void shrinkDateRangeEndPreviousWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 26);
      resourceRequestEndDate = LocalDate.of(2021, 6, 10);
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range shrink both date, same week")
    public void shrinkDateRangeBothSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 28);
      resourceRequestEndDate = LocalDate.of(2021, 6, 15);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range shrink both date, different week")
    public void shrinkDateRangeBothDifferentWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 3);
      resourceRequestEndDate = LocalDate.of(2021, 6, 10);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range exapnd start date, same week")
    public void expandDateRangeStartSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 6, 18);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range exapnd start date, previous week")
    public void expandDateRangeStartNextWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 19);
      resourceRequestEndDate = LocalDate.of(2021, 6, 18);
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range expand end date, same week")
    public void expandDateRangeEndSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 26);
      resourceRequestEndDate = LocalDate.of(2021, 6, 19);
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range exapnd end date, next week")
    public void expandDateRangeEndNextWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 26);
      resourceRequestEndDate = LocalDate.of(2021, 6, 23);
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range expand both date, same week")
    public void expandDateRangeBothSameWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 25);
      resourceRequestEndDate = LocalDate.of(2021, 6, 19);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range expand both date, different week")
    public void expandDateRangeBothDifferentWeek() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 12);
      resourceRequestEndDate = LocalDate.of(2021, 6, 30);
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range change same week, start")
    public void dateRangeChangeSameWeekStart() {
      resourceRequestStartDate = LocalDate.of(2021, 5, 24);
      resourceRequestEndDate = LocalDate.of(2021, 5, 25);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
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
    @DisplayName("Testing date range change same week, end")
    public void dateRangeChangeSameWeekEnd() {
      resourceRequestStartDate = LocalDate.of(2021, 6, 18);
      resourceRequestEndDate = LocalDate.of(2021, 6, 19);
      Instant startTime = resourceRequestStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant endTime = resourceRequestEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<CapacityRequirements> updatedCapacityRequirements = cut.getUpdatedCapacityForWeeklyDistribution(
          originalCapacityRequirements, resourceRequestStartDate, resourceRequestEndDate);
      // Set expected Result
      expectedCapacityRequirement4.setStartDate(resourceRequestStartDate);
      expectedCapacityRequirement4.setStartTime(startTime);
      expectedCapacityRequirement4.setEndDate(resourceRequestEndDate);
      expectedCapacityRequirement4.setEndTime(endTime);
      expectedCapacityRequirements.add(expectedCapacityRequirement4);
      // Assertions
      assertEquals(expectedCapacityRequirements, updatedCapacityRequirements);
    }

    /*
     * Common method to get capacity data
     */

    private CapacityRequirements getCapacityData(LocalDate startDate, LocalDate endDate, int capacity) {
      CapacityRequirements capacityRequirement = CapacityRequirements.create();
      capacityRequirement.setStartDate(startDate);
      capacityRequirement.setStartTime(startDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      capacityRequirement.setEndDate(endDate);
      capacityRequirement
          .setEndTime(endDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
      capacityRequirement.setRequestedCapacity(new BigDecimal(capacity));
      capacityRequirement.setRequestedCapacityInMinutes(capacity * 60);

      return capacityRequirement;
    }

  }

}