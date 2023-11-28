package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.util.Constants;

import com.sap.resourcemanagement.integration.ProjectReplicationStatus;
import com.sap.resourcemanagement.integration.ProjectSync;

public class IntegrationStatusRepositoryTest {

  private PersistenceService mockPersistenceService;

  private IntegrationStatusRepository cut;

  private ProjectReplicationStatus projectReplicationStatus;

  private ProjectSync projectSync;

  @BeforeEach
  public void setUp() {

    mockPersistenceService = mock(PersistenceService.class);

    cut = new IntegrationStatusRepository(mockPersistenceService);

  }

  // test for insertProjectReplicationStatus
  @Nested
  @DisplayName("Unit tests for insertProjectReplicationStatus")
  public class InsertProjectReplicationStatusTest {

    @Test
    @DisplayName("Test for InsertProjectReplicationStatus success scenario")
    public void successfulInsertProjectReplicationStatusTest() {

      projectReplicationStatus = ProjectReplicationStatus.create();
      cut.insertProjectReplicationStatus(projectReplicationStatus);
      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    @Test
    @DisplayName("Validate if InsertProjectReplicationStatus throws Service Exception")
    public void failedInsertProjectReplicationStatusThrowServiceExceptionTest() {

      projectReplicationStatus = ProjectReplicationStatus.create();

      ServiceException e = new ServiceException("Failed in insertProjectReplicationStatus {}",
          projectReplicationStatus);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.insertProjectReplicationStatus(projectReplicationStatus));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  // test for updateProjectReplicationStatus
  @Nested
  @DisplayName("Unit tests for updateProjectReplicationStatus")
  public class UpdateProjectReplicationStatusTests {

    @Test
    @DisplayName("Test for UpdateProjectReplicationStatus success scenario")
    public void successfulUpdateProjectReplicationStatusTest() {

      projectReplicationStatus = ProjectReplicationStatus.create();
      cut.updateProjectReplicationStatus(projectReplicationStatus);
      verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));

    }

    @Test
    @DisplayName("Validate if UpdateProjectReplicationStatus throws Service Exception")
    public void failedUpdateProjectReplicationStatusThrowServiceExceptionTest() {

      projectReplicationStatus = ProjectReplicationStatus.create();

      ServiceException e = new ServiceException("Failed in updateProjectReplicationStatus {}",
          projectReplicationStatus);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpdate.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.updateProjectReplicationStatus(projectReplicationStatus));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  // test for getSingleProjectSyncByStatus
  @Nested
  @DisplayName("Unit tests for GetSingleProjectSyncByStatus")
  public class GetSingleProjectSyncTest {

    @Test
    @DisplayName("Successful GetSingleProjectSync Scenario")
    public void successfulGetSingleProjectSyncTest() {

      int statuscode = 01;
      int replicationType = Constants.ReplicationType.INITIAL;
      List<String> serviceOrganizations = new ArrayList<String>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      final ProjectSync projectSync = Struct.create(ProjectSync.class);
      projectSync.setStatusCode(01);
      projectSync.setTypeTypeCode(1);

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(any())).thenReturn(projectSync);

      final ProjectSync projectSyncExpected = cut.getSingleProjectSync(statuscode, replicationType,
          serviceOrganizations);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(statuscode, projectSyncExpected.getStatusCode());

    }

    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedGetSingleProjectSyncByStatusTest() {

      int status = 01;

      List<String> serviceOrganizations = new ArrayList<String>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 0);

      final ProjectSync projectSyncExpected = cut.getSingleProjectSync(status, anyInt(), serviceOrganizations);

      assertEquals(null, projectSyncExpected);

    }

    @Test
    @DisplayName("Exception Scenario for GetSingleProjectSyncByStatusmethod")
    public void unsuccessfulGetSingleProjectSyncByStatus() {

      int status = 01;

      List<String> serviceOrganizations = new ArrayList<String>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      ServiceException e = new ServiceException("Failed while getting SingleProjectSyncByStatus");

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getSingleProjectSync(status, anyInt(), serviceOrganizations));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  // test for getProjectSyncById
  @Nested
  @DisplayName("Unit tests for GetProjectSyncById")
  public class GetProjectSyncByIdTest {
    @Test
    @DisplayName("Successful Scenario")
    public void successfulgetProjectSyncByIdTest() {

      String projectId = "PRJ-0001";

      final ProjectSync projectSync = Struct.create(ProjectSync.class);
      projectSync.setProject("PRJ-0001");
      // projectSync.setType("Type");

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(any())).thenReturn(projectSync);

      ProjectSync projectSyncExpected = cut.getProjectSyncByProject(projectId, anyInt());

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(projectId, projectSyncExpected.getProject());

    }

    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedGetProjectSyncById() {

      String projectId = "PRJ-0001";

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      final ProjectSync projectSyncExpected = cut.getProjectSyncByProject(projectId, anyInt());

      assertEquals(null, projectSyncExpected);

    }

    @Test
    @DisplayName("Exception Scenario for GetProjectSyncById")
    public void unsuccessfulGetProjectSyncById() {

      String projectId = "PRJ-0001";

      ServiceException e = new ServiceException("Failed in getProjectSyncById {}", projectId);

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getProjectSyncByProject(projectId, anyInt()));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  // test for updateProjectSyncStatus
  @Nested
  @DisplayName("Unit tests for updateProjectSyncStatus")
  public class UpdateProjectSyncStatusTest {

    @Test
    @DisplayName("Test for UpdateProjectSyncStatus success scenario")
    public void successfulupdateProjectSyncStatusTest() {

      projectSync = ProjectSync.create();

      cut.updateProjectSyncStatus(projectSync);
      verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));

    }

    @Test
    @DisplayName("Validate if updateProjectSyncStatus throws Service Exception")
    public void failedUpdateProjectSyncStatusThrowServiceExceptionTest() {

      projectSync = ProjectSync.create();

      ServiceException e = new ServiceException("Failed in updateProjectSyncStatus {}", projectSync);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpdate.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.updateProjectSyncStatus(projectSync));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  // test for readProjectReplicationStatus
  @Nested
  @DisplayName("Unit tests for readProjectReplicationStatus")
  public class ReadProjectReplicationStatusTest {

    @Test
    @DisplayName("Successful Scenario")
    public void successfulReadProjectReplicationStatusTest() {

      final Integer type = 1;
      ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
      projectReplicationStatus.setTypeCode(type);

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(ProjectReplicationStatus.class)).thenReturn(projectReplicationStatus);

      ProjectReplicationStatus projectReplicationStatusActual = cut.readProjectReplicationStatus(type);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(projectReplicationStatus, projectReplicationStatusActual);

    }

    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedReadProjectReplicationStatusTest() {

      final Integer type = 1;

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      ProjectReplicationStatus projectReplicationStatusExpected = cut.readProjectReplicationStatus(type);

      assertEquals(null, projectReplicationStatusExpected);

    }

    @Test
    @DisplayName("Service Exception Scenario for ReadProjectReplicationStatus")
    public void unsuccessfulReadProjectReplicationStatus() {

      final Integer type = 1;

      ServiceException e = new ServiceException("Failed in readProjectReplicationStatus");

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.readProjectReplicationStatus(type));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    @Test
    @DisplayName("Exception(Other than Service Exception) Scenario for ReadProjectReplicationStatus")
    public void whenExceptionOtherThanServiceExceptionTriggers() {

      final Integer type = 1;

      NullPointerException e = new NullPointerException("Failed during read of ProjectReplicationStatus");

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.readProjectReplicationStatus(type));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  // test for getErrorProjectsInprocess
  @Nested
  @DisplayName("Unit tests for getErrorProjectsInprocess")
  public class getErrorProjectsInprocess {

    @Test
    @DisplayName("Validate the one project which is in error state is set to in-process state")
    public void getErrorProjectsSuccssfully() {

      String projectId = "PRJ-0001";
      List<ProjectSync> projectSyncs = new ArrayList<>();
      List<String> serviceOrganizations = new ArrayList<String>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      final Result mockResult = mock(Result.class);

      int replicationType = Constants.ReplicationType.DELTA;

      final ProjectSync projectSync = Struct.create(ProjectSync.class);
      projectSync.setProject(projectId);
      projectSync.setServiceOrganizationCode("1010");
      projectSyncs.add(projectSync);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.listOf(ProjectSync.class)).thenReturn(projectSyncs);

      Set<ProjectSync> projectSyncSet = cut.getErrorProjectsInprocess(replicationType, serviceOrganizations);
      List<ProjectSync> projectSyncList = new ArrayList<>(projectSyncSet);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      assertAll(() -> assertEquals(1, projectSyncList.size()),
          () -> assertEquals(projectSyncList.get(0).getProject(), projectSyncs.get(0).getProject()),
          () -> assertEquals(Constants.RunStatus.PROCESSING, projectSyncList.get(0).getStatusCode()),
          () -> assertEquals("1010", projectSyncList.get(0).getServiceOrganizationCode()));
    }

    @Test
    @DisplayName("Validate when resultant row count is less than 0")
    public void whenResultRowCountIsLessThanZero() {

      List<String> serviceOrganizations = new ArrayList<String>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      final Result mockResult = mock(Result.class);

      int replicationType = Constants.ReplicationType.DELTA;

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      Set<ProjectSync> projectSyncSet = cut.getErrorProjectsInprocess(replicationType, serviceOrganizations);

      assertEquals(null, projectSyncSet);

    }

    @Test
    @DisplayName("Scenario of Service Exception raised on failed to get the projects in error state")
    public void whenFailedToGetErrorProjects() {

      int replicationType = Constants.ReplicationType.DELTA;
      List<String> serviceOrganizations = new ArrayList<String>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      ServiceException e = new ServiceException("Error occurred while getting Error Projects in Process");

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getErrorProjectsInprocess(replicationType, serviceOrganizations));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

    @Test
    @DisplayName("Scenario When Exception other than Service Exception Is triggered")
    public void whenExceptionOtherThanServiceExceptionIsTriggered() {

      int replicationType = Constants.ReplicationType.DELTA;
      List<String> serviceOrganizations = new ArrayList<String>();
      serviceOrganizations.add("1010");
      serviceOrganizations.add("1710");

      NullPointerException e = new NullPointerException("Failed while setting ErrorProjects To Inprocess");

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getErrorProjectsInprocess(replicationType, serviceOrganizations));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Unit tests for updateProjectSync Method")
  public class UpsertProjectSyncTest {

    @Test
    @DisplayName("Success Scenario for upsertProjectSync ")
    public void successfulUpsertProjectSyncTest() {

      List<ProjectSync> mockProjectSyncList = new ArrayList<>();
      ProjectSync mockProjectSync1 = ProjectSync.create();
      ProjectSync mockProjectSync2 = ProjectSync.create();
      mockProjectSyncList.add(mockProjectSync1);
      mockProjectSyncList.add(mockProjectSync2);

      IntegrationStatusRepository spy = Mockito.spy(cut);

      spy.upsertProjectSync(mockProjectSyncList);

      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    @Test
    @DisplayName("Validate if upsertProjectSync throws Service Exception")
    public void failedUpsertProjectSyncThrowsServiceExceptionTest() {

      List<ProjectSync> mockProjectSyncList = new ArrayList<>();
      ProjectSync mockProjectSync1 = ProjectSync.create();
      ProjectSync mockProjectSync2 = ProjectSync.create();
      mockProjectSyncList.add(mockProjectSync1);
      mockProjectSyncList.add(mockProjectSync2);

      ServiceException e = new ServiceException("Failed in upsert project sync");

      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      IntegrationStatusRepository spy = Mockito.spy(cut);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.upsertProjectSync(mockProjectSyncList));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for insertDemandInSupplySync Method")
  public class insertDemandInSupplySync {

    @Test
    @DisplayName("Success Scenario for insertDemandInSupplySync ")
    public void successfulInsertDemandInSupplySyncTest() {

      cut.insertDemandInSupplySync("");
      verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));

    }

    @Test
    @DisplayName("Failed Scenario for insertDemandInSupplySync ")
    public void failedInsertDemandInSupplySync() {

      IntegrationStatusRepository spy = Mockito.spy(cut);
      ServiceException e = new ServiceException("Failed in insert to Supplysync");

      doThrow(e).when(mockPersistenceService).run(any(CqnInsert.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> spy.insertDemandInSupplySync(""));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

}
