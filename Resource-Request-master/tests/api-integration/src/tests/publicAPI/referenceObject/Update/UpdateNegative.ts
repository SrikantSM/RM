import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import { referenceObjectAPIPayload } from '../data';
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
    startDateBeyondEndDate:{
        code: '<none>',
        message: 'The start date of the reference object must be before the end date 2023-02-28.',
        target: 'startDate',
        '@Common.numericSeverity': 4,
    },
    endDatePriorToStartDate:{
        code: '<none>',
        message: 'The end date of the reference object must be after the start date 2023-01-10.',
        target: 'endDate',
        '@Common.numericSeverity': 4,
    },
}

@suite
export class UpdateNegative {

    static async before() {
        referenceObjectApiRepository = await testEnvironment.getReferenceObjectRepository();
        publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
    }


    @test(timeout(TEST_TIMEOUT))
    async 'Update reference object with a start date beyond end date'() {

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

        // Update reference object start date with a date beyond end date
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
            {
                startDate: '2023-03-01',
                
            },
        );
        assert.equal(updateReferenceObject.status,400);
        const expected = JSON.parse(JSON.stringify(errorMessageStructure.generic));
        expected.error.details = [errorMessageStructure.startDateBeyondEndDate];
        assert.deepEqual(updateReferenceObject.data, expected);
        
        // Delete created reference object
        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update reference object with a end date earlier to the start date'() {

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

        // Update reference object start date with a date beyond end date
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
            {
                endDate: '2023-01-08',
                
            },
        );
        assert.equal(updateReferenceObject.status,400);
        const expected = JSON.parse(JSON.stringify(errorMessageStructure.generic));
        expected.error.details = [errorMessageStructure.endDatePriorToStartDate];
        assert.deepEqual(updateReferenceObject.data, expected);
        
        // Delete created reference object
        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update reference object passing a wrong reference object ID'() {

        // Random UUID passed to update end Date
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=25062d6e-7260-4314-91e9-fe37ddb89e3e)`,
            {
                endDate: '2023-01-08',
                
            },
        );

        assert.equal(updateReferenceObject.status,500);
        
    }
}