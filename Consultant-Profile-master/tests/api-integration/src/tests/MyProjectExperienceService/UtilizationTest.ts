import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allEmployeeHeaders,
    allEmail,
    allAssignments,
    allWorkAssignment,
    allAssignmentBucketsYearly,
    allWorkforcePerson,
    allResourceCapacityYearly,
    allResourceHeaders,
    allWorkAssignmentDetail,
    workAssignment2,
    workAssignment3,
    workAssignment5,
    allBookedCapacityAggregatesYearly,
} from '../../data';
import { createUtilization } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT, TEST_TIMEOUT_TIME_GENERATION } from '../../utils/serviceRepository/Service-Repository';
import { Utilization } from '../../serviceEntities/myProjectExperienceService/Utilization';

@suite('MyProjectExperienceService/Utilization')
export class UtilizationTest extends MyProjectExperienceServiceRepository {
    public constructor() { super('Utilization'); }

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
        await this.resourceCapacityRepository.insertMany(allResourceCapacityYearly);
        await this.assignmentsRepository.insertMany(allAssignments);
        await this.assignmentBucketRepository.insertMany(allAssignmentBucketsYearly);
        await this.fillTimeDimProcedure.callProcedure('05', currentYearStart.toJSON(), currentYearPlusTwoStart.toJSON());
        await this.bookedCapacityAggregateRepository.insertMany(allBookedCapacityAggregatesYearly);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.emailRepository.deleteMany(allEmail);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.resourceHeaderRepository.deleteMany(allResourceHeaders);
        await this.resourceCapacityRepository.deleteMany(allResourceCapacityYearly);
        await this.assignmentsRepository.deleteMany(allAssignments);
        await this.assignmentBucketRepository.deleteMany(allAssignmentBucketsYearly);
        await this.bookedCapacityAggregateRepository.deleteMany(allBookedCapacityAggregatesYearly);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Utilization.'() {
        const response = await this.get();
        this.responses.push(response);
        const yearlyUtilizations = response.data.value as Utilization[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(yearlyUtilizations.length, 1, 'Expected only one record');
        assert.isDefined(yearlyUtilizations, 'Expected a list of Utilization entities.');
        assert.isDefined(
            yearlyUtilizations.find(
                (yearlyUtilization) => yearlyUtilization.ID === workAssignment2.ID,
            ),
            'Expected atleast one Utilization record should be returned for employee 1.',
        );
        assert.isUndefined(
            yearlyUtilizations.find(
                (yearlyUtilization) => yearlyUtilization.ID === workAssignment5.ID,
            ),
            'Expected that no Utilization record should be returned for employee 1.',
        );
        assert.isUndefined(
            yearlyUtilizations.find(
                (yearlyUtilization) => yearlyUtilization.ID === workAssignment3.ID,
            ),
            'Expected that no Utilization record should be returned for employee 2.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Utilization as a user not in the DB'() {
        const response = await this.getWithNoConsultantInDB();
        this.responses.push(response);
        const yearlyUtilizations = response.data.value as Utilization[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(yearlyUtilizations, 'Expected an empty list.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Utilization without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Utilization for another consultant.'() {
        const now = new Date(Date.now());
        const year = now.getFullYear();
        const response = await this.get(`(ID=${workAssignment3.ID},YEAR='${year}')`);
        this.responses.push(response);
        const yearlyUtilization = response.data as Utilization;
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
        assert.isUndefined(yearlyUtilization.ID, 'Expected no yearly utilization for another consultant');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Utilization of first consultant for the current year where yearly utilization is 50%.'() {
        const now = new Date(Date.now());
        const year = now.getFullYear();
        const response = await this.get(`(ID=${workAssignment2.ID},YEAR='${year}')`);
        this.responses.push(response);
        const yearlyUtilization = response.data as Utilization;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            yearlyUtilization.ID === workAssignment2.ID
            && yearlyUtilization.YEAR === year.toString(),
            'Expected one Utilization record for employee 1 for current year.',
        );
        assert.equal(yearlyUtilization.utilizationColor, 1, 'Expected value of utilizationColor as calculated.');
        assert.equal(yearlyUtilization.yearlyUtilization, 50, 'Expected value of yearlyUtilization as calculated.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Utilization of one consultant without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${workAssignment2.ID},YEAR='2020')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a Utilization is not allowed.'() {
        const response = await this.create(createUtilization);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a yearlyUtilization should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating Utilization is not allowed.'() {
        const updateUtilization = createUtilization;
        updateUtilization.ID = workAssignment2.ID;
        updateUtilization.yearlyUtilization = 112;
        const response = await this.update(`(ID=${workAssignment2.ID},YEAR='${updateUtilization.YEAR}')`, updateUtilization);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Updating yearlyUtilization should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting Utilization is not allowed.'() {
        const response = await this.delete(`(ID=${workAssignment2.ID},YEAR='${createUtilization.YEAR}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a yearlyUtilization should not be possible and expected status code should be 403(Forbidden).');
    }
}
