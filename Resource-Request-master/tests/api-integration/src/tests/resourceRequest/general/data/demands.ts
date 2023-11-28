import { Demand } from 'test-commons';

const moment = require('moment');

export const demands: Demand[] = [
  {
    ID: 'ab188671-2ce5-4258-928f-1b76ea251f46',
    startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2019-01-28')).format('YYYY-MM-DD'),
    requestedQuantity: 100,
    requestedUoM: 'H',
    billingRole_ID: 'RRAPITEST',
    billingCategory_ID: 'RRA',
    workPackage_ID: 'RRAPIPROJ.1.1',
    deliveryOrganization_code: 'RAORG',
  },
];
