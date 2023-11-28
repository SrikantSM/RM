package com.sap.c4p.rm.skill.esco;

/**
 * Enumeration of CScolumns contained in the ESCO CSV file format
 */
public enum EscoCsvColumn {

  CONCEPT_TYPE("conceptType"),
  DESCRIPTION("description"),
  SKILL_UUID("skillUUID"),
  PREFERRED_LABEL("preferredLabel"),
  ALTERNATIVE_LABELS("altLabels"),
  EXTERNAL_ID("conceptUri"),
  SKILL_TYPE("skillType"),
  USAGE("usage"),
  CATALOGS("catalogs"),
  PROFICIENCY_SET("proficiencySet"),
  PROFICIENCY_LEVEL_UUID("proficiencyLevelUUID"),
  PROFICIENCY_LEVEL("proficiencyLevel"),
  PROFICIENCY_LEVEL_NAME("proficiencyLevelName");

  private final String column;

  private EscoCsvColumn(final String column) {
    this.column = column;
  }

  public String getName() {
    return this.column;
  }
}
