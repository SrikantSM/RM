# How to run Resource-Reqest tests locally

<!-- TOC -->

- [How to run Resource-Reqest tests locally](#how-to-run-resource-reqest-tests-locally)
    - [MTA build](#mta-build)
    - [UI-Integration (OPA)](#ui-integration-opa)
        - [Run the test the way pipeline executes](#run-the-test-the-way-pipeline-executes)
        - [To debug locally](#to-debug-locally)
    - [Deploy to CF](#deploy-to-cf)
    - [API-integration](#api-integration)
    - [DB-integration](#db-integration)
    - [CrossDomain E2E](#crossdomain-e2e)
    - [Performance Measurement](#performance-measurement)
    - [Performance](#performance)
    - [References](#references)

<!-- /TOC -->

## MTA build
1. git clone https://github.tools.sap/Cloud4RM/Resource-Management.git --recurse
2. cd Resource-Management
3. npm i
4. cd Resource-Request
5. npm run build-mta # (**mbt** build -p=cf)

## UI-Integration (OPA)

### Run the test the way pipeline executes

1. git clone https://github.tools.sap/Cloud4RM/Resource-Management.git --recurse
2. cd Resource-Management
3. npm i
4. cd Resource-Request
5. npm i
6. npm start #check if mockserver works fine first
7. cd tests/ui-integration
8. npm i
9. npm start

### To debug locally

Follow steps 1-8 from above.

In terminal-1 :

9. [optional] `npm run csv2sql` # to convert CSV files to data.sql using Test-commons
10. npm run start-server     # already includes above step-9 (csv2sql)

In terminal-2 :

11. npm run debug-resourceRequest # to run **ManageResourceRequest OPA5** on a new Chrome browser locally
12. npm run debug-processResourceRequest # to run **StaffResourceRequest OPA5** on a new Chrome browser locally

## Deploy to CF

> Assumption: There already exists an MTAR file. <br/>
> Else, check [MTA Build](#mta-build) step above.

1. cf login
2. cf t # to confirm which space to target
3. cf deploy mta_archives/xyz.mtar

## API-integration

1. git clone https://github.tools.sap/Cloud4RM/Resource-Request.git --recurse
2. cd Resource-Request
3. npm i
4. cd tests/api-integration
5. #Add default-env.json (copy from tests/api-integration/default-env.json.example , add global\ALL username password)
6. npm i
7. npm start

VScode config to debug locally:

> Note: This code is written to be added in "Resource-Management/.vscode/launch.json" when VSCode is opened with RM as root folder, but when opening VScode with 'Resource-Request' as root folder and this code is then added to "Resource-Request/.vscode/launch.json", but "/Resource-Request" needs to be removed. ${workspaceFolder} points to the root folder.

```
          {
            "type": "node",
            "request": "launch",
            "name": "Mocha",
            "cwd":"${workspaceFolder}/Resource-Request/tests/api-integration",
            "program": "${workspaceFolder}/Resource-Request/tests/api-integration/node_modules/mocha/bin/_mocha",
            "args": [
              "--timeout",
              "999999",
              "--require",
              "source-map-support/register",
              "--no-lazy",
              "--inspect-brk=9229",
              "${workspaceFolder}/Resource-Request/tests/api-integration/dist/**/*.js"
            ]
          },
```

## DB-integration

1. git clone https://github.tools.sap/Cloud4RM/Resource-Request.git
2. cd Resource-Request
3. npm i
4. cd tests/db-integration
5. #Add .env (copy from tests/db-integration/.env.example , add global\ALL username password)
6. npm i
7. npm start


## CrossDomain E2E

1. git clone https://github.tools.sap/Cloud4RM/Resource-Management.git --recurse
2. cd Resource-Management
3. npm i
4. cd tests/cross-domain-e2e/
5. npm i
6. npm start

VSCode config to debug locally:

> Note: This code needs to be added in "Resource-Management/.vscode/launch.json" as Cross-Domain-E2E tests need to be run from the Umbrella.

```
        {
            "type": "node",
            "request": "launch",
            "name": "Debug - CrossDomain E2E",
            "runtimeExecutable": "npm",
            "cwd":"${workspaceFolder}/tests/cross-domain-e2e",
            "runtimeArgs": [
                "run-script",
                "debug"
            ],
            "port": 9229,
            "skipFiles": [
                "<node_internals>/**"
            ]
        }
```

## Performance Measurement

[Documentation](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/DomainSpecific/Resource-Request/SUPA%20Automates.md#running-locally)

## Performance

1. git clone https://github.tools.sap/Cloud4RM/Resource-Management.git --recurse
2. cd Resource-Management
3. npm i
4. cd tests/performance-data-creation/
5. npm i
6. #Add default-env.json (copy from default-env.json.example , add required details.)
7. npm start -- --bulk-delete
8. npm start -- --static-load
9. npm start -- --bulk-load

VSCode config to debug locally:

> Note: This code needs to be added in "Resource-Management/.vscode/launch.json" as Performance tests need to be run from the Umbrella.

```
          {
            "type": "node",
            "request": "launch",
            "name": "PerfTest",
            "cwd":"${workspaceFolder}/tests/performance-data-creation",
            "runtimeExecutable": "npm",
            "runtimeArgs":["run-script","start-delete"],
            "outFiles":["${workspaceFolder}/tests/performance-data-creation/dist/**/*.js"]
          }
```


## References

- [ResourceManagementDocumentation - AutomatedTests](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/tree/master/documentation/AutomatedTests)
- [Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging)

