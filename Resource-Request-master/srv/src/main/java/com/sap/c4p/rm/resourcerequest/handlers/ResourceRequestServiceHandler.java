package com.sap.c4p.rm.resourcerequest.handlers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.exceptions.ExceptionUtility;
import com.sap.c4p.rm.resourcerequest.helpers.ResourceRequestHelper;
import com.sap.c4p.rm.resourcerequest.utils.DisplayIDGenerator;
import com.sap.c4p.rm.resourcerequest.validations.ReferenceObjectPublicApiValidator;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestPublicApiValidator;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import resourcerequestservice.ReferenceObjects;
import resourcerequestservice.ReferenceObjects_;
import resourcerequestservice.ResourceRequestService_;
import resourcerequestservice.ResourceRequests;
import resourcerequestservice.ResourceRequests_;

@Component
@ServiceName(ResourceRequestService_.CDS_NAME)
public class ResourceRequestServiceHandler implements EventHandler {

  private DisplayIDGenerator displayIDGenerator;
  private ResourceRequestValidator resourceRequestValidator;
  private ResourceRequestHelper resourceRequestHelper;
  private ExceptionUtility exceptionUtility;
  private CqnAnalyzerWrapper cqnAnalyzerWrapper;

  private ResourceRequestPublicApiValidator resourceRequestPublicApiValidator;

  private ReferenceObjectPublicApiValidator referenceObjectPublicApiValidator;

  @Autowired
  public ResourceRequestServiceHandler(DisplayIDGenerator displayIDGenerator,
      ResourceRequestValidator resourceRequestValidator, ResourceRequestHelper resourceRequestHelper,
      ExceptionUtility exceptionUtility, CqnAnalyzerWrapper cqnAnalyzerWrapper,
      ResourceRequestPublicApiValidator resourceRequestPublicApiValidator,
      ReferenceObjectPublicApiValidator referenceObjectPublicApiValidator) {
    this.displayIDGenerator = displayIDGenerator;
    this.resourceRequestValidator = resourceRequestValidator;
    this.resourceRequestHelper = resourceRequestHelper;
    this.exceptionUtility = exceptionUtility;
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.resourceRequestPublicApiValidator = resourceRequestPublicApiValidator;
    this.referenceObjectPublicApiValidator = referenceObjectPublicApiValidator;
  }

// Create

  @Before(event = { CqnService.EVENT_CREATE }, entity = ResourceRequests_.CDS_NAME)
  public void beforeResourceRequestCreate(ResourceRequests resourceRequest, final CdsCreateEventContext context) {

    /*
     * Will Check whether mandatory fields are passed. Will perform validations on
     * individual fields.
     */
    resourceRequestValidator.validateResourceRequestPropertyApi(resourceRequest, CqnService.EVENT_CREATE);
    resourceRequestPublicApiValidator.validateForInjection(resourceRequest);
    resourceRequestValidator.validateReferenceObjAssignedToResourceRequest(resourceRequest, CqnService.EVENT_CREATE);

    // Throw error.
    exceptionUtility.throwExceptionIfErrorWithGenericMessage();

  }

  @After(event = { CqnService.EVENT_CREATE }, entity = ResourceRequests_.CDS_NAME)
  public void afterResourceRequestCreate(ResourceRequests resourceRequest) {

    // Fetch Resource Requests object with default values.
    manageresourcerequestservice.ResourceRequests resourceRequestsStructure = resourceRequestHelper
        .getStructureWithDefaultValues();

    // We can only create demand independent resource requests.
    resourceRequestsStructure.setIsS4Cloud(false);

    // Fill displayID generated from hana db sequence.
    resourceRequest.setDisplayId(displayIDGenerator.getDisplayId());

    // Validate generated displayID.
    resourceRequestValidator.validateDisplayId(resourceRequest.getDisplayId(), ResourceRequests_.CDS_NAME);

    // Fill mandatory user provided info in structure.
    resourceRequestHelper.fillValuesPassedByUser(resourceRequestsStructure, resourceRequest);

    // Fill derived values in structure.
    resourceRequestHelper.fillResourceRequestDerivedValues(resourceRequestsStructure);

    resourceRequestHelper.fillReferenceObjectTypeCode(resourceRequest);

    // Update DB.
    resourceRequestHelper.updateDbData(resourceRequestsStructure);

    // Create capacity Requirement data.
    resourceRequestHelper.modifyCapacitiesForTotalEffortDistributionType(resourceRequestsStructure);

    // Throw error.
    exceptionUtility.throwExceptionIfErrorWithGenericMessage();

  }

  @Before(event = { CqnService.EVENT_UPDATE }, entity = ResourceRequests_.CDS_NAME)

  public void beforeResourceRequestUpdate(ResourceRequests resourceRequest, final CdsUpdateEventContext context) {

    CdsModel model = context.getModel();
    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(model);
    CqnUpdate cqnUpdate = context.getCqn();

    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, cqnUpdate).targetKeys();

    /*
     * set ID as it is being used in validator class to fetch old request details *
     */
    resourceRequest.setId((String) keys.get(ResourceRequests.ID));
    /*
     * check update/delete authorization
     *
     */

    /*
     * Check if Operation is allowed or not; if project is closed then not allowed
     * to update
     */

    resourceRequestValidator.checkResourceRequestDeleteUpdate(resourceRequest.getId(), CqnService.EVENT_UPDATE);

    if(resourceRequest.getStartDate()!=null || resourceRequest.getEndDate()!= null){
        resourceRequestValidator.validateRRDateChangeWhenPublishedAPI(resourceRequest);
    }



    /*
     * Validate changed resource request properties
     */

    resourceRequestValidator.validateResourceRequestPropertyApi(resourceRequest, CqnService.EVENT_UPDATE);
    resourceRequestPublicApiValidator.validateForInjection(resourceRequest);
    resourceRequestValidator.validateReferenceObjAssignedToResourceRequest(resourceRequest, CqnService.EVENT_UPDATE);

    if(resourceRequest.containsKey(ResourceRequests.START_DATE) || resourceRequest.containsKey(ResourceRequests.END_DATE) || resourceRequest.containsKey(ResourceRequests.REQUIRED_EFFORT)){
        resourceRequestHelper.fillResourceRequestDerivedValueOnUpdate(resourceRequest);
    }

    // Throw error.
    exceptionUtility.throwExceptionIfErrorWithGenericMessage();

    // Update ReferenceObjectTypeCode
    resourceRequestHelper.fillReferenceObjectTypeCode(resourceRequest);

  }

  @Before(event = { CqnService.EVENT_DELETE }, entity = ResourceRequests_.CDS_NAME)

  public void beforeResourceRequestDelete(CdsDeleteEventContext context) {

    CdsModel model = context.getModel();
    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(model);
    CqnDelete cqnDelete = context.getCqn();

    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, cqnDelete).targetKeys();

    String resourceRequestId = (String) keys.get(ResourceRequests.ID);

    /*
     * Check if Operation is allowed or not; if project is closed then not allowed
     * to update
     */

    resourceRequestValidator.checkResourceRequestDeleteUpdate(resourceRequestId, CqnService.EVENT_DELETE);

    // Throw error.
    exceptionUtility.throwExceptionIfErrorWithGenericMessage();

  }

  @Before(event = CqnService.EVENT_CREATE, entity = ReferenceObjects_.CDS_NAME)
  public void beforeReferenceObjectCreate(ReferenceObjects referenceObject) {

    /*
     * Validations before saving reference object
     */
    referenceObjectPublicApiValidator.validateReferenceObjectPropertyApi(referenceObject, CqnService.EVENT_CREATE);

    // Throw error.
    exceptionUtility.throwExceptionIfErrorWithGenericMessage();

  }

  @Before(event = CqnService.EVENT_UPDATE, entity = ReferenceObjects_.CDS_NAME)
  public void beforeReferenceObjectUpdate(ReferenceObjects referenceObject, final CdsUpdateEventContext context) {

    CdsModel model = context.getModel();
    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(model);
    CqnUpdate cqnUpdate = context.getCqn();

    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, cqnUpdate).targetKeys();

    /*
     * set ID as it is being used in validator class to fetch old request details *
     */
    referenceObject.setId((String) keys.get(ReferenceObjects.ID));

    /*
     * Validations before saving reference object
     */
    referenceObjectPublicApiValidator.validateReferenceObjectPropertyApi(referenceObject, CqnService.EVENT_UPDATE);

    // Throw error.
    exceptionUtility.throwExceptionIfErrorWithGenericMessage();

  }

  @Before(event = CqnService.EVENT_DELETE, entity = ReferenceObjects_.CDS_NAME)
  public void beforeReferenceObjectDelete(CdsDeleteEventContext context) {

    CdsModel model = context.getModel();
    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(model);
    CqnDelete cqnDelete = context.getCqn();

    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, cqnDelete).targetKeys();

    String referenceObjectId = (String) keys.get(ReferenceObjects.ID);

    /*
     * Validate if Reference Object ID Exists
     */
    referenceObjectPublicApiValidator.integrityCheckForRefObject(referenceObjectId);

    /*
     * Validations before saving reference object
     */
    referenceObjectPublicApiValidator.validateRefObjDeletion(referenceObjectId);

    // Throw error.
    exceptionUtility.throwExceptionIfErrorWithGenericMessage();

  }

}
