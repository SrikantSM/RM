package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Row;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

public class WorkforceCapabilityCatalogReplicationDAOTest extends InitMocks {

  private static final Marker WORKFORCE_CATALOG_REPLICATION_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_CATALOG_REPLICATION
      .getMarker();

  @Mock
  Row row;

  @Mock
  WorkForceCapabilityCatalogDAO workForceCapabilityCatalogDAO;

  @Mock
  ReplicationFailureDAO replicationFailureDAO;

  @Mock
  MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  @InjectMocks
  WorkforceCapabilityCatalogReplicationDAOImpl classUnderTest;

  @Test
  @DisplayName("test save for create event of OneMDS")
  public void testSaveForCreateEventOfOneMDSWithNoReplicationFailure() {
    Catalogs catalogs = Catalogs.create();
    this.classUnderTest.save(catalogs);
    verify(this.workForceCapabilityCatalogDAO, times(1)).save(catalogs);
  }

  @Test
  @DisplayName("test save for create event of OneMDS - Replication Failures")
  public void testSaveForCreateEventOfOneMDSWithReplicationFailure() {
    Catalogs catalogs = Catalogs.create();
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    this.classUnderTest.save(catalogs, replicationFailures);
    verify(this.workForceCapabilityCatalogDAO, times(1)).save(catalogs);
    verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_CATALOG_REPLICATION_MARKER, replicationFailures);
  }

  @Test
  @DisplayName("test update for update event of OneMDS")
  public void testUpdateForUpdateEventOfOneMDSWithNoReplicationFailure() {
    Catalogs catalogs = Catalogs.create();
    this.classUnderTest.update(catalogs);
    verify(this.workForceCapabilityCatalogDAO, times(1)).update(catalogs);
  }

  @Test
  @DisplayName("test update for update event of OneMDS - Replication Failures")
  public void testUpdateForUpdateEventOfOneMDSWithReplicationFailure() {
    Catalogs catalogs = Catalogs.create();
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    this.classUnderTest.update(catalogs, replicationFailures);
    verify(this.workForceCapabilityCatalogDAO, times(1)).update(catalogs);
    verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_CATALOG_REPLICATION_MARKER, replicationFailures);
  }
}
