package com.sap.c4p.rm.skill.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.utils.TenantTaskExecutor;
import com.sap.c4p.rm.skill.utils.Translator;

import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.skill.ProficiencyLevelsTexts;

@Service
public class DefaultProficiencySetService {
  private static final Logger LOGGER = LoggerFactory.getLogger(DefaultProficiencySetService.class);
  private static final Marker MARKER = LoggingMarker.DEFAULT_PROFICIENCY_UPSERT.getMarker();

  private static final String STANDARD_DEFAULT_LANGUAGE = "en";
  public static final String DEFAULT_PROFICIENCY_LEVEL_ID = "8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee";
  private static final int DEFAULT_PROFICIENCY_LEVEL_RANK = 1;
  public static final String DEFAULT_PROFICIENCY_SET_ID = "8a2cc2c3-4a46-47f0-ae67-2ac67c673aae";

  private final TenantTaskExecutor tenantTaskExecutor;
  private final ProficiencySetRepository proficiencySetRepository;
  private final LanguageRepository languageRepository;
  private final DefaultLanguageRepository defaultLanguageRepository;
  private final Translator translator;

  @Autowired
  public DefaultProficiencySetService(final TenantTaskExecutor tenantTaskExecutor,
      ProficiencySetRepository proficiencySetRepository, final LanguageRepository languageRepository,
      final DefaultLanguageRepository defaultLanguageRepository, final Translator translator) {
    this.tenantTaskExecutor = tenantTaskExecutor;
    this.proficiencySetRepository = proficiencySetRepository;
    this.languageRepository = languageRepository;
    this.defaultLanguageRepository = defaultLanguageRepository;
    this.translator = translator;
  }

  public void upsertDefaultProficiencySetForTenant(String tenant) {
    this.tenantTaskExecutor.execute(tenant, this::upsertDefaultProficiencySet);
  }

  void upsertDefaultProficiencySet() {
    Optional<DefaultLanguages> defaultLanguage = this.defaultLanguageRepository.findActiveEntityByRank(0);
    String defaultLanguageCode = defaultLanguage.map(DefaultLanguages::getLanguageCode)
        .orElse(STANDARD_DEFAULT_LANGUAGE);
    this.upsertDefaultProficiencySet(defaultLanguageCode);
  }

  public void upsertDefaultProficiencySet(String defaultLanguageCode) {
    LOGGER.info(MARKER, "Creating default proficiency set with language {}", defaultLanguageCode);
    com.sap.resourcemanagement.skill.ProficiencySets proficiencySet = com.sap.resourcemanagement.skill.ProficiencySets
        .create();
    proficiencySet.setId(DEFAULT_PROFICIENCY_SET_ID);

    proficiencySet.setName(this.translator.toLocale(MessageKeys.DEFAULT_PROFICIENCY_SET_NAME, defaultLanguageCode));
    proficiencySet
        .setDescription(this.translator.toLocale(MessageKeys.DEFAULT_PROFICIENCY_SET_DESCRIPTION, defaultLanguageCode));
    proficiencySet.setIsCustom(false);
    com.sap.resourcemanagement.skill.ProficiencyLevels proficiencyLevel = com.sap.resourcemanagement.skill.ProficiencyLevels
        .create();

    proficiencyLevel.setId(DEFAULT_PROFICIENCY_LEVEL_ID);
    proficiencyLevel.setName(this.translator.toLocale(MessageKeys.DEFAULT_PROFICIENCY_LEVEL_NAME, defaultLanguageCode));
    proficiencyLevel.setDescription(
        this.translator.toLocale(MessageKeys.DEFAULT_PROFICIENCY_LEVEL_DESCRIPTION, defaultLanguageCode));
    proficiencyLevel.setRank(DEFAULT_PROFICIENCY_LEVEL_RANK);

    List<ProficiencyLevelsTexts> texts = new ArrayList<>();
    Set<String> existingLanguages = this.languageRepository.findAllExistingActiveLanguageCodes();
    for (String languageCode : existingLanguages) {
      ProficiencyLevelsTexts text = ProficiencyLevelsTexts.create();
      text.setName(this.translator.toLocale(MessageKeys.DEFAULT_PROFICIENCY_LEVEL_NAME, languageCode));
      text.setDescription(this.translator.toLocale(MessageKeys.DEFAULT_PROFICIENCY_LEVEL_DESCRIPTION, languageCode));
      text.setLocale(languageCode);
      text.setId(DEFAULT_PROFICIENCY_LEVEL_ID);
      texts.add(text);
    }
    proficiencyLevel.setTexts(texts);
    proficiencyLevel.setProficiencySetId(DEFAULT_PROFICIENCY_SET_ID);

    proficiencySet.setProficiencyLevels(Collections.singletonList(proficiencyLevel));
    this.proficiencySetRepository.upsert(proficiencySet);
  }
}
