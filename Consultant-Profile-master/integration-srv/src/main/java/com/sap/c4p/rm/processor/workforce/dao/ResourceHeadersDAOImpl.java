package com.sap.c4p.rm.processor.workforce.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;

import com.sap.resourcemanagement.resource.Headers;
import com.sap.resourcemanagement.resource.Headers_;

public class ResourceHeadersDAOImpl implements ResourceHeadersDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceHeadersDAOImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private final PersistenceService persistenceService;

    @Autowired
    public ResourceHeadersDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void save(final Headers resourceHeaders) {
        CqnUpsert cqnUpsert = Upsert.into(Headers_.CDS_NAME).entry(resourceHeaders);
        try {
            this.persistenceService.run(cqnUpsert);
        } catch (ServiceException serviceException) {
            LOGGER.error(WORKFORCE_REPLICATION_MARKER, "Error occurred while saving Resource Header Information");
            throw new TransactionException(serviceException, "saving", "Resource Header");
        }
    }

}
