const uuid = require('uuid').v4;
const proficiencySets = require('./proficiencyLevels');

const proficiencyText1 = {
    ID: proficiencySets.firstProficiencyLevelSet1.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Associate Set 1',
    description: 'Associate level',
};

const proficiencyText2 = {
    ID: proficiencySets.secondProficiencyLevelSet1.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Advanced Set 1',
    description: 'Advanced level',
};

const proficiencyText3 = {
    ID: proficiencySets.firstProficiencyLevelSet2.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Associate Set 2',
    description: 'Associate level',
};

const proficiencyText4 = {
    ID: proficiencySets.secondProficiencyLevelSet2.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Advanced Set 2',
    description: 'Advanced level',
};

const proficiencyText5 = {
    ID: proficiencySets.firstProficiencyLevelSet3.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Associate Set 3',
    description: 'Associate level',
};

const proficiencyText6 = {
    ID: proficiencySets.secondProficiencyLevelSet3.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Advanced Set 3',
    description: 'Advanced level',
};

const proficiencyText7 = {
    ID: proficiencySets.firstProficiencyLevelSet4.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Associate Set 4',
    description: 'Associate level',
};

const proficiencyText8 = {
    ID: proficiencySets.secondProficiencyLevelSet4.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Advanced Set 4',
    description: 'Advanced level',
};

const proficiencyText9 = {
    ID: proficiencySets.firstProficiencyLevelSet5.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Associate Set 5',
    description: 'Associate level',
};

const proficiencyText10 = {
    ID: proficiencySets.secondProficiencyLevelSet5.ID,
    ID_texts: uuid(),
    locale: 'en',
    name: 'Advanced Set 5',
    description: 'Advanced level',
};

const proficiencyTextData = [
    proficiencyText1,
    proficiencyText2,
    proficiencyText3,
    proficiencyText4,
    proficiencyText5,
    proficiencyText6,
    proficiencyText7,
    proficiencyText8,
    proficiencyText9,
    proficiencyText10];

module.exports = {
    proficiencyTextData,
    proficiencyText1,
    proficiencyText2,
    proficiencyText3,
    proficiencyText4,
    proficiencyText5,
    proficiencyText6,
    proficiencyText7,
    proficiencyText8,
    proficiencyText9,
    proficiencyText10,
};
