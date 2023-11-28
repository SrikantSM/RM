import { AvailabilityUploadResult } from '../../../serviceEntities/availabilityUploadService';

const uploadSuccessResult1: AvailabilityUploadResult = {
    createdItems: 3,
    errors: 0,
    resourceIDErrors: 0,
};

const uploadSuccessResult2: AvailabilityUploadResult = {
    createdItems: 1,
    errors: 0,
    resourceIDErrors: 0,
};

const uploadPartialResult: AvailabilityUploadResult = {
    createdItems: 2,
    errors: 1,
    resourceIDErrors: 0,
};

const uploadFailureResult: AvailabilityUploadResult = {
    createdItems: 0,
    errors: 1,
    resourceIDErrors: 0,
};

const uploadFailureResult2: AvailabilityUploadResult = {
    createdItems: 0,
    errors: 1,
    resourceIDErrors: 1,
};

const uploadBatchResult: AvailabilityUploadResult = {
    createdItems: 1510,
    errors: 0,
    resourceIDErrors: 0,
};

export {
    uploadSuccessResult1,
    uploadSuccessResult2,
    uploadPartialResult,
    uploadFailureResult,
    uploadFailureResult2,
    uploadBatchResult,
};
