package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JobScheduleRunPayloadTest {

  private static final String KEY_SUCCESS = "success";
  private static final String KEY_MESSAGE = "message";
  private static final String ERROR_MESSAGE = "errorMessage";

  @Test
  @DisplayName("test All argument constructor and toJson")
  public void testAllArgumentConstructorAndToJson() throws JSONException {
    JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(Boolean.TRUE, ERROR_MESSAGE);
    JSONObject jsonObject = jobScheduleRunPayload.toJson();
    assertEquals(ERROR_MESSAGE, jsonObject.getString(KEY_MESSAGE));
    assertTrue(jsonObject.getBoolean(KEY_SUCCESS));
  }

  @Test
  @DisplayName("test All argument constructor and getters")
  public void testAllArgumentConstructorAndGetters() {
    JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(Boolean.TRUE, ERROR_MESSAGE);
    assertEquals(ERROR_MESSAGE, jobScheduleRunPayload.getMessage());
    assertTrue(jobScheduleRunPayload.isSuccess());
  }

}
