package com.sap.c4p.rm.config.local;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

@Profile({ "!hana & !local-int-test" })
@Primary
@Qualifier("cfEnv")
@Component
public class LocalCfEnv extends CfEnv {

    public static final String VCAP_SERVICES = "VCAP_SERVICES";

    private final List<CfService> cfServices = new ArrayList<>();

    public LocalCfEnv() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String vcapServicesJson = new String(
                    Files.readAllBytes(Paths.get("src", "integration-test", "resources", "vcap_services.json")));
            if (vcapServicesJson.length() > 0) {
                Map<String, List<Map<String, Object>>> rawServices = objectMapper.readValue(vcapServicesJson,
                        new TypeReference<Map<String, List<Map<String, Object>>>>() {
                        }

                );
                for (Map.Entry<String, List<Map<String, Object>>> entry : rawServices.entrySet()) {
                    for (Map<String, Object> serviceData : entry.getValue()) {
                        cfServices.add(new CfService(serviceData));
                    }
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Could not access/parse " + VCAP_SERVICES + " environment variable.", e);
        }
    }

    @Override
    public List<CfService> findServicesByLabel(String... spec) {
        List<CfService> cfServiceList = new ArrayList<>();
        for (CfService cfService : this.cfServices) {
            if (spec != null) {
                for (String regex : spec) {
                    String name = cfService.getLabel();
                    if (name != null && name.length() > 0 && name.matches(regex)) {
                        cfServiceList.add(cfService);
                    }
                }
            }
        }
        return cfServiceList;
    }

}
