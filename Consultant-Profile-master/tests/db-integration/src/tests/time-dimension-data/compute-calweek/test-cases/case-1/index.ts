import { ComputeCalWeekOutput, ComputeCalWeekInput } from 'test-commons';

const calWeekInput: ComputeCalWeekInput = {
    IV_TIME: '2019-01-01 00:00:00.000',
};

const expectation: ComputeCalWeekOutput = {
    EV_START_TIME: '2018-12-31 00:00:00.000000000',
    EV_END_TIME: '2019-01-06 23:59:59.999999900',
    EV_YEAR: '2018',
    EV_QUARTER: 'Q4',
    EV_YEAR_QUARTER: '2018-Q4',
    EV_MONTH: '12',
    EV_YEAR_MONTH: '2018-12',
    EV_WEEK: '01',
    EV_YEAR_WEEK: '2019',
};

export {
    calWeekInput,
    expectation,
};
