package com.sap.c4p.rm.skill.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import catalogservice.CatalogService_;
import catalogservice.Catalogs2Skills;
import catalogservice.Catalogs2Skills_;
import catalogservice.Skills;

@Repository
public class Catalogs2SkillsRepository {

  private final DraftService draftService;
  private final PersistenceService persistenceService;

  @Autowired
  public Catalogs2SkillsRepository(@Qualifier(CatalogService_.CDS_NAME) DraftService draftService,
      PersistenceService persistenceService) {
    this.draftService = draftService;
    this.persistenceService = persistenceService;
  }

  public Catalogs2Skills createActiveEntity(Catalogs2Skills catalogs2Skills) {
    CqnInsert insert = Insert.into(Catalogs2Skills_.class).entry(catalogs2Skills);
    return this.persistenceService.run(insert).single(Catalogs2Skills.class);
  }

  public void deleteBySkill(Skills skill) {
    CqnDelete delete = Delete.from(Catalogs2Skills_.class).where(x -> x.skill_ID().eq(skill.getId()));
    this.draftService.run(delete);
  }

  public void deleteBySkillIdAndCatalogId(String skillId, String catalogId) {
    CqnDelete delete = Delete.from(Catalogs2Skills_.class)
        .where(x -> x.skill_ID().eq(skillId).and(x.catalog_ID().eq(catalogId)));
    this.persistenceService.run(delete);
  }
}
