package com.sap.c4p.rm.assignment.enums;

public enum CapacityGridAssignmentAction {

  UPDATE_DRAFT(0),
  DELETE_EXISTING_DRAFT_AND_GET_FRESH_DRAFT(1),
  ACTIVATE_DRAFT(2),
  DELETE_EXISTING_DRAFT(3),
  EXTEND_DRAFT_EXPIRY(4);

  private int actionCode;

  private CapacityGridAssignmentAction(int actionCode) {
    this.actionCode = actionCode;
  }

  public int getActionCode() {
    return this.actionCode;
  }

}
