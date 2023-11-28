package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao;

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

import com.sap.resourcemanagement.skill.Catalogs;

public class WorkForceCapabilityCatalogDAOTest extends InitMocks {

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
  Catalogs mockCatalogs;

  @Autowired
  @InjectMocks
  WorkForceCapabilityCatalogDAOImpl classUnderTest;

  @Test
  @DisplayName("test save when persistence run raise exception")
  public void testSaveWhenPersistenceRunRaiseException() {
    Catalogs catalogs = Catalogs.create();
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnInsert.class));
    assertThrows(TransactionException.class, () -> this.classUnderTest.save(catalogs));
    verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
  }

  @Test
  @DisplayName("test save when persistence do not raise exception")
  public void testSaveWhenPersistenceDoNotRaiseException() {
    Catalogs catalogs = Catalogs.create();
    this.classUnderTest.save(catalogs);
    verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
  }

  @Test
  @DisplayName("test update when persistence run raise exception")
  public void testUpdateWhenPersistenceRunRaiseException() {
    Catalogs catalogs = Catalogs.create();
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpdate.class));
    assertThrows(TransactionException.class, () -> this.classUnderTest.update(catalogs));
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
  }

  @Test
  @DisplayName("test update when persistence do not raise exception")
  public void testUpdateWhenPersistenceDoNotRaiseException() {
    Catalogs catalogs = Catalogs.create();
    this.classUnderTest.update(catalogs);
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
  }

  @Test
  @DisplayName("test readAll with no catalog records")
  public void testReadAllWithNoCatalogRecords() {
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    when(this.result.listOf(Catalogs.class)).thenReturn(Collections.emptyList());
    assertTrue(this.classUnderTest.readAll().isEmpty());
  }

  @Test
  @DisplayName("test readAll with catalog records")
  public void testReadAllWithCatalogRecords() {
    Catalogs catalogs = Catalogs.create();
    List<Catalogs> workforcePersonsList = new ArrayList<>();
    workforcePersonsList.add(catalogs);
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    when(this.result.listOf(Catalogs.class)).thenReturn(workforcePersonsList);
    assertEquals(workforcePersonsList, this.classUnderTest.readAll());
  }

  @Test
  @DisplayName("test getExistingCatalogs with catalog records - not null")
  public void testGetExistingCatalogsWithCatalogRecords() {
    String catalogID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(Collections.singletonList(row).iterator());
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    when(result.single()).thenReturn(row);
    Row finalResult = this.classUnderTest.getExistingCatalog(catalogID);
    verify(this.persistenceService).run(any(Select.class));
    assertNotNull(finalResult);
  }

  @Test
  @DisplayName("test getExistingCatalogs with catalog records - null")
  public void testGetExistingCatalogsWithNullCatalogRecords() {
    String catalogID = UUID.randomUUID().toString();
    when(result.iterator()).thenReturn(iterator);
    when(result.single()).thenReturn(null);
    when(this.persistenceService.run(any(Select.class))).thenReturn(result);
    Row finalResult = this.classUnderTest.getExistingCatalog(catalogID);
    assertNull(finalResult);
    verify(persistenceService).run(any(Select.class));
  }
}
