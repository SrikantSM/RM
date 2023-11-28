import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ProficiencySet, ProficiencySetRepository } from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctCreateProficiencySetWithDialogParameters, createProficiencySetWithDialogParametersWithNullName, createProficiencySetWithDialogParametersWithNullDescription,
} from './data';

@suite
export class CreateProficiencyWithDialogTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static proficiencySetRepository: ProficiencySetRepository;

  private static createdProficienySets: ProficiencySet[] = [];

  static async before() {
    CreateProficiencyWithDialogTest.serviceClient = await testEnvironment.getServiceClient();
    CreateProficiencyWithDialogTest.proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  }

  async before() {
    this.setCorrelationId(CreateProficiencyWithDialogTest.serviceClient);
  }

  async after() {
    super.after();
    await CreateProficiencyWithDialogTest.proficiencySetRepository.deleteMany(CreateProficiencyWithDialogTest.createdProficienySets);
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.createProficiencySetWithDialog with correct data'() {
    const createResponse = await CreateProficiencyWithDialogTest.serviceClient.post('/ProficiencyService/ProficiencySets/ProficiencyService.createProficiencySetWithDialog', correctCreateProficiencySetWithDialogParameters);
    CreateProficiencyWithDialogTest.createdProficienySets.push({ ID: createResponse.data.ID } as ProficiencySet);

    this.response = await CreateProficiencyWithDialogTest.serviceClient.get(`/ProficiencyService/ProficiencySets(ID=${createResponse.data.ID},IsActiveEntity=false)`);

    assert.equal(createResponse.status, 200, 'Expected status code of proficiency creation to be 200 (OK).');
    assert.equal(this.response.status, 200, 'Expected status code of proficiency reading to be 200 (OK).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.createProficiencySetWithDialog with a null name'() {
    this.response = await CreateProficiencyWithDialogTest.serviceClient.post('/ProficiencyService/ProficiencySets/ProficiencyService.createProficiencySetWithDialog', createProficiencySetWithDialogParametersWithNullName);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency creation to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to ProficiencySets/ProficiencyService.createProficiencySetWithDialog with a null description'() {
    this.response = await CreateProficiencyWithDialogTest.serviceClient.post('/ProficiencyService/ProficiencySets/ProficiencyService.createProficiencySetWithDialog', createProficiencySetWithDialogParametersWithNullDescription);
    assert.equal(this.response.status, 400, 'Expected status code of proficiency creation to be 400 (BAD REQUEST).');
  }
}
