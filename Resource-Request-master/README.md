# Resource Request
 
## Getting Started

Resource management is a process within enterprise project & portfolio management. This process deals with planning and optimizing human resources across different projects. Solution intends to provide a necessary master data and planning tools. Solution focuses on deploying human resources to project based on project demands, qualifications and availability.

[**Resource Request**](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/Technical%20concepts/SDDs/ResourceRequest/current/SDD-RM-ResourceRequest.md) is one of the object in Resource Management SaaS solution.


## Domain Pipeline Status

| Stage                 | Status                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deploy                | [![Deploy Status](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_apis/build/status/Resource-Request?repoName=Cloud4RM%2FResource-Request&branchName=master&stageName=Deploy)](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build/latest?definitionId=1620&repoName=Cloud4RM%2FResource-Request&branchName=master)                        |
| API Integration Test  | [![API Tests Status](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_apis/build/status/Resource-Request?repoName=Cloud4RM%2FResource-Request&branchName=master&stageName=API%20Tests)](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build/latest?definitionId=1620&repoName=Cloud4RM%2FResource-Request&branchName=master) |
| HANA Integration Test | [![DB Tests Status](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_apis/build/status/Resource-Request?repoName=Cloud4RM%2FResource-Request&branchName=master&stageName=DB%20Tests)](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build/latest?definitionId=1620&repoName=Cloud4RM%2FResource-Request&branchName=master)      |
| UI Integration Test Main   | [![OPA Main Status](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_apis/build/status/Resource-Request?repoName=Cloud4RM%2FResource-Request&branchName=master&stageName=OPA%20Main)](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build/latest?definitionId=1620&repoName=Cloud4RM%2FResource-Request&branchName=master)      |
| UI Integration Test ED  | [![OPA ED Status](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_apis/build/status/Resource-Request?repoName=Cloud4RM%2FResource-Request&branchName=master&stageName=OPA%20Effort%20Distribution)](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build/latest?definitionId=1620&repoName=Cloud4RM%2FResource-Request&branchName=master)     |

## SonarQube Project Status

| Project                                                                                                                                                                                                                                        | Metric                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| resourceRequest-srv                                                                                                                                                                                                                            | [![Bugs](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3AresourceRequest-srv&metric=bugs)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3AresourceRequest-srv)                                       |
| [![Quality Gate Status](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3AresourceRequest-srv&metric=alert_status)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3AresourceRequest-srv)                 | [![Code Smells](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3AresourceRequest-srv&metric=code_smells)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3AresourceRequest-srv)                         |
|                                                                                                                                                                                                                                                | [![Coverage](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3AresourceRequest-srv&metric=coverage)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3AresourceRequest-srv)                               |
|                                                                                                                                                                                                                                                | [![Vulnerabilities](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3AresourceRequest-srv&metric=vulnerabilities)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3AresourceRequest-srv)                 |
|                                                                                                                                                                                                                                                |                                                                                                                                                                                                                                               |
| project-integration-adapter                                                                                                                                                                                                                    | [![Bugs](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3Aproject-integration-adapter&metric=bugs)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3Aproject-integration-adapter)                       |
| [![Quality Gate Status](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3Aproject-integration-adapter&metric=alert_status)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3Aproject-integration-adapter) | [![Code Smells](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3Aproject-integration-adapter&metric=code_smells)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3Aproject-integration-adapter)         |
|                                                                                                                                                                                                                                                | [![Coverage](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3Aproject-integration-adapter&metric=coverage)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3Aproject-integration-adapter)               |
|                                                                                                                                                                                                                                                | [![Vulnerabilities](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3Aproject-integration-adapter&metric=vulnerabilities)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3Aproject-integration-adapter) |

## Folder Structure

| File / Folder           | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `srv/`                  | All service related files                        |
| `db/`                   | Database module                                  |
| `app/`                  | Html5 app module                                 |
| `appRouter`             | Acts as a proxy to service from UI               |
| `package.json`          | project metadata and configuration               |
| `tests/api-integration` | contains Node.js app for API tests               |
| `tests/db-integration`  | contains Node.js app to test HANA artifacts      |
| `tests/ui-integration`  | contains UI Integration (OPA) tests              |
| `tests/end-to-end`      | Contains cross domain end to end (UIveri5) tests |
| `utils`                 | contains local setup                             |
| `readme.md`             | this readme                                      |

## Important Links

[Swagger UI](https://github.tools.sap/pages/Cloud4RM/Resource-Request)
> The above comes from master code and might varry from the published API content.

[API Hub Published Content](https://api.sap.com/package/SAPS4HANACloudForProjectsResourceManagement/overview)

[API Hub Staged Content](https://cloudintegration.int.sap.eu2.hana.ondemand.com/package/SAPS4HANACloudForProjectsResourceManagement?section=Artifacts)

[Onboarding](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/DomainSpecific/Resource-Request/Onboarding.md)

[Resource Request Domain Pipeline](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build?definitionId=1620)

[Umbrella Pipeline](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build?definitionId=1619)

[Resource Management Repository](https://github.tools.sap/Cloud4RM/Resource-Management.git)

[Mockups](https://fiori-prototyping-space.mo.sap.corp/axure/ProfessionalServices/DSAG%20Mockups/index.html#g=1&p=rr_-_list_report&c=)

[Run Project Integration Adapter Locally](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/DomainSpecific/Resource-Request/Running%20Project%20Integration%20Adapter%20Locally.md)

[Offboarding](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/DomainSpecific/Resource-Request/Offboarding.md)

## Setup

### **Prerequisites**

- Make sure you have setup a development environment that is [as described here.](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/Project%20set-up%20and%20ongoing%20management/DevelopmentSetup/readme.md)


- As this is a [git-submodules](https://git-scm.com/docs/gitsubmodules) project please clone the [super project repository](https://github.tools.sap/Cloud4RM/Resource-Management) application using the following command.


```sh
git clone https://github.tools.sap/Cloud4RM/Resource-Management.git --recurse
```

- Handy tools required for contributing to this project can be found [here](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/DomainSpecific/Resource-Request/toolsToUse.md).


### **Run the Application locally**


Please Run the below commands in `Resource-Management\Resource-Request` folder:
- `npm run initial-setup` to install dependencies.
- `npm run mockserver` to run service layer on port 8080.
- Run `npm run mockui` in another terminal to run App layer on port 5000.
- Open the url `http://localhost:5000` to access the application tiles.

### **Build and Deploy the application to Cloud Foundry**

#### Option 1

1. Open command line and navigate to the project `Resource-Request` folder from `Resource-Management`.

```
cd Resource-Management\Resource-Request
```

2. Run the following command from your command line to build the `mtar`.

```
npm run build-mta
```

3. Once the mtar is built, you can find the build artifact it in `mta_archives` folder.

```
cd mta_archives
```

5. Now it is ready to be deployed in Cloud Foundry space.

 ```
 cf deploy <...>.mtar`  ( e.g. cf deploy Resource-Management.mtar )
```

#### Option 2

Alternatively the MTA archive can be build via the command `mbt build -p=cf`. The result is a `.mtar` file which will be created in the mta_archives folder. This `.mtar` file could be deployed to CF.

> To know more about MBT tool, refer https://sap.github.io/cloud-mta-build-tool/


### **Run the Tests locally**

Please refer [How To Run Tests](https://github.tools.sap/Cloud4RM/Resource-Request/blob/master/tests/HowToRunTests.md)


### Related Links

SAP Project Cloud [Naming Convention](https://github.wdf.sap.corp/Cloud4Projects/Documentation/blob/master/naming-conventions.md)

