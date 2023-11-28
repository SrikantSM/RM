const costCenters = require('./costCenters');
const availabilityReplicationSummary = require('./availabilityReplicationSummary');

const availabilityReplicationError1 = {
    resourceId: availabilityReplicationSummary.availabilityReplicationSummary3.resourceId,
    startDate: '2020-01-20',
    s4costCenterId: costCenters.costCenter1.costCenterID,
    workAssignmentExternalId: 'EMPH2R21905', // CCDE
    availabilityErrorMessage_code: 'AVL_ERR_10',
    errorParam1: 'plannedWorkingHours',
    csvRecordIndex: '1',
    invalidKeys: 'false',
};
const availabilityReplicationError2 = {
    resourceId: availabilityReplicationSummary.availabilityReplicationSummary3.resourceId,
    startDate: '22-01-2020',
    s4costCenterId: costCenters.costCenter1.costCenterID,
    workAssignmentExternalId: 'EMPH2R21905', // CCDE
    availabilityErrorMessage_code: 'AVL_ERR_1',
    csvRecordIndex: '3',
    invalidKeys: 'true',
};
const availabilityReplicationError3 = {
    resourceId: availabilityReplicationSummary.availabilityReplicationSummary4.resourceId,
    startDate: '2020-02-20',
    s4costCenterId: costCenters.costCenter2.costCenterID,
    workAssignmentExternalId: 'EMPH2R99217',
    availabilityErrorMessage_code: 'AVL_ERR_10',
    errorParam1: 'plannedWorkingHours',
    csvRecordIndex: '1',
    invalidKeys: 'false',
};
const availabilityReplicationError4 = {
    resourceId: availabilityReplicationSummary.availabilityReplicationSummary4.resourceId,
    startDate: '21-02-2020',
    s4costCenterId: costCenters.costCenter2.costCenterID,
    workAssignmentExternalId: 'EMPH2R99217',
    availabilityErrorMessage_code: 'AVL_ERR_1',
    csvRecordIndex: '2',
    invalidKeys: 'true',
};
const availabilityReplicationError5 = {
    resourceId: availabilityReplicationSummary.availabilityReplicationSummary4.resourceId,
    startDate: '2020-02-22',
    s4costCenterId: 'CC@!',
    workAssignmentExternalId: 'EMPH2R99217',
    availabilityErrorMessage_code: 'AVL_ERR_4',
    errorParam1: 'CC@!',
    csvRecordIndex: '3',
    invalidKeys: 'false',
};
const availabilityReplicationError6 = {
    resourceId: availabilityReplicationSummary.availabilityReplicationSummary4.resourceId,
    startDate: '',
    s4costCenterId: costCenters.costCenter2.costCenterID,
    workAssignmentExternalId: 'EMPH2R99217',
    availabilityErrorMessage_code: 'AVL_ERR_10',
    errorParam1: 'startDate',
    csvRecordIndex: '4',
    invalidKeys: 'true',
};
const availabilityReplicationError = [
    availabilityReplicationError1,
    availabilityReplicationError2,
    availabilityReplicationError3,
    availabilityReplicationError4,
    availabilityReplicationError5,
    availabilityReplicationError6,
];

module.exports = {
    availabilityReplicationError,
    availabilityReplicationError1,
    availabilityReplicationError2,
    availabilityReplicationError3,
    availabilityReplicationError4,
    availabilityReplicationError5,
    availabilityReplicationError6,
};
