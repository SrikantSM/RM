package com.sap.c4p.rm.skill.repositories;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import catalogservice.CatalogService_;
import catalogservice.Catalogs;
import catalogservice.Catalogs_;

@Repository
public class CatalogRepository {
  static final String COUNT = "count";

  private final DraftService draftService;
  private final PersistenceService persistenceService;

  @Autowired
  public CatalogRepository(@Qualifier(CatalogService_.CDS_NAME) DraftService draftService,
      PersistenceService persistenceService) {
    this.draftService = draftService;
    this.persistenceService = persistenceService;
  }

  public Catalogs createDraft(Catalogs catalog) {
    final CqnInsert catalogInsert = Insert.into(Catalogs_.class).entry(catalog);
    return this.draftService.newDraft(catalogInsert).single(Catalogs.class);
  }

  public Optional<Catalogs> findCatalogByIdWithNameAndHasDraftEntity(String id) {
    final CqnSelect query = Select.from(Catalogs_.class)
        .where(c -> c.ID().eq(id).and(c.IsActiveEntity().eq(Boolean.TRUE)))
        .columns(Catalogs_::name, Catalogs_::HasDraftEntity);
    return this.draftService.run(query).first(Catalogs.class);
  }

  public Optional<Catalogs> findActiveEntityById(String id) {
    Select<Catalogs_> query = Select.from(Catalogs_.class).where(c -> c.ID().eq(id)).columns(Catalogs_::_all,
        c -> c.skillAssociations().expand());
    return this.persistenceService.run(query).first(Catalogs.class);
  }

  public Optional<Catalogs> findActiveEntityByName(String name) {
    Select<Catalogs_> query = Select.from(Catalogs_.class).where(c -> c.name().eq(name)).columns(Catalogs_::_all,
        c -> c.skillAssociations().expand());
    return this.persistenceService.run(query).first(Catalogs.class);
  }

  public long countOtherActiveEntitiesWithSameName(Catalogs catalog) {
    final CqnSelect query = Select.from(Catalogs_.class).columns(CQL.count().as(CatalogRepository.COUNT))
        .where(s -> s.name().eq(catalog.getName()).and(s.ID().ne(catalog.getId())));

    return (long) this.persistenceService.run(query).single().get(CatalogRepository.COUNT);
  }
}
