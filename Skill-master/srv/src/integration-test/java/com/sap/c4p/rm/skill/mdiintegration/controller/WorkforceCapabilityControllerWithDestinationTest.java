package com.sap.c4p.rm.skill.mdiintegration.controller;

import static com.sap.c4p.rm.skill.TestConstants.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.Application;
import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.IntegrationTestHelper;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.DestinationToken;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.JobSchedulerToken;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.MasterDataIntegrationToken;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.service.DestinationService;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MasterDataIntegrationServiceImpl;
import com.sap.c4p.rm.skill.mdiintegration.handlers.ReplicationJobs;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.WorkforceCapabilityMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityLog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.WorkforceCapabilityCatalogMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.WorkForceCapabilityCatalogLog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.WorkforceProficiencyScaleMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkForceCapabilityProficiencyScaleLog;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ExistingCustomerDetailDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

import com.sap.resourcemanagement.skill.*;

@ActiveProfiles("integration-test")
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = Application.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WorkforceCapabilityControllerWithDestinationTest {

  private static final Marker WFC_CATALOG_REPLICATION_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_CATALOG_REPLICATION
      .getMarker();
  private static final Marker WFC_PROFICIENCY_REPLICATION_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION
      .getMarker();

  private static final Marker WFCAPABILITY_REPLICATION_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_REPLICATION
      .getMarker();
  private static final Marker WORKFORCE_CAPABILITY_JOBS = LoggingMarker.WORKFORCE_CAPABILITY_JOBS.getMarker();
  private static final String EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN = "emptyResponseDeltaToken";
  private static final String INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "initialLoadResponseDeltaToken";
  private static final String DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "deltaLoadResponseDeltaToken";
  public static final String JOB_SCHEDULER_PREVIOUS_RUN_FOUND = "JobScheduler/dummy_job_scheduler_previous_run_found.json";
  public static final String EMPTY_DESTINATION_RESPONSE = "empty_destination_response.json";
  public static final String EMPTY_MDI_RESPONSE = "empty_response.json";
  public static final String ERROR_RESPONSE = "error-response.json";
  public static final String ERROR_RESPONSE_DELTA_TOKEN_DOES_NOT_MATCH = "error-response-delta-token-does-not-match.json";
  public static final String RE_TRIGGER_INITIAL_LOAD_RESPONSE = "re_trigger_load_response.json";

  private static final String RETRIGGER_LOAD_RESPONSE_WFCPROFSCALE = "re_trigger_load_profscale_response.json";

  private static final String RETRIGGER_LOAD_RESPONSE_WFCAPABILITY = "re_trigger_load_capability_response.json";
  private static final String RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN = "reTriggerInitialLoadResponseDeltaToken";
  private static final String WFC_CATALOG_ID_1 = "7714e3ebb5304af5a9ecfc95f83794e2";
  private static final String WFC_CATALOG_ID_2 = "63c66813dfe942b3bbfbaeff77312c97";
  private static final String WFC_CATALOG_ID_3 = "88795a3b3d054722a326e9d7f3a6218b";
  private static final String WFC_CATALOG_ID_4 = "850418ca4d964882b726b82ab9cc27d3";
  private static final String WFC_CATALOG_ID_5 = "667498d83f014fcb80e112b81bd44472";
  private static final String WFC_CATALOG_ID_6 = "bc1318bb-9cbd-434c-8ae7-55291b724652";
  private static final String WFC_CATALOG_ID_7 = "b1ca4e9d074f40af9f37857878f51cce";
  private static final String WFC_CATALOG_ID_8 = "b1cd4e9d074f40af9f37857878f51cce";

  private static final String WFC_CATALOG_ID_9 = "d01fd8af-d7d3-4448-a545-9bd020df1fc2";

  private static final String WFC_PROFSET_ID_1 = "1020";
  private static final String WFC_PROFSET_ID_2 = "1021";
  private static final String WFC_PROFSET_ID_3 = "1022";
  private static final String WFC_PROFSET_ID_4 = "1023";
  private static final String WFC_PROFSET_ID_5 = "1024";

  private static final String WFC_SKILL_ID_1 = "80f40384b2564194be99c59324bc322b";
  private static final String WFC_SKILL_ID_2 = "7a2f5e63858d47eda3b3729da9b9db3e";
  private static final String WFC_SKILL_ID_3 = "6d9094d878594e67b28d2bedefe41f66";
  private static final String WFC_SKILL_ID_4 = "708bd115598f4b4894f948530ad2243f";
  private static final String WFC_SKILL_ID_5 = "266bf7dc3df645df9feafd95beaf72d4";

  private static final String WFC_SKILL_ID_6 = "90f40384b2564194be99c59324bc322b";
  private static final String WFC_PROFSET_ID_6 = "1025";
  private static final String WFC_PROFSET_ID_7 = "8c821dc2-615c-4f44-b50e-a0a0c3367fda";
  private static final String WFC_PROFSET_ID_8 = "1300";
  private static final String WFC_PROFSET_ID_9 = "102900";
  private static final String WFC_PROFSET_ID_10 = "2025";
  private final IntegrationTestHelper integrationTestHelper;
  private final WebClient webClient;
  private final HttpEntity<MultiValueMap<String, String>> requestEntity;

  @MockBean
  JobSchedulerToken jobSchedulerToken;

  @MockBean
  MasterDataIntegrationToken masterDataIntegrationToken;

  @MockBean
  DestinationToken destinationToken;

  @SpyBean
  DestinationService destinationService;

  @SpyBean
  JobSchedulerService jobSchedulerService;

  @SpyBean
  MasterDataIntegrationServiceImpl masterDataIntegrationService;

  @SpyBean
  WorkforceCapabilityCatalogMDIEventsAPIProcessor workforceCapabilityCatalogMDIEventsAPIProcessor;

  @SpyBean
  WorkforceCapabilityMDIEventsAPIProcessor workforceCapabilityMDIEventsAPIProcessor;

  @SpyBean
  WorkforceProficiencyScaleMDIEventsAPIProcessor workforceProficiencyScaleMDIEventsAPIProcessor;

  @SpyBean
  ReplicationJobs replicationJobs;

  @MockBean
  ExistingCustomerDetailDAO existingCustomerDetailDAO;

  public WorkforceCapabilityControllerWithDestinationTest(@Value("${local.server.port}") int localPort,
      @Autowired PersistenceService persistenceService,
      @Autowired OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO) {
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
    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WORKFORCE_CAPABILITY_JOBS), eq(CONSUMER_SUB_DOMAIN),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(0)).getMDILogRecords(any(Marker.class), anyString(),
        any(MDIEntities.class), anyString(), any(), any(JobSchedulerRunHeader.class));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(0))
        .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    verify(this.workforceProficiencyScaleMDIEventsAPIProcessor, times(0))
        .processWorkforceCapabilityProfScaleLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
  }

  @Test
  @Order(2)
  @DisplayName("test replication when destination service returns null response")
  void testReplicationWhenDestinationReturnsNullResponse() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + EMPTY_DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();
    assertNull(
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }

    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION), eq(null),
        eq(WorkForceCapabilityCatalogLog.class), any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null));
    verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WFC_CATALOG_REPLICATION_MARKER), eq(CONSUMER_SUB_DOMAIN),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(0))
        .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertionBeforeInitialAndAfterPreChecksForCatalog();
  }

  @Test
  @Order(3)
  @DisplayName("test replication with when destination service responds but there are no records received from OneMDS API.")
  void testReplicationWhenDestinationReturnsValidResponseButNoRecordsReceivedFromOneMDSAPI()
      throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock("MasterDataIntegration/WorkforceCapabilityCatalog/" + EMPTY_MDI_RESPONSE,
        MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();
    assertNull(
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION), eq(null),
        eq(WorkForceCapabilityCatalogLog.class), any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null));
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WFC_CATALOG_REPLICATION_MARKER), eq(CONSUMER_SUB_DOMAIN),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(1))
        .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertionBeforeInitialAndAfterPreChecksForCatalog();
  }

  @Test
  @Order(4)
  @DisplayName("Test InitialLoad for Capability Catalog")
  void testInitialLoadCapabilityCatalog() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock(
        "MasterDataIntegration/WorkforceCapabilityCatalog/" + INITIAL_LOAD_RESPONSE_WFCCATALOG,
        MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeInitialAndAfterPreChecksForCatalog();
    assertEquals(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }

    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WFC_CATALOG_REPLICATION_MARKER), eq(CONSUMER_SUB_DOMAIN),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION),
        eq(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkForceCapabilityCatalogLog.class),
        any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(EMPTY_MDI_RESPONSE_NEXT_DELTA_TOKEN));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(1))
        .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertEquals(0, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertionBeforeDeltaAndAfterInitialLoadForCatalog();
  }



  @Test
  @Order(5)
  @DisplayName("Test InitialLoad for Capability Proficiency Scale")
  void testInitialLoadCapabilityProficiencyScale() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock(
        "MasterDataIntegration/WorkforceCapabilityProficiencyScale/" + INITIAL_LOAD_RESPONSE_WFCPROFSCALE,
        MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeInitialAndAfterPreChecksForProficiencySet();
    assertNull(
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(replicationJobs).submitForWorkforceCapabilityCatalogReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }

    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION), eq(null),
        eq(WorkForceCapabilityProficiencyScaleLog.class), any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null));
    verify(this.workforceProficiencyScaleMDIEventsAPIProcessor, times(1))
        .processWorkforceCapabilityProfScaleLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
    assertionBeforeDeltaAndAfterInitialLoadForProficiencySet();
    assertEquals(0, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
  }


  @Test
  @Order(6)
  @DisplayName("Test InitialLoad for Workforce Capability ")
  void testInitialLoadWorkforceCapability() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock(
        "MasterDataIntegration/WorkforceCapability/" + INITIAL_LOAD_RESPONSE_WFCAPABILITY, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeInitialAndAfterPreChecksForSkill();
    doNothing().when(jobSchedulerService).updateJobRun(any(), any(), any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityCatalogReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    assertNull(this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WFCAPABILITY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFCAPABILITY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION), eq(null),
        eq(WorkforceCapabilityLog.class), any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFCAPABILITY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null));
    verify(this.workforceCapabilityMDIEventsAPIProcessor, times(1)).processWorkforceCapabilityLog(anyList(),
        anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
    assertionBeforeDeltaAndAfterInitialLoadForSkill();
    assertEquals(0, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
  }

  @Test
  @Order(7)
  @DisplayName("Test DeltaLoad for Workforce Capability Catalog")
  void testDeltaLoadCapabilityCatalog() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
            HttpStatus.OK);
    this.integrationTestHelper.setMock(
            "MasterDataIntegration/WorkforceCapabilityCatalog/" + DELTA_LOAD_RESPONSE_WFCCATALOG,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeDeltaAndAfterInitialLoadForCatalog();
    assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    doNothing().when(jobSchedulerService).updateJobRun(any(), any(), any(), any());
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
              .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
              .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }

    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(3)).updateJobRun(eq(WFC_CATALOG_REPLICATION_MARKER), eq(CONSUMER_SUB_DOMAIN),
            any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_CATALOG_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION),
            eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkForceCapabilityCatalogLog.class),
            any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_CATALOG_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(1))
            .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
            response.getBody());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertEquals(1, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertionBeforeReTriggerInitialAndAfterDeltaLoadForCatalog();
  }

  @Test
  @Order(8)
  @DisplayName("Test DeltaLoad for Capability Proficiency Scale")
  void testDeltaLoadCapabilityProficiencyScale() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
            HttpStatus.OK);
    this.integrationTestHelper.setMock(
            "MasterDataIntegration/WorkforceCapabilityProficiencyScale/" + DELTA_LOAD_RESPONSE_WFCPROFSCALE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeDeltaAndAfterInitialLoadForProficiencySet();
    doNothing().when(replicationJobs).submitForWorkforceCapabilityCatalogReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    doNothing().when(jobSchedulerService).updateJobRun(any(), any(), any(), any());
    assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
              .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
              .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(3)).updateJobRun(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION),
            eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkForceCapabilityProficiencyScaleLog.class),
            any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN));
    verify(this.workforceProficiencyScaleMDIEventsAPIProcessor, times(1))
            .processWorkforceCapabilityProfScaleLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
            response.getBody());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
    assertEquals(1, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
    assertionBeforeReTriggerInitialAndAfterDeltaLoadForProficiencySet();
  }



  @Test
  @Order(9)
  @DisplayName("Test Delta Load for Workforce Capability ")
  void testDeltaLoadWorkforceCapability() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock("MasterDataIntegration/WorkforceCapability/" + DELTA_LOAD_RESPONSE_WFCAPABILITY,
        MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeDeltaAndAfterInitialLoadForSkill();
    doNothing().when(replicationJobs).submitForWorkforceCapabilityCatalogReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(jobSchedulerService).updateJobRun(any(), any(), any(), any());
    assertEquals(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(2)).updateJobRun(eq(WFCAPABILITY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFCAPABILITY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION),
        eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkforceCapabilityLog.class),
        any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFCAPABILITY_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN));
    verify(this.workforceCapabilityMDIEventsAPIProcessor, times(1)).processWorkforceCapabilityLog(anyList(),
        anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
    assertEquals(0, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
    assertionBeforeRetriggerLoadAfterDeltaLoadForSkill();
  }

  @Test
  @Order(10)
  @DisplayName("test 409 Conflict error response")
  void test409ConflictResponse() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock("MasterDataIntegration/WorkforceCapabilityCatalog/" + ERROR_RESPONSE,
        MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
    this.integrationTestHelper.setMock("MasterDataIntegration/WorkforceCapabilityCatalog/" + ERROR_RESPONSE,
        MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    assertionBeforeReTriggerInitialAndAfterDeltaLoadForCatalog();

    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));

    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }

    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);

    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION),
        eq(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkForceCapabilityCatalogLog.class),
        any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN));
    verify(this.jobSchedulerService, times(2)).updateJobRun(eq(WFC_CATALOG_REPLICATION_MARKER), eq(CONSUMER_SUB_DOMAIN),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(0))
        .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertEquals(true, this.integrationTestHelper
        .getInitialLoadCandidateStatusFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertEquals(true, this.integrationTestHelper
        .getInitialLoadCandidateStatusCP(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
  }

  @Test
  @Order(11)
  @DisplayName("test Re-Trigger Initial Load for Catalog")
  void testReTriggerInitialLoad() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock(
        "MasterDataIntegration/WorkforceCapabilityCatalog/" + RE_TRIGGER_INITIAL_LOAD_RESPONSE,
        MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeReTriggerInitialAndAfterDeltaLoadForCatalog();

    this.integrationTestHelper.setReplicationForReInitialLoad(WFC_CATALOG_REPLICATION_MARKER);
    when(this.existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(jobSchedulerService).updateJobRun(any(), any(), any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }

    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(2)).updateJobRun(eq(WFC_CATALOG_REPLICATION_MARKER), eq(CONSUMER_SUB_DOMAIN),
        any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION), eq(null),
        eq(WorkForceCapabilityCatalogLog.class), any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(1))
        .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertionAfterReTriggerInitialLoadForCatalog();
    assertEquals(1, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
  }

  @Test
  @Order(12)
  @DisplayName("test DeltaTokenMismatch error response")
  void testDeltaTokenMismatchResponse() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
        queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
        HttpStatus.OK);
    this.integrationTestHelper.setMock(
        "MasterDataIntegration/WorkforceCapabilityCatalog/" + ERROR_RESPONSE_DELTA_TOKEN_DOES_NOT_MATCH,
        MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
    this.integrationTestHelper.setMock(
        "MasterDataIntegration/WorkforceCapabilityCatalog/" + ERROR_RESPONSE_DELTA_TOKEN_DOES_NOT_MATCH,
        MediaType.APPLICATION_JSON, HttpStatus.CONFLICT);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
        SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    assertionAfterReTriggerInitialLoadForCatalog();

    assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
          .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
          .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
          .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
        X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION),
        eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN), eq(WorkForceCapabilityCatalogLog.class),
        any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_CATALOG_REPLICATION_MARKER),
        eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class),
        eq(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN));
    verify(this.workforceCapabilityCatalogMDIEventsAPIProcessor, times(0))
        .processWorkforceCapabilityCatalogLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
        response.getBody());
    assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
        this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
    assertEquals(true, this.integrationTestHelper
        .getInitialLoadCandidateStatusFromSystem(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION));
  }

  @Test
  @Order(13)
  @DisplayName("test If MDI replication can be activated.")
  void testIfMDIReplicationCanBeActivated() throws IOException, InterruptedException {

    String isMDIReplicationAllowedURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment("odata").pathSegment("v4").pathSegment("SkillIntegrationService")
        .pathSegment("isSkillMDIReplicationAllowed()").build().toUriString();

    WebTestClient.bindToServer().defaultHeaders(header -> header.setBasicAuth(APPLICATION_USER, APPLICATION_PASSWORD))
        .build().get().uri(isMDIReplicationAllowedURL).exchange().expectBody().jsonPath("value").isEqualTo("true");

  }

  @Test
  @Order(14)
  @DisplayName("test if createWithSkillDialog action is allowed")
  void testCreateWithSkillDialog() throws IOException, InterruptedException {

    String testCreateWithSkillDialog = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment("odata").pathSegment("v4").pathSegment("SkillService").pathSegment("Skills")
        .pathSegment("SkillService.createSkillWithDialog").build().toUriString();

    Map<String, String> bodyMap = new HashMap();
    bodyMap.put("label", "skill");
    bodyMap.put("description", "skilldescription");

    WebTestClient.bindToServer().defaultHeaders(header -> header.setBasicAuth("ConfigurationExpert", "pass")).build()
        .post().uri(testCreateWithSkillDialog).body(BodyInserters.fromValue(bodyMap)).exchange().expectStatus()
        .isBadRequest();

  }


  @Test
  @Order(15)
  @DisplayName("Test Re-trigger initial load for Proficiency Scale")
  void testRetriggerInitialLoadForProficiencyScale() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
            HttpStatus.OK);
    this.integrationTestHelper.setMock(
            "MasterDataIntegration/WorkforceCapabilityProficiencyScale/" + RETRIGGER_LOAD_RESPONSE_WFCPROFSCALE,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();
    this.integrationTestHelper.setReplicationForReInitialLoad(WFC_PROFICIENCY_REPLICATION_MARKER);
    assertionBeforeReTriggerInitialAndAfterDeltaLoadForProficiencySet();
    doNothing().when(jobSchedulerService).updateJobRun(any(), any(), any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityCatalogReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityReplication(any(), any());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
              .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
              .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(3)).updateJobRun(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION),
            eq(null), eq(WorkForceCapabilityProficiencyScaleLog.class),
            any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFC_PROFICIENCY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null));
    verify(this.workforceProficiencyScaleMDIEventsAPIProcessor, times(1))
            .processWorkforceCapabilityProfScaleLog(anyList(), anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
            response.getBody());
    assertEquals(RE_TRIGGER_INITIAL_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
    assertionAfterReTriggerInitialLoadForProficiencySet();
    assertEquals(1, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION));
  }


  @Test
  @Order(16)
  @DisplayName("Test re-trigger initial Load for Workforce Capability ")
  void testRetriggerInitialLoadWorkforceCapability() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    // Setup of mock responses from mockwebserver
    this.integrationTestHelper.setJobSchedulerMock(JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND, MediaType.APPLICATION_JSON,
            queryParameters, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS);
    this.integrationTestHelper.setMock("Destination/" + DESTINATION_RESPONSE, MediaType.APPLICATION_JSON,
            HttpStatus.OK);
    this.integrationTestHelper.setMock("MasterDataIntegration/WorkforceCapability/" + RETRIGGER_LOAD_RESPONSE_WFCAPABILITY,
            MediaType.APPLICATION_JSON, HttpStatus.OK);
    this.integrationTestHelper.setJobSchedulerMock("JobScheduler is updated", MediaType.TEXT_PLAIN, X_SAP_JOB_ID,
            SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID);

    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
            .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();

    assertionBeforeRetriggerLoadAfterDeltaLoadForSkill();
    doNothing().when(jobSchedulerService).updateJobRun(any(), any(), any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityCatalogReplication(any(), any());
    doNothing().when(replicationJobs).submitForWorkforceCapabilityProfScaleReplication(any(), any());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
    when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(false);
    ResponseEntity<String> response;
    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve().toEntity(String.class)
              .block();
    } else {
      response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
              .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
              .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();
    }
    TimeUnit.MILLISECONDS.sleep(SLEEP_TIMEOUT);
    verify(this.jobSchedulerService, times(1)).getJobScheduleRuns(WORKFORCE_CAPABILITY_JOBS, CONSUMER_SUB_DOMAIN,
            X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 3, 0);
    verify(this.jobSchedulerService, times(1)).updateJobRun(eq(WFCAPABILITY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
    verify(this.masterDataIntegrationService, times(1)).getMDILogRecords(eq(WFCAPABILITY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), eq(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION),
            eq(null), eq(WorkforceCapabilityLog.class),
            any(JobSchedulerRunHeader.class));
    verify(this.destinationService, times(1)).getDestinationDetails(eq(WFCAPABILITY_REPLICATION_MARKER),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), eq(null));
    verify(this.workforceCapabilityMDIEventsAPIProcessor, times(1)).processWorkforceCapabilityLog(anyList(),
            anyString(), any(JobSchedulerRunHeader.class));
    assert response != null;
    String correlationId = response.getHeaders().getFirst("X-CorrelationID");
    assertEquals("Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + correlationId,
            response.getBody());
    assertEquals(DELTA_LOAD_MDI_RESPONSE_NEXT_DELTA_TOKEN,
            this.integrationTestHelper.getDeltaTokenFromSystem(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
    assertionAfterRetriggerInitialLoadForSkill();
    assertEquals(0, integrationTestHelper.getMDIObjectReplicationStatusListCount(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION));
  }


  private void assertionAfterReTriggerInitialLoadForProficiencySet() {
    List<String> expectedProficiencySets = Arrays.asList(WFC_PROFSET_ID_2, WFC_PROFSET_ID_1, WFC_PROFSET_ID_3,
            WFC_PROFSET_ID_4, WFC_PROFSET_ID_6, WFC_PROFSET_ID_7, WFC_PROFSET_ID_5, WFC_PROFSET_ID_8, WFC_PROFSET_ID_9, WFC_PROFSET_ID_10);
    assertProficiencySets(expectedProficiencySets);
  }

  private void assertionBeforeReTriggerInitialAndAfterDeltaLoadForProficiencySet() {
    // Proficiency Scale Data Assertion
    List<String> expectedProficiencySets = Arrays.asList(WFC_PROFSET_ID_2, WFC_PROFSET_ID_1, WFC_PROFSET_ID_3,
            WFC_PROFSET_ID_4, WFC_PROFSET_ID_5, WFC_PROFSET_ID_6, WFC_PROFSET_ID_7, WFC_PROFSET_ID_8, WFC_PROFSET_ID_10);
    assertProficiencySets(expectedProficiencySets);
  }

  private void assertionBeforeRetriggerLoadAfterDeltaLoadForSkill() {
    List<String> expectedSkills = Arrays.asList(WFC_SKILL_ID_2, WFC_SKILL_ID_1, WFC_SKILL_ID_3, WFC_SKILL_ID_4,
        WFC_SKILL_ID_5, WFC_SKILL_ID_6);
    assertSkills(expectedSkills);
  }

  private void assertionAfterRetriggerInitialLoadForSkill() {
    List<String> expectedSkills = Arrays.asList(WFC_SKILL_ID_2, WFC_SKILL_ID_1, WFC_SKILL_ID_3, WFC_SKILL_ID_4,
            WFC_SKILL_ID_5, WFC_SKILL_ID_6);
    assertSkills(expectedSkills);
  }

  private void assertionAfterReTriggerInitialLoadForCatalog() {
    // Catalog Data Assertion
    List<String> expectedCatalogs = Arrays.asList(WFC_CATALOG_ID_1, WFC_CATALOG_ID_3,
        WFC_CATALOG_ID_4, WFC_CATALOG_ID_5, WFC_CATALOG_ID_6, WFC_CATALOG_ID_9);
    assertCatalogs(expectedCatalogs);
  }

  private void assertionBeforeReTriggerInitialAndAfterDeltaLoadForCatalog() {
    // Catalog Data Assertion
    List<String> expectedCatalogs = Arrays.asList(WFC_CATALOG_ID_1, WFC_CATALOG_ID_3,
        WFC_CATALOG_ID_4, WFC_CATALOG_ID_5, WFC_CATALOG_ID_6, WFC_CATALOG_ID_7, WFC_CATALOG_ID_8);
    assertCatalogs(expectedCatalogs);
  }

  private void assertionBeforeInitialAndAfterPreChecksForCatalog() {
    // Data Assertion
    List<Catalogs> catalogs = this.integrationTestHelper.getEntityList(Catalogs_.CDS_NAME, Catalogs.class);
    assertEquals(0, catalogs.size());
  }

  private void assertionBeforeDeltaAndAfterInitialLoadForCatalog() {
    // Catalog Data Assertion
    List<String> expectedCatalogs = Arrays.asList(WFC_CATALOG_ID_2, WFC_CATALOG_ID_1, WFC_CATALOG_ID_3,
        WFC_CATALOG_ID_4, WFC_CATALOG_ID_5, WFC_CATALOG_ID_6, WFC_CATALOG_ID_7);
    assertCatalogs(expectedCatalogs);
  }

  private void assertCatalogs(final List<String> expectedCatalogs) {
    List<Catalogs> catalogs = this.integrationTestHelper.getEntityList(Catalogs_.CDS_NAME, Catalogs.class);
    catalogs.stream().forEach(System.out::println);
    List<String> actualCatalogs = new ArrayList<>();
    catalogs.forEach(catalog -> actualCatalogs.add(catalog.getOid()));
    assertEquals(expectedCatalogs.size(), actualCatalogs.size());
    assertThat(actualCatalogs).containsExactlyInAnyOrderElementsOf(expectedCatalogs);
  }

  private void assertProficiencySets(final List<String> expectedProficiencySets) {
    List<ProficiencySets> proficiencySets = this.integrationTestHelper.getProficiencySets();
    proficiencySets.stream().forEach(System.out::println);
    List<String> actualProfSets = new ArrayList<>();
    proficiencySets.forEach(profSet -> actualProfSets.add(profSet.getOid()));
    assertEquals(expectedProficiencySets.size(), actualProfSets.size());
    assertThat(actualProfSets).containsExactlyInAnyOrderElementsOf(expectedProficiencySets);
  }


  private void assertionBeforeInitialAndAfterPreChecksForProficiencySet() {
    // Data Assertion
    List<ProficiencySets> proficiencySets = this.integrationTestHelper.getEntityList(ProficiencySets_.CDS_NAME,
        ProficiencySets.class);
    assertEquals(0, proficiencySets.size());
  }

  private void assertionBeforeInitialAndAfterPreChecksForSkill() {
    // Data Assertion
    List<Skills> skills = this.integrationTestHelper.getEntityList(Skills_.CDS_NAME, Skills.class);
    assertEquals(0, skills.size());
  }

  private void assertionBeforeDeltaAndAfterInitialLoadForProficiencySet() {
    // Proficiency Data Assertion
    List<String> expectedProficiencySets = Arrays.asList(WFC_PROFSET_ID_2, WFC_PROFSET_ID_1, WFC_PROFSET_ID_3,
        WFC_PROFSET_ID_4, WFC_PROFSET_ID_5, WFC_PROFSET_ID_6, WFC_PROFSET_ID_7, WFC_PROFSET_ID_10);
    assertProficiencySets(expectedProficiencySets);
  }

  private void assertionBeforeDeltaAndAfterInitialLoadForSkill() {
    // Skill Data Assertion
    List<String> expectedSkills = Arrays.asList(WFC_SKILL_ID_2, WFC_SKILL_ID_1, WFC_SKILL_ID_3, WFC_SKILL_ID_4,
        WFC_SKILL_ID_5);
    assertSkills(expectedSkills);
  }

  private void assertSkills(final List<String> expectedSkills) {
    List<Skills> skills = this.integrationTestHelper.getSkills();
    skills.stream().forEach(System.out::println);

    List<String> actualSkills = new ArrayList<>();
    skills.forEach(skill -> actualSkills.add(skill.getOid()));
    assertEquals(expectedSkills.size(), actualSkills.size());
    assertThat(actualSkills).containsExactlyInAnyOrderElementsOf(expectedSkills);
  }
}
