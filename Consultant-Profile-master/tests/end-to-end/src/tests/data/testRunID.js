const generate = require('crypto-random-string');

const testRunId = generate({ length: 6 });

module.exports = {
    testRunId,
};
