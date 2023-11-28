package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import static com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;

import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo;
import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo_;

public class OneMDSReplicationDeltaTokenDAOTest extends InitMocks {

  @Mock
  PersistenceService persistenceService;

  @Mock
  Result result;

  @Mock
  Marker marker;

  @Autowired
  @InjectMocks
  OneMDSReplicationDeltaTokenDAOImpl classUnderTest;

  @Captor
  ArgumentCaptor<CqnUpsert> cqnUpsertArgumentCaptor;

  @Test
  @DisplayName("test save when persistence run raise exception")
  public void testSaveWhenPersistenceRunRaiseException() {
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
    assertThrows(TransactionException.class,
        () -> this.classUnderTest.save(marker, MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, DELTA_TOKEN));
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }

  @Test
  @DisplayName("test save when persistence saves data")
  public void testSaveWhenPersistenceSavesData() {
    this.classUnderTest.save(marker, MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, DELTA_TOKEN);
    List<Map<String, Object>> filtertedEntries = new ArrayList<>();
    Map<String, Object> row = new HashMap<>();
    row.put(PERFORM_INITIAL_LOAD, false);
    row.put(ENTITY_NAME, "sap.odm.workforce.capability.WorkforceCapabilityCatalog");
    row.put(MODIFIED_AT, Instant.now());
    row.put(DELTA_TOKEN, "deltaToken");
    row.put(MODIFIED_BY, "System User");
    filtertedEntries.add(row);
    CqnUpsert cqnUpsert = Upsert.into(OneMDSDeltaTokenInfo_.CDS_NAME).entries(filtertedEntries);
    verify(this.persistenceService, times(2)).run(cqnUpsertArgumentCaptor.capture());
    List<CqnUpsert> upsertList = cqnUpsertArgumentCaptor.getAllValues();
    assertEquals(false, upsertList.get(0).entries().get(0).get("performInitialLoad"));
    assertEquals("System User", upsertList.get(0).entries().get(0).get("modifiedBy"));
  }

  @Test
  @DisplayName("test getDeltaToken when returned result does not have any row")
  public void testGetDeltaTokenWhenReturnedResultDoesNotHaveAnyRow() {
    when(this.result.first(OneMDSDeltaTokenInfo.class)).thenReturn(Optional.empty());
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    assertFalse(this.classUnderTest.getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION)
        .map(OneMDSDeltaTokenInfo::getDeltaToken).isPresent());
  }

  @Test
  @DisplayName("test getDeltaToken when result have data returned")
  public void testGetDeltaTokenWhenNoRowCount() {
    OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();
    oneMDSDeltaTokenInfo.setDeltaToken(DELTA_TOKEN);
    when(this.result.first(OneMDSDeltaTokenInfo.class)).thenReturn(Optional.of(oneMDSDeltaTokenInfo));
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    Optional<OneMDSDeltaTokenInfo> optionalOneMDSDeltaTokenInfo = this.classUnderTest
        .getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION);
    assertTrue(optionalOneMDSDeltaTokenInfo.map(OneMDSDeltaTokenInfo::getDeltaToken).isPresent());
    assertEquals(DELTA_TOKEN, optionalOneMDSDeltaTokenInfo.map(OneMDSDeltaTokenInfo::getDeltaToken).get());
  }

}
