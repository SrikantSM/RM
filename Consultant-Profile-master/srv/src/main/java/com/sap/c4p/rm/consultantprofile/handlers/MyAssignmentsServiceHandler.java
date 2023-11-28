package com.sap.c4p.rm.consultantprofile.handlers;

import java.util.Collection;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.apache.http.HttpHeaders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.assignmentservice.AssignmentApiClient;
import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import myassignmentsservice.CheckEditEnabledContext;
import myassignmentsservice.GetWeeklyAssignmentsContext;
import myassignmentsservice.MyAssignmentsService_;
import myassignmentsservice.PostWeeklyAssignmentsContext;
import myassignmentsservice.Result;
import myassignmentsservice.WeeklyAssignmentRequest;
import myassignmentsservice.WeeklyAssignments;

@Component
@ServiceName(MyAssignmentsService_.CDS_NAME)
public class MyAssignmentsServiceHandler implements EventHandler {

	private HttpServletRequest httpServletRequest;
	private AssignmentApiClient assignmentApiClient;
	private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentApiClient.class);
	private static final Marker GET_ASSIGNMENT_MARKER = LoggingMarker.GET_ASSIGNMENT.getMarker();
	private static final Marker UPDATE_ASSIGNMENT_MARKER = LoggingMarker.UPDATE_ASSIGNMENT.getMarker();

	@Autowired
	public MyAssignmentsServiceHandler(HttpServletRequest httpServletRequest, AssignmentApiClient assignmentApiClient) {
		this.httpServletRequest = httpServletRequest;
		this.assignmentApiClient = assignmentApiClient;
	}

	/**
	 * This event checks if the role for editing assignment is present for enabling
	 * or disabling edit action for user.
	 *
	 * @param context {@link CheckEditEnabledContext}
	 */

	@On(event = CheckEditEnabledContext.CDS_NAME)
	public void onCheckEditEnabled(final CheckEditEnabledContext context) {
		Boolean isEditable;
		if (context.getUserInfo().hasRole("MyAssignment.Edit")) {
			isEditable = true;
		} else {
			isEditable = false;
		}
		context.setResult(isEditable);
	}

	/**
	 * This event calls the assignment domain's ConsultantAssignmentService to get
	 * weekly assignment data for the assignment requested by the resource.
	 *
	 * This event returns the list of type WeeklyAssignments.
	 *
	 * @param context {@link GetWeeklyAssignmentsContext}
	 * @throws ServiceException
	 */
	@On(event = GetWeeklyAssignmentsContext.CDS_NAME)
	public void onGetWeeklyAssignments(final GetWeeklyAssignmentsContext context) throws ServiceException {
		List<WeeklyAssignments> result = null;
		String resourceId = context.getResourceId();
		String assignmentId = context.getAssignmentId();
		if (resourceId.isEmpty()) {
			LOGGER.error(GET_ASSIGNMENT_MARKER, "Unexpected error: the system could not determine resource ID");
			throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.RESOURCE_ID_NOTFOUND);
		}
		if (assignmentId.isEmpty()) {
			LOGGER.error(GET_ASSIGNMENT_MARKER, "Unexpected error: the system could not determine assignment ID");
			throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_ID_NOTFOUND);
		}
		// Get Authorization from HTTP Request Header (via HttpServletRequest)
		String authBearerToken = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
		String locale = httpServletRequest.getHeader(HttpHeaders.ACCEPT_LANGUAGE);

		if (!authBearerToken.isEmpty()) {
			result = assignmentApiClient.getWeeklyAssignment(resourceId, assignmentId, authBearerToken, locale);
		} else {
			LOGGER.error(GET_ASSIGNMENT_MARKER,
					"Unexpected error: no authorization request header found for user. Cannot call assignment-srv authenticated");
		}
		context.setResult(result);
		context.setCompleted();
	}

	/**
	 * This event calls the assignment domain's ConsultantAssignmentService to
	 * update weekly assignment data for the assignment modified by the resource.
	 *
	 * This event returns the response of type Result.
	 *
	 * @param context {@link PostWeeklyAssignmentsContext}
	 */
	@On(event = PostWeeklyAssignmentsContext.CDS_NAME)
	public void onPostWeeklyAssignments(final PostWeeklyAssignmentsContext context) throws ServiceException {
		Result result = null;
		Collection<WeeklyAssignmentRequest> weeklyAssignmentRequest = context.getRequestPayload()
				.getWeeklyAssignmentDistribution();
		String assignmentId = context.getRequestPayload().getAssignmentId();
		if (assignmentId.isEmpty()) {
			LOGGER.error(UPDATE_ASSIGNMENT_MARKER, "Unexpected error: the system could not determine assignment ID");
			throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_ID_NOTFOUND);
		}
		// Get Authorization from HTTP Request Header (via HttpServletRequest)
		String authBearerToken = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
		String locale = httpServletRequest.getHeader(HttpHeaders.ACCEPT_LANGUAGE);

		if (!authBearerToken.isEmpty()) {
				result = assignmentApiClient.postWeeklyAssignments(assignmentId, weeklyAssignmentRequest,
						authBearerToken, locale);
		} else {
			LOGGER.error(UPDATE_ASSIGNMENT_MARKER,
					"Unexpected error: no authorization request header found for user. Cannot call assignment-srv authenticated");
		}
		context.setResult(result);
		context.setCompleted();
	}
}
