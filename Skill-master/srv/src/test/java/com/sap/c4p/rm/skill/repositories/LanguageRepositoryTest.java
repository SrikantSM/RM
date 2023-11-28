package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import sap.common.Languages;

class LanguageRepositoryTest {

  private LanguageRepository cut;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  void setup() {
    this.mockPersistenceService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);
    this.cut = new LanguageRepository(this.mockPersistenceService);
  }

  @Test
  @DisplayName("check if correct languages are returned")
  void findExistingActiveLanguageCodes() {

    String[] languageCodes = new String[2];
    languageCodes[0] = "en";
    languageCodes[1] = "jp";
    Languages languageEn = Languages.create();
    languageEn.setCode("en");
    List<Languages> existingLanguageList = Collections.singletonList(languageEn);

    Result mockResult = mock(Result.class);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    when(mockResult.listOf(Languages.class)).thenReturn(existingLanguageList);

    Set<String> resultSet = this.cut.findExistingActiveLanguageCodes(languageCodes);

    Set<String> expectedLanguageSet = new HashSet<>();
    expectedLanguageSet.add("en");

    assertEquals(expectedLanguageSet, resultSet);
  }
}
