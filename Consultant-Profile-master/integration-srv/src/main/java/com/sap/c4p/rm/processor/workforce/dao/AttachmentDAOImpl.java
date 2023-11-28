package com.sap.c4p.rm.processor.workforce.dao;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.employee.Attachment;
import com.sap.resourcemanagement.employee.Attachment_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AttachmentDAOImpl implements AttachmentDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(AttachmentDAOImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private final PersistenceService persistenceService;

    @Autowired
    public AttachmentDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void save(Attachment attachment) {
        CqnUpsert cqnUpsert = Upsert.into(Attachment_.CDS_NAME).entry(attachment);
        try {
            this.persistenceService.run(cqnUpsert);
        } catch (ServiceException serviceException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "Error occurred while saving Attachment");
            throw new TransactionException(serviceException, "saving", "Attachment");
        }
    }
}
