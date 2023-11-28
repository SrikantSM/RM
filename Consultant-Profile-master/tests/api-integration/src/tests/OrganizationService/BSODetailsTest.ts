import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { OrganizationServiceRepository } from '../../utils/serviceRepository/OrganizationService-Repository';
import {
    allCostCenters,
    allOrganizationHeaders,
    allOrganizationDetails,
    costCenter1,
} from '../../data';
import { BSODetails } from '../../serviceEntities/organizationService';
import { bsoDetail1, bsoDetail2 } from '../../data/db/organization/BSODetails';
import { createBSODetails, updateBSODetails } from '../../data/service/organizationService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('OrganizationService/BSODetails')
export class ServiceBSODetailsTest extends OrganizationServiceRepository {
    public constructor() {
        super('BSODetails');
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
    async 'Get a list of service organization header with details '() {
        const response = await this.get();
        this.responses.push(response);
        const bsoDetails = response.data.value as BSODetails[];
        const expectResult = [bsoDetail1, bsoDetail2];

        assert.equal(response.status, 200, 'Expected status code should be 200.');
        assert.isDefined(bsoDetails, 'Expected a list of service org code.');
        assert.isTrue(bsoDetails.length >= 2, 'Expected atleast 2 service org code.');
        expect(bsoDetails).to.deep.include.any.members(expectResult);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of service organization header with details without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single service organization header with details'() {
        const response = await this.get(`(costCenter='${bsoDetail1.costCenter}')`);
        this.responses.push(response);
        const headerwithdetail = response.data;
        const expectResult = bsoDetail1;

        delete headerwithdetail['@context'];
        delete headerwithdetail['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(headerwithdetail).to.eql(expectResult);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent service org header with details'() {
        const nonExistingCC = '1710001';
        const response = await this.get(`(costCenter='${nonExistingCC}')`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a service org header with details is not allowed.'() {
        const response = await this.create(createBSODetails);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating service org header with details should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a service org header with details is not allowed.'() {
        const response = await this.update(`('${costCenter1.costCenterID}')`, updateBSODetails);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating service org header with details should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting a service org header with details is not allowed.'() {
        const response = await this.delete(`('${costCenter1.costCenterID}')`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting service org header with details should not be possible and expected status code should be 403(Forbidden).');
    }
}
