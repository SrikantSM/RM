package com.sap.c4p.rm.controller;

import static com.sap.c4p.rm.TestConstants.APPLICATION_PASSWORD;
import static com.sap.c4p.rm.TestConstants.APPLICATION_USER;
import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.TestConstants.DELTA_LOAD_RESPONSE;
import static com.sap.c4p.rm.TestConstants.DESTINATION_RESPONSE;
import static com.sap.c4p.rm.TestConstants.EMPTY_DESTINATION_RESPONSE;
import static com.sap.c4p.rm.TestConstants.EMPTY_MDI_RESPONSE;
import static com.sap.c4p.rm.TestConstants.ERROR_RESPONSE;
import static com.sap.c4p.rm.TestConstants.ERROR_RESPONSE_DELTA_TOKEN_DOES_NOT_MATCH;
import static com.sap.c4p.rm.TestConstants.ERROR_RESPONSE_DELTA_TOKEN_MISMATCH;
import static com.sap.c4p.rm.TestConstants.INITIAL_LOAD_RESPONSE;
import static com.sap.c4p.rm.TestConstants.JOB_SCHEDULER_PREVIOUS_RUN_FOUND;
import static com.sap.c4p.rm.TestConstants.JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND;
import static com.sap.c4p.rm.TestConstants.PAGE_SIZE;
import static com.sap.c4p.rm.TestConstants.RE_TRIGGER_INITIAL_LOAD_RESPONSE;
import static com.sap.c4p.rm.TestConstants.RUNS;
import static com.sap.c4p.rm.TestConstants.SCHEDULES;
import static com.sap.c4p.rm.TestConstants.SLEEP_TIMEOUT;
import static com.sap.c4p.rm.TestConstants.X_SAP_JOB_ID;
import static com.sap.c4p.rm.TestConstants.X_SAP_JOB_RUN_ID;
import static com.sap.c4p.rm.TestConstants.X_SAP_JOB_SCHEDULE_ID;
import static com.sap.c4p.rm.TestConstants.X_SAP_RUN_AT;
import static com.sap.c4p.rm.TestConstants.X_SAP_SCHEDULER_HOST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.c4p.rm.Application;
import com.sap.c4p.rm.IntegrationTestHelper;
import com.sap.c4p.rm.calm.CalmConstants;
import com.sap.c4p.rm.calm.CalmService;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.cloudfoundry.authclient.DestinationToken;
import com.sap.c4p.rm.cloudfoundry.authclient.JobSchedulerToken;
import com.sap.c4p.rm.cloudfoundry.authclient.MasterDataIntegrationToken;
import com.sap.c4p.rm.cloudfoundry.service.destination.service.DestinationService;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationServiceImpl;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.c4p.rm.processor.workforce.WorkforceMDILogAPIProcessor;
import com.sap.c4p.rm.processor.workforce.dto.WorkforceLog;
import com.sap.c4p.rm.replicationdao.ExistingCustomerDetailDAO;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary_;
import com.sap.resourcemanagement.employee.Headers_;
import com.sap.resourcemanagement.employee.ProfilePhoto;
import com.sap.resourcemanagement.employee.ProfilePhoto_;
import com.sap.resourcemanagement.resource.Headers;
import com.sap.resourcemanagement.workforce.workassignment.JobDetails;
import com.sap.resourcemanagement.workforce.workassignment.JobDetails_;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentDetails_;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments_;
import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails;
import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails_;
import com.sap.resourcemanagement.workforce.workforceperson.Emails;
import com.sap.resourcemanagement.workforce.workforceperson.Emails_;
import com.sap.resourcemanagement.workforce.workforceperson.Phones;
import com.sap.resourcemanagement.workforce.workforceperson.Phones_;
import com.sap.resourcemanagement.workforce.workforceperson.ProfileDetails;
import com.sap.resourcemanagement.workforce.workforceperson.ProfileDetails_;
import com.sap.resourcemanagement.workforce.workforceperson.SourceUserAccounts;
import com.sap.resourcemanagement.workforce.workforceperson.SourceUserAccounts_;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons_;

@ActiveProfiles("integration-test")
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = Application.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WorkforceReplicationControllerWithDestinationTest {

    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private static final String EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN = "emptyResponseDeltaToken";
    private static final String INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "initialLoadResponseDeltaToken";
    private static final String DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "deltaLoadResponseDeltaToken";
    private static final String RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "reTriggerInitialLoadResponseDeltaToken";
    private static final String SINCE_DELTA_TOKEN = null;

    private static final String WORKFORCE_INSTANCE_ID_1 = "1bbf14ad-1f8b-4aa9-9a1c-48963bc394b3";
    private static final String WORKFORCE_INSTANCE_ID_2 = "2bbf14ad-1f8b-4aa9-9a1c-48963bc394b3";
    private static final String WORKFORCE_INSTANCE_ID_3 = "3bbf14ad-1f8b-4aa9-9a1c-48963bc394b3";
    private static final String WORKFORCE_INSTANCE_ID_4 = "4bbf14ad-1f8b-4aa9-9a1c-48963bc394b3";
    private static final String WORKFORCE_INSTANCE_ID_5 = "5bbf14ad-1f8b-4aa9-9a1c-48963bc394b3";
    private static final String WORKFORCE_INSTANCE_ID_6 = "6bbf14ad-1f8b-4aa9-9a1c-48963bc394b3";
    private static final String WORKFORCE_INSTANCE_ID_7 = "7bbf14ad-1f8b-4aa9-9a1c-48963bc394b3";

    private static final String WORKFORCE_EXTERNAL_ID_1 = "Workforce1";
    private static final String WORKFORCE_EXTERNAL_ID_2 = "Workforce2";
    private static final String WORKFORCE_EXTERNAL_ID_3 = "Workforce3";
    private static final String WORKFORCE_EXTERNAL_ID_4 = "Workforce4";
    private static final String WORKFORCE_EXTERNAL_ID_5 = "Workforce5";
    private static final String WORKFORCE_EXTERNAL_ID_6 = "Workforce6";
    private static final String WORKFORCE_EXTERNAL_ID_7 = "Workforce7";

    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_1 = "WorkAssignmentExternal1";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_2 = "WorkAssignmentExternal2";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_3 = "WorkAssignmentExternal3";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_4 = "WorkAssignmentExternal4";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_5 = "WorkAssignmentExternal5";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_6 = "WorkAssignmentExternal6";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_7 = "WorkAssignmentExternal7";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_8 = "WorkAssignmentExternal8";
    private static final String WORK_ASSIGNMENT_EXTERNAL_ID_9 = "WorkAssignmentExternal9";

    private static final String WORK_ASSIGNMENT_ID_1 = "WorkAssignmentId1";
    private static final String WORK_ASSIGNMENT_ID_2 = "WorkAssignmentId2";
    private static final String WORK_ASSIGNMENT_ID_3 = "WorkAssignmentId3";
    private static final String WORK_ASSIGNMENT_ID_4 = "WorkAssignmentId4";
    private static final String WORK_ASSIGNMENT_ID_5 = "WorkAssignmentId5";
    private static final String WORK_ASSIGNMENT_ID_6 = "WorkAssignmentId6";
    private static final String WORK_ASSIGNMENT_ID_7 = "WorkAssignmentId7";
    private static final String WORK_ASSIGNMENT_ID_8 = "WorkAssignmentId8";
    private static final String WORK_ASSIGNMENT_ID_9 = "WorkAssignmentId9";

    private static List<String> insertedProfilePhotos;
    private final IntegrationTestHelper integrationTestHelper;
    private final WebClient webClient;
    private final HttpEntity<MultiValueMap<String, String>> requestEntity;

    @MockBean
    JobSchedulerToken jobSchedulerToken;

    @MockBean
    MasterDataIntegrationToken masterDataIntegrationToken;

    @MockBean
    DestinationToken destinationToken;

	@MockBean
	CalmService calmService;

    @SpyBean
    DestinationService destinationService;

    @SpyBean
    JobSchedulerService jobSchedulerService;

    @SpyBean
    MasterDataIntegrationServiceImpl masterDataIntegrationService;

    @SpyBean
    WorkforceMDILogAPIProcessor workforceMDILogAPIProcessor;

    @MockBean
    ExistingCustomerDetailDAO existingCustomerDetailDAO;

    public WorkforceReplicationControllerWithDestinationTest(@Value("${local.server.port}") int localPort,
                                                             @Autowired PersistenceService persistenceService,
                                                             @Autowired OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO) {
        // Common integration test helper
        this.integrationTestHelper = new IntegrationTestHelper(localPort, persistenceService, oneMDSReplicationDeltaTokenDAO);

        // Local authentication
        this.webClient = WebClient.builder()
            .defaultHeaders(header -> header.setBasicAuth(APPLICATION_USER, APPLICATION_PASSWORD)).build();

        // Request Headers for RestControllers that are invoked by JobScheduler CF
        // Service
        HttpHeaders requestHttpHeaders = new HttpHeaders();
        requestHttpHeaders.set(X_SAP_JOB_ID, X_SAP_JOB_ID);
        requestHttpHeaders.set(X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_SCHEDULE_ID);
        requestHttpHeaders.set(X_SAP_JOB_RUN_ID, X_SAP_JOB_RUN_ID);
        requestHttpHeaders.set(X_SAP_RUN_AT, X_SAP_RUN_AT);
        requestHttpHeaders.set(X_SAP_SCHEDULER_HOST, X_SAP_SCHEDULER_HOST);
        this.requestEntity = new HttpEntity<>(null, requestHttpHeaders);
    }
    @BeforeEach
    public void setUp() throws IOException {
        this.integrationTestHelper.startMockServer();
        when(jobSchedulerToken.getOAuthToken(any(), any(), any())).thenReturn("jobScheduler_token");
        when(masterDataIntegrationToken.getOAuthToken(any(), any(), any())).thenReturn("masterDataIntegration_token");
        when(destinationToken.getOAuthToken(any(), any(), any())).thenReturn("destination_token");
    }

    @AfterEach
    public void tearDown() throws IOException {
        this.integrationTestHelper.shutMockServer();
    }

	@Test
    @Order(1)
    @DisplayName("test If there is already running job-run found.")
    void testIfThereIsAlreadyRunningJobRunFound() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");

        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }

        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(0)).getMDILogRecords(any(Marker.class), anyString(),
            any(MDIEntities.class), anyString(), any(), any(JobSchedulerRunHeader.class));
        verify(this.workforceMDILogAPIProcessor, times(0)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(0)).logReplicationEvent(any(Date.class), any(String.class), eq(List.of()), eq(0),
				eq(0));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
    }

	@Test
    @Order(2)
    @DisplayName("test If there is no previous running job-run found.")
    void testIfThereIsNoPreviousRunningJobRunFound() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");

        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON), eq(null), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.workforceMDILogAPIProcessor, times(0)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(0)).logReplicationEvent(any(Date.class), any(String.class), eq(List.of()), eq(0),
				eq(0));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
    }

	@Test
    @Order(3)
    @DisplayName("test replication when destination service returns null response")
    void testReplicationWhenDestinationReturnsNullResponse() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + EMPTY_DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();
        assertNull(this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON), eq(null), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER), eq(CONSUMER_SUB_DOMAIN),
				any(JobSchedulerRunHeader.class), eq(null), eq(MDIEntities.WORKFORCE_PERSON));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.workforceMDILogAPIProcessor, times(0)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationFailure(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), eq(CalmConstants.MDI_AUTH_TOKEN_RM_CP_005));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertionBeforeInitialAndAfterPreChecks();
    }

	@Test
    @Order(4)
    @DisplayName("test replication with when destination service responds but there are no records received from OneMDS API.")
    void testReplicationWhenDestinationReturnsValidResponseButNoRecordsReceivedFromOneMDSAPI() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + EMPTY_MDI_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();
        assertNull(this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON), eq(null), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null),
				eq(MDIEntities.WORKFORCE_PERSON));
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.workforceMDILogAPIProcessor, times(1)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), eq(List.of()), eq(0), eq(0));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertionBeforeInitialAndAfterPreChecks();
    }

	@Test
    @Order(5)
    @DisplayName("test InitialLoad")
    void testInitialLoad() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + INITIAL_LOAD_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();

        assertionBeforeInitialAndAfterPreChecks();
        assertEquals(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON), eq(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN),
            eq(WorkforceLog.class), any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN),
				eq(MDIEntities.WORKFORCE_PERSON));
        verify(this.workforceMDILogAPIProcessor, times(1)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		ArgumentCaptor<List<LogEntry>> captor = ArgumentCaptor.forClass(List.class);
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), captor.capture(), eq(6), eq(6));
		assertEquals(6, captor.getValue().size());
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertionBeforeDeltaAndAfterInitialLoad();
    }

	@Test
    @Order(6)
    @DisplayName("test DeltaLoad")
    void testDeltaLoad() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + DELTA_LOAD_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();

        assertionBeforeDeltaAndAfterInitialLoad();
        assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON),
            eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class),
				eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(MDIEntities.WORKFORCE_PERSON));
        verify(this.workforceMDILogAPIProcessor, times(1)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		ArgumentCaptor<List<LogEntry>> captor = ArgumentCaptor.forClass(List.class);
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), captor.capture(), eq(6), eq(6));
		assertEquals(6, captor.getValue().size());
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertionBeforeReTriggerInitialAndAfterDeltaLoad();
    }
    
    @Test
    @Order(7)
    @DisplayName("test availability cleanup failure")
    void testAvailabilityCleanupFailed() throws IOException, InterruptedException {
    	MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
                queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + DELTA_LOAD_RESPONSE,
                MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
                SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
                .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();

        assertionBeforeReTriggerInitialAndAfterDeltaLoad();
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
                this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(true);
        doThrow(new CapacityCleanupException()).when(workforceMDILogAPIProcessor).cleanUpCapacityData(any());

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                    .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                    .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                    .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                    .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                    .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
                X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
                eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
                eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON),
                eq(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkforceLog.class),
                any(JobSchedulerRunHeader.class));
        verify(this.workforceMDILogAPIProcessor, times(1)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		ArgumentCaptor<List<LogEntry>> captor = ArgumentCaptor.forClass(List.class);
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), captor.capture(), eq(6), eq(2));
		assertEquals(6, captor.getValue().size());
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
                this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertEquals(false,
                this.integrationTestHelper.getInitialLoadCandidateStatusFromSystem(MDIEntities.WORKFORCE_PERSON));

    }

    @Test
    @Order(8)
    @DisplayName("test 409 Coflict error response")
    void test409ConflictResponse() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + ERROR_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + ERROR_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        assertionBeforeReTriggerInitialAndAfterDeltaLoad();

        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON),
            eq(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN),
				eq(MDIEntities.WORKFORCE_PERSON));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.workforceMDILogAPIProcessor, times(0)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationFailure(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), eq(CalmConstants.RESET_ALL_MDI_RM_CP_007_008));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertEquals(true,
            this.integrationTestHelper.getInitialLoadCandidateStatusFromSystem(MDIEntities.WORKFORCE_PERSON));

    }

    @Test
    @Order(9)
    @DisplayName("test Re-Trigger Initial Load")
    void testReTriggerInitialLoad() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + RE_TRIGGER_INITIAL_LOAD_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();

        assertionBeforeReTriggerInitialAndAfterDeltaLoad();

        this.integrationTestHelper.setReplicationForReInitialLoad(WORKFORCE_REPLICATION_MARKER);
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON), eq(null), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(SINCE_DELTA_TOKEN),
				eq(MDIEntities.WORKFORCE_PERSON));
        verify(this.workforceMDILogAPIProcessor, times(1)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		ArgumentCaptor<List<LogEntry>> captor = ArgumentCaptor.forClass(List.class);
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), captor.capture(), eq(5), eq(5));
		assertEquals(5, captor.getValue().size());
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertionAfterReTriggerInitialLoad();
    }

    @Test
    @Order(10)
    @DisplayName("test DeltaTokenMismatch error response")
    void testDeltaTokenMismatchResponse() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + ERROR_RESPONSE_DELTA_TOKEN_MISMATCH,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + ERROR_RESPONSE_DELTA_TOKEN_MISMATCH,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        assertionAfterReTriggerInitialLoad();

        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON),
            eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class),
				eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(MDIEntities.WORKFORCE_PERSON));
        verify(this.workforceMDILogAPIProcessor, times(0)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationFailure(any(Date.class),
				eq(MDIEntities.WORKFORCE_PERSON.getShortName()), eq(CalmConstants.RESET_ALL_MDI_RM_CP_007_008));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertEquals(true,
            this.integrationTestHelper.getInitialLoadCandidateStatusFromSystem(MDIEntities.WORKFORCE_PERSON));
    }

    @Test
    @Order(11)
    @DisplayName("test DeltaTokenDoesNotMatch error response")
    void testDeltaTokenDoesNotMatchResponse() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/Workforce/" + ERROR_RESPONSE_DELTA_TOKEN_DOES_NOT_MATCH,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateWorkforceURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE).build().toUriString();
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        assertionAfterReTriggerInitialLoad();

        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateWorkforceURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WORKFORCE_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_PERSON),
            eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkforceLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(WORKFORCE_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class),
				eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(MDIEntities.WORKFORCE_PERSON));
        verify(this.workforceMDILogAPIProcessor, times(0)).processWorkforceLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + correlationId, response.getBody());
        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_PERSON));
        assertEquals(true,
            this.integrationTestHelper.getInitialLoadCandidateStatusFromSystem(MDIEntities.WORKFORCE_PERSON));
    }

    private void assertionBeforeInitialAndAfterPreChecks() {
        // Data Assertion
        List<Headers> employeeHeaders = this.integrationTestHelper.getEntityList(Headers_.CDS_NAME, Headers.class);
        assertEquals(0, employeeHeaders.size());
        List<ProfilePhoto> profilePhotos = this.integrationTestHelper.getEntityList(ProfilePhoto_.CDS_NAME,
            ProfilePhoto.class);
        assertEquals(0, profilePhotos.size());
        List<WorkforcePersons> workforcePersons = this.integrationTestHelper.getEntityList(WorkforcePersons_.CDS_NAME,
            WorkforcePersons.class);
        assertEquals(0, workforcePersons.size());
        List<ProfileDetails> profileDetails = this.integrationTestHelper.getEntityList(ProfileDetails_.CDS_NAME,
            ProfileDetails.class);
        assertEquals(0, profileDetails.size());
        List<Emails> emails = this.integrationTestHelper.getEntityList(Emails_.CDS_NAME, Emails.class);
        assertEquals(0, emails.size());
        List<Phones> phones = this.integrationTestHelper.getEntityList(Phones_.CDS_NAME, Phones.class);
        assertEquals(0, phones.size());
        List<SourceUserAccounts> sourceUserAccounts = this.integrationTestHelper
            .getEntityList(SourceUserAccounts_.CDS_NAME, SourceUserAccounts.class);
        assertEquals(0, sourceUserAccounts.size());
        List<WorkAssignments> workAssignments = this.integrationTestHelper.getEntityList(WorkAssignments_.CDS_NAME,
            WorkAssignments.class);
        assertEquals(0, workAssignments.size());
        List<WorkAssignmentDetails> workAssignmentDetails = this.integrationTestHelper
            .getEntityList(WorkAssignmentDetails_.CDS_NAME, WorkAssignmentDetails.class);
        assertEquals(0, workAssignmentDetails.size());
        List<JobDetails> jobDetails = this.integrationTestHelper.getEntityList(JobDetails_.CDS_NAME, JobDetails.class);
        assertEquals(0, jobDetails.size());
        List<Headers> resourceHeaders = this.integrationTestHelper.getEntityList(
            com.sap.resourcemanagement.resource.Headers_.CDS_NAME,
            Headers.class);
        assertEquals(0, resourceHeaders.size());
        List<AvailabilityReplicationSummary> availabilityReplicationSummaries = this.integrationTestHelper
            .getEntityList(AvailabilityReplicationSummary_.CDS_NAME, AvailabilityReplicationSummary.class);
        assertEquals(0, availabilityReplicationSummaries.size());
    }

    private void assertionBeforeDeltaAndAfterInitialLoad() {
        // Employee Headers Data Assertion
        List<String> expectedEmployeeHeaders = Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_INSTANCE_ID_1,
            WORKFORCE_INSTANCE_ID_3, WORKFORCE_INSTANCE_ID_4, WORKFORCE_INSTANCE_ID_5, WORKFORCE_INSTANCE_ID_6);
        assertEmployeeHeaders(expectedEmployeeHeaders);

        // Profile Photo Assertion
        assertProfilePhotosEmployeeIds(expectedEmployeeHeaders);
        insertedProfilePhotos = assertProfilePhotosIdsAfterInsert();

        // WorkforcePerson Data Assertion
        List<List<Object>> expectedWorkforcePersons = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORKFORCE_EXTERNAL_ID_1, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_EXTERNAL_ID_2, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORKFORCE_EXTERNAL_ID_3, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORKFORCE_EXTERNAL_ID_4, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORKFORCE_EXTERNAL_ID_5, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORKFORCE_EXTERNAL_ID_6, false));
        assertWorkforcePersons(expectedWorkforcePersons);

        // ProfileDetails Data Assertion
        List<List<Object>> expectedProfileDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "firstName1", "lastName1", "firstName1 lastName1", "FL", "firstName1 lastName1", "2019-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "firstName2", "lastName2", "firstName2 lastName2", "FL", "firstName2 lastName2", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "firstName3", "lastName3", "firstName3 lastName3", "FL", "firstName3 lastName3", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "firstName4", "lastName4", "firstName4 lastName4", "FL", "firstName4 lastName4", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "firstName5", "lastName5", "firstName5 lastName5", "FL", "firstName5 lastName5", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "firstName6", "lastName6", "firstName6 lastName6", "FL", "firstName6 lastName6", "2020-10-23",
                "9999-12-31"));
        assertProfileDetails(expectedProfileDetails);

        // Emails Data Assertion
        List<List<Object>> expectedEmails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "workforce1@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "workforce2@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "workforce3@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "workforce4@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "workforce5@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "workforce6@sap.com", true, "B"));
        assertEmails(expectedEmails);

        // Phones Data Assertion
        List<List<Object>> expectedPhones = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "1234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "2234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "3234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "4234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "5234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "7234567890", true, "B"));
        assertPhones(expectedPhones);

        // SourceUserAccounts Data Assertion
        List<List<Object>> expectedSourceUserAccounts = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORKFORCE_EXTERNAL_ID_1),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_EXTERNAL_ID_2),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORKFORCE_EXTERNAL_ID_3),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORKFORCE_EXTERNAL_ID_4),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORKFORCE_EXTERNAL_ID_5),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORKFORCE_EXTERNAL_ID_6));
        assertSourceUserAccounts(expectedSourceUserAccounts);

        // WorkAssignments Data Assertion
        List<List<Object>> expectedWorkAssignments = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, WORK_ASSIGNMENT_ID_1,
                "2020-10-23", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, WORK_ASSIGNMENT_ID_2,
                "2020-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, WORK_ASSIGNMENT_ID_3,
                "2020-10-23", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, WORK_ASSIGNMENT_ID_4,
                "2020-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, WORK_ASSIGNMENT_ID_5,
                "2020-10-23", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, WORK_ASSIGNMENT_ID_7,
                "2020-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_9, WORK_ASSIGNMENT_ID_9,
                    "2020-10-23", "9999-12-31", true));
        assertWorkAssignments(expectedWorkAssignments);

        // WorkAssignmentDetails Data Assertion
        List<List<Object>> expectedWorkAssignmentDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, true, "2020-10-23",
                "9999-12-31"));
        assertWorkAssignmentDetails(expectedWorkAssignmentDetails);

        // JobDetails Data Assertion
        List<List<Object>> expectedJobDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"));
        assertJobDetails(expectedJobDetails);

        // ResourceHeaders Data Assertion
        List<List<Object>> expectedResourceHeaders = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_9, "1"));
        assertResourceHeaders(expectedResourceHeaders);

        // AvailabilityReplicationSummary Data Assertion
        List<List<Object>> expectedAvailabilityReplicationSummaries = Arrays.asList(
            Arrays.asList(WORKFORCE_EXTERNAL_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, WORK_ASSIGNMENT_ID_1,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, WORK_ASSIGNMENT_ID_2,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, WORK_ASSIGNMENT_ID_3,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, WORK_ASSIGNMENT_ID_4,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, WORK_ASSIGNMENT_ID_5,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, WORK_ASSIGNMENT_ID_7,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_9, WORK_ASSIGNMENT_ID_9,
                    null, "2020-10-23", "9999-12-31"));
        assertAvailabilityReplicationSummaries(expectedAvailabilityReplicationSummaries);
    }

    private void assertionBeforeReTriggerInitialAndAfterDeltaLoad() {
        // Employee Headers Data Assertion
        List<String> expectedEmployeeHeaders = Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_INSTANCE_ID_1,
            WORKFORCE_INSTANCE_ID_3, WORKFORCE_INSTANCE_ID_4, WORKFORCE_INSTANCE_ID_5, WORKFORCE_INSTANCE_ID_6);
        assertEmployeeHeaders(expectedEmployeeHeaders);

        // Profile Photo Assertion
        assertProfilePhotosEmployeeIds(expectedEmployeeHeaders);
        assertProfilePhotosIds(insertedProfilePhotos);

        // WorkforcePerson Data Assertion
        List<List<Object>> expectedWorkforcePersons = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORKFORCE_EXTERNAL_ID_1, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_EXTERNAL_ID_2, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORKFORCE_EXTERNAL_ID_3, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORKFORCE_EXTERNAL_ID_4, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORKFORCE_EXTERNAL_ID_5, true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORKFORCE_EXTERNAL_ID_6, true));
        assertWorkforcePersons(expectedWorkforcePersons);

        // ProfileDetails Data Assertion
        List<List<Object>> expectedProfileDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "firstName1", "lastName1", "firstName1 lastName1", "FL", "firstName1 lastName1", "2019-10-23",
                "2020-10-22"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "firstName6", "lastName6", "firstName6 lastName6", "FL", "firstName6 lastName6", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "firstName2", "lastName2", "firstName2 lastName2", "FL", "firstName2 lastName2", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "firstName3", "lastName3", "firstName3 lastName3", "FL", "firstName3 lastName3", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "firstName4", "lastName4", "firstName4 lastName4", "FL", "firstName4 lastName4", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "firstName5", "lastName5", "firstName5 lastName5", "FL", "firstName5 lastName5", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "firstName6", "lastName6", "firstName6 lastName6", "FL", "firstName6 lastName6", "2020-10-23",
                "9999-12-31"));
        assertProfileDetails(expectedProfileDetails);

        // Emails Data Assertion
        List<List<Object>> expectedEmails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "workforce1@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "workforce2@sap.com", false, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "workforce2Default@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "workforce3@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "workforce4@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "workforce5@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "workforce6@sap.com", true, "B"));
        assertEmails(expectedEmails);

        // Phones Data Assertion
        List<List<Object>> expectedPhones = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "1234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "2234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "3234567890", false, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "6234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "4234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "5234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "7234567890", true, "B"));
        assertPhones(expectedPhones);

        // SourceUserAccounts Data Assertion
        List<List<Object>> expectedSourceUserAccounts = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORKFORCE_EXTERNAL_ID_1),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_EXTERNAL_ID_2),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORKFORCE_EXTERNAL_ID_3),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORKFORCE_EXTERNAL_ID_4),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORKFORCE_EXTERNAL_ID_5),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORKFORCE_EXTERNAL_ID_6));
        assertSourceUserAccounts(expectedSourceUserAccounts);

        // WorkAssignments Data Assertion
        List<List<Object>> expectedWorkAssignments = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, WORK_ASSIGNMENT_ID_1,
                "2020-10-23", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, WORK_ASSIGNMENT_ID_2,
                "2020-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, WORK_ASSIGNMENT_ID_3,
                "2019-10-22", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, WORK_ASSIGNMENT_ID_4,
                "2019-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, WORK_ASSIGNMENT_ID_6,
                "2020-05-23", "2020-10-22", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, WORK_ASSIGNMENT_ID_5,
                "2020-10-23", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, WORK_ASSIGNMENT_ID_7,
                "2020-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_9, WORK_ASSIGNMENT_ID_9,
                    "2022-10-23", "9999-12-31", true));
        assertWorkAssignments(expectedWorkAssignments);

        // WorkAssignmentDetails Data Assertion
        List<List<Object>> expectedWorkAssignmentDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, true, "2019-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, true, "2019-10-23", "2020-05-22"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, true, "2020-05-23", "2020-10-22"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, true, "2020-10-23",
                "9999-12-31"));
        assertWorkAssignmentDetails(expectedWorkAssignmentDetails);

        // JobDetails Data Assertion
        List<List<Object>> expectedJobDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2019-10-23",
                "2020-10-22", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3,
                "b81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2019-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6,
                "b81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-05-23",
                "2020-10-22", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"));
        assertJobDetails(expectedJobDetails);

        // ResourceHeaders Data Assertion
        List<List<Object>> expectedResourceHeaders = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_9, "1"));
        assertResourceHeaders(expectedResourceHeaders);

        // AvailabilityReplicationSummary Data Assertion
        List<List<Object>> expectedAvailabilityReplicationSummaries = Arrays.asList(
            Arrays.asList(WORKFORCE_EXTERNAL_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, WORK_ASSIGNMENT_ID_1,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, WORK_ASSIGNMENT_ID_2,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, WORK_ASSIGNMENT_ID_3,
                null, "2019-10-22", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, WORK_ASSIGNMENT_ID_4,
                null, "2019-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, WORK_ASSIGNMENT_ID_6,
                null, "2020-05-23", "2020-10-22"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, WORK_ASSIGNMENT_ID_5,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, WORK_ASSIGNMENT_ID_7,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_9, WORK_ASSIGNMENT_ID_9,
                    null, "2022-10-23", "9999-12-31"));
        assertAvailabilityReplicationSummaries(expectedAvailabilityReplicationSummaries);

        List<List<Object>> expectedBusinessPurposeCompeltionDetails = Arrays.asList(
				Arrays.asList(WORKFORCE_INSTANCE_ID_5, LocalDate.now(Clock.systemUTC())),
				Arrays.asList(WORKFORCE_INSTANCE_ID_6, LocalDate.now(Clock.systemUTC())));
        assertBusinessPurposeCompletionDetails(expectedBusinessPurposeCompeltionDetails);

    }

    private void assertionAfterReTriggerInitialLoad() {
        // Employee Headers Data Assertion
        List<String> expectedEmployeeHeaders = Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_INSTANCE_ID_1,
            WORKFORCE_INSTANCE_ID_3, WORKFORCE_INSTANCE_ID_4, WORKFORCE_INSTANCE_ID_5, WORKFORCE_INSTANCE_ID_6,
            WORKFORCE_INSTANCE_ID_7);
        assertEmployeeHeaders(expectedEmployeeHeaders);

        // Profile Photo Assertion
        assertProfilePhotosEmployeeIds(expectedEmployeeHeaders);
        insertedProfilePhotos = assertProfilePhotosIdsAfterInsert();
        assertProfilePhotosIds(insertedProfilePhotos);

        // WorkforcePerson Data Assertion
        List<List<Object>> expectedWorkforcePersons = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORKFORCE_EXTERNAL_ID_1, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_EXTERNAL_ID_2, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORKFORCE_EXTERNAL_ID_3, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORKFORCE_EXTERNAL_ID_4, true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORKFORCE_EXTERNAL_ID_5, false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORKFORCE_EXTERNAL_ID_6, true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, WORKFORCE_EXTERNAL_ID_7, false));
        assertWorkforcePersons(expectedWorkforcePersons);

        // ProfileDetails Data Assertion
        List<List<Object>> expectedProfileDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "firstName1", "lastName1", "firstName1 lastName1", "FL", "firstName1 lastName1", "2019-10-23",
                "2020-10-22"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "firstName6", "lastName6", "firstName6 lastName6", "FL", "firstName6 lastName6", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "firstName2", "lastName2", "firstName2 lastName2", "FL", "firstName2 lastName2", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "firstName3", "lastName3", "firstName3 lastName3", "FL", "firstName3 lastName3", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "firstName4", "lastName4", "firstName4 lastName4", "FL", "firstName4 lastName4", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "firstName5", "lastName5", "firstName5 lastName5", "FL", "firstName5 lastName5", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "firstName6", "lastName6", "firstName6 lastName6", "FL", "firstName6 lastName6", "2020-10-23",
                "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, "firstName7", "lastName7", "firstName7 lastName7", "FL", "firstName7 lastName7", "2020-10-23",
                "9999-12-31"));
        assertProfileDetails(expectedProfileDetails);

        // Emails Data Assertion
        List<List<Object>> expectedEmails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "workforce1@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "workforce2@sap.com", false, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "workforce2Default@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "workforce3@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "workforce4@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "workforce5@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "workforce6@sap.com", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, "workforce7@sap.com", true, "B"));
        assertEmails(expectedEmails);

        // Phones Data Assertion
        List<List<Object>> expectedPhones = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, "1234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, "2234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "3234567890", false, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, "6234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, "4234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, "5234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, "7234567890", true, "B"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, "8234567890", true, "B"));
        assertPhones(expectedPhones);

        // SourceUserAccounts Data Assertion
        List<List<Object>> expectedSourceUserAccounts = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORKFORCE_EXTERNAL_ID_1),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORKFORCE_EXTERNAL_ID_2),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORKFORCE_EXTERNAL_ID_3),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORKFORCE_EXTERNAL_ID_4),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORKFORCE_EXTERNAL_ID_5),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORKFORCE_EXTERNAL_ID_6),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, WORKFORCE_EXTERNAL_ID_7));
        assertSourceUserAccounts(expectedSourceUserAccounts);

        // WorkAssignments Data Assertion
        List<List<Object>> expectedWorkAssignments = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, WORK_ASSIGNMENT_ID_1,
                "2020-10-23", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, WORK_ASSIGNMENT_ID_2,
                "2020-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, WORK_ASSIGNMENT_ID_3,
                "2019-10-22", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, WORK_ASSIGNMENT_ID_4,
                "2019-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, WORK_ASSIGNMENT_ID_6,
                "2020-05-23", "2020-10-22", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, WORK_ASSIGNMENT_ID_5,
                "2020-10-23", "9999-12-31", false),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, WORK_ASSIGNMENT_ID_7,
                "2020-10-23", "9999-12-31", true),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, WORK_ASSIGNMENT_EXTERNAL_ID_8, WORK_ASSIGNMENT_ID_8,
                "2020-10-23", "9999-12-31", false));
        assertWorkAssignments(expectedWorkAssignments);

        // WorkAssignmentDetails Data Assertion
        List<List<Object>> expectedWorkAssignmentDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, true, "2019-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, true, "2019-10-23", "2020-05-22"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, true, "2020-05-23", "2020-10-22"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, true, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, WORK_ASSIGNMENT_EXTERNAL_ID_8, true, "2020-10-23",
                "9999-12-31"));
        assertWorkAssignmentDetails(expectedWorkAssignmentDetails);

        // JobDetails Data Assertion
        List<List<Object>> expectedJobDetails = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2019-10-23",
                "2020-10-22", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3,
                "b81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2019-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6,
                "b81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-05-23",
                "2020-10-22", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, WORK_ASSIGNMENT_EXTERNAL_ID_8,
                "a81424ca-9f17-4143-979b-06638a0926b3", 1, "Administrator Demo", BigDecimal.valueOf(1), BigDecimal.valueOf(40), "2020-10-23",
                "9999-12-31", "A"));
        assertJobDetails(expectedJobDetails);

        // ResourceHeaders Data Assertion
        List<List<Object>> expectedResourceHeaders = Arrays.asList(
            Arrays.asList(WORKFORCE_INSTANCE_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, "1"),
            Arrays.asList(WORKFORCE_INSTANCE_ID_7, WORK_ASSIGNMENT_EXTERNAL_ID_8, "1"));
        assertResourceHeaders(expectedResourceHeaders);

        // AvailabilityReplicationSummary Data Assertion
        List<List<Object>> expectedAvailabilityReplicationSummaries = Arrays.asList(
            Arrays.asList(WORKFORCE_EXTERNAL_ID_1, WORK_ASSIGNMENT_EXTERNAL_ID_1, WORK_ASSIGNMENT_ID_1,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_2, WORK_ASSIGNMENT_ID_2,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_3, WORK_ASSIGNMENT_EXTERNAL_ID_3, WORK_ASSIGNMENT_ID_3,
                null, "2019-10-22", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_4, WORK_ASSIGNMENT_ID_4,
                null, "2019-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_4, WORK_ASSIGNMENT_EXTERNAL_ID_6, WORK_ASSIGNMENT_ID_6,
                null, "2020-05-23", "2020-10-22"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_5, WORK_ASSIGNMENT_EXTERNAL_ID_5, WORK_ASSIGNMENT_ID_5,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_6, WORK_ASSIGNMENT_EXTERNAL_ID_7, WORK_ASSIGNMENT_ID_7,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_7, WORK_ASSIGNMENT_EXTERNAL_ID_8, WORK_ASSIGNMENT_ID_8,
                null, "2020-10-23", "9999-12-31"),
            Arrays.asList(WORKFORCE_EXTERNAL_ID_2, WORK_ASSIGNMENT_EXTERNAL_ID_9, WORK_ASSIGNMENT_ID_9,
                    null, "2022-10-23", "9999-12-31"));
        assertAvailabilityReplicationSummaries(expectedAvailabilityReplicationSummaries);

        List<List<Object>> expectedBusinessPurposeCompeltionDetails = Arrays.asList(
				Arrays.asList(WORKFORCE_INSTANCE_ID_4, LocalDate.now(Clock.systemUTC())),
				Arrays.asList(WORKFORCE_INSTANCE_ID_6, LocalDate.now(Clock.systemUTC())));
        assertBusinessPurposeCompletionDetails(expectedBusinessPurposeCompeltionDetails);
    }

    private void assertEmployeeHeaders(final List<String> expectedEmployeeHeaders) {
        List<Headers> employeeHeaders = this.integrationTestHelper.getEntityList(Headers_.CDS_NAME, Headers.class);
        List<String> actualEmployeeHeaders = new ArrayList<>();
        employeeHeaders.forEach(employeeHeader -> actualEmployeeHeaders.add(employeeHeader.getId()));
        assertEquals(employeeHeaders.size(), expectedEmployeeHeaders.size());
        assertThat(actualEmployeeHeaders).containsExactlyInAnyOrderElementsOf(expectedEmployeeHeaders);
    }

    private void assertProfilePhotosEmployeeIds(final List<String> expectedProfilePhotos) {
        List<ProfilePhoto> profilePhotos = this.integrationTestHelper.getEntityList(ProfilePhoto_.CDS_NAME,
            ProfilePhoto.class);
        List<String> actualProfilePhotos = new ArrayList<>();
        profilePhotos.forEach(profilePhoto -> actualProfilePhotos.add(profilePhoto.getEmployeeId()));
        assertEquals(profilePhotos.size(), expectedProfilePhotos.size());
        assertThat(actualProfilePhotos).containsExactlyInAnyOrderElementsOf(expectedProfilePhotos);
    }

    private List<String> assertProfilePhotosIdsAfterInsert() {
        List<ProfilePhoto> profilePhotos = this.integrationTestHelper.getEntityList(ProfilePhoto_.CDS_NAME,
            ProfilePhoto.class);
        List<String> actualProfilePhotos = new ArrayList<>();
        profilePhotos.forEach(profilePhoto -> actualProfilePhotos.add(profilePhoto.getId()));
        Pattern uuid = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
        actualProfilePhotos
            .forEach(profilePhoto -> assertThat(uuid.matcher(profilePhoto).find()).isEqualTo(Boolean.TRUE));
        return actualProfilePhotos;
    }

    private void assertProfilePhotosIds(List<String> expectedProfilePhotos) {
        List<ProfilePhoto> profilePhotos = this.integrationTestHelper.getEntityList(ProfilePhoto_.CDS_NAME,
            ProfilePhoto.class);
        List<String> actualProfilePhotos = new ArrayList<>();
        profilePhotos.forEach(profilePhoto -> actualProfilePhotos.add(profilePhoto.getId()));
        assertEquals(actualProfilePhotos.size(), expectedProfilePhotos.size());
        assertThat(actualProfilePhotos).containsExactlyInAnyOrderElementsOf(expectedProfilePhotos);
    }

    private void assertWorkforcePersons(final List<List<Object>> expectedWorkforcePersons) {
        List<WorkforcePersons> workforcePersons = this.integrationTestHelper.getEntityList(WorkforcePersons_.CDS_NAME,
            WorkforcePersons.class);
        List<List<Object>> actualWorkforcePersons = new ArrayList<>();
        workforcePersons.forEach(workforcePerson -> actualWorkforcePersons.add(Arrays.asList(workforcePerson.getId(),
            workforcePerson.getExternalID(), workforcePerson.getIsBusinessPurposeCompleted())));
        assertEquals(workforcePersons.size(), expectedWorkforcePersons.size());
        assertThat(actualWorkforcePersons).containsExactlyInAnyOrderElementsOf(expectedWorkforcePersons);
    }

    private void assertProfileDetails(final List<List<Object>> expectedProfileDetails) {
        List<ProfileDetails> profileDetails = this.integrationTestHelper.getEntityList(ProfileDetails_.CDS_NAME,
            ProfileDetails.class);
        List<List<Object>> actualProfileDetails = new ArrayList<>();
        profileDetails.forEach(profileDetail -> actualProfileDetails.add(Arrays.asList(profileDetail.getParent(),
            profileDetail.getFirstName(), profileDetail.getLastName(), profileDetail.getFullName(), profileDetail.getInitials(), profileDetail.getFormalName(),
            profileDetail.getValidFrom().toString(), profileDetail.getValidTo().toString())));
        assertEquals(profileDetails.size(), expectedProfileDetails.size());
        assertThat(actualProfileDetails).containsExactlyInAnyOrderElementsOf(expectedProfileDetails);
    }

    private void assertEmails(final List<List<Object>> expectedEmails) {
        List<Emails> emails = this.integrationTestHelper.getEntityList(Emails_.CDS_NAME, Emails.class);
        List<List<Object>> actualEmails = new ArrayList<>();
        emails.forEach(email -> actualEmails
            .add(Arrays.asList(email.getParent(), email.getAddress(), email.getIsDefault(), email.getUsageCode())));
        assertEquals(emails.size(), emails.size());
        assertThat(actualEmails).containsExactlyInAnyOrderElementsOf(expectedEmails);
    }

    private void assertPhones(final List<List<Object>> expectedPhones) {
        List<Phones> phones = this.integrationTestHelper.getEntityList(Phones_.CDS_NAME, Phones.class);
        List<List<Object>> actualPhones = new ArrayList<>();
        phones.forEach(phone -> actualPhones
            .add(Arrays.asList(phone.getParent(), phone.getNumber(), phone.getIsDefault(), phone.getUsageCode())));
        assertEquals(phones.size(), expectedPhones.size());
        assertThat(actualPhones).containsExactlyInAnyOrderElementsOf(expectedPhones);
    }

    private void assertSourceUserAccounts(final List<List<Object>> expectedSourceUserAccounts) {
        List<SourceUserAccounts> sourceUserAccounts = this.integrationTestHelper
            .getEntityList(SourceUserAccounts_.CDS_NAME, SourceUserAccounts.class);
        List<List<Object>> actualSourceUserAccounts = new ArrayList<>();
        sourceUserAccounts.forEach(sourceUserAccount -> actualSourceUserAccounts
            .add(Arrays.asList(sourceUserAccount.getId(), sourceUserAccount.getUserName())));
        assertEquals(sourceUserAccounts.size(), expectedSourceUserAccounts.size());
        assertThat(actualSourceUserAccounts).containsExactlyInAnyOrderElementsOf(expectedSourceUserAccounts);
    }

    private void assertWorkAssignments(final List<List<Object>> expectedWorkAssignments) {
        List<WorkAssignments> workAssignments = this.integrationTestHelper.getEntityList(WorkAssignments_.CDS_NAME,
            WorkAssignments.class);
        List<List<Object>> actualWorkAssignments = new ArrayList<>();
        workAssignments.forEach(workAssignment -> actualWorkAssignments.add(Arrays.asList(workAssignment.getParent(),
            workAssignment.getExternalID(), workAssignment.getWorkAssignmentID(),
            workAssignment.getStartDate().toString(), workAssignment.getEndDate().toString(), workAssignment.getIsContingentWorker())));
        assertEquals(workAssignments.size(), expectedWorkAssignments.size());
        assertThat(actualWorkAssignments).containsExactlyInAnyOrderElementsOf(expectedWorkAssignments);
    }

    private void assertWorkAssignmentDetails(final List<List<Object>> expectedWorkAssignmentDetails) {
        List<WorkAssignments> workAssignments = this.integrationTestHelper.getEntityList(WorkAssignments_.CDS_NAME,
            WorkAssignments.class);
        List<List<Object>> actualWorkAssignmentDetails = new ArrayList<>();
        AtomicInteger actualWorkAssignmentDetailsSize = new AtomicInteger();
        workAssignments.forEach(workAssignment -> {
            String workAssignmentId = workAssignment.getId();
            String workAssignmentParent = workAssignment.getParent();
            String workAssignmentExternalId = workAssignment.getExternalID();
            CqnSelect workAssignmentDetailsSelect = Select.from(WorkAssignmentDetails_.CDS_NAME)
                .where(b -> b.get(WorkAssignmentDetails.PARENT).eq(workAssignmentId));
            List<WorkAssignmentDetails> workAssignmentDetails = this.integrationTestHelper
                .getEntityList(workAssignmentDetailsSelect, WorkAssignmentDetails.class);
            actualWorkAssignmentDetailsSize.getAndAdd(workAssignmentDetails.size());
            workAssignmentDetails.forEach(workAssignmentDetail -> actualWorkAssignmentDetails.add(Arrays.asList(
                workAssignmentParent, workAssignmentExternalId, workAssignmentDetail.getIsPrimary(),
                workAssignmentDetail.getValidFrom().toString(), workAssignmentDetail.getValidTo().toString())));
        });
        assertEquals(actualWorkAssignmentDetailsSize.get(), expectedWorkAssignmentDetails.size());
        assertThat(actualWorkAssignmentDetails).containsExactlyInAnyOrderElementsOf(expectedWorkAssignmentDetails);
    }

    private void assertJobDetails(final List<List<Object>> expectedJobDetails) {
        List<WorkAssignments> workAssignments = this.integrationTestHelper.getEntityList(WorkAssignments_.CDS_NAME,
            WorkAssignments.class);
        List<List<Object>> actualJobDetails = new ArrayList<>();
        AtomicInteger actualJobDetailsSize = new AtomicInteger();
        workAssignments.forEach(workAssignment -> {
            String workAssignmentId = workAssignment.getId();
            String workAssignmentParent = workAssignment.getParent();
            String workAssignmentExternalId = workAssignment.getExternalID();
            CqnSelect jobDetailsSelect = Select.from(JobDetails_.CDS_NAME)
                .where(b -> b.get(JobDetails.PARENT).eq(workAssignmentId));
            List<JobDetails> jobDetails = this.integrationTestHelper.getEntityList(jobDetailsSelect, JobDetails.class);
            actualJobDetailsSize.getAndAdd(jobDetails.size());
            jobDetails.forEach(jobDetail -> actualJobDetails.add(
                Arrays.asList(workAssignmentParent, workAssignmentExternalId, jobDetail.getCostCenterExternalID(),
                    jobDetail.getEventSequence(), jobDetail.getJobTitle(), jobDetail.getFte(),
                    jobDetail.getWorkingHoursPerWeek(), jobDetail.getValidFrom().toString(),
                    jobDetail.getValidTo().toString(), jobDetail.getStatusCode())));
        });
        assertEquals(actualJobDetailsSize.get(), expectedJobDetails.size());
        assertThat(actualJobDetails).containsExactlyInAnyOrderElementsOf(expectedJobDetails);
    }

    private void assertResourceHeaders(final List<List<Object>> expectedResourceHeaders) {
        List<WorkAssignments> workAssignments = this.integrationTestHelper.getEntityList(WorkAssignments_.CDS_NAME,
            WorkAssignments.class);
        List<List<Object>> actualResourceHeaders = new ArrayList<>();
        AtomicInteger actualResourceHeadersSize = new AtomicInteger();
        workAssignments.forEach(workAssignment -> {
            String workAssignmentId = workAssignment.getId();
            String workAssignmentParent = workAssignment.getParent();
            String workAssignmentExternalId = workAssignment.getExternalID();
            CqnSelect resourceHeadersSelect = Select.from(com.sap.resourcemanagement.resource.Headers_.CDS_NAME)
                .where(b -> b.get(Headers.ID).eq(workAssignmentId));
            List<Headers> resourceHeaders = this.integrationTestHelper
                .getEntityList(resourceHeadersSelect, Headers.class);
            actualResourceHeadersSize.getAndAdd(resourceHeaders.size());
            resourceHeaders.forEach(resourceHeader -> actualResourceHeaders
                .add(Arrays.asList(workAssignmentParent, workAssignmentExternalId, resourceHeader.getTypeCode())));
        });
        assertEquals(actualResourceHeadersSize.get(), expectedResourceHeaders.size());
        assertThat(actualResourceHeaders).containsExactlyInAnyOrderElementsOf(expectedResourceHeaders);
    }

    private void assertAvailabilityReplicationSummaries(
        final List<List<Object>> expectedAvailabilityReplicationSummaries) {
        List<AvailabilityReplicationSummary> availabilityReplicationSummaries = this.integrationTestHelper
            .getEntityList(AvailabilityReplicationSummary_.CDS_NAME, AvailabilityReplicationSummary.class);
        List<List<Object>> actualAvailabilityReplicationSummaries = new ArrayList<>();
        availabilityReplicationSummaries
            .forEach(availabilityReplicationSummary -> actualAvailabilityReplicationSummaries
                .add(Arrays.asList(availabilityReplicationSummary.getWorkForcePersonExternalId(),
                    availabilityReplicationSummary.getWorkAssignmentExternalId(),
                    availabilityReplicationSummary.getWorkAssignmentId(),
                    availabilityReplicationSummary.getCostCenterId(),
                    availabilityReplicationSummary.getWorkAssignmentStartDate(),
                    availabilityReplicationSummary.getWorkAssignmentEndDate())));
        assertEquals(availabilityReplicationSummaries.size(), expectedAvailabilityReplicationSummaries.size());
        assertThat(actualAvailabilityReplicationSummaries)
            .containsExactlyInAnyOrderElementsOf(expectedAvailabilityReplicationSummaries);
    }

    private void assertBusinessPurposeCompletionDetails(
        final List<List<Object>> expectedBusinessPurposeCompletionDetails) {
        List<BusinessPurposeCompletionDetails> businessPurposeCompletionDetails = this.integrationTestHelper
            .getEntityList(BusinessPurposeCompletionDetails_.CDS_NAME, BusinessPurposeCompletionDetails.class);
        List<List<Object>> actualBusinessPurposeCompletionDetails = new ArrayList<>();
        businessPurposeCompletionDetails.forEach(t -> actualBusinessPurposeCompletionDetails
            .add(Arrays.asList(t.getId(), t.getBusinessPurposeCompletionDate())));
        assertEquals(actualBusinessPurposeCompletionDetails.size(), expectedBusinessPurposeCompletionDetails.size());
        assertThat(actualBusinessPurposeCompletionDetails)
            .containsExactlyInAnyOrderElementsOf(expectedBusinessPurposeCompletionDetails);

    }

}
