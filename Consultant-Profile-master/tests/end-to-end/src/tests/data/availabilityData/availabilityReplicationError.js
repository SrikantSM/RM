const { availabilityReplicationSummary } = require('./availabilityReplicationSummary');

const availabilityResourceID1 = availabilityReplicationSummary[0];
const availabilityResourceID2 = availabilityReplicationSummary[1];
const availabilityResourceID3 = availabilityReplicationSummary[2];
const availabilityResourceID4 = availabilityReplicationSummary[3];

const availabilityError1 = {
    resourceId: availabilityResourceID1.resourceId,
};
const availabilityError2 = {
    resourceId: availabilityResourceID2.resourceId,
};
const availabilityError3 = {
    resourceId: availabilityResourceID3.resourceId,
};
const availabilityError4 = {
    resourceId: availabilityResourceID4.resourceId,
};
const availabilityError5 = {
    resourceId: 'f6ca78ec-1d00-47d0-86a3-0d9e5b89d6f4',
};
const availabilityError6 = {
    resourceId: '',
};

const availabilityReplicationError = [
    availabilityError1,
    availabilityError2,
    availabilityError3,
    availabilityError4,
    availabilityError5,
    availabilityError6,
];

module.exports = {
    availabilityReplicationError,
};
