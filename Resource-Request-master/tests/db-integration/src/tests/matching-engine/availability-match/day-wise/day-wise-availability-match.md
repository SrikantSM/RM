# Day-Wise Availability Match Test Cases

In order to test the Availability match in case of day-wise effort distribution, we are considering a resource request which 
is of one month duration and is distributed day-wise. The demanded efforts are 100 H out of which 49 H are split for a duration of 10 days as shown below. 

## Resource Request

| ID  | Start Date | End Date  | Requested Minutes |
| --- | ---------- | --------- | ----------------- |
| 1   | 1/1/2020   | 31/1/2020 | 2940              |

## Resource Request Capacity

| ID  | Resource Request  | Start Date  | End Date   | Requested Minutes | Assignment |
| --- | ----------------  | ----------  | ---------  | ----------------- | ---------- |
| 1   | 1                 | 4/1/2020    | 4/1/2020   | 480               | 0          |
| 2   | 1                 | 5/1/2020    | 5/1/2020   | 480               | 0          |
| 3   | 1                 | 6/1/2020    | 6/1/2020   | 360               | 0          |
| 4   | 1                 | 7/1/2020    | 7/1/2020   | 240               | 0          |
| 5   | 1                 | 8/1/2020    | 8/1/2020   | 240               | 0          |
| 6   | 1                 | 9/1/2020    | 9/1/2020   | 0                 | 0          |
| 7   | 1                 | 10/1/2020   | 10/1/2020  | 0                 | 0          |
| 8   | 1                 | 11/1/2020   | 11/1/2020  | 480               | 0          |
| 9   | 1                 | 12/1/2020   | 12/1/2020  | 300               | 0          |
| 10  | 1                 | 13/1/2020   | 13/1/2020  | 360               | 0          |

## Scenarios

---

1. ### Resource is available as requested
 
   Consider the below data of a resource (Bran) for this scenario.

    | Start Date  | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ----------  | ----------------------- | ---------------- | --------------------------- |
    | 4/1/2020    | 480                     | 0                | 480                         |
    | 5/1/2020    | 480                     | 0                | 480                         |
    | 6/1/2020    | 360                     | 0                | 360                         |
    | 7/1/2020    | 240                     | 0                | 240                         |
    | 8/1/2020    | 240                     | 0                | 240                         |
    | 9/1/2020    | 0                       | 0                | 0                           |
    | 10/1/2020   | 0                       | 0                | 0                           |
    | 11/1/2020   | 480                     | 0                | 480                         |
    | 12/1/2020   | 300                     | 0                | 300                         |
    | 13/1/2020   | 360                     | 0                | 360                         |

2. ### Resource is partially available as requested

   Consider the below data of a resource (Mandy) for this scenario.

    | Start Date  | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ----------  | ----------------------- | ---------------- | --------------------------- |
    | 4/1/2020    | 240                     | 0                | 240                         |
    | 5/1/2020    | 240                     | 0                | 240                         |
    | 6/1/2020    | 240                     | 0                | 240                         |
    | 7/1/2020    | 240                     | 0                | 240                         |
    | 8/1/2020    | 240                     | 0                | 240                         |
    | 9/1/2020    | 0                       | 0                | 0                           |
    | 10/1/2020   | 0                       | 0                | 0                           |
    | 11/1/2020   | 240                     | 0                | 240                         |
    | 12/1/2020   | 120                     | 0                | 120                         |
    | 13/1/2020   | 180                     | 0                | 180                         |

3. ### Resource is not available as requested

    Consider the below data of a resource (Ryan) for this scenario.

    | Start Date  | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ----------  | ----------------------- | ---------------- | --------------------------- |
    | 4/1/2020    | 500                     | 600              | -100                        |
    | 5/1/2020    | 300                     | 300              |  0                          |
    | 6/1/2020    | 200                     | 200              |  0                          |
    | 7/1/2020    | 600                     | 600              |  0                          |
    | 8/1/2020    | 200                     | 300              | -100                        |
    | 9/1/2020    | 200                     | 200              |  0                          |
    | 10/1/2020   | 300                     | 400              | -100                        |
    | 11/1/2020   | 300                     | 300              |  0                          |
    | 12/1/2020   | 400                     | 400              |  0                          |
    | 13/1/2020   | 400                     | 500              | -100                        |

4. ### Resource has more available minutes than requested

   Consider the below data of a resource (Adam) for this scenario.

    | Start Date  | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ----------  | ----------------------- | ---------------- | --------------------------- |
    | 4/1/2020    | 480                     | 0                | 480                         |
    | 5/1/2020    | 480                     | 0                | 480                         |
    | 6/1/2020    | 480                     | 0                | 480                         |
    | 7/1/2020    | 480                     | 0                | 480                         |
    | 8/1/2020    | 480                     | 0                | 480                         |
    | 9/1/2020    | 0                       | 0                | 0                           |
    | 10/1/2020   | 0                       | 0                | 0                           |
    | 11/1/2020   | 480                     | 0                | 480                         |
    | 12/1/2020   | 480                     | 0                | 480                         |
    | 13/1/2020   | 480                     | 0                | 480                         |

5. ### Resource has zero availability

   Consider the below data of a resource (Joey) for this scenario.

    | Start Date  | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ----------  | ----------------------- | ---------------- | --------------------------- |
    | 4/1/2020    | 0                       | 0                | 0                           |
    | 5/1/2020    | 0                       | 0                | 0                           |
    | 6/1/2020    | 0                       | 0                | 0                           |
    | 7/1/2020    | 0                       | 0                | 0                           |
    | 8/1/2020    | 0                       | 0                | 0                           |
    | 9/1/2020    | 0                       | 0                | 0                           |
    | 10/1/2020   | 0                       | 0                | 0                           |
    | 11/1/2020   | 0                       | 0                | 0                           |
    | 12/1/2020   | 0                       | 0                | 0                           |
    | 13/1/2020   | 0                       | 0                | 0                           |

6. ### Resource has partial availability maintained

   Consider the below data of a resource (Katharina) for this scenario.

    | Start Date  | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
    | ----------  | ----------------------- | ---------------- | --------------------------- |
    | 4/1/2020    | 480                     | 0                | 480                         |
    | 5/1/2020    | 480                     | 0                | 480                         |
    | 6/1/2020    | 360                     | 0                | 360                         |
    | 7/1/2020    | 240                     | 0                | 240                         |
    | 8/1/2020    | 240                     | 0                | 240                         |
    | 9/1/2020    | 0                       | 0                | 0                           |
    | 10/1/2020   | 0                       | 0                | 0                           |

## Availability Match Results

---

For the above resource request and resources, the corresponding day-wise availability match for each resource will be as follows:

| Resource Request | Bran  | Mandy  | Ryan  | Adam  | Joey  | Katharina |
| ---------------- | ----  | -----  | ----  | ----  | ----  | --------- |
| 1                | 100   | 59.18  | 0     | 100   | 0     | 61.22     |

