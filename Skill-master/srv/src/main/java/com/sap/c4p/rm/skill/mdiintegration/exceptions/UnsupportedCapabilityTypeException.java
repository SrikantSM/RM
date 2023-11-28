package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * Exception Class to capture when we receive a record other than "SKILL"
 * capability type This Class extends {@link ReplicationException} to provide
 * some generic functionality for replication exceptions
 */
public class UnsupportedCapabilityTypeException extends ReplicationException {

  public UnsupportedCapabilityTypeException(String... parameters) {
    super(null, ReplicationErrorCodes.CAPABILITY_TYPE_UNSUPPORTED, parameters);
  }

}
