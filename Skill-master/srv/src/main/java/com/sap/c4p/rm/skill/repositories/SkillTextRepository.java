package com.sap.c4p.rm.skill.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import skillservice.SkillService_;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.SkillsTexts_;

@Repository
public class SkillTextRepository {
  private final PersistenceService persistenceService;
  private final DraftService draftService;

  @Autowired
  public SkillTextRepository(@Qualifier(SkillService_.CDS_NAME) DraftService draftService,
      PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
    this.draftService = draftService;
  }

  public SkillsTexts createDraft(SkillsTexts skillText) {
    final CqnInsert insert = Insert.into(SkillsTexts_.class).entry(skillText);
    return this.draftService.newDraft(insert).single(SkillsTexts.class);
  }

  /**
   * The function update the texts from a single active skill.
   *
   * @param skillText {@link SkillsTexts}
   */
  public void updateActiveEntity(SkillsTexts skillText) {
    CqnUpdate update = Update.entity(SkillsTexts_.class).where(s -> s.ID_texts().eq(skillText.getIDTexts()))
        .data(skillText);
    this.persistenceService.run(update);
  }

  /**
   * The function update the texts from a single drafted skill.
   *
   * @param skillText {@link SkillsTexts}
   */
  public void updateDraft(SkillsTexts skillText) {
    CqnUpdate update = Update.entity(SkillsTexts_.class)
        .where(s -> s.ID_texts().eq(skillText.getIDTexts()).and(s.IsActiveEntity().eq(Boolean.FALSE))).data(skillText);
    this.draftService.patchDraft(update);
  }

  /**
   * Deletes all active draft texts for a given {@link Skills}
   *
   * Required for the workaround for
   * https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/767
   *
   * Remove once the issue is fixed
   *
   * @param skill {@link Skills}
   */
  public void deleteActiveTextsOfSkill(final Skills skill) {
    this.persistenceService.run(Delete.from(SkillsTexts_.class).where(t -> t.ID().eq(skill.getId())));
  }
}
