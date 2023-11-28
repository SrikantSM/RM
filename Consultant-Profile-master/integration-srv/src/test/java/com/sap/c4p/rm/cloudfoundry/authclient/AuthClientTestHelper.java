package com.sap.c4p.rm.cloudfoundry.authclient;

import static com.sap.c4p.rm.cloudfoundry.authclient.AbstractAuthClient.*;

import org.junit.jupiter.api.BeforeAll;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.utils.Constants;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import reactor.core.publisher.Mono;

public abstract class AuthClientTestHelper extends InitMocks {

    protected final ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
    protected static MultiValueMap<String, String> headerMap;

    @Mock
    Cache cache;

    @Mock
    CacheManager cacheManager;

    @Mock
    WebClientResponseException webClientResponseException;

    @Mock
    Marker marker;

    @Mock
    WebClient webClient;

    @Mock
    WebClient.RequestBodyUriSpec requestBodyUriSpecMock;

    @Mock
    WebClient.RequestBodySpec requestBodySpecMock1;

    @Mock
    WebClient.RequestBodySpec requestBodySpecMock2;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock;

    @Mock
    WebClient.RequestHeadersUriSpec requestHeadersUriSpecMock;

    @Mock
    WebClient.ResponseSpec responseSpecMock;

    @Mock
    Mono<OAuthTokenResponse> postResponseBodymock;

    @BeforeAll
    public static void setUpAll() {
        headerMap = new LinkedMultiValueMap<>();
        headerMap.add(CLIENT_ID, CLIENT_ID);
        headerMap.add(CLIENT_SECRET, CLIENT_SECRET);
        headerMap.add(GRANT_TYPE, CLIENT_CREDENTIALS);
        headerMap.add(RESPONSE, Constants.TOKEN);
    }

}
