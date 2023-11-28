package com.sap.c4p.rm.consultantprofile.assignmentservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.convert.support.GenericConversionService;

import myassignmentsservice.Result;

public class PostWeeklyAssignmentsConverterTest {
	private static final String DUMMY_ID = "dummyId";
	private static final String DUMMY_REQUEST_ID = "dummyRequestId";
	private static final String DUMMY_RESOURCE_ID = "dummyResourceId";
	private static final LocalDate DUMMY_START_DATE = LocalDate.of(2023, 2, 1);
	private static final LocalDate DUMMY_END_DATE = LocalDate.of(2023, 12, 30);
	private static final Double DUMMY_BOOKEDCAPACITY = 100.00;

	private static final GenericConversionService classUnderTest = new GenericConversionService();

	@BeforeAll
	public static void setUpAll() {
		classUnderTest.addConverter(new PostWeeklyAssignmentsConverter());
	}

	@Test
	@DisplayName("test convert if source is null.")
	public void testConvertIfSourceIsNull() {
		assertNull(classUnderTest.convert(null, Result.class));
	}

	@Test
	@DisplayName("test convert.")
	public void testConvert() {
		PostWeeklyAssignmentsResponse postWeeklyAssignment = new PostWeeklyAssignmentsResponse();
		postWeeklyAssignment.setID(DUMMY_ID);
		postWeeklyAssignment.setRequestID(DUMMY_REQUEST_ID);
		postWeeklyAssignment.setResourceID(DUMMY_RESOURCE_ID);
		postWeeklyAssignment.setStartDate(DUMMY_START_DATE);
		postWeeklyAssignment.setEndDate(DUMMY_END_DATE);
		postWeeklyAssignment.setBookedCapacity(DUMMY_BOOKEDCAPACITY);

		Result result = PostWeeklyAssignmentsConverterTest.classUnderTest.convert(postWeeklyAssignment, Result.class);
		assertEquals(DUMMY_ID, result.getId());
		assertEquals(DUMMY_REQUEST_ID, result.getRequestID());
		assertEquals(DUMMY_RESOURCE_ID, result.getResourceID());
		assertEquals(DUMMY_START_DATE, result.getStartDate());
		assertEquals(DUMMY_END_DATE, result.getEndDate());
		assertEquals(DUMMY_BOOKEDCAPACITY, result.getBookedCapacity());
	}

}