import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { v4 as uuid } from 'uuid';
import { AvailabilityUploadServiceRepository } from '../../utils/serviceRepository/AvailabilityUploadService-Repository';
import {
    allEmployeeHeaders,
    allWorkforcePerson,
    allEmail,
    allAvailabilityReplicationSummary,
    allProfiles,
    allCostCenters,
    allOrganizationHeaders,
    allOrganizationDetails,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allResourceOrganizations,
    allResourceOrganizationItems,
    allJobDetails,
} from '../../data';
import {
    allAvailabilityUploadData,
    availabilityUploadData1,
    availabilityUploadData5,
} from '../../data/service/availabilityUploadService';
import { AvailabilityUploadData } from '../../serviceEntities/availabilityUploadService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('AvailabilityUploadService/AvailabilityUploadData')
export class AvailabilityUploadServiceAvailabilityUploadDataTest extends AvailabilityUploadServiceRepository {
    public constructor() {
        super('AvailabilityUploadData');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.emailRepository.insertMany(allEmail);
        await this.availabilityReplicationSummaryRepository.insertMany(allAvailabilityReplicationSummary);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
        await this.jobDetailRepository.insertMany(allJobDetails);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.emailRepository.deleteMany(allEmail);
        await this.availabilityReplicationSummaryRepository.deleteMany(allAvailabilityReplicationSummary);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
        await this.jobDetailRepository.deleteMany(allJobDetails);
    }

    @test.skip(timeout(TEST_TIMEOUT))
    async 'Get a list of Availability upload data '() {
        const response = await this.get();
        this.responses.push(response);
        const availabilityData = response.data.value as AvailabilityUploadData[];
        const expectedOutput = allAvailabilityUploadData;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(availabilityData, 'Expected a list of availability upload data.');
        assert.isTrue(availabilityData.length >= 4, 'Expected 4 availability upload data.');
        expect(this.availabilityUploadDataList(availabilityData)).to.deep.include.any.members(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of availability upload data without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single availability upload data'() {
        const response = await this.get(`(${availabilityUploadData1.resourceId})`);
        this.responses.push(response);
        const actualOutput = response.data;
        delete actualOutput['@context'];
        delete actualOutput['@metadataEtag'];
        const expectedOutput = availabilityUploadData1;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.availabilityUploadData(actualOutput)).to.eql(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Check if cost center is present even though there is no resource organization maintained for it'() {
        const response = await this.get(`(${availabilityUploadData5.resourceId})`);
        this.responses.push(response);
        const actualOutput = response.data;
        delete actualOutput['@context'];
        delete actualOutput['@metadataEtag'];
        const expectedOutput = availabilityUploadData5;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.availabilityUploadData(actualOutput)).to.eql(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single availability upload data without authorization'() {
        const response = await this.getWithoutAuthorization(`(${availabilityUploadData1.resourceId})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent availability upload data'() {
        const nonExistentResourceId = uuid();
        const response = await this.get(`(${nonExistentResourceId})`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a availability upload data is not allowed'() {
        const updatePayload = {
            workForcePersonExternalId: 'UpdateWorkforcePerson',
        };
        const response = await this.update(`(${availabilityUploadData1.resourceId})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating availability upload data should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting availability upload data is not allowed.'() {
        const response = await this.delete(`(${availabilityUploadData1.resourceId})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a availability upload data should not be possible and expected status code should be 403(Forbidden).');
    }

    private availabilityUploadData(availabilityUploadData: AvailabilityUploadData) {
        const availabilityData: AvailabilityUploadData = {
            resourceId: availabilityUploadData.resourceId,
            workAssignmentExternalId: availabilityUploadData.workForcePersonExternalId,
            name: availabilityUploadData.name,
            firstName: availabilityUploadData.firstName,
            lastName: availabilityUploadData.lastName,
            costCenterId: availabilityUploadData.costCenterId,
            resourceOrg: availabilityUploadData.resourceOrg,
            s4CostCenterId: availabilityUploadData.s4CostCenterId,
            workAssignmentStartDate: availabilityUploadData.workAssignmentStartDate,
            workAssignmentEndDate: availabilityUploadData.workAssignmentEndDate,
            workForcePersonExternalId: availabilityUploadData.workForcePersonExternalId,
            availabilitySummaryStatus_code: availabilityUploadData.availabilitySummaryStatus_code,
            minDate: availabilityUploadData.minDate,
            maxLimitDate: availabilityUploadData.maxLimitDate,
            availableDays: availabilityUploadData.availableDays,
            requiredDays: availabilityUploadData.requiredDays,
            isContingentWorker: availabilityUploadData.isContingentWorker,
        };
        return availabilityData;
    }

    private availabilityUploadDataList(availabilityUploadDataList: AvailabilityUploadData[]) {
        const availabilityData: AvailabilityUploadData[] = new Array<AvailabilityUploadData>();
        availabilityUploadDataList.forEach((availData) => {
            availabilityData.push(this.availabilityUploadData(availData));
        });
        return availabilityData;
    }
}
