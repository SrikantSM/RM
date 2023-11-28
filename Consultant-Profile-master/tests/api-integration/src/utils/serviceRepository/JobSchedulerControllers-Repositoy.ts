import { assert } from 'chai';
import { timeout, test } from 'mocha-typescript';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from './Service-Repository';

export abstract class JobSchedulerControllersRepositoy extends ServiceEndPointsRepository {
    private headersData = {
        headers: {
            'x-sap-job-id': 'jobId',
            'x-sap-job-schedule-id': 'jobSchedulerId',
            'x-sap-job-run-id': 'jobRunId',
            'x-sap-scheduler-host': 'schedulerHost',
            'x-sap-run-at': 'value',
        },
    };

    public constructor(private readonly endPoint: string) {
        super();
    }

    @timeout(TEST_TIMEOUT)
    protected static async before() {
        await this.prepareJobSchedulerServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Invoking the job is possible only by JobScheduler CF Service.'() {
        const createTenantJobsResponse = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.jobSchedulerServiceClient, `${this.endPoint}`, {}, this.headersData);
        assert.equal(createTenantJobsResponse.status, 202, 'Expected status code of createTenantJobs to be 202 (ACCEPTED).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Invoking the job is not possible other than JobScheduler CF Service.'() {
        const createTenantJobsResponse = await ServiceEndPointsRepository.post(ServiceEndPointsRepository.xsUaaServiceClient, `${this.endPoint}`, {}, this.headersData);
        assert.equal(createTenantJobsResponse.status, 403, 'Expected status code of createTenantJobs to be 403 (UnAuthorized).');
    }
}
