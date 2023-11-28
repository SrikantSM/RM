import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '03',
    IV_START_TIME: '1990/10/1',
    IV_END_TIME: '1990/11/1',
};

const expectation: FillTimeDimOutput = {
    EV_NUMBER_OF_RECORDS: 2,
};

const timeDimensionData1: TimeDimensionData = {
    DATETIMESTAMP: '1990-10-01 00:00:00.000000000',
    DATE_SQL: '1990-10-01',
    DATETIME_SAP: '19901001000000',
    DATE_SAP: '19901001',
    YEAR: '1990',
    QUARTER: 'Q4',
    MONTH: '10',
    WEEK: '40',
    WEEK_YEAR: '1990',
    DAY_OF_WEEK: '1',
    DAY: '1',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19904',
    CALMONTH: '199010',
    CALWEEK: '199040',
};

const timeDimensionData2: TimeDimensionData = {
    DATETIMESTAMP: '1990-11-01 00:00:00.000000000',
    DATE_SQL: '1990-11-01',
    DATETIME_SAP: '19901101000000',
    DATE_SAP: '19901101',
    YEAR: '1990',
    QUARTER: 'Q4',
    MONTH: '11',
    WEEK: '44',
    WEEK_YEAR: '1990',
    DAY_OF_WEEK: '4',
    DAY: '1',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19904',
    CALMONTH: '199011',
    CALWEEK: '199044',
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
