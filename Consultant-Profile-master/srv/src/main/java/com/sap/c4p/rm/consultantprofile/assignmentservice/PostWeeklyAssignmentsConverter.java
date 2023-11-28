package com.sap.c4p.rm.consultantprofile.assignmentservice;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import myassignmentsservice.Result;

@Component
public class PostWeeklyAssignmentsConverter implements Converter<PostWeeklyAssignmentsResponse, Result> {

	@Override
	public Result convert(PostWeeklyAssignmentsResponse postWeeklyAssignments) {
		Result result = Result.create();
		result.setId(postWeeklyAssignments.getID());
		result.setRequestID(postWeeklyAssignments.getRequestID());
		result.setResourceID(postWeeklyAssignments.getResourceID());
		result.setStartDate(postWeeklyAssignments.getStartDate());
		result.setEndDate(postWeeklyAssignments.getEndDate());
		result.setBookedCapacity(postWeeklyAssignments.getBookedCapacity());
		return result;
	}
}
