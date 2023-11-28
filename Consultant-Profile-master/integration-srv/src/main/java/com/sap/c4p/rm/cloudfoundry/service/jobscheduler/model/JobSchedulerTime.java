package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import org.json.JSONObject;

import com.sap.c4p.rm.utils.IsNullCheckUtils;

import lombok.Data;

/**
 * A POJO class to create the payload and parse the response of JobScheduler
 * APIs This class holds the Job's Time/ Level information
 */
@Data
public class JobSchedulerTime {

    protected static final String KEY_DATE = "date";
    protected static final String KEY_FORMAT = "format";
    public static final String ISO8601_FORMAT_FOR_DATE_FORMATTING = "yyyy-MM-dd HH:mm:ss";
    public static final String ISO8601_FORMAT_FOR_JOB_SCHEDULER = "YYYY-MM-DD HH:mm:ss";

    private String date;
    private String format;

    public JobSchedulerTime() {
        date = null;
        format = ISO8601_FORMAT_FOR_JOB_SCHEDULER;
    }

    public static JobSchedulerTime getTime(Instant date, int secondsToAdd) {
        date = date.plusSeconds(secondsToAdd);
        String formattedDate = DateTimeFormatter.ofPattern(ISO8601_FORMAT_FOR_DATE_FORMATTING)
                .withZone(ZoneId.from(ZoneOffset.UTC)).format(date);
        JobSchedulerTime result = new JobSchedulerTime();
        result.setDate(formattedDate);
        result.setFormat(ISO8601_FORMAT_FOR_JOB_SCHEDULER);
        return result;
    }

    public JSONObject toJson() {
        JSONObject result = new JSONObject();
        result.put(KEY_DATE, date);
        result.put(KEY_FORMAT, format);
        return result;
    }

    public void fromJson(String inputDate) {
        if (Boolean.FALSE.equals(IsNullCheckUtils.isNullOrEmpty(inputDate))) {
            if (Boolean.FALSE.equals(inputDate.endsWith("Z"))) {
                inputDate = inputDate + "Z";
            }
            if (inputDate.indexOf(' ') != -1) {
                inputDate = inputDate.replace(' ', 'T');
            }
            Instant inputDateInstant = Instant.parse(inputDate);
            JobSchedulerTime obj = getTime(inputDateInstant.truncatedTo(ChronoUnit.SECONDS), 0);
            date = obj.getDate();
            format = obj.getFormat();
        }
    }
}
