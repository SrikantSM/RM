import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '02',
    IV_START_TIME: '1996-12-01 00:00:00.000',
    IV_END_TIME: '1997-02-01 00:00:00.000',
};

const expectation: FillTimeDimOutput = {
    EV_NUMBER_OF_RECORDS: 2,
};

const timeDimensionData1: TimeDimensionData = {
    DATETIMESTAMP: '1996-10-01 00:00:00.000000000',
    DATE_SQL: '1996-10-01',
    DATETIME_SAP: '19961001000000',
    DATE_SAP: '19961001',
    YEAR: '1996',
    QUARTER: 'Q4',
    MONTH: '10',
    WEEK: '40',
    WEEK_YEAR: '1996',
    DAY_OF_WEEK: '2',
    DAY: '1',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19964',
    CALMONTH: '199610',
    CALWEEK: '199640',
};

const timeDimensionData2: TimeDimensionData = {
    DATETIMESTAMP: '1997-01-01 00:00:00.000000000',
    DATE_SQL: '1997-01-01',
    DATETIME_SAP: '19970101000000',
    DATE_SAP: '19970101',
    YEAR: '1997',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1997',
    DAY_OF_WEEK: '3',
    DAY: '1',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19971',
    CALMONTH: '199701',
    CALWEEK: '199701',
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
