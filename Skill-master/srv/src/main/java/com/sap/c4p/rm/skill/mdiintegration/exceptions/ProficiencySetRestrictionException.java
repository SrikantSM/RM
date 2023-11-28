package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * Exception Class to capture the ProficiencySet Restriction failure.
 * This Class extends {@link ReplicationException} to
 * provide some generic functionality for replication exceptions
 */
public class ProficiencySetRestrictionException extends ReplicationException {
// Cannot restrict ProficiencySet {0}, as there are unrestricted skills assigned to it.
  public ProficiencySetRestrictionException(String... parameters) {
    super(null, ReplicationErrorCodes.CANNOT_RESTRICT_PROFICIENCY_SET, parameters);
  }

}
