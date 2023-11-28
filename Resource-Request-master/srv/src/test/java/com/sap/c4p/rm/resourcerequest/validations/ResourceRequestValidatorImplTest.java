package com.sap.c4p.rm.resourcerequest.validations;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.ResultBuilder;
import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.helpers.ResourceRequestHelper;
import com.sap.c4p.rm.resourcerequest.utils.Constants;
import com.sap.c4p.rm.resourcerequest.utils.PropertyMapping;

import com.sap.resourcemanagement.resourcerequest.StaffingStatuses;

import manageresourcerequestservice.*;

public class ResourceRequestValidatorImplTest {

  /** code under test */
  private static ResourceRequestValidatorImpl resourceRequestValidator;

  /** mocks */
  private static PersistenceService mockPersistenceService;
  private static ResourceRequestSkillsValidator mockSkillValidator;
  private Messages messages;
  private Result mockResult;
  private ResourceRequestCapacityValidator mockCapacityValidator;
  private PropertyMapping mockPropertyMapping;
  private ResourceRequestHelper mockResourceRequestHelper;

  private static final String DEMAND_ID = "aae04175-0914-4924-a19d-68fce8f27000";
  private static final String PROJECT_ROLE_ID = "f316baac-a604-4d1a-b42d-a3da5abfae53";
  private static final String EMPLOYEE_ID = "50456ea4-df1c-4578-89e0-c243f170e946";
  private static final Integer PRIORITY_CODE = 0;
  private static final Integer RELEASE_STATUS_CODE_WITHDRAW = 0;
  private static final Integer RELEASE_STATUS_CODE_PUBLISH = 1;
  private static final Integer REQUEST_STATUS_CODE_OPEN = 0;
  private static final Integer REQUEST_STATUS_CODE_RESOLVE = 1;
  private static final String RESOURCE_ORG_ID = "Org_IN";
  private static final BigDecimal REQUIRED_EFFORT_POSITIVE_VALUE = new BigDecimal(500.00);
  private static final BigDecimal REQUIRED_EFFORT_NEGATIVE_VALUE = new BigDecimal(-500);
  private static final BigDecimal REQUIRED_EFFORT_ZERO_VALUE = new BigDecimal(0);
  private static final String VALID_UNIT = "duration-hour";
  private static final String INVALID_UNIT = "Min";
  private static final String VALID_DESCRIPTION = "This is a test comment.";
  private static final String INVALID_DESCRIPTION_1 = "<script>alert('JS Script inserted');</script>";
  private static final String INVALID_DESCRIPTION_2 = "<html><head><script>alert('JS Script inserted');</script></head></html>";
  private static final String RESOURCE_REQUEST_ID = "51051adf-06f2-4043-9179-abbfa82e182e";
  private static final String SKILL_ID = "1b5c52c4-4718-499b-90e6-4c1fd790b508";
  private static final int NOT_STAFFED = 0;
  private static final int STAFFED = 1;
  private static final Boolean DRAFT = false;
  private static final String ENTITY_NAME = resourcerequestservice.ResourceRequests_.CDS_NAME;

  private static final String EVIL_SCRIPT_TAG = "<script src=\"https://evilpage.de/assets/js/evilScript.js\"></script>";

  private static final String EVIL_CSV = "=cmd|'/Ccalc.exe'!z";

  @BeforeEach
  void beforeEach() {
    mockPersistenceService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);
    mockSkillValidator = mock(ResourceRequestSkillsValidator.class);
    mockCapacityValidator = mock(ResourceRequestCapacityValidator.class);
    mockPropertyMapping = mock(PropertyMapping.class);
    mockResourceRequestHelper = mock(ResourceRequestHelper.class);
    messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    resourceRequestValidator = new ResourceRequestValidatorImpl(mockPersistenceService, mockSkillValidator, messages,
        mockCapacityValidator, mockPropertyMapping, mockResourceRequestHelper);

  }

  @Nested
  @DisplayName("Check validateMandatoryFieldsForCreate.")
  class ValidateMandatoryFieldsForCreate {

    @Test
    @DisplayName("Check function calls.")
    void testFunctionCalls() {
      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      resourceRequest.setStartDate(LocalDate.of(2020, 1, 1));
      resourceRequest.setEndDate(LocalDate.of(2021, 1, 1));
      resourceRequest.setRequiredEffort(BigDecimal.valueOf(10));
      resourceRequest.setName("Name");
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;

      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);

      resourceRequestValidatorSpy.validateMandatoryFieldsForCreate(resourceRequest, entityName);

      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);

    }
  }

  @Nested
  @DisplayName("Check validateResourceRequestPropertyApi.")
  class ValidateResourceRequestPropertyApi {

    @Test
    @DisplayName("Check individual methods are called when value is passed create scenario.")
    public void validateResourceRequestPropertyApiForCreateAllValue() {

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      resourceRequest.setName("name");
      resourceRequest.setDescription("description");
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      String eventType = CqnService.EVENT_CREATE;

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateMandatoryFieldsForCreate(resourceRequest, entityName);

      resourceRequestValidatorSpy.validateResourceRequestPropertyApi(resourceRequest, eventType);

      verify(resourceRequestValidatorSpy, times(1)).validateMandatoryFieldsForCreate(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(0))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
    }

    @Test
    @DisplayName("Check individual methods are not called when value is not passed create scenario.")
    public void validateResourceRequestPropertyApiForCreateNullValues() {

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      String eventType = CqnService.EVENT_CREATE;

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateMandatoryFieldsForCreate(resourceRequest, entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);

      resourceRequestValidatorSpy.validateResourceRequestPropertyApi(resourceRequest, eventType);

      verify(resourceRequestValidatorSpy, times(1)).validateMandatoryFieldsForCreate(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(0))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
    }

    @Test
    @DisplayName("Check individual methods are called when value is passed update.")
    public void validateResourceRequestPropertyApiForUpdateAllValues() {

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      ResourceRequests mockPersistedResourceRequest = Struct.create(ResourceRequests.class);
      mockPersistedResourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);

      resourceRequest.setName("name");
      resourceRequest.setStartDate(LocalDate.of(2020, 1, 1));
      resourceRequest.setRequiredEffort(BigDecimal.valueOf(10));
      resourceRequest.setDescription("description");
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      String eventType = CqnService.EVENT_UPDATE;

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestApiDatesUpdate(resourceRequest, entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      doReturn(mockPersistedResourceRequest).when(mockResourceRequestHelper).selectResourceRequest(resourceRequest.getId());

      resourceRequestValidatorSpy.validateResourceRequestPropertyApi(resourceRequest, eventType);

      verify(resourceRequestValidatorSpy, times(0)).validateMandatoryFieldsForCreate(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestApiDatesUpdate(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);

      verify(resourceRequestValidatorSpy, times(0))
          .validateResourceRequestNameInputValidation(resourceRequest.getDescription(), entityName);
    }

    @Test
    @DisplayName("Check individual methods are not called when value is notpassed update.")
    public void validateResourceRequestPropertyApiForUpdateNullValues() {

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      String eventType = CqnService.EVENT_UPDATE;

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestApiDatesUpdate(resourceRequest, entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      resourceRequestValidatorSpy.validateResourceRequestPropertyApi(resourceRequest, eventType);

      verify(resourceRequestValidatorSpy, times(0)).validateMandatoryFieldsForCreate(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestApiDatesUpdate(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(0))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);

      verify(resourceRequestValidatorSpy, times(0))
          .validateResourceRequestNameInputValidation(resourceRequest.getDescription(), entityName);

    }

      @Test
      @DisplayName("Check individual methods are called when value is passed update In Published State.")
      public void validateResourceRequestPropertyApiForUpdateAllValuesInPublished() {

          resourcerequestservice.ResourceRequests resourceRequest = Struct
              .create(resourcerequestservice.ResourceRequests.class);
          ResourceRequests mockPersistedResourceRequest = Struct.create(ResourceRequests.class);
          mockPersistedResourceRequest.setReleaseStatusCode(Constants.REQUEST_PUBLISH);

          resourceRequest.setName("name");
          resourceRequest.setStartDate(LocalDate.of(2020, 1, 1));
          resourceRequest.setRequiredEffort(BigDecimal.valueOf(10));
          resourceRequest.setDescription("description");
          String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
          String eventType = CqnService.EVENT_UPDATE;

          ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

          doNothing().when(resourceRequestValidatorSpy).validateResourceRequestApiDatesUpdate(resourceRequest, entityName);
          doNothing().when(resourceRequestValidatorSpy)
              .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);
          doNothing().when(resourceRequestValidatorSpy)
              .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
          doReturn(mockPersistedResourceRequest).when(mockResourceRequestHelper).selectResourceRequest(resourceRequest.getId());

          resourceRequestValidatorSpy.validateResourceRequestPropertyApi(resourceRequest, eventType);

          verify(resourceRequestValidatorSpy, times(0)).validateMandatoryFieldsForCreate(resourceRequest, entityName);
          verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestApiDatesUpdate(resourceRequest, entityName);
          verify(resourceRequestValidatorSpy, times(1))
              .validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);

          verify(resourceRequestValidatorSpy, times(0))
              .validateResourceRequestNameInputValidation(resourceRequest.getDescription(), entityName);
          verify(messages,times(1)).error(MessageKeys.INVALID_UPDATE_PUBLISHED);
      }

  }

  @Nested
  @DisplayName("validate Resource Request Api Dates Update")
  class ValidateApiUpdateDates {

    ResourceRequests mockPersistedResourceRequest;

    @BeforeEach
    public void setupData() {
      mockPersistedResourceRequest = Struct.create(ResourceRequests.class);
      mockPersistedResourceRequest.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      mockPersistedResourceRequest.setDisplayId("0000000042");
      mockPersistedResourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);
      mockPersistedResourceRequest.setRequestedUnit(ResourceRequestValidatorImplTest.VALID_UNIT);
      mockPersistedResourceRequest.setProjectRoleId(ResourceRequestValidatorImplTest.PROJECT_ROLE_ID);
      mockPersistedResourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);
      mockPersistedResourceRequest.setStartDate(LocalDate.of(2020, 1, 1));
      mockPersistedResourceRequest.setEndDate(LocalDate.of(2020, 5, 5));

    }

    @Test
    @DisplayName("Check start date update if s4 cloud request")
    public void checkS4RequestStartDateUpdate() {

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      mockPersistedResourceRequest.setIsS4Cloud(true);

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);

      resourceRequest.setStartDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      when(mockResourceRequestHelper.selectResourceRequest(resourceRequest.getId()))
          .thenReturn(mockPersistedResourceRequest);
      doNothing().when(resourceRequestValidatorSpy).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);

      resourceRequestValidatorSpy.validateResourceRequestApiDatesUpdate(resourceRequest, entityName);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);
      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      assertEquals(resourceRequest.getStartDate(), mockPersistedResourceRequest.getStartDate());

    }

    @Test
    @DisplayName("Check end date update if s4 cloud request")
    public void checkS4RequestEndDateUpdate() {

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      mockPersistedResourceRequest.setIsS4Cloud(true);

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);

      resourceRequest.setEndDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      when(mockResourceRequestHelper.selectResourceRequest(resourceRequest.getId()))
          .thenReturn(mockPersistedResourceRequest);
      doNothing().when(resourceRequestValidatorSpy).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);

      resourceRequestValidatorSpy.validateResourceRequestApiDatesUpdate(resourceRequest, entityName);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);
      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      assertEquals(resourceRequest.getEndDate(), mockPersistedResourceRequest.getEndDate());

    }

    @Test
    @DisplayName("Check both start and end date update if s4 cloud request")
    public void checkS4RequestStartEndDateUpdate() {

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      mockPersistedResourceRequest.setIsS4Cloud(true);

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);

      resourceRequest.setStartDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setEndDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      when(mockResourceRequestHelper.selectResourceRequest(resourceRequest.getId()))
          .thenReturn(mockPersistedResourceRequest);
      doNothing().when(resourceRequestValidatorSpy).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);

      resourceRequestValidatorSpy.validateResourceRequestApiDatesUpdate(resourceRequest, entityName);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);

      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      assertAll(() -> assertEquals(resourceRequest.getStartDate(), mockPersistedResourceRequest.getStartDate()),
          () -> assertEquals(resourceRequest.getEndDate(), mockPersistedResourceRequest.getEndDate()));

    }

    @Test
    @DisplayName("Check start date update if non s4 cloud request")
    public void checkRequestStartDateUpdate() {

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      mockPersistedResourceRequest.setIsS4Cloud(false);

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);

      resourceRequest.setStartDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      when(mockResourceRequestHelper.selectResourceRequest(resourceRequest.getId()))
          .thenReturn(mockPersistedResourceRequest);
      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);

      resourceRequestValidatorSpy.validateResourceRequestApiDatesUpdate(resourceRequest, entityName);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(0)).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);

      assertAll(() -> assertEquals(resourceRequest.getStartDate(), LocalDate.of(2020, 1, 2)),
          () -> assertEquals(resourceRequest.getEndDate(), mockPersistedResourceRequest.getEndDate()));

    }

    @Test
    @DisplayName("Check end date update if non s4 cloud request")
    public void checkRequestEndDateUpdate() {

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      mockPersistedResourceRequest.setIsS4Cloud(false);

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);

      resourceRequest.setEndDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      when(mockResourceRequestHelper.selectResourceRequest(resourceRequest.getId()))
          .thenReturn(mockPersistedResourceRequest);
      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);

      resourceRequestValidatorSpy.validateResourceRequestApiDatesUpdate(resourceRequest, entityName);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(0)).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);

      assertAll(() -> assertEquals(resourceRequest.getStartDate(), mockPersistedResourceRequest.getStartDate()),
          () -> assertEquals(resourceRequest.getEndDate(), LocalDate.of(2020, 1, 2)));

    }

    @Test
    @DisplayName("Check if both start and end date update if non s4 cloud request")
    public void checkRequestStartEndDateUpdate() {

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      mockPersistedResourceRequest.setIsS4Cloud(false);

      resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);

      resourceRequest.setStartDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setEndDate(LocalDate.of(2020, 1, 2));
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      when(mockResourceRequestHelper.selectResourceRequest(resourceRequest.getId()))
          .thenReturn(mockPersistedResourceRequest);
      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);

      resourceRequestValidatorSpy.validateResourceRequestApiDatesUpdate(resourceRequest, entityName);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(0)).validateS4CloudSpecificChecks(mockPersistedResourceRequest,
          entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);

      assertAll(() -> assertEquals(resourceRequest.getStartDate(), LocalDate.of(2020, 1, 2)),
          () -> assertEquals(resourceRequest.getEndDate(), LocalDate.of(2020, 1, 2)));

    }

  }

  @Nested
  @DisplayName("Validate Resource Request display ID.")
  class ValidateDisplayID {
    @Test
    @DisplayName("Check method validateDisplayId does not throw exception when valid displayID is passed.")
    public void validateDisplayIdPositiveSceanrio() {
      resourceRequestValidator.validateDisplayId("0000000042", ENTITY_NAME);
      verifyNoInteractions(messages);
    }

    @Test
    @DisplayName("Check if method validateDisplayId throws exception when invalid value is passed.")
    public void validateDisplayIdNegativeSceanrioInvalidFormat() {

      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());
      resourceRequestValidator.validateDisplayId("42", ENTITY_NAME);
      verify(messages, times(1)).error(MessageKeys.INVALID_DISPLAYID);
    }

    @Test
    @DisplayName("Check if method validateDisplayId throws exception when null value if passed.")
    public void validateDisplayIdNegativeSceanrioNullValue() {
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());
      resourceRequestValidator.validateDisplayId(null, ENTITY_NAME);
      verify(messages, times(1)).error(MessageKeys.NULL_DISPLAYID);
    }
  }

  @Nested
  @DisplayName("Validate Resource Request Properties")
  class ValidateResourceRequestProperty {
    @Test
    @DisplayName("Check if method validateResourceRequestProperty() executes all the validations when s4cloud is false")
    public void validateResourceRequestPropertyExecutesAllNonS4() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      final String entityName = ResourceRequests_.CDS_NAME;

      resourceRequest.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      resourceRequest.setIsS4Cloud(false);
      resourceRequest.setDisplayId("0000000042");
      resourceRequest.setName("Name");
      resourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);
      resourceRequest.setRequestedUnit(ResourceRequestValidatorImplTest.VALID_UNIT);
      resourceRequest.setProjectRoleId(ResourceRequestValidatorImplTest.PROJECT_ROLE_ID);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);

      final List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      final SkillRequirements skill = Struct.create(SkillRequirements.class);

      skill.setId(ResourceRequestValidatorImplTest.SKILL_ID);
      skill.setImportanceCode(1);
      skill.setResourceRequestId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      skill.setSkillId(UUID.randomUUID().toString());

      final List<SkillRequirements> skillRequirements = new ArrayList<>();

      skillRequirements.add(skill);
      skillRequirements.add(skill);

      resourceRequest.setSkillRequirements(skillRequirements);

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      doNothing().when(resourceRequestValidatorSpy).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      doNothing().when(resourceRequestValidatorSpy).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      doNothing().when(mockSkillValidator).checkDuplicatesSkillPayload(resourceRequest.getSkillRequirements());
      doNothing().when(mockSkillValidator).checkValidSkills(resourceRequest.getSkillRequirements());
      doNothing().when(mockCapacityValidator).validateEffortDistributionProperties(resourceRequest);
      doNothing().when(resourceRequestValidatorSpy).validateForInjection(resourceRequest);

      resourceRequestValidatorSpy.validateResourceRequestProperty(resourceRequest);

      verify(resourceRequestValidatorSpy, times(0)).validateS4CloudSpecificChecks(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      verify(resourceRequestValidatorSpy, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      verify(mockCapacityValidator, times(1)).validateEffortDistributionProperties(resourceRequest);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateForInjection(resourceRequest);
    }

    @Test
    @DisplayName("Check if method validateResourceRequestProperty() executes all the validations in ED type as Daily")
    public void validateResourceRequestPropertyExecutesAllInDailyType() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      final String entityName = ResourceRequests_.CDS_NAME;

      resourceRequest.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      resourceRequest.setIsS4Cloud(true);
      resourceRequest.setDisplayId("0000000042");
      resourceRequest.setName("Name");
      resourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);
      resourceRequest.setRequestedUnit(ResourceRequestValidatorImplTest.VALID_UNIT);
      resourceRequest.setProjectRoleId(ResourceRequestValidatorImplTest.PROJECT_ROLE_ID);
      resourceRequest.setEffortDistributionTypeCode(Constants.DAILY_HOURS);

      final List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      final SkillRequirements skill = Struct.create(SkillRequirements.class);

      skill.setId(ResourceRequestValidatorImplTest.SKILL_ID);
      skill.setImportanceCode(1);
      skill.setResourceRequestId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      skill.setSkillId(UUID.randomUUID().toString());

      final List<SkillRequirements> skillRequirements = new ArrayList<>();

      skillRequirements.add(skill);
      skillRequirements.add(skill);

      resourceRequest.setSkillRequirements(skillRequirements);

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateS4CloudSpecificChecks(resourceRequest, entityName);
      doNothing().when(resourceRequestValidatorSpy).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      doNothing().when(resourceRequestValidatorSpy).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      doNothing().when(resourceRequestValidatorSpy).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      doNothing().when(mockSkillValidator).checkDuplicatesSkillPayload(resourceRequest.getSkillRequirements());
      doNothing().when(mockSkillValidator).checkValidSkills(resourceRequest.getSkillRequirements());
      doNothing().when(mockCapacityValidator).validateEffortDistributionProperties(resourceRequest);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      doNothing().when(resourceRequestValidatorSpy).validateForInjection(resourceRequest);

      resourceRequestValidatorSpy.validateResourceRequestProperty(resourceRequest);

      verify(resourceRequestValidatorSpy, times(1)).validateS4CloudSpecificChecks(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      verify(resourceRequestValidatorSpy, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      verify(mockCapacityValidator, times(1)).validateEffortDistributionProperties(resourceRequest);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateForInjection(resourceRequest);

    }

    @Test
    @DisplayName("Check if method validateResourceRequestProperty() executes all the validations in ED type weekly")
    public void validateResourceRequestPropertyExecutesAllInWeeklyType() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      final String entityName = ResourceRequests_.CDS_NAME;

      resourceRequest.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      resourceRequest.setIsS4Cloud(true);
      resourceRequest.setDisplayId("0000000042");
      resourceRequest.setName("Name");
      resourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);
      resourceRequest.setRequestedUnit(ResourceRequestValidatorImplTest.VALID_UNIT);
      resourceRequest.setProjectRoleId(ResourceRequestValidatorImplTest.PROJECT_ROLE_ID);
      resourceRequest.setEffortDistributionTypeCode(Constants.WEEKLY_HOURS);

      final List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      final SkillRequirements skill = Struct.create(SkillRequirements.class);

      skill.setId(ResourceRequestValidatorImplTest.SKILL_ID);
      skill.setImportanceCode(1);
      skill.setResourceRequestId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      skill.setSkillId(UUID.randomUUID().toString());

      final List<SkillRequirements> skillRequirements = new ArrayList<>();

      skillRequirements.add(skill);
      skillRequirements.add(skill);

      resourceRequest.setSkillRequirements(skillRequirements);

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateS4CloudSpecificChecks(resourceRequest, entityName);
      doNothing().when(resourceRequestValidatorSpy).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      doNothing().when(resourceRequestValidatorSpy).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      doNothing().when(resourceRequestValidatorSpy).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      doNothing().when(mockSkillValidator).checkDuplicatesSkillPayload(resourceRequest.getSkillRequirements());
      doNothing().when(mockSkillValidator).checkValidSkills(resourceRequest.getSkillRequirements());
      doNothing().when(mockCapacityValidator).validateEffortDistributionProperties(resourceRequest);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      doNothing().when(resourceRequestValidatorSpy).validateForInjection(resourceRequest);

      resourceRequestValidatorSpy.validateResourceRequestProperty(resourceRequest);

      verify(resourceRequestValidatorSpy, times(1)).validateS4CloudSpecificChecks(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      verify(resourceRequestValidatorSpy, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      verify(mockCapacityValidator, times(1)).validateEffortDistributionProperties(resourceRequest);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateForInjection(resourceRequest);

    }

    @Test
    @DisplayName("Check if method validateResourceRequestProperty() executes all the validations in ED type total")
    public void validateResourceRequestPropertyExecutesAllInTotalType() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      final String entityName = ResourceRequests_.CDS_NAME;

      resourceRequest.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      resourceRequest.setIsS4Cloud(true);
      resourceRequest.setDisplayId("0000000042");
      resourceRequest.setName("Name");
      resourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);
      resourceRequest.setRequestedUnit(ResourceRequestValidatorImplTest.VALID_UNIT);
      resourceRequest.setProjectRoleId(ResourceRequestValidatorImplTest.PROJECT_ROLE_ID);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);

      final List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      resourceRequest.setCapacityRequirements(resourceRequestCapacities);

      final SkillRequirements skill = Struct.create(SkillRequirements.class);

      skill.setId(ResourceRequestValidatorImplTest.SKILL_ID);
      skill.setImportanceCode(1);
      skill.setResourceRequestId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      skill.setSkillId(UUID.randomUUID().toString());

      final List<SkillRequirements> skillRequirements = new ArrayList<>();

      skillRequirements.add(skill);
      skillRequirements.add(skill);

      resourceRequest.setSkillRequirements(skillRequirements);

      final ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateS4CloudSpecificChecks(resourceRequest, entityName);
      doNothing().when(resourceRequestValidatorSpy).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      doNothing().when(resourceRequestValidatorSpy).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      doNothing().when(resourceRequestValidatorSpy).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      doNothing().when(mockSkillValidator).checkDuplicatesSkillPayload(resourceRequest.getSkillRequirements());
      doNothing().when(mockSkillValidator).checkValidSkills(resourceRequest.getSkillRequirements());
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      doNothing().when(resourceRequestValidatorSpy).validateForInjection(resourceRequest);

      resourceRequestValidatorSpy.validateResourceRequestProperty(resourceRequest);

      verify(resourceRequestValidatorSpy, times(1)).validateS4CloudSpecificChecks(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      verify(resourceRequestValidatorSpy, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      verify(mockCapacityValidator, times(0)).validateEffortDistributionProperties(resourceRequest);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateForInjection(resourceRequest);

    }

    @Test
    @DisplayName("When No Skill is entered")
    public void noSkillEntered() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      final String entityName = ResourceRequests_.CDS_NAME;

      resourceRequest.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);
      resourceRequest.setIsS4Cloud(true);
      resourceRequest.setDisplayId("0000000042");
      resourceRequest.setName("Name");
      resourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);
      resourceRequest.setRequestedUnit(ResourceRequestValidatorImplTest.VALID_UNIT);
      resourceRequest.setProjectRoleId(ResourceRequestValidatorImplTest.PROJECT_ROLE_ID);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateS4CloudSpecificChecks(resourceRequest, entityName);
      doNothing().when(resourceRequestValidatorSpy).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      doNothing().when(resourceRequestValidatorSpy).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      doNothing().when(resourceRequestValidatorSpy).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      doNothing().when(resourceRequestValidatorSpy)
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      doNothing().when(resourceRequestValidatorSpy)
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      doNothing().when(resourceRequestValidatorSpy).validateForInjection(resourceRequest);

      resourceRequestValidatorSpy.validateResourceRequestProperty(resourceRequest);

      verify(resourceRequestValidatorSpy, times(1)).validateS4CloudSpecificChecks(resourceRequest, entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1)).validatePriorityCodeExist(resourceRequest.getPriorityCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
      verify(resourceRequestValidatorSpy, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
      verify(resourceRequestValidatorSpy, times(1))
          .validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);
      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDatesBasicChecks(
          resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
      verify(resourceRequestValidatorSpy, times(1))
          .validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateForInjection(resourceRequest);

    }

  }

  @Nested
  @DisplayName("Validate Demand ID existence")
  class ValidateDemandIDExistence {
    @Test
    @DisplayName("Check if an existing demand id passes the validation")
    public void validateDemandIdExistenceSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);

      final Demands demand = Struct.create(Demands.class);
      demand.setId(ResourceRequestValidatorImplTest.DEMAND_ID);

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);

      when(mockResult.single(Demands.class)).thenReturn(demand);

      final Demands actualDemand = resourceRequestValidator.validateDemandIdExist(resourceRequest.getDemandId());
      assertEquals(demand, actualDemand);
    }

    @Test
    @DisplayName("Check if demand id with null value then throws an exception")
    public void validateDemandIdNullValueSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDemandId(null);

      resourceRequestValidator.validateDemandIdExist(resourceRequest.getDemandId());

      verify(messages, times(1)).error(MessageKeys.INVALID_DEMAND_ID);

    }

    @Test
    @DisplayName("Check if an non-existing demand id fails the validation")
    public void validateDemandIdNonExistenceFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDemandId(ResourceRequestValidatorImplTest.DEMAND_ID);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      resourceRequestValidator.validateDemandIdExist(resourceRequest.getDemandId());

      verify(messages, times(1)).error(MessageKeys.INVALID_DEMAND_ID);
    }
  }

  @Nested
  @DisplayName("Validate Role ID")
  class ValidateRoleID {
    @Test
    @DisplayName("Check if an unrestricted project role id not assigned to a resource request passes the validation")
    public void validateUnrestrictedProjectRoleIdSuccess() {
      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setProjectRoleId(PROJECT_ROLE_ID);
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      // Returning specific values for each subsequent match for rowCount()
      // The first argument is returned for any CqnSelect on ProjectRoles_.class
      // The second argument is returned for any CqnSelect on ResourceRequests_.class
      // Determined by the order in which the select queries are run in the main code
      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1, (long) 0);

      resourceRequestValidator.validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());

      verify(messages, times(0)).error(MessageKeys.INVALID_PROJECTROLE_ID);
    }

    @Test
    @DisplayName("Check if an unrestricted project role id assigned to a resource request passes the validation")
    public void validateUnrestrictedProjectRoleIdAssignedToRequestSuccess() {
      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setProjectRoleId(PROJECT_ROLE_ID);
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      // Returning specific values for each subsequent match for rowCount()
      // The first argument is returned for any CqnSelect on ProjectRoles_.class
      // The second argument is returned for any CqnSelect on ResourceRequests_.class
      // Determined by the order in which the select queries are run in the main code
      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1, (long) 1);

      resourceRequestValidator.validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());

      verify(messages, times(0)).error(MessageKeys.INVALID_PROJECTROLE_ID);
    }

    @Test
    @DisplayName("Check if a restricted project role id assigned to a resource request passes the validation")
    public void validateRestrictedProjectRoleIdAssignedToRequestSuccess() {
      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setProjectRoleId(PROJECT_ROLE_ID);
      resourceRequest.setId(RESOURCE_REQUEST_ID);

      // Returning specific values for each subsequent match for rowCount()
      // The first argument is returned for any CqnSelect on ProjectRoles_.class
      // The second argument is returned for any CqnSelect on ResourceRequests_.class
      // Determined by the order in which the select queries are run in the main code
      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0, (long) 1);

      resourceRequestValidator.validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());

      verify(messages, times(0)).error(MessageKeys.INVALID_PROJECTROLE_ID);
    }

    @Test
    @DisplayName("Check if a non-existing or restricted role id fails the validation")
    public void validateRestrictedOrNonExistingProjectRoleIdFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setProjectRoleId(ResourceRequestValidatorImplTest.PROJECT_ROLE_ID);

      // Returning specific values for each subsequent match for rowCount()
      // The first argument is returned for any CqnSelect on ProjectRoles_.class
      // The second argument is returned for any CqnSelect on ResourceRequests_.class
      // Determined by the order in which the select queries are run in the main code
      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0, (long) 0);

      resourceRequestValidator.validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());

      verify(messages, times(1)).error(MessageKeys.INVALID_PROJECTROLE_ID);
    }

  }

  @Nested
  @DisplayName("Validate Priority code existence")
  class ValidatePriorityCodeExistence {

    @Test
    @DisplayName("Check if an existing priority code passes the validation")
    public void validatePriorityCodeExistenceSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setPriorityCode(ResourceRequestValidatorImplTest.PRIORITY_CODE);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      resourceRequestValidator.validatePriorityCodeExist(resourceRequest.getPriorityCode());

      verify(messages, times(0)).error(MessageKeys.INVALID_PRIORITY_CODE);
    }

    @Test
    @DisplayName("Check if an non-existing priority code fails the validation")
    public void validatePriorityCodeNonExistenceFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setPriorityCode(ResourceRequestValidatorImplTest.PRIORITY_CODE);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      resourceRequestValidator.validatePriorityCodeExist(resourceRequest.getPriorityCode());

      verify(messages, times(1)).error(MessageKeys.INVALID_PRIORITY_CODE);
    }
  }

  @Nested
  @DisplayName("Validate Release Status Code existence")
  class ValidateReleaseStatusCodeExistence {
    @Test
    @DisplayName("Check if an existing release status code passes the validation")
    public void validateReleaseStatusCodeExistenceSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setReleaseStatusCode(ResourceRequestValidatorImplTest.RELEASE_STATUS_CODE_WITHDRAW);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      resourceRequestValidator.validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());

      verify(messages, times(0)).error(MessageKeys.INVALID_RELEASESTATUS_CODE);
    }

    @Test
    @DisplayName("Check if an non-existing release status code fails the validation")
    public void validateReleaseStatusCodeNonExistenceFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setReleaseStatusCode(ResourceRequestValidatorImplTest.RELEASE_STATUS_CODE_WITHDRAW);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      resourceRequestValidator.validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());

      verify(messages, times(1)).error(MessageKeys.INVALID_RELEASESTATUS_CODE);

    }
  }

  @Nested
  @DisplayName("Validate Request Status Code existence")
  class ValidateRequestStatusCodeExistence {
    @Test
    @DisplayName("Check if an existing request status code passes the validation")
    public void validateRequestStatusCodeExistenceSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestStatusCode(ResourceRequestValidatorImplTest.REQUEST_STATUS_CODE_OPEN);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      resourceRequestValidator.validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(messages, times(0)).error(MessageKeys.INVALID_REQUESTSTATUS_CODE);
    }

    @Test
    @DisplayName("Check if an non-existing request status code fails the validation")
    public void validateRequestStatusCodeNonExistenceFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestStatusCode(ResourceRequestValidatorImplTest.REQUEST_STATUS_CODE_OPEN);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      resourceRequestValidator.validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(messages, times(1)).error(MessageKeys.INVALID_REQUESTSTATUS_CODE);
    }

    @Test
    @DisplayName("Check if Resolved status id passed")
    public void validateResolveRequestStatusCode() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestStatusCode(ResourceRequestValidatorImplTest.REQUEST_STATUS_CODE_RESOLVE);

      resourceRequestValidator.validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(messages, times(1)).error(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION,
          resourceRequest.getRequestStatusCode());

    }
  }

  @Nested
  @DisplayName("Validate is resource request is withdrawn")

  class ValidateWithdrawnResourceRequest {

    @Test
    @DisplayName("Check if resource request is withdrawn")
    public void validateReleaseStatusCodeWithdrawn() {

      resourceRequestValidator.validateReleaseStatusCode(ResourceRequestValidatorImplTest.RELEASE_STATUS_CODE_WITHDRAW);
      verify(messages, times(1)).error(MessageKeys.RESOURCE_REQUEST_WITHDRAWN);

    }

    @Test
    @DisplayName("Check if resource request is not withdrawn")
    public void validateReleaseStatusCodeNotWithdrawn() {

      resourceRequestValidator.validateReleaseStatusCode(ResourceRequestValidatorImplTest.RELEASE_STATUS_CODE_PUBLISH);
      verify(messages, times(0)).error(MessageKeys.RESOURCE_REQUEST_WITHDRAWN);

    }
  }

  @Nested
  @DisplayName("Validate Requested Capacity")
  class ValidateRequestedCapacity {
    @Test
    @DisplayName("Check if requested Capacity with positive value passes the validation")
    public void validateRequestedCapacityPositiveValueSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(ResourceRequestValidatorImplTest.REQUIRED_EFFORT_POSITIVE_VALUE);

      resourceRequestValidator.validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(),
          ENTITY_NAME);

      verify(messages, times(0)).error(MessageKeys.INVALID_REQUIRED_EFFORT);
    }

    @Test
    @DisplayName("Check if requested Capacity with negative value fails the validation")
    public void validateRequestedCapacityNegativeValueFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(ResourceRequestValidatorImplTest.REQUIRED_EFFORT_NEGATIVE_VALUE);
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidator.validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(),
          ENTITY_NAME);
      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_EFFORT);

    }

    @Test
    @DisplayName("Check if requested Capacity with zero value fails the validation")
    public void validateRequestedCapacityZeroValueFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(ResourceRequestValidatorImplTest.REQUIRED_EFFORT_ZERO_VALUE);
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidator.validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(),
          ENTITY_NAME);

      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_EFFORT);
    }

    @Test
    @DisplayName("Check if requested Capacity with null value fails the validation")
    public void validateRequestedCapacityNullValueFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(null);
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidator.validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(),
          ENTITY_NAME);

      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_EFFORT);
    }

    @Test
    @DisplayName("Check if requested Capacity with Decimal value fails the validation")
    public void validateRequestedCapacityDecimalValueFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedCapacity(BigDecimal.valueOf(10.1));

      resourceRequestValidator.validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(),
          ENTITY_NAME);

      verify(messages, times(1)).error(MessageKeys.INVALID_REQUIRED_EFFORT);
    }
  }

  @Nested
  @DisplayName("Validate Resource Request Dates")
  class ValidateResourceRequestDates {
    final String entityName = ResourceRequests_.CDS_NAME;

    @Test
    @DisplayName("Check if null Date Values do not throws any exceptions")
    public void validateNullDateValuesSuccess() {

      final LocalDate startDate = null;
      final LocalDate endDate = null;
      final LocalDate startDateRange = null;
      final LocalDate endDateRange = null;

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(startDate, endDate,
          entityName);
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());
      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(startDate, endDate,
          entityName);

      resourceRequestValidatorSpy.validateResourceRequestDates(startDate, endDate, startDateRange, endDateRange,
          entityName);

      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDatesBasicChecks(startDate, endDate,
          entityName);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES);

    }

    @Test
    @DisplayName("Check if for non null Date, all the validate methods triggered")
    public void validateAllDateValidationsCheckTriggered() {

      final LocalDate startDate = LocalDate.of(2019, 1, 1);
      final LocalDate startDateRange = LocalDate.of(2019, 1, 1);
      final LocalDate endDate = LocalDate.of(2019, 3, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 3, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestDatesBasicChecks(startDate, endDate,
          entityName);
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());
      doNothing().when(resourceRequestValidatorSpy).validateResourceRequestWorkPackageDateChecks(startDate, endDate,
          startDateRange, endDateRange, entityName);

      resourceRequestValidatorSpy.validateResourceRequestDates(startDate, endDate, startDateRange, endDateRange,
          entityName);

      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDatesBasicChecks(startDate, endDate,
          entityName);
      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestWorkPackageDateChecks(startDateRange,
          endDateRange, startDate, endDate, entityName);

    }
  }

  @Nested
  @DisplayName("Validate Resource Request Dates with Work Package")
  class ValidateResourceRequestWorkPackageDateChecks {
    final String entityName = ResourceRequests_.CDS_NAME;

    @Test
    @DisplayName("Check if Start Date and End Date within same date range passes the validation")
    public void validateDatesWithinSameDateRangeSuceess() {

      final LocalDate startDate = LocalDate.of(2019, 1, 1);
      final LocalDate startDateRange = LocalDate.of(2019, 1, 1);
      final LocalDate endDate = LocalDate.of(2019, 3, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 3, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      resourceRequestValidatorSpy.validateResourceRequestWorkPackageDateChecks(startDateRange, endDateRange, startDate,
          endDate, entityName);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(0)).error(MessageKeys.INVALID_DATE_RANGES);

    }

    @Test
    @DisplayName("Check if both Start and End date falling inside of date ranges passes the validation")
    public void validateStartEndDateInsideDateRangeFailure() {

      final LocalDate startDate = LocalDate.of(2019, 2, 1);
      final LocalDate startDateRange = LocalDate.of(2019, 1, 1);
      final LocalDate endDate = LocalDate.of(2019, 3, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 5, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      resourceRequestValidatorSpy.validateResourceRequestWorkPackageDateChecks(startDateRange, endDateRange, startDate,
          endDate, entityName);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(0)).error(MessageKeys.INVALID_DATE_RANGES);
    }

    @Test
    @DisplayName("Check if Start Date earlier than Start date Range fails the validation")
    public void validateStartDateEarlierthanStartDateRangeFailure() {

      final LocalDate startDate = LocalDate.of(2019, 1, 1);
      final LocalDate startDateRange = LocalDate.of(2019, 2, 1);
      final LocalDate endDate = LocalDate.of(2019, 3, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 5, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidatorSpy.validateResourceRequestWorkPackageDateChecks(startDateRange, endDateRange, startDate,
          endDate, entityName);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES);
    }

    @Test
    @DisplayName("Check if Start Date later than End date of date Range fails the validation")
    public void validateStartDateLaterThanEndDateRangeFailure() {

      final LocalDate startDate = LocalDate.of(2019, 6, 1);
      final LocalDate startDateRange = LocalDate.of(2019, 1, 1);
      final LocalDate endDate = LocalDate.of(2019, 7, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 5, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidatorSpy.validateResourceRequestWorkPackageDateChecks(startDateRange, endDateRange, startDate,
          endDate, entityName);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES);

    }

    @Test
    @DisplayName("Check if End date earlier than Start date Range fails the validation")
    public void validateEndDateEarlierthanStartDateRangeFailure() {

      final LocalDate startDate = LocalDate.of(2019, 1, 3);
      final LocalDate startDateRange = LocalDate.of(2019, 2, 1);
      final LocalDate endDate = LocalDate.of(2019, 1, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 5, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidatorSpy.validateResourceRequestWorkPackageDateChecks(startDateRange, endDateRange, startDate,
          endDate, entityName);
      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES);
    }

    @Test
    @DisplayName("Check if End date later than end date Range fails the validation")
    public void validateEndDateLaterThanEndDateRangeFailure() {

      final LocalDate startDate = LocalDate.of(2019, 2, 1);
      final LocalDate startDateRange = LocalDate.of(2019, 1, 1);
      final LocalDate endDate = LocalDate.of(2019, 6, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 5, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidatorSpy.validateResourceRequestWorkPackageDateChecks(startDateRange, endDateRange, startDate,
          endDate, entityName);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES);
    }

    @Test
    @DisplayName("Check if both Start and End date falling outside of date Ranges fails the validation")
    public void validateStartEndDateOutsideDateRangeFailure() {

      final LocalDate startDate = LocalDate.of(2019, 1, 1);
      final LocalDate startDateRange = LocalDate.of(2019, 2, 1);
      final LocalDate endDate = LocalDate.of(2019, 5, 3);
      final LocalDate endDateRange = LocalDate.of(2019, 4, 3);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);

      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      resourceRequestValidatorSpy.validateResourceRequestWorkPackageDateChecks(startDateRange, endDateRange, startDate,
          endDate, entityName);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_RANGES);
    }
  }

  @Nested
  @DisplayName("Validate employee existence")
  class ValidateEmployeeIDExistence {
    @Test
    @DisplayName("Check if existing Resource Manager Id or Processor Id passesthe validation")
    public void validateResourceManagerIdExistenceSuccess() {

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      resourceRequestValidator.validateEmployeeExist(ResourceRequestValidatorImplTest.EMPLOYEE_ID);

    }

    @Test
    @DisplayName("Check if an non-existing Resource Manager Id or Processor Id fails the validation")
    public void validateResourceManagerIdNonExistenceFailure() {

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> resourceRequestValidator.validateEmployeeExist(ResourceRequestValidatorImplTest.EMPLOYEE_ID));
      assertAll(() -> assertEquals(ErrorStatuses.NOT_FOUND, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.INVALID_EMPLOYEE_ID, exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Validate Resource Request Unit")
  class ValidateResourceRequestUnit {

    @Test
    @DisplayName("Check if valid Unit of Measure of Resource Request passes the validation")
    public void validateResourceRequestUOM() {

      resourceRequestValidator.validateResourceRequestRequestedUnit(ResourceRequestValidatorImplTest.VALID_UNIT);

      verify(messages, times(0)).error(MessageKeys.INVALID_UOM);
    }

    @Test
    @DisplayName("Check if invalid Unit of Measure of Resource Request is passed")
    public void validateInvalidResourceRequestUOM() {

      resourceRequestValidator.validateResourceRequestRequestedUnit(ResourceRequestValidatorImplTest.INVALID_UNIT);

      verify(messages, times(1)).error(MessageKeys.INVALID_UOM, ResourceRequestValidatorImplTest.INVALID_UNIT);

    }
  }

  @Nested
  @DisplayName("Validate Requested Resource Organization existence")
  class ValidateRequestedResourceOrgExistence {
    @Test
    @DisplayName("Check if an existing resource organization passes the validation")
    public void validateResourceOrganizationExistenceSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedResourceOrgId(ResourceRequestValidatorImplTest.RESOURCE_ORG_ID);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      resourceRequestValidator.validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(),
          ENTITY_NAME);

      verify(messages, times(0)).error(MessageKeys.INVALID_RESOURCEORGANIZATION,
          resourceRequest.getRequestedResourceOrgId());
    }

    @Test
    @DisplayName("Check if an non-existing resource organization fails the validation")
    public void validateResourceOrganizationNonExistenceFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedResourceOrgId(ResourceRequestValidatorImplTest.RESOURCE_ORG_ID);
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      resourceRequestValidator.validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(),
          ENTITY_NAME);

      verify(messages, times(1)).error(MessageKeys.INVALID_RESOURCEORGANIZATION,
          resourceRequest.getRequestedResourceOrgId());
    }

  }

  @Nested
  @DisplayName("Validate Processing Resource Organization existence")
  class ValidateProcessingResourceOrgExistence {
    @Test
    @DisplayName("Check if an existing resource organization passes the validation")
    public void validateResourceOrganizationExistenceSuccess() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedResourceOrgId(ResourceRequestValidatorImplTest.RESOURCE_ORG_ID);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      resourceRequestValidator.validateProcessingResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId());

    }

    @Test
    @DisplayName("Check if an non-existing resource organization fails the validation")
    public void validateResourceOrganizationNonExistenceFailure() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedResourceOrgId(ResourceRequestValidatorImplTest.RESOURCE_ORG_ID);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      ServiceException exception = assertThrows(ServiceException.class, () -> resourceRequestValidator
          .validateProcessingResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId()));

      assertAll(() -> assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus()),
          () -> assertEquals((MessageKeys.INVALID_RESOURCEORGANIZATION), exception.getMessage()));
    }

    @Test
    @DisplayName("Check if resource organization is null")
    public void validateResourceOrganizationIfNull() {

      final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setRequestedResourceOrgId(ResourceRequestValidatorImplTest.RESOURCE_ORG_ID);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      ServiceException exception = assertThrows(ServiceException.class,
          () -> resourceRequestValidator.validateProcessingResourceOrganizationExist(null));

      assertAll(() -> assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus()),
          () -> assertEquals((MessageKeys.INVALID_RESOURCEORGANIZATION), exception.getMessage()));
    }

  }

  @Nested
  @DisplayName("Check Resource Request for Demand")
  class GetResourceRequestForDemand {
    @Test
    @DisplayName("Check if method: getResourceRequestIdForDemand() return resourceRequestId of a passed demand, if there is already resourceRrequest exists for the demand")
    public void checkExistingResourceRequestForDemand() {

      final ResourceRequests resourceRequestExpected = Struct.create(ResourceRequests.class);
      resourceRequestExpected.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);

      /* Mock Result object */
      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequestExpected);

      final String resourceRequestId = resourceRequestValidator
          .getResourceRequestIdForDemand((ResourceRequestValidatorImplTest.DEMAND_ID));

      assertEquals(resourceRequestId, resourceRequestExpected.getId(),
          "Expected to return resourceRequest but failed to return");

    }

    @Test
    @DisplayName("Check if method: getResourceRequestForDemand() returns dummyResourceRequest object, if there are no resourceRequest exists for the demand")
    public void checkNonExistingResourceRequestForDemand() {

      /* Mock Result object */
      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      final String resourceRequestId = resourceRequestValidator
          .getResourceRequestIdForDemand((ResourceRequestValidatorImplTest.DEMAND_ID));

      assertEquals(null, resourceRequestId, "Expected to return dummy object but failed");

    }

    @Test
    @DisplayName("Validate if resource requests already exists for the demand throws error with expected error code")
    public void validateResourceRequestExistingForDemandThrowsError() {

      final ResourceRequests resourceRequestExpected = Struct.create(ResourceRequests.class);
      resourceRequestExpected.setId(ResourceRequestValidatorImplTest.RESOURCE_REQUEST_ID);

      /* Mock Result object */
      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequestExpected);

      resourceRequestValidator.checkResourceRequestExistsForDemand(ResourceRequestValidatorImplTest.DEMAND_ID);

      verify(messages, times(1)).error(MessageKeys.RESOURCE_REQUEST_EXISTS);

    }

    @Test
    @DisplayName("Validate if there are no resource request for demand, then no error message is thrown")
    public void validateResourceRequestNotExistingForDemandDoesNotThrowsError() {

      /* Mock Result object */
      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      resourceRequestValidator.checkResourceRequestExistsForDemand(ResourceRequestValidatorImplTest.DEMAND_ID);
      verify(messages, times(0)).error(MessageKeys.RESOURCE_REQUEST_EXISTS);
    }
  }

  @Nested
  @DisplayName("Check Resource Request Staffing")
  class CheckResourceRequestStaffing {
    @Test
    @DisplayName("Check Staffing does not exist for Resource Request")
    public void checkResourceRequestStaffingNotExist() {

      /*
       * Prepare stub to test
       */

      final StaffingStatuses staffingStausPayload = Struct.create(StaffingStatuses.class);

      staffingStausPayload.setStaffingCode(NOT_STAFFED);

      final Optional<StaffingStatuses> staffingStatus = Optional.of(staffingStausPayload);

      /*
       * Mock result data and cqn
       */

      mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.first(StaffingStatuses.class)).thenReturn(staffingStatus);

      /*
       * Call the CUT
       */

      resourceRequestValidator.checkResourceRequestStaffing(RESOURCE_REQUEST_ID);

    }

    @Test
    @DisplayName("Check Staffing exist for Resource Request")
    public void checkResourceRequestStaffingExist() {

      /*
       * Prepare stub to test
       */

      final StaffingStatuses staffingStausPayload = Struct.create(StaffingStatuses.class);

      staffingStausPayload.setStaffingCode(STAFFED);

      final Optional<StaffingStatuses> staffingStatus = Optional.of(staffingStausPayload);

      /*
       * Mock result data and cqn
       */

      mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.first(StaffingStatuses.class)).thenReturn(staffingStatus);

      /*
       * Call the CUT
       */

      /*
       * Call the CUT and validate exception message
       */

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> resourceRequestValidator.checkResourceRequestStaffing(RESOURCE_REQUEST_ID));
      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.STAFF_EXISTS, exception.getMessage()));

    }

    @Test
    @DisplayName("Check if Service Exception is thrown when Staffing Status result is null")
    public void checkResourceRequestStaffingServiceException() {

      /*
       * Mock result data
       */

      mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> resourceRequestValidator.checkResourceRequestStaffing(RESOURCE_REQUEST_ID));

      assertAll(() -> assertEquals(ErrorStatuses.NOT_FOUND, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.INVALID_RESOURCE_REQUEST, exception.getMessage()));

    }
  }

  @Nested
  @DisplayName("Check Resource Request Update and delete")
  class checkResourceRequestDeleteUpdate {

    private ResourceRequests mockResourceRequest;
    private ResourceRequestValidatorImpl spy;

    @BeforeEach
    public void setup() {
      mockResourceRequest = Struct.create(ResourceRequests.class);
      mockResourceRequest.setId(RESOURCE_REQUEST_ID);
      spy = spy(resourceRequestValidator);
    }

    @Test
    @DisplayName("Update: Not Published and Open")
    public void checkUpdateNotPublishedAndOpen() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);
      spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_UPDATE);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(RESOURCE_REQUEST_ID);
    }

    @Test
    @DisplayName("Update: Not Published and Resolved")
    public void checkUpdateNotPublishedAndResolved() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_RESOLVE);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_UPDATE));

      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION, exception.getMessage()));

    }

    @Test
    @DisplayName("Update: Published and Open")
    public void checkUpdatePublishedAndOpen() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_PUBLISH);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);
      spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_UPDATE);

      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(RESOURCE_REQUEST_ID);
    }

    @Test
    @DisplayName("Update: Published and Resolved")
    public void checkUpdatePublishedAndResolved() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_PUBLISH);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_RESOLVE);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_UPDATE));

      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION, exception.getMessage()));

    }

    @Test
    @DisplayName("Delete: Not Published and Open")
    public void checkDeleteNotPublishedAndOpen() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);
      spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_DELETE);
      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(RESOURCE_REQUEST_ID);
    }

    @Test
    @DisplayName("Delete: Not Published and Resolved")
    public void checkDeleteNotPublishedAndResolved() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_RESOLVE);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_DELETE));

      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION, exception.getMessage()));
    }

    @Test
    @DisplayName("Delete: Published and Open")
    public void checkDeletePublishedAndOpen() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_PUBLISH);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_DELETE));

      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.PUBLISHING_STATUS_PUBLISH_OPERATION, exception.getMessage()));
    }

    @Test
    @DisplayName("Delete: Published and Resolved")
    public void checkDeletePublishedAndResolved() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_PUBLISH);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_RESOLVE);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_DELETE));

      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION, exception.getMessage()));
    }

    @Test
    @DisplayName("Delete for S4 resource request")
    public void checkDeleteS4RR() {
      mockResourceRequest.setIsS4Cloud(true);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_DELETE));

      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.INVALID_DELETE_FOR_S4_RR, exception.getMessage()));
    }

    @Test
    @DisplayName("Delete for Non S4 resource request")
    public void checkDeleteNonS4RR() {
      mockResourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
      mockResourceRequest.setRequestStatusCode(Constants.REQUEST_OPEN);
      mockResourceRequest.setIsS4Cloud(false);

      when(mockResourceRequestHelper.selectResourceRequest(RESOURCE_REQUEST_ID)).thenReturn(mockResourceRequest);

      spy.checkResourceRequestDeleteUpdate(mockResourceRequest.getId(), CqnService.EVENT_DELETE);
      verify(mockResourceRequestHelper, times(1)).selectResourceRequest(RESOURCE_REQUEST_ID);
    }

  }

  @Nested
  @DisplayName("Check publish-withdraw allowed")
  class CheckPublishWithdrawAllowed {
    @Test
    @DisplayName("If Resource Request is in draft state exception must be thrown")
    public void checkPublishWithdrawAllowedOnActive() {

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> resourceRequestValidator.checkPublishWithdrawAllowed(DRAFT));

      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.METHOD_NOT_ALLOWED, exception.getMessage()));

    }
  }

  @Nested
  @DisplayName("Validate Processing Resource Org")
  class ValidateProcessingResourceOrg {

    @Test
    @DisplayName("Validate Processing Resource Org on Forward-Successful case. Forward to different Resource org when no assignments exists")
    public void updateProcessingResOrgNoAssignmentExistSuccessTest() {

      /** Prepare stub to test */

      final StaffingStatuses staffingStausPayload = Struct.create(StaffingStatuses.class);

      staffingStausPayload.setStaffingCode(NOT_STAFFED);

      final Optional<StaffingStatuses> staffingStatus = Optional.of(staffingStausPayload);

      /** Mock result data and cqn */

      mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.first(StaffingStatuses.class)).thenReturn(staffingStatus);

      resourceRequestValidator.validateProcessingResourceOrgUpdation(RESOURCE_REQUEST_ID, "ORG_US", "ORG_IN");
    }

    @Test
    @DisplayName("Validate Processing Resource Org on Forward - Successful case. Forward to same Resource org when some assignments exits")
    public void updateProcessingResOrgAssignmentExistSuccessTest() {

      /** Prepare stub to test */

      final StaffingStatuses staffingStausPayload = Struct.create(StaffingStatuses.class);

      staffingStausPayload.setStaffingCode(STAFFED);

      final Optional<StaffingStatuses> staffingStatus = Optional.of(staffingStausPayload);

      /** Mock result data and cqn */

      mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.first(StaffingStatuses.class)).thenReturn(staffingStatus);

      resourceRequestValidator.validateProcessingResourceOrgUpdation(RESOURCE_REQUEST_ID, "ORG_US", "ORG_US");

    }

    @Test
    @DisplayName("Validate Processing Resource Org on Forward - Negative case. Forward to different Resource org when some assignments exits")
    public void updateProcessingResOrgAssignmentExistNegativeTest() {

      /** Prepare stub to test */

      final StaffingStatuses staffingStausPayload = Struct.create(StaffingStatuses.class);

      staffingStausPayload.setStaffingCode(STAFFED);

      final Optional<StaffingStatuses> staffingStatus = Optional.of(staffingStausPayload);

      /** Mock result data and cqn */

      mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.first(StaffingStatuses.class)).thenReturn(staffingStatus);

      /** Call the CUT and validate exception message */

      final ServiceException exception = assertThrows(ServiceException.class, () -> resourceRequestValidator
          .validateProcessingResourceOrgUpdation(RESOURCE_REQUEST_ID, "ORG_US", "ORG_IN"));
      assertAll(() -> assertEquals(ErrorStatuses.METHOD_NOT_ALLOWED, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.CHANGE_PROCESSING_RESOURCEORG_OPERATION, exception.getMessage()));
    }

  }

  @Nested
  @DisplayName("Validate the user authorizations")
  class ValidateUserAuthorization {

    private String orgId = "Org_1";

    @Test
    @DisplayName("Validate Method :getCommonCostCenters() returns common cost center between user profile and Resource organization")
    void validateCommonCostCentersReturned() {
      /** Mock result data and cqn */

      final Row mockRow = mock(Row.class);
      Collection<Row> rows = new ArrayList<Row>();
      rows.add(mockRow);
      Result result = ResultBuilder.selectedRows((List<? extends Map<String, ?>>) rows).result();

      final Stream<String> uaaCostCenters = Stream.of("CCIN", "CCUS");

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(result);
      when(mockRow.get("costCenterId")).thenReturn("CCIN");

      final List<String> commonCostCenters = resourceRequestValidator.getCommonCostCenters(uaaCostCenters, orgId);

      assertEquals(1, commonCostCenters.size(), "Failed to return common cost centres");
      assertEquals(true, commonCostCenters.contains("CCIN"), "Failed to return common cost centres");

    }

    @Test
    @DisplayName("Validate Method :getCommonCostCenters() returns all the costcenters of Resource organization if user profile does not have cost center assigned")
    void validateUserProfileWithNoCostCenter() {
      /** Mock result data and cqn */

      final Row mockRow = mock(Row.class);
      Collection<Row> rows = new ArrayList<Row>();
      rows.add(mockRow);
      Result result = ResultBuilder.selectedRows((List<? extends Map<String, ?>>) rows).result();

      final Stream<String> uaaCostCenters = Stream.of();

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(result);
      when(mockRow.get("costCenterId")).thenReturn("CCIN");

      final List<String> commonCostCenters = resourceRequestValidator.getCommonCostCenters(uaaCostCenters, orgId);

      assertEquals(1, commonCostCenters.size(), "Failed to return common cost centes");
      assertEquals(true, commonCostCenters.contains("CCIN"), "Failed to return common cost centes");

    }

    @Test
    @DisplayName("Validate if user does not have sufficient authorization boolean false is passed")
    void validateUserAuthorization() {
      final List<String> resOrgs = new ArrayList<String>() {
        {
          add("RORG1");
        }
      };
      Boolean isAuthorized = resourceRequestValidator.isUserAuthorizedForTheAction(resOrgs, orgId);
      assertEquals(false, isAuthorized, "Validation of authorization failed");
    }
  }

  @Nested
  @DisplayName("Validate S4Cloud Specefic Checks")
  class S4CloudSpeceficChecks {

    @Test
    @DisplayName("Work Package exists")
    void validateS4CloudSpecificChecksWhenWorkPackageExists() {
      Demands demand = Struct.create(Demands.class);
      ResourceRequests resourceRequests = Struct.create(ResourceRequests.class);
      WorkPackages workPackages = Struct.create(WorkPackages.class);
      String entityName = ResourceRequests_.CDS_NAME;

      LocalDate rrStartDate = LocalDate.of(2020, 1, 1);
      LocalDate rrEndDate = LocalDate.of(2021, 1, 1);
      LocalDate wpStartDate = LocalDate.of(2022, 1, 1);
      LocalDate wpEndDate = LocalDate.of(2023, 1, 1);

      demand.setId("DemandID");
      resourceRequests.setDemandId(demand.getId());
      resourceRequests.setStartDate(rrStartDate);
      resourceRequests.setEndDate(rrEndDate);

      workPackages.setStartDate(wpStartDate);
      workPackages.setEndDate(wpEndDate);
      demand.setWorkPackage(workPackages);

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      doReturn(demand).when(resourceRequestValidatorSpy).validateDemandIdExist(resourceRequests.getDemandId());

      resourceRequestValidatorSpy.validateS4CloudSpecificChecks(resourceRequests, entityName);

      verify(resourceRequestValidatorSpy, times(1)).validateResourceRequestDates(rrStartDate, rrEndDate, wpStartDate,
          wpEndDate, entityName);
    }

    @Test
    @DisplayName("Work Package does not exists")
    void validateS4CloudSpecificChecksWhenWorkPackageDoesNotExists() {
      Demands demand = Struct.create(Demands.class);
      ResourceRequests resourceRequests = Struct.create(ResourceRequests.class);
      String entityName = ResourceRequests_.CDS_NAME;

      demand.setId("DemandID");
      resourceRequests.setDemandId(demand.getId());

      ResourceRequestValidatorImpl resourceRequestValidatorSpy = spy(resourceRequestValidator);
      doReturn(demand).when(resourceRequestValidatorSpy).validateDemandIdExist(resourceRequests.getDemandId());

      resourceRequestValidatorSpy.validateS4CloudSpecificChecks(resourceRequests, entityName);

      verify(resourceRequestValidatorSpy, times(0)).validateResourceRequestDates(any(), any(), any(), any(), any());
    }
  }

  @Nested
  @DisplayName("Validate S4Cloud Specefic Checks")
  class ValidateResourceRequestDatesBasicChecks {

    @Test
    @DisplayName("start date is null")
    void startDateisNull() {
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());
      resourceRequestValidator.validateResourceRequestDatesBasicChecks(null, LocalDate.of(2020, 1, 1), entityName);
      verify(messages, times(1)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
    }

    @Test
    @DisplayName("end date is null")
    void endDateisNull() {
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());
      resourceRequestValidator.validateResourceRequestDatesBasicChecks(LocalDate.of(2020, 1, 1), null, entityName);
      verify(messages, times(1)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
    }

    @Test
    @DisplayName("start date is after End Date")
    void startDateisAfterEndDAteisNull() {
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      doReturn("").when(mockPropertyMapping).getTargetForServiceAndField(any(), any());
      resourceRequestValidator.validateResourceRequestDatesBasicChecks(LocalDate.of(2021, 1, 1),
          LocalDate.of(2020, 1, 1), entityName);
      verify(messages, times(0)).error(MessageKeys.NULL_START_DATE);
      verify(messages, times(0)).error(MessageKeys.NULL_END_DATE);
      verify(messages, times(1)).error(MessageKeys.INVALID_DATES);
    }

    @Test
    @DisplayName("dates are valid.")
    void PositiveCase() {
      String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;
      resourceRequestValidator.validateResourceRequestDatesBasicChecks(LocalDate.of(2019, 1, 1),
          LocalDate.of(2020, 1, 1), entityName);
      verifyNoInteractions(messages);
    }
  }

  @Nested
  @DisplayName("Validate name")
  class ValidateName {
    final String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;

    @Test
    @DisplayName("Null name")
    void nullName() {
      resourceRequestValidator.validateResourceRequestNameInputValidation(null, entityName);
      verify(messages, times(1)).error(MessageKeys.NULL_NAME);
    }

    @Test
    @DisplayName("Empty name")
    void emptyName() {
      resourceRequestValidator.validateResourceRequestNameInputValidation("", entityName);
      verify(messages, times(1)).error(MessageKeys.NULL_NAME);
    }

    @Test
    @DisplayName("Empty spaces only in name")
    void emptyNameWithSpaces() {
      resourceRequestValidator.validateResourceRequestNameInputValidation("      ", entityName);
      verify(messages, times(1)).error(MessageKeys.NULL_NAME);
    }
  }

  @Nested
  class validateResReqAttributesForXSSFormulaInjection {
    @Test
    @DisplayName("check if the validation is passed when the fields do not contain html tags")
    void validateForInjectionWithNoTagsInResReqtexts() {

      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setName("name");
      resourceRequest.setDescription("description");

      resourceRequestValidator.validateForInjection(resourceRequest);
      verify(messages, times(0)).error(any(), any());
    }

    @Test
    @DisplayName("check if the validation fails when the resource request name contains a script tag")
    void validateForInjectionWithTagInResReqName() {
      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setName(EVIL_SCRIPT_TAG);
      resourceRequestValidator.validateForInjection(resourceRequest);
      verify(messages, times(1)).error(eq(MessageKeys.RESREQ_CONTAINS_HTML_TAG));
    }

    @Test
    @DisplayName("check if the validation fails when the resource request description contains a script tag")
    void validateForInjectionWithTagResReqDesc() {
      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDescription(EVIL_SCRIPT_TAG);
      resourceRequestValidator.validateForInjection(resourceRequest);
      verify(messages, times(1)).error(eq(MessageKeys.RESREQ_CONTAINS_HTML_TAG));
    }

    @Test
    @DisplayName("check if the validation fails when a required skill comment contains a script tag")
    void validateForInjectionWithTagInReqSkillComment() {
      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setName(EVIL_SCRIPT_TAG);
      SkillRequirements skillReqmnt = Struct.create(SkillRequirements.class);
      ;
      skillReqmnt.setSkillId("skillid");
      skillReqmnt.setComment(EVIL_SCRIPT_TAG);
      List<SkillRequirements> skillReqmnts = new ArrayList<>();
      skillReqmnts.add(skillReqmnt);
      resourceRequest.setSkillRequirements(skillReqmnts);

      resourceRequestValidator.validateForInjection(resourceRequest);
      verify(messages, times(2)).error(eq(MessageKeys.RESREQ_CONTAINS_HTML_TAG));
    }

    @Test
    @DisplayName("check if the validation fails when the Resource Request name, description and required skill comment contains a forbidden first character")
    void validateForInjectionWithForbiddenFirstCharacter() {
      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setId("RID");
      resourceRequest.setName(EVIL_CSV);
      resourceRequest.setDescription(EVIL_CSV);
      SkillRequirements skillReqmnt = Struct.create(SkillRequirements.class);
      ;
      skillReqmnt.setSkillId("skillid");
      skillReqmnt.setComment(EVIL_CSV);
      List<SkillRequirements> skillReqmnts = new ArrayList<>();
      skillReqmnts.add(skillReqmnt);
      resourceRequest.setSkillRequirements(skillReqmnts);

      resourceRequestValidator.validateForInjection(resourceRequest);
      verify(messages, times(3)).error(eq(MessageKeys.FORBIDDEN_FIRST_CHARACTER_RESREQ));
    }

    @Test
    @DisplayName("get correct message key for html injection")
    void getMessageKeyForHtmlInjection() {
      String messageKey = resourceRequestValidator.getMessageKeyForHtmlInjection();
      assertEquals(MessageKeys.RESREQ_CONTAINS_HTML_TAG, messageKey);
    }

    @Test
    @DisplayName("get correct message key for csv injection")
    void getMessageKeyForCsvInjection() {
      String messageKey = resourceRequestValidator.getMessageKeyForCsvInjection();
      assertEquals(MessageKeys.FORBIDDEN_FIRST_CHARACTER_RESREQ, messageKey);
    }
  }

  @Nested
  class ValidateCheckAssignmentProposalExists {
    @Test
    public void testCheckAssignmentProposalExistsOnSuccess() {
      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      Staffing mockStaffing = Staffing.create();
      Result mockResult = mock(Result.class);

      List<Staffing> mockStaffingList = new ArrayList<>();

      mockStaffing.setAssignmentStatusCode(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE);
      mockStaffingList.add(mockStaffing);

      when(mockResourceRequest.getId()).thenReturn("16b79902-afa0-4bef-9658-98cd8d671212");
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockStaffingList);

      resourceRequestValidator.checkAssignmentProposalExists(mockResourceRequest);

      // Verify that error message is not thrown when Assignment Status is Rejected
      verify(messages, times(0)).throwIfError();
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

    }

    @Test
    public void testCheckAssignmentProposalExistsOnError() {
      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      Staffing mockStaffing1 = Staffing.create();
      Staffing mockStaffing2 = Staffing.create();
      Result mockResult = mock(Result.class);

      List<Staffing> mockStaffingList = new ArrayList<>();

      mockStaffing1.setAssignmentStatusCode(Constants.AssignmentStatus.PROPOSAL_ASSIGNMENT_STATUS_CODE);
      mockStaffing2.setAssignmentStatusCode(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE);
      mockStaffingList.add(mockStaffing1);
      mockStaffingList.add(mockStaffing2);

      when(mockResourceRequest.getId()).thenReturn("16b79902-afa0-4bef-9658-98cd8d671212");
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockStaffingList);

      resourceRequestValidator.checkAssignmentProposalExists(mockResourceRequest);

      // Verify that error is thrown when one of the Assignment status is Proposed.
      verify(messages, times(1)).throwIfError();
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

    }
  }

  @Nested
  @DisplayName("Test ValidateReferenceObjectIfTypeNone method. ")
  public class ValidateReferenceObjectIfTypeNoneTest {

    @Test
    public void validateWhenTypeCodeNotEqualsNone() {
      ResourceRequestValidatorImpl spy = spy(resourceRequestValidator);

      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      mockResourceRequest.setReferenceObjectTypeCode(1);

      // Call to the Method being tested
      spy.validateReferenceObjectIfTypeNone(mockResourceRequest);

      // Verify if validateIfReferenceObjectMapped not called.
      verify(spy, times(0)).validateIfReferenceObjectMapped(mockResourceRequest);
    }

    @Test
    public void validateWhenTypeCodeEqualsNone() {
      ResourceRequestValidatorImpl spy = spy(resourceRequestValidator);

      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      doReturn(1).when(mockResourceRequest).getReferenceObjectTypeCode();

      // Call to the Method being tested
      spy.validateReferenceObjectIfTypeNone(mockResourceRequest);

      // Verify if validateIfReferenceObjectMapped not called.
      verify(spy, times(1)).validateIfReferenceObjectMapped(mockResourceRequest);
    }
  }

  @Nested
  public class ValidateIfReferenceObjectMappedTest {

    @Test
    public void validateWhenReferenceObjectIdIsNull() {

      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);

      doReturn(null).when(mockResourceRequest).getReferenceObjectId();

      // Call to the method to be tested.
      resourceRequestValidator.validateIfReferenceObjectMapped(mockResourceRequest);

      // Verify if error is thrown
      verify(messages, times(1)).error(MessageKeys.NULL_REFERENCE_OBJECT);
    }

    @Test
    public void validateWhenReferenceObjectIdIsNotNull() {

      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);

      doReturn("dummyUUID").when(mockResourceRequest).getReferenceObjectId();

      resourceRequestValidator.validateIfReferenceObjectMapped(mockResourceRequest);

      verify(messages, times(0)).error(MessageKeys.NULL_REFERENCE_OBJECT);
    }
  }

  @Nested
  class ValidateReferenceObjAssignedToResReqTest {

    @Test
    public void validateOnCreateRRWithRefObjSuccessScenario() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);

      resourcerequestservice.ResourceRequests mockResourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      mockResourceRequest.setReferenceObjectId("UUID");

      doNothing().when(spyOfMock).refIntegrityCheckForRefObject(mockResourceRequest.getReferenceObjectId());

      spyOfMock.validateReferenceObjAssignedToResourceRequest(mockResourceRequest, CqnService.EVENT_CREATE);

      verify(spyOfMock, times(1)).refIntegrityCheckForRefObject(mockResourceRequest.getReferenceObjectId());
      verify(messages, times(0)).error(MessageKeys.INVALID_REFERENCETYPE_CODE);
    }

    @Test
    public void validateOnUpdateRRWithRefObjSuccessScenario() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);

      resourcerequestservice.ResourceRequests mockResourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      mockResourceRequest.setReferenceObjectId("UUID");

      doNothing().when(spyOfMock).refIntegrityCheckForRefObject(mockResourceRequest.getReferenceObjectId());

      spyOfMock.validateReferenceObjAssignedToResourceRequest(mockResourceRequest, CqnService.EVENT_UPDATE);

      verify(spyOfMock, times(1)).refIntegrityCheckForRefObject(mockResourceRequest.getReferenceObjectId());

    }

    @Test
    public void validateOnCreateRRWithRefObjErrorScenario() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);

      resourcerequestservice.ResourceRequests mockResourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      mockResourceRequest.setReferenceObjectId(null);

      doNothing().when(spyOfMock).refIntegrityCheckForRefObject(mockResourceRequest.getReferenceObjectId());

      spyOfMock.validateReferenceObjAssignedToResourceRequest(mockResourceRequest, CqnService.EVENT_CREATE);

      verify(spyOfMock, times(0)).refIntegrityCheckForRefObject(mockResourceRequest.getReferenceObjectId());
    }

  }

  @Nested
  class RefIntegrityCheckForRefObjectTest {
    @Test
    public void ValidateUpdateReferenceObjectTypeCodeOnErrorScenario() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);

      Result mockResult = mock(Result.class);
      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(0L);

      spyOfMock.refIntegrityCheckForRefObject("f776eb80-5b3a-4af9-ac42-79dc1a792ef3");

      // Assert error message thrown
      verify(messages, times(1)).error(MessageKeys.INVALID_REFERENCEOBJECT);
      verify(spyOfMock, times(0)).refIntegrityCheckForRefObject(mockResourceRequest.getReferenceObjectId());
    }

    @Test
    public void ValidateUpdateReferenceObjectTypeCodeOnSuccessScenario() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(10L);

      spyOfMock.refIntegrityCheckForRefObject("f776eb80-5b3a-4af9-ac42-79dc1a792ef3");

      // Assert error message not thrown
      verify(messages, times(0)).error(MessageKeys.INVALID_REFERENCEOBJECT);

    }
  }

  @Nested
  class ValidateRRDateChange {

    @Test
    public void testWhenNoChangeInDate() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);

      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      when(mockResourceRequest.getId()).thenReturn("mockUUID");
      when(mockResourceRequest.getStartDate()).thenReturn(LocalDate.of(2023, 1, 20));
      when(mockResourceRequest.getEndDate()).thenReturn(LocalDate.of(2023, 1, 20));

      doReturn(mockResourceRequest).when(mockResourceRequestHelper).selectResourceRequest("mockUUID");

      spyOfMock.validateRRDateChange(mockResourceRequest);

      // Verify ValidateAssignment exists not called, when no change in date.
      verify(spyOfMock, times(0)).validateIfAssignmentExists(mockResourceRequest);

    }

    @Test
    public void testWhenChangeInDateIsThere() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);

      ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
      when(mockResourceRequest.getId()).thenReturn("mockUUID");
      when(mockResourceRequest.getStartDate()).thenReturn(LocalDate.of(2023, 1, 20));
      when(mockResourceRequest.getEndDate()).thenReturn(LocalDate.of(2023, 1, 20));

      ResourceRequests mockResourceRequest2 = mock(ResourceRequests.class);
      when(mockResourceRequest2.getStartDate()).thenReturn(LocalDate.of(2022, 11, 20));
      when(mockResourceRequest2.getEndDate()).thenReturn(LocalDate.of(2023, 1, 20));

      doReturn(mockResourceRequest2).when(mockResourceRequestHelper).selectResourceRequest("mockUUID");

      spyOfMock.validateRRDateChange(mockResourceRequest);

      // Verify ValidateAssignment exists not called, when no change in date.
      verify(spyOfMock, times(1)).validateIfAssignmentExists(mockResourceRequest);

    }
  }

  @Nested
  class ValidateAssignmentExists {

    @Test
    @DisplayName("When Assignment Start Date is Before Resource Request Start date")
    public void validateIfAssignmentPresentAndStartDateBefore() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);
      List<Staffing> mockList = new ArrayList<>();
      Staffing mockStaffing1 = Struct.create(Staffing.class);
      mockList.add(mockStaffing1);
      mockStaffing1.setStartDate(LocalDate.of(2023, 2, 10)); // Setting start date of assignment before start date of
                                                             // resource request
      mockStaffing1.setEndDate(LocalDate.of(2023, 3, 30));
      ResourceRequests mockResourceRequest = Struct.create(ResourceRequests.class);
      mockResourceRequest.setStartDate(LocalDate.of(2023, 2, 15));
      mockResourceRequest.setEndDate(LocalDate.of(2023, 3, 31));

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockList);

      spyOfMock.validateIfAssignmentExists(mockResourceRequest);

      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_EDIT);

    }

    @Test
    @DisplayName("When Assignment End Date is After Resource Request End date")
    public void validateIfAssignmentPresentAndEndDateAfter() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);
      List<Staffing> mockList = new ArrayList<>();
      Staffing mockStaffing1 = Struct.create(Staffing.class);
      mockList.add(mockStaffing1);
      mockStaffing1.setStartDate(LocalDate.of(2023, 2, 10)); // Setting start date of assignment before start date of
                                                             // resource request
      mockStaffing1.setEndDate(LocalDate.of(2023, 3, 30));
      ResourceRequests mockResourceRequest = Struct.create(ResourceRequests.class);
      mockResourceRequest.setStartDate(LocalDate.of(2023, 2, 1));
      mockResourceRequest.setEndDate(LocalDate.of(2023, 3, 29));

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockList);

      spyOfMock.validateIfAssignmentExists(mockResourceRequest);

      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_EDIT);

    }

    @Test
    @DisplayName("When assignment date is not in range of RR dates")
    public void validateWrongRRDate() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);
      List<Staffing> mockList = new ArrayList<>();
      Staffing mockStaffing1 = Struct.create(Staffing.class);
      mockList.add(mockStaffing1);
      mockStaffing1.setStartDate(LocalDate.of(2023, 2, 10)); // Setting start date of assignment before start date of
                                                             // resource request
      mockStaffing1.setEndDate(LocalDate.of(2023, 3, 30));
      ResourceRequests mockResourceRequest = Struct.create(ResourceRequests.class);
      mockResourceRequest.setStartDate(LocalDate.of(2023, 2, 15));
      mockResourceRequest.setEndDate(LocalDate.of(2023, 3, 29));

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockList);

      spyOfMock.validateIfAssignmentExists(mockResourceRequest);

      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_EDIT);

    }

    @Test
    @DisplayName("When assignment does Not exist")
    public void validateWhenAssignmentNotPresent() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);
      List<Staffing> mockList = new ArrayList<>();

      ResourceRequests mockResourceRequest = Struct.create(ResourceRequests.class);

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockList);

      spyOfMock.validateIfAssignmentExists(mockResourceRequest);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATE_EDIT);

    }
  }

  @Nested
  class ValidateRRDateChangeWhenPublishedAPI {
    @Test
    @DisplayName("When assignment does Not exist")
    public void validateWhenStaffingDetailsNotPresent() {
      ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);
      List<Staffing> mockList = new ArrayList<>();

      resourcerequestservice.ResourceRequests mockResourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockList);

      spyOfMock.validateRRDateChangeWhenPublishedAPI(mockResourceRequest);

      verify(messages, times(0)).error(MessageKeys.INVALID_DATE_EDIT);

    }

      @Test
      public void testWhenStartDateIsGreaterThanRR() {
          ResourceRequestValidatorImpl spyOfMock = spy(resourceRequestValidator);
          List<Staffing> mockList = new ArrayList<>();
          Staffing mockStaffing1 = Struct.create(Staffing.class);
          mockList.add(mockStaffing1);
          mockStaffing1.setStartDate(LocalDate.of(2023, 2, 10)); // Setting start date of assignment before start date of
          // resource request
          mockStaffing1.setEndDate(LocalDate.of(2023, 3, 30));
          resourcerequestservice.ResourceRequests mockResourceRequest = Struct.create(resourcerequestservice.ResourceRequests.class);
          mockResourceRequest.setStartDate(LocalDate.of(2023, 2, 15));
          mockResourceRequest.setEndDate(LocalDate.of(2023, 3, 31));

      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(Staffing.class)).thenReturn(mockList);

      spyOfMock.validateRRDateChangeWhenPublishedAPI(mockResourceRequest);

      verify(messages, times(1)).error(MessageKeys.INVALID_DATE_EDIT);
    }
  }
}
