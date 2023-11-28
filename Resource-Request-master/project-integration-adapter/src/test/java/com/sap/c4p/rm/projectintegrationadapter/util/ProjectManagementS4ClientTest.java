package com.sap.c4p.rm.projectintegrationadapter.util;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.stubbing.OngoingStubbing;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.datamodel.odata.helper.Order;
import com.sap.cloud.sdk.s4hana.connectivity.ErpHttpDestination;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.activitytype.CostCenterActivityTypeText;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.businesspartner.Customer;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmndDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkItem;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultActivityTypeService;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultBusinessPartnerService;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultCommercialProjectService;

import com.sap.c4p.rm.projectintegrationadapter.model.ProjectReplicationTask;

@DisplayName("Unit test for ProjectManagementS4Client class")
public class ProjectManagementS4ClientTest {

  public ProjectManagementS4Client cut;

  private DestinationAccess mockDestinationAccess;
  private ErpHttpDestination mockErpHttpDestination;
  private static DefaultBusinessPartnerService mockDefaultBusinessPartnerService;
  private static DefaultActivityTypeService mockDefaultActivityTypeService;
  private static DefaultCommercialProjectService mockDefaultCommercialProjectService;
  public static final int PAGE_SIZE = 2;
  private ProjectManagementS4Client spyProjectManagementS4Client;

  @BeforeEach
  public void setUp() {

    this.mockDestinationAccess = mock(DestinationAccess.class);
    this.mockErpHttpDestination = mock(ErpHttpDestination.class);
    mockDefaultBusinessPartnerService = mock(DefaultBusinessPartnerService.class, RETURNS_DEEP_STUBS);
    mockDefaultActivityTypeService = mock(DefaultActivityTypeService.class, RETURNS_DEEP_STUBS);
    mockDefaultCommercialProjectService = mock(DefaultCommercialProjectService.class, RETURNS_DEEP_STUBS);

    cut = new ProjectManagementS4Client(mockDestinationAccess);
    spyProjectManagementS4Client = spy(ProjectManagementS4Client.class);

  }

  @Nested
  @DisplayName("Unit Test for getProjectIds method")
  class GetProjectIdsTest {

    /**
     * This test verifies if all the methods are called successfully
     *
     * @throws ODataException
     */

    @Test
    public void getProjectIdsWhenStartTimeIsNotNull() throws ODataException {

      ZonedDateTime mockStartDateTime = ZonedDateTime.now();

      List<Project> allProjects = new ArrayList<>();
      List<Project> expectedProjects = new ArrayList<Project>();

      Project p1 = new Project();
      Project p2 = new Project();

      p1.setProjectID("P01");
      p1.setOrgID("ORG_IN");
      p2.setProjectID("P02");
      p2.setOrgID("ORG_DE");

      allProjects.add(0, p1);
      allProjects.add(1, p2);
      expectedProjects.add(0, p1);
      expectedProjects.add(1, p2);

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService().thenReturn(allProjects);

      List<Project> actualProjects = spyProjectManagementS4Client.getProjectIds(PAGE_SIZE, mockStartDateTime);

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getService();
      assertEquals(expectedProjects, actualProjects);

    }

    // generic mockService created to get projects and will be valid for any filter
    private OngoingStubbing<List<Project>> mockService() throws ODataException {

      return when(mockDefaultCommercialProjectService.getAllProject().orderBy(Project.CHANGED_ON, Order.ASC)
          .top(PAGE_SIZE).filter(any()).select(Project.PROJECT_ID, Project.CHANGED_ON, Project.ORG_ID, Project.END_DATE)
          .executeRequest(mockErpHttpDestination));

    }

    @Test
    public void whenGetProjectIdsThrowsException() {

      ServiceException e = new ServiceException("Failed to get Project list");

      ZonedDateTime mockStartDateTime = ZonedDateTime.now();

      doThrow(e).when(spyProjectManagementS4Client).getDestination();

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getProjectIds(PAGE_SIZE, mockStartDateTime));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

    @Test
    public void whenGetProjectIdsThrowsODataException() throws ODataException {
      ODataException e = new ODataException(null, "ODataException occured while getting Project list", null);
      ServiceException se = new ServiceException(ErrorStatuses.SERVER_ERROR,
          "ODataException occured while getting Project list", e);
      ZonedDateTime mockStartDateTime = ZonedDateTime.now();
      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService().thenThrow(e);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getProjectIds(PAGE_SIZE, mockStartDateTime));
      assertAll(() -> assertEquals(se.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for getProjectIdsForReplicationTask method")
  class getProjectIdsForReplicationTaskTest {

    /**
     * This test verifies if all the methods are called successfully
     *
     * @throws ODataException
     */

    @Test
    public void getProjectIdsForReplicationTaskSuccessfulScenario() throws ODataException {

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");

      List<Project> allProjects = new ArrayList<>();
      List<Project> expectedProjects = new ArrayList<Project>();

      Project p1 = new Project();
      Project p2 = new Project();

      p1.setProjectID("P01");
      p1.setOrgID("ORG_IN");
      p2.setProjectID("P02");
      p2.setOrgID("ORG_DE");

      allProjects.add(0, p1);
      allProjects.add(1, p2);
      expectedProjects.add(0, p1);
      expectedProjects.add(1, p2);

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService().thenReturn(allProjects);

      List<Project> actualProjects = spyProjectManagementS4Client.getProjectIdsForReplicationTask(PAGE_SIZE,
          mockProjectReplicationTask);

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getService();
      assertEquals(expectedProjects, actualProjects);

    }

    // generic mockService created to get projects and will be valid for any filter
    private OngoingStubbing<List<Project>> mockService() throws ODataException {

      return when(mockDefaultCommercialProjectService.getAllProject().orderBy(Project.CHANGED_ON, Order.ASC)
          .top(PAGE_SIZE).filter(any()).select(Project.PROJECT_ID, Project.CHANGED_ON, Project.ORG_ID)
          .executeRequest(mockErpHttpDestination));

    }

    @Test
    public void whenGetProjectIdsForReplicationTaskThrowsException() {

      ServiceException e = new ServiceException("Failed to get Project list");

      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");

      doThrow(e).when(spyProjectManagementS4Client).getDestination();

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getProjectIdsForReplicationTask(PAGE_SIZE, mockProjectReplicationTask));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));
    }

    @Test
    public void whenGetProjectIdsForReplicationTaskThrowsODataException() throws ODataException {
      ODataException e = new ODataException(null, "ODataException occured while getting Project list", null);
      ServiceException se = new ServiceException(ErrorStatuses.SERVER_ERROR,
          "ODataException occured while getting Project list", e);
      ProjectReplicationTask mockProjectReplicationTask = new ProjectReplicationTask();
      mockProjectReplicationTask.setReferenceDate("2020-12-01");

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService().thenThrow(e);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getProjectIdsForReplicationTask(PAGE_SIZE, mockProjectReplicationTask));
      assertAll(() -> assertEquals(se.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for getProjectTree method")
  class GetProjectTreeTest {

    @Test
    public void whenGetProjectTreeIsNotEmpty() throws ODataException {

      String projectId = "S4HANA_PROJ";
      List<Project> expectedProjects = new ArrayList<Project>();
      Project expectedProject = new Project();

      expectedProject.setProjectID(projectId);
      expectedProject.setChangedOn(ZonedDateTime.now());
      expectedProject.setOrgID("ORG_IN");
      expectedProjects.add(0, expectedProject);

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService(projectId).thenReturn(expectedProjects);

      Project actualProject = spyProjectManagementS4Client.getProjectTree(projectId);

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getService();
      assertEquals(expectedProject, actualProject);

    }

    @Test
    public void whenGetProjectTreeIsEmpty() throws ODataException {

      String projectId = "S4HANA_PROJ";
      List<Project> expectedProjects = new ArrayList<Project>();
      ServiceException e = new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed to get Project tree");

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService(projectId).thenReturn(expectedProjects);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getProjectTree(projectId));

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getService();
      assertEquals(e.getMessage(), exception.getMessage());

    }

    private OngoingStubbing<List<Project>> mockService(String projectId) throws ODataException {

      return when(mockDefaultCommercialProjectService.getAllProject().filter(Mockito.any()).select(Project.PROJECT_ID,
          Project.PROJECT_NAME, Project.CUSTOMER, Project.START_DATE, Project.END_DATE, Project.ORG_ID,
          Project.PROJECT_CATEGORY,
          Project.TO_WORK_PACKAGE_SET.select(WorkPackage.WORK_PACKAGE_ID, WorkPackage.WORK_PACKAGE_NAME,
              WorkPackage.WP_START_DATE, WorkPackage.WP_END_DATE, WorkPackage.PROJECT_ID, WorkPackage.CHANGED_ON,
              WorkPackage.TO_WORK_ITEM_SET.select(WorkItem.WORKITEM, WorkItem.WORKITEMNAME),
              WorkPackage.TO_RESOURCE_DEMAND.select(EngmntProjRsceDmnd.RESOURCE_DEMAND, EngmntProjRsceDmnd.WORK_PACKAGE,
                  EngmntProjRsceDmnd.WORK_ITEM, EngmntProjRsceDmnd.DELIVERY_ORGANIZATION,
                  EngmntProjRsceDmnd.ENGAGEMENT_PROJECT, EngmntProjRsceDmnd.VERSION,
                  EngmntProjRsceDmnd.BILLING_CONTROL_CATEGORY, EngmntProjRsceDmnd.QUANTITY,
                  EngmntProjRsceDmnd.UNIT_OF_MEASURE, EngmntProjRsceDmnd.ENGAGEMENT_PROJECT_RESOURCE,
                  EngmntProjRsceDmnd.TO_RESOURCE_DEMAND_DISTRIBUTION.select(EngmntProjRsceDmndDistr.QUANTITY,
                      EngmntProjRsceDmndDistr.UNIT_OF_MEASURE, EngmntProjRsceDmndDistr.CALENDAR_MONTH,
                      EngmntProjRsceDmndDistr.CALENDAR_YEAR),
                  EngmntProjRsceDmnd.TO_RESOURCE_SUPPLY.select(EngmntProjRsceSup.RESOURCE_DEMAND,
                      EngmntProjRsceSup.RESOURCE_SUPPLY, EngmntProjRsceSup.WORK_PACKAGE,
                      EngmntProjRsceSup.PERSON_WORK_AGREEMENT, EngmntProjRsceSup.WORKFORCE_PERSON_USER_ID,
                      EngmntProjRsceSup.QUANTITY, EngmntProjRsceSup.VERSION,
                      EngmntProjRsceSup.TO_RESOURCE_SUPPLY_DISTRIBUTION.select(EngmntProjRsceSupDistr.ALL_FIELDS)))))
          .executeRequest(mockErpHttpDestination));

    }

    @Test
    public void whenGetProjectTreeThrowsException() throws ODataException {

      ServiceException e = new ServiceException("Failed to get Project tree");

      String projectId = "S4HANA_PROJ";

      doThrow(e).when(spyProjectManagementS4Client).getDestination();

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getProjectTree(projectId));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    @Test
    public void whenGetProjectTreeThrowsODataException() throws ODataException {
      ODataException e = new ODataException(null, "ODataException occured while getting Project tree", null);
      ServiceException se = new ServiceException(ErrorStatuses.SERVER_ERROR,
          "ODataException occured while getting Project tree", e);

      String projectId = "S4HANA_PROJ";

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService(projectId).thenThrow(e);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getProjectTree(projectId));
      assertAll(() -> assertEquals(se.getMessage(), exception.getMessage()));

    }
  }

  @Nested
  @DisplayName("Unit Test for getCustomerDetails method")
  class GetCustomerDetailsTest {

    @Test
    public void whenGetCustomerDetailsIsNotEmpty() throws ODataException {

      String customerId = "ItelO";
      List<Customer> expectedCustomers = new ArrayList<Customer>();
      Customer expectedCustomer = new Customer();

      expectedCustomer.setCustomer(customerId);
      expectedCustomers.add(0, expectedCustomer);

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultBusinessPartnerService).when(spyProjectManagementS4Client).getBpService();
      mockBpService(customerId).thenReturn(expectedCustomers);

      Customer actualCustomer = spyProjectManagementS4Client.getCustomerDetails(customerId);

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getBpService();
      // assertEquals(expectedCustomer, actualCustomer);

    }

    @Test
    public void whenGetCustomerDetailsIsEmpty() throws ODataException {

      String customerId = "ItelO";
      List<Customer> expectedCustomers = new ArrayList<Customer>();

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultBusinessPartnerService).when(spyProjectManagementS4Client).getBpService();
      mockBpService(customerId).thenReturn(expectedCustomers);

      Customer actualCustomer = spyProjectManagementS4Client.getCustomerDetails(customerId);

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getBpService();
      // assertEquals(null, actualCustomer);

    }

    private OngoingStubbing<List<Customer>> mockBpService(String customerId) throws ODataException {

      return when(mockDefaultBusinessPartnerService.getAllCustomer().filter(Mockito.any()).select(Mockito.any())
          .executeRequest(mockErpHttpDestination));

    }

    @Test
    public void whenGetCustomerDetailsThrowsException() throws ODataException {

      ServiceException e = new ServiceException("Failed to get customer details");
      String customerId = "ItelO";

      doThrow(e).when(spyProjectManagementS4Client).getDestination();

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getCustomerDetails(customerId));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    @Test
    public void whenGetCustomerDetailsThrowsODataException() throws ODataException {

      ODataException e = new ODataException(null, "ODataException occured while getting customer details", null);
      ServiceException se = new ServiceException(ErrorStatuses.SERVER_ERROR,
          "ODataException occured while getting customer details", e);

      String customerId = "ItelO";

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultBusinessPartnerService).when(spyProjectManagementS4Client).getBpService();
      mockBpService(customerId).thenThrow(e);

//      final ServiceException exception = assertThrows(ServiceException.class,
//          () -> spyProjectManagementS4Client.getCustomerDetails(customerId));
//      assertAll(() -> assertEquals(se.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for getCostCenterActivityTypeText method")
  class GetCostCenterActivityTypeTextTest {

    @Test
    public void whenGetCostCenterActivityTypeIsNotEmpty() throws ODataException {

      String activityTypeId = "billingRole1";
      List<CostCenterActivityTypeText> expectedActivityTypes = new ArrayList<CostCenterActivityTypeText>();
      CostCenterActivityTypeText expectedactivityType = new CostCenterActivityTypeText();
      expectedactivityType.setCostCtrActivityType(activityTypeId);
      expectedactivityType.setCostCtrActivityTypeName("Senior Developer");

      expectedActivityTypes.add(0, expectedactivityType);

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultActivityTypeService).when(spyProjectManagementS4Client).getActivityTypeService();
      mockActivityTypeService(activityTypeId).thenReturn(expectedActivityTypes);

      CostCenterActivityTypeText actualCostCenterActivityType = spyProjectManagementS4Client
          .getCostCenterActivityTypeText(activityTypeId);

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getActivityTypeService();
      assertEquals(expectedactivityType, actualCostCenterActivityType);

    }

    @Test
    public void whenGetCostCenterActivityTypeIsEmpty() throws ODataException {

      String activityTypeId = "billingRole1";
      List<CostCenterActivityTypeText> expectedActivityTypes = new ArrayList<CostCenterActivityTypeText>();

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultActivityTypeService).when(spyProjectManagementS4Client).getActivityTypeService();
      mockActivityTypeService(activityTypeId).thenReturn(expectedActivityTypes);

      CostCenterActivityTypeText actualCostCenterActivityType = spyProjectManagementS4Client
          .getCostCenterActivityTypeText(activityTypeId);

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getActivityTypeService();
      assertEquals(null, actualCostCenterActivityType);
    }

    private OngoingStubbing<List<CostCenterActivityTypeText>> mockActivityTypeService(String activityTypeId)
        throws ODataException {

      return when(mockDefaultActivityTypeService.getAllCostCenterActivityTypeText().filter(any())
          .select(CostCenterActivityTypeText.COST_CTR_ACTIVITY_TYPE_NAME,
              CostCenterActivityTypeText.COST_CTR_ACTIVITY_TYPE, CostCenterActivityTypeText.LANGUAGE)
          .executeRequest(mockErpHttpDestination));

    }

    @Test
    public void whenGetCostCenterActivityTypeThrowsException() throws ODataException {

      ServiceException e = new ServiceException("Failed to get activity type details");
      String activityTypeId = "billingRole1";

      doThrow(e).when(spyProjectManagementS4Client).getDestination();

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getCostCenterActivityTypeText(activityTypeId));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    @Test
    public void whenGetCostCenterActivityTypeThrowsODataException() throws ODataException {
      ODataException e = new ODataException(null, "ODataException occured while getting activity type details", null);
      ServiceException se = new ServiceException(ErrorStatuses.SERVER_ERROR,
          "ODataException occured while getting activity type details", e);

      String activityTypeId = "billingRole1";

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultActivityTypeService).when(spyProjectManagementS4Client).getActivityTypeService();
      mockActivityTypeService(activityTypeId).thenThrow(e);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyProjectManagementS4Client.getCostCenterActivityTypeText(activityTypeId));
      assertAll(() -> assertEquals(se.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit Test for isAuthorisedForActivityType method")
  class IsAuthorisedForActivityTypeTest {

    @Test
    public void isAuthorisedForActivityTypeSuccess() throws ODataException {

      List<CostCenterActivityTypeText> expectedActivityTypes = new ArrayList<CostCenterActivityTypeText>();

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultActivityTypeService).when(spyProjectManagementS4Client).getActivityTypeService();
      mockActivityTypeService().thenReturn(expectedActivityTypes);

      Boolean isAuthorized = spyProjectManagementS4Client.isAuthorisedForActivityType();

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getActivityTypeService();
      assertEquals(true, isAuthorized);

    }

    @Test
    public void isAuthorisedForActivityTypeFailure() throws ODataException {
      ODataException e = new ODataException(null, "ODataException occured while getting activity type details", null);

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultActivityTypeService).when(spyProjectManagementS4Client).getActivityTypeService();
      mockActivityTypeService().thenThrow(e);

      Boolean isAuthorized = spyProjectManagementS4Client.isAuthorisedForActivityType();

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getActivityTypeService();

      assertEquals(false, isAuthorized);

    }

    private OngoingStubbing<List<CostCenterActivityTypeText>> mockActivityTypeService() throws ODataException {

      return when(mockDefaultActivityTypeService.getAllCostCenterActivityTypeText().filter(any()).select(any()).top(1)
          .executeRequest(mockErpHttpDestination));

    }

  }

  @Nested
  @DisplayName("Unit Test for isAuthorisedForCommercialProject method")
  class IsAuthorisedForCommercialProjectTest {

    @Test
    public void isAuthorisedForCommercialProjectSuccess() throws ODataException {

      List<Project> expectedProjects = new ArrayList<Project>();

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService().thenReturn(expectedProjects);

      Boolean isAuthorized = spyProjectManagementS4Client.isAuthorisedForCommercialProject();

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getService();
      assertEquals(true, isAuthorized);

    }

    @Test
    public void isAuthorisedForCommercialProjectFailure() throws ODataException {
      ODataException e = new ODataException(null, "ODataException occured while getting Projects", null);
      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultCommercialProjectService).when(spyProjectManagementS4Client).getService();
      mockService().thenThrow(e);

      Boolean isAuthorized = spyProjectManagementS4Client.isAuthorisedForCommercialProject();

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getService();
      assertEquals(false, isAuthorized);

    }

    private OngoingStubbing<List<Project>> mockService() throws ODataException {

      return when(mockDefaultCommercialProjectService.getAllProject().select(Project.PROJECT_ID).top(1)
          .executeRequest(mockErpHttpDestination));

    }

  }

  @Nested
  @DisplayName("Unit Test for isAuthorisedForCustomerMaster method")
  class IsAuthorisedForCustomerMasterTests {

    @Test
    public void isAuthorisedForCustomerMasterSuccess() throws ODataException {

      List<Customer> expectedCustomers = new ArrayList<Customer>();

      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultBusinessPartnerService).when(spyProjectManagementS4Client).getBpService();
      mockBpService().thenReturn(expectedCustomers);

      Boolean isAuthorized = spyProjectManagementS4Client.isAuthorisedForCustomerMaster();

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getBpService();
      assertEquals(true, isAuthorized);

    }

    @Test
    public void isAuthorizedForCustomerMasterFailure() throws ODataException {

      ODataException e = new ODataException(null, "ODataException occured while getting customer details", null);
      doReturn(mockErpHttpDestination).when(spyProjectManagementS4Client).getDestination();
      doReturn(mockDefaultBusinessPartnerService).when(spyProjectManagementS4Client).getBpService();
      mockBpService().thenThrow(e);

      Boolean isAuthorized = spyProjectManagementS4Client.isAuthorisedForCustomerMaster();

      verify(spyProjectManagementS4Client, times(1)).getDestination();
      verify(spyProjectManagementS4Client, times(1)).getBpService();
      assertEquals(false, isAuthorized);

    }

    private OngoingStubbing<List<Customer>> mockBpService() throws ODataException {

      return when(mockDefaultBusinessPartnerService.getAllCustomer().select(Customer.CUSTOMER).top(1)
          .executeRequest(mockErpHttpDestination));

    }

  }

}
