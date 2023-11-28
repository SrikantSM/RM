import { suite, test, timeout } from 'mocha-typescript';
import { v4 as uuid } from 'uuid';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';
import { AxiosInstance } from 'axios';
import {
    WorkAssignmentRepository, WorkAssignment, AssignmentBucket, AssignmentBucketRepository, Assignments,
    AssignmentsRepository, CostCenter, CostCenterRepository, Demand, DemandRepository, Email, EmailRepository,
    EmployeeHeader, EmployeeHeaderRepository, JobDetail, JobDetailRepository, OrganizationDetail,
    OrganizationDetailRepository, OrganizationHeader, OrganizationHeaderRepository, Phone, PhoneRepository,
    ProfileDetail, ProfileDetailRepository, ResourceCapacity, ResourceCapacityRepository, ResourceHeader,
    ResourceHeaderRepository, ResourceRequest, ResourceRequestRepository, ResourceSupply, ResourceSupplyRepository,
    WorkforcePerson, WorkforcePersonRepository, WorkPackage, WorkPackageRepository, WorkPlaceAddress,
    WorkPlaceAddressRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository,
    ResourceOrganizations, ResourceOrganizationsRepository, ResourceTypes, ResourceTypesRepository
} from 'test-commons';

@suite
export class AssignmentAPICUDTest {

    private static AssignmentPublicAPIClient: AxiosInstance;
    private static capacityServiceClientUserForLockChecks: AxiosInstance;

    private static uniquifier: Uniquifier;

    private static resourceRequestRepository: ResourceRequestRepository;
    private static demandRepository: DemandRepository;
    private static workPackageRepository: WorkPackageRepository;

    private static resourceHeaderRepository: ResourceHeaderRepository;
    private static resourceCapacityRepository: ResourceCapacityRepository;
    private static assignmentRepository: AssignmentsRepository;
    private static assignmentBucketRepository: AssignmentBucketRepository;

    private static resourceSupplyRepository: ResourceSupplyRepository;
    private static employeeHeaderRepository: EmployeeHeaderRepository;
    private static workAssignmentRepository: WorkAssignmentRepository;
    private static workforcePersonRepository: WorkforcePersonRepository;
    private static organizationDetailRepository: OrganizationDetailRepository;
    private static organizationHeaderRepository: OrganizationHeaderRepository;
    private static jobDetailRepository: JobDetailRepository;
    private static costCenterRepository: CostCenterRepository;
    private static resourceTypesRepository: ResourceTypesRepository;

    private static resourceHeader: ResourceHeader[];
    private static resourceCapacity: ResourceCapacity[];

    private static resourceRequests: ResourceRequest[];
    private static demand: Demand[];
    private static workPackage: WorkPackage[];

    private static assignment: Assignments[];
    private static assignmentBuckets: AssignmentBucket[];
    private static resourceSupply: ResourceSupply[];

    private static employeeHeader: EmployeeHeader[];
    private static workAssignment: WorkAssignment[];
    private static workforcePerson: WorkforcePerson[];

    private static organizationDetail: OrganizationDetail[];
    private static organizationHeader: OrganizationHeader[];
    private static jobDetail: JobDetail[];

    private static emailRepository: EmailRepository;
    private static phoneRepository: PhoneRepository;
    private static workPlaceAddressRepository: WorkPlaceAddressRepository;
    private static profileDetailsRepository: ProfileDetailRepository;
    private static costCenter: CostCenter[];
    private static email: Email[];
    private static phone: Phone[];
    private static workPlaceAddress: WorkPlaceAddress[];
    private static profileDetail: ProfileDetail[];
    private static resourceTypes: ResourceTypes[];

    private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
    private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
    private static resourceOrganizations: ResourceOrganizations[];
    private static resourceOrganizationItems: ResourceOrganizationItems[];

    private static assignmentIDs: string = "(";


    @timeout(TEST_TIMEOUT)
    static async before() {
        AssignmentAPICUDTest.AssignmentPublicAPIClient = await testEnvironment.getAssignmentPublicApiServiceClient();
        AssignmentAPICUDTest.capacityServiceClientUserForLockChecks = await testEnvironment.getAuthAttrTestUser02CapacityServiceClient();

        AssignmentAPICUDTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        AssignmentAPICUDTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        AssignmentAPICUDTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();

        AssignmentAPICUDTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        AssignmentAPICUDTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        AssignmentAPICUDTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
        AssignmentAPICUDTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        AssignmentAPICUDTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        AssignmentAPICUDTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        AssignmentAPICUDTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        AssignmentAPICUDTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        AssignmentAPICUDTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        AssignmentAPICUDTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        AssignmentAPICUDTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

        AssignmentAPICUDTest.emailRepository = await testEnvironment.getEmailRepository();
        AssignmentAPICUDTest.phoneRepository = await testEnvironment.getPhoneRepository();
        AssignmentAPICUDTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
        AssignmentAPICUDTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
        AssignmentAPICUDTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

        AssignmentAPICUDTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        AssignmentAPICUDTest.demandRepository = await testEnvironment.getDemandRepository();
        AssignmentAPICUDTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();
        AssignmentAPICUDTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        AssignmentAPICUDTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
        AssignmentAPICUDTest.resourceTypesRepository = await testEnvironment.getResourceTypesRepository();

        AssignmentAPICUDTest.uniquifier = new Uniquifier();
        AssignmentAPICUDTest.resourceHeader = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        AssignmentAPICUDTest.resourceCapacity = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        AssignmentAPICUDTest.assignment = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        AssignmentAPICUDTest.assignmentBuckets = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        AssignmentAPICUDTest.resourceSupply = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');

        AssignmentAPICUDTest.employeeHeader = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
        AssignmentAPICUDTest.workAssignment = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
        AssignmentAPICUDTest.workforcePerson = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        AssignmentAPICUDTest.organizationHeader = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

        AssignmentAPICUDTest.organizationDetail = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        AssignmentAPICUDTest.jobDetail = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

        AssignmentAPICUDTest.email = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
        AssignmentAPICUDTest.phone = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
        AssignmentAPICUDTest.workPlaceAddress = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
        AssignmentAPICUDTest.profileDetail = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
        AssignmentAPICUDTest.costCenter = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        AssignmentAPICUDTest.resourceRequests = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        AssignmentAPICUDTest.demand = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.project.demands.csv', 'Demand');
        AssignmentAPICUDTest.workPackage = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

        AssignmentAPICUDTest.resourceOrganizations = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        AssignmentAPICUDTest.resourceOrganizationItems = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');
        AssignmentAPICUDTest.resourceTypes = await AssignmentAPICUDTest.uniquifier.getRecords('../data/input/assignmentAPICUD/com.sap.resourceManagement.resource-Types.csv', 'ResourceTypes');

        await AssignmentAPICUDTest.resourceRequestRepository.insertMany(AssignmentAPICUDTest.resourceRequests);
        await AssignmentAPICUDTest.demandRepository.insertMany(AssignmentAPICUDTest.demand);
        await AssignmentAPICUDTest.workPackageRepository.insertMany(AssignmentAPICUDTest.workPackage);

        await AssignmentAPICUDTest.resourceHeaderRepository.insertMany(AssignmentAPICUDTest.resourceHeader);
        await AssignmentAPICUDTest.resourceCapacityRepository.insertMany(AssignmentAPICUDTest.resourceCapacity)
        await AssignmentAPICUDTest.assignmentRepository.insertMany(AssignmentAPICUDTest.assignment);
        await AssignmentAPICUDTest.assignmentBucketRepository.insertMany(AssignmentAPICUDTest.assignmentBuckets)
        await AssignmentAPICUDTest.resourceSupplyRepository.insertMany(AssignmentAPICUDTest.resourceSupply);
        await AssignmentAPICUDTest.employeeHeaderRepository.insertMany(AssignmentAPICUDTest.employeeHeader);
        await AssignmentAPICUDTest.workAssignmentRepository.insertMany(AssignmentAPICUDTest.workAssignment)
        await AssignmentAPICUDTest.workforcePersonRepository.insertMany(AssignmentAPICUDTest.workforcePerson);
        await AssignmentAPICUDTest.organizationHeaderRepository.insertMany(AssignmentAPICUDTest.organizationHeader)
        await AssignmentAPICUDTest.organizationDetailRepository.insertMany(AssignmentAPICUDTest.organizationDetail);
        await AssignmentAPICUDTest.jobDetailRepository.insertMany(AssignmentAPICUDTest.jobDetail)
        await AssignmentAPICUDTest.emailRepository.insertMany(AssignmentAPICUDTest.email);
        await AssignmentAPICUDTest.phoneRepository.insertMany(AssignmentAPICUDTest.phone);
        await AssignmentAPICUDTest.workPlaceAddressRepository.insertMany(AssignmentAPICUDTest.workPlaceAddress);
        await AssignmentAPICUDTest.profileDetailsRepository.insertMany(AssignmentAPICUDTest.profileDetail);
        await AssignmentAPICUDTest.costCenterRepository.insertMany(AssignmentAPICUDTest.costCenter);
        await AssignmentAPICUDTest.resourceOrganizationsRepository.insertMany(AssignmentAPICUDTest.resourceOrganizations);
        await AssignmentAPICUDTest.resourceOrganizationItemsRepository.insertMany(AssignmentAPICUDTest.resourceOrganizationItems);
        await AssignmentAPICUDTest.resourceTypesRepository.insertMany(AssignmentAPICUDTest.resourceTypes);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment (with daily distribution) can be successfully (deep) created, (deep) updated and deleted'() {

        const softbookedAssignmentPayload = {
            "requestID": AssignmentAPICUDTest.resourceRequests[0].ID,
            "resourceID": AssignmentAPICUDTest.resourceHeader[2].ID,
            "isSoftBooked": true,
            "_dailyAssignmentDistribution": [
                {
                    "date": "2021-08-03",
                    "bookedCapacity": 2.00
                },
                {
                    "date": "2021-08-05",
                    "bookedCapacity": 1.00
                }
            ]
        }

        const createAssignmentWithDeepInsert = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/Assignments`, softbookedAssignmentPayload);

        assert.equal(createAssignmentWithDeepInsert.status, 201);
        assert.equal(createAssignmentWithDeepInsert.data.startDate, "2021-08-03");
        assert.equal(createAssignmentWithDeepInsert.data.endDate, "2021-08-05");
        assert.equal(createAssignmentWithDeepInsert.data.bookedCapacity, 3);
        assert.equal(createAssignmentWithDeepInsert.data.isSoftBooked, true);
        assert.equal(createAssignmentWithDeepInsert.data._dailyAssignmentDistribution[0].date, "2021-08-03");
        assert.equal(createAssignmentWithDeepInsert.data._dailyAssignmentDistribution[1].date, "2021-08-05");

        //Deep update + status update to hard booked
        const updatePayload = {
            "isSoftBooked": false,
            "_dailyAssignmentDistribution": [
                {
                    "ID": createAssignmentWithDeepInsert.data._dailyAssignmentDistribution[0].ID,
                    "assignmentID": createAssignmentWithDeepInsert.data.ID,
                    "date": '2021-08-03',
                    "calendarWeek": '31',
                    "calendarMonth": '8',
                    "calendarYear": '2021',
                    "bookedCapacity": 3.00
                },
                {
                    "ID": createAssignmentWithDeepInsert.data._dailyAssignmentDistribution[1].ID,
                    "assignmentID": createAssignmentWithDeepInsert.data.ID,
                    "date": '2021-08-05',
                    "calendarWeek": '31',
                    "calendarMonth": '8',
                    "calendarYear": '2021',
                    "bookedCapacity": 4.00
                }
            ]
        }

        const hardbookAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`, updatePayload);

        assert.equal(hardbookAssignment.status, 200);
        // The booking status should've changed to hardbooked
        assert.equal(hardbookAssignment.data.isSoftBooked, false);
        assert.equal(hardbookAssignment.data.startDate, "2021-08-03");
        assert.equal(hardbookAssignment.data.endDate, "2021-08-05");
        // Staffed hours should have been updated
        assert.equal(hardbookAssignment.data.bookedCapacity, 7);

        //Update the assignment to softbooking again
        const updatePayload2 = {
            "isSoftBooked": true
        }

        const softbookAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`, updatePayload2);
        assert.equal(softbookAssignment.status, 400);

        //Finally simply just delete the assignment
        const deleteAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`);
        assert.equal(deleteAssignment.status, 204);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment (with weekly distribution) can be successfully (deep) created, (deep) updated and deleted'() {

        const softbookedAssignmentPayload = {
            "requestID": AssignmentAPICUDTest.resourceRequests[0].ID,
            "resourceID": AssignmentAPICUDTest.resourceHeader[2].ID,
            "isSoftBooked": true,
            "_weeklyAssignmentDistribution": [
                {
                    "calendarWeek": "202140",
                    "bookedCapacity": 5.00
                },
                {
                    "calendarWeek": "202141",
                    "bookedCapacity": 5.00
                }
            ]
        }

        const createAssignmentWithDeepInsert = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/Assignments`, softbookedAssignmentPayload);

        assert.equal(createAssignmentWithDeepInsert.status, 201);
        assert.equal(createAssignmentWithDeepInsert.data.startDate, "2021-10-04");
        assert.equal(createAssignmentWithDeepInsert.data.endDate, "2021-10-17");
        assert.equal(createAssignmentWithDeepInsert.data.bookedCapacity, 10);
        assert.equal(createAssignmentWithDeepInsert.data.isSoftBooked, true);
        assert.equal(createAssignmentWithDeepInsert.data._weeklyAssignmentDistribution[0].calendarWeek, "202140");
        assert.equal(createAssignmentWithDeepInsert.data._weeklyAssignmentDistribution[1].calendarWeek, "202141");

        //Deep update + status update to hard booked
        const updatePayload = {
            "isSoftBooked": false,
            "_weeklyAssignmentDistribution": [
                {
                    "calendarWeek": "202141",
                    "bookedCapacity": 10
                },
                {
                    "calendarWeek": "202142",
                    "bookedCapacity": 5
                }
            ]
        }

        const hardbookAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`, updatePayload);

        assert.equal(hardbookAssignment.status, 200);
        // The booking status should've changed to hardbooked
        assert.equal(hardbookAssignment.data.isSoftBooked, false);
        assert.equal(hardbookAssignment.data.startDate, "2021-10-04");
        assert.equal(hardbookAssignment.data.endDate, "2021-10-24");
        // Staffed hours should have been updated
        assert.equal(hardbookAssignment.data.bookedCapacity, 20);

        //Update the assignment to softbooking again
        const updatePayload2 = {
            "isSoftBooked": true
        }

        const softbookAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`, updatePayload2);
        //This should not be allowed.
        assert.equal(softbookAssignment.status, 400);

        //Finally simply just delete the assignment
        const deleteAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`);
        assert.equal(deleteAssignment.status, 204);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment (with monthly distribution) can be successfully (deep) created, (deep) updated and deleted'() {

        const softbookedAssignmentPayload = {
            "requestID": AssignmentAPICUDTest.resourceRequests[0].ID,
            "resourceID": AssignmentAPICUDTest.resourceHeader[2].ID,
            "isSoftBooked": true,
            "_monthlyAssignmentDistribution": [
                {
                    "calendarMonth": "202108",
                    "bookedCapacity": 30
                },
                {
                    "calendarMonth": "202109",
                    "bookedCapacity": 30
                }
            ]
        }

        const createAssignmentWithDeepInsert = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/Assignments`, softbookedAssignmentPayload);

        assert.equal(createAssignmentWithDeepInsert.status, 201);
        // Assignment starts on 03-08 as resource is not available on 01 and 02
        assert.equal(createAssignmentWithDeepInsert.data.startDate, "2021-08-03");
        assert.equal(createAssignmentWithDeepInsert.data.endDate, "2021-09-30");
        assert.equal(createAssignmentWithDeepInsert.data.bookedCapacity, 60);
        assert.equal(createAssignmentWithDeepInsert.data.isSoftBooked, true);
        assert.equal(createAssignmentWithDeepInsert.data._monthlyAssignmentDistribution[0].calendarMonth, "202108");
        assert.equal(createAssignmentWithDeepInsert.data._monthlyAssignmentDistribution[1].calendarMonth, "202109");

        //Deep update + status update to hard booked
        const updatePayload = {
            "isSoftBooked": false,
            "_monthlyAssignmentDistribution": [
                {
                    "calendarMonth": "202109",
                    "bookedCapacity": 60
                },
                {
                    "calendarMonth": "202110",
                    "bookedCapacity": 30
                }
            ]
        }

        const hardbookAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`, updatePayload);

        assert.equal(hardbookAssignment.status, 200);
        // The booking status should've changed to hardbooked
        assert.equal(hardbookAssignment.data.isSoftBooked, false);
        assert.equal(hardbookAssignment.data.startDate, "2021-08-03");
        assert.equal(hardbookAssignment.data.endDate, "2021-10-31");
        // Staffed hours should have been updated
        assert.equal(hardbookAssignment.data.bookedCapacity, 120);

        //Update the assignment to softbooking again
        const updatePayload2 = {
            "isSoftBooked": true
        }

        const softbookAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`, updatePayload2);
        //This should not be allowed.
        assert.equal(softbookAssignment.status, 400);

        //Finally simply just delete the assignment
        const deleteAssignment = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/Assignments(${createAssignmentWithDeepInsert.data.ID})`);
        assert.equal(deleteAssignment.status, 204);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Daily distribution record can be successfully created, updated and deleted'() {

        // Read an assignment before making any changes so as to verify the test results post modification
        const readAssignmentBefore = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_dailyAssignmentDistribution`);
        assert.equal(readAssignmentBefore.status, 200);
        assert.equal(readAssignmentBefore.data.ID, AssignmentAPICUDTest.assignment[0].ID);

        // Creating a new assignment distribution record one day after the existing assignment end date (30.12.2021)
        const dailyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "date": "2021-12-31",
            "bookedCapacity": 8
        };
        const createDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/DailyAssignmentDistribution`, dailyAssignmentDistributionCreatePayload);
        assert.equal(createDailyDistrbutionRecord.status, 201);

        // Check that duplicate inserts are caught
        const dailyAssignmentDistributionCreateDuplicatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "date": "2021-12-31",
            "bookedCapacity": 8
        };

        const dontCreateDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/DailyAssignmentDistribution`, dailyAssignmentDistributionCreateDuplicatePayload);
        assert.equal(dontCreateDailyDistrbutionRecord.status, 400);

        // Check that the newly created record was correctly returned in response
        assert.equal(createDailyDistrbutionRecord.data.assignmentID, dailyAssignmentDistributionCreatePayload.assignmentID);
        assert.equal(createDailyDistrbutionRecord.data.date, dailyAssignmentDistributionCreatePayload.date);
        assert.equal(createDailyDistrbutionRecord.data.bookedCapacity, dailyAssignmentDistributionCreatePayload.bookedCapacity);

        let splitDate = dailyAssignmentDistributionCreatePayload.date.split('-');
        assert.equal(createDailyDistrbutionRecord.data.calendarWeek, '202152');
        assert.equal(createDailyDistrbutionRecord.data.calendarMonth, splitDate[0] + splitDate[1]);
        assert.equal(createDailyDistrbutionRecord.data.calendarYear, splitDate[0]);

        // Check that the header dates and booked capacity were updated correctly after creation of additional daily record
        let readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_dailyAssignmentDistribution`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity + dailyAssignmentDistributionCreatePayload.bookedCapacity);
        assert.equal(readAssignmentAfter.data.endDate, dailyAssignmentDistributionCreatePayload.date);

        // Update the number of hours for the record created above
        const dailyAssignmentDistributionUpdatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "bookedCapacity": 4
        };
        const updateDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/DailyAssignmentDistribution(${createDailyDistrbutionRecord.data.ID})`, dailyAssignmentDistributionUpdatePayload);
        assert.equal(updateDailyDistrbutionRecord.status, 200);

        assert.equal(updateDailyDistrbutionRecord.data.assignmentID, dailyAssignmentDistributionUpdatePayload.assignmentID);
        assert.equal(updateDailyDistrbutionRecord.data.date, dailyAssignmentDistributionCreatePayload.date);
        assert.equal(updateDailyDistrbutionRecord.data.bookedCapacity, dailyAssignmentDistributionUpdatePayload.bookedCapacity);

        // Check that the header booked capacity is updated correctly after update of daily record
        readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_dailyAssignmentDistribution`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity + dailyAssignmentDistributionUpdatePayload.bookedCapacity);
        assert.equal(readAssignmentAfter.data.endDate, dailyAssignmentDistributionCreatePayload.date);

        // Delete the daily record created above
        const deleteDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/DailyAssignmentDistribution(${createDailyDistrbutionRecord.data.ID})`);
        assert.equal(deleteDailyDistrbutionRecord.status, 204);

        // Check that the header dates and booked capacity were updated correctly after deletion of daily record
        readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_dailyAssignmentDistribution`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity);
        assert.equal(readAssignmentAfter.data.endDate, "2021-12-30");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Weekly distribution record can be successfully created, updated and deleted'() {

        // Read an assignment before making any changes so as to verify the test results post modification
        const readAssignmentBefore = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_weeklyAssignmentDistribution`);
        assert.equal(readAssignmentBefore.status, 200);
        assert.equal(readAssignmentBefore.data.ID, AssignmentAPICUDTest.assignment[0].ID);

        // Creating a new assignment distribution record one day after the existing assignment end date (30.12.2021)
        const weeklyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarWeek": "202144",
            "bookedCapacity": 60
        };
        const createWeeklyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/WeeklyAssignmentDistribution`, weeklyAssignmentDistributionCreatePayload);
        assert.equal(createWeeklyDistrbutionRecord.status, 201);

        // Check that the newly created record was correctly returned in response
        assert.equal(createWeeklyDistrbutionRecord.data.assignmentID, weeklyAssignmentDistributionCreatePayload.assignmentID);
        assert.equal(createWeeklyDistrbutionRecord.data.calendarWeek, weeklyAssignmentDistributionCreatePayload.calendarWeek);
        assert.equal(createWeeklyDistrbutionRecord.data.bookedCapacity, weeklyAssignmentDistributionCreatePayload.bookedCapacity);
        assert.equal(createWeeklyDistrbutionRecord.data.weekStartDate, '2021-11-01');
        assert.equal(createWeeklyDistrbutionRecord.data.weekEndDate, '2021-11-07');

        // Check that the header dates and booked capacity were updated correctly after creation of additional weekly record
        let readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity + weeklyAssignmentDistributionCreatePayload.bookedCapacity);

        // Update the number of hours for the record created above
        const weeklyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 120
        };
        const updateDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzWeeklyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarWeek=\'202144\')`, weeklyAssignmentDistributionUpdatePayload);
        assert.equal(updateDailyDistrbutionRecord.status, 200);

        assert.equal(updateDailyDistrbutionRecord.data.assignmentID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(updateDailyDistrbutionRecord.data.calendarWeek, weeklyAssignmentDistributionCreatePayload.calendarWeek);
        assert.equal(updateDailyDistrbutionRecord.data.bookedCapacity, weeklyAssignmentDistributionUpdatePayload.bookedCapacity);

        // Check that the header booked capacity is updated correctly after update of daily record
        readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_dailyAssignmentDistribution`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity + weeklyAssignmentDistributionUpdatePayload.bookedCapacity);

        // Delete the weekly record created above
        const deleteWeeklyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete('/plzWeeklyAssignmentDistribution(assignmentID=' + AssignmentAPICUDTest.assignment[0].ID + ',calendarWeek=\'202144\')');
        assert.equal(deleteWeeklyDistrbutionRecord.status, 204);

        // Check that the header dates and booked capacity were updated correctly after deletion of daily record
        readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_dailyAssignmentDistribution`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Monthly distribution record can be successfully created, updated and deleted'() {

        // Read an assignment before making any changes so as to verify the test results post modification
        const readAssignmentBefore = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})?$expand=_monthlyAssignmentDistribution`);
        assert.equal(readAssignmentBefore.status, 200);
        assert.equal(readAssignmentBefore.data.ID, AssignmentAPICUDTest.assignment[0].ID);

        // Creating a new assignment distribution record one day after the existing assignment end date (30.12.2021)
        const monthlyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarMonth": "202111",
            "bookedCapacity": 60
        };
        const createMonthlyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/MonthlyAssignmentDistribution`, monthlyAssignmentDistributionCreatePayload);
        assert.equal(createMonthlyDistrbutionRecord.status, 201);

        // Check that the newly created record was correctly returned in response
        assert.equal(createMonthlyDistrbutionRecord.data.assignmentID, monthlyAssignmentDistributionCreatePayload.assignmentID);
        assert.equal(createMonthlyDistrbutionRecord.data.calendarMonth, monthlyAssignmentDistributionCreatePayload.calendarMonth);
        assert.equal(createMonthlyDistrbutionRecord.data.bookedCapacity, monthlyAssignmentDistributionCreatePayload.bookedCapacity);
        assert.equal(createMonthlyDistrbutionRecord.data.monthStartDate, '2021-11-01');
        assert.equal(createMonthlyDistrbutionRecord.data.monthEndDate, '2021-11-30');

        // Check that the header dates and booked capacity were updated correctly after creation of additional monthly record
        let readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity + monthlyAssignmentDistributionCreatePayload.bookedCapacity);

        // Update the number of hours for the record created above
        const monthlyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 120
        };
        const updateDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzMonthlyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarMonth=\'202111\')`, monthlyAssignmentDistributionUpdatePayload);
        assert.equal(updateDailyDistrbutionRecord.status, 200);

        assert.equal(updateDailyDistrbutionRecord.data.assignmentID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(updateDailyDistrbutionRecord.data.calendarMonth, monthlyAssignmentDistributionCreatePayload.calendarMonth);
        assert.equal(updateDailyDistrbutionRecord.data.bookedCapacity, monthlyAssignmentDistributionUpdatePayload.bookedCapacity);

        // Check that the header booked capacity is updated correctly after update of daily record
        readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity + monthlyAssignmentDistributionUpdatePayload.bookedCapacity);

        // Delete the monthly record created above
        const deleteMonthlyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete('/plzMonthlyAssignmentDistribution(assignmentID=' + AssignmentAPICUDTest.assignment[0].ID + ',calendarMonth=\'202111\')');
        assert.equal(deleteMonthlyDistrbutionRecord.status, 204);

        // Check that the header dates and booked capacity were updated correctly after deletion of daily record
        readAssignmentAfter = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/Assignments(ID=${AssignmentAPICUDTest.assignment[0].ID})`);
        assert.equal(readAssignmentAfter.status, 200);
        assert.equal(readAssignmentAfter.data.ID, AssignmentAPICUDTest.assignment[0].ID);
        assert.equal(readAssignmentAfter.data.bookedCapacity, readAssignmentBefore.data.bookedCapacity);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Daily distribution update returns error if record does not exists'() {

        const randomUUID = uuid();

        // Update the number of hours for the record that does not exist
        const dailyAssignmentDistributionUpdatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "bookedCapacity": 4
        };
        const updateDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/DailyAssignmentDistribution(${randomUUID})`, dailyAssignmentDistributionUpdatePayload);
        assert.equal(updateDailyDistrbutionRecord.status, 400);
        assert.exists(updateDailyDistrbutionRecord.data.error.message);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Weekly distribution update returns error if record does not exists'() {

        // Update the number of hours for the week that does not exist
        const weeklyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 60
        };
        const updateDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzWeeklyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarWeek=\'202145\')`, weeklyAssignmentDistributionUpdatePayload);
        assert.equal(updateDistrbutionRecord.status, 400);
        assert.exists(updateDistrbutionRecord.data.error.message);
        assert.notEqual(updateDistrbutionRecord.data.error.message.search("not found for calendar week"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Monthly distribution update returns error if record does not exists'() {

        // Update the number of hours for the month that does not exist
        const monthlyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 60
        };
        const updateDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzMonthlyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarMonth=\'202109\')`, monthlyAssignmentDistributionUpdatePayload);
        assert.equal(updateDistrbutionRecord.status, 400);
        assert.exists(updateDistrbutionRecord.data.error.message);
        assert.notEqual(updateDistrbutionRecord.data.error.message.search("not found for calendar month"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Daily distribution create returns error if record already exists'() {

        let dailyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "date": "2021-12-30",
            "bookedCapacity": 8
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/DailyAssignmentDistribution`, dailyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("A daily assignment distribution record already exists for the given date"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Weekly distribution create returns error if record already exists'() {

        let weeklyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarWeek": "202142",
            "bookedCapacity": 60
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/WeeklyAssignmentDistribution`, weeklyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("already exists for calendar week"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Monthly distribution create returns error if record already exists'() {

        let monthlyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarMonth": "202110",
            "bookedCapacity": 60
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/MonthlyAssignmentDistribution`, monthlyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("already exists for calendar month"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Daily distribution cannot be created with 0 staffed hours'() {

        // Try creating a distribution record with 0 staffed hours
        let dailyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "date": "2021-12-31",
            "bookedCapacity": 0
        };
        let createDailyDistrbutionRecord = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/DailyAssignmentDistribution`, dailyAssignmentDistributionCreatePayload);
        assert.equal(createDailyDistrbutionRecord.status, 400);
        assert.exists(createDailyDistrbutionRecord.data.error.message);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Weekly distribution cannot be created with 0 staffed hours'() {

        // Try creating a distribution record with 0 staffed hours
        let weeklyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarWeek": "202144",
            "bookedCapacity": 0
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/WeeklyAssignmentDistribution`, weeklyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("Please enter a duration that is greater than 0"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Monthly distribution cannot be created with 0 staffed hours'() {

        // Try creating a distribution record with 0 staffed hours
        let monthlyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarMonth": "202111",
            "bookedCapacity": 0
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/MonthlyAssignmentDistribution`, monthlyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("Please enter a duration that is greater than 0"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Daily distribution cannot be updated with 0 staffed hours'() {

        // Read an existing bucket to be used later for testing 
        const readAssignmentBucketResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/DailyAssignmentDistribution?$filter=assignmentID eq ${AssignmentAPICUDTest.assignment[0].ID} and date eq 2021-12-30`);
        assert.equal(readAssignmentBucketResponse.status, 200);

        // Try updating an existing distribution record for an assignment with 0 staffed hours
        const dailyAssignmentDistributionUpdatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "bookedCapacity": 0
        };
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/DailyAssignmentDistribution(${readAssignmentBucketResponse.data.value[0].ID})`, dailyAssignmentDistributionUpdatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("Please enter a duration that is greater than 0"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Weekly distribution cannot be updated with 0 staffed hours'() {

        // Try updating an existing distribution record for an assignment with 0 staffed hours
        const weeklyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 0
        };
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzWeeklyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarWeek=\'202142\')`, weeklyAssignmentDistributionUpdatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("Please enter a duration that is greater than 0"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Monthly distribution cannot be updated with 0 staffed hours'() {

        // Try updating an existing distribution record for an assignment with 0 staffed hours
        const monthlyAssignmentDistributionUpdatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "bookedCapacity": 0
        };
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzMonthlyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarMonth=\'202110\')`, monthlyAssignmentDistributionUpdatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("Please enter a duration that is greater than 0"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on create daily distribution returns an error in response'() {

        // The request of assignment[1] is closed
        let dailyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[1].ID,
            "date": "2021-12-31",
            "bookedCapacity": 8
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/DailyAssignmentDistribution`, dailyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on create weekly distribution returns an error in response'() {

        // The request of assignment[1] is closed
        let weeklyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[1].ID,
            "calendarWeek": "202144",
            "bookedCapacity": 60
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/WeeklyAssignmentDistribution`, weeklyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on create monthly distribution returns an error in response'() {

        // The request of assignment[1] is closed
        let monthlyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[1].ID,
            "calendarMonth": "202111",
            "bookedCapacity": 60
        };
        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/MonthlyAssignmentDistribution`, monthlyAssignmentDistributionCreatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on update daily distribution returns an error in response'() {

        const readAssignmentBucketResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/DailyAssignmentDistribution?$filter=assignmentID eq ${AssignmentAPICUDTest.assignment[1].ID} and date eq 2021-12-30`);
        assert.equal(readAssignmentBucketResponse.status, 200);

        // The request of assignment[1] is closed
        const dailyAssignmentDistributionUpdatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[1].ID,
            "bookedCapacity": 4
        };
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/DailyAssignmentDistribution(${readAssignmentBucketResponse.data.value[0].ID})`, dailyAssignmentDistributionUpdatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on update weekly distribution returns an error in response'() {

        // The request of assignment[1] is closed
        const weeklyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 60
        };
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzWeeklyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[1].ID},calendarWeek=\'202142\')`, weeklyAssignmentDistributionUpdatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on update monthly distribution returns an error in response'() {

        // The request of assignment[1] is closed
        const monthlyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 60
        };
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzMonthlyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[1].ID},calendarMonth=\'202110\')`, monthlyAssignmentDistributionUpdatePayload);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on delete daily distribution returns an error in response'() {

        const readAssignmentBucketResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/DailyAssignmentDistribution?$filter=assignmentID eq ${AssignmentAPICUDTest.assignment[1].ID} and date eq 2021-12-30`);
        assert.equal(readAssignmentBucketResponse.status, 200);

        let response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/DailyAssignmentDistribution(${readAssignmentBucketResponse.data.value[0].ID})`);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on delete weekly distribution returns an error in response'() {

        // The request of assignment[1] is closed
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/plzWeeklyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[1].ID},calendarWeek=\'202142\')`);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Failed business validation on delete monthly distribution returns an error in response'() {

        // The request of assignment[1] is closed
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/plzMonthlyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[1].ID},calendarMonth=\'202110\')`);
        assert.equal(response.status, 400);
        assert.exists(response.data.error.message);
        assert.notEqual(response.data.error.message.search("has already been closed. Changes to the assignment are no longer possible"), -1, "Different error message than expected");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on daily distribution CUD if assignment is locked by another user'() {

        const payload = {
            action: 1
        }
        // Let a different user lock the assignment first
        await AssignmentAPICUDTest.capacityServiceClientUserForLockChecks.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + AssignmentAPICUDTest.assignment[0].ID + ')', payload);

        // Try creating a new distribution record for an assignment locked by another user above
        const dailyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "date": "2021-12-31",
            "bookedCapacity": 8
        };
        const createDailyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/DailyAssignmentDistribution`, dailyAssignmentDistributionCreatePayload);

        assert.equal(createDailyDistrbutionRecordResponse.status, 400);
        assert.notEqual(createDailyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

        // Read an existing bucket to be used later for testing update and delete scenario
        const readAssignmentBucketResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.get(`/DailyAssignmentDistribution?$filter=assignmentID eq ${AssignmentAPICUDTest.assignment[0].ID} and date eq 2021-12-30`);
        assert.equal(readAssignmentBucketResponse.status, 200);

        // Try updating an existing distribution record for an assignment locked by another user
        const dailyAssignmentDistributionUpdatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "bookedCapacity": 4
        };
        const updateDailyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/DailyAssignmentDistribution(${readAssignmentBucketResponse.data.value[0].ID})`, dailyAssignmentDistributionUpdatePayload);
        assert.equal(updateDailyDistrbutionRecordResponse.status, 400);
        assert.notEqual(updateDailyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

        // Try deleting an existing distribution record for an assignment locked by another user
        const deleteDailyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/DailyAssignmentDistribution(${readAssignmentBucketResponse.data.value[0].ID})`);
        assert.equal(deleteDailyDistrbutionRecordResponse.status, 400);
        assert.notEqual(deleteDailyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on weekly distribution CUD if assignment is locked by another user'() {

        const payload = {
            action: 1
        }
        // Let a different user lock the assignment first
        await AssignmentAPICUDTest.capacityServiceClientUserForLockChecks.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + AssignmentAPICUDTest.assignment[0].ID + ')', payload);

        // Try creating a new distribution record for an assignment locked by another user above
        const weeklyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarWeek": "202144",
            "bookedCapacity": 60
        };
        const createWeeklyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/WeeklyAssignmentDistribution`, weeklyAssignmentDistributionCreatePayload);

        assert.equal(createWeeklyDistrbutionRecordResponse.status, 400);
        assert.notEqual(createWeeklyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

        // Try updating an existing distribution record for an assignment locked by another user
        const weeklyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 120
        };
        const updateWeeklyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzWeeklyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarWeek=\'202142\')`, weeklyAssignmentDistributionUpdatePayload);
        assert.equal(updateWeeklyDistrbutionRecordResponse.status, 400);
        assert.notEqual(updateWeeklyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

        // Try deleting an existing distribution record for an assignment locked by another user
        const deleteWeeklyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/plzWeeklyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarWeek=\'202142\')`);
        assert.equal(deleteWeeklyDistrbutionRecordResponse.status, 400);
        assert.notEqual(deleteWeeklyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on monthly distribution CUD if assignment is locked by another user'() {

        const payload = {
            action: 1
        }
        // Let a different user lock the assignment first
        await AssignmentAPICUDTest.capacityServiceClientUserForLockChecks.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + AssignmentAPICUDTest.assignment[0].ID + ')', payload);

        // Try creating a new distribution record for an assignment locked by another user above
        const monthlyAssignmentDistributionCreatePayload = {
            "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
            "calendarMonth": "202111",
            "bookedCapacity": 60
        };
        const createMonthlyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.post(`/MonthlyAssignmentDistribution`, monthlyAssignmentDistributionCreatePayload);
        assert.equal(createMonthlyDistrbutionRecordResponse.status, 400);
        assert.notEqual(createMonthlyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

        // Try updating an existing distribution record for an assignment locked by another user
        const monthlyAssignmentDistributionUpdatePayload = {
            "bookedCapacity": 120
        };
        const updateMonthlyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/plzMonthlyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarMonth=\'202110\')`, monthlyAssignmentDistributionUpdatePayload);
        assert.equal(updateMonthlyDistrbutionRecordResponse.status, 400);
        assert.notEqual(updateMonthlyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

        // Try deleting an existing distribution record for an assignment locked by another user
        const deleteMonthlyDistrbutionRecordResponse = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/plzMonthlyAssignmentDistribution(assignmentID=${AssignmentAPICUDTest.assignment[0].ID},calendarMonth=\'202110\')`);
        assert.equal(deleteMonthlyDistrbutionRecordResponse.status, 400);
        assert.notEqual(deleteMonthlyDistrbutionRecordResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on deep update with daily distribution if assignment is locked by another user'() {

        const payload = {
            action: 1
        }
        // Let a different user lock the assignment first
        await AssignmentAPICUDTest.capacityServiceClientUserForLockChecks.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + AssignmentAPICUDTest.assignment[0].ID + ')', payload);

        const updatePayload = {
            "_dailyAssignmentDistribution": [
                {
                    "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
                    "date": '2021-08-03',
                    "bookedCapacity": 3.00
                },
                {
                    "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
                    "date": '2021-08-05',
                    "bookedCapacity": 4.00
                }
            ]
        }

        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${AssignmentAPICUDTest.assignment[0].ID})`, updatePayload);

        assert.equal(response.status, 400);
        assert.notEqual(response.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on deep update with weekly distribution if assignment is locked by another user'() {

        const payload = {
            action: 1
        }
        // Let a different user lock the assignment first
        await AssignmentAPICUDTest.capacityServiceClientUserForLockChecks.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + AssignmentAPICUDTest.assignment[0].ID + ')', payload);

        const updatePayload = {
            "_weeklyAssignmentDistribution": [
                {
                    "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
                    "calendarWeek": '202143',
                    "bookedCapacity": 3.00
                },
                {
                    "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
                    "calendarWeek": '202144',
                    "bookedCapacity": 4.00
                }
            ]
        }

        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${AssignmentAPICUDTest.assignment[0].ID})`, updatePayload);

        assert.equal(response.status, 400);
        assert.notEqual(response.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on deep update with monthly distribution if assignment is locked by another user'() {

        const payload = {
            action: 1
        }
        // Let a different user lock the assignment first
        await AssignmentAPICUDTest.capacityServiceClientUserForLockChecks.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + AssignmentAPICUDTest.assignment[0].ID + ')', payload);

        const updatePayload = {
            "_monthlyAssignmentDistribution": [
                {
                    "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
                    "calendarMonth": '202110',
                    "bookedCapacity": 3.00
                },
                {
                    "assignmentID": AssignmentAPICUDTest.assignment[0].ID,
                    "calendarMonth": '202111',
                    "bookedCapacity": 4.00
                }
            ]
        }

        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.patch(`/Assignments(${AssignmentAPICUDTest.assignment[0].ID})`, updatePayload);

        assert.equal(response.status, 400);
        assert.notEqual(response.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on assignment delete if it is locked by another user'() {

        const payload = {
            action: 1
        }
        // Let a different user lock the assignment first
        await AssignmentAPICUDTest.capacityServiceClientUserForLockChecks.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + AssignmentAPICUDTest.assignment[0].ID + ')', payload);

        // Try to delete the assignment with another user
        const response = await AssignmentAPICUDTest.AssignmentPublicAPIClient.delete(`/Assignments(${AssignmentAPICUDTest.assignment[0].ID})`);
        assert.equal(response.status, 400);
        assert.notEqual(response.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        for (let i = 0; i < AssignmentAPICUDTest.assignment.length; i++) {
            const assignment = AssignmentAPICUDTest.assignment[i];

            if (i === AssignmentAPICUDTest.assignment.length - 1)
                AssignmentAPICUDTest.assignmentIDs = `${AssignmentAPICUDTest.assignmentIDs}'${assignment.ID}')`;
            else
                AssignmentAPICUDTest.assignmentIDs = `${AssignmentAPICUDTest.assignmentIDs}'${assignment.ID}',`;

        }

        let sqlStatementString = AssignmentAPICUDTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${AssignmentAPICUDTest.assignmentIDs}`);
        await AssignmentAPICUDTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = AssignmentAPICUDTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${AssignmentAPICUDTest.assignmentIDs}`);
        await AssignmentAPICUDTest.assignmentRepository.statementExecutor.execute(sqlStatementString);

        await AssignmentAPICUDTest.resourceHeaderRepository.deleteMany(AssignmentAPICUDTest.resourceHeader);
        await AssignmentAPICUDTest.resourceCapacityRepository.deleteMany(AssignmentAPICUDTest.resourceCapacity);
        await AssignmentAPICUDTest.resourceSupplyRepository.deleteMany(AssignmentAPICUDTest.resourceSupply);

        await AssignmentAPICUDTest.assignmentRepository.deleteMany(AssignmentAPICUDTest.assignment);
        await AssignmentAPICUDTest.assignmentBucketRepository.deleteMany(AssignmentAPICUDTest.assignmentBuckets);

        await AssignmentAPICUDTest.employeeHeaderRepository.deleteMany(AssignmentAPICUDTest.employeeHeader);
        await AssignmentAPICUDTest.workAssignmentRepository.deleteMany(AssignmentAPICUDTest.workAssignment);

        await AssignmentAPICUDTest.workforcePersonRepository.deleteMany(AssignmentAPICUDTest.workforcePerson);
        await AssignmentAPICUDTest.organizationHeaderRepository.deleteMany(AssignmentAPICUDTest.organizationHeader);

        await AssignmentAPICUDTest.organizationDetailRepository.deleteMany(AssignmentAPICUDTest.organizationDetail);
        await AssignmentAPICUDTest.jobDetailRepository.deleteMany(AssignmentAPICUDTest.jobDetail);

        await AssignmentAPICUDTest.emailRepository.deleteMany(AssignmentAPICUDTest.email);
        await AssignmentAPICUDTest.phoneRepository.deleteMany(AssignmentAPICUDTest.phone);
        await AssignmentAPICUDTest.workPlaceAddressRepository.deleteMany(AssignmentAPICUDTest.workPlaceAddress);
        await AssignmentAPICUDTest.profileDetailsRepository.deleteMany(AssignmentAPICUDTest.profileDetail);
        await AssignmentAPICUDTest.costCenterRepository.deleteMany(AssignmentAPICUDTest.costCenter);

        await AssignmentAPICUDTest.resourceRequestRepository.deleteMany(AssignmentAPICUDTest.resourceRequests);
        await AssignmentAPICUDTest.demandRepository.deleteMany(AssignmentAPICUDTest.demand);
        await AssignmentAPICUDTest.workPackageRepository.deleteMany(AssignmentAPICUDTest.workPackage);

        await AssignmentAPICUDTest.resourceOrganizationsRepository.deleteMany(AssignmentAPICUDTest.resourceOrganizations);
        await AssignmentAPICUDTest.resourceOrganizationItemsRepository.deleteMany(AssignmentAPICUDTest.resourceOrganizationItems);
        await AssignmentAPICUDTest.resourceTypesRepository.deleteMany(AssignmentAPICUDTest.resourceTypes);
    }
}
