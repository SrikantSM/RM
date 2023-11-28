package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;

import org.apache.commons.lang3.time.FastDateFormat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.ResultBuilder;
import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CdsReadEventContext;

import com.sap.c4p.rm.consultantprofile.availabilityservice.dao.IAvailabilityDAO;
import com.sap.c4p.rm.consultantprofile.utils.StringFormatter;
import com.sap.c4p.rm.consultantprofile.utils.CommonEventHandlerUtil;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView;

import availabilityuploadservice.AvailabilityUploadData;
import availabilityuploadservice.AvailabilityUploadErrors;
import availabilityuploadservice.AvailabilityUploadErrors_;
import availabilityuploadservice.AvailabilityPeriodicCount;
import availabilityuploadservice.AvailabilityPeriodicCount_;

class AvailabilityUploadServiceEventHandlerTest {

    @Mock
    private IAvailabilityDAO availabilityDao;

    @Mock
    private CommonEventHandlerUtil commonEventHandlerUtil;

    private static final String DATE_PATTERN = "yyyy-MM-dd";
    private final FastDateFormat formatter = FastDateFormat.getInstance(DATE_PATTERN);
    Calendar calendar = Calendar.getInstance();

    AvailabilityUploadServiceEventHandler availabilityUploadServiceEventHandler = new AvailabilityUploadServiceEventHandler(
            availabilityDao, commonEventHandlerUtil);

    @Test
    @DisplayName("test prepareCqnForAvailabilityUploadErrors to check if the final cqn is set correctly.")
    void testPrepareCqnForAvailabilityUploadErrors() {
        CdsReadEventContext cdsReadEventContext1 = CdsReadEventContext.create(AvailabilityUploadErrors_.CDS_NAME);
        CqnSelect initialCqn = Select.from(AvailabilityUploadErrors_.CDS_NAME);
        cdsReadEventContext1.setCqn(initialCqn);
        CqnSelect finalCqn = Select.copy(initialCqn).columns(AvailabilityUploadErrors.RESOURCE_ID,
                AvailabilityUploadErrors.RESOURCE_ID, AvailabilityUploadErrors.START_DATE,
                AvailabilityUploadErrors.S4COST_CENTER_ID, AvailabilityUploadErrors.WORK_ASSIGNMENT_EXTERNAL_ID,
                AvailabilityUploadErrors.ERROR_PARAM1, AvailabilityUploadErrors.ERROR_PARAM2,
                AvailabilityUploadErrors.ERROR_PARAM3, AvailabilityUploadErrors.ERROR_PARAM4,
                AvailabilityUploadErrors.CSV_RECORD_INDEX, AvailabilityUploadErrors.ERROR_DESC,
                AvailabilityUploadErrors.AVAILABILITY_ERROR_MESSAGE_CODE, AvailabilityUploadErrors.ERROR_MESSAGE,
                AvailabilityUploadErrors.INVALID_KEYS, AvailabilityUploadErrors.CREATED_AT,
                AvailabilityUploadErrors.CREATED_BY, AvailabilityUploadErrors.MODIFIED_AT,
                AvailabilityUploadErrors.MODIFIED_BY);
        this.availabilityUploadServiceEventHandler.prepareCqnForAvailabilityUploadErrors(cdsReadEventContext1);
        assertEquals(finalCqn.toString(), cdsReadEventContext1.getCqn().toString());
    }

    @Test
    @DisplayName("test prepareAvailabilityUploadErrors to check if the data is not replaced correctly when the result of on is null")
    void testPrepareAvailabilityUploadErrors1() {
        CdsReadEventContext cdsReadEventContext1 = CdsReadEventContext.create(AvailabilityUploadErrors_.CDS_NAME);
        cdsReadEventContext1.setResult(null);
        this.availabilityUploadServiceEventHandler.prepareAvailabilityUploadErrors(cdsReadEventContext1);
        assertNull(cdsReadEventContext1.getResult());
    }

    @Test
    @DisplayName("test prepareAvailabilityUploadErrors to check if the data is not replaced correctly when the result of on is Empty")
    void testPrepareAvailabilityUploadErrors2() {
        Result result = ResultBuilder.insertedRows(Collections.emptyList()).result();
        CdsReadEventContext cdsReadEventContext1 = CdsReadEventContext.create(AvailabilityUploadErrors_.CDS_NAME);
        cdsReadEventContext1.setResult(result);
        this.availabilityUploadServiceEventHandler.prepareAvailabilityUploadErrors(cdsReadEventContext1);
        assertEquals(result, cdsReadEventContext1.getResult());
    }

    @Test
    @DisplayName("test prepareAvailabilityUploadErrors to check if the data is replaced correctly when the result of on is returned and does not hold error_desc value")
    void testPrepareAvailabilityUploadErrors3() {
        HashMap<String, Object> rowData = new HashMap<>();
        String errorDescFormat = "This description {0} {1} to check the {2} formation.";
        rowData.put(AvailabilityUploadErrors.ERROR_MESSAGE, errorDescFormat);
        String errorParam1 = "is";
        rowData.put(AvailabilityUploadErrors.ERROR_PARAM1, errorParam1);
        String errorParam2 = "created";
        rowData.put(AvailabilityUploadErrors.ERROR_PARAM2, errorParam2);
        String errorParam3 = "message";
        rowData.put(AvailabilityUploadErrors.ERROR_PARAM3, errorParam3);

        Result result = ResultBuilder.insertedRows(Collections.singletonList(rowData)).result();
        CdsReadEventContext cdsReadEventContext1 = CdsReadEventContext.create(AvailabilityUploadErrors_.CDS_NAME);
        cdsReadEventContext1.setResult(result);
        this.availabilityUploadServiceEventHandler.prepareAvailabilityUploadErrors(cdsReadEventContext1);
        Row row = cdsReadEventContext1.getResult().first().get();
        String finalOutput = StringFormatter.format(errorDescFormat, errorParam1, errorParam2, errorParam3);
        assertEquals(row.get("error_desc").toString(), finalOutput);
    }

    @Test
    @DisplayName("test prepareAvailabilityUploadErrors to check if the data is replaced correctly when the result of on is returned and holds error_desc value")
    void testPrepareAvailabilityUploadErrors4() {
        HashMap<String, Object> rowData = new HashMap<>();
        String errorDescFormat = "This description {0} {1} to check the {2} formation.";
        rowData.put(AvailabilityUploadErrors.ERROR_DESC, errorDescFormat);

        Result result = ResultBuilder.insertedRows(Collections.singletonList(rowData)).result();
        CdsReadEventContext cdsReadEventContext1 = CdsReadEventContext.create(AvailabilityUploadErrors_.CDS_NAME);
        cdsReadEventContext1.setResult(result);
        this.availabilityUploadServiceEventHandler.prepareAvailabilityUploadErrors(cdsReadEventContext1);
        Row row = cdsReadEventContext1.getResult().first().get();
        assertEquals(row.get("error_desc").toString(), errorDescFormat);
    }

    @Test
    @DisplayName("test afterAvailabilityUploadDataRead to determine Min-Max dates and Available/Required days for Resource")
    void testAfterAvailabilityUploadDataRead() {
        // prepare availability data
        AvailabilityUploadData prepareUploaddata = Struct.create(AvailabilityUploadData.class);
        prepareUploaddata.setResourceId("2db4beff-a00d-4cd3-a130-f9f0e901c595");
        prepareUploaddata.setWorkAssignmentStartDate("2017-01-01");
        prepareUploaddata.setWorkAssignmentEndDate("2099-12-31");
        // prepare expected days
        Integer expectedRequiredDays = 1095;
        Integer expectedAvailableDays = 500;
        BigDecimal expectedUploadData = BigDecimal.valueOf(45.7);
        // prepare expected MinDate
        calendar.add(Calendar.YEAR, -1);
        int previousYear = calendar.get(Calendar.YEAR);
        calendar.set(previousYear, Calendar.JANUARY, 01);
        SimpleDateFormat format1 = new SimpleDateFormat(DATE_PATTERN);
        String expectedMinDate = format1.format(calendar.getTime());
        // prepare expected Maxdate
        calendar.add(Calendar.YEAR, 2);
        int nextYear = calendar.get(Calendar.YEAR);
        calendar.set(nextYear, Calendar.DECEMBER, 31);
        SimpleDateFormat format2 = new SimpleDateFormat(DATE_PATTERN);
        String expectedMaxDate = format2.format(calendar.getTime());

        IAvailabilityDAO availabilityDao = Mockito.mock(IAvailabilityDAO.class);
        this.availabilityUploadServiceEventHandler = new AvailabilityUploadServiceEventHandler(availabilityDao, commonEventHandlerUtil);
        when(availabilityDao.fetchCapacityDataCount("2db4beff-a00d-4cd3-a130-f9f0e901c595", expectedMinDate, expectedMaxDate))
                .thenReturn(500);
        this.availabilityUploadServiceEventHandler
                .afterAvailabilityUploadDataRead(Collections.singletonList(prepareUploaddata));

        assertEquals(expectedMinDate, prepareUploaddata.getMinDate());
        assertEquals(expectedMaxDate, prepareUploaddata.getMaxLimitDate());
        assertEquals(expectedRequiredDays, prepareUploaddata.getRequiredDays());
        assertEquals(expectedAvailableDays, prepareUploaddata.getAvailableDays());
        assertEquals(expectedUploadData, prepareUploaddata.getUploadDataPercentage());
    }

    @Test
    @DisplayName("test afterAvailabilityUploadDataRead to determine Min-Max dates when WorkAssignment dates fields don't passed for Resource")
    void testAfterAvailabilityUploadDataReadWithOutWaDates() {
        // prepare availability data
        AvailabilityUploadData prepareUploaddata = Struct.create(AvailabilityUploadData.class);
        prepareUploaddata.setResourceId("2db4beff-a00d-4cd3-a130-f9f0e901c595");

        AvailabilityDownloadView newSummary = AvailabilityDownloadView.create();
        newSummary.setResourceId("2db4beff-a00d-4cd3-a130-f9f0e901c595");
        int currentYear = calendar.get(Calendar.YEAR);
        newSummary.setWorkAssignmentEndDate(String.format("%s-12-31", currentYear));
        newSummary.setWorkAssignmentStartDate(String.format("%s-01-01", currentYear));
        // prepare expected dates
        String expectedMinDate = String.format("%s-01-01", currentYear);
        String expectedMaxDate = String.format("%s-12-31", currentYear);

        IAvailabilityDAO availabilityDao = Mockito.mock(IAvailabilityDAO.class);
        this.availabilityUploadServiceEventHandler = new AvailabilityUploadServiceEventHandler(availabilityDao, commonEventHandlerUtil);
        when(availabilityDao.fetchWorkAssignmentsDatesForResource("2db4beff-a00d-4cd3-a130-f9f0e901c595"))
                .thenReturn(Collections.singletonList(newSummary));
        when(availabilityDao.fetchCapacityDataCount("2db4beff-a00d-4cd3-a130-f9f0e901c595", "2021-01-01", "2023-12-31"))
                .thenReturn(200);
        this.availabilityUploadServiceEventHandler
                .afterAvailabilityUploadDataRead(Collections.singletonList(prepareUploaddata));

        assertEquals(expectedMinDate, prepareUploaddata.getMinDate());
        assertEquals(expectedMaxDate, prepareUploaddata.getMaxLimitDate());
    }

    @Test
    @DisplayName("test afterAvailabilityUploadDataRead to determine Min-Max dates as WorkAssignment dates for Resource")
    void testAfterAvailabilityUploadDataReadWaDates() {
        // prepare availability data
        AvailabilityUploadData prepareUploaddata = Struct.create(AvailabilityUploadData.class);
        prepareUploaddata.setResourceId("2db4beff-a00d-4cd3-a130-f9f0e901c595");
        int currentYear = calendar.get(Calendar.YEAR);
        prepareUploaddata.setWorkAssignmentStartDate(String.format("%s-01-01", currentYear));
        prepareUploaddata.setWorkAssignmentEndDate(String.format("%s-12-31", currentYear));
        // prepare expected MinDate
        String expectedMinDate = prepareUploaddata.getWorkAssignmentStartDate();
        // prepare expected Maxdate
        String expectedMaxDate = prepareUploaddata.getWorkAssignmentEndDate();

        IAvailabilityDAO availabilityDao = Mockito.mock(IAvailabilityDAO.class);
        this.availabilityUploadServiceEventHandler = new AvailabilityUploadServiceEventHandler(availabilityDao, commonEventHandlerUtil);
        when(availabilityDao.fetchCapacityDataCount("2db4beff-a00d-4cd3-a130-f9f0e901c595", "2021-01-01", "2023-12-31"))
                .thenReturn(200);
        this.availabilityUploadServiceEventHandler
                .afterAvailabilityUploadDataRead(Collections.singletonList(prepareUploaddata));

        assertEquals(expectedMinDate, prepareUploaddata.getMinDate());
        assertEquals(expectedMaxDate, prepareUploaddata.getMaxLimitDate());
    }

    @Test
    @DisplayName("Test AvailabilityPeriodicCount Data formed correctly")
    void updateAvailabilityPeriodicCountData() {
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(AvailabilityPeriodicCount_.CDS_NAME);
        CommonEventHandlerUtil commonEventHandlerUtil = Mockito.mock(CommonEventHandlerUtil.class);
        this.availabilityUploadServiceEventHandler = new AvailabilityUploadServiceEventHandler(availabilityDao, commonEventHandlerUtil);
        this.availabilityUploadServiceEventHandler.updateAvailabilityPeriodicCountData(cdsReadEventContext);
        verify(commonEventHandlerUtil, times(1)).setLocalisedDataForAvailabilityPeriodicCount(cdsReadEventContext,
        		AvailabilityPeriodicCount.MONTH_YEAR, AvailabilityPeriodicCount.CALMONTH);
    }

}
