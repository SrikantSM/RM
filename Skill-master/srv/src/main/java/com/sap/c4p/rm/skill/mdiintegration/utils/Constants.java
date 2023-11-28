package com.sap.c4p.rm.skill.mdiintegration.utils;

public class Constants {

  private Constants() {
  }

  // Cache configuration constants
  // The cache interval has been decided based on the XSUAA recommnedation
  // https://github.wdf.sap.corp/CPSecurity/Knowledge-Base/blob/92294ebfdcf27c640bc623e806c5ed93af13b57a/03_ApplicationSecurity/xsuaa_recommendations.md#adopt-oauth-configuration
  public static final int CACHE_CLEAN_INTERVAL = 50 * 60 * 1000; // In Miliseconds

  public static final String OAUTH = "oauth";
  public static final String TOKEN = "token";
  public static final String HTTPS = "https";
  public static final String CORRELATION_ID = "correlation_id";
  public static final String X_CORRELATION_ID = "X-CorrelationID";

  public static final String HAS_JOB_SCHEDULER_AUTHORITY = "hasAuthority('JobScheduler')";
  public static final String X_SAP_JOB_ID = "x-sap-job-id";
  public static final String X_SAP_JOB_SCHEDULE_ID = "x-sap-job-schedule-id";
  public static final String X_SAP_JOB_RUN_ID = "x-sap-job-run-id";
  public static final String X_SAP_SCHEDULER_HOST = "x-sap-scheduler-host";
  public static final String X_SAP_RUN_AT = "x-sap-run-at";

  // MDI Logs processor
  public static final String INSTANCE = "instance";
  public static final String INSTANCE_ID = "Id";

  // Caches
  public static final String REPLICATION_ERROR_CODE_CACHE_NAME = "wfcReplicationErrorMessages";
  public static final String JOB_SCHEDULER_OAUTH_TOKEN_CACHE_NAME = "wfcJobSchedulerOAuthToken";

  public static final String DESTINATION_OAUTH_TOKEN_CACHE_NAME = "wfcDestinationOAuthToken";
  public static final String MDI_OAUTH_TOKEN_CACHE_NAME = "wfcMDIOAuthToken";

  public static final String JOB_RUN_STATUS_COMPLETED = "COMPLETED";
  public static final String JOB_RUN_STATUS_RUNNING = "RUNNING";
  public static final String JOB_RUN_STATUS_SCHEDULED = "SCHEDULED";

  public static final Integer REPLICATION_FAILURE_STATUS_OPEN = 0;
  public static final Integer REPLICATION_FAILURE_STATUS_IN_PROGRESS = 1;
  public static final Integer REPLICATION_FAILURE_STATUS_CLOSED = 2;

  public static final String REPLICATION_TYPE_WORKFORCE_PROFICIENCY_SCALE = "workforceDataProficiencyScaleData";
  public static final String REPLICATION_TYPE_WORKFORCE_CAPABILITY_CATALOG = "workforceCapabilityCatalogData";
  public static final String REPLICATION_TYPE_WORKFORCE_CAPABILITY = "workforceCapabilityData";

  // Log Messages
  public static final String MDI_LOG_PROCESSOR_INIT_MESSAGE = "Processing instance record with the event={}, versionId={} and instance.id={}";

}
