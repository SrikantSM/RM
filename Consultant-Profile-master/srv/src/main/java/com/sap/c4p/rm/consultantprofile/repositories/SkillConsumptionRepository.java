package com.sap.c4p.rm.consultantprofile.repositories;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

@Repository
public class SkillConsumptionRepository {

    private final PersistenceService persistenceService;

    @Autowired
    public SkillConsumptionRepository(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    public Optional<SkillsConsumption> findById(String skillId) {

        final CqnSelect select = Select.from(SkillsConsumption_.class).where(skill -> skill.ID().eq(skillId)).columns(
                SkillsConsumption_::_all,
                skill -> skill.proficiencySet().expand(set -> set.proficiencyLevels().expand()));

        return persistenceService.run(select).first(SkillsConsumption.class);
    }

}
