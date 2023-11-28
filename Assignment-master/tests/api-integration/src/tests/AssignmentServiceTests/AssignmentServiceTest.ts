import { suite, test, timeout } from "mocha-typescript";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import {
    TEST_TIMEOUT,
    testEnvironment
} from "../../utils";

@suite
export class AssignmentServiceTest {
    private static assignmentServiceClient: AxiosInstance;

    @timeout(TEST_TIMEOUT)
    static async before() {
        AssignmentServiceTest.assignmentServiceClient = await testEnvironment.getResourceManagerServiceClient();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test Assignment service is available'() {

        const assignmentService = await AssignmentServiceTest.assignmentServiceClient.request({ url: '/' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test Assignment entity is exposed'() {

        const assignmentService = await AssignmentServiceTest.assignmentServiceClient.request({ url: '/Assignments' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test Assignment bucket entity is exposed'() {

        const assignmentService = await AssignmentServiceTest.assignmentServiceClient.request({ url: '/AssignmentBuckets' });

        assert.equal(assignmentService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'non-existing entity access leads to error'() {

        const assignmentService = await AssignmentServiceTest.assignmentServiceClient.request({ url: '/not-existing' });

        assert.isAtLeast(assignmentService.status, 400, 'Expected status code to be at least 400.');
        assert.isBelow(assignmentService.status, 500, 'Expected status code to be below 500.');
    }

}