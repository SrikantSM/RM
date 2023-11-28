package com.sap.c4p.rm.skill.repositories;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyLevels_;
import proficiencyservice.ProficiencyService_;

@Repository
public class ProficiencyLevelRepository {

  private final DraftService draftService;
  private final PersistenceService persistenceService;

  public ProficiencyLevelRepository(@Qualifier(ProficiencyService_.CDS_NAME) final DraftService draftService,
      final PersistenceService persistenceService) {
    this.draftService = draftService;
    this.persistenceService = persistenceService;
  }

  public List<ProficiencyLevels> expandTexts(final List<ProficiencyLevels> proficiencyLevels) {
    final Stream<ProficiencyLevels> proficiencyLevelsStream = proficiencyLevels.stream().map(proficiencyLevel -> {
      final CqnSelect select = Select.from(ProficiencyLevels_.class)
          .where(s -> s.ID().eq(proficiencyLevel.getId())
              .and(s.IsActiveEntity().eq(
                  proficiencyLevel.getIsActiveEntity() == null ? Boolean.TRUE : proficiencyLevel.getIsActiveEntity())))
          .columns(ProficiencyLevels_::_all, s -> s.texts().expand());
      return this.draftService.run(select).single(ProficiencyLevels.class);
    });

    return proficiencyLevelsStream.filter(Objects::nonNull).collect(Collectors.toList());
  }

  public void updateDraft(final ProficiencyLevels proficiencyLevel) {
    final CqnUpdate update = Update.entity(ProficiencyLevels_.class)
        .where(s -> s.ID().eq(proficiencyLevel.getId()).and(s.IsActiveEntity().eq(Boolean.FALSE)))
        .data(proficiencyLevel);
    this.draftService.patchDraft(update);
  }

  public void updateActiveEntity(final ProficiencyLevels proficiencyLevels) {
    final CqnUpdate update = Update.entity(com.sap.resourcemanagement.skill.ProficiencyLevels_.class)
        .where(s -> s.ID().eq(proficiencyLevels.getId())).data(proficiencyLevels);
    this.persistenceService.run(update);
  }

  public Optional<ProficiencyLevels> findById(final String id, final Boolean isActiveEntity) {
    final CqnSelect select = Select.from(ProficiencyLevels_.class)
        .where(x -> x.ID().eq(id).and(x.IsActiveEntity().eq(isActiveEntity)));

    return this.draftService.run(select).first(ProficiencyLevels.class);
  }

  public List<ProficiencyLevels> findByProficiencyLevelText(final ProficiencyLevelsTexts text) {
    final CqnSelect select = Select.from(ProficiencyLevels_.class).where(
        s -> s.texts().ID_texts().eq(text.getIDTexts()).and(s.texts().IsActiveEntity().eq(text.getIsActiveEntity())))
        .columns(ProficiencyLevels_::_all, s -> s.texts().expand());
    return this.draftService.run(select).listOf(ProficiencyLevels.class);
  }

  public Optional<ProficiencyLevels> findNextLowerRankedDraft(final ProficiencyLevels proficiencyLevel) {
    final CqnSelect select = Select.from(ProficiencyLevels_.class)
        .where(x -> x.proficiencySet_ID().eq(proficiencyLevel.getProficiencySetId())
            .and(x.IsActiveEntity().eq(Boolean.FALSE)).and(x.rank().lt(proficiencyLevel.getRank())))
        .orderBy(x -> x.rank().desc());

    return this.draftService.run(select).first(ProficiencyLevels.class);
  }

  public Optional<ProficiencyLevels> findNextHigherRankedDraft(final ProficiencyLevels proficiencyLevel) {
    final CqnSelect select = Select.from(ProficiencyLevels_.class)
        .where(x -> x.proficiencySet_ID().eq(proficiencyLevel.getProficiencySetId())
            .and(x.IsActiveEntity().eq(Boolean.FALSE)).and(x.rank().gt(proficiencyLevel.getRank())))
        .orderBy(x -> x.rank().asc());

    return this.draftService.run(select).first(ProficiencyLevels.class);
  }

  public Optional<ProficiencyLevels> findHighestRankedDraftByProficiencySetId(final String proficiencySetId) {
    final CqnSelect select = Select.from(ProficiencyLevels_.class)
        .where(x -> x.proficiencySet_ID().eq(proficiencySetId).and(x.IsActiveEntity().eq(Boolean.FALSE)))
        .orderBy(x -> x.rank().desc());

    return this.draftService.run(select).first(ProficiencyLevels.class);
  }

  public List<ProficiencyLevels> findLevelsByProficiencySetId(final String proficiencySetId,
      final Boolean isActiveEntity) {
    final CqnSelect select = Select.from(ProficiencyLevels_.class)
        .where(x -> x.proficiencySet_ID().eq(proficiencySetId).and(x.IsActiveEntity().eq(isActiveEntity)));

    return this.draftService.run(select).listOf(ProficiencyLevels.class);
  }

  public List<ProficiencyLevels> getLanguagesByProficiencyLevels(final List<ProficiencyLevels> proficiencyLevels,
      final Boolean isActiveEntity) {
    String[] ids = proficiencyLevels.stream().map(ProficiencyLevels::getId).toArray(String[]::new);
    CqnSelect select = Select.from(ProficiencyLevels_.class)
        .columns(ProficiencyLevels_::ID, pl -> pl.texts().expand(ProficiencyLevelsTexts_::locale))
        .where(pl -> pl.ID().in(ids).and(pl.IsActiveEntity().eq(isActiveEntity)));
    if (Boolean.TRUE.equals(isActiveEntity)) {
      return this.persistenceService.run(select).listOf(ProficiencyLevels.class);
    } else {
      return this.draftService.run(select).listOf(ProficiencyLevels.class);
    }
  }
}
