const uuid = require("uuid").v4;
const employeeHeaders = require("./employeeHeaders");

const profileDetail1 = {
	ID: uuid(),
	firstName: "Asg-Test",
	lastName: "Usere2e1",
	parent: employeeHeaders.employeeHeader1.ID,
	validFrom: "1985-03-03",
	validTo: "9999-12-31"
};

const profileDetail2 = {
	ID: uuid(),
	firstName: "Asg-Test",
	lastName: "Usere2e2",
	parent: employeeHeaders.employeeHeader2.ID,
	validFrom: "1999-01-02",
	validTo: "9999-12-31"
};

const profileDetail3 = {
	ID: uuid(),
	firstName: "Asg-Test",
	lastName: "Usere2e3",
	parent: employeeHeaders.employeeHeader3.ID,
	validFrom: "1985-03-03",
	validTo: "9999-12-31"
};

const profileDetail4 = {
	ID: uuid(),
	firstName: "Asg-Test",
	lastName: "Usere2e4",
	parent: employeeHeaders.employeeHeader4.ID,
	validFrom: "1999-01-02",
	validTo: "9999-12-31"
};

const profileDetail5 = {
	ID: uuid(),
	firstName: "Asg-Test",
	lastName: "Usere2e5",
	parent: employeeHeaders.employeeHeader5.ID,
	validFrom: "1999-01-02",
	validTo: "9999-12-31"
};
const profileDetails = [profileDetail1, profileDetail2, profileDetail3, profileDetail4, profileDetail5];

module.exports = {
	profileDetails,
	profileDetail1,
	profileDetail2,
	profileDetail3,
	profileDetail4,
	profileDetail5
};