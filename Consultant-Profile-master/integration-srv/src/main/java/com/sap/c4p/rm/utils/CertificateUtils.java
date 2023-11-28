package com.sap.c4p.rm.utils;

import java.util.Map;

import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

@Component
public class CertificateUtils {
    private static final String UAA_NAME = "uaa";
    private static final String CERT_URL = "certurl";

    @SuppressWarnings("unchecked")
    public String getCertUrlByServiceName(String serviceName) {
        CfEnv cfEnv = new CfEnv();
        CfService cfService = cfEnv.findServiceByLabel(serviceName);
        Map<String, Object> credentials = cfService.getCredentials().getMap();
        Map<String, String> uaa = (Map<String, String>) credentials.get(UAA_NAME);
        return uaa.get(CERT_URL);
    }
}
