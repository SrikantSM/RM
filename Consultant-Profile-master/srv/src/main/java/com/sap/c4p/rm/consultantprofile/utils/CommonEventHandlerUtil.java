package com.sap.c4p.rm.consultantprofile.utils;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.services.cds.CdsReadEventContext;

import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;

@Component
public class CommonEventHandlerUtil {
    private final LocalizedMessageSource localizedMessageSource;

    @Autowired
    public CommonEventHandlerUtil(final LocalizedMessageSource localizedMessageSource) {
        this.localizedMessageSource = localizedMessageSource;
    }

    public void setLocalisedDataForPeriodicAvailability(final CdsReadEventContext cdsReadEventContext,
            final String monthYear, final String calMonth) {
        setLocalisedDataForMonthYear(cdsReadEventContext, monthYear, calMonth);
    }

    /**
     * This event handler replaces the {0} in localised data of monthsOfTheYear with
     * year and populates the manipulated data in the PeriodicUtilization
     */
    public void setLocalisedDataForPeriodicUtilization(final CdsReadEventContext cdsReadEventContext,
            final String monthYear, final String calMonth) {
        setLocalisedDataForMonthYear(cdsReadEventContext, monthYear, calMonth);
    }

    /**
     * This event handler replaces the {0} in localised data of monthsOfTheYear with
     * year and populates the manipulated data in the AvailabilityPeriodicCount View
     */
    public void setLocalisedDataForAvailabilityPeriodicCount(final CdsReadEventContext cdsReadEventContext,
            final String monthYear, final String calMonth) {
        setLocalisedDataForMonthYear(cdsReadEventContext, monthYear, calMonth);
    }

    public void setLocalInternalWEConvertedAssigned(final CdsReadEventContext cdsReadEventContext,
            final String convertedAssignedCapacity) {
        Result cdsReadEventContextResult = cdsReadEventContext.getResult();
        if (cdsReadEventContextResult != null) {
            cdsReadEventContextResult.forEach(row -> {
                String actualConvertedAssignedCapacity = (String) row.get(convertedAssignedCapacity);
                if (!NullUtils.isNullOrEmpty(actualConvertedAssignedCapacity)) {
                    String convertedAssignedCapacityWithTimeUnit = StringFormatter.format(
                            this.localizedMessageSource.getLocalizedMessageSource(MessageKeys.HOURS),
                            (Object[]) row.get(convertedAssignedCapacity).toString().split("\\."));
                    row.replace(convertedAssignedCapacity, convertedAssignedCapacityWithTimeUnit);
                }
            });
            cdsReadEventContext.setResult(cdsReadEventContextResult);
        }
    }

    private void setLocalisedDataForMonthYear(final CdsReadEventContext cdsReadEventContext, final String monthYear,
            final String calMonth) {
        Result cdsReadEventContextResult = cdsReadEventContext.getResult();
        if (cdsReadEventContextResult != null) {
            cdsReadEventContextResult.forEach(row -> {
                String year = row.get(calMonth).toString().substring(0, 4);
                String monthYearData = StringFormatter.format(row.get(monthYear).toString(), year);
                row.replace(monthYear, monthYearData);
            });
            cdsReadEventContext.setResult(cdsReadEventContextResult);
        }
    }

    public Integer getUtilizationColor(Integer utilization) {
        if ((utilization < 70 && utilization > 120) || (utilization == null) || (utilization == 0)) {
            return 1;
        } else if ((utilization >= 70 && utilization < 80) || (utilization > 110 && utilization <= 120)) {
            return 2;
        } else if (utilization >= 80 && utilization <= 110) {
            return 3;
        } else {
            return 1;
        }
    }
}
