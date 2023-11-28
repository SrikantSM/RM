import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { EmployeeHeader, ResourceHeader, AssignmentBucket } from 'test-commons';
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
    allAssignmentBuckets,
    customerData,
    workpackageData,
    projectData,
    resourceRequestData,
    assignment2,
    allProjectRoles,
    assignmentBucket11,

} from '../../data';
import { createAssignmentDetails } from '../../data/service/myAssignmentsService/AssignmentDetails';
import { AssignmentDetails } from '../../serviceEntities/myAssignmentsService/AssignmentDetails';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('MyAssignmentsService/AssignmentDetails')
export class AssignmentDetailsTest extends MyAssignmentsServiceRepository {
    public constructor() { super('AssignmentDetails'); }

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
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all perday assignments for resource.'() {
        const response = await this.get();
        this.responses.push(response);
        const assignmentDetails = response.data.value as AssignmentDetails[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(assignmentDetails, 'Expected a list of all assignments for perday basis.');
        assert.equal(assignmentDetails.length, 6, 'Expected 6 assignment bucket record.');
        const expectedAssignmentDetails = (this.prepareAssignmentDetails([
            { assignmentBucket: allAssignmentBuckets[0] },
            { assignmentBucket: allAssignmentBuckets[1] },
            { assignmentBucket: allAssignmentBuckets[2] },
            { assignmentBucket: allAssignmentBuckets[3] },
            { assignmentBucket: allAssignmentBuckets[4] },
            { assignmentBucket: allAssignmentBuckets[5] },
        ], allResourceHeaders[1], allEmployeeHeaders[0]));
        expect(assignmentDetails).to.deep.include.any.members(expectedAssignmentDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assignments for a user not in the DB.'() {
        const response = await this.getWithNoConsultantInDB();
        this.responses.push(response);
        const assignmentDetails = response.data.value as AssignmentDetails[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(assignmentDetails, 'Expected an empty list of assignmets.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assignments for resource without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for per day assignment.'() {
        const response = await this.get(`(ID=${assignmentBucket11.ID})`);
        this.responses.push(response);
        const assignmentDetails = response.data;
        delete assignmentDetails['@context'];
        delete assignmentDetails['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        const expectedAssignmentDetails = this.prepareAssignmentDetail(allAssignmentBuckets[0], allResourceHeaders[1], allEmployeeHeaders[0]);
        expect(assignmentDetails).to.eql(expectedAssignmentDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for per day assignment of another employee.'() {
        const response = await this.get(`(ID=${assignment2.ID})`);
        this.responses.push(response);
        const assignmentDetails = response.data as AssignmentDetails;

        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
        assert.isUndefined(
            assignmentDetails.assignment_ID,
            'Expected no assignment from another employee.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for per day assignment without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${assignmentBucket11.ID})`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a per day assignment for a resource.'() {
        const responseAssignmentDetailsCreate = await this.create(createAssignmentDetails);
        this.responses.push(responseAssignmentDetailsCreate);

        assert.equal(responseAssignmentDetailsCreate.status, 403, 'Creating a assignment should not be allowed, expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing a per day assignment is not allowed.'() {
        const updatePayload = {
            resourceRequest_ID: '72bdab69-aa8b-4b33-99fc-5fefbad29fc6',
        };
        const response = await this.update(`(ID=${assignmentBucket11.ID})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Changing a per day assignment should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting a per day assignment is not allowed.'() {
        const response = await this.delete(`(ID=${assignmentBucket11.ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a per day assignment should not be possible and expected status code should be 403(Forbidden).');
    }

    private prepareAssignmentDetails(assignments: { assignmentBucket: AssignmentBucket }[], resourceHeader: ResourceHeader, employeeHeader: EmployeeHeader) {
        const preparedAssignmentDetails: AssignmentDetails[] = [];
        assignments.forEach((assignment) => {
            preparedAssignmentDetails.push(this.prepareAssignmentDetail(assignment.assignmentBucket, resourceHeader, employeeHeader));
        });
        return preparedAssignmentDetails;
    }

    private prepareAssignmentDetail(assignmentBucket: AssignmentBucket, resourceHeader: ResourceHeader, employeeHeader: EmployeeHeader) {
        const staffed = assignmentBucket.bookedCapacityInMinutes / 60;
        const now = new Date(assignmentBucket.startTime);
        const start = now.toISOString().slice(0, 10);
        const prepareAssignmentDetail: AssignmentDetails = {
            ID: assignmentBucket.ID,
            assignment_ID: assignmentBucket.assignment_ID,
            resource_ID: resourceHeader.ID,
            resourceRequest_ID: resourceRequestData[0].ID,
            startTime: `${assignmentBucket.startTime.slice(0, -5)}Z`,
            AssignedHours: staffed,
            employee_ID: employeeHeader.ID,
            assignmentStartDate: start,
        };
        return prepareAssignmentDetail;
    }
}
