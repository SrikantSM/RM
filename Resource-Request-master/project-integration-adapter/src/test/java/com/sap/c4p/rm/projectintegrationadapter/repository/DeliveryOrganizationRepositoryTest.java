package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

public class DeliveryOrganizationRepositoryTest {

  @Mock
  private PersistenceService mockPersistenceService;

  /**
   *
   * Class under Test
   *
   */

  private static DeliveryOrganizationRepository cut;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    cut = new DeliveryOrganizationRepository(mockPersistenceService);
  }

  @Test
  @DisplayName("Verify delivery organization count when it exists on RM")
  public void checkIfDeliveryOrganizationExists() {

    Result mockResult = mock(Result.class);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    doReturn((long) 1).when(mockResult).rowCount();
    final long rowCount = cut.checkIfDeliveryOrganizationExists("ORG_IN");
    assertEquals(rowCount, mockResult.rowCount());

  }

  @Test
  @DisplayName("Verify delivery organization count when it doesn't exist on RM")

  public void checkIfDeliveryOrganizationDoesNotExist() {

    Result mockResult = mock(Result.class);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    doReturn((long) 0).when(mockResult).rowCount();

    final long rowCount = cut.checkIfDeliveryOrganizationExists("ORG_IN");
    assertEquals(rowCount, mockResult.rowCount());

  }

}
