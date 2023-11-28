import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { ProjectRoleServiceRepository } from '../../utils/serviceRepository/ProjectRoleService-Repository';
import {
    allProjectRoles,
    projectRoleWithDescription1,
    projectRoleWithDescription2,
    projectRoleWithDescription3,
    projectRoleWithDescription4,
} from '../../data';
import { RoleCode } from '../../serviceEntities/projectRoleService';
import { createRoleCode } from '../../data/service/projectRoleService/RoleCode';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('ProjectRoleService/RoleCodes')
export class ProjectRoleServiceRoleCodesTest extends ProjectRoleServiceRepository {
    public constructor() {
        super('RoleCodes');
    }

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
    async 'Get a list of existing role codes'() {
        const response = await this.get();
        this.responses.push(response);
        const roleCodes = response.data.value as RoleCode[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(roleCodes, 'Expected a list of role codes.');
        assert.isDefined(
            roleCodes.find(
                (roleCode) => (
                    roleCode.ID === projectRoleWithDescription1.ID
                    && roleCode.code === projectRoleWithDescription1.code
                ),
            ),
            'Expected role1 should be returned.',
        );
        assert.isDefined(
            roleCodes.find(
                (roleCode) => (
                    roleCode.ID === projectRoleWithDescription2.ID
                    && roleCode.code === projectRoleWithDescription2.code
                ),
            ),
            'Expected role2 should be returned.',
        );
        assert.isDefined(
            roleCodes.find(
                (roleCode) => (
                    roleCode.ID === projectRoleWithDescription3.ID
                    && roleCode.code === projectRoleWithDescription3.code
                ),
            ),
            'Expected role3 should be returned.',
        );
        assert.isDefined(
            roleCodes.find(
                (roleCode) => (
                    roleCode.ID === projectRoleWithDescription4.ID
                    && roleCode.code === projectRoleWithDescription4.code
                ),
            ),
            'Expected role4 should be returned.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of role codes without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single role code'() {
        const response = await this.get(`(ID=${projectRoleWithDescription1.ID})`);
        this.responses.push(response);
        const rolecode = response.data as RoleCode;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            rolecode.ID === projectRoleWithDescription1.ID
            && rolecode.code === projectRoleWithDescription1.code,
            'Expected master role 1.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single role code without authorization'() {
        const response = await this.getWithoutAuthorization(`(ID=${projectRoleWithDescription1.ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $filter and in defined case).'() {
        const response = await this.get(`?$select=ID,code&$filter=contains(code,'${projectRoleWithDescription1.code}')`);
        this.responses.push(response);
        this.assertionsForSearch(response);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $filter and in differrent case).'() {
        if (projectRoleWithDescription1.code !== undefined) {
            const response = await this.get(`?$select=ID,code&$filter=contains(code,'${projectRoleWithDescription1.code.toLowerCase()}')`);
            this.responses.push(response);
            assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        }
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $search and in defined case).'() {
        const response = await this.get(`?$select=ID,code&$search=${projectRoleWithDescription1.code}`);
        this.responses.push(response);
        this.assertionsForSearch(response);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $search and in differrent case).'() {
        if (projectRoleWithDescription1.code !== undefined) {
            const response = await this.get(`?$select=ID,code&$search=${projectRoleWithDescription1.code.toLowerCase()}`);
            this.responses.push(response);
            this.assertionsForSearch(response);
        }
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent role'() {
        const response = await this.get(`(ID=${uuid()})`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a Role code is not allowed.'() {
        const response = await this.create(createRoleCode);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a role code should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a role code is not allowed'() {
        const updatePayload = {
            code: '1234',
        };
        const response = await this.update(`(ID=${projectRoleWithDescription1.ID})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating role code should not be possible and expected status code should be 403(Forbidden).');
    }

    assertionsForSearch(response: AxiosResponse) {
        const roles = response.data.value as RoleCode[];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            roles.find(
                (role) => (
                    role.ID === projectRoleWithDescription1.ID
                    && role.code === projectRoleWithDescription1.code
                ),
            ),
            'Expected role1 should be returned.',
        );
    }
}
