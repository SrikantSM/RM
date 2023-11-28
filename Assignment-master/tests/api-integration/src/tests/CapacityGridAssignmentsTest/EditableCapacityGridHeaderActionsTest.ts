import { AxiosInstance } from 'axios';

import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment, Uniquifier } from '../../utils';

import {
    EmployeeHeader, ResourceHeaderRepository, ResourceCapacityRepository, ResourceHeader, ResourceCapacity,
    Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, WorkAssignment, EmployeeHeaderRepository,
    WorkAssignmentRepository, WorkforcePerson, WorkforcePersonRepository,
    Email, EmailRepository, Phone, PhoneRepository, WorkPlaceAddress, WorkPlaceAddressRepository, ProfileDetail, ProfileDetailRepository,
    OrganizationDetail, OrganizationDetailRepository, OrganizationHeader, OrganizationHeaderRepository,
    JobDetail, JobDetailRepository,
    CostCenterRepository, CostCenter, ResourceRequestRepository, ResourceRequest, DemandRepository, Demand, WorkPackage, WorkPackageRepository,
    ResourceSupply, ResourceSupplyRepository, ResourceOrganizationItems, ResourceOrganizationItemsRepository, ResourceOrganizations, ResourceOrganizationsRepository
} from 'test-commons';

@suite
export class EditableCapacityGridHeaderActionsTest {
    private static capacityServiceClientForTestUser01: AxiosInstance;
    private static capacityServiceClientForTestUser02: AxiosInstance;
    private static asgnSrvClientResourceManager: AxiosInstance;

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

    private static resourceOrganizationsRepository: ResourceOrganizationsRepository;
    private static resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
    private static resourceOrganizations: ResourceOrganizations[];
    private static resourceOrganizationItems: ResourceOrganizationItems[];

    private static assignmentIDs: string = "(";

    @timeout(TEST_TIMEOUT)
    static async before() {

        EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01 = await testEnvironment.getResourceManagerCapacityServiceClient();
        EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser02 = await testEnvironment.getAuthAttrTestUser02CapacityServiceClient();

        EditableCapacityGridHeaderActionsTest.asgnSrvClientResourceManager = await testEnvironment.getResourceManagerServiceClient();

        EditableCapacityGridHeaderActionsTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
        EditableCapacityGridHeaderActionsTest.assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        EditableCapacityGridHeaderActionsTest.resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
        EditableCapacityGridHeaderActionsTest.resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        EditableCapacityGridHeaderActionsTest.resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        EditableCapacityGridHeaderActionsTest.employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        EditableCapacityGridHeaderActionsTest.workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
        EditableCapacityGridHeaderActionsTest.workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        EditableCapacityGridHeaderActionsTest.organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        EditableCapacityGridHeaderActionsTest.organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        EditableCapacityGridHeaderActionsTest.jobDetailRepository = await testEnvironment.getJobDetailRepository();

        EditableCapacityGridHeaderActionsTest.emailRepository = await testEnvironment.getEmailRepository();
        EditableCapacityGridHeaderActionsTest.phoneRepository = await testEnvironment.getPhoneRepository();
        EditableCapacityGridHeaderActionsTest.workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
        EditableCapacityGridHeaderActionsTest.profileDetailsRepository = await testEnvironment.getProfileDetailRepository();
        EditableCapacityGridHeaderActionsTest.costCenterRepository = await testEnvironment.getCostCenterRepository();

        EditableCapacityGridHeaderActionsTest.resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        EditableCapacityGridHeaderActionsTest.demandRepository = await testEnvironment.getDemandRepository();
        EditableCapacityGridHeaderActionsTest.workPackageRepository = await testEnvironment.getWorkPackageRepository();

        EditableCapacityGridHeaderActionsTest.resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
        EditableCapacityGridHeaderActionsTest.resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();

        EditableCapacityGridHeaderActionsTest.uniquifier = new Uniquifier();
        EditableCapacityGridHeaderActionsTest.resourceHeader = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.resource-Headers.csv', 'ResourceHeader');
        EditableCapacityGridHeaderActionsTest.resourceCapacity = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.resource-Capacity.csv', 'ResourceCapacity');
        EditableCapacityGridHeaderActionsTest.assignment = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.assignment.Assignments.csv', 'Assignments');
        EditableCapacityGridHeaderActionsTest.assignmentBuckets = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.assignment.AssignmentBuckets.csv', 'AssignmentBucket');
        EditableCapacityGridHeaderActionsTest.resourceSupply = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/changeAssignment/com.sap.resourceManagement.supply.resourcesupply.csv', 'ResourceSupply');

        EditableCapacityGridHeaderActionsTest.employeeHeader = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.employee-Headers.csv', 'EmployeeHeader');
        EditableCapacityGridHeaderActionsTest.workAssignment = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.workforce.workAssignment-WorkAssignments.csv', 'WorkAssignment');
        EditableCapacityGridHeaderActionsTest.workforcePerson = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.workforce.workforcePerson-WorkforcePersons.csv', 'WorkforcePerson');
        EditableCapacityGridHeaderActionsTest.organizationHeader = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.organization-Headers.csv', 'OrganizationHeader');

        EditableCapacityGridHeaderActionsTest.organizationDetail = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.organization-Details.csv', 'OrganizationDetail');
        EditableCapacityGridHeaderActionsTest.jobDetail = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.workforce.workAssignment-JobDetails.csv', 'JobDetail');

        EditableCapacityGridHeaderActionsTest.email = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.workforce.workforcePerson-Emails.csv', 'Email');
        EditableCapacityGridHeaderActionsTest.phone = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.workforce.workforcePerson-Phones.csv', 'Phone');
        EditableCapacityGridHeaderActionsTest.workPlaceAddress = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.workforce.workAssignment-WorkPlaceAddresses.csv', 'WorkPlaceAddress');
        EditableCapacityGridHeaderActionsTest.profileDetail = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.workforce.workforcePerson-ProfileDetails.csv', 'ProfileDetail');
        EditableCapacityGridHeaderActionsTest.costCenter = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.organization-CostCenters.csv', 'CostCenter');

        EditableCapacityGridHeaderActionsTest.resourceRequests = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.resourceRequest.ResourceRequests.csv', 'ResourceRequest');
        EditableCapacityGridHeaderActionsTest.demand = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.project.demands.csv', 'Demand');
        EditableCapacityGridHeaderActionsTest.workPackage = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.project.workpackages.csv', 'WorkPackage');

        EditableCapacityGridHeaderActionsTest.resourceOrganizations = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.config-ResourceOrganizations.csv', 'ResourceOrganizations');
        EditableCapacityGridHeaderActionsTest.resourceOrganizationItems = await EditableCapacityGridHeaderActionsTest.uniquifier.getRecords('../data/input/editableCapacityGridHeaderActions/com.sap.resourceManagement.config-ResourceOrganizationItems.csv', 'ResourceOrganizationItems');

        await EditableCapacityGridHeaderActionsTest.resourceRequestRepository.insertMany(EditableCapacityGridHeaderActionsTest.resourceRequests);
        await EditableCapacityGridHeaderActionsTest.demandRepository.insertMany(EditableCapacityGridHeaderActionsTest.demand);
        await EditableCapacityGridHeaderActionsTest.workPackageRepository.insertMany(EditableCapacityGridHeaderActionsTest.workPackage);

        await EditableCapacityGridHeaderActionsTest.resourceHeaderRepository.insertMany(EditableCapacityGridHeaderActionsTest.resourceHeader);
        await EditableCapacityGridHeaderActionsTest.resourceCapacityRepository.insertMany(EditableCapacityGridHeaderActionsTest.resourceCapacity)
        await EditableCapacityGridHeaderActionsTest.assignmentRepository.insertMany(EditableCapacityGridHeaderActionsTest.assignment);
        await EditableCapacityGridHeaderActionsTest.assignmentBucketRepository.insertMany(EditableCapacityGridHeaderActionsTest.assignmentBuckets)
        await EditableCapacityGridHeaderActionsTest.resourceSupplyRepository.insertMany(EditableCapacityGridHeaderActionsTest.resourceSupply);
        await EditableCapacityGridHeaderActionsTest.employeeHeaderRepository.insertMany(EditableCapacityGridHeaderActionsTest.employeeHeader);
        await EditableCapacityGridHeaderActionsTest.workAssignmentRepository.insertMany(EditableCapacityGridHeaderActionsTest.workAssignment)
        await EditableCapacityGridHeaderActionsTest.workforcePersonRepository.insertMany(EditableCapacityGridHeaderActionsTest.workforcePerson);
        await EditableCapacityGridHeaderActionsTest.organizationHeaderRepository.insertMany(EditableCapacityGridHeaderActionsTest.organizationHeader)
        await EditableCapacityGridHeaderActionsTest.organizationDetailRepository.insertMany(EditableCapacityGridHeaderActionsTest.organizationDetail);
        await EditableCapacityGridHeaderActionsTest.jobDetailRepository.insertMany(EditableCapacityGridHeaderActionsTest.jobDetail)
        await EditableCapacityGridHeaderActionsTest.emailRepository.insertMany(EditableCapacityGridHeaderActionsTest.email);
        await EditableCapacityGridHeaderActionsTest.phoneRepository.insertMany(EditableCapacityGridHeaderActionsTest.phone);
        await EditableCapacityGridHeaderActionsTest.workPlaceAddressRepository.insertMany(EditableCapacityGridHeaderActionsTest.workPlaceAddress);
        await EditableCapacityGridHeaderActionsTest.profileDetailsRepository.insertMany(EditableCapacityGridHeaderActionsTest.profileDetail);
        await EditableCapacityGridHeaderActionsTest.costCenterRepository.insertMany(EditableCapacityGridHeaderActionsTest.costCenter);

        await EditableCapacityGridHeaderActionsTest.resourceOrganizationsRepository.insertMany(EditableCapacityGridHeaderActionsTest.resourceOrganizations);
        await EditableCapacityGridHeaderActionsTest.resourceOrganizationItemsRepository.insertMany(EditableCapacityGridHeaderActionsTest.resourceOrganizationItems);

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment status update from soft-booked to proposed leads to error'() {

        // EditableCapacityGridHeaderActionsTest.assignment[0] is originally soft booked
        let payloadForEdit = {
            assignmentStatusCode: 2,
            action: 1
        }
        const assignmentPatchResponse = await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payloadForEdit);

        assert.equal(assignmentPatchResponse.status, 400, "Assignment status change from soft-booked to proposed was successful!");
        // the error message text has changed. Will update here once UA review is done.
        // assert.equal(assignmentPatchResponse.data.error.message, 'Assignment status cannot be changed to proposed. The assignment is already booked.', "Did not get the expected error message from server");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment status can be successfully updated from soft-booked to hard-booked'() {

        // EditableCapacityGridHeaderActionsTest.assignment[0] is originally soft booked
        let payloadForEdit = {
            assignmentStatusCode: 0,
            action: 1
        }
        const assignmentPatchResponse = await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payloadForEdit);
        assert.equal(assignmentPatchResponse.status, 200, "Assignment draft create for status change from hard to soft booked leads to errors!");

        let payloadForSave = {
            action: 2
        }
        const assignmentSaveResponse = await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payloadForSave);
        assert.equal(assignmentSaveResponse.status, 200, "Assignment status change from soft to hard booked was unsuccessful! Status is not 200!");

        // Check that status was changed to hard booked in database after save
        const assignementDraftReadResponse = await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.get('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')');
        assert.equal(assignementDraftReadResponse.data.assignmentStatusCode, 0, "Assignment status did not get updated from soft booked to hard booked");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment status update from hard-booked to soft-booked leads to error'() {

        // EditableCapacityGridHeaderActionsTest.assignment[1] is originally hard booked
        let payload = {
            assignmentStatusCode: 1,
            action: 1
        }
        const assignmentPatchResponse = await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[1].ID + ')', payload);

        assert.equal(assignmentPatchResponse.status, 400, "Assignment status change from hard to soft booked was successful!");
        // the error message text has changed. Will update here once UA review is done.
        // assert.equal(assignmentPatchResponse.data.error.message, 'Assignment status cannot be changed from hard-booked to soft-booked', "Did not get the expected error message from server");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assignment status update from hard-booked to proposed leads to error'() {

        // EditableCapacityGridHeaderActionsTest.assignment[1] is originally hard booked
        let payload = {
            assignmentStatusCode: 2,
            action: 1
        }
        const assignmentPatchResponse = await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[1].ID + ')', payload);

        assert.equal(assignmentPatchResponse.status, 400, "Assignment status change from hard-booked to proposed was successful!");
        
        // the error message text has changed. Will update here once UA review is done.
        // assert.equal(assignmentPatchResponse.data.error.message, 'Assignment status cannot be changed to proposed. The assignment is already booked.', "Did not get the expected error message from server");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Lock error returned on concurrent/parallel edits by different users of same assignment'() {

        const payload1 = {
            action: 1
        }
        await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payload1);

        const payload2 = {
            action: 1
        }
        const assignmentPatchResponse = await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser02.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payload2);

        assert.notEqual(assignmentPatchResponse.data.error.message.search("Assignment cannot be edited as it is currently locked by user"), -1, "Locking issue detected. The second user was able to edit a (supposed to be locked) assignment");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Keep-alive action invocation extends draft expiry time'() {

        const payload = {
            action: 1
        }
        await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payload);

        let draftReadBeforeKeepAlive = await EditableCapacityGridHeaderActionsTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ',IsActiveEntity=false)');

        const payloadForKeepAlive = {
            action: 4
        }
        await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payloadForKeepAlive);

        let draftReadAfterKeepAlive = await EditableCapacityGridHeaderActionsTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ',IsActiveEntity=false)');

        assert.isTrue(draftReadAfterKeepAlive.data.modifiedAt > draftReadBeforeKeepAlive.data.modifiedAt, "Draft modifiedAt timestamp did not extend on keep alive invocation");

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Discard/Cancel draft action invocation deletes draft from the server'() {

        const payload = {
            action: 1
        }
        await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payload);

        let draftReadBeforeDiscard = await EditableCapacityGridHeaderActionsTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ',IsActiveEntity=false)');

        assert.equal(draftReadBeforeDiscard.data.ID, EditableCapacityGridHeaderActionsTest.assignment[0].ID, "Edit draft creation failed");

        const payloadForCancelDraft = {
            action: 3
        }
        await EditableCapacityGridHeaderActionsTest.capacityServiceClientForTestUser01.patch('AssignmentsDetailsForCapacityGrid(assignment_ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ')', payloadForCancelDraft);

        let draftReadAfterDiscardAction = await EditableCapacityGridHeaderActionsTest.asgnSrvClientResourceManager.get('/Assignments(ID=' + EditableCapacityGridHeaderActionsTest.assignment[0].ID + ',IsActiveEntity=false)');

        assert.notEqual(draftReadAfterDiscardAction.data.error.message.search("not found"), -1, "Draft not deleted on cancel/discard action");

    }

    @timeout(TEST_TIMEOUT)
    static async after() {

        for (let i = 0; i < EditableCapacityGridHeaderActionsTest.assignment.length; i++) {
            const assignment = EditableCapacityGridHeaderActionsTest.assignment[i];

            if (i === EditableCapacityGridHeaderActionsTest.assignment.length - 1)
                EditableCapacityGridHeaderActionsTest.assignmentIDs = `${EditableCapacityGridHeaderActionsTest.assignmentIDs}'${assignment.ID}')`;
            else
                EditableCapacityGridHeaderActionsTest.assignmentIDs = `${EditableCapacityGridHeaderActionsTest.assignmentIDs}'${assignment.ID}',`;

        }

        let sqlStatementString = EditableCapacityGridHeaderActionsTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTS_DRAFTS', `WHERE ID IN ${EditableCapacityGridHeaderActionsTest.assignmentIDs}`);
        await EditableCapacityGridHeaderActionsTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = EditableCapacityGridHeaderActionsTest.assignmentRepository.sqlGenerator.generateDeleteStatement('ASSIGNMENTSERVICE_ASSIGNMENTBUCKETS_DRAFTS', `WHERE ASSIGNMENT_ID IN ${EditableCapacityGridHeaderActionsTest.assignmentIDs}`);
        await EditableCapacityGridHeaderActionsTest.assignmentRepository.statementExecutor.execute(sqlStatementString);
        sqlStatementString = EditableCapacityGridHeaderActionsTest.assignmentBucketRepository.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', `WHERE ASSIGNMENT_ID IN ${EditableCapacityGridHeaderActionsTest.assignmentIDs}`);
        await EditableCapacityGridHeaderActionsTest.assignmentBucketRepository.statementExecutor.execute(sqlStatementString);

        await EditableCapacityGridHeaderActionsTest.resourceHeaderRepository.deleteMany(EditableCapacityGridHeaderActionsTest.resourceHeader);
        await EditableCapacityGridHeaderActionsTest.resourceCapacityRepository.deleteMany(EditableCapacityGridHeaderActionsTest.resourceCapacity);
        await EditableCapacityGridHeaderActionsTest.resourceSupplyRepository.deleteMany(EditableCapacityGridHeaderActionsTest.resourceSupply);

        await EditableCapacityGridHeaderActionsTest.assignmentRepository.deleteMany(EditableCapacityGridHeaderActionsTest.assignment);
        await EditableCapacityGridHeaderActionsTest.assignmentBucketRepository.deleteMany(EditableCapacityGridHeaderActionsTest.assignmentBuckets);

        await EditableCapacityGridHeaderActionsTest.employeeHeaderRepository.deleteMany(EditableCapacityGridHeaderActionsTest.employeeHeader);
        await EditableCapacityGridHeaderActionsTest.workAssignmentRepository.deleteMany(EditableCapacityGridHeaderActionsTest.workAssignment);

        await EditableCapacityGridHeaderActionsTest.workforcePersonRepository.deleteMany(EditableCapacityGridHeaderActionsTest.workforcePerson);
        await EditableCapacityGridHeaderActionsTest.organizationHeaderRepository.deleteMany(EditableCapacityGridHeaderActionsTest.organizationHeader);

        await EditableCapacityGridHeaderActionsTest.organizationDetailRepository.deleteMany(EditableCapacityGridHeaderActionsTest.organizationDetail);
        await EditableCapacityGridHeaderActionsTest.jobDetailRepository.deleteMany(EditableCapacityGridHeaderActionsTest.jobDetail);

        await EditableCapacityGridHeaderActionsTest.emailRepository.deleteMany(EditableCapacityGridHeaderActionsTest.email);
        await EditableCapacityGridHeaderActionsTest.phoneRepository.deleteMany(EditableCapacityGridHeaderActionsTest.phone);
        await EditableCapacityGridHeaderActionsTest.workPlaceAddressRepository.deleteMany(EditableCapacityGridHeaderActionsTest.workPlaceAddress);
        await EditableCapacityGridHeaderActionsTest.profileDetailsRepository.deleteMany(EditableCapacityGridHeaderActionsTest.profileDetail);
        await EditableCapacityGridHeaderActionsTest.costCenterRepository.deleteMany(EditableCapacityGridHeaderActionsTest.costCenter);

        await EditableCapacityGridHeaderActionsTest.resourceRequestRepository.deleteMany(EditableCapacityGridHeaderActionsTest.resourceRequests);
        await EditableCapacityGridHeaderActionsTest.demandRepository.deleteMany(EditableCapacityGridHeaderActionsTest.demand);
        await EditableCapacityGridHeaderActionsTest.workPackageRepository.deleteMany(EditableCapacityGridHeaderActionsTest.workPackage);

        await EditableCapacityGridHeaderActionsTest.resourceOrganizationsRepository.deleteMany(EditableCapacityGridHeaderActionsTest.resourceOrganizations);
        await EditableCapacityGridHeaderActionsTest.resourceOrganizationItemsRepository.deleteMany(EditableCapacityGridHeaderActionsTest.resourceOrganizationItems);
    }

}