package com.sap.c4p.rm.replicationschedules;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerTime;

import replicationscheduleservice.ReplicationSchedule;

public class JobSchedulerScheduleToReplicationScheduleTest extends InitMocks {

    MessageSource mockMessageSource;

    @BeforeEach
    void setUp() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasenames("i18n/i18n");
        mockMessageSource = source;
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with active recurring cost center Job Schedule")
    void testjobScheduleToRowHashMapRecurringCostCenterActiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Cost Center");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.FALSE);
        expected.put(ReplicationSchedule.PATTERN, "Recurring - 30 minutes");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Active");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with inactive recurring cost center Job Schedule")
    void testjobScheduleToRowHashMapRecurringCostCenterInactiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Cost Center");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.FALSE);
        expected.put(ReplicationSchedule.PATTERN, "Recurring - 30 minutes");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 2);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Inactive");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with active one-time cost center Job Schedule")
    void testjobScheduleToRowHashMapOneTimeCostCenterActiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        JobSchedulerTime time = new JobSchedulerTime();
        time.fromJson("2020-10-29T20:36:24Z");
        t.setStartTime(time);
        t.setTime(null);
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2020-10-30T20:36:24Z");
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Cost Center");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.TRUE);
        expected.put(ReplicationSchedule.PATTERN, "One-time");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Active");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with inactive one-time cost center Job Schedule")
    void testjobScheduleToRowHashMapOneTimeCostCenterInactiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        JobSchedulerTime time = new JobSchedulerTime();
        time.fromJson("2020-10-29T20:36:24Z");
        t.setStartTime(time);
        t.setTime(null);
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2020-10-30T20:36:24Z");
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Cost Center");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.TRUE);
        expected.put(ReplicationSchedule.PATTERN, "One-time");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 2);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Inactive");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with active recurring Workforce Person Job Schedule")
    void testjobScheduleToRowHashMapRecurringWorkforcePersonActiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Workforce Person");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.FALSE);
        expected.put(ReplicationSchedule.PATTERN, "Recurring - 30 minutes");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Active");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with inactive recurring Workforce Person Job Schedule")
    void testjobScheduleToRowHashMapRecurringWorkforcePersonInactiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Workforce Person");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.FALSE);
        expected.put(ReplicationSchedule.PATTERN, "Recurring - 30 minutes");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 2);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Inactive");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with active one-time Workforce Person Job Schedule")
    void testjobScheduleToRowHashMapOneTimeWorkforcePersonActiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        JobSchedulerTime time = new JobSchedulerTime();
        time.fromJson("2020-10-29T20:36:24Z");
        t.setStartTime(time);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Workforce Person");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.TRUE);
        expected.put(ReplicationSchedule.PATTERN, "One-time");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Active");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with inactive one-time Workforce Person Job Schedule")
    void testjobScheduleToRowHashMapOneTimeWorkforcePersonInactiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        JobSchedulerTime time = new JobSchedulerTime();
        time.fromJson("2020-10-29T20:36:24Z");
        t.setStartTime(time);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Workforce Person");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.TRUE);
        expected.put(ReplicationSchedule.PATTERN, "One-time");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 2);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Inactive");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with unknown Job Schedule")
    void testjobScheduleToRowHashMapOneTimeUnknownSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule description");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        JobSchedulerTime time = new JobSchedulerTime();
        time.fromJson("2020-10-29T20:36:24Z");
        t.setStartTime(time);
        t.setTime(null);
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30T20:36:24Z");
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "");
        expected.put(ReplicationSchedule.IS_RECURRING, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_ONE_TIME, Boolean.TRUE);
        expected.put(ReplicationSchedule.PATTERN, "One-time");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 2);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Inactive");
        expected.put(ReplicationSchedule.DESCRIPTION, "");
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with active recurring cost center Job Schedule")
    void testjobScheduleToReplicationScheduleRecurringCostCenterActiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime(null);
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Cost Center");
        expected.setIsRecurring(Boolean.TRUE);
        expected.setIsOneTime(Boolean.FALSE);
        expected.setPattern("Recurring - 30 minutes");
        expected.setScheduleStatusCriticality(3);
        expected.setIsActive(Boolean.TRUE);
        expected.setIsInactive(Boolean.FALSE);
        expected.setScheduleStatusLabel("Active");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with inactive recurring cost center Job Schedule")
    void testjobScheduleToReplicationScheduleRecurringCostCenterInctiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime(null);
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Cost Center");
        expected.setIsRecurring(Boolean.TRUE);
        expected.setIsOneTime(Boolean.FALSE);
        expected.setPattern("Recurring - 30 minutes");
        expected.setScheduleStatusCriticality(2);
        expected.setIsActive(Boolean.FALSE);
        expected.setIsInactive(Boolean.TRUE);
        expected.setScheduleStatusLabel("Inactive");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with active one-time cost center Job Schedule")
    void testjobScheduleToReplicationScheduleOneTimeCostCenterActiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime("2020-10-29T20:36:24Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Cost Center");
        expected.setIsRecurring(Boolean.FALSE);
        expected.setIsOneTime(Boolean.TRUE);
        expected.setPattern("One-time");
        expected.setScheduleStatusCriticality(3);
        expected.setIsActive(Boolean.TRUE);
        expected.setIsInactive(Boolean.FALSE);
        expected.setScheduleStatusLabel("Active");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with inactive one-time cost center Job Schedule")
    void testjobScheduleToReplicationScheduleOneTimeCostCenterInctiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime("2020-10-29T20:36:24Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Cost Center");
        expected.setIsRecurring(Boolean.FALSE);
        expected.setIsOneTime(Boolean.TRUE);
        expected.setPattern("One-time");
        expected.setScheduleStatusCriticality(2);
        expected.setIsActive(Boolean.FALSE);
        expected.setIsInactive(Boolean.TRUE);
        expected.setScheduleStatusLabel("Inactive");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with active recurring Workforce Person Job Schedule")
    void testjobScheduleToReplicationScheduleRecurringWorkforcePersonActiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime(null);
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Workforce Person");
        expected.setIsRecurring(Boolean.TRUE);
        expected.setIsOneTime(Boolean.FALSE);
        expected.setPattern("Recurring - 30 minutes");
        expected.setScheduleStatusCriticality(3);
        expected.setIsActive(Boolean.TRUE);
        expected.setIsInactive(Boolean.FALSE);
        expected.setScheduleStatusLabel("Active");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with inactive recurring Workforce Person Job Schedule")
    void testjobScheduleToReplicationScheduleRecurringWorkforcePersonInctiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the periodic replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("recurring");
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime(null);
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Workforce Person");
        expected.setIsRecurring(Boolean.TRUE);
        expected.setIsOneTime(Boolean.FALSE);
        expected.setPattern("Recurring - 30 minutes");
        expected.setScheduleStatusCriticality(2);
        expected.setIsActive(Boolean.FALSE);
        expected.setIsInactive(Boolean.TRUE);
        expected.setScheduleStatusLabel("Inactive");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));
        expected.put(ReplicationSchedule.PATTERN_VALUE, 30);

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with active one-time Workforce Person Job Schedule")
    void testjobScheduleToReplicationScheduleOneTimeWorkforcePersonActiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime("2020-10-29T20:36:24Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Workforce Person");
        expected.setIsRecurring(Boolean.FALSE);
        expected.setIsOneTime(Boolean.TRUE);
        expected.setPattern("One-time");
        expected.setScheduleStatusCriticality(3);
        expected.setIsActive(Boolean.TRUE);
        expected.setIsInactive(Boolean.FALSE);
        expected.setScheduleStatusLabel("Active");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with inactive one-time Workforce Person Job Schedule")
    void testjobScheduleToReplicationScheduleOneTimeWorkforcePersonInctiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("Schedule to trigger the initial replication of workforce person data from the MDI system.");
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime("2020-10-29T20:36:24Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Workforce Person");
        expected.setIsRecurring(Boolean.FALSE);
        expected.setIsOneTime(Boolean.TRUE);
        expected.setPattern("One-time");
        expected.setScheduleStatusCriticality(2);
        expected.setIsActive(Boolean.FALSE);
        expected.setIsInactive(Boolean.TRUE);
        expected.setScheduleStatusLabel("Inactive");
        expected.setDescription(t.getDescription());
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with unknown Job Schedule")
    void testjobScheduleToReplicationScheduleUnknownJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription(null);
        t.setData(null);
        t.setType("one-time");
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime("2020-10-29T20:36:24Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("");
        expected.setIsRecurring(Boolean.FALSE);
        expected.setIsOneTime(Boolean.TRUE);
        expected.setPattern("One-time");
        expected.setScheduleStatusCriticality(2);
        expected.setIsActive(Boolean.FALSE);
        expected.setIsInactive(Boolean.TRUE);
        expected.setScheduleStatusLabel("Inactive");
        expected.setDescription("");
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with unknown type cost center Job Schedule")
    void testjobScheduleToReplicationScheduleUnknownTypeCostCenterInctiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("abc");
        t.setData(null);
        t.setType(null);
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime("2020-10-29T20:36:24Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Cost Center");
        expected.setScheduleStatusCriticality(2);
        expected.setIsActive(Boolean.FALSE);
        expected.setIsInactive(Boolean.TRUE);
        expected.setScheduleStatusLabel("Inactive");
        expected.setDescription("");
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToReplicationSchedule with inactive unknown type Workforce Person Job Schedule")
    void testjobScheduleToReplicationScheduleUnknownTypeWorkforcePersonInctiveJobSchedule() {
        DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("abc");
        t.setData(null);
        t.setType(null);
        t.setCron(null);
        t.setRepeatInterval(null);
        t.setRepeatAt(null);
        t.setActive(Boolean.FALSE);
        t.setStartTime(null);
        t.setEndTime(null);
        t.setTime("2020-10-29T20:36:24Z");
        JobSchedulerTime nextRun = new JobSchedulerTime();
        nextRun.fromJson("2030-10-30 19:36:24");
        t.setNextRunAt(nextRun);

        ReplicationSchedule expected = ReplicationSchedule.create();
        expected.setJobID(t.getJobId());
        expected.setScheduleID(t.getScheduleId());
        expected.setJobName(t.getJobName());
        expected.setReplicationObject("Workforce Person");
        expected.setScheduleStatusCriticality(2);
        expected.setIsActive(Boolean.FALSE);
        expected.setIsInactive(Boolean.TRUE);
        expected.setScheduleStatusLabel("Inactive");
        expected.setDescription("");
        expected.setNextRun(LocalDateTime.parse(t.getNextRunAt().getDate(), f).toInstant(ZoneOffset.UTC));

        ReplicationSchedule actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with unknown type recurring cost center Job Schedule")
    void testjobScheduleToRowHashMapUnknownTypeCostCenterActiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_CS_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("");
        t.setData(null);
        t.setType(null);
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Cost Center");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Active");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("test jobScheduleToRowHashMap with active unknown type Workforce Person Job Schedule")
    void testjobScheduleToRowHashMapUnknownTypeWorkforcePersonActiveJobSchedule() {
        JobSchedulerSchedule t = new JobSchedulerSchedule();
        t.setJobId("12345");
        t.setJobName("JS_WF_12345");
        t.setScheduleId("38c39510-d282-46ab-b5a3-d358b3ac8cbc");
        t.setDescription("");
        t.setData(null);
        t.setType(null);
        t.setCron(null);
        t.setRepeatInterval("30 minutes");
        t.setRepeatAt(null);
        t.setActive(Boolean.TRUE);
        JobSchedulerTime startTime = new JobSchedulerTime();
        startTime.fromJson("2020-10-29T19:36:24Z");
        t.setStartTime(startTime);
        t.setEndTime(null);
        t.setTime(null);
        t.setNextRunAt(null);
        Map<String, Object> expected = new HashMap<String, Object>();
        expected.put(ReplicationSchedule.JOB_ID, t.getJobId());
        expected.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        expected.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        expected.put(ReplicationSchedule.REPLICATION_OBJECT, "Workforce Person");
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
        expected.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
        expected.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
        expected.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL, "Active");
        expected.put(ReplicationSchedule.DESCRIPTION, t.getDescription());
        expected.put(ReplicationSchedule.NEXT_RUN, t.getNextRunAt());

        Map<String, Object> actual = JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(t,
                mockMessageSource);
        assertEquals(expected, actual);
    }

}
