package com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public interface JobSchedulerServiceInterface {
  public void createDeltaAndDeleteJob(String subDomain, String tenantId);

  public void createJobForDelta(String subdomain, String tenantid);

  public void prepareAndExecuteJobSchedulerRequest(String deltaJobPrefix, String subdomain, String tenantid);

  public void createJobForDelete(String subdomain, String tenantid);

  public <T> T doRequest(String url, HttpMethod method, HttpEntity<String> request, Class<T> responseType);
}
