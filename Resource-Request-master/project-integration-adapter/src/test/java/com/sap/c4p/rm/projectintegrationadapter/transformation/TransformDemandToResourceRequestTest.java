package com.sap.c4p.rm.projectintegrationadapter.transformation;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.repository.IntegrationStatusRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ResourceOrganizationRespository;
import com.sap.c4p.rm.projectintegrationadapter.repository.WorkPackageRepository;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;
import com.sap.c4p.rm.projectintegrationadapter.util.DisplayIDGenerator;

import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

public class TransformDemandToResourceRequestTest {

  /*
   * Mock Objects
   */

  private static DisplayIDGenerator mockDisplayIdGenerator = mock(DisplayIDGenerator.class);
  private static WorkPackageRepository mockWorkPackagesRepository = mock(WorkPackageRepository.class);
  private static IntegrationStatusRepository integrationStatusRepository = mock(IntegrationStatusRepository.class);

  private static ResourceOrganizationRespository mockResourceOrganizationRespository = mock(
      ResourceOrganizationRespository.class);
  /*
   * Class under test
   *
   */
  private static TransformDemandToResourceRequest cut = new TransformDemandToResourceRequest(mockDisplayIdGenerator,
      mockWorkPackagesRepository, integrationStatusRepository, mockResourceOrganizationRespository);

  @Nested
  @DisplayName("Transform RM Demand to Resource Request in case of initial load ")
  class prepareResourceRequest {

    private Demands rmDemand;
    private String projectId;
    private String workPackageName;

    /** Check the rmDemand are transformed to RM Resource request */
    @Test
    @DisplayName("Validate the rmDemand is transformed Resource request successfully during initial load")
    public void validateDemandTransformedInInitialLoadSuccessfully() {

      rmDemand = Demands.create();
      projectId = "PRJ-001";
      workPackageName = "Development";

      rmDemand.setBillingCategoryId("BIL");
      rmDemand.setBillingRoleId("T001");
      rmDemand.setDeliveryOrganizationCode("ORG_IN");
      rmDemand.setExternalID("Demand1");
      rmDemand.setStartDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setEndDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setId(UUID.randomUUID().toString());
      rmDemand.setRequestedQuantity(BigDecimal.TEN);
      rmDemand.setRequestedUoM("duration-hour");
      rmDemand.setWorkPackageId("PRJ-001.1.1");

      final String displayID = "0000000001";
      when(mockDisplayIdGenerator.getDisplayId()).thenReturn(displayID);
      when(mockResourceOrganizationRespository.getResourceOrganizationForDeliveryOrganization("ORG_IN"))
          .thenReturn("ORG_IN");

      ResourceRequests request = cut.prepareResourceRequest(rmDemand, projectId, workPackageName, false);

      verify(integrationStatusRepository, times(0)).insertDemandInSupplySync(rmDemand.getId());

      assertAll(() -> assertEquals(request.getStartDate(), rmDemand.getStartDate()),
          () -> assertEquals(request.getEndDate(), rmDemand.getEndDate()),
          () -> assertEquals(request.getRequestedResourceOrgId(), rmDemand.getDeliveryOrganizationCode()),
          () -> assertEquals(request.getProcessingResourceOrgId(), rmDemand.getDeliveryOrganizationCode()),
          () -> assertEquals(request.getRequestedCapacity(), rmDemand.getRequestedQuantity()),
          () -> assertEquals(request.getRequestedUnit(), rmDemand.getRequestedUoM()),
          () -> assertEquals(request.getWorkpackageId(), rmDemand.getWorkPackageId()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(request.getProjectId(), projectId),
          () -> assertEquals(Constants.REQUEST_PRIORITY_MEDIUM, request.getPriorityCode()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(Constants.REQUEST_OPEN, request.getRequestStatusCode()),
          () -> assertEquals(Constants.REQUEST_WITHDRAW, request.getReleaseStatusCode()),
          () -> assertEquals(displayID, request.getDisplayId()), () -> assertEquals(true, request.getIsS4Cloud()),
          () -> assertEquals(workPackageName, request.getName()),
          () -> assertEquals(Constants.TOTAL_HOURS, request.getEffortDistributionTypeCode()));

    }

    /** Check the rmDemand are transformed to RM Resource request */
    @Test
    @DisplayName("Validate the rmDemand is transformed Resource request successfully during delta load")
    public void validateDemandTransformedInDeltaLoadSuccessfully() {

      rmDemand = Demands.create();
      projectId = "PRJ-001";
      workPackageName = "Development";

      rmDemand.setId("DemandId");
      rmDemand.setBillingCategoryId("BIL");
      rmDemand.setBillingRoleId("T001");
      rmDemand.setDeliveryOrganizationCode("ORG_IN");
      rmDemand.setExternalID("Demand1");
      rmDemand.setStartDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setEndDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setId(UUID.randomUUID().toString());
      rmDemand.setRequestedQuantity(BigDecimal.TEN);
      rmDemand.setRequestedUoM("duration-hour");
      rmDemand.setWorkPackageId("PRJ-001.1.1");

      final String displayID = "0000000001";
      when(mockDisplayIdGenerator.getDisplayId()).thenReturn(displayID);
      when(mockWorkPackagesRepository.getWorkPackageNameById(rmDemand.getWorkPackageId())).thenReturn(workPackageName);
      doNothing().when(integrationStatusRepository).insertDemandInSupplySync(rmDemand.getId());
      when(mockResourceOrganizationRespository.getResourceOrganizationForDeliveryOrganization("ORG_IN"))
          .thenReturn("ORG_IN");

      ResourceRequests request = cut.prepareResourceRequest(rmDemand, projectId, null, true);

      verify(integrationStatusRepository, times(1)).insertDemandInSupplySync(rmDemand.getId());

      assertAll(() -> assertEquals(request.getStartDate(), rmDemand.getStartDate()),
          () -> assertEquals(request.getEndDate(), rmDemand.getEndDate()),
          () -> assertEquals(request.getRequestedResourceOrgId(), rmDemand.getDeliveryOrganizationCode()),
          () -> assertEquals(request.getProcessingResourceOrgId(), rmDemand.getDeliveryOrganizationCode()),
          () -> assertEquals(request.getRequestedCapacity(), rmDemand.getRequestedQuantity()),
          () -> assertEquals(request.getRequestedUnit(), rmDemand.getRequestedUoM()),
          () -> assertEquals(request.getWorkpackageId(), rmDemand.getWorkPackageId()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(request.getProjectId(), projectId),
          () -> assertEquals(Constants.REQUEST_PRIORITY_MEDIUM, request.getPriorityCode()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(Constants.REQUEST_OPEN, request.getRequestStatusCode()),
          () -> assertEquals(Constants.REQUEST_PUBLISH, request.getReleaseStatusCode()),
          () -> assertEquals(displayID, request.getDisplayId()), () -> assertEquals(true, request.getIsS4Cloud()),
          () -> assertEquals(workPackageName, request.getName()),
          () -> assertEquals(Constants.TOTAL_HOURS, request.getEffortDistributionTypeCode()));

    }

    /** If transformation throws exception, it is handled appropriatelty */
    @Test
    @DisplayName("Validate demand transformation throws exception is handled")
    public void FailedToTransformThrowsServiceException() {

      rmDemand = Demands.create();
      rmDemand.setId(UUID.randomUUID().toString());
      projectId = "PRJ-001";
      ServiceException serviceException = new ServiceException("Transform demand to resource request failed {} ",
          rmDemand.getId());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.transformDemandToRequest(rmDemand, projectId, false));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

    /** Check the rmDemand with no empty delivery org is transformed */
    @Test
    @DisplayName("Validate the rmDemand is transformed Resource request successfully during delta load")
    public void validateDemandWithoutDelOrgTransformedInDeltaLoadSuccessfully() {

      rmDemand = Demands.create();
      projectId = "PRJ-001";
      workPackageName = "Development";

      rmDemand.setBillingCategoryId("BIL");
      rmDemand.setBillingRoleId("T001");
      rmDemand.setDeliveryOrganizationCode("");
      rmDemand.setExternalID("Demand1");
      rmDemand.setStartDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setEndDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setId(UUID.randomUUID().toString());
      rmDemand.setRequestedQuantity(BigDecimal.TEN);
      rmDemand.setRequestedUoM("duration-hour");
      rmDemand.setWorkPackageId("PRJ-001.1.1");

      final String displayID = "0000000001";
      when(mockDisplayIdGenerator.getDisplayId()).thenReturn(displayID);
      when(mockWorkPackagesRepository.getWorkPackageNameById(rmDemand.getWorkPackageId())).thenReturn(workPackageName);

      ResourceRequests request = cut.prepareResourceRequest(rmDemand, projectId, null, true);

      verify(integrationStatusRepository, times(0)).insertDemandInSupplySync(rmDemand.getId());

      assertAll(() -> assertEquals(request.getStartDate(), rmDemand.getStartDate()),
          () -> assertEquals(request.getEndDate(), rmDemand.getEndDate()),
          () -> assertEquals(request.getRequestedResourceOrgId(), null),
          () -> assertEquals(request.getProcessingResourceOrgId(), null),
          () -> assertEquals(request.getRequestedCapacity(), rmDemand.getRequestedQuantity()),
          () -> assertEquals(request.getRequestedUnit(), rmDemand.getRequestedUoM()),
          () -> assertEquals(request.getWorkpackageId(), rmDemand.getWorkPackageId()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(request.getProjectId(), projectId),
          () -> assertEquals(Constants.REQUEST_PRIORITY_MEDIUM, request.getPriorityCode()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(Constants.REQUEST_OPEN, request.getRequestStatusCode()),
          () -> assertEquals(Constants.REQUEST_WITHDRAW, request.getReleaseStatusCode()),
          () -> assertEquals(displayID, request.getDisplayId()), () -> assertEquals(true, request.getIsS4Cloud()),
          () -> assertEquals(workPackageName, request.getName()),
          () -> assertEquals(Constants.TOTAL_HOURS, request.getEffortDistributionTypeCode()));

    }

    /**
     * Validate the rmDemand with delivery org and empty resource org is transformed
     * to Resource request successfully during delta load
     */
    @Test
    @DisplayName("Validate the rmDemand with delivery org but empty resource org is transformed")
    public void validateDemandWithDelOrgEmptyResOrgTransformedInDeltaLoadSuccessfully() {

      rmDemand = Demands.create();
      projectId = "PRJ-001";
      workPackageName = "Development";

      rmDemand.setBillingCategoryId("BIL");
      rmDemand.setBillingRoleId("T001");
      rmDemand.setDeliveryOrganizationCode("ORG_IN");
      rmDemand.setExternalID("Demand1");
      rmDemand.setStartDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setEndDate((LocalDate.of(2020, 01, 01)));
      rmDemand.setId(UUID.randomUUID().toString());
      rmDemand.setRequestedQuantity(BigDecimal.TEN);
      rmDemand.setRequestedUoM("duration-hour");
      rmDemand.setWorkPackageId("PRJ-001.1.1");

      final String displayID = "0000000001";
      when(mockDisplayIdGenerator.getDisplayId()).thenReturn(displayID);
      when(mockWorkPackagesRepository.getWorkPackageNameById(rmDemand.getWorkPackageId())).thenReturn(workPackageName);
      when(mockResourceOrganizationRespository.getResourceOrganizationForDeliveryOrganization("ORG_IN"))
          .thenReturn(null);

      ResourceRequests request = cut.prepareResourceRequest(rmDemand, projectId, null, true);

      verify(integrationStatusRepository, times(0)).insertDemandInSupplySync(rmDemand.getId());

      assertAll(() -> assertEquals(request.getStartDate(), rmDemand.getStartDate()),
          () -> assertEquals(request.getEndDate(), rmDemand.getEndDate()),
          () -> assertEquals(request.getRequestedResourceOrgId(), null),
          () -> assertEquals(request.getProcessingResourceOrgId(), null),
          () -> assertEquals(request.getRequestedCapacity(), rmDemand.getRequestedQuantity()),
          () -> assertEquals(request.getRequestedUnit(), rmDemand.getRequestedUoM()),
          () -> assertEquals(request.getWorkpackageId(), rmDemand.getWorkPackageId()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(request.getProjectId(), projectId),
          () -> assertEquals(Constants.REQUEST_PRIORITY_MEDIUM, request.getPriorityCode()),
          () -> assertEquals(request.getDemandId(), rmDemand.getId()),
          () -> assertEquals(Constants.REQUEST_OPEN, request.getRequestStatusCode()),
          () -> assertEquals(Constants.REQUEST_WITHDRAW, request.getReleaseStatusCode()),
          () -> assertEquals(displayID, request.getDisplayId()), () -> assertEquals(true, request.getIsS4Cloud()),
          () -> assertEquals(workPackageName, request.getName()),
          () -> assertEquals(Constants.TOTAL_HOURS, request.getEffortDistributionTypeCode()));

    }

  }

  @Nested
  @DisplayName("Generate capacity requirement for the resource requirement")
  class GenerateCapacityRequirement {

    private ResourceRequests resourceRequest;

    /** Check the rmDemand are transformed to RM Resource request */
    @Test
    @DisplayName("Validate the generation of capacity requirement is successfull")
    public void validateCapcityRequirementGenerationSuccessfully() {

      resourceRequest = ResourceRequests.create();

      resourceRequest.setId(UUID.randomUUID().toString());
      resourceRequest.setRequestedResourceOrgId("ORG_IN");
      resourceRequest.setProcessingResourceOrgId("ORG_IN");
      resourceRequest.setStartDate((LocalDate.of(2020, 01, 01)));
      resourceRequest.setEndDate((LocalDate.of(2020, 01, 01)));
      resourceRequest.setRequestedCapacity(BigDecimal.TEN);
      resourceRequest.setRequestedCapacityInMinutes(400);
      resourceRequest.setRequestedUnit(Constants.UOM);

      CapacityRequirements capacityRequirements = cut.prepareCapacityFromResourceRequest(resourceRequest);

      assertAll(() -> assertEquals(capacityRequirements.getStartDate(), resourceRequest.getStartDate()),
          () -> assertEquals(capacityRequirements.getEndDate(), resourceRequest.getEndDate()),
          () -> assertEquals(capacityRequirements.getRequestedCapacityInMinutes(),
              resourceRequest.getRequestedCapacityInMinutes()),
          () -> assertEquals(capacityRequirements.getRequestedUnit(), resourceRequest.getRequestedUnit()),
          () -> assertEquals(capacityRequirements.getResourceRequestId(), resourceRequest.getId()),
          () -> assertEquals(capacityRequirements.getRequestedUnit(), resourceRequest.getRequestedUnit()));

    }

    /** If transformation throws exception, it is handled appropriatelty */
    @Test
    @DisplayName("Validate generation of capacity requiremnt throws exception is handled")
    public void FailedToGenerateCapacityRequirementThrowsServiceException() {

      resourceRequest = ResourceRequests.create();
      resourceRequest.setId(UUID.randomUUID().toString());

      ServiceException serviceException = new ServiceException("Create capcity requirement failed for request id {} ",
          resourceRequest.getId());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.prepareCapacityFromResourceRequest(resourceRequest));
      assertAll(() -> assertEquals(exception.getMessage(), serviceException.getMessage()));
    }

  }

}
