package com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model;

import java.net.MalformedURLException;
import java.net.URL;

import org.springframework.context.annotation.Configuration;

@Configuration
public class JobScheduler {

  private String clientId;
  private String clientSecret;
  private String uaaDomain;
  private String schedulerUrl;
  private String uaaUrl;
  private String certificate;
  private String certUrl;
  private String key;

  public String getClientId() {
    return clientId;
  }

  public void setClientId(String clientId) {
    this.clientId = clientId;
  }

  public String getClientSecret() {
    return clientSecret;
  }

  public void setClientSecret(String clientSecret) {
    this.clientSecret = clientSecret;
  }

  public String getUaaDomain() {
    return uaaDomain;
  }

  public void setUaaDomain(String uaaDomain) {
    this.uaaDomain = uaaDomain;
  }

  public URL getSchedulerUrl() throws MalformedURLException {
    return new URL(schedulerUrl);
  }

  public void setSchedulerUrl(String schedulerUrl) {
    this.schedulerUrl = schedulerUrl;
  }

  public URL getUaaUrl() throws MalformedURLException {
    return new URL(uaaUrl);
  }

  public void setUaaUrl(String uaaUrl) {
    this.uaaUrl = uaaUrl;
  }

  public void setCertificate(String certificate) {
    this.certificate = certificate;
  }

  public String getCertificate() {
    return certificate;
  }

  public void setCertUrl(String certUrl) {
    this.certUrl = certUrl;
  }

  public String getCertUrl() {
    return certUrl;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public String getKey() {
    return key;
  }

}
