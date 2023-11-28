import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

/**
 * When the start date is later than the end date
 */
const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '04',
    IV_START_TIME: '1971-01-29 23:00:00.000000000',
    IV_END_TIME: '1970-01-29 21:00:00.000000000',
};

const expectation: FillTimeDimOutput = {
    EV_NUMBER_OF_RECORDS: 0,
};

const timeDimensionData: TimeDimensionData[] = [];

export {
    fillTimeDimInput,
    expectation,
    timeDimensionData,
};
