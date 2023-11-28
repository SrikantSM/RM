const path = require('path');
const getSkillData = require('./Skills');
const getSkillUploadCsvData = require('./SkillUploadCsv');
const getProficiencySetData = require('./ProficiencySets');

async function setupTestData(testHelper) {
  const proficiencySetData = getProficiencySetData(testHelper.testRunID);
  const skillData = getSkillData(testHelper.testRunID, proficiencySetData);
  const skillRepository = await testHelper.utils.getSkillRepository();
  const skillTextRepository = await testHelper.utils.getSkillTextRepository();
  const proficiencySetRepository = await testHelper.utils.getProficiencySetRepository();
  const proficiencyLevelRepository = await testHelper.utils.getProficiencyLevelRepository();
  const proficiencyLevelTextRepository = await testHelper.utils.getProficiencyLevelTextRepository();

  await proficiencySetRepository.insertOne(proficiencySetData.correctProficiencySet);
  await proficiencyLevelRepository.insertOne(proficiencySetData.correctProficiencyLevelOne);
  await proficiencyLevelTextRepository.insertOne(proficiencySetData.correctProficiencyLevelOneText);
  await skillRepository.insertMany(skillData.sampleSkills);
  await skillTextRepository.insertMany(skillData.sampleSkillTexts);
  await createSkillUploadCsv(testHelper);
  testHelper.testData.skill = {
    skills: skillData.sampleSkills,
    skillTexts: skillData.sampleSkillTexts,
    proficiencySets: [proficiencySetData.correctProficiencySet],
    proficiencyLevels: [proficiencySetData.correctProficiencyLevelOne],
    proficiencyLevelTexts: [proficiencySetData.correctProficiencyLevelOneText],
  };
}

async function teardownTestData(testHelper) {
  try {
    const skillRepository = await testHelper.utils.getSkillRepository();
    await skillRepository.deleteMany(testHelper.testData.skill.skills);
  } catch (err) {
    console.warn(err);
  }
  try {
    const proficiencySetRepository = await testHelper.utils.getProficiencySetRepository();
    await proficiencySetRepository.deleteMany(testHelper.testData.skill.proficiencySets);
  } catch (err) {
    console.warn(err);
  }
}

async function createSkillUploadCsv(testHelper) {
  try {
    const targetFilePath = path.resolve(__dirname, './small_skills_en.csv');
    const skills = getSkillUploadCsvData(testHelper.testRunID);
    const csvWriter = testHelper.utils.getCsvWriter();
    await csvWriter.createCsvFile(targetFilePath, skills);
  } catch (err) {
    console.warn(err);
  }
}

module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
