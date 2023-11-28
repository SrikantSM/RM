package com.sap.c4p.rm.handlers;

import static com.sap.c4p.rm.handlers.MyBackgroundJobsImpl.HOUSE_KEEPER_JOB;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.environment.CFUserProvidedEnvironment;
import com.sap.c4p.rm.cloudfoundry.environment.XSUaaVCAP;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerServiceImpl;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerSymbols;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.model.Subscription;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.model.TenantSubscriptions;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.service.SaasRegistryServiceImpl;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.utils.StringFormatter;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public class MyBackgroundJobsTest extends InitMocks {

    private final Logger logger = (Logger) LoggerFactory.getLogger(MyBackgroundJobsImpl.class);
    private static final Marker CREATE_TENANT_JOB_MARKER = LoggingMarker.CREATE_TENANT_JOBS.getMarker();
    private static final Marker HOUSE_KEEPER_JOB_MARKER = LoggingMarker.HOUSE_KEEPER_JOB.getMarker();

    private static final String EXPECTED_APPLICATION_URL = "dummyUrl.com";
    private static final String PROVIDER_TENANT_ID = "providerTenantId";
    private static final String PROVIDER_SUB_DOMAIN = "providerSubDomain";
    private static final String CONSUMER_TENANT_ID = "consumerTenantId";
    private static final String CONSUMER_SUB_DOMAIN = "consumerSubDomain";
    private static final String SKILLS_URL = "dummySkills.com";

    private ListAppender<ILoggingEvent> listAppender;
    private final List<Subscription> subscriptionList = new ArrayList<>();
    private final String workforceJobName = StringFormatter
            .format("{0}_{1}_{2}", "CP", JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol(), CONSUMER_TENANT_ID)
            .replace("-", "");
    private final String costCenterJobName = StringFormatter
            .format("{0}_{1}_{2}", "CP", JobSchedulerSymbols.COST_CENTER.getSymbol(), CONSUMER_TENANT_ID)
            .replace("-", "");
    private final String timeDimensionJobName = StringFormatter
            .format("{0}_{1}_{2}", "CP", JobSchedulerSymbols.TIME_DIMENSION.getSymbol(), CONSUMER_TENANT_ID)
            .replace("-", "");
    private final String workforceCapabilityJobName = StringFormatter
        .format("{0}_{1}_{2}", "SKILLS", JobSchedulerSymbols.WORKFORCE_CAPABILITY.getSymbol(), CONSUMER_TENANT_ID)
        .replace("-", "");

    @Mock
    JobSchedulerServiceImpl jobSchedulerService;

    @Mock
    SaasRegistryServiceImpl saasRegistryService;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Mock
    XSUaaVCAP xsUaaVCAP;

    @Mock
    CFUserProvidedEnvironment cfUserProvidedEnvironment;

    @Mock
    TenantSubscriptions subscriptions;

    @Mock
    Subscription subscription;

    private MyBackgroundJobs classUnderTest;

    @BeforeEach
    public void setUp() {
        when(this.xsUaaVCAP.getIdentityZone()).thenReturn(PROVIDER_SUB_DOMAIN);
        when(this.xsUaaVCAP.getTenantId()).thenReturn(PROVIDER_TENANT_ID);
        this.subscriptionList.add(subscription);
        when(this.cfUserProvidedEnvironment.getApplicationUri()).thenReturn(EXPECTED_APPLICATION_URL);
        when(this.cfUserProvidedEnvironment.getSkillsUri()).thenReturn(SKILLS_URL);
        when(this.saasRegistryService.getActiveSubscriptions(CREATE_TENANT_JOB_MARKER)).thenReturn(subscriptions);
        when(this.subscriptions.getSubscriptions()).thenReturn(subscriptionList);
        when(this.subscription.getSubdomain()).thenReturn(CONSUMER_SUB_DOMAIN);
        when(this.subscription.getConsumerTenantId()).thenReturn(CONSUMER_TENANT_ID);
        this.classUnderTest = new MyBackgroundJobsImpl(cfUserProvidedEnvironment, jobSchedulerService,
                saasRegistryService, xsUaaVCAP);
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(listAppender);
    }

    @Test
    @DisplayName("test submitForHouseKeeperJob when request to fetch houseKeeper jobs returns null created.")
    public void testSubmitForHouseKeeperJobWithNullResponse() {
        when(this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                PROVIDER_TENANT_ID)).thenReturn(null);
        this.classUnderTest.submitForHouseKeeperJob();
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        ILoggingEvent infoLog = logsList.get(0);
        ILoggingEvent errorLog = logsList.get(1);
        assertEquals("Checking for houseKeeper Job", infoLog.getFormattedMessage());
        assertEquals(Level.INFO, infoLog.getLevel());
        assertEquals("HouseKeeper job has not been created", errorLog.getFormattedMessage());
        assertEquals(Level.ERROR, errorLog.getLevel());
    }

    @Test
    @DisplayName("test submitForHouseKeeperJob when no job is found for provider tenant. then create houseKeeperJob. Then create houseKeeper job wth failure.")
    public void testSubmitForHouseKeeperJobWhenNoJobIsFoundForProviderTenantCreateWithFailure() {
        JSONArray jsonArray = new JSONArray();
        when(this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                PROVIDER_TENANT_ID)).thenReturn(jsonArray);
        when(this.jobSchedulerService.createJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn(null);
        this.classUnderTest.submitForHouseKeeperJob();
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        ILoggingEvent checkHouseKeeperJob = logsList.get(0);
        ILoggingEvent createJobStatus = logsList.get(1);
        assertEquals("Checking for houseKeeper Job", checkHouseKeeperJob.getFormattedMessage());
        assertEquals(Level.INFO, checkHouseKeeperJob.getLevel());
        assertEquals("HouseKeeper job has not been created", createJobStatus.getFormattedMessage());
        assertEquals(Level.ERROR, createJobStatus.getLevel());
    }

    @Test
    @DisplayName("test submitForHouseKeeperJob when no job is found for provider tenant. then create houseKeeperJob. Then create houseKeeper job wth success.")
    public void testSubmitForHouseKeeperJobWhenNoJobIsFoundForProviderTenantCreateWithSuccess() {
        JSONArray jsonArray = new JSONArray();
        when(this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                PROVIDER_SUB_DOMAIN)).thenReturn(jsonArray);
        when(this.jobSchedulerService.createJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn("created");
        this.classUnderTest.submitForHouseKeeperJob();
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        ILoggingEvent checkHouseKeeperJob = logsList.get(0);
        ILoggingEvent createJobStatus = logsList.get(1);
        assertEquals("Checking for houseKeeper Job", checkHouseKeeperJob.getFormattedMessage());
        assertEquals(Level.INFO, checkHouseKeeperJob.getLevel());
        assertEquals("HouseKeeper job has been created", createJobStatus.getFormattedMessage());
        assertEquals(Level.INFO, createJobStatus.getLevel());
    }

    @Test
    @DisplayName("test submitForHouseKeeperJob when houseKeeper job is not found in tenants jobs . then create houseKeeperJob.")
    public void testSubmitForHouseKeeperJobWithHouseKeeperJobsAndUpdate() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(JobSchedulerInfo.KEY_NAME, JobSchedulerInfo.KEY_NAME);
        JSONArray jsonArray = new JSONArray();
        jsonArray.put(jsonObject);
        when(this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                PROVIDER_TENANT_ID)).thenReturn(jsonArray);
        when(this.jobSchedulerService.createJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn("created");
        this.classUnderTest.submitForHouseKeeperJob();
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        ILoggingEvent checkHouseKeeperJob = logsList.get(0);
        ILoggingEvent createJobStatus = logsList.get(1);
        assertEquals("Checking for houseKeeper Job", checkHouseKeeperJob.getFormattedMessage());
        assertEquals(Level.INFO, checkHouseKeeperJob.getLevel());
        assertEquals("HouseKeeper job has been created", createJobStatus.getFormattedMessage());
        assertEquals(Level.INFO, createJobStatus.getLevel());
    }

    @Test
    @DisplayName("test submitForHouseKeeperJob when found houseKeeper job is inactive. then reactivate the houseKeeper job with Failure.")
    public void testSubmitForHouseKeeperJobWithHouseKeeperJobsIsActiveAndActiveWithFailure() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(JobSchedulerInfo.KEY_NAME, HOUSE_KEEPER_JOB);
        jsonObject.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.FALSE);
        JSONArray jsonArray = new JSONArray();
        jsonArray.put(jsonObject);
        when(this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                PROVIDER_TENANT_ID)).thenReturn(jsonArray);
        when(this.jobSchedulerService.updateJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn(null);
        this.classUnderTest.submitForHouseKeeperJob();
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        ILoggingEvent checkHouseKeeperJob = logsList.get(0);
        ILoggingEvent updateJobStatus = logsList.get(1);
        assertEquals("Checking for houseKeeper Job", checkHouseKeeperJob.getFormattedMessage());
        assertEquals(Level.INFO, checkHouseKeeperJob.getLevel());
        assertEquals("HouseKeeper job has not been updated", updateJobStatus.getFormattedMessage());
        assertEquals(Level.ERROR, updateJobStatus.getLevel());
    }

    @Test
    @DisplayName("test submitForHouseKeeperJob when found houseKeeper job is inactive. then reactivate the houseKeeper job with Success.")
    public void testSubmitForHouseKeeperJobWithHouseKeeperJobsIsActiveAndActiveWithSuccess() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(JobSchedulerInfo.KEY_NAME, HOUSE_KEEPER_JOB);
        jsonObject.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.FALSE);
        JSONArray jsonArray = new JSONArray();
        jsonArray.put(jsonObject);
        when(this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                PROVIDER_TENANT_ID)).thenReturn(jsonArray);
        when(this.jobSchedulerService.updateJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn("updated");
        this.classUnderTest.submitForHouseKeeperJob();
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        ILoggingEvent checkHouseKeeperJob = logsList.get(0);
        ILoggingEvent updateJobStatus = logsList.get(1);
        assertEquals("Checking for houseKeeper Job", checkHouseKeeperJob.getFormattedMessage());
        assertEquals(Level.INFO, checkHouseKeeperJob.getLevel());
        assertEquals("HouseKeeper job has been updated", updateJobStatus.getFormattedMessage());
        assertEquals(Level.INFO, updateJobStatus.getLevel());
    }

    @Test
    @DisplayName("test submitForHouseKeeperJob when the houseKeeper job is active. then also reactivate the houseKeeper job.")
    public void testSubmitForHouseKeeperJobWithNoHouseKeeperJobsAndCreate() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(JobSchedulerInfo.KEY_NAME, HOUSE_KEEPER_JOB);
        jsonObject.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.TRUE);
        JSONArray jsonArray = new JSONArray();
        jsonArray.put(jsonObject);
        when(this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                PROVIDER_TENANT_ID)).thenReturn(jsonArray);
        when(this.jobSchedulerService.updateJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn("updated");
        this.classUnderTest.submitForHouseKeeperJob();
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        ILoggingEvent checkHouseKeeperJob = logsList.get(0);
        ILoggingEvent updateJobStatus = logsList.get(1);
        assertEquals("Checking for houseKeeper Job", checkHouseKeeperJob.getFormattedMessage());
        assertEquals(Level.INFO, checkHouseKeeperJob.getLevel());
        assertEquals("HouseKeeper job has been updated", updateJobStatus.getFormattedMessage());
        assertEquals(Level.INFO, updateJobStatus.getLevel());
    }

    @Test
    @DisplayName("test submitForTenantJobs with already running job")
    public void testSubmitForTenantJobsWithAlreadyRunningJob() {
        when(this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(false);
        this.classUnderTest.submitForTenantJobs(this.jobSchedulerRunHeader);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(0, logsList.size());
    }

    @Test
    @DisplayName("test submitForTenantJobs with no subscription. Then do nothing")
    public void testSubmitForTenantJobsWithNoSubscription() {
        when(this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        when(this.saasRegistryService.getActiveSubscriptions(CREATE_TENANT_JOB_MARKER)).thenReturn(null);
        this.classUnderTest.submitForTenantJobs(this.jobSchedulerRunHeader);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        ILoggingEvent checkSubscriptions = logsList.get(0);
        assertEquals("No Subscribed/Consumer tenant found", checkSubscriptions.getFormattedMessage());
        assertEquals(Level.ERROR, checkSubscriptions.getLevel());
    }

    @Test
    @DisplayName("test submitForTenantJobs with null. Then create replication jobs with failure.")
    public void testSubmitForTenantJobsWithNullAndJobCreationFails() {
        when(this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        when(this.jobSchedulerService.getJobsByTenantId(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                CONSUMER_TENANT_ID)).thenReturn(null);
        when(this.jobSchedulerService.createJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn(null);
        this.classUnderTest.submitForTenantJobs(this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(4)).createJob(any(Marker.class), anyString(),
                any(JobSchedulerInfo.class));
        verify(this.jobSchedulerService, times(5)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(5, logsList.size());
        ILoggingEvent workforceReplicationJobCreated = logsList.get(0);
        ILoggingEvent costCenterReplicationJobCreated = logsList.get(1);
        ILoggingEvent timeDimensionJobCreated = logsList.get(2);
        ILoggingEvent workforceCapabilityReplicationJobCreated = logsList.get(3);
        ILoggingEvent tenantJobCreationStatus = logsList.get(4);
        assertEquals("CP_WF_consumerTenantId has not been created for subDomain consumerSubDomain",
                workforceReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.ERROR, workforceReplicationJobCreated.getLevel());
        assertEquals("CP_CS_consumerTenantId has not been created for subDomain consumerSubDomain",
                costCenterReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.ERROR, costCenterReplicationJobCreated.getLevel());
        assertEquals("CP_TD_consumerTenantId has not been created for subDomain consumerSubDomain",
                timeDimensionJobCreated.getFormattedMessage());
        assertEquals(Level.ERROR, timeDimensionJobCreated.getLevel());
        assertEquals("SKILLS_WC_consumerTenantId has not been created for subDomain consumerSubDomain",
            workforceCapabilityReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.ERROR, workforceCapabilityReplicationJobCreated.getLevel());
        assertEquals(
                "Tenant Specific Jobs creation has been failed. Kindly check full history of run for further details.",
                tenantJobCreationStatus.getFormattedMessage());
        assertEquals(Level.ERROR, tenantJobCreationStatus.getLevel());
    }

    @Test
    @DisplayName("Test submitForTenantJobs with no tenant's jobs. Then create replication jobs with failure.")
    public void testSubmitForTenantJobsWithNoTenantJobsAndJobCreationFails() {
        when(this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        JSONArray jsonArray = new JSONArray();
        when(this.jobSchedulerService.getJobsByTenantId(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                CONSUMER_TENANT_ID)).thenReturn(jsonArray);
        when(this.jobSchedulerService.createJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn(null);
        this.classUnderTest.submitForTenantJobs(this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(4)).createJob(any(Marker.class), anyString(),
                any(JobSchedulerInfo.class));
        verify(this.jobSchedulerService, times(5)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(5, logsList.size());
        ILoggingEvent workforceReplicationJobCreated = logsList.get(0);
        ILoggingEvent costCenterReplicationJobCreated = logsList.get(1);
        ILoggingEvent timeDimensionJobCreated = logsList.get(2);
        ILoggingEvent workforceCapabilityReplicationJobCerated = logsList.get(3);
        ILoggingEvent tenantJobCreationStatus = logsList.get(4);
        assertEquals("CP_WF_consumerTenantId has not been created for subDomain consumerSubDomain",
                workforceReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.ERROR, workforceReplicationJobCreated.getLevel());
        assertEquals("CP_CS_consumerTenantId has not been created for subDomain consumerSubDomain",
                costCenterReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.ERROR, costCenterReplicationJobCreated.getLevel());
        assertEquals("CP_TD_consumerTenantId has not been created for subDomain consumerSubDomain",
                timeDimensionJobCreated.getFormattedMessage());
        assertEquals(Level.ERROR, timeDimensionJobCreated.getLevel());
        assertEquals("SKILLS_WC_consumerTenantId has not been created for subDomain consumerSubDomain",
            workforceCapabilityReplicationJobCerated.getFormattedMessage());
        assertEquals(Level.ERROR, workforceCapabilityReplicationJobCerated.getLevel());
        assertEquals(
                "Tenant Specific Jobs creation has been failed. Kindly check full history of run for further details.",
                tenantJobCreationStatus.getFormattedMessage());
        assertEquals(Level.ERROR, tenantJobCreationStatus.getLevel());
    }

    @Test
    @DisplayName("Test submitForTenantJobs with no tenant's jobs. Then create replication jobs with success.")
    public void testSubmitForTenantJobsWithNoTenantJobsAndJobCreationSucceed() {
        when(this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        JSONArray jobs = new JSONArray();
        when(this.jobSchedulerService.getJobsByTenantId(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                CONSUMER_TENANT_ID)).thenReturn(jobs);
        when(this.jobSchedulerService.createJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn("created");
        this.classUnderTest.submitForTenantJobs(this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(4)).createJob(any(Marker.class), anyString(),
                any(JobSchedulerInfo.class));
        verify(this.jobSchedulerService, times(5)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(5, logsList.size());
        ILoggingEvent workforceReplicationJobCreated = logsList.get(0);
        ILoggingEvent costCenterReplicationJobCreated = logsList.get(1);
        ILoggingEvent timeDimensionJobCreated = logsList.get(2);
        ILoggingEvent workforceCapabilityReplicationJobCreated = logsList.get(3);
        ILoggingEvent tenantJobCreationStatus = logsList.get(4);
        assertEquals("CP_WF_consumerTenantId has been created for subDomain consumerSubDomain",
                workforceReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, workforceReplicationJobCreated.getLevel());
        assertEquals("CP_CS_consumerTenantId has been created for subDomain consumerSubDomain",
                costCenterReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, costCenterReplicationJobCreated.getLevel());
        assertEquals("CP_TD_consumerTenantId has been created for subDomain consumerSubDomain",
                timeDimensionJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, workforceCapabilityReplicationJobCreated.getLevel());
        assertEquals("SKILLS_WC_consumerTenantId has been created for subDomain consumerSubDomain",
            workforceCapabilityReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, timeDimensionJobCreated.getLevel());
        assertEquals("Tenant Specific Jobs has been created successfully.",
                tenantJobCreationStatus.getFormattedMessage());
        assertEquals(Level.INFO, tenantJobCreationStatus.getLevel());
    }

    @Test
    @DisplayName("Test submitForTenantJobs with tenant's jobs and no replication jobs. Then create replication jobs.")
    public void testSubmitForTenantJobsWithTenantJobsAndNoReplicationJobsAndJobCreationSucceed() {
        when(this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        JSONObject nonReplicationJob = new JSONObject();
        nonReplicationJob.put(JobSchedulerInfo.KEY_NAME, JobSchedulerInfo.KEY_NAME);
        JSONArray jobs = new JSONArray();
        jobs.put(nonReplicationJob);
        when(this.jobSchedulerService.getJobsByTenantId(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                CONSUMER_TENANT_ID)).thenReturn(jobs);
        when(this.jobSchedulerService.createJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn("created");
        this.classUnderTest.submitForTenantJobs(this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(4)).createJob(any(Marker.class), anyString(),
                any(JobSchedulerInfo.class));
        verify(this.jobSchedulerService, times(5)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(5, logsList.size());
        ILoggingEvent workforceReplicationJobCreated = logsList.get(0);
        ILoggingEvent costCenterReplicationJobCreated = logsList.get(1);
        ILoggingEvent timeDimensionJobCreated = logsList.get(2);
        ILoggingEvent workforceCapabilityJobCreated = logsList.get(3);
        ILoggingEvent tenantJobCreationStatus = logsList.get(4);
        assertEquals("CP_WF_consumerTenantId has been created for subDomain consumerSubDomain",
                workforceReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, workforceReplicationJobCreated.getLevel());
        assertEquals("CP_CS_consumerTenantId has been created for subDomain consumerSubDomain",
                costCenterReplicationJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, costCenterReplicationJobCreated.getLevel());
        assertEquals("CP_TD_consumerTenantId has been created for subDomain consumerSubDomain",
                timeDimensionJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, timeDimensionJobCreated.getLevel());
        assertEquals("SKILLS_WC_consumerTenantId has been created for subDomain consumerSubDomain",
            workforceCapabilityJobCreated.getFormattedMessage());
        assertEquals(Level.INFO, workforceCapabilityJobCreated.getLevel());
        assertEquals("Tenant Specific Jobs has been created successfully.",
                tenantJobCreationStatus.getFormattedMessage());
        assertEquals(Level.INFO, tenantJobCreationStatus.getLevel());
    }

    @Test
    @DisplayName("Test submitForTenantJobs with tenant's specific replication jobs found. Then Do nothing.")
    public void testSubmitForTenantJobsWithTenantJobsAndReplicationJobsWithActiveSchedulesFound() {
        when(this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        JSONObject activeScheduleForWorkforceReplication = new JSONObject();
        JSONObject activeScheduleForCostCenterReplication = new JSONObject();
        JSONObject activeScheduleForTimeDimension = new JSONObject();
        JSONObject activeScheduleForWorkforceCapabilityReplication = new JSONObject();
        activeScheduleForWorkforceReplication.put(JobSchedulerSchedule.KEY_ACTIVE, Boolean.TRUE);
        activeScheduleForCostCenterReplication.put(JobSchedulerSchedule.KEY_ACTIVE, Boolean.TRUE);
        activeScheduleForTimeDimension.put(JobSchedulerSchedule.KEY_ACTIVE, Boolean.TRUE);
        activeScheduleForWorkforceCapabilityReplication.put(JobSchedulerSchedule.KEY_ACTIVE, Boolean.TRUE);
        JSONArray workforceReplicationSchedules = new JSONArray();
        JSONArray costCenterReplicationSchedules = new JSONArray();
        JSONArray timeDimensionSchedules = new JSONArray();
        JSONArray workforceCapabilityReplicationSchedules = new JSONArray();
        workforceReplicationSchedules.put(activeScheduleForWorkforceReplication);
        costCenterReplicationSchedules.put(activeScheduleForCostCenterReplication);
        timeDimensionSchedules.put(activeScheduleForTimeDimension);
        workforceCapabilityReplicationSchedules.put(activeScheduleForWorkforceCapabilityReplication);
        JSONObject scheduledWorkforceReplicationJob = new JSONObject();
        JSONObject scheduledCostCenterReplicationJob = new JSONObject();
        JSONObject scheduledTimeDimensionJob = new JSONObject();
        JSONObject scheduledWorkforceCapabilityJob = new JSONObject();
        scheduledWorkforceReplicationJob.put(JobSchedulerInfo.KEY_NAME, this.workforceJobName);
        scheduledWorkforceReplicationJob.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.TRUE);
        scheduledWorkforceReplicationJob.put(JobSchedulerInfo.KEY_SCHEDULES, workforceReplicationSchedules);
        scheduledCostCenterReplicationJob.put(JobSchedulerInfo.KEY_NAME, this.costCenterJobName);
        scheduledCostCenterReplicationJob.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.TRUE);
        scheduledCostCenterReplicationJob.put(JobSchedulerInfo.KEY_SCHEDULES, costCenterReplicationSchedules);
        scheduledTimeDimensionJob.put(JobSchedulerInfo.KEY_NAME, this.timeDimensionJobName);
        scheduledTimeDimensionJob.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.TRUE);
        scheduledTimeDimensionJob.put(JobSchedulerInfo.KEY_SCHEDULES, timeDimensionSchedules);
        scheduledWorkforceCapabilityJob.put(JobSchedulerInfo.KEY_NAME, this.workforceCapabilityJobName);
        scheduledWorkforceCapabilityJob.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.TRUE);
        scheduledWorkforceCapabilityJob.put(JobSchedulerInfo.KEY_SCHEDULES, workforceCapabilityReplicationSchedules);
        JSONArray jobs = new JSONArray();
        jobs.put(scheduledWorkforceReplicationJob);
        jobs.put(scheduledCostCenterReplicationJob);
        jobs.put(scheduledTimeDimensionJob);
        jobs.put(scheduledWorkforceCapabilityJob);
        when(this.jobSchedulerService.getJobsByTenantId(CREATE_TENANT_JOB_MARKER, PROVIDER_SUB_DOMAIN,
                CONSUMER_TENANT_ID)).thenReturn(jobs);
        when(this.jobSchedulerService.updateJob(any(Marker.class), anyString(), any(JobSchedulerInfo.class)))
                .thenReturn("updated");
        this.classUnderTest.submitForTenantJobs(this.jobSchedulerRunHeader);
        verify(this.jobSchedulerService, times(1)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        ILoggingEvent tenantJobCreationStatus = logsList.get(0);
        assertEquals("Tenant Specific Jobs has been created successfully.",
                tenantJobCreationStatus.getFormattedMessage());
        assertEquals(Level.INFO, tenantJobCreationStatus.getLevel());
    }
}
