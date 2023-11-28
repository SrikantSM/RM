package com.sap.c4p.rm.skill.services.validators;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;
import com.sap.c4p.rm.skill.utils.ValuePath;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;
import com.sap.resourcemanagement.config.DefaultLanguages;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencySets;
import proficiencyservice.ProficiencySets_;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ProficiencySetValidatorTest {

  private DefaultLanguageRepository mockDefaultLanguageRepository;
  private LanguageRepository mockLanguageRepository;
  private ProficiencySetRepository mockProficiencySetRepository;
  private ProficiencyLevelRepository mockProficiencyLevelRepository;
  private Messages mockMessages;
  private ProficiencySetValidator cut;

  private static final String MOCK_NAME = "Mock name";
  private static final String MOCK_DESCRIPTION = "Mock description";
  private static final String DEFAULT_LANGUAGE = "en";

  @BeforeEach
  void beforeEach() {
    this.mockDefaultLanguageRepository = mock(DefaultLanguageRepository.class);
    this.mockLanguageRepository = mock(LanguageRepository.class);
    this.mockProficiencySetRepository = mock(ProficiencySetRepository.class);
    this.mockProficiencyLevelRepository = mock(ProficiencyLevelRepository.class);
    this.mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
    this.cut = new ProficiencySetValidator(this.mockLanguageRepository, this.mockDefaultLanguageRepository,
        this.mockProficiencySetRepository, this.mockProficiencyLevelRepository, this.mockMessages);
  }

  @Test
  @DisplayName("validation calls all methods")
  void validateSuccess() {
    this.cut = spy(this.cut);
    ProficiencySets proficiencySet = ProficiencySets.create();
    ProficiencyLevels level = ProficiencyLevels.create();
    proficiencySet.setProficiencyLevels(Collections.singletonList(level));
    level.setRank(1);
    DefaultLanguages defaultLanguage = DefaultLanguages.create();
    doReturn(Optional.of(defaultLanguage)).when(this.mockDefaultLanguageRepository).findActiveEntityByRank(0);

    this.cut.validate(proficiencySet);

    verify(this.cut, times(1)).validateIfDefaultProficiencySet(proficiencySet);
    verify(this.cut, times(1)).validateProficiencyLevelDeletion(proficiencySet);
    verify(this.cut, times(1)).validateRanks(proficiencySet);
    verify(this.cut, times(1)).validateNameUniqueness(proficiencySet);
    verify(this.cut, times(1)).validateMinOneProficiencyLevel(proficiencySet);
    verify(this.cut, times(1)).validateProficiencyLevelTextLanguageExistence(proficiencySet);
    verify(this.cut, times(1)).validateProficiencyLevelTextCount(proficiencySet);
    verify(this.cut, times(1)).validateLevelNamesUniqueness(proficiencySet);
    verify(this.cut, times(1)).validateLevelNamesUniqueness(proficiencySet);
    verify(this.cut, times(1)).validateForInjection(proficiencySet);
  }

  @Test
  @DisplayName("validation throws in case of error")
  void validateError() {
    ProficiencySets proficiencySet = ProficiencySets.create();
    this.cut.validate(proficiencySet);
    verify(this.mockMessages, times(1)).throwIfError();
  }

  @Test
  @DisplayName("get correct message key for csv injection")
  void getMessageKeyForCsvInjection() {
    String messageKey = this.cut.getMessageKeyForCsvInjection();
    assertEquals(MessageKeys.PROF_SET_NAME_CONTAINS_FORBIDDEN_FIRST_CHARACTER, messageKey);
  }

  @Test
  @DisplayName("extract values for html injection, correctly")
  void extractValuesForHtmlInjection() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    final List<ValuePath<String, ProficiencySets_>> extractedValues = this.cut
        .extractValuesForHtmlInjection(proficiencySet);
    assertEquals(4, extractedValues.size());
    assertEquals(MOCK_NAME, extractedValues.get(0).getValue());
    assertEquals(MOCK_DESCRIPTION, extractedValues.get(1).getValue());
    assertEquals(MOCK_NAME, extractedValues.get(2).getValue());
    assertEquals(MOCK_DESCRIPTION, extractedValues.get(3).getValue());
  }

  @Test
  @DisplayName("extract values for csv injection, correctly")
  void extractValuesForCsvInjection() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    final List<ValuePath<String, ProficiencySets_>> extractedValues = this.cut
        .extractValuesForCsvInjection(proficiencySet);
    assertEquals(4, extractedValues.size());
    assertEquals(MOCK_NAME, extractedValues.get(0).getValue());
    assertEquals(MOCK_DESCRIPTION, extractedValues.get(1).getValue());
  }

  @Test
  @DisplayName("extract values for html injection, correctly with null properties")
  void extractValuesForHtmlInjectionNullSafeProperties() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    proficiencySet.setDescription(null);
    final List<ValuePath<String, ProficiencySets_>> extractedValues = this.cut
        .extractValuesForHtmlInjection(proficiencySet);
    assertFalse(extractedValues.stream().anyMatch(Objects::isNull));
  }

  @Test
  @DisplayName("extract values for html injection, correctly with null levels")
  void extractValuesForHtmlInjectionNullSafeLevels() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    proficiencySet.setProficiencyLevels(null);
    final List<ValuePath<String, ProficiencySets_>> extractedValues = this.cut
        .extractValuesForHtmlInjection(proficiencySet);
    assertFalse(extractedValues.stream().anyMatch(Objects::isNull));
  }

  @Test
  @DisplayName("extract values for html injection, correctly with null texts")
  void extractValuesForHtmlInjectionNullSafeLevelsTexts() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    proficiencySet.getProficiencyLevels().get(0).setTexts(null);
    final List<ValuePath<String, ProficiencySets_>> extractedValues = this.cut
        .extractValuesForHtmlInjection(proficiencySet);
    assertFalse(extractedValues.stream().anyMatch(Objects::isNull));
  }

  @Test
  @DisplayName("get correct message key for html injection")
  void getMessageKeyForHtmlInjection() {
    final String messageKey = this.cut.getMessageKeyForHtmlInjection();
    assertEquals(MessageKeys.PROF_SET_CONTAINS_HTML_TAG, messageKey);
  }

  @Test
  @DisplayName("check that validateProficiencyLevelTextLanguageExistence() fails when language does not exists")
  void validateProficiencyLevelTextLanguageExistenceFails() {
    final ProficiencySets mockProficiencySet = this.getDefaultProficiencyLevelSet("ab");

    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(any()))
        .thenReturn(new HashSet<>(Collections.singletonList(DEFAULT_LANGUAGE)));

    this.cut.validateProficiencyLevelTextLanguageExistence(mockProficiencySet);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.LANGUAGE_MUST_EXIST));
  }

  @Test
  @DisplayName("check if a the name uniqueness check succeeds")
  void validateNameUniquessSuccess() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    proficiencySet.setName(MOCK_NAME);

    when(this.mockProficiencySetRepository.countOtherActiveEntitiesWithSameName(any())).thenReturn(0L);
    this.cut.validateNameUniqueness(proficiencySet);
  }

  @Test
  @DisplayName("check if a duplicate name fails the validation")
  void validateNameUniquessFailure() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    proficiencySet.setName(MOCK_NAME);

    when(this.mockProficiencySetRepository.countOtherActiveEntitiesWithSameName(any())).thenReturn(1L);
    this.cut.validateNameUniqueness(proficiencySet);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.PROFICIENCY_SET_NAME_EXISTS));
  }

  @Test
  @DisplayName("check that validateLevelNamesUniqueness() will throw no exception when no proficiencyLevel exists")
  void validateLevelNamesUniqueness() {
    final ProficiencySets proficiencySet = ProficiencySets.create();

    assertDoesNotThrow(() -> this.cut.validateLevelNamesUniqueness(proficiencySet));
  }

  @Test
  @DisplayName("check that validateLevelNamesUniqueness() will throw no Exception when name is unique")
  void validateLevelNamesUniquenessWithExistingProficiencyLevel() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);

    assertDoesNotThrow(() -> this.cut.validateLevelNamesUniqueness(proficiencySet));
  }

  @Test
  @DisplayName("check that validateLevelNamesUniqueness() fails when proficiencyLevel text already exists")
  void validateLevelNamesUniquenessFails2() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    final ProficiencyLevelsTexts proficiencyLevelsText = proficiencySet.getProficiencyLevels().get(0).getTexts().get(0);
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = Arrays.asList(proficiencyLevelsText,
        proficiencyLevelsText);
    proficiencySet.getProficiencyLevels().get(0).setTexts(proficiencyLevelsTextsList);

    this.cut.validateLevelNamesUniqueness(proficiencySet);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.DUPLICATED_PROFICIENCY_LEVEL_NAMES), any());
  }

  @Test
  @DisplayName("check that validateProficiencyLevelTextCount() will throw non exception when proficiencyLevel does not exists")
  void validateProficiencyLevelTextCountWithoutProficiencyLevel() {
    final ProficiencySets proficiencySet = ProficiencySets.create();

    assertDoesNotThrow(() -> this.cut.validateProficiencyLevelTextCount(proficiencySet));
  }

  @Test
  @DisplayName("check that validateProficiencyLevelTextDefaultLanguage() will throw an ServiceException when default language does not exists")
  void validateProficiencyLevelTextDefaultLanguageWithoutDefaultLanguage() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    final List<ProficiencyLevels> proficiencyLevelsList = Collections.singletonList(proficiencyLevel);
    proficiencySet.setProficiencyLevels(proficiencyLevelsList);

    assertThrows(ServiceException.class, () -> this.cut.validateProficiencyLevelTextDefaultLanguage(proficiencySet));
  }

  @Test
  @DisplayName("check that there will throw no exception when valid proficiencySet is inserted")
  void validateProficiencyLevelTextCount() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(DEFAULT_LANGUAGE);

    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.of(defaultLanguage));

    assertDoesNotThrow(() -> this.cut.validateProficiencyLevelTextCount(proficiencySet));
  }

  @Test
  @DisplayName("check that validateProficiencyLevelTextDefaultLanguage() fails when no text in default language")
  void validateProficiencyLevelTextDefaultLanguageWithoutTextInDefaultLanguage() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet("fr");
    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(DEFAULT_LANGUAGE);

    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.of(defaultLanguage));

    this.cut.validateProficiencyLevelTextDefaultLanguage(proficiencySet);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.PROFICIENCY_LEVEL_NO_DEFAULT_LANGUAGE_TEXT), any());

  }

  @Test
  @DisplayName("check if validateProficiencyLevelTextCount() fails when there are multiple texts for one language")
  void validateProficiencyLevelTextCountWithDuplicatedTextForLocale() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    final ProficiencyLevelsTexts proficiencyLevelsText = proficiencySet.getProficiencyLevels().get(0).getTexts().get(0);
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = Arrays.asList(proficiencyLevelsText,
        proficiencyLevelsText);
    proficiencySet.getProficiencyLevels().get(0).setTexts(proficiencyLevelsTextsList);

    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(DEFAULT_LANGUAGE);

    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.of(defaultLanguage));

    this.cut.validateProficiencyLevelTextCount(proficiencySet);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.DUPLICATE_PROFICIENCY_LEVEL_TEXT_LOCALE));
  }

  @Test
  @DisplayName("Validate that validateIfDefaultProficiencySet() throws an exception when the set is a default set")
  void validateIfDefaultProficiencySetThrowsException() {
    final ProficiencySets proficiencySets = ProficiencySets.create();
    proficiencySets.setId(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID);
    proficiencySets.setIsCustom(Boolean.FALSE);

    assertThrows(ServiceException.class, () -> this.cut.validateIfDefaultProficiencySet(proficiencySets));
  }

  @Test
  @DisplayName("Validate that validateIfDefaultProficiencySet() throws no exception when the set is not a default set")
  void validateIfDefaultProficiencySet() {
    final ProficiencySets proficiencySets = ProficiencySets.create();
    proficiencySets.setId(UUID.randomUUID().toString());
    proficiencySets.setIsCustom(Boolean.TRUE);

    assertDoesNotThrow(() -> this.cut.validateIfDefaultProficiencySet(proficiencySets));
  }

  @Test
  @DisplayName("Validate that validateMinOneProficiencyLevel() fails when the proficiencyLevel is null")
  void validateMinOneProficiencyLevelThrowExceptionWhenNull() {
    final ProficiencySets proficiencySet = ProficiencySets.create();

    this.cut.validateMinOneProficiencyLevel(proficiencySet);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.PROFICIENCY_SET_HAS_NO_PROFICIENCY_LEVEL));
  }

  @Test
  @DisplayName("Validate that validateMinOneProficiencyLevel() fails when the proficiencyLevel is empty")
  void validateMinOneProficiencyLevelWhenEmpty() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    final List<ProficiencyLevels> proficiencyLevelsList = new ArrayList<>();
    proficiencySet.setProficiencyLevels(proficiencyLevelsList);

    this.cut.validateMinOneProficiencyLevel(proficiencySet);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.PROFICIENCY_SET_HAS_NO_PROFICIENCY_LEVEL));
  }

  @Test
  @DisplayName("Validate that validateMinOneProficiencyLevel() throws no exception then proficiency level is set")
  void validateMinOneProficiencyLevel() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setName(MOCK_NAME);
    proficiencyLevel.setDescription(MOCK_DESCRIPTION);
    final List<ProficiencyLevels> proficiencyLevelsList = Collections.singletonList(proficiencyLevel);
    proficiencySet.setProficiencyLevels(proficiencyLevelsList);

    assertDoesNotThrow(() -> this.cut.validateMinOneProficiencyLevel(proficiencySet));
  }

  @Test
  @DisplayName("Validate that validateMaxCountProficiencyLevel() throws no exception when proficiency levels are null")
  void validateMaxCountProficiencyLevelNull() {
    final ProficiencySets proficiencySet = ProficiencySets.create();

    assertDoesNotThrow(() -> this.cut.validateMaxCountProficiencyLevel(proficiencySet));
  }

  @Test
  @DisplayName("Validate that validateMaxCountProficiencyLevel() throws no exception when proficiency levels less than max count")
  void validateMaxCountProficiencyLevelLessCount() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setName(MOCK_NAME);
    proficiencyLevel.setDescription(MOCK_DESCRIPTION);
    final List<ProficiencyLevels> proficiencyLevelsList = Collections.singletonList(proficiencyLevel);
    proficiencySet.setProficiencyLevels(proficiencyLevelsList);

    assertDoesNotThrow(() -> this.cut.validateMaxCountProficiencyLevel(proficiencySet));
  }

  @Test
  @DisplayName("Validate that validateMaxCountProficiencyLevel() throws an exception when proficiency levels more than max count")
  void validateMaxCountProficiencyLevelMoreCount() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    final List<ProficiencyLevels> proficiencyLevelsList = new ArrayList<>();

    for (int i = 0; i < ProficiencySetValidator.MAX_LEVEL_COUNT + 1; i++) {
      final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
      proficiencyLevel.setName(MOCK_NAME);
      proficiencyLevel.setDescription(MOCK_DESCRIPTION);
      proficiencyLevelsList.add(proficiencyLevel);

    }
    proficiencySet.setProficiencyLevels(proficiencyLevelsList);

    assertThrows(ServiceException.class, () -> this.cut.validateMaxCountProficiencyLevel(proficiencySet));
  }

  @Test
  @DisplayName("Validate that validateMaxCountProficiencyLevel() throws no exception when proficiency levels equals max count")
  void validateMaxCountProficiencyLevel() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    final List<ProficiencyLevels> proficiencyLevelsList = new ArrayList<>();

    for (int i = 0; i < ProficiencySetValidator.MAX_LEVEL_COUNT; i++) {
      final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
      proficiencyLevel.setName(MOCK_NAME);
      proficiencyLevel.setDescription(MOCK_DESCRIPTION);
      proficiencyLevelsList.add(proficiencyLevel);

    }
    proficiencySet.setProficiencyLevels(proficiencyLevelsList);

    assertDoesNotThrow(() -> this.cut.validateMaxCountProficiencyLevel(proficiencySet));
  }

  @Test
  @DisplayName("Validate that validateProficiencyLevelDeletion() throws no exception when no level exist")
  void validateProficiencyLevelDeletionNoLevel() {
    final ProficiencySets mockProficiencySet = mock(ProficiencySets.class);

    when(mockProficiencySet.getProficiencyLevels()).thenReturn(null);
    when(mockProficiencySet.getId()).thenReturn("SET_ID");

    assertDoesNotThrow(() -> this.cut.validateProficiencyLevelDeletion(mockProficiencySet));
    verify(this.mockProficiencyLevelRepository, times(0)).findLevelsByProficiencySetId(mockProficiencySet.getId(),
        Boolean.TRUE);
  }

  @Test
  @DisplayName("Validate that validateProficiencyLevelDeletion() throws an exception when an already activated level is deleted ")
  void validateProficiencyLevelDeletionThrowsException() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    final List<ProficiencyLevels> activeProficiencyLevel = getProficiencyLevelList();
    activeProficiencyLevel.get(0).setId("ACTIVE_ID");

    when(this.mockProficiencyLevelRepository.findLevelsByProficiencySetId(proficiencySet.getId(), Boolean.TRUE))
        .thenReturn(activeProficiencyLevel);

    assertThrows(ServiceException.class, () -> this.cut.validateProficiencyLevelDeletion(proficiencySet));
    verify(this.mockProficiencyLevelRepository, times(1)).findLevelsByProficiencySetId(proficiencySet.getId(),
        Boolean.TRUE);
  }

  @Test
  @DisplayName("Validate that validateProficiencyLevelDeletion() throws no exception when no level is deleted ")
  void validateProficiencyLevelDeletionThrowsNoException() {
    final ProficiencySets proficiencySet = this.getDefaultProficiencyLevelSet(DEFAULT_LANGUAGE);
    final List<ProficiencyLevels> activeProficiencyLevel = getProficiencyLevelList();

    when(this.mockProficiencyLevelRepository.findLevelsByProficiencySetId(proficiencySet.getId(), Boolean.TRUE))
        .thenReturn(activeProficiencyLevel);

    assertThrows(ServiceException.class, () -> this.cut.validateProficiencyLevelDeletion(proficiencySet));
    verify(this.mockProficiencyLevelRepository, times(1)).findLevelsByProficiencySetId(proficiencySet.getId(),
        Boolean.TRUE);
  }

  @Test
  @DisplayName("Validate that the validateRanks() accepts a valid rank")
  void validateRanksValid() {
    final ProficiencySets proficiencySet = getRankedLevels("1,2,3,4,5");
    assertDoesNotThrow(() -> this.cut.validateRanks(proficiencySet));
  }

  @Test
  @DisplayName("Validate that the validateRanks() accepts a valid list of ranks")
  void validateRanksNull() {
    final ProficiencySets proficiencySet = getRankedLevels("1,2,3,4,5");
    proficiencySet.getProficiencyLevels().get(0).setRank(null);
    assertThrows(ServiceException.class, () -> this.cut.validateRanks(proficiencySet));
  }

  @ParameterizedTest
  @DisplayName("Validate that validateRanks() fails for invalid lists of ranks")
  @ValueSource(strings = { "1,2,3,4,-5", "2,3,4,5,6", "1,2,3,4,6" })
  final void validateRankInvalid(final String ranks) {
    final ProficiencySets proficiencySet = getRankedLevels(ranks);
    assertThrows(ServiceException.class, () -> this.cut.validateRanks(proficiencySet));
  }

  private ProficiencySets getDefaultProficiencyLevelSet(final String defaultLanguage) {
    final ProficiencySets proficiencySet = getProficiencySet();
    final List<ProficiencyLevelsTexts> proficiencyLevelsTexts = getProficiencyLevelTexts(defaultLanguage);
    final List<ProficiencyLevels> proficiencyLevelsList = getProficiencyLevelList();

    proficiencyLevelsList.get(0).setTexts(proficiencyLevelsTexts);
    proficiencySet.setProficiencyLevels(proficiencyLevelsList);
    proficiencySet.setName(MOCK_NAME);

    return proficiencySet;
  }

  private static List<ProficiencyLevelsTexts> getProficiencyLevelTexts(final String locale) {
    final ProficiencyLevelsTexts proficiencyLevelsTexts = ProficiencyLevelsTexts.create();
    proficiencyLevelsTexts.setName(ProficiencySetValidatorTest.MOCK_NAME);
    proficiencyLevelsTexts.setDescription(ProficiencySetValidatorTest.MOCK_DESCRIPTION);
    proficiencyLevelsTexts.setLocale(locale);
    return Collections.singletonList(proficiencyLevelsTexts);
  }

  private static List<ProficiencyLevels> getProficiencyLevelList() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId(UUID.randomUUID().toString());
    proficiencyLevel.setName(ProficiencySetValidatorTest.MOCK_NAME);
    proficiencyLevel.setDescription(ProficiencySetValidatorTest.MOCK_DESCRIPTION);
    return Collections.singletonList(proficiencyLevel);
  }

  private static ProficiencySets getProficiencySet() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    proficiencySet.setName(ProficiencySetValidatorTest.MOCK_NAME);
    proficiencySet.setDescription(ProficiencySetValidatorTest.MOCK_DESCRIPTION);
    return proficiencySet;
  }

  private static ProficiencySets getRankedLevels(final String ranks) {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    final List<ProficiencyLevels> proficiencyLevels = Arrays.stream(ranks.split(","))
        .map(s -> Integer.parseInt(s.trim())).map(rank -> {
          final ProficiencyLevels level = ProficiencyLevels.create();
          level.setRank(rank);
          return level;
        }).collect(Collectors.toList());
    proficiencySet.setProficiencyLevels(proficiencyLevels);
    return proficiencySet;
  }
}
