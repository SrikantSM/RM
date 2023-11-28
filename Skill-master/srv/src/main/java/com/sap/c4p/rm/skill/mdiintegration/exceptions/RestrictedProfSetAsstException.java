package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * Exception Class to capture the restricted proficiency set assignment to skills.
 * This Class extends {@link ReplicationException} to
 * provide some generic functionality for replication exceptions
 */
public class RestrictedProfSetAsstException extends ReplicationException {
// Cannot assign proficiency set {} to skill {}, as the proficiency set is restricted.
  public RestrictedProfSetAsstException(String... parameters) {
    super(null, ReplicationErrorCodes.CANNOT_ASSIGN_RESTRICTED_PROFICIENCY_SET, parameters);
  }

}
