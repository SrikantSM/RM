package com.sap.c4p.rm.processor.workforce.dao;

import java.util.List;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;

/**
 * An Interface to perform the DAO related operation for
 * {@link WorkforcePersons}
 */
public interface WorkforcePersonDAO {

    /**
     * Method to save the {@link WorkforcePersons}
     *
     * @param workforcePersons: Represents the object of {@link WorkforcePersons}
     */
    void save(final WorkforcePersons workforcePersons);

    /**
     * Method to update the {@link WorkforcePersons}
     *
     * @param workforcePersons: Represents the object of {@link WorkforcePersons}
     */
    void update(final WorkforcePersons workforcePersons);

    /**
     * Method to check if employee exists or not
     *
     * @param workforcePersonId: {@link WorkforcePersons} id
     * @return return true if worker exists else return false
     */
    boolean isExists(final String workforcePersonId);

    /**
     * Method to read existing data of employee
     *
     * @param workforcePersonId: {@link WorkforcePersons} id
     * @return return WorkforcePersons
     */
    WorkforcePersons read(final String workforcePersonId);

    /**
     * Method to read existing data of employee
     *
     * @return return a {@link List} ofWorkforcePersons
     */
    List<WorkforcePersons> readAll();

    void markBusinessPurposeComplete(List<WorkforcePersons> workforcePerson);
    
    /**
     * Method to read isBusinessPurposeCompleted data of employee
     *
     * @return return isBusinessPurposeCompleted value
     */
    Boolean getIsBusinessPurposeCompletedForWorkforcePerson(String workforcePersonID);

	List<WorkAssignments> readWorkAssignmentsOfWorkforcePerson(String workforcePersonId);
}
