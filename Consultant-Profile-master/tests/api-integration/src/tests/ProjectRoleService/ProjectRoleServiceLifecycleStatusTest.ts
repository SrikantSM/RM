import { suite, timeout, test } from 'mocha-typescript';
import { expect, assert } from 'chai';
import { ProjectRoleServiceRepository } from '../../utils/serviceRepository/ProjectRoleService-Repository';
import {
    createRoleLifecycleStatus,
    roleLifecycleStatus1,
    roleLifecycleStatus2,
} from '../../data';
import { RoleLifecycleStatus } from '../../serviceEntities/projectRoleService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('ProjectRoleService/RoleLifecycleStatus')
export class ProjectRoleServiceLifecycleStatusTest extends ProjectRoleServiceRepository {
    public constructor() {
        super('RoleLifecycleStatus');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of role lifecycle status'() {
        const response = await this.get();
        this.responses.push(response);
        const roleLifecycleStatus = response.data.value as RoleLifecycleStatus[];
        const expectedStatusCodes = [roleLifecycleStatus1, roleLifecycleStatus2];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(roleLifecycleStatus, 'Expected a list of Role lifecycle status code.');
        assert.isTrue(roleLifecycleStatus.length >= 2, 'Expected 2 Role lifecycle status code.');
        expect(this.roleLifecycleStatusList(roleLifecycleStatus)).to.deep.include.any.members(expectedStatusCodes);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of role lifecycle status codes without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single role lifecycle status'() {
        const response = await this.get(`(code=${roleLifecycleStatus1.code})`);
        this.responses.push(response);
        const roleLifecycleStatus = response.data as RoleLifecycleStatus;
        const expectedStatusCode = roleLifecycleStatus1;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.roleLifecycleStatusCode(roleLifecycleStatus)).to.eql(expectedStatusCode);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single role lifecycle status without authorization'() {
        const response = await this.getWithoutAuthorization(`(code=${roleLifecycleStatus1.code})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent role lifecycle status'() {
        const response = await this.get('(code=3)');
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a Role lifecycle status is not allowed.'() {
        const response = await this.create(createRoleLifecycleStatus);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a role lifecycle status should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a role lifecycle status is not allowed'() {
        const updatePayload = {
            code: 3,
        };
        const response = await this.update(`(code=${roleLifecycleStatus1.code})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating role lifecycle status should not be possible and expected status code should be 403(Forbidden).');
    }

    private roleLifecycleStatusCode(roleLifecycleStatusCode: RoleLifecycleStatus) {
        const roleLifecycleStatus: RoleLifecycleStatus = {
            code: roleLifecycleStatusCode.code,
            name: roleLifecycleStatusCode.name,
            descr: roleLifecycleStatusCode.descr,
        };
        return roleLifecycleStatus;
    }

    private roleLifecycleStatusList(roleLifecycleStatusList: RoleLifecycleStatus[]) {
        const roleLifecycleStatus: RoleLifecycleStatus[] = new Array<RoleLifecycleStatus>();
        roleLifecycleStatusList.forEach((lifecycleStatusCode) => {
            roleLifecycleStatus.push(this.roleLifecycleStatusCode(lifecycleStatusCode));
        });
        return roleLifecycleStatus;
    }
}
