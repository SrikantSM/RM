import {
    suite, timeout, test, skip,
} from 'mocha-typescript';
import { assert, expect } from 'chai';
import { Skill } from 'test-commons';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allSkills,
    skillWithDescription1,
    skillWithDescription2,
    skillWithDescription3,
    skillWithDescription4,
    catalogs,
    catalogs2skills,
    allProficiencySet,
    allProficiencyLevel,
} from '../../data';
import { createSkillMasterList } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { Catalogs2Skills, SkillMasterList } from '../../serviceEntities/myProjectExperienceService/SkillMasterList';

@suite('MyResourcesService/SkillMasterList')
export class MyResourcesSkillMasterListTest extends MyResourcesServiceRepository {
    public constructor() { super('SkillMasterList'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.proficiencySetRepository.insertMany(allProficiencySet);
        await this.proficiencyLevelRepository.insertMany(allProficiencyLevel);
        await this.skillRepository.insertMany(allSkills);
        await this.catalogRepository.insertMany(catalogs);
        await this.catalogs2SkillsRepository.insertMany(catalogs2skills);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.catalogRepository.deleteMany(catalogs);
        await this.skillRepository.deleteMany(allSkills);
        await this.proficiencySetRepository.deleteMany(allProficiencySet);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Master Skills.'() {
        const response = await this.get();
        this.responses.push(response);
        const skills = response.data.value as SkillMasterList[];
        const expectedSkillMasterList = [skillWithDescription1, skillWithDescription2, skillWithDescription3];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skills, 'Expected a list of Master Skills.');
        assert.isTrue(skills.length >= 3, 'Expected at least 3 skills');
        expect(this.masterSkillListsToSkills(skills)).to.deep.include.any.members(expectedSkillMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Master Skills without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Master Skill.'() {
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
    async 'Get a Master Skill without authorization.'() {
        const response = await this.getWithoutAuthorization(`('${skillWithDescription1.ID}')`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Skill with correct case (using $filter).'() {
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code,proficiencySet_ID&$filter=contains(name,'${skillWithDescription1.name}')`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterList[];
        const expectedSkillMasterList = skillWithDescription1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected at least one Skill.');
        expect(this.masterSkillListToSkill(skill[0])).to.eql(expectedSkillMasterList);
    }

    // expand is not working as expected, cap issue: https://sap.stackenterprise.co/questions/15841
    @skip
    @test(timeout(TEST_TIMEOUT))
    async 'Get a Master Skill with catalog details.'() {
        const response = await this.get(`('${skillWithDescription1.ID}')?$expand=catalogAssociations`);
        this.responses.push(response);
        const skillData = response.data;
        delete skillData['@context'];
        delete skillData['@metadataEtag'];

        const expectedSkillData = this.prepareExpected();
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(skillData).to.eql(expectedSkillData);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Skill with wrong case (using $filter).'() {
        const skill1Name = skillWithDescription1.name!;
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code&$filter=contains(name,'${skill1Name.toLowerCase()}')`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(skill, 'Expected no skills.');
    }

    // $search on odata query throws sql exception raised cap issue https://github.wdf.sap.corp/cap/issues/issues/7663
    @skip
    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Skill with correct case (using $search).'() {
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code&$search=${skillWithDescription1.name}`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterList[];
        const expectedSkillMasterList = skillWithDescription1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected at least one Skill.');
        expect(this.masterSkillListToSkill(skill[0])).to.eql(expectedSkillMasterList);
    }

    // $search on odata query throws sql exception raised cap issue https://github.wdf.sap.corp/cap/issues/issues/7663
    @skip
    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Skill with wrong case (using $search).'() {
        const skill1Name = skillWithDescription1.name!;
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code&$search=${skill1Name.toLowerCase()}`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterList[];
        const expectedSkillMasterList = skillWithDescription1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(skill, 'Expected atleast one Skill.');
        expect(this.masterSkillListToSkill(skill[0])).to.eql(expectedSkillMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get restricted Master Skill (using $filter).'() {
        const response = await this.get(`?$select=ID,description,name,lifecycleStatus_code&$filter=contains(name,'${skillWithDescription4.name}')`);
        this.responses.push(response);
        const skill = response.data.value as SkillMasterList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(skill, 'Expected no skills.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating Master Skill is not allowed.'() {
        const response = await this.create(createSkillMasterList);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a master skill should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating Master Skill is not allowed.'() {
        const response = await this.update(`('${skillWithDescription1.ID}')`, createSkillMasterList);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating master skill should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting Master Skill is not allowed.'() {
        const response = await this.delete(`('${skillWithDescription1.ID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a master skill should not be possible and expected status code should be 403(Forbidden).');
    }

    private masterSkillListToSkill(masterListSkill: SkillMasterList) {
        const skill: Skill = {
            ID: masterListSkill.ID,
            name: masterListSkill.name,
            description: masterListSkill.description,
            lifecycleStatus_code: masterListSkill.lifecycleStatus_code,
            proficiencySet_ID: masterListSkill.proficiencySet_ID,
        };
        return skill;
    }

    private masterSkillListsToSkills(masterListSkills: SkillMasterList[]) {
        const skills: Skill[] = new Array<Skill>();
        masterListSkills.forEach((masterListSkill) => {
            skills.push(this.masterSkillListToSkill(masterListSkill));
        });
        return skills;
    }

    private prepareSkillsCatalogs() {
        const preparedSkillsCatalogs: Catalogs2Skills = {
            ID: catalogs2skills[0].ID,
            catalog_ID: catalogs[0].ID,
            skill_ID: skillWithDescription1.ID,
        };
        return preparedSkillsCatalogs;
    }

    private prepareSkillsData() {
        const preparedSkillsData: SkillMasterList = {
            ID: skillWithDescription1.ID,
            description: skillWithDescription1.description,
            name: 'SkillName1',
            lifecycleStatus_code: skillWithDescription1.lifecycleStatus_code,
            commaSeparatedAlternativeLabels: null!,
            commaSeparatedCatalogs: '',
            proficiencySet_ID: skillWithDescription1.proficiencySet_ID,
        };
        return preparedSkillsData;
    }

    private prepareExpected() {
        const expectedCatalogs: Catalogs2Skills[] = [];
        const expectedSkillData = this.prepareSkillsData();
        if (catalogs2skills !== undefined) {
            const expectedCatalog = this.prepareSkillsCatalogs();
            expectedCatalogs.push(expectedCatalog);
            expectedSkillData.catalogAssociations = expectedCatalogs;
        }
        return expectedSkillData;
    }
}
