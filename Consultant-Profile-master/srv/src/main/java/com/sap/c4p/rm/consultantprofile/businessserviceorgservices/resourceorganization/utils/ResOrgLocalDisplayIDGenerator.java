package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.utils;

import java.util.Random;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile({ "default", "local", "local-test" })
public class ResOrgLocalDisplayIDGenerator implements ResOrgDisplayIDGenerator {
    @Override
    public String getDisplayId() {

        Random rnd = new Random();
        return Integer.toString(10000 + rnd.nextInt(90000));

    }

}
