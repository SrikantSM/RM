import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { Skill } from 'test-commons';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allSkills,
    skillWithDescription1,
    skillWithDescription2,
    skillWithDescription3,
    skillWithDescription4,
    allProficiencySet,
} from '../../data';
import { createSkillMasterListAll } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { SkillMasterListAll } from '../../serviceEntities/myProjectExperienceService/SkillMasterListAll';

@suite('MyProjectExperienceService/SkillMasterListAll')
export class SkillMasterListAllTest extends MyProjectExperienceServiceRepository {
    public constructor() { super('SkillMasterListAll'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.proficiencySetRepository.insertMany(allProficiencySet);
        await this.skillRepository.insertMany(allSkills);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.skillRepository.deleteMany(allSkills);
        await this.proficiencySetRepository.deleteMany(allProficiencySet);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Master All Skills.'() {
        const response = await this.get();
        this.responses.push(response);
        const skills = response.data.value as SkillMasterListAll[];
        const expectedSkillMasterList = [skillWithDescription1, skillWithDescription2, skillWithDescription3, skillWithDescription4];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skills, 'Expected a list of Master Skills.');
        assert.isTrue(skills.length >= 4, 'Expected atleast 4 skills');
        expect(this.masterSkillListsToSkills(skills)).to.deep.include.any.members(expectedSkillMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Master All Skills without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Master All Skill.'() {
        const response = await this.get(`('${skillWithDescription1.ID}')`);
        this.responses.push(response);
        const skill = response.data;
        delete skill['@context'];
        const expectedSkillMasterList = [skillWithDescription1];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected a Master Skill.');
        expect(this.masterSkillListToSkill(skill)).to.eql(expectedSkillMasterList[0]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Master All Skill without authorization.'() {
        const response = await this.getWithoutAuthorization(`('${skillWithDescription1.ID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master All Skill with correct case (using $filter).'() {
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code,proficiencySet_ID&$filter=contains(name,'${skillWithDescription1.name}')`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterListAll[];
        const expectedSkillMasterList = skillWithDescription1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected atleast one Skill.');
        expect(this.masterSkillListToSkill(skill[0])).to.eql(expectedSkillMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master All Skill with wrong case (using $filter).'() {
        const skill1Name = skillWithDescription1.name!;
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code,proficiencySet_ID&$filter=contains(name,'${skill1Name.toLowerCase()}')`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterListAll;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(skill, 'Expected no skills.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master All Skill with correct case (using $search).'() {
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code,proficiencySet_ID&$search=${skillWithDescription1.name}`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterListAll[];
        const expectedSkillMasterList = skillWithDescription1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected atleast one Skill.');
        expect(this.masterSkillListToSkill(skill[0])).to.eql(expectedSkillMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master All Skill with wrong case (using $search).'() {
        const skill1Name = skillWithDescription1.name!;
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code,proficiencySet_ID&$search=${skill1Name.toLowerCase()}`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterListAll[];
        const expectedSkillMasterList = skillWithDescription1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected atleast one Skill.');
        expect(this.masterSkillListToSkill(skill[0])).to.eql(expectedSkillMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Restricted Master All Skill with correct case (using $search).'() {
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code,proficiencySet_ID&$search=${skillWithDescription4.name}`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterListAll[];
        const expectedSkillMasterList = skillWithDescription4;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected atleast one Skill.');
        expect(this.masterSkillListToSkill(skill[0])).to.eql(expectedSkillMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating Master All Skill is not allowed.'() {
        const response = await this.create(createSkillMasterListAll);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a master skill should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating Master All Skill is not allowed.'() {
        const response = await this.update(`('${skillWithDescription1.ID}')`, createSkillMasterListAll);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating master skill should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting Master All Skill is not allowed.'() {
        const response = await this.delete(`('${skillWithDescription1.ID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a master skill should not be possible and expected status code should be 403(Forbidden).');
    }

    private masterSkillListToSkill(masterListSkill: SkillMasterListAll) {
        const skill: Skill = {
            ID: masterListSkill.ID,
            name: masterListSkill.name,
            description: masterListSkill.description,
            lifecycleStatus_code: masterListSkill.lifecycleStatus_code,
            proficiencySet_ID: masterListSkill.proficiencySet_ID,
        };
        return skill;
    }

    private masterSkillListsToSkills(masterListSkills: SkillMasterListAll[]) {
        const skills: Skill[] = new Array<Skill>();
        masterListSkills.forEach((masterListSkill) => {
            skills.push(this.masterSkillListToSkill(masterListSkill));
        });
        return skills;
    }
}
