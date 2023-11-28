package com.sap.c4p.rm.consultantprofile.utils;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ResultBuilder;
import com.sap.cds.Row;
import com.sap.cds.services.cds.CdsReadEventContext;

import availabilityuploadservice.AvailabilityPeriodicCount;
import availabilityuploadservice.AvailabilityPeriodicCount_;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;

import myprojectexperienceservice.*;

class CommonEventHandlerUtilTest extends InitMocks {

    @Mock
    LocalizedMessageSource localizedMessageSource;

    @InjectMocks
    @Autowired
    private CommonEventHandlerUtil classUnderTest;

    @Test
    @DisplayName("Test Internal Work Experience Data Formatted Correctly")
    void testReadInternalWorkExperienceTable() {
        when(this.localizedMessageSource.getLocalizedMessageSource(MessageKeys.HOURS)).thenReturn("{0}.{1} hr.");
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(InternalWorkExperience_.CDS_NAME);
        expectedCdsReadEventContext.setResult(getInternalWEExpectedResultData());
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(InternalWorkExperience_.CDS_NAME);
        actualCdsReadEventContext.setResult(getInternalWEResultData());
        classUnderTest.setLocalInternalWEConvertedAssigned(actualCdsReadEventContext,
                InternalWorkExperience.CONVERTED_ASSIGNED_CAPACITY);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }

    @Test
    @DisplayName("Test Internal Work Experience Data is Null")
    void testReadInternalWorkExperienceTableNoData() {
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(InternalWorkExperience_.CDS_NAME);
        expectedCdsReadEventContext.setResult(null);
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(InternalWorkExperience_.CDS_NAME);
        actualCdsReadEventContext.setResult(null);
        classUnderTest.setLocalInternalWEConvertedAssigned(actualCdsReadEventContext,
                InternalWorkExperience.CONVERTED_ASSIGNED_CAPACITY);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }

    @Test
    @DisplayName("Test Periodic Availability Data Formatted Correctly")
    void testReadPeriodicAvailabilityTable() {
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(PeriodicAvailability_.CDS_NAME);
        expectedCdsReadEventContext.setResult(getPeriodicAvailabilityExpectedResultData());
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(PeriodicAvailability_.CDS_NAME);
        actualCdsReadEventContext.setResult(getPeriodicAvailabilityResultData());
        classUnderTest.setLocalisedDataForPeriodicAvailability(actualCdsReadEventContext,
                PeriodicAvailability.MONTH_YEAR, PeriodicAvailability.CALMONTH);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }

    @Test
    @DisplayName("Test Periodic Availability Data is Null")
    void testReadPeriodicAvailabilityTableNoData() {
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(PeriodicAvailability_.CDS_NAME);
        expectedCdsReadEventContext.setResult(null);
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(PeriodicAvailability_.CDS_NAME);
        actualCdsReadEventContext.setResult(null);
        classUnderTest.setLocalisedDataForPeriodicAvailability(actualCdsReadEventContext,
                PeriodicAvailability.MONTH_YEAR, PeriodicAvailability.CALMONTH);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }

    @Test
    @DisplayName("Test Periodic Utilization Data Formatted Correctly")
    void testReadPeriodicUtilizationTable() {
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(PeriodicUtilization_.CDS_NAME);
        expectedCdsReadEventContext.setResult(getPeriodicUtilizationExpectedResultData());
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(PeriodicAvailability_.CDS_NAME);
        actualCdsReadEventContext.setResult(getPeriodicUtilizationResultData());
        classUnderTest.setLocalisedDataForPeriodicUtilization(actualCdsReadEventContext, PeriodicUtilization.MONTH_YEAR,
                PeriodicUtilization.CALMONTH);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }

    @Test
    @DisplayName("Test Periodic Utilization Data is Null")
    void testReadPeriodicUtilizationTableNoData() {
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(PeriodicUtilization_.CDS_NAME);
        expectedCdsReadEventContext.setResult(null);
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(PeriodicUtilization_.CDS_NAME);
        actualCdsReadEventContext.setResult(null);
        classUnderTest.setLocalisedDataForPeriodicUtilization(actualCdsReadEventContext, PeriodicUtilization.MONTH_YEAR,
                PeriodicUtilization.CALMONTH);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }
    
    @Test
    @DisplayName("Test Availability Periodic Count Data Formatted Correctly")
    void testReadAvailabilityPeriodicCountTable() {
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(AvailabilityPeriodicCount_.CDS_NAME);
        expectedCdsReadEventContext.setResult(getPeriodicCountExpectedResultData());
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(AvailabilityPeriodicCount_.CDS_NAME);
        actualCdsReadEventContext.setResult(getPeriodicCountResultData());
        classUnderTest.setLocalisedDataForAvailabilityPeriodicCount(actualCdsReadEventContext, AvailabilityPeriodicCount.MONTH_YEAR,
        		AvailabilityPeriodicCount.CALMONTH);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }
    
    @Test
    @DisplayName("Test Availability Periodic Count is Null")
    void testReadAvailabilityPeriodicTableNoData() {
        CdsReadEventContext expectedCdsReadEventContext = CdsReadEventContext.create(AvailabilityPeriodicCount_.CDS_NAME);
        expectedCdsReadEventContext.setResult(null);
        CdsReadEventContext actualCdsReadEventContext = CdsReadEventContext.create(AvailabilityPeriodicCount_.CDS_NAME);
        actualCdsReadEventContext.setResult(null);
        classUnderTest.setLocalisedDataForAvailabilityPeriodicCount(actualCdsReadEventContext, AvailabilityPeriodicCount.MONTH_YEAR,
        		AvailabilityPeriodicCount.CALMONTH);
        assertTrue(matchResultData(actualCdsReadEventContext.getResult(), expectedCdsReadEventContext.getResult()));
    }

    private boolean matchResultData(Result actualResult, Result expectedResult) {
        if (actualResult == null && expectedResult == null) {
            return true;
        }
        if (actualResult == null || expectedResult == null) {
            return false;
        }
        if (actualResult.inlineCount() != expectedResult.inlineCount()) {
            return false;
        }
        final List<Row> actualResultList = actualResult.list();
        final List<Row> expectedResultList = expectedResult.list();
        for (int i = 0; i < actualResult.inlineCount(); i++) {
            final Row actualResultRow = actualResultList.get(i);
            final Row expectedResultRow = expectedResultList.get(i);
            if (!actualResultRow.equals(expectedResultRow)) {
                return false;
            }
        }
        return true;
    }

    private HashMap<String, Object> prepareInternWEEntity(final String ID, final String convertedCapacityInHours) {
        final HashMap<String, Object> entity = new HashMap<>();
        entity.put(InternalWorkExperience.ASSIGNMENT_ID, ID);
        if (!NullUtils.isNullOrEmpty(convertedCapacityInHours))
            entity.put(InternalWorkExperience.CONVERTED_ASSIGNED_CAPACITY, convertedCapacityInHours);
        return entity;
    }

    private Result getInternalWEExpectedResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(prepareInternWEEntity("1", null));
        resultRows.add(prepareInternWEEntity("2", "60.00 hr."));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }

    private Result getInternalWEResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(prepareInternWEEntity("1", null));
        resultRows.add(prepareInternWEEntity("2", "60.00"));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }

    private HashMap<String, Object> preparePeriodicAvailabilityEntity(String ID, String calMonth, String monthYear,
            String grossCapacity, String netCapacity) {
        final HashMap<String, Object> entity = new HashMap<>();
        entity.put(PeriodicAvailability.CALMONTH, calMonth);
        entity.put(PeriodicAvailability.ID, ID);
        entity.put(PeriodicAvailability.MONTH_YEAR, monthYear);
        entity.put(PeriodicAvailability.GROSS_CAPACITY, grossCapacity);
        entity.put(PeriodicAvailability.NET_CAPACITY, netCapacity);
        entity.put(PeriodicAvailability.BOOKED_CAPACITY, 0);
        entity.put(PeriodicAvailability.UTILIZATION_PERCENTAGE, 0);
        entity.put(PeriodicAvailability.UTILIZATION_COLOR, 1);
        return entity;
    }

    private Result getPeriodicAvailabilityExpectedResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(preparePeriodicAvailabilityEntity("1", "202011", "November, 2020", "199", "199"));
        resultRows.add(preparePeriodicAvailabilityEntity("2", "202012", "December, 2020", "205", "205"));
        resultRows.add(preparePeriodicAvailabilityEntity("3", "202101", "January, 2021", "205", "205"));
        resultRows.add(preparePeriodicAvailabilityEntity("4", "202102", "February, 2021", "185", "185"));
        resultRows.add(preparePeriodicAvailabilityEntity("5", "202103", "March, 2021", "205", "205"));
        resultRows.add(preparePeriodicAvailabilityEntity("6", "202104", "April, 2021", "112", "112"));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }

    private Result getPeriodicAvailabilityResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(preparePeriodicAvailabilityEntity("1", "202011", "November, {0}", "199", "199"));
        resultRows.add(preparePeriodicAvailabilityEntity("2", "202012", "December, {0}", "205", "205"));
        resultRows.add(preparePeriodicAvailabilityEntity("3", "202101", "January, {0}", "205", "205"));
        resultRows.add(preparePeriodicAvailabilityEntity("4", "202102", "February, {0}", "185", "185"));
        resultRows.add(preparePeriodicAvailabilityEntity("5", "202103", "March, {0}", "205", "205"));
        resultRows.add(preparePeriodicAvailabilityEntity("6", "202104", "April, {0}", "112", "112"));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }

    private HashMap<String, Object> preparePeriodicUtilizationEntity(String ID, String calMonth, String monthYear) {
        final HashMap<String, Object> entity = new HashMap<>();
        entity.put(PeriodicUtilization.CALMONTH, calMonth);
        entity.put(PeriodicUtilization.ID, ID);
        entity.put(PeriodicUtilization.MONTH_YEAR, monthYear);
        entity.put(PeriodicUtilization.UTILIZATION_PERCENTAGE, 0);
        return entity;
    }

    private Result getPeriodicUtilizationExpectedResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(preparePeriodicUtilizationEntity("1", "202011", "November, 2020"));
        resultRows.add(preparePeriodicUtilizationEntity("2", "202012", "December, 2020"));
        resultRows.add(preparePeriodicUtilizationEntity("3", "202101", "January, 2021"));
        resultRows.add(preparePeriodicUtilizationEntity("4", "202102", "February, 2021"));
        resultRows.add(preparePeriodicUtilizationEntity("5", "202103", "March, 2021"));
        resultRows.add(preparePeriodicUtilizationEntity("6", "202104", "April, 2021"));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }

    private Result getPeriodicUtilizationResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(preparePeriodicUtilizationEntity("1", "202011", "November, {0}"));
        resultRows.add(preparePeriodicUtilizationEntity("2", "202012", "December, {0}"));
        resultRows.add(preparePeriodicUtilizationEntity("3", "202101", "January, {0}"));
        resultRows.add(preparePeriodicUtilizationEntity("4", "202102", "February, {0}"));
        resultRows.add(preparePeriodicUtilizationEntity("5", "202103", "March, {0}"));
        resultRows.add(preparePeriodicUtilizationEntity("6", "202104", "April, {0}"));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }
    
    private HashMap<String, Object> preparePeriodicCountEntity(String year, String calMonth, String monthYear) {
        final HashMap<String, Object> entity = new HashMap<>();
        entity.put(AvailabilityPeriodicCount.CALMONTH, calMonth);
        entity.put(AvailabilityPeriodicCount.YEAR, year);
        entity.put(AvailabilityPeriodicCount.MONTH_YEAR, monthYear);
        entity.put("availableNoOfDays", 30);
        return entity;
    }
    
    private Result getPeriodicCountExpectedResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(preparePeriodicCountEntity("2020", "202011", "November, 2020"));
        resultRows.add(preparePeriodicCountEntity("2020", "202012", "December, 2020"));
        resultRows.add(preparePeriodicCountEntity("2021", "202101", "January, 2021"));
        resultRows.add(preparePeriodicCountEntity("2021", "202102", "February, 2021"));
        resultRows.add(preparePeriodicCountEntity("2021", "202103", "March, 2021"));
        resultRows.add(preparePeriodicCountEntity("2021", "202104", "April, 2021"));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }

    private Result getPeriodicCountResultData() {
        final List<Map<String, Object>> resultRows = new ArrayList<>();
        resultRows.add(preparePeriodicCountEntity("2020", "202011", "November, {0}"));
        resultRows.add(preparePeriodicCountEntity("2020", "202012", "December, {0}"));
        resultRows.add(preparePeriodicCountEntity("2021", "202101", "January, {0}"));
        resultRows.add(preparePeriodicCountEntity("2021", "202102", "February, {0}"));
        resultRows.add(preparePeriodicCountEntity("2021", "202103", "March, {0}"));
        resultRows.add(preparePeriodicCountEntity("2021", "202104", "April, {0}"));
        return ResultBuilder.insertedRows(resultRows).inlineCount(resultRows.size()).result();
    }

}
