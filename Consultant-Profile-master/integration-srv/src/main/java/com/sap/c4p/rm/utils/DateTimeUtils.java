package com.sap.c4p.rm.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtils {
	
	private DateTimeUtils() {
	}

	/**
     * converts availability date time format into start/end time format accepted by capacity
     *
     * @param startDate: Represents date of availability
     * @return startTime accepted by capacity
     */
	public static Instant convertDateToTimeFormat(LocalDate date) {
		if (date == null) {
			return null;
		}
		final String time = date + "T00:00:00Z";
		DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        final ZonedDateTime parsedTime = ZonedDateTime.parse(time,
                formatter.withZone(ZoneId.of("UTC")));
        return parsedTime.toInstant();
	}
	
	/**
     * converts HH:mm time format into minutes
     *
     * @param time: Represents time
     * @return time in minutes
     */
	public static int getInMinutes (String time) {
		int inMinutes = 0;
		if (time != null) {
			inMinutes = (Integer.parseInt(time.split(":")[0]))*60 + Integer.parseInt(time.split(":")[1]);
		}
		return inMinutes;
	}
	
}
