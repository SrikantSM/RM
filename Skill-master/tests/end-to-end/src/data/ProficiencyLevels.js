const uuid = require('uuid').v4;
const { correctProficiencySet } = require('./ProficiencySets');

const correctProficiencyLevelOne = Object.freeze({
  ID: uuid(),
  proficiencySet_ID: correctProficiencySet.ID,
  name: 'CorrectProficiencyLevelOne',
  description: 'CorrectProficiencyLevelOne',
  rank: 1,
});

const correctProficiencyLevelTwo = Object.freeze({
  ID: uuid(),
  proficiencySet_ID: correctProficiencySet.ID,
  name: 'CorrectProficiencyLevelTwo',
  description: 'CorrectProficiencyLevelTwo',
  rank: 2,
});

const correctDraftProficiencyLevel = Object.freeze({
  ID: uuid(),
  proficiencySet_ID: correctProficiencySet.ID,
  name: 'CorrectDraftProficiencyLevel',
  description: 'CorrectDraftProficiencyLevel',
  rank: 1,
});

const allProficiencyLevels = [correctProficiencyLevelOne, correctProficiencyLevelTwo, correctDraftProficiencyLevel];
module.exports = {
  allProficiencyLevels, correctProficiencyLevelOne, correctProficiencyLevelTwo, correctDraftProficiencyLevel,
};
