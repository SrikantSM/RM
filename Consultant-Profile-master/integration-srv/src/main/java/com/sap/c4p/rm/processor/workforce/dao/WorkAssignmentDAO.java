package com.sap.c4p.rm.processor.workforce.dao;

import java.util.Optional;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

/**
 * An Interface to perform the DAO related operation for {@link WorkAssignments}
 */
public interface WorkAssignmentDAO {

    /**
     * Method to fetch the already persisted workAssignment based on the
     * {@link WorkAssignments#WORK_ASSIGNMENT_ID}
     *
     * @param workAssignmentId: {@link WorkAssignments#WORK_ASSIGNMENT_ID}
     * @return return {@link WorkAssignments#ID}/null
     */
    Optional<WorkAssignments> getWorkAssignmentKeyId(final String workAssignmentId);
    
    /**
     * To validate foreign key checks for work assignment external id and workforce person ID and queries DB for
     * Method to fetch ID, start date and end date.
     *
     * @param workAssignmentExternalId: Represents work assignment external ID
     * @param workforcePersonID: Represents workforce person ID
     * @param tenant
     * @return returns ID, start date and end date
     */
    WorkAssignments getWorkAssignmentGuidStartDateAndEndDate(final String workAssignmentExternalId, final String workforcePersonID, final String tenant);

}
