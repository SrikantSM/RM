package com.sap.c4p.rm.resourcerequest.validations;

import java.time.chrono.ChronoLocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.ValuePath;

import com.sap.resourcemanagement.integration.ReferenceObjectTypes_;

import resourcerequestservice.ReferenceObjects;
import resourcerequestservice.ReferenceObjects_;
import resourcerequestservice.ResourceRequests_;

@Component
public class ReferenceObjectPublicApiValidator extends InjectionValidator<ReferenceObjects, ReferenceObjects_> {

  private Messages messages;
  private final PersistenceService persistenceService;

  @Autowired
  protected ReferenceObjectPublicApiValidator(Messages messages, PersistenceService persistenceService) {
    super(messages, ReferenceObjects_.class);
    this.persistenceService = persistenceService;
    this.messages = messages;
  }

  @Override
  public List<ValuePath<String, ReferenceObjects_>> extractValuesForHtmlInjection(
      final ReferenceObjects referenceObject) {
    return extractValuesForInjection(referenceObject);
  }

  @Override
  public List<ValuePath<String, ReferenceObjects_>> extractValuesForCsvInjection(
      final ReferenceObjects referenceObject) {
    return extractValuesForInjection(referenceObject);
  }

  public List<ValuePath<String, ReferenceObjects_>> extractValuesForInjection(final ReferenceObjects referenceObject) {

    final Stream<ValuePath<String, ReferenceObjects_>> nameField = Stream
        .of(new ValuePath<>(referenceObject.getName(), ReferenceObjects_::name));

    final Stream<ValuePath<String, ReferenceObjects_>> displayIdField = Stream
        .of(new ValuePath<>(referenceObject.getDisplayId(), ReferenceObjects_::displayId));

    return Stream.concat(nameField, displayIdField).collect(Collectors.toList());
  }

  @Override
  public String getMessageKeyForHtmlInjection() {
    return MessageKeys.RRSRV_CONTAINS_HTML_TAG;
  }

  @Override
  public String getMessageKeyForCsvInjection() {
    return MessageKeys.FORBIDDEN_FIRST_CHARACTER_RRSRV;
  }

  public void validateReferenceObjectTypeCode(Integer referenceObjectTypeCode) {
    if (referenceObjectTypeCode != null) {
      integrityCheckForTypeCode(referenceObjectTypeCode);
    }

    if (referenceObjectTypeCode == null || referenceObjectTypeCode == 0) {
      messages.error(MessageKeys.INVALID_REFTYPECODE_REFOBJCREATE)
          .target(resourcerequestservice.ReferenceObjects_.class, resourcerequestservice.ReferenceObjects_::typeCode);
    }

  }

  public void integrityCheckForTypeCode(Integer referenceObjectTypeCode) {
    final long rowCount = persistenceService.run(Select.from(ReferenceObjectTypes_.class).columns(b -> b.code())
        .where(b -> b.code().eq(referenceObjectTypeCode))).rowCount();
    if (rowCount == 0)
      messages.error(MessageKeys.INVALID_REFERENCETYPE_CODE).target(resourcerequestservice.ReferenceObjects_.class,
          resourcerequestservice.ReferenceObjects_::typeCode);
  }

  public void integrityCheckForRefObject(String refObjectId) {
    final long rowCount = persistenceService
        .run(Select.from(ReferenceObjects_.class).columns(b -> b.ID()).where(b -> b.ID().eq(refObjectId))).rowCount();
    if (rowCount == 0)
      messages.error(MessageKeys.INVALID_REFERENCEOBJECT).target(resourcerequestservice.ReferenceObjects_.class,
          resourcerequestservice.ReferenceObjects_::ID);
  }

  public void validateReferenceObjectDate(String refObjectId, ChronoLocalDate date, String dateType) {

    CqnSelect cqnSelect = Select.from(ReferenceObjects_.class).where(refObj -> refObj.ID().eq(refObjectId))
        .columns(ReferenceObjects_::startDate, ReferenceObjects_::endDate);
    ReferenceObjects persistedReferenceObject = persistenceService.run(cqnSelect).single(ReferenceObjects.class);
    if (dateType.equals(ReferenceObjects.START_DATE)) {
      if (date.isAfter(persistedReferenceObject.getEndDate()))
        messages.error(MessageKeys.INVALID_START_DATE, persistedReferenceObject.getEndDate())
            .target(ReferenceObjects_.class, ReferenceObjects_::startDate);
    } else {
      if (date.isBefore(persistedReferenceObject.getStartDate()))
        messages.error(MessageKeys.INVALID_END_DATE, persistedReferenceObject.getStartDate())
            .target(ReferenceObjects_.class, ReferenceObjects_::endDate);
    }

  }

  public void validateReferenceObjectPropertyApi(resourcerequestservice.ReferenceObjects referenceObject,
      String eventType) {

    if (eventType.equals(CqnService.EVENT_UPDATE)) {
      integrityCheckForRefObject(referenceObject.getId());
    }

    if (eventType.equals(CqnService.EVENT_UPDATE) && (referenceObject.containsKey(ReferenceObjects.START_DATE)
        ^ referenceObject.containsKey(ReferenceObjects.END_DATE))) {
      if (referenceObject.containsKey(ReferenceObjects.START_DATE)) {
        validateReferenceObjectDate(referenceObject.getId(), referenceObject.getStartDate(),
            ReferenceObjects.START_DATE);
      } else {
        validateReferenceObjectDate(referenceObject.getId(), referenceObject.getEndDate(), ReferenceObjects.END_DATE);
      }
    }

    if (eventType.equals(CqnService.EVENT_CREATE)
        || (eventType.equals(CqnService.EVENT_UPDATE) && referenceObject.containsKey(ReferenceObjects.START_DATE)
            && referenceObject.containsKey(ReferenceObjects.END_DATE))) {
      validateObjectDuration(referenceObject.getStartDate(), referenceObject.getEndDate());
    }

    if (eventType.equals(CqnService.EVENT_CREATE)
        || (eventType.equals(CqnService.EVENT_UPDATE) && referenceObject.containsKey(ReferenceObjects.TYPE_CODE))) {
      validateReferenceObjectTypeCode(referenceObject.getTypeCode());
    }

    validateForInjection(referenceObject);

  }

  public void validateObjectDuration(ChronoLocalDate startDate, ChronoLocalDate endDate) {
    /* Validate Start is before the End Dates of Reference Object */
    if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
      messages.error(MessageKeys.INVALID_DATES).target(ReferenceObjects_.class,
          resourcerequestservice.ReferenceObjects_::startDate);
    }
  }

  public void validateRefObjDeletion(String refObjId) {
    final long rowCount = persistenceService.run(Select.from(ResourceRequests_.class)
        .columns(ResourceRequests_::referenceObjectId).where(b -> b.referenceObjectId().eq(refObjId))).rowCount();
    if (rowCount != 0) {
      messages.error(MessageKeys.REFOBJ_DELETION_NOT_POSSIBLE).target(resourcerequestservice.ReferenceObjects_.class,
          resourcerequestservice.ReferenceObjects_::ID);
    }
  }

}
