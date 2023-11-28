package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;

import com.sap.resourcemanagement.skill.ProficiencySets;

public class WorkForceProficiencyDAOTest extends InitMocks {

  @Mock
  PersistenceService persistenceService;

  @Mock
  MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Mock
  Result result;

  @Mock
  Row row;

  @Mock
  Iterator<Row> iterator;

  @Mock
  ProficiencySets mockProficiencySets;

  @Autowired
  @InjectMocks
  WorkForceProficiencyDAOImpl classUnderTest;

  @Test
  @DisplayName("test save when persistence run raise exception")
  public void testSaveWhenPersistenceRunRaiseException() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnInsert.class));
    assertThrows(TransactionException.class, () -> this.classUnderTest.save(proficiencySets));
    verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
  }

  @Test
  @DisplayName("test save when persistence do not raise exception")
  public void testSaveWhenPersistenceDoNotRaiseException() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    this.classUnderTest.save(proficiencySets);
    verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
  }

  @Test
  @DisplayName("test update when persistence run raise exception")
  public void testUpdateWhenPersistenceRunRaiseException() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpdate.class));
    assertThrows(TransactionException.class, () -> this.classUnderTest.update(proficiencySets));
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
  }

  @Test
  @DisplayName("test update when persistence do not raise exception")
  public void testUpdateWhenPersistenceDoNotRaiseException() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    this.classUnderTest.update(proficiencySets);
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
  }

  @Test
  @DisplayName("test readAll with no Proficiency Set records")
  public void testReadAllWithNoProfSetRecords() {
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    when(this.result.listOf(ProficiencySets.class)).thenReturn(Collections.emptyList());
    assertTrue(this.classUnderTest.readAll().isEmpty());
  }

  @Test
  @DisplayName("test readAll with proficiency set records")
  public void testReadAllWithProfSetRecords() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    List<ProficiencySets> proficiencySetsList = new ArrayList<>();
    proficiencySetsList.add(proficiencySets);
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    when(this.result.listOf(ProficiencySets.class)).thenReturn(proficiencySetsList);
    assertEquals(proficiencySetsList, this.classUnderTest.readAll());
  }

  @Test
  @DisplayName("test getExistingProficiencySets with prof records - not null")
  public void testGetExistingProfSetWithProfSetRecords() {
    String profID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(Collections.singletonList(row).iterator());
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    when(result.single()).thenReturn(row);
    Row finalResult = this.classUnderTest.getExistingProfSet(profID);
    verify(this.persistenceService).run(any(Select.class));
    assertNotNull(finalResult);
  }

  @Test
  @DisplayName("test getExistingCatalogs with prof set records - null")
  public void testGetExistingProfSetWithNullProfSetRecords() {
    String profID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(iterator);
    when(result.single()).thenReturn(null);
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    Row finalResult = this.classUnderTest.getExistingProfSet(profID);
    assertNull(finalResult);
    verify(persistenceService).run(any(Select.class));
  }

  @Test
  @DisplayName("test getExistingProfLevel with non-null proficiency level records ")
  public void testGetExistingProfLevelWithProfLevelRecords() {
    String profLevelID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(Collections.singletonList(row).iterator());
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    when(result.single()).thenReturn(row);
    Row finalResult = this.classUnderTest.getExistingProfLevel(profLevelID);
    verify(this.persistenceService).run(any(Select.class));
    assertNotNull(finalResult);
  }

  @Test
  @DisplayName("test getExistingCatalogs with null proficiency level records l")
  public void testGetExistingProfLevelWithNullProfLevelRecords() {
    String profLevelID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(iterator);
    when(result.single()).thenReturn(null);
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    Row finalResult = this.classUnderTest.getExistingProfLevel(profLevelID);
    assertNull(finalResult);
    verify(persistenceService).run(any(Select.class));
  }
}
