import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';

let publicAPIResourceRequestClient: any;
let resourceRequestUserClient: any;

@suite
export class Authorization {
  static async before() {
    publicAPIResourceRequestClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
    resourceRequestUserClient = await testEnvironment.getResourceRequestPublicApiUserFlow( );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Technical user flow should work.'() {
    const createResourceRequest = await publicAPIResourceRequestClient.get(
      '/ResourceRequests'
    );
    assert.equal(createResourceRequest.status, 200);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Technical user flow should work for ReferenceObject end point.'() {
    const createReferenceObject = await publicAPIResourceRequestClient.get(
      '/ReferenceObjects'
    );
    assert.equal(createReferenceObject.status, 200);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Named user flow should not work.'() {
    const createResourceRequest = await resourceRequestUserClient.get(
      '/ResourceRequests'
    );
    assert.equal(createResourceRequest.status, 403);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Named user flow should not work for ReferenceObject end point.'() {
    const createResourceRequest = await resourceRequestUserClient.get(
      '/ReferenceObjects'
    );
    assert.equal(createResourceRequest.status, 403);
  }


}
