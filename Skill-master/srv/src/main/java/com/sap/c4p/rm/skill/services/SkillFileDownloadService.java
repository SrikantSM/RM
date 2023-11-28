package com.sap.c4p.rm.skill.services;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.google.common.base.Strings;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.esco.EscoCsvColumn;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.LifecycleStatusCode;

import com.sap.resourcemanagement.skill.SkillsDownload;

/**
 * Class to define functionality handling skill file downloads
 */
@Service
public class SkillFileDownloadService {

  private static final String TEXT_CSV = "text/csv";
  private static final String CONCEPT_TYPE = "KnowledgeSkillCompetence";
  private static final String SKILL_TYPE = "skill/competence";

  private static final int BATCH_SIZE = 10000;

  private final SkillRepository skillRepo;
  private final LanguageRepository languageRepo;

  @Autowired
  public SkillFileDownloadService(SkillRepository skillRepo, LanguageRepository languageRepo) {
    this.skillRepo = skillRepo;
    this.languageRepo = languageRepo;
  }

  public ResponseEntity<StreamingResponseBody> handleDownload(final String language) {
    HttpHeaders responseHeaders = new HttpHeaders();
    if (this.languageRepo.findExistingActiveLanguageCodes(language).isEmpty()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.DOWNLOAD_LANGUAGE_MUST_EXIST, language);
    }
    long printedRecordsCount = this.skillRepo.countWithLanguage(language);
    if (printedRecordsCount == 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.LANGUAGE_NOT_AVAILABLE, language);
    }
    long totalRecordsCount = this.skillRepo.count();
    responseHeaders.set("Skills-Downloaded-Counter", String.valueOf(printedRecordsCount));
    responseHeaders.set("Skills-Not-Downloaded-Counter", String.valueOf(totalRecordsCount - printedRecordsCount));
    responseHeaders.add(HttpHeaders.CONTENT_TYPE, TEXT_CSV);
    return ResponseEntity.ok().headers(responseHeaders)
        .body(responseOutputStream -> this.processAsyncDownload(language, responseOutputStream));
  }

  void processAsyncDownload(final String language, OutputStream responseOutputStream) throws IOException {
    int offset = 0;
    List<SkillsDownload> skills;

    CSVPrinter printer = CSVFormat.DEFAULT
        .withHeader(EscoCsvColumn.CONCEPT_TYPE.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
            EscoCsvColumn.SKILL_UUID.getName(), EscoCsvColumn.SKILL_TYPE.getName(),
            EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.ALTERNATIVE_LABELS.getName(),
            EscoCsvColumn.DESCRIPTION.getName(), EscoCsvColumn.USAGE.getName(), EscoCsvColumn.CATALOGS.getName(),
            EscoCsvColumn.PROFICIENCY_SET.getName(), EscoCsvColumn.PROFICIENCY_LEVEL_UUID.getName(),
            EscoCsvColumn.PROFICIENCY_LEVEL.getName(), EscoCsvColumn.PROFICIENCY_LEVEL_NAME.getName())
        .print(new OutputStreamWriter(responseOutputStream));

    while (!(skills = this.skillRepo.findActiveEntitiesForDownload(language, BATCH_SIZE, offset)).isEmpty()) {
      this.printCsvRecords(skills, printer);
      offset += BATCH_SIZE;
    }
    printer.flush(); // Spring only flushes (and closes) the outputStream itself, not the
    // outputStreamWriter
    // which internally caches the byte array.
  }

  private void printCsvRecords(final List<SkillsDownload> skills, final CSVPrinter printer) throws IOException {
    for (SkillsDownload skill : skills) {
      printer.printRecord(CONCEPT_TYPE, Strings.nullToEmpty(skill.getConceptUri()), skill.getSkillUUID(), SKILL_TYPE,
          skill.getPreferredLabel(), skill.getAltLabels(), skill.getDescription(),
          skill.getUsage().equals("0") ? LifecycleStatusCode.UNRESTRICTED.getDescription()
              : LifecycleStatusCode.RESTRICTED.getDescription(),
          skill.getCatalogs(), Strings.nullToEmpty(skill.getProficiencySet()),
          Strings.nullToEmpty(skill.getProficiencyLevelUUID()), Strings.nullToEmpty(skill.getProficiencyLevel()),
          Strings.nullToEmpty(skill.getProficiencyLevelName()));
    }
  }
}
