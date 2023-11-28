const uuid = require('uuid').v4;

const projectRole1 =  {
    ID          : uuid(),
    code        : "T001",
    name        : "Developer",
    description : "Developer",
    roleLifecycleStatus_code: 0
}

const projectRoles = [
	projectRole1
];

module.exports = {
    projectRoles,
	projectRole1 
};