import { ComputeCalWeekOutput, ComputeCalWeekInput } from 'test-commons';

const calWeekInput: ComputeCalWeekInput = {
    IV_TIME: '2020/01/10',
};

const expectation: ComputeCalWeekOutput = {
    EV_START_TIME: '2020-01-06 00:00:00.000000000',
    EV_END_TIME: '2020-01-12 23:59:59.999999900',
    EV_YEAR: '2020',
    EV_QUARTER: 'Q1',
    EV_YEAR_QUARTER: '2020-Q1',
    EV_MONTH: '01',
    EV_YEAR_MONTH: '2020-01',
    EV_WEEK: '02',
    EV_YEAR_WEEK: '2020',
};

export {
    calWeekInput,
    expectation,
};
