const uuid = require('uuid').v4;

const correctProficiencySet = Object.freeze({
  ID: uuid(),
  name: 'CorrectProficiencySet',
  description: 'CorrectProficiencySet',
  isCustom: true,
});

const correctDraftProficiencySet = Object.freeze({
  ID: uuid(),
  name: 'CorrectDraftProficiencySet',
  description: 'CorrectDraftProficiencySet',
});

const allProficiencySets = [correctProficiencySet, correctDraftProficiencySet];
module.exports = {
  allProficiencySets, correctProficiencySet, correctDraftProficiencySet,
};
