import {
    suite, timeout, test,
} from 'mocha-typescript';
import { assert, expect } from 'chai';
import { ProficiencyLevel } from 'test-commons';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allProficiencyLevel,
    allProficiencySet,
    setOneProficiencyLevel1,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProficiencyLevels } from '../../serviceEntities/myProjectExperienceService/ProficiencyLevels';
import { createProficiencyLevel } from '../../data/service/myProjectExperienceService/ProficiencyLevels';

@suite('MyProjectExperienceService/ProficiencyLevels')
export class ProficiencyLevelsTest extends MyProjectExperienceServiceRepository {
    public constructor() { super('ProficiencyLevels'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.proficiencySetRepository.insertMany(allProficiencySet);
        await this.proficiencyLevelRepository.insertMany(allProficiencyLevel);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.proficiencySetRepository.deleteMany(allProficiencySet);
        await this.proficiencyLevelRepository.deleteMany(allProficiencyLevel);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Proficiency Levels.'() {
        const response = await this.get();
        this.responses.push(response);
        const proficiencyLevels = response.data.value as ProficiencyLevels[];
        const expectedProficiencyLevels = allProficiencyLevel;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(proficiencyLevels, 'Expected a list of Proficiency Levels.');
        assert.isTrue(proficiencyLevels.length >= 8, 'Expected at least 8 Proficiency Levels');
        expect(proficiencyLevels).to.deep.include.any.members(this.proficiencyLevelsDAOToDTO(expectedProficiencyLevels));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Proficiency Levels without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Proficiency Level.'() {
        const response = await this.get(`(${setOneProficiencyLevel1.ID})`);
        this.responses.push(response);
        const proficiencyLevel = response.data;
        delete proficiencyLevel['@context'];
        delete proficiencyLevel['@metadataEtag'];
        const expectedProficiencyLevel = [proficiencyLevel];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(proficiencyLevel, 'Expected a Proficiency Level.');
        expect(proficiencyLevel).to.eql(this.proficiencyLevelDAOToDTO(expectedProficiencyLevel[0]));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Proficiency Level without authorization.'() {
        const response = await this.getWithoutAuthorization(`(${setOneProficiencyLevel1.ID})`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Proficiency Level with correct case (using $filter).'() {
        const response = await this.get(`?$select=ID,description,name,proficiencySet_ID,rank&$filter=contains(name,'${setOneProficiencyLevel1.name}')`);
        this.responses.push(response);
        const proficiencySet = response.data.value as ProficiencyLevels[];
        const expectedProficiencyLevel = setOneProficiencyLevel1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(proficiencySet, 'Expected at least one Proficiency Level.');
        expect(proficiencySet[0]).to.eql(this.proficiencyLevelDAOToDTO(expectedProficiencyLevel));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Proficiency Level with wrong case (using $filter).'() {
        const proficiencySet1name = setOneProficiencyLevel1.name!;
        const response = await this.get(`?$select=ID,description,name&$filter=contains(name,'${proficiencySet1name.toLowerCase()}')`);
        this.responses.push(response);
        const proficiencyLevel = response.data.value as ProficiencyLevel;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(proficiencyLevel, 'Expected no proficiency Levels.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating Proficiency Level is not allowed.'() {
        const response = await this.create(createProficiencyLevel);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a proficiency level should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating Proficiency Level is not allowed.'() {
        const response = await this.update(`(${setOneProficiencyLevel1.ID})`, createProficiencyLevel);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating proficiency level should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting Proficiency Level is not allowed.'() {
        const response = await this.delete(`(${setOneProficiencyLevel1.ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a proficiency level should not be possible and expected status code should be 403(Forbidden).');
    }

    private proficiencyLevelDAOToDTO(proficiencyLevelEntity: ProficiencyLevel) {
        const proficiencyLevel: ProficiencyLevels = {
            ID: proficiencyLevelEntity.ID,
            name: proficiencyLevelEntity.name,
            description: proficiencyLevelEntity.description,
            rank: proficiencyLevelEntity.rank,
            proficiencySet_ID: proficiencyLevelEntity.proficiencySet_ID,
        };
        return proficiencyLevel;
    }

    private proficiencyLevelsDAOToDTO(proficiencyLevelEntities: ProficiencyLevel[]) {
        const proficiencyLevels: ProficiencyLevels[] = new Array<ProficiencyLevels>();
        proficiencyLevelEntities.forEach((proficiencySet) => {
            proficiencyLevels.push(this.proficiencyLevelDAOToDTO(proficiencySet));
        });
        return proficiencyLevels;
    }
}
