import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { v4 as uuid } from 'uuid';
import {
    WorkforcePerson,
    Email,
    Phone,
    ProfileDetail,
    JobDetail,
    ResourceOrganizations,
    WorkAssignment,
    CostCenter,
    RoleAssignment,
    ProjectRole,
    CostCenterAttribute,
} from 'test-commons';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allEmployeeHeaders,
    allProjectRoles,
    allRoleAssignments,
    roleAssignmentWithDescription4,
    projectRoleWithDescription1,
    roleAssignmentWithDescription5,
    allEmail,
    allWorkforcePerson,
    workforcePersonWithDescription3,
    email5,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allJobDetails,
    employeeHeaderWithDescription4,
    allCostCenters,
    resourceOrganization1,
    costCenter1,
    profileDetail5,
    jobDetail8,
    phone5,
    email2,
    workAssignment4,
    projectRoleWithDescription2,
    projectRoleWithDescription3,
    allResourceOrganizations,
    allResourceOrganizationItems,
    allCostCenterAttributes,
    costCenterAttribute1,
} from '../../data';
import { createRole, deleteRole } from '../../data/service/myResourcesService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { Roles } from '../../serviceEntities/myProjectExperienceService/Roles';
import { MyProjectExperienceHeader } from '../../serviceEntities/myProjectExperienceService/MyProjectExperienceHeader';
import { ProfileData } from '../../serviceEntities/myProjectExperienceService/ProfileData';

@suite('MyResourcesService/Roles')
export class MyResourcesRolesTest extends MyResourcesServiceRepository {
    public constructor() { super('Roles'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.projectRoleRepository.insertMany(allProjectRoles);
        await this.roleAssignmentRepository.insertMany(allRoleAssignments);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.costCenterRepository.insertMany(allCostCenters);
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
        await this.projectRoleRepository.deleteMany(allProjectRoles);
        await this.roleAssignmentRepository.deleteMany(allRoleAssignments);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
        await this.costCenterAttributeRepository.deleteMany(allCostCenterAttributes);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned roles of consultants.'() {
        const response = await this.get();
        this.responses.push(response);
        const consultantRoles = response.data.value as Roles[];
        const expectedConsultantRoles = this.prepareExpected([roleAssignmentWithDescription4, roleAssignmentWithDescription5]);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantRoles, 'Expected previously assigned roles.');
        assert.isTrue(consultantRoles.length >= 2, 'Expected atleast one Profile');
        expect(consultantRoles).to.deep.include.any.members(expectedConsultantRoles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned roles of consultants without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned roles of consultants with role and consultant details.'() {
        const response = await this.get('?$expand=role,employee,profile');
        this.responses.push(response);
        const consultantRoles = response.data.value as Roles[];
        const expectedConsultantRoles: Roles[] = [];
        expectedConsultantRoles.concat(this.prepareExpected(
            [roleAssignmentWithDescription4, roleAssignmentWithDescription5],
            [projectRoleWithDescription1, projectRoleWithDescription2],
            {
                workforcePerson: workforcePersonWithDescription3,
                email: email5,
                phone: phone5,
                profileDetail: profileDetail5,
                jobDetail: jobDetail8,
                managerWorkAssignment: workAssignment4,
                resourceOrganization: resourceOrganization1,
                costCenter: costCenter1,
                costCenterAttribute: costCenterAttribute1,
            },
        ));
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantRoles, 'Expected previously assigned roles.');
        assert.isTrue(consultantRoles.length >= 2, 'Expected atleast one Profile');
        expect(consultantRoles).to.deep.include.any.members(expectedConsultantRoles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all assigned roles of consultants with role and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=role,employee,profile');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a role to the consultant.'() {
        this.responses.push(await this.enableDraftEdit(createRole.employee_ID));
        this.responses.push(await this.create(createRole));
        const responseDraftActivate = await this.activateDraft(createRole.employee_ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 200, 'Error in assigning a role to consultant, expected status code should be 200(Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a role to the consultant without authorization.'() {
        this.responses.push(await this.enableDraftEdit(createRole.employee_ID));
        const response = await this.createWithoutAuthorization(createRole);
        this.responses.push(response);
        this.responses.push(await this.deleteDraft(createRole.employee_ID));

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a duplicate role to a consultant should not be allowed.'() {
        const duplicateRoleAssignment: Roles = {
            ID: uuid(),
            employee_ID: employeeHeaderWithDescription4.ID,
            role_ID: projectRoleWithDescription1.ID,
        };
        this.responses.push(await this.enableDraftEdit(duplicateRoleAssignment.employee_ID));
        this.responses.push(await this.create(duplicateRoleAssignment));
        const responseDraftActivate = await this.activateDraft(duplicateRoleAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(duplicateRoleAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning a duplicate role should not be allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a no role to a consultant should not be allowed.'() {
        const noRoleAssignment: Roles = {
            ID: uuid(),
            employee_ID: roleAssignmentWithDescription4.employee_ID,
        };
        this.responses.push(await this.enableDraftEdit(noRoleAssignment.employee_ID));
        this.responses.push(await this.create(noRoleAssignment));
        const responseDraftActivate = await this.activateDraft(noRoleAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(noRoleAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assign a no role to a consultant should not be allowed., expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a role having role_ID as whitesSpaces only to a consultant should not be allowed.'() {
        const whiteSpacesRoleAssignment: Roles = {
            ID: uuid(),
            role_ID: '    ',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(whiteSpacesRoleAssignment.employee_ID));
        this.responses.push(await this.create(whiteSpacesRoleAssignment));
        const responseDraftActivate = await this.activateDraft(whiteSpacesRoleAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(whiteSpacesRoleAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assign a role having role_ID as whitesSpaces only to a consultant should not be allowed., expected status code should be 400(Bad Request).');
        assert.equal(responseDraftActivate.data.error.message, 'Select a role or delete the line.', 'Expected error message is "There is an empty line in the Roles section.Select a role or delete the line."');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a blank role to a consultant should not be allowed.'() {
        const blankRoleAssignment: Roles = {
            ID: uuid(),
            role_ID: '',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(blankRoleAssignment.employee_ID));
        this.responses.push(await this.create(blankRoleAssignment));
        const responseDraftActivate = await this.activateDraft(blankRoleAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(blankRoleAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning a Blank role should not be allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a non-existing role to a consultant should not be allowed.'() {
        const nonExistingRoleAssignment: Roles = {
            ID: uuid(),
            role_ID: uuid(),
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(nonExistingRoleAssignment.employee_ID));
        this.responses.push(await this.create(nonExistingRoleAssignment));
        const responseDraftActivate = await this.activateDraft(nonExistingRoleAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(nonExistingRoleAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning a non-existing role should not be allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign the role of non-guid to a consultant should not be allowed.'() {
        const nonGuidRoleAssignment: Roles = {
            ID: uuid(),
            role_ID: 'randomRoleID',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(nonGuidRoleAssignment.employee_ID));
        this.responses.push(await this.create(nonGuidRoleAssignment));
        const responseDraftActivate = await this.activateDraft(nonGuidRoleAssignment.employee_ID);
        this.responses.push(responseDraftActivate);
        this.responses.push(await this.deleteDraft(nonGuidRoleAssignment.employee_ID));

        assert.equal(responseDraftActivate.status, 400, 'Assigning a non-guid role should not be allowed, expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assign a invalid roleID as more than 30 character role to a consultant should not be allowed.'() {
        const moreThan30CharacterRoleAssignment: Roles = {
            ID: uuid(),
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(moreThan30CharacterRoleAssignment.employee_ID));
        this.responses.push(await this.create(moreThan30CharacterRoleAssignment));
        const responseDraftCreate = await this.update(`(ID='${moreThan30CharacterRoleAssignment.ID}',IsActiveEntity=false)`, { role_ID: 'randomStringrandomStringrandomStringrandomStringrandomString' });
        this.responses.push(responseDraftCreate);
        this.responses.push(await this.deleteDraft(moreThan30CharacterRoleAssignment.employee_ID));

        assert.equal(responseDraftCreate.status, 400, 'Assign a invalid roleID as more than 30 character role to a consultant should not be allowed., expected status code should be 400(Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned role to a consultant.'() {
        const response = await this.get(`(ID=${createRole.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const consultantRole = response.data;

        delete consultantRole['@context'];
        delete consultantRole['@metadataEtag'];
        consultantRole.modifiedAt = null;
        consultantRole.createdAt = null;
        const expectedConsultantRole = this.prepareExpected([createRole as RoleAssignment]);
        expectedConsultantRole[0].modifiedBy = email2.address;
        expectedConsultantRole[0].createdBy = email2.address;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantRole, 'Expected previously assigned role.');
        expect(consultantRole).to.eql(expectedConsultantRole[0]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned role to a consultant without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${createRole.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned role to a consultant with role and consultant details.'() {
        const response = await this.get(`(ID=${createRole.ID},IsActiveEntity=true)?$expand=role,employee,profile`);
        this.responses.push(response);
        const consultantRole = response.data;
        delete consultantRole['@context'];
        delete consultantRole['@metadataEtag'];
        consultantRole.modifiedAt = null;
        consultantRole.createdAt = null;
        consultantRole.employee.modifiedAt = null;
        const expectedConsultantRole = this.prepareExpected(
            [createRole as RoleAssignment],
            [projectRoleWithDescription3],
            {
                workforcePerson: workforcePersonWithDescription3,
                email: email5,
                phone: phone5,
                profileDetail: profileDetail5,
                jobDetail: jobDetail8,
                managerWorkAssignment: workAssignment4,
                resourceOrganization: resourceOrganization1,
                costCenter: costCenter1,
                costCenterAttribute: costCenterAttribute1,
            },
        );
        expectedConsultantRole[0].modifiedBy = email2.address;
        expectedConsultantRole[0].createdBy = email2.address;
        if (expectedConsultantRole[0].employee !== undefined) {
            expectedConsultantRole[0].employee.modifiedBy = email2.address;
        }

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantRole, 'Expected previously assigned role.');
        expect(consultantRole).to.eql(expectedConsultantRole[0]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get the previously assigned role to a consultant with role and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${createRole.ID},IsActiveEntity=true)?$expand=role,employee,profile`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating/Changing the assigned role of a consultant'() {
        this.responses.push(await this.enableDraftEdit(createRole.employee_ID));
        const response = await this.update(`(ID=${createRole.ID},IsActiveEntity=false)`, createRole);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Updating/Changing assigned role of a consultant.');
        this.responses.push(await this.activateDraft(createRole.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unassigning a role from a consultant.'() {
        this.responses.push(await this.enableDraftEdit(deleteRole.employee_ID));
        const responseDeleteRole = await this.delete(`(ID=${deleteRole.ID},IsActiveEntity=false)`);
        this.responses.push(responseDeleteRole);
        const responseDraftActivate = await this.activateDraft(deleteRole.employee_ID);
        this.responses.push(responseDraftActivate);
        const responseTrue = await this.get(`(ID=${deleteRole.ID},IsActiveEntity=true)`);
        this.responses.push(responseTrue);
        const responseFalse = await this.get(`(ID=${deleteRole.ID},IsActiveEntity=false)`);
        this.responses.push(responseFalse);
        const response = await this.get();
        this.responses.push(response);
        const consultantRoles = response.data.value as Roles[];
        const expectedConsultantRoles = this.prepareExpected([roleAssignmentWithDescription4, roleAssignmentWithDescription5]);
        consultantRoles.forEach((expectedConsultantRole, i) => {
            consultantRoles[i].modifiedAt = null!;
            const localExpectedConsultantRole = expectedConsultantRole;
            localExpectedConsultantRole.modifiedBy = email5.address;
        });
        expectedConsultantRoles.forEach((expectedConsultantRole) => {
            const localExpectedConsultantRole = expectedConsultantRole;
            localExpectedConsultantRole.modifiedBy = email5.address;
        });
        assert.equal(responseDeleteRole.status, 204, 'Expected the unassignment a role to a consultant, expected status code should be 204 (No Content).');
        assert.equal(responseDraftActivate.status, 200, 'Error in unassigning a role to consultant, expected status code should be 200(Ok).');
        assert.equal(responseTrue.status, 404, 'Unexpected the unassigned role of consultant, expected status code should be 404 (Not Found).');
        assert.equal(responseFalse.status, 404, 'Unexpected the unassigned role of consultant, expected status code should be 404 (Not Found).');
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(consultantRoles, 'Expected a list of assigned roles.');
        assert.isTrue(consultantRoles.length >= 2, 'Expected atleast one Profile');
        expect(consultantRoles).to.deep.include.any.members(expectedConsultantRoles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unassigning a role from a consultant without authorization.'() {
        this.responses.push(await this.enableDraftEdit(deleteRole.employee_ID));
        const responseDeleteRole = await this.deleteWithoutAuthorization(`(ID=${deleteRole.ID},IsActiveEntity=false)`);
        this.responses.push(responseDeleteRole);
        const responseDraftActivate = await this.activateDraftWithoutAuthorization(deleteRole.employee_ID);
        this.responses.push(responseDraftActivate);
        const responseTrue = await this.get(`(ID=${deleteRole.ID},IsActiveEntity=true)`);
        this.responses.push(responseTrue);
        const responseFalse = await this.get(`(ID=${deleteRole.ID},IsActiveEntity=false)`);
        this.responses.push(responseFalse);
        const response = await this.activateDraft(deleteRole.employee_ID);
        this.responses.push(response);
        this.responses.push(await this.deleteDraft(deleteRole.employee_ID));

        assert.equal(responseDeleteRole.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(responseDraftActivate.status, 403, 'Expected status code should be 403 (Forbidden).');
        assert.equal(responseTrue.status, 404, 'Unexpected the unassigned role of consultant, expected status code should be 404 (Not Found).');
        assert.equal(responseFalse.status, 404, 'Unexpected the unassigned role of consultant, expected status code should be 404 (Not Found).');
    }

    private prepareExpected(assignedConsultantRoles: RoleAssignment[], projectRoles?: ProjectRole[], profile?: { workforcePerson: WorkforcePerson, email: Email, phone: Phone, profileDetail: ProfileDetail, jobDetail: JobDetail, managerWorkAssignment: WorkAssignment, resourceOrganization: ResourceOrganizations, costCenter: CostCenter, costCenterAttribute: CostCenterAttribute }) {
        const expectedConsultantRoles: Roles[] = [];
        assignedConsultantRoles.forEach((assignedConsultantRole, i) => {
            const expectedConsultantRole: Roles = this.prepareExpectedAssignedRoles(assignedConsultantRole);
            if (projectRoles !== undefined && profile !== undefined) {
                expectedConsultantRole.role = projectRoles[i];
                expectedConsultantRole.employee = this.prepareEmployee(assignedConsultantRole.employee_ID);
                expectedConsultantRole.profile = this.prepareProfile(profile);
            }
            expectedConsultantRoles.push(expectedConsultantRole);
        });
        return expectedConsultantRoles;
    }

    private prepareExpectedAssignedRoles(assignedRole: RoleAssignment) {
        const roles: Roles = {
            HasActiveEntity: false,
            HasDraftEntity: false,
            ID: assignedRole.ID,
            IsActiveEntity: true,
            createdAt: null!,
            createdBy: null!,
            employee_ID: assignedRole.employee_ID,
            modifiedAt: null!,
            modifiedBy: null!,
            role_ID: assignedRole.role_ID,
        };
        return roles;
    }

    private prepareEmployee(employeeID: string) {
        const employee: MyProjectExperienceHeader = {
            ID: employeeID,
            commaSeparatedSkills: null!,
            commaSeparatedRoles: null!,
            HasActiveEntity: false,
            HasDraftEntity: false,
            IsActiveEntity: true,
            createdAt: null!,
            createdBy: null!,
            modifiedAt: null!,
            modifiedBy: null!,
        };
        return employee;
    }

    private prepareProfile(profile: { workforcePerson: WorkforcePerson, email: Email, jobDetail: JobDetail, managerWorkAssignment: WorkAssignment, resourceOrganization: ResourceOrganizations, costCenter: CostCenter, costCenterAttribute: CostCenterAttribute }) {
        const preparedProfile: ProfileData = {
            ID: profile.workforcePerson.ID,
            dataSubjectRole: 'Project Team Member',
            workerExternalID: profile.workforcePerson.externalID,
            emailAddress: profile.email.address,
            profilePhotoURL: null!,
            firstName: null!,
            lastName: null!,
            initials: null!,
            mobilePhoneNumber: null!,
            name: null!,
            role: profile.jobDetail.jobTitle,
            managerExternalID: profile.managerWorkAssignment.externalID,
            officeLocation: 'Germany',
            resourceOrg: `${profile.resourceOrganization.name} (${profile.resourceOrganization.displayId})`,
            resourceOrgId: profile.resourceOrganization.displayId,
            costCenterDescription: profile.costCenterAttribute.description,
            costCenter: profile.costCenter.costCenterID,
            isContingentWorker: false,
            fullName: null!,
        };
        return preparedProfile;
    }
}
