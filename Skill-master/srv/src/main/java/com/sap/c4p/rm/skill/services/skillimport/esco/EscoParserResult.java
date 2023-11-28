package com.sap.c4p.rm.skill.services.skillimport.esco;

import skillservice.Skills;

public class EscoParserResult {

  private final String affectedEntity;
  private final Skills skill;
  private final String[] catalogNames;

  public EscoParserResult(final String affectedEntity, final Skills skill, final String[] catalogNames) {
    this.affectedEntity = affectedEntity;
    this.skill = skill;
    this.catalogNames = catalogNames;
  }

  public String getAffectedEntity() {
    return this.affectedEntity;
  }

  public Skills getSkill() {
    return this.skill;
  }

  public String[] getCatalogNames() {
    return this.catalogNames;
  }
}
