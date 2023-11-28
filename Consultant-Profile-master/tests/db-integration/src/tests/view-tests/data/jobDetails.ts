import { JobDetail } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { workAssignment1 } from './workAssignment';

const jobDetail1: JobDetail = {
    ID: uuid(),
    parent: workAssignment1.ID,
    costCenterexternalID: uuid(),
    supervisorWorkAssignmentExternalID: 'randomSupervisor1',
    jobTitle: 'randonJobTitle1',
    legalEntityExternalID: 'LE1',
    country_code: 'IN',
    validFrom: workAssignment1.startDate,
    validTo: '2018-09-09',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail2: JobDetail = {
    ID: uuid(),
    parent: workAssignment1.ID,
    costCenterexternalID: uuid(),
    supervisorWorkAssignmentExternalID: 'randomSupervisor2',
    jobTitle: 'randonJobTitle2',
    legalEntityExternalID: 'LE2',
    country_code: 'IN',
    validFrom: '2018-09-09',
    validTo: '2019-11-24',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail3: JobDetail = {
    ID: uuid(),
    parent: workAssignment1.ID,
    costCenterexternalID: uuid(),
    supervisorWorkAssignmentExternalID: 'randomSupervisor3',
    jobTitle: 'randonJobTitle3',
    legalEntityExternalID: 'LE3',
    country_code: 'IN',
    validFrom: '2019-11-24',
    validTo: workAssignment1.endDate,
    eventSequence: 1,
    status_code: 'A',
};

const allJobDetails = [
    jobDetail1,
    jobDetail2,
    jobDetail3,
];

export {
    allJobDetails,
    jobDetail1,
    jobDetail2,
    jobDetail3,
};
