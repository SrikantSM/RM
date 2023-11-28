const fs = require('fs');
const constants = require('./constants.js');

const schema = 'Resource-Request/srv/src/main/resources/schema.sql';
// The last SQL statement part of the schema.sql doesn't have ; by default so adding it manually
var dataToBeInserted = '; \n\n';

/* The Below code will do following
  1. Read the file mentioned in the JSON object hanaNativeArtifacts
  2. Traverse through the internal JSON corresponding to that particular file and replace the key with the value
  The Point 2 is required to overcome the CDS specefic annotations and mixins which might not be present already.
*/
for (var fileName in constants.hanaNativeArtifacts) {
    let artifactDataToBeInserted = String(fs.readFileSync(fileName));
    for (var replaceValue in constants.hanaNativeArtifacts[fileName]) {
        artifactDataToBeInserted = artifactDataToBeInserted.replace(replaceValue, constants.hanaNativeArtifacts[fileName][replaceValue]);
    }
    dataToBeInserted += `Create ${artifactDataToBeInserted}\n\n`;
}

dataToBeInserted = dataToBeInserted + constants.matchingCandidatesTable;
dataToBeInserted = dataToBeInserted + constants.DropView;
dataToBeInserted = dataToBeInserted + constants.CompareResourceSkillsTable;
dataToBeInserted = dataToBeInserted + constants.DropViewAvailability;
dataToBeInserted = dataToBeInserted + constants.CompareResourceAvailabilityTable;
dataToBeInserted = dataToBeInserted + constants.InsertIntoCompareResourceSkillsTable;

// Write the data to the the schema file
fs.appendFileSync(schema, dataToBeInserted);
