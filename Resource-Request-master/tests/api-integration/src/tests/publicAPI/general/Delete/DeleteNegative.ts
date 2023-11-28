import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import {
  unpublishedResourceRequestS4,
  publishedNonS4,
  publishedS4,
} from './data';

let publicAPIClient: any;

const errorMessagePublished = {
  error: {
    code: '405',
    message:
      'The resource request has already been published. You can only change resource requests that are not published.',
  },
};

const errorMessageS4RR = {
  error: {
    code: '405',
    message:
        'Resource request cannot be deleted. You can only delete it in the source system.',
  },
};

@suite
export class DeleteNegative {
  static async before() {
    await insertData();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try deletion of unpublished S4 Resource request.'() {
    const deleteResourcerequest = await publicAPIClient.delete(
      `ResourceRequests(ID=${unpublishedResourceRequestS4.ID})`,
    );
    assert.equal(deleteResourcerequest.status, 405);
    assert.deepEqual(deleteResourcerequest.data, errorMessageS4RR);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try deletion of published Non S4 Resource request.'() {
    const deleteResourcerequest = await publicAPIClient.delete(
      `ResourceRequests(ID=${publishedNonS4.ID})`,
    );
    assert.equal(deleteResourcerequest.status, 405);
    assert.deepEqual(deleteResourcerequest.data, errorMessagePublished);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try deletion of published S4 Resource request.'() {
    const deleteResourcerequest = await publicAPIClient.delete(
      `ResourceRequests(ID=${publishedS4.ID})`,
    );
    assert.equal(deleteResourcerequest.status, 405);
    assert.deepEqual(deleteResourcerequest.data, errorMessageS4RR);
  }

  static async after() {
    await deleteData();
  }
}
