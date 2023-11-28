package com.sap.c4p.rm.handlers;

import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.calm.CalmService;
import com.sap.c4p.rm.calm.CalmServiceLocalImpl;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationService;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.config.local.LocalXsuaaUserInfo;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.processor.costcenter.CostCenterMDILogAPIProcessor;
import com.sap.c4p.rm.processor.costcenter.dao.CostCenterDAO;
import com.sap.c4p.rm.processor.costcenter.dto.CostCenterLog;
import com.sap.c4p.rm.processor.workforce.WorkforceMDILogAPIProcessor;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAO;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.c4p.rm.processor.workforce.dto.WorkforceLog;
import com.sap.c4p.rm.replicationdao.BusinessPurposeCompletionDetailsDAO;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.resourcemanagement.consultantprofile.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo;
import com.sap.resourcemanagement.organization.CostCenters;
import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;

public class ReplicationJobsTest extends InitMocks {
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();
    private static final Marker COST_CENTER_REPLICATION_MARKER = LoggingMarker.COST_CENTER_REPLICATION.getMarker();
    private static final String NEXT_DELTA_TOKEN = "nextDeltaToken";

    @Mock
    MasterDataIntegrationService masterDataIntegrationService;

    @Mock
    JobSchedulerService jobSchedulerService;

    @Mock
    OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;

    @Mock
    CostCenterMDILogAPIProcessor costCenterMDILogAPIProcessor;

    @Mock
    WorkforceMDILogAPIProcessor workforceMDILogAPIProcessor;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Mock
    OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo;

    @Mock
    WorkforcePersonDAO workforcePersonDAO;

    @Mock
    BusinessPurposeCompletionDetailsDAO businessPurposeCompletionDetailsDAO;

    @Mock
    CostCenterDAO costCenterDAO;
    
    @Mock
    LocalXsuaaUserInfo xsuaaUserInfo;
    
    @Mock
    CalmService calmService;

	@Mock
	ApplicationContext context;

    @Mock
    MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

    List<WorkforcePersons> workforcePersons = new ArrayList<>();

    @Autowired
    @InjectMocks
    ReplicationJobsImpl classUnderTest;

    @BeforeEach
    void setup() {
        when(oneMDSDeltaTokenInfo.getDeltaToken()).thenReturn(NEXT_DELTA_TOKEN);
    }

    @Test
    @DisplayName("test submitForWorkforceReplication with already running job")
    public void testSubmitForWorkforceReplicationWithAlreadyRunningJob() {
        when(this.jobSchedulerService.ifPreviousRunComplete(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(false);
        when(this.context.getBean("calmService")).thenReturn(new CalmServiceLocalImpl());
        this.classUnderTest.submitForWorkforceReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    }

    @Test
    @DisplayName("test submitForWorkforceReplication with no data returned from MDI CF Service")
    public void testSubmitForWorkforceReplicationWithNoDataReturnedFromMDICFService() {
        when(this.jobSchedulerService.ifPreviousRunComplete(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(true);

        WorkforcePersons workforcePerson1 = WorkforcePersons.create();
        workforcePerson1.setId(UUID.randomUUID().toString());
        workforcePerson1.setIsBusinessPurposeCompleted(Boolean.TRUE);
        MDIObjectReplicationStatus mdiObjectReplicationStatus1 = MDIObjectReplicationStatus.create();
        mdiObjectReplicationStatus1.setId(workforcePerson1.getId());
        mdiObjectReplicationStatus1.setEntityName(MDIEntities.WORKFORCE_PERSON.getName());
        mdiObjectReplicationStatus1.setExcludeStatus(Boolean.TRUE);
        WorkforcePersons workforcePerson2 = WorkforcePersons.create();
        workforcePerson2.setId(UUID.randomUUID().toString());
        workforcePerson2.setIsBusinessPurposeCompleted(Boolean.TRUE);
        MDIObjectReplicationStatus mdiObjectReplicationStatus2 = MDIObjectReplicationStatus.create();
        mdiObjectReplicationStatus2.setId(workforcePerson2.getId());
        mdiObjectReplicationStatus2.setEntityName(MDIEntities.WORKFORCE_PERSON.getName());
        mdiObjectReplicationStatus2.setExcludeStatus(Boolean.TRUE);
        BusinessPurposeCompletionDetails businessPurposeCompletionDetails1 = BusinessPurposeCompletionDetails.create();
        businessPurposeCompletionDetails1.setBusinessPurposeCompletionDate(LocalDate.of(2020, 12, 31));
        businessPurposeCompletionDetails1.setId(workforcePerson1.getId());
        BusinessPurposeCompletionDetails businessPurposeCompletionDetails2 = BusinessPurposeCompletionDetails.create();
        businessPurposeCompletionDetails2.setBusinessPurposeCompletionDate(LocalDate.of(2020, 12, 31));
        businessPurposeCompletionDetails2.setId(workforcePerson2.getId());
        when(this.workforcePersonDAO.readAll()).thenReturn(Arrays.asList(workforcePerson1, workforcePerson2));
        when(this.context.getBean("calmService")).thenReturn(new CalmServiceLocalImpl());
        when(this.businessPurposeCompletionDetailsDAO
                .readAllWithID(Arrays.asList(workforcePerson1.getId(), workforcePerson2.getId()))).thenReturn(
                        Arrays.asList(businessPurposeCompletionDetails1, businessPurposeCompletionDetails2));

        when(this.masterDataIntegrationService.getMDILogRecords(any(Marker.class), anyString(), any(MDIEntities.class),
                anyString(), any(), any(JobSchedulerRunHeader.class))).thenReturn(null);

        WorkforcePersons workforcePersonMap1 = WorkforcePersons.create();
        workforcePersonMap1.put(WorkforcePersons.ID, mdiObjectReplicationStatus1.getId());
        workforcePersonMap1.put(WorkforcePersons.IS_BUSINESS_PURPOSE_COMPLETED,
                mdiObjectReplicationStatus1.getExcludeStatus());
        WorkforcePersons workforcePersonMap2 = WorkforcePersons.create();
        workforcePersonMap2.put(WorkforcePersons.ID, mdiObjectReplicationStatus2.getId());
        workforcePersonMap2.put(WorkforcePersons.IS_BUSINESS_PURPOSE_COMPLETED,
                mdiObjectReplicationStatus2.getExcludeStatus());
        when(this.mdiObjectReplicationStatusDAO.readAll(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Arrays.asList(mdiObjectReplicationStatus1, mdiObjectReplicationStatus2));

        this.classUnderTest.submitForWorkforceReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.mdiObjectReplicationStatusDAO, times(1))
                .fillEntity(Arrays.asList(mdiObjectReplicationStatus1, mdiObjectReplicationStatus2));
        verify(this.workforcePersonDAO, times(1))
                .markBusinessPurposeComplete(Arrays.asList(workforcePersonMap1, workforcePersonMap2));
    }

    @Test
    @DisplayName("test submitForWorkforceReplication with data returned from MDI CF Service and data is not processed successfully")
    public void testSubmitForWorkforceReplicationWithDataReturnedFromMDICFServiceAndDataIsNotProcessedSuccessfully() {
        when(this.jobSchedulerService.ifPreviousRunComplete(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(true);
        WorkforceLog workforceLog = new WorkforceLog();
        workforceLog.setNextDeltaToken(NEXT_DELTA_TOKEN);
        Log log = new Log();
        List<Log> logs = new ArrayList<>();
        logs.add(log);
        workforceLog.setLog(Collections.singletonList(log));
        workforceLog.setHasMoreEvents(Boolean.FALSE);
        when(this.context.getBean("calmService")).thenReturn(new CalmServiceLocalImpl());
        when(this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.of(oneMDSDeltaTokenInfo));
        when(this.workforceMDILogAPIProcessor.processWorkforceLog(logs, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, new AtomicInteger(0)))
                .thenReturn(Collections.emptyList());
        when(this.masterDataIntegrationService.getMDILogRecords(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                MDIEntities.WORKFORCE_PERSON, NEXT_DELTA_TOKEN, WorkforceLog.class, jobSchedulerRunHeader))
                        .thenReturn(workforceLog);
        when(this.xsuaaUserInfo.getTenant()).thenReturn("");
        doNothing().when(this.oneMDSReplicationDeltaTokenDAO).save(any(Marker.class), eq(MDIEntities.WORKFORCE_PERSON),
                anyString());
        this.classUnderTest.submitForWorkforceReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(1)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    }

    @Test
    @DisplayName("test submitForWorkforceReplication with data returned from MDI CF Service and nextDeltaToken Persisting raise TransactionException")
    public void testSubmitForWorkforceReplicationWithDataReturnedFromMDICFServiceAndNextDeltaTokenPersistingRaiseTransactionException() {
        when(this.jobSchedulerService.ifPreviousRunComplete(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(true);
        WorkforceLog workforceLog = new WorkforceLog();
        workforceLog.setNextDeltaToken(NEXT_DELTA_TOKEN);
        Log log = new Log();
        List<Log> logs = new ArrayList<>();
        logs.add(log);
        workforceLog.setLog(Collections.singletonList(log));
        workforceLog.setHasMoreEvents(Boolean.FALSE);
        when(this.context.getBean("calmService")).thenReturn(new CalmServiceLocalImpl());
        when(this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.of(oneMDSDeltaTokenInfo));
        when(this.workforceMDILogAPIProcessor.processWorkforceLog(logs, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, new AtomicInteger(0)))
                .thenReturn(Collections.emptyList());
        when(this.masterDataIntegrationService.getMDILogRecords(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                MDIEntities.WORKFORCE_PERSON, NEXT_DELTA_TOKEN, WorkforceLog.class, jobSchedulerRunHeader))
                        .thenReturn(workforceLog);
        doThrow(new TransactionException()).when(this.oneMDSReplicationDeltaTokenDAO).save(any(Marker.class),
                eq(MDIEntities.WORKFORCE_PERSON), anyString());
        this.classUnderTest.submitForWorkforceReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    }

    @Test
    @DisplayName("test submitForCostCenterReplication with already running job")
    public void testSubmitForCostCenterReplicationWithAlreadyRunningJob() {
        when(this.jobSchedulerService.ifPreviousRunComplete(COST_CENTER_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(false);
        this.classUnderTest.submitForCostCenterReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    }

    @Test
    @DisplayName("test submitForCostCenterReplication with no data returned from MDI CF Service")
    public void testSubmitForCostCenterReplicationWithNoDataReturnedFromMDICFService() {
        when(this.jobSchedulerService.ifPreviousRunComplete(COST_CENTER_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(true);
        when(this.context.getBean("calmService")).thenReturn(new CalmServiceLocalImpl());

        CostCenters costCenter1 = CostCenters.create();
        costCenter1.setId(UUID.randomUUID().toString());
        costCenter1.setIsExcluded(Boolean.TRUE);
        MDIObjectReplicationStatus mdiObjectReplicationStatus1 = MDIObjectReplicationStatus.create();
        mdiObjectReplicationStatus1.setId(costCenter1.getId());
        mdiObjectReplicationStatus1.setEntityName(MDIEntities.COST_CENTER.getName());
        mdiObjectReplicationStatus1.setExcludeStatus(Boolean.TRUE);
        CostCenters costCenter2 = CostCenters.create();
        costCenter2.setId(UUID.randomUUID().toString());
        costCenter2.setIsExcluded(Boolean.TRUE);
        MDIObjectReplicationStatus mdiObjectReplicationStatus2 = MDIObjectReplicationStatus.create();
        mdiObjectReplicationStatus2.setId(costCenter2.getId());
        mdiObjectReplicationStatus2.setEntityName(MDIEntities.COST_CENTER.getName());
        mdiObjectReplicationStatus2.setExcludeStatus(Boolean.TRUE);
        when(this.costCenterDAO.readAll()).thenReturn(Arrays.asList(costCenter1, costCenter2));

        when(this.masterDataIntegrationService.getMDILogRecords(any(Marker.class), anyString(), any(MDIEntities.class),
                anyString(), any(), any(JobSchedulerRunHeader.class))).thenReturn(null);

        CostCenters costCenterExpected1 = CostCenters.create();
        costCenterExpected1.setId(mdiObjectReplicationStatus1.getId());
        costCenterExpected1.setIsExcluded(mdiObjectReplicationStatus1.getExcludeStatus());
        CostCenters costCenterExpected2 = CostCenters.create();
        costCenterExpected2.setId(mdiObjectReplicationStatus2.getId());
        costCenterExpected2.setIsExcluded(mdiObjectReplicationStatus2.getExcludeStatus());
        when(this.mdiObjectReplicationStatusDAO.readAll(MDIEntities.COST_CENTER))
                .thenReturn(Arrays.asList(mdiObjectReplicationStatus1, mdiObjectReplicationStatus2));

        this.classUnderTest.submitForCostCenterReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.mdiObjectReplicationStatusDAO, times(1))
                .fillEntity(Arrays.asList(mdiObjectReplicationStatus1, mdiObjectReplicationStatus2));
        verify(this.costCenterDAO, times(1))
                .markBusinessPurposeComplete(Arrays.asList(costCenterExpected1, costCenterExpected2));
    }

    @Test
    @DisplayName("test submitForCostCenterReplication with data returned from MDI CF Service and data is not processed successfully")
    public void testSubmitForCostCenterReplicationWithDataReturnedFromMDICFServiceAndDataIsNotProcessedSuccessfully() {
        when(this.jobSchedulerService.ifPreviousRunComplete(COST_CENTER_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(true);
        CostCenterLog costCenterLog = new CostCenterLog();
        costCenterLog.setNextDeltaToken(NEXT_DELTA_TOKEN);
        when(this.context.getBean("calmService")).thenReturn(new CalmServiceLocalImpl());
        com.sap.c4p.rm.processor.costcenter.dto.Log log = new com.sap.c4p.rm.processor.costcenter.dto.Log();
        List<com.sap.c4p.rm.processor.costcenter.dto.Log> logs = new ArrayList<>();
        logs.add(log);
        costCenterLog.setLog(Collections.singletonList(log));
        costCenterLog.setHasMoreEvents(Boolean.FALSE);
        when(this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(oneMDSDeltaTokenInfo));
        when(this.costCenterMDILogAPIProcessor.processCostCenterLog(logs, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, new AtomicInteger(0)))
                .thenReturn(Collections.emptyList());
        when(this.masterDataIntegrationService.getMDILogRecords(COST_CENTER_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                MDIEntities.COST_CENTER, NEXT_DELTA_TOKEN, CostCenterLog.class, jobSchedulerRunHeader))
                        .thenReturn(costCenterLog);
        doNothing().when(this.oneMDSReplicationDeltaTokenDAO).save(any(Marker.class), eq(MDIEntities.COST_CENTER),
                anyString());
        this.classUnderTest.submitForCostCenterReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(1)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    }

    @Test
    @DisplayName("test submitForCostCenterReplication with data returned from MDI CF Service and nextDeltaToken Persisting raise TransactionException")
    public void testSubmitForCostCenterReplicationWithDataReturnedFromMDICFServiceAndNextDeltaTokenPersistingRaiseTransactionException() {
        when(this.jobSchedulerService.ifPreviousRunComplete(COST_CENTER_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader)).thenReturn(true);
        CostCenterLog costCenterLog = new CostCenterLog();
        costCenterLog.setNextDeltaToken(NEXT_DELTA_TOKEN);
        when(this.context.getBean("calmService")).thenReturn(new CalmServiceLocalImpl());
        com.sap.c4p.rm.processor.costcenter.dto.Log log = new com.sap.c4p.rm.processor.costcenter.dto.Log();
        List<com.sap.c4p.rm.processor.costcenter.dto.Log> logs = new ArrayList<>();
        logs.add(log);
        costCenterLog.setLog(Collections.singletonList(log));
        costCenterLog.setHasMoreEvents(Boolean.FALSE);
        when(this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(oneMDSDeltaTokenInfo));
        when(this.costCenterMDILogAPIProcessor.processCostCenterLog(logs, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, new AtomicInteger(0)))
                .thenReturn(Collections.emptyList());
        when(this.masterDataIntegrationService.getMDILogRecords(COST_CENTER_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                MDIEntities.COST_CENTER, NEXT_DELTA_TOKEN, CostCenterLog.class, jobSchedulerRunHeader))
                        .thenReturn(costCenterLog);
        doThrow(new TransactionException()).when(this.oneMDSReplicationDeltaTokenDAO).save(any(Marker.class),
                eq(MDIEntities.COST_CENTER), anyString());
        this.classUnderTest.submitForCostCenterReplication(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    }

}
