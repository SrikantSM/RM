package com.sap.c4p.rm.projectintegrationadapter.cf.jobScheduler.service;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.JobScheduler;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service.JobSchedulerServiceInterface;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.util.JobSchedulerToken;
import com.sap.c4p.rm.projectintegrationadapter.util.*;

@DisplayName("Unit Test for Job Scheduler Service")
public class JobSchedulerServiceTest {

  public static final String DELETE_JOB_PREFIX = "DeleteProjects";
  public static final String DELTA_JOB_PREFIX = "S4ReplicationDelta";
  public static final String subDomain = "rm-bradbury";
  public static final String tenantId = "tenantId";
  public JobSchedulerServiceInterface cut;

  private CfUtils mockCfUtil;
  private JobSchedulerToken mockJobSchedulerToken;

  @BeforeEach
  public void setUp() {
    mockCfUtil = mock(CfUtils.class);
    mockJobSchedulerToken = mock(JobSchedulerToken.class);
    cut = new JobSchedulerService(mockCfUtil, mockJobSchedulerToken);
  }

  /**
   * The createDeltaAndDeleteJob method units
   */
  @Nested
  @DisplayName("Tests to test the method:createDeltaAndDeleteJob")
  public class createDeltaAndDeleteJob {

    /**
     * Validate the createJob is successfull and relevant methods are called
     */
    @Test
    public void whenCreateDeltaAndDeleteJobIsSuccessfull() {

      JobSchedulerServiceInterface spy = Mockito.spy(cut);
      doNothing().when(spy).createJobForDelta(subDomain, tenantId);
      doNothing().when(spy).createJobForDelete(subDomain, tenantId);

      spy.createDeltaAndDeleteJob(subDomain, tenantId);
      verify(spy, times(1)).createJobForDelta(subDomain, tenantId);
      verify(spy, times(1)).createJobForDelete(subDomain, tenantId);
    }

    /**
     * Validate on failure the exception raised with proper message
     */
    @Test
    public void whenCreateDeltaAndDeleteJobFailed() {

      JobSchedulerServiceInterface spy = Mockito.spy(cut);

      ServiceException e = new ServiceException("Failed to create job for tenant");

      doThrow(e).when(spy).createJobForDelta(subDomain, tenantId);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.createDeltaAndDeleteJob(subDomain, tenantId));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
      verify(spy, times(1)).createJobForDelta(subDomain, tenantId);
    }

  }

  /**
   * The createJobForDelta method tests
   */
  @Nested
  @DisplayName("Tests to test the method:createJobForDelta")
  public class createJobForDelta {

    /**
     * Validate the createJobForDelta is successfull and relevant methods are called
     */
    @Test
    public void whenCreateJobForDeltaIsSuccessfull() {

      JobSchedulerServiceInterface spy = Mockito.spy(cut);
      doNothing().when(spy).prepareAndExecuteJobSchedulerRequest(DELTA_JOB_PREFIX, subDomain, tenantId);

      spy.createJobForDelta(subDomain, tenantId);
      verify(spy, times(1)).prepareAndExecuteJobSchedulerRequest(DELTA_JOB_PREFIX, subDomain, tenantId);
    }

    /**
     * Validate on failure the exception raised with proper message
     */
    @Test
    public void whenCreateJobForDeltaFailed() {

      JobSchedulerServiceInterface spy = Mockito.spy(cut);

      ServiceException e = new ServiceException("Failed to create job for delta");

      doThrow(e).when(spy).prepareAndExecuteJobSchedulerRequest(DELTA_JOB_PREFIX, subDomain, tenantId);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.createJobForDelta(subDomain, tenantId));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
      verify(spy, times(1)).prepareAndExecuteJobSchedulerRequest(DELTA_JOB_PREFIX, subDomain, tenantId);
    }

  }

  /**
   * The createJobForDelete method tests
   */
  @Nested
  @DisplayName("Tests to test the method:createJobForDelete")
  public class createJobForDelete {

    /**
     * Validate the createJobForDeleteProjects is successfull and relevant methods
     * are called
     */
    @Test
    public void whenCreateJobForDeleteIsSuccessfull() {

      JobSchedulerServiceInterface spy = Mockito.spy(cut);
      doNothing().when(spy).prepareAndExecuteJobSchedulerRequest(DELETE_JOB_PREFIX, subDomain, tenantId);

      spy.createJobForDelete(subDomain, tenantId);
      verify(spy, times(1)).prepareAndExecuteJobSchedulerRequest(DELETE_JOB_PREFIX, subDomain, tenantId);
    }

    /**
     * Validate on failure the exception raised with proper message
     */
    @Test
    public void whenCreateJobForDeleteFailed() {

      JobSchedulerServiceInterface spy = Mockito.spy(cut);

      ServiceException e = new ServiceException("Failed to create job for delete");

      doThrow(e).when(spy).prepareAndExecuteJobSchedulerRequest(DELETE_JOB_PREFIX, subDomain, tenantId);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.createJobForDelete(subDomain, tenantId));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
      verify(spy, times(1)).prepareAndExecuteJobSchedulerRequest(DELETE_JOB_PREFIX, subDomain, tenantId);
    }

  }

  /**
   * The prepareJobSchedulerRequest method tests
   */
  @Nested
  @DisplayName("Tests to test the method:prepareJobSchedulerRequest")
  public class prepareJobSchedulerRequest {

    /**
     * Validate the prepareJobSchedulerRequest is successfull and relevant methods
     * are called
     */
    @Test
    public void whenPrepareAndTriggerReplicationSuccessfully() {
      JobScheduler jobScheduler = new JobScheduler();
      jobScheduler.setClientId("clientId");
      jobScheduler.setClientSecret("clientSecret");
      jobScheduler.setSchedulerUrl("https://triggerJobs");
      jobScheduler.setUaaUrl("https://authenticate/oaut/token");

      JobSchedulerServiceInterface spy = Mockito.spy(cut);

      String bearerToken = "";
      doReturn(jobScheduler).when(mockCfUtil).getServiceForJobSceduler();
      doReturn(bearerToken).when(mockJobSchedulerToken).getCertificateBearerToken(any(), anyString());
      doReturn(null).when(spy).doRequest(any(), any(), any(), any());

      spy.prepareAndExecuteJobSchedulerRequest(DELTA_JOB_PREFIX, subDomain, tenantId);
      verify(spy, times(1)).doRequest(any(), any(), any(), any());

    }

    /**
     * Validate on failure the exception raised with proper message
     */
    @Test
    public void whenPrepareAndTriggerReplicationFailed() {
      JobScheduler jobScheduler = new JobScheduler();
      jobScheduler.setClientId("clientId");
      jobScheduler.setClientSecret("clientSecret");
      jobScheduler.setSchedulerUrl("https://triggerJobs");
      jobScheduler.setUaaUrl("https://authenticate/oaut/token");

      JobSchedulerServiceInterface spy = Mockito.spy(cut);

      ServiceException e = new ServiceException("Failed to create job for tenant");

      doThrow(e).when(mockCfUtil).getServiceForJobSceduler();
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.prepareAndExecuteJobSchedulerRequest(DELTA_JOB_PREFIX, subDomain, tenantId));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    /**
     * Validate the prepareJobSchedulerRequest is successfull and relevant methods
     * are called
     */

    @Test
    public void whenPrepareAndTriggerDeleteProjectSuccessfully() {
      JobScheduler jobScheduler = new JobScheduler();
      jobScheduler.setClientId("clientId");
      jobScheduler.setClientSecret("clientSecret");
      jobScheduler.setSchedulerUrl("https://triggerJobs");
      jobScheduler.setUaaUrl("https://authenticate/oaut/token");

      JobSchedulerServiceInterface spy = Mockito.spy(cut);

      String bearerToken = null;
      doReturn(jobScheduler).when(mockCfUtil).getServiceForJobSceduler();
      doReturn(bearerToken).when(mockJobSchedulerToken).getCertificateBearerToken(any(), anyString());
      doReturn(null).when(spy).doRequest(any(), any(), any(), any());

      spy.prepareAndExecuteJobSchedulerRequest(DELETE_JOB_PREFIX, subDomain, tenantId);
      verify(spy, times(1)).doRequest(any(), any(), any(), any());

    }

    /**
     * Validate on failure the exception raised with proper message
     */
    @Test
    public void whenPrepareAndTriggerDeleteProjectsFailed() {
      JobScheduler jobScheduler = new JobScheduler();
      jobScheduler.setClientId("clientId");
      jobScheduler.setClientSecret("clientSecret");
      jobScheduler.setSchedulerUrl("https://triggerJobs");
      jobScheduler.setUaaUrl("https://authenticate/oaut/token");

      JobSchedulerServiceInterface spy = Mockito.spy(cut);

      ServiceException e = new ServiceException("Failed to create job for tenant");

      doThrow(e).when(mockCfUtil).getServiceForJobSceduler();
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.prepareAndExecuteJobSchedulerRequest(DELETE_JOB_PREFIX, subDomain, tenantId));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }
  }

}
