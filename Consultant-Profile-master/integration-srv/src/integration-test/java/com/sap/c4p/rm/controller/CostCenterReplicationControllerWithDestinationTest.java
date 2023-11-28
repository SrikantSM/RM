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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.sap.c4p.rm.cloudfoundry.service.destination.service.DestinationServiceImpl;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationServiceImpl;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.processor.costcenter.CostCenterMDILogAPIProcessor;
import com.sap.c4p.rm.processor.costcenter.dto.CostCenterLog;
import com.sap.c4p.rm.replicationdao.ExistingCustomerDetailDAO;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.organization.CostCenterAttributes;
import com.sap.resourcemanagement.organization.CostCenterAttributesTexts;
import com.sap.resourcemanagement.organization.CostCenterAttributesTexts_;
import com.sap.resourcemanagement.organization.CostCenterAttributes_;
import com.sap.resourcemanagement.organization.CostCenterValidity;
import com.sap.resourcemanagement.organization.CostCenterValidity_;
import com.sap.resourcemanagement.organization.CostCenters;
import com.sap.resourcemanagement.organization.CostCenters_;

@ActiveProfiles("integration-test")
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = Application.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CostCenterReplicationControllerWithDestinationTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(CostCenterReplicationControllerWithDestinationTest.class);
    private static final Marker COST_CENTER_REPLICATION_MARKER = LoggingMarker.COST_CENTER_REPLICATION.getMarker();

    private static final String EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN = "emptyResponseDeltaToken";
    private static final String INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "initialLoadResponseDeltaToken";
    private static final String DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "deltaLoadResponseDeltaToken";
    private static final String RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "reTriggerInitialLoadResponseDeltaToken";
    private static final String SINCE_DELTA_TOKEN = null;

    private static final String COST_CENTER_INSTANCE_ID_1 = "15ed3717-b1be-4b50-b41a-57898854d9ac";
    private static final String COST_CENTER_INSTANCE_ID_2 = "25ed3717-b1be-4b50-b41a-57898854d9ac";
    private static final String COST_CENTER_INSTANCE_ID_3 = "35ed3717-b1be-4b50-b41a-57898854d9ac";
    private static final String COST_CENTER_INSTANCE_ID_4 = "45ed3717-b1be-4b50-b41a-57898854d9ac";
    private static final String COST_CENTER_INSTANCE_ID_5 = "55ed3717-b1be-4b50-b41a-57898854d9ac";
    private static final String COST_CENTER_INSTANCE_ID_6 = "65ed3717-b1be-4b50-b41a-57898854d9ac";
    private static final String COST_CENTER_INSTANCE_ID_7 = "75ed3717-b1be-4b50-b41a-57898854d9ac";
    private static final String COST_CENTER_INSTANCE_ID_8 = "85ed3717-b1be-4b50-b41a-57898854d9ac";

    private final IntegrationTestHelper integrationTestHelper;
    private final WebClient webClient;
    private final HttpEntity<MultiValueMap<String, String>> requestEntity;

    @MockBean
    JobSchedulerToken jobSchedulerToken;

    @MockBean
    MasterDataIntegrationToken masterDataIntegrationToken;

	@MockBean
	CalmService calmService;

    @SpyBean
    JobSchedulerService jobSchedulerService;

    @SpyBean
    MasterDataIntegrationServiceImpl masterDataIntegrationService;

    @SpyBean
    CostCenterMDILogAPIProcessor costCenterMDILogAPIProcessor;

    @SpyBean
    DestinationServiceImpl destinationService;

    @MockBean
    DestinationToken destinationToken;

    @MockBean
    ExistingCustomerDetailDAO existingCustomerDetailDAO;

    public CostCenterReplicationControllerWithDestinationTest(@Value("${local.server.port}") int localPort,
                                               @Autowired PersistenceService persistenceService,
                                               @Autowired OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO)
                                                {
        // Common integration test helper
        this.integrationTestHelper = new IntegrationTestHelper(localPort, persistenceService,
            oneMDSReplicationDeltaTokenDAO);
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
        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(0)).getMDILogRecords(any(Marker.class), anyString(),
            any(MDIEntities.class), anyString(), any(), any(JobSchedulerRunHeader.class));
        verify(this.costCenterMDILogAPIProcessor, times(0)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(0)).logReplicationEvent(any(Date.class), any(String.class), eq(List.of()), eq(0),
				eq(0));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
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

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(0)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
                eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
		verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(SINCE_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER), eq(null), eq(CostCenterLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.costCenterMDILogAPIProcessor, times(0)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(0)).logReplicationEvent(any(Date.class), any(String.class), eq(List.of()), eq(0),
				eq(0));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
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

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();

        assertNull(this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;

        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();

        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }

        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER), eq(null), eq(CostCenterLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(SINCE_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.costCenterMDILogAPIProcessor, times(0)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationFailure(any(Date.class),
				eq(MDIEntities.COST_CENTER.getShortName()), eq(CalmConstants.MDI_AUTH_TOKEN_RM_CP_005));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
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

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();

        assertNull(this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;

        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();

        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }

        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER), eq(null), eq(CostCenterLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(SINCE_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.costCenterMDILogAPIProcessor, times(1)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.COST_CENTER.getShortName()), eq(List.of()), eq(0),
				eq(0));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
        assertEquals(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
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
        this.integrationTestHelper.setMock("MasterDataIntegration/CostCenter/" + INITIAL_LOAD_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();

        assertionBeforeInitialAndAfterPreChecks();
		assertEquals(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN,
				this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER), eq(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN),
            eq(CostCenterLog.class), any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.costCenterMDILogAPIProcessor, times(1)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		ArgumentCaptor<List<LogEntry>> captor = ArgumentCaptor.forClass(List.class);
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.COST_CENTER.getShortName()), captor.capture(), eq(6), eq(6));
		assertEquals(6, captor.getValue().size());
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
        assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
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
        this.integrationTestHelper.setMock("MasterDataIntegration/CostCenter/" + DELTA_LOAD_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();

        assertionBeforeDeltaAndAfterInitialLoad();
        assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER), eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN),
            eq(CostCenterLog.class), any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class),
				eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.costCenterMDILogAPIProcessor, times(1)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		ArgumentCaptor<List<LogEntry>> captor = ArgumentCaptor.forClass(List.class);
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.COST_CENTER.getShortName()), captor.capture(), eq(5), eq(5));
		assertEquals(5, captor.getValue().size());
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        assertionBeforeReTriggerInitialAndAfterDeltaLoad();
    }

	@Test
	@Order(7)
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
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        assertionBeforeReTriggerInitialAndAfterDeltaLoad();

        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));

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
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER),
            eq(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(CostCenterLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.costCenterMDILogAPIProcessor, times(0)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationFailure(any(Date.class),
				eq(MDIEntities.COST_CENTER.getShortName()), eq(CalmConstants.RESET_ALL_MDI_RM_CP_007_008));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        assertEquals(true,
            this.integrationTestHelper.getInitialLoadCandidateStatusFromSystem(MDIEntities.COST_CENTER));

    }

	@Test
	@Order(8)
    @DisplayName("test Re-Trigger Initial Load")
    void testReTriggerInitialLoad() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/CostCenter/" + RE_TRIGGER_INITIAL_LOAD_RESPONSE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();

        assertionBeforeReTriggerInitialAndAfterDeltaLoad();
        this.integrationTestHelper.setReplicationForReInitialLoad(COST_CENTER_REPLICATION_MARKER);
        assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER), eq(null), eq(CostCenterLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null),
				eq(MDIEntities.COST_CENTER));
        verify(this.costCenterMDILogAPIProcessor, times(1)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		ArgumentCaptor<List<LogEntry>> captor = ArgumentCaptor.forClass(List.class);
		verify(this.calmService, times(1)).logReplicationEvent(any(Date.class),
				eq(MDIEntities.COST_CENTER.getShortName()), captor.capture(), eq(3), eq(3));
		assertEquals(3, captor.getValue().size());
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        assertionAfterReTriggerInitialLoad();
    }

	@Test
	@Order(9)
    @DisplayName("test DeltaTokenMismatch error response")
    void testDeltaTokenMismatchResponse() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/CostCenter/" + ERROR_RESPONSE_DELTA_TOKEN_MISMATCH,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setMock("MasterDataIntegration/CostCenter/" + ERROR_RESPONSE_DELTA_TOKEN_MISMATCH,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();

        assertionAfterReTriggerInitialLoad();

        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER),
            eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(CostCenterLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class),
				eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.costCenterMDILogAPIProcessor, times(0)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
		verify(this.calmService, times(1)).logReplicationFailure(any(Date.class),
				eq(MDIEntities.COST_CENTER.getShortName()), eq(CalmConstants.RESET_ALL_MDI_RM_CP_007_008));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        assertEquals(true,
            this.integrationTestHelper.getInitialLoadCandidateStatusFromSystem(MDIEntities.COST_CENTER));
    }

	@Test
	@Order(10)
    @DisplayName("test DeltaTokenDoesNotMatch error response")
    void testDeltaTokenDoesNotMatchResponse() throws IOException, InterruptedException {
        MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
        queryParameters.add(PAGE_SIZE, "3");
        // Setup of mock responses from mockwebserver
        this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
        this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON, HttpStatus.OK);
        this.integrationTestHelper.setMock("MasterDataIntegration/CostCenter/" + ERROR_RESPONSE_DELTA_TOKEN_DOES_NOT_MATCH,
            MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
        this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

        String replicateCostCenterURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_COST_CENTER).build().toUriString();

        assertionAfterReTriggerInitialLoad();

        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);

        ResponseEntity<String> response;
        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
                .toEntity(String.class).block();
        } else {
            response = this.webClient.post().uri(replicateCostCenterURL)
                .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
                .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class)
                .block();
        }
        TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
        verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(COST_CENTER_REPLICATION_MARKER,
            CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
        verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(COST_CENTER_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.COST_CENTER),
            eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(CostCenterLog.class),
            any(JobSchedulerRunHeader.class));
        verify(this.destinationService, times(1)).getDestinationDetails(eq(COST_CENTER_REPLICATION_MARKER),
				eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class),
				eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN),
				eq(MDIEntities.COST_CENTER));
        verify(this.costCenterMDILogAPIProcessor, times(0)).processCostCenterLog(anyList(), anyString(),
				any(JobSchedulerRunHeader.class), any(AtomicInteger.class));
        assert response != null;
        String correlationId = response.getHeaders().getFirst("X-CorrelationID");
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + correlationId,
            response.getBody());
        assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.COST_CENTER));
        assertEquals(true,
            this.integrationTestHelper.getInitialLoadCandidateStatusFromSystem(MDIEntities.COST_CENTER));
    }

    private void assertionBeforeInitialAndAfterPreChecks() {
        // Data Assertion
        List<CostCenters> costCenters = this.integrationTestHelper.getEntityList(CostCenters_.CDS_NAME,
            CostCenters.class);
        assertEquals(0, costCenters.size());
        List<CostCenterAttributes> costCenterAttributes = this.integrationTestHelper
            .getEntityList(CostCenterAttributes_.CDS_NAME, CostCenterAttributes.class);
        assertEquals(0, costCenterAttributes.size());
        List<CostCenterAttributesTexts> costCenterAttributesTexts = this.integrationTestHelper
            .getEntityList(CostCenterAttributesTexts_.CDS_NAME, CostCenterAttributesTexts.class);
        assertEquals(0, costCenterAttributesTexts.size());
        List<CostCenterValidity> costCenterValidities = this.integrationTestHelper
            .getEntityList(CostCenterValidity_.CDS_NAME, CostCenterValidity.class);
        assertEquals(0, costCenterValidities.size());
    }

    private void assertionBeforeDeltaAndAfterInitialLoad() {
        // Cost Center Data Assertion
        List<List<Object>> expectedCostCenters = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, "JS-TEST01", "1010/JS-TEST01/0LOJBAQ", "JS-TEST01 (1010/JS-TEST01/0LOJBAQ)", "0LOJBAQ", false,
                "1010", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, "TEST0002", "1010/TEST0002/0LOJBAQ", "TEST0002 (1010/TEST0002/0LOJBAQ)", "0LOJBAQ", false, "1010",
                "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM-IP-US01", "1710/RM-IP-US01/0LOJBAQ", "RM-IP-US01 (1710/RM-IP-US01/0LOJBAQ)", "0LOJBAQ", false,
                "1710", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, "TG%46111", "1710/TG%46111/0LOJBAQ", "TG%46111 (1710/TG%46111/0LOJBAQ)", "0LOJBAQ", false, "1710",
                "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, "RM-TI-DE02", "1010/RM-TI-DE02/0LOJBAQ", "RM-TI-DE02 (1010/RM-TI-DE02/0LOJBAQ)", "0LOJBAQ", false,
                "1010", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, "RM-TI-DE04", "1010/RM-TI-DE04/0LOJBAQ", "RM-TI-DE04 (1010/RM-TI-DE04/0LOJBAQ)", "0LOJBAQ", false,
                "1010", "A000"));
        assertCostCenters(expectedCostCenters);

        // Cost Center Attribute Data Assertion
        List<List<Object>> expectedCostCenterAttributes = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, "JS Test 01", "JS Test ZeroOne", "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, "Financials (DE)", "Financials(DE)", "2012-01-01",
                "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM internal producti", "RM internal production US01",
                "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, "ssf", "dfds", "2020-10-28", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, "RM test integration", "RM test integration DE02",
                "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, "RM test integration", "RM test integration DE04",
                "2020-01-01", "9999-12-31"));
        assertCostCenterAttributes(expectedCostCenterAttributes);

        // Cost Center Attribute Text Data Assertion
        List<List<Object>> expectedCostCenterAttributeTexts = Arrays.asList(
            Arrays.asList("EN", "JS Test 01", "JS Test ZeroOne"),
            Arrays.asList("EN", "Financials (DE)", "Financials(DE)"),
            Arrays.asList("DE", "Finanzen (DE)", "Finanzen (DE)"),
            Arrays.asList("EN", "RM internal producti", "RM internal production US01"),
            Arrays.asList("EN", "ssf", "dfds"),
            Arrays.asList("EN", "RM test integration", "RM test integration DE02"),
            Arrays.asList("EN", "RM test integration", "RM test integration DE04"));
        assertCostCenterAttributeTexts(expectedCostCenterAttributeTexts);

        // Cost Center Validity Data Assertion
        List<List<Object>> expectedCostCenterValidities = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, true, "2012-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, true, "2020-10-28", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, true, "2020-01-01", "9999-12-31"));
        assertCostCenterValidities(expectedCostCenterValidities);
    }

    private void assertionBeforeReTriggerInitialAndAfterDeltaLoad() {
        // Cost Center Data Assertion
        List<List<Object>> expectedCostCenters = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, "JS-TEST01", "1010/JS-TEST01/0LOJBAQ", "JS-TEST01 (1010/JS-TEST01/0LOJBAQ)", "0LOJBAQ", false,
                "1010", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, "TEST0002", "1010/TEST0002/0LOJBAQ", "TEST0002 (1010/TEST0002/0LOJBAQ)", "0LOJBAQ", false, "1010",
                "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM-IP-US01", "1710/RM-IP-US01/0LOJBAQ", "RM-IP-US01 (1710/RM-IP-US01/0LOJBAQ)", "0LOJBAQ", false,
                "1710", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, "TG%46111", "1710/TG%46111/0LOJBAQ", "TG%46111 (1710/TG%46111/0LOJBAQ)", "0LOJBAQ", false, "1710",
                "A000"),
            // the below assertion for IsExcluded flag will be changed to true once the
            // exclude event handling is fixed for cost center replication
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, "RM-TI-DE02", "1010/RM-TI-DE02/0LOJBAQ", "RM-TI-DE02 (1010/RM-TI-DE02/0LOJBAQ)", "0LOJBAQ", false,
                "1010", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_6, "TEST0010", "1020/TEST0010/0MOJBAQ", "TEST0010 (1020/TEST0010/0MOJBAQ)", "0MOJBAQ", false, "1020",
                "B000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, "RM-TI-DE04", "1010/RM-TI-DE04/0LOJBAQ", "RM-TI-DE04 (1010/RM-TI-DE04/0LOJBAQ)", "0LOJBAQ", false,
                "1010", "A000"));
        assertCostCenters(expectedCostCenters);

        // Cost Center Attribute Data Assertion
        List<List<Object>> expectedCostCenterAttributes = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, "JS Test 01", "JS Test ZeroOne", "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, "Financials (DE)", "Financials(DE)", "2012-01-01",
                "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM internal producti", "RM internal production US01",
                "2020-01-01", "2020-01-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM internal producti", "RM internal production US01",
                "2020-02-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, "ssf", "dfds", "2020-10-28", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, "RM test integration", "RM test integration DE02",
                "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_6, "Accounts", "Accounts", "2012-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, "RM test integration", "RM test integration DE04",
                "2020-01-01", "9999-12-31"));
        assertCostCenterAttributes(expectedCostCenterAttributes);

        // Cost Center Attribute Text Data Assertion
        List<List<Object>> expectedCostCenterAttributeTexts = Arrays.asList(
            Arrays.asList("EN", "JS Test 01", "JS Test ZeroOne"),
            Arrays.asList("EN", "Financials (DE)", "Financials(DE)"),
            Arrays.asList("DE", "Finanzen (DE)", "Finanzen (DE)"),
            Arrays.asList("EN", "RM internal producti", "RM internal production US01"),
            Arrays.asList("EN", "RM internal producti", "RM internal production US01"),
            Arrays.asList("DE", "RM internes Produkt", "RM interne Produktion US01"),
            Arrays.asList("EN", "ssf", "dfds"),
            Arrays.asList("EN", "RM test integration", "RM test integration DE02"),
            Arrays.asList("EN", "RM test integration", "RM test integration DE04"),
            Arrays.asList("EN", "Accounts", "Accounts"), Arrays.asList("DE", "Konten", "Konten"));
        assertCostCenterAttributeTexts(expectedCostCenterAttributeTexts);

        // Cost Center Validity Data Assertion
        List<List<Object>> expectedCostCenterValidities = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, true, "2012-01-01", "2012-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, true, "2015-02-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, true, "2020-10-28", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_6, true, "2012-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, true, "2020-01-01", "9999-12-31"));
        assertCostCenterValidities(expectedCostCenterValidities);
    }

    private void assertionAfterReTriggerInitialLoad() {
        // Cost Center Data Assertion
        List<List<Object>> expectedCostCenters = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, "JS-TEST01", "1010/JS-TEST01/0LOJBAQ", "JS-TEST01 (1010/JS-TEST01/0LOJBAQ)", "0LOJBAQ", true, "1010",
                "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, "TEST0002", "1010/TEST0002/0LOJBAQ", "TEST0002 (1010/TEST0002/0LOJBAQ)", "0LOJBAQ", false, "1010",
                "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM-IP-US01", "1710/RM-IP-US01/0LOJBAQ", "RM-IP-US01 (1710/RM-IP-US01/0LOJBAQ)", "0LOJBAQ", false,
                "1710", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, "TG%46111", "1710/TG%46111/0LOJBAQ", "TG%46111 (1710/TG%46111/0LOJBAQ)", "0LOJBAQ", true, "1710",
                "A000"),
            // the below assertion for IsExcluded flag will be changed to true once the
            // exclude event handling is fixed for cost center replication
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, "RM-TI-DE02", "1010/RM-TI-DE02/0LOJBAQ", "RM-TI-DE02 (1010/RM-TI-DE02/0LOJBAQ)", "0LOJBAQ", true,
                "1010", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_6, "TEST0010", "1020/TEST0010/0MOJBAQ", "TEST0010 (1020/TEST0010/0MOJBAQ)", "0MOJBAQ", true, "1020",
                "B000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, "RM-TI-DE04", "1010/RM-TI-DE04/0LOJBAQ", "RM-TI-DE04 (1010/RM-TI-DE04/0LOJBAQ)", "0LOJBAQ", true,
                "1010", "A000"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_8, "TEST0080", "1020/TEST0080/0MOJBAQ", "TEST0080 (1020/TEST0080/0MOJBAQ)", "0MOJBAQ", false, "1020",
                "B000"));
        assertCostCenters(expectedCostCenters);

        // Cost Center Attribute Data Assertion
        List<List<Object>> expectedCostCenterAttributes = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, "JS Test 01", "JS Test ZeroOne", "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, "Financials (DE)", "Financials(DE)", "2012-01-01",
                "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM internal producti", "RM internal production US01",
                "2020-01-01", "2020-01-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, "RM internal producti", "RM internal production US01",
                "2020-02-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, "ssf", "dfds", "2020-10-28", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, "RM test integration", "RM test integration DE02",
                "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_6, "Accounts", "Accounts", "2012-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, "RM test integration", "RM test integration DE04",
                "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_8, "Operations", "Operations", "2012-01-01", "9999-12-31"));
        assertCostCenterAttributes(expectedCostCenterAttributes);

        // Cost Center Attribute Text Data Assertion
        List<List<Object>> expectedCostCenterAttributeTexts = Arrays.asList(
            Arrays.asList("EN", "JS Test 01", "JS Test ZeroOne"),
            Arrays.asList("EN", "Financials (DE)", "Financials(DE)"),
            Arrays.asList("DE", "Finanzen (DE)", "Finanzen (DE)"),
            Arrays.asList("EN", "RM internal producti", "RM internal production US01"),
            Arrays.asList("EN", "RM internal producti", "RM internal production US01"),
            Arrays.asList("DE", "RM internes Produkt", "RM interne Produktion US01"),
            Arrays.asList("EN", "ssf", "dfds"),
            Arrays.asList("EN", "RM test integration", "RM test integration DE02"),
            Arrays.asList("EN", "RM test integration", "RM test integration DE04"),
            Arrays.asList("EN", "Accounts", "Accounts"), Arrays.asList("DE", "Konten", "Konten"),
            Arrays.asList("EN", "Operations", "Operations"), Arrays.asList("DE", "Betrieb", "Betrieb"));
        assertCostCenterAttributeTexts(expectedCostCenterAttributeTexts);

        // Cost Center Validity Data Assertion
        List<List<Object>> expectedCostCenterValidities = Arrays.asList(
            Arrays.asList(COST_CENTER_INSTANCE_ID_1, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, true, "2012-01-01", "2012-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_2, true, "2015-02-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_3, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_4, true, "2020-10-28", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_5, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_6, true, "2012-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_7, true, "2020-01-01", "9999-12-31"),
            Arrays.asList(COST_CENTER_INSTANCE_ID_8, true, "2012-01-01", "9999-12-31"));
        assertCostCenterValidities(expectedCostCenterValidities);
    }

    private void assertCostCenters(final List<List<Object>> expectedCostCenters) {
        List<CostCenters> costCenters = this.integrationTestHelper.getEntityList(CostCenters_.CDS_NAME,
            CostCenters.class);
        LOGGER.info("{}", costCenters);
        List<List<Object>> actualCostCenters = new ArrayList<>();
        costCenters.forEach(costCenter -> actualCostCenters.add(Arrays.asList(costCenter.getId(),
            costCenter.getCostCenterID(), costCenter.getDisplayName(), costCenter.getCostCenterDesc(), costCenter.getLogicalSystem(),
            costCenter.getIsExcluded(), costCenter.getCompanyCode(), costCenter.getControllingArea())));
        assertEquals(actualCostCenters.size(), expectedCostCenters.size());
        assertThat(actualCostCenters).containsExactlyInAnyOrderElementsOf(expectedCostCenters);
    }

    private void assertCostCenterAttributes(final List<List<Object>> expectedCostCenterAttributes) {
        List<CostCenterAttributes> costCenterAttributes = this.integrationTestHelper
            .getEntityList(CostCenterAttributes_.CDS_NAME, CostCenterAttributes.class);
        List<List<Object>> actualCostCenterAttributes = new ArrayList<>();
        costCenterAttributes.forEach(
            costCenterAttribute -> actualCostCenterAttributes.add(Arrays.asList(costCenterAttribute.getParent(),
                costCenterAttribute.getName(), costCenterAttribute.getDescription(),
                costCenterAttribute.getValidFrom().toString(), costCenterAttribute.getValidTo().toString())));
        assertEquals(actualCostCenterAttributes.size(), expectedCostCenterAttributes.size());
        assertThat(actualCostCenterAttributes).containsExactlyInAnyOrderElementsOf(expectedCostCenterAttributes);
    }

    private void assertCostCenterAttributeTexts(final List<List<Object>> expectedCostCenterAttributeTexts) {
        List<CostCenterAttributesTexts> costCenterAttributesTexts = this.integrationTestHelper
            .getEntityList(CostCenterAttributesTexts_.CDS_NAME, CostCenterAttributesTexts.class);
        List<List<Object>> actualCostCenterAttributeTexts = new ArrayList<>();
        costCenterAttributesTexts.forEach(costCenterAttributeText -> actualCostCenterAttributeTexts
            .add(Arrays.asList(costCenterAttributeText.getLocale(), costCenterAttributeText.getName(),
                costCenterAttributeText.getDescription())));
        assertEquals(actualCostCenterAttributeTexts.size(), expectedCostCenterAttributeTexts.size());
        assertThat(actualCostCenterAttributeTexts)
                .containsExactlyInAnyOrderElementsOf(expectedCostCenterAttributeTexts);
    }

    private void assertCostCenterValidities(final List<List<Object>> expectedCostCenterValidities) {
        List<CostCenterValidity> costCentervalidities = this.integrationTestHelper
            .getEntityList(CostCenterValidity_.CDS_NAME, CostCenterValidity.class);
        List<List<Object>> actualCostCentervalidities = new ArrayList<>();
        costCentervalidities.forEach(costCenterValidity -> actualCostCentervalidities
            .add(Arrays.asList(costCenterValidity.getParent(), costCenterValidity.getIsValid(),
                costCenterValidity.getValidFrom().toString(), costCenterValidity.getValidTo().toString())));
        assertEquals(actualCostCentervalidities.size(), expectedCostCenterValidities.size());
        assertThat(actualCostCentervalidities).containsExactlyInAnyOrderElementsOf(expectedCostCenterValidities);
    }
}
