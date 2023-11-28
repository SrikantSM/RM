
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "externalId", "isContingentWorker", "id", "startDate", "endDate", "detail", "jobDetails",
        "workOrderDetail" })
public class WorkAssignment implements Serializable {

    @JsonProperty("externalId")
    private String externalId;
    @JsonProperty("isContingentWorker")
    private Boolean isContingentWorker;
    @JsonProperty("id")
    private String id;
    @JsonProperty("startDate")
    private String startDate;
    @JsonProperty("endDate")
    private String endDate;
    @JsonProperty("detail")
    private List<Detail> detail = null;
    @JsonProperty("jobDetails")
    private List<JobDetail> jobDetails = null;
    @JsonProperty("workOrderDetail")
    private List<WorkOrderDetail> workOrderDetail = null;

    private static final long serialVersionUID = 593896694371310966L;

    @JsonProperty("externalId")
    public String getExternalId() {
        return externalId;
    }

    @JsonProperty("externalId")
    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    @JsonProperty("isContingentWorker")
    public Boolean getIsContingentWorker() {
        return isContingentWorker;
    }

    @JsonProperty("isContingentWorker")
    public void setIsContingentWorker(Boolean isContingentWorker) {
        this.isContingentWorker = isContingentWorker;
    }

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty("startDate")
    public String getStartDate() {
        return startDate;
    }

    @JsonProperty("startDate")
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    @JsonProperty("endDate")
    public String getEndDate() {
        return endDate;
    }

    @JsonProperty("endDate")
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    @JsonProperty("detail")
    public List<Detail> getDetail() {
        return detail;
    }

    @JsonProperty("detail")
    public void setDetail(List<Detail> detail) {
        this.detail = detail;
    }

    @JsonProperty("jobDetails")
    public List<JobDetail> getJobDetails() {
        return jobDetails;
    }

    @JsonProperty("jobDetails")
    public void setJobDetails(List<JobDetail> jobDetails) {
        this.jobDetails = jobDetails;
    }

    @JsonProperty("workOrderDetail")
    public List<WorkOrderDetail> getWorkOrderDetail() {
        return workOrderDetail;
    }

    @JsonProperty("workOrderDetail")
    public void setWorkOrderDetail(List<WorkOrderDetail> workOrderDetail) {
        this.workOrderDetail = workOrderDetail;
    }

}
