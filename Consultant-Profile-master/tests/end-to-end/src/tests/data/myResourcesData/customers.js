const custId = require('crypto-random-string');

const name1 = 'John & Smith Co MR';
const name2 = 'iTelO MR';

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
    name: name1,
};
const customerData2 = {
    ID: custId({ length: 4 }),
    name: name2,
};

const customers = [
    customerData1,
    customerData2,
];

module.exports = { customers, allCustomerNames };
