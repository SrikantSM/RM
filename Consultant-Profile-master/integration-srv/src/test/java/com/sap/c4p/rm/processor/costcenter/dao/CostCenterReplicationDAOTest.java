package com.sap.c4p.rm.processor.costcenter.dao;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAO;

import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.organization.CostCenters;

public class CostCenterReplicationDAOTest extends InitMocks {
    private static final Marker COST_CENTER_REPLICATION_MARKER = LoggingMarker.COST_CENTER_REPLICATION.getMarker();

    @Mock
    CostCenterDAO costCenterDAO;

    @Mock
    MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

    @Mock
    ReplicationFailureDAO replicationFailureDAO;

    @Autowired
    @InjectMocks
    CostCenterReplicationDAOImpl classUnderTest;

    @Test
    @DisplayName("test save with only costCenter")
    public void testSaveWithOnlyCostCenter() {
        CostCenters costCenters = CostCenters.create();
        String costCenterId = UUID.randomUUID().toString();
        costCenters.setId(costCenterId);
        this.classUnderTest.save(costCenters);
        verify(this.costCenterDAO, times(1)).save(costCenters);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.COST_CENTER, costCenterId);
    }

    @Test
    @DisplayName("test save with costCenter and ReplicationFailure")
    public void testSaveWithCostCenterAndReplicationFailure() {
        CostCenters costCenters = CostCenters.create();
        String costCenterId = UUID.randomUUID().toString();
        costCenters.setId(costCenterId);
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        this.classUnderTest.save(costCenters, replicationFailures);
        verify(this.costCenterDAO, times(1)).save(costCenters);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.COST_CENTER, costCenterId);
        verify(this.replicationFailureDAO, times(1)).update(COST_CENTER_REPLICATION_MARKER, replicationFailures);
    }

}
