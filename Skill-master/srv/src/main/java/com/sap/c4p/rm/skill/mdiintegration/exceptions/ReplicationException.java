package com.sap.c4p.rm.skill.mdiintegration.exceptions;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * This is base class to provide and capture replication failures
 */
public class ReplicationException extends RuntimeException {

  private final ReplicationErrorCodes replicationErrorCodes;
  private final List<String> parameters;
  private final Throwable throwable;

  public ReplicationException(Throwable throwable, ReplicationErrorCodes replicationErrorCodes, String... parameters) {
    this.throwable = throwable;
    this.replicationErrorCodes = replicationErrorCodes;
    this.parameters = new ArrayList<>(Arrays.asList(parameters));
    for (int i = parameters.length; i < 4; i++)
      this.parameters.add(null);
  }

  public ReplicationException(ReplicationException replicationException) {
    this.replicationErrorCodes = replicationException.replicationErrorCodes;
    this.parameters = replicationException.parameters;
    this.throwable = replicationException.throwable;
  }

  public ReplicationErrorCodes getReplicationErrorCode() {
    return this.replicationErrorCodes;
  }

  public List<String> getParameters() {
    return this.parameters;
  }

  public Throwable getThrowable() {
    return throwable;
  }
}
