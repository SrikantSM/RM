package com.sap.c4p.rm.cloudfoundry.service.destination.service;

import static com.sap.c4p.rm.TestConstants.BEARER_TOKEN;
import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.TestConstants.DESTINATION_DUMMY_SERVICE_URL;
import static com.sap.c4p.rm.TestConstants.DESTINATION_NOT_FOUND;
import static com.sap.c4p.rm.TestConstants.HTTP_ERROR_RESPONSE_BODY;
import static com.sap.c4p.rm.TestConstants.ONE_MDS_DUMMY_SERVICE_URL;
import static com.sap.c4p.rm.TestConstants.SOMETHING_WENT_WRONG;
import static com.sap.c4p.rm.TestConstants.UNKNOWN_EXCEPTION;
import static com.sap.c4p.rm.TestHelper.assertHttpServerError;
import static com.sap.c4p.rm.TestHelper.assertNotFoundError;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
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
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.calm.CalmServiceLocalImpl;
import com.sap.c4p.rm.cloudfoundry.authclient.DestinationToken;
import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.cloudfoundry.environment.DestinationVCAP;
import com.sap.c4p.rm.cloudfoundry.service.destination.model.AuthTokens;
import com.sap.c4p.rm.cloudfoundry.service.destination.model.DestinationConfiguration;
import com.sap.c4p.rm.cloudfoundry.service.destination.model.DestinationResponse;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.replicationdao.ReplicationErrorMessagesDAO;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import reactor.core.publisher.Mono;

public class DestinationServiceTest extends InitMocks {

    private final Logger logger = (Logger) LoggerFactory.getLogger(DestinationServiceImpl.class);
    protected static final String DESTINATION_JOB_PATH_SEGMENT = "destination-configuration/v1/destinations/";
    private static final String DESTINATION_NAME = "C4PRM";

    @Mock
    DestinationToken destinationToken;

    @Mock
    DestinationVCAP destinationVCAP;

    @Mock
    WebClient webClient;

    @Mock
    WebClient.RequestBodyUriSpec requestBodyUriSpecMock;

    @Mock
    WebClient.RequestBodySpec requestBodySpecMock1;

    @Mock
    WebClient.RequestBodySpec requestBodySpecMock2;

    @Mock
    WebClient.RequestHeadersUriSpec requestHeadersUriSpecMock;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock1;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock2;

    @Mock
    WebClient.ResponseSpec responseSpecMock;

    @Mock
    Mono<ResponseEntity<DestinationResponse>> getResponseBodymock;

    @Mock
    Marker marker;

    @Mock
    JobSchedulerService jobSchedulerService;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Mock
    DestinationResponse destinationResponse;

    @Mock
    DestinationConfiguration configuration;

    @Mock
    AuthTokens authTokens;

    @Mock
    WebClientResponseException webClientResponseException;

    @Mock
    RuntimeException runtimeException;

    @Mock
    ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

    private DestinationServiceImpl classUnderTest;
    private UriComponentsBuilder destinationBaseUriBuilder;

    private static final HttpHeaders requestHeaders = new HttpHeaders();

    private ListAppender<ILoggingEvent> listAppender;

    private String SINCE_DELTA_TOKEN = "since_Token";

    @BeforeEach
    public void setUp() {
        when(this.destinationVCAP.getServiceUrl()).thenReturn(DESTINATION_DUMMY_SERVICE_URL);
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.setBearerAuth(BEARER_TOKEN);
        this.destinationBaseUriBuilder = UriComponentsBuilder.fromUriString(this.destinationVCAP.getServiceUrl())
            .pathSegment(DESTINATION_JOB_PATH_SEGMENT).pathSegment(DESTINATION_NAME);
        this.classUnderTest = new DestinationServiceImpl(destinationToken, destinationVCAP,webClient,jobSchedulerService, replicationErrorMessagesDAO, new CalmServiceLocalImpl());
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(this.listAppender);
    }

    @Test
    @DisplayName("Test getDestinationDetails when no bearer token for hitting destination service")
    public void getDestinationDetails_NullBearerTokenTest() {
    when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
        anyString())).thenReturn(null);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader,SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
    }

    @Test
    @DisplayName("Test getDestinationDetails when auth token received from destination service is null")
    public void getDestinationDetails_NullAuthTokenTest() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        ResponseEntity<DestinationResponse> destinationResponseEntity = new ResponseEntity<>(destinationResponse, HttpStatus.OK);
        when(destinationResponse.getDestinationConfiguration()).thenReturn(configuration);
        List<AuthTokens> authTokensList = new ArrayList<>();
        authTokensList.add(authTokens);
        when(authTokens.getValue()).thenReturn(null);
        when(authTokens.getType()).thenReturn("bearer");
        when(authTokens.getError()).thenReturn("401 Unauthorized: TLS handshake failed. X509_V_ERR_CERT_HAS_EXPIRED");
        when(destinationResponse.getAuthTokens()).thenReturn(authTokensList);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenReturn(destinationResponseEntity);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(marker),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertEquals("Destination Find API returned an error: 401 Unauthorized: TLS handshake failed. X509_V_ERR_CERT_HAS_EXPIRED", logsList.get(0).getFormattedMessage());
    }

    @Test
    @DisplayName("Test getDestinationDetails when auth token received from destination service is not of type 'bearer'")
    public void getDestinationDetails_NoBearerAuthTokenTest() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        ResponseEntity<DestinationResponse> destinationResponseEntity = new ResponseEntity<>(destinationResponse, HttpStatus.OK);
        when(destinationResponse.getDestinationConfiguration()).thenReturn(configuration);
        when(configuration.getUrl()).thenReturn(ONE_MDS_DUMMY_SERVICE_URL);
        List<AuthTokens> authTokensList = new ArrayList<>();
        when(authTokens.getType()).thenReturn("test");
        when(authTokens.getValue()).thenReturn(BEARER_TOKEN);
        authTokensList.add(authTokens);
        when(destinationResponse.getAuthTokens()).thenReturn(authTokensList);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenReturn(destinationResponseEntity);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(marker),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertEquals(Level.ERROR, logsList.get(0).getLevel());
    }

    @Test
    @DisplayName("Test getDestinationDetails when destination service response is null")
    public void getDestinationDetails_NulldestinationResponse() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenReturn(null);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(marker),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertEquals(Level.ERROR, logsList.get(0).getLevel());
    }

    @Test
    @DisplayName("Test getDestinationDetails when destination configuration (MDI URL) received from destination service is null")
    public void getDestinationDetails_NullDestinationConfigurationTest() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        DestinationResponse resp = new DestinationResponse();
        ResponseEntity<DestinationResponse> destinationResponseEntity = new ResponseEntity<>(resp, HttpStatus.OK);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenReturn(destinationResponseEntity);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
        verify(this.jobSchedulerService, times(1)).updateJobRun(eq(marker),
            eq(CONSUMER_SUB_DOMAIN), any(JobSchedulerRunHeader.class), any(JobScheduleRunPayload.class));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertEquals(Level.ERROR, logsList.get(0).getLevel());
    }

    @Test
    @DisplayName("Test getDestinationDetails when destination service returns valid response")
    public void getDestinationDetails_destinationResponse() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        when(destinationResponse.getDestinationConfiguration()).thenReturn(configuration);
        when(configuration.getUrl()).thenReturn(ONE_MDS_DUMMY_SERVICE_URL);
        List<AuthTokens> authTokensList = new ArrayList<>();
        when(authTokens.getType()).thenReturn("bearer");
        when(authTokens.getValue()).thenReturn(BEARER_TOKEN);
        authTokensList.add(authTokens);
        when(destinationResponse.getAuthTokens()).thenReturn(authTokensList);
        ResponseEntity<DestinationResponse> destinationResponseEntity = new ResponseEntity<>(destinationResponse, HttpStatus.OK);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenReturn(destinationResponseEntity);
        assertEquals(destinationResponse,this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
    }

    @Test
    @DisplayName("Test getDestinationDetails when unable to connect with destination service")
    public void getDestinationDetails_ClientOrServerException() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        when(webClientResponseException.getRawStatusCode()).thenReturn(500);
        when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
        when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenThrow(webClientResponseException);
        Map<String, String> replicationErrorMap = new HashMap<>();
        replicationErrorMap.put("RM_CP_011","Exception occurred");

        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(replicationErrorMap);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.GET, this.destinationBaseUriBuilder.build().toString(), "Error Response Body");
    }

    @Test
    @DisplayName("Test getDestinationDetails when destination service throws unknown exception")
    public void getDestinationDetails_UnknownException() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        when(runtimeException.getMessage()).thenReturn(UNKNOWN_EXCEPTION);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenThrow(runtimeException);
        Map<String, String> replicationErrorMap = new HashMap<>();
        replicationErrorMap.put("RM_CP_010","Unknown Exception occurred");

        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(replicationErrorMap);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertEquals(Level.ERROR, logsList.get(0).getLevel());
    }

    @Test
    @DisplayName("Test getDestinationDetails when destination not found")
    public void getDestinationDetails_DestinationNotFound() {
        when(this.destinationToken.getOAuthToken(ArgumentMatchers.any(Marker.class),ArgumentMatchers.any(AbstractVCAPService.class),
            anyString())).thenReturn(BEARER_TOKEN);
        when(webClientResponseException.getRawStatusCode()).thenReturn(404);
        when(webClientResponseException.getStatusCode()).thenReturn(HttpStatus.NOT_FOUND);
        when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
        when(webClientResponseException.getMessage()).thenReturn(DESTINATION_NOT_FOUND);
        when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(this.destinationBaseUriBuilder.build().toString())).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.headers(any(Consumer.class))).thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.toEntity(DestinationResponse.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenThrow(webClientResponseException);
        Map<String, String> replicationErrorMap = new HashMap<String, String>();
        replicationErrorMap.put("RM_CP_012","Destination Not Found Exception");

        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(replicationErrorMap);
        assertNull(this.classUnderTest.getDestinationDetails(marker, CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, SINCE_DELTA_TOKEN, MDIEntities.WORKFORCE_PERSON));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertNotFoundError(logsList.get(0), HttpMethod.GET, this.destinationBaseUriBuilder.build().toString(), "Error Response Body");
    }


}
