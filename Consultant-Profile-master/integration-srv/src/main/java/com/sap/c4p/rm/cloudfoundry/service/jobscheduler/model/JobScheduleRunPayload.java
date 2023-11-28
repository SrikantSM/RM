package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import org.json.JSONObject;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JobScheduleRunPayload {

    private static final String KEY_SUCCESS = "success";
    private static final String KEY_MESSAGE = "message";

    private final boolean success;
    private final String message;

    public JSONObject toJson() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(KEY_SUCCESS, success);
        jsonObject.put(KEY_MESSAGE, message);
        return jsonObject;
    }

}
