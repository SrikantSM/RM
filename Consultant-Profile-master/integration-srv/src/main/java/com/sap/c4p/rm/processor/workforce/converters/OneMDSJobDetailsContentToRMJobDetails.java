package com.sap.c4p.rm.processor.workforce.converters;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.workforce.dto.*;

import com.sap.resourcemanagement.workforce.workassignment.JobDetails;

/**
 * This Converter will convert oneMDS {@link Content___} record to
 * Resource-Management {@link JobDetails} entity. Converter will throw
 * {@link ConversionFailedException} if conversion fails.
 */
@Component
public class OneMDSJobDetailsContentToRMJobDetails implements Converter<Content___, JobDetails> {

    @Override
    public JobDetails convert(Content___ oneMDSJobDetailContent) {
        JobDetails jobDetail = JobDetails.create();
        jobDetail.setId(UUID.randomUUID().toString());

        // SupervisorExternalId
        SupervisorWorkAssignment jobDetailSupervisorWorkAssignment;
        if ((jobDetailSupervisorWorkAssignment = oneMDSJobDetailContent.getSupervisorWorkAssignment()) != null)
            jobDetail.setSupervisorWorkAssignmentExternalID(jobDetailSupervisorWorkAssignment.getExternalId());

        // Cost Center
        CostCenter jobDetailCostCenter;
        if ((jobDetailCostCenter = oneMDSJobDetailContent.getCostCenter()) != null)
            jobDetail.setCostCenterExternalID(jobDetailCostCenter.getId());

        // LegalEntity
        LegalEntity jobDetailLegalEntity;
        if ((jobDetailLegalEntity = oneMDSJobDetailContent.getLegalEntity()) != null)
            jobDetail.setLegalEntityExternalID(jobDetailLegalEntity.getExternalId());

        // Country
        Country jobDetailCountry;
        if ((jobDetailCountry = oneMDSJobDetailContent.getCountry()) != null)
            jobDetail.setCountryCode(jobDetailCountry.getCode());

        // JobTitle
        jobDetail.setJobTitle(oneMDSJobDetailContent.getJobTitle());

        // Job Status Code
        Status jobDetailStatusCode;
        if ((jobDetailStatusCode = oneMDSJobDetailContent.getStatus()) != null)
            jobDetail.setStatusCode(jobDetailStatusCode.getCode());

        // Job Detail
        Job jobDetailJob;
        if ((jobDetailJob = oneMDSJobDetailContent.getJob()) != null)
            jobDetail.setJobExternalID(jobDetailJob.getExternalId());

        defaultValueSet(oneMDSJobDetailContent, jobDetail);

        Event jobDetailEvent;
        if ((jobDetailEvent = oneMDSJobDetailContent.getEvent()) != null)
            jobDetail.setEventCode(jobDetailEvent.getCode());

        EventReason jobDetailEventReason;
        if ((jobDetailEventReason = oneMDSJobDetailContent.getEventReason()) != null)
            jobDetail.setEventReasonCode(jobDetailEventReason.getCode());

        OrgUnit jobDetailOrgUnit;
        if ((jobDetailOrgUnit = oneMDSJobDetailContent.getOrgUnit()) != null)
            jobDetail.setOrgUnitExternalId(jobDetailOrgUnit.getExternalId());

        SuperOrdinateOrgUnit1 jobDetailSuperOrdinateOrgUnit1;
        if ((jobDetailSuperOrdinateOrgUnit1 = oneMDSJobDetailContent.getSuperOrdinateOrgUnit1()) != null)
            jobDetail.setSuperOrdinateOrgUnit1ExternalId(jobDetailSuperOrdinateOrgUnit1.getExternalId());

        SuperOrdinateOrgUnit2 jobDetailSuperOrdinateOrgUnit2;
        if ((jobDetailSuperOrdinateOrgUnit2 = oneMDSJobDetailContent.getSuperOrdinateOrgUnit2()) != null)
            jobDetail.setSuperOrdinateOrgUnit2ExternalId(jobDetailSuperOrdinateOrgUnit2.getExternalId());

        return jobDetail;
    }

    private void defaultValueSet(Content___ oneMDSJobDetailContent, JobDetails jobDetail) {
        if (oneMDSJobDetailContent.getFte() == null)
            jobDetail.setFte(BigDecimal.valueOf(0));
        else
            jobDetail.setFte(oneMDSJobDetailContent.getFte());

        if (oneMDSJobDetailContent.getWorkingDaysPerWeek() == null)
            jobDetail.setWorkingDaysPerWeek(BigDecimal.valueOf(0));
        else
            jobDetail.setWorkingDaysPerWeek(oneMDSJobDetailContent.getWorkingDaysPerWeek());

        if (oneMDSJobDetailContent.getWorkingHoursPerWeek() == null)
            jobDetail.setWorkingHoursPerWeek(BigDecimal.valueOf(0));
        else
            jobDetail.setWorkingHoursPerWeek(oneMDSJobDetailContent.getWorkingHoursPerWeek());

        if(oneMDSJobDetailContent.getEventSequence() == null)
            jobDetail.setEventSequence(0);
        else
            jobDetail.setEventSequence(oneMDSJobDetailContent.getEventSequence());
    }

}
