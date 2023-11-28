package com.sap.c4p.rm.consultantprofile.availabilityservice.dao;

import java.util.List;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;
import com.sap.resourcemanagement.resource.Capacity;

public interface IAvailabilityDAO {

    public void saveOrUpdate(List<Capacity> capacities);

    public void deleteAllCapacities(List<Capacity> capacities);

    public void saveOrUpdateAvailabilityReplicationErrors(List<AvailabilityReplicationError> errors);

    public void updateAvailabilityReplicationSummary(List<AvailabilityReplicationSummary> availabilities);

    public List<AvailabilityReplicationView> fetchWorkAssignmentsForEmployee(String employeeId);

    public void deleteByResourceIdAndStartDate(String resourceId, String startDate);

    public void deleteByResourceId(String resourceId);

    public List<AvailabilityDownloadView> fetchWorkAssignmentsForEmployeeDownload(String employeeId);

    List<AvailabilityReplicationView> fetchAvailabilitySummary(String costcenter);

    List<AvailabilityReplicationError> fetchAvailabilityErrors(String costcenter);

    List<AvailabilityDownloadView> fetchAvailabilitySummaryDownload(String costcenter);

    Integer fetchCapacityDataCount(String resourceId, String minDate, String maxDate);

    List<AvailabilityDownloadView> fetchWorkAssignmentsDatesForResource(String resourceId);
}