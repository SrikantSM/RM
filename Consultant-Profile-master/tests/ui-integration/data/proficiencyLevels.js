const uuid = require('uuid').v4;
const proficiencySets = require('./proficiencySets');

const firstProficiencyLevelSet1 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet1.ID,
    rank: 1,
    name: 'Associate Set 1',
    description: 'Associate level',
};

const secondProficiencyLevelSet1 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet1.ID,
    rank: 2,
    name: 'Advanced Set 1',
    description: 'Advanced level',
};

const firstProficiencyLevelSet2 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet2.ID,
    rank: 1,
    name: 'Associate Set 2',
    description: 'Associate level',
};

const secondProficiencyLevelSet2 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet2.ID,
    rank: 2,
    name: 'Advanced Set 2',
    description: 'Advanced level',
};

const firstProficiencyLevelSet3 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet3.ID,
    rank: 1,
    name: 'Associate Set 3',
    description: 'Associate level',
};

const secondProficiencyLevelSet3 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet3.ID,
    rank: 2,
    name: 'Advanced Set 3',
    description: 'Advanced level',
};

const firstProficiencyLevelSet4 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet4.ID,
    rank: 1,
    name: 'Associate Set 4',
    description: 'Associate level',
};

const secondProficiencyLevelSet4 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet4.ID,
    rank: 2,
    name: 'Advanced Set 4',
    description: 'Advanced level',
};

const firstProficiencyLevelSet5 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet5.ID,
    rank: 1,
    name: 'Associate Set 5',
    description: 'Associate level',
};

const secondProficiencyLevelSet5 = {
    ID: uuid(),
    proficiencySet_ID: proficiencySets.proficiencySet5.ID,
    rank: 2,
    name: 'Advanced Set 5',
    description: 'Advanced level',
};

const defaultProficiencyLevel = {
    ID: '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee',
    proficiencySet_ID: proficiencySets.defaultProficiencySet.ID,
    rank: 3,
    name: 'Not set',
    description: 'description not set',
};

const proficiencyLevelData = [
    firstProficiencyLevelSet1,
    secondProficiencyLevelSet1,
    firstProficiencyLevelSet2,
    secondProficiencyLevelSet2,
    firstProficiencyLevelSet3,
    secondProficiencyLevelSet3,
    firstProficiencyLevelSet4,
    secondProficiencyLevelSet4,
    firstProficiencyLevelSet5,
    secondProficiencyLevelSet5,
    defaultProficiencyLevel];

module.exports = {
    proficiencyLevelData,
    firstProficiencyLevelSet1,
    secondProficiencyLevelSet1,
    firstProficiencyLevelSet2,
    secondProficiencyLevelSet2,
    firstProficiencyLevelSet3,
    secondProficiencyLevelSet3,
    firstProficiencyLevelSet4,
    secondProficiencyLevelSet4,
    firstProficiencyLevelSet5,
    secondProficiencyLevelSet5,

};
