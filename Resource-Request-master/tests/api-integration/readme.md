# Resource-Request API Integration Tests
This Node.js application executes integration tests on OData API.

Some environment variables must be set or written to the default-env.json file. A list of the required variables can be found in default-env.json.example.

**Note: The default-env.json should never be checked in into a version control system as it contains sensitive data like credentials.**

For details  [API Integration Tests](#https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/documentation/AutomatedTests/ApiIntegrationTests.md)


#### Resorce-Request services
- [Enterprise Project Service](#Enterprise-Project-Service)
- Resource-request Service [PM]
- Resource-request Service [RM]



# Enterprise Project Service

The enterprise project service has the end point 
- Projects
- Workpackages
- Demands
- Customer
- BillingRoles

The basic master data for the API test are inserted directly into the DB via the common module.

## Customers
| ID           |  Name            |
|---           | ----------       |
| 1000101010   | John & Smith Co  | 
| 1000101011   | iTelO            | 
| 1000101012   | Almika           |


## Billing Roles
| ID           |  Name              |
|---           | ----------         |
| B001         | Junior Consultant  | 
| B002         | Senior Consultant  | 
| B003         | Platinum Consultant|


## Service Organoization
| Code         |  isSales | is Delivery  | description    |       
| ------       |-----     |-----         |-----           |
| ORG100       |    X     |   X          |  Org 1         |


Once the insertion of the master data is successfull, the tests are run in the below manner for each endpoint.

1. Create Project 
2. Get Project 
3. Update Project
4. Create Workpackage
5. Get Workpackage
6. Update Workpackage
7. Create Workpackage
8. Get Workpackage
9. Update Workpackage
10. Create Demand
11. Get Demand
12. Update Demand
13. Delete Demand
14. Delete Workpackage
15. Delete Project


You can refer the tests [here](https://github.tools.sap/Cloud4RM/Resource-Request/blob/dev/ProjectServiceAPITest/tests/api-integration/src/tests/EnterpriseProjectService.ts)

