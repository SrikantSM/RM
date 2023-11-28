import { IEnvironment, TestEnvironment } from 'test-commons';

export async function getInsertStaticDataSkillEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: any): Promise<any> {
  console.log('getInsertStaticDataSkillEntitiesPromises is called.');

  const proficiencySets = (await testEnvironmentInstance.getProficiencySetRepository()).insertMany(data.proficiencySets);
  const proficiencyLevels = (await testEnvironmentInstance.getProficiencyLevelRepository()).insertMany(data.proficiencyLevels);
  const proficiencyLevelTexts = (await testEnvironmentInstance.getProficiencyLevelTextRepository()).insertMany(data.proficiencyLevelTexts);
  const catalogs = (await testEnvironmentInstance.getCatalogRepository()).insertMany(data.catalogs);
  const skills = (await testEnvironmentInstance.getSkillRepository()).insertMany(data.skills);
  const catalogs2skills = (await testEnvironmentInstance.getCatalogs2SkillsRepository()).insertMany(data.catalogs2skills);
  const skillTexts = (await testEnvironmentInstance.getSkillTextRepository()).insertMany(data.skillTexts);
  const alternativeLabels = (await testEnvironmentInstance.getAlternativeLabelRepository()).insertMany(data.alternativeLabels);

  return Promise.all([proficiencySets, proficiencyLevels, proficiencyLevelTexts, catalogs, skills, catalogs2skills, skillTexts, alternativeLabels]);
}

export async function getInsertDynamicDataSkillEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: Map<string, any[]>): Promise<any> {
  console.log('getInsertDynamicDataSkillEntitiesPromises is called.');
}
