package com.sap.c4p.rm.consultantprofile.repositories;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption;
import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption_;

@Repository
public class ProficiencyLevelConsumptionRepository {

    private final PersistenceService persistenceService;

    @Autowired
    public ProficiencyLevelConsumptionRepository(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    public Optional<ProficiencyLevelsConsumption> findById(String proficiencyLevelId) {
        final CqnSelect select = Select.from(ProficiencyLevelsConsumption_.class)
                .where(proficiencyLevel -> proficiencyLevel.ID().eq(proficiencyLevelId))
                .columns(ProficiencyLevelsConsumption_::_all);

        return persistenceService.run(select).first(ProficiencyLevelsConsumption.class);
    }
}
