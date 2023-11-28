package com.sap.c4p.rm.skill.mdiintegration;

import java.util.UUID;

public class TestConstants {
  public static final String CONSUMER_SUB_DOMAIN = "consumer-subdomain";
  public static final String CONSUMER_DUMMY_OAUTH_TOKEN = "https://" + CONSUMER_SUB_DOMAIN
      + ".authentication.dummyService.com/oauth/token";
  public static final String ONE_MDS_DUMMY_SERVICE_URL = "https://one-mds.dummyServiceURL.com/";
  public static final String BEARER_TOKEN = "bearerToken";
  public static final String IDENTITY_ZONE = "identityzone";
  public static final String SOMETHING_WENT_WRONG = "SOMETHING_WENT_WRONG";
  public static final String DESTINATION_NOT_FOUND = "Destination Not Found";
  public static final String DESTINATION_DUMMY_SERVICE_URL = "https://destination-configuration.dummyServiceURL.com/";
  public static final String HTTP_ERROR_RESPONSE_BODY = "Error Response Body";
  public static final String UNKNOWN_EXCEPTION = "Unknown Exception";
  public static final String DUMMY_APPLICATION_URL = "dummyApplicationUrl.com";
  public static final String JOB_SCHEDULER_DUMMY_SERVICE_URL = "https://job-scheduler.dummyServiceURL.com/";
  public static final String ACCESS_TOKEN = "access_token";
  public static final String X_SAP_JOB_ID = "x-sap-job-id";
  public static final String SCHEDULES = "schedules";
  public static final String X_SAP_JOB_SCHEDULE_ID = "x-sap-job-schedule-id";
  public static final String RUNS = "runs";
  public static final String X_SAP_JOB_RUN_ID = "x-sap-job-run-id";
  public static final String X_SAP_SCHEDULER_HOST = "x-sap-scheduler-host";
  public static final String X_SAP_RUN_AT = "x-sap-run-at";
  public static final String CREATED_EVENT = "created";
  public static final String UPDATED_EVENT = "updated";
  public static final String OTHER_EVENT = "otherEvent";
  public static final String VERSION_ID = UUID.randomUUID().toString();

}
