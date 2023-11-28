package com.sap.c4p.rm.resourcerequest.actions.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.stereotype.Component;

@Component
public class AssignmentServiceUrlTest {

  AssignmentServiceUrl mockAssignmentServiceUrl = null;
  // Added for local url testing
  AssignmentServiceUrl assignmentServiceUrl = null;
  private String localSchema = "https";
  private String localHost = "localhost:8081";
  private String localUrl = "http://localhost:8081/odata/v4/AssignmentService/";

  @BeforeEach
  void beforeEach() {
    this.mockAssignmentServiceUrl = mock(AssignmentServiceUrl.class);
    this.assignmentServiceUrl = new AssignmentServiceUrl(localSchema, localUrl, localHost);
  }

  @Test
  @DisplayName("check if getAssignmentServiceUrl() returns assignmentServiceUrl if environmentVariable url is not null")
  public void validategetAssignmentServiceUrlEnvNotNull() {

    String mockEnvironmentVariable = "{'application_name': 'resourceRequest-srv','application_uris': ['c4p-rm-excelsior-dev-9-resourcerequest-srv.internal.cfapps.sap.hana.ondemand.com'],'name':'resourceRequest-srv'}";

    when(mockAssignmentServiceUrl.getEnvironmentVariable()).thenReturn(mockEnvironmentVariable);
    when(mockAssignmentServiceUrl.getSchema()).thenReturn("https");
    when(mockAssignmentServiceUrl.getAssignmentServiceUrl()).thenCallRealMethod();
    String expectedAssignmentServiceUrl = "https://c4p-rm-excelsior-dev-9-assignment-srv.internal.cfapps.sap.hana.ondemand.com";
    assertEquals(expectedAssignmentServiceUrl, mockAssignmentServiceUrl.getAssignmentServiceUrl());

  }

  @Test
  @DisplayName("check if getAssignmentServiceUrl() returns assignmentServiceUrl if destinations are null")
  public void validategetAssignmentServiceUrlNoDestinations() {

    String mockEnvironmentVariable = "{'process_id':'742d8eb9-a04f-4e14-b0be-5d2756088414','application_uris':['c4p-rm-excelsior-dev-9-resourcerequest-srv.internal.cfapps.sap.hana.ondemand.com']}";

    when(mockAssignmentServiceUrl.getEnvironmentVariable()).thenReturn(mockEnvironmentVariable);
    when(mockAssignmentServiceUrl.getSchema()).thenReturn("https");
    when(mockAssignmentServiceUrl.getAssignmentServiceUrl()).thenCallRealMethod();
    String expectedAssignmentServiceUrl = "https://c4p-rm-excelsior-dev-9-assignment-srv.internal.cfapps.sap.hana.ondemand.com";
    assertEquals(expectedAssignmentServiceUrl, mockAssignmentServiceUrl.getAssignmentServiceUrl());

  }

  @Test
  @DisplayName("check if getAssignmentServiceUrl() returns assignmentServiceUrl if environmentVariable url is null")
  public void validategetAssignmentServiceUrlEnvNull() {

    String mockEnvironmentVariable = null;

    when(mockAssignmentServiceUrl.getEnvironmentVariable()).thenReturn(mockEnvironmentVariable);
    String expectedAssignmentServiceUrl = "http://localhost:8081/odata/v4/AssignmentService/";
    assertEquals(expectedAssignmentServiceUrl, assignmentServiceUrl.getAssignmentServiceUrl());

  }

}
