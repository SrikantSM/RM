import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { readFile, readFileSync } from 'fs';
import { promisify } from 'util';

import {
    allSrvOrgCostCenters,
    allOrganizationHeaderUploads,
    allOrganizationDetailUploads,
    allOrganizationHeaders,
    organizationHeadersForSO,
    allOrganizationDetails,
    organizationDetailsForSO,
    resourceRequestData,
    allResourceOrganizations,
    allProjectRoles,
    allResourceOrganizationItems,
} from '../../data';
import {
    uploadResult1,
    uploadResult2,
    uploadResult4,
    uploadResult5,
    uploadResult6,
    uploadResult7,
    uploadResult8,
    uploadResultEmptyCoCenter,
    uploadResultEmptyCoCode,
    uploadResultEmptySrvOrg,
} from '../../data/service/organizationService';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

const FormData = require('form-data');

@suite('ServiceOrgUploadService')
export class ServiceOrgUploadServiceTest extends ServiceEndPointsRepository {
    private serviceEndPoint: string = 'ServiceOrgUploadService';

    private static sqlStatementString: string;

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepareDbRepository();
        await this.prepareApplicationServiceClient();
        await this.costCenterRepository.insertMany(allSrvOrgCostCenters);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.organizationHeaderRepository.insertMany(organizationHeadersForSO);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationDetailRepository.insertMany(organizationDetailsForSO);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
        await this.resourceRequestRepository.insertMany(resourceRequestData);
        await this.projectRoleRepository.insertMany(allProjectRoles);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.costCenterRepository.deleteMany(allSrvOrgCostCenters);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.organizationHeaderRepository.deleteMany(organizationHeadersForSO);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationDetailRepository.deleteMany(organizationDetailsForSO);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
        await this.projectRoleRepository.deleteMany(allProjectRoles);
        await this.resourceRequestRepository.deleteMany(resourceRequestData);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaderUploads);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetailUploads);
        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.resourceOrganizationsRepository.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_CONFIG_RESOURCEORGANIZATIONS', "WHERE SERVICEORGANIZATION_CODE IN ('XYZ01','XYZ02','XYZ03','CPE1')");
        console.log(ServiceOrgUploadServiceTest.sqlStatementString);
        console.log('this is generated for resource organization');
        await ServiceOrgUploadServiceTest.resourceOrganizationsRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);
        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.resourceOrganizationItemsRepository.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_CONFIG_RESOURCEORGANIZATIONITEMS', "WHERE COSTCENTERID IN ('2710XYZ1','2710XYZ2','2710XYZ3','C003XYZ01','C003XYZ02','C003XYZ03','C003XYZ04')");
        console.log(ServiceOrgUploadServiceTest.sqlStatementString);
        console.log('this is generated for resource organization Items');
        await ServiceOrgUploadServiceTest.resourceOrganizationItemsRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'PATCH and PUT FileUploadService'() {
        const response = await ServiceEndPointsRepository.patch(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, {});
        this.responses.push(response);
        assert.equal(response.status, 405, 'Expected status code of PATCH request to be 405 (METHOD NOT ALLOWED)');
        const responsePut = await ServiceEndPointsRepository.put(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, {});
        this.responses.push(responsePut);
        assert.equal(responsePut.status, 405, 'Expected status code of PUT request to be 405 (METHOD NOT ALLOWED)');
        assert.equal(response.data.error, 'Method Not Allowed', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST with unsupported media type'() {
        const contentType = 'application/xml';

        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, {
            headers: {
                'Content-Type': contentType,
            },
        });
        this.responses.push(response);
        assert.equal(response.data.error, 'Unsupported Media Type', 'Expected error message.');
        assert.equal(response.status, 415, 'Expected status code to be 415 (UNSUPPORTED MEDIA TYPE)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST empty file'() {
        const response = await this.uploadFile('emptyFile.csv');
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        assert.equal(response.data.errors[0].message, 'The CSV file is missing the following columns: companyCode, isDelivery, code, costCenterID, description.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST empty file without authorization'() {
        const response = await this.uploadFileUnauth('emptyFile.csv');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(response.data, 'You are not authorized to use the availability data file upload.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST multiple files'() {
        const formData = new FormData();
        for (let i = 0; i < 2; i += 1) {
            formData.append('file', readFileSync('csvData/serviceOrgFileUploadData/emptyFile.csv', 'utf8'), {
                filename: 'emptyFile.csv',
            });
        }
        const additionalHeaders = {};
        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, formData, {
            headers: formData.getHeaders(additionalHeaders),
        });
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'You can only upload one file at a time.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST no file'() {
        const additionalHeaders = {};
        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, {}, {
            headers: new FormData().getHeaders(additionalHeaders),
        });
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code to be 400 (BAD REQUEST).');
        assert.equal(response.data, 'Choose a file to upload.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing header column'() {
        const response = await this.uploadFile('missingHeaderColumn.csv');
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        assert.equal(response.data.errors[0].message, 'The CSV file is missing the following columns: companyCode, isDelivery, code, costCenterID, description.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing header column without authorization'() {
        const response = await this.uploadFileUnauth('missingHeaderColumn.csv');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(response.data, 'You are not authorized to use the availability data file upload.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing costCenterId column'() {
        const response = await this.uploadFile('missingColumnCostCenterId.csv');
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        assert.equal(response.data.errors[0].message, 'The CSV file is missing the following columns: costCenterID.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing code column'() {
        const response = await this.uploadFile('missingColumnCode.csv');
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        assert.equal(response.data.errors[0].message, 'The CSV file is missing the following columns: code.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing company code column'() {
        const response = await this.uploadFile('missingColumnCompanyCode.csv');
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        assert.equal(response.data.errors[0].message, 'The CSV file is missing the following columns: companyCode.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with missing delivery column'() {
        const response = await this.uploadFile('missingColumnIsDelivery.csv');
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
        assert.equal(response.data.errors[0].message, 'The CSV file is missing the following columns: isDelivery.', 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid costcenterId(Mandatory data)'() {
        const response = await this.uploadFile('invalidDataCostCenterId.csv');
        this.responses.push(response);
        const actualResult = response.data;
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResult1.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResult1.createdHeader);
        assert.equal(response.data.errors[0].message, uploadResult1.errors, 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with invalid companycode(Mandatory data)'() {
        const response = await this.uploadFile('invalidDataCompanyCode.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResult2.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResult2.createdHeader);
        assert.equal(response.data.errors[0].message, uploadResult2.errors, 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with one costcenter assigned for multiple service org with One valid and one invalid record'() {
        const response = await this.uploadFile('oneValidAndOneInvalidRecord.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResult6.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResult6.createdHeader);
        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.organizationHeaderRepository.sqlGenerator.generateSelectStatement(ServiceOrgUploadServiceTest.organizationHeaderRepository.tableName, ['CODE', 'DESCRIPTION'], "WHERE CODE='XYZ03'");
        const organizationHeaderAfterUpsert = await ServiceOrgUploadServiceTest.organizationHeaderRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);

        assert.equal(organizationHeaderAfterUpsert[0].CODE, 'XYZ03', 'The organization header is updated with valid record');

        assert.equal(response.data.errors[0].message, uploadResult6.errors, 'Expected error message should appear.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST valid file with two service org for successfull upload'() {
        const response = await this.uploadFile('valid.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResult5.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResult5.createdHeader);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file where all cost centers belonging to one service org are being reassigned to another'() {
        const response = await this.uploadFile('changeCCAssociations.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResult4.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResult4.createdHeader);

        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.organizationDetailRepository.sqlGenerator.generateSelectStatement(ServiceOrgUploadServiceTest.organizationDetailRepository.tableName, ['CODE', 'UNITKEY', 'UNITTYPE'], "WHERE CODE='SO1' AND UNITTYPE='CS'");
        const organizationHeaderAfterUpsert = await ServiceOrgUploadServiceTest.organizationDetailRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);

        assert.equal(organizationHeaderAfterUpsert[0].CODE, 'SO1', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert[0].UNITKEY, 'C003XYZ04', 'The organization detail is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert[1].CODE, 'SO1', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert[1].UNITKEY, 'C003XYZ03', 'The organization detail is updated with valid record');

        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.organizationDetailRepository.sqlGenerator.generateSelectStatement(ServiceOrgUploadServiceTest.organizationDetailRepository.tableName, ['CODE', 'UNITKEY', 'UNITTYPE'], "WHERE CODE='SO2' AND UNITTYPE='CS'");
        const organizationHeaderAfterUpsert1 = await ServiceOrgUploadServiceTest.organizationDetailRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);

        assert.equal(organizationHeaderAfterUpsert1[0].CODE, 'SO2', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[0].UNITKEY, 'C003XYZ02', 'The organization detail is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[1].CODE, 'SO2', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[1].UNITKEY, 'C003XYZ01', 'The organization detail is updated with valid record');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file where the resource organization associated with the service org is assigned as a requested resource organization to a request'() {
        const response = await this.uploadFile('updateWithRRAssignment.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResult8.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResult8.createdHeader);
        assert.equal(response.data.errors[0].message, uploadResult8.errors, 'Expected error message should appear.');

        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.organizationDetailRepository.sqlGenerator.generateSelectStatement(ServiceOrgUploadServiceTest.organizationDetailRepository.tableName, ['CODE', 'UNITKEY', 'UNITTYPE'], "WHERE CODE='SO3' AND UNITKEY='C003XYZ05'");
        const organizationHeaderAfterUpsert1 = await ServiceOrgUploadServiceTest.organizationDetailRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);
        assert.equal(organizationHeaderAfterUpsert1[0].CODE, 'SO3', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[0].UNITKEY, 'C003XYZ05', 'The organization detail is updated with valid record');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file which changes the cost center associations such that - that service organization doesnt have any more cost centers associated with it.'() {
        const response = await this.uploadFile('changeCCAssociationsWithDanglingSO.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResult7.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResult7.createdHeader);
        assert.equal(response.data.errors[0].message, uploadResult7.errors, 'Expected error message should appear.');

        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.organizationDetailRepository.sqlGenerator.generateSelectStatement(ServiceOrgUploadServiceTest.organizationDetailRepository.tableName, ['CODE', 'UNITKEY', 'UNITTYPE'], "WHERE CODE='SO2'");
        const organizationHeaderAfterUpsert1 = await ServiceOrgUploadServiceTest.organizationDetailRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);

        assert.equal(organizationHeaderAfterUpsert1[0].CODE, 'SO2', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[0].UNITKEY, 'C003XYZ02', 'The organization detail is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[0].UNITTYPE, 'CS', 'The unit type is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[1].CODE, 'SO2', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[1].UNITKEY, 'C003', 'The company code is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert1[1].UNITTYPE, 'CC', 'The unit type is updated with valid record');

        ServiceOrgUploadServiceTest.sqlStatementString = ServiceOrgUploadServiceTest.organizationDetailRepository.sqlGenerator.generateSelectStatement(ServiceOrgUploadServiceTest.organizationDetailRepository.tableName, ['CODE', 'UNITKEY', 'UNITTYPE'], "WHERE CODE='SO1' AND UNITTYPE='CS'");
        const organizationHeaderAfterUpsert2 = await ServiceOrgUploadServiceTest.organizationDetailRepository.statementExecutor.execute(ServiceOrgUploadServiceTest.sqlStatementString);

        assert.equal(organizationHeaderAfterUpsert2[0].CODE, 'SO1', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert2[0].UNITKEY, 'C003XYZ04', 'The organization detail is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert2[1].CODE, 'SO1', 'The organization header is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert2[1].UNITKEY, 'C003XYZ03', 'The company code is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert2[2].CODE, 'SO1', 'The unit type is updated with valid record');
        assert.equal(organizationHeaderAfterUpsert2[2].UNITKEY, 'C003XYZ01', 'The unit type is updated with valid record');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST valid file with two service org without authorization'() {
        const response = await this.uploadFileUnauth('valid.csv');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(response.data, 'You are not authorized to use the availability data file upload.', 'Expected error message.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with empty costcenterId(Mandatory data)'() {
        const response = await this.uploadFile('emptyCostCenterID.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResultEmptyCoCenter.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResultEmptyCoCenter.createdHeader);
        expect(actualResult.errors[0].message).to.equal(uploadResultEmptyCoCenter.errors);
        expect(actualResult.errors[1].message).to.equal('The following entries in the CSV file have empty mandatory fields: 2: costCenterID; .');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with empty companyCode(Mandatory data)'() {
        const response = await this.uploadFile('emptyCompanyCode.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResultEmptyCoCode.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResultEmptyCoCode.createdHeader);
        expect(actualResult.errors[0].message).to.equal(uploadResultEmptyCoCode.errors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with empty code(Mandatory data)'() {
        const response = await this.uploadFile('emptyCode.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(uploadResultEmptySrvOrg.processedRecords);
        expect(actualResult.createdHeaders).to.equal(uploadResultEmptySrvOrg.createdHeader);
        expect(actualResult.errors[0].message).to.equal(uploadResultEmptySrvOrg.errors);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST valid file with no record and blank line'() {
        const response = await this.uploadFile('serviceOrgTemplate.csv');
        this.responses.push(response);
        const actualResult = response.data;

        assert.equal(response.status, 200, 'Expected status code to be 200 (OK).');
        expect(actualResult.createdItems).to.equal(0);
        expect(actualResult.createdHeaders).to.equal(0);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'POST file with empty code(Mandatory data) without authorization'() {
        const response = await this.uploadFileUnauth('emptyCode.csv');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(response.data, 'You are not authorized to use the availability data file upload.', 'Expected error message.');
    }

    private async uploadFile(name: string) {
        const additionalHeaders = {};
        const formData = new FormData();

        const fileContent = await promisify(readFile)(`csvData/serviceOrgFileUploadData/${name}`, 'utf8');

        formData.append('file', fileContent, {
            filename: name,
        });

        const response = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint, formData, {
            headers: formData.getHeaders(additionalHeaders),
        });

        return response;
    }

    private async uploadFileUnauth(name: string) {
        const additionalHeaders = {};
        const formData = new FormData();

        const fileContent = await promisify(readFile)(`csvData/serviceOrgFileUploadData/${name}`, 'utf8');

        formData.append('file', fileContent, {
            filename: name,
        });

        const response = await ServiceOrgUploadServiceTest.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, this.serviceEndPoint, formData, {
            headers: formData.getHeaders(additionalHeaders),
        });

        return response;
    }
}
