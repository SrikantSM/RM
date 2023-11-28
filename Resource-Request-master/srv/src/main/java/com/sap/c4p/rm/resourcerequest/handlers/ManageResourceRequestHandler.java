package com.sap.c4p.rm.resourcerequest.handlers;

import static com.sap.cds.ql.CQL.and;
import static com.sap.cds.ql.CQL.get;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Predicate;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.helpers.ResourceRequestHelper;
import com.sap.c4p.rm.resourcerequest.utils.Constants;
import com.sap.c4p.rm.resourcerequest.utils.DisplayIDGenerator;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import manageresourcerequestservice.*;

@Component
@ServiceName(ManageResourceRequestService_.CDS_NAME)
public class ManageResourceRequestHandler implements EventHandler {

  private PersistenceService persistenceService;
  private DraftService draftService;
  private ResourceRequestValidator resourceRequestValidator;
  private ResourceRequestHelper resourceRequestHelper;
  private Messages messages;
  private DisplayIDGenerator displayIDGenerator;
  CqnAnalyzerWrapper cqnAnalyzerWrapper;

  @Autowired
  public ManageResourceRequestHandler(CqnAnalyzerWrapper cqnAnalyzerWrapper, PersistenceService persistenceService,
      ResourceRequestValidator resourceRequestValidator, Messages messages, ResourceRequestHelper resourceRequestHelper,
      DraftService draftService, DisplayIDGenerator displayIDGenerator) {

    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.persistenceService = persistenceService;
    this.draftService = draftService;
    this.resourceRequestValidator = resourceRequestValidator;
    this.messages = messages;
    this.resourceRequestHelper = resourceRequestHelper;
    this.displayIDGenerator = displayIDGenerator;
  }

  @Before(event = { DraftService.EVENT_DRAFT_NEW }, entity = ResourceRequests_.CDS_NAME)
  public void beforeResourceRequestDraftCreation(List<ResourceRequests> resourceRequests) {
    /*
     * set default release status value. Default as withdrawn when we create the
     * resource request. Cannot create with publish status directly anyways also
     * from service as there is validation check in non draft mode
     */
    resourceRequests.forEach(resourceRequest -> {
      resourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);
      resourceRequest.setIsS4Cloud(false);

      /* Set Requested capacity as 0 when not provided */
      if (resourceRequest.getRequestedCapacity() == null) {
        resourceRequest.setRequestedCapacity(BigDecimal.valueOf(0));
      }
      /*
       * Set below values to hide publish and withdraw in Create scenario
       */

      /* Set the Priority of resource request to medium as default value */
      if (resourceRequest.getPriorityCode() == null) {
        resourceRequest.setPriorityCode(Constants.REQUEST_PRIORITY_MEDIUM);
      }

      /*
       * Set WorkPackage ID and Project ID as null because it is a generic Resource
       * Request
       */
      if (resourceRequest.getDemandId() == null) {
        resourceRequest.setWorkpackageId(null);
        resourceRequest.setProjectId(null);
      }

    });

  }

  @After(event = { CqnService.EVENT_READ }, entity = ResourceRequests_.CDS_NAME)
  public void afterEventRead(List<ResourceRequests> resourceRequests) {

    fillVirtualFields(resourceRequests);

  }

  public void fillVirtualFields(List<ResourceRequests> resourceRequests) {
    for (ResourceRequests resourceRequest : resourceRequests) {

      if (resourceRequest.getReferenceObjectType() != null) {
        Integer code = resourceRequest.getReferenceObjectType().getCode();
        if (code != Constants.REFERENCE_TYPE_NONE) {
          resourceRequest.setReferenceObjectFieldControl(Constants.FIELD_CONTROL_EDIT);
        } else {
          resourceRequest.setReferenceObjectFieldControl(Constants.FIELD_CONTROL_READ);
        }
      }
      if (resourceRequest.getReleaseStatus() != null) {
        if (resourceRequest.getReleaseStatus().getCode() == Constants.REQUEST_PUBLISH) {
          resourceRequest.setResourceRequestFieldControl(Constants.FIELD_CONTROL_READ);
          resourceRequest.setReferenceObjectFieldControl(Constants.FIELD_CONTROL_READ);
          resourceRequest.setProjectRoleFieldControl(Constants.FIELD_CONTROL_READ);
        } else if (resourceRequest.getReleaseStatus().getCode() == Constants.REQUEST_WITHDRAW) {
          resourceRequest.setResourceRequestFieldControl(Constants.FIELD_CONTROL_EDIT);
          resourceRequest.setProjectRoleFieldControl(Constants.FIELD_CONTROL_OPTIONAL);
        }
      }

    }
  }

  @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = ResourceRequests_.CDS_NAME)
  public void beforeResourceRequestDraftUpdation(List<ResourceRequests> resourceRequests) {

    resourceRequests.forEach(resourceRequest -> {

      if (resourceRequest.getEffortDistributionTypeCode() != null) {

        /*
         * On change of effort distribution type, update resource request
         *
         */
        resourceRequestHelper.updateEffortDistributionOnTypeChange(resourceRequest);

      }

      if (resourceRequest.getStartDate() != null || resourceRequest.getEndDate() != null) {
        adjustCapacitiesForDraftResourceRequest(resourceRequest);
      }

      // On Change of Reference Type , update resource request
      if (resourceRequest.getReferenceObjectTypeCode() != null) {

        resourceRequestHelper.updateReferenceObject(resourceRequest);
      }
    });
  }

  @Before(event = { CqnService.EVENT_CREATE }, entity = ResourceRequests_.CDS_NAME)
  public void beforeResourceRequestCreate(ResourceRequests resourceRequest, final CdsCreateEventContext context) {

    /*
     * Validate user authorization for CREATE action
     *
     */
    if (!(resourceRequest.getRequestedResourceOrgId() == null || resourceRequest.getRequestedResourceOrgId().isEmpty())
        && !resourceRequestValidator.isUserAuthorizedForTheAction(context.getUserInfo()
            .getAttributeValues(Constants.REQUESTED_RESOURCEORG).stream().collect(Collectors.toList()),
            resourceRequest.getRequestedResourceOrgId())) {
      messages.error(MessageKeys.NOT_AUTHORIZED_TO_CREATE, resourceRequest.getRequestedResourceOrgId()).target("in",
          ResourceRequests_.class, resReq -> resReq.requestedResourceOrg_ID());
      messages.throwIfError();
    }

    /*
     * Fill all default constants values for Resource Request
     *
     */

    resourceRequestHelper.fillResourceRequestDefaultValues(resourceRequest);

    /*
     * Validates Resource request property values
     */
    resourceRequestValidator.validateResourceRequestProperty(resourceRequest);

    /*
     * Fill all derived values for Resource Request
     *
     */
    fillResourceRequestDerivedValues(resourceRequest);

    resourceRequestValidator.validateReferenceObjectIfTypeNone(resourceRequest);

    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

  }

  @Before(event = { CqnService.EVENT_UPDATE }, entity = ResourceRequests_.CDS_NAME)
  public void beforeResourceRequestUpdate(ResourceRequests resourceRequest, final CdsUpdateEventContext context) {

    /*
     * Validate user authorization for UPDATE action
     *
     */

    if (!(resourceRequest.getRequestedResourceOrgId() == null || resourceRequest.getRequestedResourceOrgId().isEmpty())
        && !resourceRequestValidator.isUserAuthorizedForTheAction(context.getUserInfo()
            .getAttributeValues(Constants.REQUESTED_RESOURCEORG).stream().collect(Collectors.toList()),
            resourceRequest.getRequestedResourceOrgId())) {
      messages.error(MessageKeys.NOT_AUTHORIZED_TO_UPDATE, resourceRequest.getRequestedResourceOrgId()).target("in",
          ResourceRequests_.class, resReq -> resReq.requestedResourceOrg_ID());
      messages.throwIfError();
    }

    /*
     * Check if Operation is allowed or not
     */

    resourceRequestValidator.checkResourceRequestDeleteUpdate(resourceRequest.getId(), CqnService.EVENT_UPDATE);

    /*
     * Fill all default constants values for Resource Request
     *
     */

    resourceRequestHelper.fillResourceRequestDefaultValuesWhenUpdate(resourceRequest);

    /**
     * Check if Assignment Exists & also verify if the assignment dates fall in RR
     * date range
     */
    resourceRequestValidator.validateRRDateChange(resourceRequest);

    /**
     * Adjusts capacities for the Resource Request if dates are not null
     */
    if (resourceRequest.getStartDate() != null && resourceRequest.getEndDate() != null) {
      adjustCapacitiesForResourceRequest(resourceRequest);
    }

    /*
     * Validates Resource request property values
     */

    resourceRequestValidator.validateResourceRequestProperty(resourceRequest);

    resourceRequestValidator.validateReferenceObjectIfTypeNone(resourceRequest);

    /*
     * fill derived values
     */
    fillResourceRequestDerivedValues(resourceRequest);

    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

  }

  /*
   * Check whether Delete of resource Request is allowed or not
   */

  @Before(event = { CqnService.EVENT_DELETE }, entity = ResourceRequests_.CDS_NAME)
  public void beforeResourceRequestDelete(CdsDeleteEventContext context) {

    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    CqnDelete cqnDelete = context.getCqn();

    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, cqnDelete).targetKeys();
    /*
     * Validate user authorization for DELETE action
     *
     */
    String reqResourceOrg = resourceRequestHelper
        .getRequestedResourceOrgForResourceRequestID((String) keys.get(ResourceRequests.ID));
    if (!resourceRequestValidator.isUserAuthorizedForTheAction(
        context.getUserInfo().getAttributeValues(Constants.REQUESTED_RESOURCEORG).stream().collect(Collectors.toList()),
        reqResourceOrg)) {
      messages.error(MessageKeys.NOT_AUTHORIZED_TO_DELETE, reqResourceOrg);
      messages.throwIfError();
    }

    /*
     * If Request Status = Closed or Publishing status = Published then Delete of
     * Resource Request is Not allowed
     */
    resourceRequestValidator.checkResourceRequestDeleteUpdate((String) keys.get(ResourceRequests.ID),
        CqnService.EVENT_DELETE);
    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

  }

  /*
   * Update Resource Request capacities along with resource request
   *
   */

  @After(event = { CqnService.EVENT_CREATE }, entity = ResourceRequests_.CDS_NAME)
  public void afterResourceRequestCreate(ResourceRequests resourceRequest) {

    // Generate DisplayID for new resource request craeted in UI
    resourceRequest.setDisplayId(displayIDGenerator.getDisplayId());
    resourceRequestValidator.validateDisplayId(resourceRequest.getDisplayId(), ResourceRequests_.CDS_NAME);
    CqnUpdate update = Update.entity(ResourceRequests_.class).data(resourceRequest)
        .where(c -> c.ID().eq(resourceRequest.getId()));
    persistenceService.run(update);

    /*
     *
     * In case of effort distribution type is TOTAL_HOURS for the resource
     * request,create/update capacity requirement
     *
     */
    if (resourceRequest.getEffortDistributionTypeCode() == Constants.TOTAL_HOURS) {
      resourceRequestHelper.modifyCapacitiesForTotalEffortDistributionType(resourceRequest);
    }
    messages.throwIfError();
  }

  @After(event = { CqnService.EVENT_UPDATE }, entity = ResourceRequests_.CDS_NAME)
  public void afterResourceRequestUpdate(ResourceRequests resourceRequest) {

    /*
     *
     * In case of effort distribution type is TOTAL_HOURS for the resource
     * request,create/update capacity requirement
     *
     */
    if (resourceRequest.getEffortDistributionTypeCode() == Constants.TOTAL_HOURS) {
      resourceRequestHelper.modifyCapacitiesForTotalEffortDistributionType(resourceRequest);
    }
  }

  /*
   * Handler for returning only unrestricted project roles on reading ProjectRoles
   * entity in ResourceRequests Service
   */
  @Before(event = { CqnService.EVENT_READ }, entity = ProjectRoles_.CDS_NAME)
  public void beforeProjectRolesRead(CdsReadEventContext context) {
    CqnSelect query = context.getCqn();
    Predicate validRoleFilter = get("roleLifecycleStatus_code").eq(0);
    CqnPredicate addUnrestrictedRolesToFilters = query.where()
        .map(existingFilters -> and(existingFilters, validRoleFilter)).orElse(validRoleFilter);
    context.setCqn(Select.copy(query).where(addUnrestrictedRolesToFilters));
  }

  public void adjustCapacitiesForDraftResourceRequest(ResourceRequests resourceRequest) {
    /**
     * To compare the dates of updated and draft resource request
     */
    ResourceRequests draftResourceRequest = resourceRequestHelper.selectDraftResourceRequest(resourceRequest.getId());
    if (draftResourceRequest.getStartDate() != null && draftResourceRequest.getEndDate() != null) {
      if (resourceRequest.getStartDate() == null) {
        resourceRequest.setStartDate(draftResourceRequest.getStartDate());
      }
      if (resourceRequest.getEndDate() == null) {
        resourceRequest.setEndDate(draftResourceRequest.getEndDate());
      }
      if ((draftResourceRequest.getStartDate().compareTo(resourceRequest.getStartDate()) != 0)
          || (draftResourceRequest.getEndDate().compareTo(resourceRequest.getEndDate()) != 0)) {
        changeResourceRequestDraftDates(resourceRequest.getStartDate(), resourceRequest.getEndDate(), resourceRequest,
            draftResourceRequest);
      }
    }
  }

  public List<ResourceRequestCapacities> selectDraftResourceRequestCapacitiesWithDates(String resourceRequestId,
      LocalDate startDate, LocalDate endDate) {
    // Because CAP doesn't support "Greater than or equal to" in CQN statements
    LocalDate queryStartDate = startDate.minusDays(1);
    CqnSelect select = Select.from(ResourceRequestCapacities_.class)
        .where(resourceRequestCapacity -> resourceRequestCapacity.resourceRequest_ID().eq(resourceRequestId)
            .and(resourceRequestCapacity.IsActiveEntity().eq(false))
            .and(resourceRequestCapacity.startDate().gt(queryStartDate))
            .and(resourceRequestCapacity.endDate().le(endDate)));
    final Result result = draftService.run(select);
    return result.listOf(ResourceRequestCapacities.class);
  }

  public void fillResourceRequestDerivedValues(ResourceRequests resourceRequest) {

    /*
     * Set the processing resource organizations based on requested resource
     * organization and requested capacity in minutes based on requested capacity
     */

    if (resourceRequest.getRequestedCapacity() != null && resourceRequest.getStartDate() != null
        && resourceRequest.getEndDate() != null && resourceRequest.getRequestedResourceOrgId() != null) {
      resourceRequest.setRequestedUnit(Constants.UOM);
      resourceRequestHelper.fillResourceRequestDerivedValues(resourceRequest);
    } else {
      messages.error(MessageKeys.MANDATORY_FIELDS).target("in", ResourceRequests_.class, resReq -> resReq.ID());
    }

  }

  public void adjustCapacitiesForResourceRequest(ResourceRequests resourceRequest) {

    ResourceRequests persistedResourceRequest = resourceRequestHelper.selectResourceRequest(resourceRequest.getId());

    /**
     * To compare the dates of updated and persisted resource request
     */
    if ((persistedResourceRequest.getStartDate().compareTo(resourceRequest.getStartDate()) != 0)
        || (persistedResourceRequest.getEndDate().compareTo(resourceRequest.getEndDate()) != 0)) {
      changeResourceRequestDates(resourceRequest.getStartDate(), resourceRequest.getEndDate(), resourceRequest);
    }
  }

  public void changeResourceRequestDraftDates(LocalDate updatedRRStartDate, LocalDate updatedRREndDate,
      ResourceRequests resourceRequest, ResourceRequests draftResourceRequest) {

    resourceRequest.setEffortDistributionTypeCode(draftResourceRequest.getEffortDistributionTypeCode());
    /*
     * Adjust Capacity data when distribution type is not total.
     */
    if (resourceRequest.getEffortDistributionTypeCode() != Constants.TOTAL_HOURS) {
      Instant updatedRRStartTime = updatedRRStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant updatedRREndTime = updatedRREndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = new ArrayList<>();

      resourceRequest.setStartDate(updatedRRStartDate);
      resourceRequest.setStartTime(updatedRRStartTime);
      resourceRequest.setEndDate(updatedRREndDate);
      resourceRequest.setEndTime(updatedRREndTime);
      /*
       * Adjust the resource request capacities as per the updated resource request
       * start and end dates.
       */
      if (resourceRequest.getEffortDistributionTypeCode() == Constants.DAILY_HOURS) {
        /*
         * Daily Distribution
         */
        updatedCapacityRequirements = selectDraftResourceRequestCapacitiesWithDates(resourceRequest.getId(),
            resourceRequest.getStartDate(), resourceRequest.getEndDate());
      }
      if (resourceRequest.getEffortDistributionTypeCode() == Constants.WEEKLY_HOURS) {
        /*
         * Weekly Distribution
         */
        updatedCapacityRequirements = resourceRequestHelper.getUpdatedCapacityForWeeklyDistribution(
            resourceRequestHelper.selectDraftResourceRequestCapacities(resourceRequest.getId()), updatedRRStartDate,
            updatedRREndDate, updatedRRStartTime, updatedRREndTime);
      }

      resourceRequestHelper.calculateAndResetCapacityInResourceRequest(updatedCapacityRequirements, resourceRequest);
      resourceRequest.setCapacityRequirements(updatedCapacityRequirements);
    }
  }

  public void changeResourceRequestDates(LocalDate updatedRRStartDate, LocalDate updatedRREndDate,
      ResourceRequests resourceRequest) {
    /*
     * Adjust Capacity data when distribution type is not total.
     */
    if (resourceRequest.getEffortDistributionTypeCode() != Constants.TOTAL_HOURS) {
      Instant updatedRRStartTime = updatedRRStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      Instant updatedRREndTime = updatedRREndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault())
          .toInstant();
      List<ResourceRequestCapacities> updatedCapacityRequirements = new ArrayList<>();

      resourceRequest.setStartDate(updatedRRStartDate);
      resourceRequest.setStartTime(updatedRRStartTime);
      resourceRequest.setEndDate(updatedRREndDate);
      resourceRequest.setEndTime(updatedRREndTime);

      /*
       * Adjust the resource request capacities as per the updated resource request
       * start and end dates.
       */
      if (resourceRequest.getEffortDistributionTypeCode() == Constants.DAILY_HOURS) {
        /*
         * Daily Distribution
         */
        for (ResourceRequestCapacities capacity : resourceRequest.getCapacityRequirements()) {

          if (((capacity.getStartDate().compareTo(updatedRRStartDate)) >= 0)
              && ((capacity.getStartDate().compareTo(updatedRREndDate)) <= 0)) {
            updatedCapacityRequirements.add(capacity);
          }
        }
      } else if (resourceRequest.getEffortDistributionTypeCode() == Constants.WEEKLY_HOURS) {
        /*
         * Weekly Distribution
         */
        updatedCapacityRequirements = resourceRequestHelper.getUpdatedCapacityForWeeklyDistribution(
            resourceRequest.getCapacityRequirements(), updatedRRStartDate, updatedRREndDate, updatedRRStartTime,
            updatedRREndTime);
      }
      resourceRequestHelper.calculateAndResetCapacityInResourceRequest(updatedCapacityRequirements, resourceRequest);
      resourceRequest.setCapacityRequirements(updatedCapacityRequirements);
    }
  }

  /*
   * Common method to update both release and request status of resource request
   */

  public void updateResourceRequestStatus(String resourceRequestId, String statusName, int statusCode) {

    final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

    switch (statusName) {
    case ResourceRequests.REQUEST_STATUS_CODE:
      resourceRequest.setRequestStatusCode(statusCode);
      break;
    case ResourceRequests.RELEASE_STATUS_CODE:
      resourceRequest.setReleaseStatusCode(statusCode);
      break;
    default:
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.INVALID_STATUS_CODE);
    }

    updateResourceRequest(resourceRequestId, resourceRequest);

  }

  /*
   * This method updates ResourceManagerId and ProcessorId , processing cost
   * center & Resource org when set my responsibility or forward action is
   * triggered
   */

  public void updateResourceRequestAttributes(String resourceRequestId, String attributeName, String attributeValue) {

    final ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);

    switch (attributeName) {
    case ResourceRequests.PROCESSING_RESOURCE_ORG_ID:
      resourceRequest.setProcessingResourceOrgId(attributeValue);
      break;
    case ResourceRequests.RESOURCE_MANAGER:
      resourceRequest.setResourceManager(attributeValue);
      break;
    case ResourceRequests.PROCESSOR:
      resourceRequest.setProcessor(attributeValue);
      break;
    default:
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.INVALID_ATTRIBUTE_NAME);
    }

    updateResourceRequest(resourceRequestId, resourceRequest);

  }

  private void updateResourceRequest(String resourceRequestId, ResourceRequests resourceRequest) {

    CqnUpdate update = Update.entity(ResourceRequests_.class).data(resourceRequest)
        .where(r -> r.ID().eq(resourceRequestId));

    persistenceService.run(update);
  }
}
