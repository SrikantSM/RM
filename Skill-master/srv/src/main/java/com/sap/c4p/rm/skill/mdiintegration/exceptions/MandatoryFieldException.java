package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * Exception Class to capture the mandatory fields missing such as oid This
 * Class extends {@link ReplicationException} to provide some generic
 * functionality for replication exceptions
 */
public class MandatoryFieldException extends ReplicationException {

  public MandatoryFieldException(String... parameters) {
    super(null, ReplicationErrorCodes.DOES_NOT_HAVE_MANDATORY, parameters);
  }

}
