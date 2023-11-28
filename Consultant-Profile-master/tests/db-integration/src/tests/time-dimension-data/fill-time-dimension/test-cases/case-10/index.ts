import { FillTimeDimInput, FillTimeDimOutput, TimeDimensionData } from 'test-commons';

const fillTimeDimInput: FillTimeDimInput = {
    IV_TIME_BUCKET_TYPE_CODE: '99',
    IV_START_TIME: '1988-01-29 23:00:00.000000000',
    IV_END_TIME: '1988-01-29 21:00:00.000000000',
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
