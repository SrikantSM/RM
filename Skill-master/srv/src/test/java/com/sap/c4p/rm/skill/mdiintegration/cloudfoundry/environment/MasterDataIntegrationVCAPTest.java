package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.ONE_MDS_DUMMY_SERVICE_URL;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.utils.Constants;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;

import io.pivotal.cfenv.core.CfApplication;
import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

/**
 * Test class for {@link MasterDataIntegrationVCAP}
 */
public class MasterDataIntegrationVCAPTest extends InitMocks {

  @Mock
  CfEnv cfEnv;

  @Mock
  CfApplication cfApplication;

  @Mock
  CfService cfService;

  @Mock
  CfCredentials cfCredentials;

  MasterDataIntegrationVCAP classUnderTest;

  @BeforeEach
  public void setUp() {
    // Prepare required UAA details map object
    Map<String, String> uaaDetails = new HashMap<>();
    uaaDetails.put(AbstractVCAPService.CLIENT_ID, AbstractVCAPService.CLIENT_ID);
    uaaDetails.put(AbstractVCAPService.CLIENT_SECRET, AbstractVCAPService.CLIENT_SECRET);
    uaaDetails.put(AbstractVCAPService.IDENTITY_ZONE, AbstractVCAPService.IDENTITY_ZONE);
    uaaDetails.put(AbstractVCAPService.TENANT_ID, AbstractVCAPService.TENANT_ID);
    uaaDetails.put(AbstractVCAPService.UAA_DOMAIN, AbstractVCAPService.UAA_DOMAIN);
    uaaDetails.put(AbstractVCAPService.XS_APP_NAME, AbstractVCAPService.XS_APP_NAME);
    uaaDetails.put("certificate", "certificate");
    uaaDetails.put("certurl", "https://" + AbstractVCAPService.IDENTITY_ZONE + ".hana.test.com");
    uaaDetails.put("key", "key");
    Map<String, Object> cfCredentialMap = new HashMap<>();
    cfCredentialMap.put("uaa", uaaDetails);
    // Adding required stubbing
    when(this.cfEnv.getApp()).thenReturn(this.cfApplication);
    when(this.cfEnv.findServiceByLabel(anyString())).thenReturn(this.cfService);
    when(this.cfService.getCredentials()).thenReturn(this.cfCredentials);
    when(this.cfCredentials.getMap()).thenReturn(cfCredentialMap);
    when(this.cfCredentials.getString(anyString())).thenReturn(ONE_MDS_DUMMY_SERVICE_URL);
    // Creating the test object
    this.classUnderTest = new MasterDataIntegrationVCAP(this.cfEnv);
  }

  @Test
  @DisplayName("Test if correct credentials are returned")
  public void prepareClientCredentialsWithX509Certificate() {
    assertEquals(AbstractVCAPService.CLIENT_ID, this.classUnderTest.getClientId());
    assertEquals(AbstractVCAPService.CLIENT_SECRET, this.classUnderTest.getClientSecret());
    assertEquals(AbstractVCAPService.IDENTITY_ZONE, this.classUnderTest.getIdentityZone());
    assertEquals(AbstractVCAPService.TENANT_ID, this.classUnderTest.getTenantId());
    assertEquals(AbstractVCAPService.UAA_DOMAIN, this.classUnderTest.getUaaDomain());
    assertEquals(AbstractVCAPService.XS_APP_NAME, this.classUnderTest.getXsAppName());
    assertEquals(ONE_MDS_DUMMY_SERVICE_URL, this.classUnderTest.getServiceUrl());
    assertEquals(
        StringFormatter.format("https://{0}.uaadomain/{1}/{2}", CONSUMER_SUB_DOMAIN, Constants.OAUTH, Constants.TOKEN),
        this.classUnderTest.getOAuthTokenUrl(CONSUMER_SUB_DOMAIN));
    assertEquals(StringFormatter.format("https://{0}.hana.test.com/{1}/{2}", CONSUMER_SUB_DOMAIN, Constants.OAUTH,
        Constants.TOKEN), this.classUnderTest.getCertOAuthTokenUrl(CONSUMER_SUB_DOMAIN));
  }

  @Test
  @DisplayName("Test if correct credentials are returned")
  public void prepareClientCredentialsWithX509CertificateUrlIsAlreadySet() {
    classUnderTest.certOAuthTokenUrl = "http://test.url.test.com";
    assertEquals(classUnderTest.certOAuthTokenUrl + "/oauth/token",
        this.classUnderTest.getCertOAuthTokenUrl(CONSUMER_SUB_DOMAIN));
  }

}
