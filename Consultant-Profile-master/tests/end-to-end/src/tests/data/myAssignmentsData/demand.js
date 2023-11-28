const uuid = require('uuid').v4;

const demandData1 = {
    ID: uuid(),
    externalID: 'DEM_EXT1',
    startDate: '2019-01-01',
    endDate: '2019-03-31',
    requestedUoM: 'H',
    workItem: 'workItem',
    workItemName: 'workItem1',
    billingRole_ID: 'B001_CDE2E',
    billingCategory_ID: 'CD1',
    workPackage_ID: 'S4PROJ_CDE2E.1.1',
    deliveryOrganization_code: 'Org_1',
};

const demandData2 = {
    ID: uuid(),
    externalID: 'DEM_EXT3',
    startDate: '2019-01-01',
    endDate: '2019-03-31',
    requestedQuantity: 300,
    requestedUoM: 'H',
    workItem: 'workItem',
    workItemName: 'workItem2',
    billingRole_ID: 'B001_CDE2E',
    billingCategory_ID: 'CD2',
    workPackage_ID: 'EWMPRD_CDE2E.1.1',
    deliveryOrganization_code: 'Org_2',
};

const demand = [
    demandData1,
    demandData2,
];

module.exports = {
    demand,
    demandData1,
    demandData2,
};
