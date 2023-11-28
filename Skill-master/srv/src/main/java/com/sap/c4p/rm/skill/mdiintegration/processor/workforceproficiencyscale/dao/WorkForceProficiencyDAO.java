package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao;

import java.util.List;

import com.sap.cds.Row;

import com.sap.resourcemanagement.skill.ProficiencySets;

public interface WorkForceProficiencyDAO {
  void save(final ProficiencySets proficiencySet);

  List<ProficiencySets> readAll();

  Row getExistingProfSet(String profScaleID);

  void update(ProficiencySets proficiencySet);

  Row getExistingProfLevel(String profLevelID);

  Boolean isProficiencySetRestrictionAllowed(String proficiencySetID);

  void restrictProficiencySet(String proficiencySetID);

  String getProficiencySetName(String proficiencySetId);
}
