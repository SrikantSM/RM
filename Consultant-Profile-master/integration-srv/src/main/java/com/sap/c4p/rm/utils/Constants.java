package com.sap.c4p.rm.utils;

/**
 * Class to provide the application level constants
 */
public class Constants {

    // General constants
    public static final String HTTPS = "https";
    public static final int TOTAL_NUMBER_OF_JOBS_PER_TENANT = 4; // Needs to be updated everytime for new job addition.
    public static final String CORRELATION_ID = "correlation_id";
    public static final String X_CORRELATION_ID = "X-CorrelationID";
    public static final String WORK_FORCE_PERSON = "WorkforcePerson";

    // JobScheduler constants
    public static final String CRON_JOB_PATTERN_FOR_TIME_DIMENSION = " * 1 1 * 0 0 0";
    public static final String FIRST_TIME_TIME_DIMENSION_JOB_RUN = "5 minutes from now";
    public static final String REPEAT_INTERVAL_FOR_HOUSE_KEEPER = "15 minutes";
    public static final String REPEAT_INTERVAL_FOR_WORKFORCE_REPLICATION = "30 minutes";
    public static final String REPEAT_INTERVAL_FOR_COST_CENTER_REPLICATION = "30 minutes";
    public static final String REPEAT_INTERVAL_FOR_WORKFORCE_CAPABILITY_REPLICATION = "30 minutes";
    public static final String SCHEDULE_TIME_NOW = "now";
    public static final String JOB_RUN_STATUS_COMPLETED = "COMPLETED";
    public static final String JOB_RUN_STATUS_RUNNING = "RUNNING";
    public static final String JOB_RUN_STATUS_SCHEDULED = "SCHEDULED";
    public static final String TENANT_SPECIFIC_JOB_NAME = "CP_{0}_{1}";
    public static final String SKILLS_DOMAIN_JOB_NAME = "SKILLS_{0}_{1}";


    // Replication failure related constants
    public static final Integer REPLICATION_FAILURE_STATUS_OPEN = 0;
    public static final Integer REPLICATION_FAILURE_STATUS_IN_PROGRESS = 1;
    public static final Integer REPLICATION_FAILURE_STATUS_CLOSED = 2;
    public static final String REPLICATION_TYPE_WORKFORCE_DATA = "workforceData";
    public static final String REPLICATION_TYPE_COST_CENTER_DATA = "costCenterData";

    // JobScheduler Invoked Controller Specific
    public static final String HAS_JOB_SCHEDULER_AUTHORITY = "hasAuthority('JobScheduler')";
    public static final String X_SAP_JOB_ID = "x-sap-job-id";
    public static final String X_SAP_JOB_SCHEDULE_ID = "x-sap-job-schedule-id";
    public static final String X_SAP_JOB_RUN_ID = "x-sap-job-run-id";
    public static final String X_SAP_SCHEDULER_HOST = "x-sap-scheduler-host";
    public static final String X_SAP_RUN_AT = "x-sap-run-at";
    public static final String SUB_DOMAIN = "subDomain";

    // Cache configuration constants
    // The cache interval has been decided based on the XSUAA recommnedation
    // https://github.wdf.sap.corp/CPSecurity/Knowledge-Base/blob/92294ebfdcf27c640bc623e806c5ed93af13b57a/03_ApplicationSecurity/xsuaa_recommendations.md#adopt-oauth-configuration
    public static final int CACHE_CLEAN_INTERVAL = 50 * 60 * 1000; // In Miliseconds
    public static final String MDI_OAUTH_TOKEN_CACHE_NAME = "MDIOAuthToken";
    public static final String JOB_SCHEDULER_OAUTH_TOKEN_CACHE_NAME = "JobSchedulerOAuthToken";
    public static final String SAAS_REGISTRY_OAUTH_TOKEN_CACHE_NAME = "SAASRegistryOAuthToken";
    public static final String XS_UAA_OAUTH_TOKEN_CACHE_NAME = "XSUaaOAuthToken";
    public static final String MDI_VCAP_VALUE_CACHE_NAME = "MDIVCAPValues";
    public static final String REPLICATION_ERROR_CODE_CACHE_NAME = "replicationErrorMessages";
    public static final String DESTINATION_OAUTH_TOKEN_CACHE_NAME = "destination_token";

    public static final String OAUTH = "oauth";
    public static final String TOKEN = "token";

    // MDI Logs processor
    public static final String INSTANCE = "instance";
    public static final String INSTANCE_ID = "Id";

    // Audit log constants
    public static final String CREATE_OPERATION = "created";
    public static final String UPDATE_OPERATION = "updated";
    public static final String INCLUDE_OPERATION = "included";
    public static final String DATA_SUBJECT_TYPE = "WorkforcePerson";
    public static final String SERVICE_IDENTIFIER = "WorkforcePersonIntegration";

    // Log Messages
    public static final String MDI_LOG_PROCESSOR_INIT_MESSAGE = "Processing instance record with the event={}, versionId={} and instance.id={}";

    // WF Availability Error Handler Constants
    public static final String ERROR_MSG_AVAILABILITY_INTERVAL_NULL = "Could not deserialize request payload: The property 'availabilityIntervals' must not be null.";
	public static final String ERROR_MSG_AVAILABILITY_SUPPLEMENT_NULL = "Could not deserialize request payload: The property 'availabilitySupplements' must not be null.";
	
	// Capacity cleanup constants
	public static final String CRON_JOB_PATTERN_FOR_CAPACITY_CLEANUP = "0 0 1 * * *";

    private Constants() {
    }

}
