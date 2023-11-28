import { ProfileDetail } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
} from './WorkforcePerson';

const profileDetail1: ProfileDetail = {
    ID: uuid(),
    firstName: 'firstName1',
    lastName: 'lastName1',
    fullName: 'firstName1 lastName1',
    initials: 'FL',
    parent: workforcePersonWithDescription1.ID,
    validFrom: '2015-01-01',
    validTo: '2018-01-01',
};

const profileDetail2: ProfileDetail = {
    ID: uuid(),
    firstName: 'firstName2',
    lastName: 'lastName2',
    fullName: 'firstName2 lastName2',
    initials: 'FL',
    parent: workforcePersonWithDescription2.ID,
    validFrom: '2018-01-01',
    validTo: '9999-01-01',
};

const profileDetail3: ProfileDetail = {
    ID: uuid(),
    firstName: 'firstName3',
    lastName: 'lastName3',
    fullName: 'firstName3 lastName3',
    initials: 'FL',
    parent: workforcePersonManagerWithDescription.ID,
    validFrom: '2018-01-01',
    validTo: '9999-01-01',
};

const profileDetail4: ProfileDetail = {
    ID: uuid(),
    firstName: 'firstName4',
    lastName: 'lastName4',
    fullName: 'firstName4 lastName4',
    initials: 'FL',
    parent: workforcePersonWithDescription1.ID,
    validFrom: '2018-01-01',
    validTo: '9999-01-01',
};

const profileDetail5: ProfileDetail = {
    ID: uuid(),
    firstName: 'firstName5',
    lastName: 'lastName5',
    fullName: 'firstName5 lastName5',
    initials: 'FL',
    parent: workforcePersonWithDescription3.ID,
    validFrom: '2018-01-01',
    validTo: '9999-01-01',
};

const allProfiles = [
    profileDetail1,
    profileDetail2,
    profileDetail3,
    profileDetail4,
    profileDetail5,
];

export {
    allProfiles,
    profileDetail1,
    profileDetail2,
    profileDetail3,
    profileDetail4,
    profileDetail5,
};
