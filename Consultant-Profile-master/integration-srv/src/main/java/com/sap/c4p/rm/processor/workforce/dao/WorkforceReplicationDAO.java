package com.sap.c4p.rm.processor.workforce.dao;

import java.util.List;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.employee.Attachment;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.ProfilePhoto;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;

/**
 * An Interface to perform the DAO related operation for {@link Headers} and
 * {@link AvailabilityReplicationSummary}
 */
public interface WorkforceReplicationDAO {

    /**
     * Method to save the qualified {@link Headers} Object/Document and
     * {@link AvailabilityReplicationSummary} as a single DB transaction
     *
     * @param employeeHeader:                     An Object of {@link Headers}
     * @param availabilityReplicationSummaryList: A list of
     *                                            {@link AvailabilityReplicationSummary}
     *                                            object.
     */
    void save(final Headers employeeHeader, final WorkforcePersons workforcePerson,
              final List<AvailabilityReplicationSummary> availabilityReplicationSummaryList, final ProfilePhoto profilePhoto,
              final Attachment attachment);

    /**
     * Method to save not fully qualified {@link Headers}
     * Object/Document, @{@link AvailabilityReplicationSummary} and
     * {@link ReplicationFailures} as a single DB Transaction.
     *
     * @param employeeHeader:                     An Object/Document of
     *                                            {@link Headers}
     * @param availabilityReplicationSummaryList: An object of
     *                                            {@link AvailabilityReplicationSummary}
     * @param replicationFailures:                An Object of
     *                                            {@link ReplicationFailures}.
     */
    void save(final Headers employeeHeader, final WorkforcePersons workforcePerson,
            final List<AvailabilityReplicationSummary> availabilityReplicationSummaryList,
            final ProfilePhoto profilePhoto, final Attachment attachment,
            final ReplicationFailures replicationFailures);

}
