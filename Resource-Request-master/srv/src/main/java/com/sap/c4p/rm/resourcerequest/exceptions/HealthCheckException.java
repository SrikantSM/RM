package com.sap.c4p.rm.resourcerequest.exceptions;

public class HealthCheckException extends Exception {

  private static final long serialVersionUID = 1L;

  public HealthCheckException(final String message, final Throwable inner) {
    super(message, inner);
  }

}
