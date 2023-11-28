package com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service;

import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
@Profile({ "default" })
public class JobSchedulerServiceLocal implements JobSchedulerServiceInterface {

  @Override
  public void createDeltaAndDeleteJob(String subDomain, String tenantId) {
    // Kept blank as in local run, implementation is not required

  }

  @Override
  public void createJobForDelta(String subdomain, String tenantid) {
    // Kept blank as in local run, implementation is not required

  }

  @Override
  public void prepareAndExecuteJobSchedulerRequest(String deltaJobPrefix, String subdomain, String tenantid) {
    // Kept blank as in local run, implementation is not required

  }

  @Override
  public void createJobForDelete(String subdomain, String tenantid) {
    // Kept blank as in local run, implementation is not required

  }

  @Override
  public <T> T doRequest(String url, HttpMethod method, HttpEntity<String> request, Class<T> responseType) {
    // Kept blank as in local run, implementation is not required
    return null;
  }

}