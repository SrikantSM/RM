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

import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

class SkillConsumptionRepositoryTest extends InitMocks {

    @Mock
    private PersistenceService mockPersistenceService;

    @InjectMocks
    @Autowired
    private SkillConsumptionRepository classUnderTest;

    @Test
    @DisplayName("check if findById() returns a skillConsumption when skill id exists")
    void testFindById() {
        final String skillId = UUID.randomUUID().toString();
        final SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setId(skillId);
        final CqnSelect select = Select.from(SkillsConsumption_.class).where(skill -> skill.ID().eq(skillId)).columns(
                SkillsConsumption_::_all,
                skill -> skill.proficiencySet().expand(set -> set.proficiencyLevels().expand()));

        final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

        Optional<SkillsConsumption> expectedResult = Optional.of(skillsConsumption);
        Result mockResult = mock(Result.class);
        when(mockResult.first(SkillsConsumption.class)).thenReturn(expectedResult);
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        Optional<SkillsConsumption> actualResult = this.classUnderTest.findById(skillId);

        verify(mockPersistenceService, times(1))
                .run(argThat((CqnSelect cqn) -> cqn.toString().equals(select.toString())));
        verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

        assertEquals(actualResult, expectedResult);
    }

    @Test
    @DisplayName("check if findById() returns an empty optional when skill id does not exist")
    void testFindByIdWithNotExistingId() {
        final String skillId = UUID.randomUUID().toString();
        final SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setId(skillId);
        final CqnSelect select = Select.from(SkillsConsumption_.class).where(skill -> skill.ID().eq(skillId)).columns(
                SkillsConsumption_::_all,
                skill -> skill.proficiencySet().expand(set -> set.proficiencyLevels().expand()));

        final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

        Optional<SkillsConsumption> expectedResult = Optional.empty();
        Result mockResult = mock(Result.class);
        when(mockResult.first(SkillsConsumption.class)).thenReturn(expectedResult);
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        Optional<SkillsConsumption> actualResult = this.classUnderTest.findById(skillId);

        verify(mockPersistenceService, times(1))
                .run(argThat((CqnSelect cqn) -> cqn.toString().equals(select.toString())));
        verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

        assertEquals(actualResult, expectedResult);
    }

}
