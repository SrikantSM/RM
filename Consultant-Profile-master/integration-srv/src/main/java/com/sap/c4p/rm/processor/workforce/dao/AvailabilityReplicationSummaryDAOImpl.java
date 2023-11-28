package com.sap.c4p.rm.processor.workforce.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary_;
import com.sap.resourcemanagement.resource.Headers;
import com.sap.resourcemanagement.resource.Headers_;

/**
 * Class to implement {@link AvailabilityReplicationSummaryDAO}.
 */
@Repository
public class AvailabilityReplicationSummaryDAOImpl implements AvailabilityReplicationSummaryDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(AvailabilityReplicationSummaryDAOImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private final PersistenceService persistenceService;

    @Autowired
    public AvailabilityReplicationSummaryDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void save(final List<AvailabilityReplicationSummary> availabilityReplicationSummaryList) {
        CqnUpsert cqnUpsertAvailabilityReplicationSummaryList = Upsert.into(AvailabilityReplicationSummary_.CDS_NAME)
                .entries(availabilityReplicationSummaryList);
        List<Headers> resourceHeadersList = new ArrayList<>(availabilityReplicationSummaryList.size());
        for (AvailabilityReplicationSummary availabilityReplicationSummary : availabilityReplicationSummaryList) {
            Headers resourceHeaders = Headers.create();
            resourceHeaders.setId(availabilityReplicationSummary.getResourceId());
            resourceHeaders.setTypeCode("1");
            resourceHeadersList.add(resourceHeaders);
        }
        CqnUpsert cqnUpsertResourceHeaderList = Upsert.into(Headers_.CDS_NAME).entries(resourceHeadersList);
        try {
            this.persistenceService.run(cqnUpsertAvailabilityReplicationSummaryList);
            this.persistenceService.run(cqnUpsertResourceHeaderList);
        } catch (ServiceException serviceException) {
            LOGGER.error(WORKFORCE_REPLICATION_MARKER,
                    "Error occurred while saving AvailabilityReplicationSummary or ResourceHeaders Information");
            throw new TransactionException(serviceException, "saving",
                    "AvailabilityReplicationSummary or ResourceHeaders");
        }
    }

    @Override
    public Optional<AvailabilityReplicationSummary> getAvailabilityReplicationSummary(final String id) {
        CqnSelect selectQuery = Select.from(AvailabilityReplicationSummary_.CDS_NAME)
                .where(b -> b.get(AvailabilityReplicationSummary.RESOURCE_ID).eq(id));
        return this.persistenceService.run(selectQuery).first(AvailabilityReplicationSummary.class);
    }
}
