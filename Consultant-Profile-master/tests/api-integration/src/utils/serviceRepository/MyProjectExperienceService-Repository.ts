import { timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class MyProjectExperienceServiceRepository extends ServiceEndPointsRepository {
    private readonly serviceName: string = 'MyProjectExperienceService';

    private readonly serviceEndPoint: string = `${this.oDataPrefix}/${this.serviceName}`;

    private endPoint: string;

    private rootDraftEndPoint: string = `${this.serviceEndPoint}/MyProjectExperienceHeader`;

    public constructor(endPoint: string) {
        super();
        this.endPoint = `${this.serviceEndPoint}/${endPoint}`;
    }

    protected static async prepare() {
        await this.prepareDbRepository();
        await this.prepareApplicationServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'My Project Experience service availability check.'() {
        const response = await ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantSrvBearerServiceClient, this.serviceEndPoint);
        this.responses.push(response);
        assert.equal(response.status, 200, 'My Project Experience service is not available. Expected response status should be 200(Ok).');
    }

    protected async get(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async create(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, this.endPoint, data);
    }

    protected async createDraftEmptyData(ID: string, entity: string, data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${entity}`, data);
    }

    protected async update(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async upsert(additionalURI: string, data: any, header: any) {
        return ServiceEndPointsRepository.putWithBinaryBody(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data, header);
    }

    protected async delete(additionalURI: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`);
    }

    protected async enableDraftEdit(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=true)/${this.serviceName}.draftEdit`, { PreserveChanges: true });
    }

    protected async activateDraft(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${this.serviceName}.draftActivate`, {});
    }

    protected async deleteDraft(ID: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)`);
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

    protected async upsertWithoutAuthorization(additionalURI: string, data: any, header?: any) {
        return ServiceEndPointsRepository.putWithBinaryBody(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data, header);
    }

    protected async activateDraftWithoutAuthorization(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${this.serviceName}.draftActivate`, {});
    }
}
