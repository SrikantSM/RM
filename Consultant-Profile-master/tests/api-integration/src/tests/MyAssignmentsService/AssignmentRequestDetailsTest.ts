import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { EmployeeHeader, ResourceRequest } from 'test-commons';
import { MyAssignmentsServiceRepository } from '../../utils/serviceRepository/MyAssignmentsService-Repository';
import {
    allEmail,
    allEmployeeHeaders,
    allWorkforcePerson,
    allResourceCapacity,
    allResourceHeaders,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allAssignments,
    assignment1,
    allAssignmentBuckets,
    customerData,
    workpackageData,
    projectData,
    resourceRequestData,
    allProjectRoles,
    demandData,

} from '../../data';
import { createAssignmentRequestDetails } from '../../data/service/myAssignmentsService/AssignmentRequestDetails';
import { AssignmentRequestDetails } from '../../serviceEntities/myAssignmentsService/AssignmentRequestDetails';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('MyAssignmentsService/AssignmentRequestDetails')
export class AssignmentRequestDetailsTest extends MyAssignmentsServiceRepository {
    public constructor() { super('AssignmentRequestDetails'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.resourceHeaderRepository.insertMany(allResourceHeaders);
        await this.resourceCapacityRepository.insertMany(allResourceCapacity);
        await this.assignmentsRepository.insertMany(allAssignments);
        await this.assignmentBucketRepository.insertMany(allAssignmentBuckets);
        await this.customerRepository.insertMany(customerData);
        await this.workPackageRepository.insertMany(workpackageData);
        await this.projectRepository.insertMany(projectData);
        await this.projectRoleRepository.insertMany(allProjectRoles);
        await this.resourceRequestRepository.insertMany(resourceRequestData);
        await this.demandRepository.insertMany(demandData);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.resourceHeaderRepository.deleteMany(allResourceHeaders);
        await this.resourceCapacityRepository.deleteMany(allResourceCapacity);
        await this.assignmentsRepository.deleteMany(allAssignments);
        await this.assignmentBucketRepository.deleteMany(allAssignmentBuckets);
        await this.customerRepository.deleteMany(customerData);
        await this.workPackageRepository.deleteMany(workpackageData);
        await this.projectRepository.deleteMany(projectData);
        await this.projectRoleRepository.deleteMany(allProjectRoles);
        await this.resourceRequestRepository.deleteMany(resourceRequestData);
        await this.demandRepository.deleteMany(demandData);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all projects for resource.'() {
        const response = await this.get();
        this.responses.push(response);
        const assignmentRequestDetails = response.data.value as AssignmentRequestDetails[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(assignmentRequestDetails, 'Expected a list of all projects for resource.');
        assert.equal(assignmentRequestDetails.length, 1, 'Expected 1 assigned project record.');
        const expectedAssignmentRequestDetails: AssignmentRequestDetails[] = [];
        expectedAssignmentRequestDetails.push(this.prepareAssignmentRequestDetails(resourceRequestData[0], allEmployeeHeaders[0]));
        expect(assignmentRequestDetails).to.deep.include.any.members(expectedAssignmentRequestDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all projects for a user not in the DB.'() {
        const response = await this.getWithNoConsultantInDB();
        this.responses.push(response);
        const assignmentRequestDetails = response.data.value as AssignmentRequestDetails[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(assignmentRequestDetails, 'Expected an empty list of projects.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all projects for resource without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for project assigned to resource.'() {
        const response = await this.get(`(assignment_ID=${allAssignments[0].ID})`);
        this.responses.push(response);
        const assignmentRequestDetails = response.data;
        delete assignmentRequestDetails['@context'];
        delete assignmentRequestDetails['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        const expectedAssignmentRequestDetails = this.prepareAssignmentRequestDetails(resourceRequestData[0], allEmployeeHeaders[0]);
        expect(assignmentRequestDetails).to.eql(expectedAssignmentRequestDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for project assigned to another employee.'() {
        const response = await this.get(`(assignment_ID=${allAssignments[1].ID})`);
        this.responses.push(response);
        const assignmentRequestDetails = response.data as AssignmentRequestDetails;

        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
        assert.isUndefined(
            assignmentRequestDetails.resourceRequest_ID,
            'Expected no project from another employee.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for project without authorization.'() {
        const response = await this.getWithoutAuthorization(`(assignment_ID=${allAssignments[0].ID})`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a assignment record for a request.'() {
        const responseAssignmentRequestDetailsCreate = await this.create(createAssignmentRequestDetails);
        this.responses.push(responseAssignmentRequestDetailsCreate);

        assert.equal(responseAssignmentRequestDetailsCreate.status, 403, 'Creating a assignment should not be allowed, expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing a assignment record is not allowed.'() {
        const updatePayload = {
            projectName: 'Change project name',
        };
        const response = await this.update(`(assignment_ID=${allAssignments[0].ID})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Changing a resource assignment should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting a assignment record is not allowed.'() {
        const response = await this.delete(`(assignment_ID=${allAssignments[0].ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a assignment record should not be possible and expected status code should be 403(Forbidden).');
    }

    private prepareAssignmentRequestDetails(resourceRequest: ResourceRequest, employeeHeader: EmployeeHeader) {
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusFiveMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 5, 1));
        const start = currentMonthStart.toISOString().slice(0, 10);
        const end = nowPlusFiveMonthsStart.toISOString().slice(0, 10);
        const prepareAssignmentRequestDetails: AssignmentRequestDetails = {
            assignment_ID: assignment1.ID,
            resourceRequest_ID: resourceRequest.ID,
            employee_ID: employeeHeader.ID,
            assignmentStatusCode: 1,
            assignmentStatus: 'Soft-Booked',
            requestDisplayId: resourceRequest.displayId,
            requestName: resourceRequest.name,
            projectName: 'Implementation of SAP S/4HANA 1010',
            customerName: 'John & Smith Co API test',
            workPackageStartDate: '2019-07-01',
            workPackageEndDate: '2020-10-07',
            startDate: start,
            endDate: end,
            workItemName: 'Work Item Name 1',
            requestedStartDate: '2019-01-01',
            requestedEndDate: '2019-03-01',
            assignedCapacityinHour: 36,
        };
        return prepareAssignmentRequestDetails;
    }
}
