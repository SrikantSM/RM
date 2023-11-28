package com.sap.c4p.rm.processor.workforce.dao;

import java.util.List;
import java.util.Optional;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

/**
 * An Interface to perform the DAO related operation for
 * {@link AvailabilityReplicationSummary}
 */
public interface AvailabilityReplicationSummaryDAO {

    /**
     * Method to save the {@link AvailabilityReplicationSummary} info
     *
     * @param availabilityReplicationSummaryList: An Object of
     *                                            {@link AvailabilityReplicationSummary}
     */
    void save(final List<AvailabilityReplicationSummary> availabilityReplicationSummaryList);

    /**
     * Method to fetch the availability summary already available
     *
     * @param id: {@link WorkAssignments#ID} received from the MDI log API response.
     * @return returns an Object of {@link AvailabilityReplicationSummary} if
     *         available else returns null.
     */
    Optional<AvailabilityReplicationSummary> getAvailabilityReplicationSummary(final String id);

}
