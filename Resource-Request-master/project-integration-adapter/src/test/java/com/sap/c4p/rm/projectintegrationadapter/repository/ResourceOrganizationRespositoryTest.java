package com.sap.c4p.rm.projectintegrationadapter.repository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.config.ResourceOrganizations;

class ResourceOrganizationRespositoryTest {

  @Mock
  private PersistenceService mockPersistenceService;

  /**
   *
   * Class under Test
   *
   */

  private static ResourceOrganizationRespository cut;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    cut = new ResourceOrganizationRespository(mockPersistenceService);
  }

  @Nested
  @DisplayName("Unit Tests for getting Resource Organization Display Id from Delivery Organization Code")
  class GetResourceOrganizationForDeliveryOrganization {

    @Test
    public void getResourceOrganizationTestWhenIdExists() {

      Result mockResult = mock(Result.class);
      ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      doReturn((long) 1).when(mockResult).rowCount();
      when(mockResult.single(ResourceOrganizations.class)).thenReturn(mockResourceOrganization);
      when(mockResourceOrganization.getDisplayId()).thenReturn("");

      cut.getResourceOrganizationForDeliveryOrganization("TestString");

      verify(mockResult, times(1)).single(ResourceOrganizations.class);
      verify(mockResourceOrganization, times(1)).getDisplayId();
    }

    @Test
    public void getResourceOrganizationTestWhenIdNotExists() {

      Result mockResult = mock(Result.class);
      ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      doReturn((long) 0).when(mockResult).rowCount();

      cut.getResourceOrganizationForDeliveryOrganization("TestString");

      verify(mockResult, never()).single(ResourceOrganizations.class);
      verify(mockResourceOrganization, never()).getDisplayId();
    }
  }

}
