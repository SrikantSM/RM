import { Email } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
} from './WorkforcePerson';

const emailAddress1 = {
    address: 'sapc4prmauthpipelineconsultant3@global.corp.sap',
};

const emailAddress2 = {
    address: 'sapc4prmauthpipelineresourcemanager15@global.corp.sap',
};

const emailAddress3 = {
    address: 'workforcePerson3@sap.com',
};

const emailAddress4 = {
    address: 'workforcePerson01@sap.com',
};

const emailAddress5 = {
    address: 'workforcePerson02@sap.com',
};

const allEmailAddresses = [
    emailAddress1,
    emailAddress2,
    emailAddress3,
    emailAddress4,
    emailAddress5,
];

const email1: Email = {
    ID: uuid(),
    address: emailAddress1.address,
    isDefault: true,
    parent: workforcePersonWithDescription1.ID,
};

const email2: Email = {
    ID: uuid(),
    address: emailAddress2.address,
    isDefault: true,
    parent: workforcePersonWithDescription2.ID,
};

const email3: Email = {
    ID: uuid(),
    address: emailAddress3.address,
    isDefault: true,
    parent: workforcePersonManagerWithDescription.ID,
};

const email4: Email = {
    ID: uuid(),
    address: emailAddress4.address,
    isDefault: false,
    parent: workforcePersonWithDescription1.ID,
};

const email5: Email = {
    ID: uuid(),
    address: emailAddress5.address,
    isDefault: true,
    parent: workforcePersonWithDescription3.ID,
};

const allEmail = [
    email1,
    email2,
    email3,
    email4,
    email5,
];

export {
    allEmailAddresses,
    allEmail,
    email1,
    email2,
    email3,
    email4,
    email5,
};
