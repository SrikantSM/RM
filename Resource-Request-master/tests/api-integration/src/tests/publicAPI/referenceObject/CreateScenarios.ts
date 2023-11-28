import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';
import { referenceObjectAPIPayload } from './data';
import { ReferenceObjectRepository } from 'test-commons';

let publicAPIClient: any;
let referenceObjectApiRepository: ReferenceObjectRepository;
const errorMessageStructure = {
  generic: {
    error: {
      code: '400',
      message: 'The following errors have occurred:',
      details: [],
    },
  },
  endDate: {
    code: '<none>',
    message: 'ProvdisplayIde an end date.',
    target: 'endDate',
    '@Common.numericSeverity': 4,
  },
  typeCode: {
    code: '<none>',
    message: 'Enter the code of an existing reference object type.',
    target: 'typeCode',
    '@Common.numericSeverity': 4,
  },
  startDateGreater: {
    code: '<none>',
    message: 'The requested start date must be before the requested end date.',
    target: 'startDate',
    '@Common.numericSeverity': 4,
  },
  typeCodeZero: {
    code: '<none>',
    message: 'Enter a suitable code that matches the reference object.',
    target: 'typeCode',
    '@Common.numericSeverity': 4,
  },
};

const mandatoryFieldsErrorMsgStructure = {
  displayId: {
    error: {
    code: '409003',
    message: "Value of element 'displayId' in entity 'ResourceRequestService.ReferenceObjects' is required",
    target: 'displayId',
  }
 }
}

@suite
export class CreateScenarios {


  static async before() {
    referenceObjectApiRepository = await testEnvironment.getReferenceObjectRepository();
    publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create Reference Object with all field values passed'() {
    const createReferenceObject = await publicAPIClient.post(
      '/ReferenceObjects',
      {
        displayId: referenceObjectAPIPayload[0].displayId,
        name: referenceObjectAPIPayload[0].name,
        typeCode: referenceObjectAPIPayload[0].typeCode_code,
        startDate: referenceObjectAPIPayload[0].startDate,
        endDate: referenceObjectAPIPayload[0].endDate,

      },
    );
    assert.equal(createReferenceObject.status, 201);

    this.validateReferenceObjectAPIResponse(createReferenceObject.data, {
      displayId: referenceObjectAPIPayload[0].displayId,
      name: referenceObjectAPIPayload[0].name,
      typeCode: referenceObjectAPIPayload[0].typeCode_code,
      startDate: referenceObjectAPIPayload[0].startDate,
      endDate: referenceObjectAPIPayload[0].endDate,
    });

    await referenceObjectApiRepository.deleteOne(createReferenceObject.data);
  }

  @test(timeout(TEST_TIMEOUT)) 
  async 'Create Reference Object passing typeCode as 0'() {
    const negativeRequest = await publicAPIClient.post(
      '/ReferenceObjects',
      {
        displayId: referenceObjectAPIPayload[0].displayId,
        typeCode: 0,

        name: referenceObjectAPIPayload[0].name,
        startDate: referenceObjectAPIPayload[0].startDate,
        endDate: referenceObjectAPIPayload[0].endDate,

      },
    );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.typeCodeZero];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create Reference Object without a valid typeCode'() {
    const negativeRequest = await publicAPIClient.post(
        '/ReferenceObjects',
        {
          displayId: referenceObjectAPIPayload[0].displayId,
          typeCode: 3,
          name: referenceObjectAPIPayload[0].name,
          startDate: referenceObjectAPIPayload[0].startDate,
          endDate: referenceObjectAPIPayload[0].endDate,

        },
      );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.typeCode];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create Reference Object with a start date beyond end date'() {
    const negativeRequest = await publicAPIClient.post(
        '/ReferenceObjects',
        {
          displayId: referenceObjectAPIPayload[0].displayId,
          typeCode: referenceObjectAPIPayload[0].typeCode_code,
          name: referenceObjectAPIPayload[0].name,
          startDate: referenceObjectAPIPayload[0].endDate,
          endDate: referenceObjectAPIPayload[0].startDate,

        },
      );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(errorMessageStructure.generic));
    expectedPaylod.error.details = [errorMessageStructure.startDateGreater];
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  @test(timeout(TEST_TIMEOUT))
  async 'Create Reference Object without a displayId'() {
    const negativeRequest = await publicAPIClient.post(
        '/ReferenceObjects',
        {
          typeCode: referenceObjectAPIPayload[0].typeCode_code,
          name: referenceObjectAPIPayload[0].name,
          startDate: referenceObjectAPIPayload[0].startDate,
          endDate: referenceObjectAPIPayload[0].endDate,

        },
      );
    assert.equal(negativeRequest.status, 400);
    const expectedPaylod = JSON.parse(JSON.stringify(mandatoryFieldsErrorMsgStructure.displayId));
    assert.deepEqual(negativeRequest.data, expectedPaylod);
  }

  validateReferenceObjectAPIResponse(response:any, expected:any) {
    assert.deepEqual(Object.keys(response), ['@context', '@metadataEtag', 'ID', 'displayId', 'name', 'typeCode', 'startDate', 'endDate']);
    assert.notEqual(response.displayId, null);
    assert.notEqual(response.displayId, '');
    assert.notEqual(response.ID, null);
    assert.notEqual(response.ID, '');

    assert.equal(response.startDate, expected.startDate);
    assert.equal(response.endDate, expected.endDate);
    assert.equal(response.typeCode, expected.typeCode);
    assert.equal(response.name, expected.name);
    assert.equal(response.displayId, expected.displayId);
  }

}
