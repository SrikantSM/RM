package com.sap.c4p.rm.skill.precompilation;

public class PrecompilationException extends Exception {

  private static final long serialVersionUID = 1L;

  public PrecompilationException(final String message, final Throwable inner) {
    super(message, inner);
  }
}