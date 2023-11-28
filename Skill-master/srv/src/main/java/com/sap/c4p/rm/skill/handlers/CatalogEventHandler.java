package com.sap.c4p.rm.skill.handlers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.repositories.CatalogRepository;
import com.sap.c4p.rm.skill.services.AuditLogService;
import com.sap.c4p.rm.skill.services.validators.CatalogValidator;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

import catalogservice.CatalogService_;
import catalogservice.Catalogs;
import catalogservice.Catalogs_;
import catalogservice.CreateCatalogWithDialogContext;

@Component
@ServiceName(CatalogService_.CDS_NAME)
public class CatalogEventHandler implements EventHandler {

  private static final String AUDITLOG_ATTRIBUTEKEY = "catalog";
  private static final String AUDITLOG_TYPE = "skill catalog";

  private final CatalogValidator catalogValidator;
  private final CatalogRepository catalogRepository;
  private final EventHandlerUtility eventHandlerUtility;
  private final AuditLogService auditLogService;

  @Autowired
  public CatalogEventHandler(CatalogValidator catalogValidator, CatalogRepository catalogRepository,
      EventHandlerUtility eventHandlerUtility, AuditLogService auditLogService) {
    this.catalogValidator = catalogValidator;
    this.catalogRepository = catalogRepository;
    this.eventHandlerUtility = eventHandlerUtility;
    this.auditLogService = auditLogService;
  }

  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT,
      CqnService.EVENT_UPDATE }, entity = Catalogs_.CDS_NAME)
  public void beforeModification(final List<Catalogs> catalogs) {
    for (final Catalogs catalog : catalogs) {
      this.catalogValidator.validate(catalog);
    }
  }

  @Before(event = { CqnService.EVENT_DELETE }, entity = Catalogs_.CDS_NAME)
  public void beforeDelete(final CdsDeleteEventContext context) {
    Optional<Catalogs> catalog = this.catalogRepository.findActiveEntityById(
        this.eventHandlerUtility.getEntityIdFromEventContext(context.getModel(), context.getCqn()));
    this.catalogValidator.validateDeletion(catalog);
    catalog.ifPresent(c -> this.auditLogService.logConfigurationChange(Catalogs.ID, c.getId(), AUDITLOG_ATTRIBUTEKEY,
        c.getName(), null, AUDITLOG_TYPE));
  }

  @On(event = CreateCatalogWithDialogContext.CDS_NAME, entity = Catalogs_.CDS_NAME)
  public void onCreateSkillWithDialogAction(final CreateCatalogWithDialogContext context) {
    final Catalogs newCatalog = Catalogs.create();
    newCatalog.setName(context.getName());
    newCatalog.setDescription(context.getDescription());

    Catalogs draftCatalog = this.catalogRepository.createDraft(newCatalog);

    context.setResult(draftCatalog);
  }
}
