package com.sap.c4p.rm.consultantprofile.utils;

import static org.mockito.Mockito.when;

import java.util.HashMap;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

public class CertificateUtilsTest extends InitMocks {

    @Mock
    CfEnv mockCfEnv;

    @Mock
    CfService mockCfService;

    @Mock
    CfCredentials mockCfCredentials;

    @InjectMocks
    CertificateUtils classUnderTest;

    @Test
    @DisplayName("Test getUserId method when email from JWT is null")
    void testgetCertUrlByServiceName() {
        when(mockCfEnv.findServiceByLabel("auditlog")).thenReturn(mockCfService);
        when(mockCfService.getCredentials()).thenReturn(mockCfCredentials);
        HashMap<String, Object> credentialsMap = new HashMap<String, Object>();
        HashMap<String, String> uaaMap = new HashMap<String, String>();
        uaaMap.put("certurl", "https://test.url.com");
        credentialsMap.put("uaa", uaaMap);
        when(mockCfCredentials.getMap()).thenReturn(credentialsMap);
        Assertions.assertEquals("https://test.url.com", classUnderTest.getCertUrlByServiceName("auditlog"));

    }
}
