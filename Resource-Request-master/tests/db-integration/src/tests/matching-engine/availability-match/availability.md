# Availability Test Cases

>Currently, the availability match test cases are divided on the basis of aggregated and day-wise effort distribution.   Please refer to [Day Wise Availability Match](https://github.tools.sap/Cloud4RM/Resource-Request/blob/master/tests/db-integration/src/tests/matching-engine/availability-match/day-wise/day-wise-availability-match.md) for day-wise effort distribution test cases.

In order to test the Availability match, we are considering resource requests which are open and partially assigned with three months of capacity as shown below.

## Resource Request

| ID  | Start Time | End Time  | Requested Minutes |
| --- | ---------- | --------- | ----------------- |
| 1   | 1/1/2019   | 3/31/2019 | 35000             |
| 2   | 1/1/2019   | 3/31/2019 | 30000             |
| 3   | 1/1/2019   | 3/31/2019 | 30000             |
| 4   | 1/1/2019   | 3/31/2019 | 30000             |

## Resource Request Capacity

| ID  | Resource Request | Start Time | End Time  | Requested Minutes | Assignment |
| --- | ---------------- | ---------- | --------- | ----------------- | ---------- |
| 1   | 1                | 1/1/2019   | 1/31/2019 | 15000             | 5000       |
| 2   | 1                | 2/1/2019   | 2/28/2019 | 10000             | 0          |
| 3   | 1                | 3/1/2019   | 3/31/2019 | 10000             | 0          |
| 4   | 2                | 1/1/2019   | 1/31/2019 | 10000             | 0          |
| 5   | 2                | 2/1/2019   | 2/28/2019 | 0                 | 0          |
| 6   | 2                | 3/1/2019   | 3/31/2019 | 10000             | 0          |
| 7   | 3                | 1/1/2019   | 3/31/2019 | 30000             | 0          |
| 8   | 4                | 1/1/2019   | 3/31/2019 | 10000             | 11000      |
| 9   | 4                | 1/1/2019   | 3/31/2019 | 10000             | 11000      |
| 10  | 4                | 1/1/2019   | 3/31/2019 | 10000             | 11000      |

Resource Request with ID 1 and 2 has 3 months of capacity data with different requested minutes as shown above. We have also considered partially assigned scenario for Resource Request with ID 1 as it has been assigned 5000 minutes to January 2019.

## Scenarios

---

1. ### Resource is available as requested

    Consider the below data of a resource (Rand) for this scenario.

    | Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ---------- | ----------------------- | ---------------- | --------------------------- |
    | 1/1/2019   | 5000                    | 0                | 5000                        |
    | 1/2/2019   | 3000                    | 0                | 3000                        |
    | 1/3/2019   | 2000                    | 0                | 2000                        |
    | 2/1/2019   | 6000                    | 0                | 6000                        |
    | 2/2/2019   | 2000                    | 0                | 2000                        |
    | 2/3/2019   | 2000                    | 0                | 2000                        |
    | 3/1/2019   | 3000                    | 0                | 3000                        |
    | 3/2/2019   | 3000                    | 0                | 3000                        |
    | 3/3/2019   | 4000                    | 0                | 4000                        |

2. ### Resource is partially available as requested

   Consider the below data of a resource (Ward) for this scenario.

   | Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
   | ---------- | ----------------------- | ---------------- | --------------------------- |
   | 1/1/2019   | 5000                    | 0                | 5000                        |
   | 1/2/2019   | 0                       | 0                | 0                           |
   | 1/3/2019   | 0                       | 0                | 0                           |
   | 2/1/2019   | 0                       | 0                | 0                           |
   | 2/2/2019   | 2000                    | 0                | 2000                        |
   | 2/3/2019   | 2000                    | 0                | 2000                        |
   | 3/1/2019   | 3000                    | 0                | 3000                        |
   | 3/2/2019   | 0                       | 0                | 0                           |
   | 3/3/2019   | 4000                    | 0                | 4000                        |

3. ### Resource is not available as requested

    Consider the below data of a resource (Joy) for this scenario.

    | Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ---------- | ----------------------- | ---------------- | --------------------------- |
    | 1/1/2019   | 5000                    | 6000             | -1000                       |
    | 1/2/2019   | 3000                    | 3000             | 0                           |
    | 1/3/2019   | 2000                    | 2000             | 0                           |
    | 2/1/2019   | 6000                    | 6000             | 0                           |
    | 2/2/2019   | 2000                    | 3000             | -1000                       |
    | 2/3/2019   | 2000                    | 2000             | 0                           |
    | 3/1/2019   | 3000                    | 4000             | -1000                       |
    | 3/2/2019   | 3000                    | 3000             | 0                           |
    | 3/3/2019   | 4000                    | 4000             | 0                           |

4. ### Resource has more available minutes then requested

   Consider the below data of a resource (Collen) for this scenario.

   | Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
   | ---------- | ----------------------- | ---------------- | --------------------------- |
   | 1/1/2019   | 6000                    | 0                | 6000                        |
   | 1/2/2019   | 3000                    | 0                | 3000                        |
   | 1/3/2019   | 4000                    | 0                | 4000                        |
   | 2/1/2019   | 3000                    | 0                | 3000                        |
   | 2/2/2019   | 7000                    | 0                | 7000                        |
   | 2/3/2019   | 2000                    | 0                | 2000                        |
   | 3/1/2019   | 3000                    | 0                | 3000                        |
   | 3/2/2019   | 8000                    | 0                | 8000                        |
   | 3/3/2019   | 4000                    | 0                | 4000                        |

5. ### Resource has zero availability

   Consider the below data of a resource(Davos) for this scenario.

   | Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
   | ---------- | ----------------------- | ---------------- | --------------------------- |
   | 1/1/2019   | 0                       | 0                | 0                           |
   | 1/2/2019   | 0                       | 0                | 0                           |
   | 1/3/2019   | 0                       | 0                | 0                           |
   | 2/1/2019   | 0                       | 0                | 0                           |
   | 2/2/2019   | 0                       | 0                | 0                           |
   | 2/3/2019   | 0                       | 0                | 0                           |
   | 3/1/2019   | 0                       | 0                | 0                           |
   | 3/2/2019   | 0                       | 0                | 0                           |
   | 3/3/2019   | 0                       | 0                | 0                           |

6. ### Resource has partial availability maintained

   Consider the below data of a resource(Claire) for this scenario.

   | Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
   | ---------- | ----------------------- | ---------------- | --------------------------- |
   | 1/1/2019   | 5000                    | 0                | 5000                        |
   | 1/2/2019   | 3000                    | 0                | 3000                        |
   | 1/3/2019   | 2000                    | 0                | 2000                        |
   | 2/1/2019   | 6000                    | 0                | 6000                        |
   | 2/2/2019   | 2000                    | 0                | 2000                        |
   | 2/3/2019   | 2000                    | 0                | 2000                        |

7. ### Resource has no availability data maintained

   Resource 6 does not have any availability data maintained in Resource Capacity table.

8. ### Resource Request is not distributed across periods

    Resource Request 3 is not distributed accross different months.

9.  ### Resource request is over-assigned

   We have created a Resource Request - 4, that is over-assigned. Data mentioned below:

   | Resource Request ID | Start Date | End Date   | Requested Minutes | Assigned Minutes |
   | ------------------- | ---------- | ---------- | ----------------- | ---------------- |
   | 4                   | 01-01-2019 | 31-01-2019 | 10000             | 11000            |
   | 4                   | 01-01-2019 | 31-01-2019 | 10000             | 11000            |
   | 4                   | 01-01-2019 | 31-01-2019 | 10000             | 11000            |

## Availability Match Results

---
For the above resource requests and resources the availability match for each resources are as follows

| Resource Request | Rand | ward  | Joy | Collen | Davos | Claire |
| ---------------- | ---- | ----- | --- | ------ | ----- | ------ |
| 1                | 100  | 53.33 | 0   | 100    | 0     | 66.66  |
| 2                | 100  | 60    | 0   | 100    | 0     | 50     |
| 3                | 100  | 53.33 | 0   | 100    | 0     | 66.66  |
| 4                | 100  | 100   | 100 | 100    | 100   | 100    |
