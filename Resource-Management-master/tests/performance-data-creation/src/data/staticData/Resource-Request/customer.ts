import { Customer } from 'test-commons';
import { NUMBER_OF_CUSTOMERS } from './config';

const customers: Customer[] = [];

for (let i = 0; i < NUMBER_OF_CUSTOMERS; i += 1) {
  const customer: Customer = {
    ID: `CUS_${(i + 1)}`,
    name: 'iTelO',
  };
  customers.push(customer);
}

export { customers };
