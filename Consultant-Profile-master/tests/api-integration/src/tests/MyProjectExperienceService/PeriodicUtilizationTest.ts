import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allEmployeeHeaders,
    allEmail,
    allAssignments,
    allWorkAssignment,
    allWorkforcePerson,
    allResourceCapacity,
    allResourceHeaders,
    allAssignmentBuckets,
    employeeHeaderWithDescription1,
    allWorkAssignmentDetail,
    workAssignment2,
    allBookedCapacityAggregates,
} from '../../data';
import { TEST_TIMEOUT, TEST_TIMEOUT_TIME_GENERATION } from '../../utils/serviceRepository/Service-Repository';
import { PeriodicUtilization } from '../../serviceEntities/myProjectExperienceService/PeriodicUtilization';
import { TestUtility } from '../../utils/TestUtility';
import { createPeriodicUtilization } from '../../data/service/myProjectExperienceService';

@suite('MyProjectExperienceService/PeriodicUtilization')
export class PeriodicUtilizationTest extends MyProjectExperienceServiceRepository {
    public constructor() { super('PeriodicUtilization'); }

    @timeout(TEST_TIMEOUT_TIME_GENERATION)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.emailRepository.insertMany(allEmail);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.resourceHeaderRepository.insertMany(allResourceHeaders);
        await this.resourceCapacityRepository.insertMany(allResourceCapacity);
        await this.assignmentsRepository.insertMany(allAssignments);
        await this.assignmentBucketRepository.insertMany(allAssignmentBuckets);
        await this.bookedCapacityAggregateRepository.insertMany(allBookedCapacityAggregates);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.emailRepository.deleteMany(allEmail);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.resourceHeaderRepository.deleteMany(allResourceHeaders);
        await this.resourceCapacityRepository.deleteMany(allResourceCapacity);
        await this.assignmentsRepository.deleteMany(allAssignments);
        await this.assignmentBucketRepository.deleteMany(allAssignmentBuckets);
        await this.bookedCapacityAggregateRepository.deleteMany(allBookedCapacityAggregates);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of PeriodicUtilization.'() {
        const response = await this.get();
        this.responses.push(response);
        const aggregateMonthUtilizations = response.data.value as PeriodicUtilization[];
        const expectedPeriodicUtilizations = TestUtility.preparePeriodicUtilizations([
            { resourceCapacity: allResourceCapacity[0], assignmentBucket: allAssignmentBuckets[0] },
            { resourceCapacity: allResourceCapacity[1], assignmentBucket: allAssignmentBuckets[1] },
            { resourceCapacity: allResourceCapacity[2], assignmentBucket: allAssignmentBuckets[2] },
            { resourceCapacity: allResourceCapacity[3], assignmentBucket: allAssignmentBuckets[3] },
            { resourceCapacity: allResourceCapacity[4], assignmentBucket: allAssignmentBuckets[4] },
            { resourceCapacity: allResourceCapacity[5], assignmentBucket: allAssignmentBuckets[5] },
        ], allEmployeeHeaders[0], false);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isTrue(aggregateMonthUtilizations.length >= 6, 'Expected list of capacities having 6 records.');
        expect(aggregateMonthUtilizations).to.deep.include.any.members(expectedPeriodicUtilizations);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of PeriodicUtilization for a user not present in the DB.'() {
        const response = await this.getWithNoConsultantInDB();
        this.responses.push(response);
        const aggregateMonthUtilizations = response.data.value as PeriodicUtilization[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(aggregateMonthUtilizations, 'Expected an empty list of periodic utilizations.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of PeriodicUtilization without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a PeriodicUtilization of one consultant without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${workAssignment2.ID},CALMONTH='202002')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a PeriodicUtilization is not allowed.'() {
        const response = await this.create(createPeriodicUtilization);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a PeriodicUtilization should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating PeriodicUtilization is not allowed.'() {
        const updatePeriodicUtilization = createPeriodicUtilization;
        updatePeriodicUtilization.ID = employeeHeaderWithDescription1.ID;
        updatePeriodicUtilization.utilizationPercentage = 2;
        const response = await this.update(`(ID=${workAssignment2.ID},CALMONTH='${updatePeriodicUtilization.CALMONTH}')`, updatePeriodicUtilization);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating PeriodicUtilization should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting PeriodicUtilization is not allowed.'() {
        const response = await this.delete(`(ID=${workAssignment2.ID},CALMONTH='${createPeriodicUtilization.CALMONTH}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a PeriodicUtilization should not be possible and expected status code should be 403(Forbidden).');
    }
}
