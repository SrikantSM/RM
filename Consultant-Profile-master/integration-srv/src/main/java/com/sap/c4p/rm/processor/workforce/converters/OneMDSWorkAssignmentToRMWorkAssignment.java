package com.sap.c4p.rm.processor.workforce.converters;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.workforce.dto.WorkAssignment;
import com.sap.c4p.rm.utils.*;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

/**
 * This Converter will convert oneMDS {@link WorkAssignment} record to
 * Resource-Management {@link WorkAssignments} entity. Converter will throw
 * {@link ConversionFailedException} if conversion fails.
 */
@Component
public class OneMDSWorkAssignmentToRMWorkAssignment implements Converter<WorkAssignment, WorkAssignments> {

    public static final String EXTERNAL_ID = "externalID";
    public static final String START_DATE = "startDate";
    public static final String WORK_ASSIGNMENT = "workAssignment";
    public static final String WORK_ASSIGNMENT_ID = "workAssignmentId (workAssignment/id)";

    private final CommonUtility commonUtility;
    private final ConverterUtility converterUtility;

    @Autowired
    public OneMDSWorkAssignmentToRMWorkAssignment(final CommonUtility commonUtility,
            final ConverterUtility converterUtility) {
        this.commonUtility = commonUtility;
        this.converterUtility = converterUtility;
    }

    @Override
    public WorkAssignments convert(WorkAssignment oneMDSWorkAssignment) {
        WorkAssignments workAssignment = WorkAssignments.create();
        workAssignment.setExternalID(this.converterUtility.checkMandatory(oneMDSWorkAssignment.getExternalId(),
                EXTERNAL_ID, WORK_ASSIGNMENT));
        workAssignment.setWorkAssignmentID(this.converterUtility.checkMandatory(oneMDSWorkAssignment.getId(),
                WORK_ASSIGNMENT_ID, WORK_ASSIGNMENT));
        workAssignment.setStartDate(this.commonUtility.toLocalDate(this.converterUtility
                .checkMandatory(oneMDSWorkAssignment.getStartDate(), START_DATE, WORK_ASSIGNMENT)));
        String endDate;
        if ((endDate = oneMDSWorkAssignment.getEndDate()) == null)
            endDate = "9999-12-31";
        LocalDate localEndDate = this.commonUtility.toLocalDate(endDate);
        workAssignment.setEndDate(localEndDate);
        if (oneMDSWorkAssignment.getIsContingentWorker() == null) {
        	workAssignment.setIsContingentWorker(false);
        }
        else {
        	workAssignment.setIsContingentWorker(oneMDSWorkAssignment.getIsContingentWorker());
        }
        return workAssignment;
    }
}
