import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { EmployeeHeader, ResourceCapacity } from 'test-commons';
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
    allProjectRoles,
    resourceHeader2,
    resourceHeader3,

} from '../../data';
import { createResourceDetails } from '../../data/service/myAssignmentsService/ResourceDetails';
import { ResourceDetails } from '../../serviceEntities/myAssignmentsService/ResourceDetails';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('MyAssignmentsService/ResourceDetails')
export class ResourceDetailsTest extends MyAssignmentsServiceRepository {
    public constructor() { super('ResourceDetails'); }

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
    async 'Get a list of all per day capacity maintained for resource.'() {
        const response = await this.get();
        this.responses.push(response);
        const resourceDetails = response.data.value as ResourceDetails[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(resourceDetails, 'Expected a list of all capacity for perday basis.');
        assert.equal(resourceDetails.length, 6, 'Expected 6 resource capacity record.');

        const expectedResourceDetails = this.prepareResourceDetails([
            { resourceCapacity: allResourceCapacity[0] },
            { resourceCapacity: allResourceCapacity[1] },
            { resourceCapacity: allResourceCapacity[2] },
            { resourceCapacity: allResourceCapacity[3] },
            { resourceCapacity: allResourceCapacity[4] },
            { resourceCapacity: allResourceCapacity[5] },
        ], allEmployeeHeaders[0]);
        expect(resourceDetails).to.deep.include.any.members(expectedResourceDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all capacity maintained for a user not in the DB.'() {
        const response = await this.getWithNoConsultantInDB();
        this.responses.push(response);
        const resourceDetails = response.data.value as ResourceDetails[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(resourceDetails, 'Expected an empty list of capacity.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all capacity maintained for resource without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for resource capacity for particular day.'() {
        const response = await this.get(`(resource_id=${resourceHeader2.ID},startTime=${allResourceCapacity[0].startTime})`);
        this.responses.push(response);
        const resourceDetails = response.data;
        delete resourceDetails['@context'];
        delete resourceDetails['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        const expectedResourceDetails = this.prepareResourceDetail(allResourceCapacity[0], allEmployeeHeaders[0]);
        expect(resourceDetails).to.eql(expectedResourceDetails);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for resource capacity for particular day of another employee.'() {
        const response = await this.get(`(resource_id=${resourceHeader3.ID},startTime=${allResourceCapacity[0].startTime})`);
        this.responses.push(response);
        const resourceDetails = response.data as ResourceDetails;

        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
        assert.isUndefined(
            resourceDetails.employee_ID,
            'Expected no capacity data from another employee.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one record for resource for particular day without authorization.'() {
        const response = await this.getWithoutAuthorization(`(resource_id=${resourceHeader2.ID},startTime=${allResourceCapacity[0].startTime})`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a day capacity for resource.'() {
        const responseResourceDetailsCreate = await this.create(createResourceDetails);
        this.responses.push(responseResourceDetailsCreate);

        assert.equal(responseResourceDetailsCreate.status, 403, 'Creating a capacity data should not be allowed, expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing day capacity for resource is not allowed.'() {
        const updatePayload = {
            dayCapacity: 1,
        };
        const response = await this.update(`(resource_id=${resourceHeader2.ID},startTime=${allResourceCapacity[0].startTime})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Changing a day capacity for resource should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting a day capacity for resource record is not allowed.'() {
        const response = await this.delete(`(resource_id=${resourceHeader2.ID},startTime=${allResourceCapacity[0].startTime})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a day capacity for resource should not be possible and expected status code should be 403(Forbidden).');
    }

    private prepareResourceDetails(capacities: { resourceCapacity: ResourceCapacity }[], employeeHeader: EmployeeHeader) {
        const preparedResourceDetails: ResourceDetails[] = [];
        capacities.forEach((capacity) => {
            preparedResourceDetails.push(this.prepareResourceDetail(capacity.resourceCapacity, employeeHeader));
        });
        return preparedResourceDetails;
    }

    private prepareResourceDetail(resourceCapacity: ResourceCapacity, employeeHeader: EmployeeHeader) {
        const now = new Date(resourceCapacity.startTime);
        const start = now.toISOString().slice(0, 10);
        const prepareResourceDetail: ResourceDetails = {
            resource_id: resourceCapacity.resource_id,
            startTime: `${resourceCapacity.startTime.slice(0, -5)}Z`,
            employee_ID: employeeHeader.ID,
            dayCapacity: 8,
            capacityDate: start,
        };
        return prepareResourceDetail;
    }
}
