const uuid = require('uuid').v4;
const { correctProficiencyLevelOne, correctProficiencyLevelTwo, correctDraftProficiencyLevel } = require('./ProficiencyLevels');

const correctProficiencyLevelOneText = Object.freeze({
  ID_texts: uuid(),
  locale: 'en',
  name: 'CorrectProficiencyLevelOne',
  description: 'CorrectProficiencyLevelOne',
  ID: correctProficiencyLevelOne.ID,
});

const correctProficiencyLevelTwoText = Object.freeze({
  ID_texts: uuid(),
  locale: 'en',
  name: 'CorrectProficiencyLevelTwo',
  description: 'CorrectProficiencyLevelTwo',
  ID: correctProficiencyLevelTwo.ID,
});

const correctDraftProficiencyLevelText = Object.freeze({
  ID_texts: uuid(),
  locale: 'en',
  name: 'CorrectDraftProficiencyLevel',
  description: 'CorrectDraftProficiencyLevel',
  ID: correctDraftProficiencyLevel.ID,
});

const allProficiencyLevelTexts = [correctProficiencyLevelOneText, correctProficiencyLevelTwoText, correctDraftProficiencyLevelText];
module.exports = {
  allProficiencyLevelTexts, correctProficiencyLevelOneText, correctProficiencyLevelTwoText, correctDraftProficiencyLevelText,
};
