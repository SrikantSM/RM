import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { TEST_TIMEOUT, testEnvironment } from '../../utils';

let publicAPIAssignmentClient: any;
let assignmentUserClient: any;

@suite
export class AssignmentAPIAuthorizationTest {

    @timeout(TEST_TIMEOUT)
    static async before() {
        publicAPIAssignmentClient = await testEnvironment.getAssignmentPublicApiServiceClient();
        assignmentUserClient = await testEnvironment.getAssignmentPublicApiUserFlow();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Technical user flow should work.'() {
        const readAssignment = await publicAPIAssignmentClient.get(
            '/Assignments?$top=5'
        );
        assert.equal(readAssignment.status, 200);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Named user flow should not work.'() {
        const readAssignment = await assignmentUserClient.get(
            '/Assignments?$top=5'
        );
        assert.equal(readAssignment.status, 403);
    }

}
