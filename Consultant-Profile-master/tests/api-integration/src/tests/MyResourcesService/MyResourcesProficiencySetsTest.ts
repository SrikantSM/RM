import {
    suite, timeout, test,
} from 'mocha-typescript';
import { assert, expect } from 'chai';
import { ProficiencySet } from 'test-commons';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allProficiencySet,
    allProficiencyLevel,
    proficiencySet1,
    proficiencySet2,
    proficiencySet3,
    proficiencySet4,
    setOneProficiencyLevel1,
    setOneProficiencyLevel2,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProficiencySets } from '../../serviceEntities/myProjectExperienceService/ProficiencySets';
import { createProficiencySet } from '../../data/service/myProjectExperienceService/ProficiencySets';

@suite('MyResourcesService/ProficiencySets')
export class MyResourcesProficiencySetsTest extends MyResourcesServiceRepository {
    public constructor() { super('ProficiencySets'); }

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
    async 'Get a list of Proficiency Sets.'() {
        const response = await this.get();
        this.responses.push(response);
        const proficiencySets = response.data.value as ProficiencySets[];
        const expectedProficiencySets = [proficiencySet1, proficiencySet2, proficiencySet3, proficiencySet4];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(proficiencySets, 'Expected a list of Proficiency Sets.');
        assert.isTrue(proficiencySets.length >= 4, 'Expected at least 4 Proficiency Sets');
        expect(proficiencySets).to.deep.include.any.members(this.proficiencySetsDAOToDTO(expectedProficiencySets));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Proficiency Sets without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Proficiency Set.'() {
        const response = await this.get(`(${proficiencySet1.ID})`);
        this.responses.push(response);
        const proficiencySet = response.data;
        delete proficiencySet['@context'];
        delete proficiencySet['@metadataEtag'];
        const expectedProficiencySet = [proficiencySet];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(proficiencySet, 'Expected a Proficiency Set.');
        expect(proficiencySet).to.eql(this.proficiencySetDAOToDTO(expectedProficiencySet[0]));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Proficiency Set without authorization.'() {
        const response = await this.getWithoutAuthorization(`(${proficiencySet1.ID})`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Proficiency Set with correct case (using $filter).'() {
        const response = await this.get(`?$select=ID,description,name,maxRank&$filter=contains(name,'${proficiencySet1.name}')`);
        this.responses.push(response);
        const proficiencySet = response.data.value as ProficiencySets[];
        const expectedProficiencySet = proficiencySet1;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(proficiencySet, 'Expected at least one Proficiency Set.');
        expect(proficiencySet[0]).to.eql(this.proficiencySetDAOToDTO(expectedProficiencySet));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Proficiency Set with levels.'() {
        const response = await this.get(`(${proficiencySet1.ID})?$expand=proficiencyLevels($orderby=rank)`);
        this.responses.push(response);
        const proficiencySetData = response.data;
        delete proficiencySetData['@context'];
        delete proficiencySetData['@metadataEtag'];

        const expectedProficiencySetData = this.prepareExpected();
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(proficiencySetData).to.eql(expectedProficiencySetData);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Proficiency Set with wrong case (using $filter).'() {
        const proficiencySet1name = proficiencySet1.name!;
        const response = await this.get(`?$select=ID,description,name&$filter=contains(name,'${proficiencySet1name.toLowerCase()}')`);
        this.responses.push(response);
        const proficiencySet = response.data.value as ProficiencySet;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(proficiencySet, 'Expected no proficiency sets.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating Proficiency Set is not allowed.'() {
        const response = await this.create(createProficiencySet);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a proficiency set should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating Proficiency Set is not allowed.'() {
        const response = await this.update(`(${proficiencySet1.ID})`, createProficiencySet);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating proficiency set should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting Proficiency Set is not allowed.'() {
        const response = await this.delete(`(${proficiencySet1.ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a proficiency set should not be possible and expected status code should be 403(Forbidden).');
    }

    private proficiencySetDAOToDTO(proficiencySetEntity: ProficiencySet) {
        const proficiencySet: ProficiencySets = {
            ID: proficiencySetEntity.ID,
            name: proficiencySetEntity.name,
            description: proficiencySetEntity.description,
            maxRank: 2,
        };
        return proficiencySet;
    }

    private proficiencySetsDAOToDTO(proficiencySetEntities: ProficiencySet[]) {
        const proficiencySets: ProficiencySets[] = new Array<ProficiencySets>();
        proficiencySetEntities.forEach((proficiencySet) => {
            proficiencySets.push(this.proficiencySetDAOToDTO(proficiencySet));
        });
        return proficiencySets;
    }

    private prepareProficiencySetData() {
        const preparedProficiencySetData: ProficiencySets = {
            ID: proficiencySet1.ID,
            name: proficiencySet1.name,
            description: proficiencySet1.description,
            maxRank: 2,
            proficiencyLevels: [],
        };
        return preparedProficiencySetData;
    }

    private prepareExpected() {
        const expectedProficiencySetData = this.prepareProficiencySetData();
        expectedProficiencySetData.proficiencyLevels = [setOneProficiencyLevel1, setOneProficiencyLevel2];
        return expectedProficiencySetData;
    }
}
