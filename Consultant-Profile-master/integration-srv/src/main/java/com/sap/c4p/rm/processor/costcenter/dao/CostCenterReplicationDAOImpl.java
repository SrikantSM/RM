package com.sap.c4p.rm.processor.costcenter.dao;

import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAO;

import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.organization.CostCenters;

@Repository
public class CostCenterReplicationDAOImpl implements CostCenterReplicationDAO {
    private static final Marker COST_CENTER_REPLICATION_MARKER = LoggingMarker.COST_CENTER_REPLICATION.getMarker();

    private final CostCenterDAO costCenterDAO;
    private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;
    private final ReplicationFailureDAO replicationFailureDAO;

    @Autowired
    public CostCenterReplicationDAOImpl(final CostCenterDAO costCenterDAO,
            final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO,
            final ReplicationFailureDAO replicationFailureDAO) {
        this.costCenterDAO = costCenterDAO;
        this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
        this.replicationFailureDAO = replicationFailureDAO;
    }

    @Override
    public void save(final CostCenters costCenter) {
        this.costCenterDAO.save(costCenter);
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.COST_CENTER, costCenter.getId());
    }

    @Override
    @Transactional(rollbackFor = TransactionException.class)
    public void save(final CostCenters costCenter, ReplicationFailures replicationFailures) {
        this.costCenterDAO.save(costCenter);
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.COST_CENTER, costCenter.getId());
        this.replicationFailureDAO.update(COST_CENTER_REPLICATION_MARKER, replicationFailures);
    }

}
