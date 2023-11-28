package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.cds.ql.cqn.CqnSelect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao.WorkForceCapabilityCatalogDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

import com.sap.resourcemanagement.skill.*;

@Repository
public class WorkforceCapabilityDAOImpl implements WorkforceCapabilityDAO {

  private static final Logger LOGGER = LoggerFactory.getLogger(WorkForceCapabilityCatalogDAO.class);
  private static final Marker WORKFORCE_CAPABILITY_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_REPLICATION
      .getMarker();

  private final PersistenceService persistenceService;

  @Autowired
  public WorkforceCapabilityDAOImpl(final PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Override
  public void save(Skills skills, List<Catalogs2Skills> catalogs2SkillsList) {
    CqnInsert cqnInsert = Insert.into(Skills_.CDS_NAME).entry(skills);
    try {
      Result skill = this.persistenceService.run(cqnInsert);
      if (!IsNullCheckUtils.isNullOrEmpty(catalogs2SkillsList)) {
        catalogs2SkillsList.stream()
            .forEach(catalog2Skill -> catalog2Skill.setSkillId(skill.single().get(Skills.ID).toString()));
        this.persistenceService.run(Insert.into(Catalogs2Skills_.CDS_NAME).entries(catalogs2SkillsList));
      }
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_REPLICATION,
          "Error occurred while inserting Skill or Catalog2Skill Information");
      throw new TransactionException(serviceException, "inserting");
    }
  }

  @Override
  public void update(Skills skills, List<Catalogs2Skills> catalogs2SkillsList) {
    CqnUpdate cqnUpdate = Update.entity(Skills_.CDS_NAME).data(skills);
    try {
      this.persistenceService.run(cqnUpdate);
      if (!IsNullCheckUtils.isNullOrEmpty(catalogs2SkillsList)) {
        this.persistenceService.run(
            Delete.from(Catalogs2Skills_.class).where(catalogs2Skill -> catalogs2Skill.skill_ID().eq(skills.getId())));
        this.persistenceService.run(Insert.into(Catalogs2Skills_.CDS_NAME).entries(catalogs2SkillsList));
      }
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_REPLICATION, "Error occurred while updating Skills Information");
      throw new TransactionException(serviceException, "updating");
    }
  }

  @Override
  public Row getExistingSkill(String skillID) {
    Result skills = persistenceService.run(Select.from(Skills_.CDS_NAME).where(b -> b.get(Skills.OID).eq(skillID)));
    if (!IsNullCheckUtils.isNullOrEmpty(skills))
      return skills.single();
    else
      return null;
  }

  @Override
  public Row getExistingProfID(String profID) {
    Result profSets = persistenceService
        .run(Select.from(ProficiencySets_.CDS_NAME).where(b -> b.get(ProficiencySets.OID).eq(profID)));
    if (!IsNullCheckUtils.isNullOrEmpty(profSets))
      return profSets.single();
    else
      return null;
  }

  @Override
  public Row getExistingCatalogID(String catalogOID) {
    Result catalog = persistenceService
        .run(Select.from(Catalogs_.CDS_NAME).where(b -> b.get(Catalogs.OID).eq(catalogOID)));
    if (!IsNullCheckUtils.isNullOrEmpty(catalog))
      return catalog.single();
    else
      return null;
  }

  @Override
  public void restrictSkill(String skillID) {
    Map<String, Object> lifecycleStatusCode = new HashMap<>();
    lifecycleStatusCode.put("lifecycleStatus_code", 1);
    try {
      persistenceService.run(Update.entity(Skills_.CDS_NAME).data(lifecycleStatusCode)
              .where(skill -> skill.get(Skills.ID).eq(skillID)));
      LOGGER.info("Restricted Skill successfully");
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_REPLICATION,
              "Error occurred while restricting Skills Information");
      throw new TransactionException(serviceException, "restricting");
    }
  }

  @Override
  public List<Skills> readAll() {
    CqnSelect cqnSelect = Select.from(Skills_.class).columns(skill -> skill.ID()).where(skill -> skill.OID().isNotNull());
    return this.persistenceService.run(cqnSelect).listOf(Skills.class);
  }

}
