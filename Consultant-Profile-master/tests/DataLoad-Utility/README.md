# Data Load Utility

This utility can be used to put data to specific tenant using the csv files.

## How to Use
### Below are the step to load/unload data each entity:-
1. Download the [Excel](https://teams.microsoft.com/l/file/EA3E44AC-E481-461F-A37D-EA9808433094?tenantId=42f7676c-f455-423c-82f6-dc2d99791af7&fileType=xlsm&objectUrl=https%3A%2F%2Fsap.sharepoint.com%2Fteams%2FRMTeamBLRValiant%2FShared%20Documents%2FGeneral%2FCustomer%20Data%2FData-Prepare.xlsm&baseUrl=https%3A%2F%2Fsap.sharepoint.com%2Fteams%2FRMTeamBLRValiant&serviceName=teams&threadId=19:0ad46e1cc27d43a3a42fb5c9596dbcf4@thread.skype&groupId=1180749a-9513-4ad9-97b3-bc25e2baf453).
2. Modify date in the downloaded excel with the data which is suposed to be uploaded.
3. Save each sheet with SHeet defined in that excel.
4. Get the repository of entity for which we want to put data and initialize it in `initializeRepositories` method.
```
e.g.: employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
```
5. Refer it in `processor` file in `prepareData` method.
```
{ key: <Repository Variable>, value: await getData<<EntitySignature maintained in Test-Commons>>('<csv file Name>') },
```
```
e.g.: { key: projectRoleRepository, value: await getData<ProjectRole>('ProjectRoles') },
```
_<sup>We can define the file name in `config.ts` in the `src`</sup>_

6. To Load/Unload Data execute below command:-
    1. Data Load: `npm run load-data`
    2. Data Unload: `npm run unload-data`

#### Steps to simulate the Resource Capacity Data.
##### Assumptions:
>The Resource Capacity Data which will be generated wil ensure that the employee is always available.<br/>
>CSV will not be generated for this entity.
1. Define the `starting` and `ending` date for resource capacity data to be generated.
2. Define the working minutes per days as per the country in `config.ts` in `src`.
3. Define The list of Holidays as per the country for duration data needs to be generated.
4. to load the data

### Steps to modify the data
1. Unload already existing data.
2. Modify the CSVs related to entity.
3. load new Data.
