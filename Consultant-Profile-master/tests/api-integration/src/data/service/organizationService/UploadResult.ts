import { UploadResult } from '../../../serviceEntities/organizationService';

const uploadResult1: UploadResult = {
    processedRecords: 1,
    createdHeader: 0,
    errors: 'Cost center CostPP01 is not associated with the company code 1710. Please check the combination and try again.',
};

const uploadResult2: UploadResult = {
    processedRecords: 1,
    createdHeader: 0,
    errors: 'Cost center 1710XYZ1 is not associated with the company code XXXX. Please check the combination and try again.',
};

const uploadResult4: UploadResult = {
    processedRecords: 4,
    createdHeader: 2,
    errors: null!,
};

const uploadResult5: UploadResult = {
    processedRecords: 2,
    createdHeader: 2,
    errors: null!,
};

const uploadResult6: UploadResult = {
    processedRecords: 2,
    createdHeader: 1,
    errors: 'Each cost center can only be associated with one service organization. Please remove all duplicate entries for the cost center 2710XYZ3.',
};

const uploadResult7: UploadResult = {
    processedRecords: 2,
    createdHeader: 1,
    errors: 'Cost center C003XYZ02 cannot be removed from service organization SO2 because it is the only cost center assigned to service organization SO2.',
};

const uploadResult8: UploadResult = {
    processedRecords: 1,
    createdHeader: 0,
    errors: 'Cost center C003XYZ05 cannot be removed from service organization SO3 because resource organization RO3 is assigned to at least one published resource request.',
};

const uploadResultEmptyCoCenter: UploadResult = {
    processedRecords: 2,
    createdHeader: 0,
    errors: 'The following entries in the CSV file have empty mandatory fields: 1: costCenterID; .',
};

const uploadResultEmptySrvOrg: UploadResult = {
    processedRecords: 1,
    createdHeader: 0,
    errors: 'The following entries in the CSV file have empty mandatory fields: 1: code; .',
};

const uploadResultEmptyCoCode: UploadResult = {
    processedRecords: 1,
    createdHeader: 0,
    errors: 'The following entries in the CSV file have empty mandatory fields: 1: companyCode; .',
};

export {
    uploadResult1,
    uploadResult2,
    uploadResult4,
    uploadResult5,
    uploadResult6,
    uploadResult7,
    uploadResult8,
    uploadResultEmptyCoCenter,
    uploadResultEmptySrvOrg,
    uploadResultEmptyCoCode,
};
