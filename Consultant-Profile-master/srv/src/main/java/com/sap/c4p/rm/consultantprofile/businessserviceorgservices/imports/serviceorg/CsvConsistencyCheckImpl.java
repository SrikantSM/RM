package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg;

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

import com.sap.c4p.rm.consultantprofile.csvcolumns.BsoCsvColumn;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;

@Service
class CsvConsistencyCheckImpl implements CsvConsistencyCheck {

    /**
     * Checks whether the following column headers are available:
     * <ol>
     * <li>{@code costCenter}</li>
     * <li>{@code description}</li>
     * <li>{@code code}</li>
     * <li>{@code companyCode}</li>
     * <li>{@code isDelivery}</li>
     * <li>{@code additionalCostCenter}</li>
     * </ol>
     *
     * In case any of the column headers is missing, a
     * {@link MissingColumnException} will be thrown
     *
     * @param headers
     *
     */
    public void checkHeaders(final Set<String> headers) {
        final List<String> mandatoryHeaders = Arrays.asList(BsoCsvColumn.CODE.getName(),
                BsoCsvColumn.DESCRIPTION.getName(), BsoCsvColumn.IS_DELIVERY.getName(),
                BsoCsvColumn.COMPANY_CODE.getName(), BsoCsvColumn.COST_CENTER.getName());

        final Set<String> missingHeaders = mandatoryHeaders.stream().filter(e -> !headers.contains(e))
                .collect(Collectors.toSet());

        if (!missingHeaders.isEmpty()) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_COLUMNS_MISSING,
                    String.join(", ", missingHeaders));
        }
    }

    /**
     * Checks whether the following column have some content:
     * <ol>
     * <li>{@code costCenter}</li>
     * <li>{@code description}</li>
     * <li>{@code code}</li>
     * <li>{@code companyCode}</li>
     * <li>{@code isDelivery}</li>
     * <li>{@code additionalCostCenter}</li>
     * </ol>
     *
     * In case any of the columns do not have a valid value, an
     * {@link EmptyMandatoryColumnException} will be thrown
     *
     * @param records
     */
    public void checkContent(final CSVRecord csvRecord) {

        final String code = csvRecord.get(BsoCsvColumn.CODE.getName().trim());
        final String costCenter = csvRecord.get(BsoCsvColumn.COST_CENTER.getName().trim());
        final String companyCode = csvRecord.get(BsoCsvColumn.COMPANY_CODE.getName().trim());
        final String isDelivery = csvRecord.get(BsoCsvColumn.IS_DELIVERY.getName().trim());

        final Map<Long, Set<String>> emptyValues = new HashMap<>();
        final List<String> nonEmptyColumns = Arrays.asList(BsoCsvColumn.COST_CENTER.getName(),
                BsoCsvColumn.CODE.getName(), BsoCsvColumn.COMPANY_CODE.getName());

        final Set<String> emptyValuesOfRecord = nonEmptyColumns.stream()
                .filter(e -> !csvRecord.isSet(e) || csvRecord.get(e).isEmpty()).collect(Collectors.toSet());
        if (!emptyValuesOfRecord.isEmpty()) {
            emptyValues.put(csvRecord.getRecordNumber(), emptyValuesOfRecord);
        }
        if (!emptyValues.isEmpty()) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_COLUMN_CONTENT_MISSING,
                    CsvConsistencyCheckImpl.getMissingContentPlaceholder(emptyValues));
        }

        if (validateUnitKeyLength(costCenter)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.INVALID_COSTCENTER_FORMAT, costCenter);
        }

        if (validateUnitKeyLength(companyCode)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.INVALID_COMPANYCODE_FORMAT, companyCode);
        }

        if (validateServiceOrgLength(code)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.INVALID_SERVICEORG_CODE_FORMAT, code);
        }

        if (validateBooleanInput(isDelivery.toUpperCase()) && !isDelivery.isEmpty()) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.INVALID_ISBOOLEAN_VALUE, isDelivery,
                    BsoCsvColumn.IS_DELIVERY.getName());
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
            StringJoiner sj = new StringJoiner(", ", e.getKey() + ": ", "; ");
            e.getValue().forEach(sj::add);
            result.append(sj);
        }
        return result.toString();
    }

    /**
     * Validates input length of unitKey.
     */
    public boolean validateUnitKeyLength(String unitKey) {
        return unitKey.length() > 10;
    }

    /**
     * Validates input length of serviceOrg code.
     */
    public boolean validateServiceOrgLength(String serviceOrg) {
        return serviceOrg.length() > 5;
    }

    /**
     * Validates input for boolean value.
     */
    public boolean validateBooleanInput(String flagValue) {
        return !("X".equals(flagValue) || "N".equals(flagValue));
    }
}
