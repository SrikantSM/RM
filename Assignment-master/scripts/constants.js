const securitySchemes = {
    "OAuth2": {
        "description": "OAuth client credentials (client ID and secret) are required.",
        "flows": {
            "clientCredentials": {
                "scopes": {},
                "tokenUrl": "https://{UserAccountSubdomain}.authentication.{CfRegion}.hana.ondemand.com/oauth/token"
            }
        },
        "type": "oauth2"
    }
};

const error_4xx = {
    "error_400": {
        "description": "Bad Request - You have provided an invalid request parameter or the payload does not match the expected format. See error message for details.",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/error"
                }
            }
        }
    },
    "error_401": {
        "description": "Unauthorized - No valid access token (JWT) has been provided or it has expired.",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/error"
                }
            }
        }
    },
    "error_403": {
        "description": "Forbidden - You do not have the necessary authorization to perform this action or to access the requested resource.",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/error"
                }
            }
        }
    },
    "error_404": {
        "description": "Not found - The requested resource does not exist.",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/error"
                }
            }
        }
    },
    "error_409": {
        "description": "Conflict - Could not create the resource, due to a conflict with an existing one (e.g. a unique value was provided that is already used). See error message for details.",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/error"
                }
            }
        }
    }
};

const servers = [{
    "url": "https://sandbox.api.sap.com/C4PRM/AssignmentService/v1/"
}, {
    "url": "https://{host}-rm-api.{environment}.{domain}/AssignmentService/v1",
    "variables": {
        "host": {
            "default": "c4p",
            "description": "Your host where SAP S/4HANA Cloud for projects, resource management is deployed"
        },
        "environment": {
            "default": "cfapps",
            "description": "Your defined environment for SAP S/4HANA Cloud for projects, resource management account"
        },
        "domain": {
            "default": "eu10.hana.ondemand.com"
        }
    }
}];

const errorResponse = {
    "400": {
        "$ref": "#/components/responses/error_400"
    },
    "401": {
        "$ref": "#/components/responses/error_401"
    },
    "403": {
        "$ref": "#/components/responses/error_403"
    },
    "404": {
        "$ref": "#/components/responses/error_404"
    },
    "409": {
        "$ref": "#/components/responses/error_409"
    }
};

const responseStructure = {
    '/Assignments': {
        get: ['400', '401'],
        post: ['400', '401', '403', '409']
    },
    '/Assignments({ID})': {
        get: ['400', '401', '403', '404'],
        patch: ['400', '401', '403', '404'],
        delete: ['400', '401', '403', '404']
    },
    '/Assignments({ID})/_workAssignment': {
        get: ['400', '401', '403', '404']
    },
    '/WorkAssignment': {
        get: ['400', '401']
    },
    '/WorkAssignment({resourceID})': {
        get: ['400', '401', '403', '404']
    },
    '/Assignments({ID})/_dailyAssignmentDistribution': {
        get: ['400', '401', '403', '404']
    },
    '/Assignments({ID})/_weeklyAssignmentDistribution': {
        get: ['400', '401', '403', '404']
    },
    '/Assignments({ID})/_monthlyAssignmentDistribution': {
        get: ['400', '401', '403', '404']
    },
    '/DailyAssignmentDistribution': {
        get: ['400', '401'],
        post: ['400', '401', '403', '409']
    },
    '/WeeklyAssignmentDistribution': {
        get: ['400', '401'],
        post: ['400', '401', '403', '409']
    },
    '/MonthlyAssignmentDistribution': {
        get: ['400', '401'],
        post: ['400', '401', '403', '409']
    },
    '/DailyAssignmentDistribution({ID})': {
        get: ['400', '401', '403', '404'],
        patch: ['400', '401', '403', '404'],
        delete: ['400', '401', '403', '404']
    },
    "/WeeklyAssignmentDistribution(assignmentID={assignmentID},calendarWeek='{calendarWeek}')": {
        get: ['400', '401', '403', '404'],
        patch: ['400', '401', '403', '404'],
        delete: ['400', '401', '403', '404']
    },
    "/MonthlyAssignmentDistribution(assignmentID={assignmentID},calendarMonth='{calendarMonth}')": {
        get: ['400', '401', '403', '404'],
        patch: ['400', '401', '403', '404'],
        delete: ['400', '401', '403', '404']
    },
    '/$batch': {
        post: ['400', '401']
    }
};

const mandatoryFieldsForAssignment = ['requestID', 'resourceID', 'isSoftBooked'];
const mandatoryFieldsForDailyAssignmentDistribution = ['assignmentID', 'date', 'bookedCapacity'];
const mandatoryFieldsForWeeklyAssignmentDistribution = ['bookedCapacity'];
const mandatoryFieldsForMonthlyAssignmentDistribution = ['bookedCapacity'];

module.exports = { securitySchemes, error_4xx, servers, errorResponse, responseStructure, mandatoryFieldsForAssignment, mandatoryFieldsForDailyAssignmentDistribution, mandatoryFieldsForWeeklyAssignmentDistribution, mandatoryFieldsForMonthlyAssignmentDistribution };
