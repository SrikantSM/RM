package com.sap.c4p.rm.skill.services.skillimport.esco;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;

class EscoCsvConsistencyCheckImplTest {

  /**
   * object under test
   */
  private EscoCsvConsistencyCheck cut;

  /**
   * {@link CSVParser} to be used by object under test
   */
  private CSVParser csvParser;

  private ProficiencySetRepository mockProficiencySetRepository;

  /**
   * initialize object under test
   */
  @BeforeEach
  void setUp() {
    this.mockProficiencySetRepository = mock(ProficiencySetRepository.class, Mockito.RETURNS_DEEP_STUBS);
    this.cut = new EscoCsvConsistencyCheckImpl(this.mockProficiencySetRepository);
  }

  @Test
  @DisplayName("see if check succeeds if csv valid file is provided")
  void checkHeaderSuccess() throws IOException, ServiceException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,usage\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,unrestricted",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    Optional<ServiceException> headerCheckError = this.cut.checkHeader(this.csvParser.getHeaderMap().keySet());
    assertFalse(headerCheckError.isPresent());
  }

  @Test
  @DisplayName("see if check fails if csv file containing invalid header is provided")
  void checkHeaderFails() throws IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels\nKnowledgeSkillCompetence,uri,skill/competence,a,b",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    Optional<ServiceException> headerCheckError = this.cut.checkHeader(this.csvParser.getHeaderMap().keySet());
    assertTrue(headerCheckError.isPresent());
  }

  @Test
  @DisplayName("see if check succeeds for an unrestricted usage column")
  void checkUnrestrictedUsageSuccess() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,usage\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,unrestricted",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertTrue(exceptions.isEmpty());
  }

  @Test
  @DisplayName("see if check succeeds for an restricted usage column")
  void checkRestrictedUsageSuccess() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,usage\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,restricted",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertTrue(exceptions.isEmpty());
  }

  @Test
  @DisplayName("see if check succeeds for an usage column that is not set")
  void checkUsageNotSetSuccess() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,usage\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertTrue(exceptions.isEmpty());
  }

  @Test
  @DisplayName("see if check fails if the number of csv record columns does not the number of header columns")
  void checkCsvRecordInconsistencyFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,proficiencySet\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_INCONSISTENT_RECORD).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record does not have a description set")
  void checkDescriptionNotSetFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description\nKnowledgeSkillCompetence,uri,skill/competence,a,b,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_EMPTY_DESCRIPTION).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record has an empty description")
  void checkEmptyDescriptionFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description\nKnowledgeSkillCompetence,uri,skill/competence,a,b,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_EMPTY_DESCRIPTION).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record does not have a preferredLabel set")
  void checkPreferredLabelNotSetFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,altLabels,description,preferredLabel\nKnowledgeSkillCompetence,uri,skill/competence,b,c,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_EMPTY_PREFERRED_LABEL).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record has an empty preferredLabel")
  void checkEmptyPreferredLabelFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,altLabels,description,preferredLabel\nKnowledgeSkillCompetence,uri,skill/competence,b,c,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_EMPTY_PREFERRED_LABEL).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record does not have a conceptUri set")
  void checkConceptUriNotSetFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,skillType,altLabels,description,preferredLabel,conceptUri\nKnowledgeSkillCompetence,skill/competence,a,b,c,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_EMPTY_CONCEPT_URI).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record has an empty conceptUri")
  void checkEmptyConceptUriFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,skillType,altLabels,description,preferredLabel,conceptUri\nKnowledgeSkillCompetence,skill/competence,a,b,c,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_EMPTY_CONCEPT_URI).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record does not have a conceptType set")
  void checkConceptTypeNotSetFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "skillType,altLabels,description,preferredLabel,conceptUri,conceptType\nskill/competence,a,b,c,uri,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_INVALID_CONCEPT_TYPE).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record has an invalid conceptType")
  void checkInvalidConceptTypeFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "skillType,altLabels,description,preferredLabel,conceptUri,conceptType\nskill/competence,a,b,c,uri,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_INVALID_CONCEPT_TYPE).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record does not have a conceptType set")
  void checkSkillTypeNotSetFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "altLabels,description,preferredLabel,conceptUri,conceptType,skillType\na,b,c,uri,KnowledgeSkillCompetence,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_INVALID_SKILL_TYPE).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record has an invalid conceptType")
  void checkInvalidSkillTypeFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "altLabels,description,preferredLabel,conceptUri,conceptType,skillType\na,b,c,uri,KnowledgeSkillCompetence,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_INVALID_SKILL_TYPE).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record has an invalid usage")
  void checkInvalidUsageFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,usage\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,invalid",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_INVALID_USAGE_VALUE).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check fails if a csv record has an empty proficiency set")
  void checkEmptyProficiencySetFails() throws FileNotFoundException, IOException {
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,proficiencySet\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
    assertEquals(new ServiceException(MessageKeys.CSV_PARSER_EMPTY_PROFICIENCY_SET).getMessage(),
        exceptions.get(0).getMessage());
  }

  @Test
  @DisplayName("see if check succeeds if a csv record has a valid proficiency set")
  void checkProficiencySetSuccess() throws FileNotFoundException, IOException {
    when(this.mockProficiencySetRepository.findByName(anyString(), anyBoolean()).isPresent()).thenReturn(true);
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,proficiencySet\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,Proficiency Set",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertTrue(exceptions.isEmpty());
  }

  @Test
  @DisplayName("see if check succeeds if a csv record does not have a proficiency set")
  void checkWithoutProficiencySetSucceeds() throws FileNotFoundException, IOException {
    when(this.mockProficiencySetRepository.findByName(anyString(), anyBoolean()).isPresent()).thenReturn(false);
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertTrue(exceptions.isEmpty());
  }

  @Test
  @DisplayName("see if check fails if a csv record has a non existing proficiency set")
  void checkNonExistingProficiencySetFails() throws FileNotFoundException, IOException {
    when(this.mockProficiencySetRepository.findByName(anyString(), anyBoolean()).isPresent()).thenReturn(false);
    final InputStream csvStream = IOUtils.toInputStream(
        "conceptType,conceptUri,skillType,preferredLabel,altLabels,description,proficiencySet\nKnowledgeSkillCompetence,uri,skill/competence,a,b,c,Proficiency Set",
        Charset.defaultCharset());

    this.csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());

    List<ServiceException> exceptions = this.cut.checkRecord(this.csvParser.getRecords().get(0));

    assertEquals(1, exceptions.size());
  }
}
