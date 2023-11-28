package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service;

import static com.sap.c4p.rm.TestConstants.BEARER_TOKEN;
import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.TestConstants.JOB_SCHEDULER_DUMMY_SERVICE_URL;
import static com.sap.c4p.rm.TestConstants.X_SAP_JOB_ID;
import static com.sap.c4p.rm.TestConstants.X_SAP_JOB_RUN_ID;
import static com.sap.c4p.rm.TestConstants.X_SAP_JOB_SCHEDULE_ID;
import static com.sap.c4p.rm.TestHelper.assertHttpClientError;
import static com.sap.c4p.rm.TestHelper.assertHttpServerError;
import static com.sap.c4p.rm.TestHelper.assertJobUpdateFail;
import static com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerServiceImpl.OFFSET;
import static com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerServiceImpl.PAGE_SIZE;
import static com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerServiceImpl.RESULTS;
import static com.sap.c4p.rm.utils.Constants.JOB_RUN_STATUS_COMPLETED;
import static com.sap.c4p.rm.utils.Constants.JOB_RUN_STATUS_RUNNING;
import static com.sap.c4p.rm.utils.Constants.JOB_RUN_STATUS_SCHEDULED;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.function.Consumer;

import org.json.JSONArray;
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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.authclient.JobSchedulerToken;
import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.cloudfoundry.environment.JobSchedulerVCAP;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRun;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRuns;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerTime;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.StringFormatter;
import com.sap.c4p.rm.utils.WebClientResponseHelper;
import com.sap.c4p.rm.utils.WebClientResponseHelperImpl;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import reactor.core.publisher.Mono;

/**
 * Test Class to test working of {@link JobSchedulerServiceImpl}.
 */
class JobSchedulerServiceTest extends InitMocks {
    private final Logger logger = (Logger) LoggerFactory.getLogger(JobSchedulerServiceImpl.class);

    private static final String JOB = "job";
    private static final String JOB_NAME = "jobName";
    private static final String SCHEDULER_JOB_PATH_SEGMENT = "scheduler/jobs";
    private static final String TENANT_ID = "tenantId";
    private static final String RUNS = "runs";
    private static final String SCHEDULES = "schedules";
    private static final String DUMMY_RUN_TEXT_WITH_OUT_RUN_ID = "[{\"time\":\"2020-08-25 09:49:57\"},{\"time\":\"2020-08-25 09:49:57\",\"text\":\"\"},{\"time\":\"2020-08-25 09:49:57\",\"text\":\"Next run at 2020-08-25 09:54:57 (UTC)\",\"type\":\"SCHEDULED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"\",\"type\":\"TRIGGERED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"The House Keeper job has been submitted: CP_HouseKeeper_ID-53abd09d-6e76-4538-47a7-c6d77e80e3b2\",\"type\":\"ACK_RECVD\",\"code\":202},{\"time\":\"2020-08-25 09:55:03\",\"text\":\"Tenant Specific Jobs has been created successfully with previousRunningRunId.\",\"code\":null}]";
    private static final String DUMMY_RUN_TEXT_WITH_RUN_ID = "[{\"time\":\"2020-08-25 09:49:57\",\"text\":\"Next run at 2020-08-25 09:54:57 (UTC)\",\"type\":\"SCHEDULED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"\",\"type\":\"TRIGGERED\",\"code\":null},{\"time\":\"2020-08-25 09:54:57\",\"text\":\"The House Keeper job has been submitted: CP_HouseKeeper_ID-53abd09d-6e76-4538-47a7-c6d77e80e3b2\",\"type\":\"ACK_RECVD\",\"code\":202},{\"time\":\"2020-08-25 09:55:03\",\"text\":\"{\\\"previousRunningRunId\\\":\\\"36db3bfe-3bee-4628-8d1a-dc6d4dc87678\\\",\\\"terminationMessage\\\":\\\"A run has been detected with running status\\\"}\",\"code\":null}]";
    private static final String DUMMY_JOB_SCHEDULE_BY_NAME = "{\"name\":\"CP_CS_51c2cff27e944d4d8e983284727b8493\",\"description\":\"Job to replicate the cost center data from MDI system.\",\"action\":\"https:\\/\\/dev-7-consultantProfile-integration-srv.internal.cfapps.sap.hana.ondemand.com\\/replicateCostCenter\\/rm-valiant\",\"active\":true,\"httpMethod\":\"POST\",\"user\":null,\"startTime\":null,\"endTime\":null,\"signatureVersion\":0,\"jobType\":\"HTTP_ENDPOINT\",\"tenantId\":\"51c2cff2-7e94-4d4d-8e98-3284727b8493\",\"subDomain\":\"rm-valiant\",\"createdAt\":\"2020-11-11 05:47:03\",\"_id\":226655,\"schedules\":[{\"scheduleId\":\"780becf8-6ec1-460c-821b-ac20be9e379c\",\"description\":\"Schedule to trigger the initial cost center data replication from the MDI system.\",\"data\":null,\"type\":\"one-time\",\"active\":false,\"startTime\":null,\"endTime\":null,\"time\":\"2020-11-12T06:40:53Z\",\"nextRunAt\":null},{\"scheduleId\":\"ce3d0336-80e1-4409-be5e-343f22f0aeeb\",\"description\":\"Schedule to trigger the periodic cost center data replication from the MDI system.\",\"data\":null,\"type\":\"recurring\",\"repeatInterval\":\"60 minutes\",\"active\":false,\"startTime\":null,\"endTime\":null,\"nextRunAt\":null}]}";
    private static final String DUMMY_JOB_SCHEDULE_BY_NAME_NO_SCHEDULES = "{\"name\":\"CP_CS_51c2cff27e944d4d8e983284727b8493\",\"description\":\"Job to replicate the cost center data from MDI system.\",\"action\":\"https:\\/\\/dev-7-consultantProfile-integration-srv.internal.cfapps.sap.hana.ondemand.com\\/replicateCostCenter\\/rm-valiant\",\"active\":true,\"httpMethod\":\"POST\",\"user\":null,\"startTime\":null,\"endTime\":null,\"signatureVersion\":0,\"jobType\":\"HTTP_ENDPOINT\",\"tenantId\":\"51c2cff2-7e94-4d4d-8e98-3284727b8493\",\"subDomain\":\"rm-valiant\",\"createdAt\":\"2020-11-11 05:47:03\",\"_id\":226655,\"schedules\":[]}";
    private static final String DUMMY_JOB_SCHEDULE_BY_ID = "{\"scheduleId\":\"780becf8-6ec1-460c-821b-ac20be9e379c\",\"description\":\"Schedule to trigger the initial cost center data replication from the MDI system.\",\"data\":null,\"type\":\"one-time\",\"active\":false,\"startTime\":\"2020-11-11 05:47:03\",\"endTime\":null,\"time\":\"2020-11-12T06:40:53Z\",\"nextRunAt\":\"2020-11-12 06:41:04\"}";
    private static final String UPDATE_PAYLOAD = "{\"active\":false,\"time\":\"2020-11-12T06:40:53Z\"}";

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
        this.classUnderTest = new JobSchedulerServiceImpl(this.commonUtility, this.jobSchedulerToken,
                this.jobSchedulerVCAP, this.webClient);
        this.jobSchedulerBaseUrl = UriComponentsBuilder.fromUriString(this.jobSchedulerVCAP.getServiceUrl())
                .pathSegment(SCHEDULER_JOB_PATH_SEGMENT);
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(listAppender);
    }

    @Test
    @DisplayName("Test getJob with no bearer Token.")
    void testGetJobWithNoBearerToken() {
        when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(null);
        assertNull(this.classUnderTest.getJob(marker, CONSUMER_SUB_DOMAIN, JOB));
    }

    @Test
    @DisplayName("Test getJob with bearer Token when server communication throws webClientResponseException (client error).")
    void testGetJobWIthBearerTokenWithHttpClientErrorException() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(JOB).build().toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.GET,
                HttpStatus.BAD_REQUEST);

        assertNull(this.classUnderTest.getJob(marker, CONSUMER_SUB_DOMAIN, JOB));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.GET,
                StringFormatter.format("{0}{1}/{2}", JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT, JOB),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJob with bearer Token when server communication throws webClientResponseException (server error).")
    void testGetJobWIthBearerTokenWithHttpServerErrorException() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(JOB).build().toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.GET,
                HttpStatus.INTERNAL_SERVER_ERROR);

        assertNull(this.classUnderTest.getJob(marker, CONSUMER_SUB_DOMAIN, JOB));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        ILoggingEvent errorLog = logsList.get(0);
        assertEquals(Level.ERROR, errorLog.getLevel());
        assertHttpServerError(logsList.get(0), HttpMethod.GET,
                StringFormatter.format("{0}{1}/{2}", JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT, JOB),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJob with bearer Token with null response from server.")
    void testGetJobWIthBearerTokenWithNullResponse() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(JOB).build().toUriString();
        ResponseEntity<JSONObject> emptyJobResponse = new ResponseEntity<>(null, HttpStatus.OK);
        this.webClientResponseHelperJson.setGetResponseWithMock(getJobUrl, emptyJobResponse);

        assertNull(this.classUnderTest.getJob(marker, CONSUMER_SUB_DOMAIN, JOB));
    }

    @Test
    @DisplayName("Test getJob with bearer Token with No Job response from server.")
    void testGetJobWIthBearerTokenWithNoJob() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(JOB).build().toUriString();
        ResponseEntity<JSONObject> emptyJobResponse = new ResponseEntity<>(new JSONObject(), HttpStatus.OK);
        this.webClientResponseHelperJson.setGetResponseWithMock(getJobUrl, emptyJobResponse);

        assertNull(this.classUnderTest.getJob(marker, CONSUMER_SUB_DOMAIN, JOB));
    }

    @Test
    @DisplayName("Test getJob with bearer Token with Job response from server.")
    void testGetJobWIthBearerTokenWithJob() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(JOB).build().toUriString();
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        jobSchedulerJob.setName(JOB);
        ResponseEntity<JSONObject> emptyJobResponse = new ResponseEntity<>(jobSchedulerJob.toJson(), HttpStatus.OK);
        this.webClientResponseHelperJson.setGetResponseWithMock(getJobUrl, emptyJobResponse);

        assertEquals(jobSchedulerJob.getName(), this.classUnderTest.getJob(marker, CONSUMER_SUB_DOMAIN, JOB).getName());
    }

    @Test
    @DisplayName("Test getJobsByTenantId with no bearer Token.")
    void testGetJobsByTenantId() {
        when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(null);
        assertNull(this.classUnderTest.getJobsByTenantId(marker, CONSUMER_SUB_DOMAIN, TENANT_ID));
    }

    @Test
    @DisplayName("Test getJobsByTenantId with bearer Token when server communication throws webClientResponseException (client error).")
    void testGetJobsByTenantIdWIthBearerTokenWithHttpClientErrorException() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().queryParam(TENANT_ID, TENANT_ID).build()
                .toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.GET,
                HttpStatus.BAD_REQUEST);

        assertNull(this.classUnderTest.getJobsByTenantId(marker, CONSUMER_SUB_DOMAIN, TENANT_ID));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.GET, StringFormatter.format("{0}{1}?{2}={3}",
                JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT, TENANT_ID, TENANT_ID),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJobsByTenantId with bearer Token when server communication throws webClientResponseException (server error).")
    void testGetJobsByTenantIdWIthBearerTokenWithHttpServerErrorException() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().queryParam(TENANT_ID, TENANT_ID).build()
                .toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.GET,
                HttpStatus.INTERNAL_SERVER_ERROR);

        assertNull(this.classUnderTest.getJobsByTenantId(marker, CONSUMER_SUB_DOMAIN, TENANT_ID));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.GET, StringFormatter.format("{0}{1}?{2}={3}",
                JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT, TENANT_ID, TENANT_ID),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJobsByTenantId with bearer Token with Null Response from server.")
    void testGetJobsByTenantIdWIthBearerTokenWithNullResponse() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().queryParam(TENANT_ID, TENANT_ID).build()
                .toUriString();
        ResponseEntity<String> emptyJobResponse = new ResponseEntity<>(null, HttpStatus.OK);
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, emptyJobResponse);

        assertNull(this.classUnderTest.getJobsByTenantId(marker, CONSUMER_SUB_DOMAIN, TENANT_ID));
    }

    @Test
    @DisplayName("Test getJobsByTenantId with bearer Token with No Job response from server.")
    void testGetJobsByTenantIdWIthBearerTokenWithNoJob() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().queryParam(TENANT_ID, TENANT_ID).build()
                .toUriString();
        ResponseEntity<String> emptyJobResponse = new ResponseEntity<>((new JSONObject()).toString(), HttpStatus.OK);
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, emptyJobResponse);

        assertNull(this.classUnderTest.getJobsByTenantId(marker, CONSUMER_SUB_DOMAIN, TENANT_ID));
    }

    @Test
    @DisplayName("Test getJobsByTenantId with bearer Token with No Result Job response from server.")
    void testGetJobsByTenantIdWIthBearerTokenWithNoResultJob() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().queryParam(TENANT_ID, TENANT_ID).build()
                .toUriString();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(RESULTS, new JSONArray());
        ResponseEntity<String> emptyJobResponse = new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, emptyJobResponse);

        assertNull(this.classUnderTest.getJobsByTenantId(marker, CONSUMER_SUB_DOMAIN, TENANT_ID));
    }

    @Test
    @DisplayName("Test getJobsByTenantId with bearer Token with Some Result Job response from server.")
    void testGetJobsByTenantIdWIthBearerTokenWithSomeResultJob() {
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().queryParam(TENANT_ID, TENANT_ID).build()
                .toUriString();
        JSONObject jsonObject = new JSONObject();
        JSONArray jsonArray = new JSONArray();
        jsonArray.put(jsonObject);
        JSONObject resultsJsonObject = new JSONObject();
        resultsJsonObject.put(RESULTS, jsonArray);
        ResponseEntity<String> emptyJobResponse = new ResponseEntity<>(resultsJsonObject.toString(), HttpStatus.OK);
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, emptyJobResponse);

        String actualValue = this.classUnderTest.getJobsByTenantId(marker, CONSUMER_SUB_DOMAIN, TENANT_ID).toString();
        assertEquals(jsonArray.toString(), actualValue);
    }

    @Test
    @DisplayName("Test createJob with no bearer Token.")
    void testCreateJobWithNoBearerToken() {
        when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(null);
        assertNull(this.classUnderTest.createJob(marker, CONSUMER_SUB_DOMAIN, new JobSchedulerInfo()));
    }

    @Test
    @DisplayName("Test createJob with bearer Token when server communication throws webClientResponseException (client error).")
    void testCreateJobWithBearerTokenWithHttpClientErrorException() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().build().toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.POST,
                HttpStatus.BAD_REQUEST);

        assertNull(this.classUnderTest.createJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.POST,
                StringFormatter.format("{0}{1}", JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test createJob with bearer Token when server communication throws webClientResponseException (server error).")
    void testCreateJobWithBearerTokenWithHttpServerErrorException() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().build().toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.POST,
                HttpStatus.INTERNAL_SERVER_ERROR);

        assertNull(this.classUnderTest.createJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.POST,
                StringFormatter.format("{0}{1}", JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test createJob with bearer Token with null Result Job response from server.")
    void testCreateJobWithBearerTokenWithNullResponse() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().build().toUriString();
        this.webClientResponseHelperString.setPostResponseWithMock(getJobUrl, null);

        assertNull(this.classUnderTest.createJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
    }

    @Test
    @DisplayName("Test createJob with bearer Token with Result Job response from server.")
    void testCreateJobWithBearerTokenWithResultResponse() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().build().toUriString();
        ResponseEntity<String> result = new ResponseEntity<>("result", HttpStatus.CREATED);
        this.webClientResponseHelperString.setPostResponseWithMock(getJobUrl, result);

        assertEquals("result", this.classUnderTest.createJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
    }

    @Test
    @DisplayName("Test updateJob with no bearer Token.")
    void testUpdateJobWithNoBearerToken() {
        when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(null);
        assertNull(this.classUnderTest.updateJob(marker, CONSUMER_SUB_DOMAIN, new JobSchedulerInfo()));
    }

    @Test
    @DisplayName("Test updateJob with bearer Token when server communication throws webClientResponseException (client error).")
    void testUpdateJobWithBearerTokenWithHttpClientErrorException() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        jobSchedulerJob.setName(JOB_NAME);
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(JOB_NAME).build().toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.PUT,
                HttpStatus.BAD_REQUEST);

        assertNull(this.classUnderTest.updateJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.PUT, StringFormatter.format("{0}{1}/{2}",
                JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT, JOB_NAME), "Error Response Body");
    }

    @Test
    @DisplayName("Test updateJob with bearer Token when server communication throws webClientResponseException (server error).")
    void testUpdateJobWithBearerTokenWithHttpServerErrorException() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        jobSchedulerJob.setName(JOB_NAME);
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(JOB_NAME).build().toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.PUT,
                HttpStatus.INTERNAL_SERVER_ERROR);

        assertNull(this.classUnderTest.updateJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.PUT, StringFormatter.format("{0}{1}/{2}",
                JOB_SCHEDULER_DUMMY_SERVICE_URL, SCHEDULER_JOB_PATH_SEGMENT, JOB_NAME), "Error Response Body");
    }

    @Test
    @DisplayName("Test updateJob with bearer Token with null Result Job response from server.")
    void testUpdateJobWithBearerTokenWithNullResponse() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        jobSchedulerJob.setName("jobName");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment("jobName").build().toUriString();
        this.webClientResponseHelperString.setPutResponseWithMock(getJobUrl, null);

        assertNull(this.classUnderTest.updateJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
    }

    @Test
    @DisplayName("Test updateJob with bearer Token with Result Job response from server.")
    void testUpdateJobWithBearerTokenWithResultResponse() {
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        jobSchedulerJob.setName("jobName");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment("jobName").build().toUriString();
        ResponseEntity<String> result = new ResponseEntity<>("result", HttpStatus.CREATED);
        this.webClientResponseHelperString.setPutResponseWithMock(getJobUrl, result);

        assertEquals("result", this.classUnderTest.updateJob(marker, CONSUMER_SUB_DOMAIN, jobSchedulerJob));
    }

    @Test
    @DisplayName("Test updateJobRun when request to server throws webClientResponseException (client error).")
    void testUpdateJobRunWhenRequestToServerThrowsHttpClientErrorException() {
        JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(X_SAP_JOB_ID)
                .schedulerId(X_SAP_JOB_SCHEDULE_ID).runId(X_SAP_JOB_RUN_ID).build();
        JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(Boolean.FALSE, "errorMessage");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.PUT,
                HttpStatus.BAD_REQUEST);

        this.classUnderTest.updateJobRun(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, jobScheduleRunPayload);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.PUT,
                StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
                        SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS,
                        X_SAP_JOB_RUN_ID),
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
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(getJobUrl, HttpMethod.PUT,
                HttpStatus.INTERNAL_SERVER_ERROR);

        this.classUnderTest.updateJobRun(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, jobScheduleRunPayload);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.PUT,
                StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
                        SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS,
                        X_SAP_JOB_RUN_ID),
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
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
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
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
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

        assertNull(this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.GET,
                StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
                        SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJobScheduleRuns when request to server throws webClientResponseException (server error).")
    void testGetJobScheduleRunsWhenRequestToServerThrowsHttpServerException() {
        String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).build().toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(jobUrl, HttpMethod.GET,
                HttpStatus.INTERNAL_SERVER_ERROR);

        assertNull(this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.GET,
                StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
                        SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJobScheduleRuns when request to server return null.")
    void testGetJobScheduleRunsWhenRequestToServerReturnNull() {
        String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS).build().toUriString();
        this.webClientResponseHelperJobRuns.setGetResponseWithMock(jobUrl, null);

        assertNull(this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID));
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

        assertNull(this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID));
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

        assertEquals(jobSchedulerRuns, this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID));
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

        assertEquals(jobSchedulerRuns, this.classUnderTest.getJobScheduleRuns(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, 1, 1));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(0, logsList.size());
    }

    @Test
    @DisplayName("Test getJobRun when request to server throws webClientResponseException (client error).")
    void testGetJobRunWhenRequestToServerThrowsHttpClientException() {
        String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(jobUrl, HttpMethod.GET, HttpStatus.BAD_REQUEST);

        assertNull(this.classUnderTest.getJobRun(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID,
                X_SAP_JOB_RUN_ID));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.GET,
                StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
                        SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS,
                        X_SAP_JOB_RUN_ID),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJobRun when request to server throws webClientResponseException (server error).")
    void testGetJobRunWhenRequestToServerThrowsHttpServerException() {
        String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
        this.webClientResponseHelperString.setResponseMockWithException(jobUrl, HttpMethod.GET,
                HttpStatus.INTERNAL_SERVER_ERROR);

        assertNull(this.classUnderTest.getJobRun(marker, CONSUMER_SUB_DOMAIN, X_SAP_JOB_ID, X_SAP_JOB_SCHEDULE_ID,
                X_SAP_JOB_RUN_ID));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.GET,
                StringFormatter.format("{0}{1}/{2}/{3}/{4}/{5}/{6}", JOB_SCHEDULER_DUMMY_SERVICE_URL,
                        SCHEDULER_JOB_PATH_SEGMENT, X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS,
                        X_SAP_JOB_RUN_ID),
                "Error Response Body");
    }

    @Test
    @DisplayName("Test getJobRun when request to server return null.")
    void testGetJobRunWhenRequestToServerReturnNull() {
        String jobUrl = this.jobSchedulerBaseUrl.cloneBuilder()
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
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
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
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
                .pathSegment(X_SAP_JOB_ID, SCHEDULES, X_SAP_JOB_SCHEDULE_ID, RUNS, X_SAP_JOB_RUN_ID).build()
                .toUriString();
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
        String previousRunUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(X_SAP_JOB_ID, SCHEDULES,
                X_SAP_JOB_SCHEDULE_ID, RUNS, "36db3bfe-3bee-4628-8d1a-dc6d4dc87678").build().toUriString();
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
        String previousRunUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(X_SAP_JOB_ID, SCHEDULES,
                X_SAP_JOB_SCHEDULE_ID, RUNS, "36db3bfe-3bee-4628-8d1a-dc6d4dc87678").build().toUriString();
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

    @Test
    @DisplayName("Test getJobSchedulesByName gets schedules")
    void testIfSchedulesAreBeingFetchedByName() throws InterruptedException, ExecutionException {
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("226655");
        schedule1.setScheduleId("780becf8-6ec1-460c-821b-ac20be9e379c");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        JobSchedulerSchedule schedule2 = new JobSchedulerSchedule();
        schedule2.setJobId("226655");
        schedule2.setScheduleId("ce3d0336-80e1-4409-be5e-343f22f0aeeb");
        schedule2.setDescription("Schedule to trigger the periodic cost center data replication from the MDI system.");
        schedule2.setType("recurring");
        schedule2.setActive(Boolean.FALSE);
        schedule2.setRepeatInterval("60 minutes");

        String jobName = "jobName";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(DUMMY_JOB_SCHEDULE_BY_NAME, HttpStatus.OK);
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("name", jobName);
        queryParams.add("displaySchedules", "true");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment().queryParams(queryParams).build()
                .toUriString();
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, responseEntity);

        assertEquals(Arrays.asList(schedule1, schedule2),
                this.classUnderTest.getJobSchedulesByName(marker, CONSUMER_SUB_DOMAIN, jobName).get());
    }

    @Test
    @DisplayName("Test getJobSchedulesByName gets no schedules in response")
    void testIfSchedulesAreBeingFetchedByNameEmptyArrayAsResponse() throws InterruptedException, ExecutionException {
        String jobName = "jobName";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(DUMMY_JOB_SCHEDULE_BY_NAME_NO_SCHEDULES,
                HttpStatus.OK);
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("name", jobName);
        queryParams.add("displaySchedules", "true");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment().queryParams(queryParams).build()
                .toUriString();
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, responseEntity);

        assertTrue(this.classUnderTest.getJobSchedulesByName(marker, CONSUMER_SUB_DOMAIN, jobName).get().isEmpty());
    }

    @Test
    @DisplayName("Test getJobSchedulesByName gets empty response")
    void testIfSchedulesAreBeingFetchedByNameEmptyResponse() throws InterruptedException, ExecutionException {
        String jobName = "jobName";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(HttpStatus.OK);
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("name", jobName);
        queryParams.add("displaySchedules", "true");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment().queryParams(queryParams).build()
                .toUriString();
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, responseEntity);

        assertTrue(this.classUnderTest.getJobSchedulesByName(marker, CONSUMER_SUB_DOMAIN, jobName).get().isEmpty());
    }

    @Test
    @DisplayName("Test getJobSchedulesByName gets null response")
    void testIfSchedulesAreBeingFetchedByNameNullResponse() throws InterruptedException, ExecutionException {
        String jobName = "jobName";
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("name", jobName);
        queryParams.add("displaySchedules", "true");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment().queryParams(queryParams).build()
                .toUriString();
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, null);

        assertTrue(this.classUnderTest.getJobSchedulesByName(marker, CONSUMER_SUB_DOMAIN, jobName).get().isEmpty());
    }

    @Test
    @DisplayName("Test getJobSchedule gets a schedule")
    void testIfScheduleIsBeingFetchedById() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("12345");
        schedule1.setScheduleId("780becf8-6ec1-460c-821b-ac20be9e379c");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson(LocalDateTime.parse("2020-11-12 06:41:04", f).toInstant(ZoneOffset.UTC).toString());
        schedule1.setNextRunAt(nextRun);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson(LocalDateTime.parse("2020-11-11 05:47:03", f).toInstant(ZoneOffset.UTC).toString());
        schedule1.setStartTime(startTime);
        String jobId = "12345";
        String scheduleId = "ce3d0336-80e1-4409-be5e-343f22f0aeeb";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(DUMMY_JOB_SCHEDULE_BY_ID, HttpStatus.OK);
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, scheduleId).build()
                .toUriString();
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, responseEntity);

        assertEquals(schedule1, this.classUnderTest.getJobSchedule(marker, CONSUMER_SUB_DOMAIN, jobId, scheduleId));
    }

    @Test
    @DisplayName("Test getJobSchedule gets a empty response")
    void testIfScheduleIsBeingFetchedByIdEmptyResponse() {
        String jobId = "12345";
        String scheduleId = "ce3d0336-80e1-4409-be5e-343f22f0aeeb";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(HttpStatus.OK);
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, scheduleId).build()
                .toUriString();
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, responseEntity);

        assertNull(this.classUnderTest.getJobSchedule(marker, CONSUMER_SUB_DOMAIN, jobId, scheduleId));
    }

    @Test
    @DisplayName("Test getJobSchedule gets a null response")
    void testIfScheduleIsBeingFetchedByIdNullResponse() {
        String jobId = "12345";
        String scheduleId = "ce3d0336-80e1-4409-be5e-343f22f0aeeb";
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, scheduleId).build()
                .toUriString();
        this.webClientResponseHelperString.setGetResponseWithMock(getJobUrl, null);

        assertNull(this.classUnderTest.getJobSchedule(marker, CONSUMER_SUB_DOMAIN, jobId, scheduleId));
    }

    @Test
    @DisplayName("Test if updateJobSchedule updates a schedule")
    void testIfUpdateJobScheduleUpdatesSuccessfully() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("12345");
        schedule1.setScheduleId("780becf8-6ec1-460c-821b-ac20be9e379c");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson(LocalDateTime.parse("2020-11-12 06:41:04", f).toInstant(ZoneOffset.UTC).toString());
        schedule1.setNextRunAt(nextRun);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson(LocalDateTime.parse("2020-11-11 05:47:03", f).toInstant(ZoneOffset.UTC).toString());
        schedule1.setStartTime(startTime);
        String jobId = "12345";
        String scheduleId = "ce3d0336-80e1-4409-be5e-343f22f0aeeb";

        JobSchedulerSchedule requestSchedule = new JobSchedulerSchedule();
        requestSchedule.setActive(Boolean.FALSE);
        requestSchedule.setTime("2020-11-12T06:40:53Z");
        ResponseEntity<String> responseEntity = new ResponseEntity<>(DUMMY_JOB_SCHEDULE_BY_ID, HttpStatus.OK);
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, scheduleId).build()
                .toUriString();
        this.webClientResponseHelperString.setPutResponseWithMock(getJobUrl, responseEntity);

        assertEquals(schedule1,
                this.classUnderTest.updateJobSchedule(marker, CONSUMER_SUB_DOMAIN, jobId, scheduleId, requestSchedule));
    }

    @Test
    @DisplayName("Test if updateJobSchedule updates a schedule but gets empty response")
    void testIfUpdateJobScheduleUpdatesButWithEmptyResponse() {
        String jobId = "12345";
        String scheduleId = "ce3d0336-80e1-4409-be5e-343f22f0aeeb";
        JobSchedulerSchedule requestSchedule = new JobSchedulerSchedule();
        requestSchedule.setActive(Boolean.FALSE);
        requestSchedule.setTime("2020-11-12T06:40:53Z");
        ResponseEntity<String> responseEntity = new ResponseEntity<>(HttpStatus.OK);
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, scheduleId).build()
                .toUriString();
        this.webClientResponseHelperString.setPutResponseWithMock(getJobUrl, responseEntity);

        assertNull(
                this.classUnderTest.updateJobSchedule(marker, CONSUMER_SUB_DOMAIN, jobId, scheduleId, requestSchedule));
    }

    @Test
    @DisplayName("Test if updateJobSchedule updates a schedule but gets null response")
    void testIfUpdateJobScheduleUpdatesButWithNullResponse() {
        String jobId = "12345";
        String scheduleId = "ce3d0336-80e1-4409-be5e-343f22f0aeeb";
        JobSchedulerSchedule requestSchedule = new JobSchedulerSchedule();
        requestSchedule.setActive(Boolean.FALSE);
        requestSchedule.setTime("2020-11-12T06:40:53Z");
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, scheduleId).build()
                .toUriString();
        this.webClientResponseHelperString.setPutResponseWithMock(getJobUrl, null);

        assertNull(
                this.classUnderTest.updateJobSchedule(marker, CONSUMER_SUB_DOMAIN, jobId, scheduleId, requestSchedule));
    }

    @Test
    @DisplayName("Test if deactivateAllJobSchedules deactivates the schedules with null response")
    void testIfSchedulesAreDeactivated() {
        String jobId = "12345";
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, "activationStatus")
                .build().toUriString();
        this.webClientResponseHelperJson.setPostResponseWithMock(getJobUrl, null);

        assertFalse(this.classUnderTest.deactivateAllJobSchedules(marker, CONSUMER_SUB_DOMAIN, jobId));
    }

    @Test
    @DisplayName("Test if deactivateAllJobSchedules deactivates the schedules with not ok status")
    void testIfSchedulesAreDeactivatedWithNotOkStatus() {
        String jobId = "12345";
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, "activationStatus")
                .build().toUriString();
        ResponseEntity<JSONObject> responseEntity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        this.webClientResponseHelperJson.setPostResponseWithMock(getJobUrl, responseEntity);

        assertFalse(this.classUnderTest.deactivateAllJobSchedules(marker, CONSUMER_SUB_DOMAIN, jobId));
    }

    @Test
    @DisplayName("Test if deactivateAllJobSchedules deactivates the schedules with ok status")
    void testIfSchedulesAreDeactivatedWithOkStatus() {
        String jobId = "12345";
        String getJobUrl = this.jobSchedulerBaseUrl.cloneBuilder().pathSegment(jobId, SCHEDULES, "activationStatus")
                .build().toUriString();
        ResponseEntity<JSONObject> responseEntity = new ResponseEntity<>(HttpStatus.OK);
        this.webClientResponseHelperJson.setPostResponseWithMock(getJobUrl, responseEntity);

        assertTrue(this.classUnderTest.deactivateAllJobSchedules(marker, CONSUMER_SUB_DOMAIN, jobId));
    }

}
