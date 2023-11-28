package com.sap.c4p.rm.consultantprofile.handlers;

import java.io.IOException;
import java.io.StringWriter;
import java.text.ParseException;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.lang3.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.availabilityservice.dao.IAvailabilityDAO;
import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView;

/**
 * Class to define functionality handling availability file downloads
 *
 */
@Component
public class AvailabilityFileDownloadHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(AvailabilityFileDownloadHandler.class);

    private final IAvailabilityDAO availabilityDao;
    FastDateFormat dateFormatter = FastDateFormat.getInstance("yyyy-MM-dd");

    @Autowired
    public AvailabilityFileDownloadHandler(IAvailabilityDAO availabilityDao) {
        this.availabilityDao = availabilityDao;
    }

    /**
     * Provides handler to availability data download template.
     *
     * @param startDate         defines download data from date
     * @param endDate           defines download data upto date
     * @param costCenter        defines to download for given costcenter
     * @param workForcePersonId defines employee
     * @param workingHours      default working hours
     * @param nonWorkingHours   default non working hours
     * @return stream of String
     */
    public String handleDownload(final String startDate, final String endDate, final String costCenter,
            final String workForcePersonId, final int workingHours, final int nonWorkingHours) throws IOException {

        boolean isCostcenter = true;
        if (!NullUtils.isNullOrEmpty(workForcePersonId)) {
            LOGGER.debug("handleDownload workForcePersonId : {} ", workForcePersonId);
            isCostcenter = false;
        }

        StringWriter out = new StringWriter();
        CSVPrinter printer = CSVFormat.DEFAULT
                .withHeader(CapacityCsvColumn.RESOURCE_ID.getName(), CapacityCsvColumn.WORKFORCEPERSON_ID.getName(),
                        CapacityCsvColumn.FIRSTNAME.getName(), CapacityCsvColumn.LASTNAME.getName(),
                        CapacityCsvColumn.S4COSTCENTER_ID.getName(),
                        CapacityCsvColumn.WORKASSIGNMENTEXTERNAL_ID.getName(), CapacityCsvColumn.STARTDATE.getName(),
                        CapacityCsvColumn.PLANNEDWORKINGHOURS.getName(), CapacityCsvColumn.NONWORKINGHOURS.getName())
                .print(out);

        LOGGER.debug("handleDownload isCostcenter value : {}", isCostcenter);

        if (isCostcenter) {
            processCostCenterRecords(startDate, endDate, costCenter, workingHours, nonWorkingHours, printer);
        } else {
            processEmployeeIdRecords(startDate, endDate, workForcePersonId, workingHours, nonWorkingHours, printer);
        }

        String csvFileContent = out.toString();
        out.close();
        return csvFileContent;
    }

    /**
     * Method reads availability summaries for given cost center and writes to
     * output stream.
     *
     * @param startDate       defines download data from date
     * @param endDate         defines download data upto date
     * @param costCenter      defines to download for given costcenter
     * @param workingHours    default working hours
     * @param nonWorkingHours default non working hours
     * @return void
     */
    private void processCostCenterRecords(String startDate, final String endDate, final String costCenter,
            final int workingHours, final int nonWorkingHours, CSVPrinter printer) {
        List<AvailabilityDownloadView> resources = availabilityDao.fetchAvailabilitySummaryDownload(costCenter);
        if (!NullUtils.isNullOrEmpty(resources)) {
            LOGGER.debug("Fetched Cost center availabilities size : {} ", resources.size());
            try {
                this.printCsvRecords(startDate, endDate, workingHours, nonWorkingHours, resources, printer);
            } catch (IOException | ParseException e) {
                LOGGER.info("Exception occurred in processCostCenterRecords method {} ", e.getLocalizedMessage());
            }
        }
    }

    /**
     * Method reads availability summaries for given workforcepersonId and writes to
     * output stream.
     *
     * @param startDate         defines download data from date
     * @param endDate           defines download data upto date
     * @param workForcePersonId defines employeeId
     * @param workingHours      default working hours
     * @param nonWorkingHours   default non working hours
     * @return void
     */
    private void processEmployeeIdRecords(String startDate, final String endDate, String workForcePersonId,
            final int workingHours, final int nonWorkingHours, CSVPrinter printer) {
        List<AvailabilityDownloadView> resources = availabilityDao
                .fetchWorkAssignmentsForEmployeeDownload(workForcePersonId);
        if (!NullUtils.isNullOrEmpty(resources)) {
            LOGGER.debug("Fetched workforcepersonid availabilities size {} ", resources.size());
            try {
                this.printCsvRecords(startDate, endDate, workingHours, nonWorkingHours, resources, printer);
            } catch (IOException | ParseException e) {
                LOGGER.warn("Exception occurred in processEmployeeIdRecords method {} ", e.getLocalizedMessage());
            }
        }
    }

    /**
     * Method writes csvrecord to output stream.
     *
     * @param sel_startDate   defines user input start date
     * @param sel_endDate     defines user input end date
     * @param workingHours    default working hours
     * @param nonWorkingHours default non working hours
     * @return void
     */
    private void printCsvRecords(final String sel_startDate, final String sel_endDate, final int defaultWorkingHours,
            final int defaultNonWorkngHours, final List<AvailabilityDownloadView> availabilityRecords,
            final CSVPrinter printer) throws IOException, ParseException {
        for (AvailabilityDownloadView availabilityRecord : availabilityRecords) {
            String workAssignmentExternalId = availabilityRecord.getWorkAssignmentExternalId();
            String waStartDate = availabilityRecord.getWorkAssignmentStartDate();
            String waEndDate = availabilityRecord.getWorkAssignmentEndDate();

            if ((waEndDate.compareTo(sel_startDate) >= 0) && (waStartDate.compareTo(sel_endDate) <= 0)
                    && (!availabilityRecord.getIsBusinessPurposeCompleted())) {
                LOGGER.info("Valid WorkAssignment : {}", workAssignmentExternalId);
                if (waStartDate.compareTo(sel_startDate) <= 0) {
                    waStartDate = sel_startDate;
                }

                if (waEndDate.compareTo(sel_endDate) >= 0) {
                    waEndDate = sel_endDate;
                }
                LOGGER.info("StartDate : {} endDate : {}", waStartDate, waEndDate);
                List<Date> dateRanges = populateDates(dateFormatter.parse(waStartDate), dateFormatter.parse(waEndDate));
                printRecords(dateRanges, availabilityRecord, printer, defaultWorkingHours, defaultNonWorkngHours);
                LOGGER.info("Successful WorkAssignment : {},  StartDate : {} endDate : {}", workAssignmentExternalId,
                        waStartDate, waEndDate);
            } else {
                LOGGER.warn("Failed!! Invalid WorkAssignment : {}", workAssignmentExternalId);
            }
        }
    }

    private void printRecords(List<Date> dateRanges, AvailabilityDownloadView availabilityRecord,
            final CSVPrinter printer, final int defaultWorkingHours, final int defaultNonWorkngHours)
            throws IOException {
        if (!NullUtils.isNullOrEmpty(dateRanges)) {
            String[] comboDates = new String[dateRanges.size()];
            for (int i = 0; i < dateRanges.size(); i++)
                comboDates[i] = new java.text.SimpleDateFormat("yyyy-MM-dd").format(dateRanges.get(i));
            for (int i = 0; i < comboDates.length; i++) {

                printer.printRecord(escapeData(availabilityRecord.getResourceId()),
                        escapeData(availabilityRecord.getWorkForcePersonExternalId()),
                        escapeData(availabilityRecord.getFirstName()), escapeData(availabilityRecord.getLastName()),
                        escapeData(availabilityRecord.getS4CostCenterId()),
                        escapeData(availabilityRecord.getWorkAssignmentExternalId()), comboDates[i],
                        defaultWorkingHours, defaultNonWorkngHours);

            }
        }
    }

    /**
     * Method generates dates for given range of startdate and enddate.
     *
     * @param startDate
     * @param endDate
     * @return List<Date>
     */
    private synchronized List<Date> populateDates(java.util.Date startDate, java.util.Date endDate) {
        Date begin = new Date(startDate.getTime());
        List<Date> listDates = new LinkedList<>();
        listDates.add(new Date(begin.getTime()));
        while (begin.compareTo(endDate) < 0) {
            begin = new Date(begin.getTime() + 86400000);
            listDates.add(new Date(begin.getTime()));
        }
        return listDates;
    }

    private String escapeData(final Object input) {
        String result = "";
        if (input != null) {
            result = input.toString();
            result = result.replace(",", "\uFF0C"); // Full Width Comma
            result = result.replace("\"", "\u201D"); // Right double quotation mark
        }
        return result;
    }
}
