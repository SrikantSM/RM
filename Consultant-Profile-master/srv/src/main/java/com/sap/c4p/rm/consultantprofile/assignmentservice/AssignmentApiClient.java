package com.sap.c4p.rm.consultantprofile.assignmentservice;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Duration;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeoutException;
import java.util.function.Supplier;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.hcp.cf.logging.common.LogContext;

import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import io.vavr.control.Try;
import myassignmentsservice.PrepareAssignmentRequestPayload;
import myassignmentsservice.Result;
import myassignmentsservice.WeeklyAssignmentRequest;
import myassignmentsservice.WeeklyAssignments;

@Component
public class AssignmentApiClient {
	private AssignmentServiceUrl assignmentServiceUrl;
	private PostWeeklyAssignmentsConverter postWeeklyAssignmentsConverter;

	private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentApiClient.class);
	private static final Marker GET_ASSIGNMENT_MARKER = LoggingMarker.GET_ASSIGNMENT.getMarker();
	private static final Marker UPDATE_ASSIGNMENT_MARKER = LoggingMarker.UPDATE_ASSIGNMENT.getMarker();
	private static final String EXCEPTION_STRING = "Exception: {}";
	private static final String EXCEPTION_PATH_WRONG = "Error: path is wrong: {}";
	private static final String ASSIGNMENTS = "/Assignments";
	private static final String RESOURCE_FILTER = "?$filter=resourceID%20eq%20";
	private static final String ASSIGNMENT_FILTER = "%20and%20ID%20eq%20";
	private static final String ODATA_V4_ASSIGNMENT_SERVICE = "/odata/v4/ConsultantAssignmentService";
	private static final String ASSIGNMENT_WEEKLY_DISTRIBUTION = "&$expand=_weeklyAssignmentDistribution";

	private static final String X_CORRELATION_ID = "X-CorrelationID";
	private final WebClient webClient;
	private final Environment environment;
	private Integer assignmentServiceTimeout;
	private Integer assignmentServiceRetryAttempt;

	protected static final String TIME_LIMITER_NAME = "AssignmentServiceTimeLimiter";
	protected static final String ASSIGNMENT_GET_SERVICE_TIMEOUT = "ASSIGNMENT_GET_SERVICE_TIMEOUT";
	protected static final String ASSIGNMENT_UPDATE_SERVICE_TIMEOUT = "ASSIGNMENT_UPDATE_SERVICE_TIMEOUT";
	protected static final String ASSIGNMENT_SERVICE_RETRY_ATTEMPT = "ASSIGNMENT_SERVICE_RETRY_ATTEMPT";
	protected static final Integer DEFAULT_ASSIGNMENT_GET_SERVICE_TIMEOUT = 1000; // In Miliseconds
	protected static final Integer DEFAULT_ASSIGNMENT_UPDATE_SERVICE_TIMEOUT = 3000; // In Miliseconds
	protected static final Integer DEFAULT_ASSIGNMENT_SERVICE_RETRY_ATTEMPT = 2;

	@Autowired
	public AssignmentApiClient(final AssignmentServiceUrl assignmentServiceUrl,
			final PostWeeklyAssignmentsConverter postWeeklyAssignmentsConverter, final WebClient webClient,
			final Environment environment) {
		this.assignmentServiceUrl = assignmentServiceUrl;
		this.postWeeklyAssignmentsConverter = postWeeklyAssignmentsConverter;
		this.assignmentServiceUrl.setUrl(this.assignmentServiceUrl.getAssignmentServiceUrl());
		this.webClient = webClient;
		this.environment = environment;
	}

	// To get assignment service URL
	private String getUriStringForGivenPath(String path) {
		return assignmentServiceUrl.getUrl() + path;
	}

	// To form URI
	private URI getURIObjectFromURIString(String uriString, Marker marker, String path) {
		URI uri;
		try {
			uri = new URI(uriString);
			LOGGER.info(marker, "URI: {} ", uri);
		} catch (URISyntaxException | NullPointerException e) {
			LOGGER.error(marker, EXCEPTION_STRING, e);
			LOGGER.error(marker, EXCEPTION_PATH_WRONG, path);
			throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.INCORRECT_ASSIGNMENT_ACTION_URI);
		}
		return uri;
	}

	@SuppressWarnings("unchecked")
	/**
	 * This event calls the assignment domain's ConsultantAssignmentService to get
	 * weekly assignment data for the assignment requested by the resource.
	 * 
	 * This event returns the list of type WeeklyAssignments.
	 */
	public List<WeeklyAssignments> getWeeklyAssignment(String resourceID, String assignmentId, String authBearerToken,
			String locale) throws ServiceException {
		List<WeeklyAssignments> lstAssignments = null;
		@SuppressWarnings("rawtypes")
		ResponseEntity<HashMap> responseEntity;
		LOGGER.info(GET_ASSIGNMENT_MARKER, "Entered method getAssignment of AssigmentApiClient");

		String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENTS + RESOURCE_FILTER + resourceID + ASSIGNMENT_FILTER
				+ assignmentId + ASSIGNMENT_WEEKLY_DISTRIBUTION;
		String uriString = getUriStringForGivenPath(path);
		URI uri = getURIObjectFromURIString(uriString, GET_ASSIGNMENT_MARKER, path);

		if ((responseEntity = doRequest(GET_ASSIGNMENT_MARKER, uri, HashMap.class, authBearerToken, locale,
				path)) != null) {
			if (responseEntity.getBody() != null) {
				List<WeeklyAssignments> value = (java.util.ArrayList<WeeklyAssignments>) responseEntity.getBody()
						.get("value");
				lstAssignments = value;
				return lstAssignments;
			} else
				return lstAssignments;
		} else {
			return lstAssignments;
		}
	}

	/**
	 * This event calls the assignment domain's ConsultantAssignmentService to
	 * update weekly assignment data for the assignment modified by the resource.
	 * 
	 * This event returns the response of type Result.
	 */
	public Result postWeeklyAssignments(String assignmentId,
			Collection<WeeklyAssignmentRequest> weeklyAssignmentRequest, String authBearerToken, String locale)
			throws ServiceException {
		Result result = null;
		ResponseEntity<PostWeeklyAssignmentsResponse> responseEntity;
		LOGGER.info(UPDATE_ASSIGNMENT_MARKER, "Entered method updateAssignment of class AssignmentApiClient class");

		PrepareAssignmentRequestPayload assignmentRequest = PrepareAssignmentRequestPayload.create();
		assignmentRequest.setWeeklyAssignmentDistribution(weeklyAssignmentRequest);

		String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENTS + "(" + assignmentId + ")";
		String uriString = getUriStringForGivenPath(path);
		URI uri = getURIObjectFromURIString(uriString, UPDATE_ASSIGNMENT_MARKER, path);

		if ((responseEntity = doRequest(UPDATE_ASSIGNMENT_MARKER, uri, HttpMethod.PATCH,
				PostWeeklyAssignmentsResponse.class, assignmentRequest, authBearerToken, locale, path)) != null) {
			if ((responseEntity.getBody()) != null) {
				result = postWeeklyAssignmentsConverter.convert(responseEntity.getBody());
				return result;
			} else
				return result;
		} else {
			return result;
		}
	}

	private <T> ResponseEntity<T> doRequest(final Marker loggingMarker, final URI uri, final Class<T> responseType,
			final String authBearerToken, final String locale, final String path) throws ServiceException {
		return doRequest(loggingMarker, uri, HttpMethod.GET, responseType, null, authBearerToken, locale, path);
	}

	private <T> ResponseEntity<T> doRequest(final Marker loggingMarker, final URI url, final HttpMethod httpMethod,
			final Class<T> responseType, final PrepareAssignmentRequestPayload payload, final String authBearerToken,
			final String locale, final String path) throws ServiceException {

		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
		requestHeaders.set(HttpHeaders.AUTHORIZATION, authBearerToken);
		requestHeaders.set(HttpHeaders.ACCEPT_LANGUAGE, locale);
		String correlationId = LogContext.getCorrelationId();
		requestHeaders.add(X_CORRELATION_ID, correlationId);
		HttpEntity<String> requestEntity;
		requestEntity = new HttpEntity<>(requestHeaders);

		return request(loggingMarker, url, httpMethod, requestEntity, responseType, payload, path);
	}

	private <T> ResponseEntity<T> request(final Marker loggingMarker, final URI url, final HttpMethod method,
			final HttpEntity<String> request, final Class<T> responseType,
			final PrepareAssignmentRequestPayload payload, final String path) throws ServiceException {
		Supplier<CompletableFuture<ResponseEntity<T>>> responseEntity = null;
		getTimeoutExceptionParams(method);

		TimeLimiterConfig timeLimiterConfig = TimeLimiterConfig.custom()
				.timeoutDuration(Duration.ofMillis(this.assignmentServiceTimeout)).cancelRunningFuture(false).build();
		TimeLimiterRegistry timeLimiterRegistry = TimeLimiterRegistry.of(timeLimiterConfig);
		TimeLimiter timeLimiter = timeLimiterRegistry.timeLimiter(TIME_LIMITER_NAME);
		RetryConfig retryConfig = RetryConfig.custom().maxAttempts(this.assignmentServiceRetryAttempt).build();
		Retry retry = Retry.of("AssignmentService", retryConfig);

		if (method == HttpMethod.GET) {
			responseEntity = () -> CompletableFuture.supplyAsync(() -> this.webClient.method(method).uri(url)
					.headers(httpHeaders -> httpHeaders.addAll(request.getHeaders())).retrieve().toEntity(responseType)
					.block());
		}
		if (method == HttpMethod.PATCH) {
			responseEntity = () -> CompletableFuture.supplyAsync(() -> this.webClient.method(method).uri(url)
					.headers(httpHeaders -> httpHeaders.addAll(request.getHeaders())).bodyValue(payload).retrieve()
					.toEntity(responseType).block());
		}

		Callable<ResponseEntity<T>> callable = TimeLimiter.decorateFutureSupplier(timeLimiter, responseEntity);
		callable = Retry.decorateCallable(retry, callable);
		Try<ResponseEntity<T>> responseResult = Try.ofCallable(callable)
				.recover(throwable -> fallbackForAssignmentService(loggingMarker, path, method, throwable));
		return responseResult.get();
	}

	/**
	 * This event returns the timeout parameters depending on the type of service
	 * call.
	 */
	private void getTimeoutExceptionParams(final HttpMethod method) {
		Integer assignmentServiceTimeoutFromEnv;
		Integer assignmentServiceRetryAttemptFromEnv;
		if ((assignmentServiceRetryAttemptFromEnv = this.environment.getProperty(ASSIGNMENT_SERVICE_RETRY_ATTEMPT,
				Integer.class)) == null)
			assignmentServiceRetryAttemptFromEnv = DEFAULT_ASSIGNMENT_SERVICE_RETRY_ATTEMPT;
		if (method == HttpMethod.GET) {
			if ((assignmentServiceTimeoutFromEnv = this.environment.getProperty(ASSIGNMENT_GET_SERVICE_TIMEOUT,
					Integer.class)) == null)
				assignmentServiceTimeoutFromEnv = DEFAULT_ASSIGNMENT_GET_SERVICE_TIMEOUT;
		} else {
			if ((assignmentServiceTimeoutFromEnv = this.environment.getProperty(ASSIGNMENT_UPDATE_SERVICE_TIMEOUT,
					Integer.class)) == null)
				assignmentServiceTimeoutFromEnv = DEFAULT_ASSIGNMENT_UPDATE_SERVICE_TIMEOUT;
		}
		this.assignmentServiceRetryAttempt = assignmentServiceRetryAttemptFromEnv;
		this.assignmentServiceTimeout = assignmentServiceTimeoutFromEnv;
	}

	/**
	 * This event returns the error if service call fails or crosses the max time
	 * limit.
	 */
	private <T> ResponseEntity<T> fallbackForAssignmentService(final Marker loggingMarker, final String url,
			final HttpMethod method, final Throwable httpException) throws ServiceException {
		if (httpException instanceof WebClientResponseException) {
			handleWebClientResponseException(loggingMarker, url, httpException);
		}
		if (httpException instanceof TimeoutException) {
			TimeoutException timeoutException = (TimeoutException) httpException;
			if (method == HttpMethod.GET) {
				LOGGER.error(loggingMarker, "Get Assignment service took longer than expected: {}",
						timeoutException.getMessage());
			} else {
				LOGGER.error(loggingMarker, "Update Assignment service took longer than expected: {}",
						timeoutException.getMessage());
			}
		}
		return null;
	}

	private void handleWebClientResponseException(final Marker loggingMarker, final String url,
			final Throwable httpException) throws ServiceException {
		WebClientResponseException webClientResponseException = (WebClientResponseException) httpException;
		Map<String, Map<String, String>> responseMap;
		int statusCode = webClientResponseException.getRawStatusCode();
		String responseBody = webClientResponseException.getResponseBodyAsString();
		// Deserialization of response body
		ObjectMapper mapper = new ObjectMapper();
		try {
			responseMap = mapper.readValue(responseBody, Map.class);
		} catch (Exception e) {
			LOGGER.error(loggingMarker, "Parsing Exception occured while retrieving error message with error code: {}.", webClientResponseException.getRawStatusCode());
			throw new ServiceException(ErrorStatuses.getByCode(statusCode), MessageKeys.ERRORMESSAGE_PARSING_EXCEPTION);
		}
		// Get the error message
		String errorMessage = responseMap.get("error").get("message");
		LOGGER.error(loggingMarker, "{} returned error code {}. Response Body: {} Message: {}", url,
				webClientResponseException.getRawStatusCode(), webClientResponseException.getResponseBodyAsString(),
				httpException.getMessage());
		// Throw ServiceException with appropriate status code and error message
		if (statusCode >= HttpStatus.BAD_REQUEST.value()) {
			throw new ServiceException(ErrorStatuses.getByCode(statusCode), errorMessage);
		}
	}
}