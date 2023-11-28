package com.sap.c4p.rm.skill.repositories;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyLevels_;
import proficiencyservice.ProficiencyService_;
import proficiencyservice.ProficiencySets;
import proficiencyservice.ProficiencySets_;

@Repository
public class ProficiencySetRepository {
  static final String COUNT = "count";

  private final DraftService draftService;
  private final PersistenceService persistenceService;

  public ProficiencySetRepository(@Qualifier(ProficiencyService_.CDS_NAME) final DraftService draftService,
      final PersistenceService persistenceService) {
    this.draftService = draftService;
    this.persistenceService = persistenceService;
  }

  public Optional<ProficiencySets> findById(final String id, final boolean isActiveEntity) {
    final CqnSelect select = Select.from(ProficiencySets_.class)
        .where(a -> a.ID().eq(id).and(a.IsActiveEntity().eq(isActiveEntity))).columns(ProficiencySets_::_all);
    return this.draftService.run(select).first(ProficiencySets.class);
  }

  @Cacheable(cacheManager = "requestScopedCacheManager", cacheNames = "ProficiencySets.findByName")
  public Optional<ProficiencySets> findByName(final String name, final boolean isActiveEntity) {
    final CqnSelect select = Select.from(ProficiencySets_.class)
        .where(a -> a.name().eq(name).and(a.IsActiveEntity().eq(isActiveEntity))).columns(ProficiencySets_::_all);
    return this.draftService.run(select).first(ProficiencySets.class);
  }

  /**
   * Due to foreign key issues with the normal upsert, this method manually
   * decides to either do an Insert or Update
   * 
   * @param proficiencySet the (deep) entity to change
   * @return the changed entity
   */
  public com.sap.resourcemanagement.skill.ProficiencySets upsert(
      final com.sap.resourcemanagement.skill.ProficiencySets proficiencySet) {
    if (this.findActiveEntityById(proficiencySet.getId()).isPresent()) {
      final CqnUpdate update = Update.entity(com.sap.resourcemanagement.skill.ProficiencySets_.class)
          .data(proficiencySet);
      return this.persistenceService.run(update).single(com.sap.resourcemanagement.skill.ProficiencySets.class);
    }
    final CqnInsert insert = Insert.into(com.sap.resourcemanagement.skill.ProficiencySets_.class).entry(proficiencySet);
    return this.persistenceService.run(insert).single(com.sap.resourcemanagement.skill.ProficiencySets.class);
  }

  public Optional<ProficiencySets> findActiveEntityById(final String id) {
    final CqnSelect select = Select.from(ProficiencySets_.class).where(p -> p.ID().eq(id))
        .columns(ProficiencySets_::_all);
    return this.persistenceService.run(select).first(ProficiencySets.class);
  }

  public ProficiencySets create(final ProficiencySets proficiencyLevelSet) {
    final CqnInsert insert = Insert.into(ProficiencySets_.class).entry(proficiencyLevelSet);
    return this.persistenceService.run(insert).single(ProficiencySets.class);
  }

  public ProficiencySets createDraft(final ProficiencySets proficiencySet) {
    final CqnInsert insert = Insert.into(ProficiencySets_.class).entry(proficiencySet);
    return this.draftService.newDraft(insert).single(ProficiencySets.class);
  }

  public Optional<ProficiencySets> expandCompositions(final ProficiencySets proficiencySet) {
    final CqnSelect select = Select.from(ProficiencySets_.class)
        .where(p -> p.ID().eq(proficiencySet.getId())
            .and(p.IsActiveEntity()
                .eq(proficiencySet.getIsActiveEntity() == null ? Boolean.TRUE : proficiencySet.getIsActiveEntity())))
        .columns(ProficiencySets_::_all, p -> p.proficiencyLevels().expand(ProficiencyLevels_::_all,
            l -> l.texts().expand(ProficiencyLevelsTexts_::_all)));
    return this.draftService.run(select).first(ProficiencySets.class);
  }

  public long countOtherActiveEntitiesWithSameName(final ProficiencySets proficiencySet) {
    final CqnSelect query = Select.from(ProficiencySets_.class).columns(CQL.count().as(ProficiencySetRepository.COUNT))
        .where(s -> s.name().eq(proficiencySet.getName()).and(s.ID().ne(proficiencySet.getId())));

    return (long) this.persistenceService.run(query).single().get(ProficiencySetRepository.COUNT);
  }
}
