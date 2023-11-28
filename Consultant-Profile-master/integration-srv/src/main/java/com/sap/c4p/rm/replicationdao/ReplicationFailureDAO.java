package com.sap.c4p.rm.replicationdao;

import org.slf4j.Marker;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;

/**
 * An Interface to perform the DAO related operation for
 * {@link ReplicationFailures}
 */
public interface ReplicationFailureDAO {

    /**
     * Method to update the Replication Failure information
     *
     * @param replicationFailure: Represents an object of
     *                            {@link ReplicationFailures} having the replication
     *                            Failure Information.
     */
    void update(final Marker loggingMarker, final ReplicationFailures replicationFailure);

    /**
     * Method to save the replication failure for workforce replication scenario
     *
     * @param loggingMarker:         Marker to indicate the category of process
     * @param replicationException:  Represents what kind of exception it was
     * @param workforcePersonLog:    {@link Log} that holds the failed workforce
     *                               logs
     * @param subDomain:             Tenant
     * @param jobSchedulerRunHeader: JobScheduler run that needs to be updated.
     */
    String saveWorkforceReplicationFailure(final Marker loggingMarker, final ReplicationException replicationException,
            final Log workforcePersonLog, final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader);

    /**
     * Method to save the replication failure for workforce replication scenario
     *
     * @param loggingMarker:         Marker to indicate the category of process
     * @param replicationException:  Represents what kind of exception it was
     * @param costCenterLog:         {@link Log} that holds the failed cost center
     *                               logs
     * @param subDomain:             Tenant
     * @param jobSchedulerRunHeader: JobScheduler run that needs to be updated.
     */
	String saveCostCenterReplicationFailure(final Marker loggingMarker, final ReplicationException replicationException,
            final com.sap.c4p.rm.processor.costcenter.dto.Log costCenterLog, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader);

}
