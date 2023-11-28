import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { WorkAssignmentFirstJobDetail } from 'test-commons';
import { DBTestRepository } from '../../utils/DBTestRepository';
import { TEST_TIMEOUT } from '../../utils';
import {
    allJobDetails,
    jobDetail3,
    jobDetail1,
    jobDetail2,
} from './data/jobDetails';
import { allWorkAssignments } from './data/workAssignment';

@suite
export class WorkAssignmentFirstJobDetailTest extends DBTestRepository {
    private static validFrom = 'VALID-FROM';

    private static validTo = 'VALID-TO';

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepareDbRepository();
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.workAssignmentRepository.insertMany(allWorkAssignments);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.workAssignmentRepository.deleteMany(allWorkAssignments);
        await this.sessionVariableProcessor.unSet(WorkAssignmentFirstJobDetailTest.validFrom);
        await this.sessionVariableProcessor.unSet(WorkAssignmentFirstJobDetailTest.validTo);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get JobDetail valid as of today.'() {
        const todayLocalDate = new Date();
        const todayDate = `${todayLocalDate.getFullYear()}-${todayLocalDate.getMonth() + 1}-${todayLocalDate.getDate()}`;
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, todayDate);
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, todayDate);
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail3.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail3.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail3.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail3.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail3.validTo
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 1
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail3.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail3.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal3 data',
        ));
        assert.isUndefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail1.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail1.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail1.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail1.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail1.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail1.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail1.supervisorWorkAssignmentExternalID
            ),
            'UnExpected JobDetilal1 data',
        ));
        assert.isUndefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail2.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail2.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail2.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail2.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail2.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail2.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail1.supervisorWorkAssignmentExternalID
            ),
            'UnExpected JobDetilal2 data',
        ));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get JobDetails for a given timeSlice.'() {
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, '2014-01-01');
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, '2023-12-31');
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail1.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail1.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail1.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail1.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail1.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail1.status_code
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 1
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail1.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal1 data',
        ));
        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail2.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail2.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail2.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail2.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail2.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail2.status_code
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 2
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail2.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal2 data',
        ));
        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail3.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail3.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail3.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail3.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail3.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail3.status_code
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 3
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail3.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal3 data',
        ));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get no JobDetails defined timeSlice does not match any of JobDetail.'() {
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, '1950-01-01');
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, '1960-12-31');
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert(workAssignmentFirstJobDetailResponse.length === 0, 'Expected No JobDetails');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get JobDetails when input_timeSlice/validTo is same as JobDetails/validFrom.'() {
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, '2016-01-01');
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, '2018-09-09');
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail1.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail1.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail1.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail1.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail1.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail1.status_code
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 1
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail1.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal1 data',
        ));
        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail2.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail2.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail2.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail2.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail2.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail2.status_code
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 2
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail2.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal2 data',
        ));
        assert.isUndefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail3.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail3.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail3.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail3.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail3.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail3.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail3.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal3 data',
        ));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get JobDetails when input_timeSlice/validFrom is same as JobDetails/validTo.'() {
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, '2019-11-24');
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, '2020-09-09');
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert.isUndefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail1.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail1.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail1.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail1.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail1.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail1.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail1.supervisorWorkAssignmentExternalID
            ),
            'UnExpected JobDetilal1 data',
        ));
        assert.isUndefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail2.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail2.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail2.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail2.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail2.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail2.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail2.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal2 data',
        ));
        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail3.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail3.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail3.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail3.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail3.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail3.status_code
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 1
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail3.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal3 data',
        ));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get No JobDetails when either only validFrom is defined.'() {
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, '2018-01-01');
        await DBTestRepository.sessionVariableProcessor.unSet(WorkAssignmentFirstJobDetailTest.validTo);
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert(workAssignmentFirstJobDetailResponse.length === 0, 'Expected No JobDetails');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get No JobDetails when either only validTo is defined.'() {
        await DBTestRepository.sessionVariableProcessor.unSet(WorkAssignmentFirstJobDetailTest.validFrom);
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, '2020-01-01');
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert(workAssignmentFirstJobDetailResponse.length === 0, 'Expected No JobDetails');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get JobDetail if validFrom and validTo Values are defined in TimeStamp format.'() {
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, '2018-01-01T00:00:00');
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, '2018-03-01T00:00:00');
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert.isDefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail1.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail1.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail1.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail1.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail1.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail1.status_code
                && workAssignmentFirstJobDetail.JOBDETAILSEQUENCENUMBER === 1
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail1.supervisorWorkAssignmentExternalID
            ),
            'UnExpected JobDetilal3 data',
        ));
        assert.isUndefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail3.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail3.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail3.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail3.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail3.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail3.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail3.supervisorWorkAssignmentExternalID
            ),
            'Expected JobDetilal3 data',
        ));
        assert.isUndefined(workAssignmentFirstJobDetailResponse.find(
            (workAssignmentFirstJobDetail) => (
                workAssignmentFirstJobDetail.ID === jobDetail2.ID
                && workAssignmentFirstJobDetail.PARENT === jobDetail2.parent
                && workAssignmentFirstJobDetail.COSTCENTEREXTERNALID === jobDetail2.costCenterexternalID
                && workAssignmentFirstJobDetail.VALIDFROM === jobDetail2.validFrom
                && workAssignmentFirstJobDetail.VALIDTO === jobDetail2.validTo
                && workAssignmentFirstJobDetail.STATUS_CODE === jobDetail2.status_code
                && workAssignmentFirstJobDetail.SUPERVISORWORKASSIGNMENTEXTERNALID === jobDetail2.supervisorWorkAssignmentExternalID
            ),
            'UnExpected JobDetilal3 data',
        ));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get No JobDetails when vaidTo Date is before validFrom date.'() {
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validFrom, '2019-12-31');
        await DBTestRepository.sessionVariableProcessor.set(WorkAssignmentFirstJobDetailTest.validTo, '2018-01-01');
        const workAssignmentFirstJobDetailResponse: WorkAssignmentFirstJobDetail[] = await DBTestRepository.workAssignmentFirstJobDetailRepository.selectAll();

        assert(workAssignmentFirstJobDetailResponse.length === 0, 'Expected no records');
    }
}
