package com.sap.c4p.rm.replicationdao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.*;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;

import com.sap.resourcemanagement.consultantprofile.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.organization.CostCenters;

class MDIObjectReplicationStatusDAOTest extends InitMocks {
    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;

    @InjectMocks
    @Autowired
    MDIObjectReplicationStatusDAOImpl classUnderTest;

    @Test
    @DisplayName("test fillEntity")
    public void testFillEntity() {
        MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
        this.classUnderTest.fillEntity(Collections.singletonList(mdiObjectReplicationStatus));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test readAll with no MDI object")
    public void testReadAllWithNoMDIObjectsRecords() {
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(CostCenters.class)).thenReturn(Collections.emptyList());
        assertTrue(this.classUnderTest.readAll(MDIEntities.WORKFORCE_PERSON).isEmpty());
    }

    @Test
    @DisplayName("test readAll with MDI object")
    public void testReadAllWithMDIObjectsRecords() {
        MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
        List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = new ArrayList<>();
        mdiObjectReplicationStatusList.add(mdiObjectReplicationStatus);
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(MDIObjectReplicationStatus.class)).thenReturn(mdiObjectReplicationStatusList);
        assertEquals(mdiObjectReplicationStatusList, this.classUnderTest.readAll(MDIEntities.WORKFORCE_PERSON));
    }

    @Test
    @DisplayName("test delete")
    public void testDelete() {
        this.classUnderTest.delete(MDIEntities.COST_CENTER);
        verify(this.persistenceService, times(1)).run(any(CqnDelete.class));
    }

    @Test
    @DisplayName("test delete with id")
    public void testDeleteWithId() {
        this.classUnderTest.delete(MDIEntities.COST_CENTER, UUID.randomUUID().toString());
        verify(this.persistenceService, times(1)).run(any(CqnDelete.class));
    }

}
