package com.sap.c4p.rm.cloudfoundry.service.masterdataintegration;

import static com.sap.c4p.rm.TestConstants.BEARER_TOKEN;
import static com.sap.c4p.rm.TestConstants.CONSUMER_DUMMY_OAUTH_TOKEN;
import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.TestConstants.IDENTITY_ZONE;
import static com.sap.c4p.rm.TestConstants.LIMIT_HINT_VALUE;
import static com.sap.c4p.rm.TestConstants.ONE_MDS_DUMMY_SERVICE_URL;
import static com.sap.c4p.rm.TestConstants.SOMETHING_WENT_WRONG;
import static com.sap.c4p.rm.TestHelper.assertHttpClientError;
import static com.sap.c4p.rm.TestHelper.assertHttpServerError;
import static com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationServiceImpl.LIMIT_HINT;
import static com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationServiceImpl.MDI_LOG_API;
import static com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationServiceImpl.MDI_VERSION;
import static com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationServiceImpl.SINCE;
import static com.sap.c4p.rm.utils.Constants.MDI_VCAP_VALUE_CACHE_NAME;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.internal.stubbing.answers.AnswersWithDelay;
import org.mockito.internal.stubbing.answers.Returns;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.calm.CalmServiceLocalImpl;
import com.sap.c4p.rm.cloudfoundry.authclient.MasterDataIntegrationToken;
import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.cloudfoundry.environment.CFUserProvidedEnvironment;
import com.sap.c4p.rm.cloudfoundry.environment.DestinationVCAP;
import com.sap.c4p.rm.cloudfoundry.environment.MasterDataIntegrationVCAP;
import com.sap.c4p.rm.cloudfoundry.service.destination.model.AuthTokens;
import com.sap.c4p.rm.cloudfoundry.service.destination.model.DestinationConfiguration;
import com.sap.c4p.rm.cloudfoundry.service.destination.model.DestinationResponse;
import com.sap.c4p.rm.cloudfoundry.service.destination.service.DestinationService;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.processor.common.dto.Error;
import com.sap.c4p.rm.processor.common.dto.ErrorResponse;
import com.sap.c4p.rm.replicationdao.ExistingCustomerDetailDAO;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.replicationdao.ReplicationErrorMessagesDAO;
import com.sap.xsa.core.instancemanager.util.Json;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import io.pivotal.cfenv.core.CfApplication;
import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;
import reactor.core.publisher.Mono;

public class MasterDataIntegrationServiceTest extends InitMocks {

    private final Logger logger = (Logger) LoggerFactory.getLogger(MasterDataIntegrationServiceImpl.class);

    private static final String ENTITY_TYPE = "entityType";
    private static final String SINCE_DELTA_TOKEN = "sinceDeltaToken";
    private static final String UAA_NAME = "uaa";
    protected static final String XS_APP_NAME = "xsappname";
    protected static final String UAA_DOMAIN = "uaadomain";
    protected static final String TENANT_ID = "tenantid";
    private static final String ONE_MDS_XS_APP_NAME = "oneMDSSAppName";

    @Mock
    Cache cache;

    @Mock
    CacheManager cacheManager;

    @Mock
    CfEnv cfEnv;

    @Mock
    CFUserProvidedEnvironment cfUserProvidedEnvironment;

    @Mock
    Marker marker;

    @Mock
    CfApplication cfApplication;

    @Mock
    CfService cfService;

    @Mock
    CfCredentials cfCredentials;

    @Mock
    JobSchedulerService jobSchedulerService;

    @Mock
    MasterDataIntegrationToken masterDataIntegrationToken;

    @Mock
    MasterDataIntegrationVCAP masterDataIntegrationVCAP;

    @Mock
    DestinationVCAP destinationVCAP;

    @Mock
    OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;

    @Mock
    ExistingCustomerDetailDAO existingCustomerDetailDAO;

    @Mock
    WebClient webClient;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Mock
    WebClientResponseException webClientResponseException;

    @Mock
    WebClient.RequestHeadersUriSpec requestHeadersUriSpecMock;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock1;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock2;

    @Mock
    WebClient.ResponseSpec responseSpecMock;

    @Mock
    Mono<ResponseEntity<String>> responseEntityMock;

    @Mock
    DestinationService destinationService;

    @Mock
    DestinationResponse destinationResponse;

    @Mock
    DestinationConfiguration configuration;

    @Mock
    AuthTokens authTokens;

    @Mock
    ReplicationErrorMessagesDAO replicationErrorMessagesDAO;


    private ListAppender<ILoggingEvent> listAppender;
    private MasterDataIntegrationServiceImpl classUnderTest;

    @BeforeEach
    public void setUp() {
        when(this.cfUserProvidedEnvironment.getMdiServiceRetryAttempt()).thenReturn(2);
        when(this.cfUserProvidedEnvironment.getMdiServiceTimeout()).thenReturn(100);
        when(cfEnv.getApp()).thenReturn(cfApplication);
        when(cfEnv.findServiceByLabel(anyString())).thenReturn(cfService);
        when(cfService.getCredentials()).thenReturn(cfCredentials);
        Map<String, Object> map = new HashMap<>();
        when(cfCredentials.getString(anyString())).thenReturn(CONSUMER_DUMMY_OAUTH_TOKEN);
        when(this.masterDataIntegrationVCAP.getServiceUrl()).thenReturn(ONE_MDS_DUMMY_SERVICE_URL);
        when(this.destinationVCAP.getServiceUrl()).thenReturn(ONE_MDS_DUMMY_SERVICE_URL);
        when(destinationResponse.getDestinationConfiguration()).thenReturn(configuration);
        when(configuration.getUrl()).thenReturn(ONE_MDS_DUMMY_SERVICE_URL);
        List<AuthTokens> authTokensList = new ArrayList<>();
        when(authTokens.getType()).thenReturn("bearer");
        when(authTokens.getValue()).thenReturn(BEARER_TOKEN);
        authTokensList.add(authTokens);
        when(destinationResponse.getAuthTokens()).thenReturn(authTokensList);

        HashMap<String, String> uaaDetails = new HashMap<>();
        uaaDetails.put(UAA_DOMAIN, UAA_DOMAIN);
        uaaDetails.put(XS_APP_NAME, ONE_MDS_XS_APP_NAME);
        uaaDetails.put(IDENTITY_ZONE, IDENTITY_ZONE);
        uaaDetails.put(TENANT_ID, TENANT_ID);
        map.put(UAA_NAME, uaaDetails);
        when(cfCredentials.getMap()).thenReturn(map);
        when(this.cacheManager.getCache(MDI_VCAP_VALUE_CACHE_NAME)).thenReturn(cache);
        this.classUnderTest = new MasterDataIntegrationServiceImpl(this.masterDataIntegrationVCAP,
                this.cfUserProvidedEnvironment, this.jobSchedulerService, this.masterDataIntegrationToken,
            this.oneMDSReplicationDeltaTokenDAO, this.webClient,this.destinationService, existingCustomerDetailDAO,
            replicationErrorMessagesDAO, new CalmServiceLocalImpl());
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(listAppender);
    }

    @Test
    @DisplayName("test getLog when master data integration service return raise webClientResponseException (client error).")
    void testGetLogWhenMasterDataIntegrationServiceReturnRaiseHttpClientErrorException() {
        String mdiURL = UriComponentsBuilder.fromUriString(ONE_MDS_DUMMY_SERVICE_URL)
                .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(MDIEntities.COST_CENTER.getName())
                .queryParam(LIMIT_HINT, LIMIT_HINT_VALUE).queryParam(SINCE, SINCE_DELTA_TOKEN).build().toUriString();
        ErrorResponse errorResponse = new ErrorResponse();
        Error error = new Error();
        error.setCode("DeltaTokenMismatch");
        error.setMessage("message");
        errorResponse.setError(error);
        System.out.println("Error Response : " + Json.fromObject(errorResponse).toString());
        when(this.masterDataIntegrationToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class),
                anyString())).thenReturn(BEARER_TOKEN);
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail())
            .thenReturn(Boolean.FALSE);
		when(this.destinationService.getDestinationDetails(any(Marker.class), anyString(),
				any(JobSchedulerRunHeader.class), anyString(), any(MDIEntities.class))).thenReturn(destinationResponse);
        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(mdiURL)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenThrow(webClientResponseException);

        when(webClientResponseException.getRawStatusCode()).thenReturn(400);
        when(webClientResponseException.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(webClientResponseException.getResponseBodyAsString())
                .thenReturn(Json.fromObject(errorResponse).toString());
        when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);

        Map<String, String> replicationErrorMap = new HashMap<String, String>();
        replicationErrorMap.put("RM_CP_007","delta token mismatch error");
        replicationErrorMap.put("RM_CP_009","this is a test");

        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(replicationErrorMap);

        assertNull(this.classUnderTest.getMDILogRecords(marker, CONSUMER_SUB_DOMAIN, MDIEntities.COST_CENTER, SINCE_DELTA_TOKEN,
                String.class, jobSchedulerRunHeader));
        verify(this.jobSchedulerService, times(1)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.webClient, times(2)).get();
        verify(this.requestHeadersUriSpecMock, times(2)).uri(mdiURL);
        verify(this.requestHeadersSpecMock1, times(2)).headers(any(Consumer.class));
        verify(this.requestHeadersSpecMock2, times(2)).retrieve();
        verify(this.cacheManager, times(0)).getCache(MDI_VCAP_VALUE_CACHE_NAME);
        verify(this.cache, times(0)).evictIfPresent(CONSUMER_SUB_DOMAIN);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(5, logsList.size());
        assertHttpClientError(logsList.get(3), HttpMethod.GET, mdiURL, Json.fromObject(errorResponse).toString());
    }

    @Test
    @DisplayName("test getLog when master data integration service return raise webClientResponseException (server error).")
    void testGetLogWhenMasterDataIntegrationServiceReturnRaiseHttpServerErrorException() {
        String mdiURL = UriComponentsBuilder.fromUriString(ONE_MDS_DUMMY_SERVICE_URL)
                .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(MDIEntities.COST_CENTER.getName())
                .queryParam(LIMIT_HINT, LIMIT_HINT_VALUE).queryParam(SINCE, SINCE_DELTA_TOKEN).build().toUriString();
        ErrorResponse errorResponse = new ErrorResponse();
        Error error = new Error();
        error.setCode("500");
        error.setMessage("message");
        errorResponse.setError(error);
        when(this.masterDataIntegrationToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class),
                anyString())).thenReturn(BEARER_TOKEN);
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail())
            .thenReturn(Boolean.FALSE);
		when(this.destinationService.getDestinationDetails(any(Marker.class), anyString(),
				any(JobSchedulerRunHeader.class), anyString(), any(MDIEntities.class))).thenReturn(destinationResponse);
        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(mdiURL)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenThrow(webClientResponseException);

        when(webClientResponseException.getRawStatusCode()).thenReturn(500);
        when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);
        when(webClientResponseException.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(webClientResponseException.getResponseBodyAsString())
                .thenReturn(Json.fromObject(errorResponse).toString());
        Map<String, String> replicationErrorMap = new HashMap<String, String>();
        replicationErrorMap.put("RM_CP_009","Timeout error occurred");
        replicationErrorMap.put("RM_CP_010","Unknown error occurred");

        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(replicationErrorMap);
        assertNull(this.classUnderTest.getMDILogRecords(marker, CONSUMER_SUB_DOMAIN, MDIEntities.COST_CENTER, SINCE_DELTA_TOKEN,
                String.class, jobSchedulerRunHeader));
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.webClient, times(2)).get();
        verify(this.requestHeadersUriSpecMock, times(2)).uri(mdiURL);
        verify(this.requestHeadersSpecMock1, times(2)).headers(any(Consumer.class));
        verify(this.requestHeadersSpecMock2, times(2)).retrieve();
        verify(this.cacheManager, times(0)).getCache(MDI_VCAP_VALUE_CACHE_NAME);
        verify(this.cache, times(0)).evictIfPresent(CONSUMER_SUB_DOMAIN);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(5, logsList.size());
        assertHttpServerError(logsList.get(3), HttpMethod.GET, mdiURL, Json.fromObject(errorResponse).toString());
    }

    @Test
    @DisplayName("test getLog when master data integration service return raise TimeoutException.")
    void testGetLogWhenMasterDataIntegrationServiceReturnRaiseTimeoutException() {
        String mdiURL = UriComponentsBuilder.fromUriString(ONE_MDS_DUMMY_SERVICE_URL)
                .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(MDIEntities.COST_CENTER.getName())
                .queryParam(LIMIT_HINT, LIMIT_HINT_VALUE).queryParam(SINCE, SINCE_DELTA_TOKEN).build().toUriString();
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail())
            .thenReturn(Boolean.FALSE);
        when(this.masterDataIntegrationToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class),
                anyString())).thenReturn(BEARER_TOKEN);
		when(this.destinationService.getDestinationDetails(any(Marker.class), anyString(),
				any(JobSchedulerRunHeader.class), anyString(), any(MDIEntities.class))).thenReturn(destinationResponse);
        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(mdiURL)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(String.class)).thenReturn(responseEntityMock);
        doAnswer(new AnswersWithDelay(1000, new Returns(null))).when(responseEntityMock).block();

        Map<String, String> replicationErrorMap = new HashMap<String, String>();
        replicationErrorMap.put("CP_ERR_001","Error occurred");
        replicationErrorMap.put("RM_CP_009","Timeout error occurred");

        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(replicationErrorMap);

        assertNull(this.classUnderTest.getMDILogRecords(marker, CONSUMER_SUB_DOMAIN, MDIEntities.COST_CENTER, SINCE_DELTA_TOKEN,
                String.class, jobSchedulerRunHeader));
        verify(this.jobSchedulerService, times(1)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.webClient, times(2)).get();
        verify(this.requestHeadersUriSpecMock, times(2)).uri(mdiURL);
        verify(this.requestHeadersSpecMock1, times(2)).headers(any(Consumer.class));
        verify(this.requestHeadersSpecMock2, times(2)).retrieve();
        verify(this.responseSpecMock, times(2)).toEntity(String.class);
        verify(this.responseEntityMock, times(2)).block();

        verify(this.cacheManager, times(0)).getCache(MDI_VCAP_VALUE_CACHE_NAME);
        verify(this.cache, times(0)).evictIfPresent(CONSUMER_SUB_DOMAIN);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(5, logsList.size());
        ILoggingEvent errorLog = logsList.get(3);
        assertEquals(Level.ERROR, errorLog.getLevel());
        assertEquals(
                "Query to get the log from oneMDS took longer than expected: TimeLimiter 'MDITimeLimiter' recorded a timeout exception.",
                errorLog.getFormattedMessage());
    }

    @Test
    @DisplayName("test getLog when fetching token from destination service and master data integration service return something.")
    void testGetLogWhenMasterDataIntegrationServiceReturnSomethingUsingDestinationService() {
        String mdiURL = UriComponentsBuilder.fromUriString(ONE_MDS_DUMMY_SERVICE_URL)
                .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(MDIEntities.COST_CENTER.getName())
                .queryParam(LIMIT_HINT, LIMIT_HINT_VALUE).queryParam(SINCE, SINCE_DELTA_TOKEN).build().toUriString();
        when(this.masterDataIntegrationToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class),
                anyString())).thenReturn(BEARER_TOKEN);
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail())
            .thenReturn(Boolean.FALSE);
		when(this.destinationService.getDestinationDetails(any(Marker.class), anyString(),
				any(JobSchedulerRunHeader.class), anyString(), any(MDIEntities.class))).thenReturn(destinationResponse);
        ResponseEntity<String> result = new ResponseEntity<>("result", HttpStatus.OK);
        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(mdiURL)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(String.class)).thenReturn(responseEntityMock);
        when(responseEntityMock.block()).thenReturn(result);
        assertEquals("result", this.classUnderTest.getMDILogRecords(marker, CONSUMER_SUB_DOMAIN,
                MDIEntities.COST_CENTER, SINCE_DELTA_TOKEN, String.class, jobSchedulerRunHeader));
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
                any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.cacheManager, times(0)).getCache(MDI_VCAP_VALUE_CACHE_NAME);
        verify(this.cache, times(0)).evictIfPresent(CONSUMER_SUB_DOMAIN);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
    }

    @Test
    @DisplayName("test getLog when fetching token from cloned instance and master data integration service return something.")
    void testGetLogWhenMasterDataIntegrationServiceReturnSomethingUsingClonedInstance() {
        String mdiURL = UriComponentsBuilder.fromUriString(ONE_MDS_DUMMY_SERVICE_URL)
            .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(MDIEntities.COST_CENTER.getName())
            .queryParam(LIMIT_HINT, LIMIT_HINT_VALUE).queryParam(SINCE, SINCE_DELTA_TOKEN).build().toUriString();
        when(this.masterDataIntegrationToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        when(this.existingCustomerDetailDAO.getExistingCustomerDetail())
            .thenReturn(Boolean.TRUE);
        ResponseEntity<String> result = new ResponseEntity<>("result", HttpStatus.OK);
        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(mdiURL)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(String.class)).thenReturn(responseEntityMock);
        when(responseEntityMock.block()).thenReturn(result);
        assertEquals("result", this.classUnderTest.getMDILogRecords(marker, CONSUMER_SUB_DOMAIN,
            MDIEntities.COST_CENTER, SINCE_DELTA_TOKEN, String.class, jobSchedulerRunHeader));
        verify(this.jobSchedulerService, times(0)).updateJobRun(any(Marker.class), anyString(),
            any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.cacheManager, times(0)).getCache(MDI_VCAP_VALUE_CACHE_NAME);
        verify(this.cache, times(0)).evictIfPresent(CONSUMER_SUB_DOMAIN);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
    }

    @Test
    @DisplayName("test getLog when master data integration service return null response.")
    void testGetLogWhenMasterDataIntegrationServiceReturnNullResponse() {
        String mdiURL = UriComponentsBuilder.fromUriString(ONE_MDS_DUMMY_SERVICE_URL)
            .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(MDIEntities.COST_CENTER.getName())
            .queryParam(LIMIT_HINT, LIMIT_HINT_VALUE).build().toUriString();
        when(this.masterDataIntegrationToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        when(existingCustomerDetailDAO.getExistingCustomerDetail()).thenReturn(Boolean.TRUE);
        ResponseEntity<String> result = new ResponseEntity<>(null, HttpStatus.OK);
        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(mdiURL)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(String.class)).thenReturn(responseEntityMock);
        when(responseEntityMock.block()).thenReturn(result);
        Map<String, String> replicationErrorMap = new HashMap<>();
        replicationErrorMap.put("RM_CP_010","Unknown Exception occurred");

        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(replicationErrorMap);
        assertNull(this.classUnderTest.getMDILogRecords(marker, CONSUMER_SUB_DOMAIN, MDIEntities.COST_CENTER, SINCE_DELTA_TOKEN,
            String.class, jobSchedulerRunHeader));
        verify(this.jobSchedulerService, times(1)).updateJobRun(any(Marker.class), anyString(),
            any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        verify(this.cacheManager, times(0)).getCache(MDI_VCAP_VALUE_CACHE_NAME);
        verify(this.cache, times(0)).evictIfPresent(CONSUMER_SUB_DOMAIN);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(3, logsList.size());
    }

}
