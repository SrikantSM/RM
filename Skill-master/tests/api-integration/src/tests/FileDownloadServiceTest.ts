// import { AxiosInstance } from 'axios';
// import { assert } from 'chai';
// import { suite, test } from 'mocha-typescript';
// import {
//   AlternativeLabelRepository, CatalogRepository, Catalogs2SkillsRepository, EntityDraftMode, ProficiencyLevelRepository, ProficiencyLevelTextRepository, ProficiencySetRepository, SkillRepository, SkillTextRepository,
// } from 'test-commons';
// import { BaseApiTest, testEnvironment } from '../utils';
// import { correctDefaultLanguage, correctNonDefaultLanguage } from './data';
// import {
//   alternativeLabels, catalogs, catalogs2Skills, csvLinesDefaultLanguage, csvLinesNonDefaultLanguage, proficiencyLevels, proficiencyLevelTexts, proficiencySets, skills, skillTexts,
// } from './data/FileDownloadData';

// @suite
// export class FileDownloadServiceTest extends BaseApiTest {
//   private static readonly CSV_HEADER = 'conceptType,conceptUri,skillUUID,skillType,preferredLabel,altLabels,description,usage,catalogs,proficiencySet,proficiencyLevelUUID,proficiencyLevel,proficiencyLevelName';

//   private static fileDownloadServiceClient: AxiosInstance;

//   private static skillRepository: SkillRepository;

//   private static skillTextRepository: SkillTextRepository;

//   private static alternativeLabelRepository: AlternativeLabelRepository;

//   private static catalogRepository: CatalogRepository;

//   private static catalogs2SkillsRepository: Catalogs2SkillsRepository;

//   private static proficiencySetRepository: ProficiencySetRepository;

//   private static proficiencyLevelRepository: ProficiencyLevelRepository;

//   private static proficiencyLevelTextRepository: ProficiencyLevelTextRepository;

//   static async before() {
//     FileDownloadServiceTest.fileDownloadServiceClient = await testEnvironment.getFileDownloadServiceClient();
//     FileDownloadServiceTest.skillRepository = await testEnvironment.getSkillRepository();
//     FileDownloadServiceTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
//     FileDownloadServiceTest.alternativeLabelRepository = await testEnvironment.getAlternativeLabelRepository();
//     FileDownloadServiceTest.catalogRepository = await testEnvironment.getCatalogRepository();
//     FileDownloadServiceTest.catalogs2SkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
//     FileDownloadServiceTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
//     FileDownloadServiceTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
//     FileDownloadServiceTest.proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
//   }

//   async before() {
//     await FileDownloadServiceTest.proficiencySetRepository.insertMany(proficiencySets, EntityDraftMode.ACTIVE_ONLY);
//     await FileDownloadServiceTest.proficiencyLevelRepository.insertMany(proficiencyLevels, EntityDraftMode.ACTIVE_ONLY);
//     await FileDownloadServiceTest.proficiencyLevelTextRepository.insertMany(proficiencyLevelTexts, EntityDraftMode.ACTIVE_ONLY);
//     await FileDownloadServiceTest.skillRepository.insertMany(skills, EntityDraftMode.ACTIVE_ONLY);
//     await FileDownloadServiceTest.skillTextRepository.insertMany(skillTexts, EntityDraftMode.ACTIVE_ONLY);
//     await FileDownloadServiceTest.alternativeLabelRepository.insertMany(alternativeLabels, EntityDraftMode.ACTIVE_ONLY);
//     await FileDownloadServiceTest.catalogRepository.insertMany(catalogs, EntityDraftMode.ACTIVE_ONLY);
//     await FileDownloadServiceTest.catalogs2SkillsRepository.insertMany(catalogs2Skills, EntityDraftMode.ACTIVE_ONLY);
//     this.setCorrelationId(FileDownloadServiceTest.fileDownloadServiceClient);
//   }

//   async after() {
//     super.after();
//     await FileDownloadServiceTest.skillRepository.deleteMany(skills);
//     await FileDownloadServiceTest.skillTextRepository.deleteMany(skillTexts);
//     await FileDownloadServiceTest.alternativeLabelRepository.deleteMany(alternativeLabels);
//     await FileDownloadServiceTest.catalogRepository.deleteMany(catalogs);
//     await FileDownloadServiceTest.catalogs2SkillsRepository.deleteMany(catalogs2Skills);
//     await FileDownloadServiceTest.proficiencySetRepository.deleteMany(proficiencySets);
//     await FileDownloadServiceTest.proficiencyLevelRepository.deleteMany(proficiencyLevels);
//     await FileDownloadServiceTest.proficiencyLevelTextRepository.deleteMany(proficiencyLevelTexts);
//   }

//   @test
//   async 'Download file successfully (default language)'() {
//     this.response = await this.downloadSkills(correctDefaultLanguage.code);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     assert.equal(this.response.headers['content-type'], 'text/csv', 'Content-Type should be text/csv');
//     assert.isAtLeast(Number(this.response.headers['skills-downloaded-counter']), csvLinesDefaultLanguage.length);
//     assert.isAtLeast(Number(this.response.headers['skills-not-downloaded-counter']), 1);
//     const fileDownloadLines = this.response.data.split('\r\n');
//     assert.equal(fileDownloadLines[0], FileDownloadServiceTest.CSV_HEADER);

//     csvLinesDefaultLanguage.forEach((line) => {
//       assert.include(this.response.data, line, 'Line for default language is present');
//     });
//     csvLinesNonDefaultLanguage.forEach((line) => {
//       assert.notInclude(this.response.data, line, 'Line for non-default language is not present');
//     });
//   }

//   @test
//   async 'Download file successfully (non-default language)'() {
//     this.response = await this.downloadSkills(correctNonDefaultLanguage.code);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     assert.isAtLeast(Number(this.response.headers['skills-downloaded-counter']), csvLinesNonDefaultLanguage.length);
//     assert.isAtLeast(Number(this.response.headers['skills-not-downloaded-counter']), 4);

//     const fileDownloadLines = this.response.data.split('\r\n');
//     assert.equal(fileDownloadLines[0], FileDownloadServiceTest.CSV_HEADER);

//     csvLinesNonDefaultLanguage.forEach((line) => {
//       assert.include(this.response.data, line, 'Line for non-default language is present');
//     });
//     csvLinesDefaultLanguage.forEach((line) => {
//       assert.notInclude(this.response.data, line, 'Line for default language is not present');
//     });
//   }

//   @test
//   async 'Download file unsuccessfully (no language)'() {
//     this.response = await FileDownloadServiceTest.fileDownloadServiceClient.get('');
//     assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
//   }

//   @test
//   async 'Download file unsuccessfully (empty language)'() {
//     this.response = await this.downloadSkills('');
//     assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
//   }

//   @test
//   async 'Download file unsuccessfully (invalid language)'() {
//     this.response = await this.downloadSkills('<invalid_language>');
//     assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
//   }

//   private async downloadSkills(language: string) {
//     return FileDownloadServiceTest.fileDownloadServiceClient.get(`?language=${language}`);
//   }
// }
