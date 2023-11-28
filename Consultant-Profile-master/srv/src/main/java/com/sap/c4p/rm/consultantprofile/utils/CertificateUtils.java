package com.sap.c4p.rm.consultantprofile.utils;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

@Component
public class CertificateUtils {
    private static final String UAA_NAME = "uaa";
    private static final String CERT_URL = "certurl";

    private final CfEnv cfEnv;

    @Autowired
    public CertificateUtils(final CfEnv cfEnv) {
        this.cfEnv = cfEnv;
    }

    @SuppressWarnings("unchecked")
    public String getCertUrlByServiceName(String serviceName) {
        CfService cfService = this.cfEnv.findServiceByLabel(serviceName);
        Map<String, Object> credentials = cfService.getCredentials().getMap();
        Map<String, String> uaa = (Map<String, String>) credentials.get(UAA_NAME);
        return uaa.get(CERT_URL);
    }
}
