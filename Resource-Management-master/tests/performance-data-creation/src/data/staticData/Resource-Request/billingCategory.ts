import { BillingCategory } from 'test-commons';

const billingCategories: BillingCategory[] = [];

const billingCategory1: BillingCategory = {
  ID: 'BIL',
  name: 'Billable',
};

const billingCategory2: BillingCategory = {
  ID: 'NON',
  name: 'Non Billable',
};

billingCategories.push(billingCategory1);
billingCategories.push(billingCategory2);

export { billingCategories };
