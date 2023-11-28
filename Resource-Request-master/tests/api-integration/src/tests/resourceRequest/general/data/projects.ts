import { Project } from 'test-commons';

const moment = require('moment');

export const projects: Project[] = [
  {
    ID: 'RRAPIPROJ',
    name: 'Prototype Talent Management',
    startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2019-01-28')).format('YYYY-MM-DD'),
    customer_ID: 'RRAPI1010',
    serviceOrganization_code: 'RAORG',
  },
];
