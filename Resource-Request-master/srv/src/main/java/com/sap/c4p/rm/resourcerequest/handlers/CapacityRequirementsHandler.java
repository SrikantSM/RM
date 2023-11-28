package com.sap.c4p.rm.resourcerequest.handlers;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnStructuredTypeRef;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.ManageResourceRequestService_;
import manageresourcerequestservice.ResourceRequestCapacities;
import manageresourcerequestservice.ResourceRequestCapacities_;
import manageresourcerequestservice.ResourceRequests_;

@Component
@ServiceName(ManageResourceRequestService_.CDS_NAME)
public class CapacityRequirementsHandler implements EventHandler {
  private Messages messages;
  private DraftService draftService;
  private CqnAnalyzerWrapper cqnAnalyzerWrapper;

  @Autowired
  public CapacityRequirementsHandler(Messages messages, DraftService draftService,
      CqnAnalyzerWrapper cqnAnalyzerWrapper) {
    this.messages = messages;
    this.draftService = draftService;
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
  }

  @Before(event = { DraftService.EVENT_DRAFT_NEW }, entity = ResourceRequestCapacities_.CDS_NAME)
  public void beforeResourceRequestCapacityDraftCreation(ResourceRequestCapacities resourceRequestCapacity,
      EventContext context) {
    if (resourceRequestCapacity.getStartDate() != null && resourceRequestCapacity.getEndDate() != null
        && resourceRequestCapacity.getRequestedCapacity() != null) {
      // Fill derived values.
      resourceRequestCapacity.setRequestedUnit(Constants.UOM);
      fillRequestedCapacityInMinutes(resourceRequestCapacity);
      fillStartTime(resourceRequestCapacity);
      fillEndTime(resourceRequestCapacity);
      // set resource request id.
      resourceRequestCapacity.setResourceRequestId(getIDfromContext(context));
    } else {
      messages.error(MessageKeys.MANDATORY_FIELDS).target("in", ResourceRequestCapacities_.class,
          resCap -> resCap.ID());
    }
  }

  @After(event = { DraftService.EVENT_DRAFT_NEW }, entity = ResourceRequestCapacities_.CDS_NAME)
  public void afterResourceRequestCapacityDraftCreation(ResourceRequestCapacities resourceRequestCapacity,
      EventContext context) {
    updateResourceRequestWithCapacity(resourceRequestCapacity.getResourceRequestId());
  }

  @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = ResourceRequestCapacities_.CDS_NAME)
  public void beforeResourceRequestCapacityDraftUpdate(List<ResourceRequestCapacities> resourceRequestCapacities) {
    for (ResourceRequestCapacities resourceRequestCapacity : resourceRequestCapacities) {
      if (resourceRequestCapacity.getRequestedCapacity() != null) {
        // Update derived values.
        fillRequestedCapacityInMinutes(resourceRequestCapacity);
      }
      if (resourceRequestCapacity.getStartDate() != null) {
        fillStartTime(resourceRequestCapacity);
      }
      if (resourceRequestCapacity.getEndDate() != null) {
        fillEndTime(resourceRequestCapacity);
      }
    }
  }

  @After(event = { DraftService.EVENT_DRAFT_PATCH }, entity = ResourceRequestCapacities_.CDS_NAME)
  public void afterResourceRequestCapacityDraftUpdation(List<ResourceRequestCapacities> resourceRequestCapacities,
      EventContext context) {
    for (ResourceRequestCapacities resourceRequestCapacity : resourceRequestCapacities) {
      ResourceRequestCapacities capacity = getResourceRequestCapacityFromId(resourceRequestCapacity.getId());
      if (resourceRequestCapacity.getRequestedCapacity() != capacity.getRequestedCapacity()) {
        updateResourceRequestWithCapacity(capacity.getResourceRequestId());
      }
    }
  }

  @Before(event = { DraftService.EVENT_DRAFT_CANCEL }, entity = ResourceRequestCapacities_.CDS_NAME)
  public void beforeResourceRequestCapacityDraftDelete(EventContext context) {
    ResourceRequestCapacities resourceRequestCapacity = getResourceRequestCapacityFromId(getIDfromContext(context));
    deleteResourceRequestWithCapacity(resourceRequestCapacity.getResourceRequestId(),
        resourceRequestCapacity.getRequestedCapacity());
  }

// Common function used by all event handlers.
  public void updateResourceRequestWithCapacity(String resourceRequestId) {
    // Get Existing capacity of parent.
    BigDecimal updatedCapacity = getTotalRequestedCapacityFromId(resourceRequestId);
    // Update Parent.
    CqnUpdate update = Update.entity(ResourceRequests_.class).data("requestedCapacity", updatedCapacity).where(
        resourceRequest -> resourceRequest.ID().eq(resourceRequestId).and(resourceRequest.IsActiveEntity().eq(false)));
    draftService.patchDraft(update);
  }

  public void deleteResourceRequestWithCapacity(String resourceRequestId, BigDecimal resourceRequestCapacity) {
    // Get Existing capacity of parent.
    BigDecimal draftCapacity = getTotalRequestedCapacityFromId(resourceRequestId);
    // Calculate new capacity.
    BigDecimal updatedCapacity = draftCapacity.subtract(resourceRequestCapacity);
    // Update Parent.
    CqnUpdate update = Update.entity(ResourceRequests_.class).data("requestedCapacity", updatedCapacity).where(
        resourceRequest -> resourceRequest.ID().eq(resourceRequestId).and(resourceRequest.IsActiveEntity().eq(false)));
    draftService.patchDraft(update);
  }

  public String getIDfromContext(EventContext context) {
    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    Map<String, Object> targetKeys;

    if (context.getEvent().equals(DraftService.EVENT_DRAFT_NEW)) {
      CqnStructuredTypeRef cqnReference = ((DraftNewEventContext) context).getCqn().ref();
      /*
       * For new capacity requirement the URL looks like
       * /ResourceRequest(ID=RRID,IsActiveEntity=false)/capacityRequirement Here we
       * need to fetch the Resource Request ID(parent key) thus we use rootKeys.
       */
      targetKeys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, cqnReference).rootKeys();
    } else {
      /*
       * For delete of capacity requirement the URL looks like
       * ResourceRequestCapacities(ID=RRCID,IsActiveEntity=false) Here we need to
       * fetch the Resource Request Capcity ID(target entity ket) thus we use
       * targetKeys.
       */
      CqnDelete cqnDelete = ((DraftCancelEventContext) context).getCqn();
      targetKeys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, cqnDelete).targetKeys();
    }
    return (String) targetKeys.get("ID");
  }

// Query helpers.

  public ResourceRequestCapacities getResourceRequestCapacityFromId(String resourceRequestCapacityId) {
    CqnSelect select = Select.from(ResourceRequestCapacities_.class)
        .where(resourceRequestCapacity -> resourceRequestCapacity.ID().eq(resourceRequestCapacityId)
            .and(resourceRequestCapacity.IsActiveEntity().eq(false)));
    final Result result = draftService.run(select);
    return result.single(ResourceRequestCapacities.class);
  }

  public BigDecimal getTotalRequestedCapacityFromId(String resourceRequestId) {
    final String TOTAL_CAPACITY = "totalCapacity";
    BigDecimal totalCapacity;
    CqnSelect select = Select.from(ResourceRequestCapacities_.class)
        .columns(capacity -> CQL.sum(capacity.requestedCapacity()).as(TOTAL_CAPACITY))
        .groupBy(capacity -> capacity.resourceRequest_ID(), capacity -> capacity.IsActiveEntity()).having(
            capacity -> capacity.resourceRequest_ID().eq(resourceRequestId).and(capacity.IsActiveEntity().eq(false)));
    final Result result = draftService.run(select);
    /*
     * There is a difference between the behavior of SQLite and HANA. So, when
     * you're running on mockserver, totalCapacity will be of type Integer and when
     * you're working on a deployed application, totalCapacity will be of type
     * BigInteger.
     */
    if ((result.single(ResourceRequestCapacities.class).get(TOTAL_CAPACITY)) instanceof Integer) {
      Integer totalCap = (Integer) result.single(ResourceRequestCapacities.class).get(TOTAL_CAPACITY);
      totalCapacity = BigDecimal.valueOf(totalCap);
    } else {
      totalCapacity = (BigDecimal) result.single(ResourceRequestCapacities.class).get(TOTAL_CAPACITY);
    }
    return totalCapacity;
  }

// Helper function to fill derived values. 

  public void fillRequestedCapacityInMinutes(ResourceRequestCapacities resourceRequestCapacity) {
    // Set the requested capacity in minutes based on requested capacity,
    resourceRequestCapacity.setRequestedCapacityInMinutes(
        resourceRequestCapacity.getRequestedCapacity().multiply(BigDecimal.valueOf(60)).intValue());
  }

  public void fillStartTime(ResourceRequestCapacities resourceRequestCapacity) {
// Set start time based on start date 
    resourceRequestCapacity.setStartTime(
        resourceRequestCapacity.getStartDate().atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant());
  }

  public void fillEndTime(ResourceRequestCapacities resourceRequestCapacity) {
    // Set end time based on end date
    resourceRequestCapacity.setEndTime(resourceRequestCapacity.getEndDate().plusDays(1).atTime(LocalTime.MIDNIGHT)
        .atZone(ZoneId.systemDefault()).toInstant());
  }

}