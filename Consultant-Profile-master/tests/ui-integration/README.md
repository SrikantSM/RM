# UI Integration Tests

<!-- TOC -->
- [Pipeline Status](#pipeline-status)
- [Test Scope](#test-scope)
    - [Test Environment](#test-environment)
    - [Features](#features)
- [Test Scenarios](#test-scenarios)
    - [Basic Data Journey](#basic-data-journey)
    - [Qualifcations Journey](#qualifications-journey)
    - [Prior Experience Journey](#prior-experience-journey)
    - [Availability Journey](#availability-journey)
    - [Qualifcations Edit Journey](#qualifications-edit-journey)
    - [Prior Experience Edit Journey](#prior-experience-edit-journey)


<!-- /TOC -->

## Pipeline Status

| Pipeline          | Last Run Status | Report |
|-------------------|-----------------|--------|
| Domain Pipeline   | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-UI~Integration~Tests-Run~OPA5~Tests/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-UI~Integration~Tests-Run~OPA5~Tests/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-UI~Integration~Tests-Run~OPA5~Tests/HTML_20Reports/)
| Umbrella Pipeline | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Resource-Management-UI~Integration~Tests~-~Consultant-Profile-Run~OPA5~Tests~-~Consultant-Profile/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Resource-Management-UI~Integration~Tests~-~Consultant-Profile-Run~OPA5~Tests~-~Consultant-Profile/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Resource-Management-UI~Integration~Tests~-~Consultant-Profile-Run~OPA5~Tests~-~Consultant-Profile/) |

## Test Scope

OPA5 tests are used as integrated way to test UI5 application UIs in an automated way. Using SQLite instead of a deployed HANA database, tests can be executed locally during development or in the CI pipeline without deployment to SCP, providing simple regression testing with fast turnaround times for UI applications.

[![UI5 test pyramid](https://ui5.sap.com/docs/topics/loio88758c3b4ad94e9ca6508d106fe66972_LowRes.png)](https://ui5.sap.com/#/topic/7cdee404cac441888539ed7bfe076e57)

For the Consultant-Profile domain, OPA5 tests will include all UI5 applications in the Consultant-Profile project. Currently, these include:

- `myProjectExperienceUi`
- `projectRoleUi`

### Test Environment

All OPA5 tests will be executed locally without deployment to SCP. Both during development and in the CI pipeline, SQLite will be used as a database for the backend service.

### Features

The following features must be tested:

- `myProjectExperienceUi` app
    - view profile basic data
    - view sections such as qualifications, prior experience, availability
    - view subsections such as skills, previous roles, internal work experience, external work experience
    - create skills, previous roles, external work experience assignments
    - edit skills, previous roles, external work experience assignments
    - delete skills, previous roles, external work experience assignments
    - view details of each assignment under internal, external work experience subsections
    - error handling for consistency checks

## Test Scenarios

_Note: Test Scenarios will be mapped onto OPA5 journeys_

### Basic Data Journey

1. View list of consultants
    - Given: App is started
    - When: On looking at the screen
    - Then: See list of consultants
2. Navigate to consultant profile page
    - Given: On consultants list page
    - When: On click of a particular consultant from list
    - Then: Navigates to that particular consultant's profile page
3. View basic data on the profile page
    - Given: On consultant profile page
    - When: On looking at the profile header
    - Then: See baisc data in the header section
4. View sections on the profile page
    - Given: On consultant profile page
    - When: On looking at the profile page
    - Then: See "Qualifications", "Prior Experience" and "Availability" sections
5. Edit mode of profile page
    - Given: On consultant profile page
    - When: On click of edit button
    - Then: See profile page in edit mode
6. Non edit mode of profile page from edit mode
    - Given: On consultant profile page(edit mode)
    - When: On click of cancel, discard buttons
    - Then: See profile page in non edit mode

### Qualifications Journey

1. View skills sub section under qualifications
    - Given: On consultant profile page
    - When: On click of qualifications tab
    - Then: Navigates to skills sub section and see skills table

### Prior Experience Journey

1. View previous roles sub section under prior experience
    - Given: On consultant profile page
    - When: On click of previous roles item under prior experience tab
    - Then: Navigates to previous roles sub section and see roles table
2. View internal work experience sub section under prior experience
    - Given: On consultant profile page
    - When: On click of internal work experience item under prior experience tab
    - Then: Navigates to internal work experience sub section and see assignments table
3. View internal work experience assignment details page
    - Given: On consultant profile page internal work experience sub section
    - When: On click of a particular assignment from the assignments table
    - Then: Navigates to assignment's details page and see assignment basic details
4. View previous/next internal work experience assignment's details from the current assignment
    - Given: On internal work experience assignment details page
    - When: On click of up/down buttons in the header
    - Then: Navigates to previous/next assignment's details page and see the details
5. View skills section in internal work experience assignment details page
    - Given: On internal work experience assignment details page
    - When: On click of skills tab
    - Then: Navigates to skills section and see skills table
6. View comments section in internal work experience assignment details page
    - Given: On internal work experience assignment details page
    - When: On click of comments tab
    - Then: Navigates to comments section and see the text
7. Navigate back to profile page
    - Given: On internal work experience assignment details page
    - When: On click of back button
    - Then: See profile page
8. View external work experience sub section under prior experience
    - Given: On consultant profile page
    - When: On click of external work experience item under prior experience tab
    - Then: Navigates to external work experience sub section and see assignments table
9. View external work experience assignment details page
    - Given: On consultant profile page external work experience sub section
    - When: On click of a particular assignment from the assignments table
    - Then: Navigates to assignment's details page and see assignment basic details
10. View previous/next external work experience assignment's details from the current assignment
    - Given: On external work experience assignment details page
    - When: On click of up/down buttons in the header
    - Then: Navigates to previous/next assignment's details page and see the details
11. View skills section in external work experience assignment details page
    - Given: On external work experience assignment details page
    - When: On click of skills tab
    - Then: Navigates to skills section and see skills table
12. View comments section in external work experience assignment details page
    - Given: On external work experience assignment details page
    - When: On click of comments tab
    - Then: Navigates to comments section and see the text
13. Navigate back to profile page
    - Given: On external work experience assignment details page
    - When: On click of back button
    - Then: See profile page

### Availability Journey

1. View availability section
    - Given: On consultant profile page
    - When: On click of availability tab
    - Then: Navigates to availability section and see next 6 months availability table

### Qualifications edit Journey

1. Delete skill(s) from skills table
-
    Given: On consultant profile page(edit mode)<br/>
    When: On selection of one or more skills from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of delete button on the dialog<br/>
    Then: See those skills removed from the skills table<br/>
2. Cancel deletion of skills
-
    Given: On consultant profile page(edit mode)<br/>
    When: On selection of one or more skills from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of cancel button, save buttons<br/>
    Then: See those skills not removed from the skills table<br/>
3. Create a new skill using value help
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of create button<br/>
    Then: See a new input field in the skills table<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of value help button on new input field<br/>
    Then: See a value help with list of skills<br/>
-
    Given: Value help is seen<br/>
    When: On selection of value from skill value help, on click of ok button<br/>
    Then: See selected value in the input field<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of save button<br/>
    Then: See new skill added in the skills table<br/>
4. Create a new skill by entering as text in the input field
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of create button<br/>
    Then: See a new input field in the skills table<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On entering text in the input field, on click of save<br/>
    Then: See new skill added in the skills table<br/>
5. Edit a skill using value help
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of value help on an existing skill<br/>
    Then: See a value help with list of skills<br/>
-
    Given: Value help is seen<br/>
    When: On selection of value from skill value help, on click of ok button<br/>
    Then: See selected value in the input field<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of save button<br/>
    Then: See that skill updated in the skills table<br/>
6. Edit a skill by entering new text in the input field
    - Given: On consultant profile page(edit mode)
    - When: On clearing, entering new text in the input field of an existing skill, on click of save
    - Then: See that skill updated as new text in the skills table
7. Delete skill(s) from the skills table in the Draft saved state
-
    Given: On consultant profile page(edit mode with Draft saved)<br/>
    When: On selection of one or more skills from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of delete button on the dialog<br/>
    Then: See those skills removed from the skills table<br/>
8. Add duplicate/random/empty skill(consistency check)
    - Given: On consultant profile page(edit mode)
    - When: On adding duplicate/random/empty skill, on click of save
    - Then: See an error message

### Prior Experience edit Journey

1. Delete role(s) from roles table
-
    Given: On consultant profile page(edit mode)<br/>
    When: On selection of one or more roles from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of delete button on the dialog<br/>
    Then: See those roles removed from the roles table<br/>
2. Cancel deletion of roles
-
    Given: On consultant profile page(edit mode)<br/>
    When: On selection of one or more roles from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of cancel, save buttons<br/>
    Then: See those roles not removed from the roles table<br/>
3. Create a new role using value help
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of create button<br/>
    Then: See a new input field in the roles table<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of value help button on new input field<br/>
    Then: See a value help with list of roles<br/>
-
    Given: Value help is seen<br/>
    When: On selection of value from roles value help, on click of ok button<br/>
    Then: See selected value in the input field<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of save button<br/>
    Then: See new role added in the roles table<br/>
4. Create a new role by entering as text in the input field
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of create button<br/>
    Then: See a new input field in the roles table<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On entering text in the input field, on click of save<br/>
    Then: See new role added in the roles table<br/>
5. Edit a role using value help
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of value help on an existing role<br/>
    Then: See a value help with list of roles<br/>
-
    Given: Value help is seen<br/>
    When: On selection of value from role value help, on click of ok button<br/>
    Then: See selected value in the input field<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of save button<br/>
    Then: See that role updated in the roles table<br/>
6. Edit a role by entering new text in the input field
    - Given: On consultant profile page(edit mode)
    - When: On clearing, entering new text in the input field of an existing role, on click of save
    - Then: See that role updated as new text in the roles table
7. Delete roles(s) from the roles table in the Draft saved state
-
    Given: On consultant profile page(edit mode with Draft saved)<br/>
    When: On selection of one or more roles from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of delete button on the dialog<br/>
    Then: See those roles removed from the roles table<br/>
8. Add duplicate/random/empty role(consistency check)
    - Given: On consultant profile page(edit mode)
    - When: On adding duplicate/random/empty role, on click of save
    - Then: See an error message

### External Work Experience edit Journey

1. Create a new assignment under external work experience subsection
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of create button<br/>
    Then: See a new input field in the assignments table<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On entering details in the new input field, on click of save button<br/>
    Then: See new assignment added in the assignments table<br/>
2. Should not create new assignment under external work experience subsection if mandatory feld value not given
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of create button<br/>
    Then: See a new input field in the assignments table<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On entering details in the new input field except one Company Name, on click of save button<br/>
    Then: See the popup with error message table<br/>

3. Should not create new assignment under external work experience subsection if start date is after end date
-
    Given: On consultant profile page(edit mode)<br/>
    When: On click of create button<br/>
    Then: See a new input field in the assignments table<br/>
-
    Given: On consultant profile page(edit mode)<br/>
    When: On entering details in the new input field given start date is after end date, on click of save button<br/>
    Then: See the popup with error message table<br/>

4. Edit an assignment under external work experience subsection and Cancel deletion of skill assigned
    - Given: On consultant profile page(edit mode)
    - When:  an existing assignment, navigate to detail page.
    - Then: See that skill assigned in skill table
      When: On selection of one skill from the list, on click of delete button<br/>
      Then: See delete dialog<br/>
-
      Given: Delete dialog is seen<br/>
      Then: See those assignments not removed from the assignments table<br/

5. Edit an assignment under external work experience subsection and updatation of skill assigned
    - Given: On consultant profile page(edit mode)
    - When:  an existing assignment, navigate to detail page.
    - Then: See that skill assigned in skill table
      When: On changing the skill from list, on click of apply button<br/>
      Then: See navigate to object page, click of save button<br/><br/>
-
      Given: Delete dialog is seen<br/>
      Then: See that skill updated from the assignments table<br/

6. Edit an assignment under external work experience subsection and deletion of skill assigned
    - Given: On consultant profile page(edit mode)
    - When:  an existing assignment, navigate to detail page.
    - Then: See that skill assigned in skill table
      When: On selection of one skill from the list, on click of delete button<br/>
      Then: See delete dialog<br/>
-
      Given: Delete dialog is seen, click on delete button<br/>
      Then: See that skill removed from the assignments table<br/

7. Delete assignment(s) from external work experience subsection
-
    Given: On consultant profile page(edit mode)<br/>
    When: On selection of one or more assignments from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of delete button on the dialog<br/>
    Then: See those assignments removed from the assignments table<br/>

8. Delete assignment(s) from external work experience details page
-
    Given: On consultant profile page(edit mode)<br/>
    When: On selection of one or more assignments from the list, navigate to detail page
    Then: on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of delete button on the dialog<br/>
    Then: See those assignments removed from the assignments table<br/>

9. Cancel deletion of assignments from external work experience subsection
-
    Given: On consultant profile page(edit mode)<br/>
    When: On selection of one or more assignments from the list, on click of delete button<br/>
    Then: See delete dialog<br/>
-
    Given: Delete dialog is seen<br/>
    When: On click of cancel, save buttons<br/>
    Then: See those assignments not removed from the assignments table<br/


### Project Role Main Journey
1. View list of all existing project roles
    - Given: App is started
    - When: I look at the screen
    - Then: I see a table having all existing project roles
    - Then: I see a table with correct number of rows
    - Then: I see a table with three columns ( Name, Code, Description)
    - Then: I see a table with action toolbar containing correct title(Project Roles(count)), Create button
    - Then: I see a list report page with correct title 'Configure Project Roles'
    - Then: I see a list report page with three filter bars - Editing Status, Name, Code
    - Then: I see a list report page with Go button in the header filter section

2. Create a new Project Role
    - Given: I am on Project Role List Report page
    - When: I click on create button from the table action toolbar
    - Then: I see object page title as 'New Role'
    - Then: I see Delete, Save and Cancel buttons on the object page
    - Then: I see section title as 'Role Details'
    - Then: I see createdAt field value as the current time
    - Then: I see modifiedAt field value as the current time
    - Then: I see createdAt and modifiedAt time field value and both have same values
    - Then: I see modifiedBy field value as 'authenticated-user@sap.com'
    

3. Create a new Project Role in Draft mode
    - Given: I am on Project Role Object Page
    - When: I enter value as 'TestRoleName' in Name input box
    - When: I enter value as 'T009' in Code input box
    - When: I enter value as 'TestRoleDescription' in Description input box
    - Then: I see Name input box value as 'TestRoleName'
    - Then: I see Code input box value as 'T009'
    - Then: I see Description input box value as 'TestRoleDescription'
    - When: I navigate back to the List Report Page
    - Then: I see a row in table with Name field value as 'TestRoleName'
    - Then: I see a row in table with Code field value as 'T009'
    - Then: I see a row in table with Description field value as 'TestRoleDescription'
    - Then: I see a row in table is in the Draft mode

4. Edit a Project Role in Draft mode
    - Given: I navigate from Project Role List Report page to Object Page for a row having description as                  'TestRoleDescription'
    - When: I edit value as 'TestRoleName1' in Name input box
    - When: I edit value as 'T008' in Code input box
    - When: I edit value as 'TestRoleDescription1' in Description input box
    - When: I navigate back to the List Report Page
    - Then: I see a row in table with Name field value as 'TestRoleName1'
    - Then: I see a row in table with Code field value as 'T008'
    - Then: I see a row in table with Description field value as 'TestRoleDescription1'

5. Save a Project Role with null value for Role Code
    - Given: I am on Project Role List Report Page and I click on Create button
    - When: I enter value as 'TestRoleName2' in Name input box
    - When: I enter value as 'TestRoleDescription2' in Description input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

6. Save a Project Role with empty spaces for Role Code
    - Given: I am on Project Role Object Page creating a new Project Role with 'TestRoleName2' and 'TestRoleDescription2' values for name and description fields are respectively
    - When: I enter value as '  ' (empty spaces) in Code input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

7. Save a Project Role with empty string for Role Code
    - Given: I am on Project Role Object Page creating a new Project Role with 'TestRoleName2' and 'TestRoleDescription2' values for name and description fields are respectively
    - When: I enter value as '' (empty string) in Code input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

8. Save a Project Role with an already existing Role Code
    - Given: I am on Project Role Object Page creating a new Project Role with 'TestRoleName2' and 'TestRoleDescription2' values for name and description fields are respectively
    - When: I enter value as 'T001' (which is an existing role code) in Code input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

9. Save a Project Role with a Role Code having special characters
    - Given: I am on Project Role Object Page creating a new Project Role with 'TestRoleName2' and 'TestRoleDescription2' values for name and description fields are respectively
    - When: I enter value as 'T%71' in Code input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

10. Save a Project Role with a valid Role Code
    - Given: I am on Project Role Object Page creating a new Project Role with 'TestRoleName2' and 'TestRoleDescription2' values for name and description fields are respectively
    - When: I enter value as 'T009' (which is a valid role code) in Code input box
    - When: I click on Save button on the Object Page
    - Then: I see modifiedAt field value as the current time
    - Then: I see modifiedBy field value as 'authenticated-user@sap.com'
    - When: I navigate back to the List Report Page
    - Then: I see a row in table with Name field value as 'TestRoleName2'
    - Then: I see a row in table with Code field value as 'T009'
    - Then: I see a row in table with Description field value as 'TestRoleDescription2'

11. Filter Project Role by draft status on List Report page
    - Given: I am on Project Role List Report Page
    - When: I click on the 'Editing Status' filter available on the List Report Header page
    - When: I select value as 'Own Draft' from the dropdown list
    - Then: I see a row in table which is in Draft mode having description as 'TestRoleDescription1'

12. Enable edit mode, edit an existing Project Role Name and see if the changes are reflected
     - Given: I navigate from Project Role List Report page to Object Page for a row having code as 'T001'
     - When: I click on Edit button on Object Page
     - When: I edit role name value as 'TestRoleName3'in name input box
     - When: I click on Save button on the Object Page
     - Then: I see modifiedAt field value as the current time
     - Then: I see createdAt and modifiedAt time field value and both have different values
     - Then: I see modifiedBy field value as 'authenticated-user@sap.com'
     - When: I navigate back to the List Report Page
     - Then: I see a row in table with name field value as 'TestRoleName3'

13. Enable edit mode, edit an existing Project Role Description and see if the changes are reflected
     - Given: I navigate from Project Role List Report page to Object Page for a row having code as 'T001'
     - When: I click on Edit button on Object Page
     - When: I edit value as 'TestRoleDescription3'in description input box
     - When: I click on Save button on the Object Page
     - When: I navigate back to the List Report Page
     - Then: I see a row in table with description field value as 'TestRoleDescription3'

14. Enable edit mode, edit an existing Project Role Code and see if the changes are reflected
     - Given: I navigate from Project Role List Report page to Object Page for a row having code as 'T001'
     - When: I click on Edit button on Object Page
     - When: I edit value as 'T009'in Code input box
     - When: I click on Save button on the Object Page
     - When: I navigate back to the List Report Page
     - Then: I see a row in table with Code field value as 'T009'

15. Enable edit mode, edit an existing Project Role Code to empty spaces
     - Given: I navigate from Project Role List Report page to Object Page for a row having code as 'T009'
     - When: I click on Edit button on Object Page
     - When: I enter value as '  ' (empty spaces) in Code input box
     - When: I click on Save button on the Object Page
     - Then: I see an error message dialog on the Object Page
     - Then: I dismiss the error message dialog

16. Enable edit mode, edit an existing Project Role Code to empty string
     - Given: I am in Edit mode on object page
     - When: I enter value as '' (empty string) in Code input box
     - When: I click on Save button on the Object Page
     - Then: I see an error message dialog on the Object Page
     - Then: I dismiss the error message dialog

17. Enable edit mode, edit an existing Project Role Code to an already present existing role code
     - Given: I am in Edit mode on object page
     - When: I enter value as 'T002' in Code input box
     - When: I click on Save button on the Object Page
     - Then: I see an error message dialog on the Object Page
     - Then: I dismiss the error message dialog

18. Enable edit mode, edit an existing Project Role Code to a role code having special characters
     - Given: I am in Edit mode on object page
     - When: I enter value as 'T%71' in Code input box
     - When: I click on Save button on the Object Page
     - Then: I see an error message dialog on the Object Page
     - Then: I dismiss the error message dialog

19. Enable edit mode, edit an existing Project Role Code to and re-enter the same role code
     - Given: I am in Edit mode on object page
     - When: I enter value as 'T009' in Code input box
     - When: I click on Save button on the Object Page
     - When: I navigate back to the List Report Page
     - Then: I see a row in table with Code field value as 'T009'

20. Enable edit mode and cancel the edited changes for that particular Project Role
     - Given: I navigate from Project Role List Report page to Object Page for a row having code as 'T009'
     - When: I click on Edit button on Object Page
     - When: I edit value as 'T001'in Code input box
     - When: I click on Cancel button on the Object Page
     - When: I click on Discard button on the Object Page
     - Then: I see a row in table with Code field value as 'T009'

21. Save a Project Role with null value for Role Name
    - Given: I am on Project Role List Report Page and I click on Create button
    - When: I enter value as 'T111' in code input box
    - When: I enter value as 'TestRoleDescription2' in Description input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

22. Save a Project Role with empty spaces for Role Name
    - Given: I am on Project Role Object Page creating a new Project Role with 'T111' and 'TestRoleDescription2' values for code and description fields are respectively
    - When: I enter value as '  ' (empty spaces) in Name input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

23. Save a Project Role with empty string for Role Name
    - Given: I am on Project Role Object Page creating a new Project Role with 'T111' and 'TestRoleDescription2' values for code and description fields are respectively
    - When: I enter value as '' (empty string) in Name input box
    - When: I click on Save button on the Object Page
    - Then: I see an error message dialog on the Object Page
    - Then: I dismiss the error message dialog

24. Enable edit mode, edit an existing Project Role Name to empty spaces
     - Given: I navigate from Project Role List Report page to Object Page for a row having code as 'T007'
     - When: I click on Edit button on Object Page
     - When: I enter value as '  ' (empty spaces) in Name input box
     - When: I click on Save button on the Object Page
     - Then: I see an error message dialog on the Object Page
     - Then: I dismiss the error message dialog

25. Enable edit mode, edit an existing Project Role Name to empty string
     - Given: I am in Edit mode on object page
     - When: I enter value as '' (empty string) in Name input box
     - When: I click on Save button on the Object Page
     - Then: I see an error message dialog on the Object Page
     - Then: I dismiss the error message dialog
     
26. Filter Project Role by role code by selecting a code from the value help
    - Given: I am on Project Role List Report Page
    - When: I click on the value help available for'Code' filter on the List Report Header page
    - When: I select code as 'T006' from the list of available codes and press Ok
    - When: I click on Go button available in the header
    - Then: I see a single row in table which is which has role code as 'T006'
    - When: I clear the token 'T006' from code filter bar and click on Go button
    - Then: I see entire list of Project Roles in the list report table
    
27. Filter Project Role by role code by typing a valid code in the code filter bar
    - Given: I am on Project Role List Report Page
    - When: I type code as 'T006' in the code filter bar
    - When: I click on Go button available in the header
    - Then: I see a single row in table which is which has role code as 'T006'
    - When: I clear the token 'T006' from code filter bar and click on Go button
    - Then: I see entire list of Project Roles in the list report table
    
28. Filter Project Role by role code by typing an invalid code in the code filter bar
    - Given: I am on Project Role List Report Page
    - When: I type code as 'T60' which is not existing in the code filter bar
    - When: I click on Go button available in the header
    - Then: I see no rows in table
    - When: I clear the token 'T60' from code filter bar and click on Go button
    - Then: I see entire list of Project Roles in the list report table
    
29. Filter Project Role by role name by typing a valid name in the name filter bar
    - Given: I am on Project Role List Report Page
    - When: I type name as 'Junior Consultant1' in the name filter bar
    - When: I click on Go button available in the header
    - Then: I see a single row in table which is which has role name as 'Junior Consultant1'
    - When: I clear the token 'Junior Consultant1' from name filter bar and click on Go button
    - Then: I see entire list of Project Roles in the list report table
    
30. Filter Project Role by role name by typing an invalid name in the name filter bar
    - Given: I am on Project Role List Report Page
    - When: I type code as 'TestName' which is not existing in the name filter bar
    - When: I click on Go button available in the header
    - Then: I see no rows in table
    - When: I clear the token 'TestName' from name filter bar and click on Go button
    - Then: I see entire list of Project Roles in the list report table
