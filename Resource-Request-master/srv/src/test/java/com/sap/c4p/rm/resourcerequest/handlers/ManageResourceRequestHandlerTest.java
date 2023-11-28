package com.sap.c4p.rm.resourcerequest.handlers;

import static com.sap.cds.ql.CQL.get;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Month;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.helpers.ResourceRequestHelper;
import com.sap.c4p.rm.resourcerequest.utils.Constants;
import com.sap.c4p.rm.resourcerequest.utils.DisplayIDGenerator;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import manageresourcerequestservice.*;

@DisplayName("Unit test for Resource Request Handler class")
public class ManageResourceRequestHandlerTest {

  /*
   * Class under test
   *
   */
  private static ManageResourceRequestHandler cut;

  /*
   * mock object
   *
   */
  private static PersistenceService mockPersistenceService;
  private static DraftService mockDraftService;
  private static ResourceRequestValidator mockResourceRequestValidator;
  private CapacityRequirementsHandler mockCapacityRequirementsHandler;
  private Messages messages;
  private ResourceRequestHelper mockResourceRequestHelper;
  private DisplayIDGenerator mockDisplayIDGenerator;
  // private CdsModel mockCdsModel;
  private CqnAnalyzerWrapper mockCqnAnalyzerWrapper;

  // CqnAnalyzer mockCqnAnalyzer;
  /*
   * Mock resource request object
   *
   */

  @BeforeEach
  public void setUp() {

    mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    // mockCqnAnalyzerWrapper = mock(CdsModel.class);
    mockPersistenceService = mock(PersistenceService.class);
    mockDraftService = mock(DraftService.class);
    mockCapacityRequirementsHandler = mock(CapacityRequirementsHandler.class);
    mockResourceRequestValidator = mock(ResourceRequestValidator.class);
    messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    mockResourceRequestHelper = mock(ResourceRequestHelper.class);
    mockDisplayIDGenerator = mock(DisplayIDGenerator.class);

    cut = new ManageResourceRequestHandler(mockCqnAnalyzerWrapper, mockPersistenceService, mockResourceRequestValidator,
        messages, mockResourceRequestHelper, mockDraftService, mockDisplayIDGenerator);
  }

  @Nested
  @DisplayName("Before Resource Request draft creation")
  class BeforeResourceRequestDraftCreationTest {
    @Test
    @DisplayName("Default values of resource request properties such as priority, publishing status, requested capacity")
    public void setDefaultPriorityOnDraftCreate() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDemandId("8f605bdc-e472-47b4-ab28-4590e33e798f");
      resourceRequest.setPriorityCode(null);
      resourceRequest.setRequestedCapacity(null);
      final Result mockResult = mock(Result.class);
      ManageResourceRequestHandler spy = spy(cut);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);
      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      spy.beforeResourceRequestDraftCreation(resourceRequests);

      assertAll(() -> assertEquals(Constants.REQUEST_PRIORITY_MEDIUM, resourceRequest.getPriorityCode()),
          () -> assertEquals(BigDecimal.valueOf(0), resourceRequest.getRequestedCapacity()),
          () -> assertEquals(Constants.REQUEST_WITHDRAW, resourceRequest.getReleaseStatusCode()));

    }

    @Test
    @DisplayName("Default values of resource request properties such as priority, publishing status")
    public void setDefaultPriorityOnDraftCreateWhenRequestedCapacityPassed() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDemandId("8f605bdc-e472-47b4-ab28-4590e33e798f");
      resourceRequest.setPriorityCode(null);
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10));
      ManageResourceRequestHandler spy = spy(cut);
      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      spy.beforeResourceRequestDraftCreation(resourceRequests);

      assertAll(() -> assertEquals(Constants.REQUEST_PRIORITY_MEDIUM, resourceRequest.getPriorityCode()),
          () -> assertEquals(BigDecimal.valueOf(10), resourceRequest.getRequestedCapacity()),
          () -> assertEquals(Constants.REQUEST_WITHDRAW, resourceRequest.getReleaseStatusCode()));

    }

    @Test
    @DisplayName("Check if workpackage and project Id is reset when demand id is passed as null")
    public void setProjectAndWorkPackageIdToNullOnDraftCreate() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDemandId(null);
      resourceRequest.setWorkpackageId("Wp-100");
      resourceRequest.setProjectId("Proj-100");

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      cut.beforeResourceRequestDraftCreation(resourceRequests);

      assertAll(() -> assertEquals(null, resourceRequest.getWorkpackageId()),
          () -> assertEquals(null, resourceRequest.getProjectId()));
    }
  }

  @Nested
  @DisplayName("Resource Request derived values test")
  class ResourceRequestDefaultValuesTest {

    @Test
    @DisplayName("Verify if resource request derived values are filled ")
    public void verifyResourceRequestDerivedValuesFilled() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequest.setRequestedResourceOrgId("Org100");
      resourceRequest.setStartDate(LocalDate.now());
      resourceRequest.setEndDate(LocalDate.now());

      cut.fillResourceRequestDerivedValues(resourceRequest);

      assertEquals(Constants.UOM, resourceRequest.getRequestedUnit());
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDerivedValues(resourceRequest);
    }

    @Test
    @DisplayName("Verify if resource request derived values throws exception if requested capacity is not passed")
    public void verifyResourceRequestDerivedValuesNullRequestedEffortCheck() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

      resourceRequest.setRequestedResourceOrgId("Org100");
      resourceRequest.setStartDate(LocalDate.now());
      resourceRequest.setEndDate(LocalDate.now());

      cut.fillResourceRequestDerivedValues(resourceRequest);

      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
      verify(mockResourceRequestHelper, times(0)).fillResourceRequestDerivedValues(resourceRequest);

    }

    @Test
    @DisplayName("Verify if resource request derived values throws exception if start date is not passed")

    public void verifyResourceRequestDerivedValuesNullStartDateCheck() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequest.setRequestedResourceOrgId("Org100");
      resourceRequest.setEndDate(LocalDate.now());

      cut.fillResourceRequestDerivedValues(resourceRequest);

      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
      verify(mockResourceRequestHelper, times(0)).fillResourceRequestDerivedValues(resourceRequest);

    }

    @Test
    @DisplayName("Verify if resource request derived values throws exception if  end date is not passed")
    public void verifyResourceRequestDerivedValuesNullEndDateCheck() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequest.setRequestedResourceOrgId("Org100");
      resourceRequest.setStartDate(LocalDate.now());

      cut.fillResourceRequestDerivedValues(resourceRequest);

      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
      verify(mockResourceRequestHelper, times(0)).fillResourceRequestDerivedValues(resourceRequest);

    }

    @Test
    @DisplayName("Verify if resource request derived values throws exception if RequestedResourceOrgId is not passed")
    public void verifyResourceRequestDerivedValuesNullRequestedResourceOrgIdCheck() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequest.setStartDate(LocalDate.now());
      resourceRequest.setEndDate(LocalDate.now());

      cut.fillResourceRequestDerivedValues(resourceRequest);

      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
      verify(mockResourceRequestHelper, times(0)).fillResourceRequestDerivedValues(resourceRequest);
      verify(mockResourceRequestHelper, times(0)).fillResourceRequestDerivedValues(resourceRequest);

    }

  }

  @Nested
  @DisplayName("Unit Test for adjustCapacitiesForResourceRequest method")
  class AdjustCapacitiesForResourceRequest {

    LocalDate updatedRRStartDate = LocalDate.of(2019, 04, 01);
    LocalDate updatedRREndDate = LocalDate.of(2019, 06, 01);
    LocalDate persistedRRStartDate = LocalDate.of(2019, 01, 01);
    LocalDate persistedRREndDate = LocalDate.of(2019, 12, 31);
    private String resourceRequestID = "resreq1";

    private ResourceRequests mockPersistedResourceRequest, mockResourceRequest;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);
      mockResourceRequest = ResourceRequests.create();
      mockResourceRequest.setId(resourceRequestID);
      mockResourceRequest.setStartDate(updatedRRStartDate);
      mockResourceRequest.setEndDate(updatedRREndDate);

      mockPersistedResourceRequest = ResourceRequests.create();
      mockPersistedResourceRequest.setId(resourceRequestID);
      mockPersistedResourceRequest.setStartDate(persistedRRStartDate);
      mockPersistedResourceRequest.setEndDate(persistedRREndDate);

    }

    @Test
    @DisplayName("Adjust capacities when updated resource request start date and end date are changed")
    void whenDatesAreChanged() {

      updatedRRStartDate = LocalDate.of(2020, 01, 01);

      updatedRREndDate = LocalDate.of(2020, 12, 31);

      mockResourceRequest.setStartDate(updatedRRStartDate);
      mockResourceRequest.setEndDate(updatedRREndDate);
      mockResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doNothing().when(spy).changeResourceRequestDates(updatedRRStartDate, updatedRREndDate, mockResourceRequest);
      doReturn(mockPersistedResourceRequest).when(mockResourceRequestHelper).selectResourceRequest(resourceRequestID);
      spy.adjustCapacitiesForResourceRequest(mockResourceRequest);
      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(resourceRequestID);
      verify(spy, times(1)).changeResourceRequestDates(updatedRRStartDate, updatedRREndDate, mockResourceRequest);

    }
  }

  @Nested
  @DisplayName("Unit Test for adjustCapacitiesForDraftResourceRequest method")
  class AdjustCapacitiesForDraftResourceRequest {

    LocalDate updatedRRStartDate = LocalDate.of(2019, 04, 01);
    LocalDate updatedRREndDate = LocalDate.of(2019, 06, 01);
    LocalDate draftRRStartDate = LocalDate.of(2019, 01, 01);
    LocalDate draftRREndDate = LocalDate.of(2019, 12, 31);
    private String resourceRequestID = "resreq1";

    private ResourceRequests mockDraftResourceRequest, mockResourceRequest;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);
      mockResourceRequest = ResourceRequests.create();
      mockResourceRequest.setId(resourceRequestID);
      mockResourceRequest.setStartDate(updatedRRStartDate);
      mockResourceRequest.setEndDate(updatedRREndDate);

      mockDraftResourceRequest = ResourceRequests.create();
      mockDraftResourceRequest.setId(resourceRequestID);
      mockDraftResourceRequest.setStartDate(draftRRStartDate);
      mockDraftResourceRequest.setEndDate(draftRREndDate);

    }

    @Test
    @DisplayName("Adjust capacities when both start date and end date are changed in draft")
    void whenDatesAreChanged() {

      updatedRRStartDate = LocalDate.of(2020, 01, 01);

      updatedRREndDate = LocalDate.of(2020, 12, 31);

      mockResourceRequest.setStartDate(updatedRRStartDate);
      mockResourceRequest.setEndDate(updatedRREndDate);
      mockResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doNothing().when(spy).changeResourceRequestDraftDates(updatedRRStartDate, updatedRREndDate, mockResourceRequest,
          mockDraftResourceRequest);
      doReturn(mockDraftResourceRequest).when(mockResourceRequestHelper).selectDraftResourceRequest(resourceRequestID);
      spy.adjustCapacitiesForDraftResourceRequest(mockResourceRequest);
      verify(mockResourceRequestHelper, times(1)).selectDraftResourceRequest(resourceRequestID);
      verify(spy, times(1)).changeResourceRequestDraftDates(updatedRRStartDate, updatedRREndDate, mockResourceRequest,
          mockDraftResourceRequest);
      assertEquals(mockResourceRequest.getStartDate(), updatedRRStartDate);
      assertEquals(mockResourceRequest.getEndDate(), updatedRREndDate);

    }

    @Test
    @DisplayName("Do not adjust capacity when there are no dates in draft")
    void whenDraftedDatesAreNull() {

      draftRRStartDate = null;
      draftRREndDate = null;
      mockDraftResourceRequest.setStartDate(draftRRStartDate);
      mockDraftResourceRequest.setEndDate(draftRREndDate);

      mockResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doReturn(mockDraftResourceRequest).when(mockResourceRequestHelper).selectDraftResourceRequest(resourceRequestID);
      spy.adjustCapacitiesForDraftResourceRequest(mockResourceRequest);
      verify(mockResourceRequestHelper, times(1)).selectDraftResourceRequest(resourceRequestID);
      verify(spy, times(0)).changeResourceRequestDraftDates(updatedRRStartDate, updatedRREndDate, mockResourceRequest,
          mockDraftResourceRequest);

    }

    @Test
    @DisplayName("Adjust capacities when only start date is changed in draft")
    void whenOnlyStartDateIsChanged() {

      updatedRRStartDate = LocalDate.of(2020, 01, 01);
      updatedRREndDate = null;

      mockResourceRequest.setStartDate(updatedRRStartDate);
      mockResourceRequest.setEndDate(updatedRREndDate);

      mockResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doReturn(mockDraftResourceRequest).when(mockResourceRequestHelper).selectDraftResourceRequest(resourceRequestID);
      doNothing().when(spy).changeResourceRequestDraftDates(any(LocalDate.class), any(LocalDate.class),
          any(ResourceRequests.class), any(ResourceRequests.class));
      spy.adjustCapacitiesForDraftResourceRequest(mockResourceRequest);
      verify(mockResourceRequestHelper, times(1)).selectDraftResourceRequest(resourceRequestID);
      verify(spy, times(1)).changeResourceRequestDraftDates(any(LocalDate.class), any(LocalDate.class),
          any(ResourceRequests.class), any(ResourceRequests.class));
      assertEquals(mockResourceRequest.getStartDate(), updatedRRStartDate);
      assertEquals(mockResourceRequest.getEndDate(), mockDraftResourceRequest.getEndDate());
    }

    @Test
    @DisplayName("Adjust capacities when only end date is changed in draft")
    void whenOnlyEndDateIsChanged() {

      updatedRRStartDate = null;
      updatedRREndDate = LocalDate.of(2020, 12, 31);

      mockResourceRequest.setStartDate(updatedRRStartDate);
      mockResourceRequest.setEndDate(updatedRREndDate);

      mockResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doReturn(mockDraftResourceRequest).when(mockResourceRequestHelper).selectDraftResourceRequest(resourceRequestID);
      doNothing().when(spy).changeResourceRequestDraftDates(any(), any(), any(), any());
      spy.adjustCapacitiesForDraftResourceRequest(mockResourceRequest);
      verify(mockResourceRequestHelper, times(1)).selectDraftResourceRequest(resourceRequestID);
      verify(spy, times(1)).changeResourceRequestDraftDates(any(), any(), any(), any());
      assertEquals(mockResourceRequest.getStartDate(), mockDraftResourceRequest.getStartDate());
      assertEquals(mockResourceRequest.getEndDate(), updatedRREndDate);
    }

  }

  @Nested
  @DisplayName("Unit Test for selectDraftResourceRequestCapacities method")
  class selectDraftResourceRequestCapacities {

    @Mock
    ResourceRequests mockResourceRequest;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);

    }

    @Test
    @DisplayName("Draft resource request capacties exists for the given resource request id")
    public void draftResourceRequestCapacitiesExist() {
      LocalDate startDate = LocalDate.of(2019, 05, 31);
      LocalDate endDate = LocalDate.of(2019, 05, 31);
      /*
       * Stub create to test method
       */
      ResourceRequests resourceRequest = ResourceRequests.create();
      resourceRequest.setId("resreqId");
      List<ResourceRequestCapacities> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequestCapacities capacityRequirement1 = ResourceRequestCapacities.create();

      capacityRequirement1.setStartDate(startDate);
      capacityRequirement1.setEndDate(endDate);

      mockCapacityRequirementsList.add(capacityRequirement1);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      List<ResourceRequestCapacities> mockCapacityRequirementsLisExpected = new ArrayList<>();
      mockCapacityRequirementsLisExpected.add(capacityRequirement1);

      final Result mockResult = mock(Result.class);

      when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.listOf(ResourceRequestCapacities.class)).thenReturn(mockCapacityRequirementsList);

      List<ResourceRequestCapacities> actualDraftCapacities = cut
          .selectDraftResourceRequestCapacitiesWithDates(resourceRequest.getId(), startDate, endDate);
      assertEquals(mockCapacityRequirementsLisExpected, actualDraftCapacities);

    }

    @Test
    @DisplayName("Draft resource request capacties does not exists for the given resource request id")
    public void draftResourceRequestCapacitiesNotExist() {
      LocalDate startDate = LocalDate.of(2019, 05, 31);
      LocalDate endDate = LocalDate.of(2019, 05, 31);
      /*
       * Stub create to test method
       */
      ResourceRequests resourceRequest = ResourceRequests.create();
      resourceRequest.setId("resreqId");
      List<ResourceRequestCapacities> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequestCapacities capacityRequirement1 = ResourceRequestCapacities.create();

      capacityRequirement1.setStartDate(startDate);
      capacityRequirement1.setEndDate(endDate);

      mockCapacityRequirementsList.add(capacityRequirement1);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      List<ResourceRequestCapacities> mockCapacityRequirementsLisExpected = null;

      final Result mockResult = mock(Result.class);

      when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.listOf(ResourceRequestCapacities.class)).thenReturn(null);

      List<ResourceRequestCapacities> actualDraftCapacities = cut
          .selectDraftResourceRequestCapacitiesWithDates(resourceRequest.getId(), startDate, endDate);
      assertEquals(mockCapacityRequirementsLisExpected, actualDraftCapacities);

    }
  }

  @Nested
  @DisplayName("Unit Test for changeResourceRequestDates method")
  class ChangeResourceRequestDates {
    LocalDate updatedRRStartDate, updatedRREndDate;
    Instant updatedRRStartTime, updatedRREndTime;

    @Mock
    ResourceRequests mockResourceRequest;

    @Mock
    List<ResourceRequestCapacities> mockCapacityRequirements;

    @Mock
    ResourceRequestCapacities mockCapacityRequirement;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);

    }

    /**
     * If start date is changed and effort distribution type is daily hrs
     */
    @Test
    @DisplayName("When updated resource request start date is changed and ED type is Daily hours")
    void whenUpdatedRRStartDateChangedAndTypeIsDailyHrs() {

      List<ResourceRequestCapacities> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      ResourceRequestCapacities capacityRequirement1 = ResourceRequestCapacities.create();
      ResourceRequestCapacities capacityRequirement2 = ResourceRequestCapacities.create();
      ResourceRequestCapacities capacityRequirement3 = ResourceRequestCapacities.create();

      capacityRequirement1.setStartDate(LocalDate.of(2019, 05, 31));
      capacityRequirement2.setStartDate(LocalDate.of(2019, 06, 03));
      capacityRequirement3.setStartDate(LocalDate.of(2019, 06, 04));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      updatedRRStartDate = LocalDate.of(2019, 06, 01);
      updatedRREndDate = LocalDate.of(2019, 12, 31);
      updatedRRStartTime = updatedRRStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doNothing().when(mockResourceRequestHelper).calculateAndResetCapacityInResourceRequest(any(), any());
      spy.changeResourceRequestDates(updatedRRStartDate, updatedRREndDate, resourceRequest);
      verify(mockResourceRequestHelper, times(1)).calculateAndResetCapacityInResourceRequest(any(), any());
      assertEquals(2, resourceRequest.getCapacityRequirements().size());
    }

    /**
     * If start date is changed and effort distribution type is weekly hrs
     */
    @Test
    @DisplayName("When updated resource request start date is changed and ED type is Weekly hours")
    void whenUpdatedRRStartDateChangedAndTypeIsWeeklyHrs() {

      ResourceRequests resourceRequest = ResourceRequests.create();
      resourceRequest.setEffortDistributionTypeCode(Constants.WEEKLY_HOURS);

      updatedRRStartDate = LocalDate.of(2019, 06, 01);
      updatedRREndDate = LocalDate.of(2019, 12, 31);

      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doNothing().when(mockResourceRequestHelper).calculateAndResetCapacityInResourceRequest(any(), any());
      spy.changeResourceRequestDates(updatedRRStartDate, updatedRREndDate, resourceRequest);
      verify(mockResourceRequestHelper, times(1)).getUpdatedCapacityForWeeklyDistribution(any(), any(), any(), any(),
          any());
      verify(mockResourceRequestHelper, times(1)).calculateAndResetCapacityInResourceRequest(any(), any());
    }

    /**
     * If end date is changed and effort distribution type is daily hrs
     */
    @Test
    @DisplayName("When updated resource request end date is changed and ED type is Daily hours")
    void whenUpdatedRREndDateChangedAndTypeIsDailyHrs() {

      List<ResourceRequestCapacities> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      ResourceRequestCapacities capacityRequirement1 = ResourceRequestCapacities.create();
      ResourceRequestCapacities capacityRequirement2 = ResourceRequestCapacities.create();
      ResourceRequestCapacities capacityRequirement3 = ResourceRequestCapacities.create();

      capacityRequirement1.setStartDate(LocalDate.of(2019, 05, 31));
      capacityRequirement2.setStartDate(LocalDate.of(2019, 07, 03));
      capacityRequirement3.setStartDate(LocalDate.of(2019, 07, 04));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      updatedRRStartDate = LocalDate.of(2019, 01, 01);
      updatedRREndDate = LocalDate.of(2019, 06, 30);
      updatedRREndTime = updatedRREndDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doNothing().when(mockResourceRequestHelper).calculateAndResetCapacityInResourceRequest(any(), any());
      spy.changeResourceRequestDates(updatedRRStartDate, updatedRREndDate, resourceRequest);
      verify(mockResourceRequestHelper, times(1)).calculateAndResetCapacityInResourceRequest(any(), any());
      assertEquals(1, resourceRequest.getCapacityRequirements().size());
    }

    /**
     * If start date and end dates are changed and effort distribution type is daily
     * hrs
     */
    @Test
    @DisplayName("When updated resource request start date and end date is changed and ED type is Daily hours")
    void whenUpdatedRRStartAndEndDateChangedAndTypeIsDailyHrs() {

      List<ResourceRequestCapacities> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      ResourceRequestCapacities capacityRequirement1 = ResourceRequestCapacities.create();
      ResourceRequestCapacities capacityRequirement2 = ResourceRequestCapacities.create();
      ResourceRequestCapacities capacityRequirement3 = ResourceRequestCapacities.create();

      capacityRequirement1.setStartDate(LocalDate.of(2019, 01, 01));
      capacityRequirement2.setStartDate(LocalDate.of(2019, 03, 30));
      capacityRequirement3.setStartDate(LocalDate.of(2019, 07, 04));

      capacityRequirement1.setEndDate(LocalDate.of(2019, 01, 01));
      capacityRequirement2.setEndDate(LocalDate.of(2019, 03, 30));
      capacityRequirement3.setEndDate(LocalDate.of(2019, 07, 04));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      updatedRRStartDate = LocalDate.of(2019, 02, 01);
      updatedRREndDate = LocalDate.of(2019, 06, 30);
      updatedRRStartTime = updatedRRStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      updatedRREndTime = updatedRREndDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doNothing().when(mockResourceRequestHelper).calculateAndResetCapacityInResourceRequest(any(), any());
      spy.changeResourceRequestDates(updatedRRStartDate, updatedRREndDate, resourceRequest);
      verify(mockResourceRequestHelper, times(1)).calculateAndResetCapacityInResourceRequest(any(), any());
      assertEquals(1, resourceRequest.getCapacityRequirements().size());
    }
  }

  @Nested
  @DisplayName("Unit Test for changeResourceRequestDraftDates method")
  class ChangeResourceRequestDraftDates {
    LocalDate updatedRRStartDate, updatedRREndDate;
    Instant updatedRRStartTime, updatedRREndTime;

    @Mock
    ResourceRequests mockResourceRequest;

    @Mock
    List<ResourceRequestCapacities> mockCapacityRequirements;

    @Mock
    ResourceRequestCapacities mockCapacityRequirement;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);

    }

    /**
     * If start date and end dates are changed and effort distribution type is daily
     * hrs
     */
    @Test
    @DisplayName("Change resource request draft dates when start date and end date is changed and effort distribution is daily hours")
    void whenUpdatedRRStartAndEndDateChangedAndTypeIsDailyHrs() {

      List<ResourceRequestCapacities> mockCapacityRequirementsList = new ArrayList<>();
      ResourceRequestCapacities capacityRequirement1 = ResourceRequestCapacities.create();
      capacityRequirement1.setRequestedCapacity(BigDecimal.valueOf(10));
      mockCapacityRequirementsList.add(capacityRequirement1);

      ResourceRequests resourceRequest = ResourceRequests.create();
      ResourceRequests draftResourceRequest = ResourceRequests.create();
      draftResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);

      updatedRRStartDate = LocalDate.of(2019, 02, 01);
      updatedRREndDate = LocalDate.of(2019, 02, 01);
      updatedRRStartTime = updatedRRStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      updatedRREndTime = updatedRREndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doReturn(mockCapacityRequirementsList).when(spy).selectDraftResourceRequestCapacitiesWithDates(any(), any(),
          any());
      doNothing().when(mockResourceRequestHelper).calculateAndResetCapacityInResourceRequest(any(), any());
      spy.changeResourceRequestDraftDates(updatedRRStartDate, updatedRREndDate, resourceRequest, draftResourceRequest);
      verify(spy, times(1)).selectDraftResourceRequestCapacitiesWithDates(any(), any(), any());
      verify(mockResourceRequestHelper, times(0)).getUpdatedCapacityForWeeklyDistribution(any(), any(), any(), any(),
          any());
      verify(mockResourceRequestHelper, times(1)).calculateAndResetCapacityInResourceRequest(any(), any());
    }

    /**
     * If start date and end dates are changed and effort distribution type is
     * weekly hrs
     */
    @Test
    @DisplayName("Change resource request draft dates when start date and end date is changed and effort distribution is weekly hours")
    void whenUpdatedRRStartAndEndDateChangedAndTypeIsWeeklyHrs() {

      List<ResourceRequestCapacities> mockCapacityRequirementsList = new ArrayList<>();
      ResourceRequestCapacities capacityRequirement1 = ResourceRequestCapacities.create();
      capacityRequirement1.setRequestedCapacity(BigDecimal.valueOf(10));
      mockCapacityRequirementsList.add(capacityRequirement1);

      ResourceRequests resourceRequest = ResourceRequests.create();
      ResourceRequests draftResourceRequest = ResourceRequests.create();
      draftResourceRequest.setEffortDistributionTypeCode(Constants.WEEKLY_HOURS);

      updatedRRStartDate = LocalDate.of(2019, 02, 01);
      updatedRREndDate = LocalDate.of(2019, 02, 01);
      updatedRRStartTime = updatedRRStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      updatedRREndTime = updatedRREndDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      doNothing().when(mockResourceRequestHelper).calculateAndResetCapacityInResourceRequest(any(), any());
      spy.changeResourceRequestDraftDates(updatedRRStartDate, updatedRREndDate, resourceRequest, draftResourceRequest);
      verify(spy, times(0)).selectDraftResourceRequestCapacitiesWithDates(any(), any(), any());
      verify(mockResourceRequestHelper, times(1)).getUpdatedCapacityForWeeklyDistribution(any(), any(), any(), any(),
          any());
      verify(mockResourceRequestHelper, times(1)).selectDraftResourceRequestCapacities(any());
      verify(mockResourceRequestHelper, times(1)).calculateAndResetCapacityInResourceRequest(any(), any());
    }

    /**
     * If start date and end dates are changed and effort distribution type is total
     * hrs
     */
    @Test
    @DisplayName("Change resource request draft dates when start date and end date is changed and effort distribution is total hours")
    void whenUpdatedRRStartAndEndDateChangedAndTypeIsTotalHrs() {

      ResourceRequests resourceRequest = ResourceRequests.create();
      ResourceRequests draftResourceRequest = ResourceRequests.create();
      draftResourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);

      updatedRRStartDate = LocalDate.of(2019, 02, 01);
      updatedRREndDate = LocalDate.of(2019, 06, 30);
      updatedRRStartTime = updatedRRStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      updatedRREndTime = updatedRREndDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      spy.changeResourceRequestDraftDates(updatedRRStartDate, updatedRREndDate, resourceRequest, draftResourceRequest);
      verify(spy, times(0)).selectDraftResourceRequestCapacitiesWithDates(any(), any(), any());
      verify(mockResourceRequestHelper, times(0)).getUpdatedCapacityForWeeklyDistribution(any(), any(), any(), any(),
          any());
      verify(mockResourceRequestHelper, times(0)).calculateAndResetCapacityInResourceRequest(any(), any());
    }
  }

  @Nested
  @DisplayName("Unit Test for Handlers method")
  public class WhenHandlers {

    private ResourceRequests resourceRequest;
    private Demands demand;
    private String RESOURCE_REQUEST_ID = "450a2453-ec0a-4a85-8247-94c39b9bdd67";

    @BeforeEach
    public void setUpResourceRequest() {

      resourceRequest = Struct.create(ResourceRequests.class);

      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(1000));
      resourceRequest.setDemandId("8f605bdc-e472-47b4-ab28-4590e33e798f");
      resourceRequest.setStartDate(LocalDate.of(2019, Month.JANUARY, 01));
      resourceRequest.setEndDate(LocalDate.of(2019, Month.DECEMBER, 30));
      resourceRequest.setId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
      resourceRequest.setRequestedResourceOrgId("Org100");

      demand = Struct.create(Demands.class);
    }

    @Test
    @DisplayName("Testing Before Create Event Handler of Resource Request")
    public void beforeResourceRequestCreate() {

      /* Mock Result object */
      Result mockResult = mock(Result.class);
      CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> userCostCenters = new ArrayList<>();
      userCostCenters.add("CCIN");

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(true);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedCostCenter")).thenReturn(userCostCenters);

      cut.beforeResourceRequestCreate(resourceRequest, mockContext);

      verify(mockResourceRequestValidator, times(1)).isUserAuthorizedForTheAction(any(), any());

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateResourceRequestProperty(resourceRequest);
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDerivedValues(resourceRequest);
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDefaultValues(resourceRequest);
      verify(messages, times(0)).error(MessageKeys.NOT_AUTHORIZED_TO_CREATE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(1)).throwIfError();

      assertAll("Resource Request after Before Create Event",
          () -> assertEquals("duration-hour", resourceRequest.getRequestedUnit(), "UOM is incorrect"),
          () -> assertEquals("450a2453-ec0a-4a85-8247-94c39b9bdd67", resourceRequest.getId(),
              "Resource Request ID is incorrect"),
          () -> assertEquals(LocalDate.of(2019, Month.JANUARY, 01), resourceRequest.getStartDate(),
              "Start Date of resource request is incorrect"),
          () -> assertEquals(LocalDate.of(2019, Month.DECEMBER, 30), resourceRequest.getEndDate(),
              "End Date of resource request is incorrect"),
          () -> assertEquals("8f605bdc-e472-47b4-ab28-4590e33e798f", resourceRequest.getDemandId(),
              "Demand ID of resource request is incorrect"),
          () -> assertEquals("Org100", resourceRequest.getRequestedResourceOrgId(),
              "Requested Resource Organization of Resource Request is not set"));
    }

    @Test
    @DisplayName("Authorization : Exception is Thrown When User Tries to Create Resource Request For Which he not Authorized")
    public void unAuthorizedUserFailsToCreateResourceRequest() {

      /* Mock Result object */
      Result mockResult = mock(Result.class);
      CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("RORG1");
        }
      };

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(false);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedResourceOrganization")).thenReturn(resOrgs);

      cut.beforeResourceRequestCreate(resourceRequest, mockContext);

      verify(messages, times(1)).error(MessageKeys.NOT_AUTHORIZED_TO_CREATE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(2)).throwIfError();
    }

    @Test
    @DisplayName("Authorization : Validate the authorization check is skipped if the requestedResourceOrganization is empty")
    public void emptyResourceOrgDoesNotTriggerAuthValidationInCreate() {

      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedResourceOrgId("");
      /* Mock Result object */
      Result mockResult = mock(Result.class);
      CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> userCostCenters = new ArrayList<>();
      userCostCenters.add("CCIN");

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(false);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedCostCenter")).thenReturn(userCostCenters);

      cut.beforeResourceRequestCreate(resourceRequest, mockContext);

      verify(messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Testing Before Update Event Handler of Resource Request")
    public void beforeResourceRequestUpdate() {

      /* Mock Result object */
      Result mockResult = mock(Result.class);
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> userCostCenters = new ArrayList<>();
      userCostCenters.add("CCIN");
      final ManageResourceRequestHandler spy = Mockito.spy(cut);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(true);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedCostCenter")).thenReturn(userCostCenters);
      doNothing().when(spy).adjustCapacitiesForResourceRequest(resourceRequest);
      doNothing().when(mockResourceRequestValidator).validateRRDateChange(resourceRequest);
      spy.beforeResourceRequestUpdate(resourceRequest, mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).isUserAuthorizedForTheAction(any(), any());
      verify(mockResourceRequestValidator, times(1)).checkResourceRequestDeleteUpdate(resourceRequest.getId(),
          CqnService.EVENT_UPDATE);
      verify(mockResourceRequestValidator, times(1)).validateResourceRequestProperty(resourceRequest);
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDerivedValues(resourceRequest);
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDefaultValuesWhenUpdate(resourceRequest);
      verify(messages, times(0)).error(MessageKeys.NOT_AUTHORIZED_TO_UPDATE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(1)).throwIfError();
      verify(mockResourceRequestValidator,times(1)).validateRRDateChange(resourceRequest);

      assertAll("Resource Request after Before Update Event",
          () -> assertEquals("450a2453-ec0a-4a85-8247-94c39b9bdd67", resourceRequest.getId(),
              "Resource Request ID is incorrect"),
          () -> assertEquals(LocalDate.of(2019, Month.JANUARY, 01), resourceRequest.getStartDate(),
              "Start Date of resource request is incorrect"),
          () -> assertEquals(LocalDate.of(2019, Month.DECEMBER, 30), resourceRequest.getEndDate(),
              "End Date of resource request is incorrect"),
          () -> assertEquals("8f605bdc-e472-47b4-ab28-4590e33e798f", resourceRequest.getDemandId(),
              "Demand ID of resource request is incorrect"),
          () -> assertEquals("Org100", resourceRequest.getRequestedResourceOrgId(),
              "Requested Resource Organization of Resource Request is not set"));

    }

    @Test
    @DisplayName("Authorization : Exception is Thrown When User Tries to Update Resource Request For Which he not Authorized")
    public void unAuthorizedUserFailsToUpdateResourceRequest() {

      /* Mock Result object */
      Result mockResult = mock(Result.class);
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("RORG1");
        }
      };

      final ManageResourceRequestHandler spy = Mockito.spy(cut);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(false);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedResourceOrganization")).thenReturn(resOrgs);

      doNothing().when(spy).adjustCapacitiesForResourceRequest(resourceRequest);
      spy.beforeResourceRequestUpdate(resourceRequest, mockContext);

      verify(messages, times(1)).error(MessageKeys.NOT_AUTHORIZED_TO_UPDATE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(2)).throwIfError();
    }

    @Test
    @DisplayName("Authorization : Validate the authorization check is skipped if the requestedResourceOrganization is null in update")
    public void emptyResourceOrgDoesNotTriggerAuthValidationInUpdate() {

      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedResourceOrgId(null);

      /* Mock Result object */
      Result mockResult = mock(Result.class);
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> userCostCenters = new ArrayList<>();
      userCostCenters.add("CCIN");
      final ManageResourceRequestHandler spy = Mockito.spy(cut);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(true);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedCostCenter")).thenReturn(userCostCenters);
      doNothing().when(spy).adjustCapacitiesForResourceRequest(resourceRequest);

      spy.beforeResourceRequestUpdate(resourceRequest, mockContext);

      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
      verify(messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Verify capacity requirement is not adjusted when start date is null")
    public void VerifyCapacityNotAdjustedWhenStartDateIsNull() {

      resourceRequest.setStartDate(null);

      /* Mock Result object */
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("Org100");
        }
      };
      final ManageResourceRequestHandler spy = Mockito.spy(cut);

      doReturn(mockUserInfo).when(mockContext).getUserInfo();
      doReturn(resOrgs).when(mockUserInfo).getAttributeValues("RequestedResourceOrganization");
      doReturn(true).when(mockResourceRequestValidator).isUserAuthorizedForTheAction(any(), any());
      doNothing().when(mockResourceRequestValidator).checkResourceRequestDeleteUpdate(any(), any());
      doNothing().when(mockResourceRequestHelper).fillResourceRequestDefaultValuesWhenUpdate(any());
      doNothing().when(mockResourceRequestValidator).validateResourceRequestProperty(any());
      doNothing().when(spy).fillResourceRequestDerivedValues(any());
      doNothing().when(spy).adjustCapacitiesForResourceRequest(resourceRequest);

      spy.beforeResourceRequestUpdate(resourceRequest, mockContext);

      verify(mockContext, times(1)).getUserInfo();
      verify(mockUserInfo, times(1)).getAttributeValues("RequestedResourceOrganization");
      verify(mockResourceRequestValidator, times(1)).isUserAuthorizedForTheAction(any(), any());
      verify(mockResourceRequestValidator, times(1)).checkResourceRequestDeleteUpdate(any(), any());
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDefaultValuesWhenUpdate(any());
      verify(mockResourceRequestValidator, times(1)).validateResourceRequestProperty(any());
      verify(spy, times(1)).fillResourceRequestDerivedValues(any());
      verify(spy, times(0)).adjustCapacitiesForResourceRequest(resourceRequest);

      verify(messages, times(0)).error(MessageKeys.NOT_AUTHORIZED_TO_UPDATE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Verify capacity requirement is not adjusted when end date is null")
    public void VerifyCapacityNotAdjustedWhenEndDateIsNull() {

      resourceRequest.setEndDate(null);

      /* Mock Result object */
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("Org100");
        }
      };
      final ManageResourceRequestHandler spy = Mockito.spy(cut);

      doReturn(mockUserInfo).when(mockContext).getUserInfo();
      doReturn(resOrgs).when(mockUserInfo).getAttributeValues("RequestedResourceOrganization");
      doReturn(true).when(mockResourceRequestValidator).isUserAuthorizedForTheAction(any(), any());
      doNothing().when(mockResourceRequestValidator).checkResourceRequestDeleteUpdate(any(), any());
      doNothing().when(mockResourceRequestHelper).fillResourceRequestDefaultValues(any());
      doNothing().when(mockResourceRequestValidator).validateResourceRequestProperty(any());
      doNothing().when(spy).fillResourceRequestDerivedValues(any());
      doNothing().when(spy).adjustCapacitiesForResourceRequest(resourceRequest);

      spy.beforeResourceRequestUpdate(resourceRequest, mockContext);

      verify(mockContext, times(1)).getUserInfo();
      verify(mockUserInfo, times(1)).getAttributeValues("RequestedResourceOrganization");
      verify(mockResourceRequestValidator, times(1)).isUserAuthorizedForTheAction(any(), any());
      verify(mockResourceRequestValidator, times(1)).checkResourceRequestDeleteUpdate(any(), any());
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDefaultValuesWhenUpdate(any());
      verify(mockResourceRequestValidator, times(1)).validateResourceRequestProperty(any());
      verify(spy, times(1)).fillResourceRequestDerivedValues(any());
      verify(spy, times(0)).adjustCapacitiesForResourceRequest(resourceRequest);

      verify(messages, times(0)).error(MessageKeys.NOT_AUTHORIZED_TO_UPDATE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Verify capacity requirement is not adjusted when start date and end date is null")
    public void VerifyCapacityNotAdjustedWhenStartDateAndEndDateIsNull() {

      resourceRequest.setStartDate(null);
      resourceRequest.setEndDate(null);

      /* Mock Result object */
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("Org100");
        }
      };
      final ManageResourceRequestHandler spy = Mockito.spy(cut);

      doReturn(mockUserInfo).when(mockContext).getUserInfo();
      doReturn(resOrgs).when(mockUserInfo).getAttributeValues("RequestedResourceOrganization");
      doReturn(true).when(mockResourceRequestValidator).isUserAuthorizedForTheAction(any(), any());
      doNothing().when(mockResourceRequestValidator).checkResourceRequestDeleteUpdate(any(), any());
      doNothing().when(mockResourceRequestHelper).fillResourceRequestDefaultValuesWhenUpdate(any());
      doNothing().when(mockResourceRequestValidator).validateResourceRequestProperty(any());
      doNothing().when(spy).fillResourceRequestDerivedValues(any());
      doNothing().when(spy).adjustCapacitiesForResourceRequest(resourceRequest);

      spy.beforeResourceRequestUpdate(resourceRequest, mockContext);

      verify(mockContext, times(1)).getUserInfo();
      verify(mockUserInfo, times(1)).getAttributeValues("RequestedResourceOrganization");
      verify(mockResourceRequestValidator, times(1)).isUserAuthorizedForTheAction(any(), any());
      verify(mockResourceRequestValidator, times(1)).checkResourceRequestDeleteUpdate(any(), any());
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDefaultValuesWhenUpdate(any());
      verify(mockResourceRequestValidator, times(1)).validateResourceRequestProperty(any());
      verify(spy, times(1)).fillResourceRequestDerivedValues(any());
      verify(spy, times(0)).adjustCapacitiesForResourceRequest(resourceRequest);

      verify(messages, times(0)).error(MessageKeys.NOT_AUTHORIZED_TO_UPDATE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Testing Before Delete Handler method of Resource Request")
    public void onBeforeResourceRequestDelete() {

      Result mockResult = mock(Result.class);
      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);
      CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class);
      ParameterInfo mockParameters = mock(ParameterInfo.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("Org100");
        }
      };

      CqnDelete mockCqnDelete = mock(CqnDelete.class);
      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();
      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);
      when(mockContext.getCqn()).thenReturn(mockCqnDelete);
      map.put(ResourceRequests.ID, resourceRequest.getId());

      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnDelete)).thenReturn(mockAnalysisResult);
      when(mockAnalysisResult.targetKeys()).thenReturn(map);
      when(mockContext.getParameterInfo()).thenReturn(mockParameters);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);
      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedResourceOrganization")).thenReturn(resOrgs);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(true);
      cut.beforeResourceRequestDelete(mockContext);

      verify(mockResourceRequestValidator, times(1))
          .checkResourceRequestDeleteUpdate((String) map.get(ResourceRequests.ID), CqnService.EVENT_DELETE);

      verify(mockResourceRequestValidator, times(1)).isUserAuthorizedForTheAction(any(), any());
    }

    @Test
    @DisplayName("Authorization : Exception is Thrown When User Tries to Delete Resource Request For Which he not Authorized")
    public void unAuthorizedUserFailsToDeleteResourceRequest() {
      Result mockResult = mock(Result.class);
      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);
      CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class);
      ParameterInfo mockParameters = mock(ParameterInfo.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("R100");
        }
      };

      CqnDelete mockCqnDelete = mock(CqnDelete.class);
      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();
      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);
      when(mockContext.getCqn()).thenReturn(mockCqnDelete);
      when(mockResourceRequestHelper.getRequestedResourceOrgForResourceRequestID(RESOURCE_REQUEST_ID))
          .thenReturn("Org100");
      map.put(ResourceRequests.ID, resourceRequest.getId());

      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnDelete)).thenReturn(mockAnalysisResult);
      when(mockAnalysisResult.targetKeys()).thenReturn(map);
      when(mockContext.getParameterInfo()).thenReturn(mockParameters);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);
      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("RequestedResourceOrganization")).thenReturn(resOrgs);
      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(false);

      cut.beforeResourceRequestDelete(mockContext);

      verify(messages, times(1)).error(MessageKeys.NOT_AUTHORIZED_TO_DELETE,
          resourceRequest.getRequestedResourceOrgId());
      verify(messages, times(2)).throwIfError();

    }

    @Test
    @DisplayName("Testing After CreateHandler Method of Resource Request")
    public void afterResourceRequestCreate() {

      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);
      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      doReturn("001").when(mockDisplayIDGenerator).getDisplayId();
      doNothing().when(mockResourceRequestHelper).modifyCapacitiesForTotalEffortDistributionType(resourceRequest);
      doNothing().when(mockResourceRequestValidator).validateDisplayId("001", ResourceRequests_.CDS_NAME);
      when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mock(Result.class));
      manageResourceRequestHandlerSpy.afterResourceRequestCreate(resourceRequest);
      verify(mockResourceRequestHelper, times(1)).modifyCapacitiesForTotalEffortDistributionType(resourceRequest);
      verify(mockDisplayIDGenerator, times(1)).getDisplayId();
      verify(mockResourceRequestValidator, times(1)).validateDisplayId("001", ResourceRequests_.CDS_NAME);
      assertEquals("001", resourceRequest.getDisplayId());

    }

    @Test
    @DisplayName("Testing After Update Method of Resource Request when ")
    public void onAfterResourceRequestUpdateForDailyEffortDistribution() {

      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);
      manageResourceRequestHandlerSpy.afterResourceRequestUpdate(resourceRequest);
      verify(mockResourceRequestHelper, times(0)).modifyCapacitiesForTotalEffortDistributionType(resourceRequest);
    }

    @Test
    @DisplayName("Testing After Update Method of Resource Request")
    public void onAfterResourceRequestUpdate() {

      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);
      ResourceRequestCapacities requestCapacity = Struct.create(ResourceRequestCapacities.class);
      List<ResourceRequestCapacities> requestCapacities = new ArrayList<>();
      requestCapacities.add(requestCapacity);
      resourceRequest.setCapacityRequirements(requestCapacities);

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      doNothing().when(mockResourceRequestHelper).modifyCapacitiesForTotalEffortDistributionType(resourceRequest);
      manageResourceRequestHandlerSpy.afterResourceRequestUpdate(resourceRequest);
      verify(mockResourceRequestHelper, times(1)).modifyCapacitiesForTotalEffortDistributionType(resourceRequest);
    }

    @Test
    @DisplayName("On change of start date in draft mode, resource request update method called")
    public void IsAdjustResourceRequestCapacityTriggeredOnChangeOfStartDate() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.now());

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      doNothing().when(manageResourceRequestHandlerSpy).adjustCapacitiesForDraftResourceRequest(resourceRequest);
      manageResourceRequestHandlerSpy.beforeResourceRequestDraftUpdation(resourceRequests);
      verify(manageResourceRequestHandlerSpy, times(1)).adjustCapacitiesForDraftResourceRequest(resourceRequest);

    }

    @Test
    @DisplayName("On change of start date in draft mode, resource request update method called")
    public void IsUpdateReferenceObjectTriggeredOnChangeOfReferenceObjectType() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      // Payload has the referenceObjectType, when the Reference Object Type control
      // is triggered
      resourceRequest.setReferenceObjectTypeCode(1);

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      doNothing().when(mockResourceRequestHelper).updateReferenceObject(resourceRequest);
      manageResourceRequestHandlerSpy.beforeResourceRequestDraftUpdation(resourceRequests);
      // Update Reference Object was called
      verify(mockResourceRequestHelper, times(1)).updateReferenceObject(resourceRequest);

    }

    @Test
    @DisplayName("On change of start date in draft mode, resource request update method called")
    public void IsUpdateReferenceObjectNotTriggeredOnNoChangeOfReferenceObjectType() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      // Payload does not have the referenceObjectType, when the Reference Object Type
      // control is not triggered

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      manageResourceRequestHandlerSpy.beforeResourceRequestDraftUpdation(resourceRequests);
      // Update Reference Object was called
      verify(mockResourceRequestHelper, times(0)).updateReferenceObject(resourceRequest);

    }

    @Test
    @DisplayName("On change of start date in draft mode, resource request update method called for multiple resource requests")
    public void IsAdjustResourceRequestCapacityTriggeredOnChangeOfStartDateForMultipleRR() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.now());

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);
      resourceRequests.add(resourceRequest);

      doNothing().when(manageResourceRequestHandlerSpy).adjustCapacitiesForDraftResourceRequest(resourceRequest);
      manageResourceRequestHandlerSpy.beforeResourceRequestDraftUpdation(resourceRequests);
      verify(manageResourceRequestHandlerSpy, times(2)).adjustCapacitiesForDraftResourceRequest(resourceRequest);

    }

    @Test
    @DisplayName("On change of end date in draft mode, resource request update method called")
    public void IsAdjustResourceRequestCapacityTriggeredOnChangeOfEndDate() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setEndDate(LocalDate.now());

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      doNothing().when(manageResourceRequestHandlerSpy).adjustCapacitiesForDraftResourceRequest(resourceRequest);
      manageResourceRequestHandlerSpy.beforeResourceRequestDraftUpdation(resourceRequests);
      verify(manageResourceRequestHandlerSpy, times(1)).adjustCapacitiesForDraftResourceRequest(resourceRequest);

    }

    @Test
    @DisplayName("On change of both start date and end date in draft mode, resource request update method called")
    public void IsAdjustResourceRequestCapacityTriggeredOnChangeOfStartDateAndEndDate() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.now());
      resourceRequest.setEndDate(LocalDate.now());

      final ManageResourceRequestHandler manageResourceRequestHandlerSpy = spy(cut);

      List<ResourceRequests> resourceRequests = new ArrayList<>();
      resourceRequests.add(resourceRequest);

      doNothing().when(manageResourceRequestHandlerSpy).adjustCapacitiesForDraftResourceRequest(resourceRequest);
      manageResourceRequestHandlerSpy.beforeResourceRequestDraftUpdation(resourceRequests);
      verify(manageResourceRequestHandlerSpy, times(1)).adjustCapacitiesForDraftResourceRequest(resourceRequest);

    }

    @Test
    @DisplayName("Check read call to Project Roles has filter query added for unrestricted roles")
    public void verifyBeforeProjectRolesRead() {
      CqnPredicate expectedUnrestrictedRolesFilter = get("roleLifecycleStatus_code").eq(0);

      CdsReadEventContext expectedContext = CdsReadEventContext.create(ProjectRoles_.CDS_NAME);
      expectedContext.setCqn(Select.from(ProjectRoles_.CDS_NAME)
          .columns(role -> role.get("ID"), role -> role.get("code"), role -> role.get("name")).limit(20, 0)
          .where(expectedUnrestrictedRolesFilter));

      CdsReadEventContext mockContext = CdsReadEventContext.create(ProjectRoles_.CDS_NAME);
      mockContext.setCqn(Select.from(ProjectRoles_.CDS_NAME)
          .columns(role -> role.get("ID"), role -> role.get("code"), role -> role.get("name")).limit(20, 0));

      cut.beforeProjectRolesRead(mockContext);

      assertEquals(expectedContext.getCqn().toString(), mockContext.getCqn().toString(),
          "Select query does not match expected query with unrestricted roles");
    }
  }

  @Nested
  @DisplayName("Check Update Resource Request Status, Manager and Processor Method")
  public class WhenUpdateResourceRequestStatus {

    /*
     * Constants for testing
     */

    private String RESOURCE_REQUEST_ID = "450a2453-ec0a-4a85-8247-94c39b9bdd67";
    private String REQUEST_STATUS = "requestStatus_code";
    private String RELEASE_STATUS = "releaseStatus_code";
    private int REQUEST_STATUS_RESOLVE = 1;
    private int RELEASE_STATUS_PUBLISHED = 1;
    private String INVALID_STATUS_NAME = "invalid_code";
    /*
     * private String RESOURCE_MANAGER = "ad8933f9-2cde-4800-8682-d5b2e88c8ce9";
     * private String PROCESSOR = "b27a8993-2dec-4bf6-9ce6-3536c0bcfd82";
     */

    @Test
    @DisplayName("When Resource Request Status is passed as Resolved")

    public void onUpdateResourceRequestStatusResolve() {

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);

      cut.updateResourceRequestStatus(RESOURCE_REQUEST_ID, REQUEST_STATUS, REQUEST_STATUS_RESOLVE);

      verifyNoInteractions(messages);

    }

    @Test
    @DisplayName("When Release status is passed as published")
    public void onUpdateResourceRequestStatusPublished() {

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);

      cut.updateResourceRequestStatus(RESOURCE_REQUEST_ID, RELEASE_STATUS, RELEASE_STATUS_PUBLISHED);

      verifyNoInteractions(messages);

    }

    @Test
    @DisplayName("When Invalid status is passed")
    public void onUpdateResourceRequestStatusInvalid() {

      ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.updateResourceRequestStatus(RESOURCE_REQUEST_ID, INVALID_STATUS_NAME, REQUEST_STATUS_RESOLVE));

      assertEquals(MessageKeys.INVALID_STATUS_CODE, exception.getMessage());

    }

  }

  @Nested
  @DisplayName("After Event Read Test")
  public class AfterEventReadTest {

    @Test
    public void validateIfFillVirtualFieldIsCalled() {
      ManageResourceRequestHandler spyOfCut = spy(cut);

      ArrayList<ResourceRequests> mockList = new ArrayList<>();

      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      mockList.add(mockResourceRequest);

      spyOfCut.afterEventRead(mockList);

      verify(spyOfCut, times(1)).fillVirtualFields(mockList);
    }
  }

  @Nested
  @DisplayName("Validate FillVirtualFields Method")
  public class FillVirtualFieldsTest {
    @Test
    public void ValidateFillVirtualFieldWhenCodeIsNone() {
      ManageResourceRequestHandler spyOfCut = spy(cut);

      ArrayList<ResourceRequests> mockList = new ArrayList<>();

      // Create mockObjects for passing to the method.
      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      ReferenceObjectType mockReferenceObjectType = mock(ReferenceObjectType.class);
      mockList.add(mockResourceRequest);

      doReturn(mockReferenceObjectType).when(mockResourceRequest).getReferenceObjectType();
      doReturn(0).when(mockReferenceObjectType).getCode();

      // Call to the method to be tested.
      spyOfCut.fillVirtualFields(mockList);

      // Verify that the flag "ReferenceObjectFieldControl" is set to read-only mode.
      verify(mockResourceRequest, times(1)).setReferenceObjectFieldControl(Constants.FIELD_CONTROL_READ);

    }

    @Test
    public void ValidateFillVirtualFieldWhenCodeIsProject() {
      ManageResourceRequestHandler spyOfCut = spy(cut);

      ArrayList<ResourceRequests> mockList = new ArrayList<>();

      // Create mockObjects for passing to the method.
      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      ReferenceObjectType mockReferenceObjectType = mock(ReferenceObjectType.class);
      mockList.add(mockResourceRequest);

      doReturn(mockReferenceObjectType).when(mockResourceRequest).getReferenceObjectType();
      doReturn(1).when(mockReferenceObjectType).getCode();

      // Call to the method to be tested.
      spyOfCut.fillVirtualFields(mockList);

      // Verify that the flag "ReferenceObjectFieldControl" is set to edit mode.
      verify(mockResourceRequest, times(1)).setReferenceObjectFieldControl(Constants.FIELD_CONTROL_EDIT);

    }

    @Test
    public void ValidateFillVirtualFieldWhenReferenceObjectTypeIsNull() {
      ManageResourceRequestHandler spyOfCut = spy(cut);

      ArrayList<ResourceRequests> mockList = new ArrayList<>();

      // Create mockObjects for passing to the method.
      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      mockList.add(mockResourceRequest);

      doReturn(null).when(mockResourceRequest).getReferenceObjectType();

      // Call to the method to be tested.
      spyOfCut.fillVirtualFields(mockList);

      // Verify that the flag "ReferenceObjectFieldControl" is not set.
      verify(mockResourceRequest, times(0)).setReferenceObjectFieldControl(Constants.FIELD_CONTROL_EDIT);
      verify(mockResourceRequest, times(0)).setReferenceObjectFieldControl(Constants.FIELD_CONTROL_EDIT);

    }

    @Test
    public void ValidateFillVirtualFieldsIfReleaseStatusIsNotNullPublishedScenario() {
        ManageResourceRequestHandler spyOfCut = spy(cut);

        ArrayList<ResourceRequests> mockList = new ArrayList<>();

        // Create mockObjects for passing to the method.
        ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
        ReleaseStatuses mockReleaseStatus = mock(ReleaseStatuses.class);

        doReturn(mockReleaseStatus).when(mockResourceRequest).getReleaseStatus();
        doReturn(Constants.REQUEST_PUBLISH).when(mockReleaseStatus).getCode();

        mockList.add(mockResourceRequest);

        doReturn(null).when(mockResourceRequest).getReferenceObjectType();

        // Call to the method to be tested.
        spyOfCut.fillVirtualFields(mockList);

        //verify set of ResourceRequestFieldControl, ReferenceObjectFieldCOntrol
        verify(mockResourceRequest,times(1)).setResourceRequestFieldControl(Constants.FIELD_CONTROL_READ);
        verify(mockResourceRequest,times(1)).setReferenceObjectFieldControl(Constants.FIELD_CONTROL_READ);
        verify(mockResourceRequest,times(1)).setProjectRoleFieldControl(Constants.FIELD_CONTROL_READ);


    }

      @Test
      public void ValidateFillVirtualFieldsIfReleaseStatusIsNotNullWithdrawScenario() {
          ManageResourceRequestHandler spyOfCut = spy(cut);

          ArrayList<ResourceRequests> mockList = new ArrayList<>();

          // Create mockObjects for passing to the method.
          ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
          ReleaseStatuses mockReleaseStatus = mock(ReleaseStatuses.class);

          doReturn(mockReleaseStatus).when(mockResourceRequest).getReleaseStatus();
          doReturn(Constants.REQUEST_WITHDRAW).when(mockReleaseStatus).getCode();

          mockList.add(mockResourceRequest);

          doReturn(null).when(mockResourceRequest).getReferenceObjectType();

          // Call to the method to be tested.
          spyOfCut.fillVirtualFields(mockList);

          //verify set of ResourceRequestFieldControl, ReferenceObjectFieldCOntrol
          verify(mockResourceRequest,times(1)).setResourceRequestFieldControl(Constants.FIELD_CONTROL_EDIT);
          verify(mockResourceRequest,times(1)).setProjectRoleFieldControl(Constants.FIELD_CONTROL_OPTIONAL);


      }

      @Test
      public void ValidateFillVirtualFieldsIfReleaseStatusIsNull() {
          ManageResourceRequestHandler spyOfCut = spy(cut);

          ArrayList<ResourceRequests> mockList = new ArrayList<>();

          // Create mockObjects for passing to the method.
          ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
          doReturn(null).when(mockResourceRequest).getReleaseStatus();
          mockList.add(mockResourceRequest);

          doReturn(null).when(mockResourceRequest).getReferenceObjectType();

          // Call to the method to be tested.
          spyOfCut.fillVirtualFields(mockList);

          //verify not setting of ResourceRequestFieldControl, ReferenceObjectFieldCOntrol
          verify(mockResourceRequest,times(0)).setResourceRequestFieldControl(Constants.FIELD_CONTROL_READ);
          verify(mockResourceRequest,times(0)).setReferenceObjectFieldControl(Constants.FIELD_CONTROL_READ);
          verify(mockResourceRequest,times(0)).setProjectRoleFieldControl(Constants.FIELD_CONTROL_READ);


      }

  }
}
