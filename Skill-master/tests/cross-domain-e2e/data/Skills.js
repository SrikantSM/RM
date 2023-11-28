const uuid = require('uuid').v4;

function getSkillData(testRunId, proficiencySetData) {
  const sampleSkills = [
    {
      ID: uuid(),
      description: `HTML5 ${testRunId}`,
      lifecycleStatus_code: 0,
      name: `HTML5 ${testRunId}`,
      proficiencySet_ID: proficiencySetData.correctProficiencySet.ID,
    },
    {
      ID: uuid(),
      description: `Java ${testRunId}`,
      lifecycleStatus_code: 0,
      name: `Java ${testRunId}`,
      proficiencySet_ID: proficiencySetData.correctProficiencySet.ID,
    },
    {
      ID: uuid(),
      description: `JavaScript ${testRunId}`,
      lifecycleStatus_code: 0,
      name: `JavaScript ${testRunId}`,
      proficiencySet_ID: proficiencySetData.correctProficiencySet.ID,
    },
  ];

  const sampleSkillTexts = sampleSkills.map((skill) => ({
    ID_texts: uuid(),
    locale: 'en',
    ID: skill.ID,
    name: skill.name,
    description: skill.description,
  }));

  return { sampleSkills, sampleSkillTexts };
}

module.exports = getSkillData;
