import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ProficiencySetRepository } from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';

const DEFAULT_PROFICIENCY_SET_ID = '8a2cc2c3-4a46-47f0-ae67-2ac67c673aae';
const DEFAULT_PROFICIENCY_SET_GERMAN_NAME = 'Nicht festgelegt';
const DEFAULT_PROFICIENCY_SET_ENGLISH_NAME = 'Not specified';

@suite
export class DefaultLanguageTest extends BaseApiTest {
  private static defaultLanguageServiceClient: AxiosInstance;

  private static defaultLanguageServiceClientUnauthorized: AxiosInstance;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static serviceClient: AxiosInstance;

  static async before() {
    DefaultLanguageTest.defaultLanguageServiceClient = await testEnvironment.getDefaultLanguageServiceClient();
    DefaultLanguageTest.defaultLanguageServiceClientUnauthorized = await testEnvironment.getDefaultLanguageServiceClientUnauthorized();
    DefaultLanguageTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    DefaultLanguageTest.serviceClient = await testEnvironment.getServiceClient();
  }

  async before() {
    this.setCorrelationId(DefaultLanguageTest.defaultLanguageServiceClient);
  }

  async after() {
    super.after();
  }

  @test
  async 'Trigger actions on change default language'() {
    this.response = await DefaultLanguageTest.defaultLanguageServiceClient.put('', null, { params: { language: 'de' } });
    assert.equal(this.response.status, 204, 'Expected status code of default language change to be 204 (NO CONTENT).');

    this.response = await DefaultLanguageTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${DEFAULT_PROFICIENCY_SET_ID},IsActiveEntity=true)`);

    assert.equal(this.response.status, 200, 'Expected default proficiency set to be available');
    assert.equal(this.response.data.name, DEFAULT_PROFICIENCY_SET_GERMAN_NAME);

    // change it back. Can't be done via database layer easily
    this.response = await DefaultLanguageTest.defaultLanguageServiceClient.put('', null, { params: { language: 'en' } });
    assert.equal(this.response.status, 204, 'Expected status code of default language change to be 204 (NO CONTENT).');

    const [{ name }] = await DefaultLanguageTest.proficiencySetRepository.selectByData(['name'], [{ ID: DEFAULT_PROFICIENCY_SET_ID }]);
    assert.equal(name, DEFAULT_PROFICIENCY_SET_ENGLISH_NAME);
  }

  @test
  async 'Trigger actions on change default language with invalid param'() {
    this.response = await DefaultLanguageTest.defaultLanguageServiceClient.put('');
    assert.equal(this.response.status, 400, 'Expected status code of default language change to be 400 (BAD REQUEST).');
  }

  @test
  async 'Negative test that config expert can\'t trigger actions on default language change'() {
    this.response = await DefaultLanguageTest.defaultLanguageServiceClientUnauthorized.put('', null, { params: { language: 'de' } });
    assert.equal(this.response.status, 403, 'Expected status code of default language change to be 403 (FORBIDDEN).');
  }
}
