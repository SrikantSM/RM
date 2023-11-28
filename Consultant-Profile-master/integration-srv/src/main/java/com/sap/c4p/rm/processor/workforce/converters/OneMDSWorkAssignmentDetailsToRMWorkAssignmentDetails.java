package com.sap.c4p.rm.processor.workforce.converters;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.workforce.dto.Content__;
import com.sap.c4p.rm.processor.workforce.dto.Detail;
import com.sap.c4p.rm.utils.*;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentDetails;

/**
 * This Converter will convert oneMDS {@link Detail} record to
 * Resource-Management {@link WorkAssignmentDetails} entity. Converter will
 * throw {@link ConversionFailedException} if conversion fails.
 */
@Component
public class OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails implements Converter<Detail, WorkAssignmentDetails> {

    private final CommonUtility commonUtility;

    @Autowired
    public OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails(final CommonUtility commonUtility) {
        this.commonUtility = commonUtility;
    }

    @Override
    public WorkAssignmentDetails convert(Detail oneMDSDetail) {

        WorkAssignmentDetails workAssignmentDetail = WorkAssignmentDetails.create();
        workAssignmentDetail.setId(UUID.randomUUID().toString());
        String validFrom = oneMDSDetail.getValidFrom();
        String validTo = oneMDSDetail.getValidTo();
        if (IsNullCheckUtils.isNullOrEmpty(validTo) && !IsNullCheckUtils.isNullOrEmpty(validFrom)) {
            validTo = "9999-12-31";
        }
        workAssignmentDetail.setValidFrom(this.commonUtility.toLocalDate(validFrom));
        workAssignmentDetail.setValidTo(this.commonUtility.toLocalDate(validTo));
        Content__ oneMDSWorkAssignmentDetailsContent;
        if ((oneMDSWorkAssignmentDetailsContent = oneMDSDetail.getContent()) != null)
            workAssignmentDetail.setIsPrimary(oneMDSWorkAssignmentDetailsContent.getIsPrimary());
        return workAssignmentDetail;
    }
}
