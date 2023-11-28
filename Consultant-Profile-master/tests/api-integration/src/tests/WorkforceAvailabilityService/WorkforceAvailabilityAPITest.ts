import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { WorkforceAvailabilityServiceRepository } from '../../utils/serviceRepository/WorkforceAvailabilityService-Repository';

import {
    allWorkforcePerson,
    allWorkAssignment,
    allJobDetails,
    allWorkforceAvailability,
    workforceAvailability1,
    workforceAvailability2,
    workforceAvailability3,
    allCapacity,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProjectExperienceTestUtil } from '../ProjectExperienceService/ProjectExperienceTestUtil';
import {
    WorkforceAvailability, WorkforceAvailabilityInterval, WorkforceAvailabilitySupplement,
} from '../../serviceEntities/workforceAvailabillityService';

@suite('WorkforceAvailabilityService/WorkforceAvailability')
export class WorkforceAvailabilityAPITest extends WorkforceAvailabilityServiceRepository {
    readonly availabilityID = 'b3a980c8-257e-429a-a8d3-f1c2c1695ed2';

    readonly availabilityIntervalWithIncorrectContributionFormat: WorkforceAvailabilityInterval = {
        intervalStart: '09:00:00',
        intervalEnd: '16:00:00',
        contribution: '070:00',
    };

    readonly availabilitySupplementWithIncorrectContributionFormat: WorkforceAvailabilitySupplement = {
        intervalStart: '09:00:00',
        intervalEnd: '16:00:00',
        contribution: '070:00',
    };

    readonly availabilityIntervalWithIncorrectTimeDifference: WorkforceAvailabilityInterval = {
        intervalStart: '09:00:00',
        intervalEnd: '16:00:00',
        contribution: '04:00',
    };

    readonly availabilitySupplementWithIncorrectTimeDifference: WorkforceAvailabilitySupplement = {
        intervalStart: '09:00:00',
        intervalEnd: '16:00:00',
        contribution: '04:00',
    };

    readonly availabilityIntervalWithIncorrectIntervalStartEnd: WorkforceAvailabilityInterval = {
        intervalStart: '09:00:00',
        intervalEnd: '08:00:00',
        contribution: '04:00',
    };

    readonly availabilitySupplementWithIncorrectIntervalStartEnd: WorkforceAvailabilitySupplement = {
        intervalStart: '09:00:00',
        intervalEnd: '08:00:00',
        contribution: '04:00',
    };

    readonly updatedAvailabilityIntervals: WorkforceAvailabilityInterval[] = [{
        intervalStart: '09:00',
        intervalEnd: '13:00',
        contribution: '04:00',
    }];

    readonly updatedAvailabilitySupplements: WorkforceAvailabilitySupplement[] = [{
        intervalStart: '13:00',
        intervalEnd: '17:00',
        contribution: '04:00',
    }];

    readonly changedAt = new Date().toISOString().slice(0, 10);

    readonly changedBy = 'anonymous';

    public constructor() {
        super('$batch');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.jobDetailRepository.insertMany(allJobDetails);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.workforceAvailabilityRepository.deleteMany(allWorkforceAvailability);
        await this.resourceCapacityRepository.deleteMany(allCapacity);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability.'() {
        const availability1 = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(workforceAvailability1.id, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody1 = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability1));
        await this.postBatch(requestBody1);
        const availability2 = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(workforceAvailability2.id, workforceAvailability2.workAssignmentID, workforceAvailability2.workforcePerson_ID, workforceAvailability2.availabilityDate, workforceAvailability2.normalWorkingTime, workforceAvailability2.availabilityIntervals, workforceAvailability2.availabilitySupplements);
        const requestBody2 = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability2));
        await this.postBatch(requestBody2);
        const availability3 = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(workforceAvailability3.id, workforceAvailability3.workAssignmentID, workforceAvailability3.workforcePerson_ID, workforceAvailability3.availabilityDate, workforceAvailability3.normalWorkingTime, workforceAvailability3.availabilityIntervals, workforceAvailability3.availabilitySupplements);
        const requestBody3 = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability3));
        const response = await this.postBatch(requestBody3);
        this.responses.push(response);
        const responseBody = response.data;
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '201 Created');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const actualAvailability = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as WorkforceAvailability;
        availability3.id = actualAvailability.id;
        expect(actualAvailability).to.deep.equal(availability3);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get all workforce availability.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('WorkforceAvailability');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualAvailability = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true)) as WorkforceAvailability[];
        const expectedAvailability1:WorkforceAvailability = ProjectExperienceTestUtil.prepareAvailability(workforceAvailability1);
        expectedAvailability1.id = actualAvailability[0].id;
        const expectedAvailability2:WorkforceAvailability = ProjectExperienceTestUtil.prepareAvailability(workforceAvailability2);
        expectedAvailability2.id = actualAvailability[1].id;
        const expectedAvailability3:WorkforceAvailability = ProjectExperienceTestUtil.prepareAvailability(workforceAvailability3);
        expectedAvailability3.id = actualAvailability[2].id;
        const expectedAvailability:WorkforceAvailability[] = [expectedAvailability1, expectedAvailability2, expectedAvailability3];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isAtLeast(actualAvailability.length, 3, 'Expected response to contain 3 Availabilities.');
        assert.isDefined(actualAvailability, 'Expected a list of workforce availability.');
        expect(actualAvailability).to.deep.include.any.members(expectedAvailability);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a workforce availability.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const actualAvailability = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as WorkforceAvailability;
        const expectedAvailability:WorkforceAvailability = ProjectExperienceTestUtil.prepareAvailability(workforceAvailability1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(actualAvailability, 'Expected a workforce availability.');
        expectedAvailability.id = actualAvailability.id;
        expect(actualAvailability).to.deep.equal(expectedAvailability);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a non-unique availability.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        // will be uncommented once translation PR is merged.
        // const responseBody = response.data;
        // const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        // assert.equal(errorResponse.error.message, 'Availability already exists for the entered combination of work assignment ID, workforce person ID, and date, or the workforce availability ID is not unique.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '409 Conflict');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with work assignment ID does not exist.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered work assignment ID does not belong to the workforce person. Please enter a valid work assignment or a workforce person ID.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with work assignment ID does not exist.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workforcePerson_ID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered work assignment ID does not belong to the workforce person. Please enter a valid work assignment or a workforce person ID.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with work assignment ID does not exist.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workforcePerson_ID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered work assignment ID does not belong to the workforce person. Please enter a valid work assignment or a workforce person ID.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with missing work assignment ID.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, undefined, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'workAssignmentID\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'workAssignmentID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with workforce person ID does not exist.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, this.availabilityID, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered workforce person ID does not exist.');
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with workforce person ID does not exist.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, this.availabilityID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered workforce person ID does not exist.');
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with workforce person ID does not exist.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, this.availabilityID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered workforce person ID does not exist.');
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with missing workforce person ID.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, undefined, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'workforcePerson_ID\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with missing workforce person ID.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, undefined, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'workforcePerson_ID\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with missing workforce person ID.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, undefined, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'workforcePerson_ID\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with workforce person ID whose business purpose is completed.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, allWorkforcePerson[3].ID, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, `Availability is not relevant, since the end of purpose is set for the workforce person ${allWorkforcePerson[3].ID}.`);
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with workforce person ID whose business purpose is completed.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, allWorkforcePerson[3].ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, `Availability is not relevant, since the end of purpose is set for the workforce person ${allWorkforcePerson[3].ID}.`);
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with workforce person ID whose business purpose is completed.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, allWorkforcePerson[3].ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, `Availability is not relevant, since the end of purpose is set for the workforce person ${allWorkforcePerson[3].ID}.`);
        assert.equal(errorResponse.error.target, 'workforcePerson_ID');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with non-guid workforce person ID.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, 'notaguid', '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'workforcePerson_ID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with non-guid workforce person ID.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, 'notaguid', workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'workforcePerson_ID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with non-guid workforce person ID.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, 'notaguid', workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'workforcePerson_ID\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with missing availability date.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, undefined, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'availabilityDate\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'availabilityDate');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with an availability date for which no active work assignment found.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2020-01-01', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'There is no active work assignment for the date of availability.');
        assert.equal(errorResponse.error.target, 'availabilityDate');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with an availability date for which no active work assignment found.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, undefined, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2020-01-01)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'There is no active work assignment for the date of availability.');
        assert.equal(errorResponse.error.target, 'availabilityDate');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with an availability date for which no active work assignment found.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, undefined, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2020-01-01)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'There is no active work assignment for the date of availability.');
        assert.equal(errorResponse.error.target, 'availabilityDate');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with incorrect availability date format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, 'incorrectFormat', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'availabilityDate\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with incorrect availability date format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, 'incorrectFormat', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=incorrectFormat)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The key value \'availabilityDate\' is invalid.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with incorrect availability date format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, 'incorrectFormat', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=incorrectFormat)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The key value \'availabilityDate\' is invalid.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with missing normal working time.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', undefined, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'normalWorkingTime\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'normalWorkingTime');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with missing normal working time.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', undefined, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'normalWorkingTime\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'normalWorkingTime');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with missing normal working time.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', undefined, workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'normalWorkingTime\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'normalWorkingTime');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with zero normal working time.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '00:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, '2016/01/01 will be marked as a non-working day since the normal working time is zero.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with zero normal working time.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '00:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, '2016/01/01 will be marked as a non-working day since the normal working time is zero.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with zero normal working time.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '00:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, '2016/01/01 will be marked as a non-working day since the normal working time is zero.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with incorrect normal working time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', 'incorrectFormat', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'normalWorkingTime\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with incorrect normal working time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, 'incorrectFormat', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'normalWorkingTime\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with incorrect normal working time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, 'incorrectFormat', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Could not deserialize request payload: Invalid value for property \'normalWorkingTime\'.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with normal working time equal above 24:00.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '24:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered format for normal working time is invalid. The expected format is HH:mm and the time must be less than 24:00.');
        assert.equal(errorResponse.error.target, 'normalWorkingTime');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with normal working time equal above 24:00.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '24:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered format for normal working time is invalid. The expected format is HH:mm and the time must be less than 24:00.');
        assert.equal(errorResponse.error.target, 'normalWorkingTime');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with normal working time equal above 24:00.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '24:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered format for normal working time is invalid. The expected format is HH:mm and the time must be less than 24:00.');
        assert.equal(errorResponse.error.target, 'normalWorkingTime');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with missing availability intervals.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, undefined, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'availabilityIntervals\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with missing availability intervals.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, undefined, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'availabilityIntervals\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with missing availability intervals.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, undefined, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'availabilityIntervals\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with missing availability supplements.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'availabilitySupplements\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with missing availability supplements.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'availabilitySupplements\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with missing availability supplements.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, '2023-04-05', workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, undefined);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=2023-04-05)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Value of element \'availabilitySupplements\' in entity \'WorkforceAvailabilityService.WorkforceAvailability\' is required');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with incorrect interval contribution time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectContributionFormat], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered time format for availability interval contribution is invalid. The format should be HH:mm and time should be less than 24:00.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with incorrect interval contribution time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectContributionFormat], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered time format for availability interval contribution is invalid. The format should be HH:mm and time should be less than 24:00.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with incorrect interval contribution time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectContributionFormat], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered time format for availability interval contribution is invalid. The format should be HH:mm and time should be less than 24:00.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with incorrect interval time difference.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectTimeDifference], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The difference between the interval start time and interval end time must be equal to the contribution.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with incorrect interval time difference.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectTimeDifference], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The difference between the interval start time and interval end time must be equal to the contribution.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with incorrect interval time difference.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectTimeDifference], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The difference between the interval start time and interval end time must be equal to the contribution.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with availability intervals start after it ends.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectIntervalStartEnd], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start of the interval must be earlier than its end.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with availability intervals start after it ends.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectIntervalStartEnd], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start of the interval must be earlier than its end.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with availability intervals start after it ends.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [this.availabilityIntervalWithIncorrectIntervalStartEnd], workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start of the interval must be earlier than its end.');
        assert.equal(errorResponse.error.target, 'availabilityIntervals');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with incorrect supplement contribution time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectContributionFormat]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered time format for availability supplement contribution is invalid. The format should be HH:mm and time should be less than 24:00.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with incorrect supplement contribution time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectContributionFormat]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered time format for availability supplement contribution is invalid. The format should be HH:mm and time should be less than 24:00.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with incorrect supplement contribution time format.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectContributionFormat]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The entered time format for availability supplement contribution is invalid. The format should be HH:mm and time should be less than 24:00.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with incorrect supplement time difference.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectTimeDifference]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The difference between the interval start time and interval end time must be equal to the contribution.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with incorrect supplement time difference.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectTimeDifference]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The difference between the interval start time and interval end time must be equal to the contribution.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with incorrect supplement time difference.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectTimeDifference]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The difference between the interval start time and interval end time must be equal to the contribution.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with availability supplements start after it ends.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectIntervalStartEnd]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start of the interval must be earlier than its end.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with availability supplements start after it ends.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectIntervalStartEnd]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start of the interval must be earlier than its end.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with availability supplements start after it ends.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, workforceAvailability1.availabilityIntervals, [this.availabilitySupplementWithIncorrectIntervalStartEnd]);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'The start of the interval must be earlier than its end.');
        assert.equal(errorResponse.error.target, 'availabilitySupplements');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with availability intervals and supplements both are empty.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [], []);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A normal working day must have availability intervals and supplements.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with availability intervals and supplements both are empty.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [], []);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A normal working day must have availability intervals and supplements.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with availability intervals and supplements both are empty.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, workforceAvailability1.normalWorkingTime, [], []);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'A normal working day must have availability intervals and supplements.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with partial data entered for the day.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '09:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'You have entered only partial information for the date 2016/01/01.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with partial data entered for the day.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '09:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'You have entered only partial information for the date 2016/01/01.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with partial data entered for the day.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '09:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'You have entered only partial information for the date 2016/01/01.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a workforce availability with time overbooked for the day.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '07:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'WorkforceAvailability', JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'You have entered more time than 07:00 hours.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability with time overbooked for the day.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '07:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'You have entered more time than 07:00 hours.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability with time overbooked for the day.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, workforceAvailability1.workAssignmentID, workforceAvailability1.workforcePerson_ID, workforceAvailability1.availabilityDate, '07:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${workforceAvailability1.workAssignmentID}',availabilityDate=${workforceAvailability1.availabilityDate})`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'You have entered more time than 07:00 hours.');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '400 Bad Request');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a workforce availability.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, allWorkAssignment[5].externalID, allWorkforcePerson[2].ID, '2023-04-11', '08:00', this.updatedAvailabilityIntervals, this.updatedAvailabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `WorkforceAvailability(workAssignmentID='${allWorkAssignment[5].externalID}',availabilityDate=2023-04-11)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '200 OK');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const actualAvailability = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as WorkforceAvailability;
        availability.id = actualAvailability.id;
        expect(actualAvailability).to.deep.equal(availability);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a workforce availability.'() {
        const availability = ProjectExperienceTestUtil.prepareAvailabilityRequestBody(this.availabilityID, allWorkAssignment[5].externalID, allWorkforcePerson[2].ID, '2023-04-11', '08:00', workforceAvailability1.availabilityIntervals, workforceAvailability1.availabilitySupplements);
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `WorkforceAvailability(workAssignmentID='${allWorkAssignment[5].externalID}',availabilityDate=2023-04-11)`, JSON.stringify(availability));
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '200 OK');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
        const actualAvailability = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as WorkforceAvailability;
        availability.id = actualAvailability.id;
        expect(actualAvailability).to.deep.equal(availability);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete an external work experience that does not exist.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `WorkforceAvailability(workAssignmentID='${allWorkAssignment[5].externalID}',availabilityDate=2023-04-11)`, '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const errorResponse = JSON.parse(await ProjectExperienceTestUtil.parseBatchErrorResponse(responseBody));
        assert.equal(errorResponse.error.message, 'Not authorized to send event \'DELETE\' to \'WorkforceAvailabilityService.WorkforceAvailability\'');
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }
}
