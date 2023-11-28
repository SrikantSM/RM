package com.sap.c4p.rm.consultantprofile.assignmentservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.internal.stubbing.answers.AnswersWithDelay;
import org.mockito.internal.stubbing.answers.Returns;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.utils.StringFormatter;
import com.sap.cds.services.ServiceException;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import myassignmentsservice.PrepareAssignmentRequestPayload;
import myassignmentsservice.Result;
import myassignmentsservice.WeeklyAssignmentRequest;
import myassignmentsservice.WeeklyAssignments;
import reactor.core.publisher.Mono;

public class AssignmentApiClientTest extends InitMocks {

	private AssignmentApiClient assignmentApiClient;
	private final Logger logger = (Logger) LoggerFactory.getLogger(AssignmentApiClient.class);

	private static final String DUMMY_ID = "dummyId";
	private static final String DUMMY_REQUEST_ID = "dummyRequestId";
	private static final String DUMMY_RESOURCE_ID = "dummyResourceId";
	private static final LocalDate DUMMY_START_DATE = LocalDate.of(2023, 2, 1);
	private static final LocalDate DUMMY_END_DATE = LocalDate.of(2023, 12, 30);
	private static final Double DUMMY_DOUBLE_BOOKEDCAPACITY = 100.00;
	private static final Integer DUMMY_INT_BOOKEDCAPACITY = 100;
	private static final String DUMMY_CALENDAR_WEEK = "CW15";
	private static final String DUMMY_POST_URL = "https://c4p-rm-valiant-dev-5-assignment-srv.cfapps.sap.hana.ondemand.com/odata/v4/ConsultantAssignmentService/Assignments(assignmentId)";
	private static final String DUMMY_ASSIGNMENT_SERVICE_URL = "https://c4p-rm-valiant-dev-5-assignment-srv.cfapps.sap.hana.ondemand.com";
	private static final String DUMMY_GET_URL = "https://c4p-rm-valiant-dev-5-assignment-srv.cfapps.sap.hana.ondemand.com/odata/v4/ConsultantAssignmentService/Assignments?$filter=resourceID%20eq%20resourceId%20and%20ID%20eq%20assignmentId&$expand=_weeklyAssignmentDistribution";
	private static final String HTTP_ERROR_RESPONSE_BODY = "{\"error\": {\"message\": \"Error message\"}}";
	private static final String SOMETHING_WENT_WRONG = "SOMETHING_WENT_WRONG";
	private static final String ERROR_POST_URI = "/odata/v4/ConsultantAssignmentService/Assignments(assignmentId)";
	private static final String ERROR_GET_URI = "/odata/v4/ConsultantAssignmentService/Assignments?$filter=resourceID%20eq%20resourceId%20and%20ID%20eq%20assignmentId&$expand=_weeklyAssignmentDistribution";

	@Mock
	private AssignmentServiceUrl assignmentServiceUrl;

	@Mock
	private PostWeeklyAssignmentsConverter assignmentConverter;

	@Mock
	private WebClient.RequestBodyUriSpec requestBodyUriSpec;

	@Mock
	private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

	@Mock
	private WebClientResponseException webClientResponseException;

	@Mock
	private WebClient.RequestHeadersSpec requestHeadersSpecMock1;

	@Mock
	private WebClient.RequestHeadersSpec requestHeadersSpecMock2;

	@Mock
	private WebClient.RequestBodySpec requestBodySpec1;

	@Mock
	private WebClient.RequestBodySpec requestBodySpec2;

	@Mock
	WebClient.ResponseSpec responseSpecMock;

	@Mock
	Mono<ResponseEntity<PostWeeklyAssignmentsResponse>> responseEntityMock;

	@Mock
	Mono<ResponseEntity<HashMap>> responseEntityMock1;

	@Mock
	private WebClient webClient;

	@Mock
	private Environment env;
	
	@Mock
    private ObjectMapper objectMapper;

	private ListAppender<ILoggingEvent> listAppender;
	private Collection<WeeklyAssignmentRequest> updatedWeeklyAssignmentData;

	@BeforeEach
	private void setUp() {
		this.assignmentApiClient = new AssignmentApiClient(this.assignmentServiceUrl, this.assignmentConverter,
				this.webClient, this.env);
		this.listAppender = new ListAppender<>();
		this.listAppender.start();
		logger.addAppender(listAppender);
	}

	@Test
	@DisplayName("test when getWeeklyAssignment() returns null")
	public void getAssignmentTestWhenResponseResultIsNull() throws ServiceException {
		assertNull(assignmentApiClient.getWeeklyAssignment("resourceId", "assignmentId", "authorization", "locale"));
	}

	@Test
	@DisplayName("test when getWeeklyAssignment() returns result")
	public void getAssignmentTestWhenResponseResult() throws URISyntaxException, ServiceException {
		HashMap<String, Object> result = new HashMap<String, Object>();
		ResponseEntity<HashMap> res = new ResponseEntity<HashMap>(result, HttpStatus.OK);
		ArrayList<Object> list = new ArrayList<>();
		WeeklyAssignments weeklyAssignments = WeeklyAssignments.create();
		weeklyAssignments.setId(DUMMY_ID);
		weeklyAssignments.setBookedCapacity(DUMMY_DOUBLE_BOOKEDCAPACITY);
		weeklyAssignments.setResourceID(DUMMY_RESOURCE_ID);
		list.add(weeklyAssignments);
		result.put("value", list);
		res.getBody().putAll(result);

		URI uri = new URI(DUMMY_GET_URL);
		List<WeeklyAssignments> expectedValue = new ArrayList<WeeklyAssignments>();
		expectedValue.add(weeklyAssignments);

		when(assignmentServiceUrl.getUrl()).thenReturn(DUMMY_ASSIGNMENT_SERVICE_URL);
		when(webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(uri)).thenReturn(requestBodySpec1);
		when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
		when(requestBodySpec2.retrieve()).thenReturn(responseSpecMock);
		when(responseSpecMock.toEntity(HashMap.class)).thenReturn(responseEntityMock1);
		when(responseEntityMock1.block()).thenReturn(res);
		assertEquals(expectedValue,
				assignmentApiClient.getWeeklyAssignment("resourceId", "assignmentId", "authorization", "locale"));
	}

	@Test
	@DisplayName("test when getWeeklyAssignment() raises ServiceException.")
	void getAssignmentServiceRaisesWebClientResponseException() throws ServiceException, URISyntaxException {
		URI uri = new URI(DUMMY_GET_URL);

		when(assignmentServiceUrl.getUrl()).thenReturn(DUMMY_ASSIGNMENT_SERVICE_URL);
		when(webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(uri)).thenReturn(requestBodySpec1);
		when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
		when(requestBodySpec2.retrieve()).thenThrow(webClientResponseException);
		when(webClientResponseException.getRawStatusCode()).thenReturn(400);
		when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
		when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);
		assertThrows(ServiceException.class, ()-> assignmentApiClient.getWeeklyAssignment("resourceId", "assignmentId", "authorization", "locale"));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(3, logsList.size());
		assertEquals(StringFormatter.format("{0} returned error code {1}. Response Body: {2} Message: {3}",
				ERROR_GET_URI, 400, HTTP_ERROR_RESPONSE_BODY, SOMETHING_WENT_WRONG),
				logsList.get(2).getFormattedMessage());
	}

	@Test
	@DisplayName("test when getWeeklyAssignment() raises timeoutException.")
	void getAssignmentServiceRaisesTimeoutException() throws URISyntaxException, ServiceException {
		URI uri = new URI(DUMMY_GET_URL);

		when(assignmentServiceUrl.getUrl()).thenReturn(DUMMY_ASSIGNMENT_SERVICE_URL);
		when(webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(uri)).thenReturn(requestBodySpec1);
		when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
		when(requestBodySpec2.retrieve()).thenReturn(responseSpecMock);
		when(responseSpecMock.toEntity(HashMap.class)).thenReturn(responseEntityMock1);
		doAnswer(new AnswersWithDelay(3500, new Returns(null))).when(responseEntityMock1).block();

		assertNull(assignmentApiClient.getWeeklyAssignment("resourceId", "assignmentId", "authorization", "locale"));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(3, logsList.size());
		assertEquals(
				"Get Assignment service took longer than expected: TimeLimiter 'AssignmentServiceTimeLimiter' recorded a timeout exception.",
				logsList.get(2).getFormattedMessage());
	}

	@Test
	@DisplayName("test when postWeeklyAssignments() returns null")
	public void postAssignmentTestWhenResponseResultIsNull(){
		Collection<WeeklyAssignmentRequest> updatedWeeklyAssignmentData = new ArrayList<>();
		assertNull(assignmentApiClient.postWeeklyAssignments("assignmentId", updatedWeeklyAssignmentData,
				"authorization", "locale"));
	}

	@Test
	@DisplayName("test when postWeeklyAssignments() returns result")
	public void postAssignmentTestWhenResponseResult()
			throws URISyntaxException {
		PostWeeklyAssignmentsResponse postWeeklyAssignmentsResponse = new PostWeeklyAssignmentsResponse();
		postWeeklyAssignmentsResponse.setBookedCapacity(DUMMY_DOUBLE_BOOKEDCAPACITY);
		postWeeklyAssignmentsResponse.setEndDate(DUMMY_END_DATE);
		postWeeklyAssignmentsResponse.setID(DUMMY_ID);
		postWeeklyAssignmentsResponse.setRequestID(DUMMY_REQUEST_ID);
		postWeeklyAssignmentsResponse.setResourceID(DUMMY_RESOURCE_ID);
		postWeeklyAssignmentsResponse.setStartDate(DUMMY_START_DATE);
		ResponseEntity<PostWeeklyAssignmentsResponse> result = new ResponseEntity<>(postWeeklyAssignmentsResponse,
				HttpStatus.OK);

		Result resultData = Result.create();
		resultData.setId(DUMMY_ID);
		resultData.setRequestID(DUMMY_REQUEST_ID);
		resultData.setResourceID(DUMMY_RESOURCE_ID);
		resultData.setStartDate(DUMMY_START_DATE);
		resultData.setEndDate(DUMMY_END_DATE);
		resultData.setBookedCapacity(DUMMY_DOUBLE_BOOKEDCAPACITY);

		WeeklyAssignmentRequest weeklyAssignmentRequest = WeeklyAssignmentRequest.create();
		weeklyAssignmentRequest.setBookedCapacity(DUMMY_INT_BOOKEDCAPACITY);
		weeklyAssignmentRequest.setCalendarWeek(DUMMY_CALENDAR_WEEK);
		Collection<WeeklyAssignmentRequest> postWeeklyAssignmentData = new ArrayList<>();
		postWeeklyAssignmentData.add(weeklyAssignmentRequest);
		PrepareAssignmentRequestPayload assignmentRequest = PrepareAssignmentRequestPayload.create();
		assignmentRequest.setWeeklyAssignmentDistribution(updatedWeeklyAssignmentData);

		URI uri = new URI(DUMMY_POST_URL);

		when(assignmentServiceUrl.getUrl()).thenReturn(DUMMY_ASSIGNMENT_SERVICE_URL);
		when(webClient.method(HttpMethod.PATCH)).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(uri)).thenReturn(requestBodySpec1);
		when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
		when(requestBodySpec2.bodyValue(any())).thenReturn(requestHeadersSpecMock1);
		when(requestHeadersSpecMock1.retrieve()).thenReturn(responseSpecMock);
		when(responseSpecMock.toEntity(PostWeeklyAssignmentsResponse.class)).thenReturn(responseEntityMock);
		when(responseEntityMock.block()).thenReturn(result);
		when(assignmentConverter.convert(result.getBody())).thenReturn(resultData);
		assertEquals(resultData, assignmentApiClient.postWeeklyAssignments("assignmentId", updatedWeeklyAssignmentData,
				"authorization", "locale"));
	}
	
	@Test
	@DisplayName("test when collection for postWeeklyAssignments() is empty")
	public void postAssignmentTestWhenEmptyCollection()
			throws URISyntaxException {
		PostWeeklyAssignmentsResponse postWeeklyAssignmentsResponse = new PostWeeklyAssignmentsResponse();
		ResponseEntity<PostWeeklyAssignmentsResponse> result = new ResponseEntity<>(postWeeklyAssignmentsResponse,
				HttpStatus.OK);

		WeeklyAssignmentRequest weeklyAssignmentRequest = WeeklyAssignmentRequest.create();
		weeklyAssignmentRequest.setBookedCapacity(DUMMY_INT_BOOKEDCAPACITY);
		weeklyAssignmentRequest.setCalendarWeek(DUMMY_CALENDAR_WEEK);
		Collection<WeeklyAssignmentRequest> postWeeklyAssignmentData = new ArrayList<>();
		postWeeklyAssignmentData.add(weeklyAssignmentRequest);
		PrepareAssignmentRequestPayload assignmentRequest = PrepareAssignmentRequestPayload.create();
		assignmentRequest.setWeeklyAssignmentDistribution(updatedWeeklyAssignmentData);

		URI uri = new URI(DUMMY_POST_URL);

		when(assignmentServiceUrl.getUrl()).thenReturn(DUMMY_ASSIGNMENT_SERVICE_URL);
		when(webClient.method(HttpMethod.PATCH)).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(uri)).thenReturn(requestBodySpec1);
		when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
		when(requestBodySpec2.bodyValue(any())).thenReturn(requestHeadersSpecMock1);
		when(requestHeadersSpecMock1.retrieve()).thenReturn(responseSpecMock);
		when(responseSpecMock.toEntity(PostWeeklyAssignmentsResponse.class)).thenReturn(responseEntityMock);
		when(responseEntityMock.block()).thenReturn(result);
		assertEquals(null, assignmentApiClient.postWeeklyAssignments("assignmentId", updatedWeeklyAssignmentData,
				"authorization", "locale"));
	}

	@Test
	@DisplayName("test when postWeeklyAssignments() raises ServiceException.")
	void postAssignmentServiceRaisesWebClientResponseException() throws URISyntaxException {
		Collection<WeeklyAssignmentRequest> updatedWeeklyAssignmentData = new ArrayList<>();
		URI uri = new URI(DUMMY_POST_URL);
		when(assignmentServiceUrl.getUrl()).thenReturn(DUMMY_ASSIGNMENT_SERVICE_URL);
		when(webClient.method(HttpMethod.PATCH)).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(uri)).thenReturn(requestBodySpec1);
		when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
		when(requestBodySpec2.bodyValue(any())).thenReturn(requestHeadersSpecMock1);
		when(requestHeadersSpecMock1.retrieve()).thenThrow(webClientResponseException);
		when(webClientResponseException.getRawStatusCode()).thenReturn(400);
		when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
		when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);
		assertThrows(ServiceException.class, ()-> assignmentApiClient.postWeeklyAssignments("assignmentId", updatedWeeklyAssignmentData,
				"authorization", "locale"));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(3, logsList.size());
		assertEquals(StringFormatter.format("{0} returned error code {1}. Response Body: {2} Message: {3}",
				ERROR_POST_URI, 400, HTTP_ERROR_RESPONSE_BODY, SOMETHING_WENT_WRONG),
				logsList.get(2).getFormattedMessage());
	}

	@Test
	@DisplayName("test when postWeeklyAssignments() raises timeoutException.")
	void postAssignmentServiceRaisesTimeoutException() throws URISyntaxException {
		Collection<WeeklyAssignmentRequest> updatedWeeklyAssignmentData = new ArrayList<>();
		URI uri = new URI(DUMMY_POST_URL);

		when(assignmentServiceUrl.getUrl()).thenReturn(DUMMY_ASSIGNMENT_SERVICE_URL);
		when(webClient.method(HttpMethod.PATCH)).thenReturn(requestBodyUriSpec);
		when(requestBodyUriSpec.uri(uri)).thenReturn(requestBodySpec1);
		when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
		when(requestBodySpec2.bodyValue(any())).thenReturn(requestHeadersSpecMock1);
		when(requestHeadersSpecMock1.retrieve()).thenReturn(responseSpecMock);
		when(responseSpecMock.toEntity(PostWeeklyAssignmentsResponse.class)).thenReturn(responseEntityMock);
		doAnswer(new AnswersWithDelay(3500, new Returns(null))).when(responseEntityMock).block();

		assertNull(assignmentApiClient.postWeeklyAssignments("assignmentId", updatedWeeklyAssignmentData,
				"authorization", "locale"));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(3, logsList.size());
		assertEquals(
				"Update Assignment service took longer than expected: TimeLimiter 'AssignmentServiceTimeLimiter' recorded a timeout exception.",
				logsList.get(2).getFormattedMessage());
	}

}