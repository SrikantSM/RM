package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao;

import java.util.List;

import com.sap.resourcemanagement.skill.Catalogs2Skills;
import com.sap.resourcemanagement.skill.Skills;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

public interface WorkforceCapabilityReplicationDAO {
  void save(final Skills skills, List<Catalogs2Skills> catalogs2SkillsList);

  void save(final Skills skills, List<Catalogs2Skills> catalogs2SkillsList,
      final ReplicationFailures replicationFailures);

  void update(final Skills skills, List<Catalogs2Skills> catalogs2SkillsList);

  void update(final Skills skills, List<Catalogs2Skills> catalogs2SkillsList,
      final ReplicationFailures replicationFailures);

  void restrictSkill(final String skillID, final ReplicationFailures replicationFailures);
}
