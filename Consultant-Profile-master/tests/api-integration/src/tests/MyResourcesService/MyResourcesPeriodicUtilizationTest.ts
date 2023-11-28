import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allEmployeeHeaders,
    allEmail,
    allAssignments,
    allWorkAssignment,
    allWorkforcePerson,
    allResourceCapacity,
    allResourceHeaders,
    allAssignmentBuckets,
    allWorkAssignmentDetail,
    allBookedCapacityAggregates,
    allJobDetails,
    allOrganizationDetails,
    allOrganizationHeaders,
    allCostCenters,
    employeeHeaderWithDescription4,
    workAssignment6,
    resourceCapacity61,
    resourceCapacity62,
    resourceCapacity63,
    resourceCapacity64,
    resourceCapacity65,
    resourceCapacity66,
    assignmentBucket31,
    assignmentBucket32,
    assignmentBucket33,
    assignmentBucket34,
    assignmentBucket35,
    assignmentBucket36,
    allResourceOrganizations,
    allResourceOrganizationItems,
} from '../../data';
import { TEST_TIMEOUT, TEST_TIMEOUT_TIME_GENERATION } from '../../utils/serviceRepository/Service-Repository';
import { PeriodicUtilization } from '../../serviceEntities/myProjectExperienceService/PeriodicUtilization';
import { TestUtility } from '../../utils/TestUtility';
import { createPeriodicUtilization } from '../../data/service/myProjectExperienceService';

@suite('MyResourcesService/PeriodicUtilization')
export class MyResourcesPeriodicUtilizationTest extends MyResourcesServiceRepository {
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
        // await this.fillTimeDimProcedure.callProcedure('05', currentYearStart.toJSON(), currentYearPlusTwoStart.toJSON());
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
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
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of PeriodicUtilization.'() {
        const response = await this.get();
        this.responses.push(response);
        const aggregateMonthUtilizations = response.data.value as PeriodicUtilization[];
        const expectedPeriodicUtilizations = TestUtility.preparePeriodicUtilizations([
            { resourceCapacity: resourceCapacity61, assignmentBucket: assignmentBucket31 },
            { resourceCapacity: resourceCapacity62, assignmentBucket: assignmentBucket32 },
            { resourceCapacity: resourceCapacity63, assignmentBucket: assignmentBucket33 },
            { resourceCapacity: resourceCapacity64, assignmentBucket: assignmentBucket34 },
            { resourceCapacity: resourceCapacity65, assignmentBucket: assignmentBucket35 },
            { resourceCapacity: resourceCapacity66, assignmentBucket: assignmentBucket36 },
        ], allEmployeeHeaders[3], false);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isTrue(aggregateMonthUtilizations.length >= 6, 'Expected list of capacities having 6 records.');
        expect(aggregateMonthUtilizations).to.deep.include.any.members(expectedPeriodicUtilizations);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of PeriodicUtilization without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a PeriodicUtilization of one consultant without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${workAssignment6.ID},CALMONTH='202002')`);
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
        updatePeriodicUtilization.ID = employeeHeaderWithDescription4.ID;
        updatePeriodicUtilization.utilizationPercentage = 2;
        const response = await this.update(`(ID=${workAssignment6.ID},CALMONTH='${updatePeriodicUtilization.CALMONTH}')`, updatePeriodicUtilization);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating PeriodicUtilization should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting PeriodicUtilization is not allowed.'() {
        const response = await this.delete(`(ID=${workAssignment6.ID},CALMONTH='${createPeriodicUtilization.CALMONTH}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a PeriodicUtilization should not be possible and expected status code should be 403(Forbidden).');
    }
}
