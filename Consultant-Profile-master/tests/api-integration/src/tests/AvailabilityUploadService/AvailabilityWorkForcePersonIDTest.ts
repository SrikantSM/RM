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
} from '../../data';
import {
    availabilityWorkForcePersonID1,
    availabilityWorkForcePersonID2,
    availabilityWorkForcePersonID3,
} from '../../data/service/availabilityUploadService';
import { AvailabilityWorkForcePersonID } from '../../serviceEntities/availabilityUploadService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('AvailabilityUploadService/AvailabilityWorkForcePersonID')
export class AvailabilityUploadServiceAvailabilityWorkForcePersonIDTest extends AvailabilityUploadServiceRepository {
    public constructor() {
        super('AvailabilityWorkForcePersonID');
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
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of WorkForcePerson ID '() {
        const response = await this.get();
        this.responses.push(response);
        const workforcePersonID = response.data.value as AvailabilityWorkForcePersonID[];
        const expectedOutput = [availabilityWorkForcePersonID1, availabilityWorkForcePersonID2, availabilityWorkForcePersonID3];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(workforcePersonID, 'Expected a list of Workforce person ID.');
        assert.isTrue(workforcePersonID.length >= 3, 'Expected 3 Workforce person ID.');
        expect(this.workforcePersonIDList(workforcePersonID)).to.deep.include.any.members(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of availability workforce person ID without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single workforce person ID'() {
        const response = await this.get(`('${availabilityWorkForcePersonID1.workForcePersonExternalId}')`);
        this.responses.push(response);
        const workforcePersonID = response.data;
        delete workforcePersonID['@context'];
        delete workforcePersonID['@metadataEtag'];
        const expectedOutput = availabilityWorkForcePersonID1;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.availabilityWorkforcePersonID(workforcePersonID)).to.eql(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single workforce person ID without authorization'() {
        const response = await this.getWithoutAuthorization(`('${availabilityWorkForcePersonID1.workForcePersonExternalId}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent workforce person ID'() {
        const nonExistentWorkforcePerson = 'non_existent_workForcePerson';
        const response = await this.get(`('${nonExistentWorkforcePerson}')`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a workforce person ID is not allowed'() {
        const updatePayload = {
            workForcePersonExternalId: 'UpdateWorkforcePerson',
        };
        const response = await this.update(`('${availabilityWorkForcePersonID1.workForcePersonExternalId}')`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating workforce person ID should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting workforce person ID is not allowed.'() {
        const response = await this.delete(`('${availabilityWorkForcePersonID1.workForcePersonExternalId}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a workforce person ID should not be possible and expected status code should be 403(Forbidden).');
    }

    private availabilityWorkforcePersonID(availabilityWorkForcePersonID: AvailabilityWorkForcePersonID) {
        const workforcePersonID: AvailabilityWorkForcePersonID = {
            workForcePersonExternalId: availabilityWorkForcePersonID.workForcePersonExternalId,
            isBusinessPurposeCompleted: availabilityWorkForcePersonID.isBusinessPurposeCompleted,
        };
        return workforcePersonID;
    }

    private workforcePersonIDList(workforcePersonIDList: AvailabilityWorkForcePersonID[]) {
        const workforcePerson: AvailabilityWorkForcePersonID[] = new Array<AvailabilityWorkForcePersonID>();
        workforcePersonIDList.forEach((workforcePersonID) => {
            workforcePerson.push(this.availabilityWorkforcePersonID(workforcePersonID));
        });
        return workforcePerson;
    }
}
