import { ProficiencySet } from 'test-commons';
import { v4 as uuid } from 'uuid';

const proficiencySet1: ProficiencySet = {
    ID: uuid(),
    name: `ProficiencySet1 ${uuid()}`,
    description: 'Proficiency set 1 description',
    isCustom: true,
};

const proficiencySet2: ProficiencySet = {
    ID: uuid(),
    name: `ProficiencySet2 ${uuid()}`,
    description: 'Proficiency set 2 description',
    isCustom: true,
};

const proficiencySet3: ProficiencySet = {
    ID: uuid(),
    name: `ProficiencySet3 ${uuid()}`,
    description: 'Proficiency set 3 description',
    isCustom: true,
};

const proficiencySet4: ProficiencySet = {
    ID: uuid(),
    name: `ProficiencySet4 ${uuid()}`,
    description: 'Proficiency set 4 description',
    isCustom: true,
};

const allProficiencySet = [proficiencySet1, proficiencySet2, proficiencySet3, proficiencySet4];

export {
    allProficiencySet,
    proficiencySet1,
    proficiencySet2,
    proficiencySet3,
    proficiencySet4,
};
