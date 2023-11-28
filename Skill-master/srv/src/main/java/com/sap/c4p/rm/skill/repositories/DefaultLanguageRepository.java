package com.sap.c4p.rm.skill.repositories;

import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.config.DefaultLanguages_;

@Repository
public class DefaultLanguageRepository {
  private final PersistenceService persistenceService;

  public DefaultLanguageRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Cacheable(cacheManager = "requestScopedCacheManager", cacheNames = "findByRank")
  public Optional<DefaultLanguages> findActiveEntityByRank(int rank) {
    CqnSelect defaultLanguageSelect = Select.from(DefaultLanguages_.class).where(l -> l.rank().eq(rank));
    return this.persistenceService.run(defaultLanguageSelect).first(DefaultLanguages.class);
  }
}
