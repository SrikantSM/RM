package com.sap.c4p.rm.cloudfoundry.environment;

import static com.sap.c4p.rm.TestConstants.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.utils.Constants;
import com.sap.c4p.rm.utils.StringFormatter;

import io.pivotal.cfenv.core.CfApplication;
import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

/**
 * Test Class for {@link XSUaaVCAP}
 */
public class XSUaaVCAPTest extends InitMocks {

    @Mock
    CfEnv cfEnv;

    @Mock
    CfApplication cfApplication;

    @Mock
    CfService cfService;

    @Mock
    CfCredentials cfCredentials;

    private AbstractVCAPService classUnderTest;

    @BeforeEach
    public void setUp() {
        // Prepare required UAA details map object
        Map<String, String> uaaDetails = new HashMap<>();
        Map<String, Object> cfCredentialMap = new HashMap<>();
        cfCredentialMap.put("uaa", uaaDetails);
        // Adding required stubbing
        when(this.cfEnv.getApp()).thenReturn(this.cfApplication);
        when(this.cfEnv.findServiceByLabel(anyString())).thenReturn(this.cfService);
        when(this.cfService.getCredentials()).thenReturn(this.cfCredentials);
        when(this.cfCredentials.getMap()).thenReturn(cfCredentialMap);
        when(this.cfCredentials.getString(anyString())).thenReturn(AUTH_URL, AbstractVCAPService.CLIENT_ID,
                AbstractVCAPService.CLIENT_SECRET, AbstractVCAPService.UAA_DOMAIN, AbstractVCAPService.XS_APP_NAME,
                AbstractVCAPService.IDENTITY_ZONE, AbstractVCAPService.TENANT_ID);
        // Creating the test object
        this.classUnderTest = new XSUaaVCAP(this.cfEnv);
    }

    @Test
    @DisplayName("Test if correct credentials are returned")
    public void prepareClientCredentials() {
        assertEquals(AbstractVCAPService.CLIENT_ID, this.classUnderTest.getClientId());
        assertEquals(AbstractVCAPService.CLIENT_SECRET, this.classUnderTest.getClientSecret());
        assertEquals(AbstractVCAPService.IDENTITY_ZONE, this.classUnderTest.getIdentityZone());
        assertEquals(AbstractVCAPService.TENANT_ID, this.classUnderTest.getTenantId());
        assertEquals(AbstractVCAPService.UAA_DOMAIN, this.classUnderTest.getUaaDomain());
        assertEquals(AbstractVCAPService.XS_APP_NAME, this.classUnderTest.getXsAppName());
        assertEquals(AUTH_URL, this.classUnderTest.getServiceUrl());
        assertEquals(StringFormatter.format("https://{0}.uaadomain/{1}/{2}", CONSUMER_SUB_DOMAIN, Constants.OAUTH,
                Constants.TOKEN), this.classUnderTest.getOAuthTokenUrl(CONSUMER_SUB_DOMAIN));
    }

}
