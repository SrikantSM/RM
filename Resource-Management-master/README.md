# Umbrella for ResourceManagement

This is the superproject (umbrella project) for Resource-Management.

| System                                                                                                                                          | Purpose                                        |     MT enabled     |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | :----------------: |
| [End 2 End Test](https://rmdev-tenant-c4p-rm-test-e2e-rm-approuter.cfapps.sap.hana.ondemand.com/cp.portal/site#Shell-home)                      | Regression + Integration test                  | :heavy_check_mark: |
| [User Acceptance Test](https://rm-consumer-tenant-c4p-rm-test-uat-rm-approuter.internal.cfapps.sap.hana.ondemand.com/cp.portal/site#Shell-home) | Lastest Stable Sprint build for manual testing | :heavy_check_mark: |
| [Internal Productive System]( https://rm-consumer-tenant-c4p-rm-int-prod-rm-approuter.cfapps.sap.hana.ondemand.com/cp.portal/site#Shell-home)   | Latest Release for manual testing and demos    | :heavy_check_mark: |
| [CI/CD Pipeline](https://dev.azure.com/hyperspace-pipelines/Cloud4RM/_build/)                                                                   | Azure DevOps Pipelines                         |                    |
| [EU10 Availability Service](https://availability.cfapps.sap.hana.ondemand.com/index.html#/evaluation/51426919)                                  | Monitor downtimes of EU10 productive system    |                    |

## Resource Management Releases
See [Sirius release plan](https://ifp.wdf.sap.corp/sirius/#/program/82DA079B59C0B746C95872D8C134C1AD/releaseplanOverviewFull)

## Setup
Set up your development environment as described [here](https://github.tools.sap/Cloud4RM/V4TemplateApp/#basic-setup).

Copy & run this on your command line:

```sh
git clone https://github.tools.sap/Cloud4RM/Resource-Management.git --recurse
cd Resource-Management
npm install
```

If you want to add a new submodule run this in your command line:

```sh
git submodule add <your git repository you want to add as a submodule>
```

## Build
To build the umbrella project and all submodules into one MTA archive, execute the following in your command line:

```sh
npm run build-mta
```

## Workflow

1. Make change in submodule

2. `git commit` change in submodule

3. `git commit` change in superproject

4. `git submodule update` to push change to the individual repositories that predate the superproject


## Folder Structure

| File/Folder                                                                                                                                                                                                                                                       | Purpose                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`approuter/`](approuter/)                                                                                                                                                                                                                                        | Acts as a proxy to service from UI                                                                   |
| [`db/`](db/)                                                                                                                                                                                                                                                      | Database module                                                                                      |
| [`flp-content/`](flp-content)                                                                                                                                                                                                                                     | Fiori-Launchpad Configuration                                                                        |
| `<submodule>/app` <ul><li> e.g. [Consultant-Profile/app](https://github.tools.sap/Cloud4RM/Consultant-Profile/tree/master/app) </li> <li> e.g. [Resource-Request/app](https://github.tools.sap/Cloud4RM/Resource-Request/tree/master/app)</li> <li> ... </li><ul> | Contains HTML5 app modules of the respective domain                                                  |
| `<submodule>/srv` <ul><li> e.g. [Assignment/srv](https://github.tools.sap/Cloud4RM/Assignment/tree/master/srv) </li> <li> e.g. [Central-Services/srv](https://github.tools.sap/Cloud4RM/Central-Services/tree/master/srv)</li> <li> ... </li><ul>                 | <p>Java Module of the respective domain and REST service (incl OData service definitions) </p>       |
| [`ui-content/`](ui-content/)                                                                                                                                                                                                                                      | Deploys all the HTML5 Application during the deployment                                              |
| [mta_extensions/](mta_extensions/)                                                                                                                                                                                                                                | MTA Extension descriptors specific to different environment (e.g. dev,test,prod (us-10,eu-10,etc..)) |
| [`mta.yaml`](mta.yaml)                                                                                                                                                                                                                                            | Contains the configuration of productive code                                                        |
| [`package.json`](package.json)                                                                                                                                                                                                                                    | Project metadata and configuration                                                                   |
| [`translation_v2.json`](translation_v2.json)                                                                                                                                                                                                                      | Translation Configuration                                                                            |