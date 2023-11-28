package com.sap.c4p.rm.skill.mdiintegration.handlers;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MasterDataIntegrationService;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.WorkforceCapabilityCatalogMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao.WorkForceCapabilityCatalogDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.CatalogValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.WorkForceCapabilityCatalogLog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.WorkforceProficiencyScaleMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao.WorkForceProficiencyDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.OneMDSReplicationDeltaTokenDAO;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo;

public class ReplicationJobsImplTest extends InitMocks {

  private static final Marker WORKFORCE_CAPABILITY_CATALOG_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_CATALOG_REPLICATION
      .getMarker();
  private static final Marker WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION
      .getMarker();
  private static final String NEXT_DELTA_TOKEN = "nextDeltaToken";

  @Mock
  MasterDataIntegrationService masterDataIntegrationService;

  @Mock
  JobSchedulerService jobSchedulerService;

  @Mock
  OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;

  @Mock
  WorkforceCapabilityCatalogMDIEventsAPIProcessor WorkforceCapabilityCatalogMDIEventsAPIProcessor;

  @Mock
  WorkforceProficiencyScaleMDIEventsAPIProcessor workforceProficiencyScaleMDIEventsAPIProcessor;

  @Mock
  JobSchedulerRunHeader jobSchedulerRunHeader;

  @Mock
  OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo;

  @Mock
  WorkForceCapabilityCatalogDAO workForceCapabilityCatalogDAO;

  @Mock
  WorkForceProficiencyDAO workForceProficiencyDAO;

  @Spy
  MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  List<Catalogs> catalogs = new ArrayList<>();

  @Autowired
  @InjectMocks
  ReplicationJobsImpl classUnderTest;

  @BeforeEach
  void setup() {
    when(oneMDSDeltaTokenInfo.getDeltaToken()).thenReturn(NEXT_DELTA_TOKEN);
  }

  @Test
  @DisplayName("test submitForWorkforceCapabilityCatalogReplication with no data returned from MDI CF Service")
  public void testSubmitForWorkforceCapabilityCatalogReplicationWithNoDataReturnedFromMDICFService() {
    Catalogs catalogs1 = Catalogs.create();
    catalogs1.setId(UUID.randomUUID().toString());
    MDIObjectReplicationStatus mdiObjectReplicationStatus1 = MDIObjectReplicationStatus.create();
    mdiObjectReplicationStatus1.setId(catalogs1.getId());
    mdiObjectReplicationStatus1.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION.getName());
    mdiObjectReplicationStatus1.setExcludeStatus(Boolean.TRUE);
    Catalogs catalogs2 = Catalogs.create();
    catalogs2.setId(UUID.randomUUID().toString());
    MDIObjectReplicationStatus mdiObjectReplicationStatus2 = MDIObjectReplicationStatus.create();
    mdiObjectReplicationStatus2.setId(catalogs2.getId());
    mdiObjectReplicationStatus2.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION.getName());
    mdiObjectReplicationStatus2.setExcludeStatus(Boolean.TRUE);
    when(this.workForceCapabilityCatalogDAO.readAll()).thenReturn(Arrays.asList(catalogs1, catalogs2));

    when(this.masterDataIntegrationService.getMDILogRecords(any(Marker.class), anyString(), any(MDIEntities.class),
        anyString(), any(), any(JobSchedulerRunHeader.class))).thenReturn(null);

    Catalogs catalogsExpected1 = Catalogs.create();
    catalogsExpected1.setId(mdiObjectReplicationStatus1.getId());
    Catalogs catalogsExpected2 = Catalogs.create();
    catalogsExpected2.setId(mdiObjectReplicationStatus2.getId());
    when(this.mdiObjectReplicationStatusDAO.readAll(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION))
        .thenReturn(Arrays.asList(mdiObjectReplicationStatus1, mdiObjectReplicationStatus2));

    this.classUnderTest.submitForWorkforceCapabilityCatalogReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
    verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
  }

  @Test
  @DisplayName("test submitForWorkforceCapabilityCatalogReplication with data returned from MDI CF Service and data is not processed successfully")
  public void testSubmitForWorkforceCapabilityCatalogReplicationWithDataReturnedFromMDICFServiceAndDataIsNotProcessedSuccessfully() {

    WorkForceCapabilityCatalogLog workForceCapabilityCatalogLog = new WorkForceCapabilityCatalogLog();
    workForceCapabilityCatalogLog.setDeltaLink(NEXT_DELTA_TOKEN);
    CatalogValue value = new CatalogValue();
    List<CatalogValue> catalogValues = new ArrayList<>();
    catalogValues.add(value);
    workForceCapabilityCatalogLog.setValue(Collections.singletonList(value));
    workForceCapabilityCatalogLog.setNextLink(null);

    when(this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION))
        .thenReturn(Optional.of(oneMDSDeltaTokenInfo));
    when(this.WorkforceCapabilityCatalogMDIEventsAPIProcessor.processWorkforceCapabilityCatalogLog(catalogValues,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader)).thenReturn(0);
    when(this.masterDataIntegrationService.getMDILogRecords(WORKFORCE_CAPABILITY_CATALOG_REPLICATION,
        CONSUMER_SUB_DOMAIN, MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, NEXT_DELTA_TOKEN,
        WorkForceCapabilityCatalogLog.class, jobSchedulerRunHeader)).thenReturn(workForceCapabilityCatalogLog);
    doNothing().when(this.oneMDSReplicationDeltaTokenDAO).save(any(Marker.class),
        eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION), anyString());
    this.classUnderTest.submitForWorkforceCapabilityCatalogReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
    verify(this.jobSchedulerService, times(1)).updateJobRun(any(Marker.class), anyString(),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
  }

  @Test
  @DisplayName("test submitForWorkforceCapabilityCatalogReplication with data returned from MDI CF Service and nextDeltaToken Persisting raise TransactionException")
  public void testSubmitForWorkforceCapabilityCatalogReplicationWithDataReturnedFromMDICFServiceAndNextDeltaTokenPersistingRaiseTransactionException() {

    WorkForceCapabilityCatalogLog workForceCapabilityCatalogLog = new WorkForceCapabilityCatalogLog();
    workForceCapabilityCatalogLog.setDeltaLink(NEXT_DELTA_TOKEN);
    CatalogValue value = new CatalogValue();
    List<CatalogValue> catalogValues = new ArrayList<>();
    catalogValues.add(value);
    workForceCapabilityCatalogLog.setValue(Collections.singletonList(value));
    workForceCapabilityCatalogLog.setNextLink(null);
    when(this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION))
        .thenReturn(Optional.of(oneMDSDeltaTokenInfo));
    when(this.WorkforceCapabilityCatalogMDIEventsAPIProcessor.processWorkforceCapabilityCatalogLog(catalogValues,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader)).thenReturn(0);
    when(this.masterDataIntegrationService.getMDILogRecords(WORKFORCE_CAPABILITY_CATALOG_REPLICATION,
        CONSUMER_SUB_DOMAIN, MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, NEXT_DELTA_TOKEN,
        WorkForceCapabilityCatalogLog.class, jobSchedulerRunHeader)).thenReturn(workForceCapabilityCatalogLog);
    doThrow(new TransactionException()).when(this.oneMDSReplicationDeltaTokenDAO).save(any(Marker.class),
        eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION), anyString());
    this.classUnderTest.submitForWorkforceCapabilityCatalogReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
    verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
  }

}
