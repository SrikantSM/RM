import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ProficiencySetRepository } from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';

@suite
export class EditDefaultProficiencySetTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  static async before() {
    EditDefaultProficiencySetTest.serviceClient = await testEnvironment.getServiceClient();
  }

  async before() {
    this.setCorrelationId(EditDefaultProficiencySetTest.serviceClient);
  }

  async after() {
    super.after();
  }

  @test
  async 'EDIT default proficiency set'() {
    this.response = await EditDefaultProficiencySetTest.serviceClient.post(`/ProficiencyService/ProficiencySets(ID=${ProficiencySetRepository.defaultProficiencySetId},IsActiveEntity=true)/ProficiencyService.draftEdit`, {});
    assert.equal(this.response.status, 400, 'Expected status code of proficiency set post request to be 400 (BAD REQUEST).');
  }

  @test
  async 'PATCH proficiency set'() {
    const patchBody = {
      name: 'Changed name',
    };
    this.response = await EditDefaultProficiencySetTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${ProficiencySetRepository.defaultProficiencySetId},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency set post request to be 400 (BAD REQUEST).');

    this.response = await EditDefaultProficiencySetTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${ProficiencySetRepository.defaultProficiencySetId},IsActiveEntity=true)`);
    assert.notEqual(this.response.data.name, patchBody.name, 'Expected that the default proficiency set name is not changed');
  }

  @test
  async 'PATCH default proficiency set trying to set isCustom to true'() {
    // Editing should not even be possible if you manually try to set the readonly property isCustom to true, trying to "trick" our validations
    const patchBody = {
      name: 'Changed name',
      isCustom: true,
    };
    this.response = await EditDefaultProficiencySetTest.serviceClient.patch(`/ProficiencyService/ProficiencySets(ID=${ProficiencySetRepository.defaultProficiencySetId},IsActiveEntity=true)`, patchBody);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency set post request to be 400 (BAD REQUEST)');

    this.response = await EditDefaultProficiencySetTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${ProficiencySetRepository.defaultProficiencySetId},IsActiveEntity=true)`);
    assert.notEqual(this.response.data.name, patchBody.name);
  }
}
