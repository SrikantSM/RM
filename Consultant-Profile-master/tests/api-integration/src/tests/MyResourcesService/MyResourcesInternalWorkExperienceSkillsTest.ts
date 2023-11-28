import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allEmail,
    allSkills,
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
    allJobDetails,
    allOrganizationDetails,
    allOrganizationHeaders,
    allProficiencySet,
    allCostCenters, skillWithDescription1, employeeHeaderWithDescription2, setOneProficiencyLevel1, employeeHeaderWithDescription4, assignment3, allProficiencyLevel, allResourceOrganizationItems, allResourceOrganizations,
} from '../../data';
import { InternalWorkExperienceSkills } from '../../serviceEntities/myProjectExperienceService/InternalWorkExperience';
import { createInternalWorkExperienceSkills } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('MyResourcesService/InternalWorkExperienceSkills')
export class MyResourcesInternalWorkExperienceSkillsTest extends MyResourcesServiceRepository {
    public constructor() { super('InternalWorkExperienceSkills'); }

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
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
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
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in internal work experience.'() {
        const response = await this.get();
        this.responses.push(response);
        const internalWorkExperienceSkills = response.data.value as InternalWorkExperienceSkills[];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(internalWorkExperienceSkills, 'Expected a list of skills used in internal work experience.');
        assert.isDefined(internalWorkExperienceSkills.find(
            (internalWorkExperienceSkill) => (
                internalWorkExperienceSkill.assignment_ID === assignment3.ID
                    && internalWorkExperienceSkill.skillId === skillWithDescription1.ID
                    && internalWorkExperienceSkill.proficiencyLevelId === setOneProficiencyLevel1.ID
                    && internalWorkExperienceSkill.employee_ID === employeeHeaderWithDescription4.ID
            ),
        ),
        'Expected internalWorkExperienceSkills1.');
        assert.isUndefined(internalWorkExperienceSkills.find(
            (internalWorkExperienceSkill) => (
                internalWorkExperienceSkill.employee_ID === employeeHeaderWithDescription2.ID
            ),
        ),
        'Expected no internalWorkExperienceSkills for employee 2');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in internal work experience without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in internal work experience with internal work experience and skill details.'() {
        const response = await this.get('?$expand=skill,profile');
        this.responses.push(response);
        const internalWorkExperienceSkills = response.data.value as InternalWorkExperienceSkills[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(internalWorkExperienceSkills, 'Expected a list of skills used in internal work experience with internal work experience and skill details.');
        assert.isDefined(
            internalWorkExperienceSkills.find(
                (internalWorkExperienceSkill) => (
                    internalWorkExperienceSkill.assignment_ID === assignment3.ID
                        && internalWorkExperienceSkill.skillId === skillWithDescription1.ID
                        && internalWorkExperienceSkill.proficiencyLevelId === setOneProficiencyLevel1.ID
                        && internalWorkExperienceSkill.employee_ID === employeeHeaderWithDescription4.ID
                        && internalWorkExperienceSkill.profile !== undefined
                        && internalWorkExperienceSkill.skill !== undefined
                ),
            ),
            'Expected internalWorkExperienceSkills1 with expertanl work experience and skill details.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of skills used in internal work experience with internal work experience and skill details without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=skill,profile');
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in the internal work experience.'() {
        const response = await this.get(`(assignment_ID=${assignment3.ID})`);
        this.responses.push(response);
        const internalWorkExperienceSkills = response.data as InternalWorkExperienceSkills;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            internalWorkExperienceSkills.assignment_ID === assignment3.ID
            && internalWorkExperienceSkills.skillId === skillWithDescription1.ID
            && internalWorkExperienceSkills.proficiencyLevelId === setOneProficiencyLevel1.ID
            && internalWorkExperienceSkills.employee_ID === employeeHeaderWithDescription4.ID,
            'Expected internalWorkExperienceSkills1.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in the internal work experience without authorization.'() {
        const response = await this.getWithoutAuthorization(`(assignment_ID=${assignment3.ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in internal work experience with internal work experience and skill details.'() {
        const response = await this.get(`(assignment_ID=${assignment3.ID})?$expand=profile,skill`);
        this.responses.push(response);
        const internalWorkExperienceSkills = response.data as InternalWorkExperienceSkills;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            internalWorkExperienceSkills.assignment_ID === assignment3.ID
            && internalWorkExperienceSkills.skillId === skillWithDescription1.ID
            && internalWorkExperienceSkills.proficiencyLevelId === setOneProficiencyLevel1.ID
            && internalWorkExperienceSkills.employee_ID === employeeHeaderWithDescription4.ID
            && internalWorkExperienceSkills.profile !== undefined
            && internalWorkExperienceSkills.skill !== undefined,
            'Expected internalWorkExperienceSkills1 with expertanl work experience and skill details.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a skill used in internal work experience with internal work experience and skill details without authorization.'() {
        const response = await this.getWithoutAuthorization(`(assignment_ID=${assignment3.ID})?$expand=profile,skill`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Assigning a skill to a internal work experience is not allowed.'() {
        const response = await this.create(createInternalWorkExperienceSkills);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Assigning a skill to internal work experience should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Changing a skill to a internal work experience is not allowed.'() {
        const updatePayload = {
            skillId: '72bdab69-aa8b-4b33-99fc-5fefbad29fc6',
        };
        const response = await this.update(`(assignment_ID=${assignment3.ID})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Changing a skill to internal work experience should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unassigning a skill to a internal work experience is not allowed.'() {
        const response = await this.delete(`(assignment_ID=${assignment3.ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Unassigning a skill to internal work experience should not be possible and expected status code should be 403(Forbidden).');
    }
}
