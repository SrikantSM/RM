package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.reflect.CdsEntity;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;

import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;
import com.sap.c4p.rm.skill.utils.CatalogTestHelper;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import catalogservice.Catalogs;
import catalogservice.CreateCatalogWithDialogContext;
import proficiencyservice.CreateProficiencySetWithDialogContext;
import proficiencyservice.ProficiencySets;
import skillservice.CreateSkillWithDialogContext;
import skillservice.Skills;

class SingleSkillSourceHandlerTest {

  private SingleSkillSourceHandler cut;
  private EventHandlerUtility mockEventHandlerUtility;
  private SingleSkillSourceValidator mockSingleSkillSourceValidator;

  @BeforeEach
  void beforeEach() {
    this.mockSingleSkillSourceValidator = mock(SingleSkillSourceValidator.class);
    this.mockEventHandlerUtility = mock(EventHandlerUtility.class);
    this.cut = new SingleSkillSourceHandler(mockEventHandlerUtility, mockSingleSkillSourceValidator);
  }

  @Test
  @DisplayName("check if the validation is triggered when a skill replicated from MDI is deleted ")
  void skillDelReplicatedFromMDI() {
    final CdsDeleteEventContext eventContext = mock(CdsDeleteEventContext.class);
    CdsEntity cdsEntity = mock(CdsEntity.class);
    final Skills skill = SkillTestHelper.createSkill();
    skill.setOid("MDI-OID");

    when(eventContext.getEvent()).thenReturn("DELETE");
    when(eventContext.getTarget()).thenReturn(cdsEntity);
    when(cdsEntity.getQualifiedName()).thenReturn("SkillService.Skills");
    when(this.mockEventHandlerUtility.getEntityIdFromEventContext(any(), any())).thenReturn(skill.getId());
    this.cut.beforeModification(eventContext);
    verify(this.mockSingleSkillSourceValidator, times(1)).checkIfEntryIsMDIReplicated("SkillService.Skills",
        skill.getId());
  }

  @Test
  @DisplayName("check if the validation is triggered for a catalog replicated from MDI is deleted ")
  void catalogDelReplicatedFromMDI() {
    final CdsDeleteEventContext eventContext = mock(CdsDeleteEventContext.class);
    CdsEntity cdsEntity = mock(CdsEntity.class);
    Catalogs catalogs = CatalogTestHelper.createCatalog();
    catalogs.setOid("MDI-OID");

    when(eventContext.getEvent()).thenReturn("DELETE");
    when(eventContext.getTarget()).thenReturn(cdsEntity);
    when(cdsEntity.getQualifiedName()).thenReturn("CatalogService.Catalogs");
    when(this.mockEventHandlerUtility.getEntityIdFromEventContext(any(), any())).thenReturn(catalogs.getId());
    this.cut.beforeModification(eventContext);
    verify(this.mockSingleSkillSourceValidator, times(1)).checkIfEntryIsMDIReplicated("CatalogService.Catalogs",
        catalogs.getId());
  }

  @Test
  @DisplayName("check if the validation is triggered for a proficiency Set replicated from MDI is deleted ")
  void profSetDelReplicatedFromMDI() {
    final CdsDeleteEventContext eventContext = mock(CdsDeleteEventContext.class);
    CdsEntity cdsEntity = mock(CdsEntity.class);
    ProficiencySets proficiencySets = ProficiencySets.create();
    proficiencySets.setId("UUID");
    proficiencySets.setOid("MDI-OID");

    when(eventContext.getEvent()).thenReturn("DELETE");
    when(eventContext.getTarget()).thenReturn(cdsEntity);
    when(cdsEntity.getQualifiedName()).thenReturn("ProficiencyService.ProficiencySets");
    when(this.mockEventHandlerUtility.getEntityIdFromEventContext(any(), any())).thenReturn(proficiencySets.getId());
    this.cut.beforeModification(eventContext);
    verify(this.mockSingleSkillSourceValidator, times(1))
        .checkIfEntryIsMDIReplicated("ProficiencyService.ProficiencySets", proficiencySets.getId());
  }

  @Test
  @DisplayName("check if creation of proficiency Set is allowed when MDI Replication is active ")
  void profSetCreateWhenMDIReplicationActive() {
    final CreateProficiencySetWithDialogContext eventContext = CreateProficiencySetWithDialogContext.create();

    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.FALSE);
    assertThrows(ServiceException.class, () -> this.cut.beforeModification(eventContext));
  }

  @Test
  @DisplayName("check if creation of catalog is allowed when MDI Replication is active ")
  void catalogCreateWhenMDIReplicationActive() {
    final CreateCatalogWithDialogContext eventContext = CreateCatalogWithDialogContext.create();

    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.FALSE);
    assertThrows(ServiceException.class, () -> this.cut.beforeModification(eventContext));
  }

  @Test
  @DisplayName("check if creation of skill via Manage Skill application is allowed when MDI Replication is active ")
  void skillCreateViaUIWhenMDIReplicationActive() {
    final CreateSkillWithDialogContext eventContext = CreateSkillWithDialogContext.create();

    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.FALSE);
    assertThrows(ServiceException.class, () -> this.cut.beforeModification(eventContext));
  }

  @Test
  @DisplayName("check if creation of skill via API is allowed when MDI Replication is active ")
  void skillCreateViaAPIWhenMDIReplicationActive() {
    final CdsCreateEventContext eventContext = mock(CdsCreateEventContext.class);
    final Skills skill = SkillTestHelper.createSkill();
    skill.setOid("MDI-OID");

    when(eventContext.getEvent()).thenReturn("CREATE");
    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.FALSE);

    assertThrows(ServiceException.class, () -> this.cut.beforeModification(eventContext));
  }

  @Test
  @DisplayName("check if update of skill via API is allowed when MDI Replication is active ")
  void skillUpdateReplicatedFromMDI() {
    final CdsUpdateEventContext eventContext = mock(CdsUpdateEventContext.class);
    CdsEntity cdsEntity = mock(CdsEntity.class);
    final Skills skill = SkillTestHelper.createSkill();
    skill.setOid("MDI-OID");
    List<Map<String, Object>> skills = new ArrayList<>();
    skills.add(skill);

    when(eventContext.getEvent()).thenReturn("UPDATE");
    when(eventContext.getTarget()).thenReturn(cdsEntity);
    when(cdsEntity.getQualifiedName()).thenReturn("SkillService.Skills");
    when(this.mockEventHandlerUtility.getEntitiesFromEventContext(eventContext)).thenReturn(skills);
    this.cut.beforeModification(eventContext);
    verify(this.mockEventHandlerUtility, times(1)).getEntitiesFromEventContext(eventContext);
  }

}
