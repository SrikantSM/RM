package com.sap.c4p.rm.replicationdao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.processor.workforce.dto.Instance;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.c4p.rm.utils.Constants;
import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.consultantprofile.integration.CapacityCleanupFailures;
import com.sap.resourcemanagement.consultantprofile.integration.CapacityCleanupFailures_;

@Repository
public class CapacityCleanupFailuresDAOImpl implements CapacityCleanupFailuresDAO{
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ReplicationFailureDAOImpl.class);
	private static final String AVAILABILITY_CLEANUP_FAILURES = "Availability Cleanup Failure";
    private final PersistenceService persistenceService;

    @Autowired
    public CapacityCleanupFailuresDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

	@Override
    public void prepareAndSaveAvailabilityCleanupFailure(final Marker loggingMarker,
            final CapacityCleanupException availabilityCleanupException, final Log workforcePersonLog) {
        String versionId = workforcePersonLog.getVersionId();
        Instance instance = workforcePersonLog.getInstance();
        String instanceId = instance.getId();
        CapacityCleanupFailures capacityCleanupFailures = prepareCapacityCleanupFailureObject(versionId, instanceId, availabilityCleanupException);
        CqnUpsert cqnUpsert = Upsert.into(CapacityCleanupFailures_.CDS_NAME).entry(capacityCleanupFailures);
        try {
            this.persistenceService.run(cqnUpsert);
        } catch (ServiceException serviceException) {
            LOGGER.error(loggingMarker, "Error occurred while saving CapacityCleanupFailures Information");
            throw new TransactionException(serviceException, "saving", AVAILABILITY_CLEANUP_FAILURES);
        }
    }
	
	@Override
	public List<CapacityCleanupFailures> readAll(final Marker loggingMarker) {
		CqnSelect selectQuery = Select.from(CapacityCleanupFailures_.CDS_NAME)
				.where(b -> b.get(CapacityCleanupFailures.CAPACITY_CLEANUP_STATUS_CODE).eq(Constants.REPLICATION_FAILURE_STATUS_OPEN));
		Result result = null;
		try {
			result = this.persistenceService.run(selectQuery);
			return result.listOf(CapacityCleanupFailures.class);
		} catch (ServiceException serviceException) {
			LOGGER.error(loggingMarker, "Error occurred while reading CapacityCleanupFailures Information");
			throw new CapacityCleanupException(serviceException, "reading", AVAILABILITY_CLEANUP_FAILURES);
		}
	}
	
	@Override
	public void update(final Marker loggingMarker, String instanceId, String versionId) {
		CqnUpdate updateQuery = Update.entity(CapacityCleanupFailures_.CDS_NAME)
				.data(CapacityCleanupFailures.CAPACITY_CLEANUP_STATUS_CODE, Constants.REPLICATION_FAILURE_STATUS_CLOSED)
				.where(b -> b.get(CapacityCleanupFailures.INSTANCE_ID).eq(instanceId)
						.and(b.get(CapacityCleanupFailures.VERSION_ID).eq(versionId)));
		try {
			this.persistenceService.run(updateQuery);
		} catch (ServiceException serviceException) {
			LOGGER.error(loggingMarker, "Error occurred while updating CapacityCleanupFailures Information for instanceId: "
					+ instanceId + " and versionId: " + versionId);
			throw new CapacityCleanupException(serviceException, "deleting", AVAILABILITY_CLEANUP_FAILURES);
		}
	}
	
	private CapacityCleanupFailures prepareCapacityCleanupFailureObject(final String versionId,
            final String instanceId, final CapacityCleanupException availabilityCleanupException) {
		CapacityCleanupFailures capacityCleanupFailures = CapacityCleanupFailures.create();
		capacityCleanupFailures.setVersionId(versionId);
		capacityCleanupFailures.setInstanceId(instanceId);
		capacityCleanupFailures
                .setCapacityCleanupErrorMessageCode(availabilityCleanupException.getReplicationErrorCode().getErrorCode());
		capacityCleanupFailures.setCapacityCleanupStatusCode(Constants.REPLICATION_FAILURE_STATUS_OPEN);
        return capacityCleanupFailures;
    }

}
