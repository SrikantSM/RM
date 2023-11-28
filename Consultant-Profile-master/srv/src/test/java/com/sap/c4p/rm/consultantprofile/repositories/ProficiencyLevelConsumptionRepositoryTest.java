package com.sap.c4p.rm.consultantprofile.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption;
import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption_;

class ProficiencyLevelConsumptionRepositoryTest extends InitMocks {

    @Mock
    private PersistenceService mockPersistenceService;

    @InjectMocks
    @Autowired
    private ProficiencyLevelConsumptionRepository classUnderTest;

    @Test
    @DisplayName("check if findById() returns a proficiencyLevelConsumption when proficiency level id exists")
    void findById() {
        final String proficiencyLevelId = UUID.randomUUID().toString();
        final ProficiencyLevelsConsumption proficiencyLevelConsumption = ProficiencyLevelsConsumption.create();
        proficiencyLevelConsumption.setId(proficiencyLevelId);

        final CqnSelect select = Select.from(ProficiencyLevelsConsumption_.class)
                .where(proficiencyLevel -> proficiencyLevel.ID().eq(proficiencyLevelId))
                .columns(ProficiencyLevelsConsumption_::_all);

        final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

        Optional<ProficiencyLevelsConsumption> expectedResult = Optional.of(proficiencyLevelConsumption);
        Result mockResult = mock(Result.class);
        when(mockResult.first(ProficiencyLevelsConsumption.class)).thenReturn(expectedResult);
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        Optional<ProficiencyLevelsConsumption> actualResult = this.classUnderTest.findById(proficiencyLevelId);

        verify(mockPersistenceService, times(1))
                .run(argThat((CqnSelect cqn) -> cqn.toString().equals(select.toString())));
        verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

        assertEquals(actualResult, expectedResult);
    }

    @Test
    @DisplayName("check if findById() returns an empty optional when skill id does not exist")
    void findByIdWithNotExistingId() {
        final String proficiencyLevelId = UUID.randomUUID().toString();
        final ProficiencyLevelsConsumption proficiencyLevelsConsumption = ProficiencyLevelsConsumption.create();
        proficiencyLevelsConsumption.setId(proficiencyLevelId);

        final CqnSelect select = Select.from(ProficiencyLevelsConsumption_.class)
                .where(proficiencyLevel -> proficiencyLevel.ID().eq(proficiencyLevelId))
                .columns(ProficiencyLevelsConsumption_::_all);

        final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

        Optional<ProficiencyLevelsConsumption> expectedResult = Optional.empty();
        Result mockResult = mock(Result.class);
        when(mockResult.first(ProficiencyLevelsConsumption.class)).thenReturn(expectedResult);
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        Optional<ProficiencyLevelsConsumption> actualResult = this.classUnderTest.findById(proficiencyLevelId);

        verify(mockPersistenceService, times(1))
                .run(argThat((CqnSelect cqn) -> cqn.toString().equals(select.toString())));
        verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

        assertEquals(actualResult, expectedResult);
    }
}
