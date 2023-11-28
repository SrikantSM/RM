import { WorkPackage } from 'test-commons';

const moment = require('moment');

export const workPackages: WorkPackage[] = [
  {
    ID: 'RRAPIPROJ.1.1',
    name: 'Design',
    project_ID: 'RRAPIPROJ',
    startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2019-01-28')).format('YYYY-MM-DD'),
  },
];
