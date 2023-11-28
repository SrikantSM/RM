package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.util.Constants;

import com.sap.resourcemanagement.config.ProjectReplicationTasks;

public class ProjectReplicationTasksRepositoryTest {

  public ProjectReplicationTasksRepository cut;
  @Mock
  private PersistenceService mockPersistenceService;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    cut = new ProjectReplicationTasksRepository(mockPersistenceService);
  }

  @Nested
  @DisplayName("Unit tests for getProjectReplicationTaskBasedonTaskStatusCode")
  class GetProjectReplicationTaskBasedonTaskStatusCode {

    @Test
    @DisplayName("Successful Scenario for getProjectReplicationTaskBasedonTaskStatusCode method")
    public void successfulGetProjectReplicationTaskBasedonTaskStatusCodeTest() {

      final Result mockResult = mock(Result.class);
      final List<ProjectReplicationTasks> mockResultList = mock(List.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.listOf(ProjectReplicationTasks.class)).thenReturn(mockResultList);

      List<ProjectReplicationTasks> returnedResultList = cut
          .getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED);
      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(returnedResultList, mockResultList);

    }

    @Test
    @DisplayName("Exception Scenario for getProjectReplicationTaskBasedonTaskStatusCode method")
    public void getProjectReplicationTaskBasedonTaskStatusCodeThrowsExceptionTest() {

      ServiceException serviceException = new ServiceException(
          "Failed while getting ServiceOrganizations based on initial load status");

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getProjectReplicationTaskBasedonTaskStatusCode(Constants.RunStatus.COMPLETED));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for updateProjectReplicationTaskStatus method")
  class UpdateProjectReplicationTaskStatus {

    @Test
    @DisplayName("Successful Scenario for updateProjectReplicationTaskStatus method")
    public void successfulupdateProjectReplicationTaskStatus() {

      ProjectReplicationTasksRepository spy = Mockito.spy(cut);

      spy.updateProjectReplicationTaskStatus(anyMap(), anyMap());

      verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));

    }

    @Test
    @DisplayName("Validate if updateProjectReplicationTaskStatus throws Service Exception")
    public void failedUpdateProjectReplicationTaskStatusThrowsServiceExceptionTest() {

      ServiceException e = new ServiceException("Failed while Updating Project Replication Task Status");

      doThrow(e).when(mockPersistenceService).run(any(CqnUpdate.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.updateProjectReplicationTaskStatus(anyMap(), anyMap()));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

}
