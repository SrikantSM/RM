package com.sap.c4p.rm.skill.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.draft.DraftService;

import skillservice.AlternativeLabels;
import skillservice.AlternativeLabels_;
import skillservice.SkillService_;
import skillservice.Skills;
import skillservice.Skills_;

@Repository
public class AlternativeLabelRepository {
  private final DraftService draftService;

  public AlternativeLabelRepository(@Qualifier(SkillService_.CDS_NAME) DraftService draftService) {
    this.draftService = draftService;
  }

  public List<AlternativeLabels> createDrafts(List<AlternativeLabels> skillTexts) {
    final CqnInsert insert = Insert.into(AlternativeLabels_.class).entries(skillTexts);
    return this.draftService.newDraft(insert).listOf(AlternativeLabels.class);
  }

  public Optional<AlternativeLabels> expandSkill(AlternativeLabels alternativeLabel) {
    final CqnSelect select = Select.from(AlternativeLabels_.class)
        .where(
            l -> l.ID().eq(alternativeLabel.getId()).and(l.IsActiveEntity().eq(alternativeLabel.getIsActiveEntity())))
        .columns(l -> l.skill().expand(Skills_::_all));
    return this.draftService.run(select).first(AlternativeLabels.class);
  }

  /**
   * Deletes all draft alternative labels for a given locale of a given
   * {@link Skills}
   *
   * @param skill  {@link Skills}
   * @param locale {@link String}
   */
  public void deleteDraftsOfSkillAndLocale(Skills skill, String locale) {
    this.draftService.cancelDraft(Delete.from(AlternativeLabels_.class)
        .where(l -> l.skill_ID().eq(skill.getId()).and(l.language_code().eq(locale))));
  }
}
