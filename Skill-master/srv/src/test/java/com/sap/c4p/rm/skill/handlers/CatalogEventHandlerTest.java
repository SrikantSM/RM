package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.draft.DraftService;

import com.sap.c4p.rm.skill.repositories.CatalogRepository;
import com.sap.c4p.rm.skill.services.AuditLogService;
import com.sap.c4p.rm.skill.services.validators.CatalogValidator;
import com.sap.c4p.rm.skill.utils.CatalogTestHelper;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

import catalogservice.Catalogs;
import catalogservice.CreateCatalogWithDialogContext;

class CatalogEventHandlerTest {
  /* object under test */
  private CatalogEventHandler cut;

  /* mocks */
  private CatalogValidator mockCatalogValidator;
  private EventHandlerUtility mockEventHandlerUtility;
  private CatalogRepository mockCatalogRepo;
  private AuditLogService mockAuditLogService;

  @BeforeEach
  void beforeEach() {
    this.mockCatalogValidator = mock(CatalogValidator.class);
    this.mockCatalogRepo = mock(CatalogRepository.class);
    this.mockEventHandlerUtility = mock(EventHandlerUtility.class);
    this.mockAuditLogService = mock(AuditLogService.class);
    this.cut = new CatalogEventHandler(this.mockCatalogValidator, this.mockCatalogRepo, this.mockEventHandlerUtility,
        this.mockAuditLogService);
    when(this.mockCatalogRepo.createDraft(any(Catalogs.class))).thenAnswer(i -> i.getArguments()[0]);

  }

  @Test
  @DisplayName("verify that beforeCatalogModification() throws an exception thrown in the catalog validation")
  void beforeModificationException() {
    ServiceException ex = new ServiceException("");
    doThrow(ex).when(this.mockCatalogValidator).validate(any(Catalogs.class));
    Catalogs catalog = Catalogs.create();
    assertThrows(ServiceException.class, () -> this.cut.beforeModification(Collections.singletonList(catalog)));
    verify(this.mockCatalogValidator).validate(catalog);
  }

  @Test
  @DisplayName("verify that beforeCatalogModification() invokes all expected methods")
  void beforeModification() {
    Catalogs catalog = Catalogs.create();
    this.cut.beforeModification(Collections.singletonList(catalog));
    verify(this.mockCatalogValidator).validate(catalog);
  }

  @Test
  @DisplayName("check behavior of onCreateCatalogWithDialogAction()")
  void onCreateCatalogWithDialogAction() {
    // create expected Catalog
    final CreateCatalogWithDialogContext mockContext = mock(CreateCatalogWithDialogContext.class);
    final DraftService mockService = mock(DraftService.class);
    final Catalogs catalog = CatalogTestHelper.createCatalog();

    // mock Context
    when(this.mockCatalogRepo.createDraft(any(Catalogs.class))).thenReturn(catalog);
    when(mockContext.getDescription()).thenReturn(catalog.getDescription());
    when(mockContext.getName()).thenReturn(catalog.getName());

    // mock draftService
    final Result fakeResult = mock(Result.class);
    when(mockService.newDraft(any(CqnInsert.class))).thenReturn(fakeResult);
    when(fakeResult.single(Catalogs.class)).thenReturn(catalog);
    when(mockContext.getService()).thenReturn(mockService);

    // act
    this.cut.onCreateSkillWithDialogAction(mockContext);

    // createDraft method should be called once
    final ArgumentCaptor<Catalogs> captorCatalog = ArgumentCaptor.forClass(Catalogs.class);
    verify(this.mockCatalogRepo, times(1)).createDraft(captorCatalog.capture());

    // check that the right parameters have been used
    assertEquals(catalog.getName(), captorCatalog.getValue().getName());
    assertEquals(catalog.getDescription(), captorCatalog.getValue().getDescription());

    verify(mockContext, times(1)).setResult(captorCatalog.capture());
    assertEquals(catalog, captorCatalog.getValue());
  }

  @Test
  @DisplayName("verify that beforeDelete() invokes all expected methods")
  void beforeDelete() {
    Catalogs testCatalog = CatalogTestHelper.createCatalog();
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class);
    when(this.mockCatalogRepo.findActiveEntityById(anyString())).thenReturn(Optional.of(testCatalog));
    when(this.mockEventHandlerUtility.getEntityIdFromEventContext(any(), any())).thenReturn(testCatalog.getId());
    this.cut.beforeDelete(mockContext);

    verify(this.mockCatalogValidator, times(1)).validateDeletion(Optional.of(testCatalog));
    verify(this.mockAuditLogService, times(1)).logConfigurationChange(Catalogs.ID, testCatalog.getId(), "catalog",
        testCatalog.getName(), null, "skill catalog");
  }
}
