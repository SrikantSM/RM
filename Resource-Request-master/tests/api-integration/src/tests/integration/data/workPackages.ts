import { WorkPackage } from 'test-commons';

const moment = require('moment');

export const workPackages: WorkPackage[] = [
  {
    ID: 'RYPROJID.1.1',
    name: 'RYPROJNAME',
    project_ID: 'RYPROJID',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-11-30')).format('YYYY-MM-DD'),
  },
  {
    ID: 'RYPROJID.1.2',
    name: 'RYPROJNAME2',
    project_ID: 'RYPROJID',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-11-30')).format('YYYY-MM-DD'),
  },
  {
    ID: 'RYPROJID.1.3',
    name: 'RYPROJNAME3',
    project_ID: 'RYPROJID',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-11-30')).format('YYYY-MM-DD'),
  },  
  {
    ID: 'RYPROJID.1.4',
    name: 'RYPROJNAME4',
    project_ID: 'RYPROJID',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-11-30')).format('YYYY-MM-DD'),
  }, 
  {
    ID: 'RYPROJID.1.5',
    name: 'RYPROJNAME5',
    project_ID: 'RYPROJID',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-11-30')).format('YYYY-MM-DD'),
  },
];
