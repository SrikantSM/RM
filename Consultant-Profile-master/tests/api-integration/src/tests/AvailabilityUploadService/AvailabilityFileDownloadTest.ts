import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import {
    allEmployeeHeaders,
    allWorkforcePerson,
    allEmail,
    allAvailabilityReplicationSummary,
    availabilityReplicationSummary1,
    availabilityReplicationSummary4,
    allProfiles,
    allCostCenters,
    costCenter1,
    allOrganizationHeaders,
    allOrganizationDetails,
    allWorkAssignment,
    allWorkAssignmentDetail,
} from '../../data';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('AvailabilityFileDownloadService')
export class AvailabilityFileDownloadServiceTest extends ServiceEndPointsRepository {
    private serviceEndPoint: string = 'AvailabilityFileDownloadService';

    private startdate = '2020-01-01';

    private enddate = '2020-01-20';

    private costcenter = costCenter1.costCenterID;

    private workforcepersonid = availabilityReplicationSummary1.workForcePersonExternalId;

    private wpIsBPCompleted = availabilityReplicationSummary4.workForcePersonExternalId;

    private workinghours = 8;

    private nonworkinghours = 0;

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepareDbRepository();
        await this.prepareApplicationServiceClient();
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
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with valid inputs(with Cost center)'() {
        const response = await this.downloadFile(this.startdate, this.enddate, this.costcenter,
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data without authorization'() {
        const response = await this.downloadFileUnauthorized(this.startdate, this.enddate, this.costcenter,
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with valid inputs(with workforceperson)'() {
        const response = await this.downloadFile(this.startdate, this.enddate, '',
            this.workforcepersonid, this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with invalid cost center(Length > 10)'() {
        const response = await this.downloadFile(this.startdate, this.enddate, 'CostCenterLength',
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'The cost center ID CostCenterLength is invalid. Please enter a valid cost center ID.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with valid cost center(Special character)'() {
        const response = await this.downloadFile(this.startdate, this.enddate, 'CC@!',
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with incorrect cost center'() {
        const response = await this.downloadFile(this.startdate, this.enddate, 'CCIN',
            '', this.workinghours, this.nonworkinghours);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');

        const downloadedData = response.data.split('\r\n');
        assert.equal(downloadedData[0], 'resourceId,workForcePersonExternalId,firstName,lastName,s4costCenterId,workAssignmentExternalId,startDate,plannedWorkingHours,nonWorkingHours');
        assert.equal(downloadedData.length, 2, 'File with only header data and blank record');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with workforce person Id (Special character)'() {
        const response = await this.downloadFile(this.startdate, this.enddate, '',
            'work.person', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with workforce person Id (IsBusinessPurposeCompleted = true)'() {
        const response = await this.downloadFile(this.startdate, this.enddate, '',
            this.wpIsBPCompleted, this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');

        const downloadedData = response.data.split('\r\n');
        assert.equal(downloadedData[0], 'resourceId,workForcePersonExternalId,firstName,lastName,s4costCenterId,workAssignmentExternalId,startDate,plannedWorkingHours,nonWorkingHours');
        assert.equal(downloadedData.length, 2, 'File with only header data and blank record');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with incorrect workforce person Id'() {
        const response = await this.downloadFile(this.startdate, this.enddate, '',
            'workForcePerson', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');

        const downloadedData = response.data.split('\r\n');
        assert.equal(downloadedData.length, 2, 'File with only header data and blank record');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with incorrect start date format'() {
        const response = await this.downloadFile('12-10-2020', this.enddate, this.costcenter,
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'Please enter the start date of the work assignment in the format YYYY-MM-DD.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data with incorrect enddate format'() {
        const response = await this.downloadFile(this.startdate, '12-10-2020', this.costcenter,
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'Please enter the end date of the work assignment in the format YYYY-MM-DD.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data without mandatory field(Start date)'() {
        const response = await this.downloadFile('', this.enddate, this.costcenter,
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'Start Date is a mandatory field. Enter a start date.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data without mandatory field(End date)'() {
        const response = await this.downloadFile(this.startdate, '', this.costcenter,
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'End Date is a mandatory field. Enter a end date.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Download availability data without mandatory field(CostCenter/Workforce person)'() {
        const response = await this.downloadFile(this.startdate, this.enddate, '',
            '', this.workinghours, this.nonworkinghours);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        const downloadedData = response.data.split('\r\n');
        assert.equal(downloadedData.length, 2, 'File with only header data and blank record');
    }

    private async downloadFile(startdate: string, enddate: string, costcenter: string, workforcepersonid: string, workinghours: number, nonworkinghours: number) {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.serviceEndPoint}?startdate=${startdate}&enddate=${enddate}&costcenter=${costcenter}&workforcepersonid=${workforcepersonid}&workinghours=${workinghours}&nonworkinghours=${nonworkinghours}`);
    }

    private async downloadFileUnauthorized(startdate: string, enddate: string, costcenter: string, workforcepersonid: string, workinghours: number, nonworkinghours: number) {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.serviceEndPoint}?startdate=${startdate}&enddate=${enddate}&costcenter=${costcenter}&workforcepersonid=${workforcepersonid}&workinghours=${workinghours}&nonworkinghours=${nonworkinghours}`);
    }
}
