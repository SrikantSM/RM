package com.sap.c4p.rm.skill.services.skillimport;

import java.time.Clock;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.UploadJobRepository;
import com.sap.c4p.rm.skill.utils.UploadErrorTypes;
import com.sap.c4p.rm.skill.utils.UploadJobStates;

import fileuploadservice.UploadErrors;
import fileuploadservice.UploadJob;

// Scope prototype to make sure that concurrent uploads receive different class instances
@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class UploadJobService {

  private static final Logger LOGGER = LoggerFactory.getLogger(UploadJobService.class);
  private static final Marker MARKER = LoggingMarker.UPLOAD_JOB.getMarker();
  private static final long UPLOAD_TIMEOUT_IN_SECONDS = 600;

  private final UploadJobRepository uploadJobRepository;
  private final Messages messages;
  private final Locale locale;
  private final Clock clock;

  UploadJob uploadJob = UploadJob.create();
  Map<String, Integer> parsingErrorCountMap = new HashMap<>();
  Map<String, Integer> missingCatalogCountMap = new HashMap<>();
  List<UploadErrors> uploadErrors = new ArrayList<>();
  Map<String, UploadErrors> parsingErrors = new HashMap<>();
  Map<String, UploadErrors> missingCatalogsUploadErrors = new HashMap<>();

  public UploadJobService(final UploadJobRepository uploadJobRepository, final CdsRuntime cdsRuntime,
      final Messages messages, final Clock clock) {
    this.uploadJobRepository = uploadJobRepository;
    this.messages = messages;
    this.clock = clock;

    Locale requestLocale = cdsRuntime.getProvidedParameterInfo().getLocale();
    if (requestLocale == null) {
      this.locale = Locale.ENGLISH; // Fallback to English (which is UI5 fallback as well).
      // If this.locale is null, CAP will try to check the getProvidedParameterInfo()
      // again in async code and fail
    } else {
      this.locale = requestLocale;
    }

    this.uploadJob.setCreatedSkillsCount(0);
    this.uploadJob.setFailedSkillsCount(0);
    this.uploadJob.setUpdatedSkillsCount(0);
    this.uploadJob.setUploadErrors(new ArrayList<>());
  }

  @Transactional(isolation = Isolation.SERIALIZABLE)
  public boolean acquireLock() {
    Boolean isCurrentlyRunning = this.uploadJobRepository.findActiveEntity()
        .map(job -> UploadJobStates.RUNNING.getValue().equals(job.getState())).orElse(Boolean.FALSE);

    if (Boolean.TRUE.equals(isCurrentlyRunning)) {
      return false;
    }

    this.uploadJob.setState(UploadJobStates.RUNNING.getValue());

    this.uploadJob = this.uploadJobRepository.setActiveEntity(this.uploadJob);
    LOGGER.debug(MARKER, "UploadJob initialized");

    return true;
  }

  public void setTotalSkillCount(final int skillCount) {
    this.uploadJob.setSkillsTotalCount(skillCount);
    this.uploadJob.setUnprocessedSkillsCount(skillCount);
    this.updateDatabase();
  }

  public void incrementCreatedSkillsCount() {
    this.uploadJob.setCreatedSkillsCount(this.uploadJob.getCreatedSkillsCount() + 1);
    this.uploadJob.setUnprocessedSkillsCount(this.uploadJob.getUnprocessedSkillsCount() - 1);
    this.updateDatabase();
  }

  public void incrementUpdatedSkillsCount() {
    this.uploadJob.setUpdatedSkillsCount(this.uploadJob.getUpdatedSkillsCount() + 1);
    this.uploadJob.setUnprocessedSkillsCount(this.uploadJob.getUnprocessedSkillsCount() - 1);
    this.updateDatabase();
  }

  public void addSaveErrorForSkill(final String affectedEntity, final ServiceException exception) {
    this.uploadJob.setFailedSkillsCount(this.uploadJob.getFailedSkillsCount() + 1);
    this.uploadJob.setUnprocessedSkillsCount(this.uploadJob.getUnprocessedSkillsCount() - 1);

    // Read from Messages API
    this.messages.stream().forEach(
        message -> this.uploadErrors.add(this.createError(null, affectedEntity, message, UploadErrorTypes.SAVE)));

    this.uploadErrors.add(this.createError(null, affectedEntity, exception, UploadErrorTypes.SAVE));

    this.updateDatabase();
  }

  public void addParsingErrorsForSkill(List<ServiceException> parsingExceptions) {
    this.uploadJob.setFailedSkillsCount(this.uploadJob.getFailedSkillsCount() + 1);
    this.uploadJob.setUnprocessedSkillsCount(this.uploadJob.getUnprocessedSkillsCount() - 1);
    parsingExceptions.forEach(this::incrementParsingErrorCount);
  }

  void incrementParsingErrorCount(ServiceException parsingException) {
    final String message = parsingException.getLocalizedMessage();

    Integer parsingErrorCount = this.parsingErrorCountMap.getOrDefault(message, 0) + 1;
    this.parsingErrorCountMap.put(message, parsingErrorCount);

    UploadErrors uploadError = this.createError(parsingErrorCount, null, parsingException, UploadErrorTypes.PARSING);
    this.parsingErrors.put(message, uploadError);

    this.updateDatabase();
  }

  public void incrementMissingCatalogCount(String catalogName) {
    Integer missingCatalogCount = this.missingCatalogCountMap.getOrDefault(catalogName, 0) + 1;
    this.missingCatalogCountMap.put(catalogName, missingCatalogCount);

    UploadErrors uploadError = this.createError(missingCatalogCount, null,
        new ServiceException(MessageKeys.SKILLS_COULD_NOT_BE_ADDED_TO_CATALOG, catalogName),
        UploadErrorTypes.MISSING_CATALOG);
    this.missingCatalogsUploadErrors.put(catalogName, uploadError);

    this.updateDatabase();
  }

  public void finish() {
    this.uploadJob.setState(this.getState().getValue());
    this.updateDatabase();
  }

  public void finishWithGeneralError(final ServiceException exception) {
    // general error --> only one error --> clear everything else
    this.uploadErrors.clear();
    this.parsingErrors.clear();
    this.parsingErrorCountMap.clear();
    this.missingCatalogsUploadErrors.clear();
    this.missingCatalogCountMap.clear();

    this.uploadErrors.add(this.createError(null, null, exception, UploadErrorTypes.GENERAL));
    this.finish();
  }

  public boolean isStuck() {
    Optional<UploadJob> uploadJobOptional = this.uploadJobRepository.findActiveEntity();

    boolean isRunning = uploadJobOptional.map(job -> UploadJobStates.RUNNING.getValue().equals(job.getState()))
        .orElse(Boolean.FALSE);
    long timeSinceLastChange = uploadJobOptional
        .map(job -> ChronoUnit.SECONDS.between(job.getModifiedAt(), clock.instant())).orElse(0L);
    return isRunning && timeSinceLastChange > UPLOAD_TIMEOUT_IN_SECONDS;
  }

  public void interrupt() {
    this.uploadJobRepository.findActiveEntity().ifPresent(u -> {
      u.setState(UploadJobStates.INTERRUPTED.getValue());
      this.uploadJobRepository.updateActiveEntity(u);
    });
  }

  public int getCreatedSkillsCount() {
    return this.uploadJob.getCreatedSkillsCount();
  }

  public int getUpdatedSkillsCount() {
    return this.uploadJob.getUpdatedSkillsCount();
  }

  public int getFailedSkillsCount() {
    return this.uploadJob.getFailedSkillsCount();
  }

  public UploadJobStates getState() {
    if (!this.hasErrors()) {
      return UploadJobStates.SUCCESS;
    }

    for (UploadErrors error : this.uploadErrors) {
      if (error.getCount() == null && error.getAffectedEntity() == null) {
        return UploadJobStates.ERROR;
      }
    }

    return UploadJobStates.WARNING;
  }

  boolean hasErrors() {
    return !this.uploadErrors.isEmpty() || !this.parsingErrors.isEmpty() || !this.missingCatalogsUploadErrors.isEmpty();
  }

  UploadErrors createError(final Integer count, final String affectedEntity, final ServiceException exception,
      final UploadErrorTypes type) {
    UploadErrors uploadError = UploadErrors.create();
    uploadError.setType(type.getValue());
    uploadError.setErrorMessage(exception.getLocalizedMessage(this.locale));
    uploadError.setCount(count);
    uploadError.setAffectedEntity(affectedEntity);
    return uploadError;
  }

  UploadErrors createError(final Integer count, final String affectedEntity, final Message message,
      final UploadErrorTypes type) {
    UploadErrors uploadError = UploadErrors.create();
    uploadError.setType(type.getValue());
    uploadError.setErrorMessage(message.getMessage());
    uploadError.setCount(count);
    uploadError.setAffectedEntity(affectedEntity);
    return uploadError;
  }

  void updateDatabase() {
    this.uploadJob.getUploadErrors().clear();
    this.uploadJob.getUploadErrors().addAll(this.uploadErrors);
    this.uploadJob.getUploadErrors().addAll(this.parsingErrors.values());
    this.uploadJob.getUploadErrors().addAll(this.missingCatalogsUploadErrors.values());
    this.uploadJobRepository.updateActiveEntity(this.uploadJob);
    LOGGER.debug(MARKER, "UploadJob updated");
  }
}
