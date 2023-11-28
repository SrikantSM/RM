package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test Class to test working of {@link JobSchedulerInfo},
 * {@link JobSchedulerSchedule} and {@link JobSchedulerTime}.
 */
public class JobSchedulerModelTest {

  private static final String SUB_DOMAIN = "subDomain";
  private static final String JOB_ID = "jobId";
  private static final String SCHEDULE_ID = "schedulerId";
  private static final String DATE_FORMAT = "yyyy-dd-mm";

  @Test
  @DisplayName("test Getters and Setters for JobScheduler.")
  public void testGettersSetters() throws JSONException {
    // JobSchedulerScheduler Object
    JobSchedulerSchedule jobSchedulerSchedule = new JobSchedulerSchedule();
    jobSchedulerSchedule.setActive(Boolean.TRUE);
    jobSchedulerSchedule.setCron(JobSchedulerSchedule.KEY_CRON);
    jobSchedulerSchedule.setDescription(JobSchedulerSchedule.KEY_DESCRIPTION);
    JSONObject jsonSchedulerSchedulerData = new JSONObject();
    jsonSchedulerSchedulerData.put(SUB_DOMAIN, SUB_DOMAIN);
    jobSchedulerSchedule.setData(jsonSchedulerSchedulerData);
    jobSchedulerSchedule.setJobId(JOB_ID);
    jobSchedulerSchedule.setRepeatAt("2");
    jobSchedulerSchedule.setRepeatInterval("every 2 hours");
    jobSchedulerSchedule.setScheduleId(SCHEDULE_ID);
    jobSchedulerSchedule.setType("cron");
    jobSchedulerSchedule.setTime("12:00:00");
    JobSchedulerTime jobSchedulerSchedulerStartTime = new JobSchedulerTime();
    jobSchedulerSchedulerStartTime.setDate("2020-01-01");
    jobSchedulerSchedulerStartTime.setFormat(DATE_FORMAT);
    jobSchedulerSchedule.setStartTime(jobSchedulerSchedulerStartTime);
    JobSchedulerTime jobSchedulerSchedulerEndTime = new JobSchedulerTime();
    jobSchedulerSchedulerEndTime.setDate("2099-01-01");
    jobSchedulerSchedulerEndTime.setFormat(DATE_FORMAT);
    jobSchedulerSchedule.setEndTime(jobSchedulerSchedulerEndTime);
    JobSchedulerTime jobSchedulerSchedulerNextRunAt = new JobSchedulerTime();
    jobSchedulerSchedulerNextRunAt.setDate("2020-01-02");
    jobSchedulerSchedulerNextRunAt.setFormat(DATE_FORMAT);
    jobSchedulerSchedule.setNextRunAt(jobSchedulerSchedulerNextRunAt);

    // JobSchedulerInfo Object
    JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
    List<JobSchedulerSchedule> jobSchedulerScheduleList = new ArrayList<>();
    jobSchedulerScheduleList.add(jobSchedulerSchedule);
    jobSchedulerJob.setSchedules(jobSchedulerScheduleList);
    jobSchedulerJob.setName(JobSchedulerInfo.KEY_NAME);
    jobSchedulerJob.setAction(JobSchedulerInfo.KEY_ACTION);
    jobSchedulerJob.setActive(Boolean.TRUE);
    jobSchedulerJob.setDescription(JobSchedulerInfo.KEY_DESCRIPTION);
    jobSchedulerJob.setHttpMethod(HttpMethod.POST.toString());
    String id = "1";
    jobSchedulerJob.setId(id);
    BigInteger signatureVersion = BigInteger.valueOf(11);
    jobSchedulerJob.setSignatureVersion(signatureVersion);
    JobSchedulerTime jobSchedulerJobCreatedAt = new JobSchedulerTime();
    jobSchedulerJobCreatedAt.setDate("2020-01-01");
    jobSchedulerJobCreatedAt.setFormat(DATE_FORMAT);
    jobSchedulerJob.setCreatedAt(jobSchedulerJobCreatedAt);
    JobSchedulerTime jobSchedulerJobEndTime = new JobSchedulerTime();
    jobSchedulerJobEndTime.setDate("2099-01-01");
    jobSchedulerJobEndTime.setFormat(DATE_FORMAT);
    jobSchedulerJob.setEndTime(jobSchedulerJobEndTime);
    JobSchedulerTime jobSchedulerJobStartTime = new JobSchedulerTime();
    jobSchedulerJobStartTime.setDate("2020-01-01");
    jobSchedulerJobStartTime.setFormat(DATE_FORMAT);
    jobSchedulerJob.setStartTime(jobSchedulerJobStartTime);

    // Assertions for JobSchedulerInfo
    JobSchedulerTime assertJobSchedulerJobStartTime = jobSchedulerJob.getStartTime();
    assertEquals("2020-01-01", assertJobSchedulerJobStartTime.getDate());
    assertEquals(DATE_FORMAT, assertJobSchedulerJobStartTime.getFormat());
    JobSchedulerTime assertJobSchedulerJobEndTime = jobSchedulerJob.getEndTime();
    assertEquals("2099-01-01", assertJobSchedulerJobEndTime.getDate());
    assertEquals(DATE_FORMAT, assertJobSchedulerJobEndTime.getFormat());
    JobSchedulerTime assertJobSchedulerJobCreatedAt = jobSchedulerJob.getCreatedAt();
    assertEquals("2020-01-01", assertJobSchedulerJobCreatedAt.getDate());
    assertEquals(DATE_FORMAT, assertJobSchedulerJobCreatedAt.getFormat());
    assertEquals(signatureVersion, jobSchedulerJob.getSignatureVersion());
    assertEquals(id, jobSchedulerJob.getId());
    assertEquals(HttpMethod.POST.toString(), jobSchedulerJob.getHttpMethod());
    assertEquals(JobSchedulerInfo.KEY_DESCRIPTION, jobSchedulerJob.getDescription());
    assertTrue(jobSchedulerJob.isActive());
    assertEquals(JobSchedulerInfo.KEY_ACTION, jobSchedulerJob.getAction());
    assertEquals(JobSchedulerInfo.KEY_NAME, jobSchedulerJob.getName());

    // Assertions for JobSchedulerSchedule
    List<JobSchedulerSchedule> assertJobSchedulerScheduleList = jobSchedulerJob.getSchedules();
    assertEquals(1, assertJobSchedulerScheduleList.size());
    JobSchedulerSchedule assertJobSchedulerSchedule = assertJobSchedulerScheduleList.get(0);
    JobSchedulerTime assertJobSchedulerSchedulerNextRunAt = assertJobSchedulerSchedule.getNextRunAt();
    assertEquals("2020-01-02", assertJobSchedulerSchedulerNextRunAt.getDate());
    assertEquals(DATE_FORMAT, assertJobSchedulerSchedulerNextRunAt.getFormat());
    JobSchedulerTime assertJobSchedulerSchedulerEndTime = assertJobSchedulerSchedule.getEndTime();
    assertEquals("2099-01-01", assertJobSchedulerSchedulerEndTime.getDate());
    assertEquals(DATE_FORMAT, assertJobSchedulerSchedulerEndTime.getFormat());
    JobSchedulerTime assertJobSchedulerSchedulerStartTime = assertJobSchedulerSchedule.getStartTime();
    assertEquals("2020-01-01", assertJobSchedulerSchedulerStartTime.getDate());
    assertEquals(DATE_FORMAT, assertJobSchedulerSchedulerStartTime.getFormat());
    assertEquals("12:00:00", assertJobSchedulerSchedule.getTime());
    assertEquals("cron", assertJobSchedulerSchedule.getType());
    assertEquals(SCHEDULE_ID, assertJobSchedulerSchedule.getScheduleId());
    assertEquals("every 2 hours", assertJobSchedulerSchedule.getRepeatInterval());
    assertEquals("2", assertJobSchedulerSchedule.getRepeatAt());
    assertEquals(JOB_ID, assertJobSchedulerSchedule.getJobId());
    JSONObject assertJsonSchedulerSchedulerData = assertJobSchedulerSchedule.getData();
    assertEquals(SUB_DOMAIN, assertJsonSchedulerSchedulerData.getString(SUB_DOMAIN));
    assertEquals(JobSchedulerSchedule.KEY_DESCRIPTION, assertJobSchedulerSchedule.getDescription());
    assertEquals(JobSchedulerSchedule.KEY_CRON, assertJobSchedulerSchedule.getCron());
    assertTrue(assertJobSchedulerSchedule.isActive());
  }

  @Test
  @DisplayName("test fromJson and toJson")
  public void testFromJsonAndToJson() throws JSONException {
    // JobSchedulerScheduler Object
    JSONObject jobSchedulerSchedule = new JSONObject();
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_ACTIVE, Boolean.TRUE);
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_CRON, JobSchedulerSchedule.KEY_CRON);
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_DESCRIPTION, JobSchedulerSchedule.KEY_DESCRIPTION);
    JSONObject jsonSchedulerSchedulerData = new JSONObject();
    jsonSchedulerSchedulerData.put(SUB_DOMAIN, SUB_DOMAIN);
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_DATA, jsonSchedulerSchedulerData.toString());
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_REPEAT_AT, "2");
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_REPEAT_INTERVAL, "every 2 hours");
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_SCHEDULE_ID, SCHEDULE_ID);
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_TYPE, "cron");
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_TIME, "12:00:00");
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_START_TIME, "2020-01-01 00:00:00Z");
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_END_TIME, "2099-01-01 00:00:00Z");
    jobSchedulerSchedule.put(JobSchedulerSchedule.KEY_NEXT_RUN_AT, "2020-01-02T00:00:00");

    // JobSchedulerInfo Object
    JSONObject jobSchedulerJob = new JSONObject();
    JSONArray jobSchedulerScheduleArray = new JSONArray();
    jobSchedulerScheduleArray.put(jobSchedulerSchedule);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_SCHEDULES, jobSchedulerScheduleArray);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_NAME, JobSchedulerInfo.KEY_NAME);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_ACTION, JobSchedulerInfo.KEY_ACTION);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_ACTIVE, Boolean.TRUE);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_DESCRIPTION, JobSchedulerInfo.KEY_DESCRIPTION);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_HTTP_METHOD, HttpMethod.POST.toString());
    BigInteger id = BigInteger.valueOf(1);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_ID, id);
    BigInteger signatureVersion = BigInteger.valueOf(11);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_SIGNATURE_VERSION, signatureVersion);
    jobSchedulerJob.put(JobSchedulerInfo.KEY_CREATED_AT, "2020-01-01 00:00:00");
    jobSchedulerJob.put(JobSchedulerInfo.KEY_END_TIME, "2099-01-01 00:00:00Z");
    jobSchedulerJob.put(JobSchedulerInfo.KEY_START_TIME, "2020-01-01 00:00:00Z");

    JobSchedulerInfo jobSchedulerJobNonJson = new JobSchedulerInfo();
    jobSchedulerJobNonJson.fromJson(jobSchedulerJob);
    JSONObject jsonObject = jobSchedulerJobNonJson.toJson();

    // Assertions
    assertNotNull(jsonObject);
    assertNotNull(jsonObject.get(JobSchedulerInfo.KEY_SCHEDULES));
  }

  @Test
  @DisplayName("test class if input as null is provided.")
  public void testNullInput() {
    JSONObject jobJSONObject = new JSONObject();
    JobSchedulerInfo jobSchedulerInfo = new JobSchedulerInfo();
    jobSchedulerInfo.fromJson(jobJSONObject);
    assertNull(jobSchedulerInfo.getName());
    assertFalse(jobSchedulerInfo.isActive());

    JSONObject jobSchedulerInfoToJSON = jobSchedulerInfo.toJson();
    assertNotNull(jobSchedulerInfoToJSON);
    assertFalse(jobSchedulerInfoToJSON.has(JobSchedulerInfo.KEY_NAME));

    JSONObject jobScheduleJSONObject = new JSONObject();
    JobSchedulerSchedule jobSchedulerSchedule = new JobSchedulerSchedule();
    jobSchedulerSchedule.fromJson(jobScheduleJSONObject);
    assertNull(jobSchedulerSchedule.getJobId());
    assertFalse(jobSchedulerSchedule.isActive());

    JSONObject jobScheduleScheduleToJSON = jobSchedulerSchedule.toJson();
    assertNotNull(jobScheduleScheduleToJSON);
    assertFalse(jobScheduleScheduleToJSON.has(JobSchedulerSchedule.KEY_SCHEDULE_ID));

    JobSchedulerTime jobSchedulerTime = new JobSchedulerTime();
    jobSchedulerTime.fromJson(null);
    assertNull(jobSchedulerTime.getDate());
    assertNotNull(jobSchedulerTime.getFormat());

    JSONObject jobScheduleTimeToJSON = jobSchedulerTime.toJson();
    assertNotNull(jobScheduleTimeToJSON);
    assertFalse(jobScheduleTimeToJSON.has(JobSchedulerTime.KEY_DATE));
  }

  @Test
  @DisplayName("test Different schedule pattern.")
  public void testSchedulePattern() throws JSONException {
    JobSchedulerSchedule jobSchedulerSchedule; // = new JobSchedulerSchedule();
    JSONObject jobScheduleJSONRepeatInterval;

    jobSchedulerSchedule = new JobSchedulerSchedule();
    jobSchedulerSchedule.setRepeatInterval(JobSchedulerSchedule.KEY_REPEAT_INTERVAL);
    jobScheduleJSONRepeatInterval = jobSchedulerSchedule.toJson();
    assertEquals(JobSchedulerSchedule.KEY_REPEAT_INTERVAL,
        jobScheduleJSONRepeatInterval.get(JobSchedulerSchedule.KEY_REPEAT_INTERVAL));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_CRON));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_TIME));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_REPEAT_AT));

    jobSchedulerSchedule = new JobSchedulerSchedule();
    jobSchedulerSchedule.setCron(JobSchedulerSchedule.KEY_CRON);
    jobScheduleJSONRepeatInterval = jobSchedulerSchedule.toJson();
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_REPEAT_INTERVAL));
    assertEquals(JobSchedulerSchedule.KEY_CRON, jobScheduleJSONRepeatInterval.get(JobSchedulerSchedule.KEY_CRON));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_TIME));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_REPEAT_AT));

    jobSchedulerSchedule = new JobSchedulerSchedule();
    jobSchedulerSchedule.setTime(JobSchedulerSchedule.KEY_TIME);
    jobScheduleJSONRepeatInterval = jobSchedulerSchedule.toJson();
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_REPEAT_INTERVAL));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_CRON));
    assertEquals(JobSchedulerSchedule.KEY_TIME, jobScheduleJSONRepeatInterval.get(JobSchedulerSchedule.KEY_TIME));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_REPEAT_AT));

    jobSchedulerSchedule = new JobSchedulerSchedule();
    jobSchedulerSchedule.setRepeatAt(JobSchedulerSchedule.KEY_REPEAT_AT);
    jobScheduleJSONRepeatInterval = jobSchedulerSchedule.toJson();
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_REPEAT_INTERVAL));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_CRON));
    assertFalse(jobScheduleJSONRepeatInterval.has(JobSchedulerSchedule.KEY_TIME));
    assertEquals(JobSchedulerSchedule.KEY_REPEAT_AT,
        jobScheduleJSONRepeatInterval.get(JobSchedulerSchedule.KEY_REPEAT_AT));
  }

}
