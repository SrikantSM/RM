import { suite, test, timeout } from 'mocha-typescript';
import { expect } from 'chai';
import * as testcase1 from './test-cases/case-1';
import * as testcase2 from './test-cases/case-2';
import * as testcase3 from './test-cases/case-3';
import * as testcase4 from './test-cases/case-4';
import * as testcase5 from './test-cases/case-5';
import * as testcase6 from './test-cases/case-6';
import * as testcase7 from './test-cases/case-7';
import * as testcase8 from './test-cases/case-8';
import * as testcase9 from './test-cases/case-9';
import * as testcase10 from './test-cases/case-10';
import { DBTestRepository } from '../../../utils/DBTestRepository';
import { TEST_TIMEOUT } from '../../../utils';

@suite
export class FillTimeDimensionTests extends DBTestRepository {
    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepareDbRepository();
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 01'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase1.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase1.fillTimeDimInput.IV_START_TIME,
            testcase1.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase1.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 02'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase2.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase2.fillTimeDimInput.IV_START_TIME,
            testcase2.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase2.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 03'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase3.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase3.fillTimeDimInput.IV_START_TIME,
            testcase3.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase3.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 04'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase4.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase4.fillTimeDimInput.IV_START_TIME,
            testcase4.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase4.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 05'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase5.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase5.fillTimeDimInput.IV_START_TIME,
            testcase5.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase5.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 06'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase6.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase6.fillTimeDimInput.IV_START_TIME,
            testcase6.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase6.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 07'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase7.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase7.fillTimeDimInput.IV_START_TIME,
            testcase7.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase7.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - 08'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase8.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase8.fillTimeDimInput.IV_START_TIME,
            testcase8.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase8.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'start_time > end_time'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase9.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase9.fillTimeDimInput.IV_START_TIME,
            testcase9.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase9.expectation);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Bucket type - Incorrect'() {
        const result = await DBTestRepository.fillTimeDimensionProcedureRepository.callProcedure(
            testcase10.fillTimeDimInput.IV_TIME_BUCKET_TYPE_CODE,
            testcase10.fillTimeDimInput.IV_START_TIME,
            testcase10.fillTimeDimInput.IV_END_TIME,
        );
        expect(result).to.eql(testcase10.expectation);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        return Promise.all([
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase1.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase2.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase3.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase4.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase5.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase6.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase7.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase8.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase9.timeDimensionData),
            DBTestRepository.timeDimensionDataRepository.deleteMany(testcase10.timeDimensionData),
        ]);
    }
}
