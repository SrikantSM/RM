const { demands } = require('./demand');

const demand1 = demands[0];

const supplySync = [
    {
        demand: demand1.ID
    }
];

module.exports = { supplySync };
