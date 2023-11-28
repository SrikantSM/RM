package com.sap.c4p.rm.skill.services.validators;

import catalogservice.Catalogs;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.*;
import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;
import com.sap.c4p.rm.skill.utils.ValuePath;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;
import com.sap.resourcemanagement.config.DefaultLanguages;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import proficiencyservice.ProficiencySets;
import skillservice.AlternativeLabels;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.Skills_;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class SkillValidatorTest {
  /* object under test */
  private SkillValidator cut;

  /* mocks */
  private static final String evilScriptTag = "<script src=\"https://evilpage.de/assets/js/evilScript.js\"></script>";
  private SkillRepository mockSkillRepository;
  private LanguageRepository mockLanguageRepository;
  private DefaultLanguageRepository mockDefaultLanguageRepository;
  private ProficiencySetRepository mockProficiencySetRepository;
  private Messages mockMessages;
  private CatalogRepository mockCatalogRepository;

  private static Set<String> existingLanguageSet = new HashSet<>();
  private static Set<String> nonExistingLanguageSet = new HashSet<>();
  private static Set<String> emptySet = new HashSet<>();

  private static void fillSets() {
    existingLanguageSet.add("de");
    existingLanguageSet.add("en");
    nonExistingLanguageSet.add("jp");
    nonExistingLanguageSet.add("en");
  }

  @BeforeAll
  static void beforeAll() {
    fillSets();
  }

  @BeforeEach
  void beforeEach() {
    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_EN);

    final ProficiencySets defaultProficiencySet = ProficiencySets.create();

    this.mockSkillRepository = mock(SkillRepository.class);
    this.mockLanguageRepository = mock(LanguageRepository.class);
    this.mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
    this.mockProficiencySetRepository = mock(ProficiencySetRepository.class);
    this.mockCatalogRepository = mock(CatalogRepository.class, RETURNS_DEEP_STUBS);
    when(
        this.mockProficiencySetRepository.findActiveEntityById(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID))
            .thenReturn(Optional.of(defaultProficiencySet));

    this.mockDefaultLanguageRepository = mock(DefaultLanguageRepository.class);
    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.of(defaultLanguage));

    this.cut = new SkillValidator(this.mockSkillRepository, this.mockLanguageRepository,
        this.mockDefaultLanguageRepository, this.mockProficiencySetRepository, this.mockMessages,
        this.mockCatalogRepository);
  }

  @Test
  @DisplayName("validation calls all methods")
  void validateSuccess() {
    this.cut = spy(this.cut);
    Skills skill = Skills.create();
    this.cut.validate(skill);

    verify(this.cut, times(1)).validateSkillTextCount(skill);
    verify(this.cut, times(1)).validateSkillTextDefaultLanguage(skill);
    verify(this.cut, times(1)).validateProficiencySetExistence(skill);
    verify(this.cut, times(1)).validateExternalIDUniqueness(skill);
    verify(this.cut, times(1)).validateLabelLanguageExistence(skill);
    verify(this.cut, times(1)).validateForInjection(skill);
  }

  @Test
  @DisplayName("validation calls throwIfError")
  void validateError() {
    Skills skill = Skills.create();
    skill.setProficiencySetId(null);
    this.cut.validate(skill);
    verify(this.mockMessages, times(1)).throwIfError();
  }

  @Test
  @DisplayName("check if a null externalID skips the validation")
  void validateExternalIDNullSkipped() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setExternalID(null);
      return skillToCreate;
    });

    this.cut.validateExternalIDUniqueness(skill);

    verify(this.mockSkillRepository, never()).countOtherActiveEntitiesWithSameExternalId(any());
  }

  @Test
  @DisplayName("check if an assignment to an existing proficiency set passes validation")
  void validateExistingProficiency() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setProficiencySetId(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID);
      return skillToCreate;
    });

    this.cut.validateProficiencySetExistence(skill);
  }

  @Test
  @DisplayName("check if an assignment to a non-existing proficiency set fails validation")
  void validateNonExistingProficiency() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setProficiencySetId("non-existing-id");
      return skillToCreate;
    });

    this.cut.validateProficiencySetExistence(skill);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_PROFICIENCY_SET_NOT_VALID));
  }

  @Test
  @DisplayName("check if the validation succeeds in case the entity doesn't have the field at all (i.e. in case of deep update)")
  void validateProficiencyLevelUpdateSkipped() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setProficiencySetId(null);
      skillToCreate.remove(Skills.PROFICIENCY_SET_ID);
      return skillToCreate;
    });

    assertDoesNotThrow(() -> this.cut.validateProficiencySetExistence(skill));
  }

  @Test
  @DisplayName("check if a missing assignment to a proficiency set fails validation")
  void validateNullProficiency() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setProficiencySetId(null);
      return skillToCreate;
    });

    this.cut.validateProficiencySetExistence(skill);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_PROFICIENCY_SET_EMPTY));
  }

  @Test
  @DisplayName("check if an empty externalID skips the validation")
  void validateExternalIDNullEmpty() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setExternalID("");
      return skillToCreate;
    });

    this.cut.validateExternalIDUniqueness(skill);

    verify(this.mockSkillRepository, never()).countOtherActiveEntitiesWithSameExternalId(any());
  }

  @Test
  @DisplayName("check if a unique externalID passes the validation")
  void validateExternalIDUniquenessSuccess() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setExternalID(SkillTestHelper.SKILL_EXTERNAL_ID);
      return skillToCreate;
    });

    when(this.mockSkillRepository.countOtherActiveEntitiesWithSameExternalId(any())).thenReturn(0L);

    this.cut.validateExternalIDUniqueness(skill);
  }

  @Test
  @DisplayName("check if a duplicate externalID fails the validation")
  void validateExternalIDUniquenessFailure() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setExternalID(SkillTestHelper.SKILL_EXTERNAL_ID);
      return skillToCreate;
    });

    when(this.mockSkillRepository.countOtherActiveEntitiesWithSameExternalId(any())).thenReturn(1L);

    assertThrows(ServiceException.class, () -> this.cut.validateExternalIDUniqueness(skill));
  }

  @Test
  @DisplayName("check if an existing language reference passes the validation")
  void validateLabelLanguageExistenceSuccess() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      skillToCreate.setExternalID(SkillTestHelper.SKILL_EXTERNAL_ID);
      final List<SkillsTexts> skillsTexts = SkillTestHelper.createTestEntities(1, j -> {
        SkillsTexts text = SkillsTexts.create();
        text.setName(SkillTestHelper.SKILL_TEXT_NAME + j);
        text.setLocale(SkillTestHelper.LANGUAGE_CODE_EN);
        return text;
      });
      skillToCreate.setTexts(skillsTexts);
      String[] languageCodes = { SkillTestHelper.LANGUAGE_CODE_EN, SkillTestHelper.LANGUAGE_CODE_DE };
      final List<AlternativeLabels> alternativeLabels = SkillTestHelper.createTestEntities(2, j -> {
        AlternativeLabels alternativeLabel = AlternativeLabels.create();
        alternativeLabel.setName(SkillTestHelper.ALTERNATIVE_LABEL_NAME + j);
        alternativeLabel.setLanguageCode(languageCodes[j]);
        return alternativeLabel;
      });
      skillToCreate.setAlternativeLabels(alternativeLabels);
      return skillToCreate;
    });
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(any())).thenReturn(existingLanguageSet);

    this.cut.validateLabelLanguageExistence(skill);
  }

  @Test
  @DisplayName("check if a skill without alternative label (empty list) and without text (empty list) does not fail the language existence validation")
  void validateLabelLanguageExistenceNoLabels() {
    final Skills skill = Skills.create();
    skill.setTexts(new ArrayList<>());
    skill.setAlternativeLabels(new ArrayList<>());
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(any())).thenReturn(emptySet);

    this.cut.validateLabelLanguageExistence(skill);
  }

  @Test
  @DisplayName("check if a skill without alternative label (null) and without text (null) does not fail the language existence validation")
  void validateLabelLanguageExistenceNullLabels() {
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(any())).thenReturn(emptySet);

    this.cut.validateLabelLanguageExistence(Skills.create());
  }

  @Test
  @DisplayName("check if a non-existing language reference fails the validation")
  void validateLabelLanguageExistenceFailure() {
    final Skills skill = Skills.create();
    skill.setTexts(new ArrayList<>());
    skill.setAlternativeLabels(new ArrayList<>());

    final SkillsTexts text1 = SkillsTexts.create();
    text1.setName(SkillTestHelper.SKILL_TEXT_NAME);
    text1.setLocale(SkillTestHelper.LANGUAGE_CODE_EN);
    skill.getTexts().add(text1);

    final SkillsTexts text2 = SkillsTexts.create();
    text2.setName(SkillTestHelper.SKILL_TEXT_NAME);
    text2.setLocale(SkillTestHelper.LANGUAGE_CODE_DE);
    skill.getTexts().add(text2);

    final AlternativeLabels altLabel1 = AlternativeLabels.create();
    altLabel1.setName(SkillTestHelper.ALTERNATIVE_LABEL_NAME);
    altLabel1.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_EN);
    skill.getAlternativeLabels().add(altLabel1);

    final AlternativeLabels altLabel2 = AlternativeLabels.create();
    altLabel2.setName(SkillTestHelper.ALTERNATIVE_LABEL_NAME);
    altLabel2.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_DE);
    skill.getAlternativeLabels().add(altLabel2);

    when(this.mockLanguageRepository.findExistingActiveLanguageCodes("de","en")).thenReturn(nonExistingLanguageSet);

    this.cut.validateLabelLanguageExistence(skill);
    verify(this.mockMessages, times(2)).error((MessageKeys.LANGUAGE_MUST_EXIST));

  }

  @Test
  @DisplayName("check if a correct count of skill texts passes the validation")
  void validateSkillTextCountSuccess() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      String[] languageCodes = { SkillTestHelper.LANGUAGE_CODE_EN, SkillTestHelper.LANGUAGE_CODE_DE };
      List<SkillsTexts> skillsTexts = SkillTestHelper.createTestEntities(2, j -> {
        SkillsTexts skillsText = SkillsTexts.create();
        skillsText.setName(SkillTestHelper.SKILL_TEXT_NAME + j);
        skillsText.setLocale(languageCodes[j]);
        return skillsText;
      });
      List<AlternativeLabels> alternativeLabels = SkillTestHelper.createTestEntities(2, j -> {
        AlternativeLabels alternativeLabel = AlternativeLabels.create();
        alternativeLabel.setName(SkillTestHelper.ALTERNATIVE_LABEL_NAME + j);
        alternativeLabel.setLanguageCode(languageCodes[j]);
        return alternativeLabel;
      });
      skillToCreate.setTexts(skillsTexts);
      skillToCreate.setAlternativeLabels(alternativeLabels);
      return skillToCreate;
    });
    this.cut.validateSkillTextCount(skill);
  }

  @Test
  @DisplayName("check if no text in default language fails the validation")
  void validateSkillTextCountNoTextInDefaultLanguage() {
    final Skills skill = Skills.create();
    skill.setTexts(new ArrayList<>());
    skill.setAlternativeLabels(new ArrayList<>());

    this.cut.validateSkillTextDefaultLanguage(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_NO_DEFAULT_LANGUAGE_TEXT), any());
  }

  @Test
  @DisplayName("check if too many texts in the same language fail the validation")
  void validateSkillTextCountTooManyTextsForALanguage() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      List<SkillsTexts> skillsTexts = SkillTestHelper.createTestEntities(2, j -> {
        SkillsTexts skillsText = SkillsTexts.create();
        skillsText.setName(SkillTestHelper.SKILL_TEXT_NAME + j);
        skillsText.setLocale(SkillTestHelper.LANGUAGE_CODE_EN);
        return skillsText;
      });
      skillToCreate.setTexts(skillsTexts);
      return skillToCreate;
    });
    skill.setAlternativeLabels(new ArrayList<>());

    this.cut.validateSkillTextCount(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.DUPLICATE_SKILL_TEXT_LOCALE));
  }

  @Test
  @DisplayName("check if a missing default text fails the validation")
  void validateSkillTextCountNoDefaultTexts() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      List<SkillsTexts> skillsTexts = SkillTestHelper.createTestEntities(1, j -> {
        SkillsTexts skillsText = SkillsTexts.create();
        skillsText.setName(SkillTestHelper.SKILL_TEXT_NAME + j);
        skillsText.setLocale(SkillTestHelper.LANGUAGE_CODE_DE);
        return skillsText;
      });
      skillToCreate.setTexts(skillsTexts);
      return skillToCreate;
    });
    skill.setAlternativeLabels(new ArrayList<>());

    this.cut.validateSkillTextDefaultLanguage(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_NO_DEFAULT_LANGUAGE_TEXT), any());
  }

  @Test
  @DisplayName("check if a missing text for a language that is used fails the validation")
  void validateSkillTextCountNoTextForUsedLanguage() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      List<SkillsTexts> skillsTexts = SkillTestHelper.createTestEntities(1, j -> {
        SkillsTexts skillsText = SkillsTexts.create();
        skillsText.setName(SkillTestHelper.SKILL_TEXT_NAME + j);
        skillsText.setLocale(SkillTestHelper.LANGUAGE_CODE_EN);
        return skillsText;
      });
      List<AlternativeLabels> alternativeLabels = SkillTestHelper.createTestEntities(2, j -> {
        AlternativeLabels alternativeLabel = AlternativeLabels.create();
        alternativeLabel.setName(SkillTestHelper.ALTERNATIVE_LABEL_NAME + j);
        alternativeLabel.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_DE);
        return alternativeLabel;
      });
      skillToCreate.setTexts(skillsTexts);
      skillToCreate.setAlternativeLabels(alternativeLabels);
      return skillToCreate;
    });

    this.cut.validateSkillTextCount(skill);
    verify(this.mockMessages, times(2)).error(eq(MessageKeys.NON_EXISTING_SKILL_NAME));
  }

  @Test
  @DisplayName("check if a missing default language fails the validation")
  void validateSkillTextCountNoDefaultLanguage() {
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      Skills skillToCreate = Skills.create();
      List<SkillsTexts> skillsTexts = SkillTestHelper.createTestEntities(1, j -> {
        SkillsTexts skillsText = SkillsTexts.create();
        skillsText.setName(SkillTestHelper.SKILL_TEXT_NAME + j);
        skillsText.setLocale(SkillTestHelper.LANGUAGE_CODE_EN);
        return skillsText;
      });
      List<AlternativeLabels> alternativeLabels = SkillTestHelper.createTestEntities(2, j -> {
        AlternativeLabels alternativeLabel = AlternativeLabels.create();
        alternativeLabel.setName(SkillTestHelper.ALTERNATIVE_LABEL_NAME + j);
        alternativeLabel.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_DE);
        return alternativeLabel;
      });
      skillToCreate.setTexts(skillsTexts);
      skillToCreate.setAlternativeLabels(alternativeLabels);
      return skillToCreate;
    });

    this.cut.validateSkillTextCount(skill);
    verify(this.mockMessages, times(2)).error(eq(MessageKeys.NON_EXISTING_SKILL_NAME));
  }

  @Test
  @DisplayName("check if a null skill text list skips the validation")
  void validateSkillTextCountNullSkip() {
    final Skills skill = Skills.create();
    skill.setLocalized(null);

    this.cut.validateSkillTextCount(skill);

    verify(this.mockDefaultLanguageRepository, never()).findActiveEntityByRank(anyInt());
  }

  @Test
  @DisplayName("check if the validation is passed when the fields do not contain html tags")
  void validateForInjectionWithNoTags() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);
    for (SkillsTexts text : skill.getTexts()) {
      text.setCommaSeparatedAlternativeLabels("");
    }

    this.cut.validateForInjection(skill);
    verify(this.mockMessages, times(0)).error(any(), any());
  }

  @Test
  @DisplayName("check if the validation fails when the skills name contains a script tag")
  void validateForInjectionWithTagInTextName() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);
    skill.setCommaSeparatedAlternativeLabels("");
    skill.getTexts().get(0).setName(evilScriptTag);

    this.cut.validateForInjection(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_CONTAINS_HTML_TAG));
  }

  @Test
  @DisplayName("check if the validation fails when the skills text description contains a script tag")
  void validateForInjectionWithTagInTextDescription() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);
    skill.getTexts().get(0).setDescription(evilScriptTag);

    this.cut.validateForInjection(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_CONTAINS_HTML_TAG));
  }

  @Test
  @DisplayName("check if the validation fails when a label name contains a script tag")
  void validateForInjectionWithTagInLabelName() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);
    skill.getAlternativeLabels().get(0).setName(evilScriptTag);

    this.cut.validateForInjection(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_CONTAINS_HTML_TAG));
  }

  @Test
  @DisplayName("check if the validation fails when the comma separated alternative labels contain a script tag")
  void validateForInjectionWithTagInExternalId() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);
    skill.setExternalID(evilScriptTag);

    this.cut.validateForInjection(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_CONTAINS_HTML_TAG));
  }

  @ParameterizedTest(name = "First character {0}")
  @ValueSource(strings = { "+", "-", "=", "@" })
  @DisplayName("check if the validation fails when the external id contains a forbidden first character")
  void validateForInjectionWithForbiddenFirstCharacter(String forbiddenCharacter) {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);
    skill.setExternalID(forbiddenCharacter + "evilCsvInjection");

    this.cut.validateForInjection(skill);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.FORBIDDEN_FIRST_CHARACTER_SKILL));
  }

  @ParameterizedTest(name = "Last character {0}")
  @ValueSource(strings = { "+", "-", "=", "@" })
  @DisplayName("check if the validation succeeds when external id contains a forbidden first character somewhere else in the string")
  void validateForInjectionWithoutForbiddenFirstCharacter(String forbiddenCharacter) {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);
    skill.setExternalID("evilCsvInjection" + forbiddenCharacter);

    this.cut.validateForInjection(skill);
    verify(this.mockMessages, times(0)).error(any(), any());
  }

  @Test
  @DisplayName("extract values for html injection, correctly")
  void extractValuesForHtmlInjection() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addLabelsToSkill(skill, 1, "de", false);
    skill.getTexts().get(0).setCommaSeparatedAlternativeLabels("comma,separated,alternative,labels");

    List<ValuePath<String, Skills_>> extractedValues = this.cut.extractValuesForHtmlInjection(skill);
    assertEquals(4, extractedValues.size());
    assertEquals(skill.getExternalID(), extractedValues.get(0).getValue());
    assertEquals(skill.getTexts().get(0).getName(), extractedValues.get(1).getValue());
    assertEquals(skill.getTexts().get(0).getDescription(), extractedValues.get(2).getValue());
    assertEquals(skill.getAlternativeLabels().get(0).getName(), extractedValues.get(3).getValue());
  }

  @Test
  @DisplayName("extract values for csv injection, correctly")
  void extractValuesForCsvInjection() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addLabelsToSkill(skill, 1, "de", false);
    skill.getTexts().get(0).setCommaSeparatedAlternativeLabels("comma,separated,alternative,labels");

    List<ValuePath<String, Skills_>> extractedValues = this.cut.extractValuesForCsvInjection(skill);
    assertEquals(4, extractedValues.size());
    assertEquals(skill.getExternalID(), extractedValues.get(0).getValue());
    assertEquals(skill.getTexts().get(0).getName(), extractedValues.get(1).getValue());
    assertEquals(skill.getTexts().get(0).getDescription(), extractedValues.get(2).getValue());
    assertEquals(skill.getAlternativeLabels().get(0).getName(), extractedValues.get(3).getValue());
  }

  @Test
  @DisplayName("get correct message key for html injection")
  void getMessageKeyForHtmlInjection() {
    String messageKey = this.cut.getMessageKeyForHtmlInjection();
    assertEquals(MessageKeys.SKILL_CONTAINS_HTML_TAG, messageKey);
  }

  @Test
  @DisplayName("get correct message key for csv injection")
  void getMessageKeyForCsvInjection() {
    String messageKey = this.cut.getMessageKeyForCsvInjection();
    assertEquals(MessageKeys.FORBIDDEN_FIRST_CHARACTER_SKILL, messageKey);
  }

  @Test
  @DisplayName("Validate catalogs2skill assignment draft exists")
  void validateCatalog2SkillAssignmentDraftExists() {
    Catalogs catalog = Catalogs.create();
    catalog.setHasDraftEntity(true);
    catalog.setName("CatalogName");
    Optional<Catalogs> mockString = Optional.of(catalog);
    when(this.mockCatalogRepository.findCatalogByIdWithNameAndHasDraftEntity(anyString())).thenReturn(mockString);
    Boolean canBeAssigned = this.cut.isValidForCatalog2SkillAssignment("ID");
    assertFalse(canBeAssigned);
    verify(this.mockMessages).warn(any(String.class), eq("CatalogName"));
  }

  @Test
  @DisplayName("validate catalogs2skill assignment catalog does not exist")
  void validateCatalog2SkillAssignmentCatalogDoesNotExist() {
    Optional<Catalogs> emptyOptional = Optional.empty();
    when(this.mockCatalogRepository.findCatalogByIdWithNameAndHasDraftEntity(anyString())).thenReturn(emptyOptional);
    Boolean canBeAssigned = this.cut.isValidForCatalog2SkillAssignment("ID");
    assertFalse(canBeAssigned);
  }

  @Test
  @DisplayName("validate catalogs2skill assignment successfully")
  void validateCatalog2SkillAssignmentSuccessfully() {
    Catalogs catalog = Catalogs.create();
    catalog.setHasDraftEntity(false);
    catalog.setName("CatalogName");
    when(this.mockCatalogRepository.findCatalogByIdWithNameAndHasDraftEntity(anyString()))
        .thenReturn(Optional.of(catalog));
    Boolean canBeAssigned = this.cut.isValidForCatalog2SkillAssignment("ID");
    assertTrue(canBeAssigned);
  }

}
