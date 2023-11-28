package com.sap.c4p.rm.skill.utils;

public enum UploadJobStates {
  INITIAL("initial"),
  RUNNING("running"),
  SUCCESS("success"),
  WARNING("warning"),
  ERROR("error"),
  INTERRUPTED("interrupted");

  String value;

  private UploadJobStates(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }
}
