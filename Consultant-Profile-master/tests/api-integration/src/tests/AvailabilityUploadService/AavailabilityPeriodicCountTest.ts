import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { v4 as uuid } from 'uuid';
import { AvailabilityUploadServiceRepository } from '../../utils/serviceRepository/AvailabilityUploadService-Repository';
import {
    allEmployeeHeaders,
    allEmail,
    allWorkAssignment,
    allWorkforcePerson,
    allResourceCapacity,
    allResourceHeaders,
    allWorkAssignmentDetail,
    workAssignment2,
    allAvailabilityReplicationSummary,
    allProfiles,
    allCostCenters,
    allOrganizationHeaders,
    availabilityReplicationSummary2,
    allOrganizationDetails,
    allJobDetails,
} from '../../data';
import { TEST_TIMEOUT, TEST_TIMEOUT_TIME_GENERATION } from '../../utils/serviceRepository/Service-Repository';
import { AvailabilityPeriodicCount } from '../../serviceEntities/availabilityUploadService/AvailabilityPeriodicCount';
import { TestUtility } from '../../utils/TestUtility';

@suite('AvailabilityUploadService/AvailabilityPeriodicCount')
export class AvailabilityPeriodicCountTest extends AvailabilityUploadServiceRepository {
    public constructor() { super('AvailabilityPeriodicCount'); }

    @timeout(TEST_TIMEOUT_TIME_GENERATION)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.emailRepository.insertMany(allEmail);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.resourceHeaderRepository.insertMany(allResourceHeaders);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.availabilityReplicationSummaryRepository.insertMany(allAvailabilityReplicationSummary);
        await this.resourceCapacityRepository.insertMany(allResourceCapacity);
        await this.jobDetailRepository.insertMany(allJobDetails);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.emailRepository.deleteMany(allEmail);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.resourceHeaderRepository.deleteMany(allResourceHeaders);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.availabilityReplicationSummaryRepository.deleteMany(allAvailabilityReplicationSummary);
        await this.resourceCapacityRepository.deleteMany(allResourceCapacity);
        await this.jobDetailRepository.deleteMany(allJobDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of AvailabilityPeriodicCount.'() {
        const response = await this.get();
        this.responses.push(response);
        const availabilityPeriodicData = response.data.value as AvailabilityPeriodicCount[];
        const expectedPeriodicCount = TestUtility.preparePeriodicDataCounts([
            { resourceCapacity: allResourceCapacity[0] },
            { resourceCapacity: allResourceCapacity[1] },
            { resourceCapacity: allResourceCapacity[2] },
            { resourceCapacity: allResourceCapacity[3] },
            { resourceCapacity: allResourceCapacity[4] },
            { resourceCapacity: allResourceCapacity[5] },
        ]);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(availabilityPeriodicData, 'Expected a list of availability upload data.');
        assert.isTrue(availabilityPeriodicData.length >= 6, 'Expected 6 availability upload data.');
        expect(availabilityPeriodicData).to.deep.include.any.members(expectedPeriodicCount);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of AvailabilityPeriodicCount without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single period availability upload data'() {
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const response = await this.get(`(resourceId=${availabilityReplicationSummary2.resourceId},startTime=${currentMonthStart.toJSON()})`);
        this.responses.push(response);
        const actualOutput = response.data;
        delete actualOutput['@context'];
        delete actualOutput['@metadataEtag'];
        const expectedOutput = TestUtility.preparePeriodicDataCount(allResourceCapacity[0], 0);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(actualOutput).to.eql(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent availability upload data'() {
        const nonExistentResourceId = uuid();
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const response = await this.get(`(resourceId=${nonExistentResourceId},startTime=${currentMonthStart.toJSON()})`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating AvailabilityPeriodicCount is not allowed.'() {
        const updatePayload = {
            CALMONTH: '202001',
        };
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const response = await this.update(`(resourceId=${workAssignment2.ID},startTime=${currentMonthStart.toJSON()})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating AvailabilityPeriodicCount should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting AvailabilityPeriodicCount is not allowed.'() {
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const response = await this.delete(`(resourceId=${workAssignment2.ID},startTime=${currentMonthStart.toJSON()})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a AvailabilityPeriodicCount should not be possible and expected status code should be 403(Forbidden).');
    }
}
