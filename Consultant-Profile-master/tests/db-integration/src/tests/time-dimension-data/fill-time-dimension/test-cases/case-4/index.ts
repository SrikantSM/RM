import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '04',
    IV_START_TIME: '1994-01-01',
    IV_END_TIME: '1994-01-07',
};

const expectation: FillTimeDimOutput = {
    EV_NUMBER_OF_RECORDS: 2,
};

const timeDimensionData1: TimeDimensionData = {
    DATETIMESTAMP: '1993-12-27 00:00:00.000000000',
    DATE_SQL: '1993-12-27',
    DATETIME_SAP: '19931227000000',
    DATE_SAP: '19931227',
    YEAR: '1993',
    QUARTER: 'Q4',
    MONTH: '12',
    WEEK: '52',
    WEEK_YEAR: '1993',
    DAY_OF_WEEK: '1',
    DAY: '27',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19934',
    CALMONTH: '199312',
    CALWEEK: '199352',
};

const timeDimensionData2: TimeDimensionData = {
    DATETIMESTAMP: '1994-01-03 00:00:00.000000000',
    DATE_SQL: '1994-01-03',
    DATETIME_SAP: '19940103000000',
    DATE_SAP: '19940103',
    YEAR: '1994',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1994',
    DAY_OF_WEEK: '1',
    DAY: '3',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19941',
    CALMONTH: '199401',
    CALWEEK: '199401',
};

const timeDimensionData = [
    timeDimensionData1,
    timeDimensionData2,
];

export {
    fillTimeDimInput,
    expectation,
    timeDimensionData,
};
