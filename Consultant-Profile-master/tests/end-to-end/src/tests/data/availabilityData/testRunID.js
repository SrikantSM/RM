const generate = require('crypto-random-string');

const testRunId = generate({ length: 4 });

module.exports = {
    testRunId,
};
