package com.sap.c4p.rm.skill.utils;

import java.util.Map;

import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

@Component
public class CfUtils {

  private static final String UAA_NAME = "uaa";
  private static final String CERT_URL = "certurl";

  @SuppressWarnings("unchecked")
  public String getCertUrlByServiceName(String serviceName) {
    CfEnv cfEnv = new CfEnv();
    CfService cfService = cfEnv.findServiceByLabel(serviceName);
    return ((Map<String, String>) cfService.getCredentials().getMap().get(UAA_NAME)).get(CERT_URL);
  }
}