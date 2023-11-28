
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "legalEntity", "supervisorWorkAssignment", "fte", "status", "job", "jobTitle", "costCenter",
        "country", "workingDaysPerWeek", "workingHoursPerWeek", "eventSequence", "event", "eventReason", "orgUnit",
        "superOrdinateOrgUnit1", "superOrdinateOrgUnit2" })
public class Content___ implements Serializable {

    @JsonProperty("legalEntity")
    private LegalEntity legalEntity;
    @JsonProperty("supervisorWorkAssignment")
    private SupervisorWorkAssignment supervisorWorkAssignment;
    @JsonProperty("fte")
    private BigDecimal fte;
    @JsonProperty("status")
    private Status status;
    @JsonProperty("job")
    private Job job;
    @JsonProperty("jobTitle")
    private String jobTitle;
    @JsonProperty("costCenter")
    private CostCenter costCenter;
    @JsonProperty("country")
    private Country country;
    @JsonProperty("workingDaysPerWeek")
    private BigDecimal workingDaysPerWeek;
    @JsonProperty("workingHoursPerWeek")
    private BigDecimal workingHoursPerWeek;
    @JsonProperty("eventSequence")
    private Integer eventSequence;
    @JsonProperty("event")
    private Event event;
    @JsonProperty("eventReason")
    private EventReason eventReason;
    @JsonProperty("orgUnit")
    private OrgUnit orgUnit;
    @JsonProperty("superOrdinateOrgUnit1")
    private SuperOrdinateOrgUnit1 superOrdinateOrgUnit1;
    @JsonProperty("superOrdinateOrgUnit2")
    private SuperOrdinateOrgUnit2 superOrdinateOrgUnit2;

    private static final long serialVersionUID = 8555006041136588755L;

    @JsonProperty("legalEntity")
    public LegalEntity getLegalEntity() {
        return legalEntity;
    }

    @JsonProperty("legalEntity")
    public void setLegalEntity(LegalEntity legalEntity) {
        this.legalEntity = legalEntity;
    }

    @JsonProperty("supervisorWorkAssignment")
    public SupervisorWorkAssignment getSupervisorWorkAssignment() {
        return supervisorWorkAssignment;
    }

    @JsonProperty("supervisorWorkAssignment")
    public void setSupervisorWorkAssignment(SupervisorWorkAssignment supervisorWorkAssignment) {
        this.supervisorWorkAssignment = supervisorWorkAssignment;
    }

    @JsonProperty("fte")
    public BigDecimal getFte() {
        return fte;
    }

    @JsonProperty("fte")
    public void setFte(BigDecimal fte) {
        this.fte = fte;
    }

    @JsonProperty("status")
    public Status getStatus() {
        return status;
    }

    @JsonProperty("status")
    public void setStatus(Status status) {
        this.status = status;
    }

    @JsonProperty("job")
    public Job getJob() {
        return job;
    }

    @JsonProperty("job")
    public void setJob(Job job) {
        this.job = job;
    }

    @JsonProperty("jobTitle")
    public String getJobTitle() {
        return jobTitle;
    }

    @JsonProperty("jobTitle")
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    @JsonProperty("costCenter")
    public CostCenter getCostCenter() {
        return costCenter;
    }

    @JsonProperty("costCenter")
    public void setCostCenter(CostCenter costCenter) {
        this.costCenter = costCenter;
    }

    @JsonProperty("country")
    public Country getCountry() {
        return country;
    }

    @JsonProperty("country")
    public void setCountry(Country country) {
        this.country = country;
    }

    @JsonProperty("workingDaysPerWeek")
    public BigDecimal getWorkingDaysPerWeek() {
        return workingDaysPerWeek;
    }

    @JsonProperty("workingDaysPerWeek")
    public void setWorkingDaysPerWeek(BigDecimal workingDaysPerWeek) {
        this.workingDaysPerWeek = workingDaysPerWeek;
    }

    @JsonProperty("workingHoursPerWeek")
    public BigDecimal getWorkingHoursPerWeek() {
        return workingHoursPerWeek;
    }

    @JsonProperty("workingHoursPerWeek")
    public void setWorkingHoursPerWeek(BigDecimal workingHoursPerWeek) {
        this.workingHoursPerWeek = workingHoursPerWeek;
    }

    @JsonProperty("eventSequence")
    public Integer getEventSequence() {
        return eventSequence;
    }

    @JsonProperty("eventSequence")
    public void setEventSequence(Integer eventSequence) {
        this.eventSequence = eventSequence;
    }

    @JsonProperty("event")
    public Event getEvent() {
        return event;
    }

    @JsonProperty("event")
    public void setEvent(Event event) {
        this.event = event;
    }

    @JsonProperty("eventReason")
    public EventReason getEventReason() {
        return eventReason;
    }

    @JsonProperty("eventReason")
    public void setEventReason(EventReason eventReason) {
        this.eventReason = eventReason;
    }

    @JsonProperty("orgUnit")
    public OrgUnit getOrgUnit() {
        return orgUnit;
    }

    @JsonProperty("orgUnit")
    public void setOrgUnit(OrgUnit orgUnit) {
        this.orgUnit = orgUnit;
    }

    @JsonProperty("superOrdinateOrgUnit1")
    public SuperOrdinateOrgUnit1 getSuperOrdinateOrgUnit1() {
        return superOrdinateOrgUnit1;
    }

    @JsonProperty("superOrdinateOrgUnit1")
    public void setSuperOrdinateOrgUnit1(SuperOrdinateOrgUnit1 superOrdinateOrgUnit1) {
        this.superOrdinateOrgUnit1 = superOrdinateOrgUnit1;
    }

    @JsonProperty("superOrdinateOrgUnit2")
    public SuperOrdinateOrgUnit2 getSuperOrdinateOrgUnit2() {
        return superOrdinateOrgUnit2;
    }

    @JsonProperty("superOrdinateOrgUnit2")
    public void setSuperOrdinateOrgUnit2(SuperOrdinateOrgUnit2 superOrdinateOrgUnit2) {
        this.superOrdinateOrgUnit2 = superOrdinateOrgUnit2;
    }

}
