# Total Match Test Cases

## Test Data

### Resources

In order to test total-match, we have considered five resourses as mentioned below:

| ID  | Name       | Roles             | Skills                      |
| --- | ---------- | ----------------- | --------------------------- |
| 1   | Employee 1 | Junior Consultant | ABAP, JAVA, Node.JS         |
| 2   | Employee 2 | JC, SC            | JAVA, GO, Node.JS           |
| 3   | Employee 3 | JC                | ABAP, Python, JAVA, Node.JS |
| 4   | Employee 4 | SC                | JAVA, GO, TypeScript        |
| 5   | Employee 5 |                   | ABAP, C++                   |
| 6   | Employee 6 |                   |                             |

For these resources, availability data is maintained for next 3 months

| ID  | Month 1 | Month 2 | Month 3 |
| --- | ------- | ------- | ------- |
| 1   | 5000    | 5000    | 5000    |
| 2   | 5000    | 5000    | 5000    |
| 3   | 5000    | 5000    | 5000    |
| 4   | 5000    | 5000    | 5000    |
| 5   | 5000    | 5000    | 5000    |

### Resource Request

| ID  | Duration          | Role | Capacity | Skill Requirement   |
| --- | ----------------- | ---- | -------- | ------------------- |
| 1   | Month 1 - Month 3 | JC   | 15000    | ABAP, JAVA, Node.JS |

## Test Cases

> Total Match formula = (Availability Match + Skill Match) / 2

### Test-case 1: Total match - Employee with 100% Match

To execute this scenario, we created `Employee 1`.

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
| Employee 1 | JC   | 100                | 100         | 0           | 100         |

### Test-case 2: Total match - Employee with Multiple Roles

To execute this scenario, we created `Employee 2`.

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
| Employee 2 | JC   | 100                | 66.66       | 0           | 83.33       |
| Employee 2 | SC   | 100                | 66.66       | 0           | 83.33       |

### Test-case 3: Total match - Employee with Partial Match

To execute this scenario, we created `Employee 3`.

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
| Employee 3 | JC   | 100                | 100         | 0           | 100         |

### Test-case 4: Total match - Employee with No Role-match

To execute this scenario, we created `Employee 4`.

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
| Employee 4 | SC   | 100                | 66.66       | 0           | 83.33       |

### Test-case 5: Total match - Employee with No Roles Assigned

To execute this scenario, we created `Employee 5`.

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
| Employee 5 |      | 100                | 33.33       | 0           | 66.66       |

### Test-case 6: Total match - Employee with inactive employment

To execute this scenario, we created `Employee 6`.
> Employee 6 should not come up

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
|            |      |                    |             |             |             |

### Test-case 7: Total match in case of day wise effort distribution - Employee with 100% Match

To test total match in case of day-wise effort distribution, we created a resource request of 3 month duration with requested capacity of 250 H distributed day-wise.
 
#### Resource Request

| ID  | Duration          | Role | Capacity | Skill Requirement   |
| --- | ----------------- | ---- | -------- | ------------------- |
| 1   | Month 1 - Month 3 | JC   | 15000    | ABAP, JAVA, Node.JS |

For this resource request, capacity requirements is maintained for 10 days

| ID  | Resource Request | Start Date  | End Date    | Requested Minutes |
| --- | ---------------- | ----------  | ---------   | ----------------- |
| 1   | 1                | 4/1/2020    | 4/1/2020    | 1500              |
| 2   | 1                | 5/1/2020    | 5/1/2020    | 1500              |
| 3   | 1                | 6/1/2020    | 6/1/2020    | 1500              |
| 4   | 1                | 7/1/2020    | 7/1/2020    | 1500              |
| 5   | 1                | 8/1/2020    | 8/1/2020    | 1500              |
| 6   | 1                | 9/1/2020    | 9/1/2020    | 1500              |
| 7   | 1                | 10/1/2020   | 10/1/2020   | 1500              |
| 8   | 1                | 11/1/2020   | 11/1/2020   | 1500              |
| 9   | 1                | 12/1/2020   | 12/1/2020   | 1500              |
| 10  | 1                | 13/1/2020   | 13/1/2020   | 1500              |

To execute this scenario, we created `Employee 7`.

#### Resource

| ID  | Name       | Roles             | Skills                      |
| --- | ---------- | ----------------- | --------------------------- |
| 1   | Employee 7 | Junior Consultant | ABAP, JAVA, Node.JS         |

For this resource, day-wise availability data is maintained as below

| Start Date  | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
| ----------  | ----------------------- | ---------------- | --------------------------- |
| 4/1/2020    | 1500                    | 0                | 1500                        |
| 5/1/2020    | 1500                    | 0                | 1500                        |
| 6/1/2020    | 1500                    | 0                | 1500                        |
| 7/1/2020    | 1500                    | 0                | 1500                        |
| 8/1/2020    | 1500                    | 0                | 1500                        |
| 9/1/2020    | 1500                    | 0                | 1500                        |
| 10/1/2020   | 1500                    | 0                | 1500                        |
| 11/1/2020   | 1500                    | 0                | 1500                        |
| 12/1/2020   | 1500                    | 0                | 1500                        |
| 13/1/2020   | 1500                    | 0                | 1500                        |

As `Employee 7` is available as requested with the required skills and roles, the total match will be as follows:

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
| Employee 7 | JC   | 100                | 100         | 0           | 100         |

### Test-case 8: Total match in case of week-wise effort distribution - Employee with 100% Match

To test total match in case of week-wise effort distribution, we created a resource request of 2 month duration with requested capacity of 200 H distributed week-wise.
 
**Resource Request**

| ID  | Duration          | Role | Capacity | Skill Requirement   |
| --- | ----------------- | ---- | -------- | ------------------- |
| 1   | 01-Jan-2020 to 29-Feb-2020 | SC   | 12000    | ABAP, JAVA, Node.JS |

**Capacity Requirements data**

| ID  | Resource Request | Start Date  | End Date    | Requested Minutes |
| --- | ---------------- | ----------  | ---------   | ----------------- |
| 1 | 2 | 01-01-2020 | 04-01-2020 | 800  |
| 2 | 2 | 05-01-2020 | 11-01-2020 | 1000 |
| 3 | 2 | 12-01-2020 | 18-01-2020 | 1300 |
| 4 | 2 | 19-01-2020 | 25-01-2020 | 1200 |
| 5 | 2 | 26-01-2020 | 01-02-2020 | 1000 |
| 6 | 2 | 02-02-2020 | 08-02-2020 | 1800 |
| 7 | 2 | 09-02-2020 | 15-02-2020 | 1600 |
| 8 | 2 | 16-02-2020 | 22-02-2020 | 1800 |
| 9 | 2 | 23-02-2020 | 29-02-2020 | 1500 |

To execute this scenario, we created `Employee 8`.

**Resource**

| ID  | Name       | Roles             | Skills                      |
| --- | ---------- | ----------------- | --------------------------- |
| 1   | Employee 8 | Senior Consultant | ABAP, JAVA, Node.JS         |

**Week-wise Resource availability data**

| Start Date           | End Date   | Remaining Available Minutes | Matched Effort |
|----------------------|------------|-----------------------------|----------------|
| 01-01-2020           | 04-01-2020 | 1000                        | 800            |
| 05-01-2020           | 11-01-2020 | 1200                        | 1000           |
| 12-01-2020           | 18-01-2020 | 1300                        | 1300           |
| 19-01-2020           | 25-01-2020 | 1400                        | 1200           |
| 26-01-2020           | 01-02-2020 | 1100                        | 1000           |
| 02-02-2020           | 08-02-2020 | 1800                        | 1800           |
| 09-02-2020           | 15-02-2020 | 1920                        | 1600           |
| 16-02-2020           | 22-02-2020 | 1800                        | 1800           |
| 23-02-2020           | 29-02-2020 | 1560                        | 1500           |
| Total Matched Effort |            |                             | 12000          |

As `Employee 8` is available as requested with the required skills and roles, the total match will be as follows:

| Name       | Role | Availability Match | Skill Match | Utilization | Total Match |
| ---------- | ---- | ------------------ | ----------- | ----------- | ----------- |
| Employee 8 | SC   | 100                | 100         | 0           | 100         |