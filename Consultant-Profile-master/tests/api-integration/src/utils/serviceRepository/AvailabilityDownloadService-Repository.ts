import { timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class AvailabilityDownloadServiceRepository extends ServiceEndPointsRepository {
    private readonly serviceName: string = 'AvailabilityFileDownloadService';

    private readonly serviceEndPoint: string = `${this.oDataPrefix}/${this.serviceName}`;

    private endPoint: string;

    public constructor(endPoint: string) {
        super();
        this.endPoint = `${this.serviceEndPoint}/${endPoint}`;
    }

    protected static async prepare() {
        await this.prepareDbRepository();
        await this.prepareApplicationServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'AvailabilityDownload service availability check.'() {
        const response = await ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint);
        this.responses.push(response);
        assert.equal(response.status, 200, 'AvailabilityDownload service is not available. Expected response status should be 200(Ok).');
    }

    protected async get(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async create(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.endPoint, data);
    }

    protected async getWithoutAuthorization(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }
}
