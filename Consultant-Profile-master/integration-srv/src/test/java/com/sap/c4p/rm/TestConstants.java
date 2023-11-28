package com.sap.c4p.rm;

import java.time.Instant;
import java.util.UUID;

public class TestConstants {

    public static final String BEARER_TOKEN = "bearerToken";
    public static final String DUMMY_APPLICATION_URL = "dummyApplicationUrl.com";
    public static final String DUMMY_SKILLS_URL = "dummySkillsUrl.com";
    public static final String HTTP_ERROR_RESPONSE_BODY = "Error Response Body";
    public static final String IDENTITY_ZONE = "identityzone";
    public static final String SOMETHING_WENT_WRONG = "SOMETHING_WENT_WRONG";
    public static final String CONSUMER_SUB_DOMAIN = "consumer-subdomain";
    public static final String X_SAP_JOB_ID = "x-sap-job-id";
    public static final String SCHEDULES = "schedules";
    public static final String X_SAP_JOB_SCHEDULE_ID = "x-sap-job-schedule-id";
    public static final String RUNS = "runs";
    public static final String X_SAP_JOB_RUN_ID = "x-sap-job-run-id";
    public static final String X_SAP_SCHEDULER_HOST = "x-sap-scheduler-host";
    public static final String X_SAP_RUN_AT = "x-sap-run-at";
    public static final String PAGE_SIZE = "page_size";
    public static final String LIMIT_HINT = "limitHint";
    public static final String SINCE = "since";
    public static final String SCHEDULER_JOB_PATH_SEGMENT = "scheduler/jobs";
    public static final String UNKNOWN_EXCEPTION = "Unknown Exception";
    public static final String DESTINATION_NOT_FOUND = "Destination Not Found";

    public static final String CREATED_EVENT = "created";
    public static final String UPDATED_EVENT = "updated";
    public static final String INCLUDED_EVENT = "included";
    public static final String EXCLUDED_EVENT = "excluded";
    public static final String OTHER_EVENT = "otherEvent";
    public static final String MDI_WORK_ASSIGNMENT_ID = "mdiWorkAssignmentId";
    public static final String MDI_WORK_ASSIGNMENT_ID_2 = "mdiWorkAssignmentId2";
    public static final String VALID_FROM_DATE = "2020-01-01";
    public static final String VALID_TO_DATE = "2025-01-31";
    public static final String VERSION_ID = UUID.randomUUID().toString();
    public static final String INSTANCE_ID = UUID.randomUUID().toString();
    public static final String EXTERNAL_ID = UUID.randomUUID().toString();
    public static final String BUSINESS_USAGE_CODE = "B";
    public static final String ACCESS_TOKEN = "access_token";
    public static final String PHONE_NUMBER = "123456";
    public static final String MODIFIED_BY = "System User";
    public static final Instant MODIFIED_AT = Instant.now();

    public static final String CONSUMER_DUMMY_OAUTH_TOKEN = "https://" + CONSUMER_SUB_DOMAIN
            + ".authentication.dummyService.com/oauth/token";
    public static final String ONE_MDS_DUMMY_SERVICE_URL = "https://one-mds.dummyServiceURL.com/";
    public static final String JOB_SCHEDULER_DUMMY_SERVICE_URL = "https://job-scheduler.dummyServiceURL.com/";
    public static final String SAAS_REGISTRY_DUMMY_SERVICE_URL = "https://saas-registry.dummyServiceURL.com/";
    public static final String AUTH_URL = "https://" + CONSUMER_SUB_DOMAIN + ".authentication.dummyService.com/";
    public static final String APPLICATION_USER = "authenticated-user@sap.com";
    public static final String APPLICATION_PASSWORD = "pass";
    public static final int LIMIT_HINT_VALUE = 500;
    public static final String DESTINATION_DUMMY_SERVICE_URL = "https://destination-configuration.dummyServiceURL.com/";

    public static final String DELTA_LOAD_RESPONSE = "delta_load.json";
    public static final String EMPTY_MDI_RESPONSE = "empty_response.json";
    public static final String RE_TRIGGER_INITIAL_LOAD_RESPONSE = "re_trigger_load_response.json";
    public static final String ERROR_RESPONSE = "error-response.json";
    public static final String ERROR_RESPONSE_DELTA_TOKEN_MISMATCH = "error-response-delta-token-mismatch.json";
    public static final String ERROR_RESPONSE_DELTA_TOKEN_DOES_NOT_MATCH = "error-response-delta-token-does-not-match.json";

    public static final String INITIAL_LOAD_RESPONSE = "initial_load.json";
    public static final String JOB_SCHEDULER_PREVIOUS_RUN_FOUND = "JobScheduler/dummy_job_scheduler_previous_run_found.json";
    public static final String JOB_SCHEDULER_PREVIOUS_RUN_NOT_FOUND = "JobScheduler/dummy_job_scheduler_previous_run_not_found.json";
    public static final String DESTINATION_RESPONSE = "destination_response_with_oauth_token.json";
    public static final String EMPTY_DESTINATION_RESPONSE = "empty_destination_response.json";

    public static final String DATA_SUBJECT_TYPE = "WorkforcePerson";
    public static final String CREATE_OPERATION = "created";
    public static final String UPDATE_OPERATION = "updated";
    public static final String INCLUDE_OPERATION = "included";
    public static final String SERVICE_IDENTIFIER = "WorkforcePersonIntegration";

    public static final Integer SLEEP_TIMEOUT = 2500;

    private TestConstants() {
    }

}
