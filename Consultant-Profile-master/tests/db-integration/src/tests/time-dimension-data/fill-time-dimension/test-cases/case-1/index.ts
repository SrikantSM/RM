import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '01',
    IV_START_TIME: '1996-12-28 09:00:00.000',
    IV_END_TIME: '1998-01-31 00:00:00.000',
};

const expectation: FillTimeDimOutput = {
    EV_NUMBER_OF_RECORDS: 3,
};

const timeDimensionData1: TimeDimensionData = {
    DATETIMESTAMP: '1996-01-01 00:00:00.000000000',
    DATE_SQL: '1996-01-01',
    DATETIME_SAP: '19960101000000',
    DATE_SAP: '19960101',
    YEAR: '1996',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1996',
    DAY_OF_WEEK: '1',
    DAY: '1',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19961',
    CALMONTH: '199601',
    CALWEEK: '199601',
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

const timeDimensionData3: TimeDimensionData = {
    DATETIMESTAMP: '1998-01-01 00:00:00.000000000',
    DATE_SQL: '1998-01-01',
    DATETIME_SAP: '19980101000000',
    DATE_SAP: '19980101',
    YEAR: '1998',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1998',
    DAY_OF_WEEK: '4',
    DAY: '1',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19981',
    CALMONTH: '199801',
    CALWEEK: '199801',
};

const timeDimensionData = [
    timeDimensionData1,
    timeDimensionData2,
    timeDimensionData3,
];

export {
    fillTimeDimInput,
    expectation,
    timeDimensionData,
};
