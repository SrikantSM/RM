package com.sap.c4p.rm.cloudfoundry.environment;

import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.sap.c4p.rm.utils.Constants;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.c4p.rm.utils.StringFormatter;

import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;
import lombok.Getter;

/**
 * An Abstract class to provide the integration-srv VCAP environment variables
 * information.
 */
public abstract class AbstractVCAPService {

    protected static final String UAA_NAME = "uaa";
    protected static final String CLIENT_ID = "clientid";
    protected static final String CLIENT_SECRET = "clientsecret";
    protected static final String UAA_DOMAIN = "uaadomain";
    protected static final String URI = "uri";
    protected static final String URL = "url";
    protected static final String XS_APP_NAME = "xsappname";
    protected static final String IDENTITY_ZONE = "identityzone";
    protected static final String TENANT_ID = "tenantid";
    protected static final String CERT_URL = "certurl";
    protected static final String CERTIFICATE = "certificate";
    protected static final String KEY = "key";

    protected CfCredentials cfCredentials;
    protected UaaDetails uaaDetails;

    @Getter
    protected String clientId;
    @Getter
    protected String clientSecret;
    @Getter
    protected String uaaDomain;
    @Getter
    protected String xsAppName;
    @Getter
    protected String serviceUrl;
    @Getter
    protected String identityZone;
    @Getter
    protected String tenantId;
    @Getter
    protected String certificate;
    @Getter
    protected String certurl;
    @Getter
    protected String key;

    protected String oAuthTokenUrl;

    protected String certOAuthTokenUrl;

    protected void readServiceVCAP(final String serviceLabel, final CfEnv cfEnv, final String urlIdentifier) {
        CfService cfService = cfEnv.findServiceByLabel(serviceLabel);
        this.cfCredentials = cfService.getCredentials();
        this.serviceUrl = this.cfCredentials.getString(urlIdentifier);
        this.setUaaDetails();
    }

    protected void prepareClientCredentialsWithX509Certificate() {
        this.clientId = uaaDetails.getClientid();
        this.clientSecret = uaaDetails.getClientsecret();
        this.uaaDomain = uaaDetails.getUaadomain();
        this.xsAppName = uaaDetails.getXsappname();
        this.identityZone = uaaDetails.getIdentityzone();
        this.tenantId = uaaDetails.getTenantid();
        this.certificate = uaaDetails.getCertificate();
        this.certurl = uaaDetails.getCerturl();
        this.key = uaaDetails.getKey();
    }

    public String getOAuthTokenUrl(final String subDomain) {
        if (IsNullCheckUtils.isNullOrEmpty(this.oAuthTokenUrl))
            return UriComponentsBuilder.newInstance().scheme(Constants.HTTPS)
                    .host(StringFormatter.format("{0}.{1}", subDomain, this.getUaaDomain()))
                    .pathSegment(Constants.OAUTH, Constants.TOKEN).build().toUriString();
        else
            return UriComponentsBuilder.fromHttpUrl(this.oAuthTokenUrl).pathSegment(Constants.OAUTH, Constants.TOKEN)
                    .build().toUriString();
    }

    public String getCertOAuthTokenUrl(final String subDomain) {
        if (IsNullCheckUtils.isNullOrEmpty(this.certOAuthTokenUrl))
            return UriComponentsBuilder.fromHttpUrl(certurl.replaceFirst(this.identityZone, subDomain))
                    .pathSegment(Constants.OAUTH, Constants.TOKEN).build().toUriString();
        else
            return UriComponentsBuilder.fromHttpUrl(this.certOAuthTokenUrl)
                    .pathSegment(Constants.OAUTH, Constants.TOKEN).build().toUriString();
    }

    private void setUaaDetails() {
        ObjectMapper objectMapper = new ObjectMapper();
        this.uaaDetails = objectMapper.convertValue(this.cfCredentials.getMap().get(UAA_NAME), UaaDetails.class);
    }

}
