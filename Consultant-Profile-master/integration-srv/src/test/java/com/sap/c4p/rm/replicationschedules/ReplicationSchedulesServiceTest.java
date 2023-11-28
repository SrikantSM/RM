package com.sap.c4p.rm.replicationschedules;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.environment.XSUaaVCAP;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;

import com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo;

class ReplicationSchedulesServiceTest extends InitMocks {
    private static final Marker REPLICATION_SCHEDULES = LoggingMarker.REPLICATION_SCHEDULES.getMarker();

    @Mock
    JobSchedulerService mockJobSchedulerService;

    @Mock
    OneMDSReplicationDeltaTokenDAO mockOneMDSReplicationDeltaTokenDAO;

    @Mock
    XsuaaUserInfo mockXsUaaUserInfo;

    @Mock
    XSUaaVCAP mockXsUaaVCAP;

    OneMDSDeltaTokenInfo wfOneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();
    OneMDSDeltaTokenInfo csOneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();

    @InjectMocks
    @Autowired
    ReplicationSchedulesServiceImpl classUnderTest;

    @BeforeEach
    public void setUpAll() {
        wfOneMDSDeltaTokenInfo.setEntityName(MDIEntities.WORKFORCE_PERSON.getName());
        wfOneMDSDeltaTokenInfo.setEntityName("1234");
        csOneMDSDeltaTokenInfo.setEntityName(MDIEntities.COST_CENTER.getName());
        csOneMDSDeltaTokenInfo.setEntityName("5678");

        when(mockXsUaaUserInfo.getTenant()).thenReturn("1234");
        when(mockXsUaaUserInfo.getSubDomain()).thenReturn("rm-tenant");
        when(mockXsUaaVCAP.getIdentityZone()).thenReturn("rm-provider-tenant");
    }

    @Test
    @DisplayName("test fetchJobs with jobs")
    public void testFetchJobsWithJobs() {
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", "12345");
        jsonArray.put(jsonObject);
        List<JobSchedulerInfo> jobs = new ArrayList<>();
        JobSchedulerInfo jobSchedulerInfo = new JobSchedulerInfo();
        jobSchedulerInfo.fromJson(jsonObject);
        jobs.add(jobSchedulerInfo);
        when(this.mockJobSchedulerService.getJobsByTenantId(REPLICATION_SCHEDULES, "rm-tenant", "1234"))
                .thenReturn(jsonArray);
        assertEquals(jobs, this.classUnderTest.fetchJobs());
    }

    @Test
    @DisplayName("test fetchJobs with no jobs")
    public void testFetchJobsWithNoJobs() {
        JSONArray jsonArray = new JSONArray();
        when(this.mockJobSchedulerService.getJobsByTenantId(REPLICATION_SCHEDULES, "rm-tenant", "1234"))
                .thenReturn(jsonArray);
        assertTrue(this.classUnderTest.fetchJobs().isEmpty());
    }

    @Test
    @DisplayName("test fetchJobsWithProviderContext with jobs")
    public void testFetchJobsWithJobsWithProviderContext() {
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", "12345");
        jsonArray.put(jsonObject);
        List<JobSchedulerInfo> jobs = new ArrayList<>();
        JobSchedulerInfo jobSchedulerInfo = new JobSchedulerInfo();
        jobSchedulerInfo.fromJson(jsonObject);
        jobs.add(jobSchedulerInfo);
        when(this.mockJobSchedulerService.getJobsByTenantId(REPLICATION_SCHEDULES, "rm-provider-tenant", "1234"))
                .thenReturn(jsonArray);
        assertEquals(jobs, this.classUnderTest.fetchJobsWithProviderContext());
    }

    @Test
    @DisplayName("test fetchJobsWithProviderContext with no jobs")
    public void testFetchJobsWithProviderContextWithNoJobs() {
        JSONArray jsonArray = new JSONArray();
        when(this.mockJobSchedulerService.getJobsByTenantId(REPLICATION_SCHEDULES, "rm-provider-tenant", "1234"))
                .thenReturn(jsonArray);
        assertTrue(this.classUnderTest.fetchJobsWithProviderContext().isEmpty());
    }

    @Test
    @DisplayName("test fetchJobSchedules when the JobSchedulerService returns schedules successfully")
    void fetchJobSchedulesSuccessfully() {
        List<JobSchedulerSchedule> expected = new ArrayList<>();
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        JobSchedulerSchedule costcenterSchedule = new JobSchedulerSchedule();
        costcenterSchedule.setJobName("CF_CS_1234");
        JobSchedulerSchedule workforceCapabilityschedule = new JobSchedulerSchedule();
        workforceCapabilityschedule.setJobName("SKILLS_WC_1234");
        expected.add(costcenterSchedule);
        expected.add(workforceSchedule);
        expected.add(workforceCapabilityschedule);
        when(mockJobSchedulerService.getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                "CP_WF_1234"))
                        .thenReturn(CompletableFuture.completedFuture(Collections.singletonList(workforceSchedule)));
        when(mockJobSchedulerService.getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                "CP_CS_1234"))
                        .thenReturn(CompletableFuture.completedFuture(Collections.singletonList(costcenterSchedule)));
        when(mockJobSchedulerService.getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
            "SKILLS_WC_1234"))
            .thenReturn(CompletableFuture.completedFuture(Collections.singletonList(workforceCapabilityschedule)));
        List<JobSchedulerSchedule> actual = classUnderTest.fetchJobSchedules();
        verify(this.mockJobSchedulerService, times(1))
                .getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", "CP_WF_1234");
        verify(this.mockJobSchedulerService, times(1))
                .getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", "CP_CS_1234");
        verify(this.mockJobSchedulerService, times(1))
            .getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", "SKILLS_WC_1234");
        assertIterableEquals(expected, actual);
    }

    @Test
    @DisplayName("test fetchJobSchedules when the JobSchedulerService returns an empty list")
    void fetchJobSchedulesEmptyList() {
        List<JobSchedulerSchedule> expected = new ArrayList<>();
        when(mockJobSchedulerService.getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                "CP_WF_1234")).thenReturn(CompletableFuture.completedFuture(Collections.emptyList()));
        when(mockJobSchedulerService.getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                "CP_CS_1234")).thenReturn(CompletableFuture.completedFuture(Collections.emptyList()));
        when(mockJobSchedulerService.getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
            "SKILLS_WC_1234")).thenReturn(CompletableFuture.completedFuture(Collections.emptyList()));
        List<JobSchedulerSchedule> actual = classUnderTest.fetchJobSchedules();
        verify(this.mockJobSchedulerService, times(1))
                .getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", "CP_WF_1234");
        verify(this.mockJobSchedulerService, times(1))
                .getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", "CP_CS_1234");
        verify(this.mockJobSchedulerService, times(1))
            .getJobSchedulesByName(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", "SKILLS_WC_1234");
        assertIterableEquals(expected, actual);
    }

    @Test
    @DisplayName("test fetchJobSchedule when the JobSchedulerService returns a schedule successfully")
    void fetchJobScheduleSuccessfully() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(workforceSchedule);
        JobSchedulerSchedule actual = classUnderTest.fetchJobSchedule(jobId, scheduleId, "rm-tenant");

        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
        assertEquals(workforceSchedule, actual);
    }

    @Test
    @DisplayName("test fetchJobSchedule when the JobSchedulerService returns a null schedule")
    void fetchJobScheduleNullValue() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(null);
        JobSchedulerSchedule actual = classUnderTest.fetchJobSchedule(jobId, scheduleId, "rm-tenant");

        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
        assertNull(actual);
    }

    @Test
    @DisplayName("test activateJobSchedule when the JobSchedulerService activates a schedule successfully")
    void activateJobScheduleSuccessfully() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setScheduleId(scheduleId);
        workforceSchedule.setJobId(jobId);
        JobSchedulerSchedule activeSchedule = new JobSchedulerSchedule();
        activeSchedule.setActive(Boolean.TRUE);
        when(mockJobSchedulerService.updateJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId, activeSchedule)).thenReturn(workforceSchedule);
        JobSchedulerSchedule actual = classUnderTest.activateJobSchedule(jobId, scheduleId);

        verify(this.mockJobSchedulerService, times(1)).updateJobSchedule(
                LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", scheduleId, jobId, activeSchedule);
        assertEquals(workforceSchedule, actual);
    }

    @Test
    @DisplayName("test deactivateJobSchedule when the JobSchedulerService deactivates a schedule successfully")
    void deactivateJobScheduleSuccessfully() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setScheduleId(scheduleId);
        workforceSchedule.setJobId(jobId);
        JobSchedulerSchedule inactiveSchedule = new JobSchedulerSchedule();
        inactiveSchedule.setActive(Boolean.FALSE);
        when(mockJobSchedulerService.updateJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId, inactiveSchedule)).thenReturn(workforceSchedule);
        JobSchedulerSchedule actual = classUnderTest.deactivateJobSchedule(jobId, scheduleId);

        verify(this.mockJobSchedulerService, times(1)).updateJobSchedule(
                LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", scheduleId, jobId, inactiveSchedule);
        assertEquals(workforceSchedule, actual);
    }

    @Test
    @DisplayName("test deactivateAllJobSchedules when the deactivation is not successful")
    public void testDeactivateAllJobSchedulesWithUnsuccessful() {
        when(this.mockJobSchedulerService.deactivateAllJobSchedules(REPLICATION_SCHEDULES, "rm-tenant", "12345"))
                .thenReturn(Boolean.FALSE);
        assertFalse(this.classUnderTest.deactivateAllJobSchedules("12345"));
    }

    @Test
    @DisplayName("test deactivateAllJobSchedules when the deactivation is successful")
    public void testDeactivateAllJobSchedulesWithSuccessful() {
        when(this.mockJobSchedulerService.deactivateAllJobSchedules(REPLICATION_SCHEDULES, "rm-tenant", "12345"))
                .thenReturn(Boolean.TRUE);
        assertTrue(this.classUnderTest.deactivateAllJobSchedules("12345"));
    }

    @Test
    @DisplayName("test deactivateAllJobSchedulesWithProviderContext when the deactivation is not successful")
    public void testDeactivateAllJobSchedulesWithProviderContextUnsuccessful() {
        when(this.mockJobSchedulerService.deactivateAllJobSchedules(REPLICATION_SCHEDULES, "rm-provider-tenant",
                "12345")).thenReturn(Boolean.FALSE);
        assertFalse(this.classUnderTest.deactivateAllJobSchedulesWithProviderContext("12345"));
    }

    @Test
    @DisplayName("test deactivateAllJobSchedulesWithProviderContext when the deactivation is successful")
    public void testDeactivateAllJobSchedulesWithProviderContextSuccessful() {
        when(this.mockJobSchedulerService.deactivateAllJobSchedules(REPLICATION_SCHEDULES, "rm-provider-tenant",
                "12345")).thenReturn(Boolean.TRUE);
        assertTrue(this.classUnderTest.deactivateAllJobSchedulesWithProviderContext("12345"));
    }

    @Test
    @DisplayName("test updateJobScheduleTime when the JobSchedulerService sets the time of a schedule successfully")
    void updateJobScheduleTimeSuccessfully() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setScheduleId(scheduleId);
        workforceSchedule.setJobId(jobId);
        Instant time = Instant.now();
        JobSchedulerSchedule timeSchedule = new JobSchedulerSchedule();
        timeSchedule.setTime(time.toString());
        timeSchedule.setActive(Boolean.TRUE);
        when(mockJobSchedulerService.updateJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId, timeSchedule)).thenReturn(workforceSchedule);
        JobSchedulerSchedule actual = classUnderTest.updateJobScheduleTime(jobId, scheduleId, time);

        verify(this.mockJobSchedulerService, times(1)).updateJobSchedule(
                LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", scheduleId, jobId, timeSchedule);
        assertEquals(workforceSchedule, actual);
    }

    @Test
    @DisplayName("test updateJobScheduleRepeatInterval when the JobSchedulerService sets the repeat interval of a schedule successfully")
    void updateJobScheduleRepeatIntervalSuccessfully() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setScheduleId(scheduleId);
        workforceSchedule.setJobId(jobId);
        String pattern = "30 minutes";
        workforceSchedule.setRepeatInterval(pattern);
        workforceSchedule.setActive(Boolean.TRUE);
        JobSchedulerSchedule patternSchedule = new JobSchedulerSchedule();
        patternSchedule.setRepeatInterval(pattern);
        patternSchedule.setActive(Boolean.TRUE);
        when(mockJobSchedulerService.updateJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId, patternSchedule)).thenReturn(workforceSchedule);
        JobSchedulerSchedule actual = classUnderTest.updateJobScheduleRepeatInterval(jobId, scheduleId, 30);

        verify(this.mockJobSchedulerService, times(1)).updateJobSchedule(
                LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant", scheduleId, jobId, patternSchedule);
        assertEquals(workforceSchedule, actual);
    }

    @Test
    @DisplayName("test isInitialLoadComplete for a passed business object which exists")
    void isInitialLoadCompleteObjectExists() {
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Boolean actual = classUnderTest.isInitialLoadComplete(MDIEntities.COST_CENTER);
        assertEquals(Boolean.TRUE, actual);
    }

    @Test
    @DisplayName("test isInitialLoadComplete for a passed business object - no rows")
    void isInitialLoadCompleteObjectNoRows() {
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.empty());
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Boolean actual = classUnderTest.isInitialLoadComplete(MDIEntities.COST_CENTER);
        assertEquals(Boolean.FALSE, actual);
    }

    @Test
    @DisplayName("test validateCostCenterActivation when the schedule is recurring and initial load is complete")
    void validateCostCenterActivationRecurringAndInitialLoadComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule costcenterSchedule = new JobSchedulerSchedule();
        costcenterSchedule.setJobName("CF_CS_1234");
        costcenterSchedule.setType("recurring");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(costcenterSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateCostCenterActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateCostCenterActivation when the schedule is recurring and initial load is not complete")
    void validateCostCenterActivationRecurringAndInitialLoadNotComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule costcenterSchedule = new JobSchedulerSchedule();
        costcenterSchedule.setJobName("CF_CS_1234");
        costcenterSchedule.setType("recurring");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(costcenterSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.empty());
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertThrows(ServiceException.class,
                () -> classUnderTest.validateCostCenterActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateCostCenterActivation when the schedule is one-time and initial load is complete")
    void validateCostCenterActivationOneTimeAndInitialLoadComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule costcenterSchedule = new JobSchedulerSchedule();
        costcenterSchedule.setJobName("CF_CS_1234");
        costcenterSchedule.setType("one-time");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(costcenterSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateCostCenterActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateCostCenterActivation when the schedule is one-time and initial load is not complete")
    void validateCostCenterActivationOneTimeAndInitialLoadNotComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule costcenterSchedule = new JobSchedulerSchedule();
        costcenterSchedule.setJobName("CF_CS_1234");
        costcenterSchedule.setType("one-time");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(costcenterSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.empty());
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateCostCenterActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateCostCenterActivation when the schedule is null")
    void validateCostCenterActivationNullSchedule() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(null);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateCostCenterActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceActivation when the schedule is one-time and cost center initial load is complete")
    void validateWorkforceActivationOneTimeAndInitialLoadComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setType("one-time");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(workforceSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateWorkforceActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceActivation when the schedule is one-time and cost center initial load is not complete")
    void validateWorkforceActivationOneTimeAndInitialLoadNotComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setType("one-time");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(workforceSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.empty());
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertThrows(ServiceException.class,
                () -> classUnderTest.validateWorkforceActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceActivation when the schedule is recurring and cost center initial load is not complete")
    void validateWorkforceActivationRecurringAndInitialLoadNotComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setType("recurring");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(workforceSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.empty());
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertThrows(ServiceException.class,
                () -> classUnderTest.validateWorkforceActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceActivation when the schedule is recurring and work force initial load is complete")
    void validateWorkforceActivationRecurringAndWorkForceInitialLoadComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setType("recurring");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(workforceSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.of(wfOneMDSDeltaTokenInfo));
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateWorkforceActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceActivation when the schedule is recurring and work force initial load is not complete")
    void validateWorkforceActivationRecurringAndWorkForceInitialLoadNotComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("CF_WF_1234");
        workforceSchedule.setType("recurring");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(workforceSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertThrows(ServiceException.class,
                () -> classUnderTest.validateWorkforceActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceActivation when the schedule is null")
    void validateWorkforceActivationNullSchedule() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
                scheduleId, jobId)).thenReturn(null);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER))
                .thenReturn(Optional.of(csOneMDSDeltaTokenInfo));
        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON))
                .thenReturn(Optional.empty());
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateWorkforceActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
                "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceCapabilityActivation when the schedule is recurring and work force capability initial load is complete")
    void validateWFCapabilityActivationRecurringWhenWFCapabilityInitialLoadComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("SKILLS_WC_1234");
        workforceSchedule.setType("recurring");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
            scheduleId, jobId)).thenReturn(workforceSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY))
            .thenReturn(Optional.of(wfOneMDSDeltaTokenInfo));
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateWorkforceCapabilityOneTimeActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
            "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceCapabilityActivation when the schedule is recurring and workForce capability initial load is not complete")
    void validateWFCapabilityActivationRecurringWhenWFCapabilityInitialLoadNotComplete() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        JobSchedulerSchedule workforceSchedule = new JobSchedulerSchedule();
        workforceSchedule.setJobName("SKILLS_WC_1234");
        workforceSchedule.setType("recurring");
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
            scheduleId, jobId)).thenReturn(workforceSchedule);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY))
            .thenReturn(Optional.empty());
        Assertions.assertThrows(ServiceException.class,
            () -> classUnderTest.validateWorkforceCapabilityOneTimeActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
            "rm-tenant", scheduleId, jobId);
    }

    @Test
    @DisplayName("test validateWorkforceCapabilityActivation when the schedule is null")
    void validateWFCapabilityActivationNullSchedule() {
        String scheduleId = "sche123";
        String jobId = "sche123";
        when(mockJobSchedulerService.getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(), "rm-tenant",
            scheduleId, jobId)).thenReturn(null);

        when(this.mockOneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY))
            .thenReturn(Optional.empty());
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateWorkforceCapabilityOneTimeActivation(jobId, scheduleId));
        verify(this.mockJobSchedulerService, times(1)).getJobSchedule(LoggingMarker.REPLICATION_SCHEDULES.getMarker(),
            "rm-tenant", scheduleId, jobId);
    }

}
