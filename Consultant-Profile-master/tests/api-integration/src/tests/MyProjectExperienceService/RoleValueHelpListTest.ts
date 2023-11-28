import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allProjectRoles,
    allUnrestrictedProjectRoles,
    projectRoleWithDescription1,
    projectRoleWithDescription4,
} from '../../data';
import { createRoleValueHelpList } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { RoleValueHelpList } from '../../serviceEntities/myProjectExperienceService/RoleValueHelpList';

@suite('MyProjectExperienceService/RoleValueHelpList')
export class RoleValueHelpListTest extends MyProjectExperienceServiceRepository {
    public constructor() { super('RoleValueHelpList'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.projectRoleRepository.insertMany(allProjectRoles);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.projectRoleRepository.deleteMany(allProjectRoles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Value Help Roles.'() {
        const response = await this.get();
        this.responses.push(response);
        const masterRoles = response.data.value as RoleValueHelpList[];
        const expectedRoleMasterList = allUnrestrictedProjectRoles;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(masterRoles, 'Expected a list of Master Roles.');
        assert.isTrue(masterRoles.length >= 3, 'Expected atleast 3 Roles');
        expect(masterRoles).to.deep.include.any.members(expectedRoleMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Value Help Roles without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Value Help Role.'() {
        const response = await this.get(`('${projectRoleWithDescription1.ID}')`);
        this.responses.push(response);
        const role = response.data;
        delete role['@context'];
        delete role['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected a Master Role.');
        expect(role).to.eql(projectRoleWithDescription1);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Value Help Role without authorization.'() {
        const response = await this.getWithoutAuthorization(`('${projectRoleWithDescription1.ID}')`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Restricted Role.'() {
        const response = await this.get(`('${projectRoleWithDescription4.ID}')`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Value Help Role with correct case (using $filter).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$filter=contains(name,'${projectRoleWithDescription1.name}')`);
        this.responses.push(response);
        const role = response.data.value as RoleValueHelpList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected atleast one Skill.');
        expect(role).to.eql([projectRoleWithDescription1]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Value Help Role with wrong case (using $filter).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$filter=contains(name,'${projectRoleWithDescription1.name.toLowerCase()}')`);
        this.responses.push(response);
        const role = response.data.value as RoleValueHelpList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(role, 'Expected no roles.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Value Help Role with correct case (using $search).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$search=${projectRoleWithDescription1.name}`);
        this.responses.push(response);
        const role = response.data.value as RoleValueHelpList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected atleast one Role.');
        expect(role).to.eql([projectRoleWithDescription1]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Value Help Role with wrong case (using $search).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$search=${projectRoleWithDescription1.name.toLowerCase()}`);
        this.responses.push(response);
        const role = response.data.value as RoleValueHelpList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected atleast one Role.');
        expect(role).to.eql([projectRoleWithDescription1]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a Role for Value help is not allowed.'() {
        const response = await this.create(createRoleValueHelpList);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a role should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating Value Help Role is not allowed.'() {
        const response = await this.update(`('${projectRoleWithDescription1.ID}')`, projectRoleWithDescription1);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating role should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting Value Help Role is not allowed.'() {
        const response = await this.delete(`('${projectRoleWithDescription1.ID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a role should not be possible and expected status code should be 403(Forbidden).');
    }
}
