import { v4 as uuid } from 'uuid';
import { ResourceOrganizationItems } from 'test-commons';
import {
    resourceOrganization1, resourceOrganization2, resourceOrganization3, resourceOrganization4, resourceOrganization5,
} from './ResourceOrganizations';

const unitKeyCCDE: string = 'CCDE0001';
const unitKeyCCIN: string = 'CCIN0001';
const unitKey1: string = 'C003XYZ01';
const unitKey2: string = 'C003XYZ02';
const unitKey3: string = 'C003XYZ03';
const unitKey4: string = 'C003XYZ04';
const unitKey5: string = 'C003XYZ05';
const unitKey6: string = 'C003XYZ06';

const resourceOrganizationItem1: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization1.ID,
    costCenterId: unitKeyCCDE,
};

const resourceOrganizationItem2: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization2.ID,
    costCenterId: unitKeyCCIN,
};

const resourceOrganizationItem3: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization3.ID,
    costCenterId: unitKey1,
};

const resourceOrganizationItem4: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization3.ID,
    costCenterId: unitKey2,
};

const resourceOrganizationItem5: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization4.ID,
    costCenterId: unitKey3,
};

const resourceOrganizationItem6: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization4.ID,
    costCenterId: unitKey4,
};

const resourceOrganizationItem7: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization5.ID,
    costCenterId: unitKey5,
};

const resourceOrganizationItem8: ResourceOrganizationItems = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization5.ID,
    costCenterId: unitKey6,
};

const allResourceOrganizationItems = [
    resourceOrganizationItem1,
    resourceOrganizationItem2,
    resourceOrganizationItem3,
    resourceOrganizationItem4,
    resourceOrganizationItem5,
    resourceOrganizationItem6,
    resourceOrganizationItem7,
    resourceOrganizationItem8,

];

export {
    allResourceOrganizationItems,
    resourceOrganizationItem1,
    resourceOrganizationItem2,
    resourceOrganizationItem3,
    resourceOrganizationItem4,
    resourceOrganizationItem5,
    resourceOrganizationItem6,
    resourceOrganizationItem7,
    resourceOrganizationItem8,

};
