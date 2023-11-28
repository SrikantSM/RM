package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.BEARER_TOKEN;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.JOB_SCHEDULER_DUMMY_SERVICE_URL;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.X_SAP_JOB_ID;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.X_SAP_JOB_RUN_ID;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.X_SAP_JOB_SCHEDULE_ID;
import static com.sap.c4p.rm.skill.mdiintegration.TestHelper.assertHttpClientError;
import static com.sap.c4p.rm.skill.mdiintegration.TestHelper.assertHttpServerError;
import static com.sap.c4p.rm.skill.mdiintegration.TestHelper.assertJobUpdateFail;
import static com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerServiceImpl.OFFSET;
import static com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerServiceImpl.PAGE_SIZE;
import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.JOB_RUN_STATUS_COMPLETED;
import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.JOB_RUN_STATUS_RUNNING;
import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.JOB_RUN_STATUS_SCHEDULED;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.JobSchedulerToken;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.JobSchedulerVCAP;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRun;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRuns;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;
import com.sap.c4p.rm.skill.mdiintegration.utils.WebClientResponseHelper;
import com.sap.c4p.rm.skill.mdiintegration.utils.WebClientResponseHelperImpl;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import reactor.core.publisher.Mono;

/**
 * Test Class to test working of {@link JobSchedulerServiceImpl}.
 */
class JobSchedulerServiceTest extends InitMocks {

  private final Logger logger = (Logger) LoggerFactory.getLogger(JobSchedulerServiceImpl.class);

  private static final String SCHEDULER_JOB_PATH_SEGMENT = "scheduler/jobs";
  private static final String RUNS = "runs";
  private static final String SCHEDULES = "schedules";
  private static final String DUMMY_RUN_TEXT_WITH_OUT_RUN_ID = "[{\"time\":\"2020-08-25 09:49:57\"},{\"time\":\"2020-08-25 09:49:57\",\"text\":\"\"},{\"time\":\"2020-08-25 09:49:57\",\"text\":\"Next run at 2020-08-25 09:54:57 (UTC)\",\"type\":\"SCHEDULED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"\",\"type\":\"TRIGGERED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"The House Keeper job has been submitted: Skill_HouseKeeper_ID-53abd09d-6e76-4538-47a7-c6d77e80e3b2\",\"type\":\"ACK_RECVD\",\"code\":202},{\"time\":\"2020-08-25 09:55:03\",\"text\":\"Tenant Specific Jobs has been created successfully with previousRunningRunId.\",\"code\":null}]";
  private static final String DUMMY_RUN_TEXT_WITH_RUN_ID = "[{\"time\":\"2020-08-25 09:49:57\",\"text\":\"Next run at 2020-08-25 09:54:57 (UTC)\",\"type\":\"SCHEDULED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"\",\"type\":\"TRIGGERED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"The House Keeper job has been submitted: Skill_HouseKeeper_ID-53abd09d-6e76-4538-47a7-c6d77e80e3b2\",\"type\":\"ACK_RECVD\",\"code\":202},{\"time\":\"2020-08-25 09:55:03\",\"text\":\"{\\\"previousRunningRunId\\\":\\\"36db3bfe-3bee-4628-8d1a-dc6d4dc87678\\\",\\\"terminationMessage\\\":\\\"A run has been detected with running status\\\"}\",\"code\":null}]";

  @Mock
  CommonUtility commonUtility;

  @Mock
  WebClient.RequestBodyUriSpec requestBodyUriSpecMock;

  @Mock
  WebClient.RequestBodySpec requestBodySpec1;

  @Mock
  WebClient.RequestBodySpec requestBodySpec2;

  @Mock
  WebClient.RequestHeadersSpec requestHeadersSpecMock;

  @Mock
  WebClient.ResponseSpec responseSpecMock;

  @Mock
  Mono<ResponseEntity<JSONObject>> jsonResponseEntityMock;

  @Mock
  Mono<ResponseEntity<String>> stringResponseEntityMock;

  @Mock
  Mono<ResponseEntity<JobSchedulerRuns>> jobSchedulerRunsResponseEntityMock;

  @Mock
  Mono<ResponseEntity<JobSchedulerRun>> jobSchedulerRunResponseEntityMock;

  @Mock
  JobSchedulerRuns jobSchedulerRuns;

  @Mock
  JobSchedulerRun jobSchedulerRun;

  @Mock
  JobSchedulerRun jobSchedulerRun1;

  @Mock
  JobSchedulerRun jobSchedulerRun2;

  @Mock
  JobSchedulerRun previousJobSchedulerRun;

  @Mock
  JobSchedulerVCAP jobSchedulerVCAP;

  @Mock
  JobSchedulerToken jobSchedulerToken;

  @Mock
  Marker marker;

  @Mock
  WebClient webClient;

  private UriComponentsBuilder jobSchedulerBaseUrl;
  private ListAppender<ILoggingEvent> listAppender;
  private JobSchedulerService classUnderTest;
  private WebClientResponseHelper<String> webClientResponseHelperString;
  private WebClientResponseHelper<JSONObject> webClientResponseHelperJson;
  private WebClientResponseHelper<JobSchedulerRuns> webClientResponseHelperJobRuns;
  private WebClientResponseHelper<JobSchedulerRun> webClientResponseHelperJobRun;

  @BeforeEach
  void setUp() {
    when(this.jobSchedulerVCAP.getServiceUrl()).thenReturn(JOB_SCHEDULER_DUMMY_SERVICE_URL);
    webClientResponseHelperString = new WebClientResponseHelperImpl<>(String.class, jobSchedulerToken, webClient,
        stringResponseEntityMock);
    webClientResponseHelperJson = new WebClientResponseHelperImpl<>(JSONObject.class, jobSchedulerToken, webClient,
        jsonResponseEntityMock);
    webClientResponseHelperJobRuns = new WebClientResponseHelperImpl<>(JobSchedulerRuns.class, jobSchedulerToken,
        webClient, jobSchedulerRunsResponseEntityMock);
    webClientResponseHelperJobRun = new WebClientResponseHelperImpl<>(JobSchedulerRun.class, jobSchedulerToken,
        webClient, jobSchedulerRunResponseEntityMock);
    this.classUnderTest = new JobSchedulerServiceImpl(this.commonUtility, this.jobSchedulerToken, this.jobSchedulerVCAP,
        this.webClient);
    this.jobSchedulerBaseUrl = UriComponentsBuilder.fromUriString(this.jobSchedulerVCAP.getServiceUrl())
        .pathSegment(SCHEDULER_JOB_PATH_SEGMENT);
    this.listAppender = new ListAppender<>();
    this.listAppender.start();
    logger.addAppender(listAppender);
  }

  @Test
  @DisplayName("Test updateJobRun when request to server throws webClientResponseException (client error).")
  void testUpdateJobRunWhenRequestToServerThrowsHttpClientErrorException() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(Boolean.FALSE, "errorMessage");
    String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.PUT, HttpStatus.BAD_REQUEST);

    this.classUnderTest.updateJobRun(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, jobScheduleRunPayload);
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(2, logsList.size());
    assertHttpClientError(logsList.get(0), HttpMethod.PUT,
        StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
            SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID),
        "Error Response Body");
    assertJobUpdateFail(logsList.get(1));
  }

  @Test
  @DisplayName("Test updateJobRun when request to server throws webClientResponseException (server error).")
  void testUpdateJobRunWhenRequestToServerThrowsHttpServerErrorException() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(Boolean.FALSE, "errorMessage");
    String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.PUT,
        HttpStatus.INTERNAL_SERVER_ERROR);

    this.classUnderTest.updateJobRun(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, jobScheduleRunPayload);
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(2, logsList.size());
    assertHttpServerError(logsList.get(0), HttpMethod.PUT,
        StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
            SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID),
        "Error Response Body");
    assertJobUpdateFail(logsList.get(1));
  }

  @Test
  @DisplayName("Test updateJobRun when request to server return null response.")
  void testUpdateJobRunWhenRequestToServerReturnNullResponse() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(Boolean.FALSE, "errorMessage");
    String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    this.webClientResponseHelperString.setPutResponseWithMock(getJobUrl, null);

    this.classUnderTest.updateJobRun(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, jobScheduleRunPayload);
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    assertJobUpdateFail(logsList.get(0));
  }

  @Test
  @DisplayName("Test updateJobRun when request to server return not null response.")
  void testUpdateJobRunWhenRequestToServerReturnNotNullResponse() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(Boolean.FALSE, "errorMessage");
    String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    ResponseEntity<String> emptyJobResponse = new ResponseEntity<>("not Null", HttpStatus.OK);
    this.webClientResponseHelperString.setPutResponseWithMock(getJobUrl, emptyJobResponse);

    this.classUnderTest.updateJobRun(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, jobScheduleRunPayload);
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test getJobScheduleRuns when request to server throws webClientResponseException (client error).")
  void testGetJobScheduleRunsWhenRequestToServerThrowsHttpClientException() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).build().toUriString();
    this.webClientResponseHelperString.setResponseMockWithException(jobUrl, HttpMethod.GET, HttpStatus.BAD_REQUEST);

    assertNull(
        this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 0, 0));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    assertHttpClientError(logsList.get(0), HttpMethod.GET,
        StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}", JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT,
            X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS),
        "Error Response Body");
  }

  @Test
  @DisplayName("Test getJobScheduleRuns when request to server throws webClientResponseException (server error).")
  void testGetJobScheduleRunsWhenRequestToServerThrowsHttpServerException() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).build().toUriString();
    this.webClientResponseHelperString.setResponseMockWithException(jobUrl, HttpMethod.GET,
        HttpStatus.INTERNAL_SERVER_ERROR);

    assertNull(
        this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    assertHttpServerError(logsList.get(0), HttpMethod.GET,
        StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}", JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT,
            X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS),
        "Error Response Body");
  }

  @Test
  @DisplayName("Test getJobScheduleRuns when request to server return null.")
  void testGetJobScheduleRunsWhenRequestToServerReturnNull() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).build().toUriString();
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, null);

    assertNull(
        this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test getJobScheduleRuns when request to server return null response as body.")
  void testGetJobScheduleRunsWhenRequestToServerReturnNullResponseAsBody() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).build().toUriString();
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(null, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertNull(
        this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test getJobScheduleRuns when request to server return JobSchedulerRuns object.")
  void testGetJobScheduleRunsWhenRequestToServerReturnJSONObject() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).build().toUriString();
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(this.jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertEquals(jobSchedulerRuns,
        this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test getJobScheduleRuns when request to server return json object with defined page_size and offset.")
  void testGetJobScheduleRunsWhenRequestToServerReturnJsonObjectWithDefinedPageSizeAndOffset() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 1)
        .queryParam(OFFSET, 1).build().toUriString();
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(this.jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertEquals(jobSchedulerRuns,
        this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID, 1, 1));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test getJobRun when request to server throws webClientResponseException (client error).")
  void testGetJobRunWhenRequestToServerThrowsHttpClientException() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    this.webClientResponseHelperString.setResponseMockWithException(jobUrl, HttpMethod.GET, HttpStatus.BAD_REQUEST);

    assertNull(this.classUnderTest.getJobRun(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID,
        X_SAP_JOB_RUN_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    assertHttpClientError(logsList.get(0), HttpMethod.GET,
        StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
            SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID),
        "Error Response Body");
  }

  @Test
  @DisplayName("Test getJobRun when request to server throws webClientResponseException (server error).")
  void testGetJobRunWhenRequestToServerThrowsHttpServerException() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    this.webClientResponseHelperString.setResponseMockWithException(jobUrl, HttpMethod.GET,
        HttpStatus.INTERNAL_SERVER_ERROR);

    assertNull(this.classUnderTest.getJobRun(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID,
        X_SAP_JOB_RUN_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    assertHttpServerError(logsList.get(0), HttpMethod.GET,
        StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
            SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID),
        "Error Response Body");
  }

  @Test
  @DisplayName("Test getJobRun when request to server return null.")
  void testGetJobRunWhenRequestToServerReturnNull() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    this.webClientResponseHelperJobRun.setGetResponseWithMock(jobUrl, null);

    assertNull(this.classUnderTest.getJobRun(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID,
        X_SAP_JOB_RUN_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test getJobRun when request to server return null response as body.")
  void testGetJobRunWhenRequestToServerReturnNullResponseAsBody() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    ResponseEntity<JobSchedulerRun> responseEntity = new ResponseEntity<>(null, HttpStatus.OK);
    this.webClientResponseHelperJobRun.setGetResponseWithMock(jobUrl, responseEntity);

    assertNull(this.classUnderTest.getJobRun(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID,
        X_SAP_JOB_RUN_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test getJobRun when request to server return json object.")
  void testGetJobRunWhenRequestToServerReturnJSONObject() {
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build().toUriString();
    ResponseEntity<JobSchedulerRun> responseEntity = new ResponseEntity<>(jobSchedulerRun, HttpStatus.OK);
    this.webClientResponseHelperJobRun.setGetResponseWithMock(jobUrl, responseEntity);

    assertEquals(jobSchedulerRun, this.classUnderTest.getJobRun(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID,
        X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns returned as null.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnedAsNull() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, null);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns returned as total as 0 and results as null.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsReturnedAsTotalAsZeroAndResultsAsNull() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(0));
    when(this.jobSchedulerRuns.getResults()).thenReturn(null);
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns returned as empty response and total result as 0.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsReturnedAsEmptyResponseAndTotalResultAsZero() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(0));
    when(this.jobSchedulerRuns.getResults()).thenReturn(Collections.emptyList());
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total as 1.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalAsOne() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(1));
    when(this.jobSchedulerRuns.getResults()).thenReturn(Collections.singletonList(jobSchedulerRun));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total > 2 and empty results.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndEmptyResults() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(3));
    when(this.jobSchedulerRuns.getResults())
        .thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1, jobSchedulerRun2));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total > 2 and firstResult as completed.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndFirstResultAsCompleted() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_COMPLETED);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(3));
    when(this.jobSchedulerRuns.getResults())
        .thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1, jobSchedulerRun2));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total as 2 and firstResult as Running and secondResult as running too.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndFirstResultAsRunning() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_RUNNING);
    when(this.jobSchedulerRun1.getRunStatus()).thenReturn(JOB_RUN_STATUS_RUNNING);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(2));
    when(this.jobSchedulerRuns.getResults()).thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    ResponseEntity<String> emptyJobResponse = new ResponseEntity<>("not Null", HttpStatus.OK);
    when(this.webClient.method(HttpMethod.PUT)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(anyString())).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.bodyValue(any(String.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(String.class)).thenReturn(stringResponseEntityMock);
    when(stringResponseEntityMock.block()).thenReturn(emptyJobResponse);

    assertFalse(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total as 2 and firstResult as Scheduled.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalLessThanOneAndFirstResultAsScheduled() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_SCHEDULED);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(2));
    when(this.jobSchedulerRuns.getResults()).thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total > 2 and firstResult as Scheduled.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndFirstResultAsScheduled() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_SCHEDULED);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(3));
    when(this.jobSchedulerRuns.getResults())
        .thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1, jobSchedulerRun2));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total > 2 and firstResult as Scheduled and thirdResult as completed.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndFirstResultAsScheduledAndThirdResultAsCompleted() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_SCHEDULED);
    when(this.jobSchedulerRun2.getRunStatus()).thenReturn(JOB_RUN_STATUS_COMPLETED);
    when(this.jobSchedulerRun2.getRunText()).thenReturn(null);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(3));
    when(this.jobSchedulerRuns.getResults())
        .thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1, jobSchedulerRun2));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total > 2 and firstResult as Scheduled and thirdResult as completed with no previousRunId.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndFirstResultAsScheduledAndThirdResultAsCompletedWithNoPreviousRunId() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    when(this.commonUtility.isValidJson(anyString())).thenReturn(false);
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_SCHEDULED);
    when(this.jobSchedulerRun2.getRunStatus()).thenReturn(JOB_RUN_STATUS_COMPLETED);
    when(this.jobSchedulerRun2.getRunText()).thenReturn(DUMMY_RUN_TEXT_WITH_OUT_RUN_ID);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(3));
    when(this.jobSchedulerRuns.getResults())
        .thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1, jobSchedulerRun2));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);
    this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, responseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total > 2 and firstResult as Scheduled and thirdResult as completed with previousRunId and previous complete.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndFirstResultAsScheduledAndThirdResultAsCompletedWithPreviousRunIdAndPreviousComplete() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String getJobScheduleRunsUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    String previousRunUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, "36db3bfe-3bee-4628-8d1a-dc6d4dc87678")
        .build().toUriString();
    when(this.commonUtility.isValidJson(anyString())).thenReturn(true);
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_SCHEDULED);
    when(this.jobSchedulerRun2.getRunStatus()).thenReturn(JOB_RUN_STATUS_COMPLETED);
    when(this.jobSchedulerRun2.getRunText()).thenReturn(DUMMY_RUN_TEXT_WITH_RUN_ID);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(3));
    when(this.jobSchedulerRuns.getResults())
        .thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1, jobSchedulerRun2));
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);

    when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(getJobScheduleRunsUrl)).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(JobSchedulerRuns.class)).thenReturn(jobSchedulerRunsResponseEntityMock);
    when(jobSchedulerRunsResponseEntityMock.block()).thenReturn(responseEntity);
    when(this.previousJobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_COMPLETED);
    ResponseEntity<JobSchedulerRun> previousJobRunResponseEntity = new ResponseEntity<>(previousJobSchedulerRun,
        HttpStatus.OK);

    when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(previousRunUrl)).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(JobSchedulerRun.class)).thenReturn(jobSchedulerRunResponseEntityMock);
    when(jobSchedulerRunResponseEntityMock.block()).thenReturn(previousJobRunResponseEntity);

    assertTrue(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }

  @Test
  @DisplayName("Test ifPreviousRunComplete when getJobScheduleRuns return with total > 2 and firstResult as Scheduled and thirdResult as completed with previousRunId and previous running.")
  void testIfPreviousRunCompleteWhenGetJobScheduleRunsIsReturnWithTotalGreaterThanOneAndFirstResultAsScheduledAndThirdResultAsCompletedWithPreviousRunIdAndPreviousRunning() {
    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
        .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
    String getJobScheduleRunsUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).queryParam(PAGE_SIZE, 3).build()
        .toUriString();
    String previousRunUrl = this.jobSchedulerBaseUrl.cloneBuilder()
        .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, "36db3bfe-3bee-4628-8d1a-dc6d4dc87678")
        .build().toUriString();
    when(this.commonUtility.isValidJson(anyString())).thenReturn(true);
    when(this.jobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_SCHEDULED);
    when(this.jobSchedulerRun2.getRunStatus()).thenReturn(JOB_RUN_STATUS_COMPLETED);
    when(this.jobSchedulerRun2.getRunText()).thenReturn(DUMMY_RUN_TEXT_WITH_RUN_ID);
    when(this.jobSchedulerRuns.getTotal()).thenReturn(Long.valueOf(3));
    when(this.jobSchedulerRuns.getResults())
        .thenReturn(Arrays.asList(jobSchedulerRun, jobSchedulerRun1, jobSchedulerRun2));
    when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
        .thenReturn(BEARER_TOKEN);
    ResponseEntity<JobSchedulerRuns> responseEntity = new ResponseEntity<>(jobSchedulerRuns, HttpStatus.OK);

    when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(getJobScheduleRunsUrl)).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(JobSchedulerRuns.class)).thenReturn(jobSchedulerRunsResponseEntityMock);
    when(jobSchedulerRunsResponseEntityMock.block()).thenReturn(responseEntity);

    when(this.previousJobSchedulerRun.getRunStatus()).thenReturn(JOB_RUN_STATUS_RUNNING);
    ResponseEntity<JobSchedulerRun> previousJobRunResponseEntity = new ResponseEntity<>(previousJobSchedulerRun,
        HttpStatus.OK);

    when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(previousRunUrl)).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(JobSchedulerRun.class)).thenReturn(jobSchedulerRunResponseEntityMock);
    when(jobSchedulerRunResponseEntityMock.block()).thenReturn(previousJobRunResponseEntity);

    ResponseEntity<String> emptyJobResponse = new ResponseEntity<>("not Null", HttpStatus.OK);
    when(this.webClient.method(HttpMethod.PUT)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(anyString())).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.bodyValue(any(String.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(String.class)).thenReturn(stringResponseEntityMock);
    when(stringResponseEntityMock.block()).thenReturn(emptyJobResponse);

    assertFalse(this.classUnderTest.ifPreviousRunComplete(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
  }
}
