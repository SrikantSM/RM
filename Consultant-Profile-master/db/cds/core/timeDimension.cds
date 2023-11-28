namespace com.sap.resourceManagement.system.data.timeDimension;

using { managed } from '@sap/cds/common';

/*
M_TIME_DIMENSION being as _SYS_BI schema object, may be shared across all customers
who use that HDB system.  Generation of new entries is not a problem.  IF a
solution offers to delete data from M_TIME_DIMENSION it is a problem for us.
We will not get matching records out of this table while joining by field TimeDimension

Data Generation by automated background job: Generate data into this DB table for every 15 min

Procedure RM_FILL_TIME_DIMENSION is used to fill time dimension data.

For quarterHour periodicity, for one year, the size on the DB is 0.76 MB
*/

entity Data { // partially equivalent of _SYS_BI.M_TIME_DIMENSION.
    key DATETIMESTAMP : Timestamp;
        DATE_SQL : Date;
        DATETIME_SAP : String(14);
        DATE_SAP : String(8);
        YEAR : String(4);
        QUARTER : String(2);
        MONTH : String(2);
        WEEK : String(2);
        WEEK_YEAR : String(4);
        DAY_OF_WEEK : String(2);
        DAY : String(2);
        HOUR : String(2);
        MINUTE : String(2);
        HALF_HOUR_INDEX : String(1);
        QUARTER_HOUR_INDEX : String(1);
        CALQUARTER : String(5);
        CALMONTH : String(6);
        CALWEEK : String(6);
};

/*
DB Table Size Information: DB Cockpit --> Monitoring --> Monitor Table Usage
----------------------------------------------------------------------------
RM_TIMEDIMENSION uses
- 10.18 MB for one year of 1 minute interval data (every 1 min).
- 2.85 MB for one year of 15 minute interval data (every 15 min).
*/