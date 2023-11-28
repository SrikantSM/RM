package com.sap.c4p.rm.skill.utils;

public enum UploadErrorTypes {
  GENERAL("1-general"),
  PARSING("2-parsing"),
  SAVE("3-save"),
  MISSING_CATALOG("4-missingCatalog");

  private final String value;

  private UploadErrorTypes(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }
}
