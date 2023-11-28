package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;

import com.sap.resourcemanagement.skill.Catalogs2Skills;
import com.sap.resourcemanagement.skill.Skills;

public class WorkforceCapabilityDAOTest extends InitMocks {

  @Mock
  PersistenceService persistenceService;

  @Mock
  MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Mock
  Result result;

  @Mock
  Iterator<Row> iterator;

  @Mock
  Row row;

  @Mock
  Skills mockSkills;

  @Autowired
  @InjectMocks
  WorkforceCapabilityDAOImpl classUnderTest;

  @Test
  @DisplayName("test save when persistence run raise exception")
  public void testSaveWhenPersistenceRunRaiseException() {
    Skills skills = Skills.create();
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnInsert.class));
    assertThrows(TransactionException.class, () -> this.classUnderTest.save(skills, catalogs2SkillsList));
    verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
  }

  @Test
  @DisplayName("test save when persistence do not raise exception")
  public void testSaveWhenPersistenceDoNotRaiseException() {
    Skills skills = Skills.create();
    skills.setId(UUID.randomUUID().toString());
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    skills.setCatalogAssociations(catalogs2SkillsList);
    when(result.single()).thenReturn(row);
    when(result.single().get(Skills.ID)).thenReturn(skills.getId());
    when(this.persistenceService.run(any(CqnInsert.class))).thenReturn(result);
    this.classUnderTest.save(skills, catalogs2SkillsList);
    verify(this.persistenceService, times(2)).run(any(CqnInsert.class));
    verify(this.persistenceService, times(2)).run(any(Insert.class));
  }

  @Test
  @DisplayName("test update when persistence run raise exception")
  public void testUpdateWhenPersistenceRunRaiseException() {
    Skills skills = Skills.create();
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpdate.class));
    assertThrows(TransactionException.class, () -> this.classUnderTest.update(skills, catalogs2SkillsList));
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
  }

  @Test
  @DisplayName("test update when persistence do not raise exception")
  public void testUpdateWhenPersistenceDoNotRaiseException() {
    Skills skills = Skills.create();
    skills.setId(UUID.randomUUID().toString());
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    skills.setCatalogAssociations(catalogs2SkillsList);
    when(result.single()).thenReturn(row);
    when(result.single().get(Skills.ID)).thenReturn(skills.getId());
    when(this.persistenceService.run(any(CqnUpdate.class))).thenReturn(result);
    this.classUnderTest.update(skills, catalogs2SkillsList);
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
    verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
    verify(this.persistenceService, times(1)).run(any(Delete.class));
  }

  @Test
  @DisplayName("test getExistingSkill with skill records - not null")
  public void testGetExistingSkillsWithNonNullSkillRecords() {
    String skillID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(Collections.singletonList(row).iterator());
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    when(result.single()).thenReturn(row);
    Row finalResult = this.classUnderTest.getExistingSkill(skillID);
    verify(this.persistenceService).run(any(Select.class));
    assertNotNull(finalResult);
  }

  @Test
  @DisplayName("test getExistingSkill with skill records - null")
  public void testGetExistingSkillsWithNullSkillRecords() {
    String skillID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(iterator);
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    Row finalResult = this.classUnderTest.getExistingSkill(skillID);
    assertNull(finalResult);
    verify(persistenceService).run(any(Select.class));
  }

  @Test
  @DisplayName("test getExistingProfID with prof records - not null")
  public void testGetExistingProfWithNonNullProfRecords() {
    String profID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(Collections.singletonList(row).iterator());
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    when(result.single()).thenReturn(row);
    Row finalResult = this.classUnderTest.getExistingProfID(profID);
    verify(this.persistenceService).run(any(Select.class));
    assertNotNull(finalResult);
  }

  @Test
  @DisplayName("test getExistingProfID with prof records - null")
  public void testGetExistingProfWithNullProfRecords() {
    String profID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(iterator);
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    Row finalResult = this.classUnderTest.getExistingProfID(profID);
    assertNull(finalResult);
    verify(persistenceService).run(any(Select.class));
  }

  @Test
  @DisplayName("test getExistingCatalogID with catalog records - not null")
  public void testGetExistingCatalogWithNonNullCatalogRecords() {
    String catalogID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(Collections.singletonList(row).iterator());
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    when(result.single()).thenReturn(row);
    Row finalResult = this.classUnderTest.getExistingCatalogID(catalogID);
    verify(this.persistenceService).run(any(Select.class));
    assertNotNull(finalResult);
  }

  @Test
  @DisplayName("test getExistingCatalogID with catalog records - null")
  public void testGetExistingCatalogWithNullCatalogRecords() {
    String catalogID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(iterator);
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    Row finalResult = this.classUnderTest.getExistingCatalogID(catalogID);
    assertNull(finalResult);
    verify(persistenceService).run(any(Select.class));
  }
}
