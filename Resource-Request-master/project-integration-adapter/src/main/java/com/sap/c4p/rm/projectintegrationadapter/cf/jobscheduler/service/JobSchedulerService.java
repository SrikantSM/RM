package com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service;

import java.net.URL;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.JobScheduler;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.util.JobSchedulerToken;
import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.util.CfUtils;

@Component
@Profile({ "cloud" })
public class JobSchedulerService implements JobSchedulerServiceInterface {

  private CfUtils cfUtil;
  private JobSchedulerToken jobSchedulerToken;
  private static final Logger logger = LoggerFactory.getLogger(JobSchedulerService.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_JOB_SCHEDULER_MARKER.getMarker();

  RestTemplate restTemplate = new RestTemplate();
  public static final String ACTIVE_STRING = "active";
  public static final String DESCRIPTION_STRING = "description";
  public static final String DELETE_JOB_PREFIX = "DeleteProjects";
  public static final String DELTA_JOB_PREFIX = "S4ReplicationDelta";
  public static final String DELTA_JOB_INTERVAL = "15 minutes";
  public static final String DELETE_JOB_INTERVAL = "10 hours";

  @Autowired
  public JobSchedulerService(CfUtils cfUtil, JobSchedulerToken jobSchedulerToken) {
    this.cfUtil = cfUtil;
    this.jobSchedulerToken = jobSchedulerToken;
  }

  public void createDeltaAndDeleteJob(String subDomain, String tenantId) {
    logger.debug(MARKER, "Entered method createDeltaAndDeleteJob, in JobSchedulerService class");
    try {

      createJobForDelta(subDomain, tenantId);
      createJobForDelete(subDomain, tenantId);

    } catch (ServiceException e) {
      logger.debug(MARKER, "Failed while creating delta and delete job.");
      // Error logged in calling function.
      throw new ServiceException(e);
    }

  }

  public void createJobForDelete(String subDomain, String tenantId) {
    logger.debug(MARKER, "Entered method createJobForDelete, in JobSchedulerService class");
    try {

      prepareAndExecuteJobSchedulerRequest(DELETE_JOB_PREFIX, subDomain, tenantId);

    } catch (ServiceException e) {
      logger.debug(MARKER, "Failed while creating delete job. Exception.");
      // Error logged in calling function.
      throw new ServiceException("Failed to create job for delete", e);
    }

  }

  public void createJobForDelta(String subDomain, String tenantId) {
    logger.debug(MARKER, "Entered method createJobForDelta, in JobSchedulerService class");
    try {

      prepareAndExecuteJobSchedulerRequest(DELTA_JOB_PREFIX, subDomain, tenantId);

    } catch (ServiceException e) {
      logger.debug(MARKER, "Failed while creating delta job.");
      // Error logged in calling function.
      throw new ServiceException("Failed to create job for delta", e);
    }

  }

  public void prepareAndExecuteJobSchedulerRequest(String jobNamePrefix, String subDomain, String tenantId) {
    logger.debug(MARKER, "Entered method prepareAndExecuteJobSchedulerRequest, in JobSchedulerService class");
    try {

      JobScheduler jobScheduler;
      String actionUrl = null;
      String bearerToken = null;
      String description = null;
      String repeatInterval = null;
      String jobName = null;

      jobScheduler = cfUtil.getServiceForJobSceduler();

      bearerToken = jobSchedulerToken.getCertificateBearerToken(jobScheduler, subDomain);

      HttpHeaders requestHeaders = new HttpHeaders();
      requestHeaders.setContentType(MediaType.APPLICATION_JSON);
      requestHeaders.setBearerAuth(bearerToken);

      if (DELTA_JOB_PREFIX.equals(jobNamePrefix)) {
        logger.debug(MARKER, "Preparing  delta job.");
        actionUrl = "https://" + cfUtil.getApplicationUris() + "/replicateS4ProjectsDelta";
        description = "Job to do delta load for the projects for sub domain " + subDomain;
        repeatInterval = DELTA_JOB_INTERVAL;
      } else if (DELETE_JOB_PREFIX.equals(jobNamePrefix)) {
        logger.debug(MARKER, "Preparing  delete job.");
        actionUrl = "https://" + cfUtil.getApplicationUris() + "/deleteProjects";
        description = "Job to delete the projects for sub domain" + subDomain;
        repeatInterval = DELETE_JOB_INTERVAL;
      }

      jobName = jobNamePrefix + tenantId;
      jobName = jobName.replaceAll("[^a-zA-Z0-9]", "");

      JsonObject requestDataForPost = new JsonObject();
      requestDataForPost.addProperty("name", jobName);
      requestDataForPost.addProperty(DESCRIPTION_STRING, description);
      requestDataForPost.addProperty("action", actionUrl);
      requestDataForPost.addProperty(ACTIVE_STRING, Boolean.TRUE);
      requestDataForPost.addProperty("httpMethod", "POST");

      JsonObject scheduleJsonObject = new JsonObject();
      scheduleJsonObject.addProperty("repeatInterval", repeatInterval);
      scheduleJsonObject.addProperty(DESCRIPTION_STRING, String.format("this schedule runs every %s ", repeatInterval));
      scheduleJsonObject.addProperty(ACTIVE_STRING, Boolean.TRUE);

      JsonArray scheduleList = new JsonArray();
      scheduleList.add(scheduleJsonObject);
      requestDataForPost.add("schedules", scheduleList);

      HttpEntity<String> httpEntity = new HttpEntity<>(requestDataForPost.toString(), requestHeaders);

      String url = new URL(jobScheduler.getSchedulerUrl(), "scheduler/jobs").toString();
      doRequest(url, HttpMethod.POST, httpEntity, String.class);

    } catch (ServiceException e) {
      logger.debug(MARKER, "Failed to create {} job for tenant.", jobNamePrefix);
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(MARKER, "Failed to create {} job for tenant.", jobNamePrefix);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed to create {} job for tenant", jobNamePrefix, e);
    }
  }

  public <T> T doRequest(String url, HttpMethod method, HttpEntity<String> request, Class<T> responseType) {
    logger.debug(MARKER, "Entered method doRequest, in JobSchedulerService class");
    try {
      ResponseEntity<T> response = restTemplate.exchange(url, method, request, responseType);
      return response.getBody();
    } catch (HttpClientErrorException | HttpServerErrorException e) {
      logger.debug(MARKER, "Failed to create job for tenant.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Failed to create job for tenant. {} {} returned error code {}{}. Response Body: {}", method, url,
          e.getStatusCode(), e.getMessage(), e.getResponseBodyAsString(), e);
    }
  }

}
