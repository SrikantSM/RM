package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model;

import static com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerPOJOUtil.*;

import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

import lombok.Data;

/**
 * A POJO class to create the payload and parse the response of JobScheduler
 * APIs This class holds the Job's Schedule Level information
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobSchedulerSchedule {

  protected static final String KEY_SCHEDULE_ID = "scheduleId";
  protected static final String KEY_DATA = "data";
  protected static final String KEY_DESCRIPTION = "description";
  protected static final String KEY_TYPE = "type";
  public static final String KEY_ACTIVE = "active";
  protected static final String KEY_START_TIME = "startTime";
  protected static final String KEY_END_TIME = "endTime";
  protected static final String KEY_NEXT_RUN_AT = "nextRunAt";
  protected static final String KEY_REPEAT_INTERVAL = "repeatInterval";
  protected static final String KEY_REPEAT_AT = "repeatAt";
  protected static final String KEY_TIME = "time";
  protected static final String KEY_CRON = "cron";

  private String jobId;
  private String jobName;
  private String scheduleId;
  private JSONObject data;
  private String description;
  private String type;
  private boolean active;
  private JobSchedulerTime startTime;
  private JobSchedulerTime endTime;
  private JobSchedulerTime nextRunAt;

  // One of four required below
  private String repeatInterval;
  private String repeatAt;
  private String time;
  private String cron;

  public JSONObject toJson() {
    JSONObject result = new JSONObject();

    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(scheduleId))) {
      result.put(KEY_SCHEDULE_ID, scheduleId);
    }
    result.put(KEY_DESCRIPTION, description);
    result.put(KEY_ACTIVE, active);
    result.put(KEY_TYPE, type);

    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(data))) {
      result.put(KEY_DATA, data);
    }

    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(repeatInterval))) {
      result.put(KEY_REPEAT_INTERVAL, repeatInterval);
    } else if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(cron))) {
      result.put(KEY_CRON, cron);
    } else if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(time))) {
      result.put(KEY_TIME, time);
    } else if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(repeatAt))) {
      result.put(KEY_REPEAT_AT, repeatAt);
    }
    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(startTime))) {
      result.put(KEY_START_TIME, startTime.toJson());
    }
    if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(endTime))) {
      result.put(KEY_END_TIME, endTime.toJson());
    }
    return result;
  }

  public void fromJson(JSONObject input) {
    scheduleId = validateAndGetString(input, KEY_SCHEDULE_ID);
    description = validateAndGetString(input, KEY_DESCRIPTION);
    type = validateAndGetString(input, KEY_TYPE);
    active = validateAndGetBoolean(input, KEY_ACTIVE);
    startTime = validateAndGetJobSchedulerTime(input, KEY_START_TIME);
    endTime = validateAndGetJobSchedulerTime(input, KEY_END_TIME);
    repeatInterval = validateAndGetString(input, KEY_REPEAT_INTERVAL);
    cron = validateAndGetString(input, KEY_CRON);
    time = validateAndGetString(input, KEY_TIME);
    repeatAt = validateAndGetString(input, KEY_REPEAT_AT);
    nextRunAt = validateAndGetJobSchedulerTime(input, KEY_NEXT_RUN_AT);
    if (Boolean.FALSE.equals(input.isNull(KEY_DATA)))
      data = new JSONObject(input.getString(KEY_DATA).replace("\"", "\""));
  }

}
