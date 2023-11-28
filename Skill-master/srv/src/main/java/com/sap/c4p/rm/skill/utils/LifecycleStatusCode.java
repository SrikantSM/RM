package com.sap.c4p.rm.skill.utils;

public enum LifecycleStatusCode {
  UNRESTRICTED(0, "unrestricted"),
  RESTRICTED(1, "restricted");

  Integer code;
  String description;

  private LifecycleStatusCode(Integer code, String description) {
    this.code = code;
    this.description = description;
  }

  public Integer getCode() {
    return this.code;
  }

  public String getDescription() {
    return this.description;
  }
}
