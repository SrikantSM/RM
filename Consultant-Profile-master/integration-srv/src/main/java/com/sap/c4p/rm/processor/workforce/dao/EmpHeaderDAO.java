package com.sap.c4p.rm.processor.workforce.dao;

import com.sap.resourcemanagement.employee.Headers;

/**
 * An Interface to perform the DAO related operation for {@link Headers}
 */
public interface EmpHeaderDAO {

    /**
     * Method to save the document/record of worker/employee
     *
     * @param employeeHeader: Represents a document/record.
     */
    void save(final Headers employeeHeader);

    /**
     * Method to check if employee exists or not
     *
     * @param employeeId: {@link Headers} id
     * @return return true if worker exists else return false
     */
    boolean isExists(final String employeeId);

}
