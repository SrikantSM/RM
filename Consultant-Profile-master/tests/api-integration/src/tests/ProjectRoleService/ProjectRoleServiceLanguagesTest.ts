import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ProjectRoleServiceRepository } from '../../utils/serviceRepository/ProjectRoleService-Repository';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('ProjectRoleService/Languages')
export class ProjectRoleServiceLanguagesTest extends ProjectRoleServiceRepository {
    public constructor() {
        super('Languages');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Languages'() {
        const response = await this.get();
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of Languages with unauthenticated user'() {
        const response = await this.getWithoutAuthentication();
        this.responses.push(response);
        assert.equal(response.status, 401, 'Expected status code to be 401 (Not Authorized).');
    }
}
