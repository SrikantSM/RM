import { ProjectReplicationStatus } from 'test-commons';

const moment = require('moment');

export const projectReplicationStatus: ProjectReplicationStatus[] = [
  {
    startTime: moment(new Date('2020-12-08 08:00:00')).format('YYYY-MM-DD HH:MM:SS'),
    type_code: '1',
    status_code: '3',
  },
  {
    startTime: moment(new Date('2020-12-08 08:00:00')).format('YYYY-MM-DD HH:MM:SS'),
    type_code: '2',
    status_code: '3',
  },
  {
    startTime: moment(new Date('2020-12-08 08:00:00')).format('YYYY-MM-DD HH:MM:SS'),
    type_code: '3',
    status_code: '3',
  },
];
