package com.sap.c4p.rm.consultantprofile.utils.commonvalidations;

/**
 * Utility to validate common scenarios
 */
public interface CommonValidator {

    /**
     *
     * validates if given input exists in referenced DB artifact.
     *
     * @param dbArtifact : Represents have the Database artifact's CDS signature
     * @param dbField    : Represents have the Database artifact's fieldName as
     *                   defined in CDS files
     * @param value      : Represents the value which needs to be checked
     * @return : `true` if value exists else `false`
     */
    boolean checkInputValueExistingDB(final String dbArtifact, final String dbField, final String value);

    /**
     * Validates if the free text is clean of cross site scripting
     *
     * @param value: free text value
     * @return : boolean which denotes whether the value is clean
     */
    boolean validateFreeTextforScripting(final String value);

    /**
     * Validates if a string is null or blank
     *
     * @param value: test value
     * @return : boolean which denotes whether the value is blank
     */
    boolean isBlank(String value);

    /**
     * checks If length of given input is as per the GUID length or not
     *
     * @param str: Represents the value(String form) which needs to be checked
     * @return : `true` if length is same as GUID Length else `false`
     */
    boolean checkInputGuidFieldLength(final String str);

}
