package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.config.DefaultLanguages_;

class DefaultLanguageRepositoryTest {
  private DefaultLanguageRepository cut;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  void setup() {
    this.mockPersistenceService = mock(PersistenceService.class);
    this.cut = new DefaultLanguageRepository(this.mockPersistenceService);
  }

  @Test
  @DisplayName("find the active language by rank correctly")
  void findActiveEntityByRank() {
    DefaultLanguages expectedDefaultLanguage = DefaultLanguages.create();
    expectedDefaultLanguage.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_EN);

    final CqnSelect expectedSelect = Select.from(DefaultLanguages_.class).where(l -> l.rank().eq(0));
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

    Result mockResult = mock(Result.class);
    when(mockResult.first(DefaultLanguages.class)).thenReturn(Optional.of(expectedDefaultLanguage));
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<DefaultLanguages> defaultLanguage = this.cut.findActiveEntityByRank(0);

    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());
    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedDefaultLanguage, defaultLanguage.get());
  }
}
