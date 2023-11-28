package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.StringJoiner;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;
import com.sap.c4p.rm.consultantprofile.exceptions.AvailabilityErrorCodes;
import com.sap.c4p.rm.consultantprofile.exceptions.AvailabilityUploadException;
import com.sap.c4p.rm.consultantprofile.exceptions.TrackException;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;

@Service
public class AvailabilityCsvConsistencyCheckImpl implements AvailabilityCsvConsistencyCheck {

    /**
     * Checks whether the following column headers are available:
     * <ol>
     * <li>{@code resourceId}</li>
     * <li>{@code s4costCenterId}</li>
     * <li>{@code workAssignmentExternalID}</li>
     * <li>{@code startDate}</li>
     * <li>{@code plannedWorkingHours}</li>
     * <li>{@code nonWorkingHours}</li>
     * </ol>
     *
     * In case any of the column headers is missing, a {@link ServiceException} will
     * be thrown
     *
     * @param headers
     *
     */
    public void checkHeaders(final Set<String> headers) {
        final List<String> mandatoryHeaders = Arrays.asList(CapacityCsvColumn.RESOURCE_ID.getName(),
                CapacityCsvColumn.S4COSTCENTER_ID.getName(), CapacityCsvColumn.WORKASSIGNMENTEXTERNAL_ID.getName(),
                CapacityCsvColumn.STARTDATE.getName(), CapacityCsvColumn.PLANNEDWORKINGHOURS.getName(),
                CapacityCsvColumn.NONWORKINGHOURS.getName());

        final Set<String> missingHeaders = mandatoryHeaders.stream().filter(e -> !headers.contains(e))
                .collect(Collectors.toSet());

        if (!missingHeaders.isEmpty()) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_COLUMN_MISSING,
                    String.join(", ", missingHeaders));
        }
    }

    /**
     * Checks whether the following column have some content:
     * <ol>
     * <li>{@code resourceId}</li>
     * <li>{@code s4costCenterId}</li>
     * <li>{@code workAssignmentExternalID}</li>
     * <li>{@code startDate}</li>
     * <li>{@code plannedWorkingHours}</li>
     * <li>{@code nonWorkingHours}</li>
     * </ol>
     *
     * In case any of the column headers is missing, a
     * {@link TrackException}/{@link AvailabilityUploadException} will be thrown
     *
     * @param record
     *
     */
    public void checkContent(final CSVRecord csvRecord) {
        final Map<Long, Set<String>> emptyValues = new HashMap<>();
        final List<String> nonEmptyColumns = Arrays.asList(CapacityCsvColumn.RESOURCE_ID.getName(),
                CapacityCsvColumn.S4COSTCENTER_ID.getName(), CapacityCsvColumn.WORKASSIGNMENTEXTERNAL_ID.getName(),
                CapacityCsvColumn.STARTDATE.getName(), CapacityCsvColumn.PLANNEDWORKINGHOURS.getName(),
                CapacityCsvColumn.NONWORKINGHOURS.getName());

        final Set<String> emptyValuesOfRecord = nonEmptyColumns.stream()
                .filter(e -> !csvRecord.isSet(e) || csvRecord.get(e).isEmpty()).collect(Collectors.toSet());
        if (emptyValuesOfRecord.contains("resourceId")) {
            throw new TrackException(HttpStatus.BAD_REQUEST, MessageKeys.AVAILABILITY_EMPTY_RESOURCEID);
        }
        if (!emptyValuesOfRecord.isEmpty() && !emptyValuesOfRecord.contains("s4costCenterId")) {
            emptyValues.put(csvRecord.getRecordNumber(), emptyValuesOfRecord);
        }
        if (!emptyValues.isEmpty()) {
            throw new AvailabilityUploadException(HttpStatus.BAD_REQUEST,
                    AvailabilityErrorCodes.CSV_COLUMN_CONTENT_MISSING,
                    AvailabilityCsvConsistencyCheckImpl.getMissingContentPlaceholder(emptyValues));
        }
    }

    /**
     * Generate a {@link String} to replace the placeholder in error message
     * {@link MessageKeys#CSV_COLUMN_CONTENT_MISSING} naming the lines and columns
     * having being empty.<br>
     * <br>
     *
     * returned {@link String} will look as follows:<br>
     * {@code "<line-number>: <column-name-1>, <column-name-2>, <column-name-n>; ..."}
     * <br>
     * <br>
     * example:<br>
     *
     * @param emptyValues {@link Map} of record numbers together with names of
     *                    columns being empty
     * @return {@link String} to replace the placeholder in error message
     *         {@link MessageKeys#CSV_COLUMN_CONTENT_MISSING}
     */
    private static String getMissingContentPlaceholder(final Map<Long, Set<String>> emptyValues) {
        StringBuilder result = new StringBuilder();

        for (Entry<Long, Set<String>> e : emptyValues.entrySet()) {
            StringJoiner sj = new StringJoiner("; ");
            e.getValue().forEach(sj::add);
            result.append(sj);
        }
        return result.toString();
    }
}
