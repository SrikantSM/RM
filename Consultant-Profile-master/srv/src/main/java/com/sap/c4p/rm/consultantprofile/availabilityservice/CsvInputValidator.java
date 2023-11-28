package com.sap.c4p.rm.consultantprofile.availabilityservice;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;
import com.sap.c4p.rm.consultantprofile.exceptions.AvailabilityErrorCodes;
import com.sap.c4p.rm.consultantprofile.exceptions.AvailabilityUploadException;
import com.sap.c4p.rm.consultantprofile.exceptions.TrackException;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;

/**
 * Availability CSVInput Validator
 */
@Component
public class CsvInputValidator {

    private static final Logger LOGGER = LoggerFactory.getLogger(CsvInputValidator.class);
    private static final Marker MARKER = LoggingMarker.AVAILABILITY_IMPORTER.getMarker();
    private final FastDateFormat formatter = FastDateFormat.getInstance("yyyy-MM-dd");
    private final CommonValidator commonValidator;

    @Autowired
    public CsvInputValidator(final CommonValidator commonValidator) {
        this.commonValidator = commonValidator;
    }

    /**
     * Validates availability csv column contents
     */
    public void validateColumnsContent(final CSVRecord csvRecord) {
        long recordNumber = csvRecord.getRecordNumber();
        final String resourceId = csvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName().trim());
        final String costCenter = csvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName().trim());

        if (NullUtils.isNullOrEmpty(resourceId)) {
            CsvInputValidator.LOGGER.debug(MARKER, "BAD REQUEST, Empty ResourceID!! Skipping record : {}",
                    recordNumber);
            throw new TrackException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_EMPTY_RESOURCEID);
        }

        if (!isUUID(resourceId)) {
            CsvInputValidator.LOGGER.debug(MARKER,
                    "BAD REQUEST, Invalid UUID format; ResourceID!! Skipping record : {}", recordNumber);
            throw new TrackException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_INVALID_UUID);
        }

        if (NullUtils.isNullOrEmpty(costCenter)) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_COSTCENTER_CAN_NOT_BE_EMPTY);
        }

        if (validateCostCenterLength(costCenter)) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_INVALID_COSTCENTER_FORMAT, costCenter);
        }

        if (!validateDateFormat(csvRecord.get(CapacityCsvColumn.STARTDATE.getName()))) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_STARTDATE_INVALID_FORMAT);
        }

        if (!validateHrs(csvRecord)) {
            CsvInputValidator.LOGGER.debug(MARKER,
                    "BAD REQUEST, Invalid Working or NonWorking Hours!! Skipping record : {}", recordNumber);
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_INVALID_HRS);
        }

        if (!validate24Hrs(csvRecord)) {
            CsvInputValidator.LOGGER.debug(MARKER,
                    "BAD REQUEST, The entered Working or NonWorking Hours is greater than 24 hrs.!! Skipping record : {}",
                    recordNumber);
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_INVALID_24HRS);
        }

    }

    /**
     * Validates availability file download mandatory input request parameters
     */
    public void validateInputForFileDownload(final String startDate, final String endDate, final String costCenter,
            final String workForcePersonId) {
        if (!NullUtils.isNullOrEmpty(costCenter) && validateCostCenterLength(costCenter)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_INVALID_COSTCENTER_FORMAT,
                    costCenter);
        } else if (!commonValidator.validateFreeTextforScripting(costCenter)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_COSTCENTER_CAN_NOT_BE_EMPTY);
        } else if (!commonValidator.validateFreeTextforScripting(workForcePersonId)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_INVALID_WORKFORCEPERSON_ID,
                    workForcePersonId);
        } else if (NullUtils.isNullOrEmpty(startDate)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_START_DATE_CAN_NOT_BE_EMPTY);
        } else if (NullUtils.isNullOrEmpty(endDate)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_END_DATE_CAN_NOT_BE_EMPTY);
        } else if (!commonValidator.validateFreeTextforScripting(startDate)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_STARTDATE_INVALID_FORMAT);
        } else if (!commonValidator.validateFreeTextforScripting(endDate)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_ENDDATE_INVALID_FORMAT);
        } else if (!validateDateFormat(startDate)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_STARTDATE_INVALID_FORMAT);
        } else if (!validateDateFormat(endDate)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_ENDDATE_INVALID_FORMAT);
        } else if (isStartDateGreater(startDate, endDate)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST,
                    MessageKeys.AVAILABILITY_STARTDATE_CAN_NOT_GREATER_THAN_ENDDATE);
        }
    }

    /**
     * Validates availability workForcePerson IsBusinessPurposeCompleted false.
     */
    public void isWPBusinessPurposeCompleted(final AvailabilityReplicationView workAssignment) {
        Boolean businessPurpose = workAssignment.getIsBusinessPurposeCompleted();
        if (Boolean.TRUE.equals(businessPurpose)) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_WORKFORCEPERSON_ISBUSINESSPURPOSECOMPLETED);
        }
    }

    /**
     * Validates availability Work Assignment for null check.
     */
    public void isNullWorkAssignment(final AvailabilityReplicationView workAssignment) {
        if (workAssignment == null) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_WORKASSIGNMENTS_NOT_FOUND);
        }
    }

    /**
     * Validates availability RESOURCE_ID for null check.
     */
    public void isNullResourceId(final AvailabilityReplicationView resourceId) {
        if (resourceId == null) {
            throw new TrackException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_INVALID_UUID);
        }
    }

    /**
     * Validates availability file upload mandatory input request parameters
     */
    public void validateInputForFileUpload(final MultipartFile[] files, final String costCenter) {
        if (files.length > 1) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MULTIPLE_FILES_ARE_NOT_SUPPORTED);
        } else if (files.length == 0) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_FILE_SPECIFIED);
        } else if (validateCostCenterLength(costCenter)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_INVALID_COSTCENTER_FORMAT,
                    costCenter);
        } else if (NullUtils.isNullOrEmpty(costCenter)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_COSTCENTER_CAN_NOT_BE_EMPTY);
        } else if (!commonValidator.validateFreeTextforScripting(costCenter)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_INVALID_COSTCENTER_FORMAT);
        }
    }

    /**
     * Validates working and nonworking hours
     */
    private boolean validateHrs(CSVRecord csvRecord) {
        String workingHrs = csvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName());
        String nonWorkingHrs = csvRecord.get(CapacityCsvColumn.NONWORKINGHOURS.getName());
        return StringUtils.isNumeric(workingHrs) && StringUtils.isNumeric(nonWorkingHrs);
    }

    /**
     * Validates working and nonworking hours for boundary conditions
     */
    private boolean validate24Hrs(CSVRecord csvRecord) {
        String workingHrs = csvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName());
        String nonWorkingHrs = csvRecord.get(CapacityCsvColumn.NONWORKINGHOURS.getName());
        boolean valid = true;
        if (Long.parseLong(workingHrs) > 24)
            valid = false;
        if (Long.parseLong(nonWorkingHrs) > 24)
            valid = false;
        return valid;
    }

    /**
     * Validates csv record resourceId for valid UUID format
     */
    private boolean isUUID(String string) {
        try {
            UUID.fromString(string);
            return true;
        } catch (IllegalArgumentException ex) {
            CsvInputValidator.LOGGER.warn(MARKER, "BAD REQUEST, Invalid input resourceID!! Skipping record : {}",
                    ex.getMessage());
            return false;
        }
    }

    /**
     * Validates input csvDate is within workassignment starDate and endDate range.
     */
    public void validateWorkAssignment(final AvailabilityReplicationView workAssignment, final String csvDate)
            throws ParseException {
        Date wStartDate = formatter.parse(workAssignment.getWorkAssignmentStartDate().trim());
        Date wEndDate = formatter.parse(workAssignment.getWorkAssignmentEndDate().trim());
        Date startDate = formatter.parse(csvDate.trim());
        if ((startDate.before(wStartDate) || startDate.after(wEndDate))) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_INVALID_WORKASSIGNMENT, workAssignment.getResourceId());
        }
    }

    /**
     * Validates input length of costCenter.
     */
    public boolean validateCostCenterLength(String costCenter) {
        return costCenter.length() > 10;
    }

    /**
     * Validates input csvCostcenter with user user selected costcenter.
     */
    public void validateCostCenter(final String inputCostcenter, String csvCostcenter) {
        if (!(inputCostcenter.equalsIgnoreCase(csvCostcenter))) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.AVAILABILITY_COSTCENTER_MATCH_NOT_FOUND, inputCostcenter, csvCostcenter);
        }
    }

    /**
     * Validates input csvDate format for yyyy-MM-dd pattern.
     */
    public synchronized boolean validateDateFormat(String strDate) {
        if (NullUtils.isNullOrEmpty(strDate)) {
            return false;
        } else {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            simpleDateFormat.setLenient(false);
            try {
                simpleDateFormat.parse(strDate);
            } catch (ParseException e) {
                return false;
            }
            return true;
        }
    }

    /**
     * Validates input startDate is greater than endDate.
     */
    public boolean isStartDateGreater(String startDate, String endDate) {
        return startDate.compareTo(endDate) > 0;
    }

    /**
     * Validates input costcenter is numeric or not.
     */
    public boolean isNumeric(final String str) {
        if (str == null || str.length() == 0) {
            return false;
        }
        for (char c : str.toCharArray()) {
            if (!Character.isDigit(c)) {
                return false;
            }
        }
        return true;
    }

}
