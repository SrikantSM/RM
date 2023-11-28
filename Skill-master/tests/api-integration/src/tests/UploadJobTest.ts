import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Skill, SkillRepository } from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
// eslint-disable-next-line import/order

function waitAsync(timeout: number = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

@suite
export class UploadJobTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static fileUploadServiceClient: AxiosInstance;

  private static skillRepository: SkillRepository;

  private createdSkills: Skill[] = [];

  static async before() {
    UploadJobTest.fileUploadServiceClient = await testEnvironment.getFileUploadServiceClient();
    UploadJobTest.serviceClient = await testEnvironment.getServiceClient();
    UploadJobTest.skillRepository = await testEnvironment.getSkillRepository();
  }

  async before() {
    this.setCorrelationId(UploadJobTest.serviceClient);
    this.setCorrelationId(UploadJobTest.fileUploadServiceClient);
  }

  async after() {
    super.after();
    await UploadJobTest.skillRepository.deleteManyByData([...this.createdSkills]);
  }

  @test
  async 'POST request to UploadJob'() {
    await this.waitForFinish(true);
    this.response = await UploadJobTest.serviceClient.post('/FileUploadService/UploadJob');
    assert.equal(this.response.status, 405, 'Expected status code to be 405 (METHOD NOT ALLOWED).');
  }

  @test
  async 'DELETE request to UploadJob'() {
    await this.waitForFinish(true);
    this.response = await UploadJobTest.serviceClient.delete('/FileUploadService/UploadJob');
    assert.equal(this.response.status, 405, 'Expected status code to be 405 (METHOD NOT ALLOWED).');
  }

  @test
  async 'GET request to UploadJob'() {
    await this.waitForFinish(true);
    this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
    assert.equal(this.response.status, 200, 'Expected status code to be 200 (OK).');
  }

  // @test
  // async 'POST file with missing header column'() {
  //   const externalIDs: string[] = [uuid()];
  //   this.createdSkills.push({ externalID: externalIDs[0] } as Skill);
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('missing-header-column.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'error', 'Expected state to be error.');
  // }

  // @test
  // async 'POST correct file with a duplicated alternative label name in the same language'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('duplicated-alternative-label-name.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'success', 'Expected state to be success.');
  //   assert.equal(this.response.data.failedSkillsCount, 0, 'Expected state to be warning.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 0, 'Expected no errors.');
  // }

  // @test
  // async 'POST empty file'() {
  //   const externalIDs: string[] = [uuid()];
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('empty-file.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'error', 'Expected state to be error.');
  // }

  // @test
  // async 'POST file with missing column (description) content'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('missing-column-content.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'warning', 'Expected state to be warning.');
  //   assert.equal(this.response.data.failedSkillsCount, 2, 'Expected state to be warning.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 1, 'Expected one error.');
  //   assert.equal(this.response.data.value[0].count, 2, 'Expected 2 skills.');
  // }

  // @test
  // async 'POST file with invalid restriction values'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('invalid-restriction-values.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'warning', 'Expected state to be warning.');
  //   assert.equal(this.response.data.failedSkillsCount, 2, 'Expected state to be warning.');
  //   assert.equal(this.response.data.skillsTotalCount, 3, 'Expected state to be warning.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 1, 'Expected one error.');
  //   assert.equal(this.response.data.value[0].count, 2, 'Expected 2 skills.');
  // }

  // @test
  // async 'POST file with missing SkillType value'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('missingSkillType.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'warning', 'Expected state to be warning.');
  //   assert.equal(this.response.data.failedSkillsCount, 2, 'Expected state to be warning.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 1, 'Expected one error.');
  //   assert.equal(this.response.data.value[0].count, 2, 'Expected 2 skills.');
  // }

  // @test
  // async 'POST file with wrong ConceptType value'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('wrongConceptType.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'warning', 'Expected state to be warning.');
  //   assert.equal(this.response.data.failedSkillsCount, 2, 'Expected state to be warning.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 1, 'Expected one error.');
  //   assert.equal(this.response.data.value[0].count, 2, 'Expected 2 skills.');
  // }

  // @test
  // async 'POST file with an empty header name'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('emptyHeaderName.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'error', 'Expected state to be error.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 1, 'Expected one error.');
  //   assert.isFalse(this.response.data.value[0].errorMessage.includes('unexpected'));
  // }

  // @test
  // async 'POST file with premature EOF'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('prematureEof.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'error', 'Expected state to be error.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 1, 'Expected one error.');
  //   assert.isFalse(this.response.data.value[0].errorMessage.includes('unexpected'));
  // }

  // @test
  // async 'POST file with 2 wrong skills'() {
  //   const externalIDs: string[] = [uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('wrongSkills.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'warning', 'Expected state to be warning.');
  //   assert.equal(this.response.data.failedSkillsCount, 2, 'Expected state to be warning.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 2, 'Expected state to be warning.');
  //   assert.equal(this.response.data.value[0].count, 1, 'Expected 2 skills.');
  //   assert.equal(this.response.data.value[1].count, 1, 'Expected 2 skills.');
  // }

  // @test
  // async 'POST file and check lifecycle status can be updated from unrestricted to restricted'() {
  //   const externalIDs: string[] = [uuid()];
  //   this.createdSkills.push({ externalID: externalIDs[0] } as Skill);
  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('valid-restriction-values.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.createdSkillsCount, 1, 'Expected 1 skills to be created.');

  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('restriction-update.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.updatedSkillsCount, 1, 'Expected that one skill was updated.');

  //   this.response = await UploadJobTest.serviceClient.get(`/SkillService/Skills?$filter=externalID eq '${externalIDs}'`);
  //   assert.equal(this.response.data.value[0].lifecycleStatus_code, 1, 'Expected lifecycleStatus_code 1.');
  // }

  // @test
  // async 'POST file with multiple error Messages (test grouping)'() {
  //   const externalIDs: string[] = [uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid()];
  //   externalIDs.forEach((e) => this.createdSkills.push({ externalID: e } as Skill));

  //   await this.waitForFinish(true);
  //   this.response = await this.uploadFile('groupErrorMessages.csv', { 'Content-Language': correctDefaultLanguage.code }, externalIDs);
  //   await this.waitForFinish(false);
  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
  //   assert.equal(this.response.data.state, 'warning', 'Expected state to be warning.');
  //   assert.equal(this.response.data.failedSkillsCount, 7, 'Expected 7 failed Skills.');
  //   assert.equal(this.response.data.skillsTotalCount, 11, 'Expected 11 total Skills.');

  //   this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob/uploadErrors');
  //   assert.equal(this.response.data.value.length, 7, 'Expected 7 errors.');
  // }

  // private async uploadFile(name: string, additionalHeaders: any = {}, generatedExternalIDs: string[]) {
  //   const formData = new FormData();

  //   let fileContent = await promisify(readFile)(`src/tests/data/file-upload-service/${name}`, 'utf8');

  //   for (let i = 0; fileContent.includes('{uuid()}'); i += 1) {
  //     const index = i % generatedExternalIDs.length;
  //     fileContent = fileContent.replace('{uuid()}', generatedExternalIDs[index]);
  //   }
  //   formData.append('file', fileContent, {
  //     filename: name,
  //   });

  //   const response = await UploadJobTest.fileUploadServiceClient.post('/', formData, {
  //     headers: formData.getHeaders(additionalHeaders),
  //   });

  //   return response;
  // }

  private async waitForFinish(bWithTimeout: boolean): Promise<void> {
    this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
    while (this.response.data.state === 'running') {
      if (bWithTimeout) {
        await waitAsync();
      }
      this.response = await UploadJobTest.serviceClient.get('/FileUploadService/UploadJob');
    }
  }
}
