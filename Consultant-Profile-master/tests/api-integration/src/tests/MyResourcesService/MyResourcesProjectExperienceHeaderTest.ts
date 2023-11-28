import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import {
    EmployeeHeader,
    Email,
    ProjectRole,
    Skill,
    WorkforcePerson,
    ResourceOrganizations,
    WorkAssignment,
    CostCenter,
    CostCenterAttribute,
} from 'test-commons';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allEmail,
    allEmployeeHeaders,
    employeeHeaderWithDescription4,
    employeeHeaderWithDescription2,
    allWorkforcePerson,
    email5,
    email2,
    email3,
    costCenter1,
    resourceOrganization1,
    workforcePersonWithDescription3,
    workforcePersonWithDescription2,
    workforcePersonManagerWithDescription,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allJobDetails,
    allCostCenters,
    allResourceCapacity,
    allResourceHeaders,
    allAssignmentBuckets,
    allAssignments,
    allBookedCapacityAggregates,
    workAssignment4,
    resourceCapacity61,
    resourceCapacity62,
    resourceCapacity63,
    resourceCapacity64,
    resourceCapacity65,
    resourceCapacity66,
    assignmentBucket31,
    assignmentBucket32,
    assignmentBucket33,
    assignmentBucket34,
    assignmentBucket35,
    assignmentBucket36,
    employeeHeaderWithDescription3,
    allResourceOrganizations,
    allResourceOrganizationItems,
    allCostCenterAttributes,
    costCenterAttribute1,
} from '../../data';
import { createDeleteMyProjectExperience } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { MyProjectExperienceHeader } from '../../serviceEntities/myProjectExperienceService/MyProjectExperienceHeader';
import { RoleMasterList } from '../../serviceEntities/myProjectExperienceService/RoleMasterList';
import { SkillMasterList } from '../../serviceEntities/myProjectExperienceService/SkillMasterList';
import { TestUtility } from '../../utils/TestUtility';

@suite('MyResourcesService/ProjectExperienceHeader')
export class MyResourcesProjectExperienceHeaderTest extends MyResourcesServiceRepository {
    public constructor() { super('ProjectExperienceHeader'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceHeaderRepository.insertMany(allResourceHeaders);
        await this.resourceCapacityRepository.insertMany(allResourceCapacity);
        await this.assignmentsRepository.insertMany(allAssignments);
        await this.assignmentBucketRepository.insertMany(allAssignmentBuckets);
        await this.bookedCapacityAggregateRepository.insertMany(allBookedCapacityAggregates);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
        await this.costCenterAttributeRepository.insertMany(allCostCenterAttributes);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceHeaderRepository.deleteMany(allResourceHeaders);
        await this.resourceCapacityRepository.deleteMany(allResourceCapacity);
        await this.assignmentsRepository.deleteMany(allAssignments);
        await this.assignmentBucketRepository.deleteMany(allAssignmentBuckets);
        await this.bookedCapacityAggregateRepository.deleteMany(allBookedCapacityAggregates);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
        await this.costCenterAttributeRepository.deleteMany(allCostCenterAttributes);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all project experience.'() {
        const response = await this.get();
        this.responses.push(response);
        const myProjectExperiences = response.data.value as MyProjectExperienceHeader[];
        const expectedMyProjectExperienceHeaders: MyProjectExperienceHeader[] = [];
        expectedMyProjectExperienceHeaders.push(this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription3));
        expectedMyProjectExperienceHeaders.push(this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription4));
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperiences, 'Expected employee list from cost center.');
        expect(myProjectExperiences).to.deep.include.any.members(expectedMyProjectExperienceHeaders);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all project experience without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all project experience with profile details, assigned skills, assigned roles.'() {
        const response = await this.get('?$expand=skills,roles,profile');
        this.responses.push(response);
        const myProjectExperiences = response.data.value as MyProjectExperienceHeader[];
        const expectedMyProjectExperienceHeaders: MyProjectExperienceHeader[] = [];
        expectedMyProjectExperienceHeaders.push(this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription4, {
            workforcePerson: workforcePersonWithDescription3, email: email5, managerWorkAssignment: workAssignment4, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        }, [], []));
        expectedMyProjectExperienceHeaders.push(this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription4, {
            workforcePerson: workforcePersonWithDescription2, email: email2, managerWorkAssignment: workAssignment4, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        }, [], []));
        expectedMyProjectExperienceHeaders.push(this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription4, {
            workforcePerson: workforcePersonManagerWithDescription, email: email3, managerWorkAssignment: workAssignment4, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        }, [], []));
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperiences, 'Expected an employee\'s project experience with profile details, assigned skills, assigned roles.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all project experience with profile details, assigned skills, assigned roles without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=skills,roles,profile');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one project experience.'() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=true)`);
        this.responses.push(response);

        const myProjectExperience = response.data;
        const expectedMyProjectExperienceHeader = this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription4);
        delete myProjectExperience['@context'];
        delete myProjectExperience['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperience, 'Expected only an employee.');
        expect(myProjectExperience).to.eql(expectedMyProjectExperienceHeader);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one project experience without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a project experience of a different cost center.'() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription2.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (NotFound).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one project experience with profile details, assigned skills, assigned roles.'() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=true)?$expand=skills,roles,profile`);
        this.responses.push(response);
        const myProjectExperiences = response.data;
        delete myProjectExperiences['@context'];
        delete myProjectExperiences['@metadataEtag'];
        const expectedMyProjectExperienceHeader = this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription4, {
            workforcePerson: workforcePersonWithDescription3, email: email5, managerWorkAssignment: workAssignment4, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        }, [], []);
        myProjectExperiences.profile.officeLocation = null;
        myProjectExperiences.profile.role = null;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperiences, 'Expected an employee\'s my project experience with profile details, assigned skills, assigned roles.');
        expect(myProjectExperiences).to.eql(expectedMyProjectExperienceHeader);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one project experience with profile details, assigned skills, assigned roles without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=true)?$expand=skills,roles,profile`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for availability chart data '() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=true)/periodicUtilization?$apply=groupby((CALMONTH,monthYear),aggregate(utilizationPercentage with max as maxUtilization))`);
        this.responses.push(response);
        const periodicUtilization = response.data.value;
        const expectedperiodicUtilization = TestUtility.preparePeriodicUtilizations([
            { resourceCapacity: resourceCapacity61, assignmentBucket: assignmentBucket31 },
            { resourceCapacity: resourceCapacity62, assignmentBucket: assignmentBucket32 },
            { resourceCapacity: resourceCapacity63, assignmentBucket: assignmentBucket33 },
            { resourceCapacity: resourceCapacity64, assignmentBucket: assignmentBucket34 },
            { resourceCapacity: resourceCapacity65, assignmentBucket: assignmentBucket35 },
            { resourceCapacity: resourceCapacity66, assignmentBucket: assignmentBucket36 },
        ], allEmployeeHeaders[3], true);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(expectedperiodicUtilization).to.eql(periodicUtilization);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating project experience should not be possible.'() {
        const response = await this.create(createDeleteMyProjectExperience);
        this.responses.push(response);
        assert.equal(response.status, 405, 'Creating a my project experience not possible and expected status code should be 405(Method not allowed).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a project experience should be possible.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        this.responses.push(await this.update(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=false)`, employeeHeaderWithDescription4));
        const response = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(response);
        const myProjectExperience = response.data as MyProjectExperienceHeader;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(myProjectExperience.ID, employeeHeaderWithDescription4.ID, 'Error in updating my project experience.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a my project experience without authorization.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription4.ID));
        const response = await this.updateWithoutAuthorization(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=false)`, employeeHeaderWithDescription4);
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(employeeHeaderWithDescription4.ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(employeeHeaderWithDescription4.ID));

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting project experience should not be possible.'() {
        const response = await this.delete(`(ID=${employeeHeaderWithDescription4.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 405, 'Deleting my project experience not possible and expected status code must be 405(Method not allowed).');
    }

    private prepareMyProjectExpeienceHeader(employeeHeader: EmployeeHeader, profile?: { workforcePerson: WorkforcePerson, email: Email, managerWorkAssignment: WorkAssignment, resourceOrganization: ResourceOrganizations, costCenter: CostCenter, costCenterAttribute: CostCenterAttribute }, roleAssignments?: ProjectRole[], skillAssignments?: Skill[]) {
        const preparedMyProjectExperienceHeader: MyProjectExperienceHeader = {
            ID: employeeHeader.ID,
            commaSeparatedSkills: '',
            commaSeparatedRoles: '',
            IsActiveEntity: true,
            HasActiveEntity: false,
            HasDraftEntity: false,
            createdAt: null!,
            createdBy: null!,
            modifiedAt: null!,
            modifiedBy: null!,
        };

        if (roleAssignments !== undefined) {
            const expectedRoles: RoleMasterList[] = [];
            roleAssignments.forEach((assignedRole) => {
                const expectedConsultantRole: RoleMasterList = {
                    ID: assignedRole.ID!,
                    code: assignedRole.code!,
                    name: assignedRole.name!,
                    description: assignedRole.description!,
                    roleLifecycleStatus_code: assignedRole.roleLifecycleStatus_code,
                };
                expectedRoles.push(expectedConsultantRole);
            });
            preparedMyProjectExperienceHeader.roles = expectedRoles;
        }

        if (skillAssignments !== undefined) {
            const expectedSkills: SkillMasterList[] = [];
            skillAssignments.forEach((assignedSkill) => {
                const expectedConsultantSkill: SkillMasterList = {
                    ID: assignedSkill.ID!,
                    name: assignedSkill.name!,
                    description: assignedSkill.description!,
                    lifecycleStatus_code: assignedSkill.lifecycleStatus_code,
                };
                expectedSkills.push(expectedConsultantSkill);
            });
            preparedMyProjectExperienceHeader.skills = expectedSkills;
        }

        if (profile !== undefined) {
            preparedMyProjectExperienceHeader.profile = {
                ID: profile.workforcePerson.ID,
                dataSubjectRole: 'Project Team Member',
                workerExternalID: profile.workforcePerson.externalID,
                emailAddress: profile.email.address,
                firstName: null!,
                lastName: null!,
                initials: null!,
                mobilePhoneNumber: null!,
                profilePhotoURL: null!,
                name: null!,
                role: null!,
                managerExternalID: profile.managerWorkAssignment.externalID,
                officeLocation: null!,
                resourceOrg: `${profile.resourceOrganization.name} (${profile.resourceOrganization.displayId})`,
                resourceOrgId: profile.resourceOrganization.displayId,
                costCenter: profile.costCenter.costCenterID,
                costCenterDescription: profile.costCenterAttribute.description,
                isContingentWorker: false,
                fullName: null!,
            };
        }

        return preparedMyProjectExperienceHeader;
    }
}
