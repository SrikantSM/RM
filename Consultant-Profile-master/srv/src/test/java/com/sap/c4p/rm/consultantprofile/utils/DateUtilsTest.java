package com.sap.c4p.rm.consultantprofile.utils;

import static java.time.temporal.TemporalAdjusters.lastDayOfYear;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.util.Calendar;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class DateUtilsTest {

    Calendar calendar = Calendar.getInstance();

    @Test
    @DisplayName("Test get days between two dates")
    public void calculateDaysBetween() {
        LocalDate fromDate = LocalDate.now();
        LocalDate toDate = fromDate.plusDays(100);
        int actualDays = DateUtils.calculateDaysBetween(fromDate.toString(), toDate.toString());
        assertEquals(100, actualDays);
    }

    @Test
    @DisplayName("Test to calculate minimum date for a resource availability data when workAssignment startDate year greater than previous year")
    public void determineMinDateAsWaStartDate() {
        int currentYear = calendar.get(Calendar.YEAR);
        // prepare expected dates
        String expectedMinDate = String.format("%s-10-11", currentYear);
        String waStartDate = String.format("%s-10-11", currentYear);
        String waEndDate = "2099-12-31";

        String actualMinDate = DateUtils.determineMinDate(waStartDate, waEndDate);
        assertEquals(expectedMinDate, actualMinDate);

    }

    @Test
    @DisplayName("Test to calculate minimum date for a resource availability data when workAssignment endDate year less than previous year")
    public void determineMinDateAsWaStartDate1() {
        String expectedMinDate = "2020-10-10", waStartDate = "2020-10-10";
        String waEndDate = "2020-12-31";

        String actualMinDate = DateUtils.determineMinDate(waStartDate, waEndDate);
        assertEquals(expectedMinDate, actualMinDate);

    }

    @Test
    @DisplayName("Test to calculate minimum date for a resource availability data when workAssignment dates period is more than 3 years")
    public void determineMinDate() {
        // prepare expected MinDate
        calendar.add(Calendar.YEAR, -1);
        int previousYear = calendar.get(Calendar.YEAR);
        String expectedMinDate = String.format("%s-01-01", previousYear);
        String waStartDate = "2010-10-10", waEndDate = "2099-12-31";

        String actualMinDate = DateUtils.determineMinDate(waStartDate, waEndDate);
        assertEquals(expectedMinDate, actualMinDate);

    }

    @Test
    @DisplayName("Test to calculate maximum date for a resource availability data when workAssignment endDate year less than next year")
    public void determineMaxLimitDateAsWaEndDate() {
        int previousYear = calendar.get(Calendar.YEAR);
        String expectedMaxDate = String.format("%s-11-30", previousYear);
        String waEndDate = String.format("%s-11-30", previousYear);

        String actualMinDate = DateUtils.determineMaxLimitDate(waEndDate);
        assertEquals(expectedMaxDate, actualMinDate);
    }

    @Test
    @DisplayName("Test to calculate maximum date for a resource availability data when workAssignment endDate after next year")
    public void determineMaxLimitDate() {
        LocalDate currentDate = LocalDate.now();
        LocalDate nextYearDate = currentDate.plusYears(1);
        String expectedMaxDate = nextYearDate.with(lastDayOfYear()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String waEndDate = "2099-11-30";

        String actualMinDate = DateUtils.determineMaxLimitDate(waEndDate);
        assertEquals(expectedMaxDate, actualMinDate);
    }

}
