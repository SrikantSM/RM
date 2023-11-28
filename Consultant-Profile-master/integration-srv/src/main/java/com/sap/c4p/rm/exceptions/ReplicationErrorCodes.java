package com.sap.c4p.rm.exceptions;

/**
 * An Enum class to provide the codes for different replication exceptions
 * scenarios
 */
public enum ReplicationErrorCodes {

    DB_TRANSACTION("RM_CP_001"),
    DOES_NOT_HAVE_MANDATORY("RM_CP_002"),
    NOT_VALID_DATETIME_RANGE("RM_CP_003"),
    INVALID_DESTINATION_RESPONSE("RM_CP_004"),
    INCORRECT_DESTINATION_CONFIGURATION("RM_CP_005"),
    MDI_URL_ERROR("RM_CP_006"),
    DELTA_TOKEN_MISMATCH("RM_CP_007"),
    CONFLICT("RM_CP_008"),
    TIMEOUT("RM_CP_009"),
    UNKNOWN("RM_CP_010"),
    EXCEPTION("RM_CP_011"),
	DESTINATION_NOT_FOUND("RM_CP_012"), 
	INVALID_LANGUAGE_CODE("RM_CP_013");

    private final String errorCode;

    ReplicationErrorCodes(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return this.errorCode;
    }
}
