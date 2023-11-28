import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import {
  unpublishedResourceRequestNonS4,
} from './data';

let publicAPIClient: any;

@suite
export class DeletePositive {
  static async before() {
    await insertData();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test deletion of unpublished Non S4 Resource request.'() {
    const deleteResourcerequest = await publicAPIClient.delete(
      `ResourceRequests(ID=${unpublishedResourceRequestNonS4.ID})`,
    );
    assert.equal(deleteResourcerequest.status, 204);
  }

  static async after() {
    await deleteData();
  }
}
