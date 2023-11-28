package com.sap.c4p.rm.projectintegrationadapter.controller;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.time.Instant;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.sap.cds.Struct;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;

import com.sap.c4p.rm.projectintegrationadapter.model.ProjectReplicationTask;
import com.sap.c4p.rm.projectintegrationadapter.repository.IntegrationStatusRepository;
import com.sap.c4p.rm.projectintegrationadapter.service.AssignmentService;
import com.sap.c4p.rm.projectintegrationadapter.service.ReplicationService;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants.ReplicationType;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessage;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessage.Severity;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessageImpl;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessages;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationResponseEntity;

import com.sap.resourcemanagement.config.ProjectReplicationTasks;
import com.sap.resourcemanagement.integration.ProjectReplicationStatus;
import com.sap.resourcemanagement.integration.ProjectSync;
import com.sap.resourcemanagement.integration.SupplySyncDetails;

@DisplayName("Unit test for Initial Load class")
public class ProjectReplicationControllerTest {

  /**
   * Class under test
   */

  public ProjectReplicationController cut;

  /**
   * mock object
   */
  @Mock
  public ReplicationService mockReplicationService;
  @Mock
  public IntegrationStatusRepository mockIntegrationStatusRepository;
  @Mock
  public AssignmentService mockAssignmentService;
  @Mock
  public ProjectReplicationStatus mockProjectReplicationInitial;
  @Mock
  public ProjectReplicationStatus mockProjectReplicationDelete;

  @Mock
  public ReplicationMessages mockMessages;

  public List<Project> projects = new ArrayList<>();
  public Project s4Project1 = new Project();
  public Project s4Project2 = new Project();

  @BeforeEach
  public void setUp() {

    MockitoAnnotations.initMocks(this);
    s4Project1.setProjectID("project1");
    s4Project2.setProjectID("project2");
    projects.add(s4Project1);
    projects.add(s4Project2);

    cut = new ProjectReplicationController(mockReplicationService, mockIntegrationStatusRepository,
        mockAssignmentService, mockMessages);
  }

  @Nested
  @DisplayName("Unit Test for doDeltaLoad method")
  class doDeltaLoad {

    /**
     * verify all the external methods triggered and the project replication status
     * is updated accordingly during delta load when deltaReplicationStatus is NULL.
     */
    @Test
    void deltaLoadReplicationStatusNullScenario() {

      ProjectReplicationStatus initialProjectReplicationStatus = ProjectReplicationStatus.create();
      initialProjectReplicationStatus.setTypeCode(Constants.ReplicationType.INITIAL);
      initialProjectReplicationStatus.setStartTime(Instant.now());

      ProjectReplicationStatus deltaProjectReplicationStatus = null;

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(item1);

      ProjectReplicationTasks item2 = ProjectReplicationTasks.create();
      item2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(item2);

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSyncs.add(projectSync);

      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime mockLastReplicationRunTime = initialProjectReplicationStatus.getStartTime()
          .atZone(ZoneId.of("UTC"));

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(initialProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(deltaProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.DELTA);
      doNothing().when(spy).processAllProjectsFromProjectSync(anyInt(), anyMap());

      spy.doDeltaLoad(mockProjectReplicationTasks);

      verify(mockReplicationService, times(1)).replicateProjectsForDeltaLoad(deltaProjectReplicationStatus,
          replicationType, mockLastReplicationRunTime, mockProjectReplicationTasks);
      verify(mockReplicationService, times(2)).getProjectReplicationStatus(anyInt());
      verify(mockReplicationService, times(1)).setReplicationStatustoClosed(anyInt());
      verify(spy, times(1)).processAllProjectsFromProjectSync(anyInt(), anyMap());

    }

    /**
     * verify all the external methods triggered in doDeltaLoad method when initial
     * load status is COMPLETED.
     */
    @Test
    void initialLoadRunStatusCompletedScenario() {

      ProjectReplicationStatus initialProjectReplicationStatus = ProjectReplicationStatus.create();
      initialProjectReplicationStatus.setTypeCode(Constants.ReplicationType.INITIAL);
      initialProjectReplicationStatus.setStartTime(Instant.now());
      initialProjectReplicationStatus.setStatusCode(Constants.RunStatus.COMPLETED);

      ProjectReplicationStatus deltaProjectReplicationStatus = ProjectReplicationStatus.create();
      deltaProjectReplicationStatus.setTypeCode(Constants.ReplicationType.DELTA);
      deltaProjectReplicationStatus.setStartTime(Instant.now());

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(item1);

      ProjectReplicationTasks item2 = ProjectReplicationTasks.create();
      item2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(item2);

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSyncs.add(projectSync);

      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime mockLastReplicationRunTime = initialProjectReplicationStatus.getStartTime()
          .atZone(ZoneId.of("UTC"));

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(initialProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(deltaProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.DELTA);
      doNothing().when(spy).processAllProjectsFromProjectSync(anyInt(), anyMap());

      spy.doDeltaLoad(mockProjectReplicationTasks);

      verify(mockReplicationService, times(1)).replicateProjectsForDeltaLoad(deltaProjectReplicationStatus,
          replicationType, mockLastReplicationRunTime, mockProjectReplicationTasks);
      verify(mockReplicationService, times(2)).getProjectReplicationStatus(anyInt());
      verify(mockReplicationService, times(1)).setReplicationStatustoClosed(anyInt());
      verify(spy, times(1)).processAllProjectsFromProjectSync(anyInt(), anyMap());

    }

    /**
     * verify all the external methods triggered and the project replication status
     * is updated accordingly in doDeltaLoad method when initial load status is
     * CLOSED.
     */
    @Test
    void initialLoadRunStatusClosedScenario() {

      ProjectReplicationStatus initialProjectReplicationStatus = ProjectReplicationStatus.create();
      initialProjectReplicationStatus.setTypeCode(Constants.ReplicationType.INITIAL);
      initialProjectReplicationStatus.setStartTime(Instant.now());
      initialProjectReplicationStatus.setStatusCode(Constants.RunStatus.CLOSED);

      ProjectReplicationStatus deltaProjectReplicationStatus = ProjectReplicationStatus.create();
      deltaProjectReplicationStatus.setTypeCode(Constants.ReplicationType.DELTA);
      deltaProjectReplicationStatus.setStartTime(Instant.now());

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(item1);

      ProjectReplicationTasks item2 = ProjectReplicationTasks.create();
      item2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(item2);

      List<String> mockServiceOrganizationCodes = new ArrayList<>();
      mockServiceOrganizationCodes.add("1010");
      mockServiceOrganizationCodes.add("1710");

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSyncs.add(projectSync);

      int replicationType = Constants.ReplicationType.DELTA;
      ZonedDateTime mockLastReplicationRunTime = deltaProjectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(initialProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(deltaProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.DELTA);
      doNothing().when(spy).processAllProjectsFromProjectSync(anyInt(), anyMap());

      spy.doDeltaLoad(mockProjectReplicationTasks);

      verify(mockReplicationService, times(1)).replicateProjectsForDeltaLoad(deltaProjectReplicationStatus,
          replicationType, mockLastReplicationRunTime, mockProjectReplicationTasks);
      verify(mockReplicationService, times(2)).getProjectReplicationStatus(anyInt());
      verify(spy, times(1)).processAllProjectsFromProjectSync(anyInt(), anyMap());
      verify(mockReplicationService, times(0)).setReplicationStatustoClosed(anyInt());
    }

  }

  @Nested
  @DisplayName("Unit Test onDelete method")
  class onDeleteProjects {

    /**
     * Validate the the deleteProjects triggered
     */

    @Test
    void deleteProjectsSuccessfullyTriggered() {

      String message = "Projects Deletion Trigger is completed";

      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected, HttpStatus.OK);
      ProjectReplicationController spy = Mockito.spy(cut);
      doNothing().when(spy).deleteProjects(ReplicationType.DELETE);
      ResponseEntity<ReplicationResponseEntity> returned = spy.onDeleteProjects();
      verify(spy, times(1)).deleteProjects(ReplicationType.DELETE);

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getStatus(), returned.getBody().getStatus());

    }

    /**
     * Validate the the error in triggering deleteProjects handled
     */

    @Test
    void whenErrorInTriggeringDeleteProjects() {

      String message = "Projects Deletion Trigger failed";

      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.ERROR,
          "Destination is not maintained");

      messageList.add(replicationMessage);

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected,
          HttpStatus.INTERNAL_SERVER_ERROR);

      ServiceException e = new ServiceException("Destination is not maintained");
      ProjectReplicationController spy = Mockito.spy(cut);
      doReturn(messageList).when(mockMessages).getErrorMessages();
      doThrow(e).when(spy).deleteProjects(ReplicationType.DELETE);

      ResponseEntity<ReplicationResponseEntity> returned = spy.onDeleteProjects();

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getDetails().get(0).getMessage(),
          returned.getBody().getDetails().get(0).getMessage());

    }

  }

  @Nested
  @DisplayName("Unit Test onReplicateS4ProjectsDeltaLoad method")
  class onReplicateS4ProjectsDeltaLoad {

    /**
     * Validate the successfull trigger of onReplicateS4ProjectsDeltaLoad and
     * doDeltaLoad when service orgs with initial load status COMPLETED are not NULL
     */

    @Test
    void onReplicateS4ProjectsDeltaLoadTrigger() {

      ProjectReplicationStatus initialProjectReplicationStatus = ProjectReplicationStatus.create();
      initialProjectReplicationStatus.setTypeCode(Constants.ReplicationType.INITIAL);
      initialProjectReplicationStatus.setStatusCode(Constants.RunStatus.COMPLETED);

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(item1);

      ProjectReplicationTasks item2 = ProjectReplicationTasks.create();
      item2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(item2);

      String message = "Delta load is completed";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected, HttpStatus.OK);

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doReturn(initialProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(mockProjectReplicationTasks).when(mockReplicationService)
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      doNothing().when(spy).doDeltaLoad(mockProjectReplicationTasks);

      ResponseEntity<ReplicationResponseEntity> returned = spy.onReplicateS4ProjectsDeltaLoad();

      verify(spy, times(1)).doDeltaLoad(mockProjectReplicationTasks);
      verify(mockReplicationService, times(1)).isEligibileForReplication();
      verify(mockReplicationService, times(1)).getProjectReplicationStatus(anyInt());
      verify(mockReplicationService, times(1))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getStatus(), returned.getBody().getStatus());

    }

    /**
     * Validate the successfull trigger of onReplicateS4Projects when service orgs
     * with initial load status COMPLETED are NULL
     */

    @Test
    void onReplicateS4ProjectsTriggerWhenServiceOrgsWithInitialLoadStatusAreNull() {

      ProjectReplicationStatus initialProjectReplicationStatus = ProjectReplicationStatus.create();
      initialProjectReplicationStatus.setTypeCode(Constants.ReplicationType.INITIAL);
      initialProjectReplicationStatus.setStatusCode(Constants.RunStatus.COMPLETED);

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      String message = "No Service Organizations found with Initial load completed. Delta load will not happen";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected, HttpStatus.OK);

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doReturn(initialProjectReplicationStatus).when(mockReplicationService)
          .getProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(mockProjectReplicationTasks).when(mockReplicationService)
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      doNothing().when(spy).doDeltaLoad(mockProjectReplicationTasks);

      ResponseEntity<ReplicationResponseEntity> returned = spy.onReplicateS4ProjectsDeltaLoad();

      verify(spy, times(0)).doDeltaLoad(mockProjectReplicationTasks);
      verify(mockReplicationService, times(1)).isEligibileForReplication();
      verify(mockReplicationService, times(1)).getProjectReplicationStatus(anyInt());
      verify(mockReplicationService, times(1))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getStatus(), returned.getBody().getStatus());

    }

    /**
     * Validate when initialLoadReplicationStatus is null
     */

    @Test
    void whenInitialLoadReplicationStatusIsNull() {

      String message = "Initial load is not yet done. Delta load will not happen";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected, HttpStatus.OK);

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doReturn(null).when(mockReplicationService).getProjectReplicationStatus(Constants.ReplicationType.INITIAL);

      ResponseEntity<ReplicationResponseEntity> returned = spy.onReplicateS4ProjectsDeltaLoad();

      verify(spy, times(0)).doDeltaLoad(any());
      verify(mockReplicationService, times(1)).isEligibileForReplication();
      verify(mockReplicationService, times(1)).getProjectReplicationStatus(anyInt());
      verify(mockReplicationService, times(0))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getStatus(), returned.getBody().getStatus());

    }

    /**
     * Validate the error in triggering onReplicateS4Projects handled
     */

    @Test
    void whenErrorInTriggeringReplicateS4Projects() {

      String message = "Error occurred during project replication trigger";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.ERROR,
          "Destination is not maintained");

      messageList.add(replicationMessage);

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected,
          HttpStatus.INTERNAL_SERVER_ERROR);

      ServiceException e = new ServiceException("Destination is not maintained");
      ProjectReplicationController spy = Mockito.spy(cut);
      doThrow(e).when(mockReplicationService).isEligibileForReplication();
      doReturn(messageList).when(mockMessages).getErrorMessages();

      ResponseEntity<ReplicationResponseEntity> returned = spy.onReplicateS4ProjectsDeltaLoad();

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getDetails().get(0).getMessage(),
          returned.getBody().getDetails().get(0).getMessage());

    }

  }

  @Nested
  @DisplayName("Unit Test onReplicateS4ProjectsInitialLoad method")
  class onReplicateS4ProjectsInitialLoad {
    @Test
    void whenTaskStatusCodeIsNotError() {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");
      mockProjectReplicationTask.setServiceOrganizationCode("1010");
      mockProjectReplicationTask.setTaskStatusCode(Constants.RunStatus.PROCESSING);

      String message = "Initial Load Replication is completed";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected, HttpStatus.OK);

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doNothing().when(spy).doInitialLoad(mockProjectReplicationTask);

      ResponseEntity<ReplicationResponseEntity> returned = spy
          .onReplicateS4ProjectsInitialLoad(mockProjectReplicationTask);

      verify(spy, times(1)).doInitialLoad(mockProjectReplicationTask);
      verify(mockReplicationService, times(1)).isEligibileForReplication();
      verify(mockReplicationService, times(1)).getProjectReplicationStatus(anyInt());

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getStatus(), returned.getBody().getStatus());

    }

    @Test
    @DisplayName("When Task Status Code is Error and it was project processing error")
    void whenTaskStatusCodeIsError() {

      int replicationType = Constants.ReplicationType.INITIAL;

      List<String> mockServiceOrganizationCodes = new ArrayList<>();
      mockServiceOrganizationCodes.add("1010");
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");

      Mockito.when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.ERROR, replicationType,
          mockServiceOrganizationCodes)).thenReturn(projectSync);

      ProjectReplicationStatus mockInitialLoadReplicationStatus = ProjectReplicationStatus.create();
      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");
      mockProjectReplicationTask.setServiceOrganizationCode("1010");
      mockProjectReplicationTask.setTaskStatusCode(Constants.RunStatus.ERROR);
      String message = "Initial Load Replication is completed";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected, HttpStatus.OK);

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(mockInitialLoadReplicationStatus).when(mockReplicationService).getProjectReplicationStatus(anyInt());
      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doNothing().when(spy).retryInitialLoad(mockInitialLoadReplicationStatus, mockProjectReplicationTask);

      ResponseEntity<ReplicationResponseEntity> returned = spy
          .onReplicateS4ProjectsInitialLoad(mockProjectReplicationTask);

      verify(spy, times(1)).retryInitialLoad(mockInitialLoadReplicationStatus, mockProjectReplicationTask);
      verify(mockReplicationService, times(1)).isEligibileForReplication();
      verify(mockReplicationService, times(1)).getProjectReplicationStatus(anyInt());

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getStatus(), returned.getBody().getStatus());
    }

    @Test
    @DisplayName("When Task Status Code is Error and it was eligibility error")
    void whenTaskStatusCodeIsErrorFromEligibilityCheck() {

      int replicationType = Constants.ReplicationType.INITIAL;

      List<String> mockServiceOrganizationCodes = new ArrayList<>();
      mockServiceOrganizationCodes.add("1010");
      ProjectSync projectSync = null;

      Mockito.when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.ERROR, replicationType,
          mockServiceOrganizationCodes)).thenReturn(projectSync);

      ProjectReplicationStatus mockInitialLoadReplicationStatus = ProjectReplicationStatus.create();
      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");
      mockProjectReplicationTask.setServiceOrganizationCode("1010");
      mockProjectReplicationTask.setTaskStatusCode(Constants.RunStatus.ERROR);

      String message = "Initial Load Replication is completed";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected, HttpStatus.OK);

      ProjectReplicationController spy = Mockito.spy(cut);

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doNothing().when(spy).doInitialLoad(mockProjectReplicationTask);

      ResponseEntity<ReplicationResponseEntity> returned = spy
          .onReplicateS4ProjectsInitialLoad(mockProjectReplicationTask);

      verify(spy, times(1)).doInitialLoad(mockProjectReplicationTask);
      verify(mockReplicationService, times(1)).isEligibileForReplication();
      verify(mockReplicationService, times(1)).getProjectReplicationStatus(anyInt());

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getStatus(), returned.getBody().getStatus());
    }

    @Test
    void whenIsNotEligibleForReplicationOnActivateAction() {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");
      mockProjectReplicationTask.setServiceOrganizationCode("1010");
      mockProjectReplicationTask.setTaskStatusCode(Constants.RunStatus.PROCESSING);

      String message = "Error occurred during initial load";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.ERROR,
          "Destination is not maintained");

      messageList.add(replicationMessage);

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected,
          HttpStatus.INTERNAL_SERVER_ERROR);

      ServiceException e = new ServiceException("Destination is not maintained");
      ProjectReplicationController spy = Mockito.spy(cut);
      doThrow(e).when(mockReplicationService).isEligibileForReplication();
      doReturn(messageList).when(mockMessages).getErrorMessages();

      ResponseEntity<ReplicationResponseEntity> returned = spy
          .onReplicateS4ProjectsInitialLoad(mockProjectReplicationTask);

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getDetails().get(0).getMessage(),
          returned.getBody().getDetails().get(0).getMessage());

    }

    @Test
    void whenIsNotEligibleForReplicationOnRetryAction() {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");
      mockProjectReplicationTask.setServiceOrganizationCode("1010");
      mockProjectReplicationTask.setTaskStatusCode(Constants.RunStatus.ERROR);

      String message = "Error occurred during initial load";
      List<ReplicationMessage> messageList = new ArrayList<>();

      ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.ERROR,
          "Destination is not maintained");

      messageList.add(replicationMessage);

      ReplicationResponseEntity responseExpected = new ReplicationResponseEntity(message, messageList);
      ResponseEntity<ReplicationResponseEntity> expected = new ResponseEntity<>(responseExpected,
          HttpStatus.INTERNAL_SERVER_ERROR);

      ServiceException e = new ServiceException("Destination is not maintained");
      ProjectReplicationController spy = Mockito.spy(cut);
      doThrow(e).when(mockReplicationService).isEligibileForReplication();
      doReturn(messageList).when(mockMessages).getErrorMessages();

      ResponseEntity<ReplicationResponseEntity> returned = spy
          .onReplicateS4ProjectsInitialLoad(mockProjectReplicationTask);

      assertEquals(expected.getStatusCode(), returned.getStatusCode());
      assertEquals(expected.getBody().getDetails().get(0).getMessage(),
          returned.getBody().getDetails().get(0).getMessage());

    }

  }

  @Nested
  @DisplayName("Unit Test for deleteProjects method")
  class DeleteProjects {

    /**
     * If eligible for replication delete projects method is called
     */
    @Test
    void whenIsEligibleForReplication() {

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();
      ProjectReplicationTasks mockProjectReplicationTask = ProjectReplicationTasks.create();
      mockProjectReplicationTask.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(mockProjectReplicationTask);

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doReturn(mockProjectReplicationInitial).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationInitial).getStatusCode();
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationDelete).getStatusCode();
      doReturn(mockProjectReplicationTasks).when(mockReplicationService)
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      cut.deleteProjects(ReplicationType.DELETE);

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      verify(mockReplicationService, times(1))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      verify(mockReplicationService, times(1)).projectsDeletion(anyInt(), anyList(), anySet());
      verify(mockReplicationService, times(1)).setReplicationStatustoCompletedOrError(anyInt(), anyList());

    }

    @Test
    void whenInitialLoadReplicationStatusIsNull() {

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doReturn(null).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationInitial).getStatusCode();
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationDelete).getStatusCode();

      cut.deleteProjects(ReplicationType.DELETE);

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      verify(mockReplicationService, times(0))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      verify(mockReplicationService, times(0)).projectsDeletion(anyInt(), anyList(), anySet());
      verify(mockReplicationService, times(0)).setReplicationStatustoCompletedOrError(anyInt(), anyList());

    }

    @Test
    void whenReplicationItemsWithInitialLoadDoneAreEmpty() {

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doReturn(mockProjectReplicationInitial).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationInitial).getStatusCode();
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationDelete).getStatusCode();
      doReturn(mockProjectReplicationTasks).when(mockReplicationService)
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);

      cut.deleteProjects(ReplicationType.DELETE);

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      verify(mockReplicationService, times(1))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      verify(mockReplicationService, times(0)).projectsDeletion(anyInt(), anyList(), anySet());
      verify(mockReplicationService, times(0)).setReplicationStatustoCompletedOrError(anyInt(), anyList());

    }

    @Test
    void whenProjectsDeletionThrowsException() {

      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();
      ProjectReplicationTasks mockProjectReplicationTask = ProjectReplicationTasks.create();
      mockProjectReplicationTask.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(mockProjectReplicationTask);

      ServiceException serviceException = new ServiceException("Failed in Projects Deletion");

      doReturn(null).when(mockReplicationService).isEligibileForReplication();
      doReturn(mockProjectReplicationInitial).when(mockIntegrationStatusRepository)
          .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationInitial).getStatusCode();
      doReturn(Constants.RunStatus.COMPLETED).when(mockProjectReplicationDelete).getStatusCode();
      doReturn(mockProjectReplicationTasks).when(mockReplicationService)
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      doThrow(serviceException).when(mockReplicationService).projectsDeletion(anyInt(), anyList(), any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.deleteProjects(ReplicationType.DELETE));

      verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
      verify(mockReplicationService, times(1))
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      verify(mockReplicationService, times(1)).projectsDeletion(anyInt(), anyList(), anySet());
      verify(mockReplicationService, times(1)).setReplicationStatustoCompletedOrError(anyInt(), anyList());
      assertEquals(serviceException.getMessage(), exception.getMessage());

    }
  }

  @Nested
  @DisplayName("Unit Test for doInitialLoad method")
  class doInitialLoadTest {

    @Test
    @DisplayName("Junit to check whether all external methods triggered successfully")
    void doInitialLoadSuccessfulScenario() {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setServiceOrganizationCode("1010");

      ProjectReplicationController spy = Mockito.spy(cut);
      doNothing().when(spy).processAllProjectsFromProjectSync(anyInt(), anyMap());
      doReturn(ProjectReplicationTasks.create()).when(spy).getDbEntityFromPayload(any());
      spy.doInitialLoad(mockProjectReplicationTask);

      verify(mockReplicationService, times(1)).replicateProjectsForInitialLoad(mockProjectReplicationTask);
      verify(spy, times(1)).processAllProjectsFromProjectSync(anyInt(), anyMap());

    }

    @Test
    @DisplayName("Junit to check if Exceptions handled")
    void doInitialLoadThrowsExceptionScenario() {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setServiceOrganizationCode("1010");

      ServiceException serviceException = new ServiceException("Error occured during the initial load");
      ProjectReplicationController spy = Mockito.spy(cut);
      doReturn(ProjectReplicationTasks.create()).when(spy).getDbEntityFromPayload(any());
      doThrow(serviceException).when(mockReplicationService)
          .replicateProjectsForInitialLoad(mockProjectReplicationTask);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.doInitialLoad(mockProjectReplicationTask));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }
  }

  @Nested
  @DisplayName("Unit Test for retryInitialLoad method")
  class retryInitialLoadTest {

    @Test
    @DisplayName("Junit to check whether all external methods triggered successfully")
    void retryInitialLoadSuccessfulScenario() {

      ProjectReplicationStatus mockProjectReplicationStatus = ProjectReplicationStatus.create();
      ProjectReplicationTask servOrg1 = new ProjectReplicationTask();
      servOrg1.setServiceOrganizationCode("1010");

      ProjectReplicationController spy = Mockito.spy(cut);
      doNothing().when(spy).processAllProjectsFromProjectSync(anyInt(), anyMap());
      doReturn(ProjectReplicationTasks.create()).when(spy).getDbEntityFromPayload(any());
      spy.retryInitialLoad(mockProjectReplicationStatus, servOrg1);

      verify(mockReplicationService, times(1)).replicateProjectsForRetryInitialLoad(any(), anyInt(), anyList());
      verify(spy, times(1)).processAllProjectsFromProjectSync(anyInt(), anyMap());
    }

    @Test
    @DisplayName("Junit to check if Exceptions handled")
    void retryInitialLoadThrowsExceptionScenario() {

      ProjectReplicationStatus mockProjectReplicationStatus = ProjectReplicationStatus.create();
      ProjectReplicationTask projectReplicationTask = new ProjectReplicationTask();
      projectReplicationTask.setServiceOrganizationCode("");

      ServiceException serviceException = new ServiceException("Error occured while retrying initial load");
      ProjectReplicationController spy = Mockito.spy(cut);
      doReturn(ProjectReplicationTasks.create()).when(spy).getDbEntityFromPayload(any());
      doThrow(serviceException).when(mockReplicationService).replicateProjectsForRetryInitialLoad(any(), anyInt(),
          anyList());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.retryInitialLoad(mockProjectReplicationStatus, projectReplicationTask));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for replicateExistingSupplyLineItemsForNewlyPublishedRequests method")
  class replicateExistingSupplyLineItemsForNewlyPublishedRequestsTest {

    @Test
    @DisplayName("Junit to check when demands to query supply is empty")
    void replicateExistingSupplyLineItemsForNoDemandsToQuerySupplyForScenario() {
      SupplySyncDetails supplyDetails = Struct.create(SupplySyncDetails.class);
      List<SupplySyncDetails> supplyDetailsList = new ArrayList<>();

      doReturn(supplyDetailsList).when(mockAssignmentService).getDemandsToQuerySupplyFor();

      ProjectReplicationController spy = Mockito.spy(cut);

      spy.replicateExistingSupplyLineItemsForNewlyPublishedRequests();

      verify(mockReplicationService, times(0)).supplyDemand(supplyDetails);
    }

    @Test
    @DisplayName("Junit to check when demands to query supply is not empty")
    void replicateExistingSupplyLineItemsForSomeDemandsToQuerySupplyForScenario() {

      SupplySyncDetails supplyDetails = Struct.create(SupplySyncDetails.class);
      SupplySyncDetails supplyDetails2 = Struct.create(SupplySyncDetails.class);
      List<SupplySyncDetails> supplyDetailsList = new ArrayList<>();
      supplyDetailsList.add(supplyDetails);
      supplyDetailsList.add(supplyDetails2);

      doReturn(supplyDetailsList).when(mockAssignmentService).getDemandsToQuerySupplyFor();

      ProjectReplicationController spy = Mockito.spy(cut);

      spy.replicateExistingSupplyLineItemsForNewlyPublishedRequests();

      verify(mockReplicationService, times(2)).supplyDemand(supplyDetails);
    }

    @Test
    @DisplayName("Junit to check when replicationService.supplyDemand throws exception")
    void replicateExistingSupplyLineItemsForSomeDemandsErrorScenario() {

      SupplySyncDetails supplyDetails = Struct.create(SupplySyncDetails.class);
      List<SupplySyncDetails> supplyDetailsList = new ArrayList<>();
      supplyDetailsList.add(supplyDetails);

      ServiceException exception = new ServiceException("Supply replication failed with error ");

      doReturn(supplyDetailsList).when(mockAssignmentService).getDemandsToQuerySupplyFor();
      doThrow(exception).when(mockReplicationService).supplyDemand(supplyDetails);

      ProjectReplicationController spy = Mockito.spy(cut);

      spy.replicateExistingSupplyLineItemsForNewlyPublishedRequests();

      verify(mockMessages, times(1)).error("Supply replication failed with error ");
    }

  }

  @Nested
  @DisplayName("Unit Test for processAllProjectsFromProjectSync method")
  class processAllProjectsFromProjectSyncTest {

    @Test
    @DisplayName("Junit to check When Replication Type is DELTA")
    void deltaLoadScenario() {

      int replicationType = Constants.ReplicationType.DELTA;

      List<String> mockServiceOrganizationCodes = new ArrayList<>();
      mockServiceOrganizationCodes.add("1710");
      mockServiceOrganizationCodes.add("1010");
      Map<String, ProjectReplicationTasks> projectReplicationTaskMap = new HashMap<>();
      ProjectReplicationTasks servOrg1 = ProjectReplicationTasks.create();
      servOrg1.setServiceOrganizationCode("1010");
      ProjectReplicationTasks servOrg2 = ProjectReplicationTasks.create();
      servOrg2.setServiceOrganizationCode("1710");
      servOrg2.setIsAutoPublishCode(Constants.AUTO_PUBLISH_ON);
      projectReplicationTaskMap.put("1010", servOrg1);
      projectReplicationTaskMap.put("1710", servOrg2);

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSync.setServiceOrganizationCode("1710");
      projectSyncs.add(projectSync);

      Mockito.when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING, replicationType,
          mockServiceOrganizationCodes)).thenReturn(projectSync).thenReturn(null);

      ProjectReplicationController spy = Mockito.spy(cut);
      spy.processAllProjectsFromProjectSync(replicationType, projectReplicationTaskMap);

      verify(mockReplicationService, times(1)).replicateProjectTree(replicationType, projectSync, true);
      verify(mockIntegrationStatusRepository, times(2)).getSingleProjectSync(Constants.RunStatus.PROCESSING,
          replicationType, mockServiceOrganizationCodes);
      verify(mockReplicationService, times(1)).setReplicationStatustoCompletedOrError(replicationType,
          mockServiceOrganizationCodes);
      verify(spy, times(1)).replicateExistingSupplyLineItemsForNewlyPublishedRequests();
      verify(mockReplicationService, times(0)).setProjectSyncStatusToError(projectSync.getProject(), replicationType);
    }

    @Test
    @DisplayName("Junit to check When Replication Type is INITIAL")
    void initialLoadScenario() {

      int replicationType = Constants.ReplicationType.INITIAL;

      List<String> mockServiceOrganizationCodes = new ArrayList<>();
      mockServiceOrganizationCodes.add("1710");
      mockServiceOrganizationCodes.add("1010");

      Map<String, ProjectReplicationTasks> projectReplicationTaskMap = new HashMap<>();
      ProjectReplicationTasks servOrg1 = ProjectReplicationTasks.create();
      servOrg1.setServiceOrganizationCode("1010");
      ProjectReplicationTasks servOrg2 = ProjectReplicationTasks.create();
      servOrg2.setServiceOrganizationCode("1710");
      servOrg2.setIsAutoPublishCode(Constants.AUTO_PUBLISH_OFF);
      projectReplicationTaskMap.put("1010", servOrg1);
      projectReplicationTaskMap.put("1710", servOrg2);

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSync.setServiceOrganizationCode("1710");
      projectSyncs.add(projectSync);

      Mockito.when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING, replicationType,
          mockServiceOrganizationCodes)).thenReturn(projectSync).thenReturn(null);

      ProjectReplicationController spy = Mockito.spy(cut);
      spy.processAllProjectsFromProjectSync(replicationType, projectReplicationTaskMap);

      verify(mockReplicationService, times(1)).replicateProjectTree(replicationType, projectSync, false);
      verify(mockIntegrationStatusRepository, times(2)).getSingleProjectSync(Constants.RunStatus.PROCESSING,
          replicationType, mockServiceOrganizationCodes);
      verify(mockReplicationService, times(1)).setReplicationStatustoCompletedOrError(replicationType,
          mockServiceOrganizationCodes);
      verify(spy, times(1)).replicateExistingSupplyLineItemsForNewlyPublishedRequests();
      verify(mockReplicationService, times(0)).setProjectSyncStatusToError(projectSync.getProject(), replicationType);
    }

    @Test
    @DisplayName("Junit to check When replicateProjectsTree method throws Exception and respective project status has been set to ERROR Scenario")
    void processAllProjectsFromProjectSyncRaisesExceptionScenario() {

      int replicationType = ReplicationType.DELTA;
      List<ProjectReplicationTasks> mockProjectReplicationTasks = new ArrayList<>();

      ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
      item1.setServiceOrganizationCode("1010");
      mockProjectReplicationTasks.add(item1);

      ProjectReplicationTasks item2 = ProjectReplicationTasks.create();
      item2.setServiceOrganizationCode("1710");
      mockProjectReplicationTasks.add(item2);

      List<String> mockServiceOrganizationCodes = new ArrayList<>();
      mockServiceOrganizationCodes.add("1710");
      mockServiceOrganizationCodes.add("1010");

      Map<String, ProjectReplicationTasks> projectReplicationTaskMap = new HashMap<>();
      ProjectReplicationTasks servOrg1 = ProjectReplicationTasks.create();
      servOrg1.setServiceOrganizationCode("1010");
      ProjectReplicationTasks servOrg2 = ProjectReplicationTasks.create();
      servOrg2.setServiceOrganizationCode("1710");
      projectReplicationTaskMap.put("1010", servOrg1);
      projectReplicationTaskMap.put("1710", servOrg2);

      Set<ProjectSync> projectSyncs = new HashSet<>();
      ProjectSync projectSync = ProjectSync.create();
      projectSync.setProject("PRJ-001");
      projectSyncs.add(projectSync);

      ServiceException serviceException = new ServiceException("Error occured while processing the project ");

      Mockito.when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING, replicationType,
          mockServiceOrganizationCodes)).thenReturn(projectSync).thenReturn(null);
      doThrow(serviceException).when(mockReplicationService).replicateProjectTree(replicationType, projectSync, false);

      ProjectReplicationController spy = Mockito.spy(cut);
      spy.processAllProjectsFromProjectSync(replicationType, projectReplicationTaskMap);

      verify(mockReplicationService, times(1)).replicateProjectTree(replicationType, projectSync, false);
      verify(mockIntegrationStatusRepository, times(2)).getSingleProjectSync(Constants.RunStatus.PROCESSING,
          replicationType, mockServiceOrganizationCodes);
      verify(mockReplicationService, times(1)).setProjectSyncStatusToError(projectSync.getProject(), replicationType);
      verify(mockReplicationService, times(1)).setReplicationStatustoCompletedOrError(replicationType,
          mockServiceOrganizationCodes);
      verify(spy, times(1)).replicateExistingSupplyLineItemsForNewlyPublishedRequests();

    }

  }

}
