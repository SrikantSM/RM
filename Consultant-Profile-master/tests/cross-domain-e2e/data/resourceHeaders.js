const uuid = require('uuid').v4;
const workAssignments = require('./workAssignments');

const resourceHeader1 = {
    ID : workAssignments.workAssignment1.ID,
    type_code: 1
}

const resourceHeader2 = {
    ID : workAssignments.workAssignment2.ID,
    type_code: 1
}

const resourceHeader3 = {
    ID : workAssignments.workAssignment3.ID,
    type_code: 1
}

const resourceHeader4 = {
    ID : workAssignments.workAssignment4.ID,
    type_code: 1
}


const resourceHeaders = [
    resourceHeader1,
    resourceHeader2,
    resourceHeader3,  
    resourceHeader4
]

module.exports = {
    resourceHeaders,
    resourceHeader1,
    resourceHeader2,
    resourceHeader3,  
    resourceHeader4
}
