const uuid = require("uuid").v4;

const environment = require("../../utils").getEnvironment();

const { seleniumTestName } = environment;

const projectRoleDescription = {
	description: `Description for Project Role for e2e tests with grid as ${seleniumTestName}`
};

const projectRole1 = {
	ID: uuid(),
	code: "T001",
	name: "Architect",
	ROLELIFECYCLESTATUS_CODE: 0
};

const projectRole2 = {
	ID: uuid(),
	code: "T002",
	name: "Web Designer",
	ROLELIFECYCLESTATUS_CODE: 0
};

const projectRole3 = {
	ID: uuid(),
	code: "T003",
	name: "Devops",
	ROLELIFECYCLESTATUS_CODE: 0
};

const projectRole4 = {
	ID: uuid(),
	code: "T004",
	name: "Cloud Developer",
	ROLELIFECYCLESTATUS_CODE: 0
};

const projectRole5 = {
	ID: uuid(),
	code: "T005",
	name: "UI Developer",
	ROLELIFECYCLESTATUS_CODE: 0
};

const projectRole6 = {
	ID: uuid(),
	code: "T006",
	name: "BE Developer",
	ROLELIFECYCLESTATUS_CODE: 0
};

Object.assign(projectRole1, projectRoleDescription);
Object.assign(projectRole2, projectRoleDescription);
Object.assign(projectRole3, projectRoleDescription);
Object.assign(projectRole4, projectRoleDescription);
Object.assign(projectRole5, projectRoleDescription);
Object.assign(projectRole6, projectRoleDescription);
const projectRoles = [projectRole1, projectRole2, projectRole3, projectRole4, projectRole5, projectRole6];

module.exports = { projectRoleDescription, projectRoles };
