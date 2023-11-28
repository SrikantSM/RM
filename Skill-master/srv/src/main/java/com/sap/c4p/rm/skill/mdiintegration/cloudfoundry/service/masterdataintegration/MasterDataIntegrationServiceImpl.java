package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.MasterDataIntegrationToken;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.CFUserProvidedEnvironment;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.MasterDataIntegrationVCAP;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.model.DestinationResponse;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.service.DestinationService;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayloadMessage;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationErrorCodes;
import com.sap.c4p.rm.skill.mdiintegration.processor.common.dto.ErrorResponse;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ExistingCustomerDetailDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationErrorMessagesDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import io.vavr.control.Try;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeoutException;
import java.util.function.Supplier;

@Service
public class MasterDataIntegrationServiceImpl implements MasterDataIntegrationService {
  private static final Logger LOGGER = LoggerFactory.getLogger(MasterDataIntegrationServiceImpl.class);
  private final DestinationService destinationService;
  private final CFUserProvidedEnvironment cfUserProvidedEnvironment;
  private final WebClient webClient;
  private final JobSchedulerService jobSchedulerService;
  private final ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

  private final MasterDataIntegrationToken masterDataIntegrationToken;
  private final MasterDataIntegrationVCAP masterDataIntegrationVCAP;

  private final OneMDSReplicationDeltaTokenDAO oneMdsReplicationDeltaTokenDao;

  private final ExistingCustomerDetailDAO existingCustomerDetailDAO;
  protected static final String PREFER_HEADER_KEY = "Prefer";
  protected static final String MAX_PAGE_SIZE_KEY = "odata.maxpagesize";
  protected static final Integer MAX_PAGE_SIZE = 500;
  protected static final String MDI_VERSION = "v1";
  protected static final String MDI_ODM = "odm";
  protected static final String ODM_VERSION = "5.0.0";
  protected static final String MDI_EVENTS_API = "events";
  protected static final String TIME_LIMITER_NAME = "MDITimeLimiter";
  protected static final String DELTA_TOKEN_MISMATCH_ERROR_CODE = "DeltaTokenMismatch";
  protected static final String DELTA_TOKEN_DOES_NOT_MATCH_ERROR_CODE = "DeltaTokenDoesNotMatchRequest";

  protected static final String INVALID_DELTA_TOKEN = "InvalidDeltaToken";

  @Autowired
  public MasterDataIntegrationServiceImpl(final CFUserProvidedEnvironment cfUserProvidedEnvironment,
      final JobSchedulerService jobSchedulerService,

      final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO, final WebClient webClient,
      final DestinationService destinationService, ExistingCustomerDetailDAO existingCustomerDetailDAO,
      final ReplicationErrorMessagesDAO replicationErrorMessagesDAO,
      MasterDataIntegrationToken masterDataIntegrationToken, MasterDataIntegrationVCAP masterDataIntegrationVCAP) {
    this.cfUserProvidedEnvironment = cfUserProvidedEnvironment;

    this.oneMdsReplicationDeltaTokenDao = oneMDSReplicationDeltaTokenDAO;
    this.webClient = webClient;
    this.destinationService = destinationService;
    this.existingCustomerDetailDAO = existingCustomerDetailDAO;
    this.jobSchedulerService = jobSchedulerService;
    this.replicationErrorMessagesDAO = replicationErrorMessagesDAO;
    this.masterDataIntegrationToken = masterDataIntegrationToken;
    this.masterDataIntegrationVCAP = masterDataIntegrationVCAP;
  }

  public <T> T getMDILogRecords(final Marker loggingMarker, final String subDomain, final MDIEntities entity,
      final String nextDeltaToken, final Class<T> responseType, final JobSchedulerRunHeader jobSchedulerRunHeader) {

    UriComponentsBuilder mdiURLBuilder;
    String bearerToken;
    String mdiURL;

    Boolean isExistingCustomer = existingCustomerDetailDAO.getExistingCustomerDetail();
    LOGGER.info("Is existing customer: {}", isExistingCustomer);
    if (Boolean.TRUE.equals(isExistingCustomer)) {
      mdiURLBuilder = UriComponentsBuilder.fromUriString(masterDataIntegrationVCAP.getServiceUrl())
          .pathSegment(MDI_VERSION, MDI_ODM, ODM_VERSION).pathSegment(entity.getName()).pathSegment(MDI_EVENTS_API);
      bearerToken = this.masterDataIntegrationToken.getOAuthToken(loggingMarker, masterDataIntegrationVCAP, subDomain);
    } else {
      // Connecting to the destination service to get the response
      DestinationResponse destinationResponse = this.destinationService.getDestinationDetails(loggingMarker, subDomain,
          jobSchedulerRunHeader, nextDeltaToken);
      if (destinationResponse == null)
        return null;
      mdiURLBuilder = UriComponentsBuilder.fromUriString(destinationResponse.getDestinationConfiguration().getUrl())
          .pathSegment(MDI_VERSION, MDI_ODM, ODM_VERSION).pathSegment(entity.getName()).pathSegment(MDI_EVENTS_API);

      bearerToken = destinationResponse.getAuthTokens().get(0).getValue();
    }
    if (bearerToken == null) {
      LOGGER.info("Empty bearer token for {}", entity.getName());
      return null;
    }

    if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(nextDeltaToken)))
      mdiURL = mdiURLBuilder.build().toUriString();
    else
      mdiURL = mdiURLBuilder.queryParam("$deltatoken", nextDeltaToken).build().toUriString();

    HttpHeaders requestHeaders = new HttpHeaders();
    requestHeaders.setContentType(MediaType.APPLICATION_JSON);
    requestHeaders.setBearerAuth(bearerToken);
    requestHeaders.set(PREFER_HEADER_KEY, MAX_PAGE_SIZE_KEY + "=" + MAX_PAGE_SIZE);

    HttpEntity<String> requestEntity = new HttpEntity<>(requestHeaders);

    return request(loggingMarker, mdiURL, requestEntity, responseType, subDomain, jobSchedulerRunHeader,
        nextDeltaToken);
  }

  public <T> T request(final Marker loggingMarker, final String url, final HttpEntity<String> request,
      final Class<T> responseType, final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader,
      final String nextDeltaToken) {

    TimeLimiterConfig timeLimiterConfig = TimeLimiterConfig.custom()
        .timeoutDuration(Duration.ofMillis(this.cfUserProvidedEnvironment.getMdiServiceTimeout()))
        .cancelRunningFuture(false).build();
    TimeLimiterRegistry timeLimiterRegistry = TimeLimiterRegistry.of(timeLimiterConfig);
    TimeLimiter timeLimiter = timeLimiterRegistry.timeLimiter(TIME_LIMITER_NAME);

    RetryConfig retryConfig = RetryConfig.custom()
        .maxAttempts(this.cfUserProvidedEnvironment.getMdiServiceRetryAttempt()).build();
    Retry retry = Retry.of("MasterDataIntegrationService", retryConfig);

    Supplier<CompletableFuture<ResponseEntity<T>>> futureSupplier = () -> CompletableFuture.supplyAsync(
        () -> this.webClient.get().uri(url).headers(httpHeaders -> httpHeaders.addAll(request.getHeaders())).retrieve()
            .toEntity(responseType).block());
    Callable<ResponseEntity<T>> callable = TimeLimiter.decorateFutureSupplier(timeLimiter, futureSupplier);
    callable = Retry.decorateCallable(retry, callable);
    Try<ResponseEntity<T>> responseResult = Try.ofCallable(callable)
        .recover(throwable -> fallbackForOneMDS(loggingMarker, url, throwable, subDomain, jobSchedulerRunHeader,
            nextDeltaToken));
    LOGGER.info("Response Result is {}", responseResult.get());
    ResponseEntity<T> result;
    if ((result = responseResult.get()) != null) {
      try {
        return result.getBody();
      } catch (Exception e) {
        LOGGER.error("Exception occurred while fetching MDI response: {}", e.getMessage());
        return null;
      }
    } else {
      LOGGER.error("Null Response from MDI");
      return null;
    }

  }

  private <T> ResponseEntity<T> fallbackForOneMDS(final Marker loggingMarker, final String url,
      final Throwable httpException, final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader,
      final String nextDeltaToken) {
    LOGGER.error("Fallback mechanism for OneMDS activated");
    if (httpException instanceof WebClientResponseException) {
      handleWebClientResponseException(loggingMarker, url, httpException, subDomain, jobSchedulerRunHeader,
          nextDeltaToken);
    } else if (httpException instanceof TimeoutException) {
      TimeoutException timeoutException = (TimeoutException) httpException;
      LOGGER.error(loggingMarker, "Query to get the log from oneMDS took longer than expected: {}",
          timeoutException.getMessage(), timeoutException);
      String errorMessage = StringFormatter.format(this.replicationErrorMessagesDAO.getReplicationErrorMessages()
          .get(ReplicationErrorCodes.TIMEOUT.getErrorCode()), httpException.getMessage());
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, new JobScheduleRunPayload(
          false,
          new JobScheduleRunPayloadMessage(ReplicationErrorCodes.TIMEOUT.getErrorCode(), nextDeltaToken, errorMessage)
              .toString()));
    } else {
      String errorMessage = StringFormatter.format(this.replicationErrorMessagesDAO.getReplicationErrorMessages()
          .get(ReplicationErrorCodes.UNKNOWN.getErrorCode()), httpException.getMessage());
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, new JobScheduleRunPayload(
          false,
          new JobScheduleRunPayloadMessage(ReplicationErrorCodes.UNKNOWN.getErrorCode(), nextDeltaToken, errorMessage)
              .toString()));
    }
    return null;
  }

  private void handleWebClientResponseException(Marker loggingMarker, String url, Throwable httpException,
      String subDomain, JobSchedulerRunHeader jobSchedulerRunHeader, String nextDeltaToken) {
    WebClientResponseException webClientResponseException = (WebClientResponseException) httpException;
    HttpStatus httpStatus = (HttpStatus) webClientResponseException.getStatusCode();
    String responseBody = webClientResponseException.getResponseBodyAsString();
    ErrorResponse errorResponse = new ErrorResponse();
    if (httpStatus == HttpStatus.BAD_REQUEST) {
      try {
        errorResponse = new ObjectMapper().readValue(responseBody, ErrorResponse.class);
      } catch (Exception e) {
        LOGGER.error(loggingMarker, "Parsing of the MDI response body: {} failed with the exeception: {}", responseBody,
            e.getMessage());
      }
      if (errorResponse.getError().getCode().equals(DELTA_TOKEN_MISMATCH_ERROR_CODE)
          || errorResponse.getError().getCode().equals(DELTA_TOKEN_DOES_NOT_MATCH_ERROR_CODE)
          || errorResponse.getError().getCode().equals(INVALID_DELTA_TOKEN)) {
        // Set replication job for the initial load
        this.oneMdsReplicationDeltaTokenDao.markReplicationAsInitialLoadCandidate(Boolean.TRUE);
        this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
            new JobScheduleRunPayload(false,
                new JobScheduleRunPayloadMessage(ReplicationErrorCodes.DELTA_TOKEN_MISMATCH.getErrorCode(),
                    nextDeltaToken, this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                        .get(ReplicationErrorCodes.DELTA_TOKEN_MISMATCH.getErrorCode())).toString()));
      }
    } else if (httpStatus == HttpStatus.CONFLICT) {
      this.oneMdsReplicationDeltaTokenDao.markReplicationAsInitialLoadCandidate(Boolean.TRUE);
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
          new JobScheduleRunPayload(false,
              new JobScheduleRunPayloadMessage(ReplicationErrorCodes.CONFLICT.getErrorCode(), nextDeltaToken,
                  this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                      .get(ReplicationErrorCodes.CONFLICT.getErrorCode())).toString()));
    } else {
      String errorMessage = StringFormatter.format(
          this.replicationErrorMessagesDAO.getReplicationErrorMessages()
              .get(ReplicationErrorCodes.UNKNOWN.getErrorCode()),
          !responseBody.isEmpty() ? responseBody : httpException.getMessage());
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, new JobScheduleRunPayload(
          false,
          new JobScheduleRunPayloadMessage(ReplicationErrorCodes.UNKNOWN.getErrorCode(), nextDeltaToken, errorMessage)
              .toString()));
    }
    LOGGER.error(loggingMarker, "{} {} returned error code {}. Response Body: {} Message: {}", HttpMethod.GET, url,
        webClientResponseException.getRawStatusCode(), webClientResponseException.getResponseBodyAsString(),
        httpException.getMessage(), httpException);
  }
}
