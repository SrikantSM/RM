package com.sap.c4p.rm.skill.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.utils.TenantTaskExecutor;
import com.sap.c4p.rm.skill.utils.Translator;

import skillservice.Skills;

public class DefaultProficiencySetServiceTest {

  private ProficiencySetRepository mockProficiencySetRepository;
  private ProficiencyLevelRepository mockProficiencyLevelRepository;
  private LanguageRepository mockLanguageRepository;
  private DefaultLanguageRepository mockDefaultLanguageRepository;
  private DefaultProficiencySetService cut;
  private Skills testSkill;
  private TenantTaskExecutor mockTenantTaskExecutor;
  private Translator mockTranslator;
  private Connection mockConnection;
  private PreparedStatement mockPreparedStatement;

  private static final String TEST_TENANT = "testTenant";
  private static final String TEST_SKILL_ID = "testSkillId";
  private static final String DEFAULT_PROFICIENCY_SET_ID = "8a2cc2c3-4a46-47f0-ae67-2ac67c673aae";
  private static final String DEFAULT_PROFICIENCY_SET_NAME = "defaultProficiencySetName";
  private static final String DEFAULT_PROFICIENCY_SET_DESCRIPTION = "defaultProficiencySetDescription";

  private static final String DEFAULT_PROFICIENCY_LEVEL_ID = "8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee";
  private static final Integer DEFAULT_PROFICIENCY_LEVEL_RANK = 1;

  @BeforeEach
  public void setUp() throws Exception {
    this.mockTenantTaskExecutor = mock(TenantTaskExecutor.class);
    this.mockTranslator = mock(Translator.class);
    this.testSkill = Skills.create();
    this.testSkill.setId(TEST_SKILL_ID);
    this.mockLanguageRepository = mock(LanguageRepository.class);
    this.mockDefaultLanguageRepository = mock(DefaultLanguageRepository.class);
    this.mockProficiencySetRepository = mock(ProficiencySetRepository.class);
    this.mockConnection = mock(Connection.class);
    this.mockPreparedStatement = mock(PreparedStatement.class);
    when(this.mockLanguageRepository.findAllExistingActiveLanguageCodes()).thenReturn(Collections.singleton("en"));
    when(this.mockTranslator.toLocale(anyString(), anyString())).thenAnswer(i -> i.getArguments()[0]);
    when(this.mockConnection.prepareStatement(any(String.class))).thenReturn(this.mockPreparedStatement);
    this.cut = new DefaultProficiencySetService(this.mockTenantTaskExecutor, this.mockProficiencySetRepository,
        this.mockLanguageRepository, this.mockDefaultLanguageRepository, this.mockTranslator);
  }

  @Test
  @DisplayName("verify that createDefaultProficiencySetForTenant() invokes all expected methods")
  public void createDefaultProficiencySetForTenant() {
    this.cut.upsertDefaultProficiencySetForTenant(TEST_TENANT);
    verify(this.mockTenantTaskExecutor, times(1)).execute(eq(TEST_TENANT), any());
  }

  @Test
  @DisplayName("verify that createDefaultProficiencySet() invokes all expected methods with expected arguments")
  public void createDefaultProficiencySet() {
    when(this.mockProficiencySetRepository.findById(anyString(), anyBoolean())).thenReturn(Optional.empty());

    this.cut.upsertDefaultProficiencySet();

    ArgumentCaptor<com.sap.resourcemanagement.skill.ProficiencySets> argumentProficiencySet = ArgumentCaptor
        .forClass(com.sap.resourcemanagement.skill.ProficiencySets.class);

    verify(this.mockProficiencySetRepository, times(1)).upsert(argumentProficiencySet.capture());
    com.sap.resourcemanagement.skill.ProficiencySets actualProficiencySet = argumentProficiencySet.getValue();
    assertEquals(DEFAULT_PROFICIENCY_SET_ID, actualProficiencySet.getId());
    assertEquals(DEFAULT_PROFICIENCY_SET_NAME, actualProficiencySet.getName());
    assertEquals(DEFAULT_PROFICIENCY_SET_DESCRIPTION, actualProficiencySet.getDescription());
    assertFalse(actualProficiencySet.getIsCustom());

    com.sap.resourcemanagement.skill.ProficiencyLevels actualProficiencyLevel = actualProficiencySet
        .getProficiencyLevels().get(0);
    assertEquals(DEFAULT_PROFICIENCY_LEVEL_ID, actualProficiencyLevel.getId());
    assertEquals(DEFAULT_PROFICIENCY_SET_ID, actualProficiencyLevel.getProficiencySetId());
    assertEquals(DEFAULT_PROFICIENCY_LEVEL_RANK, actualProficiencyLevel.getRank());

    com.sap.resourcemanagement.skill.ProficiencyLevelsTexts texts = actualProficiencyLevel.getTexts().get(0);
    assertEquals(MessageKeys.DEFAULT_PROFICIENCY_LEVEL_NAME, texts.getName());
    assertEquals(MessageKeys.DEFAULT_PROFICIENCY_LEVEL_DESCRIPTION, texts.getDescription());
    assertEquals("en", texts.getLocale());
  }
}
