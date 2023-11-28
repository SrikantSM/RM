package com.sap.c4p.rm.consultantprofile.assignmentservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import com.sap.c4p.rm.consultantprofile.InitMocks;

public class AssignmentServiceUrlTest extends InitMocks {

	private static final String DUMMY_ENV_VARIABLE = "https://c4p-rm-valiant-dev-5-assignment-srv.cfapps.sap.hana.ondemand.com";

	// Added for local url testing
	AssignmentServiceUrl assignmentServiceUrl = null;

	@Mock
	private AssignmentServiceUrl mockAssignmentServiceUrl;

	@Test
	@DisplayName("check if getAssignmentServiceUrl() returns assignmentServiceUrl if environmentVariable url is not null")
	public void validategetAssignmentServiceUrlEnvNotNull() {
		this.assignmentServiceUrl = new AssignmentServiceUrl(DUMMY_ENV_VARIABLE);
		String mockEnvironmentVariable = DUMMY_ENV_VARIABLE;
		when(mockAssignmentServiceUrl.getEnvironmentVariable()).thenReturn(mockEnvironmentVariable);
		String expectedAssignmentServiceUrl = DUMMY_ENV_VARIABLE;
		assertEquals(expectedAssignmentServiceUrl, assignmentServiceUrl.getAssignmentServiceUrl());
	}

	@Test
	@DisplayName("check if getAssignmentServiceUrl() returns assignmentServiceUrl if environmentVariable url is null")
	public void validategetAssignmentServiceUrlEnvNull() {
		this.assignmentServiceUrl = new AssignmentServiceUrl();
		String mockEnvironmentVariable = null;
		when(mockAssignmentServiceUrl.getEnvironmentVariable()).thenReturn(mockEnvironmentVariable);
		String expectedAssignmentServiceUrl = null;
		assertEquals(expectedAssignmentServiceUrl, assignmentServiceUrl.getAssignmentServiceUrl());
	}
}