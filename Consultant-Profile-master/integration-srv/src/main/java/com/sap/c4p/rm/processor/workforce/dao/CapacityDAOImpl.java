package com.sap.c4p.rm.processor.workforce.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Capacity_;

@Repository
public class CapacityDAOImpl implements CapacityDAO {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CapacityDAOImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();
	
	private final PersistenceService persistenceService;

	@Autowired
    public CapacityDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

	@Override
	public List<Capacity> read(CqnPredicate filter) {
		CqnSelect selectQuery = Select.from(Capacity_.CDS_NAME)
	              .where(filter);
		Result result;
		try {
			result = persistenceService.run(selectQuery);
		} catch (ServiceException serviceException) {
            LOGGER.error(WORKFORCE_REPLICATION_MARKER, "Error occurred while reading Capacity Information");
            throw new CapacityCleanupException(serviceException, "reading", "Capacity");
        }
	    return result.listOf(Capacity.class);
	}

	@Override
	public void save(List<Capacity> capacities) {
		CqnUpsert cqnUpsert = Upsert.into(Capacity_.CDS_NAME).entries(capacities);
		try {
            this.persistenceService.run(cqnUpsert);
        } catch (ServiceException serviceException) {
            LOGGER.error(WORKFORCE_REPLICATION_MARKER, "Error occurred while upserting Capacity Information");
            throw new CapacityCleanupException(serviceException, "saving", "Capacity");
        }
	}

}
