const projects = require("./projects");
const customer1 = {
	ID: projects.project1.customer_ID,
	name: "CAD International Customer 1"
};
const customer2 = {
	ID: projects.project2.customer_ID,
	name: "CAD International Customer 2"
};
const customer3 = {
	ID: projects.project3.customer_ID,
	name: "CAD International Customer 3"
};
const customer4 = {
	ID: projects.project4.customer_ID,
	name: "CAD International Customer 4"
};
const customer5 = {
	ID: projects.project5.customer_ID,
	name: "CAD International Customer 5"
};

const customer = [customer1, customer2, customer3, customer4, customer5];
module.exports = {
	customer,
	customer1,
	customer2,
	customer3,
	customer4
};
