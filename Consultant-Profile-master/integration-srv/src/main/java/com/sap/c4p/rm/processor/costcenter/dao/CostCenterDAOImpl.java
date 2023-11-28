package com.sap.c4p.rm.processor.costcenter.dao;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;

import com.sap.resourcemanagement.organization.CostCenters;
import com.sap.resourcemanagement.organization.CostCenters_;

@Repository
public class CostCenterDAOImpl implements CostCenterDAO {
    private static final Logger LOGGER = LoggerFactory.getLogger(CostCenterDAOImpl.class);
    private static final Marker COST_CENTER_REPLICATION_MARKER = LoggingMarker.COST_CENTER_REPLICATION.getMarker();

    private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;
    private final PersistenceService persistenceService;

    @Autowired
    public CostCenterDAOImpl(final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO,
            final PersistenceService persistenceService) {
        this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
        this.persistenceService = persistenceService;
    }

    @Override
    @Transactional
    public void save(final CostCenters costCenter) {
    	CqnSelect cqnSelect = Select.from(CostCenters_.class)
    			.columns(a -> a.expand())
                .where(b -> b.get(CostCenters.ID).eq(costCenter.getId()));
    	try {
    		Optional<CostCenters> costCentersGuidOptional = this.persistenceService.run(cqnSelect).first(CostCenters.class);
    		if (costCentersGuidOptional.isPresent()) {
    			this.persistenceService.run(Delete.from(CostCenters_.CDS_NAME).where(b -> b.get(CostCenters.ID).eq(costCenter.getId())));
    		}
    		CqnInsert cqnInsert = Insert.into(CostCenters_.CDS_NAME).entry(costCenter);
    		this.persistenceService.run(cqnInsert);
    	} catch (ServiceException serviceException) {
            LOGGER.error(COST_CENTER_REPLICATION_MARKER, "Error occurred while saving Cost Center Information");
            throw new TransactionException(serviceException, "saving", "Cost Center");
        }
    }

    @Override
    public List<CostCenters> readAll() {
        CqnSelect cqnSelect = Select.from(CostCenters_.class);
        return this.persistenceService.run(cqnSelect).listOf(CostCenters.class);
    }

    @Override
    @Transactional
    public void markBusinessPurposeComplete(final List<CostCenters> costCenter) {
        CqnUpdate cqnUpdate = Update.entity(CostCenters_.class).entries(costCenter);
        this.persistenceService.run(cqnUpdate);
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.COST_CENTER);
    }

}
