package com.sap.c4p.rm.skill.services.skillimport.esco;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;

import java.io.IOException;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.skill.esco.EscoCsvColumn;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.utils.LifecycleStatusCode;

class EscoParserImplTest {

  /** object under test */
  private EscoParser cut;

  private static final String LANGUAGE_CODE_EN = "en";

  private static final String SOME_EXTERNAL_ID = "EXTERNAL_ID";
  private static final String SOME_DESCRIPTION = "einmal wissen dieses bleibt für immer";
  private static final String SOME_SKILL_TEXT = "am fenster";
  private static final String SOME_ALTERNATIVE_LABELS = "\"Ist nicht Rausch der schon die Nacht verklagt"
      + System.lineSeparator() + "und noch eins\"";
  private static final String SOME_CATALOG_NAMES = "\"One" + System.lineSeparator() + "Two\"";

  private ProficiencySetRepository mockProficiencySetRepository;

  /**
   * initialize object under test
   */
  @BeforeEach
  void setUp() {
    this.mockProficiencySetRepository = mock(ProficiencySetRepository.class);
    this.cut = new EscoParserImpl(this.mockProficiencySetRepository);
  }

  @Test
  @DisplayName("check if parseSkill() returns a properly created skill")
  void parseSkillSuccess() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.CATALOGS.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, EscoParserImplTest.SOME_ALTERNATIVE_LABELS,
            EscoParserImplTest.SOME_CATALOG_NAMES));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    final String[] expectedAlternativeLabels = EscoParserImplTest.SOME_ALTERNATIVE_LABELS
        .substring(1, EscoParserImplTest.SOME_ALTERNATIVE_LABELS.length() - 1).split(System.lineSeparator());
    assertEquals(expectedAlternativeLabels.length, result.getSkill().getAlternativeLabels().size());

    for (int i = 0; i < expectedAlternativeLabels.length; i++) {
      assertEquals(expectedAlternativeLabels[i], result.getSkill().getAlternativeLabels().get(i).getName());
      assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN,
          result.getSkill().getAlternativeLabels().get(i).getLanguageCode());
    }

    // Assert catalogs
    final String[] expectedCatalogNames = EscoParserImplTest.SOME_CATALOG_NAMES
        .substring(1, EscoParserImplTest.SOME_CATALOG_NAMES.length() - 1).split(System.lineSeparator());
    assertEquals(expectedCatalogNames.length, result.getCatalogNames().length);

    for (int i = 0; i < expectedCatalogNames.length; i++) {
      assertEquals(expectedCatalogNames[i], result.getCatalogNames()[i]);
    }
  }

  @Test
  @DisplayName("check if parseSkill() returns a properly created skill without catalogs")
  void parseSkillNoCatalogs() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, EscoParserImplTest.SOME_ALTERNATIVE_LABELS));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    final String[] expectedAlternativeLabels = EscoParserImplTest.SOME_ALTERNATIVE_LABELS
        .substring(1, EscoParserImplTest.SOME_ALTERNATIVE_LABELS.length() - 1).split(System.lineSeparator());
    assertEquals(expectedAlternativeLabels.length, result.getSkill().getAlternativeLabels().size());

    for (int i = 0; i < expectedAlternativeLabels.length; i++) {
      assertEquals(expectedAlternativeLabels[i], result.getSkill().getAlternativeLabels().get(i).getName());
      assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN,
          result.getSkill().getAlternativeLabels().get(i).getLanguageCode());
    }

    // Assert catalogs
    assertNull(result.getCatalogNames());
  }

  @Test
  @DisplayName("check if parseSkill() returns a properly created skill without alternative labels")
  void parseSkillNoAlternativeLabels() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, ""));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertNull(result.getCatalogNames());
  }

  @Test
  @DisplayName("check if parseSkill() does not create empty alternative labels")
  void parseSkillEmptyAlternativeLabels() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, ""));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertNull(result.getCatalogNames());
  }

  @Test
  @DisplayName("check if parseSkill() does not create empty catalogs")
  void parseSkillEmptyCatalogs() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.CATALOGS.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, "", ""));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertEquals(0, result.getCatalogNames().length);
  }

  @Test
  @DisplayName("check if parseSkill() does not create whitespace alternative labels")
  void parseSkillWhitespaceAlternativeLabels() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, " "));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertNull(result.getCatalogNames());
  }

  @Test
  @DisplayName("check if parseSkill() does not create whitespace catalogs")
  void parseSkillWhitespaceCatalogs() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.CATALOGS.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, "", " "));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertEquals(0, result.getCatalogNames().length);
  }

  @Test
  @DisplayName("check if parseSkill() creates a skill with a restricted usage")
  void parseSkillWithRestrictedUsage() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.CATALOGS.getName(), EscoCsvColumn.USAGE.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, "", " ", "restricted"));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert lifecycle status code
    assertEquals(LifecycleStatusCode.RESTRICTED.getCode(), result.getSkill().getLifecycleStatusCode());

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertEquals(0, result.getCatalogNames().length);
  }

  @Test
  @DisplayName("check if parseSkill() creates a skill with a unrestricted usage")
  void parseSkillWithUnrestrictedUsage() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.CATALOGS.getName(), EscoCsvColumn.USAGE.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, "", " ", "unrestricted"));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert lifecycle status code
    assertEquals(LifecycleStatusCode.UNRESTRICTED.getCode(), result.getSkill().getLifecycleStatusCode());

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertEquals(0, result.getCatalogNames().length);
  }

  @Test
  @DisplayName("check if parseSkill() creates a skill with a empty usage column")
  void parseSkillWithEmptyUsage() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.CATALOGS.getName(), EscoCsvColumn.USAGE.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, "", " ", ""));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert lifecycle status code
    assertEquals(LifecycleStatusCode.UNRESTRICTED.getCode(), result.getSkill().getLifecycleStatusCode());

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertEquals(0, result.getCatalogNames().length);
  }

  @Test
  @DisplayName("check if parseSkill() creates a skill with a proficiency set column")
  void parseSkillWithProficiencySet() throws IOException {
    final String csvContent = String.join(System.lineSeparator(),
        String.join(",", EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.CATALOGS.getName(), EscoCsvColumn.PROFICIENCY_SET.getName()),
        String.join(",", EscoParserImplTest.SOME_DESCRIPTION, EscoParserImplTest.SOME_EXTERNAL_ID,
            EscoParserImplTest.SOME_SKILL_TEXT, "", " ", "Proficiency Set"));

    final CSVParser parser = CSVParser.parse(csvContent, CSVFormat.RFC4180.withFirstRecordAsHeader());
    final CSVRecord recordToParse = parser.getRecords().get(0);

    final EscoParserResult result = this.cut.parseSkill(recordToParse, EscoParserImplTest.LANGUAGE_CODE_EN);

    // Assert lifecycle status code
    assertEquals(LifecycleStatusCode.UNRESTRICTED.getCode(), result.getSkill().getLifecycleStatusCode());

    // Assert skill text
    assertEquals(1, result.getSkill().getTexts().size());
    assertEquals(EscoParserImplTest.SOME_DESCRIPTION, result.getSkill().getTexts().get(0).getDescription());
    assertEquals(EscoParserImplTest.LANGUAGE_CODE_EN, result.getSkill().getTexts().get(0).getLocale());
    assertEquals(EscoParserImplTest.SOME_SKILL_TEXT, result.getSkill().getTexts().get(0).getName());

    // Assert alternative labels
    assertEquals(0, result.getSkill().getAlternativeLabels().size());

    // Assert catalogs
    assertEquals(0, result.getCatalogNames().length);
  }
}
