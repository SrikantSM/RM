package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.availabilityservice.CsvInputValidator;
import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;
import com.sap.c4p.rm.consultantprofile.exceptions.AvailabilityUploadException;
import com.sap.c4p.rm.consultantprofile.exceptions.TrackException;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationStatus;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;
import com.sap.resourcemanagement.resource.Capacity;

@Service
public class AvailabilityCsvImporterImpl implements AvailabilityCsvImporter {

    private static final Logger LOGGER = LoggerFactory.getLogger(AvailabilityCsvImporterImpl.class);
    private static final Marker MARKER = LoggingMarker.AVAILABILITY_IMPORTER.getMarker();
    private static final String SUCCESS = "Success";
    private static final String FAILED = "Failed";
    private static final String FALSE = "false";

    private final AvailabilityCsvConsistencyCheck csvConsistencyCheck;
    private final CsvInputValidator csvInputValidator;
    private final AvailabilityService availabilityService;

    @Autowired
    public AvailabilityCsvImporterImpl(final AvailabilityCsvConsistencyCheck csvConsistencyCheck,
            final CsvInputValidator csvInputValidator, final AvailabilityService availabilityService) {
        this.csvConsistencyCheck = csvConsistencyCheck;
        this.csvInputValidator = csvInputValidator;
        this.availabilityService = availabilityService;
    }

    @Override
    public ImportResult importStream(final InputStream csvStream, final String costCenter) throws IOException {

        List<Capacity> capacities = new ArrayList<>();
        List<AvailabilityReplicationError> failedAssignments = new ArrayList<>();
        List<AvailabilityReplicationStatus> assignments = new ArrayList<>();
        ImportResultBuilder result = new ImportResultImpl(0, 0, 0);
        final CSVParser csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8,
                CSVFormat.RFC4180.withFirstRecordAsHeader());

        this.csvConsistencyCheck.checkHeaders(csvParser.getHeaderMap().keySet());

        // Fetch all availability summary details for given cost center
        List<AvailabilityReplicationView> availabilitySummaries = availabilityService
                .fetchAvailabilitySummary(costCenter);

        if (NullUtils.isNullOrEmpty(availabilitySummaries))
            throw new ServiceException(HttpStatus.NOT_FOUND, MessageKeys.AVAILABILITY_WORKASSIGNMENTS_NOT_FOUND);

        LOGGER.debug(MARKER, "Total no. of Availability Summaries {} for cost center : {}. ",
                availabilitySummaries.size(), costCenter);
        LOGGER.info(MARKER, "File upload CSV Processing Started !!! ");

        this.processRecord(csvParser, costCenter, availabilitySummaries, capacities, assignments, failedAssignments,
                result);

        availabilityService.saveOrUpdateAvailabilities(costCenter, capacities, assignments, failedAssignments);
        AvailabilityCsvImporterImpl.LOGGER.info(MARKER, "File upload CSV Processing Completed !!! ");

        if (!assignments.isEmpty()) {
            long noOfRecordsPassed = assignments.stream().filter(c -> c.getStatus().startsWith(SUCCESS)).count();
            long noOfRecordsFailed = assignments.stream().filter(c -> c.getStatus().startsWith(FAILED)).count();
            long noOfResourceIDErrors = result.build().getResourceIDErrors();
            result = new ImportResultImpl(noOfRecordsPassed, noOfRecordsFailed, noOfResourceIDErrors);
            AvailabilityCsvImporterImpl.LOGGER.debug(MARKER,
                    "Total noOfRecordsPassed : {} noOfRecordsFailed {} noOfResourceIDErrors {} ",
                    result.build().getCreatedItems(), result.build().getErrors(), result.build().getResourceIDErrors());
        }
        return result.build();
    }

    /**
     * Parses and returns the Capacity represented by the given {@link CSVRecord}.
     *
     * @param csvParser             {@link CSVParser} that was already validated
     * @param availabilitySummaries
     * @param capacities
     * @param assignments
     * @param failedAssignments
     * @param result
     */
    private void processRecord(final CSVParser csvParser, final String costCenter,
            List<AvailabilityReplicationView> availabilitySummaries, List<Capacity> capacities,
            List<AvailabilityReplicationStatus> assignments, List<AvailabilityReplicationError> failedAssignments,
            ImportResultBuilder result) {

        AvailabilityReplicationView resourceIdDetails;
        AvailabilityReplicationView workAssignment;
        String workForcePersonExternalId = null;
        long noOfResourceIDErrors = 0;

        for (CSVRecord csvRecord : csvParser) {
            if (csvRecord.size() > 1) {
                try {
                    this.csvConsistencyCheck.checkContent(csvRecord);
                    csvInputValidator.validateColumnsContent(csvRecord);
                    String resourceId = csvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName()).trim();
                    String csvDate = csvRecord.get(CapacityCsvColumn.STARTDATE.getName()).trim();
                    String s4CostCenterId = csvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName()).trim();
                    csvInputValidator.validateCostCenter(costCenter, s4CostCenterId);
                    resourceIdDetails = availabilityService.getAvailabilityResourceId(availabilitySummaries,
                            resourceId);
                    csvInputValidator.isNullResourceId(resourceIdDetails);
                    workAssignment = availabilityService.getWorkAssignmentById(availabilitySummaries, resourceId,
                            s4CostCenterId);
                    csvInputValidator.isNullWorkAssignment(workAssignment);
                    csvInputValidator.isWPBusinessPurposeCompleted(workAssignment);
                    csvInputValidator.validateWorkAssignment(workAssignment, csvDate);
                    workForcePersonExternalId = workAssignment.getWorkForcePersonExternalId();
                    capacities.add(this.parseAvailability(csvRecord));
                    assignments
                            .add(availabilityService.updateAssignment(csvRecord, workForcePersonExternalId, SUCCESS));
                } catch (AvailabilityUploadException availabilityUploadException) {
                    failedAssignments.add(addError(csvRecord, availabilityUploadException));
                    assignments.add(availabilityService.updateAssignment(csvRecord, workForcePersonExternalId, FAILED));
                } catch (TrackException trackException) {
                    LOGGER.info(MARKER, "TrackException : {}", trackException.getLocalizedMessage());
                    noOfResourceIDErrors = noOfResourceIDErrors + 1;
                    assignments.add(availabilityService.updateAssignment(csvRecord, workForcePersonExternalId, FAILED));
                } catch (ParseException parseException) {
                    // Discuss about this special scenario
                    LOGGER.info(MARKER, "Exception : {}", parseException.getLocalizedMessage());
                    assignments.add(availabilityService.updateAssignment(csvRecord, workForcePersonExternalId, FAILED));
                } catch (Exception e) {
                    LOGGER.info(MARKER, e.getLocalizedMessage());
                    throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ERROR_OCCURRED);
                }
            }
        }
        result.build().setResourceIDErrors(noOfResourceIDErrors);
    }

    /**
     * Parses and returns the Capacity represented by the given {@link CSVRecord}.
     *
     * @param csvRecord @link CSVRecord} that was already validated
     * @return Capacity
     */
    private Capacity parseAvailability(final CSVRecord csvRecord) {

        final Capacity capacity = Capacity.create();

        final String startDateTime = csvRecord.get(CapacityCsvColumn.STARTDATE.getName()) + "T00:00:00Z";
        final String endDateTime = addOneDay(csvRecord.get(CapacityCsvColumn.STARTDATE.getName())) + "T00:00:00Z";

        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        final ZonedDateTime parsedStartDateTime = ZonedDateTime.parse(startDateTime,
                formatter.withZone(ZoneId.of("UTC")));
        final ZonedDateTime parsedEndDateTime = ZonedDateTime.parse(endDateTime, formatter.withZone(ZoneId.of("UTC")));

        String strWorkingHrs = csvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName()).trim();
        String strNonWorkingHrs = csvRecord.get(CapacityCsvColumn.NONWORKINGHOURS.getName()).trim();

        final int workingHrs = Integer.parseInt(strWorkingHrs);
        final int nonWorkingHrs = Integer.parseInt(strNonWorkingHrs);

        capacity.setResourceId(csvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName()).trim());
        capacity.setStartTime(parsedStartDateTime.toInstant());
        capacity.setEndTime(parsedEndDateTime.toInstant());
        capacity.setWorkingTimeInMinutes(workingHrs * 60);
        capacity.setPlannedNonWorkingTimeInMinutes(nonWorkingHrs * 60);
        return capacity;
    }

    /**
     * Creates AvailabilityReplicationError from the given properties
     *
     * @param csvRecord
     * @param availabilityUploadException
     * @return {@link AvailabilityReplicationError}
     */
    private AvailabilityReplicationError addError(final CSVRecord csvRecord,
            final AvailabilityUploadException availabilityUploadException) {
        AvailabilityReplicationError availabilityReplicationError = AvailabilityReplicationError.create();
        String s4CostCenterId = csvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName()).trim();
        availabilityReplicationError.setResourceId(csvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName()));
        availabilityReplicationError
                .setWorkAssignmentExternalId(csvRecord.get(CapacityCsvColumn.WORKASSIGNMENTEXTERNAL_ID.getName()));
        availabilityReplicationError.setStartDate(csvRecord.get(CapacityCsvColumn.STARTDATE.getName()));
        if (!csvInputValidator.validateCostCenterLength(s4CostCenterId)) {
            availabilityReplicationError.setS4costCenterId(s4CostCenterId);
        }
        availabilityReplicationError.setCsvRecordIndex(String.valueOf(csvRecord.getRecordNumber()));
        availabilityReplicationError.setInvalidKeys(FALSE);
        availabilityReplicationError
                .setAvailabilityErrorMessageCode(availabilityUploadException.getAvailabilityErrorCode().getErrorCode());
        List<String> errorParams = availabilityUploadException.getParameters();
        String errorParam1;
        if ((errorParam1 = errorParams.get(0)) != null)
            availabilityReplicationError.setErrorParam1(errorParam1);
        String errorParam2;
        if ((errorParam2 = errorParams.get(1)) != null)
            availabilityReplicationError.setErrorParam2(errorParam2);
        String errorParam3;
        if ((errorParam3 = errorParams.get(2)) != null)
            availabilityReplicationError.setErrorParam3(errorParam3);
        String errorParam4;
        if ((errorParam4 = errorParams.get(3)) != null)
            availabilityReplicationError.setErrorParam4(errorParam4);
        return availabilityReplicationError;
    }

    private String addOneDay(String date) {
        return LocalDate.parse(date).plusDays(1).toString();
    }
}
