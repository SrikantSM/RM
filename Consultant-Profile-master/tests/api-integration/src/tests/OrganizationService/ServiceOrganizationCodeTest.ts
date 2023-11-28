import { suite, timeout, test } from 'mocha-typescript';
import { expect, assert } from 'chai';
import { OrganizationServiceRepository } from '../../utils/serviceRepository/OrganizationService-Repository';
import {
    ServiceOrganizationCode1,
    ServiceOrganizationCode2,
    allCostCenters,
    allOrganizationHeaders,
    allOrganizationDetails,
} from '../../data';
import { ServiceOrganizationCode } from '../../serviceEntities/organizationService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('OrganizationService/ServiceOrganizationCode')
export class OrganizationServiceOrganizationCodeTest extends OrganizationServiceRepository {
    public constructor() {
        super('ServiceOrganizationCode');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.costCenterRepository.insertMany(allCostCenters);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.costCenterRepository.deleteMany(allCostCenters);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of service organization code '() {
        const response = await this.get();
        this.responses.push(response);
        const serviceOrgCode = response.data.value as ServiceOrganizationCode[];
        const expectedOutput = [ServiceOrganizationCode1, ServiceOrganizationCode2];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(serviceOrgCode, 'Expected a list of service org code.');
        assert.isTrue(serviceOrgCode.length >= 2, 'Expected atleast 2 service org code.');
        expect(this.ServiceOrganizationCodeList(serviceOrgCode)).to.deep.include.any.members(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of service org code without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single service org code'() {
        const response = await this.get(`('${ServiceOrganizationCode1.serviceOrgCode}')`);
        this.responses.push(response);
        const serviceOrgCode = response.data as ServiceOrganizationCode;
        const expectedOutput = ServiceOrganizationCode1;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.ServiceOrganizationCode(serviceOrgCode)).to.eql(expectedOutput);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single service org code without authorization'() {
        const response = await this.getWithoutAuthorization(`('${ServiceOrganizationCode1.serviceOrgCode}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent service org code'() {
        const nonExistingCC = 'Org99';
        const response = await this.get(`('${nonExistingCC}')`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a service org code is not allowed'() {
        const createPayload = {
            serviceOrgCode: 'Org99',
        };
        const response = await this.create(createPayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating service org code should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a service org code is not allowed'() {
        const updatePayload = {
            serviceOrgCode: 'Org99',
        };
        const response = await this.update(`('${ServiceOrganizationCode1.serviceOrgCode}')`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating service org code should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting service org code is not allowed.'() {
        const response = await this.delete(`('${ServiceOrganizationCode1.serviceOrgCode}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a service org code should not be possible and expected status code should be 403(Forbidden).');
    }

    private ServiceOrganizationCode(serviceOrgCode: ServiceOrganizationCode) {
        const serviceOrgCodeOut: ServiceOrganizationCode = {
            serviceOrgCode: serviceOrgCode.serviceOrgCode,
        };
        return serviceOrgCodeOut;
    }

    private ServiceOrganizationCodeList(ServiceOrganizationCodeList: ServiceOrganizationCode[]) {
        const code: ServiceOrganizationCode[] = new Array<ServiceOrganizationCode>();
        ServiceOrganizationCodeList.forEach((serviceOrgCode) => {
            code.push(this.ServiceOrganizationCode(serviceOrgCode));
        });
        return code;
    }
}
