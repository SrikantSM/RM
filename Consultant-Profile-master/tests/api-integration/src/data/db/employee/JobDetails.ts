import { JobDetail } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
    workAssignment6,
} from './WorkAssignment';
import { costCenter1, costCenter2, costCenter6 } from '../organization';

const jobDetail1: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment4.externalID,
    parent: workAssignment1.ID,
    jobTitle: 'Associate Developer',
    costCenterexternalID: costCenter1.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2015-01-01',
    validTo: '2018-01-02',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail2: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment4.externalID,
    parent: workAssignment1.ID,
    jobTitle: 'Associate Developer',
    costCenterexternalID: costCenter1.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2018-01-02',
    validTo: '2019-11-12',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail3: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment4.externalID,
    parent: workAssignment2.ID,
    jobTitle: 'Developer',
    costCenterexternalID: costCenter2.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'IN',
    validFrom: '2019-11-13',
    validTo: '2020-01-14',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail4: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment4.externalID,
    parent: workAssignment2.ID,
    jobTitle: 'Developer',
    costCenterexternalID: costCenter1.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2020-01-14',
    validTo: '9999-01-01',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail5: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment4.externalID,
    parent: workAssignment3.ID,
    jobTitle: 'Senior Developer',
    costCenterexternalID: costCenter2.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2019-01-01',
    validTo: '9999-01-01',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail6: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment1.externalID,
    parent: workAssignment4.ID,
    jobTitle: 'Developer',
    costCenterexternalID: costCenter1.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2018-01-01',
    validTo: '9999-01-01',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail7: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment5.externalID,
    parent: workAssignment3.ID,
    jobTitle: 'Senior Developer',
    costCenterexternalID: costCenter6.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2018-01-01',
    validTo: '2018-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail8: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment4.externalID,
    parent: workAssignment6.ID,
    jobTitle: 'Senior Developer',
    costCenterexternalID: costCenter1.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2018-01-01',
    validTo: '9999-01-01',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail9: JobDetail = {
    ID: uuid(),
    supervisorWorkAssignmentExternalID: workAssignment4.externalID,
    parent: workAssignment5.ID,
    jobTitle: 'Senior Developer',
    costCenterexternalID: costCenter6.ID,
    legalEntityExternalID: 'AUGE',
    country_code: 'DE',
    validFrom: '2018-01-01',
    validTo: '9999-01-01',
    eventSequence: 1,
    status_code: 'A',
};

const allJobDetails = [
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
    jobDetail5,
    jobDetail6,
    jobDetail7,
    jobDetail8,
    jobDetail9,
];

export {
    allJobDetails,
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
    jobDetail5,
    jobDetail6,
    jobDetail7,
    jobDetail8,
    jobDetail9,
};
