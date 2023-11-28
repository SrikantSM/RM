package com.sap.c4p.rm.processor.workforce.dao;

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

import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.Headers_;

/**
 * Class to implement {@link EmpHeaderDAO}.
 */
@Repository
public class EmpHeaderDAOImpl implements EmpHeaderDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmpHeaderDAOImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private final PersistenceService persistenceService;

    @Autowired
    public EmpHeaderDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void save(final Headers employeeHeader) {
        CqnUpsert cqnUpsert = Upsert.into(Headers_.CDS_NAME).entry(employeeHeader);
        try {
            this.persistenceService.run(cqnUpsert);
        } catch (ServiceException serviceException) {
            LOGGER.error(WORKFORCE_REPLICATION_MARKER, "Error occurred while saving Employee Header Information");
            throw new TransactionException(serviceException, "saving", "Employee Header");
        }
    }

    @Override
    public boolean isExists(final String employeeID) {
        CqnSelect cqnSelect = Select.from(Headers_.CDS_NAME).where(b -> b.get(Headers.ID).eq(employeeID));
        return persistenceService.run(cqnSelect).first(Headers.class).isPresent();
    }

}
