package com.sap.c4p.rm.projectintegrationadapter.util;

import java.util.Objects;

public class ReplicationMessageImpl implements ReplicationMessage {

  private final Severity severity;

  private final String message;

  public ReplicationMessageImpl(Severity severity, String message) {

    this.severity = Objects.requireNonNull(severity, "severity must not be null");
    this.message = message;
  }

  @Override
  public String getMessage() {
    return message;
  }

  @Override
  public Severity getSeverity() {
    return severity;
  }

}
