import { suite, timeout } from 'mocha-typescript';
import { HealthCheckRepository } from '../../utils/serviceRepository/HealthCheck-Repositoy';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('consultantProfile-integration-srv/actuator/health')
export class IntegrationSrvHealthCheckTest extends HealthCheckRepository {
    public constructor() {
        super(ServiceEndPointsRepository.integrationSrvHealthCheckServiceClient);
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
    }
}
