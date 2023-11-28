package com.sap.c4p.rm.replicationschedules;

import static com.sap.c4p.rm.utils.IsNullCheckUtils.isNullOrEmpty;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerTime;
import com.sap.c4p.rm.gen.MessageKeys;

import replicationscheduleservice.ReplicationSchedule;

/**
 *
 * Class to convert the response from the Job Scheduler to an object of
 * {@link ReplicationSchedule}
 *
 */
public class JobSchedulerScheduleToReplicationSchedule {

    private static final String ONETIME = "one-time";
    private static final String RECURRING = "recurring";
    private static final String CS = "CS";
    private static final String WF = "WF";
    private static final String WC = "WC";

    private JobSchedulerScheduleToReplicationSchedule() {
    }

    /**
     * Method to convert the Job Scheduler response to a HashMap compatible with
     * com.sap.cds.Row
     *
     * @param t             List of existing Job Schedule as returned by the Job
     *                      Scheduler
     * @param messageSource Localized Message Source
     * @return A newly created Replication Schedule HashMap compatible with
     *         com.sap.cds.Row
     */
    public static final Map<String, Object> jobScheduleToRowHashMap(JobSchedulerSchedule t,
            MessageSource messageSource) {
        Map<String, Object> replicationScheduleMap = new HashMap<>();
        String type = t.getType();
        replicationScheduleMap.put(ReplicationSchedule.JOB_ID, t.getJobId());
        replicationScheduleMap.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        replicationScheduleMap.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        String jobName = t.getJobName();
        String[] arr = jobName.split("_");
        String identifier = arr[1];
        if (!isNullOrEmpty(type) && type.contains(RECURRING)) {
            String repeatInterval = t.getRepeatInterval();
            Integer repeatIntervalValue = Integer
                    .valueOf(repeatInterval.substring(0, repeatInterval.indexOf(" minutes")));
            replicationScheduleMap.put(ReplicationSchedule.IS_RECURRING, Boolean.TRUE);
            replicationScheduleMap.put(ReplicationSchedule.IS_ONE_TIME, Boolean.FALSE);
            replicationScheduleMap.put(ReplicationSchedule.PATTERN,
                    messageSource.getMessage(MessageKeys.RECURRING_SCHEDULE, new Object[] { repeatIntervalValue },
                            LocaleContextHolder.getLocale()));
            replicationScheduleMap.put(ReplicationSchedule.PATTERN_VALUE, repeatIntervalValue);
            switch (identifier) {
                case CS: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.COST_CENTER, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_COST_PERIODIC,null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WF: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_PERSON, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_PERIODIC, null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WC: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_CAPABILITY, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_CAPABILITY_PERIODIC, null, LocaleContextHolder.getLocale()));
                    break;
                }
                default: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT, "");
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, "");
                }
                }
        } else if (!isNullOrEmpty(type) && type.contains(ONETIME)) {
            replicationScheduleMap.put(ReplicationSchedule.IS_ONE_TIME, Boolean.TRUE);
            replicationScheduleMap.put(ReplicationSchedule.IS_RECURRING, Boolean.FALSE);
            replicationScheduleMap.put(ReplicationSchedule.PATTERN,
                    messageSource.getMessage(MessageKeys.ONE_TIME_SCHEDULE, null, LocaleContextHolder.getLocale()));
            switch (identifier) {
                case CS: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.COST_CENTER, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_COST_INITIAL, null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WF: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_PERSON, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_INITIAL, null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WC: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_CAPABILITY, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_CAPABILITY_INITIAL, null, LocaleContextHolder.getLocale()));
                    break;
                }
                default: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT, "");
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, "");
                }
            }
        } else  {
            switch (identifier) {
                case CS: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.COST_CENTER, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, "");
                    break;
                }
                case WF: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_PERSON, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, "");
                    break;
                }
                case WC: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_CAPABILITY, null, LocaleContextHolder.getLocale()));
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, "");
                    break;
                }
                default: {
                    replicationScheduleMap.put(ReplicationSchedule.REPLICATION_OBJECT, "");
                    replicationScheduleMap.put(ReplicationSchedule.DESCRIPTION, "");
                }
            }
        }

        if (t.isActive()) {
            replicationScheduleMap.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
            replicationScheduleMap.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
            replicationScheduleMap.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
            replicationScheduleMap.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL,
                    messageSource.getMessage(MessageKeys.ACTIVE, null, LocaleContextHolder.getLocale()));
        } else if (!t.isActive()) {
            replicationScheduleMap.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 2);
            replicationScheduleMap.put(ReplicationSchedule.IS_ACTIVE, Boolean.FALSE);
            replicationScheduleMap.put(ReplicationSchedule.IS_INACTIVE, Boolean.TRUE);
            replicationScheduleMap.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL,
                    messageSource.getMessage(MessageKeys.INACTIVE, null, LocaleContextHolder.getLocale()));
        }
        replicationScheduleMap.put(ReplicationSchedule.NEXT_RUN, correctNextRunTime(t.getNextRunAt()));
        return replicationScheduleMap;
    }

    /**
     * Method to convert the Job Scheduler response to {@link ReplicationSchedule}
     * object itself
     *
     * @param t             List of existing Job Schedule as returned by the Job
     *                      Scheduler
     * @param messageSource
     * @return ReplicationSchedule object
     */
    public static final ReplicationSchedule jobScheduleToReplicationSchedule(JobSchedulerSchedule t,
            MessageSource messageSource) {
        String type = t.getType();
        ReplicationSchedule replicationSchedule = ReplicationSchedule.create();
        replicationSchedule.put(ReplicationSchedule.JOB_ID, t.getJobId());
        replicationSchedule.put(ReplicationSchedule.SCHEDULE_ID, t.getScheduleId());
        replicationSchedule.put(ReplicationSchedule.JOB_NAME, t.getJobName());
        String jobName = t.getJobName();
        String[] arr = jobName.split("_");
        String identifier = arr[1];
        if (!isNullOrEmpty(type) && type.contains(RECURRING)) {
            String repeatInterval = t.getRepeatInterval();
            Integer repeatIntervalValue = Integer
                    .valueOf(repeatInterval.substring(0, repeatInterval.indexOf(" minutes")));
            replicationSchedule.put(ReplicationSchedule.IS_RECURRING, Boolean.TRUE);
            replicationSchedule.put(ReplicationSchedule.IS_ONE_TIME, Boolean.FALSE);
            replicationSchedule.put(ReplicationSchedule.PATTERN,
                    messageSource.getMessage(MessageKeys.RECURRING_SCHEDULE, new Object[] { repeatIntervalValue },
                            LocaleContextHolder.getLocale()));
            replicationSchedule.put(ReplicationSchedule.PATTERN_VALUE, repeatIntervalValue);
            switch (identifier) {
                case CS: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.COST_CENTER, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_COST_PERIODIC,null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WF: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_PERSON, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_PERIODIC, null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WC: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_CAPABILITY, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_CAPABILITY_PERIODIC, null, LocaleContextHolder.getLocale()));
                    break;
                }
                default: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT, "");
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, "");
                }
            }
        } else if (!isNullOrEmpty(type) && type.contains(ONETIME)) {
            replicationSchedule.put(ReplicationSchedule.IS_ONE_TIME, Boolean.TRUE);
            replicationSchedule.put(ReplicationSchedule.IS_RECURRING, Boolean.FALSE);
            replicationSchedule.put(ReplicationSchedule.PATTERN,
                    messageSource.getMessage(MessageKeys.ONE_TIME_SCHEDULE, null, LocaleContextHolder.getLocale()));
            switch (identifier) {
                case CS: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.COST_CENTER, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_COST_INITIAL, null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WF: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_PERSON, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_INITIAL, null, LocaleContextHolder.getLocale()));
                    break;
                }
                case WC: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_CAPABILITY, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, messageSource
                        .getMessage(MessageKeys.SCHEDULE_WORKFORCE_CAPABILITY_INITIAL, null, LocaleContextHolder.getLocale()));
                    break;
                }
                default: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT, "");
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, "");
                }
            }
        } else  {
            switch (identifier) {
                case CS: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.COST_CENTER, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, "");
                    break;
                }
                case WF: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_PERSON, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, "");
                    break;
                }
                case WC: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT,
                        messageSource.getMessage(MessageKeys.WORKFORCE_CAPABILITY, null, LocaleContextHolder.getLocale()));
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, "");
                    break;
                }
                default: {
                    replicationSchedule.put(ReplicationSchedule.REPLICATION_OBJECT, "");
                    replicationSchedule.put(ReplicationSchedule.DESCRIPTION, "");
                }
            }
        }
        if (t.isActive()) {
            replicationSchedule.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 3);
            replicationSchedule.put(ReplicationSchedule.IS_ACTIVE, Boolean.TRUE);
            replicationSchedule.put(ReplicationSchedule.IS_INACTIVE, Boolean.FALSE);
            replicationSchedule.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL,
                    messageSource.getMessage(MessageKeys.ACTIVE, null, LocaleContextHolder.getLocale()));
        } else if (!t.isActive()) {
            replicationSchedule.put(ReplicationSchedule.SCHEDULE_STATUS_CRITICALITY, 2);
            replicationSchedule.put(ReplicationSchedule.IS_ACTIVE, Boolean.FALSE);
            replicationSchedule.put(ReplicationSchedule.IS_INACTIVE, Boolean.TRUE);
            replicationSchedule.put(ReplicationSchedule.SCHEDULE_STATUS_LABEL,
                    messageSource.getMessage(MessageKeys.INACTIVE, null, LocaleContextHolder.getLocale()));
        }
        replicationSchedule.put(ReplicationSchedule.NEXT_RUN, correctNextRunTime(t.getNextRunAt()));
        return replicationSchedule;
    }

    private static Instant correctNextRunTime(JobSchedulerTime nextRun) {
        if (nextRun != null) {
            DateTimeFormatter f = DateTimeFormatter.ofPattern(JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING);
            Instant nextRunInstant = LocalDateTime.parse(nextRun.getDate(), f).toInstant(ZoneOffset.UTC);
            return nextRunInstant.isBefore(Instant.now()) ? null : nextRunInstant;
        }
        return null;
    }

}
