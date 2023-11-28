# API Integration Tests
## Setup Documentation

https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/documentation/AutomatedTests/ApiIntegrationTests.md

## Pipeline Status (API Integration Stage)
| Pipeline          | Last Run Status | Report |
|-------------------|-----------------|--------|
| Domain Pipeline   | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-API~Integration~Tests-Run~Mocha~Tests/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-API~Integration~Tests-Run~Mocha~Tests/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Consultant-Profile~Pipeline-Consultant-Profile-API~Integration~Tests-Run~Mocha~Tests/HTML_20Reports/) |
| Umbrella Pipeline | [![Run Status](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-API~Integration~Tests~-~Consultant-Profile-Run~Mocha~Tests~-~Consultant-Profile/badge/icon?style=plastic&subject=Test%20Run%20Status)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-API~Integration~Tests~-~Consultant-Profile-Run~Mocha~Tests~-~Consultant-Profile/) | [HTML Report](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~-~Umbrella~-~~master~Pipeline-Consultant-Profile-API~Integration~Tests~-~Consultant-Profile-Run~Mocha~Tests~-~Consultant-Profile/HTML_20Reports/) |

<hr />

##### Asumptions

| Symbols            | Represemts               |
| ------------------ | ------------------------ |
| :heavy_check_mark: | Test in execution        |
| :white_circle:     | Test in not execution    |
| :heavy_plus_sign:  | Positiove test scenario  |
| :heavy_minus_sign: | Negative test scenario   |

<hr />

<!-- TOC -->
Service Name/EndPoint
[MyProjectExperienceService/MyProjectExperiecneHeader](#myprojectexperienceservice/myprojectexperiecneheader)

## Test Cases

## MyProjectExperienceService-MyProjectExperiecneHeader

| Test Suite    | Service/Entity  | Scenario                                                                                        | Current Status     | Test Type          |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------| -----------------  |------------------- |
| [MyProjectExperienceHeaderTest](src/tests/myProjectExperienceService/MyProjectExperienceHeaderTest.ts)        | MyProjectExperienceService/ MyProjectExperienceHeader     | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all my project experience.                                                        | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all my project experience with profile details, assigned skills, assigned roles.  | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get one my project experience.                                                                  | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get one my project experience with profile details, assigned skills, assigned roles.            | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Creating a my project experience should not be possible.                                        | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Updating a my project experience.                                                               | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Deleting a my project experience should not be possible.                                        | :heavy_check_mark: | :heavy_minus_sign: |
| [RolesTest](src/tests/myProjectExperienceService/RolesTest.ts)                                                | MyProjectExperienceService/ Roles                         | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all assigned roles of consultants.                                                | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all assigned roles of consultants with role and consultant details.               | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Assigning a role to the consultant.                                                             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Assign a duplicate role to a consultant should not be allowed.                                  | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a no role to a consultant should not be allowed.                                         | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a role having role_ID as whitesSpaces only to a consultant should not be allowed.        | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a blank role to a consultant should not be allowed.                                      | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a non-existing role to a consultant should not be allowed.                               | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign the role of non-guid to a consultant should not be allowed.                              | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a invalid roleID as more than 30 character role to a consultant should not be allowed.   | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Get the previously assigned role to a consultant.                                               | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get the previously assigned role to a consultant with role and consultant details.              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Updating/Changing the assigned role of a consultant is not allowed.                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Unassigning a role to a consultant.                                                             | :heavy_check_mark: | :heavy_plus_sign:  |
| [SkillsTest](src/tests/myProjectExperienceService/SkillsTest.ts)                                              | MyProjectExperienceService/ Skills                        | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all assigned skills of consultants.                                               | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all assigned skills of consultants with skill and consultant details.             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Assigning a skill to a consultant.                                                              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Assign a duplicate skill to a consultant should not be allowed.                                 | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a blank skill to a consultant should not be allowed.                                     | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a non-existing skill to a consultant should not be allowed.                              | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a skill of non-guid to a consultant should not be allowed.                               | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Assign a invalid skillID as more than 30 character skill to a consultant should not be allowed. | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Get the previously assigned skill to a consultant.                                              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get the previously assigned skill to a consultant with skill and consultant details.            | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Updating/Changing the assigned skill of a consultant is not allowed.                            | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Unassigning a skill to a consultant.                                                            | :heavy_check_mark: | :heavy_plus_sign:  |
| [RoleMasterListTest](src/tests/myProjectExperienceService/RoleMasterListTest.ts)                              | MyProjectExperienceService/ RoleMasterList                | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of Master Roles.                                                                     | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a Master Role.                                                                              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get Master Role with correct case (using $filter).                                              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get Master Role with wrong case (using $filter).                                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Get Master Role with correct case (using $search).                                              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get Master Role with wrong case (using $search).                                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Creating a Master Role is not allowed.                                                          | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Updating Master Role is not allowed.                                                            | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Deleting Master Role is not allowed.                                                            | :heavy_check_mark: | :heavy_minus_sign: |
| [SkillMasterListTest](src/tests/myProjectExperienceService/SkillMasterListTest.ts)                            | MyProjectExperienceService/ SkillMasterList               | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of Master Skills.                                                                    | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a Master Skill.                                                                             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get Master Skill with correct case (using $filter).                                             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get Master Skill with wrong case (using $filter).                                               | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Get Master Skill with correct case (using $search).                                             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get Master Skill with wrong case (using $search).                                               | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Creating Master Skill is not allowed.                                                           | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Updating Master Skill is not allowed.                                                           | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Deleting Master Skill is not allowed.                                                           | :heavy_check_mark: | :heavy_minus_sign: |
| [ProfileDataTest](src/tests/myProjectExperienceService/ProfileDataTest.ts)                                    | MyProjectExperienceService/ ProfileData                   | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all consultant's profile.                                                         | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all consultant's profile with manager details.                                    | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Get one consultant profile.                                                                     | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get one consultant's profile with manager details.                                              | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Creating a consultant's profile is not allowed.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Updating the consultant's profile is not allowed.                                               | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Deleting the consultant profile is not allowed.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
| [InternalWorkExperienceTest](src/tests/myProjectExperienceService/InternalWorkExperienceTest.ts)              | MyProjectExperienceService/ InternalWorkExperience        | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all internal work experiences.                                                    | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all internal work experience with skill and consultant details.                   | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get one internal work experience.                                                               | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get one internal work experience with skill and consultant details.                             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Updating the entire internal work experience detail.                                            | :white_circle:     | :heavy_minus_sign: |
|               |                 | Updating only comments in a internal work experience.                                           | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Creating a internal work experience.                                                            | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Deleting a internal work experience should not be allowed.                                      | :white_circle:     | :heavy_minus_sign: |
| [InternalWorkExperienceSkillsTest](src/tests/myProjectExperienceService/InternalWorkExperienceSkillsTest.ts)  | MyProjectExperienceService/ InternalWorkExperienceSkills  | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of skills used in internal work experience.                                                  | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of skills used in internal work experience with internal work experience and skill details.  | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Get a skill used in the internal work experience.                                                       | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a skill used in internal work experience with internal work experience and skill details.           | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Assigning a skill to a internal work experience is not allowed.                                         | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Changing a skill to a internal work experience is not allowed.                                          | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Unassigning a skill to a internal work experience is not allowed.                                       | :heavy_check_mark: | :heavy_plus_sign:  |
| [ExternalWorkExperienceTest](src/tests/myProjectExperienceService/ExternalWorkExperienceTest.ts)              | MyProjectExperienceService/ ExternalWorkExperience        | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all external work experiences.                                                    | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of all external work experience with skill and consultant details.                   | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get one external work experience.                                                               | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get one external work experience with skill and consultant details.                             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Creating a external work experience.                                                            | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Updating the external work experience detail.                                                   | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Deleting a external work experience.                                                            | :heavy_check_mark: | :heavy_plus_sign:  |
| [ExternalWorkExperienceSkillsTest](src/tests/myProjectExperienceService/ExternalWorkExperienceSkillsTest.ts)  | MyProjectExperienceService/ ExternalWorkExperienceSkills  | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of skills used in external work experience.                                                  | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of skills used in external work experience with external work experience and skill details.  | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Get a skill used in the external work experience.                                                       | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a skill used in external work experience with external work experience and skill details.           | :white_circle:     | :heavy_plus_sign:  |
|               |                 | Assigning a skill to a external work experience is allowed.                                             | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Changing a skill to a external work experience is allowed.                                              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Unassigning a skill to a external work experience is allowed.                                           | :heavy_check_mark: | :heavy_plus_sign:  |
| [PeriodicAvailabilityTest](src/tests/myProjectExperienceService/PeriodicAvailabilityTest.ts)                  | MyProjectExperienceService/ PeriodicAvailability          | My Project Experience service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of PeriodicAvailability.                                                             | :heavy_check_mark:     | :heavy_plus_sign:  |
|               |                 | Get a list of PeriodicAvailability without authorization.                                       |   :heavy_check_mark:     | :heavy_plus_sign:  |
|               |                 | Get PeriodicAvailability of one consultant for the current month where monthly utilization is 50%. |:heavy_check_mark:     | :heavy_plus_sign:  |
|               |                 | Get PeriodicAvailability of one consultant for one month from now where monthly utilization is 75%.| :heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Get PeriodicAvailability of one consultant for the two months from now where monthly utilization is 80%. | :heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Get PeriodicAvailability of one consultant for three months from now where monthly utilization is 115%. |:heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Get PeriodicAvailability of one consultant for four months from now where monthly utilization is 130%. |:heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Get PeriodicAvailability of one consultant for five months from now where monthly utilization is 0%.|:heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Get a PeriodicAvailability of one consultant without authorization.                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Creating a PeriodicAvailability is not allowed.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Updating PeriodicAvailability is not allowed.                                                   | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Deleting PeriodicAvailability is not allowed.                                                   | :heavy_check_mark: | :heavy_minus_sign: |
| [UtilizationTest](src/tests/myProjectExperienceService/UtilizationTest.ts) | MyProjectExperienceService/Utilization | My Project Experience service availability check.                                          | :heavy_check_mark: | :heavy_plus_sign:  |
|                                                                            |                                        | Get a list of Utilization.                                                                 | :heavy_check_mark: | :heavy_plus_sign:  |
|                                                                            |                                        | Get a list of Utilization without authorization.                                           | :heavy_check_mark: | :heavy_minus_sign: |
|                                                                            |                                        | Get Utilization of first consultant for the current year where yearly utilization is 50%.  | :heavy_check_mark: | :heavy_plus_sign:  |
|                                                                            |                                        | Get Utilization of second consultant for the current year where yearly utilization is 75%. | :heavy_check_mark: | :heavy_plus_sign:  |
|                                                                            |                                        | Get Utilization of third consultant for the current year where yearly utilization is 80%.  | :heavy_check_mark: | :heavy_plus_sign:  |
|                                                                            |                                        | Get a Utilization of one consultant without authorization.                                 | :heavy_check_mark: | :heavy_minus_sign: |
|                                                                            |                                        | Creating a Utilization is not allowed.                                                     | :heavy_check_mark: | :heavy_minus_sign: |
|                                                                            |                                        | Updating Utilization is not allowed.                                                       | :heavy_check_mark: | :heavy_minus_sign: |
|                                                                            |                                        | Deleting Utilization is not allowed.                                                       | :heavy_check_mark: | :heavy_minus_sign: |
| [ProjectRoleServiceRolesTest](src/tests/ProjectRoleService/ProjectRoleServiceRolesTest.ts)                    | ProjectRoleService/ Roles                                 |     ProjectRole service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of existing roles.                                                                 | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Create new role.                                                                              | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Create new role without authorization.                                                                              | :heavy_check_mark: | :heavy_minus_sign:  |
|               |                 | Create duplicate role with the same ID.                                                       | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create duplicate role with the same Role Code.                                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (longer than defined length) code.                                   | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (empty string) code.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (string with only spaces) code.                                      | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role without code.                                                                     | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (string having special characters) code.                            | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (longer than defined length) name.                                   | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (empty string) name.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (string with only spaces) name.                                      | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role without name.                                                                     | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role with invalid (longer than defined length) description.                            | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Read a single role.                                                                           | :heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Read a single role without authorization.                                                                              | :heavy_check_mark: | :heavy_minus_sign:  |
|               |                 | Search role based on name (using $filter and in defined case).                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role based on name (using $filter and in differrent case).                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role based on name (using $search and in defined case).                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role based on name (using $search and in differrent case).                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role based on code (using $filter and in defined case).                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role based on code (using $filter and in differrent case).                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role based on code (using $search and in defined case).                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role based on code (using $search and in differrent case).                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Read non-existent role.                                                                       | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Create role without code.                                                                     | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Update a role code.                                                                           | :heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Update a role code without authorization.                                                                              | :heavy_check_mark: | :heavy_minus_sign:  |
|               |                 | Update a role with duplicate code.                                                            | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Update a role with invalid (empty string) code.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Update a role with invalid (string with only spaces) code.                                      | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Update a role name.                                                                           | :heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Update a role name without authorization.                                                                              | :heavy_check_mark: | :heavy_minus_sign:  |
|               |                 | Update a role with invalid (empty string) name.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Update a role with invalid (string with only spaces) name.                                      | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Update a role description.                                                                    | :heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Update a role description without authorization.                                                                              | :heavy_check_mark: | :heavy_minus_sign:  |
| [ProjectRoleServiceRoleCodesTest](src/tests/ProjectRoleService/ProjectRoleServiceRoleCodesTest.ts)                    | ProjectRoleService/ RoleCodes                                 |     ProjectRole service availability check. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Get a list of existing role codes.                                                                 | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Read a single role code.                                                                           | :heavy_check_mark: | :heavy_plus_sign: |
|               |                 | Read a single role code without authorization.                                                                              | :heavy_check_mark: | :heavy_minus_sign:  |
|               |                 | Search role code based on code (using $filter and in defined case).                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role code based on code (using $filter and in differrent case).                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role code based on code (using $search and in defined case).                                | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Search role code based on code (using $search and in differrent case).                             | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Read non-existent role code.                                                                       | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Creating a role code is not allowed.                                                                              | :heavy_check_mark: | :heavy_minus_sign:  |
|               |                 | Updating a role code is not allowed.                                                            | :heavy_check_mark: | :heavy_minus_sign: |
|               |                 | Deleting a role code is not allowed.                                                 | :heavy_check_mark: | :heavy_minus_sign: |
| [HealthCheckService endpoint test](src/tests/HealthCheckService/HealthCheckTest.ts)                    | HealthCheckService                                 |     Service Endpoint Testing. | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Testing the endpoint with authorized user.                                                                 | :heavy_check_mark: | :heavy_plus_sign:  |
|               |                 | Testing the endpoint with unauthorized user.                                                                           | :heavy_check_mark: | :heavy_plus_sign: |
