import { suite, timeout, test } from 'mocha-typescript';
import { expect, assert } from 'chai';
import { AvailabilityUploadServiceRepository } from '../../utils/serviceRepository/AvailabilityUploadService-Repository';
import {
    createAvailabilitySummaryStatus,
    availabilitySummaryStatus0,
    availabilitySummaryStatus1,
    availabilitySummaryStatus2,
    availabilitySummaryStatus3,
} from '../../data';
import { AvailabilitySummaryStatus } from '../../serviceEntities/availabilityUploadService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';

@suite('AvailabilityUploadService/AvailabilitySummaryStatus')
export class AvailabilityUploadServiceAvailabilitySummaryStatusTest extends AvailabilityUploadServiceRepository {
    public constructor() {
        super('AvailabilitySummaryStatus');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of availabilitysummary status'() {
        const response = await this.get();
        this.responses.push(response);
        const availabilitySummaryStatus = response.data.value as AvailabilitySummaryStatus[];
        const expectedStatusCodes = [availabilitySummaryStatus0, availabilitySummaryStatus1, availabilitySummaryStatus2, availabilitySummaryStatus3];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(availabilitySummaryStatus, 'Expected a list of AvailabilitySummary status code.');
        assert.isTrue(availabilitySummaryStatus.length >= 4, 'Expected 4 AvailabilitySummary status code.');
        expect(this.availabilitySummaryStatusList(availabilitySummaryStatus)).to.deep.include.any.members(expectedStatusCodes);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of availability summary status codes without authorization'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single availability summary status'() {
        const response = await this.get(`(code=${availabilitySummaryStatus1.code})`);
        this.responses.push(response);
        const availabilitySummaryStatus = response.data as AvailabilitySummaryStatus;
        const expectedStatusCode = availabilitySummaryStatus1;
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        expect(this.availabilitySummaryStatusCode(availabilitySummaryStatus)).to.eql(expectedStatusCode);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read a single availability summary status without authorization'() {
        const response = await this.getWithoutAuthorization(`(code=${availabilitySummaryStatus1.code})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Read non-existent availability summary status'() {
        const response = await this.get('(code=5)');
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a Availability summary status is not allowed.'() {
        const response = await this.create(createAvailabilitySummaryStatus);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a availability summary status should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating a availability summary status is not allowed'() {
        const updatePayload = {
            code: 3,
        };
        const response = await this.update(`(code=${availabilitySummaryStatus1.code})`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating availability summary status should not be possible and expected status code should be 403(Forbidden).');
    }

    private availabilitySummaryStatusCode(availabilitySummaryStatusCode: AvailabilitySummaryStatus) {
        const availabilitySummaryStatus: AvailabilitySummaryStatus = {
            code: availabilitySummaryStatusCode.code,
            name: availabilitySummaryStatusCode.name,
            descr: availabilitySummaryStatusCode.descr,
        };
        return availabilitySummaryStatus;
    }

    private availabilitySummaryStatusList(availabilitySummaryStatusList: AvailabilitySummaryStatus[]) {
        const availabilitySummaryStatus: AvailabilitySummaryStatus[] = new Array<AvailabilitySummaryStatus>();
        availabilitySummaryStatusList.forEach((availabilityStatusCode) => {
            availabilitySummaryStatus.push(this.availabilitySummaryStatusCode(availabilityStatusCode));
        });
        return availabilitySummaryStatus;
    }
}
