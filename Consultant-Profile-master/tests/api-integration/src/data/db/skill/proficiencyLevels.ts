import { ProficiencyLevel } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    proficiencySet1, proficiencySet2, proficiencySet3, proficiencySet4,
} from './proficiencySets';

const setOneProficiencyLevel1: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 1.1',
    description: 'Proficiency level 1.1 description',
    proficiencySet_ID: proficiencySet1.ID,
    rank: 1,
};

const setOneProficiencyLevel2: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 1.2',
    description: 'Proficiency level 1.2 description',
    proficiencySet_ID: proficiencySet1.ID,
    rank: 2,
};

const setTwoProficiencyLevel1: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 2.1',
    description: 'Proficiency level 2.1 description',
    proficiencySet_ID: proficiencySet2.ID,
    rank: 1,
};

const setTwoProficiencyLevel2: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 2.2',
    description: 'Proficiency level 2.2 description',
    proficiencySet_ID: proficiencySet2.ID,
    rank: 2,
};

const setThreeProficiencyLevel1: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 3.1',
    description: 'Proficiency level 3.1 description',
    proficiencySet_ID: proficiencySet3.ID,
    rank: 1,
};

const setThreeProficiencyLevel2: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 3.2',
    description: 'Proficiency level 3.2 description',
    proficiencySet_ID: proficiencySet3.ID,
    rank: 2,
};

const setFourProficiencyLevel1: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 4.1',
    description: 'Proficiency level 4.1 description',
    proficiencySet_ID: proficiencySet4.ID,
    rank: 1,
};

const setFourProficiencyLevel2: ProficiencyLevel = {
    ID: uuid(),
    name: 'Proficiency Level 4.2',
    description: 'Proficiency level 4.2 description',
    proficiencySet_ID: proficiencySet4.ID,
    rank: 2,
};

const allProficiencyLevel = [
    setOneProficiencyLevel1,
    setOneProficiencyLevel2,
    setTwoProficiencyLevel1,
    setTwoProficiencyLevel2,
    setThreeProficiencyLevel1,
    setThreeProficiencyLevel2,
    setFourProficiencyLevel1,
    setFourProficiencyLevel2,
];

export {
    allProficiencyLevel,
    setOneProficiencyLevel1,
    setOneProficiencyLevel2,
    setTwoProficiencyLevel1,
    setTwoProficiencyLevel2,
    setThreeProficiencyLevel1,
    setThreeProficiencyLevel2,
    setFourProficiencyLevel1,
    setFourProficiencyLevel2,
};
