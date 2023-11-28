package com.sap.c4p.rm.skill.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.esco.EscoCsvColumn;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.skill.SkillsDownload;

class SkillFileDownloadServiceTest {

  private SkillFileDownloadService cut;

  private List<SkillsDownload> oneTestSkill = new ArrayList<>();
  private List<SkillsDownload> multipleTestSkills = new ArrayList<>();

  private PersistenceService mockPersistenceService;
  private SkillRepository mockSkillRepository;
  private LanguageRepository mockLanguageRepository;
  private DefaultLanguages mockDefaultLanguage;
  private Result mockResult;

  private String expectedCsvHeader;

  /**
   * initialize object under test
   *
   * @throws IOException
   */
  @BeforeEach
  void setUp() throws IOException {
    this.initializeTestSkills();
    this.prepareMockObjects();

    this.expectedCsvHeader = this.createCsvLine(EscoCsvColumn.CONCEPT_TYPE.getName(),
        EscoCsvColumn.EXTERNAL_ID.getName(), EscoCsvColumn.SKILL_UUID.getName(), EscoCsvColumn.SKILL_TYPE.getName(),
        EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
        EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.USAGE.getName(), EscoCsvColumn.CATALOGS.getName(),
        EscoCsvColumn.PROFICIENCY_SET.getName(), EscoCsvColumn.PROFICIENCY_LEVEL_UUID.getName(),
        EscoCsvColumn.PROFICIENCY_LEVEL.getName(), EscoCsvColumn.PROFICIENCY_LEVEL_NAME.getName());
  }

  @Test
  @DisplayName("Handle download successful")
  void handleFileDownloadSuccess() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.oneTestSkill);
    when(this.mockSkillRepository.count()).thenReturn(1L);
    when(this.mockSkillRepository.countWithLanguage(anyString())).thenReturn(1L);
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(anyString()))
        .thenReturn(Collections.singleton(SkillTestHelper.LANGUAGE_CODE_DE));

    ResponseEntity<StreamingResponseBody> response = this.cut.handleDownload(SkillTestHelper.LANGUAGE_CODE_DE);
    assertEquals("1", response.getHeaders().get(SkillTestHelper.HEADER_DOWNLOADED_COUNTER).get(0));
    assertEquals("0", response.getHeaders().get(SkillTestHelper.HEADER_NOT_DOWNLOADED_COUNTER).get(0));
  }

  @Test
  @DisplayName("Handle download with no skills")
  void handleFileDownloadNoSkills() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.oneTestSkill);
    when(this.mockSkillRepository.count()).thenReturn(0L);
    when(this.mockSkillRepository.countWithLanguage(anyString())).thenReturn(0L);
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(anyString())).thenReturn(Collections.emptySet());

    assertThrows(ServiceException.class, () -> this.cut.handleDownload(SkillTestHelper.LANGUAGE_CODE_EN));
  }

  @Test
  @DisplayName("Handle download with non existing skill in language")
  void handleFileDownloadWithNonExistingSkillInLanguage() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.oneTestSkill);
    when(this.mockSkillRepository.count()).thenReturn(1L);
    when(this.mockSkillRepository.countWithLanguage(anyString())).thenReturn(0L);
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(anyString()))
        .thenReturn(Collections.singleton(SkillTestHelper.LANGUAGE_CODE_EN));

    assertThrows(ServiceException.class, () -> this.cut.handleDownload(SkillTestHelper.LANGUAGE_CODE_EN));
  }

  @Test
  @DisplayName("Process async download successful")
  @SuppressWarnings("unchecked")
  void processAsyncDownloadSuccess() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.oneTestSkill, Collections.<SkillsDownload>emptyList());
    OutputStream out = new ByteArrayOutputStream();
    this.cut.processAsyncDownload(SkillTestHelper.LANGUAGE_CODE_EN, out);
    String[] result = out.toString().trim().split(SkillTestHelper.CSV_LINE_SEPARATOR, 2);
    String resultCsvHeader = result[0];
    String resultCsvContent = result[1];

    String expectedCsvContent = this.createCsvLine(SkillTestHelper.CONCEPT_TYPE_VALUE,
        SkillTestHelper.SKILL_EXTERNAL_ID, SkillTestHelper.SKILL_ID, SkillTestHelper.SKILL_TYPE_VALUE,
        SkillTestHelper.SKILL_TEXT_NAME + 0, SkillTestHelper.ALTERNATIVE_LABEL_NAME + 0,
        SkillTestHelper.SKILL_TEXT_DESCRIPTION + 0, SkillTestHelper.UNRESTRICTED, SkillTestHelper.CATALOG_NAME + 0,
        SkillTestHelper.PROFICIENCY_SET_NAME, SkillTestHelper.PROFICIENCY_LEVEL_UUID + 0,
        SkillTestHelper.PROFICIENCY_LEVEL + 0, SkillTestHelper.PROFICIENCY_LEVEL_NAME + 0);

    assertEquals(2, result.length);
    assertEquals(this.expectedCsvHeader, resultCsvHeader);
    assertEquals(expectedCsvContent, resultCsvContent);
  }

  @Test
  @DisplayName("Process async download successful with mutiple skills")
  @SuppressWarnings("unchecked")
  void processAsyncDownloadMultipleSkills() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.multipleTestSkills, Collections.<SkillsDownload>emptyList());
    OutputStream out = new ByteArrayOutputStream();
    this.cut.processAsyncDownload(SkillTestHelper.LANGUAGE_CODE_EN, out);
    String[] result = out.toString().trim().split(SkillTestHelper.CSV_LINE_SEPARATOR, 3);
    String resultCsvHeader = result[0];
    String resultCsvContent0 = result[1];
    String resultCsvContent1 = result[2];

    String expectedCsvContent0 = this.createCsvLine(SkillTestHelper.CONCEPT_TYPE_VALUE,
        SkillTestHelper.SKILL_EXTERNAL_ID, SkillTestHelper.SKILL_ID, SkillTestHelper.SKILL_TYPE_VALUE,
        SkillTestHelper.SKILL_TEXT_NAME + 0, SkillTestHelper.ALTERNATIVE_LABEL_NAME + 0,
        SkillTestHelper.SKILL_TEXT_DESCRIPTION + 0, SkillTestHelper.UNRESTRICTED, SkillTestHelper.CATALOG_NAME + 0,
        SkillTestHelper.PROFICIENCY_SET_NAME, SkillTestHelper.PROFICIENCY_LEVEL_UUID + 0,
        SkillTestHelper.PROFICIENCY_LEVEL + 0, SkillTestHelper.PROFICIENCY_LEVEL_NAME + 0);
    String expectedCsvContent1 = this.createCsvLine(SkillTestHelper.CONCEPT_TYPE_VALUE,
        SkillTestHelper.SKILL_EXTERNAL_ID, SkillTestHelper.SKILL_ID, SkillTestHelper.SKILL_TYPE_VALUE,
        SkillTestHelper.SKILL_TEXT_NAME + 1, SkillTestHelper.ALTERNATIVE_LABEL_NAME + 1,
        SkillTestHelper.SKILL_TEXT_DESCRIPTION + 1, SkillTestHelper.UNRESTRICTED, SkillTestHelper.CATALOG_NAME + 1,
        SkillTestHelper.PROFICIENCY_SET_NAME, SkillTestHelper.PROFICIENCY_LEVEL_UUID + 1,
        SkillTestHelper.PROFICIENCY_LEVEL + 1, SkillTestHelper.PROFICIENCY_LEVEL_NAME + 1);

    assertEquals(3, result.length);
    assertEquals(this.expectedCsvHeader, resultCsvHeader);
    assertEquals(expectedCsvContent0, resultCsvContent0);
    assertEquals(expectedCsvContent1, resultCsvContent1);
  }

  @Test
  @DisplayName("Process async download successful with a restricted skill")
  @SuppressWarnings("unchecked")
  void processAsyncDownloadRestricted() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.oneTestSkill, Collections.<SkillsDownload>emptyList());
    this.oneTestSkill.get(0).setUsage("1");

    OutputStream out = new ByteArrayOutputStream();
    this.cut.processAsyncDownload(SkillTestHelper.LANGUAGE_CODE_EN, out);
    String[] result = out.toString().trim().split(SkillTestHelper.CSV_LINE_SEPARATOR, 3);
    String resultCsvHeader = result[0];
    String resultCsvContent = result[1];

    String expectedCsvContent = this.createCsvLine(SkillTestHelper.CONCEPT_TYPE_VALUE,
        SkillTestHelper.SKILL_EXTERNAL_ID, SkillTestHelper.SKILL_ID, SkillTestHelper.SKILL_TYPE_VALUE,
        SkillTestHelper.SKILL_TEXT_NAME + 0, SkillTestHelper.ALTERNATIVE_LABEL_NAME + 0,
        SkillTestHelper.SKILL_TEXT_DESCRIPTION + 0, SkillTestHelper.RESTRICTED, SkillTestHelper.CATALOG_NAME + 0,
        SkillTestHelper.PROFICIENCY_SET_NAME, SkillTestHelper.PROFICIENCY_LEVEL_UUID + 0,
        SkillTestHelper.PROFICIENCY_LEVEL + 0, SkillTestHelper.PROFICIENCY_LEVEL_NAME + 0);

    assertEquals(2, result.length);
    assertEquals(this.expectedCsvHeader, resultCsvHeader);
    assertEquals(expectedCsvContent, resultCsvContent);
  }

  @Test
  @DisplayName("Process async download successful with two catalogs")
  @SuppressWarnings("unchecked")
  void processAsyncDownloadOneTwoCatalogs() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.oneTestSkill, Collections.<SkillsDownload>emptyList());
    this.oneTestSkill.get(0).setCatalogs(SkillTestHelper.CATALOG_NAME + 0 + "\n" + SkillTestHelper.CATALOG_NAME + 1);

    OutputStream out = new ByteArrayOutputStream();
    this.cut.processAsyncDownload(SkillTestHelper.LANGUAGE_CODE_EN, out);
    String[] result = out.toString().trim().split(SkillTestHelper.CSV_LINE_SEPARATOR, 2);
    String resultCsvHeader = result[0];
    String resultCsvContent = result[1];

    String expectedCsvContent = this.createCsvLine(SkillTestHelper.CONCEPT_TYPE_VALUE,
        SkillTestHelper.SKILL_EXTERNAL_ID, SkillTestHelper.SKILL_ID, SkillTestHelper.SKILL_TYPE_VALUE,
        SkillTestHelper.SKILL_TEXT_NAME + 0, SkillTestHelper.ALTERNATIVE_LABEL_NAME + 0,
        SkillTestHelper.SKILL_TEXT_DESCRIPTION + 0, SkillTestHelper.UNRESTRICTED,
        "\"" + SkillTestHelper.CATALOG_NAME + 0 + "\n" + SkillTestHelper.CATALOG_NAME + 1 + "\"",
        SkillTestHelper.PROFICIENCY_SET_NAME, SkillTestHelper.PROFICIENCY_LEVEL_UUID + 0,
        SkillTestHelper.PROFICIENCY_LEVEL + 0, SkillTestHelper.PROFICIENCY_LEVEL_NAME + 0);

    assertEquals(2, result.length);
    assertEquals(this.expectedCsvHeader, resultCsvHeader);
    assertEquals(expectedCsvContent, resultCsvContent);
  }

  @Test
  @DisplayName("Process async download with different proficiency sets")
  @SuppressWarnings("unchecked")
  void processAsyncDownloadDifferentProficiencySets() throws IOException {
    when(this.mockSkillRepository.findActiveEntitiesForDownload(anyString(), anyInt(), anyInt()))
        .thenReturn(this.multipleTestSkills, Collections.<SkillsDownload>emptyList());
    final String anotherProfSet = "Another proficiency set";
    this.multipleTestSkills.get(0).setProficiencySet(anotherProfSet);

    OutputStream out = new ByteArrayOutputStream();
    this.cut.processAsyncDownload(SkillTestHelper.LANGUAGE_CODE_EN, out);
    String[] result = out.toString().trim().split(SkillTestHelper.CSV_LINE_SEPARATOR, 3);
    String resultCsvHeader = result[0];
    String resultCsvContentLine1 = result[1];
    String resultCsvContentLine2 = result[2];

    String expectedCsvContentLine1 = this.createCsvLine(SkillTestHelper.CONCEPT_TYPE_VALUE,
        SkillTestHelper.SKILL_EXTERNAL_ID, SkillTestHelper.SKILL_ID, SkillTestHelper.SKILL_TYPE_VALUE,
        SkillTestHelper.SKILL_TEXT_NAME + 0, SkillTestHelper.ALTERNATIVE_LABEL_NAME + 0,
        SkillTestHelper.SKILL_TEXT_DESCRIPTION + 0, SkillTestHelper.UNRESTRICTED, SkillTestHelper.CATALOG_NAME + 0,
        anotherProfSet, SkillTestHelper.PROFICIENCY_LEVEL_UUID + 0, SkillTestHelper.PROFICIENCY_LEVEL + 0,
        SkillTestHelper.PROFICIENCY_LEVEL_NAME + 0);
    String expectedCsvContentLine2 = expectedCsvContentLine1
        .replace(anotherProfSet, SkillTestHelper.PROFICIENCY_SET_NAME).replace('0', '1');

    assertEquals(3, result.length);
    assertEquals(this.expectedCsvHeader, resultCsvHeader);
    assertEquals(expectedCsvContentLine1, resultCsvContentLine1);
    assertEquals(expectedCsvContentLine2, resultCsvContentLine2);
  }

  private String createCsvLine(String... columns) {
    StringJoiner stringJoiner = new StringJoiner(",");
    for (String column : columns) {
      stringJoiner.add(column);
    }
    return stringJoiner.toString();
  }

  private void prepareMockObjects() {
    this.mockPersistenceService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);
    this.mockSkillRepository = mock(SkillRepository.class);
    this.mockLanguageRepository = mock(LanguageRepository.class);
    this.mockResult = mock(Result.class);
    this.mockDefaultLanguage = mock(DefaultLanguages.class);
    this.mockDefaultLanguage.setLanguageCode("en");
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(this.mockResult);
    when(this.mockResult.first(DefaultLanguages.class)).thenReturn(Optional.of(this.mockDefaultLanguage));
    this.cut = new SkillFileDownloadService(this.mockSkillRepository, this.mockLanguageRepository);
  }

  private void initializeTestSkills() {
    this.oneTestSkill = Collections.singletonList(this.createSkill(0, SkillTestHelper.LANGUAGE_CODE_EN));
    this.multipleTestSkills = Arrays.asList(this.createSkill(0, SkillTestHelper.LANGUAGE_CODE_EN),
        this.createSkill(1, SkillTestHelper.LANGUAGE_CODE_EN));
  }

  private SkillsDownload createSkill(int i, String langCode) {
    SkillsDownload skill = SkillsDownload.create();
    skill.setSkillUUID(SkillTestHelper.SKILL_ID);
    skill.setLocale(langCode);
    skill.setConceptUri(SkillTestHelper.SKILL_EXTERNAL_ID);
    skill.setPreferredLabel(SkillTestHelper.SKILL_TEXT_NAME + i);
    skill.setDescription(SkillTestHelper.SKILL_TEXT_DESCRIPTION + i);
    skill.setAltLabels(SkillTestHelper.ALTERNATIVE_LABEL_NAME + i);
    skill.setProficiencySet(SkillTestHelper.PROFICIENCY_SET_NAME);
    skill.setCatalogs(SkillTestHelper.CATALOG_NAME + i);
    skill.setProficiencyLevelUUID(SkillTestHelper.PROFICIENCY_LEVEL_UUID + i);
    skill.setProficiencyLevel(SkillTestHelper.PROFICIENCY_LEVEL + i);
    skill.setProficiencyLevelName(SkillTestHelper.PROFICIENCY_LEVEL_NAME + i);
    skill.setUsage("0");
    return skill;
  }
}
