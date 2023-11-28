package com.sap.c4p.rm.skill.config;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.sap.cds.reflect.CdsEntity;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.reflect.CdsService;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.utils.model.CdsAnnotations;

import com.sap.c4p.rm.skill.services.validators.CompletenessValidator;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

@Configuration
public class DynamicCompletenessValidatorRegistrationConfig implements InitializingBean {

  private static final String[] COMPLETNESS_VALIDATION_EVENTS = new String[] { CqnService.EVENT_CREATE,
      CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT };

  private List<DraftService> draftServices;
  private CompletenessValidator validator;
  private CdsModel model;
  private EventHandlerUtility eventHandlerUtility;

  @Autowired
  public DynamicCompletenessValidatorRegistrationConfig(CdsModel model, List<DraftService> services,
      CompletenessValidator validator, EventHandlerUtility eventHandlerUtitily) {
    this.model = model;
    this.draftServices = services;
    this.validator = validator;
    this.eventHandlerUtility = eventHandlerUtitily;
  }

  @Override
  public void afterPropertiesSet() throws Exception {
    Map<String, List<String>> entitiesForValidation = findEntitiesForCompletenessCheck();
    this.draftServices.forEach(ds -> this.registerCompleteValidator(ds, entitiesForValidation.get(ds.getName())));
  }

  Map<String, List<String>> findEntitiesForCompletenessCheck() {
    List<String> draftServiceNames = this.draftServices.stream().map(DraftService::getName)
        .collect(Collectors.toList());
    // only check for entities in draft-enabled services
    return this.model.services().filter(service -> draftServiceNames.contains(service.getName()))
        .collect(Collectors.toMap(CdsService::getName, this::findEntitiesForCompletenessValidation));
  }

  /**
   * Entities should not be read-only and views on db entities (which excludes
   * Entities with end with _drafts)
   */
  private List<String> findEntitiesForCompletenessValidation(CdsService service) {
    return service.entities().filter(entity -> !CdsAnnotations.READONLY.isTrue(entity) && entity.isView())
        .map(CdsEntity::getQualifiedName).collect(Collectors.toList());
  }

  /**
   * For each entity given in the event context we validate the completeness for
   * the events
   * {@link DynamicCompletenessValidatorRegistrationConfig#COMPLETNESS_VALIDATION_EVENTS}.
   * Should be applied early, before any other validations which might rely on
   * complete entities.
   */
  private void registerCompleteValidator(DraftService draftService, List<String> entities) {
    draftService.before(COMPLETNESS_VALIDATION_EVENTS, entities.toArray(new String[entities.size()]),
        HandlerOrder.EARLY, this::completenessHandler);
  }

  /**
   * CAP Event Handler
   */
  private void completenessHandler(EventContext context) {
    this.eventHandlerUtility.getEntitiesFromEventContext(context)
        .forEach(entry -> this.validator.validateCompleteness(context.getTarget().getQualifiedName(), entry));
  }

}
