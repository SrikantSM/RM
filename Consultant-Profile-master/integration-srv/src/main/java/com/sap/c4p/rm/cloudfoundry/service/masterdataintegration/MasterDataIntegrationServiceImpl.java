package com.sap.c4p.rm.cloudfoundry.service.masterdataintegration;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeoutException;
import java.util.function.Supplier;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.c4p.rm.calm.CalmConstants;
import com.sap.c4p.rm.calm.CalmService;
import com.sap.c4p.rm.cloudfoundry.authclient.MasterDataIntegrationToken;
import com.sap.c4p.rm.cloudfoundry.environment.CFUserProvidedEnvironment;
import com.sap.c4p.rm.cloudfoundry.environment.MasterDataIntegrationVCAP;
import com.sap.c4p.rm.cloudfoundry.service.destination.model.DestinationResponse;
import com.sap.c4p.rm.cloudfoundry.service.destination.service.DestinationService;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayloadMessage;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.exceptions.ReplicationErrorCodes;
import com.sap.c4p.rm.processor.common.dto.ErrorResponse;
import com.sap.c4p.rm.replicationdao.ExistingCustomerDetailDAO;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.replicationdao.ReplicationErrorMessagesDAO;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.c4p.rm.utils.StringFormatter;

import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import io.vavr.control.Try;

/**
 * Class to implement {@link MasterDataIntegrationService} provide the generic
 * functionality to communicate to cloud foundry's OneMDS/MasterData Integration
 * service.
 */
@Service
public class MasterDataIntegrationServiceImpl implements MasterDataIntegrationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(MasterDataIntegrationServiceImpl.class);

    protected static final String LIMIT_HINT = "limitHint";
    protected static final Integer LIMIT_HINT_VALUE = 500;
    protected static final String MDI_VERSION = "v0";
    protected static final String MDI_LOG_API = "log";
    protected static final String SINCE = "since";
    protected static final String TIME_LIMITER_NAME = "MDITimeLimiter";
    protected static final String DELTA_TOKEN_MISMATCH_ERROR_CODE = "DeltaTokenMismatch";
    protected static final String DELTA_TOKEN_DOES_NOT_MATCH_ERROR_CODE = "DeltaTokenDoesNotMatchRequest";

    private final CFUserProvidedEnvironment cfUserProvidedEnvironment;
    private final MasterDataIntegrationToken masterDataIntegrationToken;
    private final MasterDataIntegrationVCAP masterDataIntegrationVCAP;
    private final WebClient webClient;
    private final OneMDSReplicationDeltaTokenDAO oneMdsReplicationDeltaTokenDao;
    private final DestinationService destinationService;
    private final ExistingCustomerDetailDAO existingCustomerDetailDAO;
    private final JobSchedulerService jobSchedulerService;
    private final ReplicationErrorMessagesDAO replicationErrorMessagesDAO;
	private final CalmService calmService;

    @Autowired
    public MasterDataIntegrationServiceImpl(final MasterDataIntegrationVCAP masterDataIntegrationVCAP,
                                            final CFUserProvidedEnvironment cfUserProvidedEnvironment, final JobSchedulerService jobSchedulerService,
                                            final MasterDataIntegrationToken masterDataIntegrationToken,
                                            final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO, final WebClient webClient,
                                            final DestinationService destinationService, ExistingCustomerDetailDAO existingCustomerDetailDAO,
			final ReplicationErrorMessagesDAO replicationErrorMessagesDAO, final CalmService calmService) {
        this.cfUserProvidedEnvironment = cfUserProvidedEnvironment;
        this.masterDataIntegrationToken = masterDataIntegrationToken;
        this.masterDataIntegrationVCAP = masterDataIntegrationVCAP;
        this.oneMdsReplicationDeltaTokenDao = oneMDSReplicationDeltaTokenDAO;
        this.webClient = webClient;
        this.destinationService = destinationService;
        this.existingCustomerDetailDAO = existingCustomerDetailDAO;
        this.jobSchedulerService = jobSchedulerService;
        this.replicationErrorMessagesDAO = replicationErrorMessagesDAO;
		this.calmService = calmService;
    }

    @Override
    public <T> T getMDILogRecords(final Marker loggingMarker, final String subDomain, final MDIEntities entity,
                                  final String sinceDeltaToken, final Class<T> responseType,
                                  final JobSchedulerRunHeader jobSchedulerRunHeader) {

        UriComponentsBuilder mdiURLBuilder;
        String bearerToken;
        String mdiURL;
        Boolean isExistingCustomer = existingCustomerDetailDAO.getExistingCustomerDetail();
        LOGGER.info("Is existing customer: {}",isExistingCustomer);
        if(Boolean.TRUE.equals(isExistingCustomer)) {
            mdiURLBuilder = UriComponentsBuilder.fromUriString(masterDataIntegrationVCAP.getServiceUrl())
                .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(entity.getName()).queryParam(LIMIT_HINT, LIMIT_HINT_VALUE);
            bearerToken  = this.masterDataIntegrationToken.getOAuthToken(loggingMarker, masterDataIntegrationVCAP, subDomain);
        } else {
			DestinationResponse destinationResponse = this.destinationService.getDestinationDetails(loggingMarker,
					subDomain, jobSchedulerRunHeader, sinceDeltaToken, entity);
            if(destinationResponse == null) return null;
            LOGGER.info("MDI Base URL from Destination service is {}",destinationResponse.getDestinationConfiguration().getUrl());
            mdiURLBuilder = UriComponentsBuilder.fromUriString(destinationResponse.getDestinationConfiguration().getUrl())
                .pathSegment(MDI_VERSION, MDI_LOG_API).pathSegment(entity.getName()).queryParam(LIMIT_HINT, LIMIT_HINT_VALUE);
            bearerToken = destinationResponse.getAuthTokens().get(0).getValue();
        }
		if (bearerToken == null) {
			calmService.logReplicationFailure(Date.from(Instant.now()), entity.getShortName(), CalmConstants.HTTP_EXCEPTION_MDI_RM_CP_009_010_011);
			return null;
		}

        if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(sinceDeltaToken)))
            mdiURL = mdiURLBuilder.build().toUriString();
        else
            mdiURL = mdiURLBuilder.queryParam(SINCE, sinceDeltaToken).build().toUriString();

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.setBearerAuth(bearerToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestHeaders);

        return request(loggingMarker, mdiURL, requestEntity, responseType, subDomain, jobSchedulerRunHeader, sinceDeltaToken, entity);

    }

    public <T> T request(final Marker loggingMarker, final String url, final HttpEntity<String> request,
                         final Class<T> responseType, final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader,
                         final String sinceDeltaToken, final MDIEntities entity) {
        TimeLimiterConfig timeLimiterConfig = TimeLimiterConfig.custom()
            .timeoutDuration(Duration.ofMillis(this.cfUserProvidedEnvironment.getMdiServiceTimeout()))
            .cancelRunningFuture(false).build();
        TimeLimiterRegistry timeLimiterRegistry = TimeLimiterRegistry.of(timeLimiterConfig);
        TimeLimiter timeLimiter = timeLimiterRegistry.timeLimiter(TIME_LIMITER_NAME);

        RetryConfig retryConfig = RetryConfig.custom()
            .maxAttempts(this.cfUserProvidedEnvironment.getMdiServiceRetryAttempt()).build();
        Retry retry = Retry.of("MasterDataIntegrationService", retryConfig);

        Supplier<CompletableFuture<ResponseEntity<T>>> futureSupplier = () -> CompletableFuture.supplyAsync(
            () -> this.webClient.get().uri(url).headers(httpHeaders -> httpHeaders.addAll(request.getHeaders()))
                .retrieve().toEntity(responseType).block());
        Callable<ResponseEntity<T>> callable = TimeLimiter.decorateFutureSupplier(timeLimiter, futureSupplier);
        callable = Retry.decorateCallable(retry, callable);
        Try<ResponseEntity<T>> responseResult = Try.ofCallable(callable)
            .recover(throwable -> fallbackForOneMDS(loggingMarker, url, throwable, subDomain, jobSchedulerRunHeader, sinceDeltaToken, entity));

        ResponseEntity<T> result;
        if ((result = responseResult.get()) != null) {
            try {
                return result.getBody();
            } catch (Exception e) {
                LOGGER.error("Exception occurred while fetching MDI response: {}",e.getMessage());
                return null;
            }
        }
        else {
            LOGGER.error("Null Response from MDI");
            return null;
        }
    }

    private <T> ResponseEntity<T> fallbackForOneMDS(final Marker loggingMarker, final String url,
                                                    final Throwable httpException, final String subDomain,
                                                    final JobSchedulerRunHeader jobSchedulerRunHeader, final String sinceDeltaToken, final MDIEntities entity) {
        LOGGER.error("Fallback mechanism for OneMDS activated");
        if (httpException instanceof WebClientResponseException)
            handleWebClientResponseException(loggingMarker, url, httpException, subDomain, jobSchedulerRunHeader, sinceDeltaToken, entity);
        else if (httpException instanceof TimeoutException) {
            TimeoutException timeoutException = (TimeoutException) httpException;
            LOGGER.error(loggingMarker, "Query to get the log from oneMDS took longer than expected: {}",
                timeoutException.getMessage(), timeoutException);
            String errorMessage = StringFormatter.format(this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                    .get(ReplicationErrorCodes.TIMEOUT.getErrorCode()), httpException.getMessage());
			calmService.logReplicationFailure(Date.from(Instant.now()), entity.getShortName(), CalmConstants.HTTP_EXCEPTION_MDI_RM_CP_009_010_011);
            this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                new JobScheduleRunPayload(false,new JobScheduleRunPayloadMessage(ReplicationErrorCodes.TIMEOUT.getErrorCode(),
                    sinceDeltaToken, errorMessage).toString()));
        }
        else {
            String errorMessage = StringFormatter.format(this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                .get(ReplicationErrorCodes.UNKNOWN.getErrorCode()), httpException.getMessage());
			calmService.logReplicationFailure(Date.from(Instant.now()), entity.getShortName(), CalmConstants.HTTP_EXCEPTION_MDI_RM_CP_009_010_011);
            this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                new JobScheduleRunPayload(false,new JobScheduleRunPayloadMessage(ReplicationErrorCodes.UNKNOWN.getErrorCode(),
                    sinceDeltaToken,errorMessage).toString()));
        }
        return null;
    }

    private void handleWebClientResponseException(Marker loggingMarker, String url, Throwable httpException,
                                                  String subDomain, JobSchedulerRunHeader jobSchedulerRunHeader,
                                                  String sinceDeltaToken, final MDIEntities entity) {
        WebClientResponseException webClientResponseException = (WebClientResponseException) httpException;
        HttpStatusCode httpStatus = webClientResponseException.getStatusCode();
        String responseBody = webClientResponseException.getResponseBodyAsString();
        ErrorResponse errorResponse = new ErrorResponse();
        if(httpStatus == HttpStatus.BAD_REQUEST) {
            try {
                errorResponse = new ObjectMapper().readValue(responseBody,
                    ErrorResponse.class);
            } catch (Exception e) {
                LOGGER.error(loggingMarker, "Parsing of the MDI response body: {} failed with the exeception: {}",
                    responseBody,
                    e.getMessage());
            }
            if (errorResponse.getError().getCode().equals(DELTA_TOKEN_MISMATCH_ERROR_CODE)
                || errorResponse.getError().getCode().equals(DELTA_TOKEN_DOES_NOT_MATCH_ERROR_CODE)) {
                // Set replication job for the initial load
                this.oneMdsReplicationDeltaTokenDao.markReplicationAsInitialLoadCandidate(Boolean.TRUE);
                this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                    new JobScheduleRunPayload(false,new JobScheduleRunPayloadMessage(ReplicationErrorCodes.DELTA_TOKEN_MISMATCH.getErrorCode(),
                        sinceDeltaToken,this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                        .get(ReplicationErrorCodes.DELTA_TOKEN_MISMATCH.getErrorCode())).toString()));
            }
			calmService.logReplicationFailure(Date.from(Instant.now()), entity.getShortName(),
					CalmConstants.HTTP_EXCEPTION_MDI_RM_CP_009_010_011);
        } else if(httpStatus == HttpStatus.CONFLICT) {
            this.oneMdsReplicationDeltaTokenDao.markReplicationAsInitialLoadCandidate(Boolean.TRUE);
            this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                new JobScheduleRunPayload(false,new JobScheduleRunPayloadMessage(ReplicationErrorCodes.CONFLICT.getErrorCode(),
                    sinceDeltaToken,this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                    .get(ReplicationErrorCodes.CONFLICT.getErrorCode())).toString()));
			calmService.logReplicationFailure(Date.from(Instant.now()), entity.getShortName(),
					CalmConstants.RESET_ALL_MDI_RM_CP_007_008);

        } else {
            String errorMessage = StringFormatter.format(this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                .get(ReplicationErrorCodes.UNKNOWN.getErrorCode()), !responseBody.isEmpty()?responseBody: httpException.getMessage());
            this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                new JobScheduleRunPayload(false,new JobScheduleRunPayloadMessage(ReplicationErrorCodes.UNKNOWN.getErrorCode(),
                    sinceDeltaToken,errorMessage).toString()));
			calmService.logReplicationFailure(Date.from(Instant.now()), entity.getShortName(),
					CalmConstants.HTTP_EXCEPTION_MDI_RM_CP_009_010_011);

        }
        LOGGER.error(loggingMarker, "{} {} returned error code {}. Response Body: {} Message: {}",
            HttpMethod.GET, url, webClientResponseException.getRawStatusCode(),
            webClientResponseException.getResponseBodyAsString(), httpException.getMessage(),
            httpException);
    }
}
