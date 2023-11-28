package com.sap.c4p.rm.projectintegrationadapter.util;

import java.util.List;

public class ReplicationResponseEntity {

  private String status;
  private List<ReplicationMessage> details;

  public ReplicationResponseEntity(String status, List<ReplicationMessage> details) {
    this.status = status;
    this.details = details;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public List<ReplicationMessage> getDetails() {
    return details;
  }

  public void setDetails(List<ReplicationMessage> details) {
    this.details = details;
  }

}
