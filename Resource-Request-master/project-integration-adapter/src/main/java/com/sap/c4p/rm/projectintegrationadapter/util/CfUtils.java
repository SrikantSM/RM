package com.sap.c4p.rm.projectintegrationadapter.util;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.JobScheduler;
import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

import io.pivotal.cfenv.core.CfApplication;
import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

@Component
public class CfUtils {
  private static final Logger logger = LoggerFactory.getLogger(CfUtils.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_CF_UTIL_MARKER.getMarker();
  private static final String UAA_NAME = "uaa";
  private static final String XSUAA_NAME = "xsuaa";
  private static final String XS_APP_NAME = "xsappname";
  private static final String JOB_SCHEDULER = "jobscheduler";
  private static final String CLIENT_ID = "clientid";
  private static final String CLIENT_SECRET = "clientsecret";
  private static final String UAA_DOMAIN = "uaadomain";
  private static final String BASE_URL = "sburl";
  private static final String URL = "url";
  private static final String CERT_URL = "certurl";
  private static final String CERT = "certificate";
  private static final String KEY = "key";

  @Autowired
  JobScheduler jobScheduler;

  public String getXSAppName(String serviceLabelName) {
    CfEnv cfEnv = new CfEnv();
    CfService cfService = cfEnv.findServiceByLabel(serviceLabelName);
    CfCredentials cfCredentials = cfService.getCredentials();
    if (cfCredentials.getMap().containsKey(XS_APP_NAME))
      return (String) cfCredentials.getMap().get(XS_APP_NAME);
    else
      return ((Map<String, String>) cfCredentials.getMap().get(UAA_NAME)).get(XS_APP_NAME);
  }

  public String getCertUrlByServiceName(String serviceName) {
    CfEnv cfEnv = new CfEnv();
    CfService cfService = cfEnv.findServiceByLabel(serviceName);
    return ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(CERT_URL);
  }

  public JobScheduler getServiceForJobSceduler() {

    try {
      CfEnv cfEnv = new CfEnv();
      CfService cfService = cfEnv.findServiceByLabel(JOB_SCHEDULER);

      String clientId = ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(CLIENT_ID);
      jobScheduler.setClientId(clientId);

      String clientSecret = ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME))
          .get(CLIENT_SECRET);
      jobScheduler.setClientSecret(clientSecret);

      String uaaDomain = ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(UAA_DOMAIN);
      jobScheduler.setUaaDomain(uaaDomain);

      String url = (String) cfService.getCredentials().getMap().get(URL);
      jobScheduler.setSchedulerUrl(url);

      String uaaUrl = ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(BASE_URL);
      jobScheduler.setUaaUrl(uaaUrl);

      String certUrl = ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(CERT_URL);
      jobScheduler.setCertUrl(certUrl);

      String certificate = ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(CERT);
      jobScheduler.setCertificate(certificate);

      String key = ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(KEY);
      jobScheduler.setKey(key);

      return jobScheduler;

    } catch (Exception e) {
      logger.debug(MARKER, "Failed while reading jobscheduler VCAP service");
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed read jobscheduler VCAP service", e);
    }
  }

  public String getApplicationUris() {
    CfEnv cfEnv = new CfEnv();
    CfApplication cfApplication = cfEnv.getApp();
    return cfApplication.getApplicationUris().get(0);
  }

  public String getZoneId() {
    CfEnv cfEnv = new CfEnv();
    CfService cfService = cfEnv.findServiceByLabel(XSUAA_NAME);
    return ((Map<String, Object>) cfService.getCredentials().getMap()).get("zoneid").toString();
  }
}
