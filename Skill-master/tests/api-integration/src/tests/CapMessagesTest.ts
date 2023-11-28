import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { v4 as uuid } from 'uuid';
import { BaseApiTest, testEnvironment } from '../utils';

@suite
export class CapMessagesTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  static async before() {
    CapMessagesTest.serviceClient = await testEnvironment.getServiceClient();
  }

  async before() {
    this.setCorrelationId(CapMessagesTest.serviceClient);
  }

  @test
  async 'GET a non-existing skill (there should be the expected error message)'() {
    this.response = await CapMessagesTest.serviceClient.get(`/SkillService/Skills(ID=${uuid()},IsActiveEntity=true)`);

    assert.equal(this.response.status, 404, 'Expected status code of skill deletion to be 404 (NOT FOUND).');
    assert.isDefined(this.response.data.error.message, 'Expected an error message to be returned.');
    assert.equal(this.response.data.error.message, 'The selected entity can\'t be found.', 'Expected error message should be found.');
  }
}
