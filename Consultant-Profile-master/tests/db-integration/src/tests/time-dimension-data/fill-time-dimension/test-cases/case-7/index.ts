import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

/**
 * when 30 mins bucket - 07 is chosen
 */
const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '07',
    IV_START_TIME: '1987-01-29 20:00:00.000000000',
    IV_END_TIME: '1987-01-29 23:00:00.000000000',
};

const expectation: FillTimeDimOutput = {
    EV_NUMBER_OF_RECORDS: 8,
};

const timeDimensionData1: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 20:00:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129200000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '20',
    MINUTE: '0',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData2: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 20:30:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129203000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '20',
    MINUTE: '30',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData3: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 21:00:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129210000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '21',
    MINUTE: '0',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData4: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 21:30:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129213000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '21',
    MINUTE: '30',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData5: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 22:00:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129220000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '22',
    MINUTE: '0',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData6: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 22:30:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129223000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '22',
    MINUTE: '30',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData7: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 23:00:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129230000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '23',
    MINUTE: '0',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData8: TimeDimensionData = {
    DATETIMESTAMP: '1987-01-29 23:30:00.000000000',
    DATE_SQL: '1987-01-29',
    DATETIME_SAP: '19870129233000',
    DATE_SAP: '19870129',
    YEAR: '1987',
    QUARTER: 'Q1',
    MONTH: '1',
    WEEK: '5',
    WEEK_YEAR: '1987',
    DAY_OF_WEEK: '4',
    DAY: '29',
    HOUR: '23',
    MINUTE: '30',
    CALQUARTER: '19871',
    CALMONTH: '19871',
    CALWEEK: '98705',
};

const timeDimensionData = [
    timeDimensionData1,
    timeDimensionData2,
    timeDimensionData3,
    timeDimensionData4,
    timeDimensionData5,
    timeDimensionData6,
    timeDimensionData7,
    timeDimensionData8,
];

export {
    fillTimeDimInput,
    expectation,
    timeDimensionData,
};
