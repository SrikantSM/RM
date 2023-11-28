# Scope of Automated Tests

This document provides the scope of various automated tests with examples

## Test Type

- [Unit Tests](#unit-tests)
- [UI Integration](#ui-integration) 
- [End To End](#end-to-end)
- [API Integration](#api-integration)
- [DB Integration](#db-integration)

## Unit Tests

It is always recommended to cover all lines and possible conditions at unit test level. If there are cases where we can't acheive full coverage then we must ensure atleast 85% of coverage for the new code so as to maintain overall code coverage above 85%.

## UI Integration

| Scope | Example | 
|------ | ------- |
| Check for the presence of ui controls and their behaviors in a ui component | Check for the presence of filters, search, table, input fields, buttons etc |
| Check the navigation between screens/components | Check for the navigation from list report page to object page |
| Check the static texts | Check for the column names, field texts, app title, page title etc |
| Check for the presence of controls that we configure explicitly (not enabled by the framework) | Check for the variant management control etc |
| No need to check the db data | Check for the table data/ Field values etc is not needed |
| No need to check by default framework provided controls | Check for the presence of sort icon, paging buttons etc |
| No need to check the errors that generated from various validations | Check for the display of error dialog upon adding a duplicate skill assignment etc |

## End To End

| Scope | Example | 
|------ | ------- |
| Check the Search and Filter controls functionality in list report, value help, object page etc. | Check search functionality for atleast one case. If there are multiple filters in list report, then checking one case for one of those filters is enough. |
| Check the end to end functionality | Check for the uplaod of service org, creation of skill, deletion of roles etc |
| Check the db data | Check for the table data, value help data, field values etc |
| If multiple validations have same behavior and if their error messages are already covered by api tests then it is enough to check error message content for one validation in uiveri5 | For Ex: In service org upload, for various upload error cases, we can check for one error case in uiveri5 (to ensure ui is displaying correctly) if rest of the error cases handled in api tests |
| No need to check the framework provided functinality unless we make some changes to their defalut behavior | Check of sort, filter, variant management, adapt filters etc for their functionality |

## Api Integration

| Scope | Example | 
|------ | ------- |
| Check various end points for their functionality | Check the response received after performing GET, POST etc operations on any of the entity |
| Check data (structure and value) that is exposed by various service end points | |
| Check the authorization and authentication | Check for the access to consutant profile without authorization, access to other consultant's profile etc |
| Check various validations error messages content | For Ex: Upload of csv file with invalid content in availability upload, Adding an invalid role assignment etc |
| Input validation | For Ex: Provide invalid values to input fields and check if the response is as expected or not |

## Db Integration

| Scope | Example | 
|------ | ------- |
| Check the Native Hana artifacts | Check if we have written any hana specific artifacts such as procedure, triggers e.g. `fill time dimension views` |
| Check the Cross domain view written by us | Check we have created a view that are not consumed by us. e.g. `ResourceDetails` |
