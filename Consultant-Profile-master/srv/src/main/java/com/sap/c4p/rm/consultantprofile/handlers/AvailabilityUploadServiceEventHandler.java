package com.sap.c4p.rm.consultantprofile.handlers;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.consultantprofile.availabilityservice.dao.IAvailabilityDAO;
import com.sap.c4p.rm.consultantprofile.utils.DateUtils;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.StringFormatter;
import com.sap.c4p.rm.consultantprofile.utils.CommonEventHandlerUtil;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView;

import availabilityuploadservice.AvailabilityUploadData;
import availabilityuploadservice.AvailabilityUploadData_;
import availabilityuploadservice.AvailabilityUploadErrors;
import availabilityuploadservice.AvailabilityUploadErrors_;
import availabilityuploadservice.AvailabilityUploadService_;
import availabilityuploadservice.AvailabilityPeriodicCount;
import availabilityuploadservice.AvailabilityPeriodicCount_;

@Component
@ServiceName(AvailabilityUploadService_.CDS_NAME)
public class AvailabilityUploadServiceEventHandler implements EventHandler {

    private final IAvailabilityDAO availabilityDao;
    private final CommonEventHandlerUtil commonEventHandlerUtil;

    @Autowired
    public AvailabilityUploadServiceEventHandler(IAvailabilityDAO
     availabilityDao, CommonEventHandlerUtil commonEventHandlerUtil) {
        this.availabilityDao = availabilityDao;
        this.commonEventHandlerUtil = commonEventHandlerUtil;
    }

    @Before(event = { CqnService.EVENT_READ }, entity = AvailabilityUploadErrors_.CDS_NAME)
    public void prepareCqnForAvailabilityUploadErrors(final CdsReadEventContext cdsReadEventContext) {
        CqnSelect selectQuery = cdsReadEventContext.getCqn();
        CqnSelect finalSelectQuery = Select.copy(selectQuery).columns(AvailabilityUploadErrors.RESOURCE_ID,
                AvailabilityUploadErrors.RESOURCE_ID, AvailabilityUploadErrors.START_DATE,
                AvailabilityUploadErrors.S4COST_CENTER_ID, AvailabilityUploadErrors.WORK_ASSIGNMENT_EXTERNAL_ID,
                AvailabilityUploadErrors.ERROR_PARAM1, AvailabilityUploadErrors.ERROR_PARAM2,
                AvailabilityUploadErrors.ERROR_PARAM3, AvailabilityUploadErrors.ERROR_PARAM4,
                AvailabilityUploadErrors.CSV_RECORD_INDEX, AvailabilityUploadErrors.ERROR_DESC,
                AvailabilityUploadErrors.AVAILABILITY_ERROR_MESSAGE_CODE, AvailabilityUploadErrors.ERROR_MESSAGE,
                AvailabilityUploadErrors.INVALID_KEYS, AvailabilityUploadErrors.CREATED_AT,
                AvailabilityUploadErrors.CREATED_BY, AvailabilityUploadErrors.MODIFIED_AT,
                AvailabilityUploadErrors.MODIFIED_BY);
        cdsReadEventContext.setCqn(finalSelectQuery);
    }

    @After(event = { CqnService.EVENT_READ }, entity = AvailabilityUploadErrors_.CDS_NAME)
    public void prepareAvailabilityUploadErrors(final CdsReadEventContext cdsReadEventContext) {
        Result availabilityUploadErrors = cdsReadEventContext.getResult();
        if (availabilityUploadErrors != null) {
            for (Row row : availabilityUploadErrors) {
                if ((getOrDefault(AvailabilityUploadErrors.ERROR_DESC, "",row)).equals("")) {
                    String errorMessage = row.get(AvailabilityUploadErrors.ERROR_MESSAGE).toString();
                    String errorParam1 = getOrDefault(AvailabilityUploadErrors.ERROR_PARAM1, "", row);
                    String errorParam2 = getOrDefault(AvailabilityUploadErrors.ERROR_PARAM2, "", row);
                    String errorParam3 = getOrDefault(AvailabilityUploadErrors.ERROR_PARAM3, "", row);
                    String errorParam4 = getOrDefault(AvailabilityUploadErrors.ERROR_PARAM4, "", row);
                    row.put(AvailabilityUploadErrors.ERROR_DESC,
                        StringFormatter.format(errorMessage, errorParam1, errorParam2, errorParam3, errorParam4));
                }
            }
            cdsReadEventContext.setResult(availabilityUploadErrors);
        }
    }

    private String getOrDefault(String key, String defaultValue, Row row) {
        Object value;
        if(row.containsKey(key) && (value = row.get(key))!=null) return value.toString();
        else return defaultValue;
    }

    /**
     * get min and max dates for a resource to show availability data get available
     * days for resource from capacity data and calculate days between
     */
    @After(event = { CqnService.EVENT_READ }, entity = AvailabilityUploadData_.CDS_NAME)
    public void afterAvailabilityUploadDataRead(List<AvailabilityUploadData> availabilityUploadData) {

        availabilityUploadData.forEach(resourceData -> {

            // Below code to retrive workAssignment in case of object page only for single
            // resource
            // since wa dates are not part of object page $select query and RequestAtLeast
            // annotation not supported
            if (NullUtils.isNullOrEmpty(resourceData.getWorkAssignmentStartDate())
                    || NullUtils.isNullOrEmpty(resourceData.getWorkAssignmentEndDate())) {
                List<AvailabilityDownloadView> resources = availabilityDao
                        .fetchWorkAssignmentsDatesForResource(resourceData.getResourceId());
                resourceData.setWorkAssignmentStartDate(resources.get(0).getWorkAssignmentStartDate());
                resourceData.setWorkAssignmentEndDate(resources.get(0).getWorkAssignmentEndDate());
            }

            resourceData.setMinDate(DateUtils.determineMinDate(resourceData.getWorkAssignmentStartDate(),
                    resourceData.getWorkAssignmentEndDate()));
            resourceData.setMaxLimitDate(DateUtils.determineMaxLimitDate(resourceData.getWorkAssignmentEndDate()));

            if (!NullUtils.isNullOrEmpty(resourceData.getMinDate())
                    && !NullUtils.isNullOrEmpty(resourceData.getMaxLimitDate())) {
                resourceData.setAvailableDays(availabilityDao.fetchCapacityDataCount(resourceData.getResourceId(),
                        resourceData.getMinDate(), resourceData.getMaxLimitDate()));
                resourceData.setRequiredDays(
                        DateUtils.calculateDaysBetween(resourceData.getMinDate(), resourceData.getMaxLimitDate()));
            }
            if (resourceData.getRequiredDays() != 0 && resourceData.getAvailableDays() != 0) {
                resourceData.setUploadDataPercentage(BigDecimal.valueOf(
                    Math.round(resourceData.getAvailableDays().doubleValue() * 1000 / resourceData.getRequiredDays().doubleValue())/10.0));
            }
        });
    }

    /**
     * This event handler replaces the {0} in localised data of monthsOfTheYear with
     * year and populates the manipulated data in the AvailabilityPeriodicCount View
     */
    @After(event = { CqnService.EVENT_READ }, entity = AvailabilityPeriodicCount_.CDS_NAME)
    public void updateAvailabilityPeriodicCountData(final CdsReadEventContext cdsReadEventContext) {
        this.commonEventHandlerUtil.setLocalisedDataForAvailabilityPeriodicCount(cdsReadEventContext,
                AvailabilityPeriodicCount.MONTH_YEAR, AvailabilityPeriodicCount.CALMONTH);
    }

}
