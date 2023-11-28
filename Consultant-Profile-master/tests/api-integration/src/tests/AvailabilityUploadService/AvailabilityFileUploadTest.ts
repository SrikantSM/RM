import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { readFile, readFileSync } from 'fs';
import { promisify } from 'util';
import { v4 as uuid } from 'uuid';
import {
    allEmployeeHeaders,
    allWorkforcePerson,
    allEmail,
    allAvailabilityReplicationSummary,
    availabilityReplicationSummary1,
    availabilityReplicationSummary2,
    availabilityReplicationSummary4,
    allProfiles,
    allCostCenters,
    costCenter1,
    costCenter2,
    allOrganizationHeaders,
    allOrganizationDetails,
    allWorkAssignment,
    allAvailabilityReplicationErrorUpload,
    allWorkAssignmentDetail,
    allJobDetails,
    allResourceCapacity,
} from '../../data';
import {
    uploadSuccessResult1,
    uploadSuccessResult2,
    uploadPartialResult,
    uploadFailureResult2,
    uploadFailureResult,
    uploadBatchResult,
} from '../../data/service/availabilityUploadService';
import { AvailabilityUploadResult } from '../../serviceEntities/availabilityUploadService';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

const FormData = require('form-data');

@suite('AvailabilityFileUploadService')
export class AvailabilityFileUploadServiceTest extends ServiceEndPointsRepository {
    private serviceEndPoint: string = 'AvailabilityFileUploadService';

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
        await this.availabilityReplicationErrorRepository.deleteMany(allAvailabilityReplicationErrorUpload);
        await this.resourceCapacityRepository.deleteMany(allResourceCapacity);
        await this.jobDetailRepository.deleteMany(allJobDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST correct file with valid file and cost center Id'() {
        const response = await this.uploadFile('validFile.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult1.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult1.errors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST valid file without authorization'() {
        const response = await this.uploadFileUnauthorized('validFile.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(response.data, 'You are not authorized to use the availability data file upload.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST correct file with partially valid data and cost center Id'() {
        const response = await this.uploadFile('partialValidFile.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadPartialResult.createdItems);
        expect(actualResult.errors).to.equal(uploadPartialResult.errors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST correct file without cost center Id'() {
        const response = await this.uploadFile('validFile.csv', '', () => uuid());
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'Cost center is a mandatory field. Enter a cost center.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST correct file with invalid cost center Id(Length > 10)'() {
        const response = await this.uploadFile('validFile.csv', 'CostCenterLength', () => uuid());
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'The cost center ID CostCenterLength is invalid. Please enter a valid cost center ID.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST correct file with null cost center Id'() {
        const response = await this.uploadFile('validFile.csv', null, () => uuid());
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code to be 404 (Not Found).');
        assert.equal(response.data, 'No work assignments found for the entered cost center', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST correct file with blank cost center Id'() {
        const response = await this.uploadFile('validFile.csv', ' ', () => uuid());
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'Cost center is a mandatory field. Enter a cost center.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST correct file with incorrect cost center Id'() {
        const response = await this.uploadFile('validFile.csv', 'CCIN', () => uuid());
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code to be 404 (Not Found).');
        assert.equal(response.data, 'No work assignments found for the entered cost center', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'PATCH and PUT FileUploadService'() {
        const response = await ServiceEndPointsRepository.patch(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, {});
        this.responses.push(response);
        assert.equal(response.status, 405, 'Expected status code of PATCH request to be 405 (METHOD NOT ALLOWED)');

        const responsePut = await ServiceEndPointsRepository.put(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, {});
        this.responses.push(responsePut);
        assert.equal(responsePut.status, 405, 'Expected status code of PUT request to be 405 (METHOD NOT ALLOWED)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST with unsupported media type'() {
        const contentType = 'application/xml';

        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.serviceEndPoint}?costcenter=${costCenter1.costCenterID}`, {
            headers: {
                'Content-Type': contentType,
            },
        });
        this.responses.push(response);
        assert.equal(response.status, 415, 'Expected status code to be 415 (UNSUPPORTED MEDIA TYPE)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST empty file'() {
        const response = await this.uploadFile('emptyFile.csv', costCenter1.costCenterID, () => uuid());
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST multiple files'() {
        const formData = new FormData();
        for (let i = 0; i < 2; i += 1) {
            formData.append('file', readFileSync('csvData/availabilityFileUploadData/emptyFile.csv', 'utf8'), {
                filename: 'emptyFile.csv',
            });
        }
        const additionalHeaders = {};
        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.serviceEndPoint}?costcenter=${costCenter1.costCenterID}`, formData, {
            headers: formData.getHeaders(additionalHeaders),
        });
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST no file'() {
        const additionalHeaders = {};
        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.serviceEndPoint}?costcenter=${costCenter1.costCenterID}`, {}, {
            headers: new FormData().getHeaders(additionalHeaders),
        });
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing header column'() {
        const response = await this.uploadFile('missingHeaderColumn.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400.');
        assert.equal(response.data, 'The CSV file is missing the following columns: resourceId, nonWorkingHours, plannedWorkingHours, s4costCenterId, workAssignmentExternalId, startDate.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing s4costCenterId column'() {
        const response = await this.uploadFile('missingColumnCostCenterId.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400.');
        assert.equal(response.data, 'The CSV file is missing the following columns: s4costCenterId.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file containing blank line'() {
        const response = await this.uploadFile('fileWithBlankLine.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing firstName column(Non-Mandatory field)'() {
        const response = await this.uploadFile('missingColumnFirstName.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing lastName column(Non-Mandatory field)'() {
        const response = await this.uploadFile('missingColumnLastName.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing nonWorkingHours column'() {
        const response = await this.uploadFile('missingColumnNonWorkingHrs.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400.');
        assert.equal(response.data, 'The CSV file is missing the following columns: nonWorkingHours.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing plannedWorkingHours column'() {
        const response = await this.uploadFile('missingColumnPlannedWorkingHrs.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400.');
        assert.equal(response.data, 'The CSV file is missing the following columns: plannedWorkingHours.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing startDate column'() {
        const response = await this.uploadFile('missingColumnStartDate.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400.');
        assert.equal(response.data, 'The CSV file is missing the following columns: startDate.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing workAssignmentExternalId column'() {
        const response = await this.uploadFile('missingColumnWorkassignment.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400.');
        assert.equal(response.data, 'The CSV file is missing the following columns: workAssignmentExternalId.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing workForcePersonExternalId column'() {
        const response = await this.uploadFile('missingColumnWorkforcePerson.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content ResourceId'() {
        const response = await this.uploadFile('invalidColumnContentResourceId.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column length s4costCenterId'() {
        const response = await this.uploadFile('invalidColumnContentCostCenterLength.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content s4costCenterId(Mandatory data)'() {
        const response = await this.uploadFile('invalidColumnContentCostCenterId.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content nonWorkingHours(Mandatory data)'() {
        const response = await this.uploadFile('invalidColumnContentNonWorkingHrs.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content plannedWorkingHours(Mandatory data)'() {
        const response = await this.uploadFile('invalidColumnContentPlannedWorkingHrs.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content startDate(Mandatory data)'() {
        const response = await this.uploadFile('invalidColumnContentStartDate.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content workAssignmentExternalId(Mandatory data)'() {
        const response = await this.uploadFile('invalidColumnContentWorkassignment.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with workforce person IsBusinessPurposeCompleted is true'() {
        const response = await this.uploadFile('isBusinessPurposeCompleted.csv', costCenter2.costCenterID, () => availabilityReplicationSummary4.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content firstName(Non-mandatory data)'() {
        const response = await this.uploadFile('invalidColumnContentFirstName.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content lastName(Non-Mandatory data)'() {
        const response = await this.uploadFile('invalidColumnContentLastName.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid column content workForcePersonExternalId'() {
        const response = await this.uploadFile('invalidColumnContentWorkforcePerson.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content resourceId(Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentResourceId.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content s4costCenterId(Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentCostCenterId.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content nonWorkingHours(Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentNonWorkingHrs.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content plannedWorkingHours(Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentPlannedWorkingHrs.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content startDate(Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentStartDate.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content workAssignmentExternalId(Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentWorkassignment.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadFailureResult.createdItems);
        expect(actualResult.errors).to.equal(uploadFailureResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadFailureResult.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content firstName(Non-mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentFirstName.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content lastName(Non-Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentLastName.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing column content workForcePersonExternalId(Non-Mandatory data)'() {
        const response = await this.uploadFile('missingColumnContentWorkforcePerson.csv', costCenter1.costCenterID, () => availabilityReplicationSummary1.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadSuccessResult2.createdItems);
        expect(actualResult.errors).to.equal(uploadSuccessResult2.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadSuccessResult2.resourceIDErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with batch size validation(1510 records)'() {
        const response = await this.uploadFile('batchSizeValidation1010.csv', costCenter1.costCenterID, () => availabilityReplicationSummary2.resourceId);
        this.responses.push(response);
        const actualResult = response.data as AvailabilityUploadResult;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadBatchResult.createdItems);
        expect(actualResult.errors).to.equal(uploadBatchResult.errors);
        expect(actualResult.resourceIDErrors).to.equal(uploadBatchResult.resourceIDErrors);
    }

    private async uploadFile(name: string, costCenter: any, resourceId: () => string) {
        const additionalHeaders = {};
        const formData = new FormData();

        let fileContent = await promisify(readFile)(`csvData/availabilityFileUploadData/${name}`, 'utf8');

        fileContent = fileContent.replace(/\{resourceId}/g, resourceId);
        formData.append('file', fileContent, {
            filename: name,
        });

        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.serviceEndPoint}?costcenter=${costCenter}`, formData, {
            headers: formData.getHeaders(additionalHeaders),
        });

        return response;
    }

    private async uploadFileUnauthorized(name: string, costCenter: any, resourceId: () => string) {
        const additionalHeaders = {};
        const formData = new FormData();

        let fileContent = await promisify(readFile)(`csvData/availabilityFileUploadData/${name}`, 'utf8');

        fileContent = fileContent.replace(/\{resourceId}/g, resourceId);
        formData.append('file', fileContent, {
            filename: name,
        });

        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.serviceEndPoint}?costcenter=${costCenter}`, formData, {
            headers: formData.getHeaders(additionalHeaders),
        });

        return response;
    }
}
