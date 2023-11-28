import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment } from '../../../../utils';
import { referenceObjectAPIPayload } from '../data';
import { ReferenceObjectRepository } from 'test-commons';

let publicAPIClient: any;
let referenceObjectApiRepository: ReferenceObjectRepository;


@suite
export class UpdatePositive {

    static async before() {
        referenceObjectApiRepository = await testEnvironment.getReferenceObjectRepository();
        publicAPIClient = await testEnvironment.getResourceRequestPublicApiServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update Reference Object with the entire payload'() {

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

        //Update reference object's displayId, name , startDate & endDate
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
            {
                displayId: referenceObjectAPIPayload[2].displayId,
                name: referenceObjectAPIPayload[2].name,
                typeCode: referenceObjectAPIPayload[2].typeCode_code,
                startDate: referenceObjectAPIPayload[2].startDate,
                endDate: referenceObjectAPIPayload[2].endDate,
            },
        );
        assert.equal(updateReferenceObject.status, 200);

        this.validateReferenceObjectAPIResponse(updateReferenceObject.data,{
                displayId: referenceObjectAPIPayload[2].displayId,
                name: referenceObjectAPIPayload[2].name,
                typeCode: referenceObjectAPIPayload[2].typeCode_code,
                startDate: referenceObjectAPIPayload[2].startDate,
                endDate: referenceObjectAPIPayload[2].endDate,
        });

        // Delete the reference Object
        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update Reference Object with start date'() {

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

        //Update reference object's startDate
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
            {
                startDate: '2023-02-20',
                
            },
        );
        assert.equal(updateReferenceObject.status, 200);

        this.validateReferenceObjectAPIResponse(updateReferenceObject.data,{
                displayId: referenceObjectAPIPayload[1].displayId,
                name: referenceObjectAPIPayload[1].name,
                typeCode: referenceObjectAPIPayload[1].typeCode_code,
                startDate: '2023-02-20',
                endDate: referenceObjectAPIPayload[1].endDate,
        });

        // Delete the reference Object
        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update Reference Object with end date'() {

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

        //Update reference object's endDate
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
            {
                endDate: referenceObjectAPIPayload[2].endDate,
                
            },
        );
        assert.equal(updateReferenceObject.status, 200);

        this.validateReferenceObjectAPIResponse(updateReferenceObject.data,{
                displayId: referenceObjectAPIPayload[1].displayId,
                name: referenceObjectAPIPayload[1].name,
                typeCode: referenceObjectAPIPayload[1].typeCode_code,
                startDate: referenceObjectAPIPayload[1].startDate,
                endDate: referenceObjectAPIPayload[2].endDate,
        });

        // Delete the reference Object
        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update Reference Object with display ID'() {

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

        //Update reference object's displayId
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
            {
                displayId: referenceObjectAPIPayload[2].displayId,
                
            },
        );
        assert.equal(updateReferenceObject.status, 200);

        this.validateReferenceObjectAPIResponse(updateReferenceObject.data,{
                displayId: referenceObjectAPIPayload[2].displayId,
                name: referenceObjectAPIPayload[1].name,
                typeCode: referenceObjectAPIPayload[1].typeCode_code,
                startDate: referenceObjectAPIPayload[1].startDate,
                endDate: referenceObjectAPIPayload[1].endDate,
        });

        // Delete the reference Object
        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update Reference Object with name'() {

        //Create a reference object
        const createReferenceObject = await publicAPIClient.post(
            '/ReferenceObjects',
            {
              displayId: referenceObjectAPIPayload[2].displayId,
              name: referenceObjectAPIPayload[2].name,
              typeCode: referenceObjectAPIPayload[2].typeCode_code,
              startDate: referenceObjectAPIPayload[2].startDate,
              endDate: referenceObjectAPIPayload[2].endDate,
            },
          );
          assert.equal(createReferenceObject.status, 201);

        //Update reference object's name
        const updateReferenceObject = await publicAPIClient.patch(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
            {
                name: referenceObjectAPIPayload[1].name,
                
            },
        );
        assert.equal(updateReferenceObject.status, 200);

        this.validateReferenceObjectAPIResponse(updateReferenceObject.data,{
                displayId: referenceObjectAPIPayload[2].displayId,
                name: referenceObjectAPIPayload[1].name,
                typeCode: referenceObjectAPIPayload[2].typeCode_code,
                startDate: referenceObjectAPIPayload[2].startDate,
                endDate: referenceObjectAPIPayload[2].endDate,
        });

        // Delete the reference Object
        const clearReferenceObject = await publicAPIClient.delete(
            `ReferenceObjects(ID=${createReferenceObject.data.ID})`,
          );
        assert.equal(clearReferenceObject.status, 204);

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
