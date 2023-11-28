package com.sap.c4p.rm.projectintegrationadapter.integration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.s4hana.connectivity.ErpHttpDestination;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.businesspartner.Customer;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmndDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkItem;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.service.JobSchedulerServiceInterface;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.util.JobSchedulerToken;
import com.sap.c4p.rm.projectintegrationadapter.config.JobSchedulerWebClientConfiguration;
import com.sap.c4p.rm.projectintegrationadapter.config.SecurityConfiguration;
import com.sap.c4p.rm.projectintegrationadapter.controller.ProjectReplicationController;
import com.sap.c4p.rm.projectintegrationadapter.model.ProjectReplicationTask;
import com.sap.c4p.rm.projectintegrationadapter.repository.AssignmentRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.DeliveryOrganizationRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.DemandRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.IntegrationStatusRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectReplicationTasksRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ResourceRequestRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.WorkPackageRepository;
import com.sap.c4p.rm.projectintegrationadapter.service.AssignmentService;
import com.sap.c4p.rm.projectintegrationadapter.service.ReplicationService;
import com.sap.c4p.rm.projectintegrationadapter.util.CfUtils;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;
import com.sap.c4p.rm.projectintegrationadapter.util.DisplayIDGenerator;
import com.sap.c4p.rm.projectintegrationadapter.util.ProjectManagementS4Client;
import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessages;

import com.sap.resourcemanagement.config.ProjectReplicationTasks;
import com.sap.resourcemanagement.integration.ProjectReplicationStatus;
import com.sap.resourcemanagement.integration.ProjectSync;
import com.sap.resourcemanagement.project.BillingRoles;
import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.project.Projects;
import com.sap.resourcemanagement.project.WorkPackages;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class IntegrationTest {

  public ProjectReplicationController cut;

  @MockBean
  SecurityConfiguration mockSecurityConfiguration;

  @MockBean
  public ProjectManagementS4Client mockS4Client;

  @MockBean
  public IntegrationStatusRepository mockIntegrationStatusRepository;

  @MockBean
  ProjectRepository mockProjectRepository;

  @MockBean
  AssignmentRepository mockAssignmentRepository;

  @MockBean
  ResourceRequestRepository mockResourceRequestRepository;

  @MockBean
  DemandRepository mockDemandRepository;

  @MockBean
  WorkPackageRepository mockWorkPackageRepository;

  @MockBean
  public AssignmentService mockAssignmentService;

  @Autowired
  public ReplicationMessages mockMessages;

  @MockBean
  public ProjectReplicationStatus mockProjectReplicationInitial;

  @MockBean
  ProjectReplicationTasksRepository mockProjectReplicationTasksRepository;

  @MockBean
  CfUtils mockCfUtils;

  @MockBean
  JobSchedulerWebClientConfiguration mockJobSchedulerWebClientConfiguration;

  @MockBean
  JobSchedulerToken mockJobSchedulerToken;

  @MockBean
  JobSchedulerServiceInterface mockJobSchedulerService;

  @MockBean
  DisplayIDGenerator mockDisplayIdGenerator;

  @MockBean
  DeliveryOrganizationRepository mockDeliveryOrganizationRepository;

  MockMvc mockMvc;

  @Autowired
  public ReplicationService replicationService;

  @Autowired
  ObjectMapper objectMapper;

  @BeforeEach
  public void setUp() {

    cut = new ProjectReplicationController(replicationService, mockIntegrationStatusRepository, mockAssignmentService,
        mockMessages);

    mockMvc = standaloneSetup(cut).build();

  }

  /**
   * The test executes initial load scenario where 1. Source system is having
   * three projects [PRJ-001,PRJ-INT] of service org IN01 and [PRJ-002] of service
   * org DE01. 2. Each project is having with workpackage demands in it 3. Initial
   * load is performed for service organizaion IN01
   *
   * @throws Exception
   */
  @DisplayName("Initial Load Integration test")
  @Test
  @Order(1)
  public void initialLoadScenario() throws Exception {

    Project s4Project = new Project();
    WorkPackage s4WorkPackage;
    WorkItem s4WorkItem;
    EngmntProjRsceDmnd s4Demand;
    EngmntProjRsceDmndDistr s4DemandDistribution;

    ErpHttpDestination mockErpHttpDestination = mock(ErpHttpDestination.class);
    List<ProjectSync> projectSyncs = new ArrayList<>();
    ProjectSync projectSync = ProjectSync.create();
    projectSync.setProject("PRJ-001");
    projectSyncs.add(projectSync);
    projectSync = ProjectSync.create();
    projectSync.setProject("PRJ-INT");
    projectSyncs.add(projectSync);

    ProjectReplicationTask projectReplicationTask = new ProjectReplicationTask();
    projectReplicationTask.setServiceOrganizationCode("IN01");
    projectReplicationTask.setTaskStatusCode(2);
    projectReplicationTask.setReferenceDate("2020-12-01");

    List<String> serviceOrganizations = new ArrayList<>();
    serviceOrganizations.add("IN01");

    ProjectReplicationStatus initialProjectReplicationStatus = ProjectReplicationStatus.create();
    initialProjectReplicationStatus.setStartTime(Instant.now());
    initialProjectReplicationStatus.setStatusCode(2);
    initialProjectReplicationStatus.setTypeCode(1);

    List<Project> projects = new ArrayList<>();

    // Project : PRJ-001
    s4Project = new Project();
    s4Project.setProjectID("PRJ-001");
    s4Project.setOrgID("IN01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setProjectCategory(Constants.S4Constants.CUSTOMER_PROJECT_TYPE);
    s4Project.setCustomer("1780005001");
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-001.1.1");
    s4WorkPackage.setProjectID("PRJ-001");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("IN01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-001.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    // Project : PRJ-INT
    s4Project = new Project();
    s4Project.setProjectID("PRJ-INT");
    s4Project.setOrgID("IN01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-INT.1.1");
    s4WorkPackage.setProjectID("PRJ-INT");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("IN01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-INT.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    // Project : PRJ-002
    s4Project = new Project();
    s4Project.setProjectID("PRJ-002");
    s4Project.setOrgID("DE01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setProjectCategory(Constants.S4Constants.CUSTOMER_PROJECT_TYPE);
    s4Project.setCustomer("1780005002");
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-002.1.1");
    s4WorkPackage.setProjectID("PRJ-002");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("DE01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-002.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    Customer customer = new Customer();
    customer.setCustomer("1780005001");
    customer.setCustomerName("TCS");
    customer.setCustomerFullName("Tata Consulting Service");

    BillingRoles billingRole = BillingRoles.create();
    billingRole.setId("T001");
    billingRole.setName("Senior Consultant");

    Mockito
        .when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING,
            Constants.ReplicationType.INITIAL, serviceOrganizations))
        .thenReturn(projectSyncs.get(0)).thenReturn(projectSyncs.get(1)).thenReturn(null);

    doReturn(mockErpHttpDestination).when(mockS4Client).getDestination();
    doReturn(projects.get(0)).when(mockS4Client).getProjectTree("PRJ-001");
    doReturn(projects.get(1)).when(mockS4Client).getProjectTree("PRJ-INT");
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();
    doReturn(null).when(mockCfUtils).getZoneId();
    doNothing().when(mockJobSchedulerService).createDeltaAndDeleteJob(anyString(), anyString());
    doReturn(customer).when(mockS4Client).getCustomerDetails("1780005001");
    doReturn(initialProjectReplicationStatus).when(mockIntegrationStatusRepository)
        .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    doReturn(null).when(mockIntegrationStatusRepository).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
    doReturn(projects).when(mockS4Client).getProjectIdsForReplicationTask(Constants.PAGE_SIZE, projectReplicationTask);
    doReturn(null).when(mockProjectRepository).getCustomerById(s4Project.getCustomer());
    doReturn(billingRole).when(mockDemandRepository).getBillingRoleById(s4Demand.getEngagementProjectResource());
    doReturn(1L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("IN01");
    doReturn(customer).when(mockS4Client).getCustomerDetails(s4Project.getCustomer());
    doReturn("0000000001").when(mockDisplayIdGenerator).getDisplayId();

    final ObjectMapper mapper = new ObjectMapper();

    mockMvc
        .perform(MockMvcRequestBuilders.post("/replicateS4ProjectsInitial")
            .content(mapper.writeValueAsString(projectReplicationTask))
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .accept(org.springframework.http.MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("Initial Load Replication is completed"));

    verify(mockIntegrationStatusRepository, times(3)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    verify(mockIntegrationStatusRepository, times(1)).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
    verify(mockProjectRepository, times(1)).getCustomerById(("1780005001"));
    verify(mockDemandRepository, times(2)).getBillingRoleById(s4Demand.getEngagementProjectResource());
    verify(mockIntegrationStatusRepository, times(1)).updateProjectReplicationStatus(any());
    verify(mockIntegrationStatusRepository, times(4)).getSingleProjectSync(Constants.RunStatus.PROCESSING,
        Constants.ReplicationType.INITIAL, serviceOrganizations);

  }

  /**
   * The test executes delta load scenario where 1. Source system is having three
   * projects [PRJ-001,PRJ-INT] of service org IN01 and [PRJ-002] of service org
   * DE01 has been modified 2. PRJ-001 --> work package dates are shifted from
   * [01/01/2020<---->30/12/2020] to [01/01/2019<---->30/12/2019] 3. PRJ-INT is
   * newly creates, it is a internal project 4. PRJ-002 newly created but it is
   * part of DE01 service organization
   *
   * @throws Exception
   */
  @DisplayName("Delta Load Integration test")
  @Test
  @Order(2)
  public void deltaLoadScenario() throws Exception {

    Project s4Project = new Project();
    WorkPackage s4WorkPackage;
    WorkItem s4WorkItem;
    EngmntProjRsceDmnd s4Demand;
    EngmntProjRsceDmndDistr s4DemandDistribution;
    List<Project> projects = new ArrayList<>();
    EngmntProjRsceSup supply;
    List<EngmntProjRsceSup> supplys = new ArrayList<>();

    List<Projects> projectsFromRM = new ArrayList<>();
    List<WorkPackages> workPackagesFromRM = new ArrayList<>();
    List<Demands> demandsFromRM = new ArrayList<>();

    List<ProjectSync> projectSyncs = new ArrayList<>();

    ErpHttpDestination mockErpHttpDestination = mock(ErpHttpDestination.class);
    ProjectSync projectSync = ProjectSync.create();
    projectSync.setProject("PRJ-001");
    projectSync.setStatusCode(2);
    projectSync.setTypeTypeCode(1);

    projectSyncs.add(projectSync);

    ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
    projectReplicationStatus.setStartTime(Instant.now());
    projectReplicationStatus.setStatusCode(3);
    projectReplicationStatus.setTypeCode(1);
    projectReplicationStatus.setProjectSync(projectSyncs);

    List<ProjectReplicationTasks> projectReplicationTasks = new ArrayList<>();
    ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
    item1.setServiceOrganizationCode("IN01");
    item1.setTaskStatusCode(3);
    item1.setReferenceDate(LocalDate.of(2020, 12, 30));
    projectReplicationTasks.add(item1);

    List<String> serviceOrganizations = new ArrayList<>();
    serviceOrganizations.add("IN01");
    ZonedDateTime lastReplicationRunTime = projectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

    // Project : PRJ-001
    s4Project = new Project();
    s4Project.setProjectID("PRJ-001");
    s4Project.setOrgID("IN01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setProjectCategory(Constants.S4Constants.CUSTOMER_PROJECT_TYPE);
    s4Project.setCustomer("1780005001");
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4Project.setProjectName("NGDMS");

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-001.1.1");
    s4WorkPackage.setProjectID("PRJ-001");
    s4WorkPackage.setWorkPackageName("Implementation");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("IN01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-001.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    supply = new EngmntProjRsceSup();
    supplys.add(supply);
    s4Demand.setResourceSupply(supplys);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    // Project : PRJ-INT
    s4Project = new Project();
    s4Project.setProjectID("PRJ-INT");
    s4Project.setOrgID("IN01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-INT.1.1");
    s4WorkPackage.setProjectID("PRJ-INT");
    s4WorkPackage.setWorkPackageName("Implementation");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("IN01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-INT.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    // Project : PRJ-002
    s4Project = new Project();
    s4Project.setProjectID("PRJ-002");
    s4Project.setOrgID("DE01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setProjectCategory(Constants.S4Constants.CUSTOMER_PROJECT_TYPE);
    s4Project.setCustomer("1780005002");
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-002.1.1");
    s4WorkPackage.setProjectID("PRJ-002");
    s4WorkPackage.setWorkPackageName("Implementation");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("DE01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-002.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    Customer customer = new Customer();
    customer.setCustomer("1780005001");
    customer.setCustomerName("TCS");
    customer.setCustomerFullName("Tata Consulting Service");

    BillingRoles billingRole = BillingRoles.create();
    billingRole.setId("T001");
    billingRole.setName("Senior Consultant");

    List<CapacityRequirements> capacityRequirements = new ArrayList();
    CapacityRequirements capacityRequirement = CapacityRequirements.create();
    capacityRequirement.setId("cap01");
    capacityRequirement.setResourceRequestId("rr02");
    capacityRequirement.setStartDate(LocalDate.of(2019, 1, 1));
    capacityRequirement.setEndDate(LocalDate.of(2019, 12, 30));
    capacityRequirements.add(capacityRequirement);

    ResourceRequests resourceRequest = ResourceRequests.create();
    resourceRequest.setId("rr02");
    resourceRequest.setDemandId("demand02");
    resourceRequest.setStartDate(LocalDate.of(2019, 1, 1));
    resourceRequest.setEndDate(LocalDate.of(2019, 12, 30));
    resourceRequest.setEffortDistributionTypeCode(0);
    resourceRequest.setCapacityRequirements(capacityRequirements);

    Demands demand = Demands.create();
    demand.setId("demand02");
    demand.setExternalID("1001");
    demand.setBillingCategoryId("NBL");
    demand.setStartDate(LocalDate.of(2019, 1, 1));
    demand.setEndDate(LocalDate.of(2019, 12, 30));
    demand.setWorkPackageId("PRJ-001.1.1");
    demand.setBillingRoleId("T001");
    demand.setDeliveryOrganizationCode("IN01");
    demandsFromRM.add(demand);

    WorkPackages workPackage = WorkPackages.create();
    workPackage.setId("PRJ-001.1.1");
    workPackage.setName("Blue Print design:PRJ-002");
    workPackage.setProjectId("PRJ-001");
    workPackage.setStartDate(LocalDate.of(2019, 1, 1));
    workPackage.setEndDate(LocalDate.of(2019, 12, 30));
    workPackage.setName("Implementation");
    workPackagesFromRM.add(workPackage);

    Projects rmProject = Projects.create();
    rmProject.setId("PRJ-001");
    rmProject.setName("NGDMS");
    rmProject.setCustomerId("1780005001");
    rmProject.setStartDate(LocalDate.of(2019, 1, 1));
    rmProject.setEndDate(LocalDate.of(2019, 12, 30));

    rmProject.setWorkPackages(workPackagesFromRM);

    Mockito.when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING,
        Constants.ReplicationType.DELTA, serviceOrganizations)).thenReturn(projectSyncs.get(0)).thenReturn(null);

    doReturn(mockErpHttpDestination).when(mockS4Client).getDestination();
    doReturn(projects.get(0)).when(mockS4Client).getProjectTree("PRJ-001");
    doReturn(projects.get(1)).when(mockS4Client).getProjectTree("PRJ-INT");
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();
    doReturn(customer).when(mockS4Client).getCustomerDetails("1780005001");

    doReturn(projectReplicationStatus).when(mockIntegrationStatusRepository)
        .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    doReturn(null).when(mockIntegrationStatusRepository).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
    doReturn(projectReplicationTasks).when(mockProjectReplicationTasksRepository)
        .getProjectReplicationTaskBasedonTaskStatusCode(3);
    doReturn(projectSyncs.get(0)).when(mockIntegrationStatusRepository).getProjectSyncByProject("PRJ-001",
        Constants.ReplicationType.DELTA);
    doReturn(projects).when(mockS4Client).getProjectIds(Constants.PAGE_SIZE, lastReplicationRunTime);
    doReturn(null).when(mockProjectRepository).getCustomerById(s4Project.getCustomer());
    doReturn(rmProject).when(mockProjectRepository).selectProjectTree("PRJ-001");
    doReturn(null).when(mockProjectRepository).selectProjectTree("PRJ-INT");
    doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(any());
    doNothing().when(mockAssignmentRepository).deleteAssignmentsForResourceRequests(resourceRequest.getId());
    doReturn(demandsFromRM).when(mockDemandRepository).selectDemandForWorkPackage("PRJ-001.1.1");
    doReturn(billingRole).when(mockDemandRepository).getBillingRoleById(s4Demand.getEngagementProjectResource());
    doReturn(1L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("IN01");
    doReturn(customer).when(mockS4Client).getCustomerDetails(s4Project.getCustomer());

    mockMvc
        .perform(MockMvcRequestBuilders.post("/replicateS4ProjectsDelta")
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .accept(org.springframework.http.MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("Delta load is completed"));

    verify(mockResourceRequestRepository, times(1)).selectResourceRequestForDemand(any());
    verify(mockAssignmentService, times(1)).deleteAssignmentsForResourceRequests(resourceRequest.getId());
    verify(mockIntegrationStatusRepository, times(3)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    verify(mockIntegrationStatusRepository, times(3)).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
    verify(mockProjectReplicationTasksRepository, times(1)).getProjectReplicationTaskBasedonTaskStatusCode(3);
    verify(mockProjectRepository, times(1)).selectProjectTree("PRJ-001");
    verify(mockDemandRepository, times(1)).selectDemandForWorkPackage("PRJ-001.1.1");
    verify(mockDemandRepository, times(2)).getBillingRoleById(s4Demand.getEngagementProjectResource());
    verify(mockIntegrationStatusRepository, times(1)).insertProjectReplicationStatus(any());
    verify(mockIntegrationStatusRepository, times(3)).getSingleProjectSync(Constants.RunStatus.PROCESSING,
        Constants.ReplicationType.DELTA, serviceOrganizations);

  }

  /**
   * The test executes delta load scenario where 1. Source system is having three
   * projects [PRJ-001,PRJ-INT] of service org IN01 and [PRJ-002] of service org
   * DE01 has been modified 2. PRJ-001 --> work package dates are shifted from
   * [01/01/2020<---->30/12/2020] to [01/01/2019<---->30/12/2019] 3. PRJ-INT is
   * newly creates, it is a internal project and it fails to replicate in RM 4.
   * PRJ-002 newly created but it is part of DE01 service organization
   *
   * @throws Exception
   */
  @DisplayName("Delta Load Scenario With Failure Scenario")
  @Test
  @Order(2)
  public void deltaLoadScenarioWithFailures() throws Exception {

    Project s4Project = new Project();
    WorkPackage s4WorkPackage;
    WorkItem s4WorkItem;
    EngmntProjRsceDmnd s4Demand;
    EngmntProjRsceDmndDistr s4DemandDistribution;
    List<Project> projects = new ArrayList<>();
    EngmntProjRsceSup supply;
    List<EngmntProjRsceSup> supplys = new ArrayList<>();

    List<Projects> projectsFromRM = new ArrayList<>();
    List<WorkPackages> workPackagesFromRM = new ArrayList<>();
    List<Demands> demandsFromRM = new ArrayList<>();

    List<ProjectSync> projectSyncs = new ArrayList<>();

    ErpHttpDestination mockErpHttpDestination = mock(ErpHttpDestination.class);
    ProjectSync projectSync = ProjectSync.create();
    projectSync.setProject("PRJ-001");
    projectSync.setStatusCode(2);
    projectSync.setTypeTypeCode(1);

    projectSyncs.add(projectSync);

    projectSync = ProjectSync.create();
    projectSync.setProject("PRJ-INT");
    projectSync.setStatusCode(2);
    projectSync.setTypeTypeCode(1);

    projectSyncs.add(projectSync);

    ProjectReplicationStatus projectReplicationStatus = ProjectReplicationStatus.create();
    projectReplicationStatus.setStartTime(Instant.now());
    projectReplicationStatus.setStatusCode(3);
    projectReplicationStatus.setTypeCode(1);
    projectReplicationStatus.setProjectSync(projectSyncs);

    List<ProjectReplicationTasks> projectReplicationTasks = new ArrayList<>();
    ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
    item1.setServiceOrganizationCode("IN01");
    item1.setTaskStatusCode(3);
    item1.setReferenceDate(LocalDate.of(2020, 12, 30));
    projectReplicationTasks.add(item1);

    List<String> serviceOrganizations = new ArrayList<>();
    serviceOrganizations.add("IN01");
    ZonedDateTime lastReplicationRunTime = projectReplicationStatus.getStartTime().atZone(ZoneId.of("UTC"));

    // Project : PRJ-001
    s4Project = new Project();
    s4Project.setProjectID("PRJ-001");
    s4Project.setOrgID("IN01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setProjectCategory(Constants.S4Constants.CUSTOMER_PROJECT_TYPE);
    s4Project.setCustomer("1780005001");
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4Project.setProjectName("NGDMS");

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-001.1.1");
    s4WorkPackage.setProjectID("PRJ-001");
    s4WorkPackage.setWorkPackageName("Implementation");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("IN01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-001.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    supply = new EngmntProjRsceSup();
    supplys.add(supply);
    s4Demand.setResourceSupply(supplys);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    // Project : PRJ-INT
    s4Project = new Project();
    s4Project.setProjectID("PRJ-INT");
    s4Project.setOrgID("IN01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-INT.1.1");
    s4WorkPackage.setProjectID("PRJ-INT");
    s4WorkPackage.setWorkPackageName("Implementation");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("IN01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-INT.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    // Project : PRJ-002
    s4Project = new Project();
    s4Project.setProjectID("PRJ-002");
    s4Project.setOrgID("DE01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setProjectCategory(Constants.S4Constants.CUSTOMER_PROJECT_TYPE);
    s4Project.setCustomer("1780005002");
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));
    s4WorkPackage.setWorkPackageID("PRJ-002.1.1");
    s4WorkPackage.setProjectID("PRJ-002");
    s4WorkPackage.setWorkPackageName("Implementation");

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setDeliveryOrganization("DE01");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");
    s4Demand.setUnitOfMeasure("duration-hour");
    s4Demand.setResourceDemand("1001");
    s4Demand.setWorkPackage("PRJ-002.1.1");

    s4WorkItem = new WorkItem();
    s4WorkItem.setWorkitem("USR01");
    s4WorkItem.setWorkitemname("TEST01");
    s4WorkPackage.addWorkItemSet(s4WorkItem);

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);
    s4DemandDistribution.setResourceDemand("1001");

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    projects.add(s4Project);

    Customer customer = new Customer();
    customer.setCustomer("1780005001");
    customer.setCustomerName("TCS");
    customer.setCustomerFullName("Tata Consulting Service");

    BillingRoles billingRole = BillingRoles.create();
    billingRole.setId("T001");
    billingRole.setName("Senior Consultant");

    List<CapacityRequirements> capacityRequirements = new ArrayList();
    CapacityRequirements capacityRequirement = CapacityRequirements.create();
    capacityRequirement.setId("cap01");
    capacityRequirement.setResourceRequestId("rr02");
    capacityRequirement.setStartDate(LocalDate.of(2019, 1, 1));
    capacityRequirement.setEndDate(LocalDate.of(2019, 12, 30));
    capacityRequirements.add(capacityRequirement);

    ResourceRequests resourceRequest = ResourceRequests.create();
    resourceRequest.setId("rr02");
    resourceRequest.setDemandId("demand02");
    resourceRequest.setStartDate(LocalDate.of(2019, 1, 1));
    resourceRequest.setEndDate(LocalDate.of(2019, 12, 30));
    resourceRequest.setEffortDistributionTypeCode(0);
    resourceRequest.setCapacityRequirements(capacityRequirements);

    Demands demand = Demands.create();
    demand.setId("demand02");
    demand.setExternalID("1001");
    demand.setBillingCategoryId("NBL");
    demand.setStartDate(LocalDate.of(2019, 1, 1));
    demand.setEndDate(LocalDate.of(2019, 12, 30));
    demand.setWorkPackageId("PRJ-001.1.1");
    demand.setBillingRoleId("T001");
    demand.setDeliveryOrganizationCode("IN01");
    demandsFromRM.add(demand);

    WorkPackages workPackage = WorkPackages.create();
    workPackage.setId("PRJ-001.1.1");
    workPackage.setName("Blue Print design:PRJ-002");
    workPackage.setProjectId("PRJ-001");
    workPackage.setStartDate(LocalDate.of(2019, 1, 1));
    workPackage.setEndDate(LocalDate.of(2019, 12, 30));
    workPackage.setName("Implementation");
    workPackagesFromRM.add(workPackage);

    Projects rmProject = Projects.create();
    rmProject.setId("PRJ-001");
    rmProject.setName("NGDMS");
    rmProject.setCustomerId("1780005001");
    rmProject.setStartDate(LocalDate.of(2019, 1, 1));
    rmProject.setEndDate(LocalDate.of(2019, 12, 30));

    rmProject.setWorkPackages(workPackagesFromRM);

    Mockito
        .when(mockIntegrationStatusRepository.getSingleProjectSync(Constants.RunStatus.PROCESSING,
            Constants.ReplicationType.DELTA, serviceOrganizations))
        .thenReturn(projectSyncs.get(0)).thenReturn(projectSyncs.get(1)).thenReturn(null);

    doReturn(mockErpHttpDestination).when(mockS4Client).getDestination();
    doReturn(projects.get(0)).when(mockS4Client).getProjectTree("PRJ-001");
    doReturn(projects.get(1)).when(mockS4Client).getProjectTree("PRJ-INT");

    ServiceException se = new ServiceException("The project does not exist in the S/4 system");
    doThrow(se).when(mockS4Client).getProjectTree("PRJ-INT");
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();
    doReturn(customer).when(mockS4Client).getCustomerDetails("1780005001");

    doReturn(projectReplicationStatus).when(mockIntegrationStatusRepository)
        .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    doReturn(null).when(mockIntegrationStatusRepository).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
    doReturn(projectReplicationTasks).when(mockProjectReplicationTasksRepository)
        .getProjectReplicationTaskBasedonTaskStatusCode(3);
    doReturn(projectSyncs.get(0)).when(mockIntegrationStatusRepository).getProjectSyncByProject("PRJ-001",
        Constants.ReplicationType.DELTA);
    doReturn(projectSyncs.get(1)).when(mockIntegrationStatusRepository).getProjectSyncByProject("PRJ-INT",
        Constants.ReplicationType.DELTA);
    doReturn(projects).when(mockS4Client).getProjectIds(Constants.PAGE_SIZE, lastReplicationRunTime);
    doReturn(null).when(mockProjectRepository).getCustomerById(s4Project.getCustomer());
    doReturn(rmProject).when(mockProjectRepository).selectProjectTree("PRJ-001");
    doReturn(null).when(mockProjectRepository).selectProjectTree("PRJ-INT");
    doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(any());
    doNothing().when(mockAssignmentRepository).deleteAssignmentsForResourceRequests(resourceRequest.getId());
    doReturn(demandsFromRM).when(mockDemandRepository).selectDemandForWorkPackage("PRJ-001.1.1");
    doReturn(1L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("IN01");
    doReturn(billingRole).when(mockDemandRepository).getBillingRoleById(s4Demand.getEngagementProjectResource());
    doReturn(customer).when(mockS4Client).getCustomerDetails(s4Project.getCustomer());

    mockMvc
        .perform(MockMvcRequestBuilders.post("/replicateS4ProjectsDelta")
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .accept(org.springframework.http.MediaType.APPLICATION_JSON))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.status").value("Error occurred during delta load"))
        .andExpect(jsonPath("$.details[0].severity").value("ERROR"))
        .andExpect(jsonPath("$.details[0].message").value("Error occured while processing the project PRJ-INT "));

    verify(mockResourceRequestRepository, times(1)).selectResourceRequestForDemand(any());
    verify(mockAssignmentService, times(1)).deleteAssignmentsForResourceRequests(resourceRequest.getId());
    verify(mockIntegrationStatusRepository, times(3)).readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    verify(mockIntegrationStatusRepository, times(3)).readProjectReplicationStatus(Constants.ReplicationType.DELTA);
    verify(mockProjectReplicationTasksRepository, times(1)).getProjectReplicationTaskBasedonTaskStatusCode(3);
    verify(mockProjectRepository, times(1)).selectProjectTree("PRJ-001");
    verify(mockDemandRepository, times(1)).selectDemandForWorkPackage("PRJ-001.1.1");
    verify(mockDemandRepository, times(2)).getBillingRoleById(s4Demand.getEngagementProjectResource());
    verify(mockIntegrationStatusRepository, times(1)).insertProjectReplicationStatus(any());
    verify(mockIntegrationStatusRepository, times(4)).getSingleProjectSync(Constants.RunStatus.PROCESSING,
        Constants.ReplicationType.DELTA, serviceOrganizations);

  }

  @DisplayName("Delete Project Scenario Integration Test")
  @Test
  @Order(3)
  public void deleteProject() throws Exception {

    ErpHttpDestination mockErpHttpDestination = mock(ErpHttpDestination.class);

    String projectId01 = "PRJ-001";
    String projectId = "PRJ-002";
    String wpID = "wp02";
    String demandID = "demand02";
    String resReqID = "rr02";
    String customerID = "1780005002";

    Project s4Project = new Project();
    WorkPackage s4WorkPackage;
    EngmntProjRsceDmnd s4Demand;
    EngmntProjRsceDmndDistr s4DemandDistribution;

    ProjectReplicationStatus projectReplicationInitial;
    ProjectReplicationStatus projectReplicationDelete;

    List<Project> s4projects;

    List<ProjectReplicationTasks> projectReplicationTasks;
    List<String> serviceOrganizations;
    List<String> rmProjects;
    List<WorkPackages> workPackagesFromRM;
    List<Demands> demandsFromRM;

    ResourceRequests resourceRequest;
    Demands demand;
    WorkPackages workPackage;
    Projects rmProject;

    projectReplicationInitial = ProjectReplicationStatus.create();
    projectReplicationDelete = ProjectReplicationStatus.create();
    projectReplicationInitial.setStatusCode(Constants.RunStatus.COMPLETED);
    projectReplicationDelete.setStatusCode(Constants.RunStatus.COMPLETED);

    rmProjects = new ArrayList<>();
    workPackagesFromRM = new ArrayList<>();
    demandsFromRM = new ArrayList<>();

    rmProject = Projects.create();
    demand = Demands.create();
    workPackage = WorkPackages.create();
    resourceRequest = ResourceRequests.create();

    resourceRequest.setId(resReqID);
    resourceRequest.setDemandId("demand02");

    demand.setId(demandID);
    demandsFromRM.add(demand);

    workPackage.setId(wpID);
    workPackage.setName("Blue Print design:PRJ-002");
    workPackage.setProjectId(projectId);
    workPackage.setDemands(demandsFromRM);
    workPackagesFromRM.add(workPackage);

    rmProject.setId(projectId);
    rmProject.setCustomerId(customerID);
    rmProject.setWorkPackages(workPackagesFromRM);
    rmProjects.add(projectId01);
    rmProjects.add(projectId);

    s4projects = new ArrayList<>();
    projectReplicationTasks = new ArrayList<>();
    ProjectReplicationTasks item1 = ProjectReplicationTasks.create();
    item1.setServiceOrganizationCode("IN01");
    item1.setTaskStatusCode(3);
    item1.setReferenceDate(LocalDate.of(2020, 12, 30));
    projectReplicationTasks.add(item1);

    serviceOrganizations = new ArrayList<>();
    serviceOrganizations.add("IN01");

    s4Project = new Project();
    s4Project.setProjectID(projectId01);
    s4Project.setOrgID("IN01");
    s4Project.setChangedOn(ZonedDateTime.now());
    s4Project.setProjectCategory(Constants.S4Constants.CUSTOMER_PROJECT_TYPE);
    s4Project.setCustomer("1780005001");
    s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4WorkPackage = new WorkPackage();
    s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
    s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

    s4Demand = new EngmntProjRsceDmnd();
    s4Demand.setVersion("1");
    s4Demand.setBillingControlCategory("NBL");
    s4Demand.setQuantity(BigDecimal.TEN);
    s4Demand.setEngagementProjectResource("T001");

    s4DemandDistribution = new EngmntProjRsceDmndDistr();
    s4DemandDistribution.setCalendarMonth("1");
    s4DemandDistribution.setCalendarYear("2020");
    s4DemandDistribution.setVersion("1");
    s4DemandDistribution.setQuantity(BigDecimal.TEN);

    s4Demand.addResourceDemandDistribution(s4DemandDistribution);
    s4WorkPackage.addResourceDemand(s4Demand);
    s4Project.addWorkPackageSet(s4WorkPackage);
    s4projects.add(s4Project);

    doReturn(mockErpHttpDestination).when(mockS4Client).getDestination();
    doReturn(s4Project).when(mockS4Client).getProjectTree(projectId01);
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCommercialProject();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForCustomerMaster();
    doReturn(Boolean.TRUE).when(mockS4Client).isAuthorisedForActivityType();

    doReturn(projectReplicationInitial).when(mockIntegrationStatusRepository)
        .readProjectReplicationStatus(Constants.ReplicationType.INITIAL);
    doReturn(projectReplicationDelete).when(mockIntegrationStatusRepository)
        .readProjectReplicationStatus(Constants.ReplicationType.DELETE);

    doReturn(projectReplicationTasks).when(mockProjectReplicationTasksRepository)
        .getProjectReplicationTaskBasedonTaskStatusCode(3);
    doReturn(s4projects).when(mockS4Client).getProjectIds(Constants.PAGE_SIZE, null);

    doReturn(rmProjects).when(mockProjectRepository).getProjectsByServiceOrganization(serviceOrganizations);
    doReturn(rmProject.getCustomerId()).when(mockProjectRepository).getCustomer(projectId);
    doReturn(workPackagesFromRM).when(mockWorkPackageRepository).selectWorkPackageForProject(projectId);
    doReturn(demandsFromRM).when(mockDemandRepository).selectDemandForWorkPackage(wpID);
    doReturn(0L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("IN01");
    doReturn(resourceRequest).when(mockResourceRequestRepository).selectResourceRequestForDemand(demandID);
    doReturn(0).when(mockProjectRepository).getCustomerProject(customerID);

    mockMvc
        .perform(MockMvcRequestBuilders.post("/deleteProjects")
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .accept(org.springframework.http.MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("Projects Deletion Trigger is completed"));

    verify(mockIntegrationStatusRepository, times(2)).updateProjectReplicationStatus(any());
    verify(mockAssignmentService, times(1)).deleteAssignmentsForResourceRequests(resReqID);
    verify(mockResourceRequestRepository, times(1)).deleteResourceRequest(anyString());
    verify(mockDemandRepository, times(1)).deleteDemand(demand);
    verify(mockWorkPackageRepository, times(1)).deleteWorkPackage(wpID);
    verify(mockProjectRepository, times(1)).deleteProject(projectId);
    verify(mockProjectRepository, times(1)).deleteCustomer(customerID);

  }

  @DisplayName("Delete Project Scenario With Failure Integration Test")
  @Test
  @Order(3)
  public void deleteProjectWithFaiure() throws Exception {

    doReturn(null).when(mockS4Client).getDestination();
    mockMvc
        .perform(MockMvcRequestBuilders.post("/deleteProjects")
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .accept(org.springframework.http.MediaType.APPLICATION_JSON))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.status").value("Projects Deletion Trigger failed"))
        .andExpect(jsonPath("$.details[0].severity").value("ERROR"))
        .andExpect(jsonPath("$.details[0].message").value("Destination is not maintained"));

  }

}
