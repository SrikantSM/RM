package com.sap.c4p.rm.projectintegrationadapter.service;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.sap.cds.CdsData;
import com.sap.cds.Struct;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.s4hana.connectivity.ErpHttpDestination;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.projectintegrationadapter.model.ProjectReplicationTask;
import com.sap.c4p.rm.projectintegrationadapter.repository.DemandRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.IntegrationStatusRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectReplicationTasksRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ResourceRequestRepository;
import com.sap.c4p.rm.projectintegrationadapter.transformation.TransformS4ProjectToRM;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants.ReplicationType;
import com.sap.c4p.rm.projectintegrationadapter.util.ProjectManagementS4Client;

import com.sap.resourcemanagement.config.ProjectReplicationTasks;
import com.sap.resourcemanagement.integration.ProjectReplicationStatus;
import com.sap.resourcemanagement.integration.ProjectSync;
import com.sap.resourcemanagement.integration.SupplySyncDetails;
import com.sap.resourcemanagement.project.Projects;

@DisplayName("Unit Test for Replication service objects")
public class ReplicationServiceTest {

  public ReplicationService cut;
  @Mock
  public IntegrationStatusRepository mockIntegrationStatusRepository = null;
  @Mock
  public ProjectManagementS4Client mockS4Client;
  @Mock
  public DemandRepository mockDemandRepository = null;
  @Mock
  public ProjectRepository mockProjectRepository = null;
  @Mock
  public ResourceRequestRepository mockResourceRequestRepository = null;
  @Mock
  public ProjectReplicationTasksRepository mockProjectReplicationTasksRepository = null;
  @Mock
  public TransformS4ProjectToRM mockTransformS4ProjectToRM;
  @Mock
  public DetermineChange mockDetermineChange;
  @Mock
  public AssignmentService mockAssignmentService;
  @Mock
  public JobSchedulerService mockJobSchedulerService;
  @Mock
  public XsuaaUserInfo mockXsuaaUserInfo;

  public List<Project> projects = new ArrayList<>();
  public Project s4Project1 = new Project();
  public Project s4Project2 = new Project();

  public static final boolean IS_INITIAL_REPLICATION = false;
  public static final boolean IS_DELTA_REPLICATION = true;
  public static final int REPLICATION_TYPE_INITIAL = 1;
  public static final int REPLICATION_TYPE_DELTA = 2;
  public static final int REPLICATION_TYPE_DELETE = 3;
  public static final int REPLICATION_TYPE_ERROR = 1;
  public static final int RUN_STATUS_START = 1;
  public static final int RUN_STATUS_ERROR = 3;
  public static final int PAGE_SIZE = 2;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    s4Project1.setProjectID("project1");
    s4Project2.setProjectID("project2");
    projects.add(s4Project1);
    projects.add(s4Project2);

    cut = new ReplicationService(mockIntegrationStatusRepository, mockS4Client, mockDemandRepository,
        mockProjectRepository, mockResourceRequestRepository, mockProjectReplicationTasksRepository,
        mockTransformS4ProjectToRM, mockDetermineChange, mockAssignmentService, mockJobSchedulerService,
        mockXsuaaUserInfo);
  }

  @Nested
  @DisplayName("Tests to test the method:setReplicationRunStatusToProcessing")
  public class setReplicationRunStatusToProcessingTest {
    /**
     * used in all the sub test methods for this class
     */

    public Set<ProjectSync> projectToSync = new HashSet<ProjectSync>();
    public ZonedDateTime time = ZonedDateTime.now();
    ProjectReplicationStatus mockExistingProjectReplicationStatus = ProjectReplicationStatus.create();

    /**
     * When setReplicationRunStatusToProcessing is executed with
     * isInitialReplication passed as true( initial replication) along with mock
     * time, project and existingProjectReplicationStatus is not null
     */
    @Test
    public void verifyForInitialScenarioWithExistingProjectReplicationStatusNotNull() {

      doReturn(mockExistingProjectReplicationStatus).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(ReplicationServiceTest.REPLICATION_TYPE_INITIAL);
      cut.setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_INITIAL, time, projectToSync);
      verify(mockIntegrationStatusRepository, times(0)).insertProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(1)).updateProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(1)).upsertProjectSync(any());
    }

    /**
     * When setReplicationRunStatusToProcessing is executed with
     * isInitialReplication passed as true( initial replication) along with mock
     * time, project and existingProjectReplicationStatus is null
     */
    @Test
    public void verifyForInitialScenarioWithExistingProjectReplicationStatusNull() {

      doReturn(null).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(ReplicationServiceTest.REPLICATION_TYPE_INITIAL);
      cut.setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_INITIAL, time, projectToSync);
      verify(mockIntegrationStatusRepository, times(1)).insertProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(0)).updateProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(1)).upsertProjectSync(any());
    }

    /**
     * When setReplicationRunStatusToProcessing is executed with isDeltaReplication
     * passed as true( delta replication) along with mock time and project and
     * existingProjectReplicationStatus is not null
     */
    @Test
    public void verifyForDeltaReplicationWithExistingProjectReplicationStatusNotNull() {

      doReturn(mockExistingProjectReplicationStatus).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(ReplicationServiceTest.REPLICATION_TYPE_DELTA);
      cut.setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_DELTA, time, projectToSync);
      verify(mockIntegrationStatusRepository, times(0)).insertProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(1)).updateProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(1)).upsertProjectSync(any());

    }

    /**
     * When setReplicationRunStatusToProcessing is executed with isDeltaReplication
     * passed as true along with mock time and project and
     * existingProjectReplicationStatus is null
     */
    @Test
    public void verifyForDeltaReplicationWithExistingProjectReplicationStatusNull() {

      doReturn(null).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(ReplicationServiceTest.REPLICATION_TYPE_DELTA);
      cut.setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_DELTA, time, projectToSync);
      verify(mockIntegrationStatusRepository, times(1)).insertProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(0)).updateProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(1)).upsertProjectSync(any());

    }

    /**
     * When setReplicationRunStatusToProcessing is executed with isDeleteReplication
     * passed as true( delta replication) along with mock time and project and
     * existingProjectReplicationStatus is not null
     */
    @Test
    public void verifyForDeleteReplicationWithExistingProjectReplicationStatusNotNull() {

      doReturn(mockExistingProjectReplicationStatus).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(ReplicationServiceTest.REPLICATION_TYPE_DELETE);
      cut.setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_DELETE, time, projectToSync);
      verify(mockIntegrationStatusRepository, times(0)).insertProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(1)).updateProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(0)).upsertProjectSync(any());

    }

    /**
     * When setReplicationRunStatusToProcessing is executed with isDeleteReplication
     * passed as true( delta replication) along with mock time and project and
     * existingProjectReplicationStatus is null
     */
    @Test
    public void verifyForDeleteReplicationWithExistingProjectReplicationStatusNull() {

      doReturn(null).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(ReplicationServiceTest.REPLICATION_TYPE_DELETE);
      cut.setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_DELETE, time, projectToSync);
      verify(mockIntegrationStatusRepository, times(1)).insertProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(0)).updateProjectReplicationStatus(any());
      verify(mockIntegrationStatusRepository, times(0)).upsertProjectSync(any());

    }

    /**
     * When setReplicationRunStatusToProcessing throws a Service Exception
     */
    @Test
    public void whensetReplicationRunStatusToProcessingRaisesServiceException() {

      ServiceException e = new ServiceException("Error occured while setting replication status to processing");
      doThrow(e).when(mockIntegrationStatusRepository).insertProjectReplicationStatus(any());

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut
          .setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_INITIAL, time, projectToSync));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    /**
     * When setReplicationRunStatusToProcessing throws an exception other than
     * Service Exception
     */
    @Test
    public void whensetReplicationRunStatusToProcessingRaisesExceptionOtherThanServiceException() {

      NullPointerException e = new NullPointerException(
          Constants.LoggerMessages.UPDATE_REPLICATION_STATUS_TO_PROCESSING);
      doThrow(e).when(mockIntegrationStatusRepository).insertProjectReplicationStatus(any());

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut
          .setReplicationRunStatusToProcessing(ReplicationServiceTest.REPLICATION_TYPE_INITIAL, time, projectToSync));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }
  }

  @Nested
  @DisplayName("Tests to test the method:setReplicationStatustoCompletedOrError")
  public class setReplicationStatustoCompletedOrErrorTest {

    /**
     * When setReplicationStatustoCompletedOrError is executed without populating
     * the inprocess or error projects
     */
    @Test
    public void verifyMethodIsExecutedSuccessfully() {

      List<String> serviceOrganizations = new ArrayList<>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      ReplicationService spy = Mockito.spy(cut);

      doNothing().when(spy).updateProjectReplicationStatus(anyInt(), anyInt());
      doNothing().when(spy).updateProjectReplicationTaskStatus(anyList(), anyInt());

      spy.setReplicationStatustoCompletedOrError(ReplicationServiceTest.REPLICATION_TYPE_INITIAL, serviceOrganizations);

      verify(spy, times(1)).updateProjectReplicationStatus(anyInt(), anyInt());
      verify(mockIntegrationStatusRepository, times(2)).getSingleProjectSync(anyInt(), anyInt(), anyList());
      verify(spy, times(1)).updateProjectReplicationTaskStatus(anyList(), anyInt());
    }

    /**
     * When setReplicationStatustoCompletedOrError is executed with inprocess
     * objects
     */
    @Test
    public void wheninProcessProjectsPopulated() {

      ProjectSync mockinProcessProjects = ProjectSync.create();
      List<String> serviceOrganizations = new ArrayList<>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      ReplicationService spy = Mockito.spy(cut);

      doNothing().when(spy).updateProjectReplicationStatus(anyInt(), anyInt());
      doNothing().when(spy).updateProjectReplicationTaskStatus(anyList(), anyInt());

      when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING,
          ReplicationServiceTest.REPLICATION_TYPE_INITIAL, serviceOrganizations)).thenReturn(mockinProcessProjects);
      spy.setReplicationStatustoCompletedOrError(ReplicationServiceTest.REPLICATION_TYPE_INITIAL, serviceOrganizations);
      verify(spy, times(0)).updateProjectReplicationStatus(anyInt(), anyInt());
      verify(spy, times(0)).updateProjectReplicationTaskStatus(anyList(), anyInt());
    }

    /**
     * When setReplicationStatustoCompletedOrError is executed with error objects
     */
    @Test
    public void whenerrorProjectsPopulated() {

      ProjectSync mockerrorProjects = ProjectSync.create();
      List<String> serviceOrganizations = new ArrayList<>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      ReplicationService spy = Mockito.spy(cut);

      when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.ERROR,
          ReplicationServiceTest.REPLICATION_TYPE_INITIAL, serviceOrganizations)).thenReturn(mockerrorProjects);
      spy.setReplicationStatustoCompletedOrError(ReplicationServiceTest.REPLICATION_TYPE_INITIAL, serviceOrganizations);
      verify(spy, times(1)).updateProjectReplicationStatus(anyInt(), anyInt());
      verify(mockIntegrationStatusRepository, times(2)).getSingleProjectSync(anyInt(), anyInt(), anyList());
      verify(spy, times(1)).updateProjectReplicationTaskStatus(anyList(), anyInt());
    }

    /**
     * When setReplicationStatustoCompletedOrError raises a Service Exception
     */
    @Test
    public void whensetReplicationStatustoCompletedOrErrorRaisesServiceException() {

      List<String> serviceOrganizations = new ArrayList<>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      ReplicationService spy = Mockito.spy(cut);

      ServiceException e = new ServiceException("Error occured while setting replicaiton status to completed ");

      doThrow(e).when(spy).updateProjectReplicationStatus(anyInt(), anyInt());

      final ServiceException exception = assertThrows(ServiceException.class, () -> spy
          .setReplicationStatustoCompletedOrError(ReplicationServiceTest.REPLICATION_TYPE_ERROR, serviceOrganizations));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

    /**
     * When setReplicationStatustoCompletedOrError raises an exception other than
     * Service Exception
     */
    @Test
    public void whensetReplicationStatustoCompletedOrErrorRaisesExceptionOtherThanServiceException() {

      List<String> serviceOrganizations = new ArrayList<>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      ReplicationService spy = Mockito.spy(cut);

      NullPointerException e = new NullPointerException("Error occured while setting replicaiton status");

      doThrow(e).when(spy).updateProjectReplicationStatus(anyInt(), anyInt());

      final ServiceException exception = assertThrows(ServiceException.class, () -> spy
          .setReplicationStatustoCompletedOrError(ReplicationServiceTest.REPLICATION_TYPE_ERROR, serviceOrganizations));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

  }

  @Nested
  @DisplayName("Tests to test the method:setProjectSyncStatusToError")
  public class setProjectSyncStatusToErrorTest {

    public ProjectSync projectToSync = Struct.create(ProjectSync.class);

    /**
     * When setProjectSyncStatusToError is passed with all the mock objects to
     * execute successfully
     */
    @Test
    public void verifyMethodIsExecutedSuccessfully() {

      when((mockIntegrationStatusRepository).getProjectSyncByProject(anyString(), anyInt())).thenReturn(projectToSync);

      cut.setProjectSyncStatusToError(anyString(), anyInt());
      verify(mockIntegrationStatusRepository, times(1)).updateProjectSyncStatus(any());

    }

    /**
     * When setProjectSyncStatusToError raises an exception
     */
    @Test
    public void whensetProjectSyncStatusToErrorRaisesException() {

      ServiceException e = new ServiceException("Error occured while setting ProjectSync status ");

      when((mockIntegrationStatusRepository).getProjectSyncByProject(anyString(), anyInt())).thenReturn(projectToSync);
      doThrow(e).when(mockIntegrationStatusRepository).updateProjectSyncStatus(any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.setProjectSyncStatusToError(anyString(), anyInt()));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Tests to test the method:getProjectTreeFromRM")
  public class getProjectTreeFromRMTest {
    /**
     * When getProjectTreeFromRM is passed with all the mock objects to execute
     * successfully
     */
    @Test
    public void getProjectTreeFromRMSuccessScenario() {
      Projects expectedProject = Struct.create(Projects.class);

      when((mockProjectRepository).selectProjectTree(anyString())).thenReturn(expectedProject);
      Projects mockProject = cut.getProjectTreeFromRM(anyString());
      assertEquals(expectedProject, mockProject);

    }
  }

  @Nested
  @DisplayName("Tests to test the method:insertProjectInRm")
  public class insertProjectInRmTest {
    /**
     * When insertProjectInRm is passed with all the mock objects to execute
     * successfully
     */
    @Test
    public void wheninsertProjectInRmExecutesSuccessfully() {

      final Map<String, List<CdsData>> transformedData = new HashMap<>();
      List<CdsData> rmProjects = new ArrayList<>();
      List<CdsData> rmDemands = new ArrayList<>();
      List<CdsData> rmResourceRequests = new ArrayList<>();
      transformedData.put("Project", rmProjects);
      transformedData.put("Demand", rmDemands);
      transformedData.put("ResourceRequest", rmResourceRequests);

      cut.insertProjectInRm(transformedData);
      verify(mockProjectRepository, times(1)).upsertProjects(anyList());
      verify(mockDemandRepository, times(1)).upsertDemands(anyList());
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequests(anyList());
    }

    /**
     * When insertProjectInRm raises exception
     */
    @Test
    public void wheninsertProjectInRmRaisesException() {

      final Map<String, List<CdsData>> transformedData = new HashMap<>();
      List<CdsData> rmProjects = new ArrayList<>();
      List<CdsData> rmDemands = new ArrayList<>();
      transformedData.put("Project", rmProjects);
      transformedData.put("Demand", rmDemands);

      ServiceException e = new ServiceException("Error occured while insering project in RM ");
      doThrow(e).when(mockDemandRepository).upsertDemands(anyList());

      ServiceException exception = assertThrows(ServiceException.class, () -> cut.insertProjectInRm(transformedData));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Tests to test the method:isEligibileForReplication")
  public class IsEligibileForReplicationTest {

    public ZonedDateTime expectedTime = ZonedDateTime.now();

    /**
     * When all checks are true isEligibileForReplication returns true
     */
    @Test
    public void isEligibileForReplicationTrue() {

      ErpHttpDestination mockDestination = mock(ErpHttpDestination.class);
      doReturn(mockDestination).when(mockS4Client).getDestination();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();
      String isEligibleMsg = cut.isEligibileForReplication();
      assertEquals(null, isEligibleMsg);

    }

    /**
     * When destination is not maintained
     */
    @Test
    public void destinationNotMaintained() {

      doReturn(null).when(mockS4Client).getDestination();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();
      String message = "Destination is not maintained";
      String isEligibleMsg = cut.isEligibileForReplication();
      assertEquals(isEligibleMsg, message);

    }

    /**
     * When not authorized to fetch Commercial Projects
     */
    @Test
    public void notAuthorizedFetchProjects() {

      ErpHttpDestination mockDestination = mock(ErpHttpDestination.class);
      doReturn(mockDestination).when(mockS4Client).getDestination();
      doReturn(Boolean.FALSE).when(mockS4Client).isAuthorisedForCommercialProject();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();
      String message = "Authorization missing to Fetch Projects";
      String isEligibleMsg = cut.isEligibileForReplication();
      assertEquals(isEligibleMsg, message);

    }

    /**
     * When not authorized to fetch Customer data
     */
    @Test
    public void notAuthorizedFetchCustomerMaster() {

      ErpHttpDestination mockDestination = mock(ErpHttpDestination.class);
      doReturn(mockDestination).when(mockS4Client).getDestination();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
      doReturn(Boolean.FALSE).when(mockS4Client).isAuthorisedForCustomerMaster();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();
      String message = "Authorization missing to Fetch Customers";
      String isEligibleMsg = cut.isEligibileForReplication();
      assertEquals(isEligibleMsg, message);

    }

    /**
     * When not authorized to fetch Activity Types
     */
    @Test
    public void notAuthorizedFetchActivityTypes() {

      ErpHttpDestination mockDestination = mock(ErpHttpDestination.class);
      doReturn(mockDestination).when(mockS4Client).getDestination();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
      doReturn(Boolean.FALSE).when(mockS4Client).isAuthorisedForActivityType();
      String message = "Authorization missing to Fetch Activity Types";
      String isEligibleMsg = cut.isEligibileForReplication();
      assertEquals(isEligibleMsg, message);

    }

    /**
     * When isEligibileForReplication raises a exception
     */
    @Test
    public void isEligibileForReplicationExceptionTest() {

      ErpHttpDestination mockDestination = mock(ErpHttpDestination.class);
      doReturn(mockDestination).when(mockS4Client).getDestination();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
      doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
      ServiceException e = new ServiceException("Error occured while checking eligibility for replication");
      doThrow(e).when(mockS4Client).isAuthorisedForActivityType();

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.isEligibileForReplication());

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Tests to test the method:updateProjectReplicationStatus")
  public class UpdateProjectReplicationStatusTest {

    /**
     * If the Project Replication Status is NULL
     */
    @Test
    public void whenProjectReplicationIsNull() {

      doReturn(null).when(mockIntegrationStatusRepository).readProjectReplicationStatus(anyInt());

      ReplicationService spy = Mockito.spy(cut);

      spy.updateProjectReplicationStatus(anyInt(), anyInt());

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(anyInt());
      verify(mockIntegrationStatusRepository, times(0)).updateProjectReplicationStatus(any());
    }

    /**
     * If the Project Replication Status is Not NULL
     */
    @Test
    public void whenProjectReplicationIsNotNull() {

      ProjectReplicationStatus mockProjectReplicationStatus = ProjectReplicationStatus.create();
      doReturn(mockProjectReplicationStatus).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(anyInt());

      ReplicationService spy = Mockito.spy(cut);

      spy.updateProjectReplicationStatus(anyInt(), anyInt());

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(anyInt());
      verify(mockIntegrationStatusRepository, times(1)).updateProjectReplicationStatus(any());
    }

    /**
     * Check if exceptions handled
     */
    @Test
    public void whenUpdateProjectReplicationStatusRaisesException() {

      ServiceException e = new ServiceException("Error occured while updating replicaiton status");
      doThrow(e).when(mockIntegrationStatusRepository).readProjectReplicationStatus(anyInt());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.updateProjectReplicationStatus(anyInt(), anyInt()));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Tests to test the method:getProjectReplicationStatus")
  public class GetProjectReplicationStatusTest {

    /**
     * If the replicationType input is INITIAL load
     */
    @Test
    public void getProjectReplicationStatusForInitialLoad() {

      ProjectReplicationStatus projectReplicationStatusInitial = ProjectReplicationStatus.create();
      projectReplicationStatusInitial.setTypeCode(Constants.ReplicationType.INITIAL);

      doReturn(projectReplicationStatusInitial).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);

      ProjectReplicationStatus projectReplicationStatusReturned = cut
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      assertEquals(projectReplicationStatusReturned, projectReplicationStatusInitial);

    }

    /**
     * If the getProjectReplicationStatus method throws Service Exception
     */
    @Test
    public void getProjectReplicationStatusRaisesServiceExceptionScenario() {

      ServiceException serviceException = new ServiceException(Constants.LoggerMessages.DETERMINE_REPLICATION_STATUS);

      doThrow(serviceException).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.DELTA);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getProjectReplicationStatus(Constants.ReplicationType.DELTA));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

    /**
     * If the getProjectReplicationStatus method throws Exception Other than Service
     * Exception
     */
    @Test
    public void getProjectReplicationStatusRaisesExceptionOtherThanServiceExceptionScenario() {

      NullPointerException e = new NullPointerException(Constants.LoggerMessages.DETERMINE_REPLICATION_STATUS);

      doThrow(e).when(mockIntegrationStatusRepository).readProjectReplicationStatus(Constants.ReplicationType.DELTA);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getProjectReplicationStatus(Constants.ReplicationType.DELTA));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    /**
     * If the replicationType input is DELTA load
     */
    @Test
    public void getProjectReplicationStatusForDeltaLoad() {

      ProjectReplicationStatus projectReplicationStatusDelta = ProjectReplicationStatus.create();
      projectReplicationStatusDelta.setTypeCode(Constants.ReplicationType.DELTA);

      doReturn(projectReplicationStatusDelta).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.DELTA);

      ProjectReplicationStatus projectReplicationStatusReturned = cut
          .getProjectReplicationStatus(Constants.ReplicationType.DELTA);

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      assertEquals(projectReplicationStatusReturned, projectReplicationStatusDelta);

    }
  }

  @Nested
  public class TransformProjectToProjectSyncTest {

    private List<Project> s4Projects = new ArrayList<>();
    private Project s4Project;

    /** Check the S4Project are transformed to RM Project */
    @Test
    @DisplayName("Validate if the S4Project is transformed to project sync sucessfully when replication type is INITIAL")
    public void validateS4ProjectTransformedSuccessfullyInitial() {

      s4Project = new Project();
      s4Project.setProjectID("PRJ-001");
      s4Project.setOrgID("Org_US");
      s4Projects.add(s4Project);

      s4Project = new Project();
      s4Project.setProjectID("PRJ-002");
      s4Project.setOrgID("org_IN");
      s4Projects.add(s4Project);

      int replicationType = Constants.ReplicationType.INITIAL;

      Set<ProjectSync> projectSyncSet = cut.transformProjectToProjectSync(s4Projects, replicationType);
      List<ProjectSync> projectSyncList = new ArrayList<>(projectSyncSet);

      assertEquals(2, projectSyncList.size());

      if (projectSyncList.get(0).getProject() == "PRJ-001") {
        assertEquals("PRJ-001", s4Projects.get(0).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(0).getStatusCode());
        assertEquals(s4Projects.get(0).getOrgID(), projectSyncList.get(0).getServiceOrganizationCode());
      } else {
        assertEquals("PRJ-002", s4Projects.get(1).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(0).getStatusCode());
        assertEquals(s4Projects.get(1).getOrgID(), projectSyncList.get(0).getServiceOrganizationCode());
      }

      if (projectSyncList.get(1).getProject() == "PRJ-002") {
        assertEquals("PRJ-002", s4Projects.get(1).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(1).getStatusCode());
        assertEquals(s4Projects.get(1).getOrgID(), projectSyncList.get(1).getServiceOrganizationCode());
      } else {
        assertEquals("PRJ-001", s4Projects.get(0).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(1).getStatusCode());
        assertEquals(s4Projects.get(0).getOrgID(), projectSyncList.get(1).getServiceOrganizationCode());
      }

    }

    @Test
    @DisplayName("Validate if the S4Project is transformed to project sync sucessfully when replication type is DELTA")
    public void validateS4ProjectTransformedSuccessfullyDelta() {

      s4Project = new Project();
      s4Project.setProjectID("PRJ-001");
      s4Project.setOrgID("Org_US");
      s4Projects.add(s4Project);

      s4Project = new Project();
      s4Project.setProjectID("PRJ-002");
      s4Project.setOrgID("Org_IN");
      s4Projects.add(s4Project);

      int replicationType = Constants.ReplicationType.DELTA;

      Set<ProjectSync> projectSyncSet = cut.transformProjectToProjectSync(s4Projects, replicationType);
      List<ProjectSync> projectSyncList = new ArrayList<>(projectSyncSet);

      assertEquals(2, projectSyncList.size());

      if (projectSyncList.get(0).getProject() == "PRJ-001") {
        assertEquals("PRJ-001", s4Projects.get(0).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(0).getStatusCode());
        assertEquals(s4Projects.get(0).getOrgID(), projectSyncList.get(0).getServiceOrganizationCode());
      } else {
        assertEquals("PRJ-002", s4Projects.get(1).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(0).getStatusCode());
        assertEquals(s4Projects.get(1).getOrgID(), projectSyncList.get(0).getServiceOrganizationCode());
      }

      if (projectSyncList.get(1).getProject() == "PRJ-002") {
        assertEquals("PRJ-002", s4Projects.get(1).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(1).getStatusCode());
        assertEquals(s4Projects.get(1).getOrgID(), projectSyncList.get(1).getServiceOrganizationCode());
      } else {
        assertEquals("PRJ-001", s4Projects.get(0).getProjectID());
        assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(1).getStatusCode());
        assertEquals(s4Projects.get(0).getOrgID(), projectSyncList.get(1).getServiceOrganizationCode());
      }

    }

    /**
     * Check when S4Project fail to transform to Project sync, a service exception
     * is raised
     */
    @Test
    @DisplayName("Service exception is raised in case failed to transform S4Project to Project sync object")
    public void FailedToTransformThrowsServiceException() {

      s4Project = new Project();
      s4Projects.add(s4Project);

      int replicationType = Constants.ReplicationType.DELTA;

      ServiceException serviceException = new ServiceException("Failed in transformProjectToProjectSync");
      ReplicationService spyReplicationService = Mockito.spy(cut);

      Mockito.doThrow(serviceException).when(spyReplicationService).transformProjectToProjectSync(s4Projects,
          replicationType);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyReplicationService.transformProjectToProjectSync(s4Projects, replicationType));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

  }

  @Nested
  @DisplayName("Tests to test the method:getAllProjects")
  class getAllProjectsTest {

    public ZonedDateTime expectedTime = ZonedDateTime.now();

    /**
     * Check if getAllProjects returns projects filtered on the basis of service
     * organizations successfully
     */

    @Test
    public void getAllProjectsSuccessScenario() {

      Project p1 = new Project();
      Project p2 = new Project();
      List<Project> allProjects = new ArrayList<>();
      List<Project> expectedProjects = new ArrayList<Project>();

      p1.setProjectID("P01");
      p1.setChangedOn(ZonedDateTime.now());
      p1.setOrgID("ORG_IN");
      p2.setProjectID("P02");
      p2.setChangedOn(ZonedDateTime.now());
      p2.setOrgID("ORG_DE");

      allProjects.add(0, p1);
      allProjects.add(1, p2);
      expectedProjects.add(0, p2);
      expectedProjects.add(0, p1);

      when(mockS4Client.getProjectIds(anyInt(), any(ZonedDateTime.class))).thenReturn(allProjects);

      List<Project> actualProjects = cut.getAllProjects(expectedTime);
      verify(mockS4Client, times(1)).getProjectIds(anyInt(), any(ZonedDateTime.class));

      assertEquals(expectedProjects, actualProjects);
    }

    /** Check if GetAllProjects raises a Service Exception */

    @Test
    public void getAllProjectsRaisesServiceExceptionScenario() {

      ServiceException e = new ServiceException("Error occured while getting projectlist from S/4 ");
      doThrow(e).when(mockS4Client).getProjectIds(anyInt(), any(ZonedDateTime.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.getAllProjects(expectedTime));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

    /** Check if GetAllProjects raises an exception other than Service Exception */

    @Test
    public void getAllProjectsRaisesExceptionOtherThanServiceExceptionScenario() {

      NullPointerException e = new NullPointerException("Error occured while getting projectlist from S/4");
      doThrow(e).when(mockS4Client).getProjectIds(anyInt(), any(ZonedDateTime.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.getAllProjects(expectedTime));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Tests to test the method:getAllProjectsForReplicationTask")
  class getAllProjectsForReplicationTaskTest {

    /**
     * Check if getAllProjectsForReplicationTask returns fetched projects
     * Successfully
     */

    @Test
    public void getAllProjectsForReplicationTaskSuccessScenario() {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();

      List<Project> mockFetchedProjects = new ArrayList<>();
      Project mockFetchedProject = new Project();
      mockFetchedProject.setProjectID("PRJ-001");
      mockFetchedProjects.add(mockFetchedProject);

      List<Project> expectedFetchedProjects = new ArrayList<>();
      expectedFetchedProjects.add(mockFetchedProject);

      doReturn(mockFetchedProjects).when(mockS4Client).getProjectIdsForReplicationTask(Constants.PAGE_SIZE,
          mockProjectReplicationTask);

      List<Project> actualFetchedProjects = cut.getAllProjectsForReplicationTask(mockProjectReplicationTask);

      verify(mockS4Client, times(1)).getProjectIdsForReplicationTask(Constants.PAGE_SIZE, mockProjectReplicationTask);
      assertEquals(expectedFetchedProjects, actualFetchedProjects);

    }

    /**
     * Check if Exception arises while fetching the Projects
     */

    @Test
    void getAllProjectsForReplicationTaskInCaseOfExceptionScenario() {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();

      ServiceException serviceException = new ServiceException(
          "Error occured while getting projectlist from S/4 during initial load");

      doThrow(serviceException).when(mockS4Client).getProjectIdsForReplicationTask(Constants.PAGE_SIZE,
          mockProjectReplicationTask);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getAllProjectsForReplicationTask(mockProjectReplicationTask));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Tests to test the method:replicateProjectsForRetryInitialLoad")
  public class replicateProjectsForRetryInitialLoadTest {

    /**
     * Check whether all the methods triggered successfully in case of INITIAL load
     */
    @Test
    void replicateProjectsForRetryInitialLoad() {

      ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
      projectReplicationStatus.setTypeCode(Constants.ReplicationType.INITIAL);
      projectReplicationStatus.setStartTime(Instant.now());

      Set<ProjectSync> projectsInError = new HashSet<>();
      ProjectSync errorProject = ProjectSync.create();
      errorProject.setProject("PRJ-002");
      projectsInError.add(errorProject);

      List<String> serviceOrganizationCodes = new ArrayList<>();
      serviceOrganizationCodes.add("1010");
      serviceOrganizationCodes.add("1710");

      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime lastReplicationRunTime = projectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

      ReplicationService spy = Mockito.spy(cut);

      doReturn(projectsInError).when(mockIntegrationStatusRepository).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      doNothing().when(spy).setReplicationRunStatusToProcessing(replicationType, lastReplicationRunTime,
          projectsInError);

      spy.replicateProjectsForRetryInitialLoad(projectReplicationStatus, replicationType, serviceOrganizationCodes);

      verify(mockIntegrationStatusRepository, times(1)).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      verify(spy, times(1)).setReplicationRunStatusToProcessing(replicationType, lastReplicationRunTime,
          projectsInError);

    }

  }

  @Nested
  @DisplayName("Tests to test the method:replicateProjectsForInitialLoad")
  public class replicateProjectsForInitialLoadTest {

    /**
     * Check when Projects for replication task are not NULL
     */
    @Test
    void whenProjectsForReplicationTaskAreNotNull() {

      int replicationType = Constants.ReplicationType.INITIAL;

      List<Project> mockProjects = new ArrayList<>();
      Project mockProject = new Project();
      mockProject.setProjectID("PRJ-001");
      mockProjects.add(mockProject);

      Set<ProjectSync> mockProjectsToSync = new HashSet<>();
      ProjectSync mockProjectToSync = ProjectSync.create();
      mockProjectToSync.setProject("PRJ-001");
      mockProjectsToSync.add(mockProjectToSync);

      Set<ProjectSync> mockExistingInitialLoadProjects = new HashSet<>();
      ProjectSync mockExistingInitialLoadProject = ProjectSync.create();
      mockExistingInitialLoadProject.setProject("PRJ-002");
      mockExistingInitialLoadProjects.add(mockExistingInitialLoadProject);

      ReplicationService spy = Mockito.spy(cut);

      doReturn(mockProjects).when(spy).getAllProjectsForReplicationTask(any());
      doReturn(mockProjectsToSync).when(spy).transformProjectToProjectSync(mockProjects, replicationType);
      doReturn(null).when(spy).getMaxChangedOn(mockProjects);
      doNothing().when(spy).setReplicationRunStatusToProcessing(replicationType, null, mockProjectsToSync);

      spy.replicateProjectsForInitialLoad(any());

      verify(spy, times(1)).getAllProjectsForReplicationTask(any());
      verify(spy, times(1)).transformProjectToProjectSync(mockProjects, replicationType);
      verify(spy, times(1)).setReplicationRunStatusToProcessing(replicationType, null, mockProjectsToSync);

    }

    /**
     * Check when Projects for replication task are NULL
     */
    @Test
    void whenProjectsForReplicationTaskAreNull() {

      int replicationType = Constants.ReplicationType.INITIAL;

      List<Project> mockProjects = new ArrayList<>();

      ReplicationService spy = Mockito.spy(cut);

      doReturn(mockProjects).when(spy).getAllProjectsForReplicationTask(any());

      spy.replicateProjectsForInitialLoad(any());

      verify(spy, times(1)).getAllProjectsForReplicationTask(any());
      verify(spy, times(0)).transformProjectToProjectSync(mockProjects, replicationType);
      verify(spy, times(0)).setReplicationRunStatusToProcessing(anyInt(), any(), any());

    }

  }

  @Nested
  @DisplayName("Tests to test the method:replicateProjectsForDeltaLoad")
  public class replicateProjectsForDeltaLoadTest {

    /**
     * Check whether all the methods triggered successfully in case of DELTA load
     * with some projects in error state and some new projects scenario
     */
    @Test
    void runDeltaLoadForProjectsInErrorStateAndNewProjectsScenario() {

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks mockProjectReplicationTask1 = ProjectReplicationTasks.create();
      mockProjectReplicationTask1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(mockProjectReplicationTask1);

      ProjectReplicationTasks mockProjectReplicationTasks2 = ProjectReplicationTasks.create();
      mockProjectReplicationTasks2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(mockProjectReplicationTasks2);

      ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
      projectReplicationStatus.setTypeCode(Constants.ReplicationType.DELTA);
      projectReplicationStatus.setStatusCode(Constants.RunStatus.ERROR);
      projectReplicationStatus.setStartTime(Instant.now());

      Set<ProjectSync> projectsInError = new HashSet<>();
      ProjectSync errorProject = ProjectSync.create();
      errorProject.setProject("PRJ-002");
      projectsInError.add(errorProject);

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSyncs.add(projectSync);

      List<Project> projects = new ArrayList<>();
      Project project = new Project();
      project.setProjectID("PRJ-001");
      projects.add(project);

      List<Project> filteredProjects = new ArrayList<>();
      filteredProjects.addAll(projects);

      List<String> serviceOrganizationCodes = new ArrayList<>();
      serviceOrganizationCodes.add("1010");
      serviceOrganizationCodes.add("1710");

      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime lastReplicationRunTime = projectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

      ReplicationService spy = Mockito.spy(cut);

      doReturn(projectsInError).when(mockIntegrationStatusRepository).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      doReturn(projects).when(spy).getAllProjects(any());
      doReturn(filteredProjects).when(spy).getFilteredProjects(mockProjectReplicationTasks, projects);
      doReturn(projectSyncs).when(spy).transformProjectToProjectSync(projects, replicationType);
      doReturn(lastReplicationRunTime).when(spy).getMaxChangedOn(projects);

      spy.replicateProjectsForDeltaLoad(projectReplicationStatus, replicationType, lastReplicationRunTime,
          mockProjectReplicationTasks);

      verify(mockIntegrationStatusRepository, times(1)).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      verify(spy, times(1)).transformProjectToProjectSync(projects, replicationType);
      verify(spy, times(1)).setReplicationRunStatusToProcessing(replicationType, lastReplicationRunTime, projectSyncs);
      verify(spy, times(1)).getFilteredProjects(mockProjectReplicationTasks, projects);
    }

    @Test
    void runDeltaLoadForReplicationInErrorStateWithNoProjectsInErrorState() {

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks mockProjectReplicationTask1 = ProjectReplicationTasks.create();
      mockProjectReplicationTask1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(mockProjectReplicationTask1);

      ProjectReplicationTasks mockProjectReplicationTasks2 = ProjectReplicationTasks.create();
      mockProjectReplicationTasks2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(mockProjectReplicationTasks2);

      ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
      projectReplicationStatus.setTypeCode(Constants.ReplicationType.DELTA);
      projectReplicationStatus.setStatusCode(Constants.RunStatus.ERROR);
      projectReplicationStatus.setStartTime(Instant.now());

      Set<ProjectSync> projectsInError = null;

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSyncs.add(projectSync);

      List<Project> projects = new ArrayList<>();
      Project project = new Project();
      project.setProjectID("PRJ-001");
      projects.add(project);

      List<Project> filteredProjects = new ArrayList<>();
      filteredProjects.addAll(projects);

      List<String> serviceOrganizationCodes = new ArrayList<>();
      serviceOrganizationCodes.add("1010");
      serviceOrganizationCodes.add("1710");

      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime lastReplicationRunTime = projectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

      ReplicationService spy = Mockito.spy(cut);

      doReturn(projectsInError).when(mockIntegrationStatusRepository).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      doReturn(projects).when(spy).getAllProjects(any());
      doReturn(filteredProjects).when(spy).getFilteredProjects(mockProjectReplicationTasks, projects);
      doReturn(projectSyncs).when(spy).transformProjectToProjectSync(projects, replicationType);
      doReturn(lastReplicationRunTime).when(spy).getMaxChangedOn(projects);

      spy.replicateProjectsForDeltaLoad(projectReplicationStatus, replicationType, lastReplicationRunTime,
          mockProjectReplicationTasks);

      verify(mockIntegrationStatusRepository, times(1)).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      verify(spy, times(1)).transformProjectToProjectSync(projects, replicationType);
      verify(spy, times(1)).setReplicationRunStatusToProcessing(replicationType, lastReplicationRunTime, projectSyncs);
      verify(spy, times(1)).getFilteredProjects(mockProjectReplicationTasks, projects);
    }

    /**
     * Check whether all the methods triggered successfully in case of DELTA load
     * for projects in error state scenario
     */
    @Test
    void runDeltaLoadForProjectsInErrorStateScenario() {

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks mockProjectReplicationTask1 = ProjectReplicationTasks.create();
      mockProjectReplicationTask1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(mockProjectReplicationTask1);

      ProjectReplicationTasks mockProjectReplicationTask2 = ProjectReplicationTasks.create();
      mockProjectReplicationTask2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(mockProjectReplicationTask2);

      ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
      projectReplicationStatus.setTypeCode(Constants.ReplicationType.DELTA);
      projectReplicationStatus.setStatusCode(Constants.RunStatus.ERROR);
      projectReplicationStatus.setStartTime(Instant.now());

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSyncs.add(projectSync);

      List<Project> projects = new ArrayList<>();
      Project project = new Project();
      project.setProjectID("PRJ-001");
      projects.add(project);

      List<Project> projectsToLoad = new ArrayList<>();

      List<Project> filteredProjects = new ArrayList<>();
      filteredProjects.addAll(projectsToLoad);

      List<String> serviceOrganizationCodes = new ArrayList<>();
      serviceOrganizationCodes.add("1010");
      serviceOrganizationCodes.add("1710");

      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime lastReplicationRunTime = projectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

      ReplicationService spy = Mockito.spy(cut);

      doReturn(projectSyncs).when(mockIntegrationStatusRepository).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      doReturn(projectsToLoad).when(spy).getAllProjects(any());
      doReturn(filteredProjects).when(spy).getFilteredProjects(mockProjectReplicationTasks, projects);

      spy.replicateProjectsForDeltaLoad(projectReplicationStatus, replicationType, lastReplicationRunTime,
          mockProjectReplicationTasks);

      verify(mockIntegrationStatusRepository, times(1)).getErrorProjectsInprocess(replicationType,
          serviceOrganizationCodes);
      verify(spy, times(1)).getAllProjects(any());
      verify(spy, times(1)).getFilteredProjects(mockProjectReplicationTasks, projectsToLoad);
      verify(spy, times(1)).setReplicationRunStatusToProcessing(replicationType, lastReplicationRunTime, projectSyncs);
    }

    /**
     * Check if reading projects from S4 throws error
     */
    @Test
    void readS4ProjectThrowsErrorHandled() {

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks mockProjectReplicationTask1 = ProjectReplicationTasks.create();
      mockProjectReplicationTask1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(mockProjectReplicationTask1);

      ProjectReplicationTasks mockProjectReplicationTask2 = ProjectReplicationTasks.create();
      mockProjectReplicationTask2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(mockProjectReplicationTask2);

      ProjectReplicationStatus projectReplicationStatus = null;
      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime lastReplicationRunTime = ZonedDateTime.now();

      ServiceException exception = new ServiceException("Error occured while getting projectlist from S/4 ");

      ReplicationService spy = Mockito.spy(cut);

      doThrow(exception).when(spy).getAllProjects(any());

      final ServiceException e = assertThrows(ServiceException.class,
          () -> spy.replicateProjectsForDeltaLoad(projectReplicationStatus, replicationType, lastReplicationRunTime,
              mockProjectReplicationTasks));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Tests to test the method:replicateProjectTree")
  public class replicateProjectTree {

    /**
     * Check whether external methods triggered successfully in case of INITIAL load
     */
    @Test
    void initialLoadScenario() {

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectToProcess = ProjectSync.create();
      projectToProcess.setProject("PRJ-001");
      projectSyncs.add(projectToProcess);

      List<Project> projects = new ArrayList<>();
      Project project = new Project();
      project.setProjectID("PRJ-001");
      projects.add(project);

      int replicationType = Constants.ReplicationType.INITIAL;

      ReplicationService spy = Mockito.spy(cut);

      doReturn(project).when(mockS4Client).getProjectTree("PRJ-001");

      spy.replicateProjectTree(replicationType, projectToProcess, true);

      verify(mockS4Client, times(1)).getProjectTree("PRJ-001");
      verify(spy, times(1)).insertProjectInRm(any());
      verify(mockTransformS4ProjectToRM, times(1)).transformProjectHierarchy(project, true);
      verify(mockIntegrationStatusRepository, times(1)).updateProjectSyncStatus(projectToProcess);

    }

    /**
     * Check whether external methods triggered successfully in case of DELTA load
     * with newly created projects in S4
     */
    @Test
    void deltaLoadScenarioWithNewlyCreatedProjectinS4() {

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectToProcess = ProjectSync.create();
      projectToProcess.setProject("PRJ-001");
      projectSyncs.add(projectToProcess);

      List<Project> projects = new ArrayList<>();
      Project project = new Project();
      project.setProjectID("PRJ-001");
      projects.add(project);

      int replicationType = Constants.ReplicationType.DELTA;

      ReplicationService spy = Mockito.spy(cut);

      doReturn(project).when(mockS4Client).getProjectTree("PRJ-001");
      doReturn(null).when(spy).getProjectTreeFromRM(project.getProjectID());

      spy.replicateProjectTree(replicationType, projectToProcess, true);

      verify(mockS4Client, times(1)).getProjectTree("PRJ-001");
      verify(spy, times(1)).getProjectTreeFromRM(project.getProjectID());
      verify(spy, times(1)).insertProjectInRm(any());
      verify(mockTransformS4ProjectToRM, times(1)).transformProjectHierarchy(project, true);
      verify(mockIntegrationStatusRepository, times(1)).updateProjectSyncStatus(projectToProcess);

    }

    /**
     * Check whether external methods triggered successfully in case of DELTA load
     * that has to update project with changed fields scenario
     */
    @Test
    void deltaLoadScenarioToUpdateProjectWithChangedFields() {

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectToProcess = ProjectSync.create();
      projectToProcess.setProject("PRJ-001");
      projectSyncs.add(projectToProcess);

      List<Project> projects = new ArrayList<>();
      Project project = new Project();
      project.setProjectID("PRJ-001");
      projects.add(project);

      Projects rmProject = Projects.create();
      rmProject.setId("PRJ-001");

      int replicationType = Constants.ReplicationType.DELTA;

      ReplicationService spy = Mockito.spy(cut);

      doReturn(project).when(mockS4Client).getProjectTree("PRJ-001");
      doReturn(rmProject).when(spy).getProjectTreeFromRM(project.getProjectID());

      spy.replicateProjectTree(replicationType, projectToProcess, true);

      verify(mockS4Client, times(1)).getProjectTree("PRJ-001");
      verify(spy, times(1)).getProjectTreeFromRM(project.getProjectID());
      verify(mockDetermineChange, times(1)).compareAndChange(project, rmProject, true);
      verify(mockIntegrationStatusRepository, times(1)).updateProjectSyncStatus(projectToProcess);

    }

  }

  @Nested
  @DisplayName("Tests to test the method:projectsDeletion")
  public class projectsDeletionTest {

    @Test
    void projetsDeletionCheck() {
      Set<ProjectSync> projectsSync = new HashSet<>();
      ReplicationService spy = Mockito.spy(cut);

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      item1.setReferenceDate(LocalDate.of(2020, 01, 01));
      mockProjectReplicationTasks.add(item1);

      ProjectReplicationTasks item2 = ProjectReplicationTasks.create();
      item2.setServiceOrganizationCode("1710");
      item2.setReferenceDate(LocalDate.of(2020, 01, 01));
      mockProjectReplicationTasks.add(item2);

      List<Project> mockAllProjects = new ArrayList<>();

      Project project1 = new Project();
      project1.setOrgID("1010");
      mockAllProjects.add(project1);

      Project project2 = new Project();
      project2.setOrgID("1710");
      mockAllProjects.add(project2);

      Project project3 = new Project();
      project3.setOrgID("1510");
      mockAllProjects.add(project3);

      Project project4 = new Project();
      project4.setOrgID("1010");
      mockAllProjects.add(project4);

      List<Project> expectedFilteredProjectsList = new ArrayList<>();
      expectedFilteredProjectsList.add(project1);
      expectedFilteredProjectsList.add(project2);

      List<Project> mockFilteredProjectsList = new ArrayList<>();
      mockFilteredProjectsList.add(project1);
      mockFilteredProjectsList.add(project2);
      mockFilteredProjectsList.add(project3);

      doReturn(mockAllProjects).when(spy).getAllProjects(any());
      doReturn(mockFilteredProjectsList).when(spy).getFilteredProjects(mockProjectReplicationTasks, mockAllProjects);
      doNothing().when(spy).setReplicationRunStatusToProcessing(ReplicationType.DELETE, null, projectsSync);
      doNothing().when(mockDetermineChange).deleteProjects(anyList(), anyList());

      spy.projectsDeletion(ReplicationType.DELETE, mockProjectReplicationTasks, projectsSync);

      verify(spy, times(1)).getAllProjects(any());
      verify(mockDetermineChange, times(1)).deleteProjects(anyList(), anyList());
      verify(spy, times(1)).setReplicationRunStatusToProcessing(ReplicationType.DELETE, null, projectsSync);

    }

  }

  @Nested
  @DisplayName("Tests to test the method:supplyDemand")
  public class supplyDemandTest {
    /**
     * Check when there are no ResourceSuppliesForDemand from S4
     */
    @Test
    void noResourceSuppliesFromS4Scenario() {

      SupplySyncDetails supplyDetails = Struct.create(SupplySyncDetails.class);
      supplyDetails.setWorkPackage("dummyWP");
      supplyDetails.setResourceDemand("dummyDemandExternalId");
      List<SupplySyncDetails> supplyDetailsList = new ArrayList<>();
      supplyDetailsList.add(supplyDetails);
      doReturn(null).when(mockS4Client).getResourceSuppliesForDemand(any(), any());

      ReplicationService spy = Mockito.spy(cut);

      spy.supplyDemand(supplyDetails);

      verify(mockAssignmentService, times(0)).createAssignment(null);
      verify(mockAssignmentService, times(1)).deleteDemandFromSupplySyncTable(supplyDetails);
    }

    /**
     * Check when there are some ResourceSuppliesForDemand from S4
     */
    @Test
    void resourceSuppliesFromS4Scenario() {

      SupplySyncDetails supplyDetails = Struct.create(SupplySyncDetails.class);
      supplyDetails.setWorkPackage("dummyWP");
      supplyDetails.setResourceDemand("dummyDemandExternalId");
      List<EngmntProjRsceSup> resourceSuppliesFromS4 = new ArrayList<>();
      EngmntProjRsceSup supply1 = new EngmntProjRsceSup();
      resourceSuppliesFromS4.add(supply1);

      doReturn(resourceSuppliesFromS4).when(mockS4Client).getResourceSuppliesForDemand(any(), any());

      ReplicationService spy = Mockito.spy(cut);

      spy.supplyDemand(supplyDetails);

      verify(mockAssignmentService, times(1)).createAssignment(resourceSuppliesFromS4);
      verify(mockAssignmentService, times(1)).deleteDemandFromSupplySyncTable(supplyDetails);

    }

    /**
     * Check that no side effects when invalid demand found in SuppySync table
     */
    @Test
    void invalidDemandInSupplySyncLeadsToNoSideEffects() {

      SupplySyncDetails supplyDetails = Struct.create(SupplySyncDetails.class);
      supplyDetails.setDemand("InvalidDemandId");
      List<EngmntProjRsceSup> resourceSuppliesFromS4 = new ArrayList<>();
      EngmntProjRsceSup supply1 = new EngmntProjRsceSup();
      resourceSuppliesFromS4.add(supply1);

      doReturn(resourceSuppliesFromS4).when(mockS4Client).getResourceSuppliesForDemand(any(), any());

      ReplicationService spy = Mockito.spy(cut);

      spy.supplyDemand(supplyDetails);

      verify(mockAssignmentService, times(0)).createAssignment(resourceSuppliesFromS4);
      verify(mockAssignmentService, times(0)).deleteDemandFromSupplySyncTable(supplyDetails);

    }
  }

  @Nested
  @DisplayName("Tests to test the method:setReplicationStatustoClosed")
  public class setReplicationStatustoClosedTest {

    /**
     * Check whether updateProjectReplicationStatus method is triggered successfully
     */
    @Test
    void setReplicationStatustoClosedSuccessfulScenario() {

      int replicationType = ReplicationType.DELTA;

      ReplicationService spy = Mockito.spy(cut);

      doNothing().when(spy).updateProjectReplicationStatus(Constants.RunStatus.CLOSED, replicationType);

      spy.setReplicationStatustoClosed(replicationType);

      verify(spy, times(1)).updateProjectReplicationStatus(Constants.RunStatus.CLOSED, replicationType);

    }

    /**
     * Check when setReplicationStatustoClosed method throws Service Exception
     */
    @Test
    void setReplicationStatustoClosedRaisesServiceExceptionScenario() {

      int replicationType = ReplicationType.DELTA;

      ServiceException serviceException = new ServiceException(
          "Error occured while setting replication status to Closed");

      ReplicationService spy = Mockito.spy(cut);

      doThrow(serviceException).when(spy).updateProjectReplicationStatus(Constants.RunStatus.CLOSED, replicationType);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.setReplicationStatustoClosed(replicationType));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

    /**
     * Check when setReplicationStatustoClosed method throws Exception Other than
     * Service Exception
     */
    @Test
    void setReplicationStatustoClosedRaisesExceptionOtherThanServiceExceptionScenario() {

      int replicationType = ReplicationType.DELTA;

      NullPointerException e = new NullPointerException("Error occured while setting replication status to Closed");

      ReplicationService spy = Mockito.spy(cut);

      doThrow(e).when(spy).updateProjectReplicationStatus(Constants.RunStatus.CLOSED, replicationType);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.setReplicationStatustoClosed(replicationType));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }
  }

  @Nested
  @DisplayName("Tests to test the method:getFilteredProjects")
  public class getFilteredProjectsTest {

    @Test
    void getFilteredProjectsCheck() {

      LocalDate mockReferenceDate = LocalDate.of(2020, 01, 01);
      LocalDateTime mockReferenceDateTime = mockReferenceDate.atTime(0, 00, 0);

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      item1.setReferenceDate(LocalDate.of(2020, 01, 01));
      mockProjectReplicationTasks.add(item1);

      ProjectReplicationTasks item2 = ProjectReplicationTasks.create();
      item2.setServiceOrganizationCode("1710");
      item2.setReferenceDate(LocalDate.of(2020, 01, 01));
      mockProjectReplicationTasks.add(item2);

      List<Project> mockAllProjects = new ArrayList<>();

      Project project1 = new Project();
      project1.setOrgID("1010");
      project1.setEndDate(mockReferenceDateTime);
      mockAllProjects.add(project1);

      Project project2 = new Project();
      project2.setOrgID("1710");
      project2.setEndDate(mockReferenceDateTime);
      mockAllProjects.add(project2);

      Project project3 = new Project();
      project3.setOrgID("1510");
      project3.setEndDate(mockReferenceDateTime);
      mockAllProjects.add(project3);

      Project project4 = new Project();
      project4.setOrgID("1010");
      project4.setEndDate(LocalDate.of(2019, 01, 01).atTime(0, 00, 0));
      mockAllProjects.add(project4);

      List<Project> expectedFilteredProjectsList = new ArrayList<>();
      expectedFilteredProjectsList.add(project1);
      expectedFilteredProjectsList.add(project2);

      List<Project> actualFilteredProjectsList = new ArrayList<>();

      ReplicationService spy = Mockito.spy(cut);
      actualFilteredProjectsList = spy.getFilteredProjects(mockProjectReplicationTasks, mockAllProjects);

      assertEquals(expectedFilteredProjectsList, actualFilteredProjectsList);

    }
  }

  @Nested
  @DisplayName("Tests to test the method:getProjectReplicationTaskBasedonTaskStatusCode")
  public class getProjectReplicationTaskBasedonTaskStatusCodeTest {

    @Test
    void getProjectReplicationTaskBasedonTaskStatusCodeSuccessfulScenario() {
      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();
      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      item1.setTaskStatusCode(Constants.RunStatus.COMPLETED);
      mockProjectReplicationTasks.add(item1);

      List<ProjectReplicationTasks> actualProjectReplicationFilters;

      doReturn(mockProjectReplicationTasks).when(mockProjectReplicationTasksRepository)
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      ReplicationService spy = Mockito.spy(cut);
      actualProjectReplicationFilters = spy
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      verify(mockProjectReplicationTasksRepository, times(1))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      assertEquals(mockProjectReplicationTasks, actualProjectReplicationFilters);

    }

    @Test
    void getProjectReplicationTaskBasedonTaskStatusCodeThrowsExceptionScenario() {

      int status = Constants.RunStatus.COMPLETED;

      ServiceException serviceException = new ServiceException(
          "Failed in getting Service Organizations by initial load status");

      doThrow(serviceException).when(mockProjectReplicationTasksRepository)
          .getProjectReplicationTaskBasedonTaskStatusCode(status);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getProjectReplicationTaskBasedonTaskStatusCode(status));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Tests to test the method:createDeltaAndDeleteJob")
  public class createDeltaAndDeleteJobTest {

    /**
     * Check whether all external methods triggered successfully for no delta record
     * exists scenario and Initial replication status is COMPLETED
     */

    @Test
    void noDeltaRecordExistingScenarioWithInitialReplicationStatusCompleted() {
      ProjectReplicationStatus mockProjectReplicationDelta = null;
      ProjectReplicationStatus mockProjectReplicationInitial = ProjectReplicationStatus.create();
      mockProjectReplicationInitial.setStatusCode(Constants.RunStatus.COMPLETED);

      doReturn(mockProjectReplicationDelta).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      doReturn(mockProjectReplicationInitial).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(null).when(mockXsuaaUserInfo).getSubDomain();
      doReturn(null).when(mockXsuaaUserInfo).getTenant();

      cut.createDeltaAndDeleteJob();

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      verify(mockXsuaaUserInfo, times(1)).getSubDomain();
      verify(mockXsuaaUserInfo, times(1)).getTenant();
      verify(mockJobSchedulerService, times(1)).createDeltaAndDeleteJob(null, null);

    }

    /**
     * Check whether all external methods triggered successfully for no delta record
     * exists scenario and Initial replication status is not COMPLETED
     */

    @Test
    void noDeltaRecordExistingScenarioWithInitialReplicationStatusAsProcessing() {
      ProjectReplicationStatus mockProjectReplicationDelta = null;
      ProjectReplicationStatus mockProjectReplicationInitial = ProjectReplicationStatus.create();
      mockProjectReplicationInitial.setStatusCode(Constants.RunStatus.PROCESSING);

      doReturn(mockProjectReplicationDelta).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      doReturn(mockProjectReplicationInitial).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);

      cut.createDeltaAndDeleteJob();

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      verify(mockXsuaaUserInfo, times(0)).getSubDomain();
      verify(mockXsuaaUserInfo, times(0)).getTenant();
      verify(mockJobSchedulerService, times(0)).createDeltaAndDeleteJob(null, null);

    }

    /**
     * Check for delta record exists scenario
     */

    @Test
    void deltaRecordExistingScenario() {
      ProjectReplicationStatus mockProjectReplicationDelta = ProjectReplicationStatus.create();

      doReturn(mockProjectReplicationDelta).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.DELTA);

      cut.createDeltaAndDeleteJob();

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
      verify(mockIntegrationStatusRepository, times(0)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      verify(mockXsuaaUserInfo, times(0)).getSubDomain();
      verify(mockXsuaaUserInfo, times(0)).getTenant();

    }

    /**
     * Check if Exception is handled
     */

    @Test
    void deltaJobCreationFailureScenario() {

      ServiceException serviceException = new ServiceException("Failed in creating delta and delete job");

      doThrow(serviceException).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.DELTA);

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.createDeltaAndDeleteJob());

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

}
