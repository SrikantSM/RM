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

import com.sap.cds.CdsData;
import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.impl.RowImpl;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.project.BillingRoles;
import com.sap.resourcemanagement.project.Demands;

public class DemandRepositoryTest {

  private PersistenceService mockPersistenceService;

  private DemandRepository cut;

  private List<Demands> demandList;

  private Iterator<Row> mockIterator;

  private Row mockRow;

  private Demands demand;

  private String demandID;

  private BillingRoles billingRole;

  private Map<String, String> demandMap;

  @BeforeEach
  public void setUp() {

    demandList = new ArrayList<>();

    demand = Demands.create();

    demandID = "demand1";
    demandMap = new HashMap<>();
    demandMap.put(Demands.ID, demandID);
    demand.putAll(demandMap);
    mockRow = RowImpl.row(demand);

    mockPersistenceService = mock(PersistenceService.class);

    mockIterator = mock(Iterator.class);

    cut = new DemandRepository(mockPersistenceService);

  }

  @Nested
  @DisplayName("Unit tests for Upsert Demands")
  public class UpsertDemandsTest {

    private List<CdsData> demands = new ArrayList();

    @Test
    @DisplayName("Test for upsert demands success scenario")
    public void successfulupsertDemandsTest() {

      cut.upsertDemands(demands);
      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    @Test
    @DisplayName("Validate if UpsertDemands throws Service Exception")
    public void failedUpsertDemandsThrowServiceExceptionTest() {

      ServiceException e = new ServiceException("Failed in upsertDemands {}", demands);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.upsertDemands(demands));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for Delete Demand")
  public class DeleteDemandTest {

    @Test
    @DisplayName("Test for delete demand success scenario")
    public void successfuldeleteDemandTest() {

      demand = Demands.create();
      cut.deleteDemand(demand);
      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Validate if DeleteDemand throws Service Exception")
    public void failedDeleteDemandThrowServiceExceptionTest() {

      demand = Demands.create();
      ServiceException e = new ServiceException("Failed in deleteDemand {}", demand);
      doThrow(e).when(mockPersistenceService).run(any(CqnDelete.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.deleteDemand(demand));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for Upsert BillingRole")
  public class UpsertBillingRoleTest {

    @Test
    @DisplayName("Test for upsert billingRole success scenario")
    public void successfulupsertBillingRoleTest() {

      billingRole = BillingRoles.create();

      cut.upsertBillingRole(billingRole);
      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    @Test
    @DisplayName("Validate if UpsertBillingRole throws Service Exception")
    public void failedUpsertBillingRoleThrowServiceExceptionTest() {

      billingRole = BillingRoles.create();
      ServiceException e = new ServiceException("Failed in upsertBillingRole {}", billingRole);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.upsertBillingRole(billingRole));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for GetBillingRoleById")
  class GetBillingRoleByIdTest {

    @Test
    @DisplayName("Successful Scenario")
    public void successfulgetBillingRoleByIdTest() {

      String billingRoleId = "T001";

      final BillingRoles billingRole = Struct.create(BillingRoles.class);
      billingRole.setId("T001");
      billingRole.setName("BillingRoleName");

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 1);

      when(mockResult.single(any())).thenReturn(billingRole);

      final BillingRoles billingRoleExpected = cut.getBillingRoleById(billingRoleId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(billingRoleId, billingRoleExpected.getId());

    }

    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedGetBillingRoleById() {

      String billingRoleId = "1T001";

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 0);

      final BillingRoles billingRoleExpected = cut.getBillingRoleById(billingRoleId);

      assertEquals(null, billingRoleExpected);

    }

    @Test
    @DisplayName("Exception Scenario for GetBillingRoleById method")
    public void unsuccessfulGetBillingRoleById() {

      String billingRoleId = "1T001";

      ServiceException e = new ServiceException("Failed in getBillingRoleById {}", billingRoleId);

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.getBillingRoleById(billingRoleId));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for SelectDemandForWorkPackage")
  class SelectDemandForWorkPackageTest {

    @Test
    @DisplayName("Successful selectProjectTree Scenario")
    public void successfulSelectDemandForWorkPackageTest() {

      String workPackageID = "PRJ-0001.1.1";

      demandList.add(demand);

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.iterator()).thenReturn(mockIterator);
      when(mockIterator.hasNext()).thenReturn(Boolean.TRUE, Boolean.FALSE);
      when(mockIterator.next()).thenReturn(mockRow);

      List<Demands> demandsActualList = cut.selectDemandForWorkPackage(workPackageID);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

      assertEquals(demandList, demandsActualList);

    }

    @Test
    @DisplayName("Null return scenario")
    public void nullReturnedselectDemandForWorkPackageTest() {

      String workPackageID = "PRJ-0001.1.1";

      final Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      when(mockResult.rowCount()).thenReturn((long) 0);

      final List<Demands> DemandsExpected = cut.selectDemandForWorkPackage(workPackageID);

      assertEquals(Collections.emptyList(), DemandsExpected);

    }

    @Test
    @DisplayName("Exception Scenario for selectDemandForWorkPackage method")
    public void unsuccessfulselectDemandForWorkPackage() {

      String workPackageID = "PRJ-0001.1.1";

      ServiceException e = new ServiceException("Failed in selectDemandForWorkPackage {}", workPackageID);

      doThrow(e).when(mockPersistenceService).run(any(CqnSelect.class));

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.selectDemandForWorkPackage(workPackageID));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Unit tests for Upsert Demand")
  public class UpsertDemandTest {

    @Test
    @DisplayName("Test for upsert demand success scenario")
    public void successfulupsertDemandsTest() {

      Demands demand = Demands.create();
      cut.upsertDemands(demand);
      verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));

    }

    @Test
    @DisplayName("Validate if UpsertDemands throws Service Exception")
    public void failedUpsertDemandsThrowServiceExceptionTest() {
      Demands demand = Demands.create();
      ServiceException e = new ServiceException("Failed in upsertDemands {}", demand);
      doThrow(e).when(mockPersistenceService).run(any(CqnUpsert.class));

      final ServiceException exception = assertThrows(ServiceException.class, () -> cut.upsertDemands(demand));
      assertAll(() -> assertEquals(exception.getMessage(), e.getMessage()));

    }

  }

}
