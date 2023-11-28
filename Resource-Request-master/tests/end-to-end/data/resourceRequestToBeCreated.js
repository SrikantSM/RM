const uuid = require('uuid').v4;
const moment = require('moment');
const { demands } = require('./demand');
let rrStartTime = moment().startOf('month').format('YYYY-MM-DD') + " 00:00:00.000000000";
let rrEndTime = moment().startOf('month').add(3, 'months').startOf('month').format('YYYY-MM-DD') + " 00:00:00.000000000";

const resourceRequestsToUpload = [
    {
        ID: uuid(),
        name: "Resource Request 7",
        displayId: "7777777777",
        isS4Cloud: true,
        //requestedDeliveryOrg_code: "Org_2",
        //processingDeliveryOrg_code: "Org_2",
        requestedResourceOrg_ID: "Org_2",
        processingResourceOrg_ID: "Org_2",
        requestedCapacity: 400,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 24000,
        demand_ID: demands[3].ID,
        workpackage_ID: "mockServerStrictMode",
        project_ID: "S4INTPROJ_CDE2E",
        projectRole_ID: "",
        priority_code: 1,
        requestStatus_code: 0,
        releaseStatus_code: 1,
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        startTime: rrStartTime,
        endTime: rrEndTime
    },
    {
        ID: uuid(),
        name: "Resource Request 8",
        displayId: "8888888888",
        isS4Cloud: true,
        //requestedDeliveryOrg_code: "Org_2",
        //processingDeliveryOrg_code: "Org_2",
        requestedResourceOrg_ID: "Org_2",
        processingResourceOrg_ID: "Org_2",
        requestedCapacity: 400,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 24000,
        demand_ID: demands[4].ID,
        workpackage_ID: "TimeOutWP",
        project_ID: "S4INTPROJ_CDE2E_2",
        projectRole_ID: "",
        priority_code: 1,
        requestStatus_code: 0,
        releaseStatus_code: 1,
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        startTime: rrStartTime,
        endTime: rrEndTime
    },
    {
        ID: uuid(),
        name: "Resource Request 9",
        displayId: "9999999999",
        isS4Cloud: true,
        //requestedDeliveryOrg_code: "Org_1",
        //processingDeliveryOrg_code: "Org_1",
        requestedResourceOrg_ID: "Org_1",
        processingResourceOrg_ID: "Org_1",
        requestedCapacity: 600,
        requestedUnit: "duration-hour",
        requestedCapacityInMinutes: 36000,
        demand_ID: demands[0].ID,
        workpackage_ID: "S4PROJ_CDE2E.1.1",
        project_ID: "S4PROJ_CDE2E",
        projectRole_ID: "",
        priority_code: 1,
        requestStatus_code: 0,
        releaseStatus_code: 0,
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        startTime: rrStartTime,
        endTime: rrEndTime
    }
];

module.exports = { resourceRequestsToUpload };
