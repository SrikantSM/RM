package com.sap.c4p.rm.processor.workforce.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.employee.ProfilePhoto;
import com.sap.resourcemanagement.employee.ProfilePhoto_;

@Repository
public class ProfilePhotoDAOImpl implements ProfilePhotoDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProfilePhotoDAOImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private final PersistenceService persistenceService;

    @Autowired
    public ProfilePhotoDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void save(ProfilePhoto profilePhoto) {
        CqnUpsert cqnUpsert = Upsert.into(ProfilePhoto_.CDS_NAME).entry(profilePhoto);
        try {
            this.persistenceService.run(cqnUpsert);
        } catch (ServiceException serviceException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "Error occurred while saving Profile Photo");
            throw new TransactionException(serviceException, "saving", "Profile Photo");
        }
    }

}
