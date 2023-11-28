package com.sap.c4p.rm.skill.services.skillimport.esco;

import static java.util.Collections.singletonList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.context.ApplicationContext;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.cds.services.request.RequestContext;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.ChangeSetContextRunner;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.skill.config.AsyncConfig;
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
import com.sap.c4p.rm.skill.services.skillimport.UploadJobService;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;
import com.sap.c4p.rm.skill.utils.UploadJobStates;

import catalogservice.Catalogs;
import catalogservice.Catalogs2Skills;
import skillservice.AlternativeLabels;
import skillservice.Skills;
import skillservice.SkillsTexts;

class EscoCsvSkillImporterImplTest {

  private static final String LANGUAGE_CODE_EN = "en";
  private static final String SOME_SKILL_ID_1 = "skill#1";
  private static final String SOME_SKILL_ID_2 = "skill#2";
  private static final String SOME_EXTERNAL_ID = "EXTERNAL_ID";
  private static final String SOME_LABEL_WITHOUT_ID = "Label without Id";
  private static final String SOME_TEXT = "skill text name";
  private static final String LABEL_NAME_WITH_ID = "LabelWithId";
  private static final String SOME_LABEL_ID_1 = "LABEL_ID_1";
  private static final String SOME_LABEL_ID_2 = "LABEL_ID_2";
  private static final String SOME_LOCALE_1 = "en";
  private static final String SOME_LOCALE_2 = "de";
  private static final String SOME_CATALOG_NAME_1 = "CATALOG_NAME_1";
  private static final String SOME_CATALOG_NAME_2 = "CATALOG_NAME_2";
  private static final String SOME_PROFICIENCY_SET_ID = "proficiencySet#1";
  private static final String SOME_FILENAME = "fileName#1";

  /**
   * object under test
   */
  private EscoCsvSkillImporterImpl cut;
  private EscoCsvSkillImporterImpl spyCut;
  private CdsRuntime mockCdsRuntime;
  private UploadJobService mockUploadJobService;
  private EscoCsvConsistencyCheck mockConsistencyCheck;
  private EscoParser mockEscoParser;
  private AsyncConfig mockAsyncConfig;
  private AlternativeLabelRepository mockAlternativeLabelRepository;
  private CatalogRepository mockCatalogRepository;
  private Catalogs2SkillsRepository mockCatalogs2SkillsRepository;
  private SkillRepository mockSkillRepository;
  private SkillTextRepository mockSkillTextRepository;
  private LanguageRepository mockLanguageRepository;
  private AuditLogService mockAuditLogService;

  private Skills draftSkillWithID, activeSkillWithID, skillWithoutID;
  private AlternativeLabels testAlternativeLabelWithoutID;
  private SkillsTexts testSkillTextWithLocaleAndWithoutID, testSkillTextWithOtherLocaleAndWithoutID,
      testSkillTextWithLocaleAndID;
  private Catalogs someCatalog;

  @SuppressWarnings("unchecked")
  @BeforeEach
  void beforeEach() {
    this.mockCdsRuntime = mock(CdsRuntime.class, RETURNS_DEEP_STUBS);
    final ChangeSetContextRunner mockChangeSetContextRunner = mock(ChangeSetContextRunner.class);
    this.mockUploadJobService = mock(UploadJobService.class);
    this.mockConsistencyCheck = mock(EscoCsvConsistencyCheck.class);
    this.mockEscoParser = mock(EscoParser.class);
    this.mockAsyncConfig = mock(AsyncConfig.class);
    this.mockAlternativeLabelRepository = mock(AlternativeLabelRepository.class);
    this.mockCatalogRepository = mock(CatalogRepository.class);
    this.mockCatalogs2SkillsRepository = mock(Catalogs2SkillsRepository.class);
    this.mockSkillRepository = mock(SkillRepository.class);
    this.mockSkillTextRepository = mock(SkillTextRepository.class);
    this.mockLanguageRepository = mock(LanguageRepository.class);
    this.mockAuditLogService = mock(AuditLogService.class);
    final ApplicationContext appContext = mock(ApplicationContext.class);

    this.cut = new EscoCsvSkillImporterImpl(this.mockCdsRuntime, this.mockConsistencyCheck, this.mockEscoParser,
        mockAuditLogService, this.mockAsyncConfig, this.mockAlternativeLabelRepository, this.mockCatalogRepository,
        this.mockCatalogs2SkillsRepository, this.mockSkillRepository, this.mockSkillTextRepository,
        this.mockLanguageRepository, appContext);
    this.spyCut = spy(this.cut);

    this.testAlternativeLabelWithoutID = AlternativeLabels.create();
    this.testAlternativeLabelWithoutID.setName(EscoCsvSkillImporterImplTest.SOME_LABEL_WITHOUT_ID);
    final AlternativeLabels testAlternativeLabelWithID = AlternativeLabels.create();
    testAlternativeLabelWithID.setName(EscoCsvSkillImporterImplTest.LABEL_NAME_WITH_ID);
    testAlternativeLabelWithID.setId(EscoCsvSkillImporterImplTest.SOME_LABEL_ID_1);
    this.testSkillTextWithLocaleAndWithoutID = SkillsTexts.create();
    this.testSkillTextWithLocaleAndWithoutID.setName(EscoCsvSkillImporterImplTest.SOME_TEXT);
    this.testSkillTextWithLocaleAndWithoutID.setLocale(EscoCsvSkillImporterImplTest.SOME_LOCALE_1);
    this.testSkillTextWithOtherLocaleAndWithoutID = SkillsTexts.create();
    this.testSkillTextWithOtherLocaleAndWithoutID.setName(EscoCsvSkillImporterImplTest.SOME_TEXT);
    this.testSkillTextWithOtherLocaleAndWithoutID.setLocale(EscoCsvSkillImporterImplTest.SOME_LOCALE_2);
    this.testSkillTextWithLocaleAndID = SkillsTexts.create();
    this.testSkillTextWithLocaleAndID.setName(EscoCsvSkillImporterImplTest.SOME_TEXT);
    this.testSkillTextWithLocaleAndID.setLocale(EscoCsvSkillImporterImplTest.SOME_LOCALE_1);
    this.testSkillTextWithLocaleAndID.setIDTexts(EscoCsvSkillImporterImplTest.SOME_LABEL_ID_2);

    final List<AlternativeLabels> testAlternativeLabelsWithId = singletonList(testAlternativeLabelWithID);
    final List<SkillsTexts> testSkillsTextsWithId = singletonList(this.testSkillTextWithLocaleAndID);

    this.draftSkillWithID = Skills.create();
    this.activeSkillWithID = Skills.create();
    this.skillWithoutID = Skills.create();

    this.draftSkillWithID.setId(EscoCsvSkillImporterImplTest.SOME_SKILL_ID_1);
    this.activeSkillWithID.setId(EscoCsvSkillImporterImplTest.SOME_SKILL_ID_2);
    this.skillWithoutID.setExternalID(EscoCsvSkillImporterImplTest.SOME_EXTERNAL_ID);
    this.skillWithoutID.setTexts(Collections.emptyList());
    this.skillWithoutID.setAlternativeLabels(Collections.emptyList());
    this.draftSkillWithID.setAlternativeLabels(testAlternativeLabelsWithId);
    this.draftSkillWithID.setTexts(testSkillsTextsWithId);
    this.activeSkillWithID.setAlternativeLabels(testAlternativeLabelsWithId);
    this.activeSkillWithID.setTexts(testSkillsTextsWithId);
    this.draftSkillWithID.setIsActiveEntity(Boolean.FALSE);
    this.activeSkillWithID.setIsActiveEntity(Boolean.TRUE);

    // only skills to be updated may have a proficiencySetId
    this.draftSkillWithID.setProficiencySetId(EscoCsvSkillImporterImplTest.SOME_PROFICIENCY_SET_ID);
    this.activeSkillWithID.setProficiencySetId(EscoCsvSkillImporterImplTest.SOME_PROFICIENCY_SET_ID);

    this.someCatalog = Catalogs.create();
    this.someCatalog.setName(SOME_CATALOG_NAME_1);

    when(this.mockCdsRuntime.getProvidedParameterInfo().getLocale()).thenReturn(Locale.getDefault());
    when(this.mockCdsRuntime.changeSetContext()).thenReturn(mockChangeSetContextRunner);
    doAnswer((invocation) -> {
      Consumer<ChangeSetContext> c = invocation.getArgument(0);
      c.accept(null);
      return null;
    }).when(mockChangeSetContextRunner).run(any(Consumer.class));

    when(appContext.getBean(UploadJobService.class)).thenReturn(this.mockUploadJobService);
    when(this.mockUploadJobService.acquireLock()).thenReturn(true);
    when(this.mockUploadJobService.getState()).thenReturn(UploadJobStates.SUCCESS);
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(anyString()))
        .thenReturn(Collections.singleton(EscoCsvSkillImporterImplTest.LANGUAGE_CODE_EN));
    when(this.mockAsyncConfig.getAsyncExecutor(any())).thenReturn(new Executor() {
      @Override
      public void execute(Runnable command) {
        command.run();
      }
    });
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("check if triggerAsyncImport creates the CAP Request Context, Acquires the Mutex and starts the async processing")
  void triggerAsyncImport() throws IOException {
    // prevent async execution
    when(this.mockAsyncConfig.getAsyncExecutor(any())).thenReturn(Executors.newSingleThreadExecutor());
    doNothing().when(this.spyCut).processStringImport(any(), any(), any());
    doNothing().when(this.spyCut).finalizeImport(any(), any(), any());

    // mock stream
    final InputStream csvStream = IOUtils.toInputStream("", Charset.defaultCharset());
    final MultipartFile mockFile = mock(MultipartFile.class);
    when(mockFile.getInputStream()).thenReturn(csvStream);

    // mock runner
    RequestContextRunner mockRunner = mock(RequestContextRunner.class);
    when(this.mockCdsRuntime.requestContext()).thenReturn(mockRunner);
    ArgumentCaptor<Consumer<RequestContext>> runCaptor = ArgumentCaptor.forClass(Consumer.class);

    // act outer
    this.spyCut.triggerAsyncImport(mockFile, EscoCsvSkillImporterImplTest.LANGUAGE_CODE_EN);

    // verify runner, act inner
    verify(mockRunner).run(runCaptor.capture());
    Consumer<RequestContext> runConsumer = runCaptor.getValue();
    runConsumer.accept(null);

    // verify calls: upload job init, async config
    verify(this.mockUploadJobService).acquireLock();
    verify(this.mockAsyncConfig).getAsyncExecutor(mockRunner);
  }

  @Test
  @DisplayName("check if triggerAsyncImport throws expected exception for a non existing language")
  @SuppressWarnings("unchecked")
  void triggerAsyncImportWithNonExistingLanguage() {
    final MultipartFile mockFile = mock(MultipartFile.class);
    RequestContextRunner mockRunner = mock(RequestContextRunner.class);

    when(this.mockCdsRuntime.requestContext()).thenReturn(mockRunner);
    doAnswer(i -> {
      i.getArgument(0, Consumer.class).accept(null);
      return null;
    }).when(mockRunner).run((Consumer<RequestContext>) any());
    when(this.mockLanguageRepository.findExistingActiveLanguageCodes(anyString())).thenReturn(Collections.emptySet());
    assertThrows(ServiceException.class,
        () -> this.cut.triggerAsyncImport(mockFile, EscoCsvSkillImporterImplTest.LANGUAGE_CODE_EN));
  }

  @Test
  @DisplayName("check if triggerAsyncImport throws expected exception for concurrent upload")
  @SuppressWarnings("unchecked")
  void triggerAsyncImportConcurrent() throws IOException {
    when(this.mockUploadJobService.acquireLock()).thenReturn(false);

    // Mock Stream
    final InputStream csvStream = IOUtils.toInputStream("", Charset.defaultCharset());
    final MultipartFile mockFile = mock(MultipartFile.class);
    when(mockFile.getInputStream()).thenReturn(csvStream);

    // Mock RequestContextRunner
    RequestContextRunner mockRunner = mock(RequestContextRunner.class);
    when(this.mockCdsRuntime.requestContext()).thenReturn(mockRunner);
    doAnswer(i -> {
      i.getArgument(0, Consumer.class).accept(null);
      return null;
    }).when(mockRunner).run((Consumer<RequestContext>) any());

    assertThrows(ServiceException.class,
        () -> this.cut.triggerAsyncImport(mockFile, EscoCsvSkillImporterImplTest.LANGUAGE_CODE_EN));
  }

  @Test
  @DisplayName("check if finalizeImport works correctly with an unexpected error")
  void finalizeImportUnexpectedError() {
    final MultipartFile mockFile = mock(MultipartFile.class);
    when(mockFile.getOriginalFilename()).thenReturn(SOME_FILENAME);
    when(this.mockUploadJobService.getState()).thenReturn(UploadJobStates.ERROR);

    this.cut.finalizeImport(mockFile, this.mockUploadJobService, new Exception());

    verify(this.mockUploadJobService, times(1)).finishWithGeneralError(any(UnexpectedErrorServiceException.class));

    ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
    verify(this.mockAuditLogService, times(1)).logConfigurationChange(eq("filename"), eq(SOME_FILENAME), eq("result"),
        eq(null), captor.capture(), eq("skill file upload"));
    assertTrue(captor.getValue().contains("failed"));
  }

  @Test
  @DisplayName("check if finalizeImport works correctly with a general error")
  void finalizeImportGeneralError() {
    final MultipartFile mockFile = mock(MultipartFile.class);
    when(mockFile.getOriginalFilename()).thenReturn(SOME_FILENAME);
    when(this.mockUploadJobService.getState()).thenReturn(UploadJobStates.ERROR);

    this.cut.finalizeImport(mockFile, this.mockUploadJobService, null);

    verify(this.mockUploadJobService, times(0)).finishWithGeneralError(any());

    ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
    verify(this.mockAuditLogService, times(1)).logConfigurationChange(eq("filename"), eq(SOME_FILENAME), eq("result"),
        eq(null), captor.capture(), eq("skill file upload"));
    assertTrue(captor.getValue().contains("failed"));
  }

  @Test
  @DisplayName("check if finalizeImport works correctly with warnings")
  void finalizeImportWarnings() {
    final MultipartFile mockFile = mock(MultipartFile.class);
    when(mockFile.getOriginalFilename()).thenReturn(SOME_FILENAME);
    when(this.mockUploadJobService.getState()).thenReturn(UploadJobStates.WARNING);

    this.cut.finalizeImport(mockFile, this.mockUploadJobService, null);

    verify(this.mockUploadJobService, times(0)).finishWithGeneralError(any());

    ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
    verify(this.mockAuditLogService, times(1)).logConfigurationChange(eq("filename"), eq(SOME_FILENAME), eq("result"),
        eq(null), captor.capture(), eq("skill file upload"));
    assertTrue(captor.getValue().contains("warnings"));
  }

  @Test
  @DisplayName("check if finalizeImport works correctly for a succeeded job")
  void finalizeImportSucceeded() {
    final MultipartFile mockFile = mock(MultipartFile.class);
    when(mockFile.getOriginalFilename()).thenReturn(SOME_FILENAME);
    when(this.mockUploadJobService.getState()).thenReturn(UploadJobStates.SUCCESS);

    this.cut.finalizeImport(mockFile, this.mockUploadJobService, null);

    verify(this.mockUploadJobService, times(0)).finishWithGeneralError(any());

    ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
    verify(this.mockAuditLogService, times(1)).logConfigurationChange(eq("filename"), eq(SOME_FILENAME), eq("result"),
        eq(null), captor.capture(), eq("skill file upload"));
    assertTrue(captor.getValue().contains("succeeded"));
  }

  @Test
  @DisplayName("check if processStringImport() executes successfully if parameters allow it to")
  void processStringImportOK() {
    final String csvString = "header\n,\n,";

    final EscoParserResult expectedResult = mock(EscoParserResult.class);
    doReturn(expectedResult).when(this.mockEscoParser).parseSkill(any(), any());

    doNothing().when(this.spyCut).upsertSkill(any(), any());
    doAnswer(invocation -> {
      invocation.getArgument(0, Runnable.class).run();
      return null;
    }).when(this.spyCut).runWithClearedMessages(any(Runnable.class));

    this.spyCut.processStringImport(this.mockUploadJobService, csvString,
        EscoCsvSkillImporterImplTest.LANGUAGE_CODE_EN);

    verify(this.spyCut, times(2)).upsertSkill(any(), any());
  }

  @Test
  @DisplayName("check if processStringImport() handles a faulty header correctly")
  void processStringImportFaultyHeader() {
    final ServiceException e = new ServiceException("exception-message");
    doReturn(Optional.of(e)).when(this.mockConsistencyCheck).checkHeader(any());

    this.cut.processStringImport(this.mockUploadJobService, "", EscoCsvSkillImporterImplTest.LANGUAGE_CODE_EN);

    verify(this.mockUploadJobService, never()).incrementCreatedSkillsCount();
    verify(this.mockUploadJobService, never()).incrementUpdatedSkillsCount();

    ArgumentCaptor<ServiceException> captor = ArgumentCaptor.forClass(ServiceException.class);

    verify(this.mockUploadJobService, times(1)).finishWithGeneralError(captor.capture());
  }

  @Test
  @DisplayName("check if processStringImport() for a file with an empty header name leads to a correct message")
  void processStringImportEmptyHeaderName() {
    final String csvString = "header1,,";

    final ServiceException expectedException = new ServiceException(MessageKeys.CSV_HEADERS_EMPTY);

    this.spyCut.processStringImport(this.mockUploadJobService, csvString, LANGUAGE_CODE_EN);

    ArgumentCaptor<ServiceException> captor = ArgumentCaptor.forClass(ServiceException.class);
    verify(this.mockUploadJobService).finishWithGeneralError(captor.capture());

    assertEquals(expectedException.getMessage(), captor.getValue().getMessage());
  }

  @Test
  @DisplayName("check if processStringImport() for a file with a premature EOF leads to a correct message")
  void processStringImportPrematureEof() {
    final String csvString = "header\n\"\n";

    final ServiceException expectedException = new ServiceException(MessageKeys.CSV_ENDS_PREMATURELY);

    this.spyCut.processStringImport(this.mockUploadJobService, csvString, LANGUAGE_CODE_EN);

    ArgumentCaptor<ServiceException> captor = ArgumentCaptor.forClass(ServiceException.class);
    verify(this.mockUploadJobService).finishWithGeneralError(captor.capture());

    assertEquals(expectedException.getMessage(), captor.getValue().getMessage());
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("check that runWithClearedMessages() runs the runnable after clearing the messages")
  void runWithClearedMessages() {
    Runnable mockRunnable = mock(Runnable.class);
    RequestContextRunner mockRunner = mock(RequestContextRunner.class);

    when(this.mockCdsRuntime.requestContext()).thenReturn(mockRunner);
    when(mockRunner.clearMessages()).thenReturn(mockRunner);
    doAnswer(i -> {
      i.getArgument(0, Consumer.class).accept(null);
      return null;
    }).when(mockRunner).run((Consumer<RequestContext>) any());

    this.cut.runWithClearedMessages(mockRunnable);
    verify(mockRunnable, times(1)).run();
    verify(mockRunner, times(1)).clearMessages();
  }

  @Test
  @DisplayName("check if upsertSkill() is running correctly for a skill insertion")
  void upsertSkillInsertion() {
    when(this.mockSkillRepository.createDraft(any())).thenReturn(this.draftSkillWithID).thenReturn(Skills.create());

    doReturn(this.skillWithoutID).when(this.spyCut).extendSkillWithPersistedData(any());
    doNothing().when(this.spyCut).upsertCatalogs(any(), any(), any());

    EscoParserResult parserResult = new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.activeSkillWithID,
        new String[] {});
    this.spyCut.upsertSkill(this.mockUploadJobService, parserResult);

    assertEquals(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID, this.skillWithoutID.getProficiencySetId());
    verify(this.mockSkillRepository).createDraft(this.skillWithoutID);
    verify(this.mockSkillRepository).saveDraft(this.draftSkillWithID);
    verify(this.spyCut).upsertCatalogs(this.mockUploadJobService, this.draftSkillWithID, parserResult);
    verify(this.spyCut).updateLifecycleStatus(this.draftSkillWithID);

    verify(this.mockUploadJobService, times(1)).incrementCreatedSkillsCount();
    verify(this.mockUploadJobService, never()).incrementUpdatedSkillsCount();
    verify(this.mockUploadJobService, never()).addSaveErrorForSkill(eq(SkillTestHelper.SKILL_EXTERNAL_ID), any());
  }

  @Test
  @DisplayName("check if upsertSkill() is running correctly for a skill update")
  void upsertSkillUpdate() {
    doNothing().when(this.spyCut).updateExistingSkill(any(), any());
    doNothing().when(this.spyCut).upsertCatalogs(any(), any(), any());

    doReturn(this.draftSkillWithID).when(this.spyCut).extendSkillWithPersistedData(any());

    EscoParserResult parserResult = new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.activeSkillWithID,
        new String[] {});
    this.spyCut.upsertSkill(this.mockUploadJobService, parserResult);

    assertEquals(EscoCsvSkillImporterImplTest.SOME_PROFICIENCY_SET_ID, this.activeSkillWithID.getProficiencySetId());
    assertEquals(EscoCsvSkillImporterImplTest.SOME_PROFICIENCY_SET_ID, this.draftSkillWithID.getProficiencySetId());

    verify(this.spyCut).updateExistingSkill(this.draftSkillWithID, this.activeSkillWithID);
    verify(this.mockSkillRepository).saveDraft(this.draftSkillWithID);
    verify(this.spyCut).upsertCatalogs(this.mockUploadJobService, this.draftSkillWithID, parserResult);
    verify(this.spyCut).updateLifecycleStatus(draftSkillWithID);

    verify(this.mockUploadJobService, never()).incrementCreatedSkillsCount();
    verify(this.mockUploadJobService, times(1)).incrementUpdatedSkillsCount();
    verify(this.mockUploadJobService, never()).addSaveErrorForSkill(eq(SkillTestHelper.SKILL_EXTERNAL_ID), any());
  }

  @Test
  @DisplayName("check if upsertSkill() is correctly handling ServiceExceptions with a code < 500")
  void upsertSkillServiceException() {
    doReturn(this.activeSkillWithID).when(this.spyCut).extendSkillWithPersistedData(any());
    doNothing().when(this.spyCut).upsertCatalogs(any(), any(), any());
    ServiceException expectedException = new ServiceException(HttpStatus.BAD_REQUEST, "error");
    doThrow(expectedException).when(this.mockSkillRepository).saveDraft(any());

    EscoParserResult parserResult = new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.activeSkillWithID,
        new String[] {});
    this.spyCut.upsertSkill(this.mockUploadJobService, parserResult);

    verify(this.mockUploadJobService, never()).incrementCreatedSkillsCount();
    verify(this.mockUploadJobService, never()).incrementUpdatedSkillsCount();

    ArgumentCaptor<String> stringCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<ServiceException> exceptionCaptor = ArgumentCaptor.forClass(ServiceException.class);

    verify(this.mockUploadJobService, times(1)).addSaveErrorForSkill(stringCaptor.capture(), exceptionCaptor.capture());

    assertEquals(SkillTestHelper.SKILL_EXTERNAL_ID, stringCaptor.getValue());
    assertEquals(expectedException, exceptionCaptor.getValue());
  }

  @Test
  @DisplayName("check if upsertSkill() is correctly handling internal ServiceExceptions with a code = 500")
  void upsertSkillInternalServiceException() {
    UnexpectedErrorServiceException expectedException = new UnexpectedErrorServiceException();
    doThrow(expectedException).when(this.spyCut).extendSkillWithPersistedData(any());

    try {
      this.spyCut.upsertSkill(this.mockUploadJobService,
          new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.skillWithoutID, new String[] {}));
    } catch (Exception e) {
      assertEquals(expectedException.getLocalizedMessage(), e.getLocalizedMessage());
    }
  }

  @Test
  @DisplayName("check if upsertSkill() is correctly handling other exceptions")
  void upsertSkillOtherException() {
    doThrow(StackOverflowError.class).when(this.spyCut).extendSkillWithPersistedData(any());

    assertThrows(StackOverflowError.class, () -> {
      this.spyCut.upsertSkill(this.mockUploadJobService,
          new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.skillWithoutID, new String[] {}));
    });
  }

  @Test
  @DisplayName("check if extendSkillWithPersistedData() is running correctly when a draft skill exists")
  void extendSkillWithPersistedDataDraftSkill() {
    when(this.mockSkillRepository.findByExternalId(any(), eq(Boolean.FALSE)))
        .thenReturn(Optional.of(this.activeSkillWithID));
    when(this.mockSkillRepository.editDraftByExternalId(any())).thenReturn(this.skillWithoutID);

    Skills result = this.cut.extendSkillWithPersistedData(this.draftSkillWithID);

    final ArgumentCaptor<String> argument = ArgumentCaptor.forClass(String.class);
    verify(this.mockSkillRepository).editDraftByExternalId(argument.capture());

    assertEquals(this.activeSkillWithID.getExternalID(), argument.getValue());
    assertEquals(this.skillWithoutID, result);
  }

  @Test
  @DisplayName("check if extendSkillWithPersistedData() is running correctly when an active skill exists")
  void extendSkillWithPersistedDataActiveSkill() {
    when(this.mockSkillRepository.findByExternalId(any(), eq(Boolean.FALSE))).thenReturn(Optional.empty());
    when(this.mockSkillRepository.findByExternalId(any(), eq(Boolean.TRUE)))
        .thenReturn(Optional.of(this.draftSkillWithID));

    Skills result = this.cut.extendSkillWithPersistedData(this.activeSkillWithID);

    assertEquals(this.draftSkillWithID, result);
  }

  @Test
  @DisplayName("check if extendSkillWithPersistedData() is running correctly when no skill exists")
  void extendSkillWithPersistedDataNoSkill() {
    Skills result = this.cut.extendSkillWithPersistedData(this.draftSkillWithID);

    assertEquals(this.draftSkillWithID, result);
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("check if updateExistingSkill() is running correctly")
  void updateExistingSkill() {
    doNothing().when(this.spyCut).upsertSkillsText(any(), any());
    doNothing().when(this.spyCut).insertAlternativeLabels(any(), any());

    this.spyCut.updateExistingSkill(this.draftSkillWithID, this.activeSkillWithID);

    for (final SkillsTexts text : this.draftSkillWithID.getTexts()) {
      verify(this.mockAlternativeLabelRepository).deleteDraftsOfSkillAndLocale(this.draftSkillWithID, text.getLocale());
      verify(this.spyCut).upsertSkillsText(this.draftSkillWithID, text);
    }

    final ArgumentCaptor<List<AlternativeLabels>> argument = ArgumentCaptor.forClass(List.class);
    verify(this.spyCut).insertAlternativeLabels(eq(this.draftSkillWithID), argument.capture());
    assertEquals(this.activeSkillWithID.getAlternativeLabels().get(0).toJson(), argument.getValue().get(0).toJson());
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("check if updateExistingSkill() is running correctly if the updated skill does not have a proficiency id")
  void updateExistingSkillWithoutProficiencyIdInUpdatedSkill() {
    doNothing().when(this.spyCut).upsertSkillsText(any(), any());
    doNothing().when(this.spyCut).insertAlternativeLabels(any(), any());
    this.activeSkillWithID.setProficiencySetId(null);
    this.spyCut.updateExistingSkill(this.draftSkillWithID, this.activeSkillWithID);

    for (final SkillsTexts text : this.draftSkillWithID.getTexts()) {
      verify(this.mockAlternativeLabelRepository).deleteDraftsOfSkillAndLocale(this.draftSkillWithID, text.getLocale());
      verify(this.spyCut).upsertSkillsText(this.draftSkillWithID, text);
    }

    final ArgumentCaptor<List<AlternativeLabels>> argument = ArgumentCaptor.forClass(List.class);
    verify(this.spyCut).insertAlternativeLabels(eq(this.draftSkillWithID), argument.capture());
    assertEquals(this.activeSkillWithID.getAlternativeLabels().get(0).toJson(), argument.getValue().get(0).toJson());
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("check if updateExistingSkill() is running correctly if the updated skill does not have a proficiency id")
  void updateExistingSkillWithoutProficiencyIdInUpdatedAndExistingSkill() {
    doNothing().when(this.spyCut).upsertSkillsText(any(), any());
    doNothing().when(this.spyCut).insertAlternativeLabels(any(), any());
    this.activeSkillWithID.setProficiencySetId(null);
    this.draftSkillWithID.setProficiencySetId(null);
    this.spyCut.updateExistingSkill(this.draftSkillWithID, this.activeSkillWithID);

    for (final SkillsTexts text : this.draftSkillWithID.getTexts()) {
      verify(this.mockAlternativeLabelRepository).deleteDraftsOfSkillAndLocale(this.draftSkillWithID, text.getLocale());
      verify(this.spyCut).upsertSkillsText(this.draftSkillWithID, text);
    }

    final ArgumentCaptor<List<AlternativeLabels>> argument = ArgumentCaptor.forClass(List.class);
    verify(this.spyCut).insertAlternativeLabels(eq(this.draftSkillWithID), argument.capture());
    assertEquals(this.activeSkillWithID.getAlternativeLabels().get(0).toJson(), argument.getValue().get(0).toJson());
  }

  @Test
  @DisplayName("check if upsertSkillsText() is running correctly for insertions")
  void upsertSkillsTextInsertion() {
    this.spyCut.upsertSkillsText(this.draftSkillWithID, this.testSkillTextWithOtherLocaleAndWithoutID);

    final ArgumentCaptor<SkillsTexts> argument = ArgumentCaptor.forClass(SkillsTexts.class);
    verify(this.mockSkillTextRepository).createDraft(argument.capture());

    assertEquals(this.testSkillTextWithOtherLocaleAndWithoutID, argument.getValue());
    assertEquals(this.draftSkillWithID.getId(), argument.getValue().get("ID"));
  }

  @Test
  @DisplayName("check if upsertSkillsText() is running correctly for updates")
  void upsertSkillsTextUpdate() {
    this.spyCut.upsertSkillsText(this.draftSkillWithID, this.testSkillTextWithLocaleAndWithoutID);

    final ArgumentCaptor<SkillsTexts> argument = ArgumentCaptor.forClass(SkillsTexts.class);
    verify(this.mockSkillTextRepository).updateDraft(argument.capture());
    SkillsTexts skillText = argument.getValue();
    assertEquals(this.testSkillTextWithLocaleAndID, skillText);
    assertEquals(this.testSkillTextWithLocaleAndWithoutID.getName(), skillText.get("name"));
    assertEquals(this.testSkillTextWithLocaleAndWithoutID.getDescription(), skillText.get("description"));
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("check if insertAlternativeLabel() is running correctly")
  void insertAlternativeLabelOk() {
    doReturn(null).when(this.mockAlternativeLabelRepository).createDrafts(any());

    this.spyCut.insertAlternativeLabels(this.draftSkillWithID, singletonList(this.testAlternativeLabelWithoutID));

    final ArgumentCaptor<List<AlternativeLabels>> argument = ArgumentCaptor.forClass(List.class);
    verify(this.mockAlternativeLabelRepository).createDrafts(argument.capture());
    List<AlternativeLabels> labels = argument.getValue();
    assertEquals(this.testAlternativeLabelWithoutID, labels.get(0));
    assertEquals(this.draftSkillWithID.getId(), labels.get(0).get("skill_ID"));
  }

  @Test
  @DisplayName("check if upsertCatalogs() is running correctly")
  void upsertCatalogsOk() {
    when(this.mockCatalogRepository.findActiveEntityByName(any())).thenReturn(Optional.of(this.someCatalog));

    EscoParserResult parserResult = new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.activeSkillWithID,
        new String[] { SOME_CATALOG_NAME_1, SOME_CATALOG_NAME_2 });

    this.spyCut.upsertCatalogs(this.mockUploadJobService, this.activeSkillWithID, parserResult);

    final ArgumentCaptor<catalogservice.Skills> deleteArgument = ArgumentCaptor.forClass(catalogservice.Skills.class);
    verify(this.mockCatalogs2SkillsRepository).deleteBySkill(deleteArgument.capture());
    assertEquals(this.activeSkillWithID, deleteArgument.getValue());

    final ArgumentCaptor<String> findArgument = ArgumentCaptor.forClass(String.class);
    verify(this.mockCatalogRepository, times(2)).findActiveEntityByName(findArgument.capture());
    final ArgumentCaptor<Catalogs2Skills> createArgument = ArgumentCaptor.forClass(Catalogs2Skills.class);
    verify(this.mockCatalogs2SkillsRepository, times(2)).createActiveEntity(createArgument.capture());

    for (int i = 0; i < parserResult.getCatalogNames().length; i++) {
      assertEquals(parserResult.getCatalogNames()[i], findArgument.getAllValues().get(i));

      Catalogs2Skills expectedAssociation = Catalogs2Skills.create();
      expectedAssociation.setSkillId(this.activeSkillWithID.getId());
      expectedAssociation.setCatalogId(this.someCatalog.getId());

      assertEquals(expectedAssociation, createArgument.getAllValues().get(i));
    }
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("check if upsertCatalogs() is running correctly when some catalogs do not exist")
  void upsertCatalogsPartialSuccess() {
    when(this.mockCatalogRepository.findActiveEntityByName(any())).thenReturn(Optional.of(this.someCatalog),
        Optional.empty());

    EscoParserResult parserResult = new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.activeSkillWithID,
        new String[] { SOME_CATALOG_NAME_1, SOME_CATALOG_NAME_2 });

    this.spyCut.upsertCatalogs(this.mockUploadJobService, this.activeSkillWithID, parserResult);

    final ArgumentCaptor<catalogservice.Skills> deleteArgument = ArgumentCaptor.forClass(catalogservice.Skills.class);
    verify(this.mockCatalogs2SkillsRepository).deleteBySkill(deleteArgument.capture());
    assertEquals(this.activeSkillWithID, deleteArgument.getValue());

    final ArgumentCaptor<String> findArgument = ArgumentCaptor.forClass(String.class);
    verify(this.mockCatalogRepository, times(2)).findActiveEntityByName(findArgument.capture());
    final ArgumentCaptor<Catalogs2Skills> createArgument = ArgumentCaptor.forClass(Catalogs2Skills.class);
    verify(this.mockCatalogs2SkillsRepository, times(1)).createActiveEntity(createArgument.capture());

    for (int i = 0; i < parserResult.getCatalogNames().length; i++) {
      assertEquals(parserResult.getCatalogNames()[i], findArgument.getAllValues().get(i));
    }

    Catalogs2Skills expectedAssociation = Catalogs2Skills.create();
    expectedAssociation.setSkillId(this.activeSkillWithID.getId());
    expectedAssociation.setCatalogId(this.someCatalog.getId());

    assertEquals(expectedAssociation, createArgument.getValue());

    verify(this.mockUploadJobService, times(1)).incrementMissingCatalogCount(SOME_CATALOG_NAME_2);
  }

  @Test
  @DisplayName("check if upsertCatalogs() is not doing anything if catalogNames is null")
  void upsertCatalogsCatalogNamesNull() {
    EscoParserResult parserResult = new EscoParserResult(SkillTestHelper.SKILL_EXTERNAL_ID, this.activeSkillWithID,
        null);

    this.spyCut.upsertCatalogs(this.mockUploadJobService, this.activeSkillWithID, parserResult);

    verify(this.mockCatalogs2SkillsRepository, times(0)).deleteBySkill(any());
    verify(this.mockCatalogs2SkillsRepository, times(0)).createActiveEntity(any());
    verify(this.mockUploadJobService, times(0)).incrementMissingCatalogCount(any());
  }

  @Test
  @DisplayName("check if updateLifecycleStatus() is running correctly")
  void updateLifecycleStatusOk() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(1);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    this.spyCut.updateLifecycleStatus(skill);
    verify(this.mockSkillRepository, times(1)).updateActiveEntity(any());
    assertEquals(1, skill.getLifecycleStatusCode());
  }

  @Test
  @DisplayName("Parse a valid CSV record")
  void parseCsvRecordValid() {
    final EscoParserResult expectedResult = mock(EscoParserResult.class);
    doReturn(expectedResult).when(this.mockEscoParser).parseSkill(any(), any());

    Optional<EscoParserResult> result = this.spyCut.parseCsvRecord(this.mockUploadJobService, null, LANGUAGE_CODE_EN);

    verify(this.mockUploadJobService, times(0)).addParsingErrorsForSkill(any());

    assertTrue(result.isPresent());
    assertEquals(expectedResult, result.get());
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("Parse an invalid CSV record")
  void parseCsvRecordInvalid() {
    final ServiceException e = new ServiceException("exception-message");
    doReturn(singletonList(e)).when(this.mockConsistencyCheck).checkRecord(any());

    this.spyCut.parseCsvRecord(this.mockUploadJobService, null, LANGUAGE_CODE_EN);

    ArgumentCaptor<List<ServiceException>> captor = ArgumentCaptor.forClass(List.class);
    verify(this.mockUploadJobService).addParsingErrorsForSkill(captor.capture());

    assertEquals(e, captor.getValue().get(0));
  }
}
