import { suite, test, timeout } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import {
  publishedResourceRequestS4,
  unpublishedResourceRequestS4,
  resourceRequestAPIPayload,
  resourceRequestNonS4,
} from './data';

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
    message:
      'The requested start date and the requested end date must be within the time period of the work package.',
    target: 'startDate',
    '@Common.numericSeverity': 4,
  },
  referenceObjectId: {
    code: '<none>',
    message:
      'Enter an existing reference object.',
    target: 'referenceObjectId',
    '@Common.numericSeverity': 4,
  },
  publishedUpdateError: {
    code: '<none>',
    message:
      'You can only change the duration of the resource request and the required effort, since the resource request has already been published.',
    target: 'description',
    '@Common.numericSeverity': 4,
  },
};
@suite
export class UpdateNegative {
  static async before() {
    await insertData();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update of S/4 resource request dates undergo work package validation'() {
    resourceRequestAPIPayload.startDate = '2018-06-30';

    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${unpublishedResourceRequestS4.ID})`,
      {
        startDate: resourceRequestAPIPayload.startDate,
      },
    );

    assert.equal(updateResourcerequest.status, 400);
    assert.equal(
      updateResourcerequest.data.error.message,
      errorMessageStructure.generic.error.message,
    );

    expect([
      updateResourcerequest.data.error.details[0].message,
    ]).to.have.members([errorMessageStructure.startDate.message]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update of Resource Request with invalid ReferenceObjectId'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${resourceRequestNonS4.ID})`,
      {
        referenceObjectId:'c292559b-a9dd-4728-b3ad-5c649b39d632',
      },
    );

    assert.equal(updateResourcerequest.status, 400);
    const expected = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expected.error.details = [errorMessageStructure.referenceObjectId];
    assert.deepEqual(updateResourcerequest.data, expected);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update name & description of published S4 Request'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${publishedResourceRequestS4.ID})`,
      {
        name:"New Resource Request Name",
      },
    );

    assert.equal(updateResourcerequest.status, 400);
    const expected = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expected.error.details = [errorMessageStructure.publishedUpdateError];
    assert.deepEqual(updateResourcerequest.data, expected);
  }

  static async after() {
    await deleteData();
  }
}
