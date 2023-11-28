package com.sap.c4p.rm.assignment.enums;

public enum AssignmentStatus {

  HARDBOOKED(0),
  SOFTBOOKED(1),
  PROPOSED(2),
  ACCEPTED(3),
  REJECTED(4);

  private int code;

  private AssignmentStatus(int code) {
    this.code = code;
  }

  public int getCode() {
    return this.code;
  }

}
