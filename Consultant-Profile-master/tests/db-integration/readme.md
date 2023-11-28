# DB Integration Tests
This Node.js application executes integration tests on the Consultant-Profile OData API.

## Pipeline Status (DB Integration Stage)
| Pipeline          | Last Run Status | Report |
|-------------------|-----------------|--------|
| Domain Pipeline   | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-DB~Integration~Tests-Run~Hana~Tests/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-DB~Integration~Tests-Run~Hana~Tests/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-DB~Integration~Tests-Run~Hana~Tests/HTML_20Reports/) |
| Umbrella Pipeline | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-DB~Integration~Tests~-~Consultant-Profile-Run~Hana~Tests~-~Consultant-Profile/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-DB~Integration~Tests~-~Consultant-Profile-Run~Hana~Tests~-~Consultant-Profile/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-DB~Integration~Tests~-~Consultant-Profile-Run~Hana~Tests~-~Consultant-Profile/HTML_20Reports/) |

<hr />

## Prerequisite

To start the service, specific environment variables must be set or written to a `.env` file. A list of the required variables can be found in [.env.example](.env.example).

## Executing
To run the tests, execute `npm install`, followed by an `npm start`.

## Creating new tests
New tests are created as classes in the directory [src/tests/](src/tests/). The general test structure follows the style defined by [mocha-typescript](https://www.npmjs.com/package/mocha-typescript).

A ready-to-use debug configuration is included in [.vscode/launch.json](.vscode/launch.json).
