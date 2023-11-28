package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ExecutionException;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.assignmentservice.AssignmentApiClient;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.request.UserInfo;

import myassignmentsservice.CheckEditEnabledContext;
import myassignmentsservice.GetWeeklyAssignmentsContext;
import myassignmentsservice.PostWeeklyAssignmentsContext;
import myassignmentsservice.Result;
import myassignmentsservice.WeeklyAssignmentData;
import myassignmentsservice.WeeklyAssignmentRequest;
import myassignmentsservice.WeeklyAssignments;
import myassignmentsservice.WeeklyAssignmentsPayload;

public class MyAssignmentsServiceHandlerTest extends InitMocks {

	@Autowired
	@InjectMocks
	public MyAssignmentsServiceHandler myAssignmentServiceHandler;

	@Mock
	private HttpServletRequest mockHttpServletRequest;

	@Mock
	private AssignmentApiClient mockAssignmentApiClient;

	@Mock
	private CheckEditEnabledContext mockContext;

	@Mock
	private UserInfo mockUserInfo;

	@Mock
	private GetWeeklyAssignmentsContext mockGetWeeklyAssignmentsContext;

	@Mock
	private PostWeeklyAssignmentsContext mockPostWeeklyAssignmentsContext;

	@Mock
	private WeeklyAssignmentsPayload weeklyAssignmentsPayload;

	@Mock
	private Logger LOGGER;

	@Mock
	private Collection<WeeklyAssignmentRequest> mockWeeklyAssignmentRequest;

	private static final String DUMMY_RESOURCE_ID = "dummyResourceId";
	private static final String DUMMY_ASSIGNMENT_ID = "dummyAssignmentId";
	private static final String DUMMY_AUTHORIZATION = "dummyAuthorization";
	private static final String DUMMY_LOCALE = "dummyLocale";
	private static final String DUMMY_ID = "dummyId";
	private static final String DUMMY_REQUEST_ID = "dummyRequestId";
	private static final LocalDate DUMMY_START_DATE = LocalDate.of(2023, 2, 1);
	private static final LocalDate DUMMY_END_DATE = LocalDate.of(2023, 12, 30);
	private static final String DUMMY_CALENDAR_WEEK = "CW15";
	private static final Double DUMMY_DOUBLE_BOOKEDCAPACITY = 100.00;
	private static final Integer DUMMY_INT_BOOKEDCAPACITY = 100;

	@Test
	@DisplayName("Check if onCheckEditEnabled() returns true if have required role")
	public void onCheckEditEnabledResultIsTrue() {
		when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
		when(mockUserInfo.hasRole(anyString())).thenReturn(true);
		myAssignmentServiceHandler.onCheckEditEnabled(mockContext);
		verify(mockContext, times(1)).setResult(true);
	}

	@Test
	@DisplayName("Check if onCheckEditEnabled() returns false if don't have required role")
	public void onCheckEditEnabledResultIsFalse() {
		when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
		when(mockUserInfo.hasRole(null)).thenReturn(false);
		myAssignmentServiceHandler.onCheckEditEnabled(mockContext);
		verify(mockContext, times(1)).setResult(false);
	}

	@Test
	@DisplayName("Check if onGetWeeklyAssignments() throws service exception if resourceId is null")
	public void onGetWeeklyAssignmentsIfNullResourceId() {
		when(mockGetWeeklyAssignmentsContext.getResourceId()).thenReturn("");
		assertThrows(ServiceException.class, () -> {
			myAssignmentServiceHandler.onGetWeeklyAssignments(mockGetWeeklyAssignmentsContext);
		}, "Service Exception is thrown as resource Id is null");
	}

	@Test
	@DisplayName("Check if onGetWeeklyAssignments() throws service exception if assignmentId is null")
	public void onGetWeeklyAssignmentsIfNullAssignmentId() {
		when(mockGetWeeklyAssignmentsContext.getResourceId()).thenReturn(DUMMY_RESOURCE_ID);
		when(mockGetWeeklyAssignmentsContext.getAssignmentId()).thenReturn("");
		assertThrows(ServiceException.class, () -> {
			myAssignmentServiceHandler.onGetWeeklyAssignments(mockGetWeeklyAssignmentsContext);
		}, "Service Exception is thrown as assignment Id is null");
	}

	@Test
	@DisplayName("Check if onGetWeeklyAssignments() returns empty list if authorization is null")
	public void onGetWeeklyAssignmentsIfNullAuthorization() throws ServiceException {
		when(mockGetWeeklyAssignmentsContext.getResourceId()).thenReturn(DUMMY_RESOURCE_ID);
		when(mockGetWeeklyAssignmentsContext.getAssignmentId()).thenReturn(DUMMY_ASSIGNMENT_ID);
		when(mockHttpServletRequest.getHeader(anyString())).thenReturn("");
		List<WeeklyAssignments> list = null;
		when(mockAssignmentApiClient.getWeeklyAssignment(DUMMY_RESOURCE_ID, DUMMY_ASSIGNMENT_ID, null, DUMMY_LOCALE))
				.thenReturn(list);
		myAssignmentServiceHandler.onGetWeeklyAssignments(mockGetWeeklyAssignmentsContext);
		verify(mockGetWeeklyAssignmentsContext, times(1)).setResult(list);
	}

	@Test
	@DisplayName("Check if onGetWeeklyAssignments() returns result as list")
	public void onGetWeeklyAssignments() throws ServiceException {
		when(mockGetWeeklyAssignmentsContext.getResourceId()).thenReturn(DUMMY_RESOURCE_ID);
		when(mockGetWeeklyAssignmentsContext.getAssignmentId()).thenReturn(DUMMY_ASSIGNMENT_ID);
		when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(DUMMY_AUTHORIZATION);
		when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(DUMMY_LOCALE);

		List<WeeklyAssignments> weeklyAssignmentsList = new ArrayList<>();
		WeeklyAssignments weeklyAssignments = WeeklyAssignments.create();
		weeklyAssignments.setBookedCapacity(DUMMY_DOUBLE_BOOKEDCAPACITY);
		weeklyAssignments.setEndDate(DUMMY_END_DATE);
		weeklyAssignments.setId(DUMMY_ID);
		weeklyAssignments.setRequestID(DUMMY_REQUEST_ID);
		weeklyAssignments.setResourceID(DUMMY_RESOURCE_ID);
		weeklyAssignments.setStartDate(DUMMY_START_DATE);

		List<WeeklyAssignmentData> list = new ArrayList<>();
		WeeklyAssignmentData data = WeeklyAssignmentData.create();
		data.setAssignmentID(DUMMY_ASSIGNMENT_ID);
		data.setBookedCapacity(DUMMY_INT_BOOKEDCAPACITY);
		data.setCalendarWeek(DUMMY_CALENDAR_WEEK);
		data.setStartDate(DUMMY_START_DATE);
		list.add(data);
		weeklyAssignments.setWeeklyAssignmentDistribution(list);
		weeklyAssignmentsList.add(weeklyAssignments);

		when(mockAssignmentApiClient.getWeeklyAssignment(DUMMY_RESOURCE_ID, DUMMY_ASSIGNMENT_ID, DUMMY_AUTHORIZATION, DUMMY_LOCALE))
				.thenReturn(weeklyAssignmentsList);
		myAssignmentServiceHandler.onGetWeeklyAssignments(mockGetWeeklyAssignmentsContext);
		verify(mockGetWeeklyAssignmentsContext, times(1)).setResult(weeklyAssignmentsList);
	}

	@Test
	@DisplayName("Check if onPostWeeklyAssignments() throws service exception if assignmentId is null")
	public void onPostWeeklyAssignmentsIfNullAssignmentId() {
		when(mockPostWeeklyAssignmentsContext.getRequestPayload()).thenReturn(weeklyAssignmentsPayload);
		when(weeklyAssignmentsPayload.getAssignmentId()).thenReturn("");
		assertThrows(ServiceException.class, () -> {
			myAssignmentServiceHandler.onPostWeeklyAssignments(mockPostWeeklyAssignmentsContext);
		}, "Service Exception is thrown as assignment Id is null");
	}

	@Test
	@DisplayName("Check if onPostWeeklyAssignments() returns empty result if authorization is null")
	public void onPostWeeklyAssignmentsIfNullAuthorization()
			throws InterruptedException, ExecutionException {
		when(mockPostWeeklyAssignmentsContext.getRequestPayload()).thenReturn(weeklyAssignmentsPayload);
		when(weeklyAssignmentsPayload.getAssignmentId()).thenReturn(DUMMY_ASSIGNMENT_ID);
		when(mockHttpServletRequest.getHeader(anyString())).thenReturn("");
		Result result = null;
		when(mockAssignmentApiClient.postWeeklyAssignments(DUMMY_ASSIGNMENT_ID, mockWeeklyAssignmentRequest, null, DUMMY_LOCALE))
				.thenReturn(result);
		myAssignmentServiceHandler.onPostWeeklyAssignments(mockPostWeeklyAssignmentsContext);
		verify(mockPostWeeklyAssignmentsContext, times(1)).setResult(result);
	}
}
