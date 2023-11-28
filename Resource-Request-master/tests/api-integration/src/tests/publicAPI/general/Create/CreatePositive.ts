import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import { resourceRequestAPIPayload, expectedEndTime } from './data';

let resourceRequestClient: any;
let publicAPIClient: any;
@suite
export class CreatePositive {
  static async before() {
    await insertData();
    resourceRequestClient = await testEnvironment.getManageResourceRequestServiceClient();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create Resource Request with only mandatory fields'() {
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

    this.valiadteResourceRequestAPIResponse(createResourceRequest.data, {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requiredEffort: resourceRequestAPIPayload.requiredEffort,
      name: resourceRequestAPIPayload.name,
      description: null,
      referenceObjectId: null
    });

    // Assert from ManageResourceRequestService
    const generatedResourceRequest = await resourceRequestClient.get(
      `/ResourceRequests(ID=${createResourceRequest.data.ID},IsActiveEntity=true)`,
    );
    // Assert Basics
    assert.equal(generatedResourceRequest.status, 200);
    assert.equal(generatedResourceRequest.data.ID, createResourceRequest.data.ID);
    assert.equal(generatedResourceRequest.data.displayId, createResourceRequest.data.displayId);
    assert.equal(generatedResourceRequest.data.name, resourceRequestAPIPayload.name);
    assert.equal(generatedResourceRequest.data.description, null);
    // Assert Basics
    assert.equal(generatedResourceRequest.status, 200);
    assert.equal(generatedResourceRequest.data.ID, createResourceRequest.data.ID);
    assert.equal(generatedResourceRequest.data.displayId, createResourceRequest.data.displayId);
    assert.equal(generatedResourceRequest.data.name, resourceRequestAPIPayload.name);
    assert.equal(generatedResourceRequest.data.description, null);

    // Assert Derived Values
    this.validateDerivedValues(generatedResourceRequest.data, {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requestedCapacity: resourceRequestAPIPayload.requiredEffort,
    });

    // Assert Default Values
    this.validateResourceRequestDefaults(generatedResourceRequest.data);

    // Assert Capacity Requirement is genearated with correct values
    const generatedCapacityRequirement = await resourceRequestClient.get(
      `/ResourceRequestCapacities?$filter=resourceRequest_ID eq ${createResourceRequest.data.ID}`,
    );

    assert.equal(generatedCapacityRequirement.status, 200);
    assert.equal(generatedCapacityRequirement.data.value.length, 1);
    this.validateDerivedValues(generatedCapacityRequirement.data.value[0], {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requestedCapacity: resourceRequestAPIPayload.requiredEffort,
    });

    // Delete created resource request
    const deleteResourceRequest = await publicAPIClient.delete(
      `ResourceRequests(${createResourceRequest.data.ID})`);
    assert.equal(deleteResourceRequest.status, 204);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create Resource Request with all fields'() {
    const createResourceRequest = await publicAPIClient.post(
      '/ResourceRequests',
      {
        startDate: resourceRequestAPIPayload.startDate,
        endDate: resourceRequestAPIPayload.endDate,
        requiredEffort: resourceRequestAPIPayload.requiredEffort,
        name: resourceRequestAPIPayload.name,
        description: resourceRequestAPIPayload.description,
        referenceObjectId: null
      },
    );
    assert.equal(createResourceRequest.status, 201);

    this.valiadteResourceRequestAPIResponse(createResourceRequest.data, {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requiredEffort: resourceRequestAPIPayload.requiredEffort,
      name: resourceRequestAPIPayload.name,
      description: resourceRequestAPIPayload.description,
      referenceObjectId: null
    });

    // Assert from ManageResourceRequestService
    const generatedResourceRequest = await resourceRequestClient.get(
      `/ResourceRequests(ID=${createResourceRequest.data.ID},IsActiveEntity=true)`,
    );
    // Assert Basics
    assert.equal(generatedResourceRequest.status, 200);
    assert.equal(generatedResourceRequest.data.ID, createResourceRequest.data.ID);
    assert.equal(generatedResourceRequest.data.displayId, createResourceRequest.data.displayId);
    assert.equal(generatedResourceRequest.data.name, resourceRequestAPIPayload.name);
    assert.equal(generatedResourceRequest.data.description, resourceRequestAPIPayload.description);

    // Assert Derived Values
    this.validateDerivedValues(generatedResourceRequest.data, {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requestedCapacity: resourceRequestAPIPayload.requiredEffort,
    });

    // Assert Default Values
    this.validateResourceRequestDefaults(generatedResourceRequest.data);

    // Assert Capacity Requirement is genearated with correct values
    const generatedCapacityRequirement = await resourceRequestClient.get(
      `/ResourceRequestCapacities?$filter=resourceRequest_ID eq ${createResourceRequest.data.ID}`,
    );

    assert.equal(generatedCapacityRequirement.status, 200);
    assert.equal(generatedCapacityRequirement.data.value.length, 1);
    this.validateDerivedValues(generatedCapacityRequirement.data.value[0], {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requestedCapacity: resourceRequestAPIPayload.requiredEffort,
    });

    // Delete created resource request
    const deleteResourceRequest = await publicAPIClient.delete(
      `ResourceRequests(${createResourceRequest.data.ID})`);
    assert.equal(deleteResourceRequest.status, 204);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create Resource Request using $batch'() {
    let batchContents = new Array();
    const changeSetId = '3bc5bd67-3517-4cd0-bcdd-9d23f3850402';

    batchContents.push('--' + changeSetId);
    batchContents.push('Content-Type:application/http');
    batchContents.push('Content-Transfer-Encoding:binary');
    batchContents.push('');
    batchContents.push('POST ResourceRequests HTTP/1.1');
    batchContents.push('Accept:application/json');
    batchContents.push('Content-Type:application/json');
    batchContents.push('');
    batchContents.push(`{"startDate": "${resourceRequestAPIPayload.startDate}" ,"endDate": "${resourceRequestAPIPayload.endDate}","requiredEffort": ${resourceRequestAPIPayload.requiredEffort},"name": "${resourceRequestAPIPayload.name}","description": "${resourceRequestAPIPayload.description}"}`);
    batchContents.push('--' + changeSetId + '--');

    const createResourceRequest = await publicAPIClient.post(
      '/$batch',batchContents.join('\r\n'),{
        headers:
        { 'Content-Type': `multipart/mixed;boundary=${changeSetId}`}
      });
    assert.equal(createResourceRequest.status, 200);
    assert.notEqual(createResourceRequest.data.match('HTTP/1.1 201 Created'), null);

    const jsonResopnse = JSON.parse(createResourceRequest.data.match(/{.*}/g)[0].replace('\\"',"'"));

    this.valiadteResourceRequestAPIResponse(jsonResopnse, {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requiredEffort: resourceRequestAPIPayload.requiredEffort,
      name: resourceRequestAPIPayload.name,
      description: resourceRequestAPIPayload.description,
    });

    // Assert from ManageResourceRequestService
    const generatedResourceRequest = await resourceRequestClient.get(
      `/ResourceRequests(ID=${jsonResopnse.ID},IsActiveEntity=true)`,
    );
    // Assert Basics
    assert.equal(generatedResourceRequest.status, 200);
    assert.equal(generatedResourceRequest.data.ID, jsonResopnse.ID);
    assert.equal(generatedResourceRequest.data.displayId, jsonResopnse.displayId);
    assert.equal(generatedResourceRequest.data.name, resourceRequestAPIPayload.name);
    assert.equal(generatedResourceRequest.data.description, resourceRequestAPIPayload.description);

    // Assert Derived Values
    this.validateDerivedValues(generatedResourceRequest.data, {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requestedCapacity: resourceRequestAPIPayload.requiredEffort,
    });

    // Assert Default Values
    this.validateResourceRequestDefaults(generatedResourceRequest.data);

    // Assert Capacity Requirement is genearated with correct values
    const generatedCapacityRequirement = await resourceRequestClient.get(
      `/ResourceRequestCapacities?$filter=resourceRequest_ID eq ${jsonResopnse.ID}`,
    );

    assert.equal(generatedCapacityRequirement.status, 200);
    assert.equal(generatedCapacityRequirement.data.value.length, 1);
    this.validateDerivedValues(generatedCapacityRequirement.data.value[0], {
      startDate: resourceRequestAPIPayload.startDate,
      endDate: resourceRequestAPIPayload.endDate,
      requestedCapacity: resourceRequestAPIPayload.requiredEffort,
    });

    // Delete created resource request
    const deleteResourceRequest = await publicAPIClient.delete(
      `ResourceRequests(${jsonResopnse.ID})`);
    assert.equal(deleteResourceRequest.status, 204);
  }

  // Helper Methods
  validateDerivedValues(response: any, expected:any): void {
    assert.equal(response.startDate, expected.startDate);
    assert.equal(response.startTime, `${expected.startDate}T00:00:00Z`);

    assert.equal(response.endDate, expected.endDate);
    assert.equal(response.endTime, expectedEndTime);

    assert.equal(response.requestedCapacity, expected.requestedCapacity);
    assert.equal(response.requestedCapacityInMinutes, expected.requestedCapacity * 60);

    assert.equal(response.requestedUnit, 'duration-hour');
  }

  validateResourceRequestDefaults(response:any) {
    // Assert Defaults
    assert.equal(response.isS4Cloud, false);
    assert.equal(response.demand_ID, null);
    assert.equal(response.workpackage_ID, null);
    assert.equal(response.project_ID, null);
    assert.equal(response.projectRole_ID, null);
    assert.equal(response.priority_code, 1);
    assert.equal(response.requestStatus_code, 0);
    assert.equal(response.releaseStatus_code, 0);
    assert.equal(response.effortDistributionType_code, 0);
    assert.equal(response.resourceManager, null);
    assert.equal(response.processor, null);
    assert.equal(response.resourceKind_code, null);
    assert.equal(response.requestedUnit, 'duration-hour');
  }

  valiadteResourceRequestAPIResponse(response:any, expected:any) {
    assert.deepEqual(Object.keys(response), ['@context', '@metadataEtag', 'ID', 'displayId', 'name', 'referenceObjectId','startDate', 'endDate', 'requiredEffort', 'description']);
    assert.notEqual(response.ID, null);
    assert.notEqual(response.ID, '');
    assert.notEqual(response.displayId, null);
    assert.notEqual(response.displayId, '');

    assert.equal(response.startDate, expected.startDate);
    assert.equal(response.endDate, expected.endDate);
    assert.equal(response.requiredEffort, expected.requiredEffort);
    assert.equal(response.name, expected.name);
    assert.equal(response.description, expected.description);
    assert.equal(response.referenceObjectId,expected.referenceObjectId)
  }

  static async after() {
    await deleteData();
  }
}
