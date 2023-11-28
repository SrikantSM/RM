package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.Collections;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CdsReadEventContext;

import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.Catalogs;
import skillservice.Catalogs2Skills;
import skillservice.Skills;
import skillservice.Skills_;

class CommaSeparatedCatalogsHandlerTest {
  private final SkillRepository skillRepository = mock(SkillRepository.class);

  private final CommaSeparatedCatalogsHandler cut = new CommaSeparatedCatalogsHandler(skillRepository);;
  private final CommaSeparatedCatalogsHandler spyCut = spy(cut);

  @Test
  @DisplayName("verify that afterRead calls the correct methods (column requested)")
  void afterRead() {
    CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(Skills_.CDS_NAME);
    mockReadEventContext.setCqn(Select.from(Skills_.class));

    Skills testSkill = SkillTestHelper.createSkill();
    Catalogs2Skills c2s = Catalogs2Skills.create();
    testSkill.setCatalogAssociations(Collections.singletonList(c2s));

    doReturn(true).when(this.spyCut).shouldComputeCommaSeparated(any());
    doReturn(Collections.singletonList(testSkill)).when(this.skillRepository).getActiveCatalogNamesBySkills(any());
    doReturn("").when(this.spyCut).computeCommaSeparated(any());

    this.spyCut.afterRead(mockReadEventContext, Collections.singletonList(testSkill));

    verify(this.skillRepository, times(1)).getActiveCatalogNamesBySkills(any());
    verify(this.spyCut, times(1)).computeCommaSeparated(any());
  }

  @Test
  @DisplayName("verify that afterRead calls the correct methods (column not requested)")
  void afterReadNoop() {
    CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(Skills_.CDS_NAME);
    mockReadEventContext.setCqn(Select.from(Skills_.class));

    Skills testSkill = SkillTestHelper.createSkill();

    doReturn(false).when(this.spyCut).shouldComputeCommaSeparated(any());

    this.spyCut.afterRead(mockReadEventContext, Collections.singletonList(testSkill));

    verify(this.skillRepository, times(0)).getActiveCatalogNamesBySkills(any());
    verify(this.spyCut, times(0)).computeCommaSeparated(any());
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated is true on select *")
  void shouldComputeCommaSeparatedStar() {
    CqnSelect select = Select.from(Skills_.class).columns(Skills_::_all);
    assertTrue(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated is true on select COMMA_SEPARATED_CATALOGS")
  void shouldComputeCommaSeparatedColumn() {
    CqnSelect select = Select.from(Skills_.class).columns(Skills_::ID, Skills_::commaSeparatedCatalogs);
    assertTrue(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated is false on select w/o column or star")
  void shouldComputeCommaSeparatedNot() {
    CqnSelect select = Select.from(Skills_.class).columns(Skills_::ID);
    assertFalse(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that computeCommaSeparated correctly processes a list of catalogAssociations")
  void computeCommaSeparated() {
    Catalogs catalog1 = Struct.create(Catalogs.class);
    catalog1.setName("cat 1");
    Catalogs2Skills catalogAssociation1 = Struct.create(Catalogs2Skills.class);
    catalogAssociation1.setCatalog(catalog1);

    Catalogs catalog2 = Struct.create(Catalogs.class);
    catalog2.setName("cat 2");
    Catalogs2Skills catalogAssociation2 = Struct.create(Catalogs2Skills.class);
    catalogAssociation2.setCatalog(catalog2);

    Catalogs catalog3 = Struct.create(Catalogs.class);
    catalog3.setName("");
    Catalogs2Skills catalogAssociation3 = Struct.create(Catalogs2Skills.class);
    catalogAssociation3.setCatalog(catalog3);

    Catalogs catalog4 = Struct.create(Catalogs.class);
    Catalogs2Skills catalogAssociation4 = Struct.create(Catalogs2Skills.class);
    catalogAssociation4.setCatalog(catalog4);

    Catalogs2Skills catalogAssociation5 = Struct.create(Catalogs2Skills.class);

    assertEquals("cat 1, cat 2", cut.computeCommaSeparated(Arrays.asList(catalogAssociation1, catalogAssociation2,
        catalogAssociation3, catalogAssociation4, catalogAssociation5)));
  }

  @Test
  @DisplayName("verify that computeCommaSeparated correctly processes null")
  void computeCommaSeparatedNull() {
    assertEquals("", cut.computeCommaSeparated(null));
  }
}
