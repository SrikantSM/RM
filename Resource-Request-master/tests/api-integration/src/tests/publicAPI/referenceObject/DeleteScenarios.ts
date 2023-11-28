import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment } from '../../../utils';
import { referenceObjectAPIPayload } from './data';
import { ReferenceObjectRepository } from 'test-commons';
import { resourceRequestAPIPayload } from '../general/Create/data';

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
    IdAssigned:{
        code: '<none>',
        message: 'The reference object cannot be deleted as it is assigned to a resource request.',
        target: 'ID',
        '@Common.numericSeverity': 4,
    },
}

@suite
export class DeleteScenarios {

    static async before() {
        referenceObjectApiRepository = await testEnvironment.getReferenceObjectRepository();
        publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete Reference Object with correct ID Passed'() {

        //Create a reference object
        const createReferenceObject = await publicAPIClient.post(
            '/ReferenceObjects',
            {
              displayId: referenceObjectAPIPayload[1].displayId,
              name: referenceObjectAPIPayload[1].name,
              typeCode: referenceObjectAPIPayload[1].typeCode_code,
              startDate: referenceObjectAPIPayload[1].startDate,
              endDate: referenceObjectAPIPayload[1].endDate,
            },
          );
          assert.equal(createReferenceObject.status, 201);

        // Delete call passing the created reference object Id.
        const deleteReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );

        assert.equal(deleteReferenceObject.status,204);

        await referenceObjectApiRepository.deleteOne(createReferenceObject.data);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete Reference Object linked to a Resource Request'() {

        //Create a Reference Object.
        const createReferenceObject = await publicAPIClient.post(
            '/ReferenceObjects',
            {
              displayId: referenceObjectAPIPayload[1].displayId,
              name: referenceObjectAPIPayload[1].name,
              typeCode: referenceObjectAPIPayload[1].typeCode_code,
              startDate: referenceObjectAPIPayload[1].startDate,
              endDate: referenceObjectAPIPayload[1].endDate,
            },
          );
          assert.equal(createReferenceObject.status, 201);

          //Create a resource request linking the created reference Object.
          const createResourceRequest = await publicAPIClient.post(
            '/ResourceRequests',
            {
              startDate: resourceRequestAPIPayload.startDate,
              endDate: resourceRequestAPIPayload.endDate,
              requiredEffort: resourceRequestAPIPayload.requiredEffort,
              name: resourceRequestAPIPayload.name,
              referenceObjectId: createReferenceObject.data.ID,
            },
          );

        //Delete call
        const deleteReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );

        // Assert 400 & Error message
        assert.equal(deleteReferenceObject.status,400);
        const expected = JSON.parse(JSON.stringify(errorMessageStructure.generic));
        expected.error.details = [errorMessageStructure.IdAssigned];
        assert.deepEqual(deleteReferenceObject.data, expected);


        // Delete created resource request & reference object.
        const clearResourceRequest = await publicAPIClient.delete(
            `ResourceRequests(${createResourceRequest.data.ID})`);
        assert.equal(clearResourceRequest.status, 204);

        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);
    }

}
