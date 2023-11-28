package com.sap.c4p.rm.skill.services.validators;

import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.reflect.CdsAssociationType;
import com.sap.cds.reflect.CdsElement;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.utils.model.CdsAnnotations;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import skillservice.Skills;

/**
 * Generic validator to verify the completeness of a given entity
 *
 */
@Component
public class CompletenessValidator {

  // To use constants for draft field names, skill has been
  // chosen, but names will be the same on other entities
  private static final String HAS_ACTIVE_ENTITY = Skills.HAS_ACTIVE_ENTITY;
  private static final String HAS_DRAFT_ENTITY = Skills.HAS_DRAFT_ENTITY;
  private static final String DRAFT_ADMINISTRATIVE_DATA_DRAFT_UUID = Skills.DRAFT_ADMINISTRATIVE_DATA_DRAFT_UUID;

  private final CdsModel model;

  @Autowired
  public CompletenessValidator(CdsModel model) {
    this.model = model;
  }

  /**
   * Get all non-readonly fields and compositions of an entity.
   *
   * @param entityName CdsName of the entity to query
   * @return a Stream of CdsElements to work on
   */
  private Stream<CdsElement> getPatchElements(final String entityName) {
    Stream<CdsElement> fields = model.getEntity(entityName).elements();
    return fields.filter(cdsElement -> !cdsElement.isKey()) // no key fields
        // simple types or compositions
        .filter(cdsElement -> cdsElement.getType().isSimple()
            || (cdsElement.getType().isAssociation() && ((CdsAssociationType) cdsElement.getType()).isComposition()))
        // no readonly fields
        .filter(cdsElement -> !CdsAnnotations.CORE_COMPUTED.isTrue(cdsElement))
        // no draft metadata fields
        .filter(cdsElement -> !cdsElement.getName().equals(HAS_ACTIVE_ENTITY)
            && !cdsElement.getName().equals(HAS_DRAFT_ENTITY)
            && !cdsElement.getName().equals(DRAFT_ADMINISTRATIVE_DATA_DRAFT_UUID));
  }

  /**
   * Validate that all non-readonly fields and compositions of the draft-root
   * entity are present. Otherwise, the modification does not come from a draft
   * save, but from a (potentially invalid) deep insert. To prevent this, the
   * method will throw a ServiceException
   *
   * @param entityName CdsName of the entity to query
   * @param entityData CdsData of the entity to validate
   */
  public void validateCompleteness(final String entityName, final Map<String, Object> entityData) {
    this.getPatchElements(entityName).filter(cdsElement -> !entityData.containsKey(cdsElement.getName())).findAny()
        .ifPresent(cdsElement -> {
          throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_FULL_ENTITY_PASSED);
        });
  }

}
