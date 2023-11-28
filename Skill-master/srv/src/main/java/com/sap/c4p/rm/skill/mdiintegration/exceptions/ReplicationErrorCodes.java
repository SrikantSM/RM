package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * An Enum class to provide the codes for different replication exceptions
 * scenarios
 */
public enum ReplicationErrorCodes {

  DB_TRANSACTION("RM_SKILL_001"),
  DOES_NOT_HAVE_MANDATORY("RM_SKILL_002"),
  RECORD_DOES_NOT_EXIST("RM_SKILL_003"),
  INVALID_DESTINATION_RESPONSE("RM_SKILL_004"),
  INCORRECT_DESTINATION_CONFIGURATION("RM_SKILL_005"),
  MDI_URL_ERROR("RM_SKILL_006"),
  DELTA_TOKEN_MISMATCH("RM_SKILL_007"),
  CONFLICT("RM_SKILL_008"),
  TIMEOUT("RM_SKILL_009"),
  UNKNOWN("RM_SKILL_010"),
  EXCEPTION("RM_SKILL_011"),
  DESTINATION_NOT_FOUND("RM_SKILL_012"),
  CAPABILITY_TYPE_UNSUPPORTED("RM_SKILL_014"),
  CANNOT_DELETE_CATALOGS("RM_SKILL_015"),
  CANNOT_RESTRICT_PROFICIENCY_SET("RM_SKILL_016"),
  CANNOT_ASSIGN_RESTRICTED_PROFICIENCY_SET("RM_SKILL_017");
  private final String errorCode;

  ReplicationErrorCodes(String errorCode) {
    this.errorCode = errorCode;
  }

  public String getErrorCode() {
    return this.errorCode;
  }
}
