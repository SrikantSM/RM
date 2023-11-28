package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import java.math.BigInteger;

import org.json.JSONObject;

/**
 * Class having some common methods that is consumable by class present in this
 * package only.
 */
class JobSchedulerPOJOUtil {

    private JobSchedulerPOJOUtil() {
    }

    protected static BigInteger validateAndGetBigInteger(JSONObject input, String key) {
        if (Boolean.FALSE.equals(input.isNull(key)))
            return input.getBigInteger(key);
        else
            return null;
    }

    protected static String validateAndGetString(JSONObject input, String key) {
        if (Boolean.FALSE.equals(input.isNull(key)))
            return input.getString(key);
        else
            return null;
    }

    protected static String validateAndGetStringValueOf(JSONObject input, String key) {
        if (Boolean.FALSE.equals(input.isNull(key)))
            return String.valueOf(input.get(key));
        else
            return null;
    }

    protected static Boolean validateAndGetBoolean(JSONObject input, String key) {
        if (Boolean.FALSE.equals(input.isNull(key)))
            return input.getBoolean(key);
        else
            return Boolean.FALSE;
    }

    protected static JobSchedulerTime validateAndGetJobSchedulerTime(JSONObject input, String key) {
        JobSchedulerTime startTime1 = new JobSchedulerTime();
        if (Boolean.FALSE.equals(input.isNull(key)))
            startTime1.fromJson(input.getString(key));
        else
            return null;
        return startTime1;
    }

}
