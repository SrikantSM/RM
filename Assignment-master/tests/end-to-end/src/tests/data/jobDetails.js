const { workAssignments } = require("./workAssignments");
const { workforcePersons } = require("./workforcePersons");
const { organizationDetails } = require("./organizationDetails");
const { costCenters } = require("./costCenter");
const uuid = require("uuid").v4;

const managerWorkforcePerson1 = workforcePersons[0];
const managerWorkforcePerson2 = workforcePersons[1];
const managerWorkforcePerson3 = workforcePersons[2];
const managerWorkforcePerson4 = workforcePersons[3];
const managerWorkforcePerson5 = workforcePersons[4];
const workAssignment1 = workAssignments[0];
const workAssignment2 = workAssignments[1];
const workAssignment3 = workAssignments[2];
const workAssignment4 = workAssignments[3];
const workAssignment5 = workAssignments[4];
const costCenter1 = costCenters[0].ID;
const costCenter2 = costCenters[1].ID;
const costCenter3 = costCenters[2].ID;

const jobDetail1 = {
	ID: uuid(),
	costCenterexternalID: costCenter1,
	supervisorWorkAssignmentExternalID: managerWorkforcePerson1.externalID,
	jobTitle: "Associate Consultant",
	parent: workAssignment1.ID,
	legalEntityExternalID: "AUG1",
	country_code: "DE",
	validFrom: "2017-01-01",
	validTo: "2025-01-02",
	eventSequence: 1
};

const jobDetail2 = {
	ID: uuid(),
	costCenterexternalID: costCenter1,
	supervisorWorkAssignmentExternalID: managerWorkforcePerson2.externalID,
	jobTitle: "Consultant",
	parent: workAssignment2.ID,
	legalEntityExternalID: "AUG1",
	country_code: "DE",
	validFrom: "2018-01-02",
	validTo: "2025-05-31",
	eventSequence: 1
};

const jobDetail3 = {
	ID: uuid(),
	costCenterexternalID: costCenter2,
	supervisorWorkAssignmentExternalID: managerWorkforcePerson3.externalID,
	jobTitle: "Consultant",
	parent: workAssignment3.ID,
	legalEntityExternalID: "AUG1",
	country_code: "DE",
	validFrom: "2018-06-01",
	validTo: "2025-06-01",
	eventSequence: 1
};

const jobDetail4 = {
	ID: uuid(),
	costCenterexternalID: costCenter3,
	supervisorWorkAssignmentExternalID: managerWorkforcePerson4.externalID,
	jobTitle: "Senior Consultant",
	parent: workAssignment4.ID,
	legalEntityExternalID: "AUG1",
	country_code: "DE",
	validFrom: "2019-06-02",
	validTo: "9999-12-31",
	eventSequence: 1
};

const jobDetail5 = {
	ID: uuid(),
	costCenterexternalID: costCenter3,
	supervisorWorkAssignmentExternalID: managerWorkforcePerson5.externalID,
	jobTitle: "Senior Consultant",
	parent: workAssignment5.ID,
	legalEntityExternalID: "AUG1",
	country_code: "DE",
	validFrom: "2019-06-02",
	validTo: "9999-12-31",
	eventSequence: 1
};
const jobDetails = [jobDetail1, jobDetail2, jobDetail3, jobDetail4, jobDetail5];

module.exports = {jobDetails};
