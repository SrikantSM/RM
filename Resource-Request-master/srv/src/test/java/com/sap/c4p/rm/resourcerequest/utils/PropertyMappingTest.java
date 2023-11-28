package com.sap.c4p.rm.resourcerequest.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import manageresourcerequestservice.ResourceRequests;
import manageresourcerequestservice.ResourceRequests_;

public class PropertyMappingTest {

  private static PropertyMapping cut = new PropertyMapping();

  @Test
  @DisplayName("check ID for manage service")
  public void idManageService() {
    assertEquals("in/" + ResourceRequests.ID,
        cut.getTargetForServiceAndField(ResourceRequests_.CDS_NAME, Constants.PropertyNames.ID));
  }

  @Test
  @DisplayName("check ID for exposed service")
  public void idResourceRequestService() {
    assertEquals(resourcerequestservice.ResourceRequests.ID,
        cut.getTargetForServiceAndField(resourcerequestservice.ResourceRequests_.CDS_NAME, Constants.PropertyNames.ID));
  }

  @Test
  @DisplayName("check displayID for manage service")
  public void displayIDManageService() {
    assertEquals("in/" + ResourceRequests.DISPLAY_ID,
        cut.getTargetForServiceAndField(ResourceRequests_.CDS_NAME, Constants.PropertyNames.DISPLAY_ID));
  }

  @Test
  @DisplayName("check displayID for exposed service")
  public void displayIDResourceRequestService() {
    assertEquals(resourcerequestservice.ResourceRequests.DISPLAY_ID, cut.getTargetForServiceAndField(
        resourcerequestservice.ResourceRequests_.CDS_NAME, Constants.PropertyNames.DISPLAY_ID));
  }

  @Test
  @DisplayName("check startDate for manage service")
  public void startDateManageService() {
    assertEquals("in/" + ResourceRequests.START_DATE,
        cut.getTargetForServiceAndField(ResourceRequests_.CDS_NAME, Constants.PropertyNames.START_DATE));
  }

  @Test
  @DisplayName("check startDate for exposed service")
  public void startDateResourceRequestService() {
    assertEquals(resourcerequestservice.ResourceRequests.START_DATE, cut.getTargetForServiceAndField(
        resourcerequestservice.ResourceRequests_.CDS_NAME, Constants.PropertyNames.START_DATE));
  }

  @Test
  @DisplayName("check endDate for manage service")
  public void endDateManageService() {
    assertEquals("in/" + ResourceRequests.END_DATE,
        cut.getTargetForServiceAndField(ResourceRequests_.CDS_NAME, Constants.PropertyNames.END_DATE));
  }

  @Test
  @DisplayName("check endDate for exposed service")
  public void endDateResourceRequestService() {
    assertEquals(resourcerequestservice.ResourceRequests.END_DATE, cut.getTargetForServiceAndField(
        resourcerequestservice.ResourceRequests_.CDS_NAME, Constants.PropertyNames.END_DATE));
  }

  @Test
  @DisplayName("check name for manage service")
  public void nameManageService() {
    assertEquals("in/" + ResourceRequests.NAME,
        cut.getTargetForServiceAndField(ResourceRequests_.CDS_NAME, Constants.PropertyNames.NAME));
  }

  @Test
  @DisplayName("check name for exposed service")
  public void nameResourceRequestService() {
    assertEquals(resourcerequestservice.ResourceRequests.NAME, cut
        .getTargetForServiceAndField(resourcerequestservice.ResourceRequests_.CDS_NAME, Constants.PropertyNames.NAME));
  }

  @Test
  @DisplayName("check description for manage service")
  public void descriptionManageService() {
    assertEquals("in/" + ResourceRequests.DESCRIPTION,
        cut.getTargetForServiceAndField(ResourceRequests_.CDS_NAME, Constants.PropertyNames.DESCRIPTION));
  }

  @Test
  @DisplayName("check description for exposed service")
  public void descriptionResourceRequestService() {
    assertEquals(resourcerequestservice.ResourceRequests.DESCRIPTION, cut.getTargetForServiceAndField(
        resourcerequestservice.ResourceRequests_.CDS_NAME, Constants.PropertyNames.DESCRIPTION));
  }

  @Test
  @DisplayName("check requestedCapacity for manage service")
  public void requestedCapacityManageService() {
    assertEquals("in/" + ResourceRequests.REQUESTED_CAPACITY,
        cut.getTargetForServiceAndField(ResourceRequests_.CDS_NAME, Constants.PropertyNames.REQUESTED_CAPACITY));
  }

  @Test
  @DisplayName("check requiredEffort for exposed service")
  public void requiredEffortResourceRequestService() {
    assertEquals(resourcerequestservice.ResourceRequests.REQUIRED_EFFORT, cut.getTargetForServiceAndField(
        resourcerequestservice.ResourceRequests_.CDS_NAME, Constants.PropertyNames.REQUESTED_CAPACITY));
  }

}
