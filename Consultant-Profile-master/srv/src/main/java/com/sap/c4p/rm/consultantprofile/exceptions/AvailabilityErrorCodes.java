package com.sap.c4p.rm.consultantprofile.exceptions;

public enum AvailabilityErrorCodes {

    AVAILABILITY_STARTDATE_INVALID_FORMAT("AVL_ERR_1"),
    AVAILABILITY_INVALID_HRS("AVL_ERR_2"),
    AVAILABILITY_INVALID_24HRS("AVL_ERR_3"),
    AVAILABILITY_INVALID_COSTCENTER_FORMAT("AVL_ERR_4"),
    AVAILABILITY_COSTCENTER_CAN_NOT_BE_EMPTY("AVL_ERR_5"),
    AVAILABILITY_WORKFORCEPERSON_ISBUSINESSPURPOSECOMPLETED("AVL_ERR_6"),
    AVAILABILITY_WORKASSIGNMENTS_NOT_FOUND("AVL_ERR_7"),
    AVAILABILITY_INVALID_WORKASSIGNMENT("AVL_ERR_8"),
    AVAILABILITY_COSTCENTER_MATCH_NOT_FOUND("AVL_ERR_9"),
    CSV_COLUMN_CONTENT_MISSING("AVL_ERR_10");

    private final String errorCode;

    AvailabilityErrorCodes(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return this.errorCode;
    }

}
