package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.resourcemanagement.skill.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

import proficiencyservice.ProficiencyLevels;

@Repository
public class WorkForceProficiencyDAOImpl implements WorkForceProficiencyDAO {

  private static final Logger LOGGER = LoggerFactory.getLogger(WorkForceProficiencyDAOImpl.class);
  private static final Marker WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION
      .getMarker();

  private final PersistenceService persistenceService;

  @Autowired
  public WorkForceProficiencyDAOImpl(final PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Override
  public void save(final ProficiencySets proficiencySet) {
    CqnInsert cqnInsert = Insert.into(ProficiencySets_.CDS_NAME).entry(proficiencySet);
    try {
      this.persistenceService.run(cqnInsert);
      LOGGER.info("Inserted ProficiencySet successfully");
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION,
          "Error occurred while inserting Proficiency set Information");
      throw new TransactionException(serviceException, "inserting", "ProficiencySets");
    }
  }

  @Override
  public List<ProficiencySets> readAll() {
    CqnSelect cqnSelect = Select.from(ProficiencySets_.class).columns(profSet -> profSet.ID()).where(profSet -> profSet.OID().isNotNull());
    return this.persistenceService.run(cqnSelect).listOf(ProficiencySets.class);
  }

  @Override
  public Row getExistingProfSet(String profScaleID) {
    Result profScale = persistenceService
        .run(Select.from(ProficiencySets_.CDS_NAME).where(b -> b.get(ProficiencySets.OID).eq(profScaleID)));
    if (!IsNullCheckUtils.isNullOrEmpty(profScale))
      return profScale.single();
    else
      return null;
  }

  @Override
  public void update(final ProficiencySets proficiencySet) {
    CqnUpdate cqnUpdate = Update.entity(ProficiencySets_.CDS_NAME).data(proficiencySet);
    try {
      this.persistenceService.run(cqnUpdate);
      LOGGER.info("Updated ProficiencySet successfully");
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION,
          "Error occurred while updating Proficiency Information");
      throw new TransactionException(serviceException, "updating", "ProficiencySets");
    }
  }

  @Override
  public Row getExistingProfLevel(String profLevelID) {
    Result profLevel = persistenceService
        .run(Select.from(ProficiencyLevels_.CDS_NAME).where(b -> b.get(ProficiencyLevels.ODM_UUID).eq(profLevelID)));
    if (!IsNullCheckUtils.isNullOrEmpty(profLevel))
      return profLevel.single();
    else
      return null;
  }

  @Override
  public Boolean isProficiencySetRestrictionAllowed(String proficiencySetID) {
    Result skill = persistenceService.run(Select.from(Skills_.CDS_NAME)
            .where(c -> c.get(Skills.PROFICIENCY_SET_ID).eq(proficiencySetID)
                    .and(c.get(Skills.LIFECYCLE_STATUS_CODE).eq(0))).limit(1));

    if (IsNullCheckUtils.isNullOrEmpty(skill))
      return Boolean.TRUE;
    else
      return Boolean.FALSE;
  }

  @Override
  public void restrictProficiencySet(String proficiencySetID) {
    Map<String, Object> lifecycleStatusCode = new HashMap<>();
    lifecycleStatusCode.put("lifecycleStatus_code", 1);
    try {
      persistenceService.run(Update.entity(ProficiencySets_.CDS_NAME)
              .data(lifecycleStatusCode)
              .where(profSet -> profSet.get(ProficiencySets.ID).eq(proficiencySetID)));
      LOGGER.info("Restricted ProficiencySet successfully");
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION,
              "Error occurred while restricting ProficiencySet Information");
      throw new TransactionException(serviceException, "restricting", "ProficiencySets");
    }
  }


  @Override
  public String getProficiencySetName(String proficiencySetId) {

    Result proficiencySet = persistenceService
            .run(Select.from(ProficiencySets_.CDS_NAME).where(b -> b.get(ProficiencySets.ID).eq(proficiencySetId)));
    if (!IsNullCheckUtils.isNullOrEmpty(proficiencySet))
      return proficiencySet.single().get(ProficiencySets.NAME).toString();
    else
      return "";

  }

}
