import { timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class ReplicationSchedulesServiceRepository extends ServiceEndPointsRepository {
    private readonly serviceName: string = 'ReplicationScheduleService';

    private readonly serviceEndPoint: string = `${this.oDataPrefix}/${this.serviceName}`;

    private endPoint: string;

    public constructor(endPoint: string) {
        super();
        this.endPoint = `${this.serviceEndPoint}/${endPoint}`;
    }

    @timeout(TEST_TIMEOUT)
    protected static async before() {
        await this.prepareReplicationScheduleServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'ReplicationScheduleService availability check.'() {
        const response = await ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertIntegrationSrvServiceClient, this.serviceEndPoint);
        this.responses.push(response);
        assert.equal(response.status, 200, 'ReplicationScheduleService is not available. Expected response status should be 200(Ok).');
    }

    protected async get(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertIntegrationSrvServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async create(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertIntegrationSrvServiceClient, this.endPoint, data);
    }

    protected async getWithoutAuthorization(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantIntegrationSrvServiceClient, `${this.endPoint}${additionalUri}`);
    }
}
