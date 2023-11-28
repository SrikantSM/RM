package com.sap.c4p.rm.skill.repositories;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyService_;

@Repository
public class ProficiencyLevelTextRepository {
  private final PersistenceService persistenceService;
  private final DraftService draftService;

  @Autowired
  public ProficiencyLevelTextRepository(final PersistenceService persistenceService,
      @Qualifier(ProficiencyService_.CDS_NAME) final DraftService draftService) {
    this.persistenceService = persistenceService;
    this.draftService = draftService;
  }

  public ProficiencyLevelsTexts createDraft(ProficiencyLevelsTexts proficiencyLevelText) {
    final CqnInsert insert = Insert.into(ProficiencyLevelsTexts_.class).entry(proficiencyLevelText);
    return this.draftService.newDraft(insert).single(ProficiencyLevelsTexts.class);
  }

  /**
   * Deletes all active draft texts for multiple given {@link ProficiencyLevels}
   *
   * Required for the workaround for
   * https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/767
   *
   * Remove once the issue is fixed
   *
   * @param proficiencyLevels {@link List} of {@link ProficiencyLevels}
   */
  public void deleteActiveTextsOfLevels(final List<ProficiencyLevels> proficiencyLevels) {
    final List<String> proficiencyLevelIds = proficiencyLevels.stream().map(ProficiencyLevels::getId)
        .collect(Collectors.toList());
    this.persistenceService.run(Delete.from(ProficiencyLevelsTexts_.class).where(t -> t.ID().in(proficiencyLevelIds)));
  }
}
