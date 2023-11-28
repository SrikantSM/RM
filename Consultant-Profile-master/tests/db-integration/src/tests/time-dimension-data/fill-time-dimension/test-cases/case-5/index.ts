import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '05',
    IV_START_TIME: '1995-01-01 10:35:00.000000000',
    IV_END_TIME: '1995-01-07 22:12:00.000000000',
};

const expectation: FillTimeDimOutput = {
    EV_NUMBER_OF_RECORDS: 7,
};

const timeDimensionData1: TimeDimensionData = {
    DATETIMESTAMP: '1995-01-01 00:00:00.000000000',
    DATE_SQL: '1995-01-01',
    DATETIME_SAP: '19950101000000',
    DATE_SAP: '19950101',
    YEAR: '1995',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '52',
    WEEK_YEAR: '1994',
    DAY_OF_WEEK: '7',
    DAY: '1',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19951',
    CALMONTH: '199501',
    CALWEEK: '199452',
};

const timeDimensionData2: TimeDimensionData = {
    DATETIMESTAMP: '1995-01-02 00:00:00.000000000',
    DATE_SQL: '1995-01-02',
    DATETIME_SAP: '19950102000000',
    DATE_SAP: '19950102',
    YEAR: '1995',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1995',
    DAY_OF_WEEK: '1',
    DAY: '2',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19951',
    CALMONTH: '199501',
    CALWEEK: '199501',
};

const timeDimensionData3: TimeDimensionData = {
    DATETIMESTAMP: '1995-01-03 00:00:00.000000000',
    DATE_SQL: '1995-01-03',
    DATETIME_SAP: '19950103000000',
    DATE_SAP: '19950103',
    YEAR: '1995',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1995',
    DAY_OF_WEEK: '2',
    DAY: '3',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19951',
    CALMONTH: '199501',
    CALWEEK: '199501',
};

const timeDimensionData4: TimeDimensionData = {
    DATETIMESTAMP: '1995-01-04 00:00:00.000000000',
    DATE_SQL: '1995-01-04',
    DATETIME_SAP: '19950104000000',
    DATE_SAP: '19950104',
    YEAR: '1995',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1995',
    DAY_OF_WEEK: '3',
    DAY: '4',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19951',
    CALMONTH: '199501',
    CALWEEK: '199501',
};

const timeDimensionData5: TimeDimensionData = {
    DATETIMESTAMP: '1995-01-05 00:00:00.000000000',
    DATE_SQL: '1995-01-05',
    DATETIME_SAP: '19950105000000',
    DATE_SAP: '19950105',
    YEAR: '1995',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1995',
    DAY_OF_WEEK: '4',
    DAY: '5',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19951',
    CALMONTH: '199501',
    CALWEEK: '199501',
};

const timeDimensionData6: TimeDimensionData = {
    DATETIMESTAMP: '1995-01-06 00:00:00.000000000',
    DATE_SQL: '1995-01-06',
    DATETIME_SAP: '19950106000000',
    DATE_SAP: '19950106',
    YEAR: '1995',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1995',
    DAY_OF_WEEK: '5',
    DAY: '6',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19951',
    CALMONTH: '199501',
    CALWEEK: '199501',
};

const timeDimensionData7: TimeDimensionData = {
    DATETIMESTAMP: '1995-01-07 00:00:00.000000000',
    DATE_SQL: '1995-01-07',
    DATETIME_SAP: '19950107000000',
    DATE_SAP: '19950107',
    YEAR: '1995',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '1',
    WEEK_YEAR: '1995',
    DAY_OF_WEEK: '6',
    DAY: '7',
    HOUR: '0',
    MINUTE: '0',
    CALQUARTER: '19951',
    CALMONTH: '199501',
    CALWEEK: '199501',
};

const timeDimensionData = [
    timeDimensionData1,
    timeDimensionData2,
    timeDimensionData3,
    timeDimensionData4,
    timeDimensionData5,
    timeDimensionData6,
    timeDimensionData7,
];

export {
    fillTimeDimInput,
    expectation,
    timeDimensionData,
};
