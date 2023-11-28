package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.dao;

import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.config.ResourceOrganizationItems;
import com.sap.resourcemanagement.config.ResourceOrganizations;

public class ResourceOrganizationDAOImplTest {

    @Mock
    PersistenceService mockPersistenceService;

    /**
     * Class Under Test
     */
    ResourceOrganizationDAOImpl cut;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this).close();
        cut = new ResourceOrganizationDAOImpl(mockPersistenceService);
    }

    @Nested
    public class CheckGetResourceOrganizationForServiceOrganizationTest {

        @Test
        @DisplayName("Unit Test when result.rowCount() > 0")
        public void validateGetResourceOrganizationForServiceOrganization1() {
            ResourceOrganizationDAOImpl spyOfCut = Mockito.spy(cut);
            Result mockResult = mock(Result.class);
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            doReturn(mockResult).when(mockPersistenceService).run(any(CqnSelect.class));
            doReturn((long) 1).when(mockResult).rowCount();
            doReturn(mockResourceOrganization).when(mockResult).single(any());

            spyOfCut.getResourceOrganizationForServiceOrganization(anyString());

            verify(mockResult, times(1)).single(any());
            verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
        }

        @Test
        @DisplayName("Unit Test when result.rowCount() = 0")
        public void validateGetResourceOrganizationForServiceOrganization2() {
            ResourceOrganizationDAOImpl spyOfCut = Mockito.spy(cut);
            Result mockResult = mock(Result.class);
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            doReturn(mockResult).when(mockPersistenceService).run(any(CqnSelect.class));
            doReturn((long) 0).when(mockResult).rowCount();
            doReturn(mockResourceOrganization).when(mockResult).single(any());

            spyOfCut.getResourceOrganizationForServiceOrganization(anyString());

            verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));

        }

    }

    @Nested
    @DisplayName("Unit Tests for UpsertResourceOrg")
    public class CheckUpsertResourceOrganizations {

        @Test
        public void validateUpsertResourceOrganizations() {
            ResourceOrganizationDAOImpl spyOfCut = Mockito.spy(cut);
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);
            Result mockResult = mock(Result.class);
            doNothing().when(spyOfCut).deleteResourceOrganizations(any());
            doReturn(mockResult).when(mockPersistenceService).run(any(CqnInsert.class));

            spyOfCut.upsertResourceOrganizations(Arrays.asList(mockResourceOrganization));

            verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));
            verify(spyOfCut, times(1)).deleteResourceOrganizations(any());
        }

        @Test
        @DisplayName("Test to cover the else scenario")
        public void validateUpsertResourceOrganizations2() {
            ResourceOrganizationDAOImpl spyOfCut = Mockito.spy(cut);

            spyOfCut.upsertResourceOrganizations(new ArrayList<>());
        }
    }

    @Nested
    @DisplayName("Unit Tests for deleteResourceOrganizations")
    public class CheckDeleteResourceOrganizations {

        @Test
        public void validateDeleteResourceOrganizations() {
            ResourceOrganizationDAOImpl spyOfCut = Mockito.spy(cut);
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);
            Result mockResult = mock(Result.class);

            doNothing().when(spyOfCut).deleteResourceOrganizationItems(any());

            doReturn("displayId").when(mockResourceOrganization).getDisplayId();
            doReturn(mockResult).when(mockPersistenceService).run(any(CqnDelete.class), any(List.class));

            spyOfCut.deleteResourceOrganizations(Arrays.asList(mockResourceOrganization));

            verify(mockPersistenceService, times(1)).run(any(CqnDelete.class), any(List.class));
            verify(spyOfCut, times(1)).deleteResourceOrganizationItems(any());

        }
    }

    @Nested
    @DisplayName("Unit test for delete resource organization items")
    public class CheckDeleteResourceOrganizationItems {

        @Test
        public void validateDeleteResourceOrganizationItems() {

            ResourceOrganizationDAOImpl spyOfCut = Mockito.spy(cut);
            ResourceOrganizationItems mockResourceOrganizationItems = mock(ResourceOrganizationItems.class);
            Result mockResult = mock(Result.class);

            doReturn("1bc491bb-4d7b-434c-8d55-7f2726d9d4dd").when(mockResourceOrganizationItems)
                    .getResourceOrganizationId();
            doReturn(mockResult).when(mockPersistenceService).run(any(CqnDelete.class), any(List.class));

            spyOfCut.deleteResourceOrganizationItems(Arrays.asList(mockResourceOrganizationItems));

            verify(mockPersistenceService, times(1)).run(any(CqnDelete.class), any(List.class));

        }

    }

}
