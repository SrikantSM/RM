import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ReplicationSchedulesServiceRepository } from '../../utils/serviceRepository/ReplicationSchedulesService-Repository';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('replicationSchedules')
export class ReplicationSchedulesTest extends ReplicationSchedulesServiceRepository {
    public constructor() {
        super('ReplicationSchedule');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of replication schedules without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of replication schedules with authorization'() {
        const response = await this.get();
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
    }
}
