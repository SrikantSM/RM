package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.utils.CatalogTestHelper;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import catalogservice.Catalogs2Skills;
import catalogservice.Catalogs2Skills_;
import catalogservice.Skills;

class Catalogs2SkillsRepositoryTest {
  private Catalogs2SkillsRepository cut;
  private DraftService mockDraftService;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  void beforeEach() {
    this.mockDraftService = mock(DraftService.class);
    this.mockPersistenceService = mock(PersistenceService.class);
    this.cut = new Catalogs2SkillsRepository(this.mockDraftService, this.mockPersistenceService);
  }

  @Test
  @DisplayName("create an active catalog2skill association correctly")
  void createActiveEntity() {
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    Catalogs2Skills expectedResult = Catalogs2Skills.create();

    CqnInsert expectedInsert = Insert.into(Catalogs2Skills_.class).entry(catalogs2Skills);

    Result mockResult = mock(Result.class);
    when(mockResult.single(Catalogs2Skills.class)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnInsert.class))).thenReturn(mockResult);

    Catalogs2Skills actualResult = this.cut.createActiveEntity(catalogs2Skills);

    final ArgumentCaptor<CqnInsert> argument = ArgumentCaptor.forClass(CqnInsert.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedInsert.toJson(), argument.getValue().toJson());

    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("delete all catalog2skill associations of a skill")
  void deleteBySkill() {
    Skills skill = Struct.access(SkillTestHelper.createSkill()).as(Skills.class);

    CqnDelete expectedDelete = Delete.from(Catalogs2Skills_.class).where(x -> x.skill_ID().eq(skill.getId()));

    this.cut.deleteBySkill(skill);

    final ArgumentCaptor<CqnDelete> argument = ArgumentCaptor.forClass(CqnDelete.class);
    verify(this.mockDraftService, times(1)).run(argument.capture());
    assertEquals(expectedDelete.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("deleta all catalog2skill association of a skill with a given catalog id")
  void deleteBySkillIdAndCatalogId() {
    skillservice.Skills skill = SkillTestHelper.createSkill();
    catalogservice.Catalogs catalog = CatalogTestHelper.createCatalog();

    CqnDelete expectedDelete = Delete.from(Catalogs2Skills_.class)
        .where(x -> x.skill_ID().eq(skill.getId()).and(x.catalog_ID().eq(catalog.getId())));

    this.cut.deleteBySkillIdAndCatalogId(skill.getId(), catalog.getId());

    final ArgumentCaptor<CqnDelete> argument = ArgumentCaptor.forClass(CqnDelete.class);

    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedDelete.toJson(), argument.getValue().toJson());
  }
}
