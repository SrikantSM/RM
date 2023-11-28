package com.sap.c4p.rm.assignment.exception;

public class HealthCheckException extends Exception {

  private static final long serialVersionUID = 1L;

  public HealthCheckException(final String message, final Throwable inner) {
    super(message, inner);
  }

}