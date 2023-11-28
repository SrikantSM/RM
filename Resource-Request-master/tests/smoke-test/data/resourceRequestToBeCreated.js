const moment = require('moment');
let rrStartTime = moment().startOf('month').format('YYYY-MM-DD') + " 00:00:00.000000000";
let rrEndTime = moment().startOf('month').add(3, 'months').startOf('month').format('YYYY-MM-DD') + " 00:00:00.000000000";

const resourceRequestsToUpload = {
    ID: '78686ab9-9c90-4810-902b-7e28801229b8',
    name: "Resource Request smoke",
    displayId: "7777777777",
    isS4Cloud: false,
    requestedResourceOrg_ID: "ROO1",
    processingResourceOrg_ID: "ROO1",
    requestedCapacity: 400,
    requestedUnit: "duration-hour",
    requestedCapacityInMinutes: 24000,
    projectRole_ID: "",
    priority_code: 1,
    requestStatus_code: 0,
    releaseStatus_code: 1,
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
    startTime: rrStartTime,
    endTime: rrEndTime
};

module.exports.resourceRequestsData = resourceRequestsToUpload;
