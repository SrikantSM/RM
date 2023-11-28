package com.sap.c4p.rm.skill;

public class TestConstants {

  public static final String CONSUMER_SUB_DOMAIN = "consumer-subdomain";
  public static final String X_SAP_JOB_ID = "x-sap-job-id";
  public static final String SCHEDULES = "schedules";
  public static final String X_SAP_JOB_SCHEDULE_ID = "x-sap-job-schedule-id";
  public static final String RUNS = "runs";
  public static final String X_SAP_JOB_RUN_ID = "x-sap-job-run-id";
  public static final String X_SAP_SCHEDULER_HOST = "x-sap-scheduler-host";
  public static final String X_SAP_RUN_AT = "x-sap-run-at";
  public static final String SCHEDULER_JOB_PATH_SEGMENT = "scheduler/jobs";

  public static final String JOB_SCHEDULER_DUMMY_SERVICE_URL = "https://job-scheduler.dummyServiceURL.com/";
  public static final String APPLICATION_USER = "ConfigurationExpert";
  public static final String APPLICATION_PASSWORD = "pass";

  public static final String APP_USER_UNAUTHORIZED = "authenticated-user";
  public static final String APP_PASSWORD_UNAUTHORIZED = "pass";

  public static final String INITIAL_LOAD_RESPONSE_WFCCATALOG = "initial_load_wfccatalog.json";

  public static final String DELTA_LOAD_RESPONSE_WFCCATALOG = "delta_load_wfccatalog.json";

  public static final String INITIAL_LOAD_RESPONSE_WFCPROFSCALE = "initial_load_wfcproficiency.json";

  public static final String INITIAL_LOAD_RESPONSE_WFCAPABILITY = "initial_load_wfcapability.json";

  public static final String DELTA_LOAD_RESPONSE_WFCAPABILITY = "delta_load_wfcapability.json";

  public static final String DELTA_LOAD_RESPONSE_WFCPROFSCALE = "delta_load_wfcproficiency.json";

  public static final String JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND = "JobScheduler/dummy_job_scheduler_previous_run_not_found.json";
  public static final String DESTINATION_RESPONSE = "destination_response_with_oauth_token.json";
  public static final Integer SLEEP_TIMEOUT = 2500;
  public static final String PAGE_SIZE = "page_size";

  private TestConstants() {
  }

}
