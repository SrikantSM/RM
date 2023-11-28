import { AvailabilityReplicationError } from 'test-commons';
import {
    availabilityReplicationSummary1,
    availabilityReplicationSummary2,
    availabilityReplicationSummary3,
    availabilityReplicationSummary4,
} from './AvailabilityReplicationSummary';
import { costCenter1, costCenter2 } from '../organization';

const availabilityReplicationError11: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary3.resourceId,
    startDate: '2020-01-20',
    s4costCenterId: costCenter1.costCenterID,
    workAssignmentExternalId: availabilityReplicationSummary3.workAssignmentExternalId,
    availabilityErrorMessage_code: 'AVL_ERR_10',
    errorParam1: 'plannedWorkingHours',
    csvRecordIndex: '1',
    invalidKeys: '',
};

const availabilityReplicationError12: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary3.resourceId,
    startDate: '22-01-2020',
    s4costCenterId: costCenter1.costCenterID,
    workAssignmentExternalId: availabilityReplicationSummary3.workAssignmentExternalId,
    availabilityErrorMessage_code: 'AVL_ERR_1',
    csvRecordIndex: '3',
    invalidKeys: 'true',
};

const availabilityReplicationError21: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary4.resourceId,
    startDate: '2020-02-20',
    s4costCenterId: costCenter2.costCenterID,
    workAssignmentExternalId: availabilityReplicationSummary4.workAssignmentExternalId,
    availabilityErrorMessage_code: 'AVL_ERR_10',
    errorParam1: 'plannedWorkingHours',
    csvRecordIndex: '1',
    invalidKeys: 'false',
};

const availabilityReplicationError22: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary4.resourceId,
    startDate: '21-02-2020',
    s4costCenterId: costCenter2.costCenterID,
    workAssignmentExternalId: availabilityReplicationSummary4.workAssignmentExternalId,
    availabilityErrorMessage_code: 'AVL_ERR_1',
    csvRecordIndex: '2',
    invalidKeys: 'true',
};

const availabilityReplicationError23: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary4.resourceId,
    startDate: '2020-02-22',
    s4costCenterId: 'CC@!',
    workAssignmentExternalId: availabilityReplicationSummary4.workAssignmentExternalId,
    availabilityErrorMessage_code: 'AVL_ERR_4',
    errorParam1: 'CC@!',
    csvRecordIndex: '3',
    invalidKeys: 'false',
};

const availabilityReplicationError24: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary4.resourceId,
    startDate: '',
    s4costCenterId: costCenter2.costCenterID,
    workAssignmentExternalId: availabilityReplicationSummary4.workAssignmentExternalId,
    availabilityErrorMessage_code: 'AVL_ERR_10',
    errorParam1: 'startDate',
    csvRecordIndex: '4',
    invalidKeys: 'false',
};

const availabilityReplicationErrorUpload1: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary1.resourceId,
    startDate: '',
    s4costCenterId: availabilityReplicationSummary1.costCenterId,
    workAssignmentExternalId: availabilityReplicationSummary1.workAssignmentExternalId,
};

const availabilityReplicationErrorUpload2: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary2.resourceId,
    startDate: '',
    s4costCenterId: availabilityReplicationSummary2.costCenterId,
    workAssignmentExternalId: availabilityReplicationSummary2.workAssignmentExternalId,
};

const availabilityReplicationErrorUpload3: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary3.resourceId,
    startDate: '',
    s4costCenterId: availabilityReplicationSummary3.costCenterId,
    workAssignmentExternalId: availabilityReplicationSummary3.workAssignmentExternalId,
};

const availabilityReplicationErrorUpload4: AvailabilityReplicationError = {
    resourceId: availabilityReplicationSummary4.resourceId,
    startDate: '',
    s4costCenterId: availabilityReplicationSummary4.costCenterId,
    workAssignmentExternalId: availabilityReplicationSummary4.workAssignmentExternalId,
};

const allAvailabilityReplicationErrorUpload = [
    availabilityReplicationErrorUpload1,
    availabilityReplicationErrorUpload2,
    availabilityReplicationErrorUpload3,
    availabilityReplicationErrorUpload4,
];

const allAvailabilityReplicationErrors = [
    availabilityReplicationError11,
    availabilityReplicationError12,
    availabilityReplicationError21,
    availabilityReplicationError22,
    availabilityReplicationError23,
    availabilityReplicationError24,
];

export {
    allAvailabilityReplicationErrorUpload,
    allAvailabilityReplicationErrors,
    availabilityReplicationError11,
    availabilityReplicationError12,
    availabilityReplicationError21,
    availabilityReplicationError22,
    availabilityReplicationError23,
    availabilityReplicationError24,
};
