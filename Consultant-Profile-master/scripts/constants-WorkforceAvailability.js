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

const success_2xx = {
    "success_201": {
        "description": "Created - The request has been fulfilled, resulting in the creation of a new resource.",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/WorkforceAvailabilityService.WorkforceAvailability-create"
                }
            }
        }
    },
    "success_204": {
        "description": "No Content - The server successfully processed the request, and is not returning any content.",
    },
}

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
    "error_405": {
        "description": "Method Not Allowed.",
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
    "url":"https://sandbox.api.sap.com/C4PRM/WorkforceAvailabilityService/v1/"
}, {
    "url": "https://{host}-rm-api.{environment}.{domain}/WorkforceAvailabilityService/v1",
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
    "405": {
        "$ref": "#/components/responses/error_405"
    },
    "409": {
        "$ref": "#/components/responses/error_409"
    }
};

const successResponse = {
    "201": {
        "$ref": "#/components/responses/success_201"
    },
    "204": {
        "$ref": "#/components/responses/success_204"
    }
};

const responseStructure = {
    '/$batch': {
        post: ['201', '204', '400', '401', '403', '404', '405', '409']
    },
};

const contentTypeHeader = [
    {
      "name": "Content-Type",
      "in": "header",
      "required": true,
      "schema": {
          "type": "string",
          "default": "multipart/mixed;boundary=request-separator"
      }
    }
  ];

module.exports = { securitySchemes, error_4xx, success_2xx, servers, errorResponse, successResponse, responseStructure, contentTypeHeader};