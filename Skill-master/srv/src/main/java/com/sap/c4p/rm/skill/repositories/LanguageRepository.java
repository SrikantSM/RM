package com.sap.c4p.rm.skill.repositories;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import sap.common.Languages;
import sap.common.Languages_;

@Repository
public class LanguageRepository {

  private final PersistenceService persistenceService;

  public LanguageRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Cacheable(cacheManager = "requestScopedCacheManager", cacheNames = "findExistingLanguageCodes")
  public Set<String> findExistingActiveLanguageCodes(String... languageCodes) {
    CqnSelect query = Select.from(Languages_.class).where(c -> c.code().in(languageCodes)).columns(Languages.CODE);

    Result result = this.persistenceService.run(query);
    List<Languages> existingLanguageList = result.listOf(Languages.class);

    Set<String> existingLanguageSet = new HashSet<>();
    existingLanguageList.forEach(t -> existingLanguageSet.add(t.getCode()));
    return existingLanguageSet;
  }

  @Cacheable(cacheManager = "requestScopedCacheManager", cacheNames = "findExistingLanguageCodes")
  public Set<String> findAllExistingActiveLanguageCodes() {
    CqnSelect query = Select.from(Languages_.class).columns(Languages.CODE);

    Result result = this.persistenceService.run(query);
    List<Languages> existingLanguageList = result.listOf(Languages.class);

    Set<String> existingLanguageSet = new HashSet<>();
    existingLanguageList.forEach(t -> existingLanguageSet.add(t.getCode()));
    return existingLanguageSet;
  }
}
