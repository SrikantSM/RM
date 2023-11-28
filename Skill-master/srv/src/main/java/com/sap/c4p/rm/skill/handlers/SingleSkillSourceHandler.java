package com.sap.c4p.rm.skill.handlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import catalogservice.CatalogService_;
import catalogservice.CreateCatalogWithDialogContext;
import proficiencyservice.CreateProficiencySetWithDialogContext;
import proficiencyservice.ProficiencyService_;
import skillservice.CreateSkillWithDialogContext;
import skillservice.SkillService_;

/**
 * Handler to ensure a single source of supply for Skill Master Data
 */
@Component
@ServiceName({ SkillService_.CDS_NAME, ProficiencyService_.CDS_NAME, CatalogService_.CDS_NAME })
public class SingleSkillSourceHandler implements EventHandler {

  private final EventHandlerUtility eventHandlerUtility;

  private final SingleSkillSourceValidator singleSkillSourceValidator;

  @Autowired
  public SingleSkillSourceHandler(EventHandlerUtility eventHandlerUtility,
      SingleSkillSourceValidator singleSkillSourceValidator) {
    this.eventHandlerUtility = eventHandlerUtility;
    this.singleSkillSourceValidator = singleSkillSourceValidator;
  }

  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT, CqnService.EVENT_UPDATE, CqnService.EVENT_DELETE,
      CreateCatalogWithDialogContext.CDS_NAME, CreateProficiencySetWithDialogContext.CDS_NAME,
      CreateSkillWithDialogContext.CDS_NAME }, entity = { "SkillService.Skills", "ProficiencyService.ProficiencySets",
          "CatalogService.Catalogs" })
  public void beforeModification(EventContext context) {
    if (context.getEvent().equals(CqnService.EVENT_DELETE)) {
      this.singleSkillSourceValidator.checkIfEntryIsMDIReplicated(context.getTarget().getQualifiedName(),
          this.eventHandlerUtility.getEntityIdFromEventContext(((CdsDeleteEventContext) context).getModel(),
              ((CdsDeleteEventContext) context).getCqn()));
    } else if ((context.getEvent().equals(CreateCatalogWithDialogContext.CDS_NAME))
        || (context.getEvent().equals(CreateProficiencySetWithDialogContext.CDS_NAME))
        || (context.getEvent().equals(CreateSkillWithDialogContext.CDS_NAME))
        || (context.getEvent().equals(CqnService.EVENT_CREATE))) {
      if (singleSkillSourceValidator.checkIfRMSkillsCreationAllowed().equals(Boolean.FALSE)) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CREATION_VIA_RMAPPS_RESTRICTED);
      }
    } else {
      this.eventHandlerUtility.getEntitiesFromEventContext(context)
          .forEach(entry -> singleSkillSourceValidator.validateEntry(entry));
    }
  }

}