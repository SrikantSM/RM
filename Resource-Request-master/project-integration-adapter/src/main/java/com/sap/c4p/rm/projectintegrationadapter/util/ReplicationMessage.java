package com.sap.c4p.rm.projectintegrationadapter.util;

public interface ReplicationMessage {

  /**
   * @return The message string
   */
  String getMessage();

  /**
   * The severity of the message.
   * 
   * @return The severity
   */
  Severity getSeverity();

  /**
   * Severity levels.
   */
  enum Severity {

    SUCCESS(1), // Success - no action required

    INFO(2), // Information - no action required

    WARNING(3), // Warning - action may be required

    ERROR(4); // Error - action is required

    private final int numericSeverity;

    private Severity(int numericSeverity) {
      this.numericSeverity = numericSeverity;
    }

    public int getNumericSeverity() {
      return numericSeverity;
    }

  }

}
