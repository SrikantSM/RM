package com.sap.c4p.rm.skill.repositories;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnSelectListItem;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.skill.SkillsDownload;
import com.sap.resourcemanagement.skill.SkillsDownload_;

import skillservice.AlternativeLabels;
import skillservice.Catalogs2Skills_;
import skillservice.Catalogs_;
import skillservice.SkillService_;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.SkillsTexts_;
import skillservice.Skills_;

@Repository
public class SkillRepository {
  static final String COUNT = "count";

  private final DraftService draftService;
  private final PersistenceService persistenceService;

  public SkillRepository(@Qualifier(SkillService_.CDS_NAME) DraftService draftService,
      PersistenceService persistenceService) {
    this.draftService = draftService;
    this.persistenceService = persistenceService;
  }

  public long countWithLanguage(String language) {
    CqnSelect select = Select.from(com.sap.resourcemanagement.skill.Skills_.class)
        .columns(CQL.count().as(SkillRepository.COUNT)).where(s -> s.texts().locale().eq(language));
    return (long) this.persistenceService.run(select).single().get(SkillRepository.COUNT);

  }

  public long count() {
    CqnSelect select = Select.from(com.sap.resourcemanagement.skill.Skills_.class)
        .columns(CQL.count().as(SkillRepository.COUNT));
    return (long) this.persistenceService.run(select).single().get(SkillRepository.COUNT);
  }

  /**
   * Select all skills for a language in a format to be used in the skill download
   *
   * This directly calls a database view which joins all needed tables and
   * concatenates alternative labels and catalogs accordingly
   */
  public List<SkillsDownload> findActiveEntitiesForDownload(String language, int limit, int offset) {
    final CqnSelect select = Select.from(SkillsDownload_.class).where(s -> s.locale().eq(language)).limit(limit,
        offset);
    return this.persistenceService.run(select).listOf(SkillsDownload.class);
  }

  public List<Skills> findAllActiveEntities() {
    final CqnSelect select = Select.from(Skills_.class).columns(Skills_::_all, c -> c.alternativeLabels().expand(),
        d -> d.texts().expand(),
        e -> e.catalogAssociations().expand(Catalogs2Skills_::_all, f -> f.catalog().expand()));
    return this.persistenceService.run(select).listOf(Skills.class);
  }

  /**
   *
   * Select ALL fields by id for a skill. Please also see
   * {@link SkillRepository#findById(String, Boolean, Function...)}
   *
   * @param id             The skill id
   * @param isActiveEntity whether drafts should be considered
   * @return optional of a skills object
   */
  public Optional<Skills> findById(String id, Boolean isActiveEntity) {
    return this.findById(id, isActiveEntity, Skills_::_all);
  }

  /**
   * Select specific columns of a skill, explicitly listed. Usage:
   *
   * <pre>
   * {@code skillRepo.findById(skillId, Boolean.TRUE, Skills_::ID)}
   * </pre>
   *
   * @param id             ID of the skill
   * @param isActiveEntity whether drafts should be considered
   * @param column         column which is needed
   * @return optional of a skills object filled with requested fields
   */
  public Optional<Skills> findById(String id, Boolean isActiveEntity, Function<Skills_, CqnSelectListItem> column) {
    final CqnSelect select = Select.from(Skills_.class)
        .where(a -> a.ID().eq(id).and(a.IsActiveEntity().eq(isActiveEntity))).columns(column);
    return this.draftService.run(select).first(Skills.class);
  }

  public Optional<Skills> findByIdLocalized(String id, Boolean isActiveEntity) {
    final CqnSelect select = Select.from(Skills_.class)
        .where(a -> a.ID().eq(id).and(a.IsActiveEntity().eq(isActiveEntity)))
        .columns(Skills_::_all, s -> s.localized().expand());
    return this.draftService.run(select).first(Skills.class);
  }

  public Optional<Skills> findByExternalId(String externalId, Boolean isActiveEntity) {
    final CqnSelect select = Select.from(Skills_.class)
        .where(a -> a.externalID().eq(externalId).and(a.IsActiveEntity().eq(isActiveEntity)))
        .columns(Skills_::_all, s -> s.alternativeLabels().expand(), s -> s.texts().expand());
    return this.draftService.run(select).first(Skills.class);
  }

  public List<Skills> findByAlternativeLabels(List<AlternativeLabels> labels, Boolean isActiveEntity) {
    List<String> labelIds = labels.stream().map(AlternativeLabels::getId).filter(Objects::nonNull)
        .collect(Collectors.toList());
    final CqnSelect select = Select.from(Skills_.class)
        .where(s -> s.alternativeLabels().ID().in(labelIds).and(s.IsActiveEntity().eq(isActiveEntity)));
    return this.draftService.run(select).listOf(Skills.class);
  }

  public List<Skills> findBySkillText(SkillsTexts text) {
    final CqnSelect select = Select.from(Skills_.class).where(
        s -> s.texts().ID_texts().eq(text.getIDTexts()).and(s.texts().IsActiveEntity().eq(text.getIsActiveEntity())))
        .columns(Skills_::_all, s -> s.texts().expand());
    return this.draftService.run(select).listOf(Skills.class);
  }

  public Skills editDraftByExternalId(String externalId) {
    final CqnSelect select = Select.from(Skills_.class)
        .where(a -> a.externalID().eq(externalId).and(a.IsActiveEntity().eq(Boolean.TRUE))).columns(Skills_::_all);
    return this.draftService.editDraft(select, false).single(Skills.class);
  }

  public Skills createDraft(Skills skill) {
    final CqnInsert insert = Insert.into(Skills_.class).entry(skill);
    return this.draftService.newDraft(insert).single(Skills.class);
  }

  public List<Skills> expandCompositions(List<Skills> skills) {
    Stream<Skills> skillsStream = skills.stream().map(skill -> {
      final CqnSelect select = Select.from(Skills_.class)
          .where(s -> s.ID().eq(skill.getId())
              .and(s.IsActiveEntity().eq(skill.getIsActiveEntity() == null ? Boolean.TRUE : skill.getIsActiveEntity())))
          .columns(Skills_::_all, s -> s.alternativeLabels().expand(), s -> s.texts().expand());
      return this.draftService.run(select).first(Skills.class).orElse(null);
    });

    return skillsStream.filter(Objects::nonNull).collect(Collectors.toList());
  }

  public void updateActiveEntity(final Skills skill) {
    CqnUpdate update = Update.entity(Skills_.class).where(s -> s.ID().eq(skill.getId())).data(skill);
    this.persistenceService.run(update);
  }

  public void updateDraft(final Skills skill) {
    CqnUpdate update = Update.entity(Skills_.class)
        .where(s -> s.ID().eq(skill.getId()).and(s.IsActiveEntity().eq(Boolean.FALSE))).data(skill);
    this.draftService.patchDraft(update);
  }

  public List<Skills> getActiveCatalogNamesBySkills(final List<Skills> skills) {
    String[] ids = skills.stream().map(Skills::getId).toArray(String[]::new);
    CqnSelect select = Select.from(Skills_.class)
        .columns(Skills_::ID, s -> s.catalogAssociations().expand(c2s -> c2s.catalog().expand(Catalogs_::name)))
        .where(s -> s.ID().in(ids));
    return this.persistenceService.run(select).listOf(Skills.class);
  }

  public void saveDraft(final Skills skill) {
    CqnSelect select = Select.from(Skills_.class)
        .where(c -> c.ID().eq(skill.getId()).and(c.IsActiveEntity().eq(Boolean.FALSE)));
    this.draftService.saveDraft(select);
  }

  public long countOtherActiveEntitiesWithSameExternalId(Skills skill) {
    final CqnSelect query = Select.from(Skills_.class).columns(CQL.count().as(SkillRepository.COUNT))
        .where(s -> s.externalID().eq(skill.getExternalID()).and(s.ID().ne((skill.getId()))));

    return (long) this.persistenceService.run(query).single().get(SkillRepository.COUNT);
  }

  public List<Skills> getLanguagesBySkills(final List<Skills> skills, final Boolean isActiveEntity) {
    String[] ids = skills.stream().map(Skills::getId).toArray(String[]::new);
    CqnSelect select = Select.from(Skills_.class).columns(Skills_::ID, pl -> pl.texts().expand(SkillsTexts_::locale))
        .where(pl -> pl.ID().in(ids).and(pl.IsActiveEntity().eq(isActiveEntity)));
    if (Boolean.TRUE.equals(isActiveEntity)) {
      return this.persistenceService.run(select).listOf(Skills.class);
    } else {
      return this.draftService.run(select).listOf(Skills.class);
    }
  }
}
