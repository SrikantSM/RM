import { BillingRole } from 'test-commons';

const billingRoles: BillingRole[] = [];

const billingRole1: BillingRole = {
  ID: 'B001',
  name: 'Junior Consultant',
};

const billingRole2: BillingRole = {
  ID: 'B002',
  name: 'Senior Consultant',
};

billingRoles.push(billingRole1);
billingRoles.push(billingRole2);

export { billingRoles };