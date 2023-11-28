package com.sap.c4p.rm.projectintegrationadapter.transformation;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.CdsData;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmndDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.Project;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkItem;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.WorkPackage;

import com.sap.c4p.rm.projectintegrationadapter.repository.DeliveryOrganizationRepository;
import com.sap.c4p.rm.projectintegrationadapter.service.MasterDataReplication;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;

import com.sap.resourcemanagement.project.Projects;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

@DisplayName("Unit test for transformation of S4 projects hierarchy to RM projects hierarchy")
public class TransformS4ProjectToRMTest {
  /*
   * Class under test
   *
   */
  private static TransformS4ProjectToRM cut;

  /*
   * Mock TransformS4ProjectToRM object setup
   *
   */
  private static MasterDataReplication mockMasterDataReplication;
  private static TransformDemandToResourceRequest mocktransformDemandToResourceRequest;
  private static DeliveryOrganizationRepository mockDeliveryOrganizationRepository;

  @BeforeEach
  public void setUp() {
    mockMasterDataReplication = mock(MasterDataReplication.class);
    mocktransformDemandToResourceRequest = mock(TransformDemandToResourceRequest.class);
    mockDeliveryOrganizationRepository = mock(DeliveryOrganizationRepository.class);
    cut = new TransformS4ProjectToRM(mockMasterDataReplication, mocktransformDemandToResourceRequest,
        mockDeliveryOrganizationRepository);
  }

  @Nested
  @DisplayName("Transform S4Project to RM Project")
  class TransformS4Project {

    private Project s4Project = new Project();

    /** Check the S4Project are transformed to RM Project */
    @Test
    @DisplayName("Validate the S4Project is transformed RM Project sucessfully - Customer Project")
    public void validateS4CustomerProjectTransformedSuccessfully() {

      s4Project.setProjectID("PRJ-001");
      s4Project.setProjectName("NGDMS Project");
      s4Project.setCustomer("1001001");
      s4Project.setStartDate((LocalDateTime.of(2020, 01, 01, 00, 00, 00)));
      s4Project.setEndDate((LocalDateTime.of(2020, 12, 30, 00, 00, 00)));
      s4Project.setOrgID("1010");
      s4Project.setProjectCategory("C");

      Projects rmProject = cut.transformProject(s4Project);
      verify(mockMasterDataReplication, times(1)).createCustomerIfNotPresent(s4Project.getCustomer());

      assertAll(() -> assertEquals(rmProject.getId(), s4Project.getProjectID()),
          () -> assertEquals(rmProject.getName(), s4Project.getProjectName()),
          () -> assertEquals(rmProject.getCustomerId(), s4Project.getCustomer()),
          () -> assertEquals(rmProject.getStartDate(), s4Project.getStartDate().toLocalDate()),
          () -> assertEquals(rmProject.getEndDate(), s4Project.getEndDate().toLocalDate()),
          () -> assertEquals(rmProject.getServiceOrganizationCode(), s4Project.getOrgID()));

    }

    /** Check the S4Project are transformed to RM Project */
    @Test
    @DisplayName("Validate the S4Project is transformed RM Project sucessfully - Internal Project")
    public void validateS4InternalProjectTransformedSuccessfully() {

      s4Project.setProjectID("PRJ-001");
      s4Project.setProjectName("NGDMS Project");
      s4Project.setStartDate((LocalDateTime.of(2020, 01, 01, 00, 00, 00)));
      s4Project.setEndDate((LocalDateTime.of(2020, 12, 30, 00, 00, 00)));
      s4Project.setOrgID("1010");
      s4Project.setProjectCategory("I");

      Projects rmProject = cut.transformProject(s4Project);
      verify(mockMasterDataReplication, times(0)).createCustomerIfNotPresent(anyString());

      assertAll(() -> assertEquals(rmProject.getId(), s4Project.getProjectID()),
          () -> assertEquals(rmProject.getName(), s4Project.getProjectName()),
          () -> assertEquals(rmProject.getCustomerId(), s4Project.getCustomer()),
          () -> assertEquals(rmProject.getStartDate(), s4Project.getStartDate().toLocalDate()),
          () -> assertEquals(rmProject.getEndDate(), s4Project.getEndDate().toLocalDate()),
          () -> assertEquals(rmProject.getServiceOrganizationCode(), s4Project.getOrgID()));

    }

    /**
     * Failed to create customer throws service exception while transforming S4Data
     */
    @Test
    @DisplayName("Failed to create customer throws service exception while transforming S4Data")
    public void FailedToCreateCustomerThrowsServiceException() {
      s4Project.setProjectCategory("C");
      ServiceException serviceException = new ServiceException("Error occured while creating customer masterdata ");

      doThrow(serviceException).when(mockMasterDataReplication).createCustomerIfNotPresent(any());

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.transformProject(s4Project));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

    /** If transformation throws exception, it is handled appropriatelty */
    @Test
    @DisplayName("Validate if S4Project transformation throws exception is handled")
    public void FailedToTransformThrowsServiceException() {

      s4Project.setProjectID("PRJ-001");
      ServiceException serviceException = new ServiceException("Failed to transform S4Project");

      TransformS4ProjectToRM spyTransformS4ProjectToRM = Mockito.spy(cut);

      Mockito.doThrow(serviceException).when(spyTransformS4ProjectToRM).transformProject(s4Project);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyTransformS4ProjectToRM.transformProject(s4Project));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }
  }

  @Nested
  @DisplayName("Transform S4WorkPackage to RM WorkPackage")
  class TransformS4WorkPackage {

    private WorkPackage s4WorkPackage = new WorkPackage();

    @BeforeEach
    public void setS4WorkPackage() {
      s4WorkPackage.setWorkPackageID("PRJ-001.1.1");
      s4WorkPackage.setWorkPackageName("Implementation");
      s4WorkPackage.setProjectID("PRJ-001");
      s4WorkPackage.setWPStartDate((LocalDateTime.of(2020, 01, 01, 00, 00, 00)));
      s4WorkPackage.setWPEndDate((LocalDateTime.of(2020, 12, 30, 00, 00, 00)));
    }

    /** Check the S4WorkPackage are transformed to RM WorkPackage */
    @Test
    @DisplayName("Validate the S4WorkPackage is transformed RM WorkPackage sucessfully")
    public void validateS4WorkPackageTransformedSuccessfully() {

      com.sap.resourcemanagement.project.WorkPackages rmWorkPackage = cut.transformWorkPackage(s4WorkPackage);

      assertAll(() -> assertEquals(rmWorkPackage.getId(), s4WorkPackage.getWorkPackageID()),
          () -> assertEquals(rmWorkPackage.getName(), s4WorkPackage.getWorkPackageName()),
          () -> assertEquals(rmWorkPackage.getProjectId(), s4WorkPackage.getProjectID()),
          () -> assertEquals(rmWorkPackage.getStartDate(), s4WorkPackage.getWPStartDate().toLocalDate()),
          () -> assertEquals(rmWorkPackage.getEndDate(), s4WorkPackage.getWPEndDate().toLocalDate()));

    }

    /** If transformation throws exception, it is handled appropriatelty */
    @Test
    @DisplayName("Validate if S4WorkPackage transformation throws exception is handled")
    public void FailedToTransformThrowsServiceException() {

      s4WorkPackage.setProjectID("PRJ-001");
      ServiceException serviceException = new ServiceException("Failed to transform S4WorkPackage");

      TransformS4ProjectToRM spyTransformS4ProjectToRM = Mockito.spy(cut);
      Mockito.doThrow(serviceException).when(spyTransformS4ProjectToRM).transformWorkPackage(s4WorkPackage);
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyTransformS4ProjectToRM.transformWorkPackage(s4WorkPackage));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

  }

  @Nested
  @DisplayName("Transform S4Demand to RM Demand")
  class TransformS4Demand {

    private EngmntProjRsceDmnd s4Demand = new EngmntProjRsceDmnd();
    private WorkItem s4WorkItem1 = new WorkItem();
    private WorkItem s4WorkItem2 = new WorkItem();
    private List<WorkItem> s4WorkItems = new ArrayList<>();

    @BeforeEach
    public void setS4Demand() {

      s4Demand.setResourceDemand("Demand1");
      s4Demand.setQuantity(BigDecimal.TEN);
      s4Demand.setUnitOfMeasure("duration-hour");
      s4Demand.setEngagementProjectResource("T001");
      s4Demand.setBillingControlCategory("");
      s4Demand.setWorkPackage("PRJ-001.1.1");
      s4Demand.setWorkItem("USR01");
      s4Demand.setDeliveryOrganization("ORG_IN");
    }

    @BeforeEach
    public void setWorkItems() {

      s4WorkItem1.setWorkitem("TEST");
      s4WorkItem1.setWorkitemname("MyWorkItem1");
      s4WorkItems.add(s4WorkItem1);
      s4WorkItem2.setWorkitem("USR01");
      s4WorkItem2.setWorkitemname("MyWorkItem2");
      s4WorkItems.add(s4WorkItem2);

    }

    /** Check the S4Demand are transformed to RM Demand successfully */
    @Test
    @DisplayName("Validate the S4Demand is transformed to RM Demand sucessfully")
    public void validateS4DemandTransformedSuccessfully() {

      doReturn(1L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("ORG_IN");

      com.sap.resourcemanagement.project.Demands rmDemand = cut.transformDemand(s4Demand, LocalDate.of(2020, 01, 01),
          LocalDate.of(2020, 12, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems);
      verify(mockMasterDataReplication, times(1)).createBillingIfNotPresent(s4Demand.getEngagementProjectResource());
      verify(mockDeliveryOrganizationRepository, times(1)).checkIfDeliveryOrganizationExists("ORG_IN");
      assertAll(() -> assertEquals(rmDemand.getExternalID(), s4Demand.getResourceDemand()),
          () -> assertEquals(rmDemand.getRequestedQuantity(), s4Demand.getQuantity()),
          () -> assertEquals(rmDemand.getRequestedUoM(), s4Demand.getUnitOfMeasure()),
          () -> assertEquals(rmDemand.getBillingRoleId(), s4Demand.getEngagementProjectResource()),
          () -> assertEquals(rmDemand.getWorkPackageId(), s4Demand.getWorkPackage()),
          () -> assertEquals(rmDemand.getWorkItem(), s4Demand.getWorkItem()),
          () -> assertEquals(rmDemand.getWorkItemName(), "MyWorkItem2"),
          () -> assertEquals(rmDemand.getStartDate(), LocalDate.of(2020, 01, 01)),
          () -> assertEquals(rmDemand.getEndDate(), LocalDate.of(2020, 12, 30)),
          () -> assertEquals("BIL", rmDemand.getBillingCategoryId()),
          () -> assertEquals(rmDemand.getDeliveryOrganizationCode(), s4Demand.getDeliveryOrganization()));

    }

    /**
     * if value of billing category non billable in source, then billing category is
     * set to NBL in RM system
     */
    @Test
    @DisplayName("Validate billing category is set to value NBL when the when billing category non billable")
    public void BillingCategoryIsSetToNONForNonBillable() {

      doReturn(1L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("ORG_IN");

      s4Demand.setBillingControlCategory("NBL");
      com.sap.resourcemanagement.project.Demands rmDemand = cut.transformDemand(s4Demand, LocalDate.of(2020, 01, 01),
          LocalDate.of(2020, 12, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems);
      verify(mockMasterDataReplication, times(1)).createBillingIfNotPresent(s4Demand.getEngagementProjectResource());
      verify(mockDeliveryOrganizationRepository, times(1)).checkIfDeliveryOrganizationExists("ORG_IN");
      assertAll(() -> assertEquals(rmDemand.getExternalID(), s4Demand.getResourceDemand()),
          () -> assertEquals(rmDemand.getRequestedQuantity(), s4Demand.getQuantity()),
          () -> assertEquals(rmDemand.getRequestedUoM(), s4Demand.getUnitOfMeasure()),
          () -> assertEquals(rmDemand.getBillingRoleId(), s4Demand.getEngagementProjectResource()),
          () -> assertEquals(rmDemand.getWorkPackageId(), s4Demand.getWorkPackage()),
          () -> assertEquals(rmDemand.getStartDate(), LocalDate.of(2020, 01, 01)),
          () -> assertEquals(rmDemand.getEndDate(), LocalDate.of(2020, 12, 30)),
          () -> assertEquals("NBL", rmDemand.getBillingCategoryId()),
          () -> assertEquals(rmDemand.getDeliveryOrganizationCode(), s4Demand.getDeliveryOrganization()));

    }

    @Test
    @DisplayName("Validate billing category is set to value NBL when the when project category is internal")
    public void billingCategoryIsSetToNONForInternalProject() {

      doReturn(1L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("ORG_IN");
      com.sap.resourcemanagement.project.Demands rmDemand = cut.transformDemand(s4Demand, LocalDate.of(2020, 01, 01),
          LocalDate.of(2020, 12, 30), Constants.PROJECT_TYPE_INTERNAL, s4WorkItems);
      verify(mockMasterDataReplication, times(1)).createBillingIfNotPresent(s4Demand.getEngagementProjectResource());
      verify(mockDeliveryOrganizationRepository, times(1)).checkIfDeliveryOrganizationExists("ORG_IN");
      assertAll(() -> assertEquals(rmDemand.getExternalID(), s4Demand.getResourceDemand()),
          () -> assertEquals(rmDemand.getRequestedQuantity(), s4Demand.getQuantity()),
          () -> assertEquals(rmDemand.getRequestedUoM(), s4Demand.getUnitOfMeasure()),
          () -> assertEquals(rmDemand.getBillingRoleId(), s4Demand.getEngagementProjectResource()),
          () -> assertEquals(rmDemand.getWorkPackageId(), s4Demand.getWorkPackage()),
          () -> assertEquals(rmDemand.getStartDate(), LocalDate.of(2020, 01, 01)),
          () -> assertEquals(rmDemand.getEndDate(), LocalDate.of(2020, 12, 30)),
          () -> assertEquals("NBL", rmDemand.getBillingCategoryId()),
          () -> assertEquals(rmDemand.getDeliveryOrganizationCode(), s4Demand.getDeliveryOrganization()));

    }

    @Test
    @DisplayName("Validate delivery organization is set to empty when the S4 delivery organization does not exist on RM")
    public void deliveryOrganizationIsSetToEmptyIfNotExists() {

      doReturn(0L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("ORG_IN");
      com.sap.resourcemanagement.project.Demands rmDemand = cut.transformDemand(s4Demand, LocalDate.of(2020, 01, 01),
          LocalDate.of(2020, 12, 30), Constants.PROJECT_TYPE_INTERNAL, s4WorkItems);
      verify(mockMasterDataReplication, times(1)).createBillingIfNotPresent(s4Demand.getEngagementProjectResource());
      verify(mockDeliveryOrganizationRepository, times(1)).checkIfDeliveryOrganizationExists("ORG_IN");
      assertAll(() -> assertEquals(rmDemand.getExternalID(), s4Demand.getResourceDemand()),
          () -> assertEquals(rmDemand.getRequestedQuantity(), s4Demand.getQuantity()),
          () -> assertEquals(rmDemand.getRequestedUoM(), s4Demand.getUnitOfMeasure()),
          () -> assertEquals(rmDemand.getBillingRoleId(), s4Demand.getEngagementProjectResource()),
          () -> assertEquals(rmDemand.getWorkPackageId(), s4Demand.getWorkPackage()),
          () -> assertEquals(rmDemand.getStartDate(), LocalDate.of(2020, 01, 01)),
          () -> assertEquals(rmDemand.getEndDate(), LocalDate.of(2020, 12, 30)),
          () -> assertEquals("NBL", rmDemand.getBillingCategoryId()),
          () -> assertEquals(rmDemand.getDeliveryOrganizationCode(), ""));

    }

    /** If transformation throws exception, it is handled appropriatelty */
    @Test
    @DisplayName("Validate if S4Demand transformation throws exception is handled")
    public void FailedToTransformThrowsServiceException() {

      doReturn(1L).when(mockDeliveryOrganizationRepository).checkIfDeliveryOrganizationExists("ORG_IN");
      s4Demand.setWorkPackage("PRJ-001.1.1");
      ServiceException serviceException = new ServiceException("Failed to transfor S4Demand");

      TransformS4ProjectToRM spyTransformS4ProjectToRM = Mockito.spy(cut);
      Mockito.doThrow(serviceException).when(spyTransformS4ProjectToRM).transformDemand(s4Demand,
          LocalDate.of(2020, 01, 01), LocalDate.of(2020, 12, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems);
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyTransformS4ProjectToRM.transformDemand(s4Demand, LocalDate.of(2020, 01, 01),
              LocalDate.of(2020, 12, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

  }

  @Nested
  @DisplayName("Transform S4Demand distribution to RM Demand requireirements")
  class TransformS4DemandDestribution {

    private EngmntProjRsceDmndDistr s4DemandDistribution = new EngmntProjRsceDmndDistr();

    @BeforeEach
    public void setS4DemandDistribution() {
      s4DemandDistribution.setQuantity(BigDecimal.TEN);
      s4DemandDistribution.setUnitOfMeasure("duration-hour");
      s4DemandDistribution.setCalendarMonth("1");
      s4DemandDistribution.setCalendarYear("2020");
    }

    /** S4Demand transferred successuflly to RM Demand */
    @Test
    @DisplayName("Validate the S4Demand distribution is transformed to RM Demand distribution object sucessfully")
    public void validateS4DemandTransformedSuccessfully() {

      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      Mockito.doReturn(LocalDate.of(2020, 1, 1)).when(spyTransformation).getFirstDateOfMonth("1", "2020");
      Mockito.doReturn(LocalDate.of(2020, 1, 30)).when(spyTransformation).getLastDateOfMonth("1", "2020");

      com.sap.resourcemanagement.project.DemandCapacityRequirements rmDemandCapacityRequirements = spyTransformation
          .transformDemandDistribution(s4DemandDistribution, "Demand1");

      assertAll(
          () -> assertEquals(rmDemandCapacityRequirements.getRequestedQuantity(), s4DemandDistribution.getQuantity()),
          () -> assertEquals(rmDemandCapacityRequirements.getRequestedUoM(), s4DemandDistribution.getUnitOfMeasure()),
          () -> assertEquals("Demand1", rmDemandCapacityRequirements.getDemandId()),
          () -> assertEquals(rmDemandCapacityRequirements.getStartDate(), LocalDate.of(2020, 1, 1)),
          () -> assertEquals(rmDemandCapacityRequirements.getEndDate(), LocalDate.of(2020, 1, 30)),
          () -> assertEquals("Demand1", rmDemandCapacityRequirements.getDemandId()));

    }

    /** If transformation throws exception, it is handled appropriatelty */
    @Test
    @DisplayName("Validate if S4Demand distribution transformation throws exception is handled")
    public void FailedToTransformThrowsServiceException() {

      s4DemandDistribution.setResourceDemand("1001");
      ServiceException serviceException = new ServiceException("Failed to transform S4Demand distribution");

      TransformS4ProjectToRM spyTransformS4ProjectToRM = Mockito.spy(cut);
      Mockito.doThrow(serviceException).when(spyTransformS4ProjectToRM)
          .transformDemandDistribution(s4DemandDistribution, "Demand1");
      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyTransformS4ProjectToRM.transformDemandDistribution(s4DemandDistribution, "Demand1"));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

  }

  @Nested
  @DisplayName("Validate conversion of the start date from fiscal period and year")
  class ValidateStartDateConversion {

    @Test
    @DisplayName("Validate conversion of the start date from fiscal period and year")
    public void validateStartDateConversion() {
      assertEquals(cut.getFirstDateOfMonth("01", "2020"), LocalDate.of(2020, 1, 1));
    }

  }

  @Nested
  @DisplayName("Validate conversion of the end date from fiscal period and year")
  class ValidateEndDateConversion {

    @Test
    @DisplayName("Validate conversion of the end date from fiscal period and year")
    public void validateEndDateConversion() {
      assertEquals(cut.getLastDateOfMonth("1", "2020"), LocalDate.of(2020, 1, 31));

    }

  }

  @Nested
  @DisplayName("Transform S4Demand hierarchy to RM Demand hierarchy")
  class TransformS4DemandHierarchy {

    private EngmntProjRsceDmnd s4DemandHier = new EngmntProjRsceDmnd();
    private EngmntProjRsceDmndDistr s4DemandDistribution;
    private WorkItem s4WorkItem1 = new WorkItem();
    private WorkItem s4WorkItem2 = new WorkItem();
    private List<WorkItem> s4WorkItems = new ArrayList<>();

    private com.sap.resourcemanagement.project.Demands rmDemand;
    private com.sap.resourcemanagement.project.DemandCapacityRequirements rmDemandDistribution;

    @BeforeEach
    public void setWorkItems() {

      s4WorkItem1.setWorkitem("TEST");
      s4WorkItem1.setWorkitemname("MyWorkItem1");
      s4WorkItems.add(s4WorkItem1);
      s4WorkItem2.setWorkitem("USR01");
      s4WorkItem2.setWorkitemname("MyWorkItem2");
      s4WorkItems.add(s4WorkItem2);

    }

    /**
     * Validate S4 demand with active plan version having two distribution items
     * gets transformed to RM demand sucessfully
     */
    @Test
    @DisplayName("Validate the S4Demand hierarchy is transformed to RM Demand hierarchy successfully")
    public void validateS4DemandHierarchyTransformedSuccessfully() {

      s4DemandHier.setResourceDemand("Demand1");
      s4DemandHier.setVersion("1");

      s4DemandDistribution = new EngmntProjRsceDmndDistr();
      s4DemandHier.addResourceDemandDistribution(s4DemandDistribution);

      s4DemandDistribution = new EngmntProjRsceDmndDistr();
      s4DemandHier.addResourceDemandDistribution(s4DemandDistribution);

      rmDemand = com.sap.resourcemanagement.project.Demands.create();
      final String demandId = UUID.randomUUID().toString();
      rmDemand.setId(demandId);
      rmDemandDistribution = com.sap.resourcemanagement.project.DemandCapacityRequirements.create();

      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      Mockito.doReturn(rmDemand).when(spyTransformation).transformDemand(s4DemandHier, LocalDate.of(2020, 1, 1),
          LocalDate.of(2020, 3, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems);
      Mockito.doReturn(rmDemandDistribution).when(spyTransformation).transformDemandDistribution(
          s4DemandHier.getResourceDemandDistributionIfPresent().get().get(0), rmDemand.getId());
      Mockito.doReturn(rmDemandDistribution).when(spyTransformation).transformDemandDistribution(
          s4DemandHier.getResourceDemandDistributionIfPresent().get().get(1), rmDemand.getId());
      com.sap.resourcemanagement.project.Demands rmDemandHier = spyTransformation.transformDemandAndDistribution(
          s4DemandHier, LocalDate.of(2020, 1, 1), LocalDate.of(2020, 3, 30), Constants.PROJECT_TYPE_CUSTOMER,
          s4WorkItems);
      assertAll(() -> assertNotNull(rmDemandHier),
          () -> assertEquals(2, rmDemandHier.getDemandCapacityRequirements().size()));

    }

    /**
     * Validate S4 demand plan version != 1 having two distribution items are not
     * transformmed to RM demand
     */
    @Test
    @DisplayName("Validate the S4Demand with plan version != 1 does not get transformed")
    public void DoNotReplicateDemandHavingIrrelevantVersion() {

      s4DemandHier.setResourceDemand("Demand1");
      s4DemandHier.setVersion("2");

      s4DemandDistribution = new EngmntProjRsceDmndDistr();
      s4DemandHier.addResourceDemandDistribution(s4DemandDistribution);

      s4DemandDistribution = new EngmntProjRsceDmndDistr();
      s4DemandHier.addResourceDemandDistribution(s4DemandDistribution);

      rmDemand = com.sap.resourcemanagement.project.Demands.create();
      final String demandId = UUID.randomUUID().toString();
      rmDemand.setId(demandId);
      rmDemandDistribution = com.sap.resourcemanagement.project.DemandCapacityRequirements.create();

      com.sap.resourcemanagement.project.Demands rmDemandHier = cut.transformDemandAndDistribution(s4DemandHier,
          LocalDate.of(2020, 1, 1), LocalDate.of(2020, 3, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems);
      assertNull(rmDemandHier);
    }

    /** If transformation throws exception, it is handled appropriatelty */
    @Test
    @DisplayName("Validate the S4DemandHierarchy transformation throws exception")
    public void TransformS4DemandHieThrowsServiceException() {

      s4DemandHier.setVersion("1");

      ServiceException serviceException = new ServiceException("Failed to transfor S4Demand");
      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      Mockito.doThrow(serviceException).when(spyTransformation).transformDemand(s4DemandHier, LocalDate.of(2020, 1, 1),
          LocalDate.of(2020, 3, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyTransformation.transformDemandAndDistribution(s4DemandHier, LocalDate.of(2020, 1, 1),
              LocalDate.of(2020, 3, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

    /**
     * Raised OData exception is handled and corresponding service exception raised
     */
    @Test
    @DisplayName("Validate raised OData exception is handled and corresponding service exception raised")
    public void whenODataExceptionRaisedInTransformS4DemandHier() {

      s4DemandHier.setResourceDemand("Demand1");
      s4DemandHier.setVersion("1");

      rmDemand = com.sap.resourcemanagement.project.Demands.create();
      final String demandId = UUID.randomUUID().toString();
      rmDemand.setId(demandId);
      rmDemandDistribution = com.sap.resourcemanagement.project.DemandCapacityRequirements.create();

      ServiceException e = new ServiceException("Transform failed due to ODataException for demand {} ",
          s4DemandHier.getResourceDemand());
      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      doReturn(rmDemand).when(spyTransformation).transformDemand(s4DemandHier, LocalDate.of(2020, 1, 1),
          LocalDate.of(2020, 3, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyTransformation.transformDemandAndDistribution(s4DemandHier, LocalDate.of(2020, 1, 1),
              LocalDate.of(2020, 3, 30), Constants.PROJECT_TYPE_CUSTOMER, s4WorkItems));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Transform S4Project hierarchy to RM Project hierarchy")
  class TransformS4ProjectHierarchy {

    private Project s4Project = new Project();
    private WorkPackage s4WorkPackage;
    private WorkItem s4WorkItem;

    private EngmntProjRsceDmnd s4Demand;
    private EngmntProjRsceDmndDistr s4DemandDistribution;

    private com.sap.resourcemanagement.project.Projects rmProject;
    private com.sap.resourcemanagement.project.WorkPackages rmWorkPackage;
    private com.sap.resourcemanagement.project.Demands rmDemand;
    private ResourceRequests resourceRequest;

    /**
     * Validate S4 Project with structure {P1-->W1-->D1,D2} having demand with
     * active plan version gets transformed to RM Project sucessfully
     */

    @Test
    @DisplayName("Validate the S4Project hierarchy is transformed to RM Project hierarchy successfully")
    public void validateS4ProjectHierarchyTransformedSuccessfully() {
      String projectId = "PRJ-001";
      s4Project.setProjectID(projectId);

      s4WorkPackage = new WorkPackage();
      s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
      s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

      List<WorkItem> s4WorkItems = new ArrayList<>();

      s4WorkItem = new WorkItem();
      s4WorkItem.setWorkitem("USR01");
      s4WorkItem.setWorkitemname("TEST01");
      s4WorkItems.add(s4WorkItem);
      s4WorkPackage.setWorkItemSet(s4WorkItems);

      s4Demand = new EngmntProjRsceDmnd();
      s4Demand.setVersion("1");
      s4WorkPackage.addResourceDemand(s4Demand);

      s4Demand = new EngmntProjRsceDmnd();
      s4Demand.setVersion("1");
      s4WorkPackage.addResourceDemand(s4Demand);

      s4Project.addWorkPackageSet(s4WorkPackage);

      rmProject = com.sap.resourcemanagement.project.Projects.create();
      rmWorkPackage = com.sap.resourcemanagement.project.WorkPackages.create();
      rmWorkPackage.setProjectId(projectId);
      rmDemand = com.sap.resourcemanagement.project.Demands.create();
      resourceRequest = ResourceRequests.create();

      final String demandId = UUID.randomUUID().toString();
      rmDemand.setId(demandId);

      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      Mockito.doReturn(rmProject).when(spyTransformation).transformProject(s4Project);
      Mockito.doReturn(rmWorkPackage).when(spyTransformation).transformWorkPackage(s4WorkPackage);
      Mockito.doReturn(rmDemand).when(spyTransformation).transformDemandAndDistribution(
          s4WorkPackage.getResourceDemandIfPresent().get().get(0), s4WorkPackage.getWPStartDate().toLocalDate(),
          s4WorkPackage.getWPEndDate().toLocalDate(), s4Project.getProjectCategory(), s4WorkItems);
      Mockito.doReturn(rmDemand).when(spyTransformation).transformDemandAndDistribution(
          s4WorkPackage.getResourceDemandIfPresent().get().get(1), s4WorkPackage.getWPStartDate().toLocalDate(),
          s4WorkPackage.getWPEndDate().toLocalDate(), s4Project.getProjectCategory(), s4WorkItems);

      when(mocktransformDemandToResourceRequest.transformDemandToRequest(rmDemand, projectId, rmWorkPackage.getName(),
          false)).thenReturn(resourceRequest);

      Map<String, List<CdsData>> transformedObjects = spyTransformation.transformProjectHierarchy(s4Project, false);

      List<CdsData> projects = transformedObjects.get("Project");
      List<CdsData> demands = transformedObjects.get("Demand");
      List<CdsData> resourceRequests = transformedObjects.get("ResourceRequest");

      assertAll(() -> assertEquals(1, projects.size()), () -> assertEquals(2, demands.size()),
          () -> assertEquals(2, resourceRequests.size()));

    }

    /**
     * Validate S4 Project with structure {P1-->W1-->D1[PV =1],D2[PV=2]} having
     * demand with mentiond version gets transformed to RM Project sucessfully
     */
    @Test
    @DisplayName("Validate the S4Project hierarchy is transformed to RM Project hierarchy successfully")
    public void validateS4ProjectHierarchyTransformedWithValidVersionSuccessfully() {
      String projectId = "PRJ-001";
      s4Project.setProjectID(projectId);

      s4WorkPackage = new WorkPackage();
      s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
      s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

      List<WorkItem> s4WorkItems = new ArrayList<>();
      s4WorkItem = new WorkItem();
      s4WorkItem.setWorkitem("USR01");
      s4WorkItem.setWorkitemname("TEST01");
      s4WorkItems.add(s4WorkItem);
      s4WorkPackage.setWorkItemSet(s4WorkItems);

      s4Demand = new EngmntProjRsceDmnd();
      s4Demand.setVersion("1");
      s4WorkPackage.addResourceDemand(s4Demand);

      s4Demand = new EngmntProjRsceDmnd();
      s4Demand.setVersion("2");
      s4WorkPackage.addResourceDemand(s4Demand);

      s4Project.addWorkPackageSet(s4WorkPackage);

      rmProject = com.sap.resourcemanagement.project.Projects.create();
      rmWorkPackage = com.sap.resourcemanagement.project.WorkPackages.create();
      rmWorkPackage.setProjectId(projectId);
      rmDemand = com.sap.resourcemanagement.project.Demands.create();

      final String demandId = UUID.randomUUID().toString();
      rmDemand.setId(demandId);

      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      Mockito.doReturn(rmProject).when(spyTransformation).transformProject(s4Project);
      Mockito.doReturn(rmWorkPackage).when(spyTransformation).transformWorkPackage(s4WorkPackage);
      Mockito.doReturn(rmDemand).when(spyTransformation).transformDemandAndDistribution(
          s4WorkPackage.getResourceDemandIfPresent().get().get(0), s4WorkPackage.getWPStartDate().toLocalDate(),
          s4WorkPackage.getWPEndDate().toLocalDate(), s4Project.getProjectCategory(), s4WorkItems);
      Mockito.doReturn(null).when(spyTransformation).transformDemandAndDistribution(
          s4WorkPackage.getResourceDemandIfPresent().get().get(1), s4WorkPackage.getWPStartDate().toLocalDate(),
          s4WorkPackage.getWPEndDate().toLocalDate(), s4Project.getProjectCategory(), s4WorkItems);

      when(mocktransformDemandToResourceRequest.transformDemandToRequest(rmDemand, projectId, rmWorkPackage.getName(),
          false)).thenReturn(resourceRequest);

      Map<String, List<CdsData>> transformedObjects = spyTransformation.transformProjectHierarchy(s4Project, false);

      List<CdsData> projects = transformedObjects.get("Project");
      List<CdsData> demands = transformedObjects.get("Demand");
      List<CdsData> resourceRequests = transformedObjects.get("ResourceRequest");

      assertAll(() -> assertEquals(1, projects.size()), () -> assertEquals(1, demands.size()),
          () -> assertEquals(1, resourceRequests.size()));

    }

    /**
     * Validate S4 Project having workpackage and no demands transformed
     * successfully
     */
    @Test
    @DisplayName("Validate the  S4 Project having workpackage and no demands transformed to RM Demand hierarchy successfully")
    public void validateS4ProjectHavingNoDemandTransformedSuccessfully() {

      List<EngmntProjRsceDmnd> demands = new ArrayList<>();
      String projectId = "PRJ-001";
      s4Project.setProjectID(projectId);
      s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
      s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

      s4WorkPackage = new WorkPackage();
      s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
      s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

      List<WorkItem> s4WorkItems = new ArrayList<>();
      s4WorkItem = new WorkItem();
      s4WorkItem.setWorkitem("USR01");
      s4WorkItem.setWorkitemname("TEST01");
      s4WorkItems.add(s4WorkItem);
      s4WorkPackage.setWorkItemSet(s4WorkItems);

      s4WorkPackage.setResourceDemand(demands);
      s4Project.addWorkPackageSet(s4WorkPackage);

      rmProject = com.sap.resourcemanagement.project.Projects.create();
      rmWorkPackage = com.sap.resourcemanagement.project.WorkPackages.create();
      rmWorkPackage.setProjectId(projectId);

      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      Mockito.doReturn(rmProject).when(spyTransformation).transformProject(s4Project);
      Mockito.doReturn(rmWorkPackage).when(spyTransformation).transformWorkPackage(s4WorkPackage);

      Map<String, List<CdsData>> transformedObjects = spyTransformation.transformProjectHierarchy(s4Project, false);

      List<CdsData> projects = transformedObjects.get("Project");

      assertEquals(1, projects.size());

    }

    /**
     * Raised OData exception is handled and corresponding service exception raised
     */
    @Test
    @DisplayName("Raised OData exception is handled and corresponding service exception raised")
    public void whenOdataExceptionRaisedInTransformS4ProjectHier() {

      List<EngmntProjRsceDmnd> demands = new ArrayList<>();
      String projectId = "PRJ-001";
      s4Project.setProjectID(projectId);
      s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
      s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

      ServiceException e = new ServiceException("Transform failed due to ODataException for project {} ", projectId);

      rmProject = com.sap.resourcemanagement.project.Projects.create();
      rmWorkPackage = com.sap.resourcemanagement.project.WorkPackages.create();
      rmWorkPackage.setProjectId(projectId);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.transformProjectHierarchy(s4Project, false));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

    /**
     * Validate S4 Project transformation throws Service exception
     */
    @Test
    @DisplayName("Validate S4 Project transformation throws Service exception")
    public void whenServiceExceptionRaisedInTransformS4ProjectHier() {

      List<EngmntProjRsceDmnd> demands = new ArrayList<>();
      String projectId = "PRJ-001";
      s4Project.setProjectID(projectId);
      s4Project.setStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
      s4Project.setEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

      s4WorkPackage = new WorkPackage();
      s4WorkPackage.setWPStartDate(LocalDateTime.of(2020, 1, 1, 00, 00, 00));
      s4WorkPackage.setWPEndDate(LocalDateTime.of(2020, 12, 30, 00, 00, 00));

      s4WorkPackage.setResourceDemand(demands);
      s4Project.addWorkPackageSet(s4WorkPackage);

      rmProject = com.sap.resourcemanagement.project.Projects.create();
      rmWorkPackage = com.sap.resourcemanagement.project.WorkPackages.create();
      rmWorkPackage.setProjectId(projectId);

      ServiceException e = new ServiceException("Failed to transform S4Project");

      TransformS4ProjectToRM spyTransformation = Mockito.spy(cut);

      doThrow(e).when(spyTransformation).transformProject(s4Project);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> spyTransformation.transformProjectHierarchy(s4Project, false));
      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

}
