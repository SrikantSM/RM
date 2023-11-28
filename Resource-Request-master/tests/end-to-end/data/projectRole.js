const uuid = require('uuid').v4;

const projectRoles = [
    {
        ID: uuid(),
        code: 'T001',
        name: 'Developer',
        description: 'Developer'
    },
    {
        ID: uuid(),
        code: 'T002',
        name: 'Architect',
        description: 'Architect'
    }
];

module.exports = { projectRoles };
