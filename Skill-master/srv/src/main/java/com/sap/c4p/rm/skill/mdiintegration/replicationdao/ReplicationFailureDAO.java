package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import org.slf4j.Marker;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.CapabilityValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.CatalogValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.ProficiencyValue;

import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

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
   * Method to save the replication failure for workforce capability catalog
   * replication scenario
   *
   * @param loggingMarker:         Marker to indicate the category of process
   * @param replicationException:  Represents what kind of exception it was
   * @param catalogValue:          that holds the failed workforce capability
   *                               catalog logs
   * @param subDomain:             Tenant
   * @param jobSchedulerRunHeader: JobScheduler run that needs to be updated.
   */
  void saveWorkforceCapabilityCatalogReplicationFailure(final Marker loggingMarker,
      final ReplicationException replicationException, final CatalogValue catalogValue, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

  /**
   * Method to save the replication failure for workforce capability proficiency
   * scale replication scenario
   *
   * @param loggingMarker:         Marker to indicate the category of process
   * @param replicationException:  Represents what kind of exception it was
   * @param proficiencyValue:      that holds the failed workforce capability
   *                               proficiency scale logs
   * @param subDomain:             Tenant
   * @param jobSchedulerRunHeader: JobScheduler run that needs to be updated.
   */
  void saveWorkforceCapabilityProfScaleReplicationFailure(final Marker loggingMarker,
      final ReplicationException replicationException, final ProficiencyValue proficiencyValue, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

  void saveWorkforceCapabilityReplicationFailure(final Marker loggingMarker,
      final ReplicationException replicationException, final CapabilityValue capabilityValue, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

  void saveReplicationFailure(final Marker loggingMarker, final ReplicationException replicationException,
                              final String keyFieldID, final String replicationType,
                              final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader);

}
