import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allProjectRoles,
    projectRoleWithDescription1,
    projectRoleWithDescription4,
} from '../../data';
import { createRoleMasterList } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { RoleMasterList } from '../../serviceEntities/myProjectExperienceService/RoleMasterList';

@suite('MyResourcesService/RoleMasterList')
export class MyResourcesServiceRolesTest extends MyResourcesServiceRepository {
    public constructor() { super('RoleMasterList'); }

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
    async 'Get a list of Master Roles.'() {
        const response = await this.get();
        this.responses.push(response);
        const masterRoles = response.data.value as RoleMasterList[];
        const expectedRoleMasterList = allProjectRoles;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(masterRoles, 'Expected a list of Master Roles.');
        assert.isTrue(masterRoles.length >= 3, 'Expected atleast 3 Roles');
        expect(masterRoles).to.deep.include.any.members(expectedRoleMasterList);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Master Roles without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Master Role.'() {
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
    async 'Get a Master Role without authorization.'() {
        const response = await this.getWithoutAuthorization(`('${projectRoleWithDescription1.ID}')`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a Restricted Master Role.'() {
        const response = await this.get(`('${projectRoleWithDescription4.ID}')`);
        this.responses.push(response);
        const role = response.data;
        delete role['@context'];
        delete role['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected a Master Role.');
        expect(role).to.eql(projectRoleWithDescription4);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Role with correct case (using $filter).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$filter=contains(name,'${projectRoleWithDescription1.name}')`);
        this.responses.push(response);
        const role = response.data.value as RoleMasterList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected atleast one Role.');
        expect(role).to.eql([projectRoleWithDescription1]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Role with wrong case (using $filter).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$filter=contains(name,'${projectRoleWithDescription1.name.toLowerCase()}')`);

        this.responses.push(response); const role = response.data.value as RoleMasterList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(role, 'Expected no roles.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Role with correct case (using $search).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$search=${projectRoleWithDescription1.name}`);
        this.responses.push(response);
        const role = response.data.value as RoleMasterList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected atleast one Role.');
        expect(role).to.eql([projectRoleWithDescription1]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get Master Role with wrong case (using $search).'() {
        const response = await this.get(`?$select=ID,code,name,description,roleLifecycleStatus_code&$search=${projectRoleWithDescription1.name.toLowerCase()}`);
        this.responses.push(response);
        const role = response.data.value as RoleMasterList;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(role, 'Expected atleast one Role.');
        expect(role).to.eql([projectRoleWithDescription1]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a Master Role is not allowed.'() {
        const response = await this.create(createRoleMasterList);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a role should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating Master Role is not allowed.'() {
        const response = await this.update(`('${projectRoleWithDescription1.ID}')`, projectRoleWithDescription1);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating role should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting Master Role is not allowed.'() {
        const response = await this.delete(`('${projectRoleWithDescription1.ID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a role should not be possible and expected status code should be 403(Forbidden).');
    }
}
