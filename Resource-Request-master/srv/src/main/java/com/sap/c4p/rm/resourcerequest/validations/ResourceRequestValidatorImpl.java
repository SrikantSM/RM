package com.sap.c4p.rm.resourcerequest.validations;

import java.math.BigDecimal;
import java.time.chrono.ChronoLocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
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
import com.sap.c4p.rm.resourcerequest.utils.ValuePath;

import com.sap.resourcemanagement.config.ResourceOrganizationItems_;
import com.sap.resourcemanagement.employee.ProfileData_;
import com.sap.resourcemanagement.resourcerequest.StaffingStatuses;

import manageresourcerequestservice.*;
import resourcerequestservice.ReferenceObjects_;

@Service
public class ResourceRequestValidatorImpl extends InjectionValidator<ResourceRequests, ResourceRequests_>
    implements ResourceRequestValidator {

  private final PersistenceService persistenceService;
  private ResourceRequestSkillsValidator skillValidator;
  private Messages messages;
  private ResourceRequestCapacityValidator capacityValidator;
  private PropertyMapping propertyMapping;
  private ResourceRequestHelper resourceRequestHelper;

  @Autowired
  public ResourceRequestValidatorImpl(final PersistenceService persistenceService,
      ResourceRequestSkillsValidator skillValidator, Messages messages,
      ResourceRequestCapacityValidator capacityValidator, PropertyMapping propertyMapping,
      ResourceRequestHelper resourceRequestHelper) {
    super(messages, ResourceRequests_.class);
    this.persistenceService = persistenceService;
    this.skillValidator = skillValidator;
    this.messages = messages;
    this.capacityValidator = capacityValidator;
    this.propertyMapping = propertyMapping;
    this.resourceRequestHelper = resourceRequestHelper;
  }

  public void validateMandatoryFieldsForCreate(resourcerequestservice.ResourceRequests resourceRequest,
      String entityName) {
    validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);
    validateResourceRequestDatesBasicChecks(resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
    validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
  }

  @Override
  public void validateResourceRequestPropertyApi(resourcerequestservice.ResourceRequests resourceRequest,
      String eventType) {

    String entityName = resourcerequestservice.ResourceRequests_.CDS_NAME;

    // Check mandatory fields for create.
    if (eventType.equals(CqnService.EVENT_CREATE)) {
      validateMandatoryFieldsForCreate(resourceRequest, entityName);
    } else if (eventType.equals(CqnService.EVENT_UPDATE)) {
      ResourceRequests persistedResourceRequest = resourceRequestHelper.selectResourceRequest(resourceRequest.getId());
      if (resourceRequest.containsKey(resourcerequestservice.ResourceRequests.START_DATE)
          || resourceRequest.containsKey(resourcerequestservice.ResourceRequests.END_DATE)) {

        validateResourceRequestApiDatesUpdate(resourceRequest, entityName);

      }
      if (resourceRequest.containsKey(resourcerequestservice.ResourceRequests.REQUIRED_EFFORT)) {
        validateRequestedCapacityValueIsPositive(resourceRequest.getRequiredEffort(), entityName);
      }
      if (resourceRequest.containsKey(resourcerequestservice.ResourceRequests.NAME) && persistedResourceRequest.getReleaseStatusCode() == Constants.REQUEST_WITHDRAW) {
              validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
      }
      if((resourceRequest.containsKey(resourcerequestservice.ResourceRequests.DESCRIPTION) || resourceRequest.containsKey(resourcerequestservice.ResourceRequests.NAME))
          && persistedResourceRequest.getReleaseStatusCode() == Constants.REQUEST_PUBLISH){
          messages.error(MessageKeys.INVALID_UPDATE_PUBLISHED).target(resourcerequestservice.ResourceRequests_.class,
              resourcerequestservice.ResourceRequests_::description);
      }
    }
  }

  public void validateResourceRequestApiDatesUpdate(resourcerequestservice.ResourceRequests resourceRequest,
      String entityName) {

    ResourceRequests persistedResourceRequest = resourceRequestHelper.selectResourceRequest(resourceRequest.getId());

    if (persistedResourceRequest.getIsS4Cloud().equals(true)) {

      /*
       * Update persisted resource request with new dates and check
       */

      if (resourceRequest.getStartDate() != null) {

        persistedResourceRequest.setStartDate(resourceRequest.getStartDate());

      }

      if (resourceRequest.getEndDate() != null) {

        persistedResourceRequest.setEndDate(resourceRequest.getEndDate());

      }

      validateS4CloudSpecificChecks(persistedResourceRequest, entityName);

    } else {

      /*
       * validate basic checks for non s4 requests
       */
      if (resourceRequest.getStartDate() == null) {
        resourceRequest.setStartDate(persistedResourceRequest.getStartDate());
      }

      if (resourceRequest.getEndDate() == null) {
        resourceRequest.setEndDate(persistedResourceRequest.getEndDate());
      }

      validateResourceRequestDatesBasicChecks(resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);

    }

  }

  @Override
  public void validateResourceRequestProperty(ResourceRequests resourceRequest) {

    String entityName = ResourceRequests_.CDS_NAME;

    /*
     * Validate each attributes of resource request
     */
    validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(), resourceRequest.getId());
    validatePriorityCodeExist(resourceRequest.getPriorityCode());
    validateReleaseStatusCodeExist(resourceRequest.getReleaseStatusCode());
    validateRequestStatusCode(resourceRequest.getRequestStatusCode());
    validateResourceRequestRequestedUnit(resourceRequest.getRequestedUnit());
    validateResourceRequestNameInputValidation(resourceRequest.getName(), entityName);
    validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(), entityName);

    /*
     * Validate each attributes of resource request capacities for daily
     * distribution and weekly distribution
     */
    if (resourceRequest.getCapacityRequirements() != null
        && (resourceRequest.getEffortDistributionTypeCode() == Constants.DAILY_HOURS
            || resourceRequest.getEffortDistributionTypeCode() == Constants.WEEKLY_HOURS)) {
      capacityValidator.validateEffortDistributionProperties(resourceRequest);
    }

    validateRequestedCapacityValueIsPositive(resourceRequest.getRequestedCapacity(), entityName);

    if (resourceRequest.getIsS4Cloud().equals(true)) {
      // Validations of dates is called internally.
      validateS4CloudSpecificChecks(resourceRequest, entityName);
    } else {
      // Validations for dates.
      validateResourceRequestDatesBasicChecks(resourceRequest.getStartDate(), resourceRequest.getEndDate(), entityName);
    }

    /*
     * Validate resource request skills (Skills duplicate checks) and skill id check
     * in database
     *
     */

    if (resourceRequest.getSkillRequirements() != null) {

      skillValidator.checkDuplicatesSkillPayload(resourceRequest.getSkillRequirements());
      skillValidator.checkValidSkills(resourceRequest.getSkillRequirements());

    }

    this.validateForInjection(resourceRequest);
  }

  /*
   * S4 specefic check for demand based resource requests.
   */
  public void validateS4CloudSpecificChecks(ResourceRequests resourceRequest, String entityName) {
    Demands demands = validateDemandIdExist(resourceRequest.getDemandId());
    if (demands.getWorkPackage() != null) {
      validateResourceRequestDates(resourceRequest.getStartDate(), resourceRequest.getEndDate(),
          demands.getWorkPackage().getStartDate(), demands.getWorkPackage().getEndDate(), entityName);
    }
  }

  @Override
  public Demands validateDemandIdExist(final String demandId) {

    Demands demands = Struct.create(Demands.class);
    if (demandId != null) {
      CqnSelect select = Select.from(Demands_.class).where(b -> b.ID().eq(demandId)).columns(b -> b._all(),
          b -> b.workPackage().expand(d -> d._all()));
      final Result demand = persistenceService.run(select);

      if (demand.rowCount() == 0) {
        messages.error(MessageKeys.INVALID_DEMAND_ID).target("in", ResourceRequests_.class,
            resourceRequest -> resourceRequest.demand_ID());
      } else {
        demands.putAll(demand.single(Demands.class));
      }
    } else {
      messages.error(MessageKeys.INVALID_DEMAND_ID).target("in", ResourceRequests_.class,
          resourceRequest -> resourceRequest.demand_ID());
    }
    return demands;
  }

  @Override
  public void validateProjectRoleIdIfExists(final String projectRoleId, final String resourceRequestId) {
    if (projectRoleId != null && !projectRoleId.isEmpty()) {
      CqnSelect selectUnrestrictedRole = Select.from(ProjectRoles_.class)
          .where(projectRole -> projectRole.ID().eq(projectRoleId).and(projectRole.roleLifecycleStatus_code().eq(0)))
          .columns(projectRole -> projectRole.ID());
      CqnSelect selectAssignedRequestWithRole = Select.from(ResourceRequests_.class)
          .where(resReq -> resReq.projectRole_ID().eq(projectRoleId).and(resReq.ID().eq(resourceRequestId)))
          .columns(resReq -> resReq.ID());
      final long unrestrictedRowCount = persistenceService.run(selectUnrestrictedRole).rowCount();
      final long assignedRowCount = persistenceService.run(selectAssignedRequestWithRole).rowCount();
      if (unrestrictedRowCount == 0 && assignedRowCount == 0) {
        messages.error(MessageKeys.INVALID_PROJECTROLE_ID).target("in", ResourceRequests_.class,
            resReq -> resReq.projectRole_ID());
      }
    }
  }

  @Override
  public void validatePriorityCodeExist(final Integer priorityCode) {

    if (priorityCode != null) {
      CqnSelect select = Select.from(Priorities_.class).columns(b -> b.code()).where(b -> b.code().eq(priorityCode));
      final long rowCount = persistenceService.run(select).rowCount();
      if (rowCount == 0)
        messages.error(MessageKeys.INVALID_PRIORITY_CODE).target("in", ResourceRequests_.class,
            resourseRequest -> resourseRequest.priority_code());
    }
  }

  @Override
  public void validateReleaseStatusCodeExist(final Integer releaseStatusCode) {

    if (releaseStatusCode != null) {
      CqnSelect select = Select.from(ReleaseStatuses_.class).columns(b -> b.code())
          .where(b -> b.code().eq(releaseStatusCode));
      final long rowCount = persistenceService.run(select).rowCount();
      if (rowCount == 0)
        messages.error(MessageKeys.INVALID_RELEASESTATUS_CODE).target("in", ResourceRequests_.class,
            resourceRequest -> resourceRequest.releaseStatus_code());
    }
  }

  @Override
  public void validateRequestStatusCode(Integer requestStatusCode) {

    if (requestStatusCode != null) {

      if (requestStatusCode == Constants.REQUEST_RESOLVE) {
        messages.error(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION, requestStatusCode).target("in",
            ResourceRequests_.class, resourceRequest -> resourceRequest.requestStatus_code());

      } else {

        CqnSelect select = Select.from(RequestStatuses_.class).columns(b -> b.code())
            .where(b -> b.code().eq(requestStatusCode));
        final long rowCount = persistenceService.run(select).rowCount();
        if (rowCount == 0)
          messages.error(MessageKeys.INVALID_REQUESTSTATUS_CODE).target("in", ResourceRequests_.class,
              resourceRequest -> resourceRequest.requestStatus_code());

      }

    }
  }

  public void validateReleaseStatusCode(Integer releaseStatusCode) {

    if (releaseStatusCode.equals(Constants.REQUEST_WITHDRAW)) {
      messages.error(MessageKeys.RESOURCE_REQUEST_WITHDRAWN).target("in", ResourceRequests_.class,
          resourceRequest -> resourceRequest.releaseStatus_code());

    }

  }

  @Override
  public void validateResourceRequestDates(ChronoLocalDate startDate, ChronoLocalDate endDate,
      ChronoLocalDate workPackageStartDate, ChronoLocalDate workPackageEndDate, String entityName) {

    validateResourceRequestDatesBasicChecks(startDate, endDate, entityName);

    /* Validate if workpackage dates are valid */
    if (workPackageStartDate == null || workPackageEndDate == null) {
      messages.error(MessageKeys.INVALID_DATE_RANGES)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.START_DATE));
    }

    if (workPackageStartDate != null && workPackageEndDate != null && startDate != null && endDate != null) {
      /*
       * Validate Resource Request start date and end date falls within Work Package
       * Duration
       */
      validateResourceRequestWorkPackageDateChecks(workPackageStartDate, workPackageEndDate, startDate, endDate,
          entityName);

    }

  }

  public void validateResourceRequestDatesBasicChecks(ChronoLocalDate startDate, ChronoLocalDate endDate,
      String entityName) {
    /* Validate if start date is empty */
    if (startDate == null) {
      messages.error(MessageKeys.NULL_START_DATE)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.START_DATE));
    }

    /* Validate if end date is empty */
    if (endDate == null) {
      messages.error(MessageKeys.NULL_END_DATE)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.END_DATE));
    }

    /* Validate Start is before the End Dates of Resource Request */
    if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
      messages.error(MessageKeys.INVALID_DATES)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.START_DATE));
    }
  }

  public void validateResourceRequestWorkPackageDateChecks(ChronoLocalDate workPackageStartDate,
      ChronoLocalDate workPackageEndDate, ChronoLocalDate startDate, ChronoLocalDate endDate, String entityName) {

    /*
     * Validate Resource Request start date and end date falls within Work Package
     * Duration
     */
    if (startDate.isBefore(workPackageStartDate) || startDate.isAfter(workPackageEndDate)
        || endDate.isBefore(workPackageStartDate) || endDate.isAfter(workPackageEndDate)) {
      messages.error(MessageKeys.INVALID_DATE_RANGES)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.START_DATE));
    }

  }

  @Override
  public void validateRequestedCapacityValueIsPositive(BigDecimal requestedCapacity, String entityName) {

    if (requestedCapacity == null || requestedCapacity.signum() != 1
        || requestedCapacity.remainder(BigDecimal.ONE).compareTo(BigDecimal.ZERO) != 0) {
      messages.error(MessageKeys.INVALID_REQUIRED_EFFORT)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.REQUESTED_CAPACITY));
    }

  }

  @Override
  public void validateEmployeeExist(final String employeeId) {

    if (employeeId != null) {
      CqnSelect select = Select.from(ProfileData_.class).columns(b -> b.ID()).where(b -> b.ID().eq(employeeId));

      final long rowCount = persistenceService.run(select).rowCount();
      if (rowCount == 0)
        throw new ServiceException(ErrorStatuses.NOT_FOUND, MessageKeys.INVALID_EMPLOYEE_ID);
    }
  }

  @Override
  public void validateResourceRequestRequestedUnit(final String uom) {

    if (!Constants.UOM.equals(uom)) {
      messages.error(MessageKeys.INVALID_UOM, uom).target("in", ResourceRequests_.class,
          resReq -> resReq.requestedUnit());
    }
  }

  @Override
  public void validateResourceRequestNameInputValidation(final String nameValue, String entityName) {
    if (nameValue == null || nameValue.trim().isEmpty()) {
      messages.error(MessageKeys.NULL_NAME)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.NAME));
    }
  }

  /*
   * Check whether action to perform delete is allowed or not
   */
  @Override
  public void checkResourceRequestDeleteUpdate(String resourceRequestId, String eventType) {

    ResourceRequests persistedResourceRequest = resourceRequestHelper.selectResourceRequest(resourceRequestId);

    if (eventType.equals(CqnService.EVENT_DELETE) && Boolean.TRUE.equals(persistedResourceRequest.getIsS4Cloud())) {

      throw new ServiceException(ErrorStatuses.METHOD_NOT_ALLOWED, MessageKeys.INVALID_DELETE_FOR_S4_RR);
    }

    if (persistedResourceRequest.getRequestStatusCode().equals(Constants.REQUEST_RESOLVE)) {

      throw new ServiceException(ErrorStatuses.METHOD_NOT_ALLOWED, MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION);

    }

    if (eventType.equals(CqnService.EVENT_DELETE)
        && persistedResourceRequest.getReleaseStatusCode().equals(Constants.REQUEST_PUBLISH)) {

      throw new ServiceException(ErrorStatuses.METHOD_NOT_ALLOWED, MessageKeys.PUBLISHING_STATUS_PUBLISH_OPERATION);

    }
  }

  /*
   * Check whether a resource request has already been created for the demand
   */
  @Override
  public void checkResourceRequestExistsForDemand(String demandId) {

    String resourceRequestId = getResourceRequestIdForDemand(demandId);

    if (resourceRequestId != null) {
      messages.error(MessageKeys.RESOURCE_REQUEST_EXISTS).target("in", ResourceRequests_.class,
          resourceRequest -> resourceRequest.demand_ID());
    }

  }

  /*
   * Throw exception if Staffing is already done to Resource Request
   */

  @Override
  public void checkResourceRequestStaffing(final String resourceRequestId) {

    CqnSelect select = Select.from(StaffingStatuses_.class)
        .where(staffingStatus -> staffingStatus.ID().eq(resourceRequestId));
    final Result result = persistenceService.run(select);

    /*
     * x Select Resource Request Staffing for particular Resource Request ID passed
     */

    StaffingStatuses staffingStaus = result.first(StaffingStatuses.class)
        .orElseThrow(notFound("INVALID_RESOURCE_REQUEST"));

    if (staffingStaus.getStaffingCode() != Constants.NOT_STAFFED) {

      throw new ServiceException(ErrorStatuses.METHOD_NOT_ALLOWED, MessageKeys.STAFF_EXISTS);

    }

  }

  @Override
  public void checkPublishWithdrawAllowed(final Boolean resourceRequestActiveStatus) {

    if (Boolean.FALSE.equals(resourceRequestActiveStatus)) {

      throw new ServiceException(ErrorStatuses.METHOD_NOT_ALLOWED, "METHOD_NOT_ALLOWED");

    }

  }

  /*
   * Get resource resource request for demand
   */
  public String getResourceRequestIdForDemand(String demandId) {

    CqnSelect select = Select.from(ResourceRequests_.class)
        .columns(request -> request.ID(), request -> request.demand_ID())
        .where(request -> request.demand_ID().eq(demandId));

    Result resourceRequestResult = persistenceService.run(select);

    if (resourceRequestResult.rowCount() > 0) {
      return resourceRequestResult.single(ResourceRequests.class).getId();
    } else {
      return null;
    }

  }

  @Override
  public void validateProcessingResourceOrgUpdation(String resourceRequestId, String newProcessingResourceOrg,
      String oldProcessingResourceOrg) {
    if ((!newProcessingResourceOrg.equalsIgnoreCase(oldProcessingResourceOrg)) && resourceRequestId != null) {
      try {
        checkResourceRequestStaffing(resourceRequestId);
      } catch (ServiceException exception) {
        throw new ServiceException(ErrorStatuses.METHOD_NOT_ALLOWED,
            MessageKeys.CHANGE_PROCESSING_RESOURCEORG_OPERATION, exception);
      }
    }
  }

  @Override
  public void validateProcessingResourceOrganizationExist(String resourceOrgCode) {
    if (!validateResourceOrganizationExist(resourceOrgCode))
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.INVALID_RESOURCEORGANIZATION).messageTarget("",
          processresourcerequestservice.ResourceRequests_.class, resReq -> resReq.processingResourceOrg_ID());
  }

  @Override
  public void validateRequestedResourceOrganizationExist(String resourceOrgCode, String entityName) {
    if (!validateResourceOrganizationExist(resourceOrgCode))
      messages.error(MessageKeys.INVALID_RESOURCEORGANIZATION, resourceOrgCode).target("in", ResourceRequests_.class,
          resourceRequest -> resourceRequest.requestedResourceOrg_ID());
  }

  private boolean validateResourceOrganizationExist(final String resourceOrgCode) {

    boolean doExists = false;

    if (resourceOrgCode != null) {

      CqnSelect select = Select.from(UnrestrictedResourceOrganizationsConsumption_.class)
          .columns(resourceOrganization -> resourceOrganization.ID())
          .where(resourceOrganization -> resourceOrganization.ID().eq(resourceOrgCode));

      final long rowCount = persistenceService.run(select).rowCount();
      if (rowCount > 0)
        doExists = true;

    }

    return doExists;

  }

  @Override
  public boolean isUserAuthorizedForTheAction(final List<String> resourceOrgs, final String resourceOrganization) {

    if (resourceOrgs.isEmpty() || resourceOrgs.contains(resourceOrganization))
      return Boolean.TRUE;
    else
      return Boolean.FALSE;

  }

  @Override
  public void validateDisplayId(String displayID, String entityName) {
    if (displayID == null) {
      messages.error(MessageKeys.NULL_DISPLAYID)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.DISPLAY_ID));
    } else if (displayID.length() != 10) {
      messages.error(MessageKeys.INVALID_DISPLAYID)
          .target(propertyMapping.getTargetForServiceAndField(entityName, Constants.PropertyNames.DISPLAY_ID));
    }
  }

  public List<String> getCommonCostCenters(final Stream<String> userCostCenters, final String resourceOrganization) {

    List<String> authorizedCostCenters = new ArrayList<>();
    CqnSelect select;

    /* Get list of cost centers */
    List<String> userCostCenter = userCostCenters.collect(Collectors.toList());

    /*
     * If the user profile cost center is empty then pass resource organization cost
     * center else pass the common cost center between resource organization and
     * user profile costcenters
     */
    if (userCostCenter.isEmpty()) {
      select = Select.from(ResourceOrganizationItems_.class).columns(b -> b.costCenterId())
          .where(b -> b.resourceOrganization().displayId().eq(resourceOrganization));
    } else {
      select = Select.from(ResourceOrganizationItems_.class).columns(b -> b.costCenterId()).where(
          b -> b.costCenterId().in(userCostCenter).and(b.resourceOrganization().displayId().eq(resourceOrganization)));
    }

    Result costCentersResult = persistenceService.run(select);

    for (Row costCenter : costCentersResult) {
      authorizedCostCenters.add((String) costCenter.get("costCenterId"));
    }

    return authorizedCostCenters;

  }

  /*
   * The Supplier Interface is a part of the java.util.function package which has
   * been introduced since Java 8, to implement functional programming in Java. It
   * represents a function which does not take in any argument but produces a
   * value of type T.
   */

  public Supplier<ServiceException> notFound(String message) {
    return () -> new ServiceException(ErrorStatuses.NOT_FOUND, message);
  }

  @Override
  public List<ValuePath<String, ResourceRequests_>> extractValuesForHtmlInjection(
      final ResourceRequests resourceRequest) {
    return extractValuesForInjection(resourceRequest);
  }

  @Override
  public List<ValuePath<String, ResourceRequests_>> extractValuesForCsvInjection(
      final ResourceRequests resourceRequest) {
    return extractValuesForInjection(resourceRequest);
  }

  public List<ValuePath<String, ResourceRequests_>> extractValuesForInjection(final ResourceRequests resourceRequest) {

    final Stream<ValuePath<String, ResourceRequests_>> nameField = Stream
        .of(new ValuePath<>(resourceRequest.getName(), ResourceRequests_::name));

    final Stream<ValuePath<String, ResourceRequests_>> descrField = Stream
        .of(new ValuePath<>(resourceRequest.getDescription(), ResourceRequests_::description));

    final List<SkillRequirements> skillsReq = Optional.ofNullable(resourceRequest.getSkillRequirements())
        .orElseGet(Collections::emptyList);

    final Stream<ValuePath<String, ResourceRequests_>> skillsReqComments = skillsReq.stream()
        .map(skillComment -> new ValuePath<>(skillComment.getComment(),
            s -> s.skillRequirements(skillRequirementObj -> skillRequirementObj.ID().eq(skillComment.getId())
                .and(skillRequirementObj.IsActiveEntity().eq(Boolean.FALSE))).comment()));

    return Stream.concat(Stream.concat(nameField, descrField), skillsReqComments).collect(Collectors.toList());
  }

  @Override
  public String getMessageKeyForHtmlInjection() {
    return MessageKeys.RESREQ_CONTAINS_HTML_TAG;
  }

  @Override
  public String getMessageKeyForCsvInjection() {
    return MessageKeys.FORBIDDEN_FIRST_CHARACTER_RESREQ;
  }

  @Override
  public void checkAssignmentProposalExists(final ResourceRequests resourceRequest) {
    String resourceRequestId = resourceRequest.getId();

    CqnSelect select = Select.from(Staffing_.class)
        .where(staffing -> staffing.resourceRequest_ID().eq(resourceRequestId))
        .columns(Staffing_::assignmentStatus_code);

    Result result = persistenceService.run(select);

    List<Staffing> staffingList = result.listOf(Staffing.class);

    for (Staffing staffing : staffingList) {
      Integer assignmentStatusCode = staffing.getAssignmentStatusCode();
      if (assignmentStatusCode == Constants.AssignmentStatus.PROPOSAL_ASSIGNMENT_STATUS_CODE
          || assignmentStatusCode == Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE) {
        messages.error(MessageKeys.STAFF_EXISTS);
        messages.throwIfError();
      }
    }

  }

  @Override
  public void validateReferenceObjectIfTypeNone(final ResourceRequests resourceRequest) {

    Integer typeCode = resourceRequest.getReferenceObjectTypeCode();
    if (typeCode != Constants.REFERENCE_TYPE_NONE) {
      validateIfReferenceObjectMapped(resourceRequest);
    }
  }

  @Override
  public void validateIfReferenceObjectMapped(final ResourceRequests resourceRequest) {

    if (resourceRequest.getReferenceObjectId() == null) {
      messages.error(MessageKeys.NULL_REFERENCE_OBJECT).target("in", ResourceRequests_.class,
          ResourceRequests_::referenceObject_ID);

    }
  }

  @Override
  public void validateReferenceObjAssignedToResourceRequest(resourcerequestservice.ResourceRequests resourceRequest,
      String eventType) {

    if ((eventType.equals(CqnService.EVENT_CREATE) || (eventType.equals(CqnService.EVENT_UPDATE)
        && resourceRequest.containsKey(resourcerequestservice.ResourceRequests.REFERENCE_OBJECT_ID)))
        && (resourceRequest.getReferenceObjectId() != null && !resourceRequest.getReferenceObjectId().isEmpty())) {
      // Referential Integrity check for reference object Guid
      refIntegrityCheckForRefObject(resourceRequest.getReferenceObjectId());
    }

  }

  @Override
  public void validateRRDateChange(ResourceRequests resourceRequest) {
    ResourceRequests persistedResourceRequest = resourceRequestHelper.selectResourceRequest(resourceRequest.getId());

    if ((persistedResourceRequest.getStartDate().compareTo(resourceRequest.getStartDate()) < 0)
        || (persistedResourceRequest.getEndDate().compareTo(resourceRequest.getEndDate()) > 0)) {
      validateIfAssignmentExists(resourceRequest);
    }

  }

  @Override
  public void validateRRDateChangeWhenPublishedAPI(resourcerequestservice.ResourceRequests resourceRequest) {
    List<Staffing> staffingDetailsList = persistenceService
        .run(Select.from(Staffing_.class).where(staffing -> staffing.resourceRequest_ID().eq(resourceRequest.getId())))
        .listOf(Staffing.class);
    if (!staffingDetailsList.isEmpty()) {
      for (Staffing staffed : staffingDetailsList) {
        if (resourceRequest.getStartDate() != null && staffed.getStartDate().isBefore(resourceRequest.getStartDate())) {
            messages.error(MessageKeys.INVALID_DATE_EDIT).target(resourcerequestservice.ResourceRequests_.class,
                resourcerequestservice.ResourceRequests_::startDate);
            break;

        } else if (resourceRequest.getEndDate() != null && staffed.getEndDate().isAfter(resourceRequest.getEndDate()) ) {
            messages.error(MessageKeys.INVALID_DATE_EDIT).target(resourcerequestservice.ResourceRequests_.class,
                resourcerequestservice.ResourceRequests_::endDate);
        }
      }
    }
  }

  public void validateIfAssignmentExists(ResourceRequests resourceRequest) {
    List<Staffing> staffingDetailsList = persistenceService
        .run(Select.from(Staffing_.class).where(staffing -> staffing.resourceRequest_ID().eq(resourceRequest.getId())))
        .listOf(Staffing.class);
    if (!staffingDetailsList.isEmpty()) {
      for (Staffing staffed : staffingDetailsList) {
        if (staffed.getStartDate().isBefore(resourceRequest.getStartDate())) {
          messages.error(MessageKeys.INVALID_DATE_EDIT).target(ResourceRequests_.class, ResourceRequests_::startDate);
          break;
        }
        if (staffed.getEndDate().isAfter(resourceRequest.getEndDate())) {
          messages.error(MessageKeys.INVALID_DATE_EDIT).target(ResourceRequests_.class, ResourceRequests_::endDate);
        }

      }
    }

  }

  public void refIntegrityCheckForRefObject(String refObjectId) {
    final long rowCount = persistenceService
        .run(Select.from(ReferenceObjects_.class).columns(ReferenceObjects_::ID).where(b -> b.ID().eq(refObjectId)))
        .rowCount();
    if (rowCount == 0)
      messages.error(MessageKeys.INVALID_REFERENCEOBJECT).target(resourcerequestservice.ResourceRequests_.class,
          resourcerequestservice.ResourceRequests_::referenceObjectId);
  }

}
