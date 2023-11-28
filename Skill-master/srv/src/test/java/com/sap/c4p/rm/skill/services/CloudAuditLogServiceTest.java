package com.sap.c4p.rm.skill.services;

import com.sap.c4p.rm.skill.utils.CfUtils;
import com.sap.c4p.rm.skill.utils.HttpRequestHelper;
import com.sap.cloud.security.xsuaa.token.SpringSecurityContext;
import com.sap.cloud.security.xsuaa.token.Token;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.ConfigurationChangeAuditMessage;
import com.sap.xs.audit.api.v2.SecurityEventAuditMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CloudAuditLogServiceTest {

  private CloudAuditLogService cut;
  private CloudAuditLogService spiedCut;

  @Mock
  private AuditLogMessageFactory mockAuditLogMessageFactory;

  @Mock
  private SecurityEventAuditMessage mockSecurityEventAuditMessage;

  @Mock
  private ConfigurationChangeAuditMessage mockConfigurationChangeAuditMessage;

  @Mock
  private AuditedObject mockAuditedObject;

  @Mock
  private Token mockToken;

  @Mock
  private CfUtils mockCfUtils;

  @BeforeEach
  void setUp() throws Exception {
    MockitoAnnotations.openMocks(this).close();
    this.cut = spy(new CloudAuditLogService(this.mockAuditLogMessageFactory, this.mockCfUtils));

    when(this.mockToken.getSubdomain()).thenReturn("TENANT");
    when(this.mockAuditLogMessageFactory.createConfigurationChangeAuditMessage())
        .thenReturn(this.mockConfigurationChangeAuditMessage);
    when(this.mockAuditLogMessageFactory.createSecurityEventAuditMessage())
        .thenReturn(this.mockSecurityEventAuditMessage);
    when(this.mockAuditLogMessageFactory.createAuditedObject()).thenReturn(this.mockAuditedObject);
    when(this.mockCfUtils.getCertUrlByServiceName(anyString()))
        .thenReturn("https://paas-subdomain.authentication.cert.sap.hana.ondemand.com");
  }

  @Test
  @DisplayName("Testing of log configuration change method")
  void testLogConfigurationChange() throws AuditLogNotAvailableException, AuditLogWriteException {
    doReturn("https://TENANT.authentication.cert.sap.hana.ondemand.com").when(this.cut).getTokenIssuer();
    this.cut.logConfigurationChange("id", "testCatalogId", "catalogName", "testCatalogName", null, "skill catalog");
    verify(this.mockConfigurationChangeAuditMessage, times(1)).setUser("$USER");
    verify(this.mockConfigurationChangeAuditMessage, times(1)).setTenant("$SUBSCRIBER",
        "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    verify(this.mockConfigurationChangeAuditMessage, times(1)).logSuccess();
  }

  @Test
  @DisplayName("Test Token issuer")
  void testTokenIssuer() {
    String expectedString = "https://TENANT.authentication.cert.sap.hana.ondemand.com";
    when(mockCfUtils.getCertUrlByServiceName(anyString()))
        .thenReturn("https://paas-subdomain.authentication.cert.sap.hana.ondemand.com");
    when(this.mockToken.getSubdomain()).thenReturn("TENANT");

    try (MockedStatic<SpringSecurityContext> springSecurityContext = Mockito.mockStatic(SpringSecurityContext.class)) {
      springSecurityContext.when(SpringSecurityContext::getToken).thenReturn(mockToken);
      String tokenIssuerUrl = this.cut.getTokenIssuer();
      assertEquals(expectedString, tokenIssuerUrl);
    }
  }

  @Test
  @DisplayName("test log security event")
  void testLogSecurityEvent() throws AuditLogNotAvailableException, AuditLogWriteException {
    doReturn("0.0.0.0").when(this.cut).getRemoteHost();
    doReturn("https://TENANT.authentication.cert.sap.hana.ondemand.com").when(this.cut).getTokenIssuer();
    this.cut.logSecurityEvent("test-message");
    verify(this.mockSecurityEventAuditMessage, times(1)).setUser("$USER");
    verify(this.mockSecurityEventAuditMessage, times(1)).setTenant("$SUBSCRIBER",
        "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    verify(this.mockSecurityEventAuditMessage, times(1)).log();
  }

  @Test
  @DisplayName("Test Remote host")
  void testGetRemoteHost() {
    String expRemoteHost = "0.0.0.0";
    HttpServletRequest mockHttpServletRequest = mock(HttpServletRequest.class);

    try (MockedStatic<HttpRequestHelper> httpRequestHelper = Mockito.mockStatic(HttpRequestHelper.class)) {
      httpRequestHelper.when(HttpRequestHelper::getHttpRequest).thenReturn(mockHttpServletRequest);
      when(mockHttpServletRequest.getRemoteHost()).thenReturn("0.0.0.0");
      String remoteHost = this.cut.getRemoteHost();
      assertEquals(expRemoteHost, remoteHost);
    }
  }
}
