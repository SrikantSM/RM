import { timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class WorkforceAvailabilityServiceRepository extends ServiceEndPointsRepository {
    private readonly serviceName: string = 'WorkforceAvailabilityService';

    private readonly serviceEndPoint: string = `${this.oDataPrefix}/${this.serviceName}`;

    private endPoint: string;

    public constructor(endPoint: string) {
        super();
        this.endPoint = `${this.serviceEndPoint}/${endPoint}`;
    }

    protected static async prepare() {
        await this.prepareDbRepository();
        await this.prepareWorkforceAvailabilityServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Workforce Availability service availability check.'() {
        const response = await ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, `${this.serviceEndPoint}/$metadata`);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Workforce availability service is not available. Expected response status should be 200(Ok).');
    }

    protected async get(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async getWithoutAuthorization(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async update(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async delete(additionalURI: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, `${this.endPoint}${additionalURI}`);
    }

    protected async create(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, this.endPoint, data);
    }

    protected async put(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async postBatch(requestBody: string = '') {
        const headers = {
            'Content-Type': 'multipart/mixed;boundary=batch-123',
        };
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantProfileXsUaaServiceClient, this.endPoint, requestBody, { headers });
    }

    protected async postBatchWithUnauthorizedBusinessUser(additionalUri: string = '', requestBody: string = '') {
        const headers = {
            'Content-Type': 'multipart/mixed;boundary=batch-123',
        };
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalUri}`, requestBody, { headers });
    }

    protected async postBatchWithUnauthorizedTechnicalUser(additionalUri: string = '', requestBody: string = '') {
        const headers = {
            'Content-Type': 'multipart/mixed;boundary=batch-123',
        };
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.auditLogServiceClient, `${this.endPoint}${additionalUri}`, requestBody, { headers });
    }
}
