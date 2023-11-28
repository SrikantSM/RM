import { suite, timeout, test } from 'mocha-typescript';
import { expect, assert } from 'chai';
import { AvailabilityUploadServiceRepository } from '../../utils/serviceRepository/AvailabilityUploadService-Repository';
import {
    allAvailabilityReplicationSummary,
    allEmployeeHeaders,
    allEmail,
    allWorkforcePerson,
    allWorkAssignment,
    allResourceHeaders,
    allOrganizationHeaders,
    allOrganizationDetails,
    allCostCenters,
    allWorkAssignmentDetail,
    allResourceOrganizations,
    allResourceOrganizationItems,
} from '../../data';
import {
    availabilityResourceOrg1,
    availabilityResourceOrg2,
} from '../../data/service/availabilityUploadService';
import { AvailabilityResourceOrg } from '../../serviceEntities/availabilityUploadService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('AvailabilityUploadService/AvailabilityResourceOrg')
export class AvailabilityUploadServiceAvailabilityResourceOrgTest extends AvailabilityUploadServiceRepository {
    public constructor() {
        super('AvailabilityResourceOrg');
    }

    @timeout(TEST_TIMEOUT)
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
        await this.availabilityReplicationSummaryRepository.insertMany(allAvailabilityReplicationSummary);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
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
        await this.availabilityReplicationSummaryRepository.deleteMany(allAvailabilityReplicationSummary);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Resource Organizations'() {
        const response = await this.get();
        this.responses.push(response);
        const availabilityResourceOrg = response.data.value as AvailabilityResourceOrg[];
        const expectedOutput = [availabilityResourceOrg1, availabilityResourceOrg2];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(availabilityResourceOrg, 'Expected a list of Resource Organization.');
        assert.isTrue(availabilityResourceOrg.length >= 2, 'Expected 2 Resource Organizations.');
        expect(this.availabilityResourceOrgList(availabilityResourceOrg)).to.deep.include.any.members(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of availability resource organizations without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single resource organization'() {
        const response = await this.get(`('${availabilityResourceOrg1.resourceOrgId}')`);
        this.responses.push(response);
        const availabilityResourceOrg = response.data;
        delete availabilityResourceOrg['@context'];
        delete availabilityResourceOrg['@metadataEtag'];
        const expectedOutput = availabilityResourceOrg1;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.availabilityResourceOrgList(availabilityResourceOrg)).to.eql(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single workforce person ID without authorization'() {
        const response = await this.getWithoutAuthorization(`('${availabilityResourceOrg1.resourceOrgId}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent resource organization'() {
        const nonExistentResourceOrg = 'non_existent_ResourceOrg';
        const response = await this.get(`('${nonExistentResourceOrg}')`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a resource organization is not allowed'() {
        const updatePayload = {
            resourceOrgId: 'UpdateResourceOrganization',
        };
        const response = await this.update(`('${availabilityResourceOrg1.resourceOrgId}')`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating resource organization should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting resource organization is not allowed.'() {
        const response = await this.delete(`('${availabilityResourceOrg1.resourceOrgId}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a resource organization should not be possible and expected status code should be 403(Forbidden).');
    }

    private availabilityResourceOrganization(availabilityResourceOrganization: AvailabilityResourceOrg) {
        const availabilityResourceOrg: AvailabilityResourceOrg = {
            resourceOrgId: availabilityResourceOrganization.resourceOrgId,
            resourceOrg: availabilityResourceOrganization.resourceOrg,
        };
        return availabilityResourceOrg;
    }

    private availabilityResourceOrgList(availabilityResourceOrgList: AvailabilityResourceOrg[]) {
        const availabilityResourceOrg: AvailabilityResourceOrg[] = new Array<AvailabilityResourceOrg>();
        availabilityResourceOrgList.forEach((resourceOrg) => {
            availabilityResourceOrg.push(this.availabilityResourceOrganization(resourceOrg));
        });
        return availabilityResourceOrg;
    }
}
