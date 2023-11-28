package com.sap.c4p.rm.replicationdao;

import java.util.List;

import org.slf4j.Marker;

import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.resourcemanagement.consultantprofile.integration.CapacityCleanupFailures;

public interface CapacityCleanupFailuresDAO {
	
	void prepareAndSaveAvailabilityCleanupFailure(final Marker loggingMarker, final CapacityCleanupException availabilityCleanupException,
            final Log workforcePersonLog);

	List<CapacityCleanupFailures> readAll(final Marker loggingMarker);

	void update(Marker loggingMarker, String instanceId, String versionId);

}
