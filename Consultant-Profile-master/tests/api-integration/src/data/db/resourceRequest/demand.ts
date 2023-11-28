import { Demand } from 'test-commons';
import { v4 as uuid } from 'uuid';

const moment = require('moment');

const demand1: Demand = {
    ID: uuid(),
    externalID: 'DEM_EXT1',
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().startOf('month').add(2, 'months').endOf('month')
        .format('YYYY-MM-DD'),
    workItem: 'WorkItem1',
    workItemName: 'Work Item Name 1',
    requestedQuantity: 600,
    requestedUoM: 'H',
    billingRole_ID: 'B001_CDE2E',
    billingCategory_ID: 'CD1',
    workPackage_ID: 'S4PROJ_CDE2E.1.1',
    deliveryOrganization_code: 'Org_1',
};

const demand2: Demand = {
    ID: uuid(),
    externalID: 'DEM_EXT2',
    startDate: moment().startOf('month').add(3, 'months').format('YYYY-MM-DD'),
    endDate: moment().startOf('month').add(5, 'months').endOf('month')
        .format('YYYY-MM-DD'),
    workItem: 'WorkItem2',
    workItemName: 'Work Item Name 2',
    requestedQuantity: 800,
    requestedUoM: 'H',
    billingRole_ID: 'B002_CDE2E',
    billingCategory_ID: 'CD2',
    workPackage_ID: 'S4PROJ_CDE2E.1.2',
    deliveryOrganization_code: 'Org_2',
};

const demandData = [
    demand1,
    demand2,
];

export {
    demand1,
    demand2,
    demandData,
};
