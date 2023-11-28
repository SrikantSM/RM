package com.sap.c4p.rm.resourcerequest.auditlog;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.sap.cloud.security.xsuaa.token.Token;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.SecurityEventAuditMessage;

import com.sap.c4p.rm.resourcerequest.utils.CfUtils;

public class AuditLogUtilTest {

  private AuditLogUtil cut;

  @Mock
  private AuditLogMessageFactory mockAuditLogMessageFactory;
  @Mock
  private SecurityEventAuditMessage mockSecurityEventAuditMessage;
  @Mock
  private Token mockToken;
  @Mock
  private CfUtils mockCfUtils;

  @BeforeEach
  public void setUp() throws Exception {
    MockitoAnnotations.openMocks(this).close();
    this.cut = spy(new AuditLogUtil(this.mockAuditLogMessageFactory, this.mockCfUtils));

    doReturn("https://TENANT.authentication.cert.sap.hana.ondemand.com").when(this.cut).getTokenIssuer();
    when(this.mockToken.getSubdomain()).thenReturn("TENANT");
    when(this.mockCfUtils.getCertUrlByServiceName(anyString())).thenReturn("authentication.cert.sap.hana.ondemand.com");
  }

  @Test
  @DisplayName("Testing of log security event method")
  void testLogSecurityEvent() throws AuditLogNotAvailableException, AuditLogWriteException {
    when(mockAuditLogMessageFactory.createSecurityEventAuditMessage()).thenReturn(mockSecurityEventAuditMessage);
    doReturn("0.0.0.0").when(this.cut).getRemoteHost();
    this.cut.logSecurityEvent("test-message");

    verify(this.mockSecurityEventAuditMessage, times(1)).setUser("$USER");
    verify(this.mockSecurityEventAuditMessage, times(1)).setTenant("$SUBSCRIBER",
        "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    verify(this.mockSecurityEventAuditMessage, times(1)).log();
  }

  @Test
  @DisplayName("Test Token issuer")
  void testTokenIssuer() {
    String expectedString = "https://TENANT.authentication.cert.sap.hana.ondemand.com";
    when(mockCfUtils.getCertUrlByServiceName(anyString()))
        .thenReturn("https://rm-bradbury.authentication.cert.sap.hana.ondemand.com");
    when(this.mockToken.getSubdomain()).thenReturn("TENANT");
    assertEquals(expectedString, this.cut.getTokenIssuer());
  }

}
