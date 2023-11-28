package com.sap.c4p.rm.skill.services.skillimport;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.UploadJobRepository;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;
import com.sap.c4p.rm.skill.utils.UploadErrorTypes;
import com.sap.c4p.rm.skill.utils.UploadJobStates;

import fileuploadservice.UploadErrors;
import fileuploadservice.UploadJob;

class UploadJobServiceTest {

  private static final String SOME_CATALOG_NAME = "CATALOG_NAME";
  private static final long UPLOAD_TIMEOUT_IN_SECONDS = 600;

  /**
   * object under test
   */
  private UploadJobService cut;

  private UploadJobRepository mockUploadJobRepository;
  private Messages messages;
  private CdsRuntime mockCdsRuntime;
  private Clock mockClock;

  @BeforeEach
  void beforeEach() {
    this.mockUploadJobRepository = mock(UploadJobRepository.class);
    mockCdsRuntime = mock(CdsRuntime.class, RETURNS_DEEP_STUBS);
    this.mockClock = mock(Clock.class);
    when(mockCdsRuntime.getProvidedParameterInfo().getLocale()).thenReturn(Locale.getDefault());
    when(this.mockClock.instant()).thenReturn(ZonedDateTime.of(2020, 1, 1, 1, 0, 0, 0, ZoneOffset.UTC).toInstant());

    this.messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    this.cut = spy(new UploadJobService(this.mockUploadJobRepository, mockCdsRuntime, this.messages, this.mockClock));
  }

  @Test
  @DisplayName("check if UploadJobService constructor sets up internals correctly, including fetching the Locale from request")
  void constructorSetup() {
    verify(mockCdsRuntime.getProvidedParameterInfo()).getLocale();

    assertEquals(0, this.cut.uploadJob.getCreatedSkillsCount());
    assertEquals(0, this.cut.uploadJob.getFailedSkillsCount());
    assertEquals(0, this.cut.uploadJob.getUpdatedSkillsCount());

    assertTrue(this.cut.missingCatalogCountMap.isEmpty());
    assertTrue(this.cut.uploadErrors.isEmpty());
    assertTrue(this.cut.missingCatalogsUploadErrors.isEmpty());
  }

  @Test
  @DisplayName("check if UploadJobService constructor sets up fallback locale correctly")
  void fallbackLocale() {
    when(mockCdsRuntime.getProvidedParameterInfo().getLocale()).thenReturn(null);
    this.cut = spy(new UploadJobService(this.mockUploadJobRepository, mockCdsRuntime, this.messages, this.mockClock));

    // create an error to use the locale
    ServiceException spySE = spy(new ServiceException(MessageKeys.NO_DEFAULT_LANGUAGE));
    this.cut.createError(0, "", spySE, UploadErrorTypes.SAVE);
    verify(spySE).getLocalizedMessage(Locale.ENGLISH);
  }

  @Test
  @DisplayName("check if acquireLock() executes successfully when no other job is running")
  void acquireLockSuccess() {
    UploadJob initializedUploadJob = UploadJob.create();
    when(this.mockUploadJobRepository.setActiveEntity(any())).thenReturn(initializedUploadJob);

    boolean result = this.cut.acquireLock();

    ArgumentCaptor<UploadJob> uploadJobCaptor = ArgumentCaptor.forClass(UploadJob.class);
    verify(this.mockUploadJobRepository, times(1)).setActiveEntity(uploadJobCaptor.capture());

    assertTrue(result);
    assertEquals(0, uploadJobCaptor.getValue().getCreatedSkillsCount());
    assertEquals(0, uploadJobCaptor.getValue().getFailedSkillsCount());
    assertEquals(0, uploadJobCaptor.getValue().getUpdatedSkillsCount());
    assertNotNull(uploadJobCaptor.getValue().getUploadErrors());
    assertEquals(UploadJobStates.RUNNING.getValue(), uploadJobCaptor.getValue().getState());
    assertEquals(initializedUploadJob, this.cut.uploadJob);
  }

  @Test
  @DisplayName("check if acquireLock() executes successfully when another job is running")
  void acquireLockConflict() {
    UploadJob runningUploadJob = UploadJob.create();
    runningUploadJob.setState(UploadJobStates.RUNNING.getValue());
    when(this.mockUploadJobRepository.findActiveEntity()).thenReturn(Optional.of(runningUploadJob));

    boolean result = this.cut.acquireLock();

    verify(this.mockUploadJobRepository, times(0)).setActiveEntity(any());
    assertNotEquals(UploadJobStates.RUNNING.getValue(), this.cut.uploadJob.getState());

    assertFalse(result);
  }

  @Test
  @DisplayName("check if setTotalSkillCount() executes successfully")
  void setTotalSkillCount() {
    doNothing().when(this.cut).updateDatabase();

    int skillCount = 2;

    this.cut.setTotalSkillCount(skillCount);

    verify(this.cut, times(1)).updateDatabase();

    assertEquals(skillCount, this.cut.uploadJob.getSkillsTotalCount());
    assertEquals(skillCount, this.cut.uploadJob.getUnprocessedSkillsCount());
  }

  @Test
  @DisplayName("check if incrementCreatedSkillsCount() executes successfully")
  void incrementCreatedSkillsCount() {
    doNothing().when(this.cut).updateDatabase();

    this.cut.uploadJob = this.createUploadJob();

    this.cut.incrementCreatedSkillsCount();

    verify(this.cut, times(1)).updateDatabase();

    assertEquals(4, this.cut.uploadJob.getSkillsTotalCount());
    assertEquals(2, this.cut.uploadJob.getCreatedSkillsCount());
    assertEquals(1, this.cut.uploadJob.getUpdatedSkillsCount());
    assertEquals(1, this.cut.uploadJob.getFailedSkillsCount());
    assertEquals(0, this.cut.uploadJob.getUnprocessedSkillsCount());
  }

  @Test
  @DisplayName("check if incrementUpdatedSkillsCount() executes successfully")
  void incrementUpdatedSkillsCount() {
    doNothing().when(this.cut).updateDatabase();

    this.cut.uploadJob = this.createUploadJob();

    this.cut.incrementUpdatedSkillsCount();

    verify(this.cut, times(1)).updateDatabase();

    assertEquals(4, this.cut.uploadJob.getSkillsTotalCount());
    assertEquals(1, this.cut.uploadJob.getCreatedSkillsCount());
    assertEquals(2, this.cut.uploadJob.getUpdatedSkillsCount());
    assertEquals(1, this.cut.uploadJob.getFailedSkillsCount());
    assertEquals(0, this.cut.uploadJob.getUnprocessedSkillsCount());
  }

  @Test
  @DisplayName("check if addSaveErrorForSkill() executes successfully")
  void addSaveErrorForSkill() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(ServiceException.class), any());

    String affectedEntity = SkillTestHelper.SKILL_EXTERNAL_ID;
    ServiceException exception = new ServiceException("service-exception");

    this.cut.uploadJob = this.createUploadJob();

    this.cut.addSaveErrorForSkill(affectedEntity, exception);

    verify(this.cut, times(1)).createError(null, affectedEntity, exception, UploadErrorTypes.SAVE);

    assertEquals(4, this.cut.uploadJob.getSkillsTotalCount());
    assertEquals(1, this.cut.uploadJob.getCreatedSkillsCount());
    assertEquals(1, this.cut.uploadJob.getUpdatedSkillsCount());
    assertEquals(2, this.cut.uploadJob.getFailedSkillsCount());
    assertEquals(0, this.cut.uploadJob.getUnprocessedSkillsCount());

    assertEquals(1, this.cut.uploadErrors.size());
    assertEquals(uploadError, this.cut.uploadErrors.get(0));
  }

  @Test
  @DisplayName("check if addSaveErrorForSkill() executes successfully with messaging")
  void addSaveErrorForSkillMessaging() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(Message.class), any());

    String affectedEntity = SkillTestHelper.SKILL_EXTERNAL_ID;
    ServiceException exception = new ServiceException(MessageKeys.DUPLICATE_SKILL_TEXT_LOCALE);
    Message m1 = mock(Message.class);
    Message m2 = mock(Message.class);
    Stream<Message> messages = Stream.of(m1, m2);
    doReturn(messages).when(this.messages).stream();

    this.cut.uploadJob = this.createUploadJob();

    this.cut.addSaveErrorForSkill(affectedEntity, exception);

    verify(this.cut, times(1)).createError(null, affectedEntity, exception, UploadErrorTypes.SAVE);
    verify(this.cut, times(1)).createError(null, affectedEntity, m1, UploadErrorTypes.SAVE);
    verify(this.cut, times(1)).createError(null, affectedEntity, m2, UploadErrorTypes.SAVE);

    assertEquals(4, this.cut.uploadJob.getSkillsTotalCount());
    assertEquals(1, this.cut.uploadJob.getCreatedSkillsCount());
    assertEquals(1, this.cut.uploadJob.getUpdatedSkillsCount());
    assertEquals(2, this.cut.uploadJob.getFailedSkillsCount());
    assertEquals(0, this.cut.uploadJob.getUnprocessedSkillsCount());

    assertEquals(3, this.cut.uploadErrors.size());
    assertEquals(uploadError, this.cut.uploadErrors.get(0));
    assertEquals(uploadError, this.cut.uploadErrors.get(1));
  }

  @Test
  @DisplayName("check if addParsingErrorsForSkill() executes successfully")
  void addParsingErrorsForSkill() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(ServiceException.class), any());

    ServiceException exception1 = new ServiceException("service-exception");
    ServiceException exception2 = new ServiceException("service-exception");
    List<ServiceException> exceptions = Arrays.asList(exception1, exception2);

    this.cut.uploadJob = this.createUploadJob();

    this.cut.addParsingErrorsForSkill(exceptions);

    verify(this.cut, times(1)).incrementParsingErrorCount(exception1);
    verify(this.cut, times(1)).incrementParsingErrorCount(exception2);

    assertEquals(4, this.cut.uploadJob.getSkillsTotalCount());
    assertEquals(1, this.cut.uploadJob.getCreatedSkillsCount());
    assertEquals(1, this.cut.uploadJob.getUpdatedSkillsCount());
    assertEquals(2, this.cut.uploadJob.getFailedSkillsCount());
    assertEquals(0, this.cut.uploadJob.getUnprocessedSkillsCount());

    assertEquals(1, this.cut.parsingErrors.size());
  }

  @Test
  @DisplayName("check if incrementParsingErrorCount() executes successfully if this parsing error has not occurred yet")
  void incrementParsingErrorCountFirstTime() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(ServiceException.class), any());
    doNothing().when(this.cut).updateDatabase();

    ServiceException exception = new ServiceException("service-exception");
    this.cut.incrementParsingErrorCount(exception);

    ArgumentCaptor<ServiceException> argument = ArgumentCaptor.forClass(ServiceException.class);
    verify(this.cut, times(1)).createError(eq(1), eq(null), argument.capture(), eq(UploadErrorTypes.PARSING));

    assertEquals(exception.getMessage(), argument.getValue().getMessage());

    assertEquals(1, this.cut.parsingErrorCountMap.size());
    assertTrue(this.cut.parsingErrorCountMap.containsKey("service-exception"));
    assertEquals(1, this.cut.parsingErrorCountMap.get("service-exception"));

    assertEquals(1, this.cut.parsingErrors.size());
    assertTrue(this.cut.parsingErrors.containsKey("service-exception"));
    assertEquals(uploadError, this.cut.parsingErrors.get("service-exception"));
  }

  @Test
  @DisplayName("check if incrementParsingErrorCount() executes successfully if this parsing error already occurred")
  void incrementParsingErrorCountSecondTime() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(ServiceException.class), any());
    doNothing().when(this.cut).updateDatabase();

    this.cut.parsingErrorCountMap.put("service-exception", 1);
    this.cut.parsingErrors.put("service-exception", UploadErrors.create());

    ServiceException exception = new ServiceException("service-exception");
    this.cut.incrementParsingErrorCount(exception);

    ArgumentCaptor<ServiceException> argument = ArgumentCaptor.forClass(ServiceException.class);
    verify(this.cut, times(1)).createError(eq(2), eq(null), argument.capture(), eq(UploadErrorTypes.PARSING));

    assertEquals(exception.getMessage(), argument.getValue().getMessage());

    assertEquals(1, this.cut.parsingErrorCountMap.size());
    assertTrue(this.cut.parsingErrorCountMap.containsKey("service-exception"));
    assertEquals(2, this.cut.parsingErrorCountMap.get("service-exception"));

    assertEquals(1, this.cut.parsingErrors.size());
    assertTrue(this.cut.parsingErrors.containsKey("service-exception"));
    assertEquals(uploadError, this.cut.parsingErrors.get("service-exception"));
  }

  @Test
  @DisplayName("check if incrementMissingCatalogCount() executes successfully if there is no error for that catalog yet")
  void incrementMissingCatalogCountFirstTime() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(ServiceException.class), any());
    doNothing().when(this.cut).updateDatabase();

    this.cut.incrementMissingCatalogCount(UploadJobServiceTest.SOME_CATALOG_NAME);

    ArgumentCaptor<ServiceException> argument = ArgumentCaptor.forClass(ServiceException.class);
    verify(this.cut, times(1)).createError(eq(1), eq(null), argument.capture(), eq(UploadErrorTypes.MISSING_CATALOG));

    ServiceException expectedException = new ServiceException(MessageKeys.SKILLS_COULD_NOT_BE_ADDED_TO_CATALOG,
        UploadJobServiceTest.SOME_CATALOG_NAME);
    assertEquals(expectedException.getMessage(), argument.getValue().getMessage());

    assertEquals(1, this.cut.missingCatalogCountMap.size());
    assertTrue(this.cut.missingCatalogCountMap.containsKey(UploadJobServiceTest.SOME_CATALOG_NAME));
    assertEquals(1, this.cut.missingCatalogCountMap.get(UploadJobServiceTest.SOME_CATALOG_NAME));

    assertEquals(1, this.cut.missingCatalogsUploadErrors.size());
    assertTrue(this.cut.missingCatalogsUploadErrors.containsKey(UploadJobServiceTest.SOME_CATALOG_NAME));
    assertEquals(uploadError, this.cut.missingCatalogsUploadErrors.get(UploadJobServiceTest.SOME_CATALOG_NAME));
  }

  @Test
  @DisplayName("check if incrementMissingCatalogCount() executes successfully if there is already an error for that catalog")
  void incrementMissingCatalogCountSecondTime() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(ServiceException.class), any());
    doNothing().when(this.cut).updateDatabase();

    this.cut.missingCatalogCountMap.put(UploadJobServiceTest.SOME_CATALOG_NAME, 1);
    this.cut.missingCatalogsUploadErrors.put(UploadJobServiceTest.SOME_CATALOG_NAME, UploadErrors.create());

    this.cut.incrementMissingCatalogCount(UploadJobServiceTest.SOME_CATALOG_NAME);

    ArgumentCaptor<ServiceException> argument = ArgumentCaptor.forClass(ServiceException.class);
    verify(this.cut, times(1)).createError(eq(2), eq(null), argument.capture(), eq(UploadErrorTypes.MISSING_CATALOG));

    ServiceException expectedException = new ServiceException(MessageKeys.SKILLS_COULD_NOT_BE_ADDED_TO_CATALOG,
        UploadJobServiceTest.SOME_CATALOG_NAME);
    assertEquals(expectedException.getMessage(), argument.getValue().getMessage());

    assertEquals(1, this.cut.missingCatalogCountMap.size());
    assertTrue(this.cut.missingCatalogCountMap.containsKey(UploadJobServiceTest.SOME_CATALOG_NAME));
    assertEquals(2, this.cut.missingCatalogCountMap.get(UploadJobServiceTest.SOME_CATALOG_NAME));

    assertEquals(1, this.cut.missingCatalogsUploadErrors.size());
    assertTrue(this.cut.missingCatalogsUploadErrors.containsKey(UploadJobServiceTest.SOME_CATALOG_NAME));
    assertEquals(uploadError, this.cut.missingCatalogsUploadErrors.get(UploadJobServiceTest.SOME_CATALOG_NAME));
  }

  @Test
  @DisplayName("check if finish() executes successfully")
  void finish() {
    doNothing().when(this.cut).updateDatabase();
    doReturn(UploadJobStates.SUCCESS).when(this.cut).getState();

    this.cut.finish();

    verify(this.cut, times(1)).updateDatabase();

    assertEquals(UploadJobStates.SUCCESS.getValue(), this.cut.uploadJob.getState());
  }

  @Test
  @DisplayName("check if finishWithGeneralError() executes successfully")
  void finishWithGeneralError() {
    UploadErrors uploadError = UploadErrors.create();
    doReturn(uploadError).when(this.cut).createError(any(), any(), any(ServiceException.class), any());

    doNothing().when(this.cut).finish();
    doNothing().when(this.cut).updateDatabase();

    ServiceException exception = new ServiceException("service-exception");

    this.cut.finishWithGeneralError(exception);

    verify(this.cut, times(1)).createError(null, null, exception, UploadErrorTypes.GENERAL);
    verify(this.cut, times(1)).finish();

    assertEquals(1, this.cut.uploadErrors.size());
    assertEquals(uploadError, this.cut.uploadErrors.get(0));
  }

  @Test
  @DisplayName("check if getCreatedSkillsCount() returns the correct value")
  void getCreatedSkillsCount() {
    this.cut.uploadJob.setCreatedSkillsCount(1);
    int result = this.cut.getCreatedSkillsCount();

    assertEquals(1, result);
  }

  @Test
  @DisplayName("check if getUpdatedSkillsCount() returns the correct value")
  void getUpdatedSkillsCount() {
    this.cut.uploadJob.setUpdatedSkillsCount(1);
    int result = this.cut.getUpdatedSkillsCount();

    assertEquals(1, result);
  }

  @Test
  @DisplayName("check if getFailedSkillsCount() returns the correct value")
  void getFailedSkillsCount() {
    this.cut.uploadJob.setFailedSkillsCount(1);
    int result = this.cut.getFailedSkillsCount();

    assertEquals(1, result);
  }

  @Test
  @DisplayName("check if getState() executes successfully when there are not errors")
  void getStateNoErrors() {
    doReturn(false).when(this.cut).hasErrors();

    UploadJobStates result = this.cut.getState();

    assertEquals(UploadJobStates.SUCCESS, result);
  }

  @Test
  @DisplayName("check if getState() executes successfully when there is a general error")
  void getStateGeneralError() {
    doReturn(true).when(this.cut).hasErrors();

    this.cut.uploadErrors = Collections.singletonList(
        this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.GENERAL));

    UploadJobStates result = this.cut.getState();

    assertEquals(UploadJobStates.ERROR, result);
  }

  @Test
  @DisplayName("check if getState() executes successfully when there is a missing catalog")
  void getStateMissingCatalog() {
    doReturn(true).when(this.cut).hasErrors();

    this.cut.uploadErrors = Collections.singletonList(
        this.cut.createError(1, null, new ServiceException("service-exception"), UploadErrorTypes.MISSING_CATALOG));

    UploadJobStates result = this.cut.getState();

    assertEquals(UploadJobStates.WARNING, result);
  }

  @Test
  @DisplayName("check if getState() executes successfully when there is a save error")
  void getStateSaveError() {
    doReturn(true).when(this.cut).hasErrors();

    this.cut.uploadErrors = Collections.singletonList(this.cut.createError(null, SkillTestHelper.SKILL_EXTERNAL_ID,
        new ServiceException("service-exception"), UploadErrorTypes.SAVE));

    UploadJobStates result = this.cut.getState();

    assertEquals(UploadJobStates.WARNING, result);
  }

  @Test
  @DisplayName("check if getState() executes successfully when there is a save error and a general error")
  void getStateSaveErrorAndGeneralError() {
    doReturn(true).when(this.cut).hasErrors();

    this.cut.uploadJob = this.createUploadJob();
    this.cut.uploadJob = this.createUploadJob();
    this.cut.uploadErrors = Arrays.asList(
        this.cut.createError(null, SkillTestHelper.SKILL_EXTERNAL_ID, new ServiceException("service-exception"),
            UploadErrorTypes.SAVE),
        this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.GENERAL));

    UploadJobStates result = this.cut.getState();

    assertEquals(UploadJobStates.ERROR, result);
  }

  @Test
  @DisplayName("check if getState() executes successfully when there is a catalog error and a general error")
  void getStateMissingCatalogAndGeneralError() {
    doReturn(true).when(this.cut).hasErrors();

    this.cut.uploadJob = this.createUploadJob();
    this.cut.missingCatalogsUploadErrors.put(SOME_CATALOG_NAME,
        this.cut.createError(1, null, new ServiceException("service-exception"), UploadErrorTypes.GENERAL));
    this.cut.uploadErrors = Collections.singletonList(
        this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.MISSING_CATALOG));

    UploadJobStates result = this.cut.getState();

    assertEquals(UploadJobStates.ERROR, result);
  }

  @Test
  @DisplayName("check if hasErrors() executes successfully if there are errors")
  void hasErrorsWithError() {
    this.cut.uploadErrors
        .add(this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.GENERAL));
    this.cut.missingCatalogsUploadErrors.put(SOME_CATALOG_NAME,
        this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.MISSING_CATALOG));

    boolean result = this.cut.hasErrors();

    assertTrue(result);
  }

  @Test
  @DisplayName("check if hasErrors() executes successfully if there are upload errors")
  void hasErrorWithUploadErrors() {
    this.cut.uploadErrors
        .add(this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.GENERAL));

    boolean result = this.cut.hasErrors();

    assertTrue(result);
  }

  @Test
  @DisplayName("check if hasErrors() executes successfully if there are only parsing errors")
  void hasErrorsWithParsingErrors() {
    this.cut.parsingErrors.put(SOME_CATALOG_NAME,
        this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.PARSING));

    boolean result = this.cut.hasErrors();

    assertTrue(result);
  }

  @Test
  @DisplayName("check if hasErrors() executes successfully if there are only catalog errors")
  void hasErrorsWithMissingCatalogErrors() {
    this.cut.missingCatalogsUploadErrors.put(SOME_CATALOG_NAME,
        this.cut.createError(null, null, new ServiceException("service-exception"), UploadErrorTypes.MISSING_CATALOG));

    boolean result = this.cut.hasErrors();

    assertTrue(result);
  }

  @Test
  @DisplayName("check if hasErrors() executes successfully if there are no errors")
  void hasErrorsWithoutError() {
    boolean result = this.cut.hasErrors();

    assertFalse(result);
  }

  @Test
  @DisplayName("check if createError() executes successfully for exceptions")
  void createErrorFromException() {
    int count = 1;
    String affectedEntity = SkillTestHelper.SKILL_EXTERNAL_ID;
    ServiceException exception = new ServiceException("service-exception");

    UploadErrorTypes type = UploadErrorTypes.GENERAL;

    UploadErrors uploadError = this.cut.createError(count, affectedEntity, exception, type);

    assertEquals(count, uploadError.getCount());
    assertEquals(affectedEntity, uploadError.getAffectedEntity());
    assertEquals(exception.getMessage(), uploadError.getErrorMessage());
    assertEquals(type.getValue(), uploadError.getType());
  }

  @Test
  @DisplayName("check if createError() executes successfully for messages")
  void createErrorFromMessage() {
    int count = 1;
    String affectedEntity = SkillTestHelper.SKILL_EXTERNAL_ID;
    Message message = mock(Message.class);

    UploadErrorTypes type = UploadErrorTypes.SAVE;

    UploadErrors uploadError = this.cut.createError(count, affectedEntity, message, type);

    assertEquals(count, uploadError.getCount());
    assertEquals(affectedEntity, uploadError.getAffectedEntity());
    assertEquals(message.getMessage(), uploadError.getErrorMessage());
    assertEquals(type.getValue(), uploadError.getType());
  }

  @Test
  @DisplayName("check if updateDatabase() executes successfully")
  void updateDatabase() {

    UploadJob expectedUploadJob = this.createUploadJob();
    this.cut.uploadJob = expectedUploadJob;
    this.cut.uploadErrors.add(UploadErrors.create());
    this.cut.uploadErrors.add(UploadErrors.create());

    this.cut.uploadErrors = Arrays.asList(UploadErrors.create(), UploadErrors.create(), UploadErrors.create());
    this.cut.missingCatalogsUploadErrors.put("1", UploadErrors.create());
    this.cut.missingCatalogsUploadErrors.put("2", UploadErrors.create());
    this.cut.missingCatalogsUploadErrors.put("3", UploadErrors.create());

    this.cut.uploadErrors.forEach(x -> expectedUploadJob.getUploadErrors().add(x));
    this.cut.missingCatalogsUploadErrors.values().forEach(x -> expectedUploadJob.getUploadErrors().add(x));

    this.cut.updateDatabase();

    ArgumentCaptor<UploadJob> uploadJobCaptor = ArgumentCaptor.forClass(UploadJob.class);
    verify(this.mockUploadJobRepository, times(1)).updateActiveEntity(uploadJobCaptor.capture());

    assertEquals(expectedUploadJob, uploadJobCaptor.getValue());

  }

  @Test
  @DisplayName("check if state is stuck")
  void isStuckTrue() {
    UploadJob interruptedUploadJob = this.createUploadJob();
    interruptedUploadJob.setState(UploadJobStates.RUNNING.getValue());
    interruptedUploadJob.setModifiedAt(ChronoUnit.SECONDS.addTo(mockClock.instant(), -UPLOAD_TIMEOUT_IN_SECONDS - 2));
    when(this.mockUploadJobRepository.findActiveEntity()).thenReturn(Optional.of(interruptedUploadJob));
    boolean isInterrupted = this.cut.isStuck();
    assertTrue(isInterrupted);
  }

  @Test
  @DisplayName("check if state is not stuck")
  void isStuckFalseTime() {
    UploadJob interruptedUploadJob = this.createUploadJob();
    interruptedUploadJob.setState(UploadJobStates.RUNNING.getValue());
    interruptedUploadJob.setModifiedAt(ChronoUnit.SECONDS.addTo(mockClock.instant(), -UPLOAD_TIMEOUT_IN_SECONDS + 2));
    when(this.mockUploadJobRepository.findActiveEntity()).thenReturn(Optional.of(interruptedUploadJob));
    boolean isInterrupted = this.cut.isStuck();
    assertFalse(isInterrupted);
  }

  @Test
  @DisplayName("check if state is not stuck")
  void isStuckFalseState() {
    UploadJob interruptedUploadJob = this.createUploadJob();
    interruptedUploadJob.setState(UploadJobStates.SUCCESS.getValue());
    interruptedUploadJob.setModifiedAt(ChronoUnit.SECONDS.addTo(mockClock.instant(), -UPLOAD_TIMEOUT_IN_SECONDS - 2));
    when(this.mockUploadJobRepository.findActiveEntity()).thenReturn(Optional.of(interruptedUploadJob));
    boolean isInterrupted = this.cut.isStuck();
    assertFalse(isInterrupted);
  }

  @Test
  @DisplayName("check if state interrupted is set successfully")
  void interrupt() {
    UploadJob interruptedUploadJob = this.createUploadJob();
    interruptedUploadJob.setState(UploadJobStates.RUNNING.getValue());
    interruptedUploadJob.setModifiedAt(ChronoUnit.SECONDS.addTo(mockClock.instant(), -UPLOAD_TIMEOUT_IN_SECONDS - 2));
    when(this.mockUploadJobRepository.findActiveEntity()).thenReturn(Optional.of(interruptedUploadJob));

    this.cut.interrupt();

    assertEquals(UploadJobStates.INTERRUPTED.getValue(), interruptedUploadJob.getState());
  }

  private UploadJob createUploadJob() {
    UploadJob uploadJob = UploadJob.create();
    uploadJob.setSkillsTotalCount(4);
    uploadJob.setCreatedSkillsCount(1);
    uploadJob.setUpdatedSkillsCount(1);
    uploadJob.setFailedSkillsCount(1);
    uploadJob.setUnprocessedSkillsCount(1);
    uploadJob.setUploadErrors(new ArrayList<>());
    return uploadJob;
  }
}
