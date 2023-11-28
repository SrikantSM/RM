package com.sap.c4p.rm.resourcerequest.repository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.persistence.PersistenceService;

@DisplayName("Unit Test for SupplySync Repository")
public class SupplySyncRepositoryTest {

  private PersistenceService mockPersistenceService;
  private static SupplySyncRepository cut;

  @BeforeEach
  public void setUp() {

    mockPersistenceService = mock(PersistenceService.class);
    cut = new SupplySyncRepository(mockPersistenceService);

  }

  @Nested
  @DisplayName("Insert Demand into SupplySync")
  class InsertDemand {

    @Test
    @DisplayName("Check on insertion of demand id into SupplySync table")
    public void insertDemand() {

      String demand = "450a2453-ec0a-4a85-8247-94c39b9bdd67";

      cut.insertDemand(demand);

      verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));

    }
  }

  @Nested
  @DisplayName("Delete Demand from SupplySync")
  class DeleteDemand {

    @Test
    @DisplayName("Check on deletion of demand id from SupplySync table")
    public void deleteDemand() {

      String demand = "450a2453-ec0a-4a85-8247-94c39b9bdd67";

      cut.deleteDemand(demand);

      verify(mockPersistenceService, times(1)).run(any(CqnDelete.class));

    }
  }

}
