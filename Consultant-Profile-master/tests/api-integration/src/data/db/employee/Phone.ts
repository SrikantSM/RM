import { Phone } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
} from './WorkforcePerson';

const phone1: Phone = {
    ID: uuid(),
    number: '49-89-1546567',
    isDefault: true,
    parent: workforcePersonWithDescription1.ID,
};

const phone2: Phone = {
    ID: uuid(),
    number: '49-89-2546567',
    isDefault: true,
    parent: workforcePersonWithDescription2.ID,
};

const phone3: Phone = {
    ID: uuid(),
    number: '49-89-3546567',
    isDefault: true,
    parent: workforcePersonManagerWithDescription.ID,
};

const phone4: Phone = {
    ID: uuid(),
    number: '49-89-4546567',
    isDefault: false,
    parent: workforcePersonWithDescription1.ID,
};

const phone5: Phone = {
    ID: uuid(),
    number: '47-89-1546567',
    isDefault: true,
    parent: workforcePersonWithDescription3.ID,
};

const allPhone = [
    phone1,
    phone2,
    phone3,
    phone4,
    phone5,
];

export {
    allPhone,
    phone1,
    phone2,
    phone3,
    phone4,
    phone5,
};
