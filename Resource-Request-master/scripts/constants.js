/* eslint-disable quote-props */
const matchingCandidatesTable = `
CREATE TABLE com_sap_resourceManagement_resourceRequest_MatchingCandidates1 (

  resourceRequest_ID NVARCHAR(36),
  resource_ID NVARCHAR(36),
  resourceRequestStartDate NVARCHAR(20) NOT NULL,
  resourceRequestEndDate NVARCHAR(20) NOT NULL,
  resourceName NVARCHAR(257) NOT NULL,
  remainingCapacity DECIMAL(10, 2) NULL,
  availabilityMatchPercentage DECIMAL(6, 2) NULL,
  skillMatchPercentage DECIMAL(6, 2) NULL,
  utilizationPercentage DECIMAL(6, 2) NULL,
  totalMatchPercentage DECIMAL(6, 2) NULL,
  PRIMARY KEY(resourceRequest_ID, resource_ID)
);\n\n`;

const CompareResourceSkillsTable = `
CREATE TABLE localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills  (

    resourceRequestId NVARCHAR(36),
    resourceID NVARCHAR(36),
    skillId NVARCHAR(36) NOT NULL,
    skillName NVARCHAR(60) NOT NULL,
    requestedProficiencyLevelID NVARCHAR(36) NOT NULL,
    resourceProficiencyLevelID NVARCHAR(36) NOT NULL,
    resourceProficiencyLevelName NVARCHAR(60) NOT NULL,
    importance NVARCHAR(1) NOT NULL,
    proficiencySetMaxRank NVARCHAR(1) NOT NULL,
    resourceProficiencyLevelRank NVARCHAR(1) NOT NULL,
    requestProficiencyLevelRank NVARCHAR(1) NOT NULL,
  PRIMARY KEY(resourceRequestId, resourceID, skillId)
);\n\n`;

const DropView = `\nDROP VIEW localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills;\n`;

const InsertIntoCompareResourceSkillsTable = `\n-- Inserting into the localized table created for local testing of Skill Comparison ---- \n

INSERT INTO localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills (resourceRequestId, resourceID, skillId, skillName, requestedProficiencyLevelID, resourceProficiencyLevelID, resourceProficiencyLevelName, importance, proficiencySetMaxRank, resourceProficiencyLevelRank, requestProficiencyLevelRank) VALUES ('16b79902-afa0-4bef-9658-98cd8d671212', '3f0c80ff-8573-485a-8413-48855551631d', 'e08cce86-c8a2-11e9-a32f-2a2ae2dbcce4','Core Data Service','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','Not Set','1','1','1','1');
INSERT INTO localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills (resourceRequestId, resourceID, skillId, skillName, requestedProficiencyLevelID, resourceProficiencyLevelID, resourceProficiencyLevelName, importance, proficiencySetMaxRank, resourceProficiencyLevelRank, requestProficiencyLevelRank) VALUES ('16b79902-afa0-4bef-9658-98cd8d671212','3f0c80ff-8573-485a-8413-48855551631d','e08cd0fc-c8a2-11e9-a32f-2a2ae2dbcce4','NodeJavaScript','21dd385a-eb5b-4c6a-848e-bce74a48c6da','21dd385a-eb5b-4c6a-848e-bce74a48c6da','Proficiency Level 1.3','1','3','3','2');
INSERT INTO localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills (resourceRequestId, resourceID, skillId, skillName, requestedProficiencyLevelID, resourceProficiencyLevelID, resourceProficiencyLevelName, importance, proficiencySetMaxRank, resourceProficiencyLevelRank, requestProficiencyLevelRank) VALUES ('16b79902-afa0-4bef-9658-98cd8d671212','3c51b7c6-dbfb-47ab-ae98-e3e1557d1c5d','e08ce47a-c8a2-11e9-a32f-2a2ae2dbcce4','Cloud Foundry','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','Proficiency Level 2.3','1','3','3','2');
INSERT INTO localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills (resourceRequestId, resourceID, skillId, skillName, requestedProficiencyLevelID, resourceProficiencyLevelID, resourceProficiencyLevelName, importance, proficiencySetMaxRank, resourceProficiencyLevelRank, requestProficiencyLevelRank) VALUES ('16b79902-afa0-4bef-9658-98cd8d671212','3c51b7c6-dbfb-47ab-ae98-e3e1557d1c5d','e08cce86-c8a2-11e9-a32f-2a2ae2dbcce4','Core Data Service','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','Not Set','1','1','1','1');
INSERT INTO localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills (resourceRequestId, resourceID, skillId, skillName, requestedProficiencyLevelID, resourceProficiencyLevelID, resourceProficiencyLevelName, importance, proficiencySetMaxRank, resourceProficiencyLevelRank, requestProficiencyLevelRank) VALUES ('16b79902-afa0-4bef-9658-98cd8d671212','3c51b7c6-dbfb-47ab-ae98-e3e1557d1c5d','e08cd0fc-c8a2-11e9-a32f-2a2ae2dbcce4','NodeJavaScript','21dd385a-eb5b-4c6a-848e-bce74a48c6da','21dd385a-eb5b-4c6a-848e-bce74a48c6da','Proficiency Level 1.1','1','3','1','2');
INSERT INTO localized_com_sap_resourceManagement_resourceRequest_CompareResourceSkills (resourceRequestId, resourceID, skillId, skillName, requestedProficiencyLevelID, resourceProficiencyLevelID, resourceProficiencyLevelName, importance, proficiencySetMaxRank, resourceProficiencyLevelRank, requestProficiencyLevelRank) VALUES ('16b79902-afa0-4bef-9658-98cd8d671212','742e3684-3b44-11ea-b77f-2e728ce88125','e08cce86-c8a2-11e9-a32f-2a2ae2dbcce4','Core Data Service','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee','Proficiency Level 2.2','1','3','2','2');
\n\n`;

const CompareResourceAvailabilityTable = `
CREATE TABLE com_sap_resourceManagement_resourceRequest_CompareResourceAvailability  (

    resourceRequestId NVARCHAR(36),
    resourceId NVARCHAR(36),
    netCapacityInHours INTEGER NOT NULL,
  PRIMARY KEY(resourceRequestId, resourceId)
);\n\n`;

const DropViewAvailability = `\nDROP VIEW com_sap_resourceManagement_resourceRequest_CompareResourceAvailability;\n`;

const hanaNativeArtifacts = {
    "./Consultant-Profile/db/src/views/COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_JOBDETAILSMAXEVENTSEQEXTRACTOR.hdbview": {
        "JD1.country.name" : "'dummy_country_name'"
    }
};

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
    "url":"https://sandbox.api.sap.com/C4PRM/ResourceRequestService/v1/"
}, {
    "url": "https://{host}-rm-api.{environment}.{domain}/ResourceRequestService/v1",
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
    '/ResourceRequests': {
        get: ['400', '401'],
        post: ['400', '401', '403', '409']
    },
    '/ResourceRequests({ID})':{
        get: ['400', '401', '403', '404'],
        patch: ['400', '401', '403', '404'],
        delete: ['400', '401', '403', '404']
    },
    '/$batch': {
        post: ['400', '401']
    },
    '/ReferenceObjects': {
        get: ['400', '401'],
        post: ['400', '401', '403', '409']
    },
    '/ReferenceObjects({ID})':{
        get: ['400', '401', '403', '404'],
        patch: ['400', '401', '403', '404'],
        delete: ['400', '401', '403', '404']
    }
};

const mandatoryFields = ['startDate', 'endDate', 'requiredEffort', 'name'];
const refObjMandatoryFields = ['displayId', 'typeCode'];

module.exports = { CompareResourceSkillsTable,DropView,InsertIntoCompareResourceSkillsTable, matchingCandidatesTable,CompareResourceAvailabilityTable,DropViewAvailability,hanaNativeArtifacts, securitySchemes, error_4xx, servers, errorResponse, responseStructure, mandatoryFields, refObjMandatoryFields};
