import { suite, test, timeout } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';
import {
  resourceRequest, resourceRequestInsertedViaDB, demands, resourceOrganizationData,
} from './data';

@suite
export class AuthorizationTestForResourceRequest {
  static async before() {
    await insertData();
  }

  /*
   * Projece Manager and Resource Managerare
   */

  /* The resource request API test scenario goes as below
   *
   * 1. Resource Manager cannot create resource request
   * 2. Project Manager cannot read resource request from Process Resource Request Service
   * 3. Project Manager cannot resolve resource request
   * 4. Project manager authorized for Resource organization can create corresponding resource request
   * 5. Project manager authorized for Resource organization can read corresponding resource request
   * 6. Project manager authorized for Resource organization can publish corresponding resource request
   * 7. Project manager authorized for Resource organization can read corresponding requested Resource organization
   * 8. Project manager unauthorized for Resource organization can not read corresponding resource request
   * 9.Project manager unauthorized for Resource organization can not publish corresponding resource request
   * 10.Project manager unauthorized for Resource organization can not read corresponding requested Resource organization
   * 11.Resource manager authorized for Resource organization can read corresponding resource request
   * 12.Resource manager authorized for Resource organization can read matching candidates
   * 13.Resource manager authorized for Resource organization can close corresponding resource request
   * 14.Resource manager authorized for Resource organization can read corresponding processing Resource organization
   * 15.Resource manager unauthorized for Resource organization can not read corresponding resource request
   * 16.Resource manager unauthorized for Resource organization can not close corresponding resource request
   * 17.Resource manager unauthorized for Resource organization can not read corresponding processing Resource organization
   *
   */

  // 1. Resource Manager cannot create resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Resource Manager cannot create Resource Request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientUnauthorized();
    const draftCreation = await resourceRequestClient.post(
      '/ResourceRequests',
      resourceRequest,
    );
    assert.equal(draftCreation.status, 403);
  }

  // 2. Project manager cannot read resource request from Process Resource Request Service
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager cannot read resource request from Process Resource Request Service'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientUnauthorized();

    const response = await processRequestClient.get(
      `/ResourceRequests(ID=${resourceRequestInsertedViaDB.ID})`,
    );
    assert.equal(response.status, 403);
  }

  // 3. Project manager cannot resolve resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager cannot resolve resource request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();

    const draftCreation = await resourceRequestClient.post(
      '/ResourceRequests',
      resourceRequest,
    );
    assert.equal(draftCreation.status, 201);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest.ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );

    assert.equal(draftActivation.status, 200);

    await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest.ID},IsActiveEntity=true)/ManageResourceRequestService.publishResourceRequest`,
      {},
    );

    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientUnauthorized();

    const resolveResponse = await processRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest.ID})/ProcessResourceRequestService.resolveResourceRequest`,
      {},
    );

    await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest.ID},IsActiveEntity=true)/ManageResourceRequestService.withdrawResourceRequest`,
      {},
    );

    await resourceRequestClient.delete(
      `/ResourceRequests(ID=${resourceRequest.ID},IsActiveEntity=true)`,
    );

    assert.equal(resolveResponse.status, 403);
  }

  // 4. Project manager authorized for Resource organization can create corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager authorized for Resource organization can create corresponding resource request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientAuthorized();
    const draftCreation = await resourceRequestClient.post(
      '/ResourceRequests',
      resourceRequest,
    );
    assert.equal(draftCreation.status, 201);

    const draftActivation = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest.ID},IsActiveEntity=false)/ManageResourceRequestService.draftActivate`,
      {},
    );

    assert.equal(draftActivation.status, 200);
  }

  // 5. Project manager authorized for Resource organization can read corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager authorized for Resource organization can read corresponding resource request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientAuthorized();

    const response = await resourceRequestClient.get(
      `/ResourceRequests(ID=${resourceRequest.ID},IsActiveEntity=true)`,
    );
    assert.equal(response.status, 200);
  }

  // 6.Project manager authorized for Resource organization can publish corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager authorized for Resource organization can publish corresponding resource request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientAuthorized();

    const response = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest.ID},IsActiveEntity=true)/ManageResourceRequestService.publishResourceRequest`,
      {},
    );
    assert.equal(response.status, 200);
  }

  // 7. Project manager authorized for Resource organization can read corresponding requested Resource organization
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager authorized for Resource organization can read corresponding requested Resource organization'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientAuthorized();

    const response = await resourceRequestClient.get(
      '/UnrestrictedResourceOrganizationsConsumption',
      {},
    );
    assert.equal(response.status, 200);
    expect(response.data.value.length).to.equal(1);
    expect(response.data.value[0].ID).to.equal(resourceOrganizationData[0].displayId);
  }

  // 8. Project manager unauthorized for Resource organization can not read corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager unauthorized for Resource organization can not read corresponding resource request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientAuthorized();

    const response = await resourceRequestClient.get(
      `/ResourceRequests(ID=${resourceRequestInsertedViaDB.ID},IsActiveEntity=true)`,
    );
    assert.equal(response.status, 404);
  }

  // 9. Project manager unauthorized for Resource organization can not publish corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager unauthorized for Resource organization can not publish corresponding resource request'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientAuthorized();

    const response = await resourceRequestClient.post(
      `/ResourceRequests(ID=${resourceRequestInsertedViaDB.ID},IsActiveEntity=true)/ManageResourceRequestService.publishResourceRequest`,
      {},
    );
    assert.equal(response.status, 400);
  }

  // 10. Project manager unauthorized for Resource organization can not read corresponding requested Resource organization
  @test(timeout(TEST_TIMEOUT))
  async 'Project manager unauthorized for Resource organization can not read corresponding requested Resource organization'() {
    const resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClientAuthorized();

    const response = await resourceRequestClient.get(
      `/UnrestrictedResourceOrganizationsConsumption(ID='${resourceOrganizationData[1].displayId}')`,
    );

    assert.equal(response.status, 404);
  }

  // 11. Resource manager authorized for Resource organization can read corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Resource manager authorized for Resource organization can read corresponding resource request'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientAuthorized();

    const response = await processRequestClient.get(
      `/ResourceRequests(ID=${resourceRequest.ID})`,
    );
    assert.equal(response.status, 200);
  }

  // 12. Resource manager authorized for Resource organization can read matching candidates
  @test(timeout(TEST_TIMEOUT))
  async 'Resource manager authorized for Resource organization can read matching candidates'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientAuthorized();

    const response = await processRequestClient.get(
      `/ResourceRequests(ID=${resourceRequest.ID})/matchingCandidates`,
    );

    assert.equal(response.status, 200);
    expect(response.data.value.length).to.equal(1);
  }

  // 13. Resource manager authorized for Resource organization can resolve corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Resource manager authorized for Resource organization can resolve corresponding resource request'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientAuthorized();

    const response = await processRequestClient.post(
      `/ResourceRequests(ID=${resourceRequest.ID})/ProcessResourceRequestService.resolveResourceRequest`,
      {},
    );
    assert.equal(response.status, 200);
  }

  // 14. Resource manager authorized for Resource organization can read corresponding processing Resource organization
  @test(timeout(TEST_TIMEOUT))
  async 'Resource manager authorized for Resource organization can read corresponding processing Resource organization'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientAuthorized();

    const response = await processRequestClient.get(
      '/UnrestrictedResourceOrganizationsConsumption',
      {},
    );
    assert.equal(response.status, 200);
    expect(response.data.value.length).to.equal(1);
    expect(response.data.value[0].ID).to.equal(resourceOrganizationData[0].displayId);
  }

  // 15. Resource manager unauthorized for Resource organization can not read corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Resource manager unauthorized for Resource organization can not read corresponding resource request'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientAuthorized();

    const response = await processRequestClient.get(
      `/ResourceRequests(ID=${resourceRequestInsertedViaDB.ID})`,
    );
    assert.equal(response.status, 404);
  }

  // 16. Resource manager unauthorized for Resource organization can not resolve corresponding resource request
  @test(timeout(TEST_TIMEOUT))
  async 'Resource manager unauthorized for Resource organization can not resolve corresponding resource request'() {
    const processRequestClient = await testEnvironment.getProcessResourceRequestServiceClientAuthorized();

    const response = await processRequestClient.post(
      `/ResourceRequests(ID=${resourceRequestInsertedViaDB.ID})/ProcessResourceRequestService.resolveResourceRequest`,
      {},
    );
    assert.equal(response.status, 404);
  }

  // 17. Resource manager unauthorized for Resource organization can not read corresponding processing Resource organization
  @test(timeout(TEST_TIMEOUT))
  async 'Resource manager unauthorized for Resource organization can not read corresponding processing Resource organization'() {
    const resourceRequestClient = await testEnvironment.getProcessResourceRequestServiceClientAuthorized();

    const response = await resourceRequestClient.get(
      `/UnrestrictedResourceOrganizationsConsumption(ID='${resourceOrganizationData[1].displayId}')`,
    );
    assert.equal(response.status, 404);
  }

  static async after() {
    await deleteData();
  }
}
