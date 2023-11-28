import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { ProjectExperienceServiceRepository } from '../../utils/serviceRepository/ProjectExperienceService-Repository';
import {
    allEmail,
    allEmployeeHeaders,
    allWorkforcePerson,
    allPhone,
    allProfiles,
    allCostCenters,
    allWorkAssignment,
    allJobDetails,
    allProficiencySet,
    allProficiencyLevel,
    allSkills,
    allSkillAssignments,
    allExternalWorkExperience,
    allExternalWorkExperienceSkills,
    employeeHeaderWithDescription1,
    phone1,
    email1,
    workforcePersonWithDescription1,
    profileDetail4,
    email2,
    employeeHeaderWithDescription2,
    phone2,
    profileDetail2,
    workforcePersonWithDescription2,
    workforcePersonManagerWithDescription,
    email3,
    employeeHeaderWithDescription3,
    phone3,
    profileDetail3,
    email5,
    employeeHeaderWithDescription4,
    phone5,
    profileDetail5,
    workforcePersonWithDescription3,
    costCenter1,
    jobDetail4,
    workAssignment2,
    allWorkAssignmentDetail,
    skillAssignmentWithDescription1,
    setOneProficiencyLevel1,
    skillWithDescription1,
    setTwoProficiencyLevel1,
    skillAssignmentWithDescription3,
    skillWithDescription2,
    externalWorkExperience1,
    jobDetail6,
    jobDetail8,
    workAssignment4,
    workAssignment6,
    externalWorkExperience3,
    externalWorkExperienceSkills31,
    skillAssignmentWithDescription6,
    skillAssignmentWithDescription5,
    externalWorkExperience4,
    setTwoProficiencyLevel2,
    externalWorkExperienceSkills41,
    externalWorkExperienceSkills42,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { Profiles } from '../../serviceEntities/projectExperienceService/Profiles';
import { ProjectExperienceTestUtil } from './ProjectExperienceTestUtil';
import {
    ExternalWorkExperience, ExternalWorkExperienceSkillAssignments, PrimaryWorkAssignment, SkillAssignments,
} from '../../serviceEntities/projectExperienceService';

@suite('ProjectExperienceService/Profiles')
export class ProfileTest extends ProjectExperienceServiceRepository {
    public constructor() {
        super('$batch');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.phoneRepository.insertMany(allPhone);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.proficiencySetRepository.insertMany(allProficiencySet);
        await this.proficiencyLevelRepository.insertMany(allProficiencyLevel);
        await this.skillRepository.insertMany(allSkills);
        await this.skillAssignmentRepository.insertMany(allSkillAssignments);
        await this.externalWorkExperienceRepository.insertMany(allExternalWorkExperience);
        await this.externalWorkExperienceSkillsRepository.insertMany(allExternalWorkExperienceSkills);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.phoneRepository.deleteMany(allPhone);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.skillAssignmentRepository.deleteMany(allSkillAssignments);
        await this.externalWorkExperienceRepository.deleteMany(allExternalWorkExperience);
        await this.externalWorkExperienceSkillsRepository.deleteMany(allExternalWorkExperienceSkills);
        await this.skillRepository.deleteMany(allSkills);
        await this.proficiencyLevelRepository.deleteMany(allProficiencyLevel);
        await this.proficiencySetRepository.deleteMany(allProficiencySet);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all profiles.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload('Profiles');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profilesList = await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true);
        const profiles = JSON.parse(profilesList) as Profiles[];
        const expectedProfile1:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription1, workforcePersonWithDescription1, email1, phone1, profileDetail4);
        const expectedProfile2:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription2, workforcePersonWithDescription2, email2, phone2, profileDetail2);
        const expectedProfile3:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription3, workforcePersonManagerWithDescription, email3, phone3, profileDetail3);
        const expectedProfile4:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription4, workforcePersonWithDescription3, email5, phone5, profileDetail5);
        const expectedProfiles:Profiles[] = [expectedProfile1, expectedProfile2, expectedProfile3, expectedProfile4];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isAtLeast(profiles.length, 4, 'Expected response to contain 4 Profiles.');
        assert.isDefined(profiles, 'Expected a list of Profiles.');
        expect(profiles).to.deep.include.any.members(expectedProfiles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all profiles & filter by worker external ID.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles?$filter=workforcePersonExternalID%20eq%20'${workforcePersonWithDescription1.externalID}'`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profilesList = await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true);
        const profiles = JSON.parse(profilesList) as Profiles[];
        const expectedProfile1:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription1, workforcePersonWithDescription1, email1, phone1, profileDetail4);
        const expectedProfiles:Profiles[] = [expectedProfile1];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(profiles.length, 1, 'Expected response to contain 1 Profile.');
        assert.isDefined(profiles, 'Expected a list of Profiles.');
        expect(profiles).to.deep.include.any.members(expectedProfiles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all profiles & filter by cost center ID.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles?$expand=_primaryWorkAssignment&$filter=contains(_primaryWorkAssignment/costCenterID,'${costCenter1.costCenterID}')`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profilesList = await ProjectExperienceTestUtil.parseBatchResponse(responseBody, true);
        const profiles = JSON.parse(profilesList) as Profiles[];
        const expectedProfile1:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription1, workforcePersonWithDescription1, email1, phone1, profileDetail4);
        const expectedProfile2:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription3, workforcePersonManagerWithDescription, email3, phone3, profileDetail3);
        const expectedProfile3:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription4, workforcePersonWithDescription3, email5, phone5, profileDetail5);
        const expectedPrimaryWorkAssignment1:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment2, jobDetail4, costCenter1);
        const expectedPrimaryWorkAssignment2:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment4, jobDetail6, costCenter1);
        const expectedPrimaryWorkAssignment3:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment6, jobDetail8, costCenter1);
        expectedProfile1._primaryWorkAssignment = expectedPrimaryWorkAssignment1;
        expectedProfile2._primaryWorkAssignment = expectedPrimaryWorkAssignment2;
        expectedProfile3._primaryWorkAssignment = expectedPrimaryWorkAssignment3;
        const expectedProfiles:Profiles[] = [expectedProfile1, expectedProfile2, expectedProfile3];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isAtLeast(profiles.length, 3, 'Expected response to contain 3 Profiles.');
        assert.isDefined(profiles, 'Expected a list of Profiles.');
        expect(profiles).to.deep.include.any.members(expectedProfiles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a profile.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles(${workforcePersonWithDescription1.ID})`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profiles = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as Profiles;
        const expectedProfile:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription1, workforcePersonWithDescription1, email1, phone1, profileDetail4);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profiles, 'Expected a Profile.');
        expect(profiles).to.deep.equal(expectedProfile);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a profile with expanded primary work assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles(${workforcePersonWithDescription1.ID})?$expand=_primaryWorkAssignment`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profiles = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as Profiles;
        const expectedProfile:Profiles = ProjectExperienceTestUtil.prepareProfile(employeeHeaderWithDescription1, workforcePersonWithDescription1, email1, phone1, profileDetail4);
        const expectedPrimaryWorkAssignment:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment2, jobDetail4, costCenter1);
        expectedProfile._primaryWorkAssignment = expectedPrimaryWorkAssignment;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profiles, 'Expected a Profile.');
        expect(profiles).to.deep.equal(expectedProfile);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a profile with expanded skill assignment.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles(${workforcePersonWithDescription1.ID})?$expand=_skillAssignments`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profiles = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as Profiles;
        const expectedSkillAssignment1:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription1, skillWithDescription1, setOneProficiencyLevel1);
        const expectedSkillAssignment2:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription3, skillWithDescription2, setTwoProficiencyLevel1);
        const expectedSkillAssignments:SkillAssignments[] = [expectedSkillAssignment1, expectedSkillAssignment2];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profiles, 'Expected a Profile.');
        expect(profiles._skillAssignments).to.deep.include.any.members(expectedSkillAssignments);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a profile with expanded external work experience.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles(${workforcePersonWithDescription1.ID})?$expand=_externalWorkExperience`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profiles = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as Profiles;
        const expectedExternalWorkExperience:ExternalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperience(externalWorkExperience1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profiles, 'Expected a Profile.');
        expect(profiles._externalWorkExperience).to.deep.include.any.members([expectedExternalWorkExperience]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a profile with expanded external work experience and its skill assignments.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles(${workforcePersonManagerWithDescription.ID})?$expand=_externalWorkExperience($expand=_skillAssignments)`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profiles = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as Profiles;
        const expectedExternalWorkExperience:ExternalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignments(externalWorkExperience3, externalWorkExperienceSkills31, skillWithDescription1, setOneProficiencyLevel1);
        const actualExternalWorkExperience:ExternalWorkExperience[] = profiles._externalWorkExperience!;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(actualExternalWorkExperience.length, 1, 'Expected Profile to contain 1 ExternalWorkExperience.');
        assert.isDefined(profiles, 'Expected a Profile.');
        expect(actualExternalWorkExperience[0]._skillAssignments).to.deep.include.any.members([expectedExternalWorkExperience]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a profile with all sub entities expanded.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchGetPayload(`Profiles(${workforcePersonWithDescription3.ID})?$expand=_primaryWorkAssignment,_skillAssignments,_externalWorkExperience($expand=_skillAssignments)`);
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        const responseBody = response.data;
        const profiles = JSON.parse(await ProjectExperienceTestUtil.parseBatchResponse(responseBody, false)) as Profiles;
        const expectedPrimaryWorkAssignment:PrimaryWorkAssignment = ProjectExperienceTestUtil.preparePrimaryWorkAssignment(workAssignment6, jobDetail8, costCenter1);
        const expectedSkillAssignment1:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription5, skillWithDescription1, setOneProficiencyLevel1);
        const expectedSkillAssignment2:SkillAssignments = ProjectExperienceTestUtil.prepareSkillAssignments(skillAssignmentWithDescription6, skillWithDescription2, setTwoProficiencyLevel1);
        const expectedSkillAssignments:SkillAssignments[] = [expectedSkillAssignment1, expectedSkillAssignment2];
        const expectedExternalWorkExperience:ExternalWorkExperience = ProjectExperienceTestUtil.prepareExternalWorkExperience(externalWorkExperience4);
        expectedExternalWorkExperience._skillAssignments = undefined;
        const expectedExternalWorkExperienceSkills:ExternalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignments(externalWorkExperience4, externalWorkExperienceSkills41, skillWithDescription1, setOneProficiencyLevel1);
        const expectedExternalWorkExperienceSkills2:ExternalWorkExperienceSkillAssignments = ProjectExperienceTestUtil.prepareExternalWorkExperienceSkillAssignments(externalWorkExperience4, externalWorkExperienceSkills42, skillWithDescription2, setTwoProficiencyLevel2);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profiles, 'Expected a Profile.');
        expect(profiles._primaryWorkAssignment).to.deep.equal(expectedPrimaryWorkAssignment);
        expect(profiles._skillAssignments).to.deep.include.any.members(expectedSkillAssignments);
        expect(profiles._externalWorkExperience![0]._skillAssignments!).to.deep.include.any.members([expectedExternalWorkExperienceSkills, expectedExternalWorkExperienceSkills2]);
        profiles._externalWorkExperience![0]._skillAssignments = undefined;
        expect(profiles._externalWorkExperience).to.deep.include.any.members([expectedExternalWorkExperience]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create a profile.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('POST', 'Profiles', '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a profile.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PATCH', `Profiles(${workforcePersonWithDescription1.ID})`, '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Upsert a profile.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('PUT', `Profiles(${workforcePersonWithDescription1.ID})`, '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete a profile.'() {
        const requestBody = ProjectExperienceTestUtil.prepareBatchPayload('DELETE', `Profiles(${workforcePersonWithDescription1.ID})`, '{}');
        const response = await this.postBatch(requestBody);
        this.responses.push(response);
        assert.equal(await ProjectExperienceTestUtil.parseBatchResponseStatus(response.data), '403 Forbidden');
        assert.equal(response.status, 200, 'Expected status code should be 200.');
    }
}
