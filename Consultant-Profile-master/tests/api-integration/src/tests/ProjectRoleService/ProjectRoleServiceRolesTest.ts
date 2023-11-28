import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { ProjectRole } from 'test-commons';
import { ProjectRoleServiceRepository } from '../../utils/serviceRepository/ProjectRoleService-Repository';
import {
    allProjectRoles,
    projectRoleWithDescription1,
    projectRoleWithDescription4,
    roleLifecycleStatus1,
    roleLifecycleStatus2,
    correctCreateRoleWithDialogParameters,
    createRoleWithDialogParametersWithNullCode,
    // createRoleWithDialogParametersWithNullName,
    correctDefaultLanguage,
} from '../../data';
import { Role, ProjectRoleText } from '../../serviceEntities/projectRoleService';
import { getRole, roleWithoutCode, getRoleText } from '../../data/service/projectRoleService/Role';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('ProjectRoleService/Roles')
export class ProjectRoleServiceRolesTest extends ProjectRoleServiceRepository {
    private static createdRoles: Role[] = [];

    public constructor() {
        super('Roles', 'Roles_texts');
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
    async 'Get a list of existing roles'() {
        const response = await this.get();
        this.responses.push(response);
        const roles = response.data.value as Role[];
        const expectedRoles = this.prepareExpectedRoles(allProjectRoles);

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(roles, 'Expected a list of roles.');
        assert.isTrue(roles.length >= 4, 'Expected atleast 4 Roles');
        expect(roles).to.deep.include.any.members(expectedRoles);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of existing roles without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create new role.'() {
        const roleToBeCreated: Role = getRole('1234', 'Role Name', 'Role Description', roleLifecycleStatus1);
        const response = await this.create(roleToBeCreated);
        this.responses.push(response);
        const roleTextToBeCreated: ProjectRoleText = getRoleText(response.data.ID, 'Role Name', 'Role Description', correctDefaultLanguage.code);
        const responseText = await this.createText(roleTextToBeCreated);
        this.responses.push(responseText);
        const responseActive = await this.activateDraft(roleToBeCreated.ID);
        this.responses.push(responseActive);

        assert.equal(responseActive.status, 200, 'Expected status code should be 204 (Created).');
        assert.equal(response.status, 201, 'Expected status code should be 201 (Created).');
        assert.equal(response.data.ID, roleToBeCreated.ID, 'ID of the created role is not a part of the response.');
        assert.equal(response.data.code, roleToBeCreated.code, 'Code of the created role is not a part of the response.');
        assert.equal(response.data.name, roleToBeCreated.name, 'Name of the created role is not a part of the response.');
        assert.equal(response.data.description, roleToBeCreated.description, 'Description of the created role is not a part of the response.');
        assert.equal(response.data.roleLifecycleStatus_code, roleLifecycleStatus1.code, 'RoleLifecycleStatusCode of the created role is not a part of the response.');
        await ServiceEndPointsRepository.projectRoleRepository.deleteOne(roleToBeCreated);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create new role without authorization.'() {
        const roleToBeCreated: Role = getRole('1234', 'Role Name', 'Role Description', roleLifecycleStatus1);
        const response = await this.createWithoutAuthorization(roleToBeCreated);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create duplicate role with the same ID.'() {
        const roleToBeCreated: Role = getRole('3456', 'Role Name', 'Role Description', roleLifecycleStatus1);
        const firstResponse = await this.create(roleToBeCreated);
        this.responses.push(firstResponse);
        const roleTextToBeCreated: ProjectRoleText = getRoleText(firstResponse.data.ID, 'Role Name', 'Role Description', correctDefaultLanguage.code);
        await this.createText(roleTextToBeCreated);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created).');
        const secondResponse = await this.create(roleToBeCreated);
        this.responses.push(secondResponse);
        this.responses.push(await this.activateDraft(roleToBeCreated.ID));

        assert.equal(secondResponse.status, 409, 'Expected status code should be 409 (Conflict), since a duplicate role is being created');
        await ServiceEndPointsRepository.projectRoleRepository.deleteOne(roleToBeCreated);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create duplicate role with the same Role Code.'() {
        const firstRole: Role = getRole('FirC', 'Role Name', 'Role Description', roleLifecycleStatus1);
        const duplicateRole: Role = getRole('FirC', 'Role Name', 'Role Description', roleLifecycleStatus1);
        const firstResponse = await this.create(firstRole);
        this.responses.push(firstResponse);
        const roleTextToBeCreated: ProjectRoleText = getRoleText(firstResponse.data.ID, 'Role Name', 'Role Description', correctDefaultLanguage.code);
        await this.createText(roleTextToBeCreated);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');
        this.responses.push(await this.activateDraft(firstRole.ID));

        const secondResponse = await this.create(duplicateRole);
        this.responses.push(secondResponse);
        const roleTextToBeCreated2: ProjectRoleText = getRoleText(secondResponse.data.ID, 'Role Name', 'Role Description', correctDefaultLanguage.code);
        await this.createText(roleTextToBeCreated2);
        await this.activateDraft(roleTextToBeCreated2.ID_texts);
        assert.equal(secondResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const activationResponse = await this.activateDraft(duplicateRole.ID);
        this.responses.push(activationResponse);
        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since a duplicate role is being created');

        await ServiceEndPointsRepository.projectRoleRepository.deleteOne(firstRole);
        const deleteResponse = await this.delete(`(ID=${duplicateRole.ID},IsActiveEntity=false)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 204, 'Expected status code should be 204 (No Content), since deleting a draft of a role is allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (longer than defined length) code.'() {
        const roleToBeCreated: Role = getRole('long code', 'Test Role', 'Test role\'s description', roleLifecycleStatus1);
        const response = await this.create(roleToBeCreated);
        this.responses.push(response);

        assert.equal(response.status, 400, 'Expected status code should be 400 (Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (empty string) code'() {
        const roleToBeCreated: Role = getRole('', 'Test Role', 'Test role\'s description', roleLifecycleStatus1);

        const firstResponse = await this.create(roleToBeCreated);
        this.responses.push(firstResponse);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(roleToBeCreated.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400 (Bad Request).');
        assert.equal(draftActivateResponse.data.error.details[0].message, 'Enter a valid code.');

        const deleteResponse = await this.delete(`(ID=${roleToBeCreated.ID},IsActiveEntity=false)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 204, 'Expected status code should be 204 (No Content), since deleting a draft of a role is allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (string with only spaces) code'() {
        const roleToBeCreated: Role = getRole('  ', 'Test Role', 'Test role\'s description', roleLifecycleStatus1);
        const firstResponse = await this.create(roleToBeCreated);
        this.responses.push(firstResponse);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(roleToBeCreated.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400 (Bad Request).');
        assert.equal(draftActivateResponse.data.error.details[0].message, 'Enter a valid code.');

        const deleteResponse = await this.delete(`(ID=${roleToBeCreated.ID},IsActiveEntity=false)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 204, 'Expected status code should be 204 (No Content), since deleting a draft of a role is allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role without code'() {
        const firstResponse = await this.create(roleWithoutCode);
        this.responses.push(firstResponse);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(roleWithoutCode.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400 (Bad Request).');

        const deleteResponse = await this.delete(`(ID=${roleWithoutCode.ID},IsActiveEntity=false)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 204, 'Expected status code should be 204 (No Content), since deleting a draft of a role is allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (longer than defined length) name.'() {
        const roleToBeCreated: Role = getRole('code', 'Test Role Name is Longer Than Expected', 'Test role\'s description', roleLifecycleStatus1);
        const response = await this.create(roleToBeCreated);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code should be 400 (Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (longer than defined length) description.'() {
        const longString: string = 'posyKQRrJJRViDWVZw2QWDvSdG7ymCmFs7NY8MHA5CfHcalJ8dqs3XnyDj3yt1zC38Y4YY1VpELuE33VkaCYY8pYEVrTwjZPjWhlLsDhzePw4mrOmmL8hRewOA9Cyyc7y6eyEVpGm5r1UNIKVwGT78E4PhPASkcTonE339e9SHn5VW36kv7htsSEoZVNyvL9ueo4kXdfjFxkHbZqbipDF71ifJPn8hp9SIQ3Dp6P57ZJzKSLrhkOB1Zj5bRJ5GrA';
        const roleToBeCreated: Role = getRole('code', 'Role Name', longString, roleLifecycleStatus1);
        const response = await this.create(roleToBeCreated);
        this.responses.push(response);

        assert.equal(response.status, 400, 'Expected status code should be 400 (Bad Request).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (string with special characters) code'() {
        const roleToBeCreated: Role = getRole('T0%E', 'Test Role', 'Test role\'s description', roleLifecycleStatus1);
        const firstResponse = await this.create(roleToBeCreated);
        this.responses.push(firstResponse);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(roleToBeCreated.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400 (Bad Request).');
        assert.equal(draftActivateResponse.data.error.details[0].message, 'Enter a valid code.');

        const deleteResponse = await this.delete(`(ID=${roleToBeCreated.ID},IsActiveEntity=false)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 204, 'Expected status code should be 204 (No Content), since deleting a draft of a role is allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (empty string) name'() {
        const roleToBeCreated: Role = getRole('R1', '', 'Test role\'s description', roleLifecycleStatus1);

        const firstResponse = await this.create(roleToBeCreated);
        this.responses.push(firstResponse);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(roleToBeCreated.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400 (Bad Request), since a role with invalid name is being created');

        const deleteResponse = await this.delete(`(ID=${roleToBeCreated.ID},IsActiveEntity=false)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 204, 'Expected status code should be 204 (No Content), since deleting a draft of a role is allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role with invalid (string with only spaces) name'() {
        const roleToBeCreated: Role = getRole('R2', '  ', 'Test role\'s description', roleLifecycleStatus1);
        const firstResponse = await this.create(roleToBeCreated);
        this.responses.push(firstResponse);
        assert.equal(firstResponse.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(roleToBeCreated.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400 (Bad Request), since a role with invalid name is being created');

        const deleteResponse = await this.delete(`(ID=${roleToBeCreated.ID},IsActiveEntity=false)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 204, 'Expected status code should be 204 (No Content), since deleting a draft of a role is allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single role'() {
        const response = await this.get(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(response.data.ID, projectRoleWithDescription1.ID, 'ID of the role is not a part of the response.');
        assert.equal(response.data.code, projectRoleWithDescription1.code, 'Code of the role is not a part of the the response.');
        assert.equal(response.data.name, projectRoleWithDescription1.name, 'Name of the role is not a part of the response.');
        assert.equal(response.data.description, projectRoleWithDescription1.description, 'Description of the role is not a part of the response.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single role without authorization'() {
        const response = await this.getWithoutAuthorization(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on name (using $filter and in defined case).'() {
        const response = await this.get(`?$select=ID,code,name,description&$filter=contains(name,'${projectRoleWithDescription1.name}')`);
        this.responses.push(response);
        this.assertionsForSearch(response);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on name (using $filter and in differrent case).'() {
        const response = await this.get(`?$select=ID,code,name,description&$filter=contains(name,'${projectRoleWithDescription1.name.toLowerCase()}')`);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on name (using $search and in defined case).'() {
        const response = await this.get(`?$select=ID,code,name,description&$search=${projectRoleWithDescription1.name}`);
        this.responses.push(response);
        this.assertionsForSearch(response);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on name (using $search and in differrent case).'() {
        const response = await this.get(`?$select=ID,code,name,description&$search=${projectRoleWithDescription1.name.toLowerCase()}`);
        this.responses.push(response);
        this.assertionsForSearch(response);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $search and in differrent case).'() {
        if (projectRoleWithDescription1.code !== undefined) {
            const response = await this.get(`?$select=ID,code,name,description&$search=${projectRoleWithDescription1.code.toLowerCase()}`);
            this.responses.push(response);
            this.assertionsForSearch(response);
        }
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $filter and in defined case).'() {
        const response = await this.get(`?$select=ID,code,name,description&$filter=contains(code,'${projectRoleWithDescription1.code}')`);
        this.responses.push(response);
        this.assertionsForSearch(response);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $filter and in differrent case).'() {
        if (projectRoleWithDescription1.code !== undefined) {
            const response = await this.get(`?$select=ID,code,name,description&$filter=contains(code,'${projectRoleWithDescription1.code.toLowerCase()}')`);
            this.responses.push(response);
            assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        }
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Search role based on code (using $search and in defined case).'() {
        const response = await this.get(`?$select=ID,code,name,description&$search=${projectRoleWithDescription1.code}`);
        this.responses.push(response);
        this.assertionsForSearch(response);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent role'() {
        const response = await this.get(`(ID=${uuid()},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role code'() {
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const roleTextToBeCreated: ProjectRoleText = getRoleText(projectRoleWithDescription1.ID, projectRoleWithDescription1.name, 'API-Project Role Description.', correctDefaultLanguage.code);
        await this.createText(roleTextToBeCreated);
        const updatePayload = {
            code: '1234',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const response = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(response);
        const role = response.data as Role;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(role.ID, projectRoleWithDescription1.ID, 'Error in updating role');
        assert.equal(role.code, updatePayload.code, 'Error in updating role code.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role code without authorization'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            code: '1234',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const response = await this.activateDraftWithoutAuthorization(projectRoleWithDescription1.ID);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with duplicate code'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            code: 'R2C2',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);

        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since a duplicate role is being created');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with a code of empty string'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            code: '',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);

        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since role code cannot be empty');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with a code having just empty spaces'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            code: '  ',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);
        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since role code cannot have empty spaces');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with a code having special characters'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            code: 'R2%2',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);

        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since special characters are not permitted in role code');
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role name(Changes should not be reflect, Since text table is not updated)'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            name: 'New Name',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const response = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(response);
        const role = response.data as Role;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(role.ID, projectRoleWithDescription1.ID, 'Error in updating role');
        assert.notEqual(role.name, updatePayload.name, 'Error in updating role name.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with a name as empty string'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            name: '',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);

        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since role name cannot be empty');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with a name as just empty spaces'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            name: '  ',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);

        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since role name cannot have just empty spaces');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with a name with forbidden characters'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            name: '<script>',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);
        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since role name cannot have forbidden characters');
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role with a description with forbidden characters'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            description: 'New Description<script>',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const activationResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(activationResponse);

        assert.equal(activationResponse.status, 400, 'Expected status code should be 400 (Bad Request), since role description cannot have forbidden characters');
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role name without authorization'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            name: 'New Name',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const response = await this.activateDraftWithoutAuthorization(projectRoleWithDescription1.ID);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role description(Changes should not be reflect, Since text table is not updated)'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            description: 'New Description',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const response = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(response);
        const role = response.data as Role;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.equal(role.ID, projectRoleWithDescription1.ID, 'Error in updating role');
        assert.notEqual(role.description, updatePayload.description, 'Error in updating role description.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update a role description without authorization'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const updatePayload = {
            description: 'New Description',
        };
        this.responses.push(await this.update(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=false)`, updatePayload));

        const response = await this.activateDraftWithoutAuthorization(projectRoleWithDescription1.ID);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Delete a role'() {
        const deleteResponse = await this.delete(`(ID=${projectRoleWithDescription1.ID},IsActiveEntity=true)`);
        this.responses.push(deleteResponse);
        assert.equal(deleteResponse.status, 405, 'Expected status code should be 405 (Method Not Allowed), since deleting a role is not allowed');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Restrict role without Authorization'() {
        const actionResponse = await this.restrictWithoutAuthorization(projectRoleWithDescription1.ID);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 403, 'Expected status code of role restriction to be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Restrict existing role'() {
        await this.activateDraft(projectRoleWithDescription1.ID);
        const actionResponse = await this.restrict(projectRoleWithDescription1.ID);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 200, 'Expect status code of restriction action to be 200 (OK)');
        assert.equal(actionResponse.data.roleLifecycleStatus_code, roleLifecycleStatus2.code, 'Role lifecycle status should be restricted (1)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Restrict already restricted role'() {
        const actionResponse = await this.restrict(projectRoleWithDescription4.ID);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 409, 'Expect status code of restriction action to be 409 as role is already restricted');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Restrict draft role'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const actionResponse = await this.restrict(projectRoleWithDescription1.ID);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 409, 'Expect status code of restriction action to be 409 as role has active draft');
        this.responses.push(await this.activateDraft(projectRoleWithDescription1.ID));
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unrestrict restricted role (removeRestriction)'() {
        const actionResponse = await this.unrestrict(projectRoleWithDescription4.ID);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 200, 'Expect status code of unrestriction action to be 200 (OK)');
        assert.equal(actionResponse.data.roleLifecycleStatus_code, roleLifecycleStatus1.code, 'Role attribute lifecycle');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unrestrict already unrestricted role (removeRestriction)'() {
        const actionResponse = await this.unrestrict(projectRoleWithDescription4.ID);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 409, 'Expect status code of unrestriction action to be 409 as role is already unrestricted');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Unrestrict draft role (removeRestriction)'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const actionResponse = await this.restrict(projectRoleWithDescription1.ID);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 409, 'Expect status code of unrestriction action to be 409 as role has active draft');
        this.responses.push(await this.activateDraft(projectRoleWithDescription1.ID));
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role using Create dialog with correct data'() {
        const actionResponse = await this.createRoleWithDialog(correctCreateRoleWithDialogParameters);
        this.responses.push(actionResponse);
        ProjectRoleServiceRolesTest.createdRoles.push({ ID: actionResponse.data.ID } as ProjectRole);
        const response = await this.get(`(ID=${actionResponse.data.ID},IsActiveEntity=false)`);
        this.responses.push(response);
        assert.equal(actionResponse.status, 200, 'Expected status code of role creation to be 200 (OK).');
        assert.equal(response.status, 200, 'Expected status code of role reading to be 200 (OK).');
        this.responses.push(await this.deleteDraft(actionResponse.data.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create role using Create dialog with Null Role code'() {
        const actionResponse = await this.createRoleWithDialog(createRoleWithDialogParametersWithNullCode);
        this.responses.push(actionResponse);
        assert.equal(actionResponse.status, 400, 'Expected status code of role creation to be 400 (BAD REQUEST).');
        this.responses.push(await this.deleteDraft(actionResponse.data.ID));
    }

    // Uncommented after this CAP issue is resolved (https://github.tools.sap/cap/issues/issues/12888)
    // @test(timeout(TEST_TIMEOUT))
    // async 'Create role using Create dialog with Null Role Name'() {
    //     const actionResponse = await this.createRoleWithDialog(createRoleWithDialogParametersWithNullName);
    //     this.responses.push(actionResponse);
    //     assert.equal(actionResponse.status, 400, 'Expected status code of role creation to be 400 (BAD REQUEST).');
    //     this.responses.push(await this.deleteDraft(actionResponse.data.ID));
    // }

    private prepareExpectedRoles(roles: ProjectRole[]) {
        const expectedRoles: Role[] = [];
        roles.forEach((role) => {
            expectedRoles.push(this.prepareExpectedRole(role));
        });
        return expectedRoles;
    }

    private prepareExpectedRole(role: ProjectRole) {
        const expectedRole: Role = {
            HasActiveEntity: false,
            HasDraftEntity: false,
            ID: role.ID,
            IsActiveEntity: true,
            code: role.code,
            createdAt: null!,
            description: role.description,
            modifiedAt: null!,
            modifiedBy: null!,
            name: role.name,
            roleLifecycleStatus_code: role.roleLifecycleStatus_code,
        };
        return expectedRole;
    }

    assertionsForSearch(response: AxiosResponse) {
        const roles = response.data.value;
        const role = roles[0];
        delete role['@id'];

        const expectedRole = {
            ID: projectRoleWithDescription1.ID,
            code: projectRoleWithDescription1.code,
            name: projectRoleWithDescription1.name,
            description: projectRoleWithDescription1.description,
            IsActiveEntity: true,
        };

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(role).to.eql(expectedRole);
    }
}
