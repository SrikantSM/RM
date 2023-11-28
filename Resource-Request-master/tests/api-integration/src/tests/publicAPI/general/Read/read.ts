import { suite, test, timeout } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { insertData, deleteData } from './dataGenHandler';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import { resourceRequestApiData } from './data';

// $filter $top $skip $count $search $orderby $select

// Select with key, $select

let publicAPIClient: any;
@suite
export class Read {
  static async before() {
    await insertData();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $top without order.'() {
    const readResourcerequest = await publicAPIClient.get(
      '/ResourceRequests?$top=5&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequest.status, 200);
    assert.equal(readResourcerequest.data.value.length, 5);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $top with order.'() {
    const readResourcerequest = await publicAPIClient.get(
      '/ResourceRequests?$top=5&$orderby=displayId&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequest.status, 200);
    assert.equal(readResourcerequest.data.value.length, 5);
    expect(readResourcerequest.data.value).to.deep.equal([resourceRequestApiData[0], resourceRequestApiData[1], resourceRequestApiData[2], resourceRequestApiData[3], resourceRequestApiData[4]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $top, $skip with order.'() {
    const readResourcerequest = await publicAPIClient.get(
      '/ResourceRequests?$top=5&$skip=3&$orderby=displayId&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequest.status, 200);
    assert.equal(readResourcerequest.data.value.length, 5);
    expect(readResourcerequest.data.value).to.deep.equal([resourceRequestApiData[3], resourceRequestApiData[4], resourceRequestApiData[5], resourceRequestApiData[6], resourceRequestApiData[7]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $search.'() {
    const readResourcerequest = await publicAPIClient.get(
      `/ResourceRequests?$search=${resourceRequestApiData[0].name}&$filter=startswith(description,'publicAPIReadTest_')`,
    );
    assert.equal(readResourcerequest.status, 200);
    assert.equal(readResourcerequest.data.value.length, 1);
    expect(readResourcerequest.data.value).to.deep.equal([resourceRequestApiData[0]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $count.'() {
    const readResourcerequest = await publicAPIClient.get(
      '/ResourceRequests/$count',
    );
    assert.equal(readResourcerequest.status, 200);
    expect(readResourcerequest.data).to.be.greaterThan(9);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test order asc.'() {
    // based on ID
    const readResourcerequestID = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=ID&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestID.status, 200);
    assert.equal(readResourcerequestID.data.value.length, 1);
    expect(readResourcerequestID.data.value).to.deep.equal([resourceRequestApiData[0]]);

    // based on displayId
    const readResourcerequestDisplayID = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=displayId&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestDisplayID.status, 200);
    assert.equal(readResourcerequestDisplayID.data.value.length, 1);
    expect(readResourcerequestDisplayID.data.value).to.deep.equal([resourceRequestApiData[0]]);

    // based on name
    const readResourcerequestName = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=name&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestName.status, 200);
    assert.equal(readResourcerequestName.data.value.length, 1);
    expect(readResourcerequestName.data.value).to.deep.equal([resourceRequestApiData[0]]);

    // based on description
    const readResourcerequestDescription = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=description&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestDescription.status, 200);
    assert.equal(readResourcerequestDescription.data.value.length, 1);
    expect(readResourcerequestDescription.data.value).to.deep.equal([resourceRequestApiData[0]]);

    // based on start date
    const readResourcerequestStartDate = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=startDate&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestStartDate.status, 200);
    assert.equal(readResourcerequestStartDate.data.value.length, 1);
    expect(readResourcerequestStartDate.data.value).to.deep.equal([resourceRequestApiData[0]]);

    // based on end date
    const readResourcerequestEndDate = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=endDate&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestEndDate.status, 200);
    assert.equal(readResourcerequestEndDate.data.value.length, 1);
    expect(readResourcerequestEndDate.data.value).to.deep.equal([resourceRequestApiData[0]]);

    // based on required effort
    const readResourcerequestRequiredEffort = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=requiredEffort&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestRequiredEffort.status, 200);
    assert.equal(readResourcerequestRequiredEffort.data.value.length, 1);
    expect(readResourcerequestRequiredEffort.data.value).to.deep.equal([resourceRequestApiData[0]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test order desc.'() {
    // based on ID
    const readResourcerequestID = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=ID desc&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestID.status, 200);
    assert.equal(readResourcerequestID.data.value.length, 1);
    expect(readResourcerequestID.data.value).to.deep.equal([resourceRequestApiData[9]]);

    // based on displayId
    const readResourcerequestDisplayID = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=displayId desc&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestDisplayID.status, 200);
    assert.equal(readResourcerequestDisplayID.data.value.length, 1);
    expect(readResourcerequestDisplayID.data.value).to.deep.equal([resourceRequestApiData[9]]);

    // based on name
    const readResourcerequestName = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=name desc&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestName.status, 200);
    assert.equal(readResourcerequestName.data.value.length, 1);
    expect(readResourcerequestName.data.value).to.deep.equal([resourceRequestApiData[9]]);

    // based on description
    const readResourcerequestDescription = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=description desc&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestDescription.status, 200);
    assert.equal(readResourcerequestDescription.data.value.length, 1);
    expect(readResourcerequestDescription.data.value).to.deep.equal([resourceRequestApiData[9]]);

    // based on start date
    const readResourcerequestStartDate = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=startDate desc&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestStartDate.status, 200);
    assert.equal(readResourcerequestStartDate.data.value.length, 1);
    expect(readResourcerequestStartDate.data.value).to.deep.equal([resourceRequestApiData[9]]);

    // based on end date
    const readResourcerequestEndDate = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=endDate desc&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestEndDate.status, 200);
    assert.equal(readResourcerequestEndDate.data.value.length, 1);
    expect(readResourcerequestEndDate.data.value).to.deep.equal([resourceRequestApiData[9]]);

    // based on required effort
    const readResourcerequestRequiredEffort = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=requiredEffort desc&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequestRequiredEffort.status, 200);
    assert.equal(readResourcerequestRequiredEffort.data.value.length, 1);
    expect(readResourcerequestRequiredEffort.data.value).to.deep.equal([resourceRequestApiData[9]]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $select.'() {
    const readResourcerequest = await publicAPIClient.get(
      '/ResourceRequests?$top=1&$orderby=displayId&$select=name,displayId,ID,requiredEffort&$filter=startswith(description,\'publicAPIReadTest_\')',
    );
    assert.equal(readResourcerequest.status, 200);
    assert.equal(readResourcerequest.data.value.length, 1);
    expect(readResourcerequest.data.value).to.deep.equal([{
      ID: resourceRequestApiData[0].ID,
      displayId: resourceRequestApiData[0].displayId,
      requiredEffort: resourceRequestApiData[0].requiredEffort,
      name: resourceRequestApiData[0].name,
    }]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test key based retrieval.'() {
    const readResourcerequest = await publicAPIClient.get(
      `/ResourceRequests(${resourceRequestApiData[0].ID})`,
    );
    assert.equal(readResourcerequest.status, 200);
    expect(readResourcerequest.data).to.deep.include(resourceRequestApiData[0]);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $select with key based retrieval.'() {
    const readResourcerequest = await publicAPIClient.get(
      `/ResourceRequests(${resourceRequestApiData[0].ID})?$select=name,displayId,ID,requiredEffort`,
    );
    assert.equal(readResourcerequest.status, 200);
    expect(readResourcerequest.data).to.deep.include({
      ID: resourceRequestApiData[0].ID,
      displayId: resourceRequestApiData[0].displayId,
      requiredEffort: resourceRequestApiData[0].requiredEffort,
      name: resourceRequestApiData[0].name,
    });
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Test $metadata.'() {
    const readResourcerequest = await publicAPIClient.get(
      '/$metadata',
    );
    assert.equal(readResourcerequest.status, 200);
  }

  static async after() {
    await deleteData();
  }
}
