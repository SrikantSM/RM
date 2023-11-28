# DB Integration Tests
This Node.js application executes integration tests on the ResourceRequest OData API.

To start the service, specific environment variables must be set or written to a `.env` file. A list of the required variables can be found in [.env.example](.env.example).

## Executing
To run the tests, execute `npm install`, followed by an `npm start`.

## Creating new tests
New tests are created as classes in the directory [src/tests/](src/tests/). The general test structure follows the style defined by [mocha-typescript](https://www.npmjs.com/package/mocha-typescript).

Required mock data should be provided in [src/tests/data](src/tests/data).

A ready-to-use debug configuration is included in [.vscode/launch.json](.vscode/launch.json).

## Test Scenarios for Resource Request domain

### Matching Engine

1. [Availability Match](src/tests/matching-engine/availability-match/availability.md)
2. [Role Match](src/tests/matching-engine/role-match/role-match.md)
3. [Skill Match](src/tests/matching-engine/skill-match/skill.md)
4. [Total Match](src/tests/matching-engine/total-match/total-match.md)
5. [Utilization of Consultant](src/tests/matching-engine/utilization/utilization.md)

### Staffing Status

1. [Staffing Status](src/tests/staffing-status/staffingStatus.md)
