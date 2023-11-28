package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service;

import static com.sap.c4p.rm.utils.Constants.JOB_RUN_STATUS_RUNNING;
import static com.sap.c4p.rm.utils.Constants.JOB_RUN_STATUS_SCHEDULED;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.cloudfoundry.authclient.JobSchedulerToken;
import com.sap.c4p.rm.cloudfoundry.environment.JobSchedulerVCAP;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRun;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRuns;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.IsNullCheckUtils;

/**
 * Class to implement {@link JobSchedulerService} provide the generic
 * functionality to communicate to cloud foundry's JobScheduler service.
 */

@Service
public class JobSchedulerServiceImpl implements JobSchedulerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(JobSchedulerServiceImpl.class);

    protected static final String KEY_PREVIOUS_RUN_RUNNING_ID = "previousRunningRunId";
    protected static final String OFFSET = "offset";
    protected static final String PAGE_SIZE = "page_size";
    protected static final String RESULTS = "results";
    protected static final String RUNS = "runs";
    protected static final String SCHEDULES = "schedules";
    protected static final String DISPLAY_SCHEDULES = "displaySchedules";
    protected static final String TRUE = "true";
    protected static final String NAME = "name";
    protected static final String SCHEDULER_JOB_PATH_SEGMENT = "scheduler/jobs";
    protected static final String KEY_TEXTS = "text";
    protected static final String KEY_TERMINATION_MESSAGE = "terminationMessage";
    protected static final String TERMINATION_MESSAGE = "The job execution has been terminated as a previous run has been detected with running status";

    private final CommonUtility commonUtility;
    private final JobSchedulerToken jobSchedulerToken;
    private final JobSchedulerVCAP jobSchedulerVCAP;
    private final WebClient webClient;
    private final UriComponentsBuilder jobSchedulerBaseUriBuilder;

    @Autowired
    public JobSchedulerServiceImpl(final CommonUtility commonUtility, final JobSchedulerToken jobSchedulerToken,
            final JobSchedulerVCAP jobSchedulerVCAP, final WebClient webClient) {
        this.commonUtility = commonUtility;
        this.jobSchedulerToken = jobSchedulerToken;
        this.jobSchedulerVCAP = jobSchedulerVCAP;
        this.webClient = webClient;
        this.jobSchedulerBaseUriBuilder = UriComponentsBuilder.fromUriString(jobSchedulerVCAP.getServiceUrl())
                .pathSegment(SCHEDULER_JOB_PATH_SEGMENT);
    }

    @Override
    public JobSchedulerInfo getJob(final Marker loggingMarker, final String subDomain, final String job) {
        String jobURL = this.jobSchedulerBaseUriBuilder.cloneBuilder().pathSegment(job).build().toString();
        ResponseEntity<JSONObject> jobResponseEntity;
        if ((jobResponseEntity = doRequest(loggingMarker, subDomain, jobURL, JSONObject.class)) == null)
            return null;
        else {
            JSONObject jobResponse;
            if ((jobResponse = jobResponseEntity.getBody()) == null || jobResponse.isEmpty()) {
                return null;
            } else {
                JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
                jobSchedulerJob.fromJson(jobResponse);
                return jobSchedulerJob;
            }
        }
    }

    @Override
    public JSONArray getJobsByTenantId(final Marker loggingMarker, final String subDomain, final String tenantId) {
        String jobURL = this.jobSchedulerBaseUriBuilder.cloneBuilder().queryParam("tenantId", tenantId).build()
                .toString();
        ResponseEntity<String> jobResponseEntity;
        if ((jobResponseEntity = doRequest(loggingMarker, subDomain, jobURL, String.class)) == null)
            return null;
        else {
            String jobResponseBody;
            if ((jobResponseBody = jobResponseEntity.getBody()) != null) {
                JSONObject jobJsonResponse = new JSONObject(jobResponseBody);
                if (jobJsonResponse.isEmpty())
                    return null;
                else {
                    JSONArray jsonArray = jobJsonResponse.getJSONArray(RESULTS);
                    if (jsonArray.isEmpty())
                        return null;
                    else
                        return jsonArray;
                }
            } else {
                return null;
            }
        }
    }

    @Override
    public String createJob(final Marker loggingMarker, final String subDomain,
            final JobSchedulerInfo jobSchedulerJob) {
        String createJobURL = this.jobSchedulerBaseUriBuilder.cloneBuilder().build().toString();
        ResponseEntity<String> jobCreateResponse;
        if ((jobCreateResponse = doRequest(loggingMarker, subDomain, createJobURL, HttpMethod.POST, String.class,
                jobSchedulerJob.toJson().toString())) == null)
            return null;
        else
            return jobCreateResponse.getBody();
    }

    @Override
    public String updateJob(final Marker loggingMarker, final String subDomain,
            final JobSchedulerInfo jobSchedulerJob) {
        String updateJobURL = this.jobSchedulerBaseUriBuilder.cloneBuilder().pathSegment(jobSchedulerJob.getName())
                .build().toString();
        ResponseEntity<String> jobUpdateResponse;
        if ((jobUpdateResponse = doRequest(loggingMarker, subDomain, updateJobURL, HttpMethod.PUT, String.class,
                jobSchedulerJob.toJson().toString())) == null)
            return null;
        else
            return jobUpdateResponse.getBody();
    }

    @Override
    public void updateJobRun(final Marker loggingMarker, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader, final JobScheduleRunPayload jobScheduleRunPayload) {
        String jobId = jobSchedulerRunHeader.getJobId();
        String schedulerId = jobSchedulerRunHeader.getSchedulerId();
        String runId = jobSchedulerRunHeader.getRunId();
        String updateJobRunUrl = this.jobSchedulerBaseUriBuilder.cloneBuilder()
                .pathSegment(jobId, SCHEDULES, schedulerId, RUNS, runId).build().toUriString();
        if (IsNullCheckUtils.isNullOrEmpty(doRequest(loggingMarker, subDomain, updateJobRunUrl, HttpMethod.PUT,
                String.class, jobScheduleRunPayload.toJson().toString()))) {
            LOGGER.error(loggingMarker,
                    "Job Run update has failed (jobId: {}, schedulerId: {}, runId: {})has been updated.", jobId,
                    schedulerId, runId);
        }
    }

    @Override
    public boolean deactivateAllJobSchedules(final Marker loggingMarker, final String subDomain, final String jobId) {
        String deactivateAllSchedulesUrl = this.jobSchedulerBaseUriBuilder.cloneBuilder()
                .pathSegment(jobId, SCHEDULES, "activationStatus").build().toUriString();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("activationStatus", Boolean.FALSE);

        ResponseEntity<JSONObject> response;
        if ((response = doRequest(loggingMarker, subDomain, deactivateAllSchedulesUrl, HttpMethod.POST,
                JSONObject.class, jsonObject.toString())) != null) {

            return response.getStatusCodeValue() == 200;
        } else
            return false;
    }

    @Override
    @Async
    public CompletableFuture<List<JobSchedulerSchedule>> getJobSchedulesByName(final Marker loggingMarker,
            final String subDomain, final String jobName) {
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add(NAME, jobName);
        queryParams.add(DISPLAY_SCHEDULES, TRUE);
        String getJobScheduleRunsUrl = this.jobSchedulerBaseUriBuilder.cloneBuilder().pathSegment()
                .queryParams(queryParams).build().toUriString();
        ResponseEntity<String> jobSchedulerSchedulesResponse;
        if ((jobSchedulerSchedulesResponse = doRequest(loggingMarker, subDomain, getJobScheduleRunsUrl,
                String.class)) == null)
            return CompletableFuture.completedFuture(Collections.emptyList());
        else {
            String jobResponseBody;
            if (((jobResponseBody = jobSchedulerSchedulesResponse.getBody()) == null) || jobResponseBody.isEmpty()) {
                return CompletableFuture.completedFuture(Collections.emptyList());
            } else {
                JSONObject responseJsonObject = new JSONObject(jobResponseBody);
                JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
                jobSchedulerJob.fromJson(responseJsonObject);
                List<JobSchedulerSchedule> jobSchedulerSchedules = jobSchedulerJob.getSchedules();
                jobSchedulerSchedules.forEach(schedule -> schedule.setJobId(String.valueOf(jobSchedulerJob.getId())));
                if (jobSchedulerSchedules.isEmpty())
                    return CompletableFuture.completedFuture(Collections.emptyList());
                else
                    return CompletableFuture.completedFuture(jobSchedulerSchedules);
            }
        }
    }

    @Override
    public JobSchedulerSchedule getJobSchedule(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId) {
        String getJobScheduleRunsUrl = this.jobSchedulerBaseUriBuilder.cloneBuilder()
                .pathSegment(jobId, SCHEDULES, scheduleId).build().toUriString();
        ResponseEntity<String> jobSchedulerSchedulesResponse;
        if ((jobSchedulerSchedulesResponse = doRequest(loggingMarker, subDomain, getJobScheduleRunsUrl,
                String.class)) == null) {
            return null;
        } else {
            return (returnJobSchedule(jobSchedulerSchedulesResponse, jobId));
        }
    }

    @Override
    public JobSchedulerSchedule updateJobSchedule(final Marker loggingMarker, final String subDomain,
            final String jobId, final String scheduleId, final JobSchedulerSchedule jobSchedulerSchedule) {
        String getJobScheduleRunsUrl = this.jobSchedulerBaseUriBuilder.cloneBuilder()
                .pathSegment(jobId, SCHEDULES, scheduleId).build().toUriString();
        ResponseEntity<String> jobSchedulerSchedulesResponse;
        if ((jobSchedulerSchedulesResponse = doRequest(loggingMarker, subDomain, getJobScheduleRunsUrl, HttpMethod.PUT,
                String.class, jobSchedulerSchedule.toJson().toString())) == null) {
            return null;
        } else {
            return (returnJobSchedule(jobSchedulerSchedulesResponse, jobId));
        }
    }

    private JobSchedulerSchedule returnJobSchedule(ResponseEntity<String> jobSchedulerSchedulesResponse,
            final String jobId) {
        String jobResponseBody;
        if (((jobResponseBody = jobSchedulerSchedulesResponse.getBody()) != null) && !jobResponseBody.isEmpty()) {
            JobSchedulerSchedule schedule = new JobSchedulerSchedule();
            schedule.fromJson(new JSONObject(jobResponseBody));
            schedule.setJobId(jobId);
            return schedule;
        } else {
            return null;
        }
    }

    @Override
    public JobSchedulerRuns getJobScheduleRuns(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId) {
        return getJobScheduleRuns(loggingMarker, subDomain, jobId, scheduleId, 0, 0);
    }

    @Override
    public JobSchedulerRuns getJobScheduleRuns(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId, final int pageSize, final int offset) {
        UriComponentsBuilder getJobScheduleRunsBaseUrl = this.jobSchedulerBaseUriBuilder.cloneBuilder()
                .pathSegment(jobId, SCHEDULES, scheduleId, RUNS);

        if (pageSize > 0)
            getJobScheduleRunsBaseUrl.queryParam(PAGE_SIZE, pageSize);
        if (offset > 0)
            getJobScheduleRunsBaseUrl.queryParam(OFFSET, offset);
        String getJobScheduleRunsUrl = getJobScheduleRunsBaseUrl.build().toUriString();
        ResponseEntity<JobSchedulerRuns> previousJobRunResponse;
        if ((previousJobRunResponse = doRequest(loggingMarker, subDomain, getJobScheduleRunsUrl,
                JobSchedulerRuns.class)) == null)
            return null;
        else {
            JobSchedulerRuns jobSchedulerRuns;
            if ((jobSchedulerRuns = previousJobRunResponse.getBody()) == null)
                return null;
            else
                return jobSchedulerRuns;
        }
    }

    @Override
    public JobSchedulerRun getJobRun(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId, final String runId) {
        String jobUrl = this.jobSchedulerBaseUriBuilder.cloneBuilder()
                .pathSegment(jobId, SCHEDULES, scheduleId, RUNS, runId).build().toUriString();
        ResponseEntity<JobSchedulerRun> jobSchedulerRunResponseEntity;
        if ((jobSchedulerRunResponseEntity = doRequest(loggingMarker, subDomain, jobUrl,
                JobSchedulerRun.class)) == null)
            return null;
        else {
            JobSchedulerRun jobSchedulerRun;
            if ((jobSchedulerRun = jobSchedulerRunResponseEntity.getBody()) == null)
                return null;
            else
                return jobSchedulerRun;
        }
    }

    @Override
    public boolean ifPreviousRunComplete(final Marker loggingMarker, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
        String jobId = jobSchedulerRunHeader.getJobId();
        String scheduleId = jobSchedulerRunHeader.getSchedulerId();
        JobSchedulerRuns lastExecutedJobScheduleRuns;
        if ((lastExecutedJobScheduleRuns = getJobScheduleRuns(loggingMarker, subDomain, jobId, scheduleId, 3,
                0)) != null) {
            long totalResults = lastExecutedJobScheduleRuns.getTotal();
            List<JobSchedulerRun> allRunResults = lastExecutedJobScheduleRuns.getResults();
            if (allRunResults == null || allRunResults.isEmpty() || totalResults < 2)
                return true;
            JobSchedulerRun firstRunResult = allRunResults.get(0);
            if (JOB_RUN_STATUS_RUNNING.equals(firstRunResult.getRunStatus())) {
                return checkIfRunNotRunning(loggingMarker, subDomain, jobSchedulerRunHeader, allRunResults.get(1));
            }
            if (totalResults > 2 && JOB_RUN_STATUS_SCHEDULED.equals(firstRunResult.getRunStatus())) {
                return checkIfRunNotRunning(loggingMarker, subDomain, jobSchedulerRunHeader, allRunResults.get(2));
            }
        }
        return true;
    }

    private boolean checkIfRunNotRunning(final Marker loggingMarker, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader, final JobSchedulerRun jobSchedulerRun) {
        if (JOB_RUN_STATUS_RUNNING.equals(jobSchedulerRun.getRunStatus())) {
            JSONObject runTextObject = new JSONObject();
            runTextObject.put(KEY_PREVIOUS_RUN_RUNNING_ID, jobSchedulerRun.getRunId());
            runTextObject.put(KEY_TERMINATION_MESSAGE, TERMINATION_MESSAGE);
            JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(true, runTextObject.toString());
            updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
            return false;
        }
        String jobId = jobSchedulerRunHeader.getJobId();
        String scheduleId = jobSchedulerRunHeader.getSchedulerId();
        String runText = jobSchedulerRun.getRunText();
        String previousRunId = null;
        JobSchedulerRun previousJobSchedulerRun = null;
        if (runText != null) {
            JSONArray parsedRunTextArray = new JSONArray(runText);
            for (int i = 0; i < parsedRunTextArray.length(); i++) {
                JSONObject parsedRunText = parsedRunTextArray.getJSONObject(i);
                if (parsedRunText.has(KEY_TEXTS)) {
                    String textString = parsedRunText.getString(KEY_TEXTS);
                    if (textString.contains(KEY_PREVIOUS_RUN_RUNNING_ID)
                            && this.commonUtility.isValidJson(textString)) {
                        JSONObject textJSON = new JSONObject(textString);
                        previousRunId = textJSON.getString(KEY_PREVIOUS_RUN_RUNNING_ID);
                        break;
                    }
                }
            }
        }

        if (previousRunId != null)
            previousJobSchedulerRun = getJobRun(loggingMarker, subDomain, jobId, scheduleId, previousRunId);

        if (previousJobSchedulerRun != null && JOB_RUN_STATUS_RUNNING.equals(previousJobSchedulerRun.getRunStatus())) {
            JSONObject runTextObject = new JSONObject();
            runTextObject.put(KEY_PREVIOUS_RUN_RUNNING_ID, previousRunId);
            runTextObject.put(KEY_TERMINATION_MESSAGE, TERMINATION_MESSAGE);
            JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(true, runTextObject.toString());
            updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
            return false;
        }
        return true;
    }

    private <T> ResponseEntity<T> doRequest(final Marker loggingMarker, final String subDomain, final String url,
            final Class<T> responseType) {
        return doRequest(loggingMarker, subDomain, url, HttpMethod.GET, responseType, null);
    }

    private <T> ResponseEntity<T> doRequest(final Marker loggingMarker, final String subDomain, final String url,
            final HttpMethod httpMethod, final Class<T> responseType, final String payload) {
        String bearerToken = this.jobSchedulerToken.getOAuthToken(loggingMarker, this.jobSchedulerVCAP, subDomain);
        if (bearerToken == null)
            return null;

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.setBearerAuth(bearerToken);

        HttpEntity<String> requestEntity;

        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(payload)))
            requestEntity = new HttpEntity<>(requestHeaders);
        else
            requestEntity = new HttpEntity<>(payload, requestHeaders);

        return request(loggingMarker, url, httpMethod, requestEntity, responseType);
    }

    private <T> ResponseEntity<T> request(final Marker loggingMarker, final String url, final HttpMethod method,
            final HttpEntity<String> request, final Class<T> responseType) {
        try {
            if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(request.getBody()))) {
                return this.webClient.method(method).uri(url)
                        .headers(httpHeaders -> httpHeaders.addAll(request.getHeaders())).retrieve()
                        .toEntity(responseType).block();
            } else
                return this.webClient.method(method).uri(url)
                        .headers(httpHeaders -> httpHeaders.addAll(request.getHeaders())).bodyValue(request.getBody())
                        .retrieve().toEntity(responseType).block();
        } catch (WebClientResponseException webClientResponseException) {
            LOGGER.error(loggingMarker, "{} {} returned error code {}. Response Body: {} Message: {}", method, url,
                    webClientResponseException.getRawStatusCode(), webClientResponseException.getResponseBodyAsString(),
                    webClientResponseException.getMessage(), webClientResponseException);
            return null;
        }
    }

}
