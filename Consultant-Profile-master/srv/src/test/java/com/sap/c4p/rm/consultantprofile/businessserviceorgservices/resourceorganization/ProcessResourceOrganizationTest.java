package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization;

import static org.mockito.Mockito.*;

import java.util.*;

import com.sap.resourcemanagement.config.ResourceOrganizationItems;
import org.junit.jupiter.api.*;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.dao.ResourceOrganizationDAO;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.utils.ResOrgDisplayIDGenerator;

import com.sap.resourcemanagement.config.ResourceOrganizations;
import com.sap.resourcemanagement.organization.Details;
import com.sap.resourcemanagement.organization.Headers;

public class ProcessResourceOrganizationTest {

    @Mock
    private ResOrgDisplayIDGenerator mockResOrgDisplayIDGenerator;

    @Mock
    private ResourceOrganizationDAO mockResourceOrganizationDAO;

    @Mock
    private ResourceOrganizations mockExistingResourceOrg;
    /**
     * Class Under Test
     */
    ProcessResourceOrganization cut;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this).close();
        cut = new ProcessResourceOrganization(mockResOrgDisplayIDGenerator, mockResourceOrganizationDAO);
    }

    @Nested
    public class CheckProcessServiceOrganizationToResourceOrganization {

        @Test
        public void validateProcessServiceOrganizationToResourceOrganization() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Headers mockHeaders = Headers.create();
            Details mockDetails = Details.create();
            mockDetails.setCode("code");
            mockHeaders.setCode("code");
            mockHeaders.setIsDelivery("X");
            mockDetails.setUnitType( "CS");
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            Set<Headers> mockHeadersSet = new HashSet<>();
            Set<Details> mockDetailsSet = new HashSet<>();
            mockHeadersSet.add(mockHeaders);
            mockDetailsSet.add(mockDetails);

            doNothing().when(mockResourceOrganizationDAO).upsertResourceOrganizations(anyList());
            doReturn(mockResourceOrganization).when(spyOfCut).prepareResourceOrgPayload(any(), any());

            spyOfCut.processServiceOrganizationToResourceOrganization(mockHeadersSet, mockDetailsSet);

            verify(mockResourceOrganizationDAO, times(1)).upsertResourceOrganizations(anyList());
            verify(spyOfCut, times(1)).prepareResourceOrgPayload(any(), any());
        }

        @Test
        public void validateProcessServiceOrganizationToResourceOrganization2() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Headers mockHeaders = Headers.create();
            Details mockDetails = Details.create();
            mockDetails.setCode("code");
            mockHeaders.setCode("code1");
            mockHeaders.setIsDelivery("X");
            mockDetails.setUnitType("CS");
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            Set<Headers> mockHeadersSet = new HashSet<>();
            Set<Details> mockDetailsSet = new HashSet<>();
            mockHeadersSet.add(mockHeaders);
            mockDetailsSet.add(mockDetails);

            doNothing().when(mockResourceOrganizationDAO).upsertResourceOrganizations(anyList());
            doReturn(mockResourceOrganization).when(spyOfCut).prepareResourceOrgPayload(any(), any());

            spyOfCut.processServiceOrganizationToResourceOrganization(mockHeadersSet, mockDetailsSet);

            verify(mockResourceOrganizationDAO, times(1)).upsertResourceOrganizations(anyList());
            verify(spyOfCut, times(1)).prepareResourceOrgPayload(any(), any());
        }

        @Test
        public void validateProcessServiceOrganizationToResourceOrganization3() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Headers mockHeaders = Headers.create();
            Details mockDetails = Details.create();
            mockDetails.setCode("code");
            mockHeaders.setCode("code");
            mockHeaders.setIsDelivery("X");
            mockDetails.setUnitType("CC");
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            Set<Headers> mockHeadersSet = new HashSet<>();
            Set<Details> mockDetailsSet = new HashSet<>();
            mockHeadersSet.add(mockHeaders);
            mockDetailsSet.add(mockDetails);

            doNothing().when(mockResourceOrganizationDAO).upsertResourceOrganizations(anyList());
            doReturn(mockResourceOrganization).when(spyOfCut).prepareResourceOrgPayload(any(), any());

            spyOfCut.processServiceOrganizationToResourceOrganization(mockHeadersSet, mockDetailsSet);

            verify(mockResourceOrganizationDAO, times(1)).upsertResourceOrganizations(anyList());
            verify(spyOfCut, times(1)).prepareResourceOrgPayload(any(), any());
        }

        @Test
        public void validateResourceOrganizationNotCreatedIfDeliveryOrgFlagSetToEmptyString() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Headers mockHeaders = Headers.create();
            Details mockDetails = Details.create();
            mockDetails.setCode("code");
            mockHeaders.setCode("code");
            mockHeaders.setIsDelivery("");
            mockDetails.setUnitType("CC");
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            Set<Headers> mockHeadersSet = new HashSet<>();
            Set<Details> mockDetailsSet = new HashSet<>();
            mockHeadersSet.add(mockHeaders);
            mockDetailsSet.add(mockDetails);

            doNothing().when(mockResourceOrganizationDAO).upsertResourceOrganizations(anyList());
            doReturn(mockResourceOrganization).when(spyOfCut).prepareResourceOrgPayload(any(), any());

            spyOfCut.processServiceOrganizationToResourceOrganization(mockHeadersSet, mockDetailsSet);

            verify(mockResourceOrganizationDAO, times(1)).upsertResourceOrganizations(anyList());
            verify(spyOfCut, times(0)).prepareResourceOrgPayload(any(), any());
        }

        @Test
        public void validateResourceOrganizationNotCreatedIfDeliveryOrgFlagSetToN() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Headers mockHeaders = Headers.create();
            Details mockDetails = Details.create();
            mockDetails.setCode("code");
            mockHeaders.setCode("code");
            mockHeaders.setIsDelivery("N");
            mockDetails.setUnitType("CS");
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            Set<Headers> mockHeadersSet = new HashSet<>();
            Set<Details> mockDetailsSet = new HashSet<>();
            mockHeadersSet.add(mockHeaders);
            mockDetailsSet.add(mockDetails);

            doNothing().when(mockResourceOrganizationDAO).upsertResourceOrganizations(anyList());
            doReturn(mockResourceOrganization).when(spyOfCut).prepareResourceOrgPayload(any(), any());

            spyOfCut.processServiceOrganizationToResourceOrganization(mockHeadersSet, mockDetailsSet);

            verify(mockResourceOrganizationDAO, times(1)).upsertResourceOrganizations(anyList());
            verify(spyOfCut, times(0)).prepareResourceOrgPayload(any(), any());
        }



    }

    @Nested
    public class CheckPrepareResourceOrgPayload {

        @Test
        public void validatePrepareResourceOrgPayloadWhenDetailsPresent() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Details mockDetails = Details.create();
            mockDetails.setUnitKey("UnitKey");
            Headers mockHeader = Headers.create();
            mockHeader.setCode("code");
            mockHeader.setDescription("Descr");

            doReturn("DisplayId").when(mockResOrgDisplayIDGenerator).getDisplayId();

            ResourceOrganizations resourceOrganization = spyOfCut.prepareResourceOrgPayload(mockHeader,
                    Arrays.asList(mockDetails));

            Assertions.assertEquals("Descr", resourceOrganization.getName());
            Assertions.assertEquals("Descr"+"("+"code"+")", resourceOrganization.getDescription());
            Assertions.assertEquals("Descr"+"("+"code"+")", resourceOrganization.getTexts().stream()
                .findFirst().get().getDescription());
            verify(mockResOrgDisplayIDGenerator, times(1)).getDisplayId();
        }

        @Test
        public void validatePrepareResourceOrgPayloadWhenDetailsNotPresent() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);

            Headers mockHeader = Headers.create();
            mockHeader.setCode("code");
            mockHeader.setDescription("Descr");

            doReturn("DisplayId").when(mockResOrgDisplayIDGenerator).getDisplayId();

            ResourceOrganizations resourceOrganization = spyOfCut.prepareResourceOrgPayload(mockHeader,
                    Arrays.asList());

            Assertions.assertEquals("Descr", resourceOrganization.getName());
            Assertions.assertEquals("Descr"+"("+"code"+")", resourceOrganization.getDescription());
            Assertions.assertEquals("Descr"+"("+"code"+")", resourceOrganization.getTexts().stream()
                .findFirst().get().getDescription());
            verify(mockResOrgDisplayIDGenerator, times(1)).getDisplayId();
        }

        @Test
        @DisplayName("Test when one cost center exists and a new one is uploaded")
        public void validateWhenSameCostCenterNotPresent() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Details mockDetails = Details.create();
            mockDetails.setUnitKey("10101903"); //Existing cost center which shouldn't be deleted
            Headers mockHeader = Headers.create();
            mockHeader.setCode("1010");
            mockHeader.setDescription("Resource Org DE");

            mockExistingResourceOrg.setId("1010");
            mockExistingResourceOrg.setDisplayId("Resource Org DE");
            ArrayList <ResourceOrganizationItems> resourceOrganizationItemsArrayList = new ArrayList<>();

            ResourceOrganizationItems resourceOrganizationItems = ResourceOrganizationItems.create();
            resourceOrganizationItems.setId("1010");
            resourceOrganizationItems.setCostCenterId("10101902");
            resourceOrganizationItemsArrayList.add(resourceOrganizationItems);

            doReturn(mockExistingResourceOrg).when(mockResourceOrganizationDAO).getResourceOrganizationForServiceOrganization(any());
            doReturn("DisplayId").when(mockResOrgDisplayIDGenerator).getDisplayId();
            doReturn(resourceOrganizationItemsArrayList).when(mockExistingResourceOrg).getItems();

            ResourceOrganizations resourceOrganization = spyOfCut.prepareResourceOrgPayload(mockHeader, List.of(mockDetails));

            verify(mockExistingResourceOrg, times(2)).getItems();
            Assertions.assertEquals(2, resourceOrganization.getItems().size());

        }

        @Test
        @DisplayName("Test when resource organization exists with same cost center which is uploaded")
        public void validateWhenSameCostCenterPresent() {
            ProcessResourceOrganization spyOfCut = Mockito.spy(cut);
            Details mockDetails = Details.create();
            mockDetails.setUnitKey("10101902"); //Same cost center already exist in Resource Org App
            Headers mockHeader = Headers.create();
            mockHeader.setCode("1010");
            mockHeader.setDescription("Resource Org DE");

            mockExistingResourceOrg.setId("1010");
            mockExistingResourceOrg.setDisplayId("Resource Org DE");
            ArrayList <ResourceOrganizationItems> resourceOrganizationItemsArrayList = new ArrayList<>();

            ResourceOrganizationItems resourceOrganizationItems = ResourceOrganizationItems.create();
            resourceOrganizationItems.setId("1010");
            resourceOrganizationItems.setCostCenterId("10101902");
            resourceOrganizationItemsArrayList.add(resourceOrganizationItems);

            doReturn(mockExistingResourceOrg).when(mockResourceOrganizationDAO).getResourceOrganizationForServiceOrganization(any());
            doReturn("DisplayId").when(mockResOrgDisplayIDGenerator).getDisplayId();
            doReturn(resourceOrganizationItemsArrayList).when(mockExistingResourceOrg).getItems();

            ResourceOrganizations resourceOrganization = spyOfCut.prepareResourceOrgPayload(mockHeader, List.of(mockDetails));
            verify(mockExistingResourceOrg, times(2)).getItems();


        }
    }

}
