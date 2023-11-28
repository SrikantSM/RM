package com.sap.c4p.rm.projectintegrationadapter.model;

/**
 * In the initial load we accept one Service Organization and its respective
 * Reference date in payload. In the DB, we persist the Reference Date as Date
 * type but to pass date in json body we need to pass it as string, that's the
 * reason we are using this ProjectReplicationTask Model.
 */
public class ProjectReplicationTask {

  private int taskStatusCode;

  private String referenceDate;

  private String serviceOrganizationCode;

  private boolean isAutoPublish;

  public int getTaskStatusCode() {
    return this.taskStatusCode;
  }

  public void setTaskStatusCode(int taskStatus) {
    this.taskStatusCode = taskStatus;
  }

  public String getReferenceDate() {
    return this.referenceDate;
  }

  public void setReferenceDate(String referenceDate) {
    this.referenceDate = referenceDate;
  }

  public String getServiceOrganizationCode() {
    return this.serviceOrganizationCode;
  }

  public void setServiceOrganizationCode(String serviceOrganizationCode) {
    this.serviceOrganizationCode = serviceOrganizationCode;
  }

  public boolean getIsAutoPublish() {
    return this.isAutoPublish;
  }

  public void setIsAutoPublish(boolean isAutoPublish) {
    this.isAutoPublish = isAutoPublish;
  }

}
