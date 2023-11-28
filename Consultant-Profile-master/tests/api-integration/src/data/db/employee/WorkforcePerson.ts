import { WorkforcePerson } from 'test-commons';
import {
    employeeHeaderWithDescription1,
    employeeHeaderWithDescription2,
    employeeHeaderWithDescription3,
    employeeHeaderWithDescription4,
} from './Headers';

const workforcePersonWithDescription1: WorkforcePerson = {
    ID: employeeHeaderWithDescription1.ID,
    isBusinessPurposeCompleted: false,
    externalID: 'workforcePersonExternalID1',
};

const workforcePersonWithDescription2: WorkforcePerson = {
    ID: employeeHeaderWithDescription2.ID,
    isBusinessPurposeCompleted: false,
    externalID: 'workforcePersonExternalID2',
};

const workforcePersonManagerWithDescription: WorkforcePerson = {
    ID: employeeHeaderWithDescription3.ID,
    isBusinessPurposeCompleted: true,
    externalID: 'workforcePersonExternalID3',
};

const workforcePersonWithDescription3: WorkforcePerson = {
    ID: employeeHeaderWithDescription4.ID,
    isBusinessPurposeCompleted: false,
    externalID: 'workforcePersonExternalID4',
};

const allWorkforcePerson = [
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
];

export {
    allWorkforcePerson,
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
};
