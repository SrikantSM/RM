import { timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class MyAssignmentsServiceRepository extends ServiceEndPointsRepository {
    private readonly serviceName: string = 'MyAssignmentsService';

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
    async 'MyAssignments service availability check.'() {
        const response = await ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantSrvBearerServiceClient, this.serviceEndPoint);
        this.responses.push(response);
        assert.equal(response.status, 200, 'MyAssignments service is not available. Expected response status should be 200(Ok).');
    }

    protected async get(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async create(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, this.endPoint, data);
    }

    protected async update(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async delete(additionalURI: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`);
    }

    protected async getWithoutAuthorization(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async getWithNoConsultantInDB(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.notInDBSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }
}
