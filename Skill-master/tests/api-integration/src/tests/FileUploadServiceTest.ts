// import { AxiosInstance } from 'axios';
// import { assert } from 'chai';
// import { readFile, readFileSync } from 'fs';
// import { suite, test } from 'mocha-typescript';
// import {
//   Catalog, ProficiencySet, EntityDraftMode, Skill, SkillRepository, CatalogRepository, ProficiencySetRepository,
// } from 'test-commons';
// import { promisify } from 'util';
// import { v4 as uuid } from 'uuid';
// import { BaseApiTest, testEnvironment } from '../utils';
// import {
//   correctDefaultLanguage, correctProficiencySet, nonExistingLanguage, correctSkill, catalog1, catalog2,
// } from './data';
// // eslint-disable-next-line import/order
// import FormData = require('form-data');

// function waitAsync(timeout: number = 2000): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, timeout));
// }

// @suite
// export class FileUploadServiceTest extends BaseApiTest {
//   private static appUser: string;

//   private static fileUploadServiceClient: AxiosInstance;

//   private static serviceClient: AxiosInstance;

//   private static skillRepository: SkillRepository;

//   private static catalogRepository: CatalogRepository;

//   private static proficiencySetRepository: ProficiencySetRepository;

//   private createdSkills: Skill[] = [];

//   private createdCatalogs: Catalog[] = [];

//   private createdProficiencySets: ProficiencySet[] = [];

//   static async before() {
//     FileUploadServiceTest.serviceClient = await testEnvironment.getServiceClient();
//     FileUploadServiceTest.appUser = (await testEnvironment.getEnvironment()).appUsers.get('CONFIGURATIONEXPERT') || '';
//     FileUploadServiceTest.fileUploadServiceClient = await testEnvironment.getFileUploadServiceClient();
//     FileUploadServiceTest.skillRepository = await testEnvironment.getSkillRepository();
//     FileUploadServiceTest.catalogRepository = await testEnvironment.getCatalogRepository();
//     FileUploadServiceTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
//   }

//   async before() {
//     this.setCorrelationId(FileUploadServiceTest.serviceClient);
//     this.setCorrelationId(FileUploadServiceTest.fileUploadServiceClient);
//   }

//   async after() {
//     super.after();
//     await FileUploadServiceTest.skillRepository.deleteManyByData(this.createdSkills);
//     await FileUploadServiceTest.catalogRepository.deleteMany(this.createdCatalogs);
//     await FileUploadServiceTest.proficiencySetRepository.deleteMany(this.createdProficiencySets);
//   }

//   @test
//   async 'POST correct file with Content-Language header'() {
//     const externalUUID = uuid();
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('valid-file.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//   }

//   @test
//   async 'POST correct file without Content-Language header'() {
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('valid-file.csv', {}, () => uuid());
//     assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
//   }

//   @test
//   async 'POST correct file with non existing language in Content-Language header'() {
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('valid-file.csv', { 'Content-Language': nonExistingLanguage.code }, () => uuid());
//     assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
//     assert.equal(this.response.data.message, `The language "${nonExistingLanguage.code}" doesn't exist. Please enter a valid language code.`, 'Expected error message');
//   }

//   @test
//   async 'PATCH and PUT FileUploadService'() {
//     await this.waitForFinish(true);
//     this.response = await FileUploadServiceTest.fileUploadServiceClient.patch('/', {});
//     assert.equal(this.response.status, 405, 'Expected status code of PATCH request to be 405 (METHOD NOT ALLOWED)');

//     this.response = await FileUploadServiceTest.fileUploadServiceClient.put('/', {});
//     assert.equal(this.response.status, 405, 'Expected status code of PUT request to be 405 (METHOD NOT ALLOWED)');
//   }

//   @test
//   async 'POST with incorrect media type'() {
//     await this.waitForFinish(true);
//     this.response = await FileUploadServiceTest.fileUploadServiceClient.post('/', {}, {
//       headers: {
//         'Content-Type': 'application/xml',
//       },
//     });

//     assert.equal(this.response.status, 415, 'Expected status code to be 415 (UNSUPPORTED MEDIA TYPE)');
//   }

//   @test
//   async 'POST no file'() {
//     await this.waitForFinish(true);
//     this.response = await FileUploadServiceTest.fileUploadServiceClient.post('/', {}, {
//       headers: new FormData().getHeaders({ 'Content-Language': correctDefaultLanguage.code }),
//     });

//     assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
//   }

//   @test
//   async 'POST multiple files'() {
//     await this.waitForFinish(true);
//     const formData = new FormData();
//     for (let i = 0; i < 2; i += 1) {
//       formData.append('file', readFileSync('src/tests/data/file-upload-service/valid-file.csv', 'utf8'), {
//         filename: 'valid-file.csv',
//       });
//     }

//     this.response = await FileUploadServiceTest.fileUploadServiceClient.post('/', formData, {
//       headers: formData.getHeaders({ 'Content-Language': correctDefaultLanguage.code }),
//     });

//     assert.equal(this.response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
//   }

//   @test
//   async 'POST empty file'() {
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('empty-file.csv', { 'Content-Language': correctDefaultLanguage.code }, () => uuid());
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//   }

//   @test
//   async 'POST file with correct non-existing skill'() {
//     const externalUUID = uuid();
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('not-existing-skill.csv', { 'Content-Language': correctDefaultLanguage.code }, (() => externalUUID));
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=texts & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.data.value[0].proficiencySet_ID, ProficiencySetRepository.defaultProficiencySetId, 'Expected default proficiency set to be assigned to the skill.');
//     assert.equal(this.response.data.value[0].description, 'Description of new skill', 'Expected description to be persisted in the skill.');
//     assert.isDefined(this.response.data.value[0].texts.find((label: any) => label.name === 'values'), 'Expected label to be created');
//   }

//   @test
//   async 'POST file with existing active skill'() {
//     const externalUUID = uuid();
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('not-existing-skill.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await this.uploadFile('existing-skill.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.data.value[0].description, 'Updated description of existing skill', 'Expected description to be persisted in the skill.');
//     assert.equal(this.response.data.value.length, 1, 'Expected only one existing skill.');
//   }

//   @test
//   async 'POST file with existing draft skill of another user'() {
//     FileUploadServiceTest.skillRepository.insertOne(correctSkill, EntityDraftMode.DRAFT_ONLY, 'AnotherUser');
//     this.createdSkills.push({ externalID: correctSkill.externalID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('existing-skill.csv', { 'Content-Language': correctDefaultLanguage.code }, () => correctSkill.externalID!);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$filter=externalID eq '${correctSkill.externalID}' and IsActiveEntity eq true`);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     assert.equal(this.response.data.value[0].description, 'Updated description of existing skill', 'Expected description to be persisted in the skill.');
//   }

//   @test
//   async 'POST file with existing correct skill and a new alternative label'() {
//     const externalUUID = uuid();
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('not-existing-skill.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await this.uploadFile('existing-skill-with-new-alternative-label.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=alternativeLabels & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.data.value.length, 1, 'Expected all old alternative names to be cleared');
//     assert.equal(this.response.data.value[0].alternativeLabels[0].name, 'new label', 'Expected the alternative label "new label"');
//   }

//   @test
//   async 'POST file with correct skill and existing catalogs'() {
//     const externalUUID = uuid();

//     const catalog1WithUUID = { ...catalog1, name: `${catalog1.name} ${externalUUID}` };
//     const catalog2WithUUID = { ...catalog2, name: `${catalog2.name} ${externalUUID}` };
//     this.createdCatalogs.push(catalog1WithUUID);
//     this.createdCatalogs.push(catalog2WithUUID);

//     await FileUploadServiceTest.catalogRepository.insertMany([catalog1WithUUID, catalog2WithUUID], EntityDraftMode.BOTH, FileUploadServiceTest.appUser);

//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithCatalogs.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=catalogAssociations & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.status, 200, 'Expected status code of read catalogs for a skill to be 200 (OK).');
//     assert.equal(this.response.data.value[0].catalogAssociations.length, 2, 'Expected 2 catalogs are assigned.');
//   }

//   @test
//   async 'POST file with correct skill and not existing catalogs'() {
//     const externalUUID = uuid();
//     const catalog1WithUUID = { ...catalog1, name: `${catalog1.name} ${externalUUID}` };
//     const catalog2WithUUID = { ...catalog2, name: `${catalog2.name} ${externalUUID}` };
//     this.createdCatalogs.push(catalog1WithUUID);
//     this.createdCatalogs.push(catalog2WithUUID);

//     await FileUploadServiceTest.catalogRepository.insertMany([catalog1WithUUID, catalog2WithUUID], EntityDraftMode.BOTH, FileUploadServiceTest.appUser);

//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithNotExistingCatalog.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);

//     assert.equal(this.response.data.state, 'warning', 'Expected all old alternative names to be cleared');
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=catalogAssociations & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.status, 200, 'Expected status code of read catalogs for a skill to be 200 (OK).');
//     assert.equal(this.response.data.value[0].catalogAssociations.length, 0, 'Expected 0 catalogs are assigned.');
//   }

//   @test
//   async 'POST file with correct skill and update assigned catalogs'() {
//     const externalUUID = uuid();

//     const catalog1WithUUID = { ...catalog1, name: `${catalog1.name} ${externalUUID}` };
//     const catalog2WithUUID = { ...catalog2, name: `${catalog2.name} ${externalUUID}` };
//     this.createdCatalogs.push(catalog1WithUUID);
//     this.createdCatalogs.push(catalog2WithUUID);

//     await FileUploadServiceTest.catalogRepository.insertMany([catalog1WithUUID, catalog2WithUUID], EntityDraftMode.BOTH, FileUploadServiceTest.appUser);

//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithCatalogs.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=catalogAssociations & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.status, 200, 'Expected status code of read catalogs for a skill to be 200 (OK).');
//     assert.equal(this.response.data.value[0].catalogAssociations.length, 2, 'Expected 2 catalogs are assigned.');

//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithCatalogsUpdate.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=catalogAssociations & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.status, 200, 'Expected status code of read catalogs for a skill to be 200 (OK).');
//     assert.equal(this.response.data.value[0].catalogAssociations.length, 1, 'Expected 1 catalogs are assigned.');
//   }

//   @test
//   async 'POST file with correct skill no catalog column'() {
//     const externalUUID = uuid();

//     const catalog1WithUUID = { ...catalog1, name: `${catalog1.name} ${externalUUID}` };
//     const catalog2WithUUID = { ...catalog2, name: `${catalog2.name} ${externalUUID}` };
//     this.createdCatalogs.push(catalog1WithUUID);
//     this.createdCatalogs.push(catalog2WithUUID);

//     await FileUploadServiceTest.catalogRepository.insertMany([catalog1WithUUID, catalog2WithUUID], EntityDraftMode.BOTH, FileUploadServiceTest.appUser);

//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithCatalogs.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=catalogAssociations & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.status, 200, 'Expected status code of read catalogs for a skill to be 200 (OK).');
//     assert.equal(this.response.data.value[0].catalogAssociations.length, 2, 'Expected 2 catalogs are assigned.');

//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('valid-file.csv', { 'Content-Language': correctDefaultLanguage.code }, () => externalUUID);
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=catalogAssociations & $filter=externalID eq '${externalUUID}'`);
//     assert.equal(this.response.status, 200, 'Expected status code of read catalogs for a skill to be 200 (OK).');
//     assert.equal(this.response.data.value[0].catalogAssociations.length, 2, 'Expected 2 catalogs are assigned.');
//   }

//   @test
//   async 'POST file with forbidden first character in skill description'() {
//     const externalUUID = uuid();
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithForbiddenFirstCharacter.csv', { 'Content-Language': correctDefaultLanguage.code }, (() => externalUUID));
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=texts & $filter=externalID eq '${externalUUID}'`);
//     assert.isDefined(this.response.data.value, 'Expected no skill was created');
//   }

//   @test
//   async 'POST file with not existing proficiency set name'() {
//     const externalUUID = uuid();
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithNotExistingProficiencySet.csv', { 'Content-Language': correctDefaultLanguage.code }, (() => externalUUID));
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=texts & $filter=externalID eq '${externalUUID}'`);
//     assert.isDefined(this.response.data.value, 'Expected no skill was created');
//   }

//   @test
//   async 'POST file with empty existing proficiency set name'() {
//     const externalUUID = uuid();
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithEmptyProficiencySet.csv', { 'Content-Language': correctDefaultLanguage.code }, (() => externalUUID));
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=texts & $filter=externalID eq '${externalUUID}'`);
//     assert.isDefined(this.response.data.value, 'Expected no skill was created');
//   }

//   @test
//   async 'POST file with existing proficiency set name'() {
//     const externalUUID = uuid();
//     const proficiencySet = { ...correctProficiencySet, name: 'Correct Proficiency Set' };
//     this.createdSkills.push({ externalID: externalUUID } as Skill);
//     this.createdProficiencySets.push(proficiencySet);
//     await FileUploadServiceTest.proficiencySetRepository.insertOne(proficiencySet);
//     await this.waitForFinish(true);
//     this.response = await this.uploadFile('skillWithExistingProficiencySet.csv', { 'Content-Language': correctDefaultLanguage.code }, (() => externalUUID));
//     assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
//     await this.waitForFinish(false);
//     this.response = await FileUploadServiceTest.serviceClient.get(`/SkillService/Skills?$expand=texts & $filter=externalID eq '${externalUUID}'`);
//     assert.match(this.response.data.value[0].proficiencySet_ID, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'Expected proficiency set to be assigned to the skill.');
//     assert.equal(this.response.data.value[0].description, 'VALID DESCRIPTION 1', 'Expected description to be persisted in the skill.');
//     assert.isDefined(this.response.data.value[0].texts.find((label: any) => label.name === 'values'), 'Expected label to be created');
//   }

//   private async uploadFile(name: string, additionalHeaders: any = {}, generateId: () => string) {
//     const formData = new FormData();

//     let fileContent = await promisify(readFile)(`src/tests/data/file-upload-service/${name}`, 'utf8');

//     fileContent = fileContent.replace(/\{uuid\(\)\}/g, generateId);
//     formData.append('file', fileContent, {
//       filename: name,
//     });

//     const response = await FileUploadServiceTest.fileUploadServiceClient.post('/', formData, {
//       headers: formData.getHeaders(additionalHeaders),
//     });

//     return response;
//   }

//   private async waitForFinish(bWithTimeout: boolean): Promise<void> {
//     this.response = await FileUploadServiceTest.serviceClient.get('/FileUploadService/UploadJob');
//     while (this.response.data.state === 'running') {
//       if (bWithTimeout) {
//         await waitAsync();
//       }
//       this.response = await FileUploadServiceTest.serviceClient.get('/FileUploadService/UploadJob');
//     }
//   }
// }
