package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * Exception Class to capture the record not existing in Db such as
 * proficiencySet , Catalog This Class extends {@link ReplicationException} to
 * provide some generic functionality for replication exceptions
 */
public class RecordNotFoundException extends ReplicationException {

  public RecordNotFoundException(String... parameters) {
    super(null, ReplicationErrorCodes.RECORD_DOES_NOT_EXIST, parameters);
  }

}
