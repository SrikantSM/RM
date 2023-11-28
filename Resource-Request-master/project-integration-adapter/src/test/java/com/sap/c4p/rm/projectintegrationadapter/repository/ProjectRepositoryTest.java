package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.CdsData;
import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.project.Customers;
import com.sap.resourcemanagement.project.Projects;

@DisplayName("Unit test for Project Repository")
public class ProjectRepositoryTest {

  private PersistenceService mockPersistenceService;

  private ProjectRepository cut;

  private List<CdsData> projects = new ArrayList<CdsData>();

  private Projects project;

  private String projectID;

  private String projectName;

  private Customers customer;

  private String customerID;

  private Row mockRow;

  private Iterator<Row> mockIterator;

  @BeforeEach
  public void setUp() {

    mockPersistenceService = mock(PersistenceService.class);
    mockRow = mock(Row.class);
    mockIterator = mock(Iterator.class);

    projectID = "PRJ-0001";
    customerID = "17100002";
    projectName = " WASL Project";

    cut = new ProjectRepository(mockPersistenceService);
  }

  @Nested
  @DisplayName("Unit tests for Update Project")
  public class UpdateProjectTest {

    @Test
    @DisplayName("Success Scenario for Updateproject ")
    public void successfulUpdateProjectTest() {

      project = Projects.create();

      cut.updateProject(project);

      verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));

    }

    @Test
    @DisplayName("Validate if Updateproject throws Service Exception")
    public void failedUpdateProjectThrowServiceExceptionTest() {

      ServiceException e = new ServiceException("Failed in updateProject {}", project);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpdate.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.updateProject(project));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for Upsert Projects")
  public class UpsertProjectsTest {

    private List<CdsData> projects = new ArrayList();

    @Test
    @DisplayName("Test for Successful updateProject")
    public void successfulUpsertProjectsTest() {

      cut.upsertProjects(projects);

      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    @Test
    @DisplayName("Verify if Service Exception is thrown when UpsertProjectsfailed")
    public void failedUpsertProjectsThrowsServiceExceptionTest() {

      ServiceException e = new ServiceException("Failed in upsertProjects {}", projects);

      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.upsertProjects(projects));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }
  }

  @Nested
  @DisplayName("Unit tests for Upsert Customer")
  public class UpsertCustomerTest {

    @Test
    @DisplayName(" Test for Successful Upsert Customer")
    public void SuccessfulupsertCustomerTest() {

      customer = Customers.create();

      cut.upsertCustomer(customer);

      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    @Test
    @DisplayName(" Test for Unsuccessful Upsert Customer")
    public void failedUpsertCustomerTest() {

      customer = Customers.create();

      ServiceException e = new ServiceException("Failed in upsertCustomer {}", customer);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.upsertCustomer(customer));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for GetCustomerId")
  class GetCustomerByIdTest {

    @Test
    @DisplayName("Successful Scenario")
    public void successfulGetCustomerByIdTest() {

      String cust_ID = "17100002";

      final Customers customer = Struct.create(Customers.class);
      customer.setId("17100002");
      customer.setName("CUSTNAME");

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 1);

      when(mockResult.single(any())).thenReturn(customer);

      final Customers customerExpected = cut.getCustomerById(cust_ID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(cust_ID, customerExpected.getId());

    }

    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedGetCustomerById() {

      String cust_ID = "17100004";

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 0);

      final Customers customerExpected = cut.getCustomerById(cust_ID);

      assertEquals(null, customerExpected);

    }

    @Test
    @DisplayName("Exception Scenario for SelectProjectTree method")
    public void UnsuccessfulGetCustomerById() {

      String cust_ID = "17100004";

      ServiceException e = new ServiceException("Failed in getCustomerById {}", cust_ID);

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.getCustomerById(cust_ID));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for selectProjectTree")
  class SelectProjectTreeTest {

    @Test
    @DisplayName("Successful selectProjectTree Scenario")
    public void successfulSelectProjectTreeTest() {

      String project_ID = "PRJ-0001";

      final Projects project = Struct.create(Projects.class);
      project.setId("PRJ-0001");
      project.setName("S4HANA Impl");
      project.setCustomerId("17100002");
      project.setServiceOrganizationCode("Org_1");

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.single(any())).thenReturn(project);

      Projects actualProject = cut.selectProjectTree(project_ID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(project_ID, actualProject.getId());

    }

    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedselectProjectTreeTest() {

      String project_ID = "PRJ-0001";

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      Projects actualProject = cut.selectProjectTree(project_ID);

      assertEquals(null, actualProject);
    }

    @Test
    @DisplayName("Exception Scenario for SelectProjectTree method")
    public void UnsuccessfulSelectProjectTree() {

      String project_ID = "PRJ-0001";

      ServiceException e = new ServiceException("Failed in selectProjectTree {}", project_ID);

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.selectProjectTree(project_ID));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for Get Customer")
  public class GetCustomerTest {

    @Test
    @DisplayName(" Test for Successful Get Customer")
    public void SuccessfulGetCustomerTest() {

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.iterator()).thenReturn(mockIterator);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockIterator.hasNext()).thenReturn(Boolean.TRUE);
      when(mockIterator.next()).thenReturn(mockRow);
      when(mockRow.get(Projects.CUSTOMER_ID)).thenReturn(customerID);

      String actualCustomerID = cut.getCustomer(projectID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(customerID, actualCustomerID);
    }

    // Get customer returns null
    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedGetCustomer() {

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      String actualCustomerID = cut.getCustomer(projectID);

      assertEquals(null, actualCustomerID);

    }

    // Exception scenario for get customer
    @Test
    @DisplayName(" Test for Unsuccessful Get Customer")
    public void failedGetCustomerTest() {

      ServiceException serviceException = new ServiceException("Failed while getting Customer");

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.getCustomer(projectID));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for Delete Customer")
  public class DeleteCustomerTest {

    @Test
    @DisplayName(" Test for Successful Delete Customer")
    public void SuccessfulDeleteCustomerTest() {

      cut.deleteCustomer(customerID);
      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName(" Test for Unsuccessful delete Customer")
    public void failedDeleteCustomerTest() {

      ServiceException serviceException = new ServiceException("Failed during deletion of Customer");

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.deleteCustomer(customerID));

      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for getCustomerProject method")
  class GetCustomerProjectTest {

    @Test
    @DisplayName("If the customer has more than one project in RM getCustomerProject Scenario returns 1 or more results")
    public void successfulGetCustomerProjectTest() {

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 1);

      int actualProjectCount = cut.getCustomerProject(customerID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(1, actualProjectCount);

    }

    @Test
    @DisplayName("If the customer has no projects in RM then getCustomerProject Scenario returns 0 records")
    public void noMoreCustomerProjectsGetCustomerProjectTest() {

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 0);

      int actualProjectCount = cut.getCustomerProject(customerID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(0, actualProjectCount);

    }

    @Test
    @DisplayName("Exception Scenario for getCustomerProject method")
    public void UnsuccessfulGetCustomerProject() {

      ServiceException serviceException = new ServiceException("Failed while getting CustomerProject");

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.getCustomerProject(customerID));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for getProjectsByServiceOrganization")
  class GetProjectsByServiceOrganization {

    @Test
    @DisplayName("Successful getProjectsByServiceOrganization Scenario")
    public void successfulGetProjectsByServiceOrganization() {

      List<String> projectList = new ArrayList<>();

      List<String> projectsFetchedList;

      projectList.add(projectID);

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.iterator()).thenReturn(mockIterator);
      when(mockIterator.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
      when(mockIterator.next()).thenReturn(mockRow);
      when(mockRow.get(Projects.ID)).thenReturn(projectID);

      projectsFetchedList = cut.getProjectsByServiceOrganization(anyList());

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(projectList, projectsFetchedList);
    }

    @Test
    @DisplayName("Null return scenario GetProjectsByServiceOrganization")
    public void nullReturnedGetProjectsByServiceOrganizationTest() {

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 0);

      List<String> projectsFetchedList = cut.getProjectsByServiceOrganization(anyList());

      assertEquals(Collections.emptyList(), projectsFetchedList);
    }

    @Test
    @DisplayName("Exception Scenario for GetProjectsByServiceOrganization method")
    public void unsuccessfulGetProjectsByServiceOrganization() {

      ServiceException serviceException = new ServiceException(
          "Failed while getting Projects by Service organizations");

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getProjectsByServiceOrganization(anyList()));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }
  }

  @Nested
  @DisplayName("Unit tests for Delete Project")
  public class DeleteProjectTest {

    @Test
    @DisplayName("Test for deleteProject success scenario")
    public void successfulDeleteProjectTest() {

      cut.deleteProject(projectID);
      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Exception Scenario for deleteProject method")
    public void unsuccessfulDeleteProject() {

      ServiceException serviceException = new ServiceException("Failed in deleteProject {}", projectID);

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.deleteProject(projectID));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for Delete Project Sync")
  public class DeleteProjectSyncTest {

    private String projectID;

    @Test
    @DisplayName("Test for deleteProjectSync success scenario")
    public void successfulDeleteProjectSyncTest() {
      projectID = "PRJ-0001";
      cut.deleteProjectSync(projectID);
      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Exception Scenario for deleteProjectSync method")
    public void unsuccessfulDeleteProjectSync() {
      projectID = "PRJ-0001";
      ServiceException serviceException = new ServiceException("Failed in deleteProjectSync {}", projectID);

      doThrow(serviceException).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.deleteProjectSync(projectID));

      assertAll(() -> assertEquals(serviceException.getMessage(), exception.getMessage()));

    }

  }

}
