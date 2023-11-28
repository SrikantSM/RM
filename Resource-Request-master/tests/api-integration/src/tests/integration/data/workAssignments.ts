import { WorkAssignment } from 'test-commons';

const moment = require('moment');

export const workAssignments: WorkAssignment[] = [
  {
    ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
    workAssignmentID: 'e360a8.0.1',
    parent: '0727ac70-bb22-4036-855c-d1d31aa6b4ff',
    externalID: 'e360a8.0.1',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-12-31')).format('YYYY-MM-DD'),
  },
  {
    ID: 'de131e36-ae2a-11e9-a2a3-2a2ae2dbaba3',
    workAssignmentID: 'a198a8.0.3',
    parent: '13d6ac70-bb22-4036-855c-d1d31aa6d3ae',
    externalID: 'a198a8.0.3',
    startDate: moment(new Date('2020-10-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-12-31')).format('YYYY-MM-DD'),
  },
  {
    ID: 'ab245e36-ae2a-11e9-a2a3-2a2ae2dacde9',
    workAssignmentID: 'c236b8.1.7',
    parent: '42c5ac19-bb22-4036-855c-d1d31aa5e1c3',
    externalID: 'c236b8.1.7',
    startDate: moment(new Date('2020-10-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-12-31')).format('YYYY-MM-DD'),
  },
  {
    ID: 'cd267e36-ae2a-11e9-a2a3-2a2ae2dacac2',
    workAssignmentID: 'd224b8.3.9',
    parent: '42c5ac19-bb22-4036-855c-d1d31aa5e1c3',
    externalID: 'd224b8.3.9',
    startDate: moment(new Date('2020-10-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-12-31')).format('YYYY-MM-DD'),
  },
  {
    ID: 'e1011e36-ae2a-11e9-0000-2a2ae2dbcce4',
    workAssignmentID: 'e309a7.0.7',
    parent: '0727ac70-bb22-4036-0000-d1d31aa6b4ff',
    externalID: 'e309a7.0.7',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-12-31')).format('YYYY-MM-DD'),
  },
  {
    ID: 'e1011e36-ae2a-11e9-0001-2a2ae2dbcce4',
    workAssignmentID: 'f309a7.0.7',
    parent: '0727ac70-bb22-4036-0001-d1d31aa6b4ff',
    externalID: 'f309a7.0.7',
    startDate: moment(new Date('2020-09-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-12-31')).format('YYYY-MM-DD'),
  },
];
