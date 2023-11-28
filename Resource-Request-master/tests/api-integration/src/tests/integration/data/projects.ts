import { Project } from 'test-commons';

const moment = require('moment');

export const projects: Project[] = [
  {
    ID: 'RYPROJID',
    name: 'RYPROJNAME',
    startDate: moment(new Date('2020-08-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-12-31')).format('YYYY-MM-DD'),
    customer_ID: '10100050',
    serviceOrganization_code: '1010',
  },
];
