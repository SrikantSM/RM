package com.sap.c4p.rm.resourcerequest.actions.handlers;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.handlers.ManageResourceRequestHandler;
import com.sap.c4p.rm.resourcerequest.utils.Constants;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import processresourcerequestservice.ForwardResourceRequestContext;
import processresourcerequestservice.ProcessResourceRequestService_;
import processresourcerequestservice.ResolveResourceRequestContext;
import processresourcerequestservice.ResourceRequests;
import processresourcerequestservice.ResourceRequests_;
import processresourcerequestservice.SetMyResponsibilityResourceRequestContext;

@Component
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class ProcessResourceRequestActionHandler implements EventHandler {

  private ManageResourceRequestHandler manageResourceRequestHandler;
  private ResourceRequestValidator resourceRequestValidator;
  private XsuaaUserInfo xsuaaUserInfo;
  private Messages messages;

  @Autowired
  ProcessResourceRequestActionHandler(ManageResourceRequestHandler manageResourceRequestHandler,
      ResourceRequestValidator resourceRequestValidator, XsuaaUserInfo xsuaaUserInfo, Messages messages) {

    this.manageResourceRequestHandler = manageResourceRequestHandler;
    this.resourceRequestValidator = resourceRequestValidator;
    this.xsuaaUserInfo = xsuaaUserInfo;
    this.messages = messages;
  }

  @On(event = Constants.ACTION_RESOURCE_REQUEST_RESOLVE, entity = ResourceRequests_.CDS_NAME)
  public void onResourceRequestStatusResolve(final ResolveResourceRequestContext context) {

    CqnSelect select = context.getCqn();

    Boolean isResolved = Boolean.TRUE;

    Result resourceRequestResult = ((CqnService) context.getService()).run(select);

    /*
     * If result row count is not equal to one, then user is not authorized to
     * perform resolve action
     */
    if (resourceRequestResult.rowCount() != 1) {
      messages.error(MessageKeys.NOT_AUTHORIZED_TO_RESOLVE).target("in", ResourceRequests_.class,
          ResourceRequests_::processingResourceOrg_ID);
    }

    final ResourceRequests resourceRequest = resourceRequestResult.first(ResourceRequests.class)
        .orElseThrow(resourceRequestValidator.notFound(MessageKeys.RESOURCE_REQUEST_WITHDRAWN));

    /*
     * check if resource request is withdrawn
     */

    resourceRequestValidator.validateReleaseStatusCode(resourceRequest.getReleaseStatusCode());

    resourceRequest.setRequestStatusCode(Constants.REQUEST_RESOLVE);

    manageResourceRequestHandler.updateResourceRequestStatus(resourceRequest.getId(),
        ResourceRequests.REQUEST_STATUS_CODE, resourceRequest.getRequestStatusCode());

    resourceRequest.setIsResolved(isResolved);

    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

    context.getMessages().success(MessageKeys.RESOLVE_REQUEST_SUCCESS);

    context.setResult(resourceRequest);

    context.setCompleted();

  }

  @On(event = Constants.ACTION_RESOURCE_REQUEST_SET_RESPONSIBILITY, entity = ResourceRequests_.CDS_NAME)
  public void onSetResponsibilityResourceRequestAction(final SetMyResponsibilityResourceRequestContext context) {

    CqnSelect select = context.getCqn();

    final ResourceRequests resourceRequest = ((CqnService) context.getService()).run(select)
        .first(ResourceRequests.class)
        .orElseThrow(resourceRequestValidator.notFound(MessageKeys.RESOURCE_REQUEST_WITHDRAWN));

    Boolean asProcessor;
    Boolean asResourceManager;
    String email;

    /*
     * Validate: set my responsibility action is not allowed if Request status is
     * resolved
     */
    resourceRequestValidator.validateRequestStatusCode(resourceRequest.getRequestStatusCode());

    /*
     * check if resource request is withdrawn
     */

    resourceRequestValidator.validateReleaseStatusCode(resourceRequest.getReleaseStatusCode());

    /*
     * Get value of the parameter from the context. asProcessor: true means user has
     * set my responsibility for the Resource request as Processor
     */
    asProcessor = context.getProcessor();

    /*
     * Get value of the parameter from the context. asResourceManager: true means
     * user has set my responsibility for the Resource request as Resource Manager
     */
    asResourceManager = context.getResourceManager();

    /*
     * Email of the logged in user is fetched using XsuaaUserInfo interface. This
     * interface extends the common UserInfo with XSUAA specific getters.
     */

    email = xsuaaUserInfo.getEmail();

    // set my responsibility as Processor
    if (Boolean.TRUE.equals(asProcessor)) {
      resourceRequest.setProcessor(email);
      manageResourceRequestHandler.updateResourceRequestAttributes(resourceRequest.getId(), ResourceRequests.PROCESSOR,
          email);
    } else {
      if (resourceRequest.getProcessor() != null && resourceRequest.getProcessor().equals(email)) {
        resourceRequest.setProcessor(null);
        manageResourceRequestHandler.updateResourceRequestAttributes(resourceRequest.getId(),
            ResourceRequests.PROCESSOR, null);
      }
    }

    // set my responsibility as Resource Manager
    if (Boolean.TRUE.equals(asResourceManager)) {
      resourceRequest.setResourceManager(email);
      manageResourceRequestHandler.updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.RESOURCE_MANAGER, email);
    } else {
      if (resourceRequest.getResourceManager() != null && resourceRequest.getResourceManager().equals(email)) {
        resourceRequest.setResourceManager(null);
        manageResourceRequestHandler.updateResourceRequestAttributes(resourceRequest.getId(),
            ResourceRequests.RESOURCE_MANAGER, null);
      }
    }
    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

    context.setResult(resourceRequest);

    context.setCompleted();

  }

  @On(event = Constants.ACTION_RESOURCE_REQUEST_FORWARD, entity = ResourceRequests_.CDS_NAME)
  public void onForwardResourceRequestAction(final ForwardResourceRequestContext context) {
    String processingResourceOrgId;
    CqnSelect select = context.getCqn();

    final ResourceRequests resourceRequest = ((CqnService) context.getService()).run(select)
        .first(ResourceRequests.class)
        .orElseThrow(resourceRequestValidator.notFound(MessageKeys.RESOURCE_REQUEST_WITHDRAWN));

    /* Validate: Forward action is not allowed if Request status is resolved */
    resourceRequestValidator.validateRequestStatusCode(resourceRequest.getRequestStatusCode());
    /*
     * check if resource request is withdrawn
     */

    resourceRequestValidator.validateReleaseStatusCode(resourceRequest.getReleaseStatusCode());

    processingResourceOrgId = context.getProcessingResourceOrgId().trim();

    /**
     * Throw error if user doesn't select processing resource organization in
     * Forward dialog.
     */
    if (processingResourceOrgId.isEmpty()) {
      throw new ServiceException(ErrorStatuses.PRECONDITION_FAILED, MessageKeys.INVALID_RESOURCEORGANIZATION)
          .messageTarget("", ResourceRequests_.class, resReq -> resReq.processingResourceOrg_ID());

    } else {
      /** Validate the Processing Resource organization */
      resourceRequestValidator.validateProcessingResourceOrganizationExist(processingResourceOrgId);

      /**
       * Validate is user authorized for the forward action on the selected resource
       * organization
       */

      if (!resourceRequestValidator.isUserAuthorizedForTheAction(context.getUserInfo()
          .getAttributeValues(Constants.PROCESSING_RESOURCEORG).stream().collect(Collectors.toList()),
          processingResourceOrgId)) {
        throw new ServiceException(ErrorStatuses.UNAUTHORIZED, MessageKeys.NOT_AUTHORIZED_TO_FORWARD,
            processingResourceOrgId);
      }
    }

    /**
     * Validate if the processing resource Org can be changed (ie if staffing
     * exists)
     */
    resourceRequestValidator.validateProcessingResourceOrgUpdation(resourceRequest.getId(), processingResourceOrgId,
        resourceRequest.getProcessingResourceOrgId());

    manageResourceRequestHandler.updateResourceRequestAttributes(resourceRequest.getId(),
        ResourceRequests.PROCESSING_RESOURCE_ORG_ID, processingResourceOrgId);

    resourceRequest.setProcessingResourceOrgId(processingResourceOrgId);

    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

    context.getMessages().success(MessageKeys.FORWARD_REQUEST_SUCCESS);

    context.setResult(resourceRequest);

    context.setCompleted();
  }
}
