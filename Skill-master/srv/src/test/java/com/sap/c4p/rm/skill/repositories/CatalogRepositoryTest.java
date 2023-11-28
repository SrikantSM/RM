package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.utils.CatalogTestHelper;

import catalogservice.Catalogs;
import catalogservice.Catalogs_;

class CatalogRepositoryTest {
  private CatalogRepository cut;
  private DraftService mockDraftService;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  void beforeEach() {
    this.mockDraftService = mock(DraftService.class);
    this.mockPersistenceService = mock(PersistenceService.class);
    this.cut = new CatalogRepository(this.mockDraftService, this.mockPersistenceService);
  }

  @Test
  @DisplayName("create catalog draft correctly")
  void createDraft() {
    Catalogs catalog = CatalogTestHelper.createCatalog();
    Catalogs expectedResult = Catalogs.create();

    final CqnInsert expectedInsert = Insert.into(Catalogs_.class).entry(catalog);
    final ArgumentCaptor<CqnInsert> argumentInsert = ArgumentCaptor.forClass(CqnInsert.class);

    Result mockResult = mock(Result.class);
    when(mockResult.single(Catalogs.class)).thenReturn(expectedResult);
    when(this.mockDraftService.newDraft(any(Insert.class))).thenReturn(mockResult);

    Catalogs actualResult = this.cut.createDraft(catalog);
    verify(this.mockDraftService, times(1)).newDraft(argumentInsert.capture());
    List<CqnInsert> capturedInsert = argumentInsert.getAllValues();
    assertEquals(expectedInsert.toString(), capturedInsert.get(0).toString());

    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find draft entity by ID correctly")
  void hasDraft() {
    String expectedName = "Catalog";

    Catalogs mockCatalog = Catalogs.create();
    mockCatalog.setId("ID");
    mockCatalog.setName(expectedName);
    Result mockResult = mock(Result.class);
    Optional<Catalogs> expectedResult = Optional.of(mockCatalog);
    when(mockResult.first(Catalogs.class)).thenReturn(Optional.of(mockCatalog));
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<Catalogs> actualResult = this.cut.findCatalogByIdWithNameAndHasDraftEntity("ID");

    verify(this.mockDraftService, times(1)).run(any(CqnSelect.class));
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find active entity by ID correctly")
  void findActiveEntityById() {
    final CqnSelect expectedSelect = Select.from(Catalogs_.class).where(c -> c.ID().eq("")).columns(Catalogs_::_all,
        c -> c.skillAssociations().expand());

    Optional<Catalogs> expectedResult = Optional.of(Catalogs.create());
    Result mockResult = mock(Result.class);
    when(mockResult.first(Catalogs.class)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<Catalogs> actualResult = this.cut.findActiveEntityById("");

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find active entity by name correctly")
  void findActiveEntityByName() {
    final CqnSelect expectedSelect = Select.from(Catalogs_.class).where(c -> c.name().eq("")).columns(Catalogs_::_all,
        c -> c.skillAssociations().expand());

    Optional<Catalogs> expectedResult = Optional.of(Catalogs.create());
    Result mockResult = mock(Result.class);
    when(mockResult.first(Catalogs.class)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<Catalogs> actualResult = this.cut.findActiveEntityByName("");

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("count other active entities with same name correctly")
  void countOtherActiveEntitiesWithSameName() {
    Catalogs catalog = CatalogTestHelper.createCatalog();

    final CqnSelect expectedSelect = Select.from(Catalogs_.class).columns(CQL.count().as(CatalogRepository.COUNT))
        .where(s -> s.name().eq(catalog.getName()).and(s.ID().ne(catalog.getId())));

    long expectedResult = 1L;
    Result mockResult = mock(Result.class, RETURNS_DEEP_STUBS);
    when(mockResult.single().get(CatalogRepository.COUNT)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    long actualResult = this.cut.countOtherActiveEntitiesWithSameName(catalog);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }
}
