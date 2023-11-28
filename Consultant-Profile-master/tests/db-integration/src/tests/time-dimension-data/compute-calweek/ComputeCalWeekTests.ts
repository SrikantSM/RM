import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';
import * as testcase1 from './test-cases/case-1';
import * as testcase2 from './test-cases/case-2';
import { TEST_TIMEOUT } from '../../../utils';
import { DBTestRepository } from '../../../utils/DBTestRepository';

@suite
export class ComputeCalWeekTests extends DBTestRepository {
    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepareDbRepository();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Call ComputeCalWeekProcedure'() {
        const result = await DBTestRepository.computeCalWeekProcedureRepository.callProcedure(
            testcase1.calWeekInput.IV_TIME,
        );
        expect(result).to.eql(testcase1.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Call ComputeCalWeekProcedure 2'() {
        const result = await DBTestRepository.computeCalWeekProcedureRepository.callProcedure(
            testcase2.calWeekInput.IV_TIME,
        );
        expect(result).to.eql(testcase2.expectation);
    }
}
