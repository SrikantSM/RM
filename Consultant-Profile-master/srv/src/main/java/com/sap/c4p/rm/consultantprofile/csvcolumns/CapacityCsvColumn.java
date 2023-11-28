package com.sap.c4p.rm.consultantprofile.csvcolumns;

/**
 * Enumeration of columns contained in the CSV file format
 */
public enum CapacityCsvColumn {

    RESOURCE_ID("resourceId"),
    WORKFORCEPERSON_ID("workForcePersonExternalId"),
    FIRSTNAME("firstName"),
    LASTNAME("lastName"),
    S4COSTCENTER_ID("s4costCenterId"),
    WORKASSIGNMENTEXTERNAL_ID("workAssignmentExternalId"),
    STARTDATE("startDate"),
    PLANNEDWORKINGHOURS("plannedWorkingHours"),
    NONWORKINGHOURS("nonWorkingHours");

    private final String column;

    private CapacityCsvColumn(final String column) {
        this.column = column;
    }

    public String getName() {
        return this.column;
    }
}
