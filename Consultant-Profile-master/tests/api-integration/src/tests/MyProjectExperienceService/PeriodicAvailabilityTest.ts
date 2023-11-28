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
    workAssignment3,
    assignmentBucket11,
    assignmentBucket12,
    assignmentBucket13,
    assignmentBucket14,
    assignmentBucket15,
    assignmentBucket16,
    allBookedCapacityAggregates,
} from '../../data';
import { createPeriodicAvailability } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT, TEST_TIMEOUT_TIME_GENERATION } from '../../utils/serviceRepository/Service-Repository';
import { PeriodicAvailability } from '../../serviceEntities/myProjectExperienceService/PeriodicAvailability';
import { TestUtility } from '../../utils/TestUtility';

@suite('MyProjectExperienceService/PeriodicAvailability')
export class PeriodicAvailabilityTest extends MyProjectExperienceServiceRepository {
    public constructor() { super('PeriodicAvailability'); }

    @timeout(TEST_TIMEOUT_TIME_GENERATION)
    static async before() {
        const now = new Date(Date.now());
        const currentYearStart = new Date(Date.UTC(now.getFullYear(), 0, 1));
        const currentYearPlusTwoStart = new Date(Date.UTC(now.getFullYear() + 2, 0, 1));
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
        await this.fillTimeDimProcedure.callProcedure('05', currentYearStart.toJSON(), currentYearPlusTwoStart.toJSON());
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
    async 'Get a list of PeriodicAvailability.'() {
        const response = await this.get();
        this.responses.push(response);
        const aggregateMonthCapacities = response.data.value as PeriodicAvailability[];
        const expectedPeriodicAvailabilties = TestUtility.preparePeriodicAvailabilities([
            { resourceCapacity: allResourceCapacity[0], assignmentBucket: allAssignmentBuckets[0] },
            { resourceCapacity: allResourceCapacity[1], assignmentBucket: allAssignmentBuckets[1] },
            { resourceCapacity: allResourceCapacity[2], assignmentBucket: allAssignmentBuckets[2] },
            { resourceCapacity: allResourceCapacity[3], assignmentBucket: allAssignmentBuckets[3] },
            { resourceCapacity: allResourceCapacity[4], assignmentBucket: allAssignmentBuckets[4] },
            { resourceCapacity: allResourceCapacity[5], assignmentBucket: allAssignmentBuckets[5] },
        ], allEmployeeHeaders[0]);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isTrue(aggregateMonthCapacities.length >= 6, 'Expected list of capacities having 6 records.');
        expect(aggregateMonthCapacities).to.deep.include.any.members(expectedPeriodicAvailabilties);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of PeriodicAvailability for a user not present in the DB.'() {
        const response = await this.getWithNoConsultantInDB();
        this.responses.push(response);
        const aggregateMonthCapacities = response.data.value as PeriodicAvailability[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(aggregateMonthCapacities, 'Expected an empty list of periodic availia.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of PeriodicAvailability without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get PeriodicAvailability of one consultant for the current month where monthly utilization is 50%.'() {
        const now = new Date(Date.now());
        const calendarMonth = (`0${now.getMonth() + 1}`).slice(-2);
        const calMonth = `${now.getFullYear()}${calendarMonth}`;
        const response = await this.get(`(ID=${workAssignment2.ID},CALMONTH='${calMonth}')`);
        this.responses.push(response);
        const aggregateMonthCapacity = response.data;
        delete aggregateMonthCapacity['@context'];
        delete aggregateMonthCapacity['@metadataEtag'];
        const expectedPeriodicAvailabiltiy = TestUtility.preparePeriodicAvailability(allResourceCapacity[0], allEmployeeHeaders[0], assignmentBucket11, 0);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(aggregateMonthCapacity).to.eql(expectedPeriodicAvailabiltiy);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get PeriodicAvailability of one consultant for one month from now where monthly utilization is 75%.'() {
        const now = new Date(Date.now());
        const nowPlusone = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const calendarMonth = (`0${nowPlusone.getMonth() + 1}`).slice(-2);
        const calMonth = `${nowPlusone.getFullYear()}${calendarMonth}`;
        const response = await this.get(`(ID=${workAssignment2.ID},CALMONTH='${calMonth}')`);
        this.responses.push(response);
        const aggregateMonthCapacity = response.data;
        delete aggregateMonthCapacity['@context'];
        delete aggregateMonthCapacity['@metadataEtag'];
        const expectedPeriodicAvailabiltiy = TestUtility.preparePeriodicAvailability(allResourceCapacity[1], allEmployeeHeaders[0], assignmentBucket12, 1);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(aggregateMonthCapacity).to.eql(expectedPeriodicAvailabiltiy);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get PeriodicAvailability of one consultant for two months from now where monthly utilization is 80%.'() {
        const now = new Date(Date.now());
        const nowPlusTwo = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
        const calendarMonth = (`0${nowPlusTwo.getMonth() + 1}`).slice(-2);
        const calMonth = `${nowPlusTwo.getFullYear()}${calendarMonth}`;
        const response = await this.get(`(ID=${workAssignment2.ID},CALMONTH='${calMonth}')`);
        this.responses.push(response);
        const aggregateMonthCapacity = response.data;
        delete aggregateMonthCapacity['@context'];
        delete aggregateMonthCapacity['@metadataEtag'];
        const expectedPeriodicAvailabiltiy = TestUtility.preparePeriodicAvailability(allResourceCapacity[2], allEmployeeHeaders[0], assignmentBucket13, 2);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(aggregateMonthCapacity).to.eql(expectedPeriodicAvailabiltiy);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get PeriodicAvailability of one consultant for three months from now where monthly utilization is 115%.'() {
        const now = new Date(Date.now());
        const nowPlusThree = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 3, 1));
        const calendarMonth = (`0${nowPlusThree.getMonth() + 1}`).slice(-2);
        const calMonth = `${nowPlusThree.getFullYear()}${calendarMonth}`;
        const response = await this.get(`(ID=${workAssignment2.ID},CALMONTH='${calMonth}')`);
        this.responses.push(response);
        const aggregateMonthCapacity = response.data;
        delete aggregateMonthCapacity['@context'];
        delete aggregateMonthCapacity['@metadataEtag'];
        const expectedPeriodicAvailabiltiy = TestUtility.preparePeriodicAvailability(allResourceCapacity[3], allEmployeeHeaders[0], assignmentBucket14, 3);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(aggregateMonthCapacity).to.eql(expectedPeriodicAvailabiltiy);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get PeriodicAvailability of one consultant for four months from now where monthly utilization is 130%.'() {
        const now = new Date(Date.now());
        const nowPlusFour = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 4, 1));
        const calendarMonth = (`0${nowPlusFour.getMonth() + 1}`).slice(-2);
        const calMonth = `${nowPlusFour.getFullYear()}${calendarMonth}`;
        const response = await this.get(`(ID=${workAssignment2.ID},CALMONTH='${calMonth}')`);
        this.responses.push(response);
        const aggregateMonthCapacity = response.data;
        delete aggregateMonthCapacity['@context'];
        delete aggregateMonthCapacity['@metadataEtag'];
        const expectedPeriodicAvailabiltiy = TestUtility.preparePeriodicAvailability(allResourceCapacity[4], allEmployeeHeaders[0], assignmentBucket15, 4);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(aggregateMonthCapacity).to.eql(expectedPeriodicAvailabiltiy);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get PeriodicAvailability of one consultant for five months from now where monthly utilization is 0%.'() {
        const now = new Date(Date.now());
        const nowPlusFive = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 5, 1));
        const calendarMonth = (`0${nowPlusFive.getMonth() + 1}`).slice(-2);
        const calMonth = `${nowPlusFive.getFullYear()}${calendarMonth}`;
        const response = await this.get(`(ID=${workAssignment2.ID},CALMONTH='${calMonth}')`);
        this.responses.push(response);
        const aggregateMonthCapacity = response.data;
        delete aggregateMonthCapacity['@context'];
        delete aggregateMonthCapacity['@metadataEtag'];
        const expectedPeriodicAvailabiltiy = TestUtility.preparePeriodicAvailability(allResourceCapacity[5], allEmployeeHeaders[0], assignmentBucket16, 5);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(aggregateMonthCapacity).to.eql(expectedPeriodicAvailabiltiy);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a PeriodicAvailability of one consultant without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${workAssignment2.ID},CALMONTH='202002')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get PeriodicAvailability of another employee.'() {
        const now = new Date(Date.now());
        const calendarMonth = (`0${now.getMonth() + 1}`).slice(-2);
        const calMonth = `${now.getFullYear()}${calendarMonth}`;
        const response = await this.get(`(ID=${workAssignment3.ID},CALMONTH='${calMonth}')`);
        this.responses.push(response);
        const aggregateMonthCapacity = response.data as PeriodicAvailability;

        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
        assert.isUndefined(aggregateMonthCapacity.ID, 'Expected no Periodic Avialiability of another employee');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a PeriodicAvailability is not allowed.'() {
        const response = await this.create(createPeriodicAvailability);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a aggregateMonthCapacity should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating PeriodicAvailability is not allowed.'() {
        const updatePeriodicAvailability = createPeriodicAvailability;
        updatePeriodicAvailability.ID = employeeHeaderWithDescription1.ID;
        updatePeriodicAvailability.bookedCapacity = 22334;
        const response = await this.update(`(ID=${workAssignment2.ID},CALMONTH='${updatePeriodicAvailability.CALMONTH}')`, updatePeriodicAvailability);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating aggregateMonthCapacity should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting PeriodicAvailability is not allowed.'() {
        const response = await this.delete(`(ID=${workAssignment2.ID},CALMONTH='${createPeriodicAvailability.CALMONTH}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a aggregateMonthCapacity should not be possible and expected status code should be 403(Forbidden).');
    }
}
