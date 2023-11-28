package com.sap.c4p.rm.replicationdao;

import static com.sap.c4p.rm.utils.Constants.REPLICATION_FAILURE_STATUS_OPEN;
import static com.sap.c4p.rm.utils.Constants.REPLICATION_TYPE_COST_CENTER_DATA;
import static com.sap.c4p.rm.utils.Constants.REPLICATION_TYPE_WORKFORCE_DATA;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.processor.workforce.dto.Instance;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.c4p.rm.utils.StringFormatter;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures_;

/**
 * Class to implement {@link ReplicationFailureDAO}.
 */
@Repository
public class ReplicationFailureDAOImpl implements ReplicationFailureDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReplicationFailureDAOImpl.class);

    private static final String REPLICATION_FAILURES = "ReplicationFailures";
    private static final String INSTANCE_ID = "Instance Id";
    private static final String VERSION_ID = "Version Id";
    private static final String EVENT = "Event";
    private static final String MESSAGE = "Message";

    private final JobSchedulerService jobSchedulerService;
    private final PersistenceService persistenceService;
    private final ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

    @Autowired
    public ReplicationFailureDAOImpl(final JobSchedulerService jobSchedulerService,
            final PersistenceService persistenceService,
            final ReplicationErrorMessagesDAO replicationErrorMessagesDAO) {
        this.jobSchedulerService = jobSchedulerService;
        this.persistenceService = persistenceService;
        this.replicationErrorMessagesDAO = replicationErrorMessagesDAO;
    }

    @Override
    public void update(final Marker loggingMarker, final ReplicationFailures replicationFailure) {
        CqnUpdate cqnUpdate = Update.entity(ReplicationFailures_.CDS_NAME).data(replicationFailure);
        try {
            this.persistenceService.run(cqnUpdate);
        } catch (ServiceException serviceException) {
            LOGGER.error(loggingMarker, "Error occurred while updating ReplicationFailures Information");
            throw new TransactionException(serviceException, "updating", REPLICATION_FAILURES);
        }
    }

    @Override
    public String saveWorkforceReplicationFailure(final Marker loggingMarker,
            final ReplicationException replicationException, final Log workforcePersonLog, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
        String versionId = workforcePersonLog.getVersionId();
        String logEvent = workforcePersonLog.getEvent();
        Instance instance = workforcePersonLog.getInstance();
        String instanceId = instance.getId();
        String instanceExternalId = instance.getExternalId();
        ReplicationFailures replicationFailures = prepareReplicationFailureObject(versionId, logEvent, instanceId,
                instanceExternalId, REPLICATION_TYPE_WORKFORCE_DATA, replicationException);
        CqnUpsert cqnUpsert = Upsert.into(ReplicationFailures_.CDS_NAME).entry(replicationFailures);

        Map<String, String> jsonObject = new HashMap<>();
        jsonObject.put("WorkforceExternalID", instanceExternalId);
        JobScheduleRunPayload jobScheduleRunPayload = this.prepareJobScheduleRunPayload(jsonObject, instanceId,
                versionId, logEvent, replicationException);

        try {
            this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                    jobScheduleRunPayload);
            this.persistenceService.run(cqnUpsert);
            return draftErrorMessage(replicationException);
        } catch (ServiceException serviceException) {
            LOGGER.error(loggingMarker, "Error occurred while saving ReplicationFailures Information");
            throw new TransactionException(serviceException, "saving", REPLICATION_FAILURES);
        }
    }

    @Override
	public String saveCostCenterReplicationFailure(final Marker loggingMarker,
            final ReplicationException replicationException,
            final com.sap.c4p.rm.processor.costcenter.dto.Log costCenterLog, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
        String versionId = costCenterLog.getVersionId();
        String logEvent = costCenterLog.getEvent();
        com.sap.c4p.rm.processor.costcenter.dto.Instance instance = costCenterLog.getInstance();
        String instanceId = instance.getId();
        String costCenterDisplayName = instance.getDisplayName();
        ReplicationFailures replicationFailures = prepareReplicationFailureObject(versionId, logEvent, instanceId,
                costCenterDisplayName, REPLICATION_TYPE_COST_CENTER_DATA, replicationException);
        CqnUpsert upsert = Upsert.into(ReplicationFailures_.CDS_NAME).entry(replicationFailures);

        Map<String, String> jsonObject = new HashMap<>();
        jsonObject.put("CostCenterDisplayName", costCenterDisplayName);
        JobScheduleRunPayload jobScheduleRunPayload = this.prepareJobScheduleRunPayload(jsonObject, instanceId,
                versionId, logEvent, replicationException);

        try {
            this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                    jobScheduleRunPayload);
            this.persistenceService.run(upsert);
			return draftErrorMessage(replicationException);
        } catch (ServiceException serviceException) {
            LOGGER.error(loggingMarker, "Error occurred while saving ReplicationFailures Information");
            throw new TransactionException(serviceException, "saving", REPLICATION_FAILURES);
        }
    }

    private JobScheduleRunPayload prepareJobScheduleRunPayload(final Map<String, String> jsonObject,
            final String instanceId, final String versionId, final String logEvent,
            final ReplicationException replicationException) {
        jsonObject.put(INSTANCE_ID, instanceId);
        jsonObject.put(VERSION_ID, versionId);
        jsonObject.put(EVENT, logEvent);
        jsonObject.put(MESSAGE, draftErrorMessage(replicationException));
        return new JobScheduleRunPayload(true, jsonObject.toString());
    }
    
    private String draftErrorMessage(final ReplicationException replicationException) {
    	Throwable throwable;
    	if ((throwable = replicationException.getThrowable()) != null)
            return throwable.getLocalizedMessage();
        else
            return StringFormatter.format(
                            this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                                    .get(replicationException.getReplicationErrorCode().getErrorCode()),
                            replicationException.getParameters().toArray());
    	
    }
    private ReplicationFailures prepareReplicationFailureObject(final String versionId, final String logEvent,
            final String instanceId, final String externalId, final String replicationType,
            final ReplicationException replicationException) {
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        replicationFailures.setVersionId(versionId);
        replicationFailures.setEvent(logEvent);
        replicationFailures.setInstanceId(instanceId);
        replicationFailures.setExternalId(externalId);
        replicationFailures.setReplicationType(replicationType);
        replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_OPEN);
        replicationFailures
                .setReplicationErrorMessageCode(replicationException.getReplicationErrorCode().getErrorCode());
        List<String> errorParams = replicationException.getParameters();
        String errorParam1;
        if ((errorParam1 = errorParams.get(0)) != null)
            replicationFailures.setErrorParam1(errorParam1);
        String errorParam2;
        if ((errorParam2 = errorParams.get(1)) != null)
            replicationFailures.setErrorParam2(errorParam2);
        String errorParam3;
        if ((errorParam3 = errorParams.get(2)) != null)
            replicationFailures.setErrorParam3(errorParam3);
        String errorParam4;
        if ((errorParam4 = errorParams.get(3)) != null)
            replicationFailures.setErrorParam4(errorParam4);
        return replicationFailures;
    }

}
