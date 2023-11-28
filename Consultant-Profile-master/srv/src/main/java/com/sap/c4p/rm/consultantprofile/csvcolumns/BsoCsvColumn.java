package com.sap.c4p.rm.consultantprofile.csvcolumns;

/**
 * Enumeration of CSV columns contained in the Business Service Organization CSV
 * file format
 */
public enum BsoCsvColumn {

    COMPANY_CODE("companyCode"),
    DESCRIPTION("description"),
    CODE("code"),
    COST_CENTER("costCenterID"),
    IS_DELIVERY("isDelivery");

    private final String column;

    private BsoCsvColumn(final String column) {
        this.column = column;
    }

    public String getName() {
        return this.column;
    }
}
