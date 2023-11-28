package com.sap.c4p.rm.consultantprofile.utils.commonutility;

import java.util.List;
import java.util.Set;

/**
 * Utility for common operations
 */

public interface CommonUtility {

    /**
     *
     * to Get the list of values to be extracted from DB
     *
     * @param dbArtifact        : Represents the Database artifact's CDS signature
     * @param dbCompareColumn   : Represents the Database artifact's fieldName as
     *                          defined in CDS files for which the compare values
     *                          will be provided
     * @param keyValueList      : Represents the List of values to be compared
     * @param dbGetValueColumn: Represents the column of which we need the data
     *
     * @return : A list of string values of dbGetValueColumn
     */
    List<String> getRecordsValueFromDB(final String dbArtifact, final String dbCompareColumn,
            final List<String> keyValueList, final String dbGetValueColumn);

    /**
     *
     * to Get the list of values to be extracted from DB
     *
     * @param dbArtifact        : Represents the Database artifact's CDS signature
     * @param dbCompareColumn   : Represents the Database artifact's fieldName as
     *                          defined in CDS files for which the compare values
     *                          will be provided
     * @param keyValueSet       : Represents the Set of values to be compared
     * @param dbGetValueColumn: Represents the column of which we need the data
     *
     * @return : A list of string values of dbGetValueColumn
     */
    List<String> getRecordsValueFromDB(final String dbArtifact, final String dbCompareColumn,
            final Set<String> keyValueSet, final String dbGetValueColumn);

}
