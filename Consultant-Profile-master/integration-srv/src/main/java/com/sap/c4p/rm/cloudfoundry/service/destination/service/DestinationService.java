package com.sap.c4p.rm.cloudfoundry.service.destination.service;

import org.slf4j.Marker;

import com.sap.c4p.rm.cloudfoundry.service.destination.model.DestinationResponse;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;

public interface DestinationService {

    DestinationResponse getDestinationDetails(final Marker loggingMarker, final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader,
			final String sinceDeltaToken, final MDIEntities entity);

    }
