import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { Email, WorkforcePerson } from 'test-commons';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allEmail,
    allSkills,
    assignment3,
    allEmployeeHeaders,
    allWorkforcePerson,
    allResourceHeaders,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allAssignments,
    allAssignmentBuckets,
    customerData,
    workpackageData,
    projectData,
    resourceRequestData,
    allSkillRequirements,
    allProjectRoles,
    projectRoleWithDescription1,
    allJobDetails,
    allCostCenters,
    organizationHeader1,
    skillWithDescription1,
    setOneProficiencyLevel1,
    allProficiencySet,
    workforcePersonWithDescription3,
    email5,
    employeeHeaderWithDescription4,
    allResourceOrganizations,
    allResourceOrganizationItems,
    allProficiencyLevel,
    allCostCenterAttributes,
    demandData,
} from '../../data';
import { InternalWorkExperience, InternalWorkExperienceSkills } from '../../serviceEntities/myProjectExperienceService/InternalWorkExperience';
import { createInternalWorkExperience } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProfileData } from '../../serviceEntities/myProjectExperienceService/ProfileData';
import { MyProjectExperienceHeader } from '../../serviceEntities/myProjectExperienceService/MyProjectExperienceHeader';

@suite('MyResourcesService/InternalWorkExperience')
export class MyResourcesInternalWorkExperienceTest extends MyResourcesServiceRepository {
    public constructor() { super('InternalWorkExperience'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.resourceHeaderRepository.insertMany(allResourceHeaders);
        await this.assignmentsRepository.insertMany(allAssignments);
        await this.assignmentBucketRepository.insertMany(allAssignmentBuckets);
        await this.customerRepository.insertMany(customerData);
        await this.workPackageRepository.insertMany(workpackageData);
        await this.projectRepository.insertMany(projectData);
        await this.projectRoleRepository.insertMany(allProjectRoles);
        await this.proficiencySetRepository.insertMany(allProficiencySet);
        await this.proficiencyLevelRepository.insertMany(allProficiencyLevel);
        await this.skillRepository.insertMany(allSkills);
        await this.resourceRequestRepository.insertMany(resourceRequestData);
        await this.skillRequirementRepository.insertMany(allSkillRequirements);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
        await this.costCenterAttributeRepository.insertMany(allCostCenterAttributes);
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
        await this.assignmentsRepository.deleteMany(allAssignments);
        await this.assignmentBucketRepository.deleteMany(allAssignmentBuckets);
        await this.customerRepository.deleteMany(customerData);
        await this.workPackageRepository.deleteMany(workpackageData);
        await this.projectRepository.deleteMany(projectData);
        await this.projectRoleRepository.deleteMany(allProjectRoles);
        await this.skillRepository.deleteMany(allSkills);
        await this.proficiencySetRepository.deleteMany(allProficiencySet);
        await this.proficiencyLevelRepository.deleteMany(allProficiencyLevel);
        await this.resourceRequestRepository.deleteMany(resourceRequestData);
        await this.skillRequirementRepository.deleteMany(allSkillRequirements);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
        await this.costCenterAttributeRepository.deleteMany(allCostCenterAttributes);
        await this.demandRepository.deleteMany(demandData);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all internal work experiences.'() {
        const response = await this.get();
        this.responses.push(response);
        const internalWorkExperiences = response.data.value as InternalWorkExperience[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(internalWorkExperiences, 'Expected a list of all internal work experiences.');
        const expectedInternalWorkExperiences: InternalWorkExperience[] = [];
        expectedInternalWorkExperiences.push(this.prepareInternalWorkExperience());
        expect(internalWorkExperiences).to.deep.include.any.members(expectedInternalWorkExperiences);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all internal work experiences without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all internal work experience with skill and consultant details.'() {
        const response = await this.get('?$expand=internalWorkExperienceSkills,employee,profile');
        this.responses.push(response);
        const internalWorkExperiences = response.data.value as InternalWorkExperience[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(internalWorkExperiences, 'Expected a list of all internal work experience with skill and consultant details.');
        const expectedInternalWorkExperiences: InternalWorkExperience[] = [];
        expectedInternalWorkExperiences.push(this.prepareExpected({ workforcePerson: workforcePersonWithDescription3, email: email5 }));
        expect(internalWorkExperiences).to.deep.include.any.members(expectedInternalWorkExperiences);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all internal work experience with skill and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=internalWorkExperienceSkills,employee,profile');
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one internal work experience.'() {
        const response = await this.get(`(assignment_ID=${assignment3.ID})`);
        this.responses.push(response);
        const internalWorkExperience = response.data;
        delete internalWorkExperience['@context'];
        delete internalWorkExperience['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        const expectedInternalWorkExperience = this.prepareInternalWorkExperience();
        expect(internalWorkExperience).to.eql(expectedInternalWorkExperience);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one internal work experience without authorization.'() {
        const response = await this.getWithoutAuthorization(`(assignment_ID=${assignment3.ID})`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one internal work experience with skill and consultant details.'() {
        const response = await this.get(`(assignment_ID=${assignment3.ID})?$expand=internalWorkExperienceSkills,employee,profile`);
        this.responses.push(response);
        const internalWorkExperience = response.data;
        delete internalWorkExperience['@context'];
        delete internalWorkExperience['@metadataEtag'];

        const expectedInternalAssignment = this.prepareExpected({ workforcePerson: workforcePersonWithDescription3, email: email5 });
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(internalWorkExperience).to.eql(expectedInternalAssignment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one internal work experience with skill and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization(`(assignment_ID=${assignment3.ID})?$expand=internalWorkExperienceSkills,employee,profile`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating internal work experience is not allowed'() {
        const updatePayload = {
            customerName: 'New Customer',
        };
        const response = await this.update(`(assignment_ID=${assignment3.ID})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a internal work experience is not allowed.'() {
        const responseInternalWorkExperienceCreate = await this.create(createInternalWorkExperience);
        this.responses.push(responseInternalWorkExperienceCreate);
        assert.equal(responseInternalWorkExperienceCreate.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    private prepareExpected(profile?: { workforcePerson: WorkforcePerson, email: Email }) {
        const expectedSkills: InternalWorkExperienceSkills[] = [];
        const expectedInternalWorkExperience = this.prepareInternalWorkExperience();
        if (profile !== undefined) {
            expectedInternalWorkExperience.profile = this.prepareProfile(profile);
            expectedInternalWorkExperience.employee = this.prepareEmployee(employeeHeaderWithDescription4.ID);
            const expectedSkill = this.prepareInternalWorkExperienceSkills();
            expectedSkills.push(expectedSkill);
            expectedInternalWorkExperience.internalWorkExperienceSkills = expectedSkills;
        }

        return expectedInternalWorkExperience;
    }

    private prepareInternalWorkExperience() {
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusFiveMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 5, 1));
        const start = currentMonthStart.toISOString().slice(0, 10);
        const end = nowPlusFiveMonthsStart.toISOString().slice(0, 10);
        const prepareInternalWorkExperience: InternalWorkExperience = {
            assignment_ID: assignment3.ID,
            resourceRequest_ID: resourceRequestData[0].ID,
            assignmentStatus: 'Soft-Booked',
            requestName: resourceRequestData[0].name,
            requestDisplayId: resourceRequestData[0].displayId,
            companyName: organizationHeader1.description,
            customerName: customerData[0].name,
            rolePlayed: projectRoleWithDescription1.name,
            assignedCapacity: 2160,
            convertedAssignedCapacity: '36.00 hr',
            startDate: start,
            endDate: end,
            employee_ID: employeeHeaderWithDescription4.ID,
            workItemName: 'Work Item Name 1',
        };
        return prepareInternalWorkExperience;
    }

    private prepareProfile(profile: { workforcePerson: WorkforcePerson, email: Email }) {
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
            role: 'Senior Developer',
            managerExternalID: 'workAssignmentExternalID4',
            officeLocation: 'Germany',
            costCenter: 'CCDE0001',
            costCenterDescription: 'CCDE0001',
            resourceOrg: 'Organization ORG_9 Germany (Org_9)',
            resourceOrgId: 'Org_9',
            isContingentWorker: false,
            fullName: null!,
        };
        return preparedProfile;
    }

    private prepareInternalWorkExperienceSkills() {
        const preparedSkills: InternalWorkExperienceSkills = {
            assignment_ID: assignment3.ID,
            skillId: skillWithDescription1.ID,
            proficiencyLevelId: setOneProficiencyLevel1.ID,
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        return preparedSkills;
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
}
