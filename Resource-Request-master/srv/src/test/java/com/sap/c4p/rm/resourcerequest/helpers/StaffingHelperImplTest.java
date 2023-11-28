package com.sap.c4p.rm.resourcerequest.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Struct;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentServiceUrl;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import jakarta.servlet.http.HttpServletRequest;
import manageresourcerequestservice.Staffing;

@DisplayName("Unit test for Staffing Helper Impl class")
public class StaffingHelperImplTest {

  /**
   * Class Under Test
   */
  private StaffingHelperImpl cut;

  private HttpServletRequest mockHttpServletRequest;

  private AssignmentServiceUrl mockAssignmentServiceUrl;

  private HttpClient mockHttpClient;

  private Staffing staffing;

  private static final String SET_ASSIGNMENT_STATUS = "/SetAssignmentStatus";

  private static final String ODATA_V4_REQUESTER_ASSIGNMENT_SERVICE = "/odata/v4/RequesterAssignmentService";

  @BeforeEach
  public void setUp() {
    mockHttpServletRequest = Mockito.mock(HttpServletRequest.class);
    mockAssignmentServiceUrl = Mockito.mock(AssignmentServiceUrl.class);
    mockHttpClient = Mockito.mock(HttpClient.class);
    cut = new StaffingHelperImpl(mockHttpServletRequest, mockAssignmentServiceUrl, mockHttpClient);
  }

  @Nested
  class ValidateUpdateAssignment {

    @Test
    public void testUpdateAssignmentOnSuccess() throws IOException {
      String path = ODATA_V4_REQUESTER_ASSIGNMENT_SERVICE + SET_ASSIGNMENT_STATUS;
      StaffingHelperImpl spy = Mockito.spy(cut);
      HttpResponse mockResponse = Mockito.mock(HttpResponse.class, RETURNS_DEEP_STUBS);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(2);
      staffing.setAssignmentId("dummy ID");// The current assignment status is Proposed.

      doReturn("").when(mockHttpServletRequest).getHeader(anyString());

      doReturn("https").when(mockAssignmentServiceUrl).getSchema();
      doReturn("assignment-srv").when(mockAssignmentServiceUrl).getHost();
      doReturn(mockResponse).when(mockHttpClient).execute(any());
      when(mockResponse.getStatusLine().getStatusCode()).thenReturn(204);

      int responseStatusCode = spy.updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE, staffing);

      verify(mockHttpClient, times(1)).execute(any());
      verify(mockHttpServletRequest, times(2)).getHeader(anyString());
      verify(spy, times(1)).getUriStringForGivenPath(path);
      verify(spy, times(1))
          .getURIObjectFromURIString("https://assignment-srv/odata/v4/RequesterAssignmentService/SetAssignmentStatus");
      verify(spy, times(1)).addCommonHeaderParametersToRequest(any(), anyString(), anyString());
      assertEquals(204, responseStatusCode);

    }

    @Test
    public void testUpdateAssignmentOnError() throws IOException {

      String path = ODATA_V4_REQUESTER_ASSIGNMENT_SERVICE + SET_ASSIGNMENT_STATUS;
      StaffingHelperImpl spy = Mockito.spy(cut);
      HttpResponse mockResponse = Mockito.mock(HttpResponse.class, RETURNS_DEEP_STUBS);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(1);
      staffing.setAssignmentId("dummy ID");// The current assignment status is Proposed.

      doReturn("").when(mockHttpServletRequest).getHeader(anyString());

      doReturn("https").when(mockAssignmentServiceUrl).getSchema();
      doReturn("assignment-srv").when(mockAssignmentServiceUrl).getHost();
      doReturn(mockResponse).when(mockHttpClient).execute(any());
      when(mockResponse.getStatusLine().getStatusCode()).thenReturn(400);
      when(mockResponse.getStatusLine().getReasonPhrase()).thenReturn("ERROR MESSAGE");

      int responseStatusCode = spy.updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE, staffing);

      verify(mockHttpClient, times(1)).execute(any());
      verify(mockHttpServletRequest, times(2)).getHeader(anyString());
      verify(mockResponse, times(4)).getStatusLine();
      verify(spy, times(1)).getUriStringForGivenPath(path);
      verify(spy, times(1))
          .getURIObjectFromURIString("https://assignment-srv/odata/v4/RequesterAssignmentService/SetAssignmentStatus");
      verify(spy, times(1)).addCommonHeaderParametersToRequest(any(), anyString(), anyString());
    }

    @Test
    public void testUpdateAssignmentOnErrorForInvalidJson() throws IOException {

      String path = ODATA_V4_REQUESTER_ASSIGNMENT_SERVICE + SET_ASSIGNMENT_STATUS;
      StaffingHelperImpl spy = Mockito.spy(cut);
      HttpResponse mockResponse = Mockito.mock(HttpResponse.class, RETURNS_DEEP_STUBS);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(1);
      staffing.setAssignmentId("dummy ID");// The current assignment status is SoftBooked

      doReturn("").when(mockHttpServletRequest).getHeader(anyString());

      doReturn("https").when(mockAssignmentServiceUrl).getSchema();
      doReturn("assignment-srv").when(mockAssignmentServiceUrl).getHost();
      doThrow(IOException.class).when(mockHttpClient).execute(any());

      assertThrows(ServiceException.class, () -> {
        spy.updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE, staffing);
      });

      verify(mockHttpClient, times(1)).execute(any());
      verify(spy, times(1)).getUriStringForGivenPath(path);
      verify(spy, times(1))
          .getURIObjectFromURIString("https://assignment-srv/odata/v4/RequesterAssignmentService/SetAssignmentStatus");
      verify(spy, times(1)).addCommonHeaderParametersToRequest(any(), anyString(), anyString());
    }
  }
}
