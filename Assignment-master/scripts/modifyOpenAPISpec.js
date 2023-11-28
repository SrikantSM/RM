const fs = require('fs');
const constants = require('./constants.js');

// Some constants for this file.
const serviceName = 'Assignment';
const entityName = 'Assignments';
const dailyDistributionEntityName = 'DailyAssignmentDistribution';
const weeklyDistributionEntityName = 'WeeklyAssignmentDistribution';
const monthlyDistributionEntityName = 'MonthlyAssignmentDistribution';

// File Names
const jsonSourceFileName = `docs/${serviceName}.openapi3.json`;
const jsonTargetFileName = `docs/${serviceName}.json`;
const xmlSourceFileName = `docs/${serviceName}.xml`;
const xmltargetFileName = `docs/${serviceName}.edmx`;

// Schema Names
const schema = `${serviceName}.${entityName}`;
const createAssignmentPayloadSchema = `${serviceName}.${entityName}-create`;
const createDailyAssignmentDistributionPayloadSchema = `${serviceName}.${dailyDistributionEntityName}-create`;
const createWeeklyAssignmentDistributionPayloadSchema = `${serviceName}.${weeklyDistributionEntityName}-create`;
const createMonthlyAssignmentDistributionPayloadSchema = `${serviceName}.${monthlyDistributionEntityName}-create`;
const updateDailyAssignmentDistributionPayloadSchema = `${serviceName}.${dailyDistributionEntityName}-update`;
const updateWeeklyAssignmentDistributionPayloadSchema = `${serviceName}.${weeklyDistributionEntityName}-update`;
const updateMonthlyAssignmentDistributionPayloadSchema = `${serviceName}.${monthlyDistributionEntityName}-update`;

// Read file generated by CAP.
let openAPISpec = JSON.parse(fs.readFileSync(jsonSourceFileName, 'utf-8'));

// Add missing info required for API hub.
modifyForAPIHub();

// Add details for booked capacity.
addDetailsForBookedCapacity()

// Set 4xx specific error response
add4xxComponents();

// Remove generic 4XX message and add specefic messages.
deleteGenericAndAddSpecefic4XXResponse();

// Need a space between two words for tags
fixTag();

// Add descrition for actions
addDescription();

// Mark mandatory property
markMandatoryProperty();

// Convert json to string to write back in file.
let stringData = JSON.stringify(openAPISpec, null, 2);

// Write modified data back to json file
fs.writeFileSync(jsonSourceFileName, stringData);
// remove .openapi3 from generated file
fs.renameSync(jsonSourceFileName, jsonTargetFileName);
// Convert .xml to .edmx file
fs.renameSync(xmlSourceFileName, xmltargetFileName);

function modifyForAPIHub() {
    openAPISpec['x-sap-shortText'] = 'Manage assignments for resource requests and resources.';
    openAPISpec['x-sap-api-type'] = 'ODATAV4';
    openAPISpec.info.version = '1.0';

    //set the sandox and production server details
    openAPISpec.servers = constants.servers;

    //Set security schemes inside component
    openAPISpec.components['securitySchemes'] = constants.securitySchemes;
}

function add4xxComponents() {
    Object.keys(constants.error_4xx).forEach((errorResponse) => {
        openAPISpec.components.responses[errorResponse] = constants.error_4xx[errorResponse];
    })
}

function addDetailsForBookedCapacity() {
    const property = 'bookedCapacity';
    [schema, createAssignmentPayloadSchema, createDailyAssignmentDistributionPayloadSchema, updateDailyAssignmentDistributionPayloadSchema].forEach((schemaDefinition) => {
        if (openAPISpec.components.schemas[schemaDefinition].properties[property]) {
            delete openAPISpec.components.schemas[schemaDefinition].properties[property].anyOf;
            openAPISpec.components.schemas[schemaDefinition].properties[property].type = 'number';
            openAPISpec.components.schemas[schemaDefinition].properties[property].minimum = 1;
            openAPISpec.components.schemas[schemaDefinition].properties[property].multipleOf = 1;
            openAPISpec.components.schemas[schemaDefinition].properties[property].maximum = 99999999;
        }
    })
}

function deleteGenericAndAddSpecefic4XXResponse() {
    Object.keys(constants.responseStructure).forEach((path) => {
        Object.keys(constants.responseStructure[path]).forEach((httpMethod) => {
            delete openAPISpec.paths[path][httpMethod].responses['4XX'];
            constants.responseStructure[path][httpMethod].forEach((errorCode) => {
                openAPISpec.paths[path][httpMethod].responses[errorCode] = constants.errorResponse[errorCode];
            })
        })
    })
}

function fixTag() {
    const tag = [
        "Assignments",
        "Work Assignment",
        "Daily Assignment Distribution",
        "Weekly Assignment Distribution",
        "Monthly Assignment Distribution"
    ];
    openAPISpec.tags[2].name = tag[1];
    openAPISpec.tags[1].name = tag[2];
    openAPISpec.paths['/Assignments({ID})/_workAssignment'].get.tags = [tag[0], tag[1]];
    openAPISpec.paths['/WorkAssignment'].get.tags = [tag[1]];
    openAPISpec.paths['/WorkAssignment({resourceID})'].get.tags = [tag[1]];
    openAPISpec.paths['/Assignments({ID})/_dailyAssignmentDistribution'].get.tags = [tag[0], tag[2]];
    openAPISpec.paths['/Assignments({ID})/_weeklyAssignmentDistribution'].get.tags = [tag[0], tag[3]];
    openAPISpec.paths['/Assignments({ID})/_monthlyAssignmentDistribution'].get.tags = [tag[0], tag[4]];
    openAPISpec.paths['/Assignments({ID})/_dailyAssignmentDistribution'].post.tags = [tag[0], tag[2]];
    openAPISpec.paths['/Assignments({ID})/_weeklyAssignmentDistribution'].post.tags = [tag[0], tag[3]];
    openAPISpec.paths['/Assignments({ID})/_monthlyAssignmentDistribution'].post.tags = [tag[0], tag[4]];
    openAPISpec.paths['/DailyAssignmentDistribution'].get.tags = [tag[2]];
    openAPISpec.paths['/WeeklyAssignmentDistribution'].get.tags = [tag[3]];
    openAPISpec.paths['/MonthlyAssignmentDistribution'].get.tags = [tag[4]];
    openAPISpec.paths['/DailyAssignmentDistribution'].post.tags = [tag[2]];
    openAPISpec.paths['/WeeklyAssignmentDistribution'].post.tags = [tag[3]];
    openAPISpec.paths['/MonthlyAssignmentDistribution'].post.tags = [tag[4]];
    openAPISpec.paths['/DailyAssignmentDistribution({ID})'].get.tags = [tag[2]];
    openAPISpec.paths["/WeeklyAssignmentDistribution(assignmentID={assignmentID},calendarWeek='{calendarWeek}')"].get.tags = [tag[3]];
    openAPISpec.paths["/MonthlyAssignmentDistribution(assignmentID={assignmentID},calendarMonth='{calendarMonth}')"].get.tags = [tag[4]];
    openAPISpec.paths['/DailyAssignmentDistribution({ID})'].patch.tags = [tag[2]];
    openAPISpec.paths["/WeeklyAssignmentDistribution(assignmentID={assignmentID},calendarWeek='{calendarWeek}')"].patch.tags = [tag[3]];
    openAPISpec.paths["/MonthlyAssignmentDistribution(assignmentID={assignmentID},calendarMonth='{calendarMonth}')"].patch.tags = [tag[4]];
    openAPISpec.paths['/DailyAssignmentDistribution({ID})'].delete.tags = [tag[2]];
    openAPISpec.paths["/WeeklyAssignmentDistribution(assignmentID={assignmentID},calendarWeek='{calendarWeek}')"].delete.tags = [tag[3]];
    openAPISpec.paths["/MonthlyAssignmentDistribution(assignmentID={assignmentID},calendarMonth='{calendarMonth}')"].delete.tags = [tag[4]];
}

function addDescription() {
    openAPISpec.paths['/Assignments'].get.description = 'Read assignments that were created in SAP S/4HANA Cloud for projects, resource management.';
    openAPISpec.paths['/Assignments'].post.description = 'Create assignments in SAP S/4HANA Cloud for projects, resource management.';
    openAPISpec.paths['/Assignments({ID})'].get.description = 'Read specific assignment for a given ID.';
    openAPISpec.paths['/Assignments({ID})'].patch.description = 'Update specific assignment for a given ID.';
    openAPISpec.paths['/Assignments({ID})'].delete.description = 'Delete specific assignment for a given ID.';
    openAPISpec.paths['/Assignments({ID})/_workAssignment'].get.description = 'Read work assignment details for a specific assignment.';
    openAPISpec.paths['/WorkAssignment'].get.description = 'Read work assignments that were created in SAP S/4HANA Cloud for projects, resource management.';
    openAPISpec.paths['/WorkAssignment({resourceID})'].get.description = 'Read specific work assignment details for a given resource ID.';
    openAPISpec.paths['/Assignments({ID})/_dailyAssignmentDistribution'].get.description = 'Read the daily distribution for a specific assignment.';
    openAPISpec.paths['/Assignments({ID})/_weeklyAssignmentDistribution'].get.description = 'Read the weekly distribution for a specific assignment.';
    openAPISpec.paths['/Assignments({ID})/_monthlyAssignmentDistribution'].get.description = 'Read the monthly distribution for a specific assignment.';
    openAPISpec.paths['/DailyAssignmentDistribution'].get.description = 'Read the daily distribution records of the assignment.';
    openAPISpec.paths['/WeeklyAssignmentDistribution'].get.description = 'Read the weekly distribution records of the assignment.';
    openAPISpec.paths['/MonthlyAssignmentDistribution'].get.description = 'Read the monthly distribution records of the assignment.';
    openAPISpec.paths['/DailyAssignmentDistribution'].post.description = 'Create a daily distribution record of the assignment.';
    openAPISpec.paths['/WeeklyAssignmentDistribution'].post.description = 'Create a weekly distribution record of the assignment.';
    openAPISpec.paths['/MonthlyAssignmentDistribution'].post.description = 'Create a monthly distribution record of the assignment.';
    openAPISpec.paths['/DailyAssignmentDistribution({ID})'].get.description = 'Read details for a given daily distribution record.';
    openAPISpec.paths["/WeeklyAssignmentDistribution(assignmentID={assignmentID},calendarWeek='{calendarWeek}')"].get.description = 'Read details for a given weekly distribution record.';
    openAPISpec.paths["/MonthlyAssignmentDistribution(assignmentID={assignmentID},calendarMonth='{calendarMonth}')"].get.description = 'Read details for a given monthly distribution record.';
    openAPISpec.paths['/DailyAssignmentDistribution({ID})'].patch.description = 'Update details for a given daily distribution record.';
    openAPISpec.paths["/WeeklyAssignmentDistribution(assignmentID={assignmentID},calendarWeek='{calendarWeek}')"].patch.description = 'Update details for a given weekly distribution record.';
    openAPISpec.paths["/MonthlyAssignmentDistribution(assignmentID={assignmentID},calendarMonth='{calendarMonth}')"].patch.description = 'Update details for a given monthly distribution record.';
    openAPISpec.paths['/DailyAssignmentDistribution({ID})'].delete.description = 'Delete daily distribution for a given daily distribution record.';
    openAPISpec.paths["/WeeklyAssignmentDistribution(assignmentID={assignmentID},calendarWeek='{calendarWeek}')"].delete.description = 'Delete weekly distribution for a given weekly distribution record.';
    openAPISpec.paths["/MonthlyAssignmentDistribution(assignmentID={assignmentID},calendarMonth='{calendarMonth}')"].delete.description = 'Delete monthly distribution for a given monthly distribution record.';
}

function markMandatoryProperty() {
    // Set mandatory fields in schema.
    openAPISpec.components.schemas[createAssignmentPayloadSchema].required = constants.mandatoryFieldsForAssignment;
    openAPISpec.components.schemas[createDailyAssignmentDistributionPayloadSchema].required = constants.mandatoryFieldsForDailyAssignmentDistribution;
    openAPISpec.components.schemas[createWeeklyAssignmentDistributionPayloadSchema].required = constants.mandatoryFieldsForWeeklyAssignmentDistribution;
    openAPISpec.components.schemas[createMonthlyAssignmentDistributionPayloadSchema].required = constants.mandatoryFieldsForMonthlyAssignmentDistribution;

    // Mark individual fields as nullable false.
    constants.mandatoryFieldsForAssignment.forEach((property) => {
        openAPISpec.components.schemas[createAssignmentPayloadSchema].properties[property] &&
            (openAPISpec.components.schemas[createAssignmentPayloadSchema].properties[property].nullable = false);
    })

    constants.mandatoryFieldsForDailyAssignmentDistribution.forEach((property) => {
        openAPISpec.components.schemas[createDailyAssignmentDistributionPayloadSchema].properties[property].nullable = false;
        openAPISpec.components.schemas[updateDailyAssignmentDistributionPayloadSchema].properties[property].nullable = false;
    })

    constants.mandatoryFieldsForWeeklyAssignmentDistribution.forEach((property) => {
        openAPISpec.components.schemas[createWeeklyAssignmentDistributionPayloadSchema].properties[property].nullable = false;
        openAPISpec.components.schemas[updateWeeklyAssignmentDistributionPayloadSchema].properties[property].nullable = false;
    })

    constants.mandatoryFieldsForMonthlyAssignmentDistribution.forEach((property) => {
        openAPISpec.components.schemas[createMonthlyAssignmentDistributionPayloadSchema].properties[property].nullable = false;
        openAPISpec.components.schemas[updateMonthlyAssignmentDistributionPayloadSchema].properties[property].nullable = false;
    })

}
