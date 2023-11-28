package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model;

import static com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerPOJOUtil.*;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

import lombok.Data;

/**
 * A POJO class to create the payload and parse the response of JobScheduler
 * APIs This class holds the Job Level information
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobSchedulerInfo {

  public static final String KEY_NAME = "name";
  protected static final String KEY_DESCRIPTION = "description";
  protected static final String KEY_ACTION = "action";
  public static final String KEY_ACTIVE = "active";
  protected static final String KEY_HTTP_METHOD = "httpMethod";
  protected static final String KEY_START_TIME = "startTime";
  protected static final String KEY_END_TIME = "endTime";
  protected static final String KEY_SIGNATURE_VERSION = "signatureVersion";
  protected static final String KEY_ID = "_id";
  protected static final String KEY_JOB_ID = "jobId";
  protected static final String KEY_CREATED_AT = "createdAt";
  public static final String KEY_SCHEDULES = "schedules";

  private String name;
  private String description;
  private String action;
  private boolean active;
  private String httpMethod;
  private JobSchedulerTime startTime;
  private JobSchedulerTime endTime;
  private BigInteger signatureVersion;
  private String id; // Represents _id field of JobScheduler Response
  private JobSchedulerTime createdAt;
  private List<JobSchedulerSchedule> schedules = new ArrayList<>();

  public JSONObject toJson() {
    final JSONObject result = new JSONObject();
    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(id))) {
      result.put(KEY_ID, id);
    }
    result.put(KEY_NAME, name);
    result.put(KEY_ACTION, action);
    result.put(KEY_ACTIVE, active);
    result.put(KEY_HTTP_METHOD, httpMethod);
    result.put(KEY_DESCRIPTION, description);
    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(startTime))) {
      result.put(KEY_START_TIME, startTime.toJson());
    }
    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(endTime))) {
      result.put(KEY_END_TIME, endTime.toJson());
    }
    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(schedules))) {
      JSONArray schedules1 = new JSONArray();
      result.put(KEY_SCHEDULES, schedules1);
      for (JobSchedulerSchedule schedule : schedules) {
        schedules1.put(schedule.toJson());
      }
    }
    return result;
  }

  public void fromJson(JSONObject input) {
    String jobId = validateAndGetStringValueOf(input, KEY_JOB_ID);
    id = (jobId == null) ? validateAndGetStringValueOf(input, KEY_ID) : jobId;
    signatureVersion = validateAndGetBigInteger(input, KEY_SIGNATURE_VERSION);
    name = validateAndGetString(input, KEY_NAME);
    action = validateAndGetString(input, KEY_ACTION);
    active = validateAndGetBoolean(input, KEY_ACTIVE);
    httpMethod = validateAndGetString(input, KEY_HTTP_METHOD);
    description = validateAndGetString(input, KEY_DESCRIPTION);
    startTime = validateAndGetJobSchedulerTime(input, KEY_START_TIME);
    endTime = validateAndGetJobSchedulerTime(input, KEY_END_TIME);
    createdAt = validateAndGetJobSchedulerTime(input, KEY_CREATED_AT);
    if (input.has(KEY_SCHEDULES)) {
      JSONArray inputSchedules = input.getJSONArray(KEY_SCHEDULES);
      for (int i = 0; i < inputSchedules.length(); i++) {
        JobSchedulerSchedule schedule = new JobSchedulerSchedule();
        schedule.fromJson(inputSchedules.getJSONObject(i));
        schedules.add(schedule);
      }
    }
  }

}
