const uuid = require('uuid').v4;

const proficiencySet1 = {
    ID: uuid(),
    name: 'ProficiencySet 1',
    description: 'Description proficiency Set 1',
    isCustom: true,
};

const proficiencySet2 = {
    ID: uuid(),
    name: 'ProficiencySet 2',
    description: 'Description proficiency Set 2',
    isCustom: false,
};

const proficiencySet3 = {
    ID: uuid(),
    name: 'ProficiencySet 3',
    description: 'Description proficiency Set 3',
    isCustom: false,
};

const proficiencySet4 = {
    ID: uuid(),
    name: 'ProficiencySet 4',
    description: 'Description proficiency Set 4',
    isCustom: false,
};

const proficiencySet5 = {
    ID: uuid(),
    name: 'ProficiencySet 5',
    description: 'Description proficiency Set 5',
    isCustom: false,
};

const defaultProficiencySet = {
    ID: '8a2cc2c3-4a46-47f0-ae67-2ac67c673aae',
    name: 'Default Proficiency Set',
    description: 'Description default proficiency Set',
    isCustom: false,
};

const proficiencySetData = [proficiencySet1, proficiencySet2, proficiencySet3, proficiencySet4, proficiencySet5, defaultProficiencySet];

module.exports = {
    proficiencySetData,
    defaultProficiencySet,
    proficiencySet1,
    proficiencySet2,
    proficiencySet3,
    proficiencySet4,
    proficiencySet5,
};
