const uuid = require('uuid').v4;
const moment = require('moment');
const { resourceRequestsToUpload } = require('./resourceRequestToBeCreated');

let rrStartTime = moment().startOf('month').format('YYYY-MM-DD') + " 00:00:00.000000000";
let rrEndTime = moment().startOf('month').add(3, 'months').startOf('month').format('YYYY-MM-DD') + " 00:00:00.000000000";
let capacityRequirementStartTime = moment().startOf('month').add(1, 'months').startOf('month').add(2,'days').format('YYYY-MM-DD') + " 00:00:00.000000000";
let capacityRequirementEndTime = moment().startOf('month').add(1, 'months').startOf('month').add(29,'days').format('YYYY-MM-DD') + " 00:00:00.000000000";

const capacityRequirements = [
    {
        ID: uuid(),
        startDate: moment().startOf('month').add(1, 'months').startOf('month').add(2,'days').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(1, 'months').startOf('month').add(28,'days').format('YYYY-MM-DD'),
        startTime: capacityRequirementStartTime,
        endTime: capacityRequirementEndTime,
        requestedCapacity: 400,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 24000,
        resourceRequest_ID: resourceRequestsToUpload[0].ID
    },
    {
        ID: uuid(),
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        startTime: rrStartTime,
        endTime: rrEndTime,
        requestedCapacity: 400,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 24000,
        resourceRequest_ID: resourceRequestsToUpload[1].ID
    },
    {
        ID: uuid(),
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        startTime: rrStartTime,
        endTime: rrEndTime,
        requestedCapacity: 600,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 36000,
        resourceRequest_ID: resourceRequestsToUpload[2].ID
    }];

module.exports = { capacityRequirements };
