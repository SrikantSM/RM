import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import {
    EmployeeHeader,
    Email,
    ProjectRole,
    Skill,
    WorkforcePerson,
} from 'test-commons';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allEmail,
    allEmployeeHeaders,
    employeeHeaderWithDescription1,
    employeeHeaderWithDescription2,
    allWorkforcePerson,
    email1,
    workforcePersonWithDescription1,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allResourceCapacity,
    allResourceHeaders,
    allAssignmentBuckets,
    allAssignments,
    allBookedCapacityAggregates,
} from '../../data';
import { createDeleteMyProjectExperience } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { MyProjectExperienceHeader } from '../../serviceEntities/myProjectExperienceService/MyProjectExperienceHeader';
import { RoleMasterList } from '../../serviceEntities/myProjectExperienceService/RoleMasterList';
import { SkillMasterList } from '../../serviceEntities/myProjectExperienceService/SkillMasterList';
import { TestUtility } from '../../utils/TestUtility';

@suite('MyProjectExperienceService/MyProjectExperienceHeader')
export class MyProjectExperienceHeaderTest extends MyProjectExperienceServiceRepository {
    public constructor() {
        super('MyProjectExperienceHeader');
    }

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
        await this.bookedCapacityAggregateRepository.insertMany(allBookedCapacityAggregates);
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
        await this.bookedCapacityAggregateRepository.deleteMany(allBookedCapacityAggregates);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all my project experience.'() {
        const response = await this.get();
        this.responses.push(response);
        const myProjectExperiences = response.data.value as MyProjectExperienceHeader[];
        const expectedMyProjectExperienceHeader = this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription1);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperiences, 'Expected only an employee.');
        expect(myProjectExperiences).to.eql([expectedMyProjectExperienceHeader]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all my project experience without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all my project experience with profile details, assigned skills, assigned roles.'() {
        const response = await this.get('?$expand=skills,roles,profile');
        this.responses.push(response);
        const myProjectExperiences = response.data.value as MyProjectExperienceHeader[];
        const expectedMyProjectExperienceHeader = this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription1, { workforcePerson: workforcePersonWithDescription1, email: email1 }, [], []);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperiences, 'Expected an employee\'s my project experience with profile details, assigned skills, assigned roles.');
        expect(myProjectExperiences).to.eql([expectedMyProjectExperienceHeader]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all my project experience with profile details, assigned skills, assigned roles without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=skills,roles,profile');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one my project experience.'() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=true)`);
        this.responses.push(response);

        const myProjectExperience = response.data;
        const expectedMyProjectExperienceHeader = this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription1);
        delete myProjectExperience['@context'];
        delete myProjectExperience['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperience, 'Expected only an employee.');
        expect(myProjectExperience).to.eql(expectedMyProjectExperienceHeader);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get project experience for another employee.'() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription2.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const myProjectExperience = response.data as MyProjectExperienceHeader;

        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
        assert.isUndefined(myProjectExperience.ID, 'Expected no my project experience for another employee.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one my project experience without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Enabling draft of an another employee is not allowed.'() {
        const response = await this.enableDraftEdit(employeeHeaderWithDescription2.ID);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one my project experience with profile details, assigned skills, assigned roles.'() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=true)?$expand=skills,roles,profile`);
        this.responses.push(response);
        const myProjectExperiences = response.data;
        delete myProjectExperiences['@context'];
        delete myProjectExperiences['@metadataEtag'];
        const expectedMyProjectExperienceHeader = this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription1, { workforcePerson: workforcePersonWithDescription1, email: email1 }, [], []);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperiences, 'Expected an employee\'s my project experience with profile details, assigned skills, assigned roles.');
        expect(myProjectExperiences).to.eql(expectedMyProjectExperienceHeader);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one my project experience with profile details, assigned skills, assigned roles without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=true)?$expand=skills,roles,profile`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Select one my project experience with profile details.'() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=true)?$expand=profile,profile($select=ID,costCenter,dataSubjectRole,resourceOrg,emailAddress,mobilePhoneNumber,name,officeLocation,role,workerExternalID,isContingentWorker)`);
        this.responses.push(response);
        const myProjectExperiences = response.data;
        delete myProjectExperiences['@context'];
        delete myProjectExperiences['@metadataEtag'];
        const expectedMyProjectExperienceHeader = this.prepareMyProjectExpeienceHeader(employeeHeaderWithDescription1, { workforcePerson: workforcePersonWithDescription1, email: email1 });

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(myProjectExperiences, 'Expected an employee\'s my project experience with profile details.');
        expect(myProjectExperiences).to.eql(expectedMyProjectExperienceHeader);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test for availability chart data '() {
        const response = await this.get(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=true)/periodicUtilization?$apply=groupby((CALMONTH,monthYear),aggregate(utilizationPercentage with max as maxUtilization))`);
        this.responses.push(response);
        const periodicUtilization = response.data.value;
        const expectedperiodicUtilization = TestUtility.preparePeriodicUtilizations([
            { resourceCapacity: allResourceCapacity[0], assignmentBucket: allAssignmentBuckets[0] },
            { resourceCapacity: allResourceCapacity[1], assignmentBucket: allAssignmentBuckets[1] },
            { resourceCapacity: allResourceCapacity[2], assignmentBucket: allAssignmentBuckets[2] },
            { resourceCapacity: allResourceCapacity[3], assignmentBucket: allAssignmentBuckets[3] },
            { resourceCapacity: allResourceCapacity[4], assignmentBucket: allAssignmentBuckets[4] },
            { resourceCapacity: allResourceCapacity[5], assignmentBucket: allAssignmentBuckets[5] },
        ], allEmployeeHeaders[0], true);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(expectedperiodicUtilization).to.eql(periodicUtilization);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a my project experience should not be possible.'() {
        const response = await this.create(createDeleteMyProjectExperience);
        this.responses.push(response);
        assert.equal(response.status, 405, 'Creating a my project experience not possible and expected status code should be 405(Method not allowed).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a my project experience.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription1.ID));
        this.responses.push(await this.update(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=false)`, employeeHeaderWithDescription1));
        const response = await this.activateDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(response);
        const myProjectExperience = response.data as MyProjectExperienceHeader;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(myProjectExperience.ID, employeeHeaderWithDescription1.ID, 'Error in updating my project experience.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a my project experience without authorization.'() {
        this.responses.push(await this.enableDraftEdit(employeeHeaderWithDescription1.ID));
        const response = await this.updateWithoutAuthorization(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=false)`, employeeHeaderWithDescription1);
        this.responses.push(response);
        const responseDraftActivate = await this.deleteDraft(employeeHeaderWithDescription1.ID);
        this.responses.push(responseDraftActivate);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting a my project experience should not be possible.'() {
        const response = await this.delete(`(ID=${employeeHeaderWithDescription1.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 405, 'Deleting my project experience not possible and expected status code must be 405(Method not allowed).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting a my project experience belonging to another employee should not be possible.'() {
        const response = await this.delete(`(ID=${employeeHeaderWithDescription2.ID},IsActiveEntity=true)`);
        this.responses.push(response);

        assert.equal(response.status, 405, 'Deleting my project experience not possible and expected status code must be 405(Method not allowed).');
    }

    private prepareMyProjectExpeienceHeader(employeeHeader: EmployeeHeader, profile?: { workforcePerson: WorkforcePerson, email: Email }, roleAssignments?: ProjectRole[], skillAssignments?: Skill[]) {
        const preparedMyProjectExperienceHeader: MyProjectExperienceHeader = {
            ID: employeeHeader.ID,
            commaSeparatedSkills: null!,
            commaSeparatedRoles: null!,
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
                managerExternalID: null!,
                officeLocation: null!,
                resourceOrg: null!,
                resourceOrgId: null!,
                costCenter: null!,
                costCenterDescription: null!,
                isContingentWorker: false,
                fullName: null!,
            };
        }

        return preparedMyProjectExperienceHeader;
    }
}
