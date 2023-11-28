package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.impl.RowImpl;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.project.WorkPackages;

public class WorkPackageRepositoryTest {

  private PersistenceService mockPersistenceService;

  private WorkPackageRepository cut;

  private Row mockRow;

  private Iterator<Row> mockIterator;

  private WorkPackages workPackage;

  private String workPackageID;

  private String projectID;

  private Map<String, String> wpMap;

  @BeforeEach
  public void setUp() {
    workPackage = WorkPackages.create();

    mockPersistenceService = mock(PersistenceService.class);
    workPackageID = "wp1";
    wpMap = new HashMap<>();
    wpMap.put(WorkPackages.ID, workPackageID);
    workPackage.putAll(wpMap);
    mockRow = RowImpl.row(workPackage);
    mockIterator = mock(Iterator.class);

    cut = new WorkPackageRepository(mockPersistenceService);
  }

  @Nested
  @DisplayName("Unit tests for Update Work Package")
  public class updateWorkPackageTest {

    @Test
    @DisplayName("Test for updateWorkPackage success scenario")
    public void successfulupdateWorkPackageTest() {

      workPackage = WorkPackages.create();

      cut.updateWorkPackage(workPackage);
      verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));

    }

    @Test
    @DisplayName("Validate if updateWorkPackage throws Service Exception")
    public void failedUpdateWorkPackageThrowServiceExceptionTest() {

      ServiceException e = new ServiceException("Failed in updateWorkPackage {}", workPackage);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpdate.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.updateWorkPackage(workPackage));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for CreateWorkPackage")
  public class CreateWorkPackageTest {

    @Test
    @DisplayName("Test for createWorkPackage success scenario")
    public void successfulcreateWorkPackageTest() {

      workPackage = WorkPackages.create();

      cut.createWorkPackage(workPackage);
      verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));

    }

    @Test
    @DisplayName("Validate if createWorkPackage throws Service Exception")
    public void failedCreateWorkPackageThrowServiceExceptionTest() {

      ServiceException e = new ServiceException("Failed in createWorkPackage {}", workPackage);
      doThrow(e).when(mockPersistenceService).run(any(CqnInsert.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.createWorkPackage(workPackage));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for DeleteWorkPackage")
  public class DeleteWorkPackageTest {

    @Test
    @DisplayName("Test for deleteWorkPackage success scenario")
    public void successfuldeleteWorkPackageTest() {

      String workPackageID = null;

      cut.deleteWorkPackage(workPackageID);
      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Validate if deleteWorkPackage throws Service Exception")
    public void failedDeleteWorkPackageThrowServiceExceptionTest() {

      ServiceException e = new ServiceException("Failed in deleteWorkPackage {}", workPackageID);
      doThrow(e).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.deleteWorkPackage(workPackageID));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for selectWorkPackageForProject method")
  public class SelectWorkPackageForProjectTest {

    @Test
    @DisplayName("Test for selectWorkPackageForProject success scenario")
    public void SuccessfulSelectWorkPackageForProjectTest() {

      List<WorkPackages> wpList = new ArrayList<>();
      // workPackage.putAll(m);
      wpList.add(workPackage);

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.iterator()).thenReturn(mockIterator);
      when(mockIterator.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
      when(mockIterator.next()).thenReturn(mockRow);

      List<WorkPackages> wpActualList = cut.selectWorkPackageForProject(projectID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(wpList, wpActualList);

    }

    @Test
    @DisplayName("Test for selectWorkPackageForProject null scenario")
    public void nullSelectWorkPackageForProjectTest() {

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      List<WorkPackages> wpActualList = cut.selectWorkPackageForProject(projectID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(Collections.emptyList(), wpActualList);

    }

    @Test
    @DisplayName("Scenario when selectWorkPackageForProject method throws Service Exception")
    public void failedselectWorkPackageForProjectExceptionTest() {

      ServiceException serviceException = new ServiceException("Failed while selecting WorkPackage For Project");

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.selectWorkPackageForProject(projectID));

      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

  }

  @Nested
  @DisplayName("Unit tests for getWorkPackageNameById method")
  class GetWorkPackageNameTest {

    String workPackageId = "NGDMS";
    String workPackageName = "NGDMS.1.1";

    @Test
    @DisplayName("If the workPackage ID is passed then corresponding work package name returned")
    public void successfulGetWorkPackageNameTest() {

      final Result mockResult = mock(Result.class);
      final Iterator<Row> mockIterator = mock(Iterator.class);
      final Row mockWpRow = mock(Row.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.iterator()).thenReturn(mockIterator);
      when(mockIterator.hasNext()).thenReturn(true);
      when(mockIterator.next()).thenReturn(mockWpRow);
      when(mockWpRow.get(any())).thenReturn(workPackageName);

      String workPackageNameResult = cut.getWorkPackageNameById(workPackageId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(workPackageName, workPackageNameResult);

    }

    @Test
    @DisplayName("If the work package  Name is not present , then NULL will be returned")
    public void noProjectNamePersistedTest() {

      final Result mockResult = mock(Result.class);
      final Iterator<Row> mockIterator = mock(Iterator.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.iterator()).thenReturn((mockIterator));
      when(mockIterator.hasNext()).thenReturn((false));

      String wpNameReturned = cut.getWorkPackageNameById(workPackageId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(null, wpNameReturned);

    }

    @Test
    @DisplayName("Exception Scenario for getProjectNameById method")
    public void UnsuccessfulGetProjectNameById() {

      ServiceException serviceException = new ServiceException("Failed while getting WorkPackage Name by Id");

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getWorkPackageNameById(workPackageID));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

}
