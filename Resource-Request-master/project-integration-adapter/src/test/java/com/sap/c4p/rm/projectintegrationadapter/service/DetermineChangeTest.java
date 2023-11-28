package com.sap.c4p.rm.projectintegrationadapter.service;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
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
import org.mockito.MockitoAnnotations;

import com.sap.cds.CdsData;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.datamodel.odata.client.request.ODataRequestGeneric;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkItem;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage;

import com.sap.c4p.rm.projectintegrationadapter.repository.DemandRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ResourceRequestRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.WorkPackageRepository;
import com.sap.c4p.rm.projectintegrationadapter.transformation.TransformDemandToResourceRequest;
import com.sap.c4p.rm.projectintegrationadapter.transformation.TransformS4ProjectToRM;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;

import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.project.Projects;
import com.sap.resourcemanagement.project.WorkPackages;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

@DisplayName("Unit test for Determine Change class")
public class DetermineChangeTest {

  /**
   * Class under test
   */
  public DetermineChange cut;

  /**
   * mock object
   */
  public TransformS4ProjectToRM mockTransformS4ToRM;
  public ProjectRepository mockProjectRepository;
  public WorkPackageRepository mockWorkPackageRepository;
  public DemandRepository mockDemandRepository;
  private ResourceRequestRepository mockResourceRequestRepository;
  private TransformDemandToResourceRequest mockTransformDemandToResourceRequest;
  private AssignmentService mockAssignmentService;

  String customer1;
  String project1;
  String project2;
  String project3;
  List<Project> s4Projects = new ArrayList<>();
  List<String> rmProjects = new ArrayList<>();
  Project projectS4Set1 = new Project();
  Project projectS4Set2 = new Project();
  Project projectS4Set3 = new Project();

  @BeforeEach
  public void setUp() {
    mockTransformS4ToRM = mock(TransformS4ProjectToRM.class);
    mockProjectRepository = mock(ProjectRepository.class);
    mockWorkPackageRepository = mock(WorkPackageRepository.class);
    mockDemandRepository = mock(DemandRepository.class);
    mockResourceRequestRepository = mock(ResourceRequestRepository.class);
    mockTransformDemandToResourceRequest = mock(TransformDemandToResourceRequest.class);
    mockAssignmentService = mock(AssignmentService.class);

    customer1 = "customer1";
    project1 = "project1";
    project2 = "project2";
    project3 = "project3";
    projectS4Set1.setProjectID(project1);
    projectS4Set1.setCustomer(customer1);
    projectS4Set2.setProjectID(project2);
    projectS4Set2.setCustomer(customer1);
    projectS4Set3.setProjectID(project3);
    projectS4Set3.setCustomer(customer1);

    cut = new DetermineChange(mockTransformS4ToRM, mockProjectRepository, mockWorkPackageRepository,
        mockDemandRepository, mockTransformDemandToResourceRequest, mockResourceRequestRepository,
        mockAssignmentService);
  }

  @Nested
  @DisplayName("Unit Test for comapareAndChange method")
  class CompareAndChange {

    /**
     * This test verifies if all the methods are called successfully
     *
     * @throws ODataException
     */
    @Test
    void verifyMethodCalls() throws ODataException {
      final DetermineChange spy = spy(cut);

      Project s4project = mock(Project.class);
      Projects rmProject = mock(Projects.class);

      doReturn(null).when(s4project).getWorkPackageSetOrFetch();
      doReturn(null).when(rmProject).getWorkPackages();
      doNothing().when(spy).compareAndChangeProject(s4project, rmProject);
      doNothing().when(spy).traverseWorkPackagesToMapAndSet(any());
      doNothing().when(spy).compareAndChangeWorkPackage(any(), any(), any());

      spy.compareAndChange(s4project, rmProject, true);

      verify(spy, times(1)).compareAndChangeProject(s4project, rmProject);
      verify(spy, times(1)).traverseWorkPackagesToMapAndSet(any());
      verify(spy, times(1)).compareAndChangeWorkPackage(any(), any(), any());
    }

    /**
     * This test checks the behaviour when ServiceException is thrown by
     * compareAndChangeWorkPackage()
     *
     * @throws ODataException
     */
    @Test
    void whenCompareAndChangeWorkPackageThrowsServiceException() throws ODataException {
      final DetermineChange spy = spy(cut);

      Project s4project = mock(Project.class);
      Projects rmProject = mock(Projects.class);

      ServiceException e = new ServiceException("Exception occured while comparing work pacakge");

      doReturn(null).when(s4project).getWorkPackageSetOrFetch();
      doReturn(null).when(rmProject).getWorkPackages();
      doNothing().when(spy).compareAndChangeProject(s4project, rmProject);
      doNothing().when(spy).traverseWorkPackagesToMapAndSet(any());
      doThrow(e).when(spy).compareAndChangeWorkPackage(any(), any(), any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.compareAndChange(s4project, rmProject, true));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

    /**
     * This test checks the behaviour when ODataException is thrown by
     * getWorkPackageSetOrFetch()
     *
     * @throws ODataException
     */
    @Test
    void whenGetWorkPackageThrowsODataException() throws ODataException {
      final DetermineChange spy = spy(cut);

      Project s4project = mock(Project.class);
      Projects rmProject = mock(Projects.class);
      ODataRequestGeneric oDataRequestGeneric = mock(ODataRequestGeneric.class);

      ODataException e = new ODataException(oDataRequestGeneric, "Exception occured while fetching work pacakge", null);

      doThrow(e).when(s4project).getWorkPackageSetOrFetch();

      doReturn(null).when(rmProject).getWorkPackages();
      doNothing().when(spy).compareAndChangeProject(s4project, rmProject);
      doNothing().when(spy).traverseWorkPackagesToMapAndSet(any());
      doNothing().when(spy).compareAndChangeWorkPackage(any(), any(), any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.compareAndChange(s4project, rmProject, true));
      assertAll(() -> assertEquals("Error getting Work Packages from S/4 " + e.getMessage(), exception.getMessage()));
    }

    /**
     * This test checks the behaviour when NullPointerException is thrown by
     * compareAndChangeWorkPackage()
     *
     * @throws ODataException
     */
    @Test
    void whenCompareAndChangeWorkPackageThrowsNullPointerException() throws ODataException {
      final DetermineChange spy = spy(cut);

      Project s4project = mock(Project.class);
      Projects rmProject = mock(Projects.class);

      NullPointerException e = new NullPointerException("Exception occured while comparing work pacakge");

      doReturn(null).when(s4project).getWorkPackageSetOrFetch();
      doReturn(null).when(rmProject).getWorkPackages();
      doNothing().when(spy).compareAndChangeProject(s4project, rmProject);
      doNothing().when(spy).traverseWorkPackagesToMapAndSet(any());
      doThrow(e).when(spy).compareAndChangeWorkPackage(any(), any(), any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.compareAndChange(s4project, rmProject, true));
      assertAll(() -> assertEquals("Error occured while detemining change " + e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Unit Test for compareAndChangeProject method")
  class CompareAndChangeProject {

    private String projectName = "TEST PROJECT";
    private String customerId = "CUSTOMER1";
    LocalDate projectStartDate = LocalDate.of(2020, 01, 01);
    LocalDate projectEndDate = LocalDate.of(2020, 12, 31);
    private String serviceOrg = "1010";

    // Internal Project
    private String internalProjectName = "Internal PROJECT";
    LocalDate internalProjectStartDate = LocalDate.of(2021, 01, 01);
    LocalDate internalProjectEndDate = LocalDate.of(2021, 12, 31);
    private String serviceOrg2 = "1070";

    /**
     * When all the project fields are equal, update project is not called
     */
    @Test
    void whenAllFieldsAreEqual() {
      Projects rmProject = Projects.create();
      rmProject.setCustomerId(customerId);
      rmProject.setName(projectName);
      rmProject.setStartDate(projectStartDate);
      rmProject.setEndDate(projectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg);

      Project s4Project = mock(Project.class);

      doReturn(rmProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(0)).updateProject(any());
    }

    /**
     * When existing project name is changed
     */
    @Test
    void whenProjectNameIsChanged() {
      Projects rmProject = Projects.create();
      rmProject.setCustomerId(customerId);
      rmProject.setName(projectName);
      rmProject.setStartDate(projectStartDate);
      rmProject.setEndDate(projectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg);

      Projects changedProject = Projects.create();
      changedProject.setCustomerId(customerId);
      changedProject.setName("CHANGED NAME");
      changedProject.setStartDate(projectStartDate);
      changedProject.setEndDate(projectEndDate);
      changedProject.setServiceOrganizationCode(serviceOrg);

      Project s4Project = mock(Project.class);

      doReturn(changedProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(1)).updateProject(any());
    }

    /**
     * When project customer is changed, update project is called
     */
    @Test
    void whenProjectCustomerIsChanged() {
      Projects rmProject = Projects.create();
      rmProject.setCustomerId(customerId);
      rmProject.setName(projectName);
      rmProject.setStartDate(projectStartDate);
      rmProject.setEndDate(projectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg);

      Projects changedProject = Projects.create();
      changedProject.setCustomerId("CHANGED CUSTOMER");
      changedProject.setName(projectName);
      changedProject.setStartDate(projectStartDate);
      changedProject.setEndDate(projectEndDate);
      changedProject.setServiceOrganizationCode(serviceOrg);

      Project s4Project = mock(Project.class);

      doReturn(changedProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(1)).updateProject(any());
    }

    /**
     * When project dates are changed, update project is called
     */
    @Test
    void whenProjectDatesAreChanged() {
      Projects rmProject = Projects.create();
      rmProject.setCustomerId(customerId);
      rmProject.setName(projectName);
      rmProject.setStartDate(projectStartDate);
      rmProject.setEndDate(projectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg);

      LocalDate projectNewStartDate = LocalDate.of(2020, 02, 01);
      LocalDate projectNewEndDate = LocalDate.of(2020, 12, 01);

      Projects changedProject = Projects.create();
      changedProject.setCustomerId(customerId);
      changedProject.setName(projectName);
      changedProject.setStartDate(projectNewStartDate);
      changedProject.setEndDate(projectNewEndDate);
      changedProject.setServiceOrganizationCode(serviceOrg);

      Project s4Project = mock(Project.class);

      doReturn(changedProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(1)).updateProject(any());
    }

    /**
     * When project service org is changed, update project is called
     */
    @Test
    void whenProjectServiceOrgIsChanged() {
      Projects rmProject = Projects.create();
      rmProject.setCustomerId(customerId);
      rmProject.setName(projectName);
      rmProject.setStartDate(projectStartDate);
      rmProject.setEndDate(projectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg);

      Projects changedProject = Projects.create();
      changedProject.setCustomerId(customerId);
      changedProject.setName(projectName);
      changedProject.setStartDate(projectStartDate);
      changedProject.setEndDate(projectEndDate);
      changedProject.setServiceOrganizationCode("1110");

      Project s4Project = mock(Project.class);

      doReturn(changedProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(1)).updateProject(any());
    }

    /**
     * When all the internal project fields are equal, update project is not called
     */
    @Test
    void whenAllFieldsAreEqualForInternalProject() {
      Projects rmProject = Projects.create();
      rmProject.setName(internalProjectName);
      rmProject.setStartDate(internalProjectStartDate);
      rmProject.setEndDate(internalProjectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg2);

      Project s4Project = mock(Project.class);

      doReturn(rmProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(0)).updateProject(any());
    }

    /**
     * When existing Internal Project name is changed
     */
    @Test
    void whenForInternalProjectNameIsChanged() {
      Projects rmProject = Projects.create();
      rmProject.setName(internalProjectName);
      rmProject.setStartDate(internalProjectStartDate);
      rmProject.setEndDate(internalProjectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg2);

      Projects changedProject = Projects.create();
      changedProject.setName("CHANGED NAME");
      changedProject.setStartDate(internalProjectStartDate);
      changedProject.setEndDate(internalProjectEndDate);
      changedProject.setServiceOrganizationCode(serviceOrg2);

      Project s4Project = mock(Project.class);

      doReturn(changedProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(1)).updateProject(any());
    }

    /**
     * When Internal Project dates are changed, update project is called
     */
    @Test
    void whenInternalProjectDatesAreChanged() {
      Projects rmProject = Projects.create();
      rmProject.setName(internalProjectName);
      rmProject.setStartDate(internalProjectStartDate);
      rmProject.setEndDate(internalProjectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg2);

      LocalDate projectNewStartDate = LocalDate.of(2021, 02, 01);
      LocalDate projectNewEndDate = LocalDate.of(2021, 12, 01);

      Projects changedProject = Projects.create();
      changedProject.setName(internalProjectName);
      changedProject.setStartDate(projectNewStartDate);
      changedProject.setEndDate(projectNewEndDate);
      changedProject.setServiceOrganizationCode(serviceOrg2);

      Project s4Project = mock(Project.class);

      doReturn(changedProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(1)).updateProject(any());
    }

    /**
     * When Internal Project service org is changed, update project is called
     */
    @Test
    void whenInternalProjectServiceOrgIsChanged() {
      Projects rmProject = Projects.create();
      rmProject.setName(internalProjectName);
      rmProject.setStartDate(internalProjectStartDate);
      rmProject.setEndDate(internalProjectEndDate);
      rmProject.setServiceOrganizationCode(serviceOrg2);

      Projects changedProject = Projects.create();
      changedProject.setName(internalProjectName);
      changedProject.setStartDate(internalProjectStartDate);
      changedProject.setEndDate(internalProjectEndDate);
      changedProject.setServiceOrganizationCode("1110");

      Project s4Project = mock(Project.class);

      doReturn(changedProject).when(mockTransformS4ToRM).transformProject(s4Project);
      doNothing().when(mockProjectRepository).updateProject(any());
      cut.compareAndChangeProject(s4Project, rmProject);

      verify(mockProjectRepository, times(1)).updateProject(any());
    }

  }

  @Nested
  @DisplayName("Unit Test for isWorkPackageAttributesChanged method")
  class IsWorkPackageAttributesChanged {

    String wpName = "Test WorkPackage";
    LocalDate wpStartDate = LocalDate.of(2020, 01, 01);
    LocalDate wpEndDate = LocalDate.of(2020, 12, 31);

    /**
     * When there is no change in work package, return false
     */
    @Test
    void whenNoChangeInWP() {
      WorkPackages s4Wp = WorkPackages.create();
      s4Wp.setName(wpName);
      s4Wp.setStartDate(wpStartDate);
      s4Wp.setEndDate(wpEndDate);

      WorkPackages rmWp = WorkPackages.create();
      rmWp.setName(wpName);
      rmWp.setStartDate(wpStartDate);
      rmWp.setEndDate(wpEndDate);

      assertFalse(cut.isWorkPackageAttributesChanged(s4Wp, rmWp));
    }

    /**
     * When work package name is changed, return true
     */
    @Test
    void whenWPNameChanged() {
      WorkPackages s4Wp = WorkPackages.create();
      s4Wp.setName(wpName);
      s4Wp.setStartDate(wpStartDate);
      s4Wp.setEndDate(wpEndDate);

      WorkPackages rmWp = WorkPackages.create();
      rmWp.setName("Changed Name");
      rmWp.setStartDate(wpStartDate);
      rmWp.setEndDate(wpEndDate);

      assertTrue(cut.isWorkPackageAttributesChanged(s4Wp, rmWp));
    }

    /**
     * When work package start-date is changed, return true
     */
    @Test
    void whenWPStartDateChanged() {
      WorkPackages s4Wp = WorkPackages.create();
      s4Wp.setName(wpName);
      s4Wp.setStartDate(wpStartDate);
      s4Wp.setEndDate(wpEndDate);

      WorkPackages rmWp = WorkPackages.create();
      rmWp.setName(wpName);
      rmWp.setStartDate(LocalDate.of(2020, 01, 31));
      rmWp.setEndDate(wpEndDate);

      assertTrue(cut.isWorkPackageAttributesChanged(s4Wp, rmWp));
    }

    /**
     * When work package end-date is changed, return true
     */
    @Test
    void whenWPEndDateChanged() {
      WorkPackages s4Wp = WorkPackages.create();
      s4Wp.setName(wpName);
      s4Wp.setStartDate(wpStartDate);
      s4Wp.setEndDate(wpEndDate);

      WorkPackages rmWp = WorkPackages.create();
      rmWp.setName(wpName);
      rmWp.setStartDate(wpStartDate);
      rmWp.setEndDate(LocalDate.of(2020, 12, 01));

      assertTrue(cut.isWorkPackageAttributesChanged(s4Wp, rmWp));
    }

    /**
     * When work package is null, ServiceException is thrown
     */
    @Test
    void whenWpIsNull() {
      WorkPackages s4Wp = WorkPackages.create();
      s4Wp.setName(wpName);
      s4Wp.setStartDate(wpStartDate);
      s4Wp.setEndDate(wpEndDate);

      assertThrows(ServiceException.class, () -> cut.isWorkPackageAttributesChanged(s4Wp, null));
    }
  }

  @Nested
  @DisplayName("Unit Test for isDemandAttributesChanged method")
  class IsDemandAttributesChanged {

    String workItem = "USR01";
    String workItemName = "Test01";
    String billingRole = "T001";
    LocalDate startDate = LocalDate.of(2020, 01, 01);
    LocalDate endDate = LocalDate.of(2020, 12, 31);
    BigDecimal requestedQuantity = new BigDecimal(100);

    /**
     * When there is no change in demand, return false
     */
    @Test
    void whenNoChangeInDemand() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName(workItemName);

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertFalse(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When billing role is changed, return true
     */
    @Test
    void whenDemandBillingRoleIsChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId("T002");
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName(workItemName);

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertTrue(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When WorkItem is changed, return true
     */
    @Test
    void whenWorkItemIsChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem("USR02");
      s4Demand.setWorkItemName(workItemName);

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertTrue(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When WorkItem Name is changed, return true
     */
    @Test
    void whenWorkItemNameIsChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName("Test02");

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertTrue(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When WorkItem and Name is not changed, return false
     */
    @Test
    void whenWorkItemNameIsNotChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName(workItemName);

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertFalse(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When WorkItem is changed because of NULL for existing projects, return true
     */
    @Test
    void whenWorkItemNameIsNullAndChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName("Test02");

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(null);
      rmDemand.setWorkItemName(null);

      assertTrue(cut.isDemandAttributesChanged(s4Demand, rmDemand));
      assertTrue(cut.isDemandAttributesChanged(rmDemand, s4Demand));
    }

    /**
     * When WorkItem is not really changed because of NULL for existing projects,
     * return false
     */
    @Test
    void whenWorkItemNameIsNullAndNotChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem("");
      s4Demand.setWorkItemName("");

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(null);
      rmDemand.setWorkItemName(null);

      assertFalse(cut.isDemandAttributesChanged(s4Demand, rmDemand));
      assertFalse(cut.isDemandAttributesChanged(rmDemand, s4Demand));
    }

    /**
     * When requested quantity is changed, return true
     */
    @Test
    void whenDemandQuantityIsChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(new BigDecimal(110));
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName(workItemName);

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertTrue(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When start date is changed, return true
     */
    @Test
    void whenDemandStartDateIsChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(LocalDate.of(2020, 01, 31));
      s4Demand.setEndDate(endDate);
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName(workItemName);

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertTrue(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When end date is changed, return true
     */
    @Test
    void whenDemandEndDateIsChanged() {
      Demands s4Demand = Demands.create();
      s4Demand.setBillingRoleId(billingRole);
      s4Demand.setRequestedQuantity(requestedQuantity);
      s4Demand.setStartDate(startDate);
      s4Demand.setEndDate(LocalDate.of(2020, 12, 01));
      s4Demand.setWorkItem(workItem);
      s4Demand.setWorkItemName(workItemName);

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertTrue(cut.isDemandAttributesChanged(s4Demand, rmDemand));
    }

    /**
     * When demand is null, throw ServiceException
     */
    @Test
    void whenDemandIsNull() {

      Demands rmDemand = Demands.create();
      rmDemand.setBillingRoleId(billingRole);
      rmDemand.setRequestedQuantity(requestedQuantity);
      rmDemand.setStartDate(startDate);
      rmDemand.setEndDate(endDate);
      rmDemand.setWorkItem(workItem);
      rmDemand.setWorkItemName(workItemName);

      assertThrows(ServiceException.class, () -> cut.isDemandAttributesChanged(null, rmDemand));
    }
  }

  @Nested
  @DisplayName("Unit Test for traverseWorkPackagesToMapAndSet method")
  class TraverseWorkPackagesToMapAndSet {

    String wpName = "Test WorkPackage";
    LocalDate wpStartDate = LocalDate.of(2020, 01, 01);
    LocalDate wpEndDate = LocalDate.of(2020, 12, 31);

    /**
     * Traversing different workpackages, adds multiple values to Map and Set
     */
    @Test
    void traversingDifferentWorkPackages() {
      List<WorkPackages> workPackages = new ArrayList<>();

      WorkPackages wp1 = WorkPackages.create();
      wp1.setId("1");
      wp1.setName(wpName);
      wp1.setStartDate(wpStartDate);
      wp1.setEndDate(wpEndDate);
      workPackages.add(wp1);

      WorkPackages wp2 = WorkPackages.create();
      wp2.setId("2");
      wp2.setName(wpName);
      wp2.setStartDate(wpStartDate);
      wp2.setEndDate(wpEndDate);
      workPackages.add(wp2);

      cut.traverseWorkPackagesToMapAndSet(workPackages);

      assertEquals(2, cut.getWorkPackageMap().size());
      assertEquals(2, cut.getWorkPackageRMSet().size());
    }

    /**
     * Traversing same workpackages, adds one values to Map and Set
     */
    @Test
    void traverseSameWorkPackageTwice() {
      List<WorkPackages> workPackages = new ArrayList<>();

      WorkPackages wp1 = WorkPackages.create();
      wp1.setId("1");
      wp1.setName(wpName);
      wp1.setStartDate(wpStartDate);
      wp1.setEndDate(wpEndDate);
      workPackages.add(wp1);

      WorkPackages wp2 = WorkPackages.create();
      wp2.setId("1");
      wp2.setName(wpName);
      wp2.setStartDate(wpStartDate);
      wp2.setEndDate(wpEndDate);
      workPackages.add(wp2);

      cut.traverseWorkPackagesToMapAndSet(workPackages);

      assertEquals(1, cut.getWorkPackageMap().size());
      assertEquals(1, cut.getWorkPackageRMSet().size());
    }

  }

  @Nested
  @DisplayName("Unit Test for traverseDemandsToMapAndSet method")
  class TraverseDemandsToMapAndSet {

    String billingRole = "T001";
    LocalDate startDate = LocalDate.of(2020, 01, 01);
    LocalDate endDate = LocalDate.of(2020, 12, 31);
    BigDecimal requestedQuantity = new BigDecimal(100);

    /**
     * Traversing different demands, adds multiple values to Map and Set
     */
    @Test
    void traversingDifferentDemands() {
      List<Demands> demands = new ArrayList<>();

      Demands demand1 = Demands.create();
      demand1.setExternalID("0010");
      demand1.setBillingRoleId(billingRole);
      demand1.setRequestedQuantity(requestedQuantity);
      demand1.setStartDate(startDate);
      demand1.setEndDate(endDate);
      demands.add(demand1);

      Demands demand2 = Demands.create();
      demand2.setExternalID("0011");
      demand2.setBillingRoleId(billingRole);
      demand2.setRequestedQuantity(requestedQuantity);
      demand2.setStartDate(startDate);
      demand2.setEndDate(endDate);
      demands.add(demand2);

      cut.traverseDemandsToMapAndSet(demands);

      assertEquals(2, cut.getDemandMap().size());
      assertEquals(2, cut.getDemandRMSet().size());
    }

    /**
     * Traversing same demands, adds one values to Map and Set
     */
    @Test
    void traversingSameDemandTwice() {
      List<Demands> demands = new ArrayList<>();

      Demands demand1 = Demands.create();
      demand1.setExternalID("0010");
      demand1.setBillingRoleId(billingRole);
      demand1.setRequestedQuantity(requestedQuantity);
      demand1.setStartDate(startDate);
      demand1.setEndDate(endDate);
      demands.add(demand1);

      Demands demand2 = Demands.create();
      demand2.setExternalID("0010");
      demand2.setBillingRoleId(billingRole);
      demand2.setRequestedQuantity(requestedQuantity);
      demand2.setStartDate(startDate);
      demand2.setEndDate(endDate);
      demands.add(demand2);

      cut.traverseDemandsToMapAndSet(demands);

      assertEquals(1, cut.getDemandMap().size());
      assertEquals(1, cut.getDemandRMSet().size());
    }
  }

  @Nested
  @DisplayName("Unit Test for deleteWorkPackages method")
  class DeleteWorkPackages {
    List<Demands> demands;
    ResourceRequests resourceRequest1, resourceRequest2;
    Demands demand1, demand2;
    Set<String> wpS4Set, wpRmSet;

    @BeforeEach
    public void setUp() {
      MockitoAnnotations.initMocks(this);
      demands = new ArrayList<>();

      demand1 = Demands.create();
      demand1.setId("demand1");
      demand1.setWorkPackageId("WP1.1.1");
      demands.add(demand1);

      demand2 = Demands.create();
      demand2.setId("demand1");
      demand2.setWorkPackageId("WP1.1.2");
      demands.add(demand2);

      wpS4Set = new HashSet<>();
      wpRmSet = new HashSet<>();

      resourceRequest1 = ResourceRequests.create();
      resourceRequest2 = ResourceRequests.create();

      resourceRequest1.setId("rr1");
      resourceRequest1.setDemandId("demand1");

      resourceRequest1.setId("rr2");
      resourceRequest1.setDemandId("demand2");

    }

    /**
     * When RM and S4 has same number of Work Packages, delete workpackage is not
     * called
     */
    @Test
    void whenRmAndS4HasSameWorkPackages() {

      wpS4Set.add("WP1.1.1");
      wpS4Set.add("WP1.1.2");

      wpRmSet.add("WP1.1.1");
      wpRmSet.add("WP1.1.2");

      cut.setWorkPackageS4Set(wpS4Set);
      cut.setWorkPackageRMSet(wpRmSet);

      doNothing().when(mockWorkPackageRepository).deleteWorkPackage(any());

      cut.deleteWorkPackages();

      verify(mockWorkPackageRepository, times(0)).deleteWorkPackage(any());
    }

    /**
     * When S4 has 1 WP, and RM has 2 WP, delete workpackage is called once
     * corresponding demand and it's corresponding resource request are deleted as
     * well
     */
    @Test
    void whenRmHasMoreWorkPackagesThanS4() {
      final DetermineChange spy = spy(cut);

      wpS4Set.add("WP1.1.1");
      spy.setWorkPackageS4Set(wpS4Set);

      wpRmSet.add("WP1.1.1");
      wpRmSet.add("WP1.1.2");
      spy.setWorkPackageRMSet(wpRmSet);

      doReturn(demands).when(mockDemandRepository).selectDemandForWorkPackage(any());

      doReturn(resourceRequest2).when(mockResourceRequestRepository).selectResourceRequestForDemand(any());

      doNothing().when(mockWorkPackageRepository).deleteWorkPackage(any());

      doNothing().when(spy).deleteResourceRequestsAndCorrrespondingAssignments(anyString());

      spy.deleteWorkPackages();

      verify(mockWorkPackageRepository, times(1)).deleteWorkPackage(any());
    }

    /**
     * When S4 has 1 WP, and RM has 2 WP, delete workpackage is called once
     * Corresponding Demand doesn't have resource request
     */
    @Test
    void whenRmHasMoreWorkPackagesThanS4AndNoRR() {
      final DetermineChange spy = spy(cut);

      wpS4Set.add("WP1.1.1");
      spy.setWorkPackageS4Set(wpS4Set);

      wpRmSet.add("WP1.1.1");
      wpRmSet.add("WP1.1.2");
      spy.setWorkPackageRMSet(wpRmSet);

      doReturn(demands).when(mockDemandRepository).selectDemandForWorkPackage(any());

      doReturn(null).when(mockResourceRequestRepository).selectResourceRequestForDemand(any());

      doNothing().when(mockWorkPackageRepository).deleteWorkPackage(any());

      spy.deleteWorkPackages();

      verify(spy, times(0)).deleteResourceRequestsAndCorrrespondingAssignments(any());

      verify(mockWorkPackageRepository, times(1)).deleteWorkPackage(any());
    }

    /**
     * When RM has 1 WP, and S4 has 2 WP, delete workpackage is not called, as its a
     * creation scenario
     */
    @Test
    void whenS4HasMoreWorkPackagesThanRm() {

      wpS4Set.add("WP1.1.1");
      wpS4Set.add("WP1.1.2");
      cut.setWorkPackageS4Set(wpS4Set);

      wpRmSet.add("WP1.1.1");
      cut.setWorkPackageRMSet(wpRmSet);

      doNothing().when(mockWorkPackageRepository).deleteWorkPackage(any());
      cut.deleteWorkPackages();

      verify(mockWorkPackageRepository, times(0)).deleteWorkPackage(any());
    }

    /**
     * When deleteWorkpackage throws an exception, handle gracefully
     */
    @Test
    void whenWPDeleteThrowsException() {

      wpS4Set.add("WP1.1.1");
      cut.setWorkPackageS4Set(wpS4Set);

      wpRmSet.add("WP1.1.1");
      wpRmSet.add("WP1.1.2");
      cut.setWorkPackageRMSet(wpRmSet);

      ServiceException e = new ServiceException("Exception occured while deleting work package");

      doThrow(e).when(mockWorkPackageRepository).deleteWorkPackage(any());

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.deleteWorkPackages());
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Unit Test for deleteDemands method")
  class DeleteDemands {

    private Demands rmDemand;
    private ResourceRequests resourceRequest;
    String demandID;
    String resourceRequestId;
    Set<String> demandS4Set;
    Set<String> demandRmSet;
    HashMap<String, Demands> demandMap;

    @BeforeEach
    public void setUp() {
      MockitoAnnotations.initMocks(this);
      resourceRequestId = "rr1";
      demandID = "0011";
      demandS4Set = new HashSet<>();
      demandRmSet = new HashSet<>();

      rmDemand = Demands.create();
      rmDemand.setId(demandID);

      resourceRequest = ResourceRequests.create();
      resourceRequest.setId(resourceRequestId);
      resourceRequest.setDemandId(demandID);

      demandMap = new HashMap<>();
    }

    /**
     * When RM and S4 has same number of Demands, delete demand is not called
     */
    @Test
    void whenRmAndS4HasSameDemands() {

      demandS4Set.add("0010");
      demandS4Set.add("0011");
      cut.setDemandS4Set(demandS4Set);

      demandRmSet.add("0010");
      demandRmSet.add("0011");
      cut.setDemandRMSet(demandRmSet);

      doNothing().when(mockDemandRepository).deleteDemand(any());

      cut.deleteDemands("WP.1.1");

      verify(mockDemandRepository, times(0)).deleteDemand(any());
    }

    /**
     * When RM has 2 Demands and S4 has 1 Demand, delete demand is called once
     * demand doesn't have resource request,
     * deleteResourceRequestsAndCorrrespondingAssignments is not called
     */
    @Test
    void whenRmHasMoreDemandThanS4() {
      final DetermineChange spy = spy(cut);

      demandS4Set.add("0010");
      spy.setDemandS4Set(demandS4Set);

      demandRmSet.add("0010");
      demandRmSet.add("0011");
      spy.setDemandRMSet(demandRmSet);

      demandMap.put(demandID, rmDemand);
      spy.setDemandMap(demandMap);

      doNothing().when(mockDemandRepository).deleteDemand(any());
      doReturn(null).when(mockResourceRequestRepository).selectResourceRequestForDemand(anyString());

      spy.deleteDemands("WP.1.1");

      verify(mockDemandRepository, times(1)).deleteDemand(any());
      verify(spy, times(0)).deleteResourceRequestsAndCorrrespondingAssignments(resourceRequest.getId());
    }

    /**
     * When RM has 2 Demands and S4 has 1 Demand, delete demand is called once
     * demand has resource request,
     * deleteResourceRequestsAndCorrrespondingAssignments is called once
     */
    @Test
    void whenRmHasMoreDemandThanS4AndResReq() {

      final DetermineChange spy = spy(cut);

      demandS4Set.add("0010");
      spy.setDemandS4Set(demandS4Set);

      demandRmSet.add("0010");
      demandRmSet.add("0011");
      spy.setDemandRMSet(demandRmSet);

      demandMap.put(demandID, rmDemand);
      spy.setDemandMap(demandMap);

      doNothing().when(mockDemandRepository).deleteDemand(any());
      doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(anyString());

      spy.deleteDemands("WP.1.1");

      verify(mockDemandRepository, times(1)).deleteDemand(any());
      verify(spy, times(1)).deleteResourceRequestsAndCorrrespondingAssignments(resourceRequest.getId());
    }

    /**
     * When S4 has 2 Demands and RM has 1 Demand, delete demand is not called
     */
    @Test
    void whenS4HasMoreDemandThanRM() {
      Set<String> demandS4Set = new HashSet<>();
      demandS4Set.add("0010");
      demandS4Set.add("0011");
      cut.setDemandS4Set(demandS4Set);

      Set<String> demandRmSet = new HashSet<>();
      demandRmSet.add("0010");
      cut.setDemandRMSet(demandRmSet);

      doNothing().when(mockDemandRepository).deleteDemand(any());
      cut.deleteDemands("WP.1.1");

      verify(mockDemandRepository, times(0)).deleteDemand(any());
    }

    /**
     * When deleteDemand throws an Exception
     */
    @Test
    void whenDeleteDemandThrowsAnException() {
      Set<String> demandS4Set = new HashSet<>();
      demandS4Set.add("0010");
      cut.setDemandS4Set(demandS4Set);

      Set<String> demandRmSet = new HashSet<>();
      demandRmSet.add("0010");
      demandRmSet.add("0011");
      cut.setDemandRMSet(demandRmSet);

      ServiceException e = new ServiceException("Error occured while deleting demands and resource request");

      doThrow(e).when(mockDemandRepository).deleteDemand(any());

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.deleteDemands("WP.1.1"));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Unit Test for deleteWorkPackagesOfProject method")
  class DeleteWorkPackagesOfProject {

    /**
     * When there no workpackages of that project, deleteWorkPackage is not called
     */
    @Test
    void whenNoWorkPackages() {
      List<WorkPackages> workPackagesFromRM = new ArrayList<>();

      doReturn(workPackagesFromRM).when(mockWorkPackageRepository).selectWorkPackageForProject(any());
      doNothing().when(mockWorkPackageRepository).deleteWorkPackage(any());
      cut.deleteWorkPackagesOfProject("Project1");

      verify(mockWorkPackageRepository, times(0)).deleteWorkPackage(any());
    }

    // when there workpackages for a project, deleteWorkPackage is called
    @Test
    void whenS4HasMoreDemandThanRM() {
      List<WorkPackages> workPackagesFromRM = new ArrayList<>();
      WorkPackages workPackage = WorkPackages.create();
      workPackage.put("ID", "WP1");
      workPackagesFromRM.add(workPackage);

      doReturn(workPackagesFromRM).when(mockWorkPackageRepository).selectWorkPackageForProject(any());
      doNothing().when(mockWorkPackageRepository).deleteWorkPackage(any());
      cut.deleteWorkPackagesOfProject("Project1");

      verify(mockWorkPackageRepository, times(1)).deleteWorkPackage(any());
    }

    /**
     * When deleteWorkPackagesOfProject throws an Exception
     */
    @Test
    void whenDeleteWorkPackagesOfProjectThrowsAnException() {
      List<WorkPackages> workPackagesFromRM = new ArrayList<>();
      WorkPackages workPackage = WorkPackages.create();
      workPackage.put("ID", "WP1");
      workPackagesFromRM.add(workPackage);

      doReturn(workPackagesFromRM).when(mockWorkPackageRepository).selectWorkPackageForProject(any());
      ServiceException e = new ServiceException("Exception occured while deleting workpackage");

      doThrow(e).when(mockWorkPackageRepository).deleteWorkPackage(any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.deleteWorkPackagesOfProject("WP1"));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Unit Test for DeleteDemandsOfWorkPackage method")
  class DeleteDemandsOfWorkPackage {

    /**
     * When there no demands for a workpackage, delete demand is not called
     */
    @Test
    void whenWPHasNoDemands() {
      List<Demands> demandsFromRM = new ArrayList<>();

      doReturn(demandsFromRM).when(mockDemandRepository).selectDemandForWorkPackage(any());
      doNothing().when(mockDemandRepository).deleteDemand(any());
      cut.deleteDemandsOfWorkPackage("WP1");

      verify(mockDemandRepository, times(0)).deleteDemand(any());
    }

    /**
     * 1. When workPackage has demands, delete demand is called 2. When demand has
     * resource request, delete resource request is called
     */
    @Test
    void whenDemandAndResReqExist() {
      List<Demands> demandsFromRM = new ArrayList<>();
      Demands demand = Demands.create();
      demand.put("ID", "demand1");
      demandsFromRM.add(demand);

      // List<ResourceRequests> resourceRequests = new ArrayList<>();
      ResourceRequests resourceRequest = ResourceRequests.create();
      resourceRequest.put("ID", "resreq1");
      // resourceRequests.add(resourceRequest);

      doReturn(demandsFromRM).when(mockDemandRepository).selectDemandForWorkPackage(any());
      doNothing().when(mockDemandRepository).deleteDemand(any());

      // when(mockResourceRequestRepository.deleteResourceRequest("demand1").then(resourceRequests);
      doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(any());
      doNothing().when(mockResourceRequestRepository).deleteResourceRequest(any());
      cut.deleteDemandsOfWorkPackage("WP1");

      verify(mockResourceRequestRepository, times(1)).deleteResourceRequest(any());
      verify(mockDemandRepository, times(1)).deleteDemand(any());
    }

    /**
     * When deleteDemand throws an Exception
     */
    @Test
    void whenDeleteDemandThrowsAnException() {
      List<Demands> demandsFromRM = new ArrayList<>();
      Demands demand = Demands.create();
      demand.put("ID", "demand1");
      demandsFromRM.add(demand);

      // List<ResourceRequests> resourceRequests = new ArrayList<>();
      ResourceRequests resourceRequest = ResourceRequests.create();
      resourceRequest.put("ID", "resreq1");
      // resourceRequests.add(resourceRequest);

      doReturn(demandsFromRM).when(mockDemandRepository).selectDemandForWorkPackage(any());

      ServiceException e = new ServiceException("Error occured while deleting demands and resource request");

      doThrow(e).when(mockDemandRepository).deleteDemand(any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.deleteDemandsOfWorkPackage("demand"));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Unit Test for deleteProjects method")
  class DeleteProjects {

    /**
     * When RM and S4 has same number of Projects, delete Projects is not called
     */
    @Test
    void whenRmAndS4HasSameProjects() {

      s4Projects.add(projectS4Set1);
      s4Projects.add(projectS4Set2);
      rmProjects.add(project1);
      rmProjects.add(project2);

      List<String> serviceOrganizationsWithInitialLoadDone = new ArrayList<>();
      serviceOrganizationsWithInitialLoadDone.add("1010");
      serviceOrganizationsWithInitialLoadDone.add("1710");

      doReturn(rmProjects).when(mockProjectRepository)
          .getProjectsByServiceOrganization(serviceOrganizationsWithInitialLoadDone);

      doNothing().when(mockProjectRepository).deleteProject(any());
      cut.deleteProjects(s4Projects, serviceOrganizationsWithInitialLoadDone);

      verify(mockProjectRepository, times(0)).deleteProject(any());
      verify(mockProjectRepository, times(0)).deleteProjectSync(any());
    }

    /**
     * When S4 has 2 Projects and RM has 1 Project, delete project is not called
     */
    @Test
    void whenS4HasMoreProjectsThanRM() {

      s4Projects.add(projectS4Set1);
      s4Projects.add(projectS4Set2);
      rmProjects.add(project1);

      List<String> serviceOrganizationsWithInitialLoadDone = new ArrayList<>();
      serviceOrganizationsWithInitialLoadDone.add("1010");
      serviceOrganizationsWithInitialLoadDone.add("1710");

      doReturn(rmProjects).when(mockProjectRepository)
          .getProjectsByServiceOrganization(serviceOrganizationsWithInitialLoadDone);
      doNothing().when(mockProjectRepository).deleteProject(any());

      cut.deleteProjects(s4Projects, serviceOrganizationsWithInitialLoadDone);

      verify(mockProjectRepository, times(0)).deleteProject(any());
      verify(mockProjectRepository, times(0)).deleteProjectSync(any());
    }

    /**
     * 1. When RM has 2 Projects and S4 has 1 Project, delete project is called once
     * 2. When the customer has no more projects in RM, then delete customer is
     * called
     */
    @Test
    void whenRmHasMoreProjectsThanS4() {

      s4Projects.add(projectS4Set1);
      rmProjects.add(project1);
      rmProjects.add(project2);

      List<String> serviceOrganizationsWithInitialLoadDone = new ArrayList<>();
      serviceOrganizationsWithInitialLoadDone.add("1010");
      serviceOrganizationsWithInitialLoadDone.add("1710");

      doReturn(rmProjects).when(mockProjectRepository)
          .getProjectsByServiceOrganization(serviceOrganizationsWithInitialLoadDone);
      doReturn(customer1).when(mockProjectRepository).getCustomer(project2);
      doReturn(0).when(mockProjectRepository).getCustomerProject(customer1);

      doNothing().when(mockProjectRepository).deleteProject(any());
      doNothing().when(mockProjectRepository).deleteCustomer(any());
      cut.deleteProjects(s4Projects, serviceOrganizationsWithInitialLoadDone);

      verify(mockProjectRepository, times(1)).deleteCustomer(any());
      verify(mockProjectRepository, times(1)).deleteProject(any());
      verify(mockProjectRepository, times(1)).deleteProjectSync(any());

    }

    /**
     * 1. When RM has 2 Projects and S4 has 1 Project, delete project is called once
     * 2. When the customer has more projects in RM, then delete customer is not
     * called
     */
    @Test
    void whenRmHasMoreProjThanS4WithNoCstmrDelete() {

      s4Projects.add(projectS4Set1);
      s4Projects.add(projectS4Set2);
      rmProjects.add(project1);
      rmProjects.add(project2);
      rmProjects.add(project3);

      List<String> serviceOrganizationsWithInitialLoadDone = new ArrayList<>();
      serviceOrganizationsWithInitialLoadDone.add("1010");
      serviceOrganizationsWithInitialLoadDone.add("1710");

      doReturn(rmProjects).when(mockProjectRepository)
          .getProjectsByServiceOrganization(serviceOrganizationsWithInitialLoadDone);
      doReturn(customer1).when(mockProjectRepository).getCustomer(project3);
      doReturn(1).when(mockProjectRepository).getCustomerProject(customer1);

      doNothing().when(mockProjectRepository).deleteProject(any());
      doNothing().when(mockProjectRepository).deleteCustomer(any());

      cut.deleteProjects(s4Projects, serviceOrganizationsWithInitialLoadDone);

      verify(mockProjectRepository, times(0)).deleteCustomer(any());
      verify(mockProjectRepository, times(1)).deleteProject(any());
      verify(mockProjectRepository, times(1)).deleteProjectSync(any());

    }

    /**
     * 1. When RM has 2 Projects and S4 has 1 Project, delete project is called once
     * 2. When the project deleted is an internal project, then delete customer is
     * not called
     */
    @Test
    void whenInternalProjectIsTobeDeletedNoCstmrDelete() {

      s4Projects.add(projectS4Set1);
      s4Projects.add(projectS4Set2);
      rmProjects.add(project1);
      rmProjects.add(project2);
      rmProjects.add(project3);

      List<String> serviceOrganizationsWithInitialLoadDone = new ArrayList<>();
      serviceOrganizationsWithInitialLoadDone.add("1010");
      serviceOrganizationsWithInitialLoadDone.add("1710");

      doReturn(rmProjects).when(mockProjectRepository)
          .getProjectsByServiceOrganization(serviceOrganizationsWithInitialLoadDone);
      doReturn(null).when(mockProjectRepository).getCustomer(project3);

      doNothing().when(mockProjectRepository).deleteProject(any());
      doNothing().when(mockProjectRepository).deleteCustomer(any());

      cut.deleteProjects(s4Projects, serviceOrganizationsWithInitialLoadDone);

      verify(mockProjectRepository, times(0)).deleteCustomer(any());
      verify(mockProjectRepository, times(1)).deleteProject(any());
      verify(mockProjectRepository, times(1)).deleteProjectSync(any());

    }

    /**
     * When deleteProject throws an Exception
     */
    /*
    */
    @Test
    void whenDeleteProjectThrowsAnException() {
      s4Projects.add(projectS4Set1);
      rmProjects.add(project1);
      rmProjects.add(project2);

      List<String> serviceOrganizationsWithInitialLoadDone = new ArrayList<>();
      serviceOrganizationsWithInitialLoadDone.add("1010");
      serviceOrganizationsWithInitialLoadDone.add("1710");

      doReturn(rmProjects).when(mockProjectRepository)
          .getProjectsByServiceOrganization(serviceOrganizationsWithInitialLoadDone);

      ServiceException e = new ServiceException("Error occured while deleting projects");

      doThrow(e).when(mockProjectRepository).deleteProject(any());
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.deleteProjects(s4Projects, serviceOrganizationsWithInitialLoadDone));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

  }

  @Nested
  @DisplayName("Unit Test for createWorkPackageTree method")
  class CreateWorkPackageTree {
    @Mock
    com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage mockS4WorkPackage;

    @Mock
    com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd mockS4ResourceDemand;    
    @Mock
    Demands mockRMDemand;
    com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage s4WorkPackage;
    List<CdsData> demands;

    List<CdsData> resourceRequests = new ArrayList<>();
    public static final String DEMAND_CURRENT_EXECUTION_VERSION_ID = "2";
    private EngmntProjRsceDmnd resourceDemands;
    WorkPackages rmWorkPackage;
    private Demands rmDemand;
    private ResourceRequests resourcerequest;
    private List<EngmntProjRsceDmnd> resourceDemandList;
    private Map<String, String> demandMap;
    String demandID;
    String resourceID;
    String resourceDemand;


    @BeforeEach
    public void setUp() {
      MockitoAnnotations.initMocks(this);
      s4WorkPackage = new com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage();
      resourceID = "res1";
      resourceDemand = "resource demand";
      resourceDemands = new EngmntProjRsceDmnd();
      resourceDemands.setEngagementProjectResource(resourceID);
      resourceDemands.setResourceDemand(resourceDemand);
      resourceDemandList = new ArrayList<>();
      resourceDemands.setVersion(Constants.S4Constants.DEMAND_CURRENT_PLAN_VERSION_ID);
      resourceDemandList.add(resourceDemands);
      demands = new ArrayList<>();
      rmDemand = Demands.create();
      demandID = "demand1";
      demandMap = new HashMap<>();
      demandMap.put(Demands.ID, demandID);
      rmDemand.putAll(demandMap);
      demands.add(rmDemand);
      resourcerequest = ResourceRequests.create();
      resourcerequest.setId("reqID1");
      s4WorkPackage.setWorkPackageID("wp1");
      s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 01, 01, 0, 0));
      s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 31, 0, 0));
      s4WorkPackage.setProjectID("projectID");

      rmWorkPackage = WorkPackages.create();
    }

    /**
     * create wp tree
     *
     *
     */
    @Test
    void createWorkPackageTree() throws ODataException {

      // when(mockTransformS4ToRM.transformWorkPackage(mockS4WorkPackage)).thenReturn(rmWorkPackage);
      doNothing().when(mockWorkPackageRepository).createWorkPackage(any());
      when(mockS4ResourceDemand.getVersion()).thenReturn(Constants.S4Constants.DEMAND_CURRENT_PLAN_VERSION_ID);       
      when(mockS4WorkPackage.getResourceDemandOrFetch()).thenReturn(resourceDemandList);
      when(mockS4WorkPackage.getWPStartDate()).thenReturn(s4WorkPackage.getWPStartDate());
      when(mockS4WorkPackage.getWPEndDate()).thenReturn(s4WorkPackage.getWPEndDate());
      when(mockTransformS4ToRM.transformDemandAndDistribution(any(), any(), any(), any(), any())).thenReturn(rmDemand);
      when(mockTransformDemandToResourceRequest.transformDemandToRequest(any(), anyString(), any()))
          .thenReturn(resourcerequest);
      doNothing().when(mockRMDemand).putAll(any());
      doReturn(resourcerequest).when(mockTransformDemandToResourceRequest).transformDemandToRequest(any(), anyString(),
          any());
      doNothing().when(mockDemandRepository).upsertDemands(demands);
      doNothing().when(mockResourceRequestRepository).upsertResourceRequests(any());

      cut.createWorkPackageTree(mockS4WorkPackage, any(), true);

      verify(mockDemandRepository, times(1)).upsertDemands(demands);
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequests(any());
    }

    /**
     * create wp tree with demands having versions other than plan version
     *
     *
     */
    @Test
    void validateDemandWithMultipleVersions() throws ODataException {
      resourceDemandList.get(0).setVersion(DEMAND_CURRENT_EXECUTION_VERSION_ID);
      demands.clear();      
      doNothing().when(mockWorkPackageRepository).createWorkPackage(any());
      when(mockS4WorkPackage.getResourceDemandOrFetch()).thenReturn(resourceDemandList);
      when(mockS4ResourceDemand.getVersion()).thenReturn(DEMAND_CURRENT_EXECUTION_VERSION_ID);      
      when(mockS4WorkPackage.getWPStartDate()).thenReturn(s4WorkPackage.getWPStartDate());
      when(mockS4WorkPackage.getWPEndDate()).thenReturn(s4WorkPackage.getWPEndDate());
      when(mockTransformS4ToRM.transformDemandAndDistribution(any(), any(), any(), any(), any())).thenReturn(null);
      when(mockTransformDemandToResourceRequest.transformDemandToRequest(any(), anyString(), any()))
          .thenReturn(resourcerequest);
      doNothing().when(mockRMDemand).putAll(any());
      doReturn(resourcerequest).when(mockTransformDemandToResourceRequest).transformDemandToRequest(any(), anyString(),
          any());
      doNothing().when(mockDemandRepository).upsertDemands(demands);
      doNothing().when(mockResourceRequestRepository).upsertResourceRequests(any());

      cut.createWorkPackageTree(mockS4WorkPackage, any(), true);

      verify(mockDemandRepository, times(1)).upsertDemands(demands);
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequests(any());
    }    
  
   

    /**
     * when service exception occurs
     */
    @Test
    void createWorkPackageTreeException() throws ODataException {

      // when(mockTransformS4ToRM.transformWorkPackage(mockS4WorkPackage)).thenReturn(rmWorkPackage);
      doNothing().when(mockWorkPackageRepository).createWorkPackage(any());
      when(mockS4ResourceDemand.getVersion()).thenReturn(Constants.S4Constants.DEMAND_CURRENT_PLAN_VERSION_ID);       
      when(mockS4WorkPackage.getResourceDemandOrFetch()).thenReturn(resourceDemandList);
      when(mockS4WorkPackage.getWPStartDate()).thenReturn(s4WorkPackage.getWPStartDate());
      when(mockS4WorkPackage.getWPEndDate()).thenReturn(s4WorkPackage.getWPEndDate());
      when(mockTransformS4ToRM.transformDemandAndDistribution(any(), any(), any(), any(), any())).thenReturn(rmDemand);
      when(mockTransformDemandToResourceRequest.transformDemandToRequest(any(), anyString(), any()))
          .thenReturn(resourcerequest);
      doNothing().when(mockRMDemand).putAll(any());
      doReturn(resourcerequest).when(mockTransformDemandToResourceRequest).transformDemandToRequest(any(), anyString(),
          any());
      ServiceException e = new ServiceException("Error occured while creating new workpackage");

      doThrow(e).when(mockDemandRepository).upsertDemands(demands);
      // doNothing().when(mockResourceRequestRepository).upsertResourceRequests(any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.createWorkPackageTree(mockS4WorkPackage, any(), any()));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for compareAndChangeDemand method")
  class CompareAndChangeDemand {
    private String workPackageID = "wp1";
    private String demandID = "demand1";
    private String projectId = "project1";
    LocalDate workPackageStartDate = LocalDate.of(2020, 01, 01);
    LocalDate workPackageEndDate = LocalDate.of(2020, 12, 31);
    private String serviceOrg = "1010";

    private Project s4Project;

    private String projectCategory = Constants.PROJECT_TYPE_CUSTOMER;

    private EngmntProjRsceDmnd s4Demand;
    private Demands rmDemand;
    List<Demands> demands;
    List<EngmntProjRsceDmnd> resourceDemands;
    List<CdsData> rmDemands;
    List<EngmntProjRsceSup> s4Supply;
    ResourceRequests resourceRequest;
    @Mock
    HashMap<String, Demands> mockDemandMap;
    @Mock
    EngmntProjRsceDmnd mockResourceDemand;

    @BeforeEach
    public void setUp() {
      MockitoAnnotations.initMocks(this);
      rmDemand = Demands.create();
      resourceRequest = ResourceRequests.create();
      rmDemand.setId(demandID);
      rmDemand.setExternalID("1001");
      rmDemand.setWorkPackageId(workPackageID);
      rmDemands = new ArrayList<>();
      demands = new ArrayList<>();

      s4Project = new Project();
      s4Project.setProjectID(projectId);
      s4Project.setProjectCategory(projectCategory);

      rmDemands.add(rmDemand);
      demands.add(rmDemand);

      s4Demand = new EngmntProjRsceDmnd();
      s4Demand.setEngagementProject(projectId);
      s4Demand.setDeliveryOrganization(serviceOrg);
      s4Demand.setResourceDemand(demandID);
      s4Demand.setVersion("1");
      s4Demand.setResourceDemand("1001");

      s4Supply = new ArrayList<>();
      s4Demand.setResourceSupply(s4Supply);

      resourceDemands = new ArrayList<>();
      resourceDemands.add(s4Demand);

    }

    /**
     * When s4demand does not present in RM, create demand and resource request
     */
    @Test
    void whenDemandIsNull() {

      final DetermineChange spy = spy(cut);

      doReturn(rmDemands).when(mockDemandRepository).selectDemandForWorkPackage(workPackageID);
      doNothing().when(spy).traverseDemandsToMapAndSet(any());

      doReturn(null).when(mockDemandMap).get(any());
      doReturn(rmDemand).when(mockTransformS4ToRM).transformDemandAndDistribution(s4Demand, workPackageStartDate,
          workPackageEndDate, s4Project.getProjectCategory(), null);
      doNothing().when(mockDemandRepository).upsertDemands(rmDemand);
      doReturn(resourceRequest).when(mockTransformDemandToResourceRequest).transformDemandToRequest(rmDemand, projectId,
          true);
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());
      doNothing().when(spy).deleteDemands(workPackageID);
      spy.compareAndChangeDemand(workPackageID, workPackageStartDate, workPackageEndDate, projectId, resourceDemands,
          s4Project.getProjectCategory(), true, null);

      verify(mockDemandRepository, times(1)).upsertDemands(rmDemand);
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequest(any());
    }

    /**
     * When s4demand updated, update RM demand and corresponding resource request
     * and assignment
     */
    @Test
    void whenDemandUpdate() throws ODataException {

      final DetermineChange spy = spy(cut);

      doReturn(rmDemands).when(mockDemandRepository).selectDemandForWorkPackage(workPackageID);
      doReturn(rmDemand).when(mockDemandMap).get(any());
      doReturn(rmDemand).when(mockTransformS4ToRM).transformDemandAndDistribution(s4Demand, workPackageStartDate,
          workPackageEndDate, s4Project.getProjectCategory(), null);
      doReturn(true).when(spy).isDemandAttributesChanged(any(), any());

      doNothing().when(mockDemandRepository).upsertDemands(rmDemand);
      doReturn(resourceRequest).when(mockTransformDemandToResourceRequest).transformDemandToRequest(rmDemand, projectId,
          true);
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());
      doNothing().when(spy).deleteDemands(workPackageID);
      doReturn(resourceRequest).when(spy).adaptDisruptiveChanges(any(), any(), any());

      spy.compareAndChangeDemand(workPackageID, workPackageStartDate, workPackageEndDate, projectId, resourceDemands,
          s4Project.getProjectCategory(), true, null);

      verify(mockDemandRepository, times(1)).upsertDemands(rmDemand);
      verify(mockAssignmentService, times(1)).compareAndUpdateAssignmentsAsPerSupply(any(), any());
    }

    /**
     * When update demand throws exception
     */
    @Test
    void whenDemandUpdateThrowsException() throws ODataException {
      final DetermineChange spy = spy(cut);

      ServiceException e = new ServiceException("Error occured while comparing demands attributes");
      doReturn(rmDemands).when(mockDemandRepository).selectDemandForWorkPackage(workPackageID);
      doReturn(rmDemand).when(mockDemandMap).get(any());
      doReturn(rmDemand).when(mockTransformS4ToRM).transformDemandAndDistribution(s4Demand, workPackageStartDate,
          workPackageEndDate, s4Project.getProjectCategory(), null);
      doThrow(e).when(spy).isDemandAttributesChanged(any(), any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.compareAndChangeDemand(workPackageID, workPackageStartDate, workPackageEndDate, projectId,
              resourceDemands, s4Project.getProjectCategory(), true, null));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for compareAndChangeWorkPackage method")
  class compareAndChangeWorkPackage {

    private String workPackageID = "wp1";
    private String projectId = "project1";
    LocalDateTime workPackageStartDate = LocalDateTime.of(2020, 01, 01, 00, 00, 00);
    LocalDateTime workPackageEndDate = LocalDateTime.of(2020, 12, 31, 00, 00, 00);
    String projectCategory = Constants.PROJECT_TYPE_CUSTOMER;
    private Project s4Project;
    private WorkPackage s4WorkPackage;
    private WorkItem s4WorkItem;
    private WorkPackages rmWPackage;
    private WorkPackages workPackage;

    List<WorkPackage> s4WorkPackages;
    List<WorkItem> s4workItems;

    List<EngmntProjRsceDmnd> resourceDemands;
    List<CdsData> rmWPackages;
    List<WorkPackages> workPackages;

    ResourceRequests resourceRequest;

    @Mock
    HashMap<String, WorkPackages> mockWorkPacageMap;

    @BeforeEach
    public void setUp() {
      MockitoAnnotations.initMocks(this);
      rmWPackage = WorkPackages.create();
      workPackage = WorkPackages.create();

      rmWPackage.setId(workPackageID);
      rmWPackage.setProjectId(projectId);
      rmWPackages = new ArrayList<>();

      workPackage.setId(workPackageID);
      workPackage.setProjectId(projectId);

      rmWPackages.add(rmWPackage);
      s4Project = new Project();
      s4Project.setProjectID(projectId);
      s4Project.setProjectCategory(projectCategory);

      s4WorkPackage = new WorkPackage();
      s4WorkPackage.setWorkPackageID(workPackageID);
      s4WorkPackage.setWPStartDate(workPackageStartDate);
      s4WorkPackage.setWPEndDate(workPackageEndDate);

      resourceDemands = new ArrayList<>();
      s4WorkPackage.setResourceDemand(resourceDemands);

      s4workItems = new ArrayList<>();
      s4WorkItem = new WorkItem();
      s4WorkItem.setWorkitem("USR01");
      s4WorkItem.setWorkitemname("TEST01");
      s4workItems.add(s4WorkItem);
      s4WorkPackage.setWorkItemSet(s4workItems);

      s4WorkPackages = new ArrayList<>();
      s4WorkPackages.add(s4WorkPackage);
      workPackages = new ArrayList<>();
      workPackages.add(workPackage);

    }

    /**
     * When existing workpckage changes, update workpackage check changes in the
     * demand
     */
    @Test
    void whenExistingWorKpackgeChanged() throws ODataException {
      cut.traverseWorkPackagesToMapAndSet(workPackages);
      final DetermineChange spy = spy(cut);

      doReturn(rmWPackage).when(mockWorkPacageMap).get(any());
      doReturn(workPackage).when(mockTransformS4ToRM).transformWorkPackage(s4WorkPackage);
      doReturn(Boolean.TRUE).when(spy).isWorkPackageAttributesChanged(workPackage, rmWPackage);
      doNothing().when(mockWorkPackageRepository).updateWorkPackage(workPackage);
      doNothing().when(spy).deleteWorkPackages();
      doNothing().when(spy).compareAndChangeDemand(s4WorkPackage.getWorkPackageID(),
          s4WorkPackage.getWPStartDate().toLocalDate(), s4WorkPackage.getWPEndDate().toLocalDate(),
          s4WorkPackage.getProjectID(), s4WorkPackage.getResourceDemandOrFetch(), s4Project.getProjectCategory(), true,
          s4workItems);

      spy.compareAndChangeWorkPackage(s4WorkPackages, s4Project.getProjectCategory(), true);

      verify(spy, times(1)).isWorkPackageAttributesChanged(workPackage, rmWPackage);
      verify(spy, times(1)).compareAndChangeDemand(s4WorkPackage.getWorkPackageID(),
          s4WorkPackage.getWPStartDate().toLocalDate(), s4WorkPackage.getWPEndDate().toLocalDate(),
          s4WorkPackage.getProjectID(), s4WorkPackage.getResourceDemandOrFetch(), s4Project.getProjectCategory(), true,
          s4workItems);
      verify(spy, times(1)).deleteWorkPackages();

    }

    /**
     * When new workpckage created in s4 sysytem
     */
    @Test
    void whenNewWorKpackgeCreated() throws ODataException {
      final DetermineChange spy = spy(cut);

      doReturn(null).when(mockWorkPacageMap).get(any());
      doNothing().when(spy).createWorkPackageTree(s4WorkPackage, s4Project.getProjectCategory(), true);
      doNothing().when(spy).deleteWorkPackages();
      doNothing().when(spy).compareAndChangeDemand(s4WorkPackage.getWorkPackageID(),
          s4WorkPackage.getWPStartDate().toLocalDate(), s4WorkPackage.getWPEndDate().toLocalDate(),
          s4WorkPackage.getProjectID(), s4WorkPackage.getResourceDemandOrFetch(), s4Project.getProjectCategory(), true,
          s4workItems);
      spy.compareAndChangeWorkPackage(s4WorkPackages, s4Project.getProjectCategory(), true);

      verify(spy, times(1)).createWorkPackageTree(s4WorkPackage, s4Project.getProjectCategory(), true);
      verify(spy, times(1)).deleteWorkPackages();

    }

    /**
     * When createWorkPackageTree method throws exception
     */
    @Test
    void whenCreateWorkPackageTreeThrowsException() throws ODataException {
      final DetermineChange spy = spy(cut);

      ServiceException e = new ServiceException("Error getting Demands from S/4");

      doReturn(null).when(mockWorkPacageMap).get(any());
      doThrow(e).when(spy).createWorkPackageTree(s4WorkPackage, s4Project.getProjectCategory(), true);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.compareAndChangeWorkPackage(s4WorkPackages, s4Project.getProjectCategory(), true));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for adaptDisruptiveChanges method")
  class AdaptDisruptiveChanges {

    LocalDate demandStartDate, demandEndDate;
    LocalDate resourceRequestStartDate = LocalDate.of(2019, 01, 01);
    LocalDate resourceRequestEndDate = LocalDate.of(2019, 12, 31);

    private String resourceRequestID = "resreq1";
    private String demandID = "demand1";
    private String projectId = "project1";

    private Demands rmDemand;
    private ResourceRequests resourceRequest;
    @Mock
    ResourceRequests mockResourceRequest;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);
      rmDemand = Demands.create();
      rmDemand.setId(demandID);

      resourceRequest = ResourceRequests.create();
      resourceRequest.setId(resourceRequestID);
      resourceRequest.setDemandId(demandID);
      resourceRequest.setStartDate(resourceRequestStartDate);
      resourceRequest.setEndDate(resourceRequestEndDate);
    }

    /**
     * when no resource request exists for the demand then create new resource
     * request
     */
    @Test
    void whenNoResReqExists() {

      doReturn(null).when(mockResourceRequestRepository).selectResourceRequestForDemand(anyString());
      doReturn(resourceRequest).when(mockTransformDemandToResourceRequest).transformDemandToRequest(rmDemand, projectId,
          true);

      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());

      cut.adaptDisruptiveChanges(rmDemand, projectId, true);

      verify(mockResourceRequestRepository, times(1)).upsertResourceRequest(any());
    }

    /**
     * Delete resource request that are out side of the date range
     */
    @Test
    void whenDatesOutsideRange() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2020, 01, 01);

      demandEndDate = LocalDate.of(2020, 12, 31);

      rmDemand.setStartDate(demandStartDate);
      rmDemand.setEndDate(demandEndDate);
      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);

      doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(anyString());

      doNothing().when(mockAssignmentService).deleteAssignmentsForResourceRequests(anyString());

      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);

      spy.adaptDisruptiveChanges(rmDemand, projectId, true);

      verify(mockAssignmentService, times(1)).deleteAssignmentsForResourceRequests(anyString());
      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);

    }

    /**
     * If resource request start date is before demand start date
     */
    @Test
    void whenResReqDateBeforeDemandDate() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2019, 06, 01);

      demandEndDate = LocalDate.of(2019, 12, 31);

      rmDemand.setStartDate(demandStartDate);
      rmDemand.setEndDate(demandEndDate);

      doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(anyString());

      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);

      spy.adaptDisruptiveChanges(rmDemand, projectId, true);

      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);

    }

    /**
     * If resource request end date is after demand end date
     */
    @Test
    void whenResReqDateAfterDemandDate() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2019, 01, 01);
      demandEndDate = LocalDate.of(2019, 06, 30);
      rmDemand.setStartDate(demandStartDate);
      rmDemand.setEndDate(demandEndDate);

      doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(anyString());

      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);

      spy.adaptDisruptiveChanges(rmDemand, projectId, true);

      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);
    }

    /**
     * If resource request start date before demand start date and end date is after
     * demand end date
     */
    @Test
    void whenDemandDatesInsideResReqDate() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2019, 02, 01);
      demandEndDate = LocalDate.of(2019, 06, 30);
      rmDemand.setStartDate(demandStartDate);
      rmDemand.setEndDate(demandEndDate);

      doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(anyString());

      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);
      spy.adaptDisruptiveChanges(rmDemand, projectId, true);

      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);
    }

  }

  /*
   * Adjust resource request dates method junit
   */
  @Nested
  @DisplayName("Unit Test for adjust resource request dates method")
  class AdjustResourceRequestDates {

    LocalDate demandStartDate, demandEndDate;
    LocalDate resourceRequestStartDate = LocalDate.of(2019, 01, 01);
    LocalDate resourceRequestEndDate = LocalDate.of(2019, 12, 31);

    private String resourceRequestID = "resreq1";
    private String demandID = "demand1";

    private ResourceRequests resourceRequest;
    @Mock
    ResourceRequests mockResourceRequest;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);

      resourceRequest = ResourceRequests.create();
      resourceRequest.setId(resourceRequestID);
      resourceRequest.setDemandId(demandID);
      resourceRequest.setStartDate(resourceRequestStartDate);
      resourceRequest.setEndDate(resourceRequestEndDate);
    }

    /**
     * when no resource request exists for the demand then create new resource
     * request
     */

    @Test
    void whenDatesOutsideRange() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2020, 01, 01);

      demandEndDate = LocalDate.of(2020, 12, 31);

      resourceRequest.setEffortDistributionTypeCode(Constants.TOTAL_HOURS);

      doNothing().when(mockAssignmentService).deleteAssignmentsForResourceRequests(anyString());

      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);

      spy.adjustResourceRequestDates(resourceRequest, demandStartDate, demandEndDate);

      verify(mockAssignmentService, times(1)).deleteAssignmentsForResourceRequests(anyString());
      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);

    }

    /**
     * If resource request start date is before demand start date
     */
    @Test
    void whenResReqDateBeforeDemandDate() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2019, 06, 01);

      demandEndDate = LocalDate.of(2019, 12, 31);

      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);

      spy.adjustResourceRequestDates(resourceRequest, demandStartDate, demandEndDate);

      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);

    }

    /**
     * If resource request end date is after demand end date
     */
    @Test
    void whenResReqDateAfterDemandDate() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2019, 01, 01);
      demandEndDate = LocalDate.of(2019, 06, 30);
      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);

      spy.adjustResourceRequestDates(resourceRequest, demandStartDate, demandEndDate);

      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);
    }

    /**
     * If resource request start date before demand start date and end date is after
     * demand end date
     */
    @Test
    void whenDemandDatesInsideResReqDate() {
      final DetermineChange spy = spy(cut);

      demandStartDate = LocalDate.of(2019, 02, 01);
      demandEndDate = LocalDate.of(2019, 06, 30);
      doNothing().when(spy).changeResourceRequestDates(demandStartDate, demandEndDate);

      spy.adjustResourceRequestDates(resourceRequest, demandStartDate, demandEndDate);

      verify(spy, times(1)).changeResourceRequestDates(demandStartDate, demandEndDate);
    }

  }

  @Nested
  @DisplayName("Unit Test for changeResourceRequestDates method")
  class ChangeResourceRequestDates {
    LocalDate demandStartDate, demandEndDate;
    Instant newStartTime, newEndTime;

    @Mock
    ResourceRequests mockResourceRequest;

    @Mock
    List<CapacityRequirements> mockCapacityRequirements;

    @Mock
    CapacityRequirements mockCapacityRequirement;

    @BeforeEach
    public void setUp() {

      MockitoAnnotations.initMocks(this);

    }

    /**
     * If start date is changed and effortDistributionTypeCode() == Total_Hrs
     */
    @Test
    void whenDemandStartDateChangedAndTypeIsTotalHrs() {
      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(mockResourceRequest);

      demandStartDate = LocalDate.of(2020, 06, 01);
      demandEndDate = LocalDate.of(2020, 12, 31);
      newStartTime = demandStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doReturn(mockCapacityRequirements).when(mockResourceRequest).getCapacityRequirements();
      doNothing().when(mockResourceRequest).setStartDate(demandStartDate);
      doNothing().when(mockResourceRequest).setStartTime(newStartTime);
      doReturn(mockCapacityRequirement).when(mockCapacityRequirements).get(0);
      doNothing().when(mockCapacityRequirement).setStartDate(demandStartDate);
      doNothing().when(mockCapacityRequirement).setStartTime(newStartTime);

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);
      verify(mockResourceRequest, times(1)).setStartDate(demandStartDate);
      verify(mockResourceRequest, times(1)).setStartTime(newStartTime);
      verify(mockCapacityRequirement, times(1)).setStartDate(demandStartDate);
      verify(mockCapacityRequirement, times(1)).setStartTime(newStartTime);

    }

    /**
     * If end date is changed and effortDistributionTypeCode() == Total_Hrs
     */
    @Test
    void whenDemandEndDateChangedAndTypeIsTotalHrs() {

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(mockResourceRequest);
      demandStartDate = LocalDate.of(2020, 01, 01);
      demandEndDate = LocalDate.of(2020, 06, 30);
      newEndTime = demandEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doReturn(mockCapacityRequirements).when(mockResourceRequest).getCapacityRequirements();
      doNothing().when(mockResourceRequest).setEndDate(demandEndDate);
      doNothing().when(mockResourceRequest).setEndTime(newEndTime);
      doReturn(mockCapacityRequirement).when(mockCapacityRequirements).get(0);
      doNothing().when(mockCapacityRequirement).setEndDate(demandEndDate);
      doNothing().when(mockCapacityRequirement).setEndTime(newEndTime);

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);
      verify(mockResourceRequest, times(1)).setEndDate(demandEndDate);
      verify(mockResourceRequest, times(1)).setEndTime(newEndTime);
      verify(mockCapacityRequirement, times(1)).setEndDate(demandEndDate);
      verify(mockCapacityRequirement, times(1)).setEndTime(newEndTime);

    }

    /**
     * If start date and end date are changed and effortDistributionTypeCode() ==
     * Total_Hrs
     */
    @Test
    void whenDemandDatesChangedAndTypeIsTotalHrs() {

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(mockResourceRequest);

      demandStartDate = LocalDate.of(2020, 02, 01);
      demandEndDate = LocalDate.of(2020, 05, 31);
      newStartTime = demandStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      newEndTime = demandEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doReturn(mockCapacityRequirements).when(mockResourceRequest).getCapacityRequirements();
      doNothing().when(mockResourceRequest).setStartDate(demandStartDate);
      doNothing().when(mockResourceRequest).setStartTime(newStartTime);
      doReturn(mockCapacityRequirement).when(mockCapacityRequirements).get(0);
      doNothing().when(mockCapacityRequirement).setStartDate(demandStartDate);
      doNothing().when(mockCapacityRequirement).setStartTime(newStartTime);
      doNothing().when(mockResourceRequest).setEndDate(demandEndDate);
      doNothing().when(mockResourceRequest).setEndTime(newEndTime);
      doNothing().when(mockCapacityRequirement).setEndDate(demandEndDate);
      doNothing().when(mockCapacityRequirement).setEndTime(newEndTime);

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);
      verify(mockResourceRequest, times(1)).setStartDate(demandStartDate);
      verify(mockResourceRequest, times(1)).setStartTime(newStartTime);
      verify(mockCapacityRequirement, times(1)).setStartDate(demandStartDate);
      verify(mockCapacityRequirement, times(1)).setStartTime(newStartTime);
      verify(mockResourceRequest, times(1)).setEndDate(demandEndDate);
      verify(mockResourceRequest, times(1)).setEndTime(newEndTime);
      verify(mockCapacityRequirement, times(1)).setEndDate(demandEndDate);
      verify(mockCapacityRequirement, times(1)).setEndTime(newEndTime);

    }

    /**
     * If start date and end date are out of range and effortDistributionTypeCode()
     * == Total_Hrs
     */
    @Test
    void whenDemandDatesAreOutOfRangeAndTypeIsTotalHrs() {

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(mockResourceRequest);

      List<CapacityRequirements> mockCapacityRequirementsList = new ArrayList<>();
      List<CapacityRequirements> mockCapacityRequirementsList1 = new ArrayList<>();
      CapacityRequirements capacityRequirement1 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement2 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement3 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement4 = CapacityRequirements.create();

      capacityRequirement1.setStartDate(LocalDate.of(2020, 05, 31));
      capacityRequirement2.setStartDate(LocalDate.of(2020, 06, 03));
      capacityRequirement3.setStartDate(LocalDate.of(2020, 04, 04));
      capacityRequirement1.setEndDate(LocalDate.of(2020, 05, 31));
      capacityRequirement2.setEndDate(LocalDate.of(2020, 06, 03));
      capacityRequirement3.setEndDate(LocalDate.of(2020, 04, 04));

      capacityRequirement4.setStartDate(LocalDate.of(2021, 02, 01));
      capacityRequirement4.setEndDate(LocalDate.of(2021, 05, 31));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      mockCapacityRequirementsList1.add(capacityRequirement4);
      mockResourceRequest.setCapacityRequirements(mockCapacityRequirementsList);

      demandStartDate = LocalDate.of(2021, 02, 01);
      demandEndDate = LocalDate.of(2021, 05, 31);
      newStartTime = demandStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      newEndTime = demandEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doReturn(mockCapacityRequirementsList).when(mockResourceRequest).getCapacityRequirements();
      doNothing().when(mockResourceRequest).setStartDate(demandStartDate);
      doNothing().when(mockResourceRequest).setStartTime(newStartTime);
      doReturn(mockCapacityRequirement).when(mockCapacityRequirements).get(0);
      doNothing().when(mockCapacityRequirement).setStartDate(demandStartDate);
      doNothing().when(mockCapacityRequirement).setStartTime(newStartTime);
      doNothing().when(mockResourceRequest).setEndDate(demandEndDate);
      doNothing().when(mockResourceRequest).setEndTime(newEndTime);
      doNothing().when(mockCapacityRequirement).setEndDate(demandEndDate);
      doNothing().when(mockCapacityRequirement).setEndTime(newEndTime);
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());
      doNothing().when(mockResourceRequestRepository).deleteCapacityRequirements(any(), any(), any());
      doReturn(mockCapacityRequirementsList1).when(mockResourceRequestRepository).selectCapacityRequirements(any());

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);
      verify(mockResourceRequest, times(1)).setStartDate(demandStartDate);
      verify(mockResourceRequest, times(1)).setStartTime(newStartTime);
      verify(mockResourceRequest, times(1)).setEndDate(demandEndDate);
      verify(mockResourceRequest, times(1)).setEndTime(newEndTime);
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequest(any());
      verify(mockResourceRequestRepository, times(1)).deleteCapacityRequirements(any(), any(), any());
      verify(mockResourceRequestRepository, times(1)).selectCapacityRequirements(any());

    }

    /**
     * If start date is changed and effortDistributionTypeCode() == Daily_Hrs
     */
    @Test
    void whenDemandStartDateChangedAndTypeIsDailyHrs() {

      List<CapacityRequirements> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      CapacityRequirements capacityRequirement1 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement2 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement3 = CapacityRequirements.create();

      capacityRequirement1.setStartDate(LocalDate.of(2020, 05, 31));
      capacityRequirement2.setStartDate(LocalDate.of(2020, 06, 03));
      capacityRequirement3.setStartDate(LocalDate.of(2020, 06, 04));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);
      resourceRequest.setEffortDistributionTypeCode(1);

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(resourceRequest);

      demandStartDate = LocalDate.of(2020, 06, 01);
      demandEndDate = LocalDate.of(2020, 12, 31);
      newStartTime = demandStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doNothing().when(mockResourceRequestRepository).deleteCapacityRequirements(any(), any(), any());
      doReturn(mockCapacityRequirementsList).when(mockResourceRequestRepository).selectCapacityRequirements(any());
      doNothing().when(spy).setRequestedCapacityInResourceRequest(any());
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);

      verify(mockResourceRequestRepository, times(1)).deleteCapacityRequirements(any(), any(), any());
      verify(mockResourceRequestRepository, times(1)).selectCapacityRequirements(any());
      verify(spy, times(1)).setRequestedCapacityInResourceRequest(any());
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequest(any());

    }

    /**
     * If end date is changed and effortDistributionTypeCode() == Daily_Hrs
     */
    @Test
    void whenDemandEndDateChangedAndTypeIsDailyHrs() {

      List<CapacityRequirements> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      CapacityRequirements capacityRequirement1 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement2 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement3 = CapacityRequirements.create();

      capacityRequirement1.setEndDate(LocalDate.of(2020, 05, 31));
      capacityRequirement2.setEndDate(LocalDate.of(2020, 04, 03));
      capacityRequirement3.setEndDate(LocalDate.of(2020, 07, 04));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);
      resourceRequest.setEffortDistributionTypeCode(1);

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(resourceRequest);

      demandStartDate = LocalDate.of(2020, 01, 01);
      demandEndDate = LocalDate.of(2020, 06, 30);
      newEndTime = demandEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doNothing().when(mockResourceRequestRepository).deleteCapacityRequirements(any(), any(), any());
      doReturn(mockCapacityRequirementsList).when(mockResourceRequestRepository).selectCapacityRequirements(any());
      doNothing().when(spy).setRequestedCapacityInResourceRequest(any());
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);

      verify(mockResourceRequestRepository, times(1)).deleteCapacityRequirements(any(), any(), any());
      verify(mockResourceRequestRepository, times(1)).selectCapacityRequirements(any());
      verify(spy, times(1)).setRequestedCapacityInResourceRequest(any());
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequest(any());

    }

    /**
     * If start date and end date are changed and effortDistributionTypeCode() ==
     * Daily_Hrs
     */
    @Test
    void whenDemandStartAndEndDateChangedAndTypeIsDailyHrs() {

      List<CapacityRequirements> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      CapacityRequirements capacityRequirement1 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement2 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement3 = CapacityRequirements.create();

      capacityRequirement1.setStartDate(LocalDate.of(2020, 05, 31));
      capacityRequirement2.setStartDate(LocalDate.of(2020, 06, 03));
      capacityRequirement3.setStartDate(LocalDate.of(2020, 04, 04));

      capacityRequirement1.setEndDate(LocalDate.of(2020, 05, 31));
      capacityRequirement2.setEndDate(LocalDate.of(2020, 06, 03));
      capacityRequirement3.setEndDate(LocalDate.of(2020, 04, 04));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);
      resourceRequest.setEffortDistributionTypeCode(1);

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(resourceRequest);

      demandStartDate = LocalDate.of(2020, 03, 01);
      demandEndDate = LocalDate.of(2020, 07, 31);
      newStartTime = demandStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      newEndTime = demandEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doNothing().when(mockResourceRequestRepository).deleteCapacityRequirements(any(), any(), any());
      doReturn(mockCapacityRequirementsList).when(mockResourceRequestRepository).selectCapacityRequirements(any());
      doNothing().when(spy).setRequestedCapacityInResourceRequest(any());
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);

      verify(mockResourceRequestRepository, times(1)).deleteCapacityRequirements(any(), any(), any());
      verify(mockResourceRequestRepository, times(1)).selectCapacityRequirements(any());
      verify(spy, times(1)).setRequestedCapacityInResourceRequest(any());
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequest(any());

    }

    /*
     * Date change for dist type daily/weekly and no capacities after updation
     */

    @DisplayName("When there is no capacity after date change - Dist type changed to total and default capacity created")
    @Test
    public void inconsistentDateChange() {

      ResourceRequests resourceRequest = ResourceRequests.create();
      resourceRequest.setEffortDistributionTypeCode(1);

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(resourceRequest);

      demandStartDate = LocalDate.of(2020, 06, 01);
      demandEndDate = LocalDate.of(2020, 12, 31);
      newStartTime = demandStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doNothing().when(mockResourceRequestRepository).deleteCapacityRequirements(any(), any(), any());
      doReturn(new ArrayList<CapacityRequirements>()).when(mockResourceRequestRepository)
          .selectCapacityRequirements(any());
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());
      doNothing().when(spy).setCapacityRequirementsForTotalEffort(any(), any(), any(), any());

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);

      verify(mockResourceRequestRepository, times(1)).deleteCapacityRequirements(any(), any(), any());
      verify(mockResourceRequestRepository, times(1)).selectCapacityRequirements(any());
      verify(spy, times(0)).setRequestedCapacityInResourceRequest(any());
      verify(mockResourceRequestRepository, times(0)).upsertResourceRequest(any());
      verify(spy, times(1)).setCapacityRequirementsForTotalEffort(any(), any(), any(), any());

    }

    /*
     * when date change exists and distribution type is weekly
     */
    @DisplayName("When distribution type is weekly for the date change scenario")
    @Test
    public void onWeeklyDistributionDateChange() {

      List<CapacityRequirements> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      CapacityRequirements capacityRequirement1 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement2 = CapacityRequirements.create();
      CapacityRequirements capacityRequirement3 = CapacityRequirements.create();

      capacityRequirement1.setStartDate(LocalDate.of(2020, 05, 01));
      capacityRequirement2.setStartDate(LocalDate.of(2020, 05, 07));
      capacityRequirement3.setStartDate(LocalDate.of(2020, 05, 14));

      capacityRequirement1.setEndDate(LocalDate.of(2020, 05, 06));
      capacityRequirement2.setEndDate(LocalDate.of(2020, 06, 13));
      capacityRequirement3.setEndDate(LocalDate.of(2020, 04, 20));

      mockCapacityRequirementsList.add(capacityRequirement1);
      mockCapacityRequirementsList.add(capacityRequirement2);
      mockCapacityRequirementsList.add(capacityRequirement3);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);
      resourceRequest.setEffortDistributionTypeCode(Constants.WEEKLY_HOURS);

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(resourceRequest);

      demandStartDate = LocalDate.of(2020, 05, 01);
      demandEndDate = LocalDate.of(2020, 05, 20);
      newStartTime = demandStartDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      newEndTime = demandEndDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();

      doReturn(mockCapacityRequirementsList).when(mockResourceRequestRepository)
          .getUpdatedCapacityForWeeklyDistribution(any(), any(), any());
      doNothing().when(spy).setRequestedCapacityInResourceRequest(any());
      doNothing().when(mockResourceRequestRepository).upsertResourceRequest(any());

      spy.changeResourceRequestDates(demandStartDate, demandEndDate);

      verify(mockResourceRequestRepository, times(1)).getUpdatedCapacityForWeeklyDistribution(any(), any(), any());
      verify(spy, times(1)).setRequestedCapacityInResourceRequest(any());
      verify(mockResourceRequestRepository, times(1)).upsertResourceRequest(any());

    }

    /*
     * When invalid distribution type is passed
     */
    @DisplayName("When invalid distribution type of resource request")
    @Test
    public void onInvalidDistributionType() {

      List<CapacityRequirements> mockCapacityRequirementsList = new ArrayList<>();

      ResourceRequests resourceRequest = ResourceRequests.create();
      CapacityRequirements capacityRequirement1 = CapacityRequirements.create();

      capacityRequirement1.setStartDate(LocalDate.of(2020, 05, 01));

      capacityRequirement1.setEndDate(LocalDate.of(2020, 05, 06));

      mockCapacityRequirementsList.add(capacityRequirement1);
      resourceRequest.setCapacityRequirements(mockCapacityRequirementsList);
      resourceRequest.setEffortDistributionTypeCode(5);

      final DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(resourceRequest);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.changeResourceRequestDates(demandStartDate, demandEndDate));

      assertEquals("Error occured while changing resource request dates", exception.getMessage());

    }
  }

  @Nested
  @DisplayName("Unit Test for setRequestedCapacityInResourceRequest method")
  class SetRequestedCapacityInResourceRequest {

    public ResourceRequests resourceRequest;
    public CapacityRequirements capacityRequirement1;
    public CapacityRequirements capacityRequirement2;
    public CapacityRequirements capacityRequirement3;
    public String resourceRequestId;

    @Test
    void setRequestedCapacityInResourceRequestSuccessfulScenario() {

      resourceRequest = ResourceRequests.create();
      List<CapacityRequirements> updatedCapacityRequirements = new ArrayList<>();
      resourceRequestId = "r1";
      resourceRequest.setId(resourceRequestId);

      capacityRequirement1 = CapacityRequirements.create();
      BigDecimal requestedCapacity1 = new BigDecimal(10);
      capacityRequirement1.setRequestedCapacity(requestedCapacity1);

      capacityRequirement2 = CapacityRequirements.create();
      BigDecimal requestedCapacity2 = new BigDecimal(20);
      capacityRequirement2.setRequestedCapacity(requestedCapacity2);

      capacityRequirement3 = CapacityRequirements.create();
      BigDecimal requestedCapacity3 = new BigDecimal(25);
      capacityRequirement3.setRequestedCapacity(requestedCapacity3);

      updatedCapacityRequirements.add(capacityRequirement1);
      updatedCapacityRequirements.add(capacityRequirement2);
      updatedCapacityRequirements.add(capacityRequirement3);
      resourceRequest.setCapacityRequirements(updatedCapacityRequirements);

      DetermineChange spy = spy(cut);
      spy.setAdaptResourceRequest(resourceRequest);
      spy.setRequestedCapacityInResourceRequest(updatedCapacityRequirements);

      BigDecimal actualRequestedCapacity = resourceRequest.getRequestedCapacity();
      BigDecimal expectedRequestedCapacity = new BigDecimal(55);

      int actualRequestedCapacityInMinutes = resourceRequest.getRequestedCapacityInMinutes();
      int expectedRequestedCapacityInMinutes = expectedRequestedCapacity.multiply(BigDecimal.valueOf(60)).intValue();

      assertEquals(expectedRequestedCapacity, actualRequestedCapacity);
      assertEquals(expectedRequestedCapacityInMinutes, actualRequestedCapacityInMinutes);

    }

    @Test
    void setRequestedCapacityInResourceRequestExceptionScenario() {

      ServiceException e = new ServiceException("Error occured while changing the end date when size<2");

      DetermineChange spy = spy(cut);
      doThrow(e).when(spy).setRequestedCapacityInResourceRequest(any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spy.setRequestedCapacityInResourceRequest(any()));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }
  }

}
