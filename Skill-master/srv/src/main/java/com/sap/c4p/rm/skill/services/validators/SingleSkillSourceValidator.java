package com.sap.c4p.rm.skill.services.validators;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;
import com.sap.c4p.rm.skill.utils.HttpStatus;

/**
 * Validator class to ensure a single source of supply for skill Master data
 */
@Component
public class SingleSkillSourceValidator {

  private final PersistenceService persistenceService;

  @Autowired
  public SingleSkillSourceValidator(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  /**
   * validates a single entry and checks for the presence of MDI key -OID
   *
   * @param entityData holds the respective entity's data
   */
  public void validateEntry(final Map<String, Object> entityData) {
    if (entityData.get("OID") != null) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.SKILL_FROM_MDICANNOT_BE_MAINTAINED);
    }
  }

  /**
   * Check if entry has been replicated from MDI by reading the respective
   * entity's data from the Db
   *
   * @param entityName - Entity Name
   * @param keyID      - Respective Entity's key field
   */
  public void checkIfEntryIsMDIReplicated(final String entityName, String keyID) {
    Result result = persistenceService.run(Select.from(entityName).where(b -> b.get("ID").eq(keyID)));
    if (!IsNullCheckUtils.isNullOrEmpty(result) && !IsNullCheckUtils.isNullOrEmpty(result.single())
        && !IsNullCheckUtils.isNullOrEmpty(result.single().get("OID")))
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.SKILL_FROM_MDICANNOT_BE_MAINTAINED);

  }

  /**
   * Checks if MDI replication is allowed
   *
   * @return true implies MDI Replication is possible false implies MDI
   *         Replication is not possible
   */
  public Boolean checkIfMDIReplicationAllowed() {
    // Check if the system is a fresh system
    if (checkIfFreshSystem().equals(Boolean.TRUE))
      return Boolean.TRUE;
    else if (checkIfMDIKeysAreNull().equals(Boolean.TRUE))
      return Boolean.FALSE;
    else
      return Boolean.TRUE;
  }

  /**
   * Checks if Skills, Proficiency sets, Catalogs can be created in RM
   *
   * @return true implies RM applications can be used to maintain Skills, Catalogs
   *         and Proficiency Sets false implies RM applications can NOT be used to
   *         maintain Skills, Catalogs and Proficiency Sets
   */
  public Boolean checkIfRMSkillsCreationAllowed() {
    // Check if the system is a fresh system
    if (checkIfFreshSystem().equals(Boolean.TRUE))
      return Boolean.TRUE;
    else if (checkIfMDIKeysAreNull().equals(Boolean.TRUE))
      return Boolean.TRUE;
    else
      return Boolean.FALSE;
  }

  /**
   * Checks if the MDI keys are Null
   *
   * @return true implies MDI Replication is not possible as MDI keys are Null
   *         false implies MDI Replication is possible as MDI keys are not Null
   */
  public Boolean checkIfMDIKeysAreNull() {
    Result mdiEntryProficiencySet = null;
    Result mdiEntryProficiencyLevels = null;
    Result mdiEntrySkill = null;
    Result mdiEntryCatalog = persistenceService
        .run(Select.from("CatalogService.Catalogs").where(b -> b.get("OID").isNull()).limit(1));
    if (IsNullCheckUtils.isNullOrEmpty(mdiEntryCatalog)) {
      mdiEntryProficiencySet = persistenceService.run(Select.from("ProficiencyService.ProficiencySets").where(
          b -> b.get("OID").isNull().and(b.get("ID").isNot(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID)))
          .limit(1));
    } else
      return Boolean.TRUE;

    if (IsNullCheckUtils.isNullOrEmpty(mdiEntryProficiencySet)) {
      mdiEntryProficiencyLevels = persistenceService
          .run(Select.from("ProficiencyService.ProficiencyLevels").where(b -> b.get("odmUUID").isNull()
              .and(b.get("ID").isNot(DefaultProficiencySetService.DEFAULT_PROFICIENCY_LEVEL_ID))).limit(1));
    } else
      return Boolean.TRUE;

    if (IsNullCheckUtils.isNullOrEmpty(mdiEntryProficiencyLevels)) {
      mdiEntrySkill = persistenceService
          .run(Select.from("SkillService.Skills").where(b -> b.get("OID").isNull()).limit(1));
    } else
      return Boolean.TRUE;

    if (IsNullCheckUtils.isNullOrEmpty(mdiEntrySkill)) {
      return Boolean.FALSE;
    } else
      return Boolean.TRUE;
  }

  /**
   * Checks if the system does not contain any skill data in RM-Db
   *
   * @return true implies a fresh and clean system with no entries in tables(Skill
   *         relevant) false implies entries exists either via RM-Skill
   *         applications or via MDI
   */
  public Boolean checkIfFreshSystem() {
    Result rmEntryProficiencySet = null;
    Result rmEntrySkill = null;
    Result rmEntryCatalog = persistenceService.run(Select.from("CatalogService.Catalogs").limit(1));
    if (IsNullCheckUtils.isNullOrEmpty(rmEntryCatalog)) {
      rmEntryProficiencySet = persistenceService.run(Select.from("ProficiencyService.ProficiencySets")
          .where(b -> b.get("ID").isNot(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID)).limit(1));
    } else
      return Boolean.FALSE;

    if (IsNullCheckUtils.isNullOrEmpty(rmEntryProficiencySet)) {
      rmEntrySkill = persistenceService.run(Select.from("SkillService.Skills").limit(1));
    } else
      return Boolean.FALSE;

    if (IsNullCheckUtils.isNullOrEmpty(rmEntrySkill)) {
      return Boolean.TRUE;
    } else
      return Boolean.FALSE;
  }
}
