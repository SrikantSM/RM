package com.sap.c4p.rm.consultantprofile.utils;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class DateUtils {

    private DateUtils() {
    }

    private static final String DATE_PATTERN = "yyyy-MM-dd";

    /**
     * Calculate number of days between min and max dates
     */
    public static Integer calculateDaysBetween(final String startDate, final String endDate) {
        return Math.toIntExact(ChronoUnit.DAYS.between(LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }

    /**
     * set minimum date
     */
    public static String determineMinDate(final String startDate, final String endDate) {
        String minDate = null;
        LocalDate parseStartDate = LocalDate.parse(startDate);
        LocalDate parseEndDate = LocalDate.parse(endDate);
        LocalDate currentDate = LocalDate.now();
        LocalDate previousYearDate = currentDate.minusYears(1);
        if (parseStartDate.getYear() > previousYearDate.getYear()
                || parseEndDate.getYear() < previousYearDate.getYear()) {
            minDate = startDate;
        } else {
            minDate = previousYearDate.with(firstDayOfYear()).format(DateTimeFormatter.ofPattern(DATE_PATTERN));
        }
        return minDate;
    }

    /**
     * set maximum date limit
     */
    public static String determineMaxLimitDate(final String endDate) {
        String maxDate = null;
        LocalDate parseEndDate = LocalDate.parse(endDate);
        LocalDate currentDate = LocalDate.now();
        LocalDate nextYearDate = currentDate.plusYears(1);
        if (parseEndDate.getYear() < nextYearDate.getYear()) {
            maxDate = endDate;
        } else {
            maxDate = nextYearDate.with(lastDayOfYear()).format(DateTimeFormatter.ofPattern(DATE_PATTERN));
        }
        return maxDate;
    }

}
