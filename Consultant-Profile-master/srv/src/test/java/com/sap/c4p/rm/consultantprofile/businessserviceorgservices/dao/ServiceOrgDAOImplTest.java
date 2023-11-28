package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.dao;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import com.sap.resourcemanagement.organization.Details;
import com.sap.resourcemanagement.organization.Headers;

public class ServiceOrgDAOImplTest extends InitMocks {

    private PersistenceService mockPersistenceService;

    private Result mockResult;

    private ServiceOrgDAO cut;

    private static final String DEFAULT_VALUE_X = "X";
    private static final String CODE_1 = "Org_1";
    private static final String UNIT_KEY_1 = "17101901";
    private static final String UNIT_TYPE_1 = "CS";
    private static final String DELIVERY = "X";
    private static final String DESCRIPTION = "Service Org_1";

    @BeforeEach
    public void setUp() {
        this.mockPersistenceService = mock(PersistenceService.class, Mockito.RETURNS_DEEP_STUBS);
        this.cut = new ServiceOrgDAOImpl(this.mockPersistenceService);
    }

    @Test
    @DisplayName("Try to Persist empty Headers record properly in organization headers")
    public void upsertHeadersEmpty() throws IOException {
        Set<Headers> mockHeaders = new HashSet<Headers>();
        when(mockPersistenceService.run(any(CqnInsert.class))).thenReturn(mockResult);
        this.cut.upsertNewServiceOrgHead((Set<Headers>) mockHeaders);
        verify(mockPersistenceService, times(0)).run(any(CqnInsert.class));
        verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));
    }

    @Test
    @DisplayName("Persist Headers record properly in organization headers")
    public void upsertHeadersOk() throws IOException {

        Set<Headers> mockHeaders = new HashSet<Headers>();
        mockHeaders.add(ServiceOrgDAOImplTest.createTestOrgHeaders(CODE_1, DESCRIPTION, DELIVERY));

        when(mockPersistenceService.run(any(CqnInsert.class))).thenReturn(mockResult);
        this.cut.upsertNewServiceOrgHead((Set<Headers>) mockHeaders);
        verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));
        verify(mockPersistenceService, times(1)).run(any(CqnDelete.class), anyList());
    }

    @Test
    @DisplayName("Try to Persist empty Details record properly in organization details")
    public void upsertDetailsEmpty() throws IOException {

        Set<Details> mockDetails = new HashSet<Details>();
        when(mockPersistenceService.run(any(CqnInsert.class))).thenReturn(mockResult);
        this.cut.upsertNewServiceOrgDetails((Set<Details>) mockDetails);
        verify(mockPersistenceService, times(0)).run(any(CqnInsert.class));
        verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));
    }

    @Test
    @DisplayName("Persist Details record properly in organization details")
    public void upsertDetailsOk() throws IOException {

        Set<Details> mockDetails = new HashSet<Details>();
        mockDetails.add(ServiceOrgDAOImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));

        when(mockPersistenceService.run(any(CqnInsert.class))).thenReturn(mockResult);
        this.cut.upsertNewServiceOrgDetails((Set<Details>) mockDetails);
        verify(mockPersistenceService, times(1)).run(any(CqnInsert.class));
        verify(mockPersistenceService, times(1)).run(any(CqnDelete.class), anyList());
    }

    @Test
    @DisplayName("Delete Header for given service org code")
    public void deleteServiceOrgHeadeRecords() {

        String code = "1001XYZ";

        Set<Headers> headers = new HashSet<Headers>();
        headers.add(ServiceOrgDAOImplTest.createTestOrgHeaders(CODE_1, DESCRIPTION, DELIVERY));

        when(mockPersistenceService.run(any(CqnDelete.class))).thenReturn(mockResult);
        this.cut.deleteServiceOrgHeader(headers);
        verify(mockPersistenceService, times(1)).run(any(CqnDelete.class), anyList());
    }

    @Test
    @DisplayName("delete header invoked with empty key list")
    public void deleteServiceOrgHeadeEmpty() {
        Set<Headers> mockHeaders = new HashSet<Headers>();
        when(mockPersistenceService.run(any(CqnDelete.class))).thenReturn(mockResult);
        this.cut.deleteServiceOrgHeader(mockHeaders);
        verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

    }

    @Test
    @DisplayName("Delete details for given service org code")
    public void deleteServiceOrgDetailRecords() {

        Set<Details> details = new HashSet<Details>();
        details.add(ServiceOrgDAOImplTest.createTestOrgDetail(CODE_1, UNIT_KEY_1, UNIT_TYPE_1));

        when(mockPersistenceService.run(any(Delete.class))).thenReturn(mockResult);
        this.cut.deleteServiceOrgDetail(details);
        verify(mockPersistenceService, times(1)).run(any(CqnDelete.class), anyList());
    }

    @Test
    @DisplayName("delete details invoked with empty key list")
    public void deleteServiceOrgDetailEmpty() {
        Set<Details> mockDetails = new HashSet<Details>();
        when(mockPersistenceService.run(any(CqnDelete.class))).thenReturn(mockResult);
        this.cut.deleteServiceOrgDetail(mockDetails);
        verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

    }

    /**
     * create an active {@link Headers} instance for Unit Testing
     *
     * @return {@link Headers} instance for Unit Testing
     */
    private static Headers createTestOrgHeaders(String code, String description, String delivery) {
        final Headers header = Struct.create(Headers.class);
        header.setCode(code);
        header.setDescription(description);
        header.setIsDelivery(delivery);
        return header;
    }

    /**
     * create an active {@link Details} instance for Unit Testing
     *
     * @return {@link Details} instance for Unit Testing
     */
    private static Details createTestOrgDetail(String code, String unitKey, String unitType) {
        final Details detail = Struct.create(Details.class);
        detail.setCode(code);
        detail.setUnitKey(unitKey);
        detail.setUnitType(unitType);
        return detail;
    }
}
