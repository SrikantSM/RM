package com.sap.c4p.rm.skill.services.skillimport.esco;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.Struct;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.skill.config.AsyncConfig;
import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.exceptions.UnexpectedErrorServiceException;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.AlternativeLabelRepository;
import com.sap.c4p.rm.skill.repositories.CatalogRepository;
import com.sap.c4p.rm.skill.repositories.Catalogs2SkillsRepository;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.repositories.SkillTextRepository;
import com.sap.c4p.rm.skill.services.AuditLogService;
import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;
import com.sap.c4p.rm.skill.services.skillimport.CsvSkillImporter;
import com.sap.c4p.rm.skill.services.skillimport.UploadJobService;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import catalogservice.Catalogs;
import catalogservice.Catalogs2Skills;
import skillservice.AlternativeLabels;
import skillservice.Skills;
import skillservice.SkillsTexts;

@Service
class EscoCsvSkillImporterImpl implements CsvSkillImporter {

  private static final Logger LOGGER = LoggerFactory.getLogger(EscoCsvSkillImporterImpl.class);
  private static final Marker MARKER = LoggingMarker.SKILL_IMPORTER.getMarker();

  private static final String AUDITLOG_OBJECTKEY = "filename";
  private static final String AUDITLOG_ATTRIBUTEKEY = "result";
  private static final String AUDITLOG_TYPE = "skill file upload";
  private static final String AUDITLOG_MESSAGE_FAILED = "Skill CSV file upload failed";
  private static final String AUDITLOG_MESSAGE_WARNINGS = "Skill CSV file upload finished with warnings (%s created, %s updated, %s failed)";
  private static final String AUDITLOG_MESSAGE_SUCCEEDED = "Skill CSV file upload succeeded (%s created, %s updated)";

  private final CdsRuntime cdsRuntime;
  private final EscoCsvConsistencyCheck escoCsvConsistencyCheck;
  private final EscoParser escoParser;
  private final AuditLogService auditLogService;
  private final AsyncConfig asyncConfig;
  private final AlternativeLabelRepository alternativeLabelRepository;
  private final CatalogRepository catalogRepository;
  private final Catalogs2SkillsRepository catalogs2SkillsRepository;
  private final SkillRepository skillRepository;
  private final SkillTextRepository skillTextRepository;
  private final LanguageRepository languageRepository;
  private final ApplicationContext appContext;

  @Autowired
  public EscoCsvSkillImporterImpl(final CdsRuntime cdsRuntime, final EscoCsvConsistencyCheck escoCsvConsistencyCheck,
      final EscoParser escoParser, final AuditLogService auditLogService, final AsyncConfig asyncConfig,
      final AlternativeLabelRepository alternativeLabelRepository, final CatalogRepository catalogRepository,
      final Catalogs2SkillsRepository catalogs2SkillsRepository, final SkillRepository skillRepository,
      final SkillTextRepository skillTextRepository, final LanguageRepository languageRepository,
      final ApplicationContext appContext) {
    this.cdsRuntime = cdsRuntime;
    this.escoCsvConsistencyCheck = escoCsvConsistencyCheck;
    this.escoParser = escoParser;
    this.auditLogService = auditLogService;
    this.asyncConfig = asyncConfig;
    this.alternativeLabelRepository = alternativeLabelRepository;
    this.catalogRepository = catalogRepository;
    this.catalogs2SkillsRepository = catalogs2SkillsRepository;
    this.skillRepository = skillRepository;
    this.skillTextRepository = skillTextRepository;
    this.languageRepository = languageRepository;
    this.appContext = appContext;
  }

  @Override
  public void triggerAsyncImport(final MultipartFile file, final String language) {
    RequestContextRunner runner = this.cdsRuntime.requestContext();

    runner.run(threadContext -> {
      final UploadJobService uploadJobService = this.createUploadJobService();

      if (this.languageRepository.findExistingActiveLanguageCodes(language).isEmpty()) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.UPLOAD_LANGUAGE_MUST_EXIST, language);
      }
      if (!uploadJobService.acquireLock()) {
        throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.ANOTHER_UPLOAD_JOB_IS_RUNNING);
      }

      LOGGER.info(MARKER, "Starting async upload");
      try (InputStream inputStream = file.getInputStream()) {
        final String csvString = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        CompletableFuture
            .runAsync(() -> this.processStringImport(uploadJobService, csvString, language),
                this.asyncConfig.getAsyncExecutor(runner))
            .whenComplete((result, error) -> this.finalizeImport(file, uploadJobService, error));
      } catch (Exception e) {
        this.finalizeImport(file, uploadJobService, e);
      }
    });
  }

  UploadJobService createUploadJobService() {
    // get a fresh instance to avoid concurrency problems as this class holds state
    return this.appContext.getBean(UploadJobService.class);
  }

  void finalizeImport(final MultipartFile file, final UploadJobService uploadJobService, final Throwable error) {
    LOGGER.info(MARKER, "Finalizing async upload");

    if (error != null) {
      LOGGER.error(MARKER, "Unexpected upload error occurred", error);
      uploadJobService.finishWithGeneralError(new UnexpectedErrorServiceException());
    }

    String auditLogMessage;

    switch (uploadJobService.getState()) {
    case ERROR:
      auditLogMessage = AUDITLOG_MESSAGE_FAILED;
      break;
    case WARNING:
      auditLogMessage = String.format(AUDITLOG_MESSAGE_WARNINGS, uploadJobService.getCreatedSkillsCount(),
          uploadJobService.getUpdatedSkillsCount(), uploadJobService.getFailedSkillsCount());
      break;
    default:
      auditLogMessage = String.format(AUDITLOG_MESSAGE_SUCCEEDED, uploadJobService.getCreatedSkillsCount(),
          uploadJobService.getUpdatedSkillsCount());
    }

    LOGGER.info(MARKER, auditLogMessage);
    this.auditLogService.logConfigurationChange(AUDITLOG_OBJECTKEY, file.getOriginalFilename(), AUDITLOG_ATTRIBUTEKEY,
        null, auditLogMessage, AUDITLOG_TYPE);
  }

  void processStringImport(final UploadJobService uploadJobService, final String csvString, final String language) {
    try {
      final CSVParser csvParser = CSVParser.parse(csvString,
          CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build());

      Optional<ServiceException> headerConsistencyError = this.escoCsvConsistencyCheck
          .checkHeader(csvParser.getHeaderMap().keySet());
      if (headerConsistencyError.isPresent()) {
        LOGGER.info(MARKER, "CSV consistency check failed");
        uploadJobService.finishWithGeneralError(headerConsistencyError.get());
        return;
      }

      List<CSVRecord> csvRecords = csvParser.getRecords();
      uploadJobService.setTotalSkillCount(csvRecords.size());
      for (CSVRecord csvRecord : csvRecords) {
        this.parseCsvRecord(uploadJobService, csvRecord, language)
            .ifPresent(r -> this.runWithClearedMessages(() -> this.upsertSkill(uploadJobService, r)));
      }
      uploadJobService.finish();
    } catch (IllegalArgumentException | IOException | ServiceException e) {
      if (e.getMessage().contains("A header name is missing in")) {
        LOGGER.info(MARKER, "CSV stream processing failed due to a missing header", e);
        uploadJobService.finishWithGeneralError(new ServiceException(MessageKeys.CSV_HEADERS_EMPTY));

      } else if (e.getMessage().contains("EOF reached before encapsulated token finished")) {
        LOGGER.info(MARKER, "CSV stream processing failed due to a premature EOF", e);
        uploadJobService.finishWithGeneralError(new ServiceException(MessageKeys.CSV_ENDS_PREMATURELY));

      } else {
        LOGGER.error(MARKER, "CSV stream processing failed with an unexpected exception", e);
        uploadJobService.finishWithGeneralError(new UnexpectedErrorServiceException());
      }
    }
  }

  /**
   * Execute a runnable within a new cds request context with separate messages.
   */
  void runWithClearedMessages(Runnable runnable) {
    this.cdsRuntime.requestContext().clearMessages().run(requestContext -> {
      runnable.run();
    });
  }

  /**
   * Updates or inserts a draft {@link Skills} and tries to save it
   *
   * @param parserResult {@link EscoParserResult} containing the {@link Skills} to
   *                     be upserted and saved
   */

  void upsertSkill(final UploadJobService uploadJobService, final EscoParserResult parserResult) {
    Skills processedSkill = null;
    String errorMessage = null;
    boolean isUpdate;
    try {
      processedSkill = this.extendSkillWithPersistedData(parserResult.getSkill());
      isUpdate = processedSkill.getId() != null;

      if (processedSkill.getProficiencySetId() == null) {
        processedSkill.setProficiencySetId(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID);
      }

      if (isUpdate) {
        errorMessage = "Updating draft skill failed";
        this.updateExistingSkill(processedSkill, parserResult.getSkill());
      } else {
        errorMessage = "Creating draft skill failed";
        processedSkill = this.skillRepository.createDraft(processedSkill);
      }

      errorMessage = "Saving draft skill failed";
      this.skillRepository.saveDraft(processedSkill);

      this.upsertCatalogs(uploadJobService, processedSkill, parserResult);

      this.updateLifecycleStatus(processedSkill);

      if (isUpdate) {
        uploadJobService.incrementUpdatedSkillsCount();
      } else {
        uploadJobService.incrementCreatedSkillsCount();
      }
    } catch (final ServiceException e) {
      uploadJobService.addSaveErrorForSkill(parserResult.getAffectedEntity(), e);
      EscoCsvSkillImporterImpl.LOGGER.info(MARKER, errorMessage, e);
      if (e.getErrorStatus().getHttpStatus() >= 500) {
        throw new UnexpectedErrorServiceException();
      }
    }
  }

  /**
   * Tries to fetch persisted data corresponding to a given {@link Skills}. If
   * there is a draft skill of the current user, it returns it. Otherwise it looks
   * for an active skill and puts it into draft mode. As a last resort, the given
   * parameter is returned
   *
   * @param uploadedSkill {@link Skills} to select the persisted data by; fallback
   *                      if no data is found
   * @return {@link Skills} containing draft data, previously active (and now
   *         draft) data of the given {@link Skills}, or the given {@link Skills}
   *         itself
   */
  Skills extendSkillWithPersistedData(final Skills uploadedSkill) {
    final Skills persistedSkill = this.skillRepository.findByExternalId(uploadedSkill.getExternalID(), Boolean.FALSE)
        .orElseGet(() -> this.skillRepository.findByExternalId(uploadedSkill.getExternalID(), Boolean.TRUE)
            .orElse(uploadedSkill));

    if (Boolean.TRUE.equals(persistedSkill.getIsActiveEntity())) {
      return this.skillRepository.editDraftByExternalId(uploadedSkill.getExternalID());
    }

    return persistedSkill;
  }

  /**
   * Updates a skill that already exists on the database with data of an updated
   * {@link Skills} instance
   * <p>
   * This method is executed in one atomic ChangeSetContext (transaction)
   *
   * @param existingSkill {@link Skills}
   * @param updatedSkill  {@link Skills}
   */
  void updateExistingSkill(Skills existingSkill, Skills updatedSkill) {
    this.cdsRuntime.changeSetContext().run(context -> {
      existingSkill.setLifecycleStatusCode(updatedSkill.getLifecycleStatusCode());
      String proficiencySetId = updatedSkill.getProficiencySetId();
      if (proficiencySetId == null) {
        proficiencySetId = existingSkill.getProficiencySetId() != null ? existingSkill.getProficiencySetId()
            : DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID;
      }

      // Deep updates with draft are not supported, so we create a shallow copy
      Skills skillPatchData = Skills.create();
      skillPatchData.setId(existingSkill.getId());
      skillPatchData.setIsActiveEntity(existingSkill.getIsActiveEntity());
      skillPatchData.setLifecycleStatusCode(existingSkill.getLifecycleStatusCode());
      skillPatchData.setProficiencySetId(proficiencySetId);
      this.skillRepository.updateDraft(skillPatchData);

      for (final SkillsTexts uploadedText : updatedSkill.getTexts()) {
        this.alternativeLabelRepository.deleteDraftsOfSkillAndLocale(existingSkill, uploadedText.getLocale());
        this.upsertSkillsText(existingSkill, uploadedText);
      }

      this.insertAlternativeLabels(existingSkill, updatedSkill.getAlternativeLabels());
    });
  }

  /**
   * Upserts a {@link SkillsTexts} for a given {@link Skills}. If a text in the
   * text locale already exists, it is overridden; otherwise, a new text is
   * inserted
   *
   * @param skill {@link Skills}
   * @param text  {@link SkillsTexts}
   */
  void upsertSkillsText(final Skills skill, final SkillsTexts text) {
    final Optional<SkillsTexts> existingText = skill.getTexts().stream()
        .filter(t -> t.getLocale().equals(text.getLocale())).findAny();

    if (existingText.isPresent()) {
      existingText.get().setName(text.getName());
      existingText.get().setDescription(text.getDescription());

      this.skillTextRepository.updateDraft(existingText.get());
    } else {
      text.setId(skill.getId());
      this.skillTextRepository.createDraft(text);
    }
  }

  /**
   * Inserts {@link AlternativeLabels} for a given {@link Skills}
   *
   * @param skill             {@link Skills}
   * @param alternativeLabels {@link AlternativeLabels}
   */
  void insertAlternativeLabels(final Skills skill, final List<AlternativeLabels> alternativeLabels) {
    alternativeLabels.forEach(l -> l.setSkillId(skill.getId()));
    this.alternativeLabelRepository.createDrafts(alternativeLabels);
  }

  /**
   * Upserts a {@link Catalogs} for a given {@link Skills}. For each of the given
   * catalog names, the corresponding catalog is queried and, if existing,
   * assigned
   * <p>
   * If the catalog names are null, i.e. the column is not given, the catalog
   * associations are not changed
   *
   * @param skill        {@link Skills}
   * @param parserResult {@link EscoParserResult}
   */
  void upsertCatalogs(final UploadJobService uploadJobService, final Skills skill,
      final EscoParserResult parserResult) {
    if (parserResult.getCatalogNames() == null) {
      return;
    }

    this.catalogs2SkillsRepository.deleteBySkill(Struct.access(skill).as(catalogservice.Skills.class));

    for (final String catalogName : parserResult.getCatalogNames()) {
      Optional<Catalogs> catalog = this.catalogRepository.findActiveEntityByName(catalogName);

      if (catalog.isPresent()) {
        Catalogs2Skills association = Catalogs2Skills.create();
        association.setSkillId(skill.getId());
        association.setCatalogId(catalog.get().getId());

        this.catalogs2SkillsRepository.createActiveEntity(association);
      } else {
        uploadJobService.incrementMissingCatalogCount(catalogName);
      }
    }
  }

  void updateLifecycleStatus(final Skills skill) {
    Optional<Skills> activeSkill = this.skillRepository.findById(skill.getId(), true);

    if (activeSkill.isPresent()) {
      activeSkill.get().setLifecycleStatusCode(skill.getLifecycleStatusCode());
      this.skillRepository.updateActiveEntity(activeSkill.get());
    }
  }

  Optional<EscoParserResult> parseCsvRecord(final UploadJobService uploadJobService, final CSVRecord csvRecord,
      String language) {
    final List<ServiceException> parsingExceptions = this.escoCsvConsistencyCheck.checkRecord(csvRecord);

    if (!parsingExceptions.isEmpty()) {
      uploadJobService.addParsingErrorsForSkill(parsingExceptions);
      return Optional.empty();
    }

    return Optional.of(this.escoParser.parseSkill(csvRecord, language));
  }
}
