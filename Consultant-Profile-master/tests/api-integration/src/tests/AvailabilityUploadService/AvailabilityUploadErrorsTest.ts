import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { v4 as uuid } from 'uuid';
import { AvailabilityReplicationError } from 'test-commons';
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
    allAvailabilityReplicationErrorUpload,
    allAvailabilityReplicationErrors,
    availabilityReplicationError11,
    availabilityReplicationError12,
    allWorkAssignmentDetail,
} from '../../data';
import { AvailabilityUploadErrors } from '../../serviceEntities/availabilityUploadService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('AvailabilityUploadService/AvailabilityUploadErrors')
export class AvailabilityUploadServiceAvailabilityUploadErrorsTest extends AvailabilityUploadServiceRepository {
    private static readonly availabilityErrorDescription: { [key: string]: string } = {
        AVL_ERR_10: 'The following entries in the CSV file have empty mandatory fields: {0}.',
        AVL_ERR_4: 'The cost center ID {0} is invalid. Please enter a valid cost center ID.',
        AVL_ERR_1: 'Please enter the start date of the work assignment in the format YYYY-MM-DD.',
    };

    public constructor() {
        super('AvailabilityUploadErrors');
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
        await this.availabilityReplicationErrorRepository.deleteMany(allAvailabilityReplicationErrorUpload);
        await this.availabilityReplicationErrorRepository.insertMany(allAvailabilityReplicationErrors);
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
        await this.availabilityReplicationErrorRepository.deleteMany(allAvailabilityReplicationErrors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of availability upload error data '() {
        const response = await this.get();
        this.responses.push(response);
        const availabilityErrors = response.data.value as AvailabilityUploadErrors[];
        const expectedOutput = allAvailabilityReplicationErrors;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(availabilityErrors, 'Expected a list of availability error data.');
        assert.isTrue(availabilityErrors.length >= 6, 'Expected 6 availability error data.');
        expect(this.availabilityErrorResponseDataList(availabilityErrors)).to.deep.include.any.members(this.availabilityErrorDataList(expectedOutput));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of availability upload error data without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single availability upload error data'() {
        const response = await this.get(`(resourceId=${availabilityReplicationError11.resourceId},startDate='${availabilityReplicationError11.startDate}')`);
        this.responses.push(response);
        const actualOutput = response.data;
        delete actualOutput['@context'];
        delete actualOutput['@metadataEtag'];
        const expectedOutput = availabilityReplicationError11;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.availabilityErrorResponseData(actualOutput)).to.eql(this.availabilityErrorData(expectedOutput));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single availability upload error data without authorization'() {
        const response = await this.getWithoutAuthorization(`(resourceId=${availabilityReplicationError12.resourceId},startDate='${availabilityReplicationError12.startDate}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent availability upload error data'() {
        const nonExistentResourceId = uuid();
        const response = await this.get(`(resourceId=${nonExistentResourceId},startDate='${availabilityReplicationError11.startDate}')`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a availability upload error data is not allowed'() {
        const updatePayload = {
            error_desc: 'Unknown error',
        };
        const response = await this.update(`(resourceId=${availabilityReplicationError11.resourceId},startDate='${availabilityReplicationError11.startDate}')`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating availability upload error data should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting availability upload error data is not allowed.'() {
        const response = await this.delete(`(resourceId=${availabilityReplicationError12.resourceId},startDate='${availabilityReplicationError11.startDate}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a availability upload error data should not be possible and expected status code should be 403(Forbidden).');
    }

    private availabilityErrorData(availabilityErrorData: AvailabilityReplicationError) {
        const errorDescription = AvailabilityUploadServiceAvailabilityUploadErrorsTest.availabilityErrorDescription[availabilityErrorData.availabilityErrorMessage_code!].replace('{0}', availabilityErrorData.errorParam1!);
        const availabilityErrors: AvailabilityUploadErrors = {
            resourceId: availabilityErrorData.resourceId,
            startDate: availabilityErrorData.startDate,
            s4costCenterId: availabilityErrorData.s4costCenterId,
            workAssignmentExternalId: availabilityErrorData.workAssignmentExternalId,
            error_desc: errorDescription,
            errorParam1: ((availabilityErrorData.errorParam1 !== undefined) ? availabilityErrorData.errorParam1 : null)!,
            csvRecordIndex: availabilityErrorData.csvRecordIndex,
            invalidKeys: availabilityErrorData.invalidKeys,
            availabilityErrorMessage_code: availabilityErrorData.availabilityErrorMessage_code!,
        };
        return availabilityErrors;
    }

    private availabilityErrorDataList(availabilityErrorList: AvailabilityReplicationError[]) {
        const availabilityErrors: AvailabilityUploadErrors[] = new Array<AvailabilityUploadErrors>();
        availabilityErrorList.forEach((availData) => {
            availabilityErrors.push(this.availabilityErrorData(availData));
        });
        return availabilityErrors;
    }

    private availabilityErrorResponseData(availabilityErrorResponseData: AvailabilityUploadErrors) {
        const availabilityErrorResponseData1 = availabilityErrorResponseData;
        delete availabilityErrorResponseData1.errorParam2;
        delete availabilityErrorResponseData1.errorParam3;
        delete availabilityErrorResponseData1.errorParam4;
        delete availabilityErrorResponseData1.createdAt;
        delete availabilityErrorResponseData1.createdBy;
        delete availabilityErrorResponseData1.modifiedAt;
        delete availabilityErrorResponseData1.modifiedBy;
        delete availabilityErrorResponseData1.errorMessage;
        return availabilityErrorResponseData1;
    }

    private availabilityErrorResponseDataList(availabilityErrorResponseData: AvailabilityUploadErrors[]) {
        const availabilityErrorsResponse: AvailabilityUploadErrors[] = new Array<AvailabilityUploadErrors>();
        availabilityErrorResponseData.forEach((availDataResponse) => {
            availabilityErrorsResponse.push(this.availabilityErrorResponseData(availDataResponse));
        });
        return availabilityErrorsResponse;
    }
}
