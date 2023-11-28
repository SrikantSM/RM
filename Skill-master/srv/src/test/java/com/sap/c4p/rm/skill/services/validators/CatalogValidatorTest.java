package com.sap.c4p.rm.skill.services.validators;

import catalogservice.Catalogs;
import catalogservice.Catalogs2Skills;
import catalogservice.Catalogs_;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.CatalogRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.CatalogTestHelper;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;
import com.sap.c4p.rm.skill.utils.ValuePath;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;
import com.sap.resourcemanagement.config.DefaultLanguages;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import skillservice.Skills;
import skillservice.SkillsTexts;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class CatalogValidatorTest {
  /* object under test */
  private CatalogValidator cut;

  /* mocks */
  private CatalogRepository mockCatalogRepository;
  private SkillRepository mockSkillRepository;
  private Messages mockMessages;

  @BeforeEach
  void beforeEach() {
    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_EN);

    this.mockCatalogRepository = mock(CatalogRepository.class);
    this.mockSkillRepository = mock(SkillRepository.class);
    this.mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
    this.cut = new CatalogValidator(this.mockCatalogRepository, this.mockSkillRepository, this.mockMessages);
  }

  @Test
  @DisplayName("validation calls all methods")
  void validateSuccess() {
    this.cut = spy(this.cut);
    Catalogs catalog = Catalogs.create();

    this.cut.validate(catalog);

    verify(this.cut, times(1)).validateSkillExists(catalog);
    verify(this.cut, times(1)).validateForInjection(catalog);
    verify(this.cut, times(1)).validateNameUniqueness(catalog);
    verify(this.cut, times(1)).validateSkillUniqueness(catalog);
  }

  @Test
  @DisplayName("validation calls throwIfError")
  void validateError() {
    Catalogs catalog = Catalogs.create();
    catalog.setName("<script>");
    this.cut.validate(catalog);
    verify(this.mockMessages, times(1)).throwIfError();
  }

  @Test
  @DisplayName("check if a the name uniqueness check succeeds")
  void validateNameUniquessSuccess() {
    final Catalogs catalog = Catalogs.create();
    catalog.setName("Catalog 1");

    when(this.mockCatalogRepository.countOtherActiveEntitiesWithSameName(any())).thenReturn(0L);
    this.cut.validateNameUniqueness(catalog);
  }

  @Test
  @DisplayName("check if a duplicate name fails the validation")
  void validateNameUniquessFailure() {
    final Catalogs catalog = Catalogs.create();
    catalog.setName("Catalog 1");
    when(this.mockCatalogRepository.countOtherActiveEntitiesWithSameName(any())).thenReturn(1L);

    this.cut.validateNameUniqueness(catalog);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.CATALOG_NAME_EXISTS));
  }

  @Test
  @DisplayName("check that a catalog without skill associations can be deleted")
  void validateNoSkillAssociationsWithoutAssociations() {
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    catalog.setSkillAssociations(Collections.emptyList());
    assertDoesNotThrow(() -> this.cut.validateDeletion(Optional.of(catalog)));
  }

  @Test
  @DisplayName("check that a catalog with skill associations can't be deleted")
  void validateNoSkillAssociationsWithAssociations() {
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    final Catalogs2Skills catalog2Skill = Catalogs2Skills.create();
    catalog.setSkillAssociations(Collections.singletonList(catalog2Skill));
    assertThrows(ServiceException.class, () -> this.cut.validateDeletion(Optional.of(catalog)));
  }

  @Test
  @DisplayName("check that an error message will be written when an non existing skill is assigned")
  void validateSkillExistsWithNonExistingSkill() {
    Catalogs catalog = CatalogTestHelper.createCatalog();
    final Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    catalogs2Skills.setSkillId(UUID.randomUUID().toString());
    catalog.setSkillAssociations(Collections.singletonList(catalogs2Skills));
    this.cut.validateSkillExists(catalog);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_MUST_EXIST), any());
  }

  @Test
  @DisplayName("check that an error message will be written when an null (empty) skill is assigned")
  void validateSkillExistsWithEmptySkill() {
    Catalogs catalog = CatalogTestHelper.createCatalog();
    final Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    catalog.setSkillAssociations(Collections.singletonList(catalogs2Skills));
    this.cut.validateSkillExists(catalog);
    verify(this.mockMessages, times(1)).error(eq(MessageKeys.SKILL_ASSIGNMENT_EMPTY));
  }

  @Test
  @DisplayName("check that there will be non exception when only existing skill id is inserted")
  void validateSkillWithExistingSkill() {
    Catalogs catalog = CatalogTestHelper.createCatalog();
    assertDoesNotThrow(() -> this.cut.validateSkillExists(catalog));
  }

  @Test
  @DisplayName("check that non-duplicate skill assignments pass the validation")
  void validateSkillUniquenessSuccess() {
    Catalogs catalog = CatalogTestHelper.createCatalog();

    Catalogs2Skills c2s1 = Catalogs2Skills.create();
    c2s1.setSkillId(UUID.randomUUID().toString());
    Catalogs2Skills c2s2 = Catalogs2Skills.create();
    c2s2.setSkillId(UUID.randomUUID().toString());

    catalog.setSkillAssociations(new ArrayList<>());
    catalog.getSkillAssociations().add(c2s1);
    catalog.getSkillAssociations().add(c2s2);

    assertDoesNotThrow(() -> this.cut.validateSkillUniqueness(catalog));
  }

  @Test
  @DisplayName("check that duplicate skill assignments fail the validation")
  void validateSkillUniquenessFailure() {
    Catalogs catalog = CatalogTestHelper.createCatalog();
    Skills skill = SkillTestHelper.createSkill();
    skill.setLocalized(SkillsTexts.create());

    Catalogs2Skills c2s1 = Catalogs2Skills.create();
    c2s1.setSkillId(skill.getId());
    Catalogs2Skills c2s2 = Catalogs2Skills.create();
    c2s2.setSkillId(skill.getId());

    catalog.setSkillAssociations(new ArrayList<>());
    catalog.getSkillAssociations().add(c2s1);
    catalog.getSkillAssociations().add(c2s2);

    when(this.mockSkillRepository.findByIdLocalized(any(), any())).thenReturn(Optional.of(skill));

    this.cut.validateSkillUniqueness(catalog);

    verify(this.mockMessages, times(1)).error(eq(MessageKeys.CATALOG_SKILL_UNIQUENESS), any());
  }

  @Test
  @DisplayName("check that duplicate skill assignments of a non-existing skill don't fail the skill uniqueness validation")
  void validateSkillUniquenessNonExisting() {
    Catalogs catalog = CatalogTestHelper.createCatalog();
    Skills skill = SkillTestHelper.createSkill();
    skill.setLocalized(SkillsTexts.create());

    Catalogs2Skills c2s1 = Catalogs2Skills.create();
    c2s1.setSkillId(skill.getId());
    Catalogs2Skills c2s2 = Catalogs2Skills.create();
    c2s2.setSkillId(skill.getId());

    catalog.setSkillAssociations(new ArrayList<>());
    catalog.getSkillAssociations().add(c2s1);
    catalog.getSkillAssociations().add(c2s2);

    when(this.mockSkillRepository.findByIdLocalized(any(), any())).thenReturn(Optional.empty());

    assertDoesNotThrow(() -> this.cut.validateSkillUniqueness(catalog));
  }

  @Test
  @DisplayName("extract values for html injection, correctly")
  void extractValuesForHtmlInjection() {
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    List<ValuePath<String, Catalogs_>> extractedValues = this.cut.extractValuesForHtmlInjection(catalog);
    assertEquals(2, extractedValues.size());
    assertEquals(catalog.getName(), extractedValues.get(0).getValue());
    assertEquals(catalog.getDescription(), extractedValues.get(1).getValue());
  }

  @Test
  @DisplayName("extract values for csv injection, correctly")
  void extractValuesForCsvInjection() {
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    List<ValuePath<String, Catalogs_>> extractedValues = this.cut.extractValuesForCsvInjection(catalog);
    assertEquals(1, extractedValues.size());
    assertEquals(catalog.getName(), extractedValues.get(0).getValue());
  }

  @Test
  @DisplayName("get correct message key for html injection")
  void getMessageKeyForHtmlInjection() {
    String messageKey = this.cut.getMessageKeyForHtmlInjection();
    assertEquals(MessageKeys.CATALOG_CONTAINS_HTML_TAG, messageKey);
  }

  @Test
  @DisplayName("get correct message key for csv injection")
  void getMessageKeyForCsvInjection() {
    String messageKey = this.cut.getMessageKeyForCsvInjection();
    assertEquals(MessageKeys.FORBIDDEN_FIRST_CHARACTER_CATALOG, messageKey);
  }
}
