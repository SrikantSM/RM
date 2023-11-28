package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.service;

import org.slf4j.Marker;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.model.DestinationResponse;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;

public interface DestinationService {

  DestinationResponse getDestinationDetails(final Marker loggingMarker, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader, final String nextDeltaToken);

}
