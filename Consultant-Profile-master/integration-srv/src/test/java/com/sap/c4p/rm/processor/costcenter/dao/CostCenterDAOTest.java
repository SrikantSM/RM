package com.sap.c4p.rm.processor.costcenter.dao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;

import com.sap.resourcemanagement.organization.CostCenters;

public class CostCenterDAOTest extends InitMocks {
    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;

    @Mock
    MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;
    
    @Mock
    CostCenters mockCostCenters;

    @Autowired
    @InjectMocks
    CostCenterDAOImpl classUnderTest;

    @Test
    @DisplayName("test save when persistence run raise exception")
    public void testSaveWhenPersistenceRunRaiseException() {
        CostCenters costCenters = CostCenters.create();
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnSelect.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.save(costCenters));
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnInsert.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.save(costCenters));
        verify(this.persistenceService, times(2)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("test save when persistence do not raise exception")
    public void testSaveWhenPersistenceDoNotRaiseException() {
        CostCenters costCenters = CostCenters.create();
        when(persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(result.first(CostCenters.class)).thenReturn(Optional.of(mockCostCenters));
        this.classUnderTest.save(costCenters);
        verify(this.persistenceService, times(1)).run(any(CqnSelect.class));
        verify(this.persistenceService, times(1)).run(any(CqnDelete.class));
        verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
    }

    @Test
    @DisplayName("test readAll with no cost center")
    public void testReadAllWithNoCostCenterRecords() {
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(CostCenters.class)).thenReturn(Collections.emptyList());
        assertTrue(this.classUnderTest.readAll().isEmpty());
    }

    @Test
    @DisplayName("test readAll with cost center")
    public void testReadAllWithCostCenterRecords() {
        CostCenters costCenters = CostCenters.create();
        List<CostCenters> costCenterList = new ArrayList<>();
        costCenterList.add(costCenters);
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(CostCenters.class)).thenReturn(costCenterList);
        assertEquals(costCenterList, this.classUnderTest.readAll());
    }

    @Test
    @DisplayName("test markBusinessPurposeComplete")
    public void testMarkBusinessPurposeComplete() {
        CostCenters costCenter1 = CostCenters.create();
        CostCenters costCenter2 = CostCenters.create();

        this.classUnderTest.markBusinessPurposeComplete(Arrays.asList(costCenter1, costCenter2));
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.COST_CENTER);
    }

}
