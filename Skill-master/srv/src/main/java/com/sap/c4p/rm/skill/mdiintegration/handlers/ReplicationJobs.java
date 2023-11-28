package com.sap.c4p.rm.skill.mdiintegration.handlers;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;

/**
 * An Interface to initiate the internal jobs of replication.
 */
public interface ReplicationJobs {

  /**
   * Method to submit the job to initiate the workforce capability replication
   *
   * @param customerSubDomain:     Tenant's subDomain
   * @param jobSchedulerRunHeader: An Object of {@link JobSchedulerRunHeader}
   *                               having the information of job run that needs to
   *                               be updated.
   */
  void submitForWorkforceCapabilityObjectsReplication(final String customerSubDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

  void submitForWorkforceCapabilityReplication(final String customerSubDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

  void submitForWorkforceCapabilityCatalogReplication(final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

  void submitForWorkforceCapabilityProfScaleReplication(final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

  void cleanSnapshotForWorkforceCapabilityObjects(final String subDomain,
                                                  final JobSchedulerRunHeader jobSchedulerRunHeader);

}
