package com.sap.c4p.rm.consultantprofile.assignmentservice;

import java.io.Serializable;
import java.time.LocalDate;

// Suppressing warning: Rename the field "ID" to match the regular expression
@SuppressWarnings("squid:S116")
public class PostWeeklyAssignmentsResponse implements Serializable {
	private static final long serialVersionUID = 4032866215221311759L;
	private String ID;
	private String requestID;
	private String resourceID;
	private LocalDate startDate;
	private LocalDate endDate;
	private Double bookedCapacity;

	public String getID() {
		return ID;
	}

	public void setID(String iD) {
		ID = iD;
	}

	public String getRequestID() {
		return requestID;
	}

	public void setRequestID(String requestID) {
		this.requestID = requestID;
	}

	public String getResourceID() {
		return resourceID;
	}

	public void setResourceID(String resourceID) {
		this.resourceID = resourceID;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public Double getBookedCapacity() {
		return bookedCapacity;
	}

	public void setBookedCapacity(Double bookedCapacity) {
		this.bookedCapacity = bookedCapacity;
	}
}