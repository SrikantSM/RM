## UIVeri5
The framework used for UI end-to-end tests is UIVeri5, which itself is heavily based on protractor, an end-to-end testing framework for Angular UI's.

## Pipeline Status (End-toEnd Integration Stage)
| Pipeline          | Last Run Status <br /> <sub>`My Project Experience`</sub> | Report | Last Run Status <br /> <sub>`Project Role Config`</sub> | Report |
|-------------------|-----------------|--------|---------|---------------|
| Domain Pipeline   | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-End~to~End~Tests-Run~UIVeri5~Tests/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-End~to~End~Tests-Run~UIVeri5~Tests/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-End~to~End~Tests-Run~UIVeri5~Tests/HTML_20Reports/) | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-End~to~End~Tests~App2-Run~UIVeri5~Tests~App2/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-End~to~End~Tests~App2-Run~UIVeri5~Tests~App2/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-End~to~End~Tests~App2-Run~UIVeri5~Tests~App2/HTML_20Reports/) |
| Umbrella Pipeline | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-End~to~End~Tests~-~Consultant-Profile-My-Project-Experience-Run~UIVeri5~Tests~-~Consultant-Profile-My-Project-Experience/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-End~to~End~Tests~-~Consultant-Profile-My-Project-Experience-Run~UIVeri5~Tests~-~Consultant-Profile-My-Project-Experience/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-End~to~End~Tests~-~Consultant-Profile-My-Project-Experience-Run~UIVeri5~Tests~-~Consultant-Profile-My-Project-Experience/HTML_20Reports/) | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-End~to~End~Tests~-~Consultant-Profile-Project-Roles-Run~UIVeri5~Tests~-~Consultant-Profile-Project-Roles/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-End~to~End~Tests~-~Consultant-Profile-Project-Roles-Run~UIVeri5~Tests~-~Consultant-Profile-Project-Roles/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-End~to~End~Tests~-~Consultant-Profile-Project-Roles-Run~UIVeri5~Tests~-~Consultant-Profile-Project-Roles/HTML_20Reports/) |

## Setups and Documentation
You can find out more about these frameworks and how to use them here:

Github of UIVeri5:
https://github.com/SAP/ui5-uiveri5

Protractor API (useful for actually writing tests):
http://www.protractortest.org/#/api

Sports One Example:
https://github.wdf.sap.corp/Sports/sports-visualtest

Consent Repository Example:
https://github.wdf.sap.corp/foundation-apps/ConsentManagementDev/blob/master/visual/

## Writing tests
One spec should contain **one end-to-end test scenario**. You should check the **style guide** for how to organize protractor tests here: https://github.com/angular/protractor/blob/master/docs/style-guide.md.

UIVeri5 adds some **additional locators** to the build-in locators in protractor. You can find more information about them here:
https://github.com/SAP/ui5-uiveri5/blob/master/docs/usage/locators.md

## Running the tests
First of all the required node modules have to be installed via `npm install`.

### Credentials in default-env.json
After that you can maintain credentials in the file `default-env.json`, which can be created as a copy of [default-env.json.example](default-env.json.example).

Now the tests can be executed by running `npm test`.

### Passing credentials via the command line
Another alternative is to pass credentials directly from the command line. You can either use your own user or a technical user for this. To use the `uiveri5` command line executable, `uiveri5` needs to be installed globally.

```bash
npm install @ui5/uiveri5 -g
```

```bash
uiveri5 --params.appUser=<<email>> --params.appPassword=<<password>> --params.appURL=<<URL to Launchpad>>
```

**Note: The test spec to execute must be set manually for this approach to work**

## Debugging the tests
If you want to debug the tests, here is the launch configuration for **Visual Studio Code**, which you can add to your `launch.json`. `${workspaceFolder}/tests/end-to-end` should point to this directory.

```js
{
    "type": "node",
    "request": "launch",
    "name": "Run End to End Tests",
    "runtimeExecutable": "npm",
    "runtimeArgs": [
        "run", "debug"
    ],
    "port": 9229,
    "cwd": "${workspaceFolder}/tests/end-to-end"
}
```

More useful information about debugging can be found here: https://github.com/angular/protractor/blob/master/docs/debugging.md

# UIVeri5 E2E integrations tests in Consultant Profile domain

**E2E test scenarios are no longer maintained here. Please refer to [this](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/tree/master/Functional/TestCaseDocument/RM_AllApps_TestCaseDocument) location for all scenarios.**

## E2E Tests are divided in further interations in the domain with
1. Logon
2. Launchpad Page
3. Basic Data
4. Skills
5. Roles
6. Project History
7. Availability


## E2E tests for My Project Experience application
1. ### Logon :
     - Logon with the credentials specified in default.env.json.

2. ### Launchpad Page :
    - After logging in, Launchpad page appears which has a tile 'My Project Experience'.
    - Here an assertion is made for checking the
    presence of the tile and if it is present then clicks on it otherwise expectations aren't met.

3. ### Basic Data :
    - Checks the presence of element which holds the Name of the consultant and value is matched against the value specified in spec file.
    - Same approach is maintained as well for the Job Profile.
    - Checks the presence Organizational Information and Contact Information facets and assertion are made on elements inside these facets - labels and corresponding values.

4. ### Skills :
- READ
    - Navigates to 'Qualification' table.
    - Assertion made on presence of skills table.
    - Checks number of skills the consultant have in the table.
    - Skill values are matched against the values specified in spec file.

- CREATE
    - Navigates to 'Qualification' table.
    - Creates a new skill.
    - Checks for the newly added to skill.
    - Checks no skill assignment.
    - Checks empty skill assignment.
    - Checks random text skill assignment.
    - Checks random text guid skill assignment.
    - Checks random free text having length greater than guid length skill assignment.
    - Checks for duplicate skill assignment.
    - Checks that the restricted skills shouldn't be available for skill assignment.
    - Checks that previously assigned skill, which is restricted later should be shown properly in the profile and it shouldn't be             assignable again.

- UPDATE
    - Navigates to 'Qualification' table.
    - Update the value of existing skill to new.
    - Checks for the updated skill in the table.

- DELETE
    - Navigates to 'Qualification' table.
    - Deletes a skill.
    - Checks for the rest of skills available in the table.

- DISCARD
    - Navigates to 'Qualification' table.
    - Creates a skill and discards it.
    - Checks for skills available except the discarded one in the table.

5. ### Roles :
- READ
    - Navigates to 'Prior Experience' table.
    - Assertion made on presence of Roles table.
    - Checks number of Roles the consultant have in the table.
    - Role values are matched against the values specified in spec file.
    - Checks for restricted role in role assignment table.

- CREATE
    - Navigates to 'Prior Experience' table.
    - Creates a new role.
    - Checks for the newly added to role.
    - Checks no role assignment.
    - Checks empty role assignment.
    - Checks random text role assignment.
    - Checks random text guid role assignment.
    - Checks random free text having length greater than guid length role assignment.
    - Checks for duplicate role assignment.

- UPDATE
    - Navigates to 'Prior Experience' table.
    - Update the value of existing role to new.
    - Checks for the updated role in the table.
    - Checks for restricted role in role value help table.

- DELETE
    - Navigates to 'Prior Experience' table.
    - Deletes a role.
    - Checks for the rest of Roles available in the table.

- DISCARD
    - Navigates to 'Prior Experience' table.
    - Creates a role and discards it.
    - Checks for roles available except the discarded one in the table.

6. ### Project History :
- Internal Work Experience :
    - READ
        - Navigates to 'Internal Work Experience'
        - Checks the number of assignments in the respective table.
        - Clicks on the project and navigates to corresponding object page.
        - Checks the basic data of the page - Assignment Details and  Consultant Information
        - Checks the number of skills present and values as well.
        - Checks the comments.

- External Work Experience :
    - READ
        - Navigates to 'External Work Experience'
        - Checks the number of assignments in the respective table.
        - Clicks on the project and navigates to corresponding object page.
        - Checks the basic data of the page - Assignment Details and  Consultant Information
        - Checks the number of skills present and values as well.
        - Checks the comments.

7. ### Availability :
    - Navigate to Availability section in object page.
    - Checks the column headers whether present or not.
    - Checks the number of rows present.
    - Checking value of the each row present in the availability table.


## E2E tests for Manage Project Role application
1. ### Logon :
    - Logon with the credentials specified in default.env.json.

2. ### Launchpad Page :
    - After logging in, Launchpad page appears which has a tile 'Configure Project Roles'.
    - Here an assertion is made for checking the
    presence of the tile and if it is present then clicks on it otherwise expectations aren't met.

3. ### Create a Project Role using create dialog and discard :
    - Creates a project role with the required fields and then clicks on Cancel button.
    - Checks whether the role is created or not.

4. ### Create a Project Role using create dialog and save :
    - Creates a project role with the required fields and then clicks on Save button.
    - Checks whether the role is created and also it's not in draft mode.

5. ### Navigate to Project role detail page and check rolelifecycle status is set to "Unrestricted" :
    - Navigates to project role details page.
    - Checks whether the label usage and data "Unrestricted" is populated or not.

6. ### Navigate to Project role detail page and check details :
    - Navigates to project role details page.
    - Checks whether all the labels and data is populated or not.

7. ### Navigate to Project role detail page and restrict the role :
    - Navigates to project role details page.
    - Checks whether the Restrict button is not present and role usage is set to Restricted.

8. ### Remove restriction for the role :
    - Navigates to project role details page.
    - Checks whether the role usage is set to Unrestricted and Restrict button is present.

9. ### Validation for a role code to be unique :
    - Creates a project role with the duplicate role code and clicks on Save button.
    - Checks for the role to be in draft mode.

10. ### Validation for a role code to be non empty :
    - Creates a project role with the empty role code and clicks on Save button.
    - Checks for the role to be in draft mode.

11. ### Validation for a role code to not to have empty spaces:
    - Creates a project role with the empty spaces for the role code field and clicks on Save button.
    - Checks for the role to be in draft mode.

12. ### Validation for a role code to not to have special characters:
    - Creates a project role with special characters for the role code field and clicks on Save button.
    - Checks for the role to be in draft mode.

13. ### Validation - Default language code EN is mandatory:
    - Change the default language EN to DE

14. ### Validation: Add additional role name in a different language:
    - Add additional language code for role name.
    - Check the entry is available.

15. ### Validation: Change the language code to non-existing language code :
    - Add the non-existing language code is not allowed.

16. ### Validation: Assign duplicate language code not allowed:
    - Adding duplicate language code is not allowed.

17. ### Deleting the language version from the table :
    - Select the entry and delete
    - Checks text table, the entry should be deleted.

18. ### Validation for a role name to be non empty :
    - Creates a project role with the empty role name and clicks on Save button.
    - Checks for the role to be in draft mode.

19. ### Validation for a role name to not to have empty spaces:
    - Creates a project role with the empty spaces for the role name field and clicks on Save button.
    - Checks for the role to be in draft mode.

20. ### Edit Project Role details and discard :
    - Edits project role details and clicks on Cancel.
    - Checks whether the role details changed or not.

21. ### Edit project role details and save :
    - Edits project role details and clicks on Save.
    - Checks whether the role details changed or not.

22. ### Filtering the roles with Editing Status filter :
    - Sets the filter value to "Own Draft".
    - Checks for the results to be in draft state.

23. ### Filtering the roles with the role name :
    - Sets the name filter value and checks for the result.

24. ### Filtering the roles with the role code :
    - Sets the code filter value and checks for the result.

25. ### Filtering the roles with the role code by selecting code from role code value help :
    - Selects role code from value help and checks the filtered result based on selection.

## E2E tests for Maintain Availability Data application
1. ### Logon :
    - Logon with the credentials specified in default.env.json.

2. ### Launchpad Page :
    - After logging in, Launchpad page appears which has a tile 'Maintain Availability Data'.
    - Here an assertion is made for checking the
    presence of the tile and if it is present then clicks on it otherwise expectations aren't met.

3. ### Check for the Availability data :
    - Checks of column and table title
    - Checks for the correct number of rows and data
    
4. ### Navigate to Availability detail data and check details :
    - Navigates to Availability details page.
    - Checks whether all the labels and data is populated or not.

5. ### Filtering the availability data with the workforcePerson filter :
    - Sets the filter value and checks for the row count and results.

6. ### Filtering the availability data by selecting workforcePerson from Workforce Person value help :
    - Sets the workforcePerson filter value and checks for the result.

7. ### Filtering the availability data with the cost center filter :
    - Sets the filter value and checks for the row count and results.

8. ### Filtering the availability data by selecting cost center from cost center value help :
    - Sets the cost center filter value and checks for the result.

9. ### Navigate to Availability Upload page :
    - Navigates to Availability Upload page.
    - Checks whether the controls are populated.

10.### Validation for input fields.
    - Checks file name is not empty.
    - Checks cost center is not empty.
    - Invalid cost center check.

11. ### Upload valid file and check for the status:
    - Checks for the message strip with correct result.
    - Upload a valid file and check the status 'Complete' in list report and detail page.

12. ### Upload invalid column contents file :
    - Checks for the message strip with correct result.
    - Upload a invalid file and check the status 'Partial' in list report and detail page.

13. ### Check for the availability errors for the invalid column content :
    - Navigate to the details page check for the errors in availability error table.

14. ### Upload file with multiple assignment :
    - Checks for the message strip with correct result.
    - Checks for the status of multiple record in list report and detail page.

15. ### Upload file with missing column content :
    - Checks for the message strip with status error.
    - Checks for error table for correct error data.

16. ### Mandatory missing columns in file:
    - Checks for the message strip with status error.

17. ### Upload file with incorrect costcenter:
    - Checks for the message strip with status error.
    - Checks for the status in the list report and detail page(Failed).
    - Checks for error table for correct error data.

18. ### Navigate to Availability Download page :
    - Navigates to Availability Download page.
    - Checks whether the controls are populated.

19. ### Validation - Input validation on download page:
    - Checks either Cost center / workforce person.
    - Checks for invalid cost center.
    - Checks Time period is entried.

## E2E tests for Authorization
1. ### No authorization for My Project Experience application :
    - Checks tile visbility of My Project Experience application when user does not have ProjectTeamMember role.

2. ### No authorization for Manage Project Role application :
    - Checks tile visbility of Manage Project Role application when user does not have ConfigurationExpert role.

3. ### No authorization for Maintain Availability Data application :
    - Checks tile visbility of Maintain Availability Data application when user does not have ConfigurationExpert role.

4. ### Valid authorizations for My Project Experience application :
    - Logins with ProjectTeamMember role and performs scenarios for My Project Experience application.

5. ### Valid authorization for Manage Project Role application :
    - Logins with ConfigurationExpert role and performs scenarios for Manage Project Role application.

6. ### Valid authorization for Maintain Availability Data application :
    - Logins with ConfigurationExpert role and performs scenarios for Maintain Availability Data application.
