const uuid = require('uuid').v4;

function getProficiencySetData(testRunId) {
  const correctProficiencySet = Object.freeze({
    ID: uuid(),
    name: `CorrectProficiencySet ${testRunId}`,
    description: `CorrectProficiencySet ${testRunId}`,
    isCustom: true,
  });

  const correctProficiencyLevelOne = Object.freeze({
    ID: uuid(),
    proficiencySet_ID: correctProficiencySet.ID,
    name: `CorrectProficiencyLevelOne ${testRunId}`,
    description: `CorrectProficiencyLevelOne ${testRunId}`,
    rank: 1,
  });

  const correctProficiencyLevelOneText = Object.freeze({
    ID_texts: uuid(),
    locale: 'en',
    name: `CorrectProficiencyLevelOne ${testRunId}`,
    description: `CorrectProficiencyLevelOne ${testRunId}`,
    ID: correctProficiencyLevelOne.ID,
  });

  return { correctProficiencySet, correctProficiencyLevelOne, correctProficiencyLevelOneText };
}
module.exports = getProficiencySetData;
