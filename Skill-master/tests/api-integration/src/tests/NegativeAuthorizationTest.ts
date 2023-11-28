// import { AxiosInstance } from 'axios';
// import { assert } from 'chai';
// import { readFile } from 'fs';
// import { suite, test } from 'mocha-typescript';
// import {
//   AlternativeLabel, AlternativeLabelRepository, EntityDraftMode, Skill, SkillRepository, SkillText, SkillTextRepository, Catalog, CatalogRepository, Catalogs2Skills, Catalogs2SkillsRepository, ProficiencySet, ProficiencySetRepository, ProficiencyLevel, ProficiencyLevelRepository,
// } from 'test-commons';
// import { promisify } from 'util';
// import { v4 as uuid } from 'uuid';
// import { BaseApiTest, testEnvironment } from '../utils';
// import {
//   correctAlternativeLabel, correctCreateSkillWithDialogParameters, correctCreateCatalogWithDialogParameters, correctSkill, correctSkillText, correctCatalog, correctCatalog2Skill, correctProficiencySet, correctProficiencyLevel,
// } from './data';
// // eslint-disable-next-line import/order
// import FormData = require('form-data');
//
// @suite
// export class NegativeAuthorizationTest extends BaseApiTest {
//   private static appUser: string;
//
//   private static serviceClient: AxiosInstance;
//
//   private static fileUploadServiceClient: AxiosInstance;
//
//   private static fileDownloadServiceClient: AxiosInstance;
//
//   private static healthCheckServiceClient: AxiosInstance;
//
//   private static skillRepository: SkillRepository;
//
//   private static skillTextRepository: SkillTextRepository;
//
//   private static alternativeLabelRepository: AlternativeLabelRepository;
//
//   private static catalogRepository: CatalogRepository;
//
//   private static catalogs2SkillsRepository: Catalogs2SkillsRepository;
//
//   private static proficiencySetRepository: ProficiencySetRepository;
//
//   private static proficiencyLevelRepository: ProficiencyLevelRepository;
//
//   private createdSkills: Skill[] = [];
//
//   private createdCatalogs: Catalog[] = [];
//
//   private createdProficiencySets: ProficiencySet[] = [];
//
//   static async before() {
//     NegativeAuthorizationTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
//     NegativeAuthorizationTest.serviceClient = await testEnvironment.getServiceClientUnauthorized();
//     NegativeAuthorizationTest.fileUploadServiceClient = await testEnvironment.getFileUploadServiceClientUnauthorized();
//     NegativeAuthorizationTest.fileDownloadServiceClient = await testEnvironment.getFileDownloadServiceClientUnauthorized();
//     NegativeAuthorizationTest.healthCheckServiceClient = await testEnvironment.getHealthCheckServiceClient();
//     NegativeAuthorizationTest.skillRepository = await testEnvironment.getSkillRepository();
//     NegativeAuthorizationTest.skillTextRepository = await testEnvironment.getSkillTextRepository();
//     NegativeAuthorizationTest.alternativeLabelRepository = await testEnvironment.getAlternativeLabelRepository();
//     NegativeAuthorizationTest.catalogRepository = await testEnvironment.getCatalogRepository();
//     NegativeAuthorizationTest.catalogs2SkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
//     NegativeAuthorizationTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
//     NegativeAuthorizationTest.proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
//   }
//
//   async before() {
//     this.setCorrelationId(NegativeAuthorizationTest.serviceClient);
//     this.setCorrelationId(NegativeAuthorizationTest.fileUploadServiceClient);
//     this.setCorrelationId(NegativeAuthorizationTest.fileDownloadServiceClient);
//     this.setCorrelationId(NegativeAuthorizationTest.healthCheckServiceClient);
//   }
//
//   async after() {
//     super.after();
//     await NegativeAuthorizationTest.skillRepository.deleteMany(this.createdSkills);
//     await NegativeAuthorizationTest.catalogRepository.deleteMany(this.createdCatalogs);
//     await NegativeAuthorizationTest.proficiencySetRepository.deleteMany(this.createdProficiencySets);
//   }
//
//   @test
//   async 'READ ProficiencySets without Authorization'() {
//     this.response = await NegativeAuthorizationTest.serviceClient.get('/ProficiencyService/ProficiencySets');
//
//     assert.equal(this.response.status, 200, 'Expected status code of proficiency set reading to be 200 (OK).');
//   }
//
//   @test
//   async 'CREATE ProficiencySets without Authorization'() {
//     this.response = await NegativeAuthorizationTest.serviceClient.post('/ProficiencyService/ProficiencySets', correctProficiencySet);
//
//     assert.equal(this.response.status, 403, 'Expected status code of draft edit request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'EDIT ProficiencySet without Authorization'() {
//     await NegativeAuthorizationTest.proficiencySetRepository.insertOne(correctProficiencySet);
//     this.createdProficiencySets.push(correctProficiencySet);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)/ProficiencyService.draftEdit`, {});
//
//     assert.equal(this.response.status, 403, 'Expected status code of draft edit request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'ACTIVATE ProficiencySet without Authorization'() {
//     await NegativeAuthorizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.DRAFT_ONLY, NegativeAuthorizationTest.appUser);
//     this.createdProficiencySets.push(correctProficiencySet);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)/ProficiencyService.draftActivate`, {});
//
//     assert.equal(this.response.status, 403, 'Expected status code of draft activate request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'PATCH the name of an existing inactive proficiency set'() {
//     await NegativeAuthorizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdProficiencySets.push(correctProficiencySet);
//
//     const patchBody = {
//       name: uuid(),
//     };
//
//     this.response = await NegativeAuthorizationTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=false)`, patchBody);
//
//     assert.equal(this.response.status, 403, 'Expected status code of label PATCH request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'POST to ProficiencySets/proficiencyLevels with correct data'() {
//     await NegativeAuthorizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdProficiencySets.push(correctProficiencySet);
//
//     const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${correctCatalog.ID},IsActiveEntity=false)/proficiencyLevels`, proficiencyLevel);
//
//     assert.equal(this.response.status, 403, 'Expected status code of proficiency level to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'DELETE existing active proficiency level'() {
//     await NegativeAuthorizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdProficiencySets.push(correctProficiencySet);
//
//     const proficiencyLevel = { ...correctProficiencyLevel, proficiencySet_ID: correctProficiencySet.ID } as ProficiencyLevel;
//     await NegativeAuthorizationTest.proficiencyLevelRepository.insertOne(proficiencyLevel);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.delete(`/ProficiencyService/ProficiencyLevels(ID=${proficiencyLevel.ID},IsActiveEntity=true)`);
//     assert.equal(this.response.status, 403, 'Expected status code of proficiency level deletion to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'DELETE existing active proficiency set'() {
//     await NegativeAuthorizationTest.proficiencySetRepository.insertOne(correctProficiencySet, EntityDraftMode.ACTIVE_ONLY, NegativeAuthorizationTest.appUser);
//     this.createdProficiencySets.push(correctProficiencySet);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.delete(`/ProficiencyService/ProficiencySets(ID=${correctProficiencySet.ID},IsActiveEntity=true)`);
//
//     assert.equal(this.response.status, 403, 'Expected status code of proficiency set deletion to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'READ Catalogs without Authorization'() {
//     this.response = await NegativeAuthorizationTest.serviceClient.get('/CatalogService/Catalogs');
//
//     assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
//   }
//
//   @test
//   async 'CREATE Catalog without Authorization'() {
//     this.response = await NegativeAuthorizationTest.serviceClient.post('/CatalogService/Catalogs/CatalogService.createCatalogWithDialog', correctCreateCatalogWithDialogParameters);
//
//     assert.equal(this.response.status, 403, 'Expected status code of catalog creation to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'EDIT Catalog without Authorization'() {
//     await NegativeAuthorizationTest.catalogRepository.insertOne(correctCatalog);
//     this.createdCatalogs.push(correctCatalog);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)/CatalogService.draftEdit`, {});
//
//     assert.equal(this.response.status, 403, 'Expected status code of draft edit request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'ACTIVATE Catalog without Authorization'() {
//     await NegativeAuthorizationTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.DRAFT_ONLY, NegativeAuthorizationTest.appUser);
//     this.createdCatalogs.push(correctCatalog);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/CatalogService.draftActivate`, {});
//
//     assert.equal(this.response.status, 403, 'Expected status code of draft activate request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'PATCH the name of an existing inactive catalog'() {
//     await NegativeAuthorizationTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdCatalogs.push(correctCatalog);
//
//     const patchBody = {
//       name: uuid(),
//     };
//
//     this.response = await NegativeAuthorizationTest.serviceClient.patch(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)`, patchBody);
//
//     assert.equal(this.response.status, 403, 'Expected status code of label PATCH request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'POST to Catalogs/skillAssociations with correct data'() {
//     await NegativeAuthorizationTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdCatalogs.push(correctCatalog);
//
//     const catalogs2skills = { ...correctCatalog2Skill, skill_ID: correctSkill.ID } as Catalogs2Skills;
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=false)/skillAssociations`, catalogs2skills);
//
//     assert.equal(this.response.status, 403, 'Expected status code of skill assignment to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'DELETE existing active skillAssociation'() {
//     await NegativeAuthorizationTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdCatalogs.push(correctCatalog);
//
//     await NegativeAuthorizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdSkills.push(correctSkill);
//
//     const catalogs2Skills = { ...correctCatalog2Skill, catalog_ID: correctCatalog.ID, skill_ID: correctSkill.ID } as Catalogs2Skills;
//     await NegativeAuthorizationTest.catalogs2SkillsRepository.insertOne(catalogs2Skills);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.delete(`/CatalogService/Catalogs2Skills(ID=${catalogs2Skills.ID},IsActiveEntity=true)`);
//     assert.equal(this.response.status, 403, 'Expected status code of skillAssociation deletion to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'DELETE existing active catalog'() {
//     await NegativeAuthorizationTest.catalogRepository.insertOne(correctCatalog, EntityDraftMode.ACTIVE_ONLY, NegativeAuthorizationTest.appUser);
//     this.createdCatalogs.push(correctCatalog);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.delete(`/CatalogService/Catalogs(ID=${correctCatalog.ID},IsActiveEntity=true)`);
//
//     assert.equal(this.response.status, 403, 'Expected status code of catalog deletion to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'READ Skills without Authorization'() {
//     this.response = await NegativeAuthorizationTest.serviceClient.get('/SkillService/Skills');
//
//     assert.equal(this.response.status, 200, 'Expected status code of skill reading to be 200 (OK).');
//   }
//
//   @test
//   async 'CREATE Skill without Authorization'() {
//     this.response = await NegativeAuthorizationTest.serviceClient.post('/SkillService/Skills/SkillService.createSkillWithDialog', correctCreateSkillWithDialogParameters);
//
//     assert.equal(this.response.status, 403, 'Expected status code of skill creation to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'Restrict Skill without Authorization'() {
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.restrict`, {});
//
//     assert.equal(this.response.status, 403, 'Expected status code of skill restriction to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'EDIT Skill without Authorization'() {
//     await NegativeAuthorizationTest.skillRepository.insertOne(correctSkill);
//     this.createdSkills.push(correctSkill);
//
//     const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
//     NegativeAuthorizationTest.skillTextRepository.insertOne(skillText);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=true)/SkillService.draftEdit`, {});
//
//     assert.equal(this.response.status, 403, 'Expected status code of draft edit request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'ACTIVATE Skill without Authorization'() {
//     await NegativeAuthorizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, NegativeAuthorizationTest.appUser);
//     this.createdSkills.push(correctSkill);
//
//     const skillText = { ...correctSkillText, ID: correctSkill.ID, name: correctSkill.name } as SkillText;
//     await NegativeAuthorizationTest.skillTextRepository.insertOne(skillText, EntityDraftMode.DRAFT_ONLY, NegativeAuthorizationTest.appUser);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/SkillService.draftActivate`, {});
//
//     assert.equal(this.response.status, 403, 'Expected status code of draft activate request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'PATCH the name of an existing inactive skill text'() {
//     await NegativeAuthorizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdSkills.push(correctSkill);
//
//     const patchBody = {
//       name: uuid(),
//     };
//
//     const skillText = { ...correctSkillText, ID: correctSkill.ID } as SkillText;
//     await NegativeAuthorizationTest.skillTextRepository.insertOne(skillText, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.patch(`/SkillService/Skills_texts(ID_texts=${skillText.ID_texts},IsActiveEntity=false)`, patchBody);
//
//     assert.equal(this.response.status, 403, 'Expected status code of label PATCH request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'PATCH the name of an existing inactive alternative label'() {
//     await NegativeAuthorizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdSkills.push(correctSkill);
//
//     const patchBody = {
//       name: uuid(),
//     };
//
//     const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
//     await NegativeAuthorizationTest.alternativeLabelRepository.insertOne(alternativeLabel, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.patch(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=false)`, patchBody);
//
//     assert.equal(this.response.status, 403, 'Expected status code of label PATCH request to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'POST to Skill/alternativeLabels with correct data'() {
//     await NegativeAuthorizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdSkills.push(correctSkill);
//
//     const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
//
//     this.response = await NegativeAuthorizationTest.serviceClient.post(`/SkillService/Skills(ID=${correctSkill.ID},IsActiveEntity=false)/alternativeLabels`, alternativeLabel);
//
//     assert.equal(this.response.status, 403, 'Expected status code of label creation to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'DELETE existing active alternative label'() {
//     await NegativeAuthorizationTest.skillRepository.insertOne(correctSkill, EntityDraftMode.BOTH, NegativeAuthorizationTest.appUser);
//     this.createdSkills.push(correctSkill);
//
//     const alternativeLabel = { ...correctAlternativeLabel, skill_ID: correctSkill.ID } as AlternativeLabel;
//     await NegativeAuthorizationTest.alternativeLabelRepository.insertOne(alternativeLabel);
//
//     this.response = await NegativeAuthorizationTest.serviceClient.delete(`/SkillService/AlternativeLabels(ID=${alternativeLabel.ID},IsActiveEntity=true)`);
//     assert.equal(this.response.status, 403, 'Expected status code of alternative label deletion to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'UPLOAD Skills without Authorization'() {
//     this.response = await this.uploadFile('valid-file.csv', { 'Content-Language': correctDefaultLanguage.code }, () => uuid());
//
//     assert.equal(this.response.status, 403, 'Expected status code to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'DOWNLOAD Skills without Authorization'() {
//     this.response = await NegativeAuthorizationTest.fileDownloadServiceClient.get(`?language=${correctDefaultLanguage.code}`);
//
//     assert.equal(this.response.status, 403, 'Expected status code to be 403 (Forbidden).');
//   }
//
//   @test
//   async 'GET actuator info endpoint without Authorization'() {
//     this.response = await NegativeAuthorizationTest.healthCheckServiceClient.get('/info');
//
//     assert.equal(this.response.status, 401, 'Expected status code of info endpoint to be 401 (Unauthorized).');
//   }
//
//   @test
//   async 'GET actuator health endpoint does not reveal detailed information'() {
//     this.response = await NegativeAuthorizationTest.healthCheckServiceClient.get('/health');
//
//     assert.equal(this.response.status, 200, 'Expected status code of health endpoint to be 200 (OK).');
//
//     const responseBody = this.response.data;
//     assert.deepEqual(responseBody, { status: 'UP' }, 'Expected response body to not contain any details besides overall status');
//   }
//
//   private async uploadFile(name: string, additionalHeaders: any = {}, generateId: () => string) {
//     const formData = new FormData();
//
//     let fileContent = await promisify(readFile)(`src/tests/data/file-upload-service/${name}`, 'utf8');
//
//     fileContent = fileContent.replace(/\{uuid\(\)\}/g, generateId);
//     formData.append('file', fileContent, {
//       filename: name,
//     });
//
//     const response = await NegativeAuthorizationTest.fileUploadServiceClient.post('/', formData, {
//       headers: formData.getHeaders(additionalHeaders),
//     });
//
//     if (response.status === 200) {
//       for (const createdItem of response.data.createdItems) {
//         this.createdSkills.push({ ID: createdItem.ID } as Skill);
//       }
//
//       for (const error of response.data.errors) {
//         if (error.failedItem.ID) {
//           this.createdSkills.push({ ID: error.failedItem.ID } as Skill);
//         }
//       }
//     }
//
//     return response;
//   }
// }
