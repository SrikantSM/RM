package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao;

import java.util.List;

import com.sap.cds.Row;

import com.sap.resourcemanagement.skill.Catalogs2Skills;
import com.sap.resourcemanagement.skill.Skills;

public interface WorkforceCapabilityDAO {
  void save(final Skills skills, List<Catalogs2Skills> catalogs2SkillsList);

  Row getExistingSkill(String skillID);

  Row getExistingProfID(String profID);

  void update(final Skills skills, List<Catalogs2Skills> catalogs2SkillsList);

  Row getExistingCatalogID(String catalogOID);

  void restrictSkill(String skillID);
  List<Skills> readAll();
}
