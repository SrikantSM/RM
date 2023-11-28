import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import { ResourceRequestRepository } from 'test-commons';
import {
  resourceRequestNonS4,
  unpublishedResourceRequestS4,
  resourceRequestAPIPayload,
  referenceObject,
  publishedResourceRequestS4
} from './data';

let resourceRequestClient: any;
let publicAPIClient: any;
let resourceRequestRepository: ResourceRequestRepository;

@suite
export class UpdatePositive {
  static async before() {
    await insertData();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
    resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update referenceObjectId field'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${resourceRequestNonS4.ID})`,
      { referenceObjectId: referenceObject[0].ID },
    );

    assert.equal(updateResourcerequest.status, 200);
    assert.equal(
      updateResourcerequest.data.referenceObjectId,
      referenceObject[0].ID,
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test ReferenceObjectTypeCode Update after ReferenceObjectId Update'() {
    const createResourceRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
        name: resourceRequestAPIPayload.name,
      },
    );
    assert.equal(createResourceRequest.status, 201);
    
    // Assert from ManageResourceRequestService
    const generatedResourceRequestAfterCreate = await resourceRequestClient.get(
      `/ResourceRequests(ID=${createResourceRequest.data.ID},IsActiveEntity=true)`,
    );
    
    assert.equal(generatedResourceRequestAfterCreate.data.referenceObjectType_code,0);

    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${createResourceRequest.data.ID})`,
      { referenceObjectId: referenceObject[0].ID },
    );
    assert.equal(updateResourcerequest.status, 200);
    
    const generatedResourceRequestAfterUpdate = await resourceRequestClient.get(
      `/ResourceRequests(ID=${createResourceRequest.data.ID},IsActiveEntity=true)`,
    );
    
    assert.equal(generatedResourceRequestAfterUpdate.data.referenceObjectType_code,1);

    await resourceRequestRepository.deleteOne(updateResourcerequest.data);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test ReferenceObjectTypeCode Reset after ReferenceObjectId Update to null'() {
    const createResourceRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
        name: resourceRequestAPIPayload.name,
        referenceObjectId: referenceObject[0].ID,
      },
    );
    assert.equal(createResourceRequest.status, 201);
    
    // Assert from ManageResourceRequestService
    const generatedResourceRequestAfterCreate = await resourceRequestClient.get(
      `/ResourceRequests(ID=${createResourceRequest.data.ID},IsActiveEntity=true)`,
    );
    
    assert.equal(generatedResourceRequestAfterCreate.data.referenceObjectType_code,1);

    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${createResourceRequest.data.ID})`,
      { referenceObjectId: null },
    );
    assert.equal(updateResourcerequest.status, 200);
    
    const generatedResourceRequestAfterUpdate = await resourceRequestClient.get(
      `/ResourceRequests(ID=${createResourceRequest.data.ID},IsActiveEntity=true)`,
    );
    
    assert.equal(generatedResourceRequestAfterUpdate.data.referenceObjectType_code,0);

    await resourceRequestRepository.deleteOne(updateResourcerequest.data);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update name field'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${resourceRequestNonS4.ID})`,
      { name: resourceRequestAPIPayload.name },
    );

    assert.equal(updateResourcerequest.status, 200);
    assert.equal(
      updateResourcerequest.data.name,
      resourceRequestAPIPayload.name,
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update startDate field'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${resourceRequestNonS4.ID})`,
      { startDate: resourceRequestAPIPayload.startDate },
    );

    assert.equal(updateResourcerequest.status, 200);
    assert.equal(
      updateResourcerequest.data.startDate,
      resourceRequestAPIPayload.startDate,
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update endDate field'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${resourceRequestNonS4.ID})`,
      { endDate: resourceRequestAPIPayload.endDate },
    );

    assert.equal(updateResourcerequest.status, 200);
    assert.equal(
      updateResourcerequest.data.endDate,
      resourceRequestAPIPayload.endDate,
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update requiredEffort field'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${resourceRequestNonS4.ID})`,
      { requiredEffort: resourceRequestAPIPayload.requiredEffort },
    );

    assert.equal(updateResourcerequest.status, 200);
    assert.equal(
      updateResourcerequest.data.requiredEffort,
      resourceRequestAPIPayload.requiredEffort,
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try update with multiple fields'() {
    resourceRequestAPIPayload.name = 'Updated Resource Request Name';
    resourceRequestAPIPayload.description = 'Updated Resource Request Name';
    resourceRequestAPIPayload.startDate = '2019-01-15';
    resourceRequestAPIPayload.endDate = '2019-01-30';

    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${resourceRequestNonS4.ID})`,
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
        name: resourceRequestAPIPayload.name,
        description: resourceRequestAPIPayload.description,
      },
    );

    assert.equal(updateResourcerequest.status, 200);
    assert.equal(
      updateResourcerequest.data.name,
      resourceRequestAPIPayload.name,
    );
    assert.equal(
      updateResourcerequest.data.startDate,
      resourceRequestAPIPayload.startDate,
    );
    assert.equal(
      updateResourcerequest.data.endDate,
      resourceRequestAPIPayload.endDate,
    );
    assert.equal(
      updateResourcerequest.data.requiredEffort,
      resourceRequestAPIPayload.requiredEffort,
    );
    assert.equal(
      updateResourcerequest.data.description,
      resourceRequestAPIPayload.description,
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try S/4 resource request can be updated'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${unpublishedResourceRequestS4.ID})`,
      {
        name:
          resourceRequestAPIPayload.name,
      },
    );

    assert.equal(updateResourcerequest.status, 200);
    assert.equal(
      updateResourcerequest.data.name,
      resourceRequestAPIPayload.name,
    );
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Try published S/4 resource request can be updated'() {
    const updateResourcerequest = await publicAPIClient.patch(
      `ResourceRequests(ID=${publishedResourceRequestS4.ID})`,
      {
        requiredEffort:700,
      },
    );

    assert.equal(updateResourcerequest.status, 200);
  }

  static async after() {
    await deleteData();
  }
}
