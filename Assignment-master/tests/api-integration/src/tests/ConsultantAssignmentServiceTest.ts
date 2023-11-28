import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../utils';
import { ResourceHeaderRepository, ResourceCapacityRepository, ResourceRequestRepository, ResourceTypesRepository, AssignmentsRepository, AssignmentBucketRepository, Assignments, AssignmentBucket, ResourceRequest, ResourceHeader, ResourceTypes, ResourceCapacity, DemandRepository, Demand, JobDetailRepository, OrganizationDetailRepository, OrganizationHeaderRepository, EmployeeHeaderRepository, WorkAssignmentRepository, WorkforcePersonRepository, CostCenterRepository, CostCenter, OrganizationDetail, OrganizationHeader, JobDetail, EmployeeHeader, WorkAssignment, WorkforcePerson, WorkPackage, WorkPackageRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository, BookedCapacityAggregateRepository, EmailRepository, ProfileDetail, Email, ProfileDetailRepository, WorkPlaceAddress, WorkPlaceAddressRepository, ResourceSupply, ResourceSupplyRepository } from 'test-commons';

@suite
export class ConsultantAssignmentServiceTest {

    private static consultantAssignmentServiceClientForConsultant: AxiosInstance;
    private static consultantAssignmentServiceClientForResourceManager: AxiosInstance;

    private static uniquifier: Uniquifier;

    private static assignmentRepository: AssignmentsRepository;
    private static assignmentBucketRepository: AssignmentBucketRepository;
    private static resourceRequestRepository: ResourceRequestRepository;
    private static demandRepository: DemandRepository;
    private static workPackageRepository: WorkPackageRepository;
    private static resourceHeaderRepository: ResourceHeaderRepository;
    private static resourceTypesRepository: ResourceTypesRepository;
    private static resourceCapacityRepository: ResourceCapacityRepository;
    private static jobDetailRepository: JobDetailRepository;
    private static organizationDetailRepository: OrganizationDetailRepository;
    private static organizationHeaderRepository: OrganizationHeaderRepository;
    private static employeeHeaderRepository: EmployeeHeaderRepository;
    private static workAssignmentRepository: WorkAssignmentRepository;
    private static workforcePersonRepository: WorkforcePersonRepository;
    private static costCenterRepository: CostCenterRepository;
    private static emailRepository: EmailRepository;
    private static profileDetailsRepository: ProfileDetailRepository;
    private static workPlaceAddressRepository: WorkPlaceAddressRepository;
    private static resourceSupplyRepository: ResourceSupplyRepository;

    private static assignment: Assignments[];
    private static assignmentBuckets: AssignmentBucket[];
    private static resourceSupply: ResourceSupply[];
    private static resourceRequests: ResourceRequest[];
    private static demand: Demand[];
    private static workPackage: WorkPackage[];
    private static resourceTypes: ResourceTypes[];
    private static resourceHeader: ResourceHeader[];
    private static resourceCapacity: ResourceCapacity[];
    private static costCenter: CostCenter[];
    private static organizationDetail: OrganizationDetail[];
    private static organizationHeader: OrganizationHeader[];
    private static jobDetail: JobDetail[];
    private static employeeHeader: EmployeeHeader[];
    private static workAssignment: WorkAssignment[];
    private static workforcePerson: WorkforcePerson[];
    private static email: Email[];
    private static profileDetail: ProfileDetail[];
    private static workPlaceAddress: WorkPlaceAddress[];

    private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
    private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
    private static resourceOrganizations: ResourceOrganizations[];
    private static resourceOrganizationItems: ResourceOrganizationItems[];

    @timeout(TEST_TIMEOUT)
    static async before() {
        ConsultantAssignmentServiceTest.consultantAssignmentServiceClientForResourceManager = await testEnvironment.getConsultantAssignmentServiceClientForResourceManager();
        ConsultantAssignmentServiceTest.consultantAssignmentServiceClientForConsultant = await testEnvironment.getConsultantAssignmentServiceClientForConsultant();

        ConsultantAssignmentServiceTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        ConsultantAssignmentServiceTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        ConsultantAssignmentServiceTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();

        ConsultantAssignmentServiceTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        ConsultantAssignmentServiceTest.demandRepository = await testEnvironment.getDemandRepository();
        ConsultantAssignmentServiceTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        ConsultantAssignmentServiceTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        ConsultantAssignmentServiceTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();
        ConsultantAssignmentServiceTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();

        ConsultantAssignmentServiceTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();
        ConsultantAssignmentServiceTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        ConsultantAssignmentServiceTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        ConsultantAssignmentServiceTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        ConsultantAssignmentServiceTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        ConsultantAssignmentServiceTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        ConsultantAssignmentServiceTest.costCenterRepository = await testEnvironment.getCostCenterRepository();
        ConsultantAssignmentServiceTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        ConsultantAssignmentServiceTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        ConsultantAssignmentServiceTest.emailRepository = await testEnvironment.getEmailRepository();
        ConsultantAssignmentServiceTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
        ConsultantAssignmentServiceTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();

        ConsultantAssignmentServiceTest.uniquifier = new Uniquifier();

        ConsultantAssignmentServiceTest.assignment = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        ConsultantAssignmentServiceTest.assignmentBuckets = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        ConsultantAssignmentServiceTest.resourceSupply = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');

        ConsultantAssignmentServiceTest.resourceRequests = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        ConsultantAssignmentServiceTest.demand = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.project.demands.csv', 'Demand');
        ConsultantAssignmentServiceTest.workPackage = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');
        ConsultantAssignmentServiceTest.employeeHeader = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');

        ConsultantAssignmentServiceTest.resourceHeader = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        ConsultantAssignmentServiceTest.resourceTypes = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');
        ConsultantAssignmentServiceTest.resourceCapacity = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        ConsultantAssignmentServiceTest.workAssignment = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');

        ConsultantAssignmentServiceTest.workforcePerson = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        ConsultantAssignmentServiceTest.organizationHeader = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');
        ConsultantAssignmentServiceTest.organizationDetail = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        ConsultantAssignmentServiceTest.jobDetail = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');
        ConsultantAssignmentServiceTest.costCenter = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        ConsultantAssignmentServiceTest.resourceOrganizations = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        ConsultantAssignmentServiceTest.resourceOrganizationItems = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        ConsultantAssignmentServiceTest.email = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
        ConsultantAssignmentServiceTest.workPlaceAddress = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
        ConsultantAssignmentServiceTest.profileDetail = await ConsultantAssignmentServiceTest.uniquifier.getRecords('../data/input/consultantAssignmentService/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');

        await ConsultantAssignmentServiceTest.assignmentRepository.insertMany(ConsultantAssignmentServiceTest.assignment);
        await ConsultantAssignmentServiceTest.assignmentBucketRepository.insertMany(ConsultantAssignmentServiceTest.assignmentBuckets);
        await ConsultantAssignmentServiceTest.resourceSupplyRepository.insertMany(ConsultantAssignmentServiceTest.resourceSupply);
        await ConsultantAssignmentServiceTest.resourceRequestRepository.insertMany(ConsultantAssignmentServiceTest.resourceRequests);
        await ConsultantAssignmentServiceTest.demandRepository.insertMany(ConsultantAssignmentServiceTest.demand);
        await ConsultantAssignmentServiceTest.workPackageRepository.insertMany(ConsultantAssignmentServiceTest.workPackage);
        await ConsultantAssignmentServiceTest.resourceTypesRepository.insertMany(ConsultantAssignmentServiceTest.resourceTypes);
        await ConsultantAssignmentServiceTest.resourceHeaderRepository.insertMany(ConsultantAssignmentServiceTest.resourceHeader);
        await ConsultantAssignmentServiceTest.resourceCapacityRepository.insertMany(ConsultantAssignmentServiceTest.resourceCapacity);
        await ConsultantAssignmentServiceTest.jobDetailRepository.insertMany(ConsultantAssignmentServiceTest.jobDetail);
        await ConsultantAssignmentServiceTest.organizationDetailRepository.insertMany(ConsultantAssignmentServiceTest.organizationDetail);
        await ConsultantAssignmentServiceTest.organizationHeaderRepository.insertMany(ConsultantAssignmentServiceTest.organizationHeader);
        await ConsultantAssignmentServiceTest.employeeHeaderRepository.insertMany(ConsultantAssignmentServiceTest.employeeHeader);
        await ConsultantAssignmentServiceTest.workAssignmentRepository.insertMany(ConsultantAssignmentServiceTest.workAssignment);
        await ConsultantAssignmentServiceTest.workforcePersonRepository.insertMany(ConsultantAssignmentServiceTest.workforcePerson);
        await ConsultantAssignmentServiceTest.costCenterRepository.insertMany(ConsultantAssignmentServiceTest.costCenter);
        await ConsultantAssignmentServiceTest.emailRepository.insertMany(ConsultantAssignmentServiceTest.email);
        await ConsultantAssignmentServiceTest.workPlaceAddressRepository.insertMany(ConsultantAssignmentServiceTest.workPlaceAddress);
        await ConsultantAssignmentServiceTest.profileDetailsRepository.insertMany(ConsultantAssignmentServiceTest.profileDetail);

        await ConsultantAssignmentServiceTest.resourceOrganizationsRepository.insertMany(ConsultantAssignmentServiceTest.resourceOrganizations);
        await ConsultantAssignmentServiceTest.resourceOrganizationItemsRepository.insertMany(ConsultantAssignmentServiceTest.resourceOrganizationItems);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager cannot access consultant assignment service'() {

        const readResponse = await ConsultantAssignmentServiceTest.consultantAssignmentServiceClientForResourceManager.get('/Assignments');
        assert.equal(readResponse.status, 403, 'Expected status code to be 403 (Unauthorized).');
        assert.equal(readResponse.data.error.message, `Not authorized to send event 'READ' to 'ConsultantAssignmentService'`, 'Expected error message not returned');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Consultant can read and edit own assignment'() {

        // 1. Read the assignment
        const readResponseBeforeUpdate = await ConsultantAssignmentServiceTest.consultantAssignmentServiceClientForConsultant.get(`/Assignments(${ConsultantAssignmentServiceTest.assignment[0].ID})?$expand=_weeklyAssignmentDistribution`);
        assert.equal(readResponseBeforeUpdate.status, 200, 'Expected status code to be 200 (OK).');
        assert.exists(readResponseBeforeUpdate.data._weeklyAssignmentDistribution, 'Weekly distribution not returned on read');

        const assignmentHeaderBeforeUpdate = readResponseBeforeUpdate.data;
        const weeklyDistributionBeforeUpdate = readResponseBeforeUpdate.data._weeklyAssignmentDistribution;
        /**
         * 2. Change the existing distribution as follows (covering multiple scenarios at once):
         * 202139 -> increase from 18h to 30h (+12h)
         * 202140 -> decrease from 27h to 20h (-7h)
         * 202144 -> non-existing, create new for 10h (+10h)
         * 202152 -> decrease from 9h to 0h, effectively deleting the last week (which should change asgn end date) (-9h)
         * All other weekly distribution must remain unchanged
         * Total changed hours at header level = 12 - 7 + 10 - 9 = (+)6h
         */
        const patchPayload = {
            "_weeklyAssignmentDistribution": [
                {
                    "calendarWeek": "202139",
                    "bookedCapacity": 30
                },
                {
                    "calendarWeek": "202140",
                    "bookedCapacity": 20
                },
                {
                    "calendarWeek": "202144",
                    "bookedCapacity": 10
                },
                {
                    "calendarWeek": "202152",
                    "bookedCapacity": 0
                }
            ]
        };
        const updateResponse = await ConsultantAssignmentServiceTest.consultantAssignmentServiceClientForConsultant.patch(`/Assignments(${ConsultantAssignmentServiceTest.assignment[0].ID})`, patchPayload);
        assert.equal(updateResponse.status, 200, 'Expected status code to be 200 (OK).');

        // 3. Assert the values after update
        const readResponseAfterUpdate = await ConsultantAssignmentServiceTest.consultantAssignmentServiceClientForConsultant.get(`/Assignments(${ConsultantAssignmentServiceTest.assignment[0].ID})?$expand=_weeklyAssignmentDistribution`);
        assert.equal(readResponseAfterUpdate.status, 200, 'Expected status code to be 200 (OK).');
        assert.exists(readResponseAfterUpdate.data._weeklyAssignmentDistribution, 'Weekly distribution missing after update');

        const assignmentHeaderAfterUpdate = readResponseAfterUpdate.data;
        const weeklyDistributionAfterUpdate = readResponseAfterUpdate.data._weeklyAssignmentDistribution;

        assert.equal(assignmentHeaderAfterUpdate.bookedCapacity, assignmentHeaderBeforeUpdate.bookedCapacity + 6, 'Booked capacity in header incorrect after update');
        assert.equal(assignmentHeaderAfterUpdate.startDate, '2021-09-28', 'Incorrect assignment start date after update');
        assert.equal(assignmentHeaderAfterUpdate.endDate, '2021-12-26', 'Incorrect assignment end date after update');

        const calendarWeeksInDistributionBeforeUpdate = weeklyDistributionBeforeUpdate.map((r: { calendarWeek: string; }) => r.calendarWeek);
        const newlyInsertedCalendarWeek = '202144';
        const updatedCalendarWeeks = ['202139', '202140'];
        const deletedCalendarWeek = '202152';
        const calendarWeeksUntouched = calendarWeeksInDistributionBeforeUpdate.filter((r: string) => r != newlyInsertedCalendarWeek && r != deletedCalendarWeek && !updatedCalendarWeeks.some(week => week == r));

        // For the weeks not part of the patch payload, the booked capacity should be same as before
        for (let untouchedCalendarWeek of calendarWeeksUntouched) {
            let bookedCapacityBeforeUpdate = weeklyDistributionBeforeUpdate.filter((r: any) => r.calendarWeek == untouchedCalendarWeek).map((r: { bookedCapacity: any; }) => r.bookedCapacity);
            let bookedCapacityAfterUpdate = weeklyDistributionAfterUpdate.filter((r: any) => r.calendarWeek == untouchedCalendarWeek).map((r: { bookedCapacity: any; }) => r.bookedCapacity);
            assert.equal(bookedCapacityAfterUpdate[0], bookedCapacityBeforeUpdate[0], 'Booked capacity effected for weeks not in patch payload');
        }
        assert.equal(weeklyDistributionAfterUpdate.filter((r: { calendarWeek: string; }) => r.calendarWeek == newlyInsertedCalendarWeek).map((r: { bookedCapacity: any; }) => r.bookedCapacity), 10, 'Newly inserted weekly distribution incorrect');
        assert.equal(weeklyDistributionAfterUpdate.filter((r: { calendarWeek: string; }) => r.calendarWeek == deletedCalendarWeek).length, 0, 'Deleted weekly distribution still exists');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Consultant cannot edit assignment of other consultant'() {

        const patchPayload = {
            "_weeklyAssignmentDistribution": [
                {
                    "calendarWeek": "202139",
                    "bookedCapacity": 60
                }
            ]
        };

        const updateResponse = await ConsultantAssignmentServiceTest.consultantAssignmentServiceClientForConsultant.patch(`/Assignments(${ConsultantAssignmentServiceTest.assignment[1].ID})`, patchPayload);
        assert.equal(updateResponse.status, 400, 'Expected status code to be 400 (Bad Request).');
        assert.equal(updateResponse.data.error.message, `You are not authorized to change the assignment of other consultants.`, 'Expected error message not returned');
    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        await ConsultantAssignmentServiceTest.cleanUpResourceBookedCapacityTable(ConsultantAssignmentServiceTest.resourceHeader.map(r => r.ID));

        await ConsultantAssignmentServiceTest.assignmentRepository.deleteMany(ConsultantAssignmentServiceTest.assignment);
        await ConsultantAssignmentServiceTest.assignmentBucketRepository.deleteMany(ConsultantAssignmentServiceTest.assignmentBuckets);
        await ConsultantAssignmentServiceTest.resourceSupplyRepository.deleteMany(ConsultantAssignmentServiceTest.resourceSupply);
        await ConsultantAssignmentServiceTest.resourceRequestRepository.deleteMany(ConsultantAssignmentServiceTest.resourceRequests);
        await ConsultantAssignmentServiceTest.demandRepository.deleteMany(ConsultantAssignmentServiceTest.demand);
        await ConsultantAssignmentServiceTest.workPackageRepository.deleteMany(ConsultantAssignmentServiceTest.workPackage);
        await ConsultantAssignmentServiceTest.resourceHeaderRepository.deleteMany(ConsultantAssignmentServiceTest.resourceHeader);
        await ConsultantAssignmentServiceTest.resourceTypesRepository.deleteMany(ConsultantAssignmentServiceTest.resourceTypes);
        await ConsultantAssignmentServiceTest.resourceCapacityRepository.deleteMany(ConsultantAssignmentServiceTest.resourceCapacity);
        await ConsultantAssignmentServiceTest.jobDetailRepository.deleteMany(ConsultantAssignmentServiceTest.jobDetail);
        await ConsultantAssignmentServiceTest.organizationHeaderRepository.deleteMany(ConsultantAssignmentServiceTest.organizationHeader);
        await ConsultantAssignmentServiceTest.organizationDetailRepository.deleteMany(ConsultantAssignmentServiceTest.organizationDetail);
        await ConsultantAssignmentServiceTest.employeeHeaderRepository.deleteMany(ConsultantAssignmentServiceTest.employeeHeader);
        await ConsultantAssignmentServiceTest.workAssignmentRepository.deleteMany(ConsultantAssignmentServiceTest.workAssignment);
        await ConsultantAssignmentServiceTest.workforcePersonRepository.deleteMany(ConsultantAssignmentServiceTest.workforcePerson);
        await ConsultantAssignmentServiceTest.costCenterRepository.deleteMany(ConsultantAssignmentServiceTest.costCenter);

        await ConsultantAssignmentServiceTest.emailRepository.deleteMany(ConsultantAssignmentServiceTest.email);
        await ConsultantAssignmentServiceTest.workPlaceAddressRepository.deleteMany(ConsultantAssignmentServiceTest.workPlaceAddress);
        await ConsultantAssignmentServiceTest.profileDetailsRepository.deleteMany(ConsultantAssignmentServiceTest.profileDetail);
        await ConsultantAssignmentServiceTest.resourceOrganizationsRepository.deleteMany(ConsultantAssignmentServiceTest.resourceOrganizations);
        await ConsultantAssignmentServiceTest.resourceOrganizationItemsRepository.deleteMany(ConsultantAssignmentServiceTest.resourceOrganizationItems);
    }

    @timeout(TEST_TIMEOUT)
    static async cleanUpResourceBookedCapacityTable(resourceIDArray: string[]) {

        if (resourceIDArray.length < 1) return;

        let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();
        let resourceIdConcatenatedString: String = '( ';
        resourceIdConcatenatedString = `${resourceIdConcatenatedString} '${resourceIDArray[0]}'`;
        for (var i = 1; i < resourceIDArray.length; i++) {
            resourceIdConcatenatedString = `${resourceIdConcatenatedString}, '${resourceIDArray[i]}'`;
        }
        resourceIdConcatenatedString = `${resourceIdConcatenatedString} )`;
        let deleteResourceBookedCapacityRecords = bookedCapacityAggregateRepository.sqlGenerator.generateDeleteStatement(bookedCapacityAggregateRepository.tableName, `WHERE resourceID IN ${resourceIdConcatenatedString}`);
        await bookedCapacityAggregateRepository.statementExecutor.execute(deleteResourceBookedCapacityRecords);
    }

}
