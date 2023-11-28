import { timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class MyResourcesServiceRepository extends ServiceEndPointsRepository {
    private readonly serviceName: string = 'MyResourcesService';

    private readonly serviceEndPoint: string = `${this.oDataPrefix}/${this.serviceName}`;

    private endPoint: string;

    private rootDraftEndPoint: string = `${this.serviceEndPoint}/ProjectExperienceHeader`;

    public constructor(endPoint: string) {
        super();
        this.endPoint = `${this.serviceEndPoint}/${endPoint}`;
    }

    protected static async prepare() {
        await this.prepareDbRepository();
        await this.prepareApplicationServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'MyResourcesService availability check.'() {
        const response = await ServiceEndPointsRepository.get(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, this.serviceEndPoint);
        this.responses.push(response);
        assert.equal(response.status, 200, 'MyResources service is not available. Expected response status should be 200(Ok).');
    }

    protected async get(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async create(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, this.endPoint, data);
    }

    protected async createDraftEmptyData(ID: string, entity: string, data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${entity}`, data);
    }

    protected async update(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async upsert(additionalURI: string, data: any, header: any) {
        return ServiceEndPointsRepository.putWithBinaryBody(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data, header);
    }

    protected async delete(additionalURI: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, `${this.endPoint}${additionalURI}`);
    }

    protected async enableDraftEdit(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=true)/${this.serviceName}.draftEdit`, { PreserveChanges: true });
    }

    protected async activateDraft(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${this.serviceName}.draftActivate`, {});
    }

    protected async deleteDraft(ID: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)`);
    }

    protected async getWithNoConsultantInDB(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.notInDBSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async getWithoutAuthorization(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async createWithoutAuthorization(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.endPoint, data);
    }

    protected async deleteWithoutAuthorization(additionalURI: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalURI}`);
    }

    protected async updateWithoutAuthorization(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async activateDraftWithoutAuthorization(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${this.serviceName}.draftActivate`, {});
    }
}
