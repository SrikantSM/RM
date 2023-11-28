import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test, timeout } from 'mocha-typescript';
import { TEST_TIMEOUT, testEnvironment } from '../../utils';

// This tests the capacity grid service end points

@suite
export class CapacityServiceAuthorizationTest {
    private static capacityServiceClientForResMgr: AxiosInstance;
    private static capacityServiceClientForProjMgr: AxiosInstance;

    @timeout(TEST_TIMEOUT)
    static async before() {

        CapacityServiceAuthorizationTest.capacityServiceClientForResMgr = await testEnvironment.getResourceManagerCapacityServiceClient();
        CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr = await testEnvironment.getProjectManagerCapacityServiceClient();

    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access AssignmentsDetailsForCapacityGrid entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/AssignmentsDetailsForCapacityGrid?');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }

    // @test(timeout(TEST_TIMEOUT))
    // async 'Resource Manager can access AssignmentBucketsYearMonthAggregate entity'() {

    //     const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('/AssignmentBucketsYearMonthAggregate?');
    //     assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    // }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access AssignmentBucketsYearMonthAggregate entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/AssignmentBucketsYearMonthAggregate?');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }

    // @test(timeout(TEST_TIMEOUT))
    // async 'Resource Manager can access AssignmentBucketsYearWeekAggregate entity'() {

    //     const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('/AssignmentBucketsYearWeekAggregate?');
    //     assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    // }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access AssignmentBucketsYearWeekAggregate entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/AssignmentBucketsYearWeekAggregate?');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }

    // @test(timeout(TEST_TIMEOUT))
    // async 'Resource Manager can access AssignmentBucketsPerDay entity'() {

    //     const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('/AssignmentBucketsPerDay?');
    //     assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    // }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access AssignmentBucketsPerDay entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/AssignmentBucketsPerDay?');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }
    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can access RequestDetailsForEachAssignment entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('/RequestDetailsForEachAssignment?');
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access RequestDetailsForEachAssignment entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/RequestDetailsForEachAssignment?');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can access CapacitygridMonthlyUtilizationTemporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('capacityGridMonthlyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access CapacitygridMonthlyUtilizationTemporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/capacityGridMonthlyUtilizationTemporal');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can access CapacityGridHeaderTemporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('/capacityGridHeaderTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access CapacityGridHeaderTemporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/capacityGridHeaderTemporal');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can access Capacitygrid Header KPI Temporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('capacityGridHeaderKPITemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access Capacitygrid Header KPI Temporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('capacityGridHeaderKPITemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Resource Manager can access CapacityGridWeeklyUtilizationTemporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForResMgr.get('capacityGridWeeklyUtilizationTemporal?', { params: { 'sap-language': 'en', 'sap-valid-from': '2021-10-01T00:00:00Z', 'sap-valid-to': '2021-10-31T00:00:00Z' } });
        assert.equal(response.status, 200, 'Expected status code to be 200 (OK)');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Project Manager can NOT access CapacityGridWeeklyUtilizationTemporal entity'() {

        const response = await CapacityServiceAuthorizationTest.capacityServiceClientForProjMgr.get('/capacityGridWeeklyUtilizationTemporal');
        assert.equal(response.status, 403, 'Expected status code to be 403 (NOT_AUTHORIZED)');
    }


    @timeout(TEST_TIMEOUT)
    static async after() {

    }

}