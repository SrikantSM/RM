# Test-Commons for Resource Management
This package contains common functionality used in various automated test types implemented in Resource Management.

## Features

### Cloud Foundry Access
- [CloudFoundryClient](src/connection/CloudFoundryClient.ts): A wrapper for the Cloud Foundry API to programmatically access app environments and more

### OData API Access
- [ServiceClient](src/connection/ServiceClient.ts): A wrapper to easily connect to OData interfaces of deployedapplications.

### Test Data Management
In total, this package allows to import data from JSON definitions and CSV files and exports it into a HANA database, or a database file containing HANA or SQLite SQL statements.

- [CsvParser](src/utils/CsvParser.ts): A utility class to parse CSV files into entity instances.
- [DatabaseClient](src/connection/DatabaseClient.ts): A wrapper for the HANA Node.js API to easily execute SQL statements against a connection to a deployed HANA container. Different [entity repositories](src/entities) extend this client by adding typed access.
- [StatementFileWriter](src/utils/StatementFileWriter.ts): A utility class to write SQL statements to a file instead of sending them to a HANA database.
- [HanaSqlGenerator](src/utils/sql/HanaSqlGenerator.ts): Class to allow generating HANA SQL.
- [SqliteSqlGenerator](src/utils/sql/SqliteSqlGenerator.ts): Class to allow generating SQLite SQL.

### Debugging Capabilities

With the [`debug` library](https://www.npmjs.com/package/debug), behavior of Test-Commons can be easily debugged. All tags have the prefix `tc:` to prevent name duplication if consumers of test-commons also use `debug`. At the moment, the following tag(s) are implemented, more can be introduced based on demand:

- `tc:sql`: Log the SQL statements `prepare`d and `execute`d by the `DatabaseClient`

Logging for a certain tag can be activated via the `DEBUG` environment variable, wildcards are supported. Depending on your shell, you can pass the environment variable to the test execution (sample from git bash):

```sh
DEBUG=tc:* npm run start
```

## Usage in Tests

To ensure that a consistent version of Test-Commons is used, it is recommended to always refer to a specific commit of Test-Commons to be used in your test's `package.json`, i.e.

```json
    "dependencies": {
        ...
        "test-commons": "git+https://github.tools.sap/Cloud4RM/Test-Commons#62ee4abe70e113477c47854ccfaa3dc801a06cad"
    },
```

**To consume an updated version of Test-Commons, each user must call `npm update test-commons` to update his local-only `package-lock.json` as well as the contents in `node_modules/test-commons`.**

This has several advantages:
- It's made explicit which version of Test-Commons is used
- `npm update test-commons` should work to reliably update the installed package locally (before that, you'd have to delete several files before re-installing everything)
- In the hotfix branches of the project, we automatically still use the version of Test-Commons that worked at that point in time and doesn't contain any breaking changes that may have been introduced while working on the next minor version of RM
- Adaptions to upcoming changes in the database layout can already be merged in Test-Commons for runs of the Domain-pipeline introducing the layout changes. Other domains can migrate to newer version as soon as the change reaches the Umbrella.

The main drawback, of course, is that we must now manually maintain the commitId at every place, in which Test-Commons is used. However, we find that there is only a limited number of times when you'd have to update the commit:
1. You created a new feature / breaking change in Test-Commons to support a test you are currently developing -- you are already editing code around the place in which Test-Commons is used, so updating the commitId is no huge effort
2. Your tests are failing in the pipeline, e.g. due to changes in dependent domains. In most cases, you'd have to adjust your test-data anyways, so updating the commitId of Test-Commons at the same time is no huge effort

## Development
Please make sure that `npm run lint` and `npm run build` succeed without errors or warnings.
