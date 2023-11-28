import { suite, test, timeout } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import { resourceRequestAPIPayload } from './data';

let publicAPIClient: any;
const errorMessageStructure = {
  generic: {
    error: {
      code: '400',
      message: 'The following errors have occurred:',
      details: [],
    },
  },
  startDate: {
    code: '<none>',
    message: 'Provide a start date.',
    target: 'startDate',
    '@Common.numericSeverity': 4,
  },
  endDate: {
    code: '<none>',
    message: 'Provide an end date.',
    target: 'endDate',
    '@Common.numericSeverity': 4,
  },
  requiredEffort: {
    code: '<none>',
    message: 'Provide a positive whole number.',
    target: 'requiredEffort',
    '@Common.numericSeverity': 4,
  },
  name: {
    code: '<none>',
    message: 'Provide a request name.',
    target: 'name',
    '@Common.numericSeverity': 4,
  },
  referenceObjectId: {
    code: '<none>',
    message:
      'Enter an existing reference object.',
    target: 'referenceObjectId',
    '@Common.numericSeverity': 4,
  },
};
@suite
export class CreateNegative {
  static async before() {
    await insertData();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request without payload'() {
    const negativeRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {},
    );
    assert.equal(negativeRequest.status, 400);
    assert.equal(negativeRequest.data.error.details.length, 4);
    assert.equal(negativeRequest.data.error.code, '400');
    assert.equal(negativeRequest.data.error.message, errorMessageStructure.generic.error.message);
    expect([negativeRequest.data.error.details[0].message, negativeRequest.data.error.details[1].message,
      negativeRequest.data.error.details[2].message, negativeRequest.data.error.details[3].message]).to.have.members([errorMessageStructure.startDate.message, errorMessageStructure.endDate.message, errorMessageStructure.requiredEffort.message, errorMessageStructure.name.message]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request without start date'() {
    const negativeRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        endDate: resourceRequestAPIPayload.endDate,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
         name: resourceRequestAPIPayload.name,
      },
    );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.startDate];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request without end date'() {
    const negativeRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
        name: resourceRequestAPIPayload.name,
      },
    );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.endDate];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request without requiredEffort'() {
    const negativeRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        name: resourceRequestAPIPayload.name,
      },
    );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.requiredEffort];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request without name'() {
    const negativeRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
      },
    );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.name];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request with negative requiredEffort'() {
    const negativeRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        name: resourceRequestAPIPayload.name,
        requiredEffort: resourceRequestAPIPayload.requiredEffort ? -(resourceRequestAPIPayload.requiredEffort) : -350,
      },
    );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.requiredEffort];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request with startDate after endDate'() {
    const negativeRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.endDate,
        endDate: resourceRequestAPIPayload.startDate,
        name: resourceRequestAPIPayload.name,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
      },
    );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [{
      code: '<none>',
      message: 'The requested start date must be before the requested end date.',
      target: 'startDate',
      '@Common.numericSeverity': 4,
    }];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try create Resource Request with non-existing referenceObjectId'() {
    const negativeCreateRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        name: resourceRequestAPIPayload.name,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
        referenceObjectId:'c292559b-a9dd-4728-b3ad-5c649b39d632',
      },
    );
    assert.equal(negativeCreateRequest.status, 400);
    const expected = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expected.error.details = [errorMessageStructure.referenceObjectId];
    assert.deepEqual(negativeCreateRequest.data, expected);
  }

  static async after() {
    await deleteData();
  }
}
