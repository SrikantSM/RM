const custId = require('crypto-random-string');

const name1 = 'John & Smith Co';
const name2 = 'iTelO';

const customerName1 = {
    name: name1,
};

const customerName2 = {
    name: name2,
};

const allCustomerNames = [
    customerName1,
    customerName2,
];

const customerData1 = {
    ID: custId({ length: 4 }),
    name: 'John & Smith Co',
};
const customerData2 = {
    ID: custId({ length: 4 }),
    name: 'iTelO',
};

const customers = [
    customerData1,
    customerData2,
];

module.exports = { customers, allCustomerNames };
