import { suite, timeout, test } from 'mocha-typescript';
import { expect, assert } from 'chai';
import { AvailabilityUploadServiceRepository } from '../../utils/serviceRepository/AvailabilityUploadService-Repository';
import {
    allEmployeeHeaders,
    allWorkforcePerson,
    allEmail,
    allAvailabilityReplicationSummary,
    allCostCenters,
    allOrganizationHeaders,
    allOrganizationDetails,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allJobDetails,
    allCostCenterAttributes,
} from '../../data';
import {
    availabilityCostCenter1,
    availabilityCostCenter2,
} from '../../data/service/availabilityUploadService';
import { AvailabilityCostCenter } from '../../serviceEntities/availabilityUploadService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('AvailabilityUploadService/AvailabilityCostCenter')
export class AvailabilityUploadServiceAvailabilityCostCenterTest extends AvailabilityUploadServiceRepository {
    public constructor() {
        super('AvailabilityCostCenter');
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
        await this.emailRepository.insertMany(allEmail);
        await this.availabilityReplicationSummaryRepository.insertMany(allAvailabilityReplicationSummary);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.costCenterAttributeRepository.insertMany(allCostCenterAttributes);
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
        await this.emailRepository.deleteMany(allEmail);
        await this.availabilityReplicationSummaryRepository.deleteMany(allAvailabilityReplicationSummary);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.costCenterAttributeRepository.deleteMany(allCostCenterAttributes);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of s4 costcenter ID master list'() {
        const response = await this.get();
        this.responses.push(response);
        const s4CostCenterId = response.data.value as AvailabilityCostCenter[];
        const expectedOutput = [availabilityCostCenter1, availabilityCostCenter2];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(s4CostCenterId, 'Expected a list of cost center ID.');
        assert.isTrue(s4CostCenterId.length >= 6, 'Expected 6 cost center ID.');
        expect(this.availabilityCostCenterList(s4CostCenterId)).to.deep.include.any.members(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of s4 cost center without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single s4 cost center'() {
        const response = await this.get(`('${availabilityCostCenter1.costCenterID}')`);
        this.responses.push(response);
        const s4CostCenterId = response.data as AvailabilityCostCenter;
        const expectedOutput = availabilityCostCenter1;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.availabilityCostCenterID(s4CostCenterId)).to.eql(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single s4 cost center without authorization'() {
        const response = await this.getWithoutAuthorization(`('${availabilityCostCenter1.costCenterID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent s4 cost center'() {
        const nonExistingCC = '0070098';
        const response = await this.get(`('${nonExistingCC}')`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a s4 cost center is not allowed'() {
        const updatePayload = {
            costCenterID: availabilityCostCenter1.costCenterID,
            description: 'test Name',
        };
        const response = await this.update(`('${availabilityCostCenter1.costCenterID}')`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating cost center should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting s4 cost center is not allowed.'() {
        const response = await this.delete(`('${availabilityCostCenter1.costCenterID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a cost center should not be possible and expected status code should be 403(Forbidden).');
    }

    private availabilityCostCenterID(costCenterID: AvailabilityCostCenter) {
        const s4CostCenterIdOut: AvailabilityCostCenter = {
            costCenterID: costCenterID.costCenterID,
            description: costCenterID.description,
        };
        return s4CostCenterIdOut;
    }

    private availabilityCostCenterList(availabilityCostCenterList: AvailabilityCostCenter[]) {
        const costCenterID: AvailabilityCostCenter[] = new Array<AvailabilityCostCenter>();
        availabilityCostCenterList.forEach((s4CostCenterId) => {
            costCenterID.push(this.availabilityCostCenterID(s4CostCenterId));
        });
        return costCenterID;
    }
}
