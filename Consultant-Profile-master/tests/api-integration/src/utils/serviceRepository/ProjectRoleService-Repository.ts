import { timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class ProjectRoleServiceRepository extends ServiceEndPointsRepository {
    private readonly serviceName: string = 'ProjectRoleService';

    private readonly serviceEndPoint: string = `${this.oDataPrefix}/${this.serviceName}`;

    private endPoint: string;

    private rootDraftEndPoint: string = `${this.serviceEndPoint}/Roles`;

    public constructor(endPoint: string, private readonly textEndPoint: string = '') {
        super();
        this.endPoint = `${this.serviceEndPoint}/${endPoint}`;
    }

    protected static async prepare() {
        await this.prepareDbRepository();
        await this.prepareApplicationServiceClient();
        await this.prepareHealthCheckServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'ProjectRole service availability check.'() {
        const response = await ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.serviceEndPoint);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Project role service is not available. Expected response status should be 200(Ok).');
    }

    protected async get(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async create(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, this.endPoint, data);
    }

    protected async update(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async delete(additionalURI: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}${additionalURI}`);
    }

    protected async createText(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.serviceEndPoint}/${this.textEndPoint}`, data);
    }

    protected async createRoleWithDialog(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}/ProjectRoleService.createRoleWithDialog`, data);
    }

    protected async restrict(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}(ID=${ID},IsActiveEntity=true)/${this.serviceName}.restrict`, {});
    }

    protected async unrestrict(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.endPoint}(ID=${ID},IsActiveEntity=true)/${this.serviceName}.removeRestriction`, {});
    }

    protected async enableDraftEdit(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=true)/${this.serviceName}.draftEdit`, { PreserveChanges: true });
    }

    protected async activateDraft(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${this.serviceName}.draftActivate`, {});
    }

    protected async deleteDraft(ID: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.configExpertSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)`);
    }

    protected async getWithoutAuthorization(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async getWithoutAuthentication(additionalUri: string = '') {
        return ServiceEndPointsRepository.get(ServiceEndPointsRepository.srvHealthCheckServiceClient, `${this.endPoint}${additionalUri}`);
    }

    protected async createWithoutAuthorization(data: any) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, this.endPoint, data);
    }

    protected async deleteWithoutAuthorization(additionalURI: string) {
        return ServiceEndPointsRepository.delete(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`);
    }

    protected async updateWithoutAuthorization(additionalURI: string, data: any) {
        return ServiceEndPointsRepository.patch(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}${additionalURI}`, data);
    }

    protected async activateDraftWithoutAuthorization(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.rootDraftEndPoint}(ID=${ID},IsActiveEntity=false)/${this.serviceName}.draftActivate`, {});
    }

    protected async restrictWithoutAuthorization(ID: string) {
        return ServiceEndPointsRepository.post(ServiceEndPointsRepository.consultantSrvBearerServiceClient, `${this.endPoint}(ID=${ID},IsActiveEntity=true)/${this.serviceName}.restrict`, {});
    }
}
