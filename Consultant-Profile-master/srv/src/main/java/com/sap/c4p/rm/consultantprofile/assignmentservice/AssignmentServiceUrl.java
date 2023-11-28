package com.sap.c4p.rm.consultantprofile.assignmentservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;

@Component
public class AssignmentServiceUrl {

	private String url;

	private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentServiceUrl.class);
	private static final Marker MARKER = LoggingMarker.ASSIGNMENT_SERVICE_URL.getMarker();

	// Constructor
	public AssignmentServiceUrl() {
	}

	// Overloaded constructor for mocking
	public AssignmentServiceUrl(String url) {
		this.url = url;
	}

	public synchronized String getUrl() {
		return this.url;
	}

	public synchronized void setUrl(String url) {
		this.url = url;
	}

	// Assignment Simulation
	public final String getAssignmentServiceUrl() {
		// Workaround Code to fetch Assignment Srv URL
		String environmentVariable = getEnvironmentVariable();
		String assignmentUrl = null;
		if (environmentVariable != null && !environmentVariable.isEmpty()) {
			assignmentUrl = environmentVariable;
			LOGGER.info(MARKER, "application_uris found: {}", assignmentUrl);
		} else {
			LOGGER.info(MARKER, "application_uris not found");
			// For local debugging:
			assignmentUrl = this.getUrl();
		}
		return assignmentUrl;
	}

	public String getEnvironmentVariable() {
		return System.getenv("ASSIGNMENT_URL");
	}

}