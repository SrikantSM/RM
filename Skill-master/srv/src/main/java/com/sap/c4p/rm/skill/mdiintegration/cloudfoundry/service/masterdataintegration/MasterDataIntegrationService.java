package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration;

import org.slf4j.Marker;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;

/**
 * An Interface to provide the generic functionality to communicate to cloud
 * foundry's Master Data Integration service.
 */
public interface MasterDataIntegrationService {

  /**
   * Method to fetch records from OneMDS/Master Data Integration system.
   *
   * @param subDomain:      Represents the tenant's subDomain for which the
   *                        request needs to be made.
   * @param entity:         Represents the requested type of data.
   * @param nextDeltaToken: Represents the delta token to provide the time
   *                        reference to fetch the new records/events
   * @param responseType:   Represents the root DTO class to hold the response
   *                        received from OneMDS/MDI system.
   * @param <T>:            Represents the root DTO type to hold the response
   *                        received from OneMDS/MDI system.
   * @return Returns the data received from oneMDS/MDI system.
   */
  <T> T getMDILogRecords(final Marker loggingMarker, final String subDomain, final MDIEntities entity,
      final String nextDeltaToken, final Class<T> responseType, final JobSchedulerRunHeader jobSchedulerRunHeader);

}
